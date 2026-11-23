/** Jenis laporan — harus sama dengan constraint `laporan_jenis_check` di database. */
export const JENIS_LAPORAN = [
  { value: "stok", label: "Laporan Stok & Sebaran Per Unit" },
  { value: "masuk", label: "Laporan Penerimaan Alat Masuk" },
  { value: "keluar", label: "Laporan Distribusi Alat Keluar" },
  { value: "status", label: "Laporan Status & Siklus Alat" },
  { value: "sterilisasi", label: "Laporan Kinerja Sterilisasi" },
  { value: "distribusi_unit", label: "Laporan Distribusi per Unit" },
] as const

export const LABEL_LAPORAN: Record<string, string> = {
  stok: "Stok & Sebaran",
  masuk: "Penerimaan Masuk",
  keluar: "Distribusi Keluar",
  status: "Status & Siklus",
  sterilisasi: "Kinerja Sterilisasi",
  distribusi_unit: "Distribusi per Unit",
}
