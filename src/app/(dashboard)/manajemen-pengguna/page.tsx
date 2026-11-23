"use client"

import { useState } from "react"

export default function ManajemenPenggunaPage() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")

  const resetFilters = () => {
    setSearch("")
    setRole("all")
    setStatus("all")
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex flex-col gap-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
            <a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span className="">Dashboard</span>
            </a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Manajemen User</span>
          </nav>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Manajemen User</h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full font-badge-sm text-badge-sm bg-surface-container-high text-primary font-medium ml-2">
              Akses Hak & Peran
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span className="">Ekspor CSV</span>
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" type="button">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span className="">Tambah User</span>
          </button>
        </div>
      </div>
      {/* Card 1: Filter & Pencarian User */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Filter & Pencarian User</h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low text-primary rounded-full font-label-md text-label-md font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="">Total: 18 Pengguna Terdaftar</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input className="w-full pl-10 pr-12 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" placeholder="Cari nama atau email..." type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="font-label-code text-badge-sm bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">⌘K</span>
            </span>
          </div>
          {/* Role Filter */}
          <div className="lg:col-span-3 relative">
            <select className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm cursor-pointer" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="all">Semua Role</option>
              <option value="admin_inv">Admin Inventori</option>
              <option value="petugas_inv">Petugas Inventori</option>
              <option value="petugas_medis">Petugas Unit Medis</option>
              <option value="petugas_steril">Petugas Sterilisasi</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </span>
          </div>
          {/* Status Filter */}
          <div className="lg:col-span-3 relative">
            <select className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm cursor-pointer" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </span>
          </div>
          {/* Reset Button */}
          <div className="lg:col-span-1 flex justify-end">
            <button className="w-full sm:w-auto h-11 px-3 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface-variant transition-colors" title="Reset Filter" type="button" onClick={resetFilters}>
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
          </div>
        </div>
      </div>
      {/* Card 2: Tabel Manajemen User */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-container-low/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tabel Manajemen User</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Menampilkan 8 dari 18 pengguna</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface disabled:opacity-40" disabled type="button">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="p-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface" type="button">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold" scope="col">Nama</th>
                <th className="py-3 px-4 font-semibold" scope="col">Email</th>
                <th className="py-3 px-4 font-semibold" scope="col">Role</th>
                <th className="py-3 px-4 font-semibold" scope="col">Unit</th>
                <th className="py-3 px-4 font-semibold" scope="col">Status</th>
                <th className="py-3 px-4 font-semibold" scope="col">Terakhir Login</th>
                <th className="py-3 px-6 font-semibold text-right" scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {/* Row 1: Ratna Sari */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-headline-sm text-body-md font-bold shadow-xs">
                      RS
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Ratna Sari, S.Kep</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 198904122014022001</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">ratna.sari@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Teal Badge: Admin Inventori */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Admin Inventori
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Gudang Sentral</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span className="font-body-sm text-body-sm">Hari ini, 08:14 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2: Agus Supriyadi */}
              <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-headline-sm text-body-md font-bold shadow-xs">
                      AS
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Agus Supriyadi</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 199201152018011003</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">agus.supriyadi@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Blue Badge: Petugas Inventori */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Petugas Inventori
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Gudang Sentral</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span className="font-body-sm text-body-sm">Hari ini, 09:30 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 3: Ns. Maya Safitri */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-headline-sm text-body-md font-bold shadow-xs">
                      MS
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Ns. Maya Safitri, S.Kep</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 199008242015032004</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">maya.safitri@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Purple Badge: Petugas Unit Medis */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Petugas Unit Medis
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">IBS (Kamar Operasi)</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span className="font-body-sm text-body-sm">Hari ini, 07:45 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 4: Dedi Prasetyo */}
              <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-headline-sm text-body-md font-bold shadow-xs">
                      DP
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Dedi Prasetyo, A.Md.Kes</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 199307192019021002</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">dedi.prasetyo@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Orange Badge: Petugas Sterilisasi */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Petugas Sterilisasi
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">CSSD Sterilisasi</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span className="font-body-sm text-body-sm">Hari ini, 08:00 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 5: Hendri Irawan */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-headline-sm text-body-md font-bold shadow-xs">
                      HI
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Hendri Irawan, A.Md.Farm</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 199411032020011005</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">hendri.irawan@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Blue Badge: Petugas Inventori */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Petugas Inventori
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Depo Farmasi & Alkes</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-outline">history</span>
                    <span className="font-body-sm text-body-sm">Kemarin, 17:15 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 6: dr. Anindya Tri */}
              <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-headline-sm text-body-md font-bold shadow-xs">
                      AT
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">dr. Anindya Tri, Sp.An</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 198506142011012001</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">anindya.tri@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Purple Badge: Petugas Unit Medis */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Petugas Unit Medis
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">ICU Sentral</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-outline">history</span>
                    <span className="font-body-sm text-body-sm">04 Nov 2026, 14:20 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 7: Siti Nurhaliza */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-headline-sm text-body-md font-bold shadow-xs">
                      SN
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Siti Nurhaliza, S.Tr.Kes</span>
                      <span className="font-label-code text-badge-sm text-on-surface-variant">NIP. 199602282022032008</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">siti.nurhaliza@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Orange Badge: Petugas Sterilisasi */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-badge-sm text-badge-sm uppercase tracking-wide font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Petugas Sterilisasi
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface font-medium">CSSD Sterilisasi</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed-dim/30 text-primary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-outline">history</span>
                    <span className="font-body-sm text-body-sm">03 Nov 2026, 11:10 WIB</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-md text-label-md font-semibold transition-colors" type="button">
                      Nonaktifkan
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 8 (NONAKTIF ROW): Bambang Sutrisno */}
              <tr className="bg-surface-container-high/30 opacity-75 hover:opacity-90 transition-opacity group">
                <td className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-dim flex items-center justify-center text-outline font-headline-sm text-body-md font-bold">
                      BS
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-semibold text-outline line-through">Bambang Sutrisno</span>
                      <span className="font-label-code text-badge-sm text-outline">NIP. 198205102008121001</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-outline">bambang.sutrisno@rscm.co.id</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {/* Purple Muted Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-outline font-badge-sm text-badge-sm uppercase tracking-wide font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                    Petugas Unit Medis
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-outline">Rawat Inap Lt. 3</span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-dim text-outline font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                    Nonaktif
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-outline">
                    <span className="material-symbols-outlined text-[16px]">block</span>
                    <span className="font-body-sm text-body-sm">12 Agu 2026 (Nonaktif)</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
                      Ubah
                    </button>
                    <button className="px-2.5 py-1 rounded bg-primary-fixed hover:bg-primary hover:text-on-primary text-on-primary-fixed-variant font-label-md text-label-md font-semibold transition-colors" type="button">
                      Aktifkan
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Menampilkan baris 1-8 dari total 18 data pengguna SIM-INSTALMED RSCM
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container" type="button">Sebelumnya</button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary font-label-md text-label-md font-bold" type="button">1</button>
            <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container font-label-md text-label-md" type="button">2</button>
            <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container font-label-md text-label-md" type="button">3</button>
            <button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container" type="button">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  )
}
