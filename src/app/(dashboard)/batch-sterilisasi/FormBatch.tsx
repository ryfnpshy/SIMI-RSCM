"use client"

import { useActionState } from "react"
import { buatBatch } from "@/lib/actions/sterilisasi"
import type { RingkasAlat } from "@/lib/data"

export function FormBatch({ alat }: { alat: RingkasAlat[] }) {
  const [state, formAction, pending] = useActionState(buatBatch, undefined)
  const reusable = alat.filter((item) => item.jenis === "reusable" && item.aktif)

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="mesin">
          Mesin Autoklaf <span className="text-error">*</span>
        </label>
        <input
          className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          id="mesin"
          name="mesin"
          placeholder="mis. Autoklaf Gravitasi A1"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="alat_ids">
          Alat dalam Batch <span className="text-error">*</span>
        </label>
        <select
          className="min-h-[180px] w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          id="alat_ids"
          multiple
          name="alat_ids"
          required
          size={8}
        >
          {reusable.map((item) => (
            <option key={item.id} value={item.id}>
              {item.kode_unik} — {item.nama}
            </option>
          ))}
        </select>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Tahan Ctrl untuk memilih beberapa alat. Semua masuk pada tahap Penerimaan Kotor.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="catatan">
          Catatan Batch
        </label>
        <input
          className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          id="catatan"
          name="catatan"
          placeholder="opsional"
        />
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
          <span className="material-symbols-outlined text-base">science</span>
          {pending ? "Membentuk..." : "Bentuk Batch"}
        </button>
      </div>
    </form>
  )
}
