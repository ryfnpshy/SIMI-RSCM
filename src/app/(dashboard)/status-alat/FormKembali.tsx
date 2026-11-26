"use client"

import { useActionState, useState } from "react"
import { kembalikanKeCssd } from "@/lib/actions/inventori"
import { useAksiSelesai } from "@/components/ui/aksiKlien"
import type { BarisStok, RingkasAlat } from "@/lib/data"

type UnitRingkas = { id: string; kode: string; nama: string; tipe: string }

export function FormKembali({
  alat,
  unitMedis,
  baris,
  unitTetap,
  alatTerpilih,
}: {
  alat: RingkasAlat[]
  unitMedis: UnitRingkas[]
  baris: BarisStok[]
  /** Untuk Petugas Unit Medis: unit asalnya dikunci ke unit sendiri. */
  unitTetap?: string
  alatTerpilih?: string
}) {
  const [state, formAction, pending] = useActionState(kembalikanKeCssd, undefined)
  useAksiSelesai(state)
  const [alatId, setAlatId] = useState(alatTerpilih ?? "")

  const dipilih = alat.find((item) => item.id === alatId)
  const stokUnit = (kode?: string) =>
    baris
      .filter((b) => b.alat?.kode_unik === dipilih?.kode_unik && b.unit?.kode === kode)
      .reduce((n, b) => n + b.jumlah, 0)

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kembali_alat_id">
          Alat <span className="text-error">*</span>
        </label>
        <select
          className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue={alatTerpilih ?? ""}
          id="kembali_alat_id"
          name="alat_id"
          onChange={(e) => setAlatId(e.target.value)}
          required
        >
          <option disabled value="">
            Pilih alat berdasarkan kode unik...
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
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kembali_unit_asal">
            Unit Asal <span className="text-error">*</span>
          </label>
          {unitTetap ? (
            <input name="unit_asal" type="hidden" value={unitTetap} />
          ) : null}
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
            defaultValue={unitTetap ?? unitMedis[0]?.id ?? ""}
            disabled={Boolean(unitTetap)}
            id="kembali_unit_asal"
            name={unitTetap ? undefined : "unit_asal"}
            required
          >
            {unitMedis.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.kode}) — {stokUnit(item.kode)} {dipilih?.satuan ?? "unit"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kembali_jumlah">
            Jumlah Dikembalikan <span className="text-error">*</span>
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-label-code text-label-lg text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={1}
            id="kembali_jumlah"
            min={1}
            name="jumlah"
            required
            type="number"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kembali_catatan">
            Catatan
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="kembali_catatan"
            name="catatan"
            placeholder="mis. alat kotor siap cuci, 1 set instrumen bedah"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Stok unit berkurang, alat masuk ke CSSD menunggu cuci &amp; steril ulang.
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
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label-lg text-label-lg text-on-primary shadow-primary transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 hover:bg-primary-container disabled:opacity-70"
          disabled={pending || unitMedis.length === 0}
          type="submit"
        >
          <span className="material-symbols-outlined text-base">recycling</span>
          {pending ? "Mengirim..." : "Kembalikan ke CSSD"}
        </button>
      </div>
    </form>
  )
}
