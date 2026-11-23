"use client"

import { useEffect, useState } from "react"

export default function StatusAlatPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-on-surface font-semibold">Status Alat</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Status Alat</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-code text-label-code">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                2,418 Aset Terdata
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Pemantauan real-time kondisi, lokasi unit, dan riwayat pembaruan status instrumen medis secara komprehensif.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all" onClick={() => setModalOpen((open) => !open)} type="button">
              <span className="material-symbols-outlined text-lg">edit_document</span>
              <span>+ Perbarui Status</span>
            </button>
            <button className="inline-flex items-center justify-center p-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant shadow-sm hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
              <span className="material-symbols-outlined text-xl">tune</span>
            </button>
            <button className="inline-flex items-center justify-center p-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant shadow-sm hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
              <span className="material-symbols-outlined text-xl">download</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
              Tersedia
              <span className="w-2 h-2 rounded-full bg-primary"></span>
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">1,842</span>
            <span className="font-label-code text-label-code text-primary">76.2% Kapasitas Siap</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
              Di Unit Aktif
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">428</span>
            <span className="font-label-code text-label-code text-secondary">Tersebar di 14 Depo</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
              Proses CSSD
              <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">94</span>
            <span className="font-label-code text-label-code text-surface-tint">Siklus Autoclave B2</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
              Dalam Perbaikan
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">36</span>
            <span className="font-label-code text-label-code text-tertiary">Teknisi Elektromedis</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 col-span-2 md:col-span-1">
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
              Kondisi Rusak
              <span className="w-2 h-2 rounded-full bg-error"></span>
            </span>
            <span className="font-headline-md text-headline-md text-error">18</span>
            <span className="font-label-code text-label-code text-error">Perlu Pergantian</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto flex-1">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">qr_code_scanner</span>
              <input className="w-full pl-11 pr-16 py-2.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container transition-all" placeholder="Cari kode atau nama alat..." type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">F2</span>
            </div>
            <div className="relative w-full sm:w-56">
              <select className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container transition-all cursor-pointer" defaultValue="Semua Status">
                <option>Semua Status</option>
                <option>Tersedia</option>
                <option>DiUnit</option>
                <option>Rusak</option>
                <option>DalamPerbaikan</option>
                <option>DalamProsesSterilisasi</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">expand_more</span>
            </div>
            <div className="relative w-full sm:w-60">
              <select className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container transition-all cursor-pointer" defaultValue="Semua Unit">
                <option>Semua Unit</option>
                <option>Gudang Sentral Alkes</option>
                <option>IBS (Instalasi Bedah Sentral)</option>
                <option>ICU / PICU / NICU</option>
                <option>IGD (Instalasi Gawat Darurat)</option>
                <option>VK Bersalin</option>
                <option>CSSD Sterilisasi</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">apartment</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <span className="font-label-md text-label-md text-on-surface-variant">Urutkan:</span>
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors" type="button">
              Terbaru Diperbarui
              <span className="material-symbols-outlined text-base">arrow_drop_down</span>
            </button>
            <button className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors" title="Muat Ulang" type="button">
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Kode Alat</th>
                  <th className="py-3.5 px-4 font-semibold">Nama Alat</th>
                  <th className="py-3.5 px-4 font-semibold">Unit / Lokasi</th>
                  <th className="py-3.5 px-4 font-semibold">Status Instrumen</th>
                  <th className="py-3.5 px-4 font-semibold">Terakhir Diperbarui</th>
                  <th className="py-3.5 px-4 font-semibold">Diperbarui Oleh</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-primary font-semibold">ALT-BDH-004</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors" title="Salin Barcode" type="button">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-xl">medical_services</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg text-on-surface truncate">Set Laparatomi Dewasa</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Batch: LAP-2024-09 · Tray No. 04</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-base text-secondary">location_on</span>
                      <span>Instalasi Bedah Sentral (IBS)</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pl-5">OK 02 Mayor</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md bg-secondary/10 text-secondary">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      DiUnit
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-body-md text-body-md text-on-surface">Hari ini, 10:15 WIB</span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">14 menit lalu</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-md text-label-md text-on-surface">AS</span>
                      <span className="font-body-md text-body-md text-on-surface">Agus Supriyadi</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all" onClick={() => setModalOpen(true)} type="button">
                      <span className="material-symbols-outlined text-base">sync_alt</span>
                      <span>Perbarui Status</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-primary font-semibold">ALT-STR-019</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors" type="button">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-xl">sanitizer</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg text-on-surface truncate">Autoclave Chamber Cassette</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Serial: AC-88219-G</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-base text-surface-tint">inventory</span>
                      <span>CSSD Washer Room</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pl-5">Chamber Sterilisator 02</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md bg-surface-tint/10 text-surface-tint">
                      <span className="w-2 h-2 rounded-full bg-surface-tint animate-ping"></span>
                      DalamProsesSterilisasi
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-body-md text-body-md text-on-surface">Hari ini, 09:40 WIB</span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">49 menit lalu</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-md text-label-md text-on-surface">RS</span>
                      <span className="font-body-md text-body-md text-on-surface">Ratna Sari</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all" onClick={() => setModalOpen(true)} type="button">
                      <span className="material-symbols-outlined text-base">sync_alt</span>
                      <span>Perbarui Status</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-primary font-semibold">ALT-ICU-021</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors" type="button">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg text-on-surface truncate">Syringe Pump Terumo TE-331</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Kalibrasi: Okt 2024</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-base text-tertiary">build</span>
                      <span>Bengkel Elektromedis</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pl-5">Meja Uji Kalibrasi 01</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md bg-tertiary/10 text-tertiary">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      DalamPerbaikan
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-body-md text-body-md text-on-surface">Kemarin, 16:30 WIB</span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">1 hari lalu</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-md text-label-md text-on-surface">HI</span>
                      <span className="font-body-md text-body-md text-on-surface">Hendri Irawan</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all" onClick={() => setModalOpen(true)} type="button">
                      <span className="material-symbols-outlined text-base">sync_alt</span>
                      <span>Perbarui Status</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-primary font-semibold">ALT-EMG-008</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors" type="button">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-xl">monitor_heart</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg text-on-surface truncate">Defibrillator Mindray BeneHeart D3</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Baterai Rusak · Unit Karantina</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-base text-error">warning</span>
                      <span>Gudang Karantina Alkes</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pl-5">Rak B-02 Afkir</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md bg-error/10 text-error">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      Rusak
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-body-md text-body-md text-on-surface">Kemarin, 14:10 WIB</span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">1 hari lalu</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-md text-label-md text-on-surface">AS</span>
                      <span className="font-body-md text-body-md text-on-surface">Agus Supriyadi</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all" onClick={() => setModalOpen(true)} type="button">
                      <span className="material-symbols-outlined text-base">sync_alt</span>
                      <span>Perbarui Status</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-primary font-semibold">ALT-CSSD-044</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors" type="button">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-xl">healing</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg text-on-surface truncate">Retractor Langenbeck Set (Pair)</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Grade Medis SS 316 · Steril Segel</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-base text-primary">warehouse</span>
                      <span>Gudang Sentral Alkes</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pl-5">Bin Steril Rak A-12</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md bg-primary/10 text-primary">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Tersedia
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-body-md text-body-md text-on-surface">23 Okt, 11:20 WIB</span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">2 hari lalu</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-md text-label-md text-on-surface">RS</span>
                      <span className="font-body-md text-body-md text-on-surface">Ratna Sari</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all" onClick={() => setModalOpen(true)} type="button">
                      <span className="material-symbols-outlined text-base">sync_alt</span>
                      <span>Perbarui Status</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span>Menampilkan <strong className="text-on-surface font-semibold">1-5</strong> dari <strong className="text-on-surface font-semibold">2,418</strong> instrumen medis</span>
              <span className="text-outline-variant">|</span>
              <span>Halaman 1 dari 484</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-high transition-colors" disabled type="button">
                <span className="material-symbols-outlined text-lg">first_page</span>
              </button>
              <button className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-high transition-colors" disabled type="button">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <span className="px-3 py-1 rounded-lg bg-primary text-on-primary font-label-md text-label-md">1</span>
              <button className="px-3 py-1 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors" type="button">2</button>
              <button className="px-3 py-1 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors" type="button">3</button>
              <span className="px-1 text-on-surface-variant font-label-md text-label-md">...</span>
              <button className="px-3 py-1 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors" type="button">484</button>
              <button className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" type="button">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
              <button className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" type="button">
                <span className="material-symbols-outlined text-lg">last_page</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Distribusi Status Aset</h2>
              <span className="font-label-code text-label-code text-on-surface-variant">Live Sync</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Rasio perbandingan instrumen berdasarkan kesiapan klinis di seluruh instalasi.</p>
            <div className="flex items-center justify-center py-2">
              <svg className="w-36 h-36" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="none" r="64" stroke="#eaedff" strokeWidth="18" />
                <circle cx="80" cy="80" fill="none" r="64" stroke="#00685f" strokeDasharray="320 402" strokeDashoffset="0" strokeLinecap="round" strokeWidth="18" />
                <circle cx="80" cy="80" fill="none" r="64" stroke="#006398" strokeDasharray="60 402" strokeDashoffset="-324" strokeLinecap="round" strokeWidth="18" />
                <circle cx="80" cy="80" fill="none" r="64" stroke="#ba1a1a" strokeDasharray="14 402" strokeDashoffset="-386" strokeLinecap="round" strokeWidth="18" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="font-label-md text-label-md text-on-surface">76.2% Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="font-label-md text-label-md text-on-surface">17.7% Di Unit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-surface-tint"></span>
                <span className="font-label-md text-label-md text-on-surface">3.9% Sterilisasi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                <span className="font-label-md text-label-md text-on-surface">2.2% Afkir/Rusak</span>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Aktivitas Pergantian Status Terakhir</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Log audit pergerakan dan modifikasi status oleh petugas inventori medis</p>
              </div>
              <span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold cursor-pointer hover:underline">
                Lihat Semua Log
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
            <div className="flex flex-col gap-1 pt-2">
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface">Distribusi ke IBS OK-02 Selesai</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Set Laparatomi Dewasa (ALT-BDH-004) diubah ke Status <strong>DiUnit</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-label-code text-label-code text-on-surface">10:15 WIB</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Agus S.</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-surface-tint/10 text-surface-tint flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">cyclone</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface">Proses Dekontaminasi CSSD Dimulai</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Autoclave Chamber Cassette (ALT-STR-019) diubah ke <strong>DalamProsesSterilisasi</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-label-code text-label-code text-on-surface">09:40 WIB</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Ratna S.</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">engineering</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface">Tiket Pemeliharaan Rutin Dibuka</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Syringe Pump Terumo (ALT-ICU-021) diubah ke <strong>DalamPerbaikan</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-label-code text-label-code text-on-surface">Kemarin 16:30</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Hendri I.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4${modalOpen ? "" : " hidden"}`} id="statusModal">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Perbarui Status Alat</h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Set Laparatomi Dewasa (<span className="font-label-code text-label-code text-primary font-semibold">ALT-BDH-004</span>)</span>
                </div>
              </div>
              <button className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" onClick={() => setModalOpen(false)} type="button">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">Nama Instrumen:</span>
                  <span className="font-label-lg text-label-lg text-on-surface">Set Laparatomi Dewasa</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">ID Barcode / RFID:</span>
                  <span className="font-label-code text-label-code text-primary font-semibold">ALT-BDH-004</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">Unit Saat Ini:</span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">IBS - Ruang OK 02</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between">
                  <span>Status Baru <span className="text-error">*</span></span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Status saat ini: <strong className="text-secondary">DiUnit</strong></span>
                </label>
                <div className="relative">
                  <select className="w-full appearance-none px-4 py-3 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container transition-all cursor-pointer" defaultValue="DalamPerbaikan">
                    <option disabled>Pilih Status Baru...</option>
                    <option value="Tersedia">Tersedia (Ready di Sentral)</option>
                    <option value="DiUnit">DiUnit (Sedang Digunakan Ruangan)</option>
                    <option value="DalamProsesSterilisasi">DalamProsesSterilisasi (Antrean CSSD)</option>
                    <option value="DalamPerbaikan">DalamPerbaikan (Maintenance / Kalibrasi)</option>
                    <option value="Rusak">Rusak (Karantina / Tidak Laik Pakai)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between">
                  <span>Keterangan Pembaruan <span className="text-error">*</span></span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Wajib diisi untuk audit log</span>
                </label>
                <textarea className="w-full p-3.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container transition-all placeholder:text-on-surface-variant/50 resize-none" rows={3} defaultValue="Terjadi kendala mekanis pada tuas kunci clamp saat digunakan di OK 02. Memerlukan kalibrasi elektromedis." />
              </div>
              <div className="p-3 rounded-xl bg-tertiary/10 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-tertiary text-xl shrink-0 mt-0.5">notification_important</span>
                <div className="flex flex-col font-body-sm text-body-sm text-on-surface">
                  <span className="font-semibold text-tertiary">Pemberitahuan Otomatis</span>
                  <span>Perubahan ke status <strong>DalamPerbaikan</strong> akan secara otomatis meneruskan tiket disposisi inspeksi ke tim IPSRS / Elektromedis Rumah Sakit.</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-end gap-2">
              <button className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors" onClick={() => setModalOpen(false)} type="button">
                Batal
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all" onClick={() => setModalOpen(false)} type="button">
                <span className="material-symbols-outlined text-base">check</span>
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
    </>
  )
}
