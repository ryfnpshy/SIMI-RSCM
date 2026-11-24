import { FormMasuk } from "./FormMasuk"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { daftarAlat, daftarMasuk, daftarUnit, type BarisMasuk } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

export default async function AlatMasukPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; nomor?: string }>
}) {
  const { status, nomor } = await searchParams
  const [alat, unit, masuk] = await Promise.all([daftarAlat(), daftarUnit(), daftarMasuk(15)])

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Alat Masuk"
        deskripsi="Pencatatan penerimaan alat/instrumen ke gudang inventori berdasarkan kode unik."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Transaksi", href: "/alat-masuk" }, { label: "Alat Masuk" }]}
      />

      {status === "tersimpan" && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Transaksi masuk {nomor ? <span className="font-label-code font-bold">{nomor}</span> : null} berhasil dicatat dan stok
          gudang sudah ditambahkan.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="xl:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
              <span className="material-symbols-outlined text-xl">package_2</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Form Penerimaan</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Stok otomatis masuk ke unit tujuan</p>
            </div>
          </div>
          <FormMasuk alat={alat} unit={unit} />
        </section>

        <section className="xl:col-span-3 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Penerimaan Terakhir</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">15 transaksi masuk terbaru</p>
          </div>
          <Table<BarisMasuk>
            columns={[
              {
                header: "Kode Unik",
                accessor: (row) => (
                  <span className="font-label-code text-label-code font-bold text-primary">{row.alat?.kode_unik ?? "—"}</span>
                ),
              },
              { header: "Nama Alat", accessor: (row) => row.alat?.nama ?? "—" },
              { header: "Tanggal", accessor: (row) => tanggalSingkat(row.tanggal) },
              {
                header: "Jumlah",
                accessor: (row) => (
                  <span className="font-label-code font-bold">
                    +{row.jumlah} {row.alat?.satuan ?? ""}
                  </span>
                ),
                className: "text-center",
              },
              { header: "Sumber", accessor: (row) => row.sumber.replace(/_/g, " ") },
              { header: "Unit", accessor: (row) => row.unit?.nama ?? "—" },
              { header: "Petugas", accessor: (row) => row.petugas?.nama ?? "—" },
            ]}
            data={masuk}
            keyAccessor="id"
            emptyMessage="Belum ada transaksi penerimaan."
          />
        </section>
      </div>
    </div>
  )
}
