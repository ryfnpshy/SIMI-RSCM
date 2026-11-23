# Lapisan Data SIMI-RSCM (Supabase / PostgreSQL)

Skema ini mengikuti laporan capstone (ERD 12 entitas, 10 use case, 12 modul
pengujian) dengan satu perubahan: **identifikasi alat memakai `kode_unik`,
tanpa barcode/QR**.

## Urutan migrasi

| File | Isi |
| --- | --- |
| `20261123085900_bersihkan_sisa_laravel.sql` | buang tabel default Laravel yang tertinggal di `public` |
| `20261123090000_schema.sql` | tabel, constraint, index, helper, view alert |
| `20261123090100_logic.sql` | aturan bisnis (trigger) + API RPC untuk aplikasi |
| `20261123090200_rls.sql` | kebijakan baca per peran (Row Level Security) |
| `20261123090300_seed.sql` | data referensi + data demo (4 akun, 10 alat, transaksi, 3 batch) |

Seluruh file di atas sudah diterapkan pada project `oqreerobkshuhjhfkuve`
(14 tabel, 4 view, 13 RPC `api_*`). Isi repo adalah sumber kebenaran; riwayat
`supabase_migrations.schema_migrations` belum mencatatnya karena DDL dijalankan
lewat `execute_sql`, jadi `supabase db push` perlu dijalankan sekali dengan
baseline bila nanti memakai CLI.

## Menerapkan

Lewat Supabase CLI:

```bash
supabase link --project-ref <REF>
supabase db push
```

Atau Supabase SQL Editor: jalankan keempat file berurutan.

## Akun demo

| Peran | Email | Kata sandi |
| --- | --- | --- |
| Admin Inventori | `admin@rscm.local` | `Admin123!` |
| Petugas Inventori | `inventori@rscm.local` | `Inventori123!` |
| Petugas Unit Medis | `unit@rscm.local` | `Unit123!` |
| Petugas Sterilisasi | `cssd@rscm.local` | `Cssd123!` |

Registrasi mandiri juga tersedia: pengguna pertama otomatis menjadi Admin
Inventori aktif, pengguna berikutnya berstatus `menunggu_aktivasi` sampai
email dikonfirmasi (tautan aktivasi Supabase Auth).

## Aturan bisnis yang ditegakkan

| Aturan | Ditegakkan oleh |
| --- | --- |
| Kode unik alat wajib unik & berformat | `alat.kode_unik` UNIQUE + CHECK |
| Keluar ditolak bila stok gudang kurang | `trg_keluar_before` |
| Total stok lintas lokasi tetap saat distribusi | `trg_keluar_after` + `trg_konfirmasi_after` |
| Selisih jumlah diterima dikembalikan ke asal, status jadi `perlu_tindak_lanjut` | `trg_konfirmasi_before/after` |
| Jumlah diterima tidak boleh 0, kosong, atau melebihi jumlah dikirim | `trg_konfirmasi_before` |
| Status hanya boleh pindah sesuai matriks `transisi_status` | `trg_riwayat_status_before` |
| Status `rusak`/`dalam_perbaikan` wajib keterangan | CHECK + `trg_riwayat_status_before` |
| Perubahan status otomatis oleh transaksi tidak dicatat dua kali | `catat_status` (lewati bila sama) |
| Tahap batch harus berurutan | `trg_batch_before` |
| Batch gagal tidak boleh didistribusikan | `trg_batch_before` + CHECK indikator |
| Batch lulus menambah `jumlah_siklus`, gagal menandai `perlu_resterilisasi` | `trg_batch_after` |
| Kedaluwarsa kemasan dihitung dari `masa_simpan_hari` saat penyimpanan | `trg_batch_after` |
| Peran/status/unit hanya boleh diubah Admin | `trg_users_guard` |

## Kode error dari database

Pesan exception diawali kode + `|`, misalnya `STOK_TIDAK_CUKUP|stok gudang tersedia 12, diminta 20`.

`KODE_DUPLIKAT`, `KODE_WAJIB`, `ALAT_TIDAK_AKTIF`, `ALAT_TIDAK_DAPAT_DIDISTRIBUSIKAN`,
`STOK_TIDAK_CUKUP`, `UNIT_WAJIB`, `UNIT_CSSD_TIDAK_ADA`, `TRANSAKSI_TIDAK_ADA`,
`SUDAH_DIKONFIRMASI`, `JUMLAH_TIDAK_VALID`, `JUMLAH_MELEBIHI`, `KETERANGAN_WAJIB`,
`STATUS_SAMA`, `TRANSISI_TIDAK_SAH`, `TAHAP_AWAL`, `ALUR_BATCH`, `VERIFIKASI_WAJIB`,
`BATCH_BELUM_LULUS`, `BATCH_TIDAK_ADA`, `TAHAP_LOG`, `AKSES_DITOLAK`,
`ROLE_TIDAK_VALID`, `STATUS_TIDAK_VALID`, `PENGGUNA_TIDAK_ADA`, `ALIAS_DUPLIKAT`.

## Memeriksa logika

```bash
node --env-file=.env.local scripts/db-check.mjs
```

Skrip itu menguji invarian stok, selisih penerimaan, tahap batch, transisi
status, dan pembatasan peran langsung ke database.

## Menyambung aplikasi

`.env.local` hanya butuh dua nilai (lihat `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Aplikasi memakai `@supabase/ssr` dengan cookie sesi dan **tidak** memakai
`service_role`: semua penulisan lewat RPC `api_*` `SECURITY DEFINER`, sedangkan
pembacaan dibatasi RLS. Jenis laporan divalidasi ganda — `laporan_jenis_check`
di database dan `src/lib/laporan.ts` di aplikasi; ubah keduanya bersamaan.
