"use client"

import { useState, type ReactNode } from "react"
import { lanjutkanAksi } from "./aksiKlien"

type Hasil = { error?: string; pesan?: string; tujuan?: string }

/**
 * Form yang menjalankan server action lalu memuat ulang dokumen penuh ke `tujuan`.
 * Lihat alasan di aksiKlien.ts (race commit router Next 16 / react#35399).
 *
 * ponytail: hapus komponen ini saat upstream beres; saat itu server action cukup
 * memanggil `redirect()` seperti biasa.
 */
export function AksiForm({
  aksi,
  className,
  children,
}: {
  aksi: (fd: FormData) => Promise<Hasil>
  className?: string
  children: ReactNode
}) {
  const [pesan, setPesan] = useState("")

  return (
    <form
      className={className}
      action={async (fd: FormData) => {
        setPesan("")
        const hasil = (await aksi(fd)) ?? {}
        if (hasil.error) {
          setPesan(hasil.error)
          return
        }
        lanjutkanAksi(hasil)
      }}
    >
      {children}
      {pesan && (
        <p className="mt-2 rounded-lg bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
          {pesan}
        </p>
      )}
    </form>
  )
}
