-- ============================================================================
-- SIMI-RSCM :: Pengembalian alat kotor dari unit medis ke CSSD
-- Menutup jalan buntu pasca-pemakaian: alat yang dipakai unit medis dikembalikan
-- ke CSSD untuk dicuci/steril ulang. Sebelumnya hanya "distribusi" (gudang/CSSD
-- -> unit) yang ada, sehingga alat tidak pernah bisa kembali ke CSSD.
-- Pergerakan stok memakai transaksi_keluar yang sudah ada (-unit, +CSSD), lalu
-- CSSD mengonfirmasi penerimaan seperti biasa.
-- ============================================================================

create or replace function public.api_kembalikan_ke_cssd(
  p_alat      uuid,
  p_jumlah    integer,
  p_unit_asal uuid default null,
  p_catatan   text default null
) returns public.transaksi_keluar
language plpgsql security definer set search_path = public as $$
declare
  v      public.transaksi_keluar;
  v_asal uuid;
  v_tipe text;
  v_cssd uuid;
begin
  if not public.has_role('petugas_unit_medis', 'petugas_inventori', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Unit Medis/Inventori/Admin yang mengembalikan alat'
      using errcode = 'P0001';
  end if;

  if p_jumlah is null or p_jumlah <= 0 then
    raise exception 'JUMLAH_TIDAK_VALID|jumlah pengembalian harus lebih dari nol'
      using errcode = 'P0001';
  end if;

  v_asal := coalesce(p_unit_asal, public.current_unit_id());
  if v_asal is null then
    raise exception 'UNIT_WAJIB|unit asal pengembalian tidak diketahui' using errcode = 'P0001';
  end if;

  -- Petugas Unit Medis hanya boleh mengembalikan dari unitnya sendiri.
  if not public.is_admin() and v_asal is distinct from public.current_unit_id() then
    raise exception 'AKSES_DITOLAK|hanya boleh mengembalikan alat dari unit Anda'
      using errcode = 'P0001';
  end if;

  select tipe into v_tipe from public.units where id = v_asal and aktif;
  if v_tipe is null then
    raise exception 'ASAL_TIDAK_VALID|unit asal tidak dikenal atau nonaktif' using errcode = 'P0001';
  end if;
  if v_tipe <> 'unit_medis' then
    raise exception 'ASAL_TIDAK_VALID|pengembalian hanya boleh dari unit medis'
      using errcode = 'P0001';
  end if;

  select id into v_cssd from public.units where tipe = 'cssd' and aktif order by kode limit 1;
  if v_cssd is null then
    raise exception 'UNIT_CSSD_TIDAK_ADA|unit CSSD belum terdaftar' using errcode = 'P0001';
  end if;

  insert into public.transaksi_keluar
    (alat_id, unit_asal_id, unit_tujuan_id, jumlah, catatan)
  values (p_alat, v_asal, v_cssd, p_jumlah, p_catatan)
  returning * into v;

  -- Alat yang baru dipakai perlu disterilkan ulang, bukan langsung siap pakai.
  perform public.catat_status(
    p_alat, v_cssd, 'perlu_resterilisasi',
    format('Pengembalian %s dari unit menuju CSSD', v.nomor),
    'transaksi', v.id, auth.uid()
  );

  return v;
end $$;

-- CSSD juga menerima pengembalian, jadi ikut boleh mengonfirmasi penerimaan.
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
  if not public.has_role('petugas_unit_medis', 'petugas_sterilisasi', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Unit Medis/Sterilisasi yang mengonfirmasi penerimaan'
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
