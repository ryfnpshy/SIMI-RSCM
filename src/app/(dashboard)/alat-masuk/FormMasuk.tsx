"use client"

import { useActionState } from "react"
import { catatMasuk } from "@/lib/actions/inventori"
import type { RingkasAlat } from "@/lib/data"

type UnitRingkas = { id: string; kode: string; nama: string; tipe: string }

export function FormMasuk({ alat, unit }: { alat: RingkasAlat[]; unit: UnitRingkas[] }) {
  const [state, formAction, pending] = useActionState(catatMasuk, undefined)
  const gudang = unit.find((item) => item.tipe === "gudang")

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="alat_id">
          Alat <span className="text-error">*</span>
        </label>
        <select
          className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          id="alat_id"
          name="alat_id"
          required
          defaultValue=""
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
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Penelusuran memakai kode unik, bukan barcode.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jumlah">
            Jumlah Diterima <span className="text-error">*</span>
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-label-code text-label-lg text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={1}
            id="jumlah"
            min={1}
            name="jumlah"
            required
            type="number"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="tanggal">
            Tanggal Terima
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="tanggal"
            name="tanggal"
            type="date"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="sumber">
            Sumber Perolehan
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue="pemasok"
            id="sumber"
            name="sumber"
          >
            <option value="pemasok">Pemasok / Vendor</option>
            <option value="hibah">Hibah</option>
            <option value="pengembalian">Pengembalian Unit</option>
            <option value="saldo_awal">Saldo Awal</option>
            <option value="reparasi">Selesai Reparasi</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="unit_tujuan">
            Unit Tujuan
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={gudang?.id ?? ""}
            id="unit_tujuan"
            name="unit_tujuan"
          >
            {unit.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.kode})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="nomor_bast">
            Nomor BAST / Dokumen
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="nomor_bast"
            name="nomor_bast"
            placeholder="opsional"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="catatan">
            Catatan
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            id="catatan"
            name="catatan"
            placeholder="opsional"
          />
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
          <span className="material-symbols-outlined text-base">save</span>
          {pending ? "Menyimpan..." : "Catat Alat Masuk"}
        </button>
      </div>
    </form>
  )
}
