"use client"

import { useEffect, useState } from "react"
import { KUNCI_FLASH } from "./aksiKlien"

/**
 * Toast pesan-sukses lintas reload: membaca `sessionStorage` setelah navigasi
 * dokumen penuh yang dipicu `lanjutkanAksi` (lihat aksiKlien.ts).
 */
export function FlashBanner() {
  const [pesan, setPesan] = useState<string | null>(null)

  useEffect(() => {
    let nilai: string | null = null
    try {
      nilai = sessionStorage.getItem(KUNCI_FLASH)
    } catch {
      /* storage tidak tersedia */
    }
    if (!nilai) return
    const isi = nilai
    // Ditunda satu tick agar tidak memicu cascading render dari dalam effect,
    // sekaligus aman terhadap double-invoke StrictMode (key baru dihapus saat ini
    // benar-benar tampil).
    const timer = setTimeout(() => {
      setPesan(isi)
      try {
        sessionStorage.removeItem(KUNCI_FLASH)
      } catch {
        /* storage tidak tersedia */
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!pesan) return
    const timer = setTimeout(() => setPesan(null), 3500)
    return () => clearTimeout(timer)
  }, [pesan])

  if (!pesan) return null
  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-lg"
      role="status"
    >
      <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
      <span className="font-body-md text-body-md">{pesan}</span>
    </div>
  )
}
