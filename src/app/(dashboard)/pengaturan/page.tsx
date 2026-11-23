import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { requireProfil } from "@/lib/auth"
import { daftarPeran, daftarUnit, ringkasan } from "@/lib/data"
import { LABEL_PERAN } from "@/lib/nav"

type BarisAturan = { aturan: string; penjaga: string; catatan: string }

const ATURAN: BarisAturan[] = [
  {
    aturan: "Stok tidak boleh negatif dan hanya berubah lewat transaksi",
    penjaga: "Fungsi ubah_stok + trigger transaksi",
    catatan: "Semua pergerakan menghasilkan baris masuk/keluar, tidak ada edit stok langsung.",
  },
  {
    aturan: "Perubahan status wajib mengikuti matriks transisi",
    penjaga: "Tabel transisi_status + trigger riwayat_status",
    catatan: "Status seperti tersedia → rusak → tersedia tervalidasi; lompatan ilegal ditolak.",
  },
  {
    aturan: "Tahap batch CSSD tidak boleh dilompati",
    penjaga: "Trigger batch_sterilisasi",
    catatan: "Sterilisasi baru boleh setelah pengemasan; gagal verifikasi menandai alat perlu resterilisasi.",
  },
  {
    aturan: "Selisih penerimaan dikembalikan ke gudang",
    penjaga: "Trigger konfirmasi_penerimaan",
    catatan: "Selisih > 0 memicu status perlu tindak lanjut pada transaksi keluar.",
  },
  {
    aturan: "Masa simpan steril dihitung otomatis (FEFO)",
    penjaga: "Trigger penyimpanan + view kedaluwarsa",
    catatan: "Tanggal kedaluwarsa = tanggal simpan + masa_simpan_hari milik alat.",
  },
  {
    aturan: "Nomor dokumen transaksi dibangkitkan sistem",
    penjaga: "Sequence + trigger penomoran",
    catatan: "Pola TK-/TM- tahun berjalan, sehingga tidak ada nomor duplikat.",
  },
]

const KODE_GALAT: { kode: string; arti: string }[] = [
  { kode: "STOK_TIDAK_CUKUP", arti: "Jumlah keluar melebihi stok pada unit asal." },
  { kode: "KODE_DUPLIKAT", arti: "Kode unik alat sudah terdaftar." },
  { kode: "TRANSISI_TIDAK_VALID", arti: "Perubahan status melompati matriks transisi." },
  { kode: "KETERANGAN_WAJIB", arti: "Status rusak wajib disertai keterangan." },
  { kode: "AKSES_DITOLAK", arti: "Peran pengguna tidak berwenang atas aksi tersebut." },
  { kode: "DUPLIKAT_KONFIRMASI", arti: "Transaksi sudah pernah dikonfirmasi." },
]

export default async function PengaturanPage() {
  const profil = await requireProfil()
  const [unit, peran, kpi] = await Promise.all([daftarUnit(), daftarPeran(), ringkasan()])

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Pengaturan Sistem"
        deskripsi="Status integrasi, aturan bisnis yang ditegakkan database, dan kode galat yang dikenali aplikasi."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Pengaturan", href: "/pengaturan" }, { label: "Sistem" }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">Basis Data</p>
          <p className="mt-1 flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Supabase PostgreSQL
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">RLS aktif, penulisan lewat RPC SECURITY DEFINER</p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">Sesi Aktif</p>
          <p className="mt-1 font-headline-sm text-headline-sm text-on-surface">{LABEL_PERAN[profil.role_id]}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {profil.unit?.nama ?? "tanpa unit"} • status {profil.status}
          </p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">Master Referensi</p>
          <p className="mt-1 font-headline-sm text-headline-sm text-on-surface">
            {unit.length} unit • {peran.length} peran
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{kpi.jenisAlat} jenis alat aktif terdaftar</p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">Peringatan Aktif</p>
          <p className="mt-1 font-headline-sm text-headline-sm text-on-surface">{kpi.notifikasi} notifikasi</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{kpi.diBawahMinimum} jenis di bawah stok minimum</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-headline-sm text-headline-sm text-on-surface">Aturan Bisnis &amp; Penegaknya</h2>
        <Table<BarisAturan>
          columns={[
            { header: "Aturan", accessor: (row) => <span className="font-semibold">{row.aturan}</span> },
            { header: "Ditegakkan oleh", accessor: (row) => <Badge variant="info">{row.penjaga}</Badge> },
            { header: "Catatan", accessor: (row) => row.catatan },
          ]}
          data={ATURAN}
          keyAccessor="aturan"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 font-headline-sm text-headline-sm text-on-surface">Kode Galat Database</h2>
          <Table<{ kode: string; arti: string }>
            columns={[
              { header: "Kode", accessor: (row) => <span className="font-label-code text-label-code font-bold text-primary">{row.kode}</span> },
              { header: "Arti", accessor: (row) => row.arti },
            ]}
            data={KODE_GALAT}
            keyAccessor="kode"
          />
        </section>

        <section>
          <h2 className="mb-3 font-headline-sm text-headline-sm text-on-surface">Unit &amp; Peran Terdaftar</h2>
          <div className="mb-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="mb-2 font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">Unit Kerja</p>
            <div className="flex flex-wrap gap-2">
              {unit.map((item) => (
                <Badge key={item.id} variant="default">
                  {item.kode} • {item.nama}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="mb-2 font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">Peran RBAC</p>
            <div className="flex flex-wrap gap-2">
              {peran.map((item) => (
                <Badge key={item.id} variant="info">
                  {LABEL_PERAN[item.id as keyof typeof LABEL_PERAN] ?? item.nama}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
