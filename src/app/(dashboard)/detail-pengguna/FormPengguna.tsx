"use client"

import { useActionState } from "react"
import Link from "next/link"
import { setPengguna } from "@/lib/actions/administrasi"
import { LABEL_PERAN } from "@/lib/nav"
import type { BarisPengguna } from "@/lib/data"

type UnitRingkas = { id: string; kode: string; nama: string; tipe: string }
type PeranRingkas = { id: string; nama: string }

export function FormPengguna({
  pengguna,
  unit,
  peran,
}: {
  pengguna: BarisPengguna
  unit: UnitRingkas[]
  peran: PeranRingkas[]
}) {
  const [state, formAction, pending] = useActionState(setPengguna, undefined)

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <input name="id" type="hidden" value={pengguna.id} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="nama">
            Nama Lengkap
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={pengguna.nama}
            id="nama"
            name="nama"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="role_id">
            Peran (RBAC) <span className="text-error">*</span>
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={pengguna.role_id}
            id="role_id"
            name="role_id"
          >
            {peran.map((item) => (
              <option key={item.id} value={item.id}>
                {LABEL_PERAN[item.id as keyof typeof LABEL_PERAN] ?? item.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="unit_id">
            Unit Kerja
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={unit.find((item) => item.nama === pengguna.unit?.nama)?.id ?? ""}
            id="unit_id"
            name="unit_id"
          >
            <option value="">— tanpa unit —</option>
            {unit.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.kode})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="status">
            Status Akun <span className="text-error">*</span>
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={pengguna.status}
            id="status"
            name="status"
          >
            <option value="menunggu_aktivasi">Menunggu Aktivasi</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="nip">
            NIP / NIK
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={pengguna.nip ?? ""}
            id="nip"
            name="nip"
            placeholder="opsional"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="telepon">
            Telepon
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={pengguna.telepon ?? ""}
            id="telepon"
            name="telepon"
            placeholder="opsional"
          />
        </div>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {state.error}
        </div>
      )}
      {state?.pesan && (
        <div className="rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">{state.pesan}</div>
      )}

      <div className="flex items-center justify-between gap-2">
        <Link className="font-label-lg text-label-lg text-primary hover:underline" href="/manajemen-pengguna">
          ← Daftar pengguna
        </Link>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label-lg text-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          <span className="material-symbols-outlined text-base">save</span>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  )
}
