import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { laporanById, ringkasanLaporan, type RingkasanLaporan } from "@/lib/data"
import { rupiah, tanggalSingkat } from "@/lib/utils"
import { LABEL_LAPORAN } from "@/lib/laporan"

function Kartu({ label, nilai, catatan }: { label: string; nilai: string | number; catatan?: string }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="mt-1 font-headline-lg text-headline-lg text-on-surface">{nilai}</p>
      {catatan && <p className="font-body-sm text-body-sm text-on-surface-variant">{catatan}</p>}
    </div>
  )
}

export default async function DetailLaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) notFound()

  const laporan = await laporanById(id)
  if (!laporan) notFound()

  let data: RingkasanLaporan | null = null
  let galat: string | null = null
  try {
    data = await ringkasanLaporan(laporan.periode_mulai, laporan.periode_selesai, laporan.unit?.id ?? null)
  } catch (e) {
    galat = e instanceof Error ? e.message : "Gagal menyusun ringkasan."
  }

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul={LABEL_LAPORAN[laporan.jenis] ?? laporan.jenis}
        deskripsi={`Periode ${tanggalSingkat(laporan.periode_mulai)} — ${tanggalSingkat(laporan.periode_selesai)} • ${
          laporan.unit?.nama ?? "semua unit"
        } • ${laporan.kategori ?? "semua kategori"}`}
        remah={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar Laporan", href: "/daftar-laporan" },
          { label: "Detail" },
        ]}
      />

      {galat && (
        <div className="mb-4 rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {galat}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kartu label="Transaksi Masuk" nilai={rupiah(data.masuk.transaksi)} catatan={`${rupiah(data.masuk.jumlah)} unit diterima`} />
            <Kartu
              label="Distribusi Keluar"
              nilai={rupiah(data.keluar.transaksi)}
              catatan={`${rupiah(data.keluar.jumlah)} unit dikirim • ${rupiah(data.keluar.menunggu_konfirmasi)} menunggu konfirmasi`}
            />
            <Kartu
              label="Selisih Penerimaan"
              nilai={rupiah(data.selisih_penerimaan.jumlah)}
              catatan={`${rupiah(data.selisih_penerimaan.transaksi)} transaksi tidak sesuai`}
            />
            <Kartu
              label="Batch Sterilisasi"
              nilai={rupiah(data.sterilisasi.batch)}
              catatan={`${rupiah(data.sterilisasi.lulus)} lulus • ${rupiah(data.sterilisasi.gagal)} gagal`}
            />
          </div>

          <div className="mb-6 flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Sebaran Stok per Unit</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Disusun oleh {laporan.pembuat?.nama ?? "—"} • {new Date(laporan.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>

          <Table<RingkasanLaporan["per_unit"][number]>
            columns={[
              { header: "Unit", accessor: (row) => <span className="font-semibold">{row.unit}</span> },
              { header: "Total Unit Alat", accessor: (row) => <span className="font-label-code font-bold">{rupiah(row.jumlah)}</span>, className: "text-center" },
              { header: "Jenis Alat Berbeda", accessor: (row) => rupiah(row.jenis_alat), className: "text-center" },
            ]}
            data={data.per_unit}
            keyAccessor="unit"
            emptyMessage="Tidak ada data stok pada periode ini."
          />
        </>
      )}

      <Link className="mt-4 inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:underline" href="/daftar-laporan">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Kembali ke daftar laporan
      </Link>
    </div>
  )
}
