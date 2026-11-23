-- ============================================================================
-- SIMI-RSCM :: 03 Row Level Security
-- Penulisan data lewat RPC (SECURITY DEFINER) sehingga tabel cukup
-- diberi kebijakan baca yang sesuai peran. Cakupan akses mengikuti
-- UC-02 S-2, UC-04 S-2, UC-10 S-3 (Petugas Unit Medis hanya unitnya).
-- ============================================================================

alter table public.roles                enable row level security;
alter table public.units                enable row level security;
alter table public.users                enable row level security;
alter table public.alat                 enable row level security;
alter table public.alias_alat           enable row level security;
alter table public.stok_unit            enable row level security;
alter table public.riwayat_status       enable row level security;
alter table public.transisi_status      enable row level security;
alter table public.transaksi_masuk      enable row level security;
alter table public.transaksi_keluar     enable row level security;
alter table public.konfirmasi_penerimaan enable row level security;
alter table public.batch_sterilisasi    enable row level security;
alter table public.sterilisasi_log      enable row level security;
alter table public.laporan              enable row level security;

-- ------------------------------------------------------------- referensi
drop policy if exists roles_baca on public.roles;
create policy roles_baca on public.roles
  for select to authenticated using (true);

drop policy if exists units_baca on public.units;
create policy units_baca on public.units
  for select to authenticated using (true);

drop policy if exists transisi_baca on public.transisi_status;
create policy transisi_baca on public.transisi_status
  for select to authenticated using (true);

-- -------------------------------------------------------------- pengguna
drop policy if exists users_baca on public.users;
create policy users_baca on public.users
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists users_ubah on public.users;
create policy users_ubah on public.users
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------- master
drop policy if exists alat_baca on public.alat;
create policy alat_baca on public.alat
  for select to authenticated using (true);

drop policy if exists alias_baca on public.alias_alat;
create policy alias_baca on public.alias_alat
  for select to authenticated using (true);

-- ----------------------------------------------------- stok & riwayat status
drop policy if exists stok_baca on public.stok_unit;
create policy stok_baca on public.stok_unit
  for select to authenticated
  using (
    public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi')
    or unit_id = public.current_unit_id()
  );

drop policy if exists riwayat_baca on public.riwayat_status;
create policy riwayat_baca on public.riwayat_status
  for select to authenticated
  using (
    public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi')
    or unit_id = public.current_unit_id()
  );

-- ------------------------------------------------------------- transaksi
drop policy if exists masuk_baca on public.transaksi_masuk;
create policy masuk_baca on public.transaksi_masuk
  for select to authenticated
  using (
    public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi')
    or unit_tujuan_id = public.current_unit_id()
  );

drop policy if exists keluar_baca on public.transaksi_keluar;
create policy keluar_baca on public.transaksi_keluar
  for select to authenticated
  using (
    public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi')
    or unit_tujuan_id = public.current_unit_id()
  );

drop policy if exists konfirmasi_baca on public.konfirmasi_penerimaan;
create policy konfirmasi_baca on public.konfirmasi_penerimaan
  for select to authenticated
  using (
    public.has_role('admin_inventori', 'petugas_inventori')
    or exists (
      select 1 from public.transaksi_keluar t
       where t.id = transaksi_keluar_id
         and t.unit_tujuan_id = public.current_unit_id()
    )
  );

-- ------------------------------------------------------------ sterilisasi
drop policy if exists batch_baca on public.batch_sterilisasi;
create policy batch_baca on public.batch_sterilisasi
  for select to authenticated
  using (public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi'));

drop policy if exists log_baca on public.sterilisasi_log;
create policy log_baca on public.sterilisasi_log
  for select to authenticated
  using (public.has_role('admin_inventori', 'petugas_inventori', 'petugas_sterilisasi'));

-- ---------------------------------------------------------------- laporan
drop policy if exists laporan_baca on public.laporan;
create policy laporan_baca on public.laporan
  for select to authenticated
  using (public.is_admin() or dibuat_oleh = auth.uid());