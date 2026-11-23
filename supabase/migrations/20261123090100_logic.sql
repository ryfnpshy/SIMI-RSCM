-- ============================================================================
-- SIMI-RSCM :: 02 logika bisnis & API RPC
-- Semua penulisan data lewat fungsi di bawah supaya aturan bisnis
-- (stok, status, tahap batch, selisih penerimaan) tidak bisa dilewati.
-- Pemetaan ke laporan: UC-03..UC-10 + modul 4.3.1..4.3.12
-- ============================================================================

-- ---------------------------------------------------------- stok & status
-- ponytail: update-lalu-insert, bukan upsert. INSERT ... ON CONFLICT tetap
-- mengevaluasi CHECK pada tuple yang diajukan, jadi delta negatif selalu
-- ditolak walau jalur UPDATE yang akhirnya dipakai.
create or replace function public.ubah_stok(p_alat uuid, p_unit uuid, p_delta integer)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_jumlah integer;
begin
  select jumlah into v_jumlah
    from public.stok_unit
   where alat_id = p_alat and unit_id = p_unit
   for update;

  if v_jumlah is null then
    if p_delta < 0 then
      raise exception 'STOK_TIDAK_CUKUP|belum ada stok tercatat untuk alat ini di lokasi asal'
        using errcode = 'P0001';
    end if;
    insert into public.stok_unit (alat_id, unit_id, jumlah)
    values (p_alat, p_unit, p_delta);
    return;
  end if;

  if v_jumlah + p_delta < 0 then
    raise exception 'STOK_TIDAK_CUKUP|stok tersedia %, diminta %', v_jumlah, -p_delta
      using errcode = 'P0001';
  end if;

  update public.stok_unit
     set jumlah = v_jumlah + p_delta, updated_at = now()
   where alat_id = p_alat and unit_id = p_unit;
end $$;

-- Satu-satunya jalur perubahan status. Bila status tidak berubah, tidak
-- menulis riwayat (mencegah duplikasi pencatatan yang sama dua kali).
create or replace function public.catat_status(
  p_alat       uuid,
  p_unit       uuid,
  p_status     text,
  p_keterangan text default null,
  p_sumber     text default 'manual',
  p_transaksi  uuid default null,
  p_oleh       uuid default null
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_lama text;
begin
  select status into v_lama
    from public.stok_unit
   where alat_id = p_alat and unit_id = p_unit;

  if v_lama is not distinct from p_status then
    return;
  end if;

  insert into public.riwayat_status
    (alat_id, unit_id, status_baru, keterangan, sumber, transaksi_id, dicatat_oleh)
  values
    (p_alat, p_unit, p_status, p_keterangan, p_sumber, p_transaksi,
     coalesce(p_oleh, auth.uid()));
end $$;

-- ------------------------------------------------ trigger riwayat status
create or replace function public.trg_riwayat_status_before()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_aktual text;
  v_lama   text;
begin
  select status into v_aktual
    from public.stok_unit
   where alat_id = new.alat_id and unit_id = new.unit_id
   for update;

  v_lama := coalesce(v_aktual, 'tersedia');
  new.status_lama := v_aktual;

  if new.status_baru = v_lama then
    raise exception 'STATUS_SAMA|status alat sudah %', v_lama using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from public.transisi_status
     where dari = v_lama and ke = new.status_baru
  ) then
    raise exception 'TRANSISI_TIDAK_SAH|% tidak dapat langsung menjadi %',
      v_lama, new.status_baru using errcode = 'P0001';
  end if;

  if new.status_baru in ('rusak', 'dalam_perbaikan')
     and coalesce(btrim(new.keterangan), '') = '' then
    raise exception 'KETERANGAN_WAJIB|status % wajib disertai keterangan',
      new.status_baru using errcode = 'P0001';
  end if;

  new.dicatat_oleh := coalesce(new.dicatat_oleh, auth.uid());
  return new;
end $$;

create or replace function public.trg_riwayat_status_after()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_ada boolean;
begin
  select true into v_ada
    from public.stok_unit
   where alat_id = new.alat_id and unit_id = new.unit_id;

  if v_ada then
    update public.stok_unit
       set status = new.status_baru, updated_at = now()
     where alat_id = new.alat_id and unit_id = new.unit_id;
  else
    insert into public.stok_unit (alat_id, unit_id, jumlah, status)
    values (new.alat_id, new.unit_id, 0, new.status_baru);
  end if;
  return new;
end $$;

drop trigger if exists trg_riwayat_status_before_ins on public.riwayat_status;
create trigger trg_riwayat_status_before_ins
  before insert on public.riwayat_status
  for each row execute function public.trg_riwayat_status_before();

drop trigger if exists trg_riwayat_status_after_ins on public.riwayat_status;
create trigger trg_riwayat_status_after_ins
  after insert on public.riwayat_status
  for each row execute function public.trg_riwayat_status_after();

-- ------------------------------------------------------ transaksi masuk
create or replace function public.trg_masuk_before()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(btrim(new.nomor), '') = '' then
    new.nomor := 'TM-' || to_char(coalesce(new.tanggal, current_date), 'YYYY') || '-' ||
                 lpad(nextval('public.transaksi_masuk_nomor_seq')::text, 4, '0');
  end if;

  if not exists (select 1 from public.alat where id = new.alat_id and aktif) then
    raise exception 'ALAT_TIDAK_AKTIF|alat tidak ditemukan atau sudah nonaktif'
      using errcode = 'P0001';
  end if;

  new.dicatat_oleh := coalesce(new.dicatat_oleh, auth.uid());
  return new;
end $$;

create or replace function public.trg_masuk_after()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_tipe text;
begin
  select tipe into v_tipe from public.units where id = new.unit_tujuan_id;

  perform public.ubah_stok(new.alat_id, new.unit_tujuan_id, new.jumlah);
  perform public.catat_status(
    new.alat_id,
    new.unit_tujuan_id,
    case when v_tipe = 'unit_medis' then 'di_unit' else 'tersedia' end,
    format('Penerimaan %s dari %s', new.nomor, new.sumber),
    'transaksi',
    new.id,
    new.dicatat_oleh
  );
  return new;
end $$;

drop trigger if exists trg_masuk_before_ins on public.transaksi_masuk;
create trigger trg_masuk_before_ins
  before insert on public.transaksi_masuk
  for each row execute function public.trg_masuk_before();

drop trigger if exists trg_masuk_after_ins on public.transaksi_masuk;
create trigger trg_masuk_after_ins
  after insert on public.transaksi_masuk
  for each row execute function public.trg_masuk_after();

-- ----------------------------------------------------- transaksi keluar
create or replace function public.trg_keluar_before()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_stok integer;
  v_tipe text;
begin
  if coalesce(btrim(new.nomor), '') = '' then
    new.nomor := 'TK-' || to_char(coalesce(new.tanggal, current_date), 'YYYY') || '-' ||
                 lpad(nextval('public.transaksi_keluar_nomor_seq')::text, 4, '0');
  end if;

  if not exists (select 1 from public.alat where id = new.alat_id and aktif) then
    raise exception 'ALAT_TIDAK_AKTIF|alat tidak ditemukan atau sudah nonaktif'
      using errcode = 'P0001';
  end if;

  select tipe into v_tipe from public.units where id = new.unit_tujuan_id;
  if v_tipe is null then
    raise exception 'UNIT_WAJIB|unit tujuan tidak dikenal' using errcode = 'P0001';
  end if;

  -- S-3: alat tidak dapat didistribusikan
  if exists (
    select 1 from public.stok_unit
     where alat_id = new.alat_id and unit_id = new.unit_asal_id
       and status in ('rusak', 'dalam_perbaikan',
                      'dalam_proses_sterilisasi', 'perlu_resterilisasi')
  ) then
    raise exception 'ALAT_TIDAK_DAPAT_DIDISTRIBUSIKAN|status alat saat ini tidak memungkinkan distribusi'
      using errcode = 'P0001';
  end if;

  select coalesce(jumlah, 0) into v_stok
    from public.stok_unit
   where alat_id = new.alat_id and unit_id = new.unit_asal_id;

  -- S-2: stok tidak mencukupi
  if coalesce(v_stok, 0) < new.jumlah then
    raise exception 'STOK_TIDAK_CUKUP|stok gudang tersedia %, diminta %',
      coalesce(v_stok, 0), new.jumlah using errcode = 'P0001';
  end if;

  new.dicatat_oleh := coalesce(new.dicatat_oleh, auth.uid());
  return new;
end $$;

create or replace function public.trg_keluar_after()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_tipe text;
begin
  select tipe into v_tipe from public.units where id = new.unit_tujuan_id;

  perform public.ubah_stok(new.alat_id, new.unit_asal_id, -new.jumlah);
  perform public.ubah_stok(new.alat_id, new.unit_tujuan_id, new.jumlah);
  perform public.catat_status(
    new.alat_id,
    new.unit_tujuan_id,
    case when v_tipe = 'unit_medis' then 'di_unit' else 'tersedia' end,
    format('Distribusi %s menunggu konfirmasi penerimaan', new.nomor),
    'transaksi',
    new.id,
    new.dicatat_oleh
  );
  return new;
end $$;

drop trigger if exists trg_keluar_before_ins on public.transaksi_keluar;
create trigger trg_keluar_before_ins
  before insert on public.transaksi_keluar
  for each row execute function public.trg_keluar_before();

drop trigger if exists trg_keluar_after_ins on public.transaksi_keluar;
create trigger trg_keluar_after_ins
  after insert on public.transaksi_keluar
  for each row execute function public.trg_keluar_after();

-- ------------------------------------------------- konfirmasi penerimaan
create or replace function public.trg_konfirmasi_before()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v public.transaksi_keluar;
begin
  select * into v from public.transaksi_keluar
   where id = new.transaksi_keluar_id
   for update;

  if not found then
    raise exception 'TRANSAKSI_TIDAK_ADA|transaksi distribusi tidak ditemukan'
      using errcode = 'P0001';
  end if;

  if v.status <> 'menunggu_konfirmasi' then
    raise exception 'SUDAH_DIKONFIRMASI|transaksi sudah berstatus %', v.status
      using errcode = 'P0001';
  end if;

  -- S-4: data konfirmasi tidak valid
  if new.jumlah_diterima is null or new.jumlah_diterima <= 0 then
    raise exception 'JUMLAH_TIDAK_VALID|jumlah diterima harus lebih dari nol'
      using errcode = 'P0001';
  end if;

  if new.jumlah_diterima > v.jumlah then
    raise exception 'JUMLAH_MELEBIHI|jumlah diterima % melebihi jumlah dikirim %',
      new.jumlah_diterima, v.jumlah using errcode = 'P0001';
  end if;

  if new.kondisi = 'rusak' and coalesce(btrim(new.keterangan), '') = '' then
    raise exception 'KETERANGAN_WAJIB|kondisi rusak wajib disertai keterangan'
      using errcode = 'P0001';
  end if;

  new.jumlah_dikirim := v.jumlah;
  new.jumlah_selisih := v.jumlah - new.jumlah_diterima;
  new.dikonfirmasi_oleh := coalesce(new.dikonfirmasi_oleh, auth.uid());
  return new;
end $$;

create or replace function public.trg_konfirmasi_after()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v public.transaksi_keluar;
begin
  select * into v from public.transaksi_keluar where id = new.transaksi_keluar_id;

  -- S-3: selisih jumlah diterima -> kembalikan kekurangan ke unit asal
  if new.jumlah_selisih > 0 then
    perform public.ubah_stok(v.alat_id, v.unit_tujuan_id, -new.jumlah_selisih);
    perform public.ubah_stok(v.alat_id, v.unit_asal_id, new.jumlah_selisih);
  end if;

  update public.transaksi_keluar
     set status = case when new.jumlah_selisih = 0
                       then 'diterima' else 'perlu_tindak_lanjut' end
   where id = new.transaksi_keluar_id;

  if new.kondisi = 'rusak' then
    perform public.catat_status(
      v.alat_id,
      v.unit_tujuan_id,
      'rusak',
      coalesce(new.keterangan, 'Dilaporkan rusak saat konfirmasi penerimaan'),
      'transaksi',
      v.id,
      new.dikonfirmasi_oleh
    );
  end if;

  return new;
end $$;

drop trigger if exists trg_konfirmasi_before_ins on public.konfirmasi_penerimaan;
create trigger trg_konfirmasi_before_ins
  before insert on public.konfirmasi_penerimaan
  for each row execute function public.trg_konfirmasi_before();

drop trigger if exists trg_konfirmasi_after_ins on public.konfirmasi_penerimaan;
create trigger trg_konfirmasi_after_ins
  after insert on public.konfirmasi_penerimaan
  for each row execute function public.trg_konfirmasi_after();

-- ------------------------------------------------------- batch sterilisasi
create or replace function public.trg_batch_before()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_lama integer;
  v_baru integer;
begin
  if tg_op = 'INSERT' then
    if new.tahap <> 'penerimaan_kotor' then
      raise exception 'TAHAP_AWAL|batch baru harus dimulai dari penerimaan_kotor'
        using errcode = 'P0001';
    end if;
    if coalesce(btrim(new.nomor), '') = '' then
      new.nomor := 'BATCH-' || to_char(now(), 'YYYY') || '-' ||
                   lpad(nextval('public.batch_nomor_seq')::text, 4, '0');
    end if;
    new.dibuat_oleh := coalesce(new.dibuat_oleh, auth.uid());
    return new;
  end if;

  if new.tahap is distinct from old.tahap then
    if new.tahap = 'gagal' then
      if new.hasil_verifikasi is distinct from 'gagal' then
        raise exception 'VERIFIKASI_WAJIB|batch hanya ditandai gagal melalui verifikasi mutu'
          using errcode = 'P0001';
      end if;
    elsif old.tahap = 'gagal' then
      if new.tahap <> 'pencucian' then
        raise exception 'ALUR_BATCH|batch gagal harus diulang dari tahap pencucian'
          using errcode = 'P0001';
      end if;
    elsif new.tahap = 'terdistribusi' then
      if new.hasil_verifikasi is distinct from 'lulus' then
        raise exception 'BATCH_BELUM_LULUS|batch belum lulus verifikasi mutu'
          using errcode = 'P0001';
      end if;
      if old.tahap <> 'penyimpanan' then
        raise exception 'ALUR_BATCH|distribusi hanya setelah tahap penyimpanan'
          using errcode = 'P0001';
      end if;
    else
      v_lama := public.tahap_urutan(old.tahap);
      v_baru := public.tahap_urutan(new.tahap);
      if v_lama is null or v_baru is null or v_baru <> v_lama + 1 then
        raise exception 'ALUR_BATCH|tahap % tidak boleh langsung ke %', old.tahap, new.tahap
          using errcode = 'P0001';
      end if;
    end if;

    if new.tahap in ('penyimpanan', 'terdistribusi') then
      new.selesai_at := coalesce(new.selesai_at, now());
    end if;
  end if;

  return new;
end $$;

create or replace function public.trg_batch_after()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_cssd uuid;
  v_item record;
begin
  if tg_op <> 'UPDATE' or new.tahap is not distinct from old.tahap then
    return new;
  end if;

  select id into v_cssd from public.units
   where tipe = 'cssd' and aktif order by kode limit 1;

  if new.tahap = 'sterilisasi' then
    -- satu siklus per alat dalam batch (dasar limit siklus/maintenance)
    update public.alat a
       set jumlah_siklus = a.jumlah_siklus + 1
     where a.id in (
       select distinct l.alat_id from public.sterilisasi_log l
        where l.batch_id = new.id and l.alat_id is not null
     );

  elsif new.tahap = 'penyimpanan' then
    if v_cssd is null then
      raise exception 'UNIT_CSSD_TIDAK_ADA|unit CSSD belum terdaftar' using errcode = 'P0001';
    end if;
    for v_item in
      select distinct l.alat_id from public.sterilisasi_log l
       where l.batch_id = new.id and l.alat_id is not null
    loop
      perform public.ubah_stok(v_item.alat_id, v_cssd, 0);
      update public.stok_unit
         set tanggal_kedaluwarsa = current_date +
               (select masa_simpan_hari from public.alat where id = v_item.alat_id)
       where alat_id = v_item.alat_id and unit_id = v_cssd;

      perform public.catat_status(
        v_item.alat_id, v_cssd, 'tersedia',
        format('Batch %s lulus sterilisasi', new.nomor),
        'sterilisasi', null, null);
    end loop;

  elsif new.tahap = 'gagal' then
    if v_cssd is null then
      raise exception 'UNIT_CSSD_TIDAK_ADA|unit CSSD belum terdaftar' using errcode = 'P0001';
    end if;
    for v_item in
      select distinct l.alat_id from public.sterilisasi_log l
       where l.batch_id = new.id and l.alat_id is not null
    loop
      perform public.catat_status(
        v_item.alat_id, v_cssd, 'perlu_resterilisasi',
        format('Batch %s tidak lulus uji mutu: %s', new.nomor, coalesce(new.catatan, '-')),
        'sterilisasi', null, null);
    end loop;
  end if;

  return new;
end $$;

drop trigger if exists trg_batch_before_upd on public.batch_sterilisasi;
create trigger trg_batch_before_upd
  before insert or update on public.batch_sterilisasi
  for each row execute function public.trg_batch_before();

drop trigger if exists trg_batch_after_upd on public.batch_sterilisasi;
create trigger trg_batch_after_upd
  after update on public.batch_sterilisasi
  for each row execute function public.trg_batch_after();

create or replace function public.trg_log_after()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_batch public.batch_sterilisasi;
  v_cssd  uuid;
begin
  select * into v_batch from public.batch_sterilisasi where id = new.batch_id;

  if v_batch.tahap <> new.tahap then
    raise exception 'TAHAP_LOG|log tahap % tidak sesuai tahap batch %', new.tahap, v_batch.tahap
      using errcode = 'P0001';
  end if;

  if new.tahap = 'penerimaan_kotor' and new.alat_id is not null then
    select id into v_cssd from public.units
     where tipe = 'cssd' and aktif order by kode limit 1;
    if v_cssd is not null then
      perform public.ubah_stok(new.alat_id, v_cssd, 0);
      perform public.catat_status(
        new.alat_id, v_cssd, 'dalam_proses_sterilisasi',
        format('Masuk batch %s', v_batch.nomor),
        'sterilisasi', null, new.petugas_id);
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_log_after_ins on public.sterilisasi_log;
create trigger trg_log_after_ins
  after insert on public.sterilisasi_log
  for each row execute function public.trg_log_after();

-- --------------------------------------------------------- penjaga pengguna
create or replace function public.trg_users_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role_id is distinct from old.role_id
       or new.status is distinct from old.status
       or new.unit_id is distinct from old.unit_id
       or new.email  is distinct from old.email then
      raise exception 'AKSES_DITOLAK|peran, status, unit, dan email hanya boleh diubah Admin Inventori'
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_users_guard_upd on public.users;
create trigger trg_users_guard_upd
  before update on public.users
  for each row execute function public.trg_users_guard();

-- ------------------------------------------------------- pendaftaran akun
-- Modul 4.3.1: registrasi -> status menunggu_aktivasi -> aktivasi via email.
-- Pengguna pertama otomatis Admin Inventori aktif (bootstrap).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role   text := coalesce(nullif(new.raw_user_meta_data ->> 'role_id', ''), 'petugas_inventori');
  v_status text;
begin
  if not exists (select 1 from public.users where role_id = 'admin_inventori') then
    v_role   := 'admin_inventori';
    v_status := 'aktif';
  else
    v_status := case when new.email_confirmed_at is not null then 'aktif' else 'menunggu_aktivasi' end;
  end if;

  insert into public.users (id, nama, email, role_id, unit_id, status, nip, telepon)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'nama', ''), split_part(new.email, '@', 1)),
    new.email,
    v_role,
    nullif(new.raw_user_meta_data ->> 'unit_id', '')::uuid,
    v_status,
    nullif(new.raw_user_meta_data ->> 'nip', ''),
    nullif(new.raw_user_meta_data ->> 'telepon', '')
  )
  on conflict (id) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_confirmed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.users
     set status = 'aktif'
   where id = new.id and status = 'menunggu_aktivasi';
  return new;
end $$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  when (new.email_confirmed_at is not null and old.email_confirmed_at is null)
  execute function public.handle_user_confirmed();

-- ============================================================================
-- API RPC untuk aplikasi (semua penulisan lewat sini)
-- ============================================================================

create or replace function public.api_simpan_alat(
  p_kode_unik          text,
  p_nama               text,
  p_kategori           text,
  p_jenis              text default 'reusable',
  p_satuan             text default 'unit',
  p_merek              text default null,
  p_jumlah_minimum_stok integer default 0,
  p_limit_siklus       integer default null,
  p_masa_simpan_hari   integer default 30,
  p_catatan            text default null,
  p_id                 uuid default null
) returns public.alat
language plpgsql security definer set search_path = public as $$
declare
  v public.alat;
begin
  if not public.is_admin() then
    raise exception 'AKSES_DITOLAK|hanya Admin Inventori yang dapat mengelola data alat'
      using errcode = 'P0001';
  end if;

  if coalesce(btrim(p_kode_unik), '') = '' then
    raise exception 'KODE_WAJIB|kode unik alat wajib diisi' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.alat
     where upper(kode_unik) = upper(btrim(p_kode_unik))
       and (p_id is null or id <> p_id)
  ) then
    raise exception 'KODE_DUPLIKAT|kode unik % sudah terdaftar', p_kode_unik
      using errcode = 'P0001';
  end if;

  insert into public.alat as a (
    id, kode_unik, nama, kategori, jenis, satuan, merek,
    jumlah_minimum_stok, limit_siklus, masa_simpan_hari, catatan
  ) values (
    coalesce(p_id, gen_random_uuid()), upper(btrim(p_kode_unik)), btrim(p_nama),
    btrim(p_kategori), p_jenis, p_satuan, nullif(btrim(p_merek), ''),
    p_jumlah_minimum_stok, p_limit_siklus, p_masa_simpan_hari, p_catatan
  )
  on conflict (id) do update
    set kode_unik = excluded.kode_unik,
        nama = excluded.nama,
        kategori = excluded.kategori,
        jenis = excluded.jenis,
        satuan = excluded.satuan,
        merek = excluded.merek,
        jumlah_minimum_stok = excluded.jumlah_minimum_stok,
        limit_siklus = excluded.limit_siklus,
        masa_simpan_hari = excluded.masa_simpan_hari,
        catatan = excluded.catatan
  returning * into v;

  return v;
end $$;

create or replace function public.api_set_alat_aktif(p_id uuid, p_aktif boolean)
returns public.alat
language plpgsql security definer set search_path = public as $$
declare
  v public.alat;
begin
  if not public.is_admin() then
    raise exception 'AKSES_DITOLAK|hanya Admin Inventori yang dapat menonaktifkan alat'
      using errcode = 'P0001';
  end if;

  update public.alat set aktif = p_aktif where id = p_id returning * into v;
  if not found then
    raise exception 'ALAT_TIDAK_ADA|data alat tidak ditemukan' using errcode = 'P0001';
  end if;
  return v;
end $$;

create or replace function public.api_simpan_alias(
  p_alat uuid, p_unit uuid, p_alias text, p_id uuid default null
) returns public.alias_alat
language plpgsql security definer set search_path = public as $$
declare
  v public.alias_alat;
begin
  if not public.is_admin() then
    raise exception 'AKSES_DITOLAK|hanya Admin Inventori yang dapat mengelola mapping alias'
      using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.alias_alat
     where unit_id = p_unit and lower(alias) = lower(btrim(p_alias))
       and (p_id is null or id <> p_id)
  ) then
    raise exception 'ALIAS_DUPLIKAT|alias % sudah dipakai unit ini', p_alias
      using errcode = 'P0001';
  end if;

  insert into public.alias_alat (id, alat_id, unit_id, alias)
  values (coalesce(p_id, gen_random_uuid()), p_alat, p_unit, btrim(p_alias))
  on conflict (id) do update
    set alat_id = excluded.alat_id, unit_id = excluded.unit_id, alias = excluded.alias
  returning * into v;

  return v;
end $$;

create or replace function public.api_catat_alat_masuk(
  p_alat          uuid,
  p_jumlah        integer,
  p_unit_tujuan   uuid default null,
  p_tanggal       date default null,
  p_sumber        text default 'pemasok',
  p_nomor_bast    text default null,
  p_catatan       text default null
) returns public.transaksi_masuk
language plpgsql security definer set search_path = public as $$
declare
  v public.transaksi_masuk;
  v_unit uuid;
begin
  if not public.has_role('petugas_inventori', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Inventori/Admin yang mencatat alat masuk'
      using errcode = 'P0001';
  end if;

  v_unit := coalesce(
    p_unit_tujuan,
    (select id from public.units where tipe = 'gudang' and aktif order by kode limit 1)
  );

  if v_unit is null then
    raise exception 'UNIT_WAJIB|unit tujuan penerimaan belum terdaftar' using errcode = 'P0001';
  end if;

  insert into public.transaksi_masuk
    (alat_id, unit_tujuan_id, jumlah, tanggal, sumber, nomor_bast, catatan)
  values (
    p_alat, v_unit, p_jumlah, coalesce(p_tanggal, current_date),
    coalesce(nullif(btrim(p_sumber), ''), 'pemasok'), p_nomor_bast, p_catatan
  )
  returning * into v;

  return v;
end $$;

create or replace function public.api_catat_distribusi(
  p_alat        uuid,
  p_unit_tujuan uuid,
  p_jumlah      integer,
  p_tanggal     date default null,
  p_nomor_bast  text default null,
  p_catatan     text default null
) returns public.transaksi_keluar
language plpgsql security definer set search_path = public as $$
declare
  v public.transaksi_keluar;
  v_asal uuid;
begin
  if not public.has_role('petugas_inventori', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Inventori/Admin yang mencatat distribusi'
      using errcode = 'P0001';
  end if;

  v_asal := (select id from public.units where tipe = 'gudang' and aktif order by kode limit 1);
  if v_asal is null then
    raise exception 'UNIT_WAJIB|unit gudang belum terdaftar' using errcode = 'P0001';
  end if;

  insert into public.transaksi_keluar
    (alat_id, unit_asal_id, unit_tujuan_id, jumlah, tanggal, nomor_bast, catatan)
  values (p_alat, v_asal, p_unit_tujuan, p_jumlah, coalesce(p_tanggal, current_date),
          p_nomor_bast, p_catatan)
  returning * into v;

  return v;
end $$;

create or replace function public.api_konfirmasi_penerimaan(
  p_transaksi        uuid,
  p_jumlah_diterima  integer,
  p_kondisi          text default 'baik',
  p_keterangan       text default null
) returns public.konfirmasi_penerimaan
language plpgsql security definer set search_path = public as $$
declare
  v public.konfirmasi_penerimaan;
  v_tujuan uuid;
begin
  if not public.has_role('petugas_unit_medis', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Unit Medis yang mengonfirmasi penerimaan'
      using errcode = 'P0001';
  end if;

  select unit_tujuan_id into v_tujuan
    from public.transaksi_keluar where id = p_transaksi;

  -- S-2: akses terbatas pada unit sendiri
  if not public.is_admin() and v_tujuan is distinct from public.current_unit_id() then
    raise exception 'AKSES_DITOLAK|transaksi ini bukan untuk unit Anda' using errcode = 'P0001';
  end if;

  insert into public.konfirmasi_penerimaan
    (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan)
  values (p_transaksi, p_jumlah_diterima, p_kondisi, p_keterangan)
  returning * into v;

  return v;
end $$;

create or replace function public.api_perbarui_status(
  p_alat       uuid,
  p_unit       uuid,
  p_status     text,
  p_keterangan text default null
) returns public.riwayat_status
language plpgsql security definer set search_path = public as $$
declare
  v public.riwayat_status;
begin
  if not public.has_role('petugas_inventori', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Inventori/Admin yang memperbarui status alat'
      using errcode = 'P0001';
  end if;

  insert into public.riwayat_status (alat_id, unit_id, status_baru, keterangan, sumber)
  values (p_alat, p_unit, p_status, p_keterangan, 'manual')
  returning * into v;

  return v;
end $$;

create or replace function public.api_buat_batch(
  p_mesin    text,
  p_alat_ids uuid[] default '{}',
  p_catatan  text default null
) returns public.batch_sterilisasi
language plpgsql security definer set search_path = public as $$
declare
  v public.batch_sterilisasi;
  v_alat uuid;
begin
  if not public.has_role('petugas_sterilisasi', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Sterilisasi/Admin yang membentuk batch'
      using errcode = 'P0001';
  end if;

  insert into public.batch_sterilisasi (mesin, catatan)
  values (btrim(p_mesin), p_catatan)
  returning * into v;

  foreach v_alat in array coalesce(p_alat_ids, '{}') loop
    insert into public.sterilisasi_log (batch_id, alat_id, tahap, petugas_id)
    values (v.id, v_alat, 'penerimaan_kotor', auth.uid());
  end loop;

  return v;
end $$;

create or replace function public.api_majukan_batch(
  p_batch   uuid,
  p_tahap   text,
  p_catatan text default null
) returns public.batch_sterilisasi
language plpgsql security definer set search_path = public as $$
declare
  v public.batch_sterilisasi;
begin
  if not public.has_role('petugas_sterilisasi', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Sterilisasi/Admin yang memajukan tahap batch'
      using errcode = 'P0001';
  end if;

  update public.batch_sterilisasi
     set tahap = p_tahap,
         catatan = coalesce(p_catatan, catatan)
   where id = p_batch
  returning * into v;

  if not found then
    raise exception 'BATCH_TIDAK_ADA|batch tidak ditemukan' using errcode = 'P0001';
  end if;

  insert into public.sterilisasi_log (batch_id, tahap, petugas_id, catatan)
  select p_batch, p_tahap, auth.uid(), p_catatan
   where not exists (
     select 1 from public.sterilisasi_log
      where batch_id = p_batch and tahap = p_tahap and alat_id is null
   );

  return v;
end $$;

create or replace function public.api_verifikasi_batch(
  p_batch     uuid,
  p_bowie     boolean,
  p_biologis  boolean,
  p_catatan   text default null
) returns public.batch_sterilisasi
language plpgsql security definer set search_path = public as $$
declare
  v public.batch_sterilisasi;
  v_lulus boolean := coalesce(p_bowie, false) and coalesce(p_biologis, false);
begin
  if not public.has_role('petugas_sterilisasi', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Sterilisasi/Admin yang memverifikasi mutu'
      using errcode = 'P0001';
  end if;

  update public.batch_sterilisasi
     set indikator_bowie_dick = p_bowie,
         indikator_biologis   = p_biologis,
         hasil_verifikasi     = case when v_lulus then 'lulus' else 'gagal' end,
         tahap                = case when v_lulus then tahap else 'gagal' end,
         catatan              = coalesce(p_catatan, catatan)
   where id = p_batch
  returning * into v;

  if not found then
    raise exception 'BATCH_TIDAK_ADA|batch tidak ditemukan' using errcode = 'P0001';
  end if;

  return v;
end $$;

create or replace function public.api_buat_laporan(
  p_jenis           text,
  p_periode_mulai   date,
  p_periode_selesai date,
  p_unit            uuid default null,
  p_kategori        text default null,
  p_filter          jsonb default '{}'::jsonb
) returns public.laporan
language plpgsql security definer set search_path = public as $$
declare
  v public.laporan;
begin
  if not public.is_admin() then
    raise exception 'AKSES_DITOLAK|hanya Admin Inventori yang dapat membuat laporan'
      using errcode = 'P0001';
  end if;

  insert into public.laporan
    (jenis, periode_mulai, periode_selesai, unit_id, kategori, filter)
  values (p_jenis, p_periode_mulai, p_periode_selesai, p_unit, p_kategori,
          coalesce(p_filter, '{}'::jsonb))
  returning * into v;

  return v;
end $$;

create or replace function public.api_set_pengguna(
  p_id      uuid,
  p_role    text default null,
  p_unit    uuid default null,
  p_status  text default null,
  p_nama    text default null,
  p_nip     text default null,
  p_telepon text default null
) returns public.users
language plpgsql security definer set search_path = public as $$
declare
  v public.users;
begin
  if not public.is_admin() then
    raise exception 'AKSES_DITOLAK|hanya Admin Inventori yang dapat mengelola pengguna'
      using errcode = 'P0001';
  end if;

  if p_role is not null and not exists (select 1 from public.roles where id = p_role) then
    raise exception 'ROLE_TIDAK_VALID|peran % tidak dikenal', p_role using errcode = 'P0001';
  end if;

  if p_status is not null and p_status not in ('menunggu_aktivasi', 'aktif', 'nonaktif') then
    raise exception 'STATUS_TIDAK_VALID|status % tidak dikenal', p_status using errcode = 'P0001';
  end if;

  update public.users
     set role_id = coalesce(p_role, role_id),
         unit_id = coalesce(p_unit, unit_id),
         status  = coalesce(p_status, status),
         nama    = coalesce(nullif(btrim(p_nama), ''), nama),
         nip     = coalesce(p_nip, nip),
         telepon = coalesce(p_telepon, telepon)
   where id = p_id
  returning * into v;

  if not found then
    raise exception 'PENGGUNA_TIDAK_ADA|pengguna tidak ditemukan' using errcode = 'P0001';
  end if;

  return v;
end $$;

-- Laporan siap pakai untuk halaman Laporan (UC-04/UC-05, modul 4.3.12)
create or replace function public.api_ringkasan_laporan(
  p_mulai   date,
  p_selesai date,
  p_unit    uuid default null
) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hasil jsonb;
begin
  if not public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi') then
    raise exception 'AKSES_DITOLAK|tidak berwenang melihat laporan inventori'
      using errcode = 'P0001';
  end if;

  select jsonb_build_object(
    'periode', jsonb_build_object('mulai', p_mulai, 'selesai', p_selesai),
    'masuk', (
      select jsonb_build_object('transaksi', count(*), 'jumlah', coalesce(sum(jumlah), 0))
        from public.transaksi_masuk
       where tanggal between p_mulai and p_selesai
         and (p_unit is null or unit_tujuan_id = p_unit)
    ),
    'keluar', (
      select jsonb_build_object(
               'transaksi', count(*),
               'jumlah', coalesce(sum(jumlah), 0),
               'menunggu_konfirmasi', count(*) filter (where status = 'menunggu_konfirmasi'))
        from public.transaksi_keluar
       where tanggal between p_mulai and p_selesai
         and (p_unit is null or unit_tujuan_id = p_unit)
    ),
    'selisih_penerimaan', (
      select jsonb_build_object('transaksi', count(*), 'jumlah', coalesce(sum(jumlah_selisih), 0))
        from public.konfirmasi_penerimaan k
        join public.transaksi_keluar t on t.id = k.transaksi_keluar_id
       where t.tanggal between p_mulai and p_selesai
         and (p_unit is null or t.unit_tujuan_id = p_unit)
         and k.jumlah_selisih > 0
    ),
    'sterilisasi', (
      select jsonb_build_object(
               'batch', count(*),
               'lulus', count(*) filter (where hasil_verifikasi = 'lulus'),
               'gagal', count(*) filter (where hasil_verifikasi = 'gagal'))
        from public.batch_sterilisasi
       where created_at::date between p_mulai and p_selesai
    ),
    'per_unit', (
      select coalesce(jsonb_agg(baris), '[]'::jsonb) from (
        select u.nama as unit,
               coalesce(sum(s.jumlah), 0)::int as jumlah,
               count(distinct s.alat_id)::int as jenis_alat
          from public.units u
          left join public.stok_unit s on s.unit_id = u.id
         where p_unit is null or u.id = p_unit
         group by u.nama
         order by u.nama
      ) baris
    )
  ) into v_hasil;

  return v_hasil;
end $$;