import Link from "next/link"
import { PageHeader } from "@/components/ui/PageHeader"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import {
  daftarRiwayat,
  daftarRiwayatGerak,
  daftarUnit,
  type BarisGerak,
  type BarisRiwayat,
} from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

const SUMBER: Record<BarisRiwayat["sumber"], { label: string; variant: "info" | "success" | "warning" }> = {
  manual: { label: "Manual", variant: "info" },
  transaksi: { label: "Transaksi", variant: "success" },
  sterilisasi: { label: "Sterilisasi", variant: "warning" },
}

const JENIS: Record<BarisGerak["jenis"], { label: string; variant: "success" | "info" | "warning" }> = {
  Penerimaan: { label: "Penerimaan", variant: "success" },
  Distribusi: { label: "Distribusi", variant: "info" },
  "Konfirmasi Penerimaan": { label: "Konfirmasi", variant: "warning" },
}

const kelasInput =
  "w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"

export default async function RiwayatPergerakanPage({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string; unit?: string; mulai?: string; selesai?: string }>
}) {
  const { kode, unit, mulai, selesai } = await searchParams
  const [gerak, riwayat, unitList] = await Promise.all([
    daftarRiwayatGerak({ kode, unit, mulai, selesai, batas: 100 }),
    daftarRiwayat(80),
    daftarUnit(),
  ])
  const adaFilter = Boolean(kode || unit || mulai || selesai)

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Riwayat Pergerakan"
        deskripsi="Jejak audit penerimaan, distribusi, konfirmasi penerimaan, dan perubahan status alat."
        remah={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Monitoring", href: "/status-alat" },
          { label: "Riwayat Pergerakan" },
        ]}
      />

      <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
        <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="kode">
            Kode Unik / Nama / Nomor
          </label>
          <input className={kelasInput} defaultValue={kode ?? ""} id="kode" name="kode" placeholder="mis. ALT-BDH-001" />
        </div>
        <div className="flex min-w-[10rem] flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="unit">
            Unit
          </label>
          <select className={kelasInput} defaultValue={unit ?? ""} id="unit" name="unit">
            <option value="">Semua unit</option>
            {unitList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.kode})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="mulai">
            Dari
          </label>
          <input className={kelasInput} defaultValue={mulai ?? ""} id="mulai" name="mulai" type="date" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="selesai">
            Sampai
          </label>
          <input className={kelasInput} defaultValue={selesai ?? ""} id="selesai" name="selesai" type="date" />
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-lg text-label-lg text-on-primary shadow-primary transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 hover:bg-primary-container"
          type="submit"
        >
          <span className="material-symbols-outlined text-base">search</span>
          Terapkan
        </button>
        {adaFilter && (
          <Link className="font-label-lg text-label-lg text-primary hover:underline" href="/riwayat-pergerakan">
            Reset
          </Link>
        )}
      </form>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Pergerakan Alat</h2>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {gerak.length} transaksi{adaFilter ? " sesuai filter" : ""}
        </span>
      </div>
      <Table<BarisGerak>
        columns={[
          {
            header: "Waktu",
            accessor: (row) => new Date(row.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
          },
          {
            header: "Jenis",
            accessor: (row) => <Badge variant={JENIS[row.jenis].variant}>{JENIS[row.jenis].label}</Badge>,
          },
          {
            header: "Nomor",
            accessor: (row) =>
              row.jenis === "Konfirmasi Penerimaan" ? (
                <Link className="font-label-code text-label-code font-bold text-primary hover:underline" href={`/detail-konfirmasi?id=${row.ref_id}`}>
                  {row.nomor}
                </Link>
              ) : (
                <span className="font-label-code text-label-code">{row.nomor}</span>
              ),
          },
          {
            header: "Kode Unik",
            accessor: (row) => (
              <span className="font-label-code text-label-code font-bold text-primary">{row.kode_unik}</span>
            ),
          },
          { header: "Nama Alat", accessor: (row) => row.nama_alat },
          {
            header: "Asal → Tujuan",
            accessor: (row) => (
              <span className="font-body-sm text-body-sm">
                {row.asal ?? "—"} <span className="text-on-surface-variant">→</span> {row.tujuan ?? "—"}
              </span>
            ),
          },
          {
            header: "Jumlah",
            accessor: (row) => (
              <span className="font-label-code font-bold">
                {row.jumlah} {row.satuan}
              </span>
            ),
            className: "text-center",
          },
          { header: "Keterangan", accessor: (row) => row.keterangan ?? "—" },
          { header: "Petugas", accessor: (row) => row.pengguna ?? "—" },
        ]}
        data={gerak}
        keyAccessor="id"
        emptyMessage={adaFilter ? "Tidak ada catatan yang sesuai filter." : "Belum ada pergerakan transaksi."}
      />

      <div className="mt-8 mb-3">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Perubahan Status</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Jejak status stok alat per unit.</p>
      </div>
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
        Menampilkan {gerak.length} pergerakan transaksi dan {riwayat.length} perubahan status terakhir • tanggal acuan{" "}
        {tanggalSingkat(new Date().toISOString())}
      </p>
    </div>
  )
}
