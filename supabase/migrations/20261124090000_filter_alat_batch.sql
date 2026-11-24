-- Pemilihan alat saat membentuk batch sterilisasi:
-- 1) v_stok_ringkas mengekspos "dalam_batch" = alat sudah masuk batch yang belum selesai.
-- 2) api_buat_batch menolak alat yang sudah ada di batch berjalan (cegah dobel siklus).

create or replace view public.v_stok_ringkas with (security_invoker = true) as
select
  a.id,
  a.kode_unik,
  a.nama,
  a.kategori,
  a.jenis,
  a.satuan,
  a.aktif,
  a.jumlah_minimum_stok,
  a.limit_siklus,
  a.jumlah_siklus,
  a.perlu_maintenance,
  coalesce(sum(s.jumlah), 0)::int as total_stok,
  coalesce(sum(s.jumlah) filter (where u.tipe = 'gudang'), 0)::int as stok_gudang,
  coalesce(sum(s.jumlah) filter (where u.tipe = 'cssd'), 0)::int as stok_cssd,
  coalesce(sum(s.jumlah) filter (where u.tipe = 'unit_medis'), 0)::int as stok_unit_medis,
  min(s.tanggal_kedaluwarsa) as kedaluwarsa_terdekat,
  exists (
    select 1
    from public.sterilisasi_log l
    join public.batch_sterilisasi b on b.id = l.batch_id
    where l.alat_id = a.id
      and b.tahap not in ('terdistribusi', 'gagal')
  ) as dalam_batch
from public.alat a
left join public.stok_unit s on s.alat_id = a.id
left join public.units u on u.id = s.unit_id
group by a.id;

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

  foreach v_alat in array coalesce(p_alat_ids, '{}') loop
    if exists (
      select 1
      from public.sterilisasi_log l
      join public.batch_sterilisasi b on b.id = l.batch_id
      where l.alat_id = v_alat
        and b.tahap not in ('terdistribusi', 'gagal')
    ) then
      raise exception 'ALAT_DI_BATCH|ada alat yang masih berada di batch sterilisasi berjalan'
        using errcode = 'P0001';
    end if;
  end loop;

  insert into public.batch_sterilisasi (mesin, catatan)
  values (btrim(p_mesin), p_catatan)
  returning * into v;

  foreach v_alat in array coalesce(p_alat_ids, '{}') loop
    insert into public.sterilisasi_log (batch_id, alat_id, tahap, petugas_id)
    values (v.id, v_alat, 'penerimaan_kotor', auth.uid());
  end loop;

  return v;
end $$;
