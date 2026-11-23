-- ============================================================================
-- SIMI-RSCM :: 01 skema inti
-- Acuan: PROPOSAL CAPSTONE KEL 11
--   - 12 entitas ERD: peran, unit medis, pengguna, alat, stok per unit,
--     riwayat status, transaksi masuk, transaksi keluar, konfirmasi
--     penerimaan, batch sterilisasi, log sterilisasi, laporan
--   - Identifikasi alat memakai kode_unik (PENGGANTI barcode/QR)
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create sequence if not exists public.transaksi_masuk_nomor_seq;
create sequence if not exists public.transaksi_keluar_nomor_seq;
create sequence if not exists public.batch_nomor_seq;

-- ---------------------------------------------------------------- peran/unit
create table if not exists public.roles (
  id    text primary key,
  nama  text not null unique
);

create table if not exists public.units (
  id         uuid primary key default gen_random_uuid(),
  kode       text not null unique,
  nama       text not null,
  tipe       text not null check (tipe in ('gudang', 'cssd', 'unit_medis')),
  aktif      boolean not null default true,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------- pengguna
-- Identitas & kata sandi dikelola Supabase Auth (auth.users).
-- Tabel ini hanya profil + peran + status aktivasi.
create table if not exists public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  nama       text not null,
  email      text not null unique,
  role_id    text not null references public.roles (id),
  unit_id    uuid references public.units (id),
  status     text not null default 'menunggu_aktivasi'
             check (status in ('menunggu_aktivasi', 'aktif', 'nonaktif')),
  nip        text,
  telepon    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------- alat
-- Satu baris = satu identitas inventori. kode_unik wajib unik dan
-- menjadi satu-satunya cara identifikasi (tanpa barcode).
create table if not exists public.alat (
  id                 uuid primary key default gen_random_uuid(),
  kode_unik          text not null unique
                     check (kode_unik ~ '^[A-Z0-9]{2,}(-[A-Z0-9]{2,})+$'),
  nama               text not null check (length(btrim(nama)) >= 3),
  kategori           text not null,
  jenis              text not null default 'reusable'
                     check (jenis in ('reusable', 'aset')),
  satuan             text not null default 'unit',
  merek              text,
  jumlah_minimum_stok integer not null default 0 check (jumlah_minimum_stok >= 0),
  limit_siklus       integer check (limit_siklus is null or limit_siklus > 0),
  jumlah_siklus      integer not null default 0 check (jumlah_siklus >= 0),
  masa_simpan_hari   integer not null default 30 check (masa_simpan_hari > 0),
  aktif              boolean not null default true,
  catatan            text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  perlu_maintenance  boolean generated always as
                     (limit_siklus is not null and jumlah_siklus >= limit_siklus) stored
);

create index if not exists alat_nama_trgm_idx on public.alat using gin (nama gin_trgm_ops);
create index if not exists alat_kategori_idx on public.alat (kategori) where aktif;

-- Mapping alias istilah unit lokal -> kode master terpusat (fitur modul 2).
create table if not exists public.alias_alat (
  id         uuid primary key default gen_random_uuid(),
  alat_id    uuid not null references public.alat (id) on delete cascade,
  unit_id    uuid not null references public.units (id) on delete cascade,
  alias      text not null check (length(btrim(alias)) >= 2),
  created_at timestamptz not null default now(),
  unique (unit_id, alias)
);

create index if not exists alias_alat_trgm_idx on public.alias_alat using gin (alias gin_trgm_ops);

-- ------------------------------------------------------------ stok per unit
-- jumlah = banyaknya alat pada lokasi tersebut. Status alat ditegakkan
-- lewat tabel riwayat_status (satu-satunya jalur perubahan status).
create table if not exists public.stok_unit (
  id                  uuid primary key default gen_random_uuid(),
  alat_id             uuid not null references public.alat (id) on delete restrict,
  unit_id             uuid not null references public.units (id) on delete restrict,
  jumlah              integer not null default 0 check (jumlah >= 0),
  status              text not null default 'tersedia' check (status in (
                        'tersedia', 'di_unit', 'dalam_proses_sterilisasi',
                        'perlu_resterilisasi', 'rusak', 'dalam_perbaikan')),
  tanggal_kedaluwarsa date,
  updated_at          timestamptz not null default now(),
  unique (alat_id, unit_id)
);

create index if not exists stok_unit_unit_idx on public.stok_unit (unit_id);
create index if not exists stok_unit_kedaluwarsa_idx
  on public.stok_unit (tanggal_kedaluwarsa) where tanggal_kedaluwarsa is not null;

-- --------------------------------------------------------- riwayat status
-- Insert ke tabel ini = perintah pindah status; trigger memvalidasi
-- transisi lalu menerapkannya ke stok_unit.
create table if not exists public.riwayat_status (
  id          bigserial primary key,
  alat_id     uuid not null references public.alat (id) on delete cascade,
  unit_id     uuid not null references public.units (id) on delete restrict,
  status_lama text,
  status_baru text not null check (status_baru in (
                'tersedia', 'di_unit', 'dalam_proses_sterilisasi',
                'perlu_resterilisasi', 'rusak', 'dalam_perbaikan')),
  keterangan  text,
  sumber      text not null default 'manual'
              check (sumber in ('manual', 'transaksi', 'sterilisasi')),
  transaksi_id uuid,
  dicatat_oleh uuid references public.users (id),
  created_at  timestamptz not null default now(),
  constraint riwayat_keterangan_wajib check (
    status_baru not in ('rusak', 'dalam_perbaikan')
    or coalesce(btrim(keterangan), '') <> ''
  )
);

create index if not exists riwayat_status_alat_idx on public.riwayat_status (alat_id, created_at desc);
create index if not exists riwayat_status_unit_idx on public.riwayat_status (unit_id, created_at desc);

-- Matriks transisi status yang sah (modul 4.3.5).
create table if not exists public.transisi_status (
  dari text not null,
  ke   text not null,
  primary key (dari, ke)
);

-- -------------------------------------------------------- transaksi masuk
create table if not exists public.transaksi_masuk (
  id             uuid primary key default gen_random_uuid(),
  nomor          text not null unique,
  alat_id        uuid not null references public.alat (id) on delete restrict,
  unit_tujuan_id uuid not null references public.units (id),
  jumlah         integer not null check (jumlah > 0),
  tanggal        date not null default current_date,
  sumber         text not null default 'pemasok',
  nomor_bast     text,
  catatan        text,
  dicatat_oleh   uuid references public.users (id),
  created_at     timestamptz not null default now()
);

create index if not exists transaksi_masuk_alat_idx on public.transaksi_masuk (alat_id, tanggal desc);

-- -------------------------------------------------------- transaksi keluar
create table if not exists public.transaksi_keluar (
  id             uuid primary key default gen_random_uuid(),
  nomor          text not null unique,
  alat_id        uuid not null references public.alat (id) on delete restrict,
  unit_asal_id   uuid not null references public.units (id),
  unit_tujuan_id uuid not null references public.units (id),
  jumlah         integer not null check (jumlah > 0),
  status         text not null default 'menunggu_konfirmasi'
                 check (status in ('menunggu_konfirmasi', 'diterima',
                                   'perlu_tindak_lanjut', 'dibatalkan')),
  tanggal        date not null default current_date,
  nomor_bast     text,
  catatan        text,
  dicatat_oleh   uuid references public.users (id),
  created_at     timestamptz not null default now(),
  constraint keluar_beda_unit check (unit_asal_id <> unit_tujuan_id)
);

create index if not exists transaksi_keluar_alat_idx
  on public.transaksi_keluar (alat_id, tanggal desc);
create index if not exists transaksi_keluar_tujuan_idx
  on public.transaksi_keluar (unit_tujuan_id, status);

-- --------------------------------------------------- konfirmasi penerimaan
create table if not exists public.konfirmasi_penerimaan (
  id                 uuid primary key default gen_random_uuid(),
  transaksi_keluar_id uuid not null unique
                     references public.transaksi_keluar (id) on delete cascade,
  jumlah_dikirim     integer not null,
  jumlah_diterima    integer not null check (jumlah_diterima >= 0),
  jumlah_selisih     integer not null default 0,
  kondisi            text not null default 'baik' check (kondisi in ('baik', 'rusak')),
  keterangan         text,
  dikonfirmasi_oleh  uuid references public.users (id),
  created_at         timestamptz not null default now(),
  constraint konfirmasi_rusak_berketerangan check (
    kondisi = 'baik' or coalesce(btrim(keterangan), '') <> ''
  )
);

-- ------------------------------------------------------ batch sterilisasi
create table if not exists public.batch_sterilisasi (
  id                 uuid primary key default gen_random_uuid(),
  nomor              text not null unique,
  mesin              text not null,
  tahap              text not null default 'penerimaan_kotor' check (tahap in (
                       'penerimaan_kotor', 'pencucian', 'pengemasan',
                       'sterilisasi', 'pendinginan', 'penyimpanan',
                       'terdistribusi', 'gagal')),
  indikator_bowie_dick boolean,
  indikator_biologis   boolean,
  hasil_verifikasi     text check (hasil_verifikasi in ('lulus', 'gagal')),
  catatan            text,
  mulai_at           timestamptz not null default now(),
  selesai_at         timestamptz,
  dibuat_oleh        uuid references public.users (id),
  created_at         timestamptz not null default now(),
  -- modul 4.3.11: lulus hanya bila kedua indikator uji memenuhi
  constraint verifikasi_lulus_butuh_indikator check (
    hasil_verifikasi is distinct from 'lulus'
    or (indikator_bowie_dick is true and indikator_biologis is true)
  )
);

create table if not exists public.sterilisasi_log (
  id         bigserial primary key,
  batch_id   uuid not null references public.batch_sterilisasi (id) on delete cascade,
  alat_id    uuid references public.alat (id) on delete restrict,
  jumlah     integer not null default 1 check (jumlah > 0),
  tahap      text not null check (tahap in (
               'penerimaan_kotor', 'pencucian', 'pengemasan',
               'sterilisasi', 'pendinginan', 'penyimpanan', 'terdistribusi')),
  petugas_id uuid references public.users (id),
  catatan    text,
  created_at timestamptz not null default now(),
  unique (batch_id, tahap, alat_id)
);

create index if not exists sterilisasi_log_batch_idx on public.sterilisasi_log (batch_id);

-- ---------------------------------------------------------------- laporan
create table if not exists public.laporan (
  id              uuid primary key default gen_random_uuid(),
  jenis           text not null check (jenis in (
                    'stok', 'masuk', 'keluar', 'status', 'sterilisasi', 'distribusi_unit')),
  periode_mulai   date not null,
  periode_selesai date not null,
  unit_id         uuid references public.units (id),
  kategori        text,
  filter          jsonb not null default '{}'::jsonb,
  dibuat_oleh     uuid references public.users (id),
  created_at      timestamptz not null default now(),
  constraint laporan_periode check (periode_selesai >= periode_mulai)
);

-- ============================================================================
-- Helper: konteks pengguna & urutan tahap
-- ============================================================================

create or replace function public.current_profile()
returns public.users
language sql stable security definer set search_path = public as $$
  select * from public.users where id = auth.uid();
$$;

create or replace function public.current_role_id()
returns text
language sql stable security definer set search_path = public as $$
  select role_id from public.users where id = auth.uid();
$$;

create or replace function public.current_unit_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select unit_id from public.users where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_id() = 'admin_inventori', false);
$$;

create or replace function public.has_role(variadic p_roles text[])
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_id() = any (p_roles), false);
$$;

create or replace function public.tahap_urutan(p_tahap text)
returns integer
language sql immutable as $$
  select case p_tahap
    when 'penerimaan_kotor' then 1
    when 'pencucian'        then 2
    when 'pengemasan'       then 3
    when 'sterilisasi'      then 4
    when 'pendinginan'      then 5
    when 'penyimpanan'      then 6
    when 'terdistribusi'    then 7
  end;
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_alat_touch on public.alat;
create trigger trg_alat_touch before update on public.alat
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_users_touch on public.users;
create trigger trg_users_touch before update on public.users
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- View bantu (security_invoker => tetap tunduk pada RLS tabel dasar)
-- ============================================================================

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
  min(s.tanggal_kedaluwarsa) as kedaluwarsa_terdekat
from public.alat a
left join public.stok_unit s on s.alat_id = a.id
left join public.units u on u.id = s.unit_id
group by a.id;

create or replace view public.v_stok_minimum with (security_invoker = true) as
select *
from public.v_stok_ringkas
where total_stok < jumlah_minimum_stok;

create or replace view public.v_alert_kedaluwarsa with (security_invoker = true) as
select
  s.id,
  a.kode_unik,
  a.nama,
  u.nama as unit,
  u.id   as unit_id,
  s.jumlah,
  s.tanggal_kedaluwarsa,
  (s.tanggal_kedaluwarsa - current_date) as sisa_hari
from public.stok_unit s
join public.alat a on a.id = s.alat_id
join public.units u on u.id = s.unit_id
where s.tanggal_kedaluwarsa is not null
  and s.jumlah > 0;

create or replace view public.v_notifikasi with (security_invoker = true) as
select 'kedaluwarsa' as jenis, s.kode_unik, s.nama,
       format('Kemasan steril kedaluwarsa dalam %s hari di %s', s.sisa_hari, s.unit) as pesan,
       case when s.sisa_hari <= 0 then 'tinggi' when s.sisa_hari <= 7 then 'sedang' else 'rendah' end as prioritas,
       s.tanggal_kedaluwarsa as tanggal
from public.v_alert_kedaluwarsa s
where s.sisa_hari <= 30
union all
select 'stok_minimum' as jenis, a.kode_unik, a.nama,
       format('Stok %s di bawah ambang minimum %s', a.total_stok, a.jumlah_minimum_stok) as pesan,
       'sedang' as prioritas, null::date as tanggal
from public.v_stok_minimum a
union all
select 'konfirmasi_tertunda' as jenis, a.kode_unik, a.nama,
       format('Distribusi %s menunggu konfirmasi unit %s', t.jumlah, u.nama) as pesan,
       'sedang' as prioritas, t.tanggal as tanggal
from public.transaksi_keluar t
join public.alat a on a.id = t.alat_id
join public.units u on u.id = t.unit_tujuan_id
where t.status = 'menunggu_konfirmasi'
union all
select 'batch_gagal' as jenis, null as kode_unik, b.nomor as nama,
       format('Batch %s tidak lulus uji mutu', b.nomor) as pesan,
       'tinggi' as prioritas, b.created_at::date as tanggal
from public.batch_sterilisasi b
where b.hasil_verifikasi = 'gagal';