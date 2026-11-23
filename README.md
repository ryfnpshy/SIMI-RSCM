# SIMI-RSCM — Sistem Informasi Manajemen Inventori RS

Aplikasi web untuk operasional sterilisasi alat bedah, pelacakan baki instrumen (CSSD),
dan manajemen stok medis terpusat. Studi kasus: RS Cipto Mangunkusumo.

Seluruh tampilan mengikuti desain dari Google Stitch (project *UI APlikasi Web RSCM*).

## Tech Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first, token di `src/app/globals.css`)
- Font: Manrope (headline), Inter (body/label), JetBrains Mono (kode) + Material Symbols
- Ikon: Material Symbols (halaman inti) dan lucide-react (halaman pendukung)

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000  -> redirect ke /login
```

Perintah lain:

```bash
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint     # eslint
```

Tidak ada variabel environment yang dibutuhkan. Data masih statis/dummy di dalam
masing-masing halaman (belum terhubung backend).

Login masih mock: `/login` sudah terisi kredensial contoh
(`petugas.cssd@rsud-medika.go.id` / `DemoMedika2025#`). Menekan "Masuk" langsung
mengarah ke `/dashboard` tanpa verifikasi, dan banner error hanya muncul bila ada
field kosong. Belum ada proteksi route, jadi `/dashboard` bisa dibuka langsung.

## Struktur Folder

```
src/
  app/
    layout.tsx              # root layout + font + Material Symbols
    globals.css             # design token (@theme) dari Stitch
    page.tsx                # redirect / -> /login
    login/page.tsx          # halaman login (standalone)
    (dashboard)/
      layout.tsx            # membungkus semua halaman dashboard
      dashboard/            # + 18 halaman lain (lihat daftar route)
  components/
    layout/                 # DashboardLayout, Sidebar, Header
    ui/                     # Button, Card, Badge, Input, Select, Table, StatCard, Switch
  lib/utils.ts              # helper cn()
stitch-html/                # referensi: HTML asli dari Google Stitch + catatan konversi
public/                     # aset statis
```

## Daftar Route

| Route | Keterangan |
| --- | --- |
| `/` | redirect ke `/login` |
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
