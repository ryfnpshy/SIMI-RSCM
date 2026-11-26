import type { NextRequest } from "next/server"
import { laporanById, ringkasanLaporan } from "@/lib/data"
import { buatPdfLaporan } from "@/lib/laporan-pdf"

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")
  if (!id) return new Response("Parameter id laporan wajib diisi.", { status: 400 })

  const laporan = await laporanById(id)
  if (!laporan) return new Response("Laporan tidak ditemukan.", { status: 404 })

  const data = await ringkasanLaporan(laporan.periode_mulai, laporan.periode_selesai, laporan.unit?.id ?? null)
  const pdf = await buatPdfLaporan(laporan, data)
  const nama = `laporan-${laporan.jenis}-${laporan.periode_mulai}.pdf`

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nama}"`,
    },
  })
}
