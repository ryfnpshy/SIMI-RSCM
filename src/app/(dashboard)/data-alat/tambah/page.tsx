"use client"

import { useState } from "react"

type AliasRow = {
  unit: string
  alias: string
  placeholder: string
}

const unitOptions = [
  { value: "IBS", label: "Instalasi Bedah Sentral (IBS / OK)" },
  { value: "ICU", label: "Intensive Care Unit (ICU)" },
  { value: "IGD", label: "Instalasi Gawat Darurat (IGD)" },
  { value: "CSSD", label: "Sterilisasi Pusat (CSSD)" },
  { value: "RAWAT_INAP", label: "Rawat Inap Bedah" },
  { value: "POLIKLINIK", label: "Poliklinik Spesialis" },
]

const initialAliases: AliasRow[] = [
  { unit: "IBS", alias: "Surgical Curved Scissors", placeholder: "Nomenklatur lokal..." },
  { unit: "ICU", alias: "Gunting Jaringan 18cm", placeholder: "Nomenklatur lokal..." },
  { unit: "IGD", alias: "Metzenbaum Scissor Mayo", placeholder: "Nomenklatur lokal..." },
]

export default function TambahAlatPage() {
  const [description, setDescription] = useState(
    "Material Stainless Steel grade bedah AISI 410, bilah melengkung ujung tumpul."
  )
  const [isActive, setIsActive] = useState(true)
  const [aliases, setAliases] = useState<AliasRow[]>(initialAliases)

  const addAliasRow = () => {
    setAliases((rows) => [
      ...rows,
      { unit: "RAWAT_INAP", alias: "", placeholder: "Contoh: Metzenbaum Tipis / Gunting Rawat..." },
    ])
  }

  const removeAliasRow = (index: number) => {
    setAliases((rows) => {
      if (rows.length > 1) {
        return rows.filter((_, i) => i !== index)
      }
      return rows.map((row, i) => (i === index ? { ...row, alias: "" } : row))
    })
  }

  const updateAlias = (index: number, alias: string) => {
    setAliases((rows) => rows.map((row, i) => (i === index ? { ...row, alias } : row)))
  }

  const updateAliasUnit = (index: number, unit: string) => {
    setAliases((rows) => rows.map((row, i) => (i === index ? { ...row, unit } : row)))
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header & Navigation */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant mb-2 font-label-md text-label-md">
          <a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
            <span className="material-symbols-outlined text-sm">space_dashboard</span>
            <span className="">Dashboard</span>
          </a>
          <span className="text-on-surface-variant/40">/</span>
          <a className="hover:text-primary transition-colors" href="#">Data Alat</a>
          <span className="text-on-surface-variant/40">/</span>
          <span className="text-primary font-semibold">Tambah Alat</span>
        </nav>
        {/* Page Title & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Tambah Alat Baru</h1>
              <span className="px-2 py-0.5 rounded-full font-badge-sm text-badge-sm bg-surface-container text-primary font-label-code">
                KAT-MED-FORM
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Lengkapi informasi katalog inventori dan nomenklatur lokal unit medis
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="font-label-md text-label-md text-on-surface-variant">Mode Entri Baru</span>
          </div>
        </div>
      </div>
      {/* Main Form Container */}
      <form
        className="max-w-4xl w-full mx-auto space-y-6"
        id="alatForm"
        onSubmit={(event) => event.preventDefault()}
      >
        {/* SECTION 1: Informasi Dasar */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-8">
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
            {/* Kode Alat */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between" htmlFor="kodeAlat">
                <span className="">Kode Alat <span className="text-error">*</span></span>
                <span className="font-label-code text-badge-sm text-on-surface-variant uppercase tracking-wider">Auto-Barcode</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">qr_code_2</span>
                <input className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="kodeAlat" maxLength={50} name="kodeAlat" placeholder="e.g. ALT-BDH-0092" required type="text" defaultValue="ALT-BDH-0092" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Kode unik sistem, maks. 50 karakter</p>
            </div>
            {/* Kategori */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="kategoriAlat">
                Kategori Instrumen <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">category</span>
                <select className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" id="kategoriAlat" name="kategoriAlat" required defaultValue="bedah">
                  <option disabled value="">Pilih Kategori...</option>
                  <option value="bedah">Instrumen Bedah</option>
                  <option value="cssd">Instrumen Sterilisasi CSSD</option>
                  <option value="icu">Peralatan Rawat Intensif (ICU)</option>
                  <option value="elektromedis">Diagnostik &amp; Elektromedis</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-lg pointer-events-none">unfold_more</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Penentu alur siklus pemeliharaan dan validasi CSSD</p>
            </div>
            {/* Nama Resmi Alat */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="namaAlat">
                Nama Resmi Alat <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">label</span>
                <input className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="namaAlat" name="namaAlat" placeholder="e.g. Gunting Jaringan Metzenbaum Lengkung 18cm" required type="text" defaultValue="Gunting Jaringan Metzenbaum Lengkung 18cm" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Nomenklatur baku resmi berdasarkan katalog farmasi/Kemenkes</p>
            </div>
            {/* Deskripsi */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-lg text-label-lg text-on-surface" htmlFor="deskripsi">Spesifikasi &amp; Deskripsi Fisik</label>
                <span className="font-label-code text-badge-sm text-on-surface-variant" id="charCount">{description.length}/255</span>
              </div>
              <textarea className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none" id="deskripsi" maxLength={255} name="deskripsi" onChange={(event) => setDescription(event.target.value)} placeholder="Deskripsi spesifikasi fisik, material, atau instruksi penanganan..." rows={3} value={description} />
              <p className="font-body-sm text-body-sm text-on-surface-variant">Catatan teknis dimensi, ketahanan autoclave, atau peringatan penggunaan</p>
            </div>
            {/* Jumlah Awal */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="jumlahAwal">
                Jumlah Awal (Unit) <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">inventory_2</span>
                <input className="w-full bg-surface-container-lowest font-label-code text-label-lg text-on-surface pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="jumlahAwal" min="0" name="jumlahAwal" required type="number" defaultValue="10" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Stok fisik batch pertama saat registrasi ke sistem</p>
            </div>
            {/* Status Toggle */}
            <div className="flex flex-col justify-between p-3.5 bg-surface-container-low rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-lg text-label-lg text-on-surface block">Status Operasional</span>
                  <span className={`font-body-sm text-body-sm font-medium ${isActive ? "text-primary" : "text-on-surface-variant"}`} id="statusLabel">
                    {isActive ? "Aktif Digunakan" : "Nonaktif / Karantina"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={isActive} className="sr-only peer" id="statusToggle" onChange={(event) => setIsActive(event.target.checked)} type="checkbox" />
                  <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Nonaktifkan jika alat sedang ditarik atau discontinued oleh instalasi
              </p>
            </div>
          </div>
        </section>
        {/* SECTION 2: Alias Nama per Unit (Repeatable Row List) */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">sync_alt</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Alias Nama per Unit</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tambahkan nama lokal alat ini sesuai penamaan di tiap unit medis (contoh: Unit ICU menyebut &apos;Gunting Jaringan&apos;, OK menyebut &apos;Surgical Scissors&apos;)
                </p>
              </div>
            </div>
            <span className="font-label-code text-label-code bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Bagian 2/2
            </span>
          </div>
          {/* Quick Guidance Banner */}
          <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2.5 mb-4">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Penyelarasan nama lokal mempermudah perawat dan teknisi saat melakukan distribusi instrumen atau serah terima CSSD tanpa merusak master data.
            </p>
          </div>
          {/* Repeatable List Container (STRICTLY ROW CARDS, NOT A TABLE) */}
          <div className="flex flex-col gap-3" id="aliasListContainer">
            {aliases.map((row, index) => (
              <div key={index} className="alias-row flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 bg-surface rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full md:w-5/12 flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant md:hidden">Unit Medis</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base">domain</span>
                    <select className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-9 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" name="unitName[]" value={row.unit} onChange={(event) => updateAliasUnit(index, event.target.value)}>
                      {unitOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-base pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="w-full md:w-6/12 flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant md:hidden">Alias Nomenklatur Lokal</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base">edit_note</span>
                    <input className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" name="unitAlias[]" placeholder={row.placeholder} type="text" value={row.alias} onChange={(event) => updateAlias(index, event.target.value)} />
                  </div>
                </div>
                <div className="w-full md:w-1/12 flex justify-end md:justify-center items-center pt-1 md:pt-0">
                  <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors" onClick={() => removeAliasRow(index)} title="Hapus Alias" type="button">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Add Alias Button (Dashed secondary button style positioned directly below the list) */}
          <div className="mt-4">
            <button className="w-full py-3 px-4 rounded-xl border border-dashed border-outline-variant hover:border-primary bg-surface hover:bg-surface-container-low text-primary font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 group" onClick={addAliasRow} type="button">
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
              <span className="">Tambah Alias</span>
            </button>
          </div>
        </section>
        {/* SECTION 3: Form Actions */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <a className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-center font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2" href="#">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="">Batal</span>
          </a>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-lg text-label-lg transition-colors" type="button">
              <span className="material-symbols-outlined text-base">visibility</span>
              <span className="">Pratinjau Label</span>
            </button>
            <button className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors shadow-sm flex items-center justify-center gap-2" type="submit">
              <span className="material-symbols-outlined text-base">save</span>
              <span className="">Simpan Data Alat</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
