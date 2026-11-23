import Link from "next/link"
import { FormKonfirmasi } from "./FormKonfirmasi"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { daftarKeluar, daftarKonfirmasi, type BarisKonfirmasi } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

export default async function KonfirmasiPenerimaanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const [menunggu, riwayat] = await Promise.all([
    daftarKeluar("menunggu_konfirmasi", 50),
    daftarKonfirmasi(20),
  ])

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Konfirmasi Penerimaan"
        deskripsi="Verifikasi jumlah alat yang benar-benar diterima unit medis. Selisih otomatis dikembalikan ke gudang."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Operasional", href: "/konfirmasi-penerimaan" }, { label: "Konfirmasi" }]}
        aksi={
          <span className="flex items-center gap-2 rounded-full bg-tertiary-fixed/50 px-4 py-2 font-label-lg text-label-lg text-tertiary">
            <span className="material-symbols-outlined text-base">pending_actions</span>
            {menunggu.length} menunggu
          </span>
        }
      />

      {status === "dikonfirmasi" && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Konfirmasi penerimaan tersimpan dan status transaksi diperbarui.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="xl:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                <span className="material-symbols-outlined text-xl">fact_check</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Form Konfirmasi</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Hanya transaksi menunggu konfirmasi</p>
              </div>
            </div>
            <FormKonfirmasi transaksi={menunggu} />
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Menunggu</h2>
            <p className="mb-3 font-body-sm text-body-sm text-on-surface-variant">Klik untuk membuka detail transaksi</p>
            <div className="flex flex-col gap-2">
              {menunggu.length === 0 && (
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tidak ada transaksi menunggu.</span>
              )}
              {menunggu.map((item) => (
                <Link
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-surface p-3 transition-colors hover:bg-surface-container-low"
                  href={`/detail-konfirmasi?id=${item.id}`}
                >
                  <span className="flex flex-col">
                    <span className="font-label-code text-label-code font-bold text-primary">{item.alat?.kode_unik}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{item.nomor}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-label-code font-bold">{item.jumlah} {item.alat?.satuan ?? ""}</span>
                    <span className="material-symbols-outlined text-base text-on-surface-variant">chevron_right</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="xl:col-span-3 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Riwayat Konfirmasi</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">20 konfirmasi terakhir</p>
          </div>
          <Table<BarisKonfirmasi>
            columns={[
              {
                header: "Kode Unik",
                accessor: (row) => (
                  <span className="font-label-code text-label-code font-bold text-primary">{row.transaksi?.alat?.kode_unik ?? "—"}</span>
                ),
              },
              { header: "Tanggal", accessor: (row) => tanggalSingkat(row.created_at) },
              { header: "Dikirim", accessor: (row) => <span className="font-label-code">{row.jumlah_dikirim}</span>, className: "text-center" },
              { header: "Diterima", accessor: (row) => <span className="font-label-code font-bold">{row.jumlah_diterima}</span>, className: "text-center" },
              {
                header: "Selisih",
                accessor: (row) =>
                  row.jumlah_selisih > 0 ? (
                    <Badge variant="destructive">-{row.jumlah_selisih}</Badge>
                  ) : (
                    <Badge variant="success">pas</Badge>
                  ),
                className: "text-center",
              },
              {
                header: "Kondisi",
                accessor: (row) => (row.kondisi === "baik" ? <Badge variant="success">Baik</Badge> : <Badge variant="destructive">Rusak</Badge>),
              },
              { header: "Unit", accessor: (row) => row.transaksi?.tujuan?.nama ?? "—" },
              { header: "Petugas", accessor: (row) => row.petugas?.nama ?? "—" },
            ]}
            data={riwayat}
            keyAccessor="id"
            emptyMessage="Belum ada konfirmasi penerimaan."
          />
        </section>
      </div>
    </div>
  )
}
