import Link from "next/link"
import { FormLaporan } from "./FormLaporan"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { daftarAlat, daftarLaporan, daftarUnit, type BarisLaporan } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"
import { LABEL_LAPORAN } from "@/lib/laporan"

export default async function DaftarLaporanPage() {
  const [laporan, unit, alat] = await Promise.all([daftarLaporan(), daftarUnit(), daftarAlat()])

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Daftar Laporan"
        deskripsi="Penyusunan laporan berkala inventori dan sterilisasi untuk audit internal maupun eksternal."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Laporan", href: "/daftar-laporan" }, { label: "Daftar Laporan" }]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="xl:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
              <span className="material-symbols-outlined text-xl">summarize</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Susun Laporan</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Snapshot angka diambil saat laporan dibuka</p>
            </div>
          </div>
          <FormLaporan unit={unit} alat={alat} />
        </section>

        <section className="xl:col-span-3 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Laporan Tersimpan</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{laporan.length} laporan</p>
          </div>
          <Table<BarisLaporan>
            columns={[
              {
                header: "Jenis",
                accessor: (row) => (
                  <Link className="font-semibold text-primary hover:underline" href={`/detail-laporan?id=${row.id}`}>
                    {LABEL_LAPORAN[row.jenis] ?? row.jenis}
                  </Link>
                ),
              },
              { header: "Periode", accessor: (row) => `${tanggalSingkat(row.periode_mulai)} — ${tanggalSingkat(row.periode_selesai)}` },
              { header: "Unit", accessor: (row) => row.unit?.nama ?? "Semua unit" },
              { header: "Kategori", accessor: (row) => row.kategori ?? "Semua" },
              { header: "Disusun oleh", accessor: (row) => row.pembuat?.nama ?? "—" },
              {
                header: "Dibuat",
                accessor: (row) => <Badge variant="default">{tanggalSingkat(row.created_at)}</Badge>,
              },
            ]}
            data={laporan}
            keyAccessor="id"
            emptyMessage="Belum ada laporan tersimpan."
          />
        </section>
      </div>
    </div>
  )
}
