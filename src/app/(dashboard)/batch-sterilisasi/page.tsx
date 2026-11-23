"use client"

import { useMemo, useRef, useState, useEffect } from "react"

type BatchRow = {
  batch: string
  tahap: string
  unit: string
  date: string
  jumlah: number
  pj: string
  tahapLabel: string
  progress: number
  cito?: boolean
  barcodeColor: string
  badgeClass: string
  dotClass: string
  personColor: string
  barClass: string
  progressTextClass: string
  detailClass: string
}

const batchRows: BatchRow[] = [
  {
    batch: "CSSD-20261105-001",
    tahap: "Sterilization",
    unit: "IBS (Kamar Operasi)",
    date: "05 Nov 2026, 08:15 WIB",
    jumlah: 24,
    pj: "Dedi Prasetyo, A.Md.Kes",
    tahapLabel: "5/6 tahap",
    progress: 83,
    cito: true,
    barcodeColor: "text-primary",
    badgeClass: "bg-surface-variant text-on-primary-fixed-variant",
    dotClass: "bg-primary-container animate-pulse",
    personColor: "text-primary",
    barClass: "bg-primary",
    progressTextClass: "text-primary",
    detailClass: "hover:bg-primary hover:text-on-primary text-primary",
  },
  {
    batch: "CSSD-20261105-002",
    tahap: "Packing",
    unit: "IGD PONEK",
    date: "05 Nov 2026, 09:30 WIB",
    jumlah: 18,
    pj: "Siti Nurhaliza, S.Tr.Kes",
    tahapLabel: "4/6 tahap",
    progress: 66,
    barcodeColor: "text-secondary",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    dotClass: "bg-secondary",
    personColor: "text-secondary",
    barClass: "bg-secondary",
    progressTextClass: "text-secondary",
    detailClass: "hover:bg-secondary hover:text-on-secondary text-secondary",
  },
  {
    batch: "CSSD-20261105-003",
    tahap: "Disinfection",
    unit: "ICU Sentral",
    date: "05 Nov 2026, 10:00 WIB",
    jumlah: 12,
    pj: "Budi Santoso",
    tahapLabel: "3/6 tahap",
    progress: 50,
    barcodeColor: "text-tertiary",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    dotClass: "bg-tertiary",
    personColor: "text-tertiary",
    barClass: "bg-tertiary-container",
    progressTextClass: "text-tertiary",
    detailClass: "hover:bg-tertiary hover:text-on-tertiary text-tertiary",
  },
  {
    batch: "CSSD-20261105-004",
    tahap: "Cleaning",
    unit: "Poliklinik Gigi",
    date: "05 Nov 2026, 10:45 WIB",
    jumlah: 15,
    pj: "Dedi Prasetyo, A.Md.Kes",
    tahapLabel: "2/6 tahap",
    progress: 33,
    barcodeColor: "text-tertiary-container",
    badgeClass: "bg-tertiary-fixed-dim text-on-tertiary-fixed",
    dotClass: "bg-tertiary-container",
    personColor: "text-tertiary",
    barClass: "bg-tertiary-container",
    progressTextClass: "text-tertiary-container",
    detailClass: "hover:bg-tertiary-container hover:text-on-tertiary text-tertiary-container",
  },
  {
    batch: "CSSD-20261105-005",
    tahap: "Penerimaan Kotor",
    unit: "Rawat Inap Lt. 3",
    date: "05 Nov 2026, 11:20 WIB",
    jumlah: 8,
    pj: "Siti Nurhaliza, S.Tr.Kes",
    tahapLabel: "1/6 tahap",
    progress: 16,
    barcodeColor: "text-error",
    badgeClass: "bg-error-container text-on-error-container",
    dotClass: "bg-error",
    personColor: "text-error",
    barClass: "bg-error",
    progressTextClass: "text-error",
    detailClass: "hover:bg-error hover:text-on-error text-error",
  },
  {
    batch: "CSSD-20261104-012",
    tahap: "Selesai / Distribusi",
    unit: "IBS (Kamar Operasi)",
    date: "04 Nov 2026, 16:00 WIB",
    jumlah: 30,
    pj: "Agus Hendra",
    tahapLabel: "6/6 tahap",
    progress: 100,
    barcodeColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    personColor: "text-primary",
    barClass: "bg-primary",
    progressTextClass: "text-primary",
    detailClass: "hover:bg-primary hover:text-on-primary text-primary",
  },
]

const quickPills = [
  { id: "hari-ini", label: "Hari Ini (8)", dot: false },
  { id: "autoclave-a", label: "Autoclave Mesin A", dot: false },
  { id: "prioritas-cito", label: "Prioritas Cito", dot: true },
  { id: "kamar-operasi", label: "IBS Kamar Operasi", dot: false },
] as const

function modalBadgeClass(tahap: string) {
  if (tahap === "Sterilization") return "bg-surface-variant text-on-primary-fixed-variant"
  if (tahap === "Packing") return "bg-secondary-fixed text-on-secondary-fixed"
  if (tahap === "Disinfection") return "bg-tertiary-fixed text-on-tertiary-fixed-variant"
  if (tahap === "Cleaning") return "bg-tertiary-fixed-dim text-on-tertiary-fixed"
  if (tahap === "Penerimaan Kotor") return "bg-error-container text-on-error-container"
  return "bg-primary-fixed text-on-primary-fixed"
}

export default function BatchSterilisasiPage() {
  const [search, setSearch] = useState("")
  const [filterTahap, setFilterTahap] = useState("ALL")
  const [filterUnit, setFilterUnit] = useState("ALL")
  const [activePill, setActivePill] = useState<string>("hari-ini")
  const [selected, setSelected] = useState<BatchRow | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const visibleRows = useMemo(
    () =>
      batchRows.filter((row) => {
        const matchSearch = row.batch.toLowerCase().includes(search.toLowerCase())
        const matchTahap = filterTahap === "ALL" || row.tahap === filterTahap
        const matchUnit = filterUnit === "ALL" || row.unit === filterUnit
        return matchSearch && matchTahap && matchUnit
      }),
    [search, filterTahap, filterUnit]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || e.key === "F2") {
        e.preventDefault()
        if (searchRef.current) {
          searchRef.current.focus()
          searchRef.current.select()
        }
      }
      if (e.key === "Escape") {
        setSelected(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const resetFilter = () => {
    setSearch("")
    setFilterTahap("ALL")
    setFilterUnit("ALL")
    setActivePill("")
  }

  const applyPill = (id: string) => {
    setActivePill(id)
    if (id === "kamar-operasi") {
      setFilterUnit("IBS (Kamar Operasi)")
    } else if (id === "prioritas-cito") {
      setSearch("001")
    } else {
      setFilterUnit("ALL")
      setSearch("")
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
        <div className="flex flex-col min-w-0">
          <nav className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant mb-1">
            <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Sterilisasi CSSD</span>
          </nav>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Sterilisasi CSSD</h2>
            <span className="bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">Live Monitor</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Pemantauan siklus sterilisasi instrumen bedah dan disinfeksi sentral RSCM Kemenkes RI</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-[20px] text-primary">qr_code_scanner</span>
            <span className="">Scan Barcode [F2]</span>
          </button>
          <button className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-sm hover:shadow-md" type="button">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="">Buat Batch Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Cards (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Batch Aktif */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Batch Aktif</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">6</span>
                <span className="font-badge-sm text-badge-sm text-primary font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping mr-1" />Proses
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">autorenew</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 pt-2 bg-surface-container-low/40 rounded px-2 py-1">
            Sedang berjalan di unit CSSD
          </p>
        </div>
        {/* Card 2: Menunggu Sterilisasi */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-container/10 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Menunggu Sterilisasi</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-secondary font-bold">2</span>
                <span className="font-badge-sm text-badge-sm text-secondary font-semibold">Siap Autoclave</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 pt-2 bg-surface-container-low/40 rounded px-2 py-1">
            Tahap packing selesai
          </p>
        </div>
        {/* Card 3: Selesai Hari Ini */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-fixed/20 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Selesai Hari Ini</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">4</span>
                <span className="font-badge-sm text-badge-sm text-primary font-semibold flex items-center">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">verified</span>QC Lulus
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 pt-2 bg-surface-container-low/40 rounded px-2 py-1">
            Siap didistribusikan ke unit
          </p>
        </div>
        {/* Card 4: Alat Dalam Proses */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary-fixed/30 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Alat Dalam Proses</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-tertiary font-bold">87</span>
                <span className="font-badge-sm text-badge-sm text-tertiary font-semibold">Instrumen</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[24px]">medical_services</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 pt-2 bg-surface-container-low/40 rounded px-2 py-1">
            Total instrumen klinis
          </p>
        </div>
      </div>

      {/* CSSD Visual Pipeline Indicator Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">Alur Standar Sterilisasi CSSD (ISO 17665-1 / Permenkes)</span>
          </div>
          <span className="font-badge-sm text-badge-sm text-on-surface-variant uppercase tracking-wider">6 Tahapan Siklus Lengkap</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-error-container/30">
            <span className="w-6 h-6 rounded-full bg-error-container text-on-error-container font-label-md text-label-md flex items-center justify-center font-bold">1</span>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-error font-semibold truncate leading-tight">Penerimaan</p>
              <span className="font-badge-sm text-badge-sm text-on-surface-variant">Kotor / Sortir</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-tertiary-fixed/30">
            <span className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md flex items-center justify-center font-bold">2</span>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-tertiary font-semibold truncate leading-tight">Cleaning</p>
              <span className="font-badge-sm text-badge-sm text-on-surface-variant">Ultrasonik/Manual</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-tertiary-container/15">
            <span className="w-6 h-6 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md flex items-center justify-center font-bold">3</span>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-tertiary-container font-semibold truncate leading-tight">Disinfection</p>
              <span className="font-badge-sm text-badge-sm text-on-surface-variant">HLD Enzimatis</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary-fixed/40">
            <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md flex items-center justify-center font-bold">4</span>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-secondary font-semibold truncate leading-tight">Packing</p>
              <span className="font-badge-sm text-badge-sm text-on-surface-variant">Pouches / Linen</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-variant">
            <span className="w-6 h-6 rounded-full bg-primary-fixed-dim text-on-primary-fixed-variant font-label-md text-label-md flex items-center justify-center font-bold">5</span>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-primary font-semibold truncate leading-tight">Sterilization</p>
              <span className="font-badge-sm text-badge-sm text-on-surface-variant">Autoclave 134°C</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary-fixed/30">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md flex items-center justify-center font-bold">6</span>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-primary font-semibold truncate leading-tight">Distribusi</p>
              <span className="font-badge-sm text-badge-sm text-on-surface-variant">QC Rilis & Kirim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Pencarian Batch */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search input with hotkey */}
            <div className="relative flex-1 min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                ref={searchRef}
                className="w-full pl-11 pr-24 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
                id="batchSearchInput"
                placeholder="Cari kode batch (misal: CSSD-20261105...)"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-label-code text-label-code text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                <span className="">Ctrl</span><span className="">K</span>
              </div>
            </div>
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Dropdown Tahap */}
              <div className="relative min-w-[170px]">
                <select
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-surface-container-low rounded-lg font-label-lg text-label-lg text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                  id="filterTahap"
                  value={filterTahap}
                  onChange={(e) => setFilterTahap(e.target.value)}
                >
                  <option value="ALL">Semua Tahap</option>
                  <option value="Penerimaan Kotor">Penerimaan Kotor</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Disinfection">Disinfection</option>
                  <option value="Packing">Packing</option>
                  <option value="Sterilization">Sterilization</option>
                  <option value="Selesai / Distribusi">Selesai / Distribusi</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>
              {/* Dropdown Unit */}
              <div className="relative min-w-[190px]">
                <select
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-surface-container-low rounded-lg font-label-lg text-label-lg text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                  id="filterUnit"
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}
                >
                  <option value="ALL">Semua Unit</option>
                  <option value="IBS (Kamar Operasi)">Instalasi Bedah Sentral (IBS)</option>
                  <option value="IGD PONEK">IGD PONEK</option>
                  <option value="ICU Sentral">ICU Sentral</option>
                  <option value="Poliklinik Gigi">Poliklinik Gigi</option>
                  <option value="Rawat Inap Lt. 3">Rawat Inap Lt. 3</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>
              <button className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center gap-1 transition-colors" id="resetFilterBtn" type="button" onClick={resetFilter}>
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span className="">Reset</span>
              </button>
            </div>
          </div>
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-nowrap">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
              Filter Cepat:
            </span>
            {quickPills.map((pill) => {
              const isActive = activePill === pill.id
              return (
                <button
                  key={pill.id}
                  className={`quick-pill px-3 py-1 rounded-full font-label-md text-label-md transition-all ${pill.dot ? "flex items-center gap-1 " : ""}${isActive ? "active bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`}
                  data-filter={pill.id}
                  type="button"
                  onClick={() => applyPill(pill.id)}
                >
                  {pill.dot && <span className="w-2 h-2 rounded-full bg-error" />}
                  {pill.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">table_chart</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tabel Daftar Batch Sterilisasi</h3>
            <span className="font-badge-sm text-badge-sm bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-semibold" id="batchCountBadge">{visibleRows.length} Batch Ditampilkan</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-on-surface-variant hover:text-on-surface p-1.5 rounded hover:bg-surface-container-high transition-colors" title="Export Excel" type="button">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface p-1.5 rounded hover:bg-surface-container-high transition-colors" title="Print Log Sheet" type="button">
              <span className="material-symbols-outlined text-[20px]">print</span>
            </button>
          </div>
        </div>
        {/* Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse" id="batchTable">
            <thead>
              <tr className="bg-surface-container-low/70 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Kode Batch</th>
                <th className="py-3.5 px-4">Tanggal Mulai</th>
                <th className="py-3.5 px-4">Jumlah Alat</th>
                <th className="py-3.5 px-4">Tahap Saat Ini</th>
                <th className="py-3.5 px-4">Unit Asal</th>
                <th className="py-3.5 px-4">Penanggung Jawab</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-md text-body-md text-on-surface">
              {visibleRows.map((row) => (
                <tr key={row.batch} className="hover:bg-surface-container-low transition-colors group" data-batch={row.batch} data-tahap={row.tahap} data-unit={row.unit}>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined ${row.barcodeColor} text-[18px]`}>barcode</span>
                      <span className="font-label-code text-label-code text-on-surface font-semibold tracking-wide">{row.batch}</span>
                      {row.cito && (
                        <span className="font-badge-sm text-badge-sm px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-bold">CITO</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant whitespace-nowrap">{row.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-on-surface">{row.jumlah}</span> <span className="text-on-surface-variant text-body-sm">Unit</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${row.badgeClass} font-label-md text-label-md font-semibold`}>
                      <span className={`w-2 h-2 rounded-full ${row.dotClass}`} />
                      {row.tahap}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface">{row.unit}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[16px] ${row.personColor}`}>person</span>
                      <span className="">{row.pj}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 min-w-[160px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-label-md text-label-md">
                        <span className={`font-semibold ${row.progressTextClass}`}>{row.tahapLabel}</span>
                        <span className="font-label-code text-label-code text-on-surface-variant">{row.progress}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                        <div className={`${row.barClass} h-2 rounded-full transition-all duration-500`} style={{ width: `${row.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className={`px-3 py-1.5 rounded-lg bg-surface-container ${row.detailClass} font-label-md text-label-md transition-all shadow-xs`} onClick={() => setSelected(row)} type="button">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 bg-surface-container-lowest border-t-0 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Menampilkan <span className="font-semibold text-on-surface">1-6</span> dari <span className="font-semibold text-on-surface">6</span> batch aktif
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-30" disabled type="button">
              <span className="material-symbols-outlined text-[18px]">first_page</span>
            </button>
            <button className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-30" disabled type="button">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded bg-primary text-on-primary font-label-md text-label-md font-semibold" type="button">1</button>
            <button className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-30" disabled type="button">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
            <button className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-30" disabled type="button">
              <span className="material-symbols-outlined text-[18px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Audit & CSSD Autoclave Status Drawer / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Machine Status Monitor */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">heat_pump</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Status Mesin Autoclave</h4>
            </div>
            <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed uppercase font-semibold">Live Telemetri</span>
          </div>
          <div className="space-y-3">
            {/* Chamber 1 */}
            <div className="p-2 bg-surface-container-low rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">Autoclave STEAM-01 (Getinge)</span>
                <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">134.2°C • 2.1 bar</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span className="">Siklus Porous Load #4 — Sterilisasi</span>
                <span className="font-semibold text-primary">Sisa 18 Menit</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: "72%" }} />
              </div>
            </div>
            {/* Chamber 2 */}
            <div className="p-2 bg-surface-container-low rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">Autoclave PLASMA-02 (Sterrad)</span>
                <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">STANDBY</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span className="">Instrumen Laparoskopi / Suhu Rendah</span>
                <span className="font-medium text-secondary">Siap Pemuatan</span>
              </div>
            </div>
          </div>
        </div>
        {/* Biological Indicator QC Testing */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">biotech</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Indikator Biologi (BI Test)</h4>
            </div>
            <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed uppercase font-semibold">24 Jam</span>
          </div>
          <div className="space-y-3 font-body-sm text-body-sm">
            <div className="p-2 bg-surface-container-low rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">check_circle</span>
              <div className="min-w-0">
                <p className="font-label-lg text-label-lg font-semibold text-on-surface">Geobacillus stearothermophilus</p>
                <p className="text-on-surface-variant">Lot #B1104-A • Inkubasi 3 Jam (Attest 3M) — <strong className="text-primary">NEGATIF (LULUS QC)</strong></p>
                <span className="font-badge-sm text-badge-sm text-on-surface-variant">Divalidasi: Ns. Farida, S.Kep (Pukul 07:00)</span>
              </div>
            </div>
            <div className="p-2 bg-surface-container-low rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary text-[24px] shrink-0 mt-0.5">hourglass_top</span>
              <div className="min-w-0">
                <p className="font-label-lg text-label-lg font-semibold text-on-surface">Bowie-Dick Air Removal Test</p>
                <p className="text-on-surface-variant">Sheet Kimia Kelas 2 — Perubahan warna seragam terverifikasi pada Steam Chamber 01.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Quick SOP & Safety Standards */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">gavel</span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Standar Kepatuhan Kemenkes</h4>
              </div>
            </div>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified_user</span>
                <span className="">Semua kemasan wajib mencantumkan label kedaluwarsa maksimal 30 hari (pouches ganda).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified_user</span>
                <span className="">Instrumen kotor wajib melewati perendaman larutan enzimatik selambatnya 15 menit paska operasi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified_user</span>
                <span className="">Dokumentasi Bowie-Dick dan grafik fisik autoclave wajib disimpan minimal 5 tahun.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Petugas Supervisor Jaga:</span>
            <span className="font-label-md text-label-md text-primary font-bold">Ns. Tri Handayani, S.Kep, M.Kep</span>
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay (Hidden by default, triggered by "Detail" button) */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-4" id="batchDetailModal">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-code text-label-code px-2 py-0.5 rounded bg-surface-container text-primary font-bold" id="modalBatchCode">{selected.batch}</span>
                  <span className={`font-badge-sm text-badge-sm px-2.5 py-0.5 rounded-full font-semibold ${modalBadgeClass(selected.tahap)}`} id="modalTahapBadge">{selected.tahap}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">Detail Siklus Sterilisasi Batch</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">RSCM Instalasi Sterilisasi Sentral (CSSD)</p>
              </div>
              <button className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant" onClick={() => setSelected(null)} type="button">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-lg text-body-sm">
                <div>
                  <span className="font-label-md text-label-md text-on-surface-variant block">Unit Pengirim</span>
                  <strong className="text-on-surface" id="modalUnit">{selected.unit}</strong>
                </div>
                <div>
                  <span className="font-label-md text-label-md text-on-surface-variant block">Jumlah Alat</span>
                  <strong className="text-on-surface" id="modalJumlah">{selected.jumlah} Unit Instrumen</strong>
                </div>
                <div>
                  <span className="font-label-md text-label-md text-on-surface-variant block">Penanggung Jawab</span>
                  <strong className="text-on-surface" id="modalPJ">{selected.pj}</strong>
                </div>
              </div>
              <div className="space-y-2">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface block">Rincian Set Alat Klinis dalam Batch:</span>
                <div className="bg-surface-container-lowest rounded-lg divide-y divide-surface-container text-body-sm max-h-48 overflow-y-auto pr-1">
                  <div className="p-2 flex items-center justify-between">
                    <span className="font-medium text-on-surface">Set Bedah Mayor Laparatomi No. 04</span>
                    <span className="font-badge-sm text-badge-sm text-primary bg-primary-fixed px-2 py-0.5 rounded font-semibold">12 Pcs</span>
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="font-medium text-on-surface">Set Klem Hemostatik Kelly Curva (14cm)</span>
                    <span className="font-badge-sm text-badge-sm text-primary bg-primary-fixed px-2 py-0.5 rounded font-semibold">6 Pcs</span>
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="font-medium text-on-surface">Bakis Stainless Steel Tray Uk. 30x20</span>
                    <span className="font-badge-sm text-badge-sm text-primary bg-primary-fixed px-2 py-0.5 rounded font-semibold">2 Pcs</span>
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="font-medium text-on-surface">Pinset Anatomis & Cirurgis Fine-Tip</span>
                    <span className="font-badge-sm text-badge-sm text-primary bg-primary-fixed px-2 py-0.5 rounded font-semibold">4 Pcs</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                <div className="text-body-sm">
                  <span className="font-semibold text-on-surface block">Indikator Kimia Kelas 5 Integrator: OK</span>
                  <span className="text-on-surface-variant">Warna telah bergeser penuh ke jendela &ldquo;ACCEPT&rdquo; pada suhu 134°C selama 7 menit.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t-0">
              <button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onClick={() => setSelected(null)} type="button">
                Tutup
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span className="">Cetak Label Steril (Barcode)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
