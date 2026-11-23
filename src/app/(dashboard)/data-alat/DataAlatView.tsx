/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { setAlatAktif } from "@/lib/actions/inventori"
import { lanjutkanAksi } from "@/components/ui/aksiKlien"
import type { RingkasAlat } from "@/lib/data"

const PER_HALAMAN = 10

function kategoriChipClass(kategori: string, aktif: boolean) {
  if (!aktif) return "text-on-surface-variant bg-surface-container-high"
  if (kategori.toLowerCase().includes("steril")) return "text-tertiary-container bg-tertiary-fixed/40"
  return "text-secondary bg-surface-container"
}

export function DataAlatView({ rows }: { rows: RingkasAlat[] }) {
  const [search, setSearch] = useState("")
  const [kategori, setKategori] = useState("")
  const [status, setStatus] = useState("")
  const [halaman, setHalaman] = useState(1)
  const [deactivateTarget, setDeactivateTarget] = useState<RingkasAlat | null>(null)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const daftarKategori = useMemo(
    () => Array.from(new Set(rows.map((row) => row.kategori))).sort(),
    [rows]
  )

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase().trim()
    return rows.filter((row) => {
      const matchesSearch =
        !query || row.kode_unik.toLowerCase().includes(query) || row.nama.toLowerCase().includes(query)
      const matchesKategori = !kategori || row.kategori === kategori
      const matchesStatus = !status || (status === "Aktif" ? row.aktif : !row.aktif)
      return matchesSearch && matchesKategori && matchesStatus
    })
  }, [rows, search, kategori, status])

  const totalHalaman = Math.max(1, Math.ceil(filteredRows.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, totalHalaman)
  const barisTampil = filteredRows.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "F2") {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
      if (event.key === "Escape") {
        setDeactivateTarget(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  function showToast(message: string) {
    setToast({ id: Date.now(), message })
  }

  function resetFilters() {
    setSearch("")
    setKategori("")
    setStatus("")
    setHalaman(1)
    showToast("Filter pencarian telah dibersihkan.")
  }

  function ubahAktif(target: RingkasAlat, aktif: boolean) {
    const data = new FormData()
    data.set("id", target.id)
    data.set("aktif", String(aktif))
    startTransition(async () => {
      lanjutkanAksi(await setAlatAktif(data))
    })
  }

  function confirmDeactivate() {
    if (!deactivateTarget) return
    ubahAktif(deactivateTarget, false)
    setDeactivateTarget(null)
  }

  function exportCsv() {
    const header = ["kode_unik", "nama", "kategori", "jenis", "satuan", "total_stok", "minimum_stok", "aktif"]
    const isi = filteredRows.map((row) =>
      [row.kode_unik, row.nama, row.kategori, row.jenis, row.satuan, row.total_stok, row.jumlah_minimum_stok, row.aktif ? "aktif" : "nonaktif"]
        .map((sel) => `"${String(sel).replace(/"/g, '""')}"`)
        .join(",")
    )
    const blob = new Blob([[header.join(","), ...isi].join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const tautan = document.createElement("a")
    tautan.href = url
    tautan.download = "data-alat-simi.csv"
    tautan.click()
    URL.revokeObjectURL(url)
    showToast(`${filteredRows.length} baris diekspor ke CSV.`)
  }

  const totalTerdaftar = rows.length
  const totalAktif = rows.filter((row) => row.aktif).length

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div className="flex flex-col gap-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" href="/dashboard">
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span className="">Dashboard</span>
            </Link>
            <span className="material-symbols-outlined text-xs text-outline-variant">chevron_right</span>
            <span className="font-label-md text-label-md text-primary font-semibold">Data Alat</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Data Alat Medis</h1>
        </div>
        {/* Quick Stats Micro Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">inventory_2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase text-on-surface-variant">Total Terdaftar</span>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">{totalTerdaftar} Jenis</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-badge-sm text-badge-sm uppercase text-on-surface-variant">Aktif Operasional</span>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">{totalAktif} Jenis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Inventory Overview Banner with Clinical Visual */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-container via-primary to-surface-tint p-6 text-on-primary shadow-sm mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 bg-on-primary/10 px-2.5 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
              <span className="font-badge-sm text-badge-sm text-primary-fixed uppercase tracking-wider">Katalog Terpusat SIM-RS</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-white">Inventarisasi &amp; Pelacakan CSSD / Bedah</h2>
            <p className="font-body-md text-body-md text-on-primary-container opacity-90">
              Kelola master data instrumen klinis, kode unik, serta standarisasi wadah sterilisasi siap pakai di seluruh instalasi RSUP Nasional Dr. Cipto Mangunkusumo (RSCM).
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md hidden lg:block">
              <img className="w-full h-full object-cover" alt="Close up of medical sterile surgical tools neatly ordered in a surgical tray under sterile theater lighting with clean teal tones and reflective surgical steel" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0ZZlmd8pOtrr7h4saZYaYOprKMsAJSbYckwPEQQn1vJkBA2oI5jLTJcaQ5owhfxM5oA3LSunCxkn3BI1vay7nNdU4dUFYps88f8qyw1VTt6cVf2w6pDbqMogSChACot01KBNIJnA-jCxlK_6klv1-fViUEGO611vW-l95eqg__FLi22QFuB_GJq4Dfr4WACS3MWeXiA4UgWRrCrHHE95fLp7WUrFrUf5i7JJK0bK7" />
            </div>
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md hidden lg:block">
              <img className="w-full h-full object-cover" alt="Laboratory technician recording the unique code of a surgical instrument tray in a sterile hospital reprocessing department" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdXwsxZAihStBWYAjqDkqli2y_Ep9lnHO7DUllDgBpx2P9zgBLlsrVv9fenHbUasLv6ZmfizVMUK6hO37_yPd218rpnSweS32361spJWwWJfuHv9EfqyEU_7FGtcGAu_V_gQhWRuGHDSR5x-AD50y84Zu9nir839Qev78Kq8tTPsALOe_lkYkvmPQN2Kn3Uwz66P_U1qYeF_VXkzwe_KtLPr9bUm58VAiakLrT1Y" />
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* Main Data Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Action & Filter Toolbar */}
        <div className="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-surface-container-lowest">
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Field */}
            <div className="relative min-w-[260px] flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">search</span>
              <input
                ref={searchInputRef}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
                id="searchInput"
                placeholder="Cari kode unik atau nama alat..."
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setHalaman(1)
                }}
              />
              <span className="font-label-code text-label-code text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container-high px-1.5 py-0.5 rounded text-[10px]">F2</span>
            </div>
            {/* Filter Category */}
            <div className="relative min-w-[170px]">
              <select
                aria-label="Filter Berdasarkan Kategori"
                className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
                id="kategoriFilter"
                value={kategori}
                onChange={(event) => {
                  setKategori(event.target.value)
                  setHalaman(1)
                }}
              >
                <option value="">Semua Kategori</option>
                {daftarKategori.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">expand_more</span>
            </div>
            {/* Filter Status */}
            <div className="relative min-w-[130px]">
              <select
                aria-label="Filter Berdasarkan Status"
                className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
                id="statusFilter"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value)
                  setHalaman(1)
                }}
              >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">expand_more</span>
            </div>
            <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors" id="resetFilterBtn" title="Reset Filter" type="button" onClick={resetFilters}>
              <span className="material-symbols-outlined text-lg">filter_alt_off</span>
            </button>
          </div>
          {/* Right Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-2 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center gap-1.5 transition-colors" type="button" onClick={exportCsv}>
              <span className="material-symbols-outlined text-lg">file_download</span>
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <Link href="/data-alat/tambah" className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99] font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-all" id="btnTambahAlat">
              <span className="material-symbols-outlined text-xl">add</span>
              <span className="">Tambah Alat</span>
            </Link>
          </div>
        </div>

        {/* Inventory High-Density Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Kode Unik</th>
                <th className="py-3 px-4 font-semibold">Nama Alat</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold text-center">Jumlah Total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface font-body-md text-body-md" id="inventoryTableBody">
              {barisTampil.length === 0 && (
                <tr>
                  <td className="py-8 px-4 text-center text-on-surface-variant" colSpan={6}>
                    Tidak ada alat yang cocok dengan filter.
                  </td>
                </tr>
              )}
              {barisTampil.map((row) => {
                const nonaktif = !row.aktif
                return (
                  <tr
                    key={row.id}
                    className={nonaktif ? "bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors group opacity-80" : "hover:bg-surface-container-low/40 transition-colors group"}
                    data-id={row.kode_unik}
                    data-kategori={row.kategori}
                    data-name={row.nama}
                    data-status={row.aktif ? "Aktif" : "Nonaktif"}
                  >
                    <td className={`py-3 px-4 font-label-code text-label-code whitespace-nowrap ${nonaktif ? "text-on-surface-variant" : "text-primary font-bold"}`}>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${nonaktif ? "bg-surface-container-high" : "bg-primary/5"}`}>
                        <span className="material-symbols-outlined text-xs">tag</span>
                        {row.kode_unik}
                      </div>
                    </td>
                    <td className={`py-3 px-4 font-medium whitespace-nowrap ${nonaktif ? "text-on-surface-variant" : "text-on-surface"}`}>
                      <div className="flex flex-col">
                        <span className={nonaktif ? "font-semibold text-on-surface line-through decoration-on-surface-variant/40" : "font-semibold text-on-surface"}>{row.nama}</span>
                        <span className={`font-body-sm text-body-sm ${nonaktif ? "text-outline" : "text-on-surface-variant"}`}>
                          {row.jenis === "reusable" ? "Reusable" : "Aset Tetap"} • Min. stok {row.jumlah_minimum_stok} {row.satuan}
                          {row.limit_siklus ? ` • Siklus ${row.jumlah_siklus}/${row.limit_siklus}` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg font-label-md text-label-md ${kategoriChipClass(row.kategori, row.aktif)}`}>
                        {row.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center font-label-code font-bold px-2.5 py-1 rounded-md ${nonaktif ? "text-on-surface-variant bg-surface-container" : "text-on-surface bg-surface-container-low"}`}>
                        {row.total_stok} {row.satuan}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {nonaktif ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-badge-sm text-badge-sm bg-surface-container-high text-on-surface-variant font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                          Nonaktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-badge-sm text-badge-sm bg-primary/10 text-primary font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors" href={`/status-alat?alat=${row.id}`} title="Lihat Status & Stok">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </Link>
                        <Link className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded transition-colors" href={`/data-alat/tambah?id=${row.id}`} title="Ubah Data">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        {nonaktif ? (
                          <button className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" disabled={pending} onClick={() => ubahAktif(row, true)} title="Aktifkan Kembali" type="button">
                            <span className="material-symbols-outlined text-lg">settings_backup_restore</span>
                          </button>
                        ) : (
                          <button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded transition-colors" disabled={pending} onClick={() => setDeactivateTarget(row)} title="Nonaktifkan Alat" type="button">
                            <span className="material-symbols-outlined text-lg">power_settings_new</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="px-4 py-2 bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Menampilkan</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {filteredRows.length === 0 ? 0 : (halamanAman - 1) * PER_HALAMAN + 1}-{Math.min(halamanAman * PER_HALAMAN, filteredRows.length)}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">dari</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">{filteredRows.length} data</span>
          </div>
          <nav aria-label="Pagination Control" className="flex items-center gap-1">
            <button
              className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md disabled:opacity-40 transition-colors flex items-center gap-1"
              disabled={halamanAman <= 1}
              onClick={() => setHalaman(halamanAman - 1)}
              type="button"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
              <span className="">Previous</span>
            </button>
            {Array.from({ length: totalHalaman }, (_, index) => index + 1)
              .slice(Math.max(0, halamanAman - 3), Math.max(0, halamanAman - 3) + 5)
              .map((nomor) => (
                <button
                  key={nomor}
                  className={`w-8 h-8 rounded-lg font-label-md text-label-md flex items-center justify-center transition-colors ${nomor === halamanAman ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`}
                  onClick={() => setHalaman(nomor)}
                  type="button"
                >
                  {nomor}
                </button>
              ))}
            <button
              className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors flex items-center gap-1 disabled:opacity-40"
              disabled={halamanAman >= totalHalaman}
              onClick={() => setHalaman(halamanAman + 1)}
              type="button"
            >
              <span className="">Next</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Interactive Confirmation Modal for Nonaktifkan Alat */}
      <div className={`fixed inset-0 z-50 items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity ${deactivateTarget ? "flex" : "hidden"}`} id="modalDeactivate">
        <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">Nonaktifkan Alat Ini?</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Alat <span className="font-label-code text-primary font-bold" id="modalItemCode">{deactivateTarget?.kode_unik ?? "ALT-000"}</span> (<span className="font-semibold text-on-surface" id="modalItemName">{deactivateTarget?.nama ?? "Nama Alat"}</span>) tidak akan bisa digunakan dalam transaksi CSSD, sirkulasi OK, maupun permintaan ruangan.
              </p>
            </div>
          </div>
          <div className="p-3 bg-error-container/20 rounded-lg flex items-center gap-2.5">
            <span className="material-symbols-outlined text-error text-lg shrink-0">info</span>
            <span className="font-body-sm text-body-sm text-on-error-container font-medium">
              Status dapat dipulihkan kapan saja oleh Supervisor Inventori.
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors" onClick={() => setDeactivateTarget(null)} type="button">
              Batal
            </button>
            <button className="px-4 py-2 rounded-lg bg-error text-on-error font-label-lg text-label-lg hover:opacity-95 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-70" id="btnConfirmDeactivate" type="button" disabled={pending} onClick={confirmDeactivate}>
              <span className="material-symbols-outlined text-base">power_settings_new</span>
              <span className="">Ya, Nonaktifkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast feedback */}
      <div className={`fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg items-center gap-3 ${toast ? "flex" : "hidden"}`} id="notificationToast">
        <span className="material-symbols-outlined text-primary-fixed" id="toastIcon">check_circle</span>
        <span className="font-body-md text-body-md" id="toastMessage">{toast?.message ?? "Operasi berhasil dilakukan."}</span>
      </div>
    </div>
  )
}
