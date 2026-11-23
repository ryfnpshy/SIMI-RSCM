"use client"

import { useEffect } from "react"

export const KUNCI_FLASH = "simi-pesan-aksi"

type HasilAksi = { error?: string; pesan?: string; tujuan?: string }

function simpanPesan(pesan?: string) {
  if (!pesan) return
  try {
    sessionStorage.setItem(KUNCI_FLASH, pesan)
  } catch {
    /* storage tidak tersedia — pesan dilewati */
  }
}

/**
 * Lanjutkan hasil server action di klien dengan navigasi dokumen penuh.
 *
 * ponytail: workaround race commit router Next 16.4.6 / React 19.3.0
 * (vercel/next.js#88767, facebook/react#35399) — respons action kadang tidak
 * di-commit sehingga UI basi sampai reload manual. Navigasi dokumen penuh selalu
 * benar. Hapus modul ini saat upstream beres; saat itu server action cukup
 * memanggil `redirect()` seperti biasa.
 */
export function lanjutkanAksi(hasil: HasilAksi | undefined | void) {
  if (!hasil || hasil.error) return
  simpanPesan(hasil.pesan)
  window.location.assign(hasil.tujuan ?? window.location.href)
}

/** Hook untuk form `useActionState`: muat ulang dokumen penuh saat action selesai. */
export function useAksiSelesai(state: HasilAksi | undefined) {
  useEffect(() => {
    if (state && !state.error && (state.tujuan || state.pesan)) lanjutkanAksi(state)
  }, [state])
}
