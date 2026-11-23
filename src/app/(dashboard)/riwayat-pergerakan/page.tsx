import { PageHeader } from "@/components/ui/PageHeader"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { daftarRiwayat, type BarisRiwayat } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

const SUMBER: Record<BarisRiwayat["sumber"], { label: string; variant: "info" | "success" | "warning" }> = {
  manual: { label: "Manual", variant: "info" },
  transaksi: { label: "Transaksi", variant: "success" },
  sterilisasi: { label: "Sterilisasi", variant: "warning" },
}

export default async function RiwayatPergerakanPage() {
  const riwayat = await daftarRiwayat(80)

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Riwayat Pergerakan"
        deskripsi="Jejak audit setiap perubahan status alat, baik dari transaksi, proses CSSD, maupun input manual."
        remah={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Monitoring", href: "/status-alat" },
          { label: "Riwayat Pergerakan" },
        ]}
      />

      <Table<BarisRiwayat>
        columns={[
          {
            header: "Waktu",
            accessor: (row) => new Date(row.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
          },
          {
            header: "Kode Unik",
            accessor: (row) => (
              <span className="font-label-code text-label-code font-bold text-primary">{row.alat?.kode_unik ?? "—"}</span>
            ),
          },
          { header: "Nama Alat", accessor: (row) => row.alat?.nama ?? "—" },
          { header: "Unit", accessor: (row) => row.unit?.nama ?? "—" },
          { header: "Status Baru", accessor: (row) => <StatusBadge status={row.status_baru} /> },
          { header: "Sumber", accessor: (row) => <Badge variant={SUMBER[row.sumber].variant}>{SUMBER[row.sumber].label}</Badge> },
          { header: "Keterangan", accessor: (row) => row.keterangan ?? "—" },
          { header: "Petugas", accessor: (row) => row.petugas?.nama ?? "—" },
        ]}
        data={riwayat}
        keyAccessor="id"
        emptyMessage="Belum ada pergerakan status."
      />

      <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">
        Menampilkan {riwayat.length} pergerakan terakhir • tanggal acuan {tanggalSingkat(new Date().toISOString())}
      </p>
    </div>
  )
}
