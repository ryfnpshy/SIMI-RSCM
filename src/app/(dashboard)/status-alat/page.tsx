import { FormStatus } from "./FormStatus"
import { FormKembali } from "./FormKembali"
import { PageHeader } from "@/components/ui/PageHeader"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table } from "@/components/ui/Table"
import { requireProfil } from "@/lib/auth"
import { daftarAlat, daftarStok, daftarUnit, type BarisStok } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

export default async function StatusAlatPage({
  searchParams,
}: {
  searchParams: Promise<{ alat?: string }>
}) {
  const { alat: alatTerpilih } = await searchParams
  const profil = await requireProfil()
  const [alat, unit, baris] = await Promise.all([daftarAlat(), daftarUnit(), daftarStok()])

  // UC-03 (Perbarui Status) hanya untuk Petugas Inventori/Admin; peran lain
  // tetap boleh memantau sebaran (UC-10) tanpa form.
  const bolehUbah = profil.role_id === "admin_inventori" || profil.role_id === "petugas_inventori"

  // UC-07 lanjutan (Pengembalian ke CSSD): Unit Medis mengembalikan alat kotor
  // dari unitnya; Inventori/Admin boleh mengembalikan dari unit mana pun.
  const bolehKembalikan =
    profil.role_id === "admin_inventori" ||
    profil.role_id === "petugas_inventori" ||
    profil.role_id === "petugas_unit_medis"
  const unitMedis = unit.filter((item) => item.tipe === "unit_medis")
  const unitTetap = profil.role_id === "petugas_unit_medis" ? profil.unit_id ?? undefined : undefined
  const adaPanelKiri = bolehUbah || bolehKembalikan

  const terpilih = alat.find((item) => item.id === alatTerpilih)
  const daftarTampil = terpilih ? baris.filter((item) => item.alat?.kode_unik === terpilih.kode_unik) : baris

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Status & Sebaran Alat"
        deskripsi="Monitoring status setiap kode unik beserta sebaran jumlah per unit kerja."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Monitoring", href: "/status-alat" }, { label: "Status Alat" }]}
      />

      {terpilih && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          <span className="material-symbols-outlined text-base">filter_alt</span>
          Menampilkan sebaran <span className="font-label-code font-bold">{terpilih.kode_unik}</span> — {terpilih.nama}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {adaPanelKiri && (
          <div className="flex flex-col gap-6 xl:col-span-2">
            {bolehUbah && (
              <section className="rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-xl">published_with_changes</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Perbarui Status</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Tercatat di riwayat pergerakan</p>
                  </div>
                </div>
                <FormStatus alat={alat} unit={unit} baris={baris} alatTerpilih={alatTerpilih} />
              </section>
            )}

            {bolehKembalikan && (
              <section className="rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-xl">recycling</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Kembalikan ke CSSD</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Alat kotor diproses cuci &amp; steril ulang</p>
                  </div>
                </div>
                <FormKembali
                  alat={alat}
                  baris={baris}
                  unitMedis={unitMedis}
                  unitTetap={unitTetap}
                  alatTerpilih={alatTerpilih}
                />
              </section>
            )}
          </div>
        )}

        <section className={`flex flex-col gap-4 ${adaPanelKiri ? "xl:col-span-3" : "xl:col-span-5"}`}>
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Sebaran Stok per Unit</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {daftarTampil.length} baris lokasi dengan stok tercatat
            </p>
          </div>
          <Table<BarisStok>
            columns={[
              {
                header: "Kode Unik",
                accessor: (row) => (
                  <span className="font-label-code text-label-code font-bold text-primary">{row.alat?.kode_unik ?? "—"}</span>
                ),
              },
              { header: "Unit", accessor: (row) => row.unit?.nama ?? "—" },
              {
                header: "Jumlah",
                accessor: (row) => <span className="font-label-code font-bold">{row.jumlah}</span>,
                className: "text-center",
              },
              { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
              { header: "Kedaluwarsa Steril", accessor: (row) => tanggalSingkat(row.tanggal_kedaluwarsa) },
            ]}
            data={daftarTampil}
            keyAccessor="id"
            emptyMessage="Belum ada stok tercatat."
          />
        </section>
      </div>
    </div>
  )
}
