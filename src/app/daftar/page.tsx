"use client"

import { useActionState } from "react"
import Link from "next/link"
import { daftar } from "@/lib/actions/auth"
import { useAksiSelesai } from "@/components/ui/aksiKlien"

export default function DaftarPage() {
  const [state, formAction, pending] = useActionState(daftar, undefined)
  useAksiSelesai(state)

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">badge</span>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Pengajuan Akun SIM Inventori RSCM</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              RSUP Nasional Dr. Cipto Mangunkusumo — Unit CSSD &amp; Logistik Medis
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-error-container p-3 font-body-sm text-body-sm text-on-error-container">
            {state.error}
          </div>
        )}
        {state?.pesan && (
          <div className="rounded-lg bg-primary/10 p-3 font-body-sm text-body-sm text-on-surface">
            {state.pesan}
          </div>
        )}

        <form className="space-y-4" action={formAction}>
          <label className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-on-surface">Nama Lengkap &amp; Gelar</span>
            <input
              className="rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/80 shadow-xs ring-1 ring-inset ring-outline-variant/50 outline-none transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
              name="nama"
              placeholder="mis. Dewi Kartika, A.Md.Kep"
              required
              minLength={3}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-on-surface">Email Kedinasan</span>
            <input
              className="rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/80 shadow-xs ring-1 ring-inset ring-outline-variant/50 outline-none transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
              name="email"
              type="email"
              placeholder="nama@rscm.local"
              autoComplete="username"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-on-surface">Kata Sandi</span>
            <input
              className="rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/80 shadow-xs ring-1 ring-inset ring-outline-variant/50 outline-none transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
              name="password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              required
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">Minimal 6 karakter.</span>
          </label>

          <button
            className="w-full rounded-lg bg-primary px-4 py-3 font-label-lg text-label-lg text-on-primary shadow-primary transition-all duration-150 hover:bg-primary-container hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
            type="submit"
            disabled={pending}
          >
            {pending ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Peran (Admin/Petugas) dan unit kerja ditetapkan Admin Inventori setelah email dikonfirmasi. Pengguna pertama
          sistem otomatis menjadi Admin Inventori aktif.
        </p>

        <Link className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline" href="/login">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Kembali ke halaman masuk
        </Link>
      </div>
    </main>
  )
}