"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { simpanAlat } from "@/lib/actions/inventori"
import { useAksiSelesai } from "@/components/ui/aksiKlien"
import type { AlatPenuh } from "@/lib/data"

type UnitRingkas = { id: string; kode: string; nama: string; tipe: string }
type AliasRow = { unit: string; alias: string }

const KATEGORI = [
  "Instrumen Bedah",
  "Instrumen Sterilisasi CSSD",
  "Peralatan Rawat Intensif",
  "Diagnostik & Elektromedis",
]

export function FormAlat({
  unit,
  alat,
  aliasAwal = [],
}: {
  unit: UnitRingkas[]
  alat?: AlatPenuh | null
  aliasAwal?: AliasRow[]
}) {
  const [state, formAction, pending] = useActionState(simpanAlat, undefined)
  useAksiSelesai(state)
  const [catatan, setCatatan] = useState(alat?.catatan ?? "")
  const [aktif, setAktif] = useState(alat ? alat.aktif : true)
  const [aliases, setAliases] = useState<AliasRow[]>(
    aliasAwal.length > 0 ? aliasAwal : [{ unit: unit[0]?.id ?? "", alias: "" }]
  )

  const modeUbah = Boolean(alat)

  return (
    <div className="flex flex-col w-full">
      {/* Header & Navigation */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant mb-2 font-label-md text-label-md">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/dashboard">
            <span className="material-symbols-outlined text-sm">space_dashboard</span>
            <span className="">Dashboard</span>
          </Link>
          <span className="text-on-surface-variant/40">/</span>
          <Link className="hover:text-primary transition-colors" href="/data-alat">
            Data Alat
          </Link>
          <span className="text-on-surface-variant/40">/</span>
          <span className="text-primary font-semibold">{modeUbah ? "Ubah Alat" : "Tambah Alat"}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                {modeUbah ? "Ubah Data Alat" : "Tambah Alat Baru"}
              </h1>
              <span className="px-2 py-0.5 rounded-full font-badge-sm text-badge-sm bg-surface-container text-primary font-label-code">
                {modeUbah ? alat?.kode_unik : "KAT-MED-FORM"}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Lengkapi informasi katalog inventori dan nomenklatur lokal unit medis
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-label-md text-label-md text-on-surface-variant">
              {modeUbah ? "Mode Ubah Data" : "Mode Entri Baru"}
            </span>
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="max-w-4xl w-full mx-auto mb-4 rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {state.error}
        </div>
      )}

      {/* Main Form Container */}
      <form className="max-w-4xl w-full mx-auto space-y-6" id="alatForm" action={formAction}>
        {alat && <input name="id" type="hidden" value={alat.id} />}
        <input name="aktif" type="hidden" value={aktif ? "aktif" : "nonaktif"} />

        {/* SECTION 1: Informasi Dasar */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card ring-1 ring-outline-variant/50 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">medical_services</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Informasi Dasar</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Identitas primer instrumen dan kuantitas awal sistem</p>
              </div>
            </div>
            <span className="font-label-code text-label-code bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-lg">Bagian 1/2</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kode Unik */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between" htmlFor="kode_unik">
                <span className="">Kode Unik <span className="text-error">*</span></span>
                <span className="font-label-code text-badge-sm text-on-surface-variant uppercase tracking-wider">Identitas Tunggal</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">tag</span>
                <input
                  className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                  id="kode_unik"
                  maxLength={50}
                  name="kode_unik"
                  placeholder="mis. ALT-BDH-0092"
                  required
                  type="text"
                  defaultValue={alat?.kode_unik ?? ""}
                />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Kode unik sistem pengganti barcode, maks. 50 karakter</p>
            </div>
            {/* Kategori */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kategori">
                Kategori Alat <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">category</span>
                <select
                  className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50 appearance-none cursor-pointer"
                  id="kategori"
                  name="kategori"
                  required
                  defaultValue={alat?.kategori ?? ""}
                >
                  <option disabled value="">
                    Pilih Kategori...
                  </option>
                  {KATEGORI.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-lg pointer-events-none">unfold_more</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Penentu alur siklus pemeliharaan dan validasi CSSD</p>
            </div>
            {/* Nama Resmi */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="nama">
                Nama Resmi Alat <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">label</span>
                <input
                  className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                  id="nama"
                  name="nama"
                  placeholder="mis. Gunting Jaringan Metzenbaum Lengkung 18cm"
                  required
                  type="text"
                  defaultValue={alat?.nama ?? ""}
                />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Nomenklatur baku resmi berdasarkan katalog farmasi/Kemenkes</p>
            </div>
            {/* Catatan */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-lg text-label-lg text-on-surface" htmlFor="catatan">
                  Spesifikasi &amp; Catatan
                </label>
                <span className="font-label-code text-badge-sm text-on-surface-variant">{catatan.length}/255</span>
              </div>
              <textarea
                className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50 resize-none"
                id="catatan"
                maxLength={255}
                name="catatan"
                onChange={(event) => setCatatan(event.target.value)}
                placeholder="Spesifikasi fisik, material, atau instruksi penanganan..."
                rows={3}
                value={catatan}
              />
            </div>
            {/* Jenis */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jenis">
                Jenis Aset <span className="text-error">*</span>
              </label>
              <select
                className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50 appearance-none cursor-pointer"
                id="jenis"
                name="jenis"
                defaultValue={alat?.jenis ?? "reusable"}
              >
                <option value="reusable">Reusable (wajib sterilisasi ulang)</option>
                <option value="aset">Aset tetap (tidak disterilkan rutin)</option>
              </select>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Menentukan apakah alat terhitung limit siklus sterilisasi</p>
            </div>
            {/* Satuan */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="satuan">
                Satuan <span className="text-error">*</span>
              </label>
              <input
                className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                id="satuan"
                name="satuan"
                required
                defaultValue={alat?.satuan ?? "unit"}
              />
            </div>
            {/* Merek */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="merek">
                Merek / Pabrikan
              </label>
              <input
                className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                id="merek"
                name="merek"
                defaultValue={alat?.merek ?? ""}
                placeholder="opsional"
              />
            </div>
            {/* Minimum stok */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jumlah_minimum_stok">
                Minimum Stok <span className="text-error">*</span>
              </label>
              <input
                className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                id="jumlah_minimum_stok"
                min="0"
                name="jumlah_minimum_stok"
                required
                type="number"
                defaultValue={alat?.jumlah_minimum_stok ?? 0}
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">Ambang peringatan stok pada modul notifikasi</p>
            </div>
            {/* Limit siklus */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="limit_siklus">
                Limit Siklus Sterilisasi
              </label>
              <input
                className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                id="limit_siklus"
                min="1"
                name="limit_siklus"
                placeholder="kosongkan bila tak terbatas"
                type="number"
                defaultValue={alat?.limit_siklus ?? ""}
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">Alat otomatis ditandai perlu maintenance bila terlampaui</p>
            </div>
            {/* Masa simpan */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="masa_simpan_hari">
                Masa Simpan Steril (hari)
              </label>
              <input
                className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                id="masa_simpan_hari"
                min="1"
                name="masa_simpan_hari"
                type="number"
                defaultValue={alat?.masa_simpan_hari ?? 30}
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">Dipakai sistem untuk menghitung tanggal kedaluwarsa steril</p>
            </div>
            {/* Jumlah awal */}
            {!modeUbah && (
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jumlah_awal">
                  Jumlah Awal (Saldo Gudang)
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">inventory_2</span>
                  <input
                    className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                    id="jumlah_awal"
                    min="0"
                    name="jumlah_awal"
                    type="number"
                    defaultValue={0}
                  />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Dicatat sebagai transaksi alat masuk bersumber &quot;saldo awal&quot;</p>
              </div>
            )}
            {/* Status Toggle */}
            <div className={`flex flex-col justify-between p-3.5 bg-surface-container-low rounded-xl ${modeUbah ? "" : "md:col-span-2"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-lg text-label-lg text-on-surface block">Status Operasional</span>
                  <span className={`font-body-sm text-body-sm font-medium ${aktif ? "text-primary" : "text-on-surface-variant"}`}>
                    {aktif ? "Aktif Digunakan" : "Nonaktif / Karantina"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={aktif} className="sr-only peer" id="statusToggle" onChange={(event) => setAktif(event.target.checked)} type="checkbox" />
                  <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Nonaktifkan jika alat sedang ditarik atau discontinued oleh instalasi
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Alias Nama per Unit */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card ring-1 ring-outline-variant/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">sync_alt</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Alias Nama per Unit</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Nama lokal alat sesuai penamaan tiap unit medis, supaya distribusi dan serah terima tidak salah tafsir
                </p>
              </div>
            </div>
            <span className="font-label-code text-label-code bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Bagian 2/2
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2.5 mb-4">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Satu alat bisa punya banyak sebutan di unit berbeda. Master data tetap satu, alias hanya kamus pencarian.
            </p>
          </div>
          <div className="flex flex-col gap-3" id="aliasListContainer">
            {aliases.map((row, index) => (
              <div key={index} className="alias-row flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 bg-surface rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full md:w-5/12 flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant md:hidden">Unit Medis</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base">domain</span>
                    <select
                      className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-9 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50 appearance-none cursor-pointer"
                      name="alias_unit"
                      onChange={(event) => setAliases((rows) => rows.map((r, i) => (i === index ? { ...r, unit: event.target.value } : r)))}
                      value={row.unit}
                    >
                      {unit.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama} ({item.kode})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-base pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="w-full md:w-6/12 flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant md:hidden">Alias Nomenklatur Lokal</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base">edit_note</span>
                    <input
                      className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ring-1 ring-inset ring-outline-variant/50"
                      name="alias_nama"
                      placeholder="mis. Gunting Jaringan 18cm"
                      type="text"
                      value={row.alias}
                      onChange={(event) => setAliases((rows) => rows.map((r, i) => (i === index ? { ...r, alias: event.target.value } : r)))}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/12 flex justify-end md:justify-center items-center pt-1 md:pt-0">
                  <button
                    className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors"
                    onClick={() => setAliases((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows.map((r, i) => (i === index ? { ...r, alias: "" } : r))))}
                    title="Hapus Alias"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              className="w-full py-3 px-4 rounded-xl border border-dashed border-outline-variant hover:border-primary bg-surface hover:bg-surface-container-low text-primary font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 group"
              onClick={() => setAliases((rows) => [...rows, { unit: unit[0]?.id ?? "", alias: "" }])}
              type="button"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
              <span className="">Tambah Alias</span>
            </button>
          </div>
        </section>

        {/* SECTION 3: Form Actions */}
        <div className="bg-surface-container-lowest rounded-xl shadow-card ring-1 ring-outline-variant/50 p-4 sm:p-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <Link className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-center font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2" href="/data-alat">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="">Batal</span>
          </Link>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
              type="submit"
              disabled={pending}
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span className="">{pending ? "Menyimpan..." : "Simpan Data Alat"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
