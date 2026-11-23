"use client"

import { useState, useRef, type FormEvent } from "react"

const TOTAL_STOCK = 24

export default function AlatKeluarPage() {
  const [quantity, setQuantity] = useState("4")
  const [showToast, setShowToast] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const parsedQuantity = parseInt(quantity, 10)
  const invalidQuantity = Number.isNaN(parsedQuantity) || parsedQuantity <= 0
  const overStock = !invalidQuantity && parsedQuantity > TOTAL_STOCK
  const canSubmit = !invalidQuantity && !overStock
  const remaining = invalidQuantity ? TOTAL_STOCK : TOTAL_STOCK - parsedQuantity

  const adjustQty = (delta: number) => {
    const current = parseInt(quantity, 10) || 0
    let next = current + delta
    if (next < 1) next = 1
    if (next > TOTAL_STOCK) next = TOTAL_STOCK
    setQuantity(String(next))
  }

  const resetForm = () => {
    formRef.current?.reset()
    setQuantity("4")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowToast(true)
    window.setTimeout(() => setShowToast(false), 4000)
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Navigation & Page Title Scrim */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
          <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">Alat Keluar</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-outline">Distribusi Unit</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 pt-1">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Distribusi Alat ke Unit</h1>
            <p className="font-body-md text-body-md text-outline mt-0.5">Pencatatan pengeluaran dan serah terima instrumen klinis menuju unit instalasi rumah sakit.</p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-low shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider font-semibold">Gudang Sentral Lt. 2</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container font-label-md text-label-md text-on-surface font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              <span className="">18 Mei 2025</span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Grid: Left Form (60%) + Right Activity Feed (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (FORM 60% = col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Scanner & Active Instrument Identity */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">1. Identifikasi Alat Medis</h2>
                  <p className="font-label-md text-label-md text-outline">Scan barcode atau masukkan kode katalog instrumen</p>
                </div>
              </div>
              <span className="font-label-code text-label-code px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">HOTKEY: [F2] SCAN</span>
            </div>
            {/* Barcode Lookup Field */}
            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]">barcode_scanner</span>
                <input className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-code text-label-code placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-inner bg-surface-container-low/40" id="barcodeInput" placeholder="Scan atau ketik kode alat... (contoh: ALT-BDH-004)" type="text" defaultValue="ALT-BDH-004" />
              </div>
              <button className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-1.5 hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm" type="button">
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span className="">Cari</span>
              </button>
            </div>
            {/* Instrument Identity Summary Box */}
            <div className="rounded-xl p-4 bg-surface-container-low flex flex-col gap-2 relative">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[26px]">medical_services</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">Set Laparatomi Dewasa (Mayor Instrument)</span>
                    </div>
                    <div className="flex items-center gap-2 font-label-code text-label-code text-outline mt-0.5">
                      <span className="text-on-surface font-semibold">ALT-BDH-004</span>
                      <span className="">•</span>
                      <span className="">Kategori: Instrumen Bedah Mayor</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm self-start shrink-0 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Tersedia di Depo Sentral
                </span>
              </div>
              {/* Highlighted Available Stock Stat Box */}
              <div className="mt-2 p-4 rounded-lg bg-emerald-50 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-emerald-800 uppercase tracking-wider font-semibold">Stok Siap Distribusi di Gudang</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-xl text-headline-xl font-bold text-emerald-900 leading-tight tracking-tight" id="availableStock">24</span>
                      <span className="font-label-lg text-label-lg font-semibold text-emerald-800">Unit Terkalibrasi & Steril</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end justify-center">
                  <span className="font-badge-sm text-badge-sm px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold text-center">Batch EXP: 11/2026</span>
                  <span className="font-body-sm text-body-sm text-emerald-700 mt-1 italic">Maksimal pengeluaran saat ini: 24 Unit</span>
                </div>
              </div>
            </div>
          </section>
          {/* Card 2: Distribution Transaction Details */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">2. Parameter Serah Terima & Logistik</h2>
                <p className="font-label-md text-label-md text-outline">Lengkapi unit destinasi dan peruntukan klinis</p>
              </div>
            </div>
            <form className="flex flex-col gap-4" id="distributionForm" onSubmit={handleSubmit} ref={formRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Unit Tujuan */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1" htmlFor="targetUnit">
                    <span className="">Unit Tujuan</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary pr-9 cursor-pointer" id="targetUnit" required defaultValue="IBS">
                      <option value="IBS">Instalasi Bedah Sentral (IBS / OK)</option>
                      <option value="ICU">Intensive Care Unit (ICU)</option>
                      <option value="IGD">Instalasi Gawat Darurat (IGD)</option>
                      <option value="VK">VK / Bersalin</option>
                      <option value="TERATAI">Rawat Inap Teratai</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">Lokasi fisik rak serah terima unit tujuan</span>
                </div>
                {/* Jumlah Keluar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1" htmlFor="quantityOut">
                      <span className="">Jumlah Keluar</span>
                      <span className="text-error font-bold">*</span>
                    </label>
                    <span className="font-label-md text-label-md text-outline">Unit/Set</span>
                  </div>
                  <div className="relative">
                    <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-headline-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary" id="quantityOut" max={24} min={1} required type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors text-[16px] font-bold" onClick={() => adjustQty(-1)} type="button">-</button>
                      <button className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors text-[16px] font-bold" onClick={() => adjustQty(1)} type="button">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-body-sm text-body-sm text-primary font-medium flex items-center gap-1 ${overStock ? "hidden" : ""}`} id="remainingStockHelper">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      <span className="">Sisa stok gudang setelah distribusi: <strong className="text-on-surface" id="remainingStockVal">{remaining} Unit</strong></span>
                    </span>
                    <span className={`${overStock ? "" : "hidden"} font-label-md text-label-md text-error font-semibold flex items-center gap-1`} id="stockErrorAlert">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      <span className="">Stok tidak mencukupi</span>
                    </span>
                  </div>
                </div>
                {/* Tanggal Distribusi */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1" htmlFor="dispatchDate">
                    <span className="">Tanggal Distribusi</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary" id="dispatchDate" required type="date" defaultValue="2025-05-18" />
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">Dicatat pada sistem log waktu nyata</span>
                </div>
                {/* Nama Penerima */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1" htmlFor="recipientName">
                    <span className="">Nama Penerima di Unit</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary" id="recipientName" placeholder="Nama & gelar petugas penerima..." required type="text" defaultValue="Ns. Maya Safitri, S.Kep - Kepala Tim Bedah" />
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">Wajib petugas ber-SIP aktif di unit</span>
                </div>
              </div>
              {/* Catatan Distribusi */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface" htmlFor="dispatchNotes">Catatan Tambahan & Instruksi Klinis</label>
                <textarea className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline" id="dispatchNotes" placeholder="Tambahkan informasi peruntukan, nomor jadwal OK, atau instruksi sterilisasi..." rows={2} defaultValue="Untuk persiapan jadwal operasi laparotomi elektif Cito Ruang OK 03 shift siang." />
              </div>
              {/* Validation Warning / Protocol Cue */}
              <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">policy</span>
                <div className="flex flex-col gap-0.5 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Protokol Serah Terima Terintegrasi:</span>
                  <p className="">Status transaksi otomatis diset <span className="font-semibold text-tertiary">&ldquo;Menunggu Konfirmasi&rdquo;</span> hingga petugas unit tujuan melakukan verifikasi fisik & tap scan pada menu penerimaan unit.</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button className={`w-full sm:flex-1 py-3 px-6 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container shadow-md transition-all active:scale-[0.99] ${canSubmit ? "" : "opacity-50 cursor-not-allowed"}`} id="submitBtn" type="submit" disabled={!canSubmit}>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span className="">Kirim ke Unit</span>
                </button>
                <button className="w-full sm:w-auto py-3 px-6 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg font-semibold hover:bg-surface-container-high transition-colors" onClick={resetForm} type="button">
                  Reset Formulir
                </button>
              </div>
            </form>
          </section>
          {/* Visual Specimen Verification Callout */}
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[22px]">checklist_rtl</span>
              </div>
              <div>
                <div className="font-label-lg text-label-lg font-bold text-on-surface">Pengecekan Tray Indikator CSSD</div>
                <div className="font-body-sm text-body-sm text-outline">Segel mekanik terverifikasi valid: BATCH-ST-8829-OK</div>
              </div>
            </div>
            <span className="font-label-code text-label-code px-3 py-1 rounded bg-surface-container text-primary font-bold">100% STERIL</span>
          </div>
        </div>
        {/* RIGHT COLUMN (SIDE PANEL 40% = col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Panel Header & Quick Metrics */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">schedule_send</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Distribusi Hari Ini</h2>
                </div>
                <span className="font-label-md text-label-md text-outline">Minggu, 18 Mei 2025</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 text-primary font-badge-sm text-badge-sm font-bold tracking-wider">
                <span className="material-symbols-outlined text-[14px]">inventory</span>
                <span className="">8 Batch Terkirim</span>
              </div>
            </div>
            {/* Quick Summary Bar Graphic / Miniature Progress */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-outline">Dikonfirmasi Unit</span>
                <span className="font-headline-sm text-headline-sm font-bold text-primary">6 <span className="text-label-md font-normal text-on-surface-variant">Batch (75%)</span></span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-outline">Menunggu Konfirmasi</span>
                <span className="font-headline-sm text-headline-sm font-bold text-tertiary">2 <span className="text-label-md font-normal text-on-surface-variant">Batch (25%)</span></span>
              </div>
            </div>
            {/* Timeline / List of Dispatches */}
            <div className="flex flex-col gap-3 divide-y divide-surface-container">
              {/* Item 1: Pending (Orange) */}
              <div className="pt-2 flex flex-col gap-2 group hover:bg-surface-container-low/50 p-2 rounded-lg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-label-code text-label-code text-outline font-semibold">09:38 WIB</span>
                    <span className="w-1 h-1 rounded-full bg-outline"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">Set Bedah Mayor</span>
                    <span className="font-label-code text-label-code px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">BM-004</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-badge-sm text-badge-sm font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Menunggu Konfirmasi
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pl-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-on-surface">2 Unit</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                    <span className="font-medium text-secondary">IBS / Kamar Operasi</span>
                  </div>
                  <span className="font-label-md text-label-md text-outline truncate max-w-[130px]">Penerima: Ns. Dani</span>
                </div>
              </div>
              {/* Item 2: Received (Green) */}
              <div className="pt-3 flex flex-col gap-2 group hover:bg-surface-container-low/50 p-2 rounded-lg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-label-code text-label-code text-outline font-semibold">08:22 WIB</span>
                    <span className="w-1 h-1 rounded-full bg-outline"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">Set Partus Bedah Obstetri</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Diterima
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pl-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-on-surface">3 Unit</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                    <span className="font-medium text-secondary">VK / Bersalin</span>
                  </div>
                  <span className="font-label-md text-label-md text-outline truncate max-w-[130px]">Bdn. Halimah</span>
                </div>
              </div>
              {/* Item 3: Received (Green) */}
              <div className="pt-3 flex flex-col gap-2 group hover:bg-surface-container-low/50 p-2 rounded-lg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-label-code text-label-code text-outline font-semibold">07:50 WIB</span>
                    <span className="w-1 h-1 rounded-full bg-outline"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">Infusion Pump Terumo SS830</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Diterima
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pl-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-on-surface">4 Unit</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                    <span className="font-medium text-secondary">ICU Sentral</span>
                  </div>
                  <span className="font-label-md text-label-md text-outline truncate max-w-[130px]">Ns. Faisal, S.Kep</span>
                </div>
              </div>
              {/* Item 4: Received (Green) */}
              <div className="pt-3 flex flex-col gap-2 group hover:bg-surface-container-low/50 p-2 rounded-lg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-label-code text-label-code text-outline font-semibold">07:15 WIB</span>
                    <span className="w-1 h-1 rounded-full bg-outline"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">Set Hecting Bedah Minor</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Diterima
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pl-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-on-surface">6 Unit</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                    <span className="font-medium text-secondary">IGD PONEK</span>
                  </div>
                  <span className="font-label-md text-label-md text-outline truncate max-w-[130px]">dr. Anindya Tri</span>
                </div>
              </div>
              {/* Item 5: Pending (Orange) */}
              <div className="pt-3 flex flex-col gap-2 group hover:bg-surface-container-low/50 p-2 rounded-lg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-label-code text-label-code text-outline font-semibold">06:40 WIB</span>
                    <span className="w-1 h-1 rounded-full bg-outline"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">Syringe Pump Terumo</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-badge-sm text-badge-sm font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Menunggu Konfirmasi
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pl-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-on-surface">2 Unit</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                    <span className="font-medium text-secondary">NICU / PICU</span>
                  </div>
                  <span className="font-label-md text-label-md text-outline truncate max-w-[130px]">Ns. Rian S.</span>
                </div>
              </div>
            </div>
            {/* Footer Link */}
            <div className="pt-2 flex items-center justify-center">
              <a className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold transition-colors py-1 group" href="#">
                <span className="">Lihat seluruh daftar pengiriman</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>
          {/* Quick Guidance & Operational Protocol Box */}
          <div className="rounded-xl p-4 bg-secondary-fixed/30 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-on-secondary-fixed font-label-lg text-label-lg font-bold">
              <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
              <span className="">SOP Distribusi CSSD / Depo</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Pastikan setiap instrumen yang meninggalkan depo sentral telah melewati uji visual pouch seal steril, strip indikator berubah warna, dan nomor batch tercetak jelas pada kemasan luar.
            </p>
          </div>
          {/* Active Shift Dispatch Personnel Badge */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold font-headline-sm">
              RS
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Ratna Sari, S.Kep</span>
              <span className="font-body-sm text-body-sm text-outline truncate">Petugas Ekspedisi Shift Pagi (07:00 - 14:00 WIB)</span>
            </div>
            <span className="ml-auto font-badge-sm text-badge-sm px-2 py-0.5 rounded bg-surface-container text-primary font-semibold shrink-0">PJ AKTIF</span>
          </div>
        </div>
      </div>
      {/* Notification Toast Demo (Hidden by default, triggered on submit) */}
      <div className={`fixed bottom-6 right-6 max-w-md bg-surface-container-lowest shadow-2xl rounded-xl p-4 flex items-center gap-3 border-l-4 border-primary z-50 transform transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"}`} id="successToast">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-lg text-label-lg font-bold text-on-surface">Distribusi Berhasil Dicatat</span>
          <span className="font-body-sm text-body-sm text-outline truncate">Status: Menunggu konfirmasi penerimaan fisik unit tujuan.</span>
        </div>
      </div>
    </div>
  )
}
