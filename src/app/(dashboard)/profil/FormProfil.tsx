"use client"

import { useActionState } from "react"
import { perbaruiProfil, ubahKataSandi } from "@/lib/actions/profil"
import type { Profil } from "@/lib/auth"

function Pesan({ error, pesan }: { error?: string; pesan?: string }) {
  if (error) {
    return <div className="rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">{error}</div>
  }
  if (pesan) return <div className="rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">{pesan}</div>
  return null
}

export function FormProfil({ profil }: { profil: Profil }) {
  const [stateProfil, aksiProfil, pendingProfil] = useActionState(perbaruiProfil, undefined)
  const [stateSandi, aksiSandi, pendingSandi] = useActionState(ubahKataSandi, undefined)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="mb-1 font-headline-sm text-headline-sm text-on-surface">Data Pribadi</h2>
        <p className="mb-4 font-body-sm text-body-sm text-on-surface-variant">
          Hanya nama, NIP, dan telepon yang bisa diubah sendiri. Peran dan unit ditetapkan Admin Inventori.
        </p>
        <form className="flex flex-col gap-4" action={aksiProfil}>
          <label className="flex flex-col gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface">Nama Lengkap</span>
            <input
              className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue={profil.nama}
              name="nama"
              required
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface">NIP / NIK</span>
              <input
                className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue={profil.nip ?? ""}
                name="nip"
                placeholder="opsional"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface">Telepon</span>
              <input
                className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue={profil.telepon ?? ""}
                name="telepon"
                placeholder="opsional"
              />
            </label>
          </div>
          <Pesan error={stateProfil?.error} pesan={stateProfil?.pesan} />
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label-lg text-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:opacity-70"
              disabled={pendingProfil}
              type="submit"
            >
              <span className="material-symbols-outlined text-base">save</span>
              {pendingProfil ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="mb-1 font-headline-sm text-headline-sm text-on-surface">Keamanan Akun</h2>
        <p className="mb-4 font-body-sm text-body-sm text-on-surface-variant">
          Kata sandi dikelola Supabase Auth. Ganti berkala sesuai kebijakan keamanan SIMRS.
        </p>
        <form className="flex flex-col gap-4" action={aksiSandi}>
          <label className="flex flex-col gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface">Kata Sandi Baru</span>
            <input
              className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
              minLength={6}
              name="sandi"
              required
              type="password"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface">Ulangi Kata Sandi Baru</span>
            <input
              className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
              minLength={6}
              name="ulangi"
              required
              type="password"
            />
          </label>
          <Pesan error={stateSandi?.error} pesan={stateSandi?.pesan} />
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 rounded-lg bg-surface-container px-6 py-2.5 font-label-lg text-label-lg text-on-surface shadow-sm transition-colors hover:bg-surface-container-high disabled:opacity-70"
              disabled={pendingSandi}
              type="submit"
            >
              <span className="material-symbols-outlined text-base">lock_reset</span>
              {pendingSandi ? "Menyimpan..." : "Ubah Kata Sandi"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
