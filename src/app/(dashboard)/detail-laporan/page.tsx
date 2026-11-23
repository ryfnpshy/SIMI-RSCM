/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"

type TableRow = {
  kode: string
  nama: string
  icon: string
  kategori: string
  unit: string
  awal: string
  masuk: string
  keluar: string
  akhir: string
  akhirColor: string
  badgeClass: string
  dotClass: string
  status: string
}

const tableRows: TableRow[] = [
  {
    kode: "ALT-BDH-001",
    nama: "Pinset Sirurgis 14cm",
    icon: "content_cut",
    kategori: "Instrumen Bedah",
    unit: "Gudang Sentral",
    awal: "40",
    masuk: "+18",
    keluar: "-10",
    akhir: "48",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Tersedia",
  },
  {
    kode: "ALT-STR-014",
    nama: "Autoclave Pouch Set Mayo",
    icon: "sanitizer",
    kategori: "Sterilisasi CSSD",
    unit: "OK (Bedah Sentral)",
    awal: "85",
    masuk: "+30",
    keluar: "-45",
    akhir: "70",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Stok Aman",
  },
  {
    kode: "ALT-ELE-008",
    nama: "Defibrillator Monitor Mindray",
    icon: "monitor_heart",
    kategori: "Elektromedik",
    unit: "IGD (Gawat Darurat)",
    awal: "6",
    masuk: "+2",
    keluar: "-1",
    akhir: "7",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Tersedia",
  },
  {
    kode: "ALT-BDH-023",
    nama: "Gunting Metzenbaum Lengkung 18cm",
    icon: "content_cut",
    kategori: "Instrumen Bedah",
    unit: "OK (Bedah Sentral)",
    awal: "52",
    masuk: "+10",
    keluar: "-14",
    akhir: "48",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Stok Aman",
  },
  {
    kode: "ALT-BDH-045",
    nama: "Klem Hemostatik Pean Lurus 14cm",
    icon: "healing",
    kategori: "Instrumen Bedah",
    unit: "ICU",
    awal: "30",
    masuk: "+5",
    keluar: "-22",
    akhir: "13",
    akhirColor: "text-tertiary",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    dotClass: "bg-tertiary",
    status: "Perlu Restok",
  },
  {
    kode: "ALT-ELE-031",
    nama: "Infusion Pump Terumo TE-LM700",
    icon: "vaccines",
    kategori: "Elektromedik",
    unit: "Rawat Inap",
    awal: "22",
    masuk: "+4",
    keluar: "-3",
    akhir: "23",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Tersedia",
  },
  {
    kode: "ALT-BDH-062",
    nama: "Retractor Langenbeck Medium",
    icon: "precision_manufacturing",
    kategori: "Instrumen Bedah",
    unit: "OK (Bedah Sentral)",
    awal: "25",
    masuk: "+8",
    keluar: "-4",
    akhir: "29",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Stok Aman",
  },
  {
    kode: "ALT-BDH-077",
    nama: "Needle Holder Mayo-Hegar 16cm",
    icon: "colorize",
    kategori: "Instrumen Bedah",
    unit: "Gudang Sentral",
    awal: "38",
    masuk: "+12",
    keluar: "-15",
    akhir: "35",
    akhirColor: "text-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    dotClass: "bg-primary",
    status: "Tersedia",
  },
]

export default function DetailLaporanPage() {
  const [query, setQuery] = useState("")

  const filteredRows = tableRows.filter(
    (row) =>
      row.nama.toLowerCase().includes(query.toLowerCase()) ||
      row.kode.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col w-full">
      <div className="py-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Breadcrumb Bar */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
              <a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Dashboard
              </a>
              <span className="">/</span>
              <a className="hover:text-primary transition-colors" href="#">Laporan</a>
              <span className="">/</span>
              <span className="text-on-surface font-semibold">Detail Laporan</span>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-10 w-1 bg-primary rounded-full"></div>
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Laporan Stok Inventori</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Dokumen Rekapitulasi Fisik &amp; Mutasi Sirkulasi Perangkat Medis</p>
              </div>
            </div>
          </div>
          {/* Action Buttons & Logo */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center pr-4 mr-2 bg-surface-container-low px-4 py-1.5 rounded-lg">
              <img alt="Logo Resmi Kemenkes RS Cipto Mangunkusumo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2-BG7VbkzyLmBFuUaEyYZ0GK0cjZfgRlI_1EMl265x2aErPQNEdy6q107EoUEbYzH_RpYBcBorwNv25UYTY786O4_wX3Qc1oJLIW5DeezOw_kJDaTK0OK_jEFW16-b5VUh0eKCdrQ7kfmWCNXKr-baev_RotfRZFThlKz6xclsbz4ttGi3pxFSF5lbeAzJKDYWzfPlkLBKsfMwn4W-rYv1X4ESURiuYB2_VcWTgkvZDHmqyvYeZId6A" />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high transition-all" type="button">
              <span className="material-symbols-outlined text-[20px] text-secondary">table_view</span>
              <span className="">Unduh Excel</span>
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all" type="button">
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span className="">Unduh PDF</span>
            </button>
          </div>
        </div>
        {/* Card 1: Informasi Laporan (Document Header Clinical Style) */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 bg-surface-container-low px-4 py-2 rounded-lg gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
              <div>
                <span className="font-label-lg text-label-lg font-bold text-on-surface">Informasi Validasi Laporan</span>
                <span className="font-label-code text-label-code text-on-surface-variant block sm:inline sm:ml-2">REF: RSCM/CSSD-INV/2026/XI-004</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim animate-pulse"></span>
              <span className="font-badge-sm text-badge-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed uppercase tracking-wider font-semibold">Terverifikasi / Sah</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Jenis Laporan</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-0.5">Stok Inventori (Bulanan)</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Audit Fisik &amp; Pencatatan Berkala</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Periode Pelaporan</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-0.5">01 Okt 2026 – 31 Okt 2026</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Tahun Anggaran 2026 / Triwulan IV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Unit / Cakupan Lingkup</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-0.5">Semua Unit Medis &amp; Gudang Sentral</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Total 5 Zona Pelayanan Klinis</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Dibuat Oleh</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-0.5">Ratna Sari, S.Kep</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Admin Inventori • NIP: 198902142014022001</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Tanggal Dibuat</span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-0.5">05 Nov 2026, 14:32 WIB</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Server Timestamp RSCM-JKT</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Nomor Dokumen Sistem</span>
              <span className="font-label-code text-label-code text-primary font-bold mt-0.5">RPT-STK-202611-004</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Keaslian terenkripsi SHA-256</span>
            </div>
          </div>
        </section>
        {/* Card 2: Row of 4 Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Total Alat Terdaftar */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Total Alat Terdaftar</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold">1.240</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[26px]">medical_services</span>
              </div>
            </div>
            <div className="mt-4 pt-2 flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">inventory</span>
              <span className="">100% Tercatat barcode RFID</span>
            </div>
          </div>
          {/* Card: Total Penerimaan */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Total Penerimaan (Periode)</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold">156</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[26px]">move_to_inbox</span>
              </div>
            </div>
            <div className="mt-4 pt-2 flex items-center gap-1.5 text-secondary font-label-md text-label-md font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="">+12% dibanding bulan lalu</span>
            </div>
          </div>
          {/* Card: Total Distribusi */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Total Distribusi (Periode)</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold">203</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[26px]">local_shipping</span>
              </div>
            </div>
            <div className="mt-4 pt-2 flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
              <span className="">Terdistribusi ke 8 unit instalasi</span>
            </div>
          </div>
          {/* Card: Total Rusak / Perbaikan */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-badge-sm text-badge-sm uppercase tracking-wider text-on-surface-variant font-medium">Total Rusak / Perbaikan</span>
                <div className="font-headline-xl text-headline-xl text-error font-bold">50</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-error shrink-0">
                <span className="material-symbols-outlined text-[26px]">build_circle</span>
              </div>
            </div>
            <div className="mt-4 pt-2 flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="w-2 h-2 rounded-full bg-error shrink-0"></span>
              <span className="">32 dalam perbaikan, 18 afkir</span>
            </div>
          </div>
        </section>
        {/* Card 3: Visual Chart Card "Pergerakan Stok per Unit" & Clinical Context Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bar Chart Component */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Pergerakan Stok per Unit</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Sebaran alokasi aktiva instrumen medis operasional bulan berjalan</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-badge-sm text-badge-sm px-2.5 py-1 rounded bg-surface-container text-on-surface font-medium">Total: 1.240 Unit</span>
              </div>
            </div>
            {/* Horizontal Clinical Bars */}
            <div className="space-y-4 my-2">
              {/* 1. OK (Instalasi Bedah Sentral) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-label-md font-label-md">
                  <span className="font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">surgical</span>
                    OK (Instalasi Bedah Sentral)
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant font-label-code text-label-code">27.4%</span>
                    <span className="font-bold text-on-surface font-label-md text-label-md">340 unit</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: "27.4%" }}></div>
                </div>
              </div>
              {/* 2. ICU (Intensive Care Unit) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-label-md font-label-md">
                  <span className="font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">monitor_heart</span>
                    ICU (Intensive Care Unit)
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant font-label-code text-label-code">22.6%</span>
                    <span className="font-bold text-on-surface font-label-md text-label-md">280 unit</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full transition-all duration-700" style={{ width: "22.6%" }}></div>
                </div>
              </div>
              {/* 3. Gudang Sentral */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-label-md font-label-md">
                  <span className="font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">warehouse</span>
                    Gudang Sentral
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant font-label-code text-label-code">21.8%</span>
                    <span className="font-bold text-on-surface font-label-md text-label-md">270 unit</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary rounded-full opacity-90 transition-all duration-700" style={{ width: "21.8%" }}></div>
                </div>
              </div>
              {/* 4. IGD (Gawat Darurat) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-label-md font-label-md">
                  <span className="font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">emergency</span>
                    IGD (Gawat Darurat)
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant font-label-code text-label-code">15.3%</span>
                    <span className="font-bold text-on-surface font-label-md text-label-md">190 unit</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: "15.3%" }}></div>
                </div>
              </div>
              {/* 5. Rawat Inap */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-label-md font-label-md">
                  <span className="font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">bed</span>
                    Rawat Inap
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant font-label-code text-label-code">12.9%</span>
                    <span className="font-bold text-on-surface font-label-md text-label-md">160 unit</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full transition-all duration-700" style={{ width: "12.9%" }}></div>
                </div>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap items-center justify-between text-body-sm font-body-sm text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-lg mt-4">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                Turnover rasio steril-ulang rata-rata: <strong>4.2 siklus/minggu</strong>
              </span>
              <span className="text-primary font-semibold">Tingkat Utilisasi 91.8%</span>
            </div>
          </div>
          {/* Operational Visual Sidebar / CSSD Batch Quick Stats */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2">
                <span className="material-symbols-outlined text-primary text-[22px]">sanitizer</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Validitas CSSD &amp; Mutu</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Parameter uji sterilisasi kimia &amp; biologi selama periode laporan Oktober 2026.</p>
              <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm">
                <img className="w-full h-36 object-cover" alt="Central Sterile Supply Department inside Cipto Mangunkusumo hospital, showcasing high-precision autoclave sterilizer chambers, stainless steel medical instrument trays, and hospital staff in clean clinical scrubs and personal protective equipment under cool sterile fluorescent lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM3N3F1huQcDYpBCyVxhEPpIBpLpqR1rKfrv_xMtikVDc_K0xkrQ0vmtLzqdEpDr3kCyQj2AzXdFmpIvtAgw93cUA8R19g8gK0R4492c2S7GIFlmZJ8xXdNLK0QG9mzj3iUgMt1KjP3Tunnkk8jgeIFXpwOvAwMYoQWIP1WTES5-jKsd-Hg-ZFdzrR4_druIJFpKiSsjxz7zqX9U3KfuOZaMdkwLjpHbesvXMrq9yl" />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-on-primary font-label-md text-label-md font-semibold">Zona Sterilisasi Bersih (CSSD RSCM)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-surface-container-low p-2 rounded-lg flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Uji Bowie-Dick Test</span>
                  <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% Lulus
                  </span>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Indikator Biologis 3M Attest</span>
                  <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Negatif (Aman)
                  </span>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Suhu &amp; Tekanan Autoclave</span>
                  <span className="font-label-code text-label-code font-semibold text-on-surface">134°C / 2.1 bar</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2">
              <div className="flex items-center gap-2 p-2 bg-primary-fixed/40 rounded-lg">
                <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                <span className="font-badge-sm text-badge-sm text-on-surface font-medium leading-tight">Seluruh tray bedah siap pakai lolos akreditasi KARS &amp; JCI</span>
              </div>
            </div>
          </div>
        </section>
        {/* Card 4: Tabel Data Laporan (Full Detailed Medical Inventory Table) */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          {/* Table Header & Controls */}
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Tabel Data Laporan Inventori</h2>
                <span className="font-badge-sm text-badge-sm bg-surface-container px-2 py-0.5 rounded-full font-semibold text-on-surface-variant">8 Komoditas Utama</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Rincian mutasi fisik masuk-keluar beserta saldo akhir per alat medis</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input
                  className="pl-9 pr-4 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors w-64"
                  placeholder="Cari nama / kode alat..."
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <button className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>
          </div>
          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold" scope="col">Kode Alat</th>
                  <th className="py-3.5 px-4 font-semibold" scope="col">Nama Alat</th>
                  <th className="py-3.5 px-4 font-semibold" scope="col">Kategori</th>
                  <th className="py-3.5 px-4 font-semibold" scope="col">Unit Penempatan</th>
                  <th className="py-3.5 px-4 font-semibold text-right" scope="col">Stok Awal</th>
                  <th className="py-3.5 px-4 font-semibold text-right" scope="col">Masuk</th>
                  <th className="py-3.5 px-4 font-semibold text-right" scope="col">Keluar</th>
                  <th className="py-3.5 px-4 font-semibold text-right" scope="col">Stok Akhir</th>
                  <th className="py-3.5 px-4 font-semibold text-center" scope="col">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-md text-body-md">
                {filteredRows.map((row) => (
                  <tr key={row.kode} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-label-code text-label-code text-primary font-semibold whitespace-nowrap">{row.kode}</td>
                    <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{row.icon}</span>
                        {row.nama}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">{row.kategori}</td>
                    <td className="py-3 px-4 text-on-surface whitespace-nowrap">{row.unit}</td>
                    <td className="py-3 px-4 text-right font-label-code text-label-code text-on-surface-variant">{row.awal}</td>
                    <td className="py-3 px-4 text-right font-label-code text-label-code text-primary font-medium">{row.masuk}</td>
                    <td className="py-3 px-4 text-right font-label-code text-label-code text-on-surface-variant">{row.keluar}</td>
                    <td className={`py-3 px-4 text-right font-label-code text-label-code font-bold ${row.akhirColor} text-[15px]`}>{row.akhir}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${row.badgeClass} font-badge-sm text-badge-sm font-semibold uppercase`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.dotClass}`}></span>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination / Summary Row */}
          <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <span className="">Menampilkan 8 dari total 142 baris komoditas instrumen</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-50" disabled type="button">Sebelumnya</button>
              <span className="px-2 font-semibold text-on-surface">1</span>
              <button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors" type="button">Selanjutnya</button>
            </div>
          </div>
        </section>
        {/* Footer Actions Card */}
        <footer className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            <span className="">Dokumen telah ditandatangani secara elektronik (BSrE - BSSN RI)</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors" type="button">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="">Kembali ke Daftar Laporan</span>
            </button>
            <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high transition-colors" onClick={() => window.print()} type="button">
              <span className="material-symbols-outlined text-[20px]">print</span>
              <span className="">Cetak Dokumen</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
