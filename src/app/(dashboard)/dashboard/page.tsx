/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"

const ROLES: { label: string; icon?: string }[] = [
  { label: "Admin Inventori", icon: "verified_user" },
  { label: "Petugas Inventori" },
  { label: "Petugas Unit Medis" },
  { label: "Petugas CSSD" },
]

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState("Admin Inventori")

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Header & Role Switcher Banner */}
      <div className="flex flex-col gap-4">
        {/* Breadcrumb & Status Meta */}
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-base">home</span>
              Beranda
            </span>
            <span className="text-on-surface-variant/40 font-body-sm text-body-sm">/</span>
            <span className="font-label-md text-label-md text-primary font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-label-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-on-surface font-medium">Pembaruan Terakhir:</span>
              <span>Hari ini, 09:42 WIB</span>
              <span className="text-outline-variant font-label-code">•</span>
              <span className="text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">database</span>
                Supabase DB
              </span>
            </div>
          </div>
        </div>
        {/* Title & Role Switcher Context Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Selamat Datang, Ratna Sari, S.Kep</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded font-badge-sm text-badge-sm bg-primary/10 text-primary uppercase font-bold">Admin Inventori</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Sistem Monitoring Terpadu CSSD, Instrumen Bedah, & Logistik Aset Medis RS Cipto Mangunkusumo (Kemenkes RI).</p>
          </div>
          {/* Role switcher simulator */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant">Simulasi Peran:</span>
            <div className="inline-flex p-1 bg-surface-container rounded-lg gap-1">
              {ROLES.map((role) => {
                const active = activeRole === role.label
                return (
                  <button
                    key={role.label}
                    className={
                      active
                        ? "px-3 py-1 rounded font-label-md text-label-md bg-primary-container text-on-primary-container shadow-sm transition-all flex items-center gap-1"
                        : "px-3 py-1 rounded font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
                    }
                    onClick={() => setActiveRole(role.label)}
                    type="button"
                  >
                    {active && role.icon && (
                      <span className="material-symbols-outlined text-sm">{role.icon}</span>
                    )}
                    {role.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Top Stat Cards (4-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Alat */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary group-hover:h-1.5 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium tracking-wide uppercase">Total Alat</span>
              <p className="font-headline-xl text-headline-xl text-on-surface mt-1 tracking-tight">1.240</p>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 inline-block">Total alat medis terdaftar</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/50 px-2 py-1.5 rounded-lg">
            <span className="font-label-code text-label-code text-on-surface-variant">Katalog Aktif RS</span>
            <span className="font-label-md text-label-md text-primary font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">inventory_2</span> 100% Sensus
            </span>
          </div>
        </div>
        {/* Card 2: Alat Tersedia */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container group-hover:h-1.5 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium tracking-wide uppercase">Alat Tersedia</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-primary/15 text-primary font-semibold">+12 hari ini</span>
              </div>
              <p className="font-headline-xl text-headline-xl text-primary mt-1 tracking-tight">892</p>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 inline-block">Status = Tersedia di gudang</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/50 px-2 py-1.5 rounded-lg">
            <span className="font-label-code text-label-code text-on-surface-variant">Rasio Cadangan</span>
            <span className="font-label-md text-label-md text-primary font-semibold">71.9% Siap Pakai</span>
          </div>
        </div>
        {/* Card 3: Alat di Unit */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary group-hover:h-1.5 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium tracking-wide uppercase">Alat di Unit</span>
              <p className="font-headline-xl text-headline-xl text-secondary mt-1 tracking-tight">298</p>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 inline-block">Status = DiUnit (Operasional)</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/50 px-2 py-1.5 rounded-lg">
            <span className="font-label-code text-label-code text-on-surface-variant">Tersebar di Unit</span>
            <span className="font-label-md text-label-md text-secondary font-semibold">18 Ruangan / Depo</span>
          </div>
        </div>
        {/* Card 4: Alat Rusak / Inspeksi */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-error group-hover:h-1.5 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium tracking-wide uppercase">Alat Rusak</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-error-container text-on-error-container font-semibold">8 butuh inspeksi</span>
              </div>
              <p className="font-headline-xl text-headline-xl text-error mt-1 tracking-tight">50</p>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 inline-block">Status = Rusak / Kalibrasi</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/50 px-2 py-1.5 rounded-lg">
            <span className="font-label-code text-label-code text-on-surface-variant">Tingkat Afkir</span>
            <span className="font-label-md text-label-md text-error font-semibold">4.0% Total Aset</span>
          </div>
        </div>
      </div>
      {/* Analytical Charts Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart A: Bar Chart 7 Hari Terakhir (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Pergerakan Alat 7 Hari Terakhir</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Monitoring volume alat masuk gudang vs alat keluar/distribusi ke unit</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
                  <span className="w-3 h-3 rounded-sm bg-secondary"></span>
                  Alat Masuk
                </span>
                <span className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
                  <span className="w-3 h-3 rounded-sm bg-primary"></span>
                  Alat Keluar
                </span>
              </div>
            </div>
            {/* SVG Bar Chart Visualization */}
            <div className="mt-6 w-full">
              <div className="flex items-end justify-between h-56 w-full pt-4 pb-2 px-2 bg-surface-container-low/30 rounded-lg relative">
                {/* Y-Axis Grid Lines & Values */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-3 py-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-label-code text-label-code text-on-surface-variant/60">80</span>
                    <div className="w-full ml-3 h-px bg-surface-container-high/60"></div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-label-code text-label-code text-on-surface-variant/60">60</span>
                    <div className="w-full ml-3 h-px bg-surface-container-high/60"></div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-label-code text-label-code text-on-surface-variant/60">40</span>
                    <div className="w-full ml-3 h-px bg-surface-container-high/60"></div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-label-code text-label-code text-on-surface-variant/60">20</span>
                    <div className="w-full ml-3 h-px bg-surface-container-high/60"></div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-label-code text-label-code text-on-surface-variant/60">0</span>
                    <div className="w-full ml-3 h-px bg-surface-container-high"></div>
                  </div>
                </div>
                {/* Bar Columns (Sen - Min) */}
                <div className="relative z-10 w-full pl-6 pr-2 flex justify-between items-end h-44">
                  {/* Sen: Masuk 42, Keluar 58 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "52%" }} title="Alat Masuk: 42"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "72%" }} title="Alat Keluar: 58"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Sen</span>
                  </div>
                  {/* Sel: Masuk 35, Keluar 48 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "43%" }} title="Alat Masuk: 35"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "60%" }} title="Alat Keluar: 48"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Sel</span>
                  </div>
                  {/* Rab: Masuk 65, Keluar 72 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "81%" }} title="Alat Masuk: 65"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "90%" }} title="Alat Keluar: 72"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Rab</span>
                  </div>
                  {/* Kam: Masuk 50, Keluar 45 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "62%" }} title="Alat Masuk: 50"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "56%" }} title="Alat Keluar: 45"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Kam</span>
                  </div>
                  {/* Jum: Masuk 70, Keluar 62 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "87%" }} title="Alat Masuk: 70"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "77%" }} title="Alat Keluar: 62"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Jum</span>
                  </div>
                  {/* Sab: Masuk 28, Keluar 34 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "35%" }} title="Alat Masuk: 28"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "42%" }} title="Alat Keluar: 34"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Sab</span>
                  </div>
                  {/* Min: Masuk 18, Keluar 20 */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-36">
                      <div className="w-3.5 sm:w-5 bg-secondary rounded-t transition-all group-hover:brightness-110" style={{ height: "22%" }} title="Alat Masuk: 18"></div>
                      <div className="w-3.5 sm:w-5 bg-primary rounded-t transition-all group-hover:brightness-110" style={{ height: "25%" }} title="Alat Keluar: 20"></div>
                    </div>
                    <span className="font-label-code text-label-code text-on-surface-variant">Min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick summary footer note */}
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-body-sm font-body-sm text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">trending_up</span>
              Puncak mobilitas tercatat hari Rabu (137 perpindahan unit).
            </span>
            <span className="font-label-code text-label-code font-semibold text-primary">Rata-rata: 92 unit/hari</span>
          </div>
        </div>
        {/* Chart B: Donut Chart Distribusi Status Alat (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Distribusi Status Alat</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Proporsi 1.240 unit instrumen & alat medis</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40">pie_chart</span>
            </div>
            {/* Donut SVG & Central Legend */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {/* Background Circle */}
                  <circle cx="80" cy="80" fill="none" r="60" stroke="#eaedff" strokeWidth="18"></circle>
                  {/* Tersedia (71.9% -> 271 stroke) */}
                  <circle className="transition-all duration-700" cx="80" cy="80" fill="none" r="60" stroke="#00685f" strokeDasharray="271 377" strokeDashoffset="0" strokeWidth="18"></circle>
                  {/* DiUnit (24.0% -> 90.5 stroke) */}
                  <circle className="transition-all duration-700" cx="80" cy="80" fill="none" r="60" stroke="#006398" strokeDasharray="90.5 377" strokeDashoffset="-271" strokeWidth="18"></circle>
                  {/* Sterilisasi CSSD (2.4% -> 9.05 stroke) */}
                  <circle className="transition-all duration-700" cx="80" cy="80" fill="none" r="60" stroke="#825100" strokeDasharray="9 377" strokeDashoffset="-361.5" strokeWidth="18"></circle>
                  {/* Rusak (2.4% -> 9.05 stroke) */}
                  <circle className="transition-all duration-700" cx="80" cy="80" fill="none" r="60" stroke="#ba1a1a" strokeDasharray="9 377" strokeDashoffset="-370.5" strokeWidth="18"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-headline-md text-headline-md text-on-surface leading-none tracking-tight">1.240</span>
                  <span className="font-badge-sm text-badge-sm text-on-surface-variant uppercase mt-1">Total Unit</span>
                </div>
              </div>
              {/* Mini Stats Detail */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="font-label-md text-label-md text-on-surface">Tersedia Gudang</span>
                  </div>
                  <span className="font-label-code text-label-code text-on-surface font-semibold">892 (71.9%)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="font-label-md text-label-md text-on-surface">Di Unit Medis</span>
                  </div>
                  <span className="font-label-code text-label-code text-on-surface font-semibold">298 (24.0%)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <span className="font-label-md text-label-md text-on-surface">CSSD Sterilisasi</span>
                  </div>
                  <span className="font-label-code text-label-code text-on-surface font-semibold">30 (2.4%)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                    <span className="font-label-md text-label-md text-on-surface">Rusak / Afkir</span>
                  </div>
                  <span className="font-label-code text-label-code text-on-surface font-semibold">30 (2.4%)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="font-label-md text-label-md text-on-surface">Kalibrasi/Uji</span>
                  </div>
                  <span className="font-label-code text-label-code text-on-surface font-semibold">20 (1.6%)</span>
                </div>
              </div>
            </div>
          </div>
          {/* Action pill */}
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container px-3 py-2 rounded-lg">
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">verified</span>
              Integritas Logistik Steril Terjaga
            </span>
            <button className="text-primary font-label-md text-label-md font-semibold hover:underline flex items-center gap-0.5" type="button">
              Audit Detail <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      {/* Operational Facilities Image Snippet Card Banner */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
            <img className="w-full h-full object-cover" alt="A clean, state-of-the-art sterile hospital supply department with stainless steel surgical trays, autoclave machines, and medical storage racks bathed in soft daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJIqM5RVYkim-EhFcni89wOH4zmdgDCUT3650GsVW-hzqGMGm0tGemjSC2qQt1_-SCiaq2VMwGj2hHZy1W5jOK7fS-y1VvVuCJHUJCNCxir2z4b8wW5-jhkf3ymwqhCFmj4dMhHlEPfpp6dmaEkj-k05UGbnCwWRxFFCm0l3CyxsipfLjY21T9l7lc62e7qZdu2sEA3FTaQPYUxPzswmPWcPsnAOnLd1nR_GoIOUqY" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Jalur Cepat CSSD & Distribusi Steril Sentral</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Monitoring batch autoklaf uap dan pengiriman instrumen steril ke Instalasi Bedah Sentral (IBS) secara real-time.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex -space-x-2 overflow-hidden">
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover" alt="Indonesian hospital technician in sterile scrubs wearing protective gear inspecting medical trays in modern sterilisation room." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXHaEVCVVK_dnSUNOcPnW7oXsylZAHMHupmr2dMVAM3sYzMKcwAz5sfEbz4SQKZUROsvST4vnQDVSZtf7B2tW9OVjlCWWGvozHXiEAtNtd6wzsLiHoUjngHy6UzUilcwikEHrIzmA6fY8lU3BBJK4aZ-9YPgwghRQAkmYkANmpuJxsfkDCfOUFxu0R_bQ2VRgsvS-RA2EfnFMpL_m5lBhn_PNhUFzW-TnEFJtk-OVo" />
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover" alt="Female Indonesian nurse in clean hospital uniform checking barcode scanner inventory on tablet." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcuJZI_sXYpBnngfs5oEFxIajF2BK0Egf4NRfJIGxq8sa_f-JexJ-7S0hl6vF828V8Yamu3m5qN3orkx2an_wYl5MjW7PX4K-jqXUFaUTQrXmT9OwMm7h4IZ8LI4Bqtd3CfMMI6HFL_JV_nFKbzLj3BthFBOX_TC27tHzHWmg2VHOSQf5mVwtGOACPsABqnmSsKtDI1o0zGSPkJRi2bS199kaaLVu8HYlxQKPaIJx5" />
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">14 Petugas Aktif</span>
            <span className="font-body-sm text-body-sm text-primary">Shift Pagi Siaga</span>
          </div>
        </div>
      </div>
      {/* Recent Activity Table (Bottom Section) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Section Header */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Aktivitas Terbaru</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-badge-sm text-badge-sm bg-primary/10 text-primary font-bold animate-pulse">Live</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">10 transaksi pergerakan alat terakhir secara real-time di sistem SIM RS</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input className="bg-surface-container-low text-on-surface text-label-md font-label-md px-3 py-1.5 pl-8 rounded-lg outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 w-56 transition-all" placeholder="Cari barcode / instrumen..." type="text" />
              <span className="material-symbols-outlined text-on-surface-variant absolute left-2 top-2 text-base">search</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors" type="button">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
          </div>
        </div>
        {/* Data Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-badge-sm text-badge-sm uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Tanggal & Waktu</th>
                <th className="py-3 px-4 font-bold">Jenis Transaksi</th>
                <th className="py-3 px-4 font-bold">Nama Alat & Kode</th>
                <th className="py-3 px-4 font-bold">Unit Tujuan / Asal</th>
                <th className="py-3 px-4 font-bold">Petugas Bertanggung Jawab</th>
                <th className="py-3 px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
              {/* Row 1: Alat Keluar */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Hari ini, 09:38 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">4 menit lalu</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-secondary/10 text-secondary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Alat Keluar
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Set Bedah Mayor (BM-004)</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890123-BM004</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">meeting_room</span>
                    <span className="text-on-surface font-medium">Instalasi Bedah Sentral (IBS) OK-2</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Agus Supriyadi, A.Md.Kep</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Inventori</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 2: Alat Masuk */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Hari ini, 09:15 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">27 menit lalu</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-primary/10 text-primary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Alat Masuk
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Defibrillator Mindray BeneHeart D3</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890455-DF003</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">warehouse</span>
                    <span className="text-on-surface font-medium">Gudang Alkes Sentral (Penerimaan)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Ratna Sari, S.Kep</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Admin Inventori</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 3: Sterilisasi CSSD */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Hari ini, 08:50 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">52 menit lalu</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                    Sterilisasi CSSD
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Autoclave Pouch Set A (Bedah Minor)</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BATCH: CSSD-202403-882</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-tertiary">sanitizer</span>
                    <span className="text-on-surface font-medium">Chamber Autoklaf Uap 02</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Dedi Prasetyo, S.Tr.Kes</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Sterilisasi</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 4: Alat Keluar */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Hari ini, 08:22 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">1 jam lalu</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-secondary/10 text-secondary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Alat Keluar
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Set Partus Bedah Obstetri (PT-012)</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890881-PT012</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">child_friendly</span>
                    <span className="text-on-surface font-medium">VK / Ruang Bersalin PONEK</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Bdn. Siti Rahmawati</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Unit Medis</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 5: Perbaikan */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Hari ini, 07:45 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">2 jam lalu</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-error-container text-on-error-container font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    Perbaikan
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Syringe Pump Terumo TE-SS700</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890312-SP077 (Sensor Error)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-error">build</span>
                    <span className="text-on-surface font-medium">Bengkel Elektromedis (IPSRS)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Hendri Irawan, A.Md.TEM</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Teknisi Elektromedis</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 6: Alat Masuk */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Hari ini, 07:10 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">2.5 jam lalu</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-primary/10 text-primary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Alat Masuk
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Suction Pump Portable Thomas 1632</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890199-SC014</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">warehouse</span>
                    <span className="text-on-surface font-medium">Gudang Alkes Sentral</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Agus Supriyadi, A.Md.Kep</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Inventori</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 7: Alat Keluar */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Kemarin, 21:15 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">Shift Malam</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-secondary/10 text-secondary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Alat Keluar
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Infusion Pump Terumo SS830</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890412-IP019</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">monitor_heart</span>
                    <span className="text-on-surface font-medium">ICU Sentral (Bed 04)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Ns. Wahyudi Pratama, S.Kep</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Unit Medis</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 8: Sterilisasi CSSD */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Kemarin, 19:40 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">Shift Malam</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Sterilisasi CSSD
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Set Ekstraksi Gigi Dewasa</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BATCH: CSSD-202403-879</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-tertiary">dentistry</span>
                    <span className="text-on-surface font-medium">Poli Gigi & Mulut</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Dedi Prasetyo, S.Tr.Kes</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Sterilisasi</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 9: Alat Keluar */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Kemarin, 16:30 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">Shift Sore</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-secondary/10 text-secondary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Alat Keluar
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Set Hecting Bedah Minor (HM-022)</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890521-HM022</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">emergency</span>
                    <span className="text-on-surface font-medium">Instalasi Gawat Darurat (IGD)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Ns. Maya Safitri, S.Kep</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Petugas Unit Medis</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
              {/* Row 10: Alat Masuk */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-code text-label-code text-on-surface font-semibold">Kemarin, 14:05 WIB</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">Shift Sore</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-badge-sm text-badge-sm bg-primary/10 text-primary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Alat Masuk
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Ventilator Transport Hamilton-T1</span>
                    <span className="font-label-code text-label-code text-on-surface-variant">BARCODE: 890766-VN002 (Purna Uji Steril)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">warehouse</span>
                    <span className="text-on-surface font-medium">Gudang Alkes Sentral (Rak V-01)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Ratna Sari, S.Kep</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Admin Inventori</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table Bottom Summary & Navigation Link */}
        <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">sync_saved_locally</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Menampilkan <strong className="text-on-surface font-semibold">10</strong> dari <strong className="text-on-surface font-semibold">142</strong> transaksi pergerakan alat hari ini.
            </span>
          </div>
          <a className="inline-flex items-center gap-1.5 text-primary font-label-lg text-label-lg hover:text-primary-container group transition-colors" href="#">
            <span>Lihat semua riwayat</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  )
}
