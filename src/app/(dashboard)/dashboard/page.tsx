import Link from "next/link"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { labelTahap } from "@/components/ui/StatusBadge"
import { requireProfil } from "@/lib/auth"
import { daftarBatch, daftarKeluar, daftarNotifikasi, ringkasan, type BarisKeluar } from "@/lib/data"
import { LABEL_PERAN } from "@/lib/nav"
import { rupiah, tanggalSingkat } from "@/lib/utils"

const TONE: Record<BarisKeluar["status"], { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
  menunggu_konfirmasi: { label: "Menunggu Konfirmasi", variant: "warning" },
  diterima: { label: "Diterima", variant: "success" },
  perlu_tindak_lanjut: { label: "Perlu Tindak Lanjut", variant: "destructive" },
  dibatalkan: { label: "Dibatalkan", variant: "default" },
}

function Kartu({ label, nilai, catatan, ikon }: { label: string; nilai: string; catatan: string; ikon: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-card ring-1 ring-outline-variant/50">
      <span
        className="material-symbols-outlined pointer-events-none absolute -right-3 -top-3 text-[6.5rem] leading-none text-primary/[0.055]"
        aria-hidden="true"
      >
        {ikon}
      </span>
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">{label}</p>
          <p className="mt-2 font-headline-xl text-headline-xl leading-none tabular-nums text-on-surface">{nilai}</p>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">{catatan}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
          <span className="material-symbols-outlined">{ikon}</span>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ alasan?: string }>
}) {
  const { alasan } = await searchParams
  const profil = await requireProfil()
  const [kpi, keluar, batch, notifikasi] = await Promise.all([
    ringkasan(),
    daftarKeluar(undefined, 6),
    daftarBatch(5),
    daftarNotifikasi(),
  ])

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul={`Selamat Datang, ${profil.nama}`}
        deskripsi={`${LABEL_PERAN[profil.role_id]} • ${profil.unit?.nama ?? "tanpa unit"} — sistem monitoring CSSD, instrumen bedah, dan logistik aset medis.`}
        remah={[{ label: "Beranda", href: "/dashboard" }, { label: "Dashboard" }]}
        aksi={
          <span className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-label-lg text-label-lg text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Data langsung dari Supabase
          </span>
        }
      />

      {alasan === "akses-ditolak" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          <span className="material-symbols-outlined text-xl shrink-0">lock</span>
          Peran Anda tidak berwenang membuka halaman tersebut. Menu yang tampil sudah disesuaikan.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kartu label="Jenis Alat Aktif" nilai={`${rupiah(kpi.jenisAlat)}`} catatan={`${rupiah(kpi.totalStok)} unit total tercatat`} ikon="inventory_2" />
        <Kartu
          label="Stok Gudang / Unit"
          nilai={`${rupiah(kpi.stokGudang)} / ${rupiah(kpi.stokUnit)}`}
          catatan={`${rupiah(kpi.stokCssd)} unit di CSSD`}
          ikon="warehouse"
        />
        <Kartu
          label="Menunggu Konfirmasi"
          nilai={`${rupiah(kpi.menungguKonfirmasi)}`}
          catatan={`${rupiah(kpi.perluTindakLanjut)} transaksi perlu tindak lanjut`}
          ikon="fact_check"
        />
        <Kartu
          label="Peringatan Aktif"
          nilai={`${rupiah(kpi.notifikasi)}`}
          catatan={`${rupiah(kpi.notifikasiTinggi)} prioritas tinggi • ${rupiah(kpi.diBawahMinimum)} stok minimum`}
          ikon="notifications_active"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Distribusi Terakhir</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">6 transaksi keluar terbaru</p>
            </div>
            <Link className="flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-2 font-label-lg text-label-lg text-on-surface transition-colors hover:bg-surface-container-high" href="/alat-keluar">
              <span className="material-symbols-outlined text-base">add</span>
              Distribusi
            </Link>
          </div>
          <Table<BarisKeluar>
            columns={[
              {
                header: "Kode Unik",
                accessor: (row) => <span className="font-label-code text-label-code font-bold text-primary">{row.alat?.kode_unik ?? "—"}</span>,
              },
              { header: "Tujuan", accessor: (row) => row.tujuan?.nama ?? "—" },
              { header: "Tanggal", accessor: (row) => tanggalSingkat(row.tanggal) },
              { header: "Jumlah", accessor: (row) => <span className="font-label-code font-bold">{row.jumlah}</span>, className: "text-center" },
              { header: "Status", accessor: (row) => <Badge variant={TONE[row.status].variant}>{TONE[row.status].label}</Badge> },
            ]}
            data={keluar}
            keyAccessor="id"
            emptyMessage="Belum ada distribusi tercatat."
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Peringatan</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{notifikasi.length} peringatan aktif</p>
            </div>
            <Link className="font-label-lg text-label-lg text-primary hover:underline" href="/notifikasi">
              Semua
            </Link>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            {notifikasi.length === 0 && (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Tidak ada peringatan. Stok dan masa simpan dalam batas aman.
              </span>
            )}
            {notifikasi.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-surface p-3">
                <span
                  className={`material-symbols-outlined text-lg ${
                    item.prioritas === "tinggi" ? "text-error" : item.prioritas === "sedang" ? "text-tertiary" : "text-primary"
                  }`}
                >
                  {item.prioritas === "tinggi" ? "error" : "warning"}
                </span>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface">
                    {item.kode_unik ? <span className="font-label-code font-bold text-primary">{item.kode_unik} </span> : null}
                    {item.nama ?? ""}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{item.pesan}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Batch Sterilisasi</h2>
              <Link className="font-label-lg text-label-lg text-primary hover:underline" href="/batch-sterilisasi">
                Kelola
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {batch.length === 0 && <span className="font-body-sm text-body-sm text-on-surface-variant">Belum ada batch.</span>}
              {batch.map((item) => (
                <Link
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-surface p-3 transition-colors hover:bg-surface-container-low"
                  href={`/detail-batch?id=${item.id}`}
                >
                  <span className="flex flex-col">
                    <span className="font-label-code text-label-code font-bold text-primary">{item.nomor}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{item.mesin}</span>
                  </span>
                  <Badge variant={item.tahap === "gagal" ? "destructive" : item.tahap === "terdistribusi" ? "success" : "info"}>
                    {labelTahap(item.tahap)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
