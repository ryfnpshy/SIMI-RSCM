"use client"

import { useActionState } from "react"
import { buatLaporan } from "@/lib/actions/administrasi"
import type { RingkasAlat } from "@/lib/data"
import { JENIS_LAPORAN } from "@/lib/laporan"

type UnitRingkas = { id: string; kode: string; nama: string; tipe: string }

export function FormLaporan({ unit, alat }: { unit: UnitRingkas[]; alat: RingkasAlat[] }) {
  const [state, formAction, pending] = useActionState(buatLaporan, undefined)
  const hariIni = new Date().toISOString().slice(0, 10)
  const awalBulan = `${hariIni.slice(0, 7)}-01`
  const kategori = Array.from(new Set(alat.map((item) => item.kategori))).sort()

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jenis">
          Jenis Laporan <span className="text-error">*</span>
        </label>
        <select
          className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          id="jenis"
          name="jenis"
          required
          defaultValue=""
        >
          <option disabled value="">
            Pilih jenis laporan...
          </option>
          {JENIS_LAPORAN.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="periode_mulai">
            Periode Mulai <span className="text-error">*</span>
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={awalBulan}
            id="periode_mulai"
            name="periode_mulai"
            required
            type="date"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="periode_selesai">
            Periode Selesai <span className="text-error">*</span>
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={hariIni}
            id="periode_selesai"
            name="periode_selesai"
            required
            type="date"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="unit_id">
            Unit (opsional)
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue=""
            id="unit_id"
            name="unit_id"
          >
            <option value="">Semua unit</option>
            {unit.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.kode})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kategori">
            Kategori (opsional)
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue=""
            id="kategori"
            name="kategori"
          >
            <option value="">Semua kategori</option>
            {kategori.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {state.error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label-lg text-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          <span className="material-symbols-outlined text-base">summarize</span>
          {pending ? "Menyusun..." : "Susun Laporan"}
        </button>
      </div>
    </form>
  )
}
