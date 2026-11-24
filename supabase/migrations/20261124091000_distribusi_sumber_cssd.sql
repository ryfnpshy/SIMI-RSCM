-- ============================================================================
-- SIMI-RSCM :: Perbaikan UC-07 — sumber distribusi boleh Gudang atau CSSD
-- Sebelumnya unit asal selalu di-hardcode ke gudang (tipe 'gudang'), sehingga
-- alat yang hanya tersimpan di CSSD (penyimpanan steril) tidak pernah bisa
-- didistribusikan ke unit medis -> jalan buntu setelah batch selesai.
-- Acuan SOP capstone: penyimpanan steril -> pengajuan/distribusi ke unit.
-- Default tetap gudang supaya alur UC-07 yang lama tidak berubah.
-- ============================================================================

drop function if exists public.api_catat_distribusi(uuid, uuid, integer, date, text, text);

create or replace function public.api_catat_distribusi(
  p_alat        uuid,
  p_unit_tujuan uuid,
  p_jumlah      integer,
  p_tanggal     date default null,
  p_nomor_bast  text default null,
  p_catatan     text default null,
  p_unit_asal   uuid default null
) returns public.transaksi_keluar
language plpgsql security definer set search_path = public as $$
declare
  v public.transaksi_keluar;
  v_asal uuid;
  v_tipe text;
begin
  if not public.has_role('petugas_inventori', 'admin_inventori') then
    raise exception 'AKSES_DITOLAK|hanya Petugas Inventori/Admin yang mencatat distribusi'
      using errcode = 'P0001';
  end if;

  -- Sumber default = gudang (UC-07). Bila diminta, sumber boleh salah satu
  -- tempat penyimpanan: gudang atau CSSD (penyimpanan steril).
  v_asal := coalesce(
    p_unit_asal,
    (select id from public.units where tipe = 'gudang' and aktif order by kode limit 1)
  );
  if v_asal is null then
    raise exception 'UNIT_WAJIB|unit gudang belum terdaftar' using errcode = 'P0001';
  end if;

  select tipe into v_tipe from public.units where id = v_asal and aktif;
  if v_tipe is null then
    raise exception 'ASAL_TIDAK_VALID|unit asal tidak dikenal atau nonaktif'
      using errcode = 'P0001';
  end if;
  if v_tipe not in ('gudang', 'cssd') then
    raise exception 'ASAL_TIDAK_VALID|distribusi hanya boleh berasal dari gudang atau CSSD'
      using errcode = 'P0001';
  end if;

  insert into public.transaksi_keluar
    (alat_id, unit_asal_id, unit_tujuan_id, jumlah, tanggal, nomor_bast, catatan)
  values (p_alat, v_asal, p_unit_tujuan, p_jumlah, coalesce(p_tanggal, current_date),
          p_nomor_bast, p_catatan)
  returning * into v;

  return v;
end $$;
