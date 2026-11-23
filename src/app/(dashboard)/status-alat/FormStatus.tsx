"use client"

import { useActionState } from "react"
import { perbaruiStatus } from "@/lib/actions/inventori"
import { LABEL_STATUS } from "@/components/ui/StatusBadge"
import type { BarisStok, RingkasAlat } from "@/lib/data"

type UnitRingkas = { id: string; kode: string; nama: string; tipe: string }

export function FormStatus({
  alat,
  unit,
  baris,
  alatTerpilih,
}: {
  alat: RingkasAlat[]
  unit: UnitRingkas[]
  baris: BarisStok[]
  alatTerpilih?: string
}) {
  const [state, formAction, pending] = useActionState(perbaruiStatus, undefined)

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="alat_id">
          Alat <span className="text-error">*</span>
        </label>
        <select
          className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue={alatTerpilih ?? ""}
          id="alat_id"
          name="alat_id"
          required
        >
          <option disabled value="">
            Pilih alat...
          </option>
          {alat.map((item) => (
            <option key={item.id} value={item.id}>
              {item.kode_unik} — {item.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="unit_id">
            Lokasi / Unit <span className="text-error">*</span>
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="unit_id"
            name="unit_id"
            required
            defaultValue=""
          >
            <option disabled value="">
              Pilih unit...
            </option>
            {unit.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.kode}) — {baris.filter((b) => b.unit?.kode === item.kode).reduce((n, b) => n + b.jumlah, 0)} unit
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="status">
            Status Baru <span className="text-error">*</span>
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="status"
            name="status"
            required
            defaultValue=""
          >
            <option disabled value="">
              Pilih status...
            </option>
            {Object.entries(LABEL_STATUS).map(([nilai, label]) => (
              <option key={nilai} value={nilai}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="keterangan">
            Keterangan
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="keterangan"
            name="keterangan"
            placeholder="Wajib diisi bila status berubah menjadi rusak"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Perubahan status divalidasi terhadap matriks transisi; lompatan status ilegal akan ditolak database.
          </p>
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

      <div className="flex items-center justify-end gap-2">
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label-lg text-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          <span className="material-symbols-outlined text-base">published_with_changes</span>
          {pending ? "Menyimpan..." : "Perbarui Status"}
        </button>
      </div>
    </form>
  )
}
