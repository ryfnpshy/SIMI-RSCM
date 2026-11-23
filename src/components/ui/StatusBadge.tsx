import { cn } from "@/lib/utils"

/** Label + warna lencana untuk status alat (kolom `status` di stok_unit/riwayat_status). */
export const LABEL_STATUS: Record<string, string> = {
  tersedia: "Tersedia di Gudang",
  di_unit: "Di Unit Medis",
  dalam_proses_sterilisasi: "Dalam Proses Sterilisasi",
  perlu_resterilisasi: "Perlu Resterilisasi",
  rusak: "Rusak",
  dalam_perbaikan: "Dalam Perbaikan",
}

const TONE_STATUS: Record<string, string> = {
  tersedia: "bg-primary/10 text-primary",
  di_unit: "bg-secondary-fixed text-secondary",
  dalam_proses_sterilisasi: "bg-secondary-fixed text-secondary",
  perlu_resterilisasi: "bg-tertiary-fixed/60 text-tertiary",
  rusak: "bg-error-container text-on-error-container",
  dalam_perbaikan: "bg-tertiary-fixed/60 text-tertiary",
}

export function labelStatus(status: string | null | undefined) {
  if (!status) return "—"
  return LABEL_STATUS[status] ?? status.replace(/_/g, " ")
}

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  const kunci = status ?? ""
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-badge-sm text-badge-sm font-semibold",
        TONE_STATUS[kunci] ?? "bg-surface-container-high text-on-surface-variant",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labelStatus(status)}
    </span>
  )
}

export const LABEL_TAHAP: Record<string, string> = {
  penerimaan_kotor: "Penerimaan Kotor",
  pencucian: "Pencucian",
  pengemasan: "Pengemasan",
  sterilisasi: "Sterilisasi",
  pendinginan: "Pendinginan",
  penyimpanan: "Penyimpanan Steril",
  terdistribusi: "Terdistribusi",
  gagal: "Gagal Verifikasi",
}

export const URUTAN_TAHAP = [
  "penerimaan_kotor",
  "pencucian",
  "pengemasan",
  "sterilisasi",
  "pendinginan",
  "penyimpanan",
  "terdistribusi",
] as const

export function labelTahap(tahap: string | null | undefined) {
  if (!tahap) return "—"
  return LABEL_TAHAP[tahap] ?? tahap.replace(/_/g, " ")
}
