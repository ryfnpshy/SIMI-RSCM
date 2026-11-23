import Link from "next/link"
import { FormBatch } from "./FormBatch"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { labelTahap, URUTAN_TAHAP } from "@/components/ui/StatusBadge"
import { daftarAlat, daftarBatch, type BarisBatch } from "@/lib/data"

function BadgeTahap({ tahap }: { tahap: string }) {
  if (tahap === "gagal") return <Badge variant="destructive">Gagal Verifikasi</Badge>
  const index = URUTAN_TAHAP.indexOf(tahap as (typeof URUTAN_TAHAP)[number])
  const variant = index >= 6 ? "success" : index >= 3 ? "info" : "warning"
  return <Badge variant={variant}>{labelTahap(tahap)}</Badge>
}

export default async function BatchSterilisasiPage() {
  const [alat, batch] = await Promise.all([daftarAlat(), daftarBatch(30)])

  const berjalan = batch.filter((item) => item.tahap !== "terdistribusi" && item.tahap !== "gagal").length
  const gagal = batch.filter((item) => item.hasil_verifikasi === "gagal").length

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Batch Sterilisasi"
        deskripsi="Pipeline CSSD: penerimaan kotor → pencucian → pengemasan → sterilisasi → pendinginan → penyimpanan."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Operasional CSSD", href: "/batch-sterilisasi" }, { label: "Batch Sterilisasi" }]}
        aksi={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-2 font-label-lg text-label-lg text-secondary">
              <span className="material-symbols-outlined text-base">autorenew</span>
              {berjalan} berjalan
            </span>
            <span className="flex items-center gap-2 rounded-full bg-error-container px-4 py-2 font-label-lg text-label-lg text-on-error-container">
              <span className="material-symbols-outlined text-base">error</span>
              {gagal} gagal
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="xl:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
              <span className="material-symbols-outlined text-xl">science</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Bentuk Batch Baru</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Instrumen reusable dikelompokkan per siklus</p>
            </div>
          </div>
          <FormBatch alat={alat} />
        </section>

        <section className="xl:col-span-3 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Batch</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">30 batch terbaru • klik untuk memajukan tahap</p>
          </div>
          <Table<BarisBatch>
            columns={[
              {
                header: "Nomor Batch",
                accessor: (row) => (
                  <Link className="font-label-code text-label-code font-bold text-primary hover:underline" href={`/detail-batch?id=${row.id}`}>
                    {row.nomor}
                  </Link>
                ),
              },
              { header: "Mesin", accessor: (row) => row.mesin },
              { header: "Tahap", accessor: (row) => <BadgeTahap tahap={row.tahap} /> },
              {
                header: "Verifikasi",
                accessor: (row) =>
                  row.hasil_verifikasi === "lulus" ? (
                    <Badge variant="success">Lulus</Badge>
                  ) : row.hasil_verifikasi === "gagal" ? (
                    <Badge variant="destructive">Gagal</Badge>
                  ) : (
                    <Badge variant="default">Belum diuji</Badge>
                  ),
              },
              { header: "Petugas", accessor: (row) => row.pembuat?.nama ?? "—" },
            ]}
            data={batch}
            keyAccessor="id"
            emptyMessage="Belum ada batch sterilisasi."
          />
        </section>
      </div>
    </div>
  )
}
