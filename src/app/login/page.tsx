/* eslint-disable @next/next/no-img-element */
"use client"

import { Suspense, useActionState, useState } from "react"
import Link from "next/link"
import { masuk } from "@/lib/actions/auth"
import { AlasanBanner } from "./AlasanBanner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [ditolak, setDitolak] = useState(false)
  const [state, formAction, pending] = useActionState(masuk, undefined)
  const error = ditolak ? "" : state?.error ?? ""

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-surface p-4">
      <div className="flex flex-col w-full items-center justify-center p-2 sm:p-6">
        <div className="relative w-full max-w-5xl rounded-xl bg-surface-container-lowest shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
            {/* Left Panel: Hospital Branding & Assurance */}
            <div className="lg:col-span-5 bg-gradient-to-br from-primary via-primary-container to-on-primary-fixed-variant text-on-primary p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle medical cross motif SVG in background */}
              <svg className="absolute -right-16 -bottom-16 w-80 h-80 opacity-10 pointer-events-none text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-12 w-auto flex items-center justify-center">
                    <img alt="RS Cipto Mangunkusumo" className="h-12 w-auto object-contain bg-white/90 p-2 rounded-lg shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkw6Z2F-BgP7kOxbqaEBa4TTqGUO9G3k5PqlxZMo3MJwFjNyb8bANAClOVzm5PvaksGNOA-nREj5bDDKFA1DzYtZwR6zmC566sEB4Q5aoFEGbq4wzNtEjjbOsS0G5xHn2q4x0vh8Ddl_1IDEPKaXPn54VYuXiKLEQXG7h9Zhy_eUnH_r5uGlFmF9dQ7fIlv49Bn7lVaYRx4tK__hzHP42RN3B2XawzPpUucv36QI8cqEV1eP90QqG0dA" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-primary tracking-tight">RS Cipto Mangunkusumo</span>
                    <span className="font-label-md text-label-md text-primary-fixed uppercase tracking-wider">Unit CSSD &amp; Logistik Medis</span>
                  </div>
                </div>
                <div className="space-y-1 mt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur text-primary-fixed text-label-md font-label-md w-fit">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
                    Sistem Aktif • Versi 2.4.0
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-primary leading-tight">
                    Sistem Inventori &amp; CSSD Terintegrasi
                  </h1>
                  <p className="font-body-md text-body-md text-on-primary/80 leading-relaxed">
                    Platform operasional sterilisasi alat bedah, penelusuran kode unik instrumen, dan manajemen stok medis terpusat.
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-container-lowest/10 text-primary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-primary">Pelacakan Status Real-time</span>
                      <span className="font-body-sm text-body-sm text-on-primary/70">Penelusuran kode unik alat dari ruang operasi hingga ruang simpan.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-container-lowest/10 text-primary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>sanitizer</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-primary">Siklus Sterilisasi CSSD Terverifikasi</span>
                      <span className="font-body-sm text-body-sm text-on-primary/70">Monitoring tahapan Autoclave, validasi indikator biologi dan QC rilis.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-container-lowest/10 text-primary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-primary">Audit Pergerakan Alat Akurat</span>
                      <span className="font-body-sm text-body-sm text-on-primary/70">Pencatatan mutasi instrumen terproteksi dengan audit trail PostgreSQL.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-6 mt-6 flex items-center justify-between text-body-sm font-body-sm text-on-primary/60">
                <span className="font-label-code text-label-code">HIPAA &amp; KARS Compliant</span>
                <span>© 2025 SIMRS IT</span>
              </div>
            </div>

            {/* Right Panel: Medical Authentication Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 flex flex-col justify-between">
              <div className="w-full max-w-md mx-auto space-y-4">
                {/* Portal Header */}
                <div className="flex items-center gap-2 pb-1">
                  <img alt="SIM Inventori RS" className="w-10 h-10 object-contain lg:hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkw6Z2F-BgP7kOxbqaEBa4TTqGUO9G3k5PqlxZMo3MJwFjNyb8bANAClOVzm5PvaksGNOA-nREj5bDDKFA1DzYtZwR6zmC566sEB4Q5aoFEGbq4wzNtEjjbOsS0G5xHn2q4x0vh8Ddl_1IDEPKaXPn54VYuXiKLEQXG7h9Zhy_eUnH_r5uGlFmF9dQ7fIlv49Bn7lVaYRx4tK__hzHP42RN3B2XawzPpUucv36QI8cqEV1eP90QqG0dA" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-headline-md text-headline-md text-on-surface">SIM Inventori RS</h2>
                      <span className="px-2 py-0.5 rounded text-badge-sm font-badge-sm bg-surface-container-high text-secondary">MEDIS</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Sistem Informasi Manajemen Inventori Rumah Sakit</p>
                  </div>
                </div>
                {/* Welcome Badge / Subheading */}
                <div className="bg-surface-container-low p-2 rounded-lg flex flex-col gap-0.5">
                  <span className="font-label-lg text-label-lg text-on-surface">Masuk ke Akun Anda</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Silakan masukkan kredensial resmi rumah sakit untuk mengakses unit operasional.</span>
                </div>
                {/* Alert / Validation Banner */}
                <Suspense fallback={null}>
                  <AlasanBanner />
                </Suspense>
                {error && (
                  <div className="bg-error-container text-on-error-container p-2 rounded-lg flex items-start justify-between gap-3 shadow-sm transition-all duration-200">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                      <div className="flex flex-col text-body-sm font-body-sm">
                        <span className="font-label-md text-label-md font-semibold text-error">{error}</span>
                        <span className="text-on-error-container/80 text-[11px] leading-tight mt-0.5">Akun dinonaktifkan atau belum diverifikasi? Hubungi unit administrator SIMRS.</span>
                      </div>
                    </div>
                    <button aria-label="Tutup notifikasi" className="text-on-error-container/60 hover:text-on-error-container p-0.5 rounded" onClick={() => setDitolak(true)} type="button">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                )}
                {/* Authentication Form */}
                <form className="space-y-4" action={formAction} onSubmit={() => setDitolak(false)} noValidate>
                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="email">
                      <span>Alamat Email Kedinasan</span>
                      <span className="text-on-surface-variant font-label-code text-[11px]">RSUD Domain</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">mail</span>
                      <input className="w-full bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg py-2.5 pl-10 pr-3.5 transition-all outline-none focus:ring-2 focus:ring-primary shadow-sm" id="email" name="email" placeholder="petugas@rsud-medika.go.id" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="password">
                      <span>Kata Sandi</span>
                      <span className="text-secondary hover:underline cursor-pointer font-label-md text-[11px]">Lupa Kata Sandi?</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">lock</span>
                      <input className="w-full bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg py-2.5 pl-10 pr-10 transition-all outline-none focus:ring-2 focus:ring-primary shadow-sm" id="password" name="password" placeholder="Masukkan kata sandi" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                      <button aria-label="Tampilkan atau sembunyikan kata sandi" className="absolute right-3 text-outline hover:text-on-surface p-1 rounded transition-colors flex items-center justify-center" onClick={() => setShowPassword((value) => !value)} type="button">
                        <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                  {/* Role Selector Reference Pill Grid */}
                  <div className="bg-surface-container-low/70 p-2 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-[11px]">
                      <span className="material-symbols-outlined text-[14px] text-secondary">badge</span>
                      <span>Otoritas Hak Akses Sistem (RBAC Terkunci):</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest text-on-surface shadow-xs font-label-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Admin Inventori</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest text-on-surface shadow-xs font-label-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span>Petugas CSSD</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest text-on-surface shadow-xs font-label-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                        <span>Unit Medis (IBS/IGD)</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest text-on-surface shadow-xs font-label-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                        <span>Petugas Inventori</span>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70" type="submit" disabled={pending}>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    <span>{pending ? "Memverifikasi..." : "Masuk ke SIM Inventori"}</span>
                  </button>
                </form>
                {/* System Protection Notice */}
                <div className="pt-1 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-body-sm font-body-sm text-outline">
                    <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                    <span>Sistem Terproteksi RBAC Rumah Sakit</span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">
                    Belum punya akun?{" "}
                    <Link className="font-semibold text-primary hover:underline" href="/daftar">
                      Ajukan pendaftaran
                    </Link>{" "}
                    — peran dan unit ditetapkan Admin Inventori.
                  </p>
                </div>
              </div>
              {/* Footnote / System Status */}
              <div className="mt-6 pt-2 text-center">
                <span className="font-label-code text-label-code text-outline text-[11px]">
                  Server ID: MEDIKA-CSSD-01 • Enkripsi TLS 1.3 Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
