"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Save, Bell, Shield, Database, Palette, Users, FileSpreadsheet, Download, Trash2, Settings, CheckCircle, XCircle, Plus, FileText, Upload as UploadIcon } from "lucide-react"
import { Switch } from "@/components/ui/Switch"

const settingsTabs = [
  { id: "general", label: "Umum", icon: Settings },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "security", label: "Keamanan", icon: Shield },
  { id: "appearance", label: "Tampilan", icon: Palette },
  { id: "data", label: "Data & Backup", icon: Database },
  { id: "users", label: "Pengguna & Role", icon: Users },
]

const roles = [
  { id: "ADMIN", name: "Admin Sistem", permissions: ["all"] },
  { id: "DOKTER", name: "Dokter", permissions: ["dashboard", "data-alat", "alat-masuk", "alat-keluar", "status-alat", "riwayat-pergerakan", "batch-sterilisasi", "daftar-laporan"] },
  { id: "APOTEKER", name: "Apoteker", permissions: ["dashboard", "data-alat", "alat-masuk", "alat-keluar", "status-alat", "riwayat-pergerakan", "batch-sterilisasi", "konfirmasi-penerimaan", "daftar-laporan"] },
  { id: "KEPALA_GUDANG", name: "Kepala Gudang", permissions: ["dashboard", "data-alat", "alat-masuk", "alat-keluar", "status-alat", "riwayat-pergerakan", "konfirmasi-penerimaan", "daftar-laporan"] },
  { id: "PETUGAS_GUDANG", name: "Petugas Gudang", permissions: ["dashboard", "data-alat", "alat-masuk", "alat-keluar", "status-alat", "riwayat-pergerakan", "konfirmasi-penerimaan"] },
  { id: "TEKNISI", name: "Teknisi Biomedis", permissions: ["dashboard", "data-alat", "status-alat", "riwayat-pergerakan", "batch-sterilisasi"] },
  { id: "CSSD", name: "CSSD Staff", permissions: ["dashboard", "data-alat", "alat-masuk", "status-alat", "riwayat-pergerakan", "batch-sterilisasi"] },
  { id: "PERAWAT", name: "Perawat", permissions: ["dashboard", "data-alat", "alat-keluar", "status-alat", "riwayat-pergerakan"] },
]

const modules = [
  { id: "dashboard", name: "Dashboard", description: "Ringkasan sistem dan statistik" },
  { id: "data-alat", name: "Data Alat", description: "Master data alat medis" },
  { id: "alat-masuk", name: "Alat Masuk", description: "Penerimaan barang masuk" },
  { id: "alat-keluar", name: "Alat Keluar", description: "Pengeluaran & distribusi alat" },
  { id: "status-alat", name: "Status Alat", description: "Monitoring status alat" },
  { id: "riwayat-pergerakan", name: "Riwayat Pergerakan", description: "Log pergerakan barang" },
  { id: "batch-sterilisasi", name: "Batch Sterilisasi", description: "Manajemen sterilisasi" },
  { id: "konfirmasi-penerimaan", name: "Konfirmasi Penerimaan", description: "Verifikasi barang masuk" },
  { id: "daftar-laporan", name: "Daftar Laporan", description: "Generate & kelola laporan" },
  { id: "manajemen-pengguna", name: "Manajemen Pengguna", description: "Kelola akun & hak akses" },
  { id: "pengaturan", name: "Pengaturan Sistem", description: "Konfigurasi sistem" },
]

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState(settingsTabs[0].id)
  const [generalSettings, setGeneralSettings] = useState({
    hospitalName: "RSUD Kota Sehat",
    hospitalCode: "RSUD-KS-001",
    address: "Jl. Sehat No. 123, Kota Sehat",
    phone: "021-555-1234",
    email: "admin@rsud-kotasehat.co.id",
    timezone: "Asia/Jakarta",
    currency: "IDR",
    dateFormat: "DD/MM/YYYY",
    lowStockThreshold: 10,
    autoBackup: true,
    backupTime: "02:00",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    lowStockAlert: true,
    maintenanceAlert: true,
    receivingAlert: true,
    reportReadyAlert: true,
    dailySummary: false,
    weeklySummary: true,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumber: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    apiRateLimit: 100,
  })
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    primaryColor: "teal",
    compactMode: false,
    showAnimations: true,
    sidebarCollapsed: false,
    language: "id",
  })

  const handleSave = (tab: string) => {
    alert("Pengaturan " + tab + " disimpan!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Pengaturan Sistem</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Konfigurasi aplikasi RSCM</p>
        </div>
      </div>

      <div className="flex gap-6">
        <nav className="w-48 flex-shrink-0">
          <ul className="space-y-1" role="tablist">
            {settingsTabs.map((tab) => (
              <li key={tab.id} role="presentation">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-label-lg text-label-lg transition-colors " + (
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nama Rumah Sakit"
                    value={generalSettings.hospitalName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, hospitalName: e.target.value })}
                    placeholder="RSUD Kota Sehat"
                  />
                  <Input
                    label="Kode Rumah Sakit"
                    value={generalSettings.hospitalCode}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, hospitalCode: e.target.value })}
                    placeholder="RSUD-KS-001"
                  />
                  <Input
                    label="Alamat"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    placeholder="Jl. Sehat No. 123"
                    className="md:col-span-2"
                  />
                  <Input
                    label="Telepon"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    placeholder="021-555-1234"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                    placeholder="admin@rsud.co.id"
                  />
                  <Select
                    label="Zona Waktu"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    options={[
                      { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB)" },
                      { value: "Asia/Makassar", label: "Asia/Makassar (WITA)" },
                      { value: "Asia/Jayapura", label: "Asia/Jayapura (WIT)" },
                    ]}
                  />
                  <Select
                    label="Mata Uang"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                    options={[
                      { value: "IDR", label: "IDR - Rupiah Indonesia" },
                      { value: "USD", label: "USD - US Dollar" },
                    ]}
                  />
                  <Select
                    label="Format Tanggal"
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                    options={[
                      { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
                      { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
                      { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
                    ]}
                  />
                  <Input
                    label="Threshold Stok Rendah"
                    type="number"
                    value={generalSettings.lowStockThreshold}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, lowStockThreshold: parseInt(e.target.value) })}
                    placeholder="10"
                  />
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Backup Otomatis</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">Backup Otomatis Harian</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Backup database setiap hari otomatis</p>
                      </div>
                      <Switch
                        checked={generalSettings.autoBackup}
                        onChange={(checked) => setGeneralSettings({ ...generalSettings, autoBackup: checked })}
                      />
                    </div>
                    <Input
                      label="Waktu Backup"
                      type="time"
                      value={generalSettings.backupTime}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, backupTime: e.target.value })}
                      disabled={!generalSettings.autoBackup}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                  <Button onClick={() => handleSave("general")}>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: "emailEnabled", label: "Notifikasi Email", desc: "Kirim notifikasi via email" },
                    { key: "pushEnabled", label: "Notifikasi Push (In-App)", desc: "Tampilkan notifikasi di aplikasi" },
                    { key: "lowStockAlert", label: "Peringatan Stok Rendah", desc: "Notifikasi ketika stok di bawah threshold" },
                    { key: "maintenanceAlert", label: "Peringatan Perawatan", desc: "Notifikasi jadwal perawatan alat" },
                    { key: "receivingAlert", label: "Notifikasi Penerimaan", desc: "Notifikasi barang masuk & verifikasi" },
                    { key: "reportReadyAlert", label: "Laporan Siap Diunduh", desc: "Notifikasi ketika laporan selesai digenerate" },
                    { key: "dailySummary", label: "Ringkasan Harian", desc: "Kirim ringkasan aktivitas harian via email" },
                    { key: "weeklySummary", label: "Ringkasan Mingguan", desc: "Kirim ringkasan aktivitas mingguan via email" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{item.label}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                      <Switch
                        checked={!!notificationSettings[item.key as keyof typeof notificationSettings]}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, [item.key]: checked })}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                  <Button onClick={() => handleSave("notifications")}>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Keamanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">Two-Factor Authentication (2FA)</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Wajibkan 2FA untuk semua pengguna</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                    />
                  </div>
                  <Input
                    label="Timeout Sesi (menit)"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                  <Input
                    label="Panjang Minimal Password"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                    placeholder="8"
                  />
                  <Input
                    label="Maksimal Percobaan Login"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                    placeholder="5"
                  />
                  <Input
                    label="Durasi Lockout (menit)"
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, lockoutDuration: parseInt(e.target.value) })}
                    placeholder="15"
                  />
                  <Input
                    label="API Rate Limit (req/menit)"
                    type="number"
                    value={securitySettings.apiRateLimit}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, apiRateLimit: parseInt(e.target.value) })}
                    placeholder="100"
                  />
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Kebijakan Password</h3>
                  <div className="space-y-4">
                    {[
                      { key: "passwordRequireSpecial", label: "Wajib karakter khusus (!@#$%^&*)" },
                      { key: "passwordRequireNumber", label: "Wajib angka (0-9)" },
                      { key: "passwordRequireUppercase", label: "Wajib huruf besar (A-Z)" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <p className="font-label-md text-label-md text-on-surface">{item.label}</p>
                        <Switch
                          checked={!!securitySettings[item.key as keyof typeof securitySettings]}
                          onChange={(checked) => setSecuritySettings({ ...securitySettings, [item.key]: checked })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                  <Button onClick={() => handleSave("security")}>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Tampilan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Tema"
                    value={appearanceSettings.theme}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                    options={[
                      { value: "light", label: "Terang (Light)" },
                      { value: "dark", label: "Gelap (Dark)" },
                      { value: "system", label: "Ikuti Sistem (System)" },
                    ]}
                  />
                  <Select
                    label="Warna Primer"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                    options={[
                      { value: "teal", label: "Teal (Default)" },
                      { value: "blue", label: "Blue" },
                      { value: "green", label: "Green" },
                      { value: "purple", label: "Purple" },
                      { value: "orange", label: "Orange" },
                    ]}
                  />
                  <Select
                    label="Bahasa"
                    value={appearanceSettings.language}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                    options={[
                      { value: "id", label: "Indonesia" },
                      { value: "en", label: "English" },
                    ]}
                  />
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Opsi Tampilan</h3>
                  <div className="space-y-4">
                    {[
                      { key: "compactMode", label: "Mode Kompak", desc: "Mengurangi padding & spacing untuk tampilan lebih padat" },
                      { key: "showAnimations", label: "Tampilkan Animasi", desc: "Aktifkan transisi & animasi UI" },
                      { key: "sidebarCollapsed", label: "Sidebar Collapsed Default", desc: "Mulai dengan sidebar tertutup" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{item.label}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                        </div>
                        <Switch
                          checked={!!appearanceSettings[item.key as keyof typeof appearanceSettings]}
                          onChange={(checked) => setAppearanceSettings({ ...appearanceSettings, [item.key]: checked })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                  <Button onClick={() => handleSave("appearance")}>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "data" && (
            <Card>
              <CardHeader>
                <CardTitle>Data & Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                    <Database className="h-12 w-12 mx-auto text-primary mb-3" />
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Backup Database</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Download backup lengkap database</p>
                    <Button variant="outline" className="mt-4" size="sm">
                      <Download className="h-4 w-4" />
                      Backup Sekarang
                    </Button>
                  </Card>
                  <Card className="p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                    <UploadIcon className="h-12 w-12 mx-auto text-primary mb-3" />
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Restore Database</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pulihkan dari file backup</p>
                    <Button variant="outline" className="mt-4" size="sm">
                      <UploadIcon className="h-4 w-4" />
                      Pilih File
                    </Button>
                  </Card>
                  <Card className="p-6 text-center hover:border-error/50 transition-colors cursor-pointer border-error/20">
                    <Trash2 className="h-12 w-12 mx-auto text-error mb-3" />
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Hapus Data Lama</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Bersihkan log &gt; 2 tahun</p>
                    <Button variant="outline" className="mt-4 text-error border-error/40 hover:bg-error-container" size="sm">
                      <Trash2 className="h-4 w-4" />
                      Bersihkan
                    </Button>
                  </Card>
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Ekspor Data</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Data Alat", icon: FileSpreadsheet, desc: "Master data semua alat" },
                      { label: "Riwayat Transaksi", icon: FileText, desc: "Log masuk/keluar/transfer" },
                      { label: "Data Pengguna", icon: Users, desc: "Daftar akun & hak akses" },
                      { label: "Laporan Tergenerate", icon: FileSpreadsheet, desc: "Arsip laporan PDF/Excel" },
                    ].map((item) => (
                      <Card key={item.label} className="p-4 flex items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer">
                        <item.icon className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{item.label}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <Download className="h-4 w-4" />
                          Ekspor
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Informasi Sistem</h3>
                  <dl className="grid gap-4 md:grid-cols-2 font-body-sm text-body-sm">
                    <div><dt className="text-on-surface-variant">Versi Aplikasi</dt><dd className="font-mono">1.0.0</dd></div>
                    <div><dt className="text-on-surface-variant">Database</dt><dd className="font-mono">PostgreSQL 15</dd></div>
                    <div><dt className="text-on-surface-variant">Ukuran Database</dt><dd className="font-mono">245 MB</dd></div>
                    <div><dt className="text-on-surface-variant">Backup Terakhir</dt><dd className="font-mono">2024-01-15 02:00</dd></div>
                    <div><dt className="text-on-surface-variant">Total Record</dt><dd className="font-mono">12.847</dd></div>
                    <div><dt className="text-on-surface-variant">Uptime</dt><dd className="font-mono">99.9%</dd></div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Role & Hak Akses</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                    Tambah Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant/60 text-left font-label-md text-label-md text-on-surface-variant">
                        <th className="pb-3 font-medium w-40">Role</th>
                        <th className="pb-3 font-medium">Deskripsi</th>
                        {modules.slice(0, 8).map((m) => (
                          <th key={m.id} className="pb-3 font-medium text-center w-16">
                            <span className="text-xs rotate-90 inline-block w-24">{m.name}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role.id} className="border-b border-outline-variant/40">
                          <td className="py-3 font-label-md text-label-md text-on-surface">{role.name}</td>
                          <td className="py-3 font-body-sm text-body-sm text-on-surface-variant">{role.id}</td>
                          {modules.slice(0, 8).map((m) => (
                            <td key={m.id} className="py-3 text-center">
                              {role.permissions.includes("all") || role.permissions.includes(m.id) ? (
                                <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-outline mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">
                  <strong>Keterangan:</strong> Hijau = Akses penuh, Abu-abu = Tidak akses.
                  Admin memiliki akses ke semua modul. Scroll horizontal untuk melihat modul lainnya.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
