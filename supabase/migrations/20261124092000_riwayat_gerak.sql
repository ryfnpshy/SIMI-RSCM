-- ============================================================================
-- SIMI-RSCM :: Perbaikan UC-02 — riwayat pergerakan alat lintas transaksi
-- Sebelumnya halaman Riwayat Pergerakan hanya membaca riwayat_status (perubahan
-- status), sehingga jenis transaksi, lokasi asal/tujuan, jumlah, serta peristiwa
-- konfirmasi penerimaan tidak pernah tampil. View ini menyatukan transaksi
-- masuk, distribusi keluar, dan konfirmasi penerimaan.
-- security_invoker=true agar RLS tabel dasar tetap berlaku (UC-02 S-2: Petugas
-- Unit Medis hanya melihat riwayat unitnya).
-- ============================================================================

-- Nama petugas untuk kolom "pengguna" (UC-02 langkah 5). Kebijakan RLS users
-- hanya mengizinkan diri sendiri/admin, sehingga join biasa menghasilkan null
-- bagi peran lain. Helper SECURITY DEFINER ini hanya membuka kolom nama.
create or replace function public.nama_pengguna(p_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select nama from public.users where id = p_id;
$$;

create or replace view public.v_riwayat_gerak
with (security_invoker = true) as
-- 1) Penerimaan alat (masuk)
select
  ('M-' || m.id::text)::text                                   as id,
  m.created_at                                                 as waktu,
  'Penerimaan'::text                                           as jenis,
  m.alat_id                                                    as alat_id,
  a.kode_unik                                                  as kode_unik,
  a.nama                                                       as nama_alat,
  a.satuan                                                     as satuan,
  m.jumlah                                                     as jumlah,
  m.nomor                                                      as nomor,
  null::uuid                                                   as asal_id,
  m.unit_tujuan_id                                             as tujuan_id,
  nullif(btrim(m.sumber), '')                                  as asal,
  u.nama                                                       as tujuan,
  coalesce(nullif(btrim(m.catatan), ''), m.sumber)             as keterangan,
  m.dicatat_oleh                                               as oleh,
  public.nama_pengguna(m.dicatat_oleh)                         as pengguna,
  m.id                                                         as ref_id
from public.transaksi_masuk m
join public.alat a on a.id = m.alat_id
left join public.units u on u.id = m.unit_tujuan_id

union all

-- 2) Distribusi alat (keluar)
select
  ('K-' || k.id::text)::text,
  k.created_at,
  'Distribusi'::text,
  k.alat_id,
  a.kode_unik,
  a.nama,
  a.satuan,
  k.jumlah,
  k.nomor,
  k.unit_asal_id,
  k.unit_tujuan_id,
  ua.nama,
  ut.nama,
  k.status,
  k.dicatat_oleh,
  public.nama_pengguna(k.dicatat_oleh),
  k.id
from public.transaksi_keluar k
join public.alat a on a.id = k.alat_id
left join public.units ua on ua.id = k.unit_asal_id
left join public.units ut on ut.id = k.unit_tujuan_id

union all

-- 3) Konfirmasi penerimaan (serah terima)
select
  ('C-' || c.id::text)::text,
  c.created_at,
  'Konfirmasi Penerimaan'::text,
  k.alat_id,
  a.kode_unik,
  a.nama,
  a.satuan,
  c.jumlah_diterima,
  k.nomor,
  k.unit_asal_id,
  k.unit_tujuan_id,
  ua.nama,
  ut.nama,
  case
    when c.kondisi = 'rusak' then 'diterima rusak' || coalesce(': ' || nullif(btrim(c.keterangan), ''), '')
    when c.jumlah_selisih > 0 then 'selisih ' || c.jumlah_selisih || coalesce(' — ' || nullif(btrim(c.keterangan), ''), '')
    else 'sesuai'
  end,
  c.dikonfirmasi_oleh,
  public.nama_pengguna(c.dikonfirmasi_oleh),
  k.id
from public.konfirmasi_penerimaan c
join public.transaksi_keluar k on k.id = c.transaksi_keluar_id
join public.alat a on a.id = k.alat_id
left join public.units ua on ua.id = k.unit_asal_id
left join public.units ut on ut.id = k.unit_tujuan_id;