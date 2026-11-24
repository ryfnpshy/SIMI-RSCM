// Kebijakan akses peran (RBAC) tanpa dependensi UI, supaya bisa dipakai juga
// dari proxy (middleware) tanpa ikut membundel ikon lucide-react.
//
// RUTE di bawah adalah sumber tunggal matriks rute -> peran; menu Sidebar
// menurunkan visibilitasnya lewat peranUntukRute(). RLS tetap penjaga terakhir.

export const SEMUA_PERAN = [
  "admin_inventori",
  "petugas_inventori",
  "petugas_unit_medis",
  "petugas_sterilisasi",
] as const

export type Peran = (typeof SEMUA_PERAN)[number]

export const LABEL_PERAN: Record<Peran, string> = {
  admin_inventori: "Admin Inventori",
  petugas_inventori: "Petugas Inventori",
  petugas_unit_medis: "Petugas Unit Medis",
  petugas_sterilisasi: "Petugas Sterilisasi",
}

const ADMIN: readonly Peran[] = ["admin_inventori"]
const INVENTORI: readonly Peran[] = ["admin_inventori", "petugas_inventori"]
const CSSD: readonly Peran[] = ["admin_inventori", "petugas_sterilisasi"]
const UNIT_MEDIS: readonly Peran[] = ["admin_inventori", "petugas_unit_medis"]
const LAPORAN: readonly Peran[] = ["admin_inventori", "petugas_inventori", "petugas_sterilisasi"]

const RUTE: { rute: string; roles: readonly Peran[] }[] = [
  { rute: "/dashboard", roles: SEMUA_PERAN },
  { rute: "/data-alat", roles: ADMIN },
  { rute: "/alat-masuk", roles: INVENTORI },
  { rute: "/alat-keluar", roles: INVENTORI },
  { rute: "/status-alat", roles: SEMUA_PERAN },
  { rute: "/riwayat-pergerakan", roles: SEMUA_PERAN },
  { rute: "/batch-sterilisasi", roles: CSSD },
  { rute: "/detail-batch", roles: CSSD },
  { rute: "/konfirmasi-penerimaan", roles: UNIT_MEDIS },
  { rute: "/detail-konfirmasi", roles: UNIT_MEDIS },
  { rute: "/daftar-laporan", roles: LAPORAN },
  { rute: "/detail-laporan", roles: LAPORAN },
  { rute: "/manajemen-pengguna", roles: ADMIN },
  { rute: "/detail-pengguna", roles: ADMIN },
  { rute: "/pengaturan", roles: SEMUA_PERAN },
  { rute: "/notifikasi", roles: SEMUA_PERAN },
  { rute: "/profil", roles: SEMUA_PERAN },
]

/** Peran yang boleh membuka sebuah path, atau null bila tidak diatur khusus. */
export function peranUntukRute(pathname: string): readonly Peran[] | null {
  const cocok = RUTE.find(({ rute }) => pathname === rute || pathname.startsWith(`${rute}/`))
  return cocok?.roles ?? null
}
