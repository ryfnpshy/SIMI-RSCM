# SIMI-RSCM — Sistem Informasi Manajemen Inventori RSCM

Aplikasi web untuk operasional sterilisasi alat bedah, pelacakan baki instrumen (CSSD),
dan manajemen stok medis terpusat. Studi kasus: RSUP Nasional Dr. Cipto Mangunkusumo (RSCM).

Seluruh tampilan mengikuti desain dari Google Stitch (project *UI APlikasi Web RSCM*).

## Prasyarat

- Node.js >= 20.9 (disarankan 22+) dan npm
- Supabase (URL + anon key) — sudah terisi di `.env.example`

## Menjalankan

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

`/` otomatis dialihkan ke `/login` (diatur di `next.config.ts`).

Perintah lain:

```bash
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint     # eslint
```

## Status Data

Backend tersambung ke Supabase (PostgreSQL). Data master, transaksi, batch, dan
pengguna tersimpan di database; halaman membaca lewat RLS, penulisan lewat RPC
`api_*`. Login nyata (Supabase Auth) dengan proteksi rute per peran di
`src/proxy.ts` — `src/lib/akses.ts` adalah sumber matriksnya. Detail skema dan
aturan bisnis: `supabase/README.md`.

Memeriksa logika bisnis langsung ke database:

```bash
node --env-file=.env.local scripts/db-check.mjs
```

## Akun Demo

Semua akun memakai domain `@rscm.local` (kredensial seed ada di
`supabase/migrations/20261123090300_seed.sql`).

| Peran | Email | Kata sandi |
| --- | --- | --- |
| Admin Inventori | `admin@rscm.local` | `Admin123!` |
| Petugas Inventori | `inventori@rscm.local` | `Inventori123!` |
| Petugas Unit Medis | `unit@rscm.local` | `Unit123!` |
| Petugas Sterilisasi | `cssd@rscm.local` | `Cssd123!` |

Registrasi mandiri (`/daftar`) tersedia: pengguna pertama otomatis jadi Admin
Inventori aktif, pengguna berikutnya berstatus `menunggu_aktivasi` sampai email
dikonfirmasi.

## Laporan Uji Coba per Peran

Pengujian manual 4 peran terhadap dev dan build produksi. Matriks akses mengikuti
`src/lib/akses.ts`; menunya diturunkan `navigasiUntuk()`.

### Matriks Akses Halaman

`Y` = boleh, `—` = tidak boleh (rute dialihkan oleh `src/proxy.ts`).

| Rute | Admin | Inventori | Unit Medis | Sterilisasi |
| --- | :---: | :---: | :---: | :---: |
| `/dashboard` | Y | Y | Y | Y |
| `/data-alat` (incl. `/tambah`) | Y | Y | Y | Y |
| `/alat-masuk` | Y | Y | — | — |
| `/alat-keluar` | Y | Y | — | — |
| `/status-alat` | Y | Y | Y | Y |
| `/riwayat-pergerakan` | Y | Y | Y | Y |
| `/batch-sterilisasi` (incl. `/detail-batch`) | Y | — | — | Y |
| `/konfirmasi-penerimaan` (incl. `/detail-konfirmasi`) | Y | — | Y | — |
| `/daftar-laporan` (incl. `/detail-laporan`) | Y | Y | — | Y |
| `/manajemen-pengguna` (incl. `/detail-pengguna`) | Y | — | — | — |
| `/pengaturan`, `/notifikasi`, `/profil` | Y | Y | Y | Y |

Menu Sidebar tersembunyi otomatis bila peran tidak berhak; RLS database tetap
penjaga terakhir walau rute diakses langsung.

### Alur per Peran

**Admin Inventori** — akses penuh.
`admin@rscm.local` / `Admin123!`
1. Login → `/dashboard`.
2. `/data-alat` → tambah/nonaktifkan alat.
3. `/alat-masuk` → catat penerimaan; `/alat-keluar` → distribusi ke unit.
4. `/batch-sterilisasi` → buat batch → majukan tahap → verifikasi lulus/gagal;
   stepper `/detail-batch` menampilkan `terdistribusi` setelah batch didistribusikan.
5. `/daftar-laporan` → buat laporan; `/manajemen-pengguna` → aktifkan pengguna
   `menunggu_aktivasi`.

**Petugas Inventori** — inventori & laporan.
`inventori@rscm.local` / `Inventori123!`
1. Login → `/dashboard`.
2. `/alat-masuk` → catat masuk (stok gudang naik).
3. `/alat-keluar` → distribusi; unit belum konfirmasi → muncul di
   `/riwayat-pergerakan`.
4. `/daftar-laporan` → laporan.
5. Akses `/batch-sterilisasi`, `/konfirmasi-penerimaan`, `/manajemen-pengguna`
   dialihkan.

**Petugas Unit Medis** — penerimaan & pemakaian.
`unit@rscm.local` / `Unit123!`
1. Login → `/dashboard`.
2. `/konfirmasi-penerimaan` → konfirmasi serah terima; isi jumlah diterima;
   selisih → status `perlu_tindak_lanjut`.
3. `/detail-konfirmasi` → rincian.
4. `/status-alat` → ubah kondisi; status `rusak`/`dalam_perbaikan` wajib keterangan.
5. Akses `/alat-masuk`, `/alat-keluar`, `/batch-sterilisasi`, `/daftar-laporan`,
   `/manajemen-pengguna` dialihkan.

**Petugas Sterilisasi (CSSD)** — siklus sterilisasi.
`cssd@rscm.local` / `Cssd123!`
1. Login → `/dashboard`.
2. `/batch-sterilisasi` → buat batch (nomor SS-...) → majukan tahap sesuai alur
   (penerimaan → pencucian → pengemasan → sterilisasi → penyimpanan → terdistribusi).
3. `/detail-batch` → verifikasi lulus/gagal; lulus menambah `jumlah_siklus`,
   gagal menandai `perlu_resterilisasi` dan memblokir distribusi.
4. `/daftar-laporan` → laporan.
5. Akses `/alat-masuk`, `/alat-keluar`, `/konfirmasi-penerimaan`,
   `/manajemen-pengguna` dialihkan.

### Catatan

- Bug A (riwayat: tahap `terdistribusi` ditolak CHECK constraint) sudah diperbaiki —
  migrasi `20261123090400_fix_sterilisasi_log_tahap.sql`.
- Bug B (respons server action tak di-commit klien, race di Next 16.4.6 + React 19)
  ditangani di level aplikasi: setelah mutasi klien melakukan navigasi dokumen
  penuh (`src/components/ui/aksiKlien.ts`, `AksiForm.tsx`, `FlashBanner.tsx`).
  Ditandai `ponytail:` untuk dihapus saat upstream beres.
- Verifikasi: `tsc` bersih, `eslint` bersih, `next build` sukses, `db-check`
  21 lulus / 0 gagal.

## Tech Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first, token di `src/app/globals.css`)
- Font: Manrope (headline), Inter (body/label), JetBrains Mono (kode) + Material Symbols
- Ikon: Material Symbols (halaman inti) dan lucide-react (halaman pendukung)

## Struktur Folder

```
src/
  app/
    layout.tsx              # root layout + font + Material Symbols
    globals.css             # design token (@theme) dari Stitch
    login/page.tsx          # halaman login (standalone, tanpa sidebar)
    (dashboard)/            # 18 halaman; layout.tsx = shell Sidebar + Header
  components/
    layout/                 # DashboardLayout, Sidebar, Header
    ui/                     # Button, Card, Badge, Input, Select, Table, StatCard, Switch
  lib/utils.ts              # helper cn()
stitch-html/                # referensi HTML asli Google Stitch + CONVERSION.md
public/                     # aset statis
```

`stitch-html/` hanya bahan referensi desain saat konversi, tidak dipakai saat runtime.

## Daftar Route

| Route | Keterangan |
| --- | --- |
| `/` | redirect ke `/login` (via `next.config.ts`) |
| `/login` | masuk (standalone, tanpa sidebar) |
| `/dashboard` | ringkasan + KPI |
| `/data-alat` | master alat (pencarian, filter, modal nonaktifkan) |
| `/data-alat/tambah` | form tambah alat |
| `/alat-masuk` | penerimaan alat |
| `/alat-keluar` | distribusi / alat keluar |
| `/status-alat` | status & kondisi alat |
| `/riwayat-pergerakan` | audit trail mutasi |
| `/batch-sterilisasi` | daftar batch sterilisasi CSSD |
| `/detail-batch` | detail batch sterilisasi |
| `/konfirmasi-penerimaan` | konfirmasi serah terima unit |
| `/detail-konfirmasi` | detail konfirmasi penerimaan |
| `/daftar-laporan` | daftar laporan |
| `/detail-laporan` | detail laporan |
| `/manajemen-pengguna` | manajemen user & role |
| `/detail-pengguna` | detail pengguna |
| `/notifikasi` | pusat notifikasi |
| `/pengaturan` | pengaturan sistem |
| `/profil` | profil & sesi |

## Design Token

Token desain ada di blok `@theme` pada `src/app/globals.css` (warna Material-3, skala
tipografi, radius). Contoh: `bg-surface-container-lowest`, `text-on-surface`,
`bg-primary/10`, `font-headline-lg text-headline-lg`.

Catatan: token spacing bernama dari Stitch (`p-space-md` dll.) diikuti spesifikasi
Tailwind v4 yang tidak mendukung `--spacing-*` bernama, sehingga dipetakan ke skala
numerik (`p-space-md` → `p-4`). Lihat `stitch-html/CONVERSION.md`.

## Catatan Pengembangan

- `AGENTS.md` di root ditulis otomatis oleh `next dev`; jangan dihapus manual.
- Halaman inti memakai kelas token langsung (Material Symbols), halaman pendukung
  memakai komponen di `src/components/ui`.
