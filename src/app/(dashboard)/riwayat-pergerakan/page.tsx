"use client"

import { useState } from "react"

const PER_PAGE = 20
const TOTAL_LOGS = 148
const TOTAL_PAGES = 8

export default function RiwayatPergerakanPage() {
  const [selectedRow, setSelectedRow] = useState(1)
  const [detailOpen, setDetailOpen] = useState(true)
  const [page, setPage] = useState(1)

  const rangeStart = (page - 1) * PER_PAGE + 1
  const rangeEnd = Math.min(page * PER_PAGE, TOTAL_LOGS)

  const rowClass = (index: number) =>
    `${selectedRow === index ? "bg-surface-container-high/40 hover:bg-surface-container" : "hover:bg-surface-container-low"} transition-colors cursor-pointer`

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-1.5">
            <a className="font-label-md text-label-md text-outline hover:text-primary transition-colors flex items-center gap-1" href="#">
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              Dashboard
            </a>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="font-label-md text-label-md font-semibold text-primary">Riwayat Pergerakan</span>
          </nav>
          {/* Title & Subtitle */}
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Riwayat Pergerakan Alat</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-0.5">
            Audit log terlacak dan rekam jejak mutasi keluar, masuk, konfirmasi, dan perubahan status instrumen medis secara real-time.
          </p>
        </div>
        {/* Quick Stats Bar */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container-low px-4 py-2 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 pr-4">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-outline font-semibold">Total Mutasi 24 Jam</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">42 Transaksi</span>
            </div>
          </div>
          <div className="h-8 w-px bg-surface-container-highest"></div>
          <div className="flex items-center gap-2 pl-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Audit Node: Synchronized
            </span>
          </div>
        </div>
      </div>
      {/* Filter Bar Card (Horizontal 6 Fields + Action Cluster) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between gap-2 mb-4 pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
            <span className="font-label-lg text-label-lg font-bold text-on-surface">Parameter Penyaringan Log</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors font-label-md text-label-md font-medium" type="button">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Filter Lanjutan
            </button>
          </div>
        </div>
        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" onSubmit={(event) => event.preventDefault()}>
          {/* Field 1: Kode / Nama Alat */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="filter-search">Alat Medis / Barcode</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
              <input className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm placeholder:text-outline/70" id="filter-search" placeholder="Cari nama atau barcode..." type="text" defaultValue="ALT-BDH" />
            </div>
          </div>
          {/* Field 2: Unit */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="filter-unit">Unit Medis / Lokasi</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">domain</span>
              <select className="w-full pl-9 pr-8 py-2 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" defaultValue="ibs" id="filter-unit">
                <option value="all">Semua Unit Kerja</option>
                <option value="gudang">Gudang Sentral Farmasi & Alkes</option>
                <option value="ibs">IBS / Instalasi Bedah Sentral</option>
                <option value="icu">ICU / HCU Sentral</option>
                <option value="igd">IGD / Gawat Darurat</option>
                <option value="cssd">CSSD (Pusat Sterilisasi)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-outline pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
          {/* Field 3: Jenis Transaksi */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="filter-trx">Jenis Transaksi</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">swap_vertical_circle</span>
              <select className="w-full pl-9 pr-8 py-2 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" defaultValue="all" id="filter-trx">
                <option value="all">Semua Jenis</option>
                <option value="masuk">Masuk (Penerimaan / Vendor)</option>
                <option value="keluar">Keluar (Distribusi / Unit)</option>
                <option value="konfirmasi">Konfirmasi Serah Terima</option>
                <option value="status">Perubahan Status Fisik</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-outline pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
          {/* Field 4: Periode Mulai */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="filter-date-start">Periode Mulai</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">calendar_today</span>
              <input className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-lg font-label-code text-label-code text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="filter-date-start" type="text" defaultValue="01/05/2025" />
            </div>
          </div>
          {/* Field 5: Periode Akhir */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="filter-date-end">Periode Akhir</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">event</span>
              <input className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-lg font-label-code text-label-code text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="filter-date-end" type="text" defaultValue="18/05/2025" />
            </div>
          </div>
          {/* Field 6: Status / Quick Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="filter-status">Status Verifikasi</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">verified_user</span>
              <select className="w-full pl-9 pr-8 py-2 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" defaultValue="all" id="filter-status">
                <option value="all">Semua Status</option>
                <option value="verified">Tervalidasi Digital</option>
                <option value="pending">Menunggu Konfirmasi</option>
                <option value="flagged">Ditinjau Khusus</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-outline pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
        </form>
        {/* Action Buttons & Quick Tag Cluster */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4">
          {/* Quick Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-md text-label-md text-outline">Filter Cepat:</span>
            <button className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1" type="button">
              <span>Hari Ini</span>
              <span className="font-label-code text-[11px] text-outline font-semibold">14</span>
            </button>
            <button className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 shadow-sm" type="button">
              <span>Bulan Ini</span>
              <span className="font-label-code text-[11px] text-on-primary-container/80">148</span>
            </button>
            <button className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
              <span>IBS Only</span>
            </button>
            <button className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
              <span>Khusus Mutasi Keluar</span>
            </button>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-lg text-label-lg font-semibold shadow-sm" type="button">
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Reset</span>
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all font-label-lg text-label-lg font-semibold shadow-sm hover:shadow-md" type="button">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Terapkan Filter</span>
            </button>
            <div className="h-6 w-px bg-surface-container-highest mx-1"></div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors font-label-lg text-label-lg font-semibold shadow-sm" title="Export ke File Excel (.XLSX)" type="button">
              <span className="material-symbols-outlined text-[20px] text-primary">table_view</span>
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors font-label-lg text-label-lg font-semibold shadow-sm" title="Export ke Format CSV" type="button">
              <span className="material-symbols-outlined text-[20px] text-secondary">csv</span>
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Grid Layout: Data Table + Active Detail Modal / Preview Window */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Table (8 Cols on XL) */}
        <div className="xl:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          {/* Table Top Meta */}
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Data Log Mutasi</span>
              <span className="font-badge-sm text-badge-sm px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                20 Per Halaman
              </span>
            </div>
            <div className="flex items-center gap-2 text-outline">
              <span className="font-label-md text-label-md">Menampilkan <strong className="text-on-surface font-semibold">{rangeStart}–{rangeEnd}</strong> dari <strong className="text-on-surface font-semibold">{TOTAL_LOGS}</strong> catatan pergerakan</span>
              <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Muat Ulang Data" type="button">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>
          {/* Responsive Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-surface-container-low text-outline">
                  <th className="py-3 px-4 font-badge-sm text-badge-sm font-bold uppercase tracking-wider" scope="col">Waktu Log</th>
                  <th className="py-3 px-2 font-badge-sm text-badge-sm font-bold uppercase tracking-wider" scope="col">Jenis Transaksi</th>
                  <th className="py-3 px-4 font-badge-sm text-badge-sm font-bold uppercase tracking-wider" scope="col">Nama Alat & Kode</th>
                  <th className="py-3 px-2 font-badge-sm text-badge-sm font-bold uppercase tracking-wider" scope="col">Alur Mutasi</th>
                  <th className="py-3 px-2 font-badge-sm text-badge-sm font-bold uppercase tracking-wider text-center" scope="col">Jumlah</th>
                  <th className="py-3 px-2 font-badge-sm text-badge-sm font-bold uppercase tracking-wider" scope="col">Dicatat Oleh</th>
                  <th className="py-3 px-4 font-badge-sm text-badge-sm font-bold uppercase tracking-wider text-right" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                {/* Row 1 (Active Selected State) */}
                <tr className={rowClass(1)} onClick={() => setSelectedRow(1)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">18 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">09:38:14 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Keluar
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Set Bedah Mayor</span>
                      <span className="font-label-code text-label-code text-primary font-medium">ALT-BDH-004</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Gudang Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">IBS - OK 02</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">2 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold flex items-center justify-center">AS</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Agus Supriyadi</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className={rowClass(2)} onClick={() => setSelectedRow(2)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">18 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">09:15:02 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Masuk
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Defibrillator Mindray D3</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-ICU-089</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">PT Medika</span>
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">Gudang Sentral</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">2 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold flex items-center justify-center">RS</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Ratna Sari</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className={rowClass(3)} onClick={() => setSelectedRow(3)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">18 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">08:50:33 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      Perubahan Status
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Autoclave Pouch Mayo</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-STR-014</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Gudang Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-tertiary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">Sterilisasi CSSD</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">8 Set</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold flex items-center justify-center">DP</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Dedi Prasetyo</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className={rowClass(4)} onClick={() => setSelectedRow(4)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">18 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">08:30:19 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 text-primary font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Konfirmasi
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Set Partus Obstetri</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-BDH-012</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Gudang Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">VK / Bersalin</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">3 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold flex items-center justify-center">SR</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Bdn. Siti R.</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 5 */}
                <tr className={rowClass(5)} onClick={() => setSelectedRow(5)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">18 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">07:45:10 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      Perubahan Status
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Syringe Pump Terumo</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-ICU-077</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">ICU Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-tertiary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">Bengkel Medis</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">1 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold flex items-center justify-center">HI</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Hendri Irawan</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 6 */}
                <tr className={rowClass(6)} onClick={() => setSelectedRow(6)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">18 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">07:15:42 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 text-primary font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Konfirmasi
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Infusion Pump Terumo</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-ICU-102</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Gudang Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">ICU Sentral</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">4 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold flex items-center justify-center">NW</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Ns. Wahyudi</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 7 */}
                <tr className={rowClass(7)} onClick={() => setSelectedRow(7)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">17 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">16:30:55 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Keluar
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Set Hecting Bedah Minor</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-BDH-022</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Gudang Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">IGD Sentral</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">6 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold flex items-center justify-center">AS</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Agus Supriyadi</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 8 */}
                <tr className={rowClass(8)} onClick={() => setSelectedRow(8)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">17 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">14:05:09 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Masuk
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Ventilator Hamilton T1</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-ICU-031</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Uji Sterilisasi</span>
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">Gudang Sentral</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">1 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold flex items-center justify-center">RS</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Ratna Sari</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 9 */}
                <tr className={rowClass(9)} onClick={() => setSelectedRow(9)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">17 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">11:18:24 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Keluar
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Laparoscopy Set HD</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-BDH-078</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">Gudang Sentral</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">IBS - OK 05</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">1 Set</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold flex items-center justify-center">AS</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">Agus Supriyadi</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
                {/* Row 10 */}
                <tr className={rowClass(10)} onClick={() => setSelectedRow(10)}>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">17 Mei 2025</span>
                      <span className="font-label-code text-label-code text-outline">09:44:00 WIB</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 text-primary font-badge-sm text-badge-sm font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Konfirmasi
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface leading-snug">Set Trakeostomi Darurat</span>
                      <span className="font-label-code text-label-code text-outline font-medium">ALT-BDH-091</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className="text-outline truncate max-w-[90px]">CSSD Rilis</span>
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">arrow_forward</span>
                      <span className="font-semibold text-on-surface truncate max-w-[100px]">IGD Resusitasi</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    <span className="font-label-code text-label-code font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">3 Unit</span>
                  </td>
                  <td className="py-3.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold flex items-center justify-center">dr</div>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">dr. Fauzan Sp.B</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-body-sm text-body-sm text-outline">
              <span>Menampilkan {rangeStart}–{rangeEnd} dari {TOTAL_LOGS} catatan log</span>
              <div className="h-4 w-px bg-surface-container"></div>
              <span className="text-on-surface-variant font-medium">Halaman {page} dari {TOTAL_PAGES}</span>
            </div>
            <nav aria-label="Pagination Control" className="flex items-center gap-1">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-outline opacity-50 cursor-not-allowed font-label-md text-label-md font-semibold" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Prev</span>
              </button>
              {[1, 2, 3].map((number) => (
                <button key={number} className={number === page ? "w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center shadow-sm" : "w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium flex items-center justify-center transition-colors"} onClick={() => setPage(number)} type="button">
                  {number}
                </button>
              ))}
              <span className="w-8 text-center text-outline font-label-md">...</span>
              <button className={page === 8 ? "w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center shadow-sm" : "w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium flex items-center justify-center transition-colors"} onClick={() => setPage(8)} type="button">
                8
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md font-semibold shadow-sm" onClick={() => setPage((current) => Math.min(TOTAL_PAGES, current + 1))} type="button">
                <span>Next</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
        {/* Right Column: Detail Modal / Active Preview Window (4 Cols on XL) */}
        {detailOpen && (
          <aside className="xl:col-span-4 sticky top-20 flex flex-col bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden">
            {/* Modal Header Bar */}
            <div className="bg-surface-container-low p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-outline font-bold">Detail Log Transaksi</span>
                  <span className="font-label-code text-label-code font-bold text-on-surface">#TRX-20250518-0042</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors" title="Sematkan Dokumen" type="button">
                  <span className="material-symbols-outlined text-[18px]">push_pin</span>
                </button>
                <button className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-colors" title="Tutup Panel Preview" onClick={() => setDetailOpen(false)} type="button">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
            {/* Modal Body Content */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-220px)]">
              {/* Badge & Timestamp */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm font-bold uppercase shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Keluar / Distribusi
                </span>
                <div className="flex items-center gap-1 text-outline font-label-code text-label-code">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>18/05/2025 09:38:14</span>
                </div>
              </div>
              {/* Instrument Identity Card */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Set Bedah Mayor</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">General Surgery Major Instrument Kit • Tray 04</span>
                  </div>
                  <span className="font-badge-sm text-badge-sm px-2.5 py-1 rounded bg-surface-container-highest text-on-surface font-bold">
                    Grade A1
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 font-label-code text-label-code text-primary font-bold">
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    <span>ALT-BDH-004</span>
                  </div>
                  <span className="text-outline">•</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">Jumlah: 2 Unit (Lengkap)</span>
                </div>
              </div>
              {/* Flow Visual (Clinical Direction Step) */}
              <div className="flex flex-col gap-1.5 py-1">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">Alur Mutasi Fisik Alat</span>
                <div className="relative bg-surface-container-low p-4 rounded-xl shadow-sm flex items-center justify-between gap-2">
                  {/* Origin Location */}
                  <div className="flex flex-col items-start max-w-[42%]">
                    <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline mb-1">
                      <span className="material-symbols-outlined text-[16px]">warehouse</span>
                    </div>
                    <span className="font-label-md text-label-md text-outline font-medium">Asal Logistik</span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface leading-tight mt-0.5">Gudang Inventori Sentral</span>
                    <span className="font-label-code text-[11px] text-outline mt-0.5">Slot: Rak-B02</span>
                  </div>
                  {/* Flow Vector Icon */}
                  <div className="flex flex-col items-center justify-center shrink-0 px-1">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">east</span>
                    </div>
                    <span className="font-badge-sm text-[10px] text-secondary font-bold uppercase mt-1">Distribusi</span>
                  </div>
                  {/* Destination Location */}
                  <div className="flex flex-col items-end text-right max-w-[42%]">
                    <div className="w-7 h-7 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary mb-1">
                      <span className="material-symbols-outlined text-[16px]">local_hospital</span>
                    </div>
                    <span className="font-label-md text-label-md text-outline font-medium">Tujuan Unit</span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface leading-tight mt-0.5">IBS (Ruang OK 02)</span>
                    <span className="font-label-code text-[11px] text-secondary font-semibold mt-0.5">Gedung A Lt. 3</span>
                  </div>
                </div>
              </div>
              {/* Actors / Handover Parties */}
              <div className="grid grid-cols-2 gap-2">
                {/* Dispatcher */}
                <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1 shadow-sm">
                  <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-outline font-bold">Dicatat / Petugas Logistik</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface text-label-md font-bold flex items-center justify-center shrink-0">AS</div>
                    <div className="flex flex-col truncate">
                      <span className="font-label-md text-label-md font-bold text-on-surface truncate">Agus Supriyadi, A.Md</span>
                      <span className="font-body-sm text-[11px] text-outline truncate">Petugas Inventori Sentral</span>
                    </div>
                  </div>
                </div>
                {/* Receiver */}
                <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1 shadow-sm">
                  <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-outline font-bold">Penerima di Unit</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-bold flex items-center justify-center shrink-0">MS</div>
                    <div className="flex flex-col truncate">
                      <span className="font-label-md text-label-md font-bold text-on-surface truncate">Ns. Maya Safitri, S.Kep</span>
                      <span className="font-body-sm text-[11px] text-secondary font-medium truncate">Perawat Instrumen OK 02</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Clinical Notes / Remark */}
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">Catatan Klinis & Kondisi Segel</span>
                <div className="bg-surface-container-low p-3 rounded-lg text-on-surface font-body-md text-body-md flex items-start gap-2.5 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified</span>
                  <p className="leading-relaxed">
                    “Distribusi rutin untuk jadwal operasi elektif laparotomi pagi. Kondisi segel indikator autoclave Kelas 5 utuh bertanggal steril 18/05/2025. Set instrumen lengkap 48 pieces.”
                  </p>
                </div>
              </div>
              {/* Audit Signature Verification */}
              <div className="bg-surface-container rounded-lg p-3 flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">Digital Signature Logged</span>
                    <span className="font-label-code text-[11px] text-outline">SHA256: 7f8a9...b34c10</span>
                  </div>
                </div>
                <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold shadow-sm">
                  VALID
                </span>
              </div>
            </div>
            {/* Modal Action Buttons Footer */}
            <div className="p-4 bg-surface-container-low flex items-center justify-between gap-2">
              <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-lg text-label-lg font-semibold shadow-sm" onClick={() => setDetailOpen(false)} type="button">
                <span className="material-symbols-outlined text-[18px]">close</span>
                <span>Tutup</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all font-label-lg text-label-lg font-semibold shadow-sm hover:shadow-md" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Bukti Mutasi (PDF)</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
