import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type Color } from "pdf-lib"
import type { BarisLaporan, RingkasanLaporan } from "@/lib/data"
import { LABEL_LAPORAN } from "@/lib/laporan"
import { rupiah, tanggalSingkat } from "@/lib/utils"

const A4: [number, number] = [595.28, 841.89]
const MARGIN = 48
const LEBAR = A4[0] - MARGIN * 2

// Font standar PDF (WinAnsi) tidak mengenal sebagian tanda baca Unicode, jadi
// disamakan dulu supaya drawText tidak melempar error encoding.
function aman(teks: string) {
  return teks
    .replace(/[\u00A0\u2007\u2009\u202F]/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u00B7]/g, "-")
    .replace(/[^\x20-\xFF]/g, "")
}

function potong(teks: string, font: PDFFont, size: number, lebar: number) {
  let s = aman(teks)
  if (font.widthOfTextAtSize(s, size) <= lebar) return s
  while (s.length > 1 && font.widthOfTextAtSize(s + "...", size) > lebar) s = s.slice(0, -1)
  return s + "..."
}

export async function buatPdfLaporan(laporan: BarisLaporan, data: RingkasanLaporan): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const ink = rgb(0.09, 0.11, 0.13)
  const redup = rgb(0.42, 0.44, 0.47)
  const aksen = rgb(0, 0.36, 0.32)
  const garisWarna = rgb(0.84, 0.86, 0.87)

  let page: PDFPage = pdf.addPage(A4)
  let y = A4[1] - MARGIN

  const ruang = (n: number) => {
    if (y - n < MARGIN + 30) {
      page = pdf.addPage(A4)
      y = A4[1] - MARGIN
    }
  }

  const tulis = (
    teks: string,
    opt: { size?: number; f?: PDFFont; c?: Color; x?: number; gap?: number } = {}
  ) => {
    const size = opt.size ?? 10
    const f = opt.f ?? font
    ruang(size + 4)
    page.drawText(aman(teks), { x: opt.x ?? MARGIN, y, size, font: f, color: opt.c ?? ink })
    y -= opt.gap ?? size + 5
  }

  const paragraf = (teks: string, opt: { size?: number; f?: PDFFont; c?: Color; gap?: number } = {}) => {
    const size = opt.size ?? 9
    const f = opt.f ?? font
    let cur = ""
    for (const w of aman(teks).split(/\s+/)) {
      const coba = cur ? `${cur} ${w}` : w
      if (cur && f.widthOfTextAtSize(coba, size) > LEBAR) {
        tulis(cur, { size, f, c: opt.c })
        cur = w
      } else {
        cur = coba
      }
    }
    if (cur) tulis(cur, { size, f, c: opt.c })
    y -= opt.gap ?? 3
  }

  const garis = () => {
    ruang(10)
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4[0] - MARGIN, y },
      thickness: 0.7,
      color: garisWarna,
    })
    y -= 14
  }

  const judul = (teks: string) => {
    ruang(30)
    tulis(teks, { size: 12, f: bold, c: aksen, gap: 16 })
  }

  // ------------------------------------------------------------------ kop
  tulis("RSUP Nasional Dr. Cipto Mangunkusumo", { size: 9.5, f: bold, c: aksen, gap: 13 })
  tulis("SIMI-RSCM - Sistem Informasi Manajemen Inventori CSSD & Logistik Medis", { size: 8.5, c: redup, gap: 18 })
  tulis(LABEL_LAPORAN[laporan.jenis] ?? laporan.jenis, { size: 17, f: bold, gap: 22 })

  const meta: [string, string][] = [
    ["Periode", `${tanggalSingkat(laporan.periode_mulai)} - ${tanggalSingkat(laporan.periode_selesai)}`],
    ["Unit", laporan.unit?.nama ?? "Semua unit"],
    ["Kategori", laporan.kategori ?? "Semua kategori"],
    ["Disusun oleh", laporan.pembuat?.nama ?? "-"],
    ["Waktu dibuat", new Date(laporan.created_at).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })],
  ]
  for (const [k, v] of meta) {
    ruang(16)
    page.drawText(aman(k), { x: MARGIN, y, size: 9, font: bold, color: redup })
    page.drawText(aman(v), { x: MARGIN + 110, y, size: 9.5, font, color: ink })
    y -= 14
  }
  y -= 2
  garis()

  // -------------------------------------------------------- ringkasan angka
  judul("Ringkasan Angka")
  const metrik: [string, string, string][] = [
    [
      "Transaksi Masuk",
      `${rupiah(data.masuk.transaksi)} transaksi`,
      `Tercatat ${rupiah(data.masuk.jumlah)} unit alat yang diterima pada periode ini. Angka merangkum seluruh transaksi penerimaan ke gudang, CSSD, maupun unit tujuan sesuai filter laporan.`,
    ],
    [
      "Distribusi Keluar",
      `${rupiah(data.keluar.transaksi)} transaksi`,
      `Sebanyak ${rupiah(data.keluar.jumlah)} unit alat didistribusikan ke unit tujuan. Dari jumlah tersebut, ${rupiah(data.keluar.menunggu_konfirmasi)} transaksi masih menunggu konfirmasi penerimaan di sisi unit.`,
    ],
    [
      "Selisih Penerimaan",
      `${rupiah(data.selisih_penerimaan.jumlah)} unit`,
      `${rupiah(data.selisih_penerimaan.transaksi)} transaksi memiliki selisih antara jumlah dikirim dan jumlah diterima. Selisih ini otomatis dikembalikan ke unit asal dan ditandai perlu tindak lanjut.`,
    ],
    [
      "Batch Sterilisasi",
      `${rupiah(data.sterilisasi.batch)} batch`,
      `Dari ${rupiah(data.sterilisasi.batch)} batch yang dibentuk, ${rupiah(data.sterilisasi.lulus)} lulus uji mutu (indikator Bowie-Dick dan biologis terpenuhi) dan ${rupiah(data.sterilisasi.gagal)} gagal sehingga alatnya wajib disterilkan ulang.`,
    ],
  ]
  for (const [label, nilai, ket] of metrik) {
    ruang(50)
    page.drawText(aman(label), { x: MARGIN, y, size: 10.5, font: bold, color: ink })
    const wn = bold.widthOfTextAtSize(aman(nilai), 11)
    page.drawText(aman(nilai), { x: A4[0] - MARGIN - wn, y, size: 11, font: bold, color: aksen })
    y -= 15
    paragraf(ket, { size: 9, c: redup, gap: 10 })
  }

  // ------------------------------------------------------ sebaran per unit
  judul("Sebaran Stok per Unit")
  if (data.per_unit.length === 0) {
    tulis("Tidak ada data stok pada periode ini.", { c: redup, gap: 8 })
  } else {
    ruang(24)
    page.drawText("Unit", { x: MARGIN, y, size: 9, font: bold, color: redup })
    page.drawText("Total Unit Alat", { x: A4[0] - MARGIN - 170, y, size: 9, font: bold, color: redup })
    page.drawText("Jenis Alat", { x: A4[0] - MARGIN - 70, y, size: 9, font: bold, color: redup })
    y -= 4
    garis()
    for (const r of data.per_unit) {
      ruang(16)
      page.drawText(potong(r.unit, font, 10, LEBAR - 190), { x: MARGIN, y, size: 10, font, color: ink })
      page.drawText(rupiah(r.jumlah), { x: A4[0] - MARGIN - 170, y, size: 10, font: bold, color: ink })
      page.drawText(rupiah(r.jenis_alat), { x: A4[0] - MARGIN - 70, y, size: 10, font, color: ink })
      y -= 15
    }
    y -= 6
  }

  // ---------------------------------------------------------------- catatan
  judul("Catatan Metodologi")
  paragraf(
    "Angka pada laporan ini diambil dari snapshot basis data pada saat laporan dibuka. Cakupan mengikuti periode, unit, dan kategori yang dipilih saat penyusunan. Batch sterilisasi dihitung berdasarkan tanggal dibuatnya batch, sedangkan penerimaan dan distribusi dihitung berdasarkan tanggal transaksi."
  )

  // ---------------------------------------------------------------- footer
  const halaman = pdf.getPages()
  halaman.forEach((p, i) => {
    p.drawText(aman(`SIMI-RSCM - dicetak ${new Date().toLocaleString("id-ID")}`), {
      x: MARGIN,
      y: MARGIN - 20,
      size: 8,
      font,
      color: redup,
    })
    const label = `Halaman ${i + 1} dari ${halaman.length}`
    const w = font.widthOfTextAtSize(aman(label), 8)
    p.drawText(aman(label), { x: A4[0] - MARGIN - w, y: MARGIN - 20, size: 8, font, color: redup })
  })

  return pdf.save()
}
