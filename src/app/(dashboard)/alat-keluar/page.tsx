import Link from "next/link"
import { FormKeluar } from "./FormKeluar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { daftarAlat, daftarKeluar, daftarUnit, type BarisKeluar } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

const TONE: Record<BarisKeluar["status"], { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
  menunggu_konfirmasi: { label: "Menunggu Konfirmasi", variant: "warning" },
  diterima: { label: "Diterima", variant: "success" },
  perlu_tindak_lanjut: { label: "Perlu Tindak Lanjut", variant: "destructive" },
  dibatalkan: { label: "Dibatalkan", variant: "default" },
}

export default async function AlatKeluarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; nomor?: string }>
}) {
  const { status, nomor } = await searchParams
  const [alat, unit, keluar] = await Promise.all([daftarAlat(), daftarUnit(), daftarKeluar(undefined, 20)])

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Alat Keluar / Distribusi"
        deskripsi="Distribusi alat steril dari gudang CSSD ke unit medis, dengan konfirmasi penerimaan di sisi unit."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Transaksi", href: "/alat-keluar" }, { label: "Distribusi" }]}
      />

      {status === "tersimpan" && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Distribusi {nomor ? <span className="font-label-code font-bold">{nomor}</span> : null} tercatat. Menunggu konfirmasi
          penerimaan dari unit tujuan.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="xl:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Form Distribusi</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Stok gudang dipotong, unit menunggu konfirmasi</p>
            </div>
          </div>
          <FormKeluar alat={alat} unit={unit} />
        </section>

        <section className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Riwayat Distribusi</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">20 transaksi keluar terbaru</p>
            </div>
            <Link
              className="flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-2 font-label-lg text-label-lg text-on-surface transition-colors hover:bg-surface-container-high"
              href="/konfirmasi-penerimaan"
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              Konfirmasi
            </Link>
          </div>
          <Table<BarisKeluar>
            columns={[
              {
                header: "Kode Unik",
                accessor: (row) => (
                  <span className="font-label-code text-label-code font-bold text-primary">{row.alat?.kode_unik ?? "—"}</span>
                ),
              },
              { header: "Tanggal", accessor: (row) => tanggalSingkat(row.tanggal) },
              { header: "Tujuan", accessor: (row) => row.tujuan?.nama ?? "—" },
              {
                header: "Jumlah",
                accessor: (row) => <span className="font-label-code font-bold">{row.jumlah} {row.alat?.satuan ?? ""}</span>,
                className: "text-center",
              },
              {
                header: "Status",
                accessor: (row) => <Badge variant={TONE[row.status].variant}>{TONE[row.status].label}</Badge>,
              },
            ]}
            data={keluar}
            keyAccessor="id"
            emptyMessage="Belum ada transaksi distribusi."
          />
        </section>
      </div>
    </div>
  )
}
