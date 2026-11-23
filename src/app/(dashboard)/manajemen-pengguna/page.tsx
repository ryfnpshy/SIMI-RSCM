import Link from "next/link"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { daftarPengguna, type BarisPengguna } from "@/lib/data"
import { LABEL_PERAN } from "@/lib/nav"

const STATUS: Record<BarisPengguna["status"], { label: string; variant: "success" | "warning" | "default" }> = {
  aktif: { label: "Aktif", variant: "success" },
  menunggu_aktivasi: { label: "Menunggu Aktivasi", variant: "warning" },
  nonaktif: { label: "Nonaktif", variant: "default" },
}

export default async function ManajemenPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>
}) {
  const { status, error } = await searchParams
  const pengguna = await daftarPengguna()
  const menunggu = pengguna.filter((item) => item.status === "menunggu_aktivasi").length

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Manajemen Pengguna"
        deskripsi="Penetapan peran RBAC dan unit kerja. Pengguna baru berstatus menunggu aktivasi sampai diaktifkan admin."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Administrasi", href: "/manajemen-pengguna" }, { label: "Pengguna" }]}
        aksi={
          <span className="flex items-center gap-2 rounded-full bg-tertiary-fixed/50 px-4 py-2 font-label-lg text-label-lg text-tertiary">
            <span className="material-symbols-outlined text-base">person_add</span>
            {menunggu} menunggu aktivasi
          </span>
        }
      />

      {status === "diaktifkan" && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Akun pengguna berhasil diaktifkan.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <Table<BarisPengguna>
        columns={[
          { header: "Nama", accessor: (row) => <span className="font-semibold">{row.nama}</span> },
          { header: "Email", accessor: (row) => <span className="break-all">{row.email}</span> },
          {
            header: "Peran",
            accessor: (row) => (
              <Badge variant="info">{LABEL_PERAN[row.role_id as keyof typeof LABEL_PERAN] ?? row.role_id}</Badge>
            ),
          },
          { header: "Unit", accessor: (row) => row.unit?.nama ?? "—" },
          { header: "Status", accessor: (row) => <Badge variant={STATUS[row.status].variant}>{STATUS[row.status].label}</Badge> },
          {
            header: "Aksi",
            accessor: (row) => (
              <Link className="font-label-lg text-label-lg text-primary hover:underline" href={`/detail-pengguna?id=${row.id}`}>
                Kelola
              </Link>
            ),
            className: "text-right",
          },
        ]}
        data={pengguna}
        keyAccessor="id"
        emptyMessage="Belum ada pengguna terdaftar."
      />
    </div>
  )
}
