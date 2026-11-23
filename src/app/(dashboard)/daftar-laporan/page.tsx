/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"

export default function DaftarLaporanPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [processing, setProcessing] = useState<"idle" | "loading" | "done">("idle")
  const [jenis, setJenis] = useState("ALL")
  const [mulai, setMulai] = useState("2026-10-01")
  const [akhir, setAkhir] = useState("2026-10-31")
  const [unit, setUnit] = useState("ALL")
  const [filtering, setFiltering] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const handleProses = () => {
    setProcessing("loading")
    setTimeout(() => {
      setProcessing("done")
      setTimeout(() => {
        setModalOpen(false)
        setProcessing("idle")
      }, 600)
    }, 900)
  }

  const handleReset = () => {
    setJenis("ALL")
    setMulai("2026-10-01")
    setAkhir("2026-10-31")
    setUnit("ALL")
  }

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFiltering(true)
    setTimeout(() => setFiltering(false), 500)
  }

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Top Context Header & Official Identifier */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-5">
          <img alt="Kemenkes RS Cipto Mangunkusumo" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2-BG7VbkzyLmBFuUaEyYZ0GK0cjZfgRlI_1EMl265x2aErPQNEdy6q107EoUEbYzH_RpYBcBorwNv25UYTY786O4_wX3Qc1oJLIW5DeezOw_kJDaTK0OK_jEFW16-b5VUh0eKCdrQ7kfmWCNXKr-baev_RotfRZFThlKz6xclsbz4ttGi3pxFSF5lbeAzJKDYWzfPlkLBKsfMwn4W-rYv1X4ESURiuYB2_VcWTgkvZDHmqyvYeZId6A" />
          <div className="h-8 w-px bg-surface-variant"></div>
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Laporan</span>
            </nav>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Laporan Inventori</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm uppercase tracking-wider">Arsip Resmi</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors font-label-lg text-label-lg" type="button">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span className="">Jadwal Otomatis</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all shadow-sm font-label-lg text-label-lg" id="btn-buat-laporan" type="button" onClick={() => setModalOpen(true)}>
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="">Buat Laporan</span>
          </button>
        </div>
      </div>
      {/* Operational Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Laporan Terbit</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">142</p>
            <span className="font-badge-sm text-badge-sm text-primary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12 bulan ini
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">description</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Validasi CSSD & Mutu</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">100%</p>
            <span className="font-badge-sm text-badge-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">verified</span> Terverifikasi KARS
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">sanitizer</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pengunduhan Bulan Ini</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">389x</p>
            <span className="font-badge-sm text-badge-sm text-on-surface-variant flex items-center gap-0.5 mt-0.5">
              Oleh 18 PIC Unit
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[22px]">download_for_offline</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Siklus Otomasi Berikut</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">01 Des</p>
            <span className="font-badge-sm text-badge-sm text-on-surface-variant flex items-center gap-0.5 mt-0.5">
              Tutup Buku Medis Nov
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[22px]">event_repeat</span>
          </div>
        </div>
      </div>
      {/* Card 1: Filter Laporan */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
            <h2 className="font-label-lg text-label-lg text-on-surface font-bold">Filter Parameter Laporan</h2>
          </div>
          <span className="font-badge-sm text-badge-sm text-on-surface-variant">Menyaring log arsip digital SIM-INSTALMED</span>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end" id="filter-form" onSubmit={handleFilterSubmit}>
          {/* Jenis Laporan */}
          <div className="md:col-span-3 flex flex-col space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="filter-jenis">Jenis Laporan</label>
            <div className="relative">
              <select className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg py-2.5 pl-3.5 pr-9 appearance-none shadow-sm focus:outline-none bg-surface-container-low/40" id="filter-jenis" value={jenis} onChange={(event) => setJenis(event.target.value)}>
                <option value="ALL">Semua Jenis Laporan</option>
                <option value="STOK">Stok Inventori & Depo</option>
                <option value="PENERIMAAN">Penerimaan & Registrasi Baru</option>
                <option value="DISTRIBUSI">Distribusi & Mutasi Unit</option>
                <option value="STATUS">Status Alat & Insiden Rusak</option>
                <option value="STERILISASI">Sterilisasi CSSD (Autoclave/Plasma)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">expand_more</span>
            </div>
          </div>
          {/* Periode Mulai */}
          <div className="md:col-span-2 flex flex-col space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="filter-mulai">Periode Mulai</label>
            <div className="relative">
              <input className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg py-2 pl-3.5 pr-2 shadow-sm focus:outline-none bg-surface-container-low/40" id="filter-mulai" type="date" value={mulai} onChange={(event) => setMulai(event.target.value)} />
            </div>
          </div>
          {/* Periode Akhir */}
          <div className="md:col-span-2 flex flex-col space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="filter-akhir">Periode Akhir</label>
            <div className="relative">
              <input className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg py-2 pl-3.5 pr-2 shadow-sm focus:outline-none bg-surface-container-low/40" id="filter-akhir" type="date" value={akhir} onChange={(event) => setAkhir(event.target.value)} />
            </div>
          </div>
          {/* Unit / Ruang */}
          <div className="md:col-span-3 flex flex-col space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="filter-unit">Unit / Ruang Pelayanan</label>
            <div className="relative">
              <select className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg py-2.5 pl-3.5 pr-9 appearance-none shadow-sm focus:outline-none bg-surface-container-low/40" id="filter-unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
                <option value="ALL">Semua Unit Kerja</option>
                <option value="GUDANG">Gudang Inventori Sentral</option>
                <option value="IBS">IBS (Kamar Operasi Terpadu)</option>
                <option value="ICU">ICU Sentral / PICU</option>
                <option value="IGD">IGD Bedah & Kedaruratan</option>
                <option value="CSSD">Instalasi CSSD Sterilisasi</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">expand_more</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-md text-label-md font-semibold transition-all shadow-sm" type="submit">
              {filtering ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span className="">Terapkan</span>
                </>
              )}
            </button>
            <button className="py-2.5 px-3 bg-surface-container-low text-on-surface hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors" id="btn-reset" title="Reset Filter" type="button" onClick={handleReset}>
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </form>
      </div>
      {/* Card 2: Tabel Laporan */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Card Header */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[20px]">folder_special</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Arsip & Riwayat Laporan Terbit</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Dokumen terbitan resmi audit medik berstempel tanda tangan digital</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="relative">
              <input className="pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest shadow-sm" placeholder="Cari nama berkas / PIC..." type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            </div>
            <button className="p-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Export batch" type="button">
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
            </button>
          </div>
        </div>
        {/* Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-md text-body-md">
            <thead>
              <tr className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Tanggal Dibuat</th>
                <th className="py-3 px-4 font-semibold">Jenis Laporan</th>
                <th className="py-3 px-4 font-semibold">Periode Audit</th>
                <th className="py-3 px-4 font-semibold">Unit / Lingkup</th>
                <th className="py-3 px-4 font-semibold">Dibuat Oleh</th>
                <th className="py-3 px-4 font-semibold text-center">Format</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-on-surface">
              {/* Row 1: Stok */}
              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">05 Nov 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">14:32 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Stok Inventori
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">01 Okt 2026 – 31 Okt 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">Gudang Inventori Sentral</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Ratna Sari, S.Kep</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 198804122011012003</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-code text-label-code font-bold tracking-wider">PDF</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2: Sterilisasi */}
              <tr className="hover:bg-surface-container-low/60 transition-colors bg-surface-container-lowest">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">04 Nov 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">09:15 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Sterilisasi CSSD
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">15 Okt 2026 – 31 Okt 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">Instalasi CSSD Sentral</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Agus Supriyadi, S.ST</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 198207192005011002</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-code text-label-code font-bold tracking-wider">XLSX</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 3: Distribusi */}
              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">02 Nov 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">17:40 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Distribusi & Mutasi
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">01 Okt 2026 – 31 Okt 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">Instalasi Bedah Sentral (IBS)</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Hendri Irawan, A.Md.Farm</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 199109032015021004</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-code text-label-code font-bold tracking-wider">PDF</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 4: Penerimaan */}
              <tr className="hover:bg-surface-container-low/60 transition-colors bg-surface-container-lowest">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">31 Okt 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">11:04 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Penerimaan Baru
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">01 Okt 2026 – 31 Okt 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">Gudang Logistik Medis</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Ratna Sari, S.Kep</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 198804122011012003</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-code text-label-code font-bold tracking-wider">XLSX</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 5: Status Alat */}
              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">28 Okt 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">16:20 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Status & Insiden
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">01 Okt 2026 – 28 Okt 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">ICU Sentral & PICU</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Ns. Dewi Sartika, M.Kep</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 198502142008032001</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-code text-label-code font-bold tracking-wider">PDF</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 6: Sterilisasi */}
              <tr className="hover:bg-surface-container-low/60 transition-colors bg-surface-container-lowest">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">20 Okt 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">08:50 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Sterilisasi CSSD
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">01 Okt 2026 – 15 Okt 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">Semua Unit Klinis</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Agus Supriyadi, S.ST</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 198207192005011002</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-code text-label-code font-bold tracking-wider">PDF</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 7: Stok Triwulanan */}
              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3.5 px-4 font-label-code text-label-code text-on-surface">
                  <div className="font-semibold">01 Okt 2026</div>
                  <div className="text-on-surface-variant font-body-sm text-body-sm">10:00 WIB</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Stok Inventori
                  </span>
                </td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-medium">01 Jul 2026 – 30 Sep 2026</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm font-semibold text-on-surface">Seluruh RS (Audit Triwulan III)</td>
                <td className="py-3.5 px-4 font-body-sm text-body-sm">
                  <div className="font-medium">Ratna Sari, S.Kep</div>
                  <div className="text-on-surface-variant font-badge-sm text-badge-sm">NIP 198804122011012003</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-code text-label-code font-bold tracking-wider">XLSX</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span className="">Lihat</span>
                    </button>
                    <button className="p-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Unduh Arsip" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table Pagination & Footer Status */}
        <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            Menampilkan <span className="font-semibold text-on-surface">1–7</span> dari <span className="font-semibold text-on-surface">24</span> laporan terbit
          </div>
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm font-label-md text-label-md transition-colors flex items-center gap-1 disabled:opacity-50" type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span className="">Sebelumnya</span>
            </button>
            {[1, 2, 3, 4].map((number) => (
              <button
                key={number}
                className={`w-8 h-8 rounded-lg font-label-md text-label-md shadow-sm transition-colors ${number === page ? "bg-primary text-on-primary font-bold" : "bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-semibold"}`}
                type="button"
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-variant shadow-sm font-label-md text-label-md transition-colors flex items-center gap-1 font-medium" type="button" onClick={() => setPage((value) => Math.min(4, value + 1))}>
              <span className="">Selanjutnya</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      {/* Interactive Slide-over / Modal for "Buat Laporan" (Toggled via JS) */}
      <div className={`fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm items-center justify-center p-4 ${modalOpen ? "flex" : "hidden"}`} id="modal-buat-laporan">
        <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-6 bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">post_add</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Generate Laporan Baru</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Konfigurasi parameter kompilasi data inventori & sterilisasi</p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors" id="btn-close-modal" type="button" onClick={() => setModalOpen(false)}>
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant font-medium mb-1">Pilih Kategori Laporan</label>
              <select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg p-2.5 focus:outline-none">
                <option>Laporan Stok Inventori Instrumen Bedah</option>
                <option>Laporan Hasil Sterilisasi CSSD (Biological & Chemical Indicator)</option>
                <option>Laporan Distribusi & Mutasi Antar Depo</option>
                <option>Laporan Pemeliharaan & Instrumen Rusak / Afkir</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant font-medium mb-1">Tanggal Mulai</label>
                <input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg p-2 focus:outline-none" type="date" defaultValue="2026-11-01" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant font-medium mb-1">Tanggal Sampai</label>
                <input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg p-2 focus:outline-none" type="date" defaultValue="2026-11-05" />
              </div>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant font-medium mb-1">Format Output</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-variant transition-colors">
                  <input className="accent-primary" defaultChecked name="format" type="radio" />
                  <div>
                    <div className="font-label-lg text-label-lg font-bold">PDF Dokumen</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Resmi & Tanda Tangan QR</div>
                  </div>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-variant transition-colors">
                  <input className="accent-primary" name="format" type="radio" />
                  <div>
                    <div className="font-label-lg text-label-lg font-bold">Spreadsheet (XLSX)</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Data tabular analisis lanjut</div>
                  </div>
                </label>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Data akan diekstrak langsung dari database audit RSCM terenkripsi dengan watermark identitas akun pemeriksa saat ini (<strong className="text-on-surface">Ratna Sari, S.Kep</strong>).
              </p>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low flex items-center justify-end gap-3">
            <button className="px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-label-lg text-label-lg transition-colors" id="btn-cancel-modal" type="button" onClick={() => setModalOpen(false)}>
              Batal
            </button>
            <button className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-semibold transition-all shadow-sm flex items-center gap-1.5" id="btn-proses-laporan" type="button" onClick={handleProses}>
              <span className={`material-symbols-outlined text-[18px]${processing === "loading" ? " animate-spin" : ""}`}>
                {processing === "loading" ? "refresh" : processing === "done" ? "check" : "bolt"}
              </span>
              <span className="">{processing === "loading" ? "Mengompilasi..." : processing === "done" ? "Selesai!" : "Proses Sekarang"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
