"use client"

import { useActionState, useState } from "react"
import { konfirmasiPenerimaan } from "@/lib/actions/inventori"
import { useAksiSelesai } from "@/components/ui/aksiKlien"
import type { BarisKeluar } from "@/lib/data"

export function FormKonfirmasi({
  transaksi,
  terpilih,
}: {
  transaksi: BarisKeluar[]
  terpilih?: string
}) {
  const [state, formAction, pending] = useActionState(konfirmasiPenerimaan, undefined)
  useAksiSelesai(state)
  const [id, setId] = useState(terpilih ?? transaksi[0]?.id ?? "")
  const dipilih = transaksi.find((item) => item.id === id)

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <input name="transaksi_id" type="hidden" value={id} />

      <div className="flex flex-col gap-1.5">
        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="pilih_transaksi">
          Transaksi Distribusi <span className="text-error">*</span>
        </label>
        <select
          className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
          id="pilih_transaksi"
          onChange={(event) => setId(event.target.value)}
          required
          value={id}
        >
          {transaksi.length === 0 && <option value="">Tidak ada transaksi menunggu konfirmasi</option>}
          {transaksi.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nomor} — {item.alat?.kode_unik} ({item.jumlah} {item.alat?.satuan ?? ""})
            </option>
          ))}
        </select>
      </div>

      {dipilih && (
        <div className="rounded-lg bg-surface-container-low p-3">
          <div className="grid grid-cols-2 gap-2 font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Kode unik</span>
            <span className="font-label-code font-bold text-primary">{dipilih.alat?.kode_unik}</span>
            <span className="text-on-surface-variant">Nama alat</span>
            <span className="text-on-surface">{dipilih.alat?.nama}</span>
            <span className="text-on-surface-variant">Jumlah dikirim</span>
            <span className="font-label-code font-bold text-on-surface">{dipilih.jumlah} {dipilih.alat?.satuan ?? ""}</span>
            <span className="text-on-surface-variant">Unit asal</span>
            <span className="text-on-surface">{dipilih.asal?.nama ?? "—"}</span>
            <span className="text-on-surface-variant">Unit tujuan</span>
            <span className="text-on-surface">{dipilih.tujuan?.nama ?? "—"}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jumlah_diterima">
            Jumlah Diterima <span className="text-error">*</span>
          </label>
          <input
            className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-label-code text-label-lg text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue={dipilih?.jumlah ?? 1}
            id="jumlah_diterima"
            key={id}
            min={1}
            name="jumlah_diterima"
            required
            type="number"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Bila kurang dari jumlah dikirim, selisih dikembalikan ke gudang dan transaksi ditandai perlu tindak lanjut.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kondisi">
            Kondisi Barang
          </label>
          <select
            className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue="baik"
            id="kondisi"
            name="kondisi"
          >
            <option value="baik">Baik / Layak Pakai</option>
            <option value="rusak">Rusak / Tidak Layak</option>
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
            placeholder="mis. 2 unit tidak terbawa, kemasan penyok"
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
          disabled={pending || transaksi.length === 0}
          type="submit"
        >
          <span className="material-symbols-outlined text-base">task_alt</span>
          {pending ? "Menyimpan..." : "Konfirmasi Penerimaan"}
        </button>
      </div>
    </form>
  )
}
