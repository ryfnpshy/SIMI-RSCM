# Konversi Stitch HTML → Next.js TSX

Sumber: `stitch-html/<nama>.html` (export Google Stitch, Tailwind CDN).
Target: halaman Next.js App Router dengan token desain yang sudah didefinisikan di
`src/app/globals.css` (`@theme`).

## Struktur file HTML sumber

- `<head>` + `<style>` + `<script src="cdn.tailwindcss.com">` + `<script id="tailwind-config">…</script>` → **buang semua**.
- Konten halaman berada di dalam elemen `<main …>…</main>` (buka `<main>` ada di akhir baris script config,
  tutup `</main>` ada sebelum `<script>` di akhir). Ambil **hanya isi `<main>`**.
- `<script>` di akhir file = demo interaksi. Konversi ke React state bila berguna untuk UI
  (tab, toggle password, dsb); buang yang murni demo (`alert()`, sinkronisasi sidebar).
- Jangan sertakan sidebar/header aplikasi — sudah disediakan `src/components/layout/DashboardLayout.tsx`.

## Aturan mekanis wajib

1. `class` → `className`.
2. Buang atribut penanda shell: `shell-type`, `aria-*` boleh dipertahankan.
3. Inline style string → objek: `style="font-variation-settings: 'FILL' 1;"` →
   `style={{ fontVariationSettings: "'FILL' 1" }}`.
4. Void element self-closing: `<input … />`, `<img … />`, `<br />`, `<hr />`, `<path … />`,
   `<circle … />`, `<line … />`.
5. Atribut boolean: `required=""` → `required`, `disabled=""` → `disabled`, `checked=""` → `defaultChecked`,
   `selected=""` → `defaultValue`/`defaultSelected`, `readonly=""` → `readOnly`, `multiple=""` → `multiple`.
6. Atribut camelCase: `for`→`htmlFor`, `tabindex`→`tabIndex`, `colspan`→`colSpan`, `rowspan`→`rowSpan`,
   `maxlength`→`maxLength`, `autocomplete`→`autoComplete`, `autofocus`→`autoFocus`, `inputmode`→`inputMode`,
   `novalidate`→`noValidate`, `formaction`→`formAction`, `srcset`→`srcSet`, `allowfullscreen`→`allowFullScreen`,
   `crossorigin`→`crossOrigin`, `contenteditable`→`contentEditable`.
7. `onclick`/`onsubmit`/`onchange` inline → hapus; ganti dengan handler React (`onClick`, `onSubmit`) bila perlu.
   Setiap `<button>` tanpa `type` → tambah `type="button"` (kecuali submit form).
8. Entity HTML → karakter: `&amp;`→`&`, `&times;`→`×`, `&rarr;`→`→`, `&larr;`→`←`, `&hellip;`→`…`,
   `&middot;`→`·`, `&ndash;`→`–`, `&mdash;`→`—`, `&bull;`→`•`, `&nbsp;`→`{" "}`.
   Karakter `&`, `>`, `<` di dalam teks JSX: `&` boleh literal; `>` boleh literal; `<` sebagai teks perlu `{"<"}`.
   Paling aman pakai `{"…"}` untuk teks yang memuat simbol khusus.
9. `<img>` remote tetap `<img>`; tambahkan `/* eslint-disable @next/next/no-img-element */` di baris pertama file.
10. Simbol Material tetap: `<span className="material-symbols-outlined">nama_ikon</span>`.
11. Jangan tambah dependency baru. Jangan pakai `lucide-react` di halaman hasil konversi ini — pakai
    Material Symbols seperti HTML sumber agar identik.
12. `sticky top-20` dll boleh dipertahankan apa adanya.

## Terjemahan token spacing (WAJIB, karena `--spacing-*` bernama tak didukung Tailwind v4)

Nama → angka Tailwind (1 unit = 0.25rem):

| token | rem | angka |
|-------|-----|-------|
| `space-xs` | .25 | `1` |
| `space-sm` | .5 | `2` |
| `space-md` | 1 | `4` |
| `space-lg` | 1.5 | `6` |
| `space-xl` | 2 | `8` |
| `gutter` | 1.5 | `6` |
| `gutter-mobile` | .75 | `3` |
| `margin` | 2 | `8` |
| `margin-mobile` | 1 | `4` |

Contoh: `p-space-md`→`p-4`, `gap-space-sm`→`gap-2`, `space-y-space-md`→`space-y-4`,
`px-space-md`→`px-4`, `py-space-xs`→`py-1`, `mt-space-lg`→`mt-6`, `sm:p-space-xl`→`sm:p-8`,
`mb-space-sm`→`mb-2`, `gap-space-lg`→`gap-6`.

Semua token lain TETAP apa adanya (sudah terdefinisi di `@theme`):
- Warna: `bg-surface-container-lowest`, `text-on-surface`, `bg-primary/10`, `text-error`, `border-outline-variant`, dst.
- Font & ukuran: `font-headline-lg`, `text-headline-lg`, `font-label-md`, `text-label-md`, `font-body-md`,
  `text-body-sm`, `font-label-code`, `text-badge-sm`, dst.
- Radius: `rounded`(0.25rem), `rounded-lg`, `rounded-xl`, `rounded-full` — sama dengan Stitch.

## Persyaratan mutu

- SELURUH teks, angka, dan data identik dengan HTML sumber (jangan diringkas, jangan dikarang).
- Struktur DOM & urutan kelas dipertahankan sedapat mungkin agar visual identik.
- File harus lolos TypeScript. Tidak boleh ada `any` yang jelas salah; tidak boleh ada JSX rusak.
- Jangan tinggalkan placeholder seperti `// TODO` atau komentar elipsis.
- Gunakan `export default function NamaPage()` sebagai komponen halaman.
- Tambah `"use client"` hanya bila memakai hook/event handler.
