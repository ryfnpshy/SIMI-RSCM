"use client"

import { useSearchParams } from "next/navigation"

const PESAN: Record<string, string> = {
  "belum-aktif": "Akun Anda belum aktif atau telah dinonaktifkan. Hubungi Admin Inventori untuk mengaktifkannya kembali.",
  "tanpa-profil": "Profil pengguna belum terbentuk untuk akun ini. Hubungi Admin Inventori.",
}

/** Menampilkan alasan pengalihan dari proxy (mis. sesi nonaktif). */
export function AlasanBanner() {
  const alasan = useSearchParams().get("alasan")
  const pesan = alasan ? PESAN[alasan] : null
  if (!pesan) return null

  return (
    <div className="bg-tertiary-fixed/50 p-2 rounded-lg flex items-start gap-2.5 shadow-sm">
      <span className="material-symbols-outlined text-[20px] text-tertiary shrink-0 mt-0.5">info</span>
      <span className="font-body-sm text-body-sm text-on-surface">{pesan}</span>
    </div>
  )
}
