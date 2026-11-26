import Link from "next/link"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { daftarAlat, cariBatch, type RingkasAlat, type BarisBatch } from "@/lib/data"

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const kata = (q ?? "").trim()

  const hasil = kata ? await Promise.all([daftarAlat(kata), cariBatch(kata)]) : null
  const alat: RingkasAlat[] = hasil?.[0] ?? []
  const batch: BarisBatch[] = hasil?.[1] ?? []

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Hasil Pencarian"
        deskripsi={kata ? `Kata kunci: "${kata}" — ${alat.length} alat, ${batch.length} batch.` : "Ketik pada kolom pencarian di bagian atas."}
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Pencarian" }]}
      />

      {!kata && (
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Masukkan kode unik, nama alat, atau nomor/mesin batch pada kolom pencarian header lalu tekan Enter.
          </p>
        </div>
      )}

      {kata && (
        <>
          <div className="mb-3 mt-4 flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Alat</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{alat.length} hasil</span>
          </div>
          <Table<RingkasAlat>
            columns={[
              {
                header: "Kode Unik",
                accessor: (row) => (
                  <Link className="font-label-code text-label-code font-bold text-primary hover:underline" href={`/status-alat?alat=${row.id}`}>
                    {row.kode_unik}
                  </Link>
                ),
              },
              { header: "Nama Alat", accessor: (row) => row.nama },
              { header: "Kategori", accessor: (row) => row.kategori },
              {
                header: "Total Stok",
                accessor: (row) => (
                  <span className="font-label-code font-bold">
                    {row.total_stok} {row.satuan}
                  </span>
                ),
                className: "text-center",
              },
              { header: "Status", accessor: (row) => (row.aktif ? <Badge variant="success">Aktif</Badge> : <Badge variant="default">Nonaktif</Badge>) },
            ]}
            data={alat}
            keyAccessor="id"
            emptyMessage="Tidak ada alat yang cocok."
          />

          <div className="mb-3 mt-8 flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Batch Sterilisasi</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{batch.length} hasil</span>
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
              { header: "Tahap", accessor: (row) => row.tahap.replace(/_/g, " ") },
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
            ]}
            data={batch}
            keyAccessor="id"
            emptyMessage="Tidak ada batch yang cocok."
          />
        </>
      )}
    </div>
  )
}
