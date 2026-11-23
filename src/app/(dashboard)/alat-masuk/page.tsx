/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef, useState, type FormEvent } from "react"

const CURRENT_STOCK = 48
const DEFAULT_BARCODE = "ALT-BDH-001"
const DEFAULT_QTY = 12

export default function AlatMasukPage() {
  const [barcode, setBarcode] = useState(DEFAULT_BARCODE)
  const [qty, setQty] = useState(DEFAULT_QTY)
  const [highlight, setHighlight] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastDetail, setToastDetail] = useState("12 Unit Pinset Sirurgis 14cm telah ditambahkan ke gudang sentral.")
  const barcodeRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function triggerSearch() {
    if (!barcode.trim()) return
    setHighlight(true)
    setTimeout(() => setHighlight(false), 800)
  }

  function resetSearch() {
    setBarcode("")
    barcodeRef.current?.focus()
  }

  function handleReset() {
    formRef.current?.reset()
    setBarcode(DEFAULT_BARCODE)
    setQty(DEFAULT_QTY)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setToastDetail(`${qty} Unit Pinset Sirurgis 14cm telah berhasil ditambahkan ke inventori RSCM.`)
    setShowToast(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-2">
        <a className="font-label-md text-label-md text-outline hover:text-primary transition-colors flex items-center gap-1" data-path="dashboard" href="#">
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Dashboard</span>
        </a>
        <span className="text-outline-variant font-body-sm text-body-sm">/</span>
        <span className="font-label-md text-label-md text-primary font-semibold">Alat Masuk</span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Pencatatan Alat Masuk</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-badge-sm text-badge-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              GS1-128 Ready
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
            Pencatatan penerimaan instrumen medis baru atau pengembalian pasca sterilisasi/vendor ke gudang inventori sentral RSCM.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">barcode_reader</span>
            <span className="font-label-code text-label-code text-primary font-bold">SCANNER AKTIF</span>
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="mb-4 p-4 rounded-xl bg-surface-container-lowest shadow-md flex items-center justify-between transition-all duration-300" id="toastSuccess">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface font-semibold">Transaksi Berhasil Dicatat</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant" id="toastDetail">{toastDetail}</p>
            </div>
          </div>
          <button className="p-1 rounded-lg hover:bg-surface-container text-outline" onClick={() => setShowToast(false)} type="button">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">1. Identifikasi Alat Medis</h2>
              </div>
              <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Langkah 1 dari 2</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="barcodeInput">
                <span>Pindai Barcode / Input Manual Kode Aset</span>
                <span className="font-label-code text-label-code text-outline font-normal">Tekan [Enter] untuk validasi</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
                  </div>
                  <input className="w-full pl-11 pr-10 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-code text-body-md shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-container-low transition-all" id="barcodeInput" onChange={(event) => setBarcode(event.target.value)} onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      triggerSearch()
                    }
                  }} placeholder="Scan atau ketik kode alat... (contoh: ALT-BDH-001)" ref={barcodeRef} type="text" value={barcode} />
                  <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface" onClick={() => setBarcode("")} type="button">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all" onClick={triggerSearch} type="button">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Cari Alat</span>
                </button>
              </div>
            </div>
            <div className="mt-4 p-2 rounded-lg bg-surface-container flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">qr_code_2</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Barcode scanner otomatis mendeteksi kode QR/DataMatrix standar <span className="font-medium text-on-surface">GS1 Healthcare</span> dan serial internal RSCM.
              </p>
            </div>
            <div className={`mt-4 p-4 rounded-xl bg-surface-container-low transition-all${highlight ? " ring-2 ring-primary" : ""}`} id="assetCard">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">medical_services</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded bg-surface-container text-primary font-bold">INSTRUMEN BEDAH</span>
                      <span className="font-label-code text-label-code text-on-surface-variant font-semibold">SKU: ALT-BDH-001</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                      Pinset Sirurgis 14cm (Grade Medis AISI 420)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Spesifikasi: Surgical Forceps 1x2 Gigi Anatomis, Autoclavable hingga 134°C
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 shrink-0">
                  <span className="font-label-md text-label-md text-on-surface-variant">Stok Saat Ini:</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-headline-sm text-headline-sm font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>48 Unit</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                  <span>Lokasi Rak Utama: <span className="font-medium text-on-surface">Gudang A - Rak B2</span></span>
                </div>
                <button className="font-label-md text-label-md text-error hover:text-on-error-container font-semibold flex items-center gap-1" onClick={resetSearch} type="button">
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Bukan alat ini? Cari ulang</span>
                </button>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">2. Rincian Penerimaan</h2>
              </div>
              <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Langkah 2 dari 2</span>
            </div>
            <form className="flex flex-col gap-4" id="receivingForm" onSubmit={handleSubmit} ref={formRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="jumlahMasuk">
                    <span>Jumlah Masuk</span>
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-headline-sm font-bold shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all" id="jumlahMasuk" min="1" onChange={(event) => setQty(Number(event.target.value) || 0)} required type="number" value={qty} />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-on-surface-variant font-label-md text-label-md">
                      Unit / Pcs
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">Kalkulasi total pasca simpan: <strong className="text-primary" id="kalkulasiStok">{CURRENT_STOCK + qty} Unit</strong></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="tanggalTerima">
                    <span>Tanggal Terima</span>
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-lg text-label-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all" defaultValue="2025-05-18" id="tanggalTerima" required type="date" />
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">Waktu sistem: Shift Pagi (07:00 - 15:00 WIB)</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="sumberAsal">
                  <span>Sumber / Asal Pengiriman</span>
                  <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  </div>
                  <input className="w-full pl-11 pr-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all" defaultValue="Vendor PT Medika Instrumentindo / Pengadaan TA 2025" id="sumberAsal" placeholder="Contoh: Vendor PT Medika Instrumentindo / Pengadaan TA 2025" required type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="nomorDokumen">
                  <span>Nomor Dokumen Acuan (BAST / Surat Jalan / No. PO)</span>
                  <span className="font-badge-sm text-badge-sm text-outline font-normal">Opsional</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </div>
                  <input className="w-full pl-11 pr-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-code text-body-md shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all" defaultValue="BAST-MED-2025/05/119" id="nomorDokumen" placeholder="e.g. BAST-MED-2025/05/119 atau PO-8842-CSSD" type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="catatanPenerimaan">
                  <span>Catatan Kondisi Fisik & Keterangan Tambahan</span>
                </label>
                <textarea className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all" defaultValue="Kondisi box tersegel utuh, indikator autoclave valid." id="catatanPenerimaan" placeholder="Tuliskan catatan inspeksi visual paket, segel lot, tanggal kedaluwarsa steril, dll..." rows={3} />
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-3 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all" type="submit">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Simpan Penerimaan Alat</span>
                </button>
                <button className="px-6 py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 transition-all" onClick={handleReset} type="button">
                  <span className="material-symbols-outlined text-[20px]">clear_all</span>
                  <span>Reset Formulir</span>
                </button>
              </div>
            </form>
          </section>
        </div>
        <aside className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex flex-col gap-1">
                <img alt="Logo Kemenkes RS Cipto Mangunkusumo" className="h-8 w-auto object-contain self-start" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNMg7wANIJ5DNCiGQ-iiuup0lCRQ-tsakxKjhUIxzVWRoE7cKj5hYBuw3MbY9q4_9SbRi-KhsBiLkKCb2BVw_oantHCwX4DZvlJ7_AO1SGBg2Fskzx8NFuFqLign0BGHlTbwq0HVRB9QPCm19cI-QMOi0IZkNNPJI2ecPfCw5q985s5VtlWUYQqQS2c8rpQigX6KISmZYegPUee7ZrTXGsT-wTRHGXrvvmvbqFksOI4bGUg9Z7Lse_fA" />
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight mt-1">SIM Inventori</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">move_to_inbox</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant font-medium">Akumulasi Masuk Shift Ini</p>
                  <p className="font-headline-md text-headline-md text-primary font-bold tracking-tight">+48 Unit / Set</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-badge-sm text-badge-sm text-primary font-bold bg-surface-container px-2 py-0.5 rounded">STABIL</span>
                <span className="font-body-sm text-body-sm text-outline mt-1">Target harian 60 unit</span>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-surface-container">
              <article className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-outline">09:15 WIB</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-badge-sm text-badge-sm text-on-surface-variant truncate">Vendor Alkes</span>
                    </div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                      Defibrillator Mindray BeneHeart D3
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Diverifikasi oleh: <span className="font-medium text-on-surface">Ratna Sari, S.Kep</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-primary font-label-code text-label-md font-bold">
                    +2 Unit
                  </span>
                </div>
              </article>
              <article className="py-3.5 flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">pregnant_woman</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-outline">08:40 WIB</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-badge-sm text-badge-sm text-on-surface-variant truncate">CSSD Uji Steril</span>
                    </div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                      Set Partus Bedah Obstetri
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Diverifikasi oleh: <span className="font-medium text-on-surface">Agus Supriyadi</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-primary font-label-code text-label-md font-bold">
                    +5 Set
                  </span>
                </div>
              </article>
              <article className="py-3.5 flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">air</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-outline">08:10 WIB</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-badge-sm text-badge-sm text-on-surface-variant truncate">Pengadaan RS</span>
                    </div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                      Suction Pump Portable Thomas
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Diverifikasi oleh: <span className="font-medium text-on-surface">Hendri Irawan</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-primary font-label-code text-label-md font-bold">
                    +4 Unit
                  </span>
                </div>
              </article>
              <article className="py-3.5 flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">healing</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-outline">07:35 WIB</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-badge-sm text-badge-sm text-on-surface-variant truncate">Vendor Bima Medika</span>
                    </div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                      Needle Holder Mayo-Hegar 16cm
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Diverifikasi oleh: <span className="font-medium text-on-surface">Agus Supriyadi</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-primary font-label-code text-label-md font-bold">
                    +15 Unit
                  </span>
                </div>
              </article>
              <article className="py-3.5 flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">content_cut</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-code text-label-code text-outline">07:00 WIB</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-badge-sm text-badge-sm text-on-surface-variant truncate">Hibah Dinkes</span>
                    </div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                      Klem Hemostatik Pean Lurus 14cm
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Diverifikasi oleh: <span className="font-medium text-on-surface">Agus Supriyadi</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-primary font-label-code text-label-md font-bold">
                    +22 Unit
                  </span>
                </div>
              </article>
            </div>
            <div className="mt-4 pt-2 flex justify-center">
              <a className="w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 transition-all text-center" data-path="riwayat-pergerakan" href="#">
                <span>Lihat semua riwayat penerimaan</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">inventory</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md font-semibold text-on-surface">Perlu Label Barcode Fisik?</span>
              <span className="font-body-sm text-body-sm text-outline truncate">Cetak thermal sticker batch untuk barang baru diterima.</span>
            </div>
            <button className="ml-auto px-3 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md font-bold shrink-0 transition-colors" type="button">
              Cetak
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
