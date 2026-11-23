"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Users, Save, Key, Bell, Shield, Palette, Mail, Phone, Building2, Camera, Eye, EyeOff, CheckCircle, AlertTriangle, XCircle, Loader2, LogOut, Download, Upload, User, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/Switch"
import { Badge } from "@/components/ui/Badge"

const profileData = {
  name: "Dr. Budi Santoso",
  email: "budi.santoso@rsud.co.id",
  phone: "0812-3456-7890",
  role: "DOKTER",
  department: "ICU",
  avatar: null,
  bio: "Dokter Spesialis Anestesi & Terapi Intensif dengan pengalaman 10+ tahun. Bertanggung jawab atas pengelolaan alat medis di unit ICU.",
  joinDate: "2023-06-15",
  lastLogin: "2024-01-15 08:30",
  notifications: {
    email: true,
    push: true,
    lowStock: true,
    maintenance: true,
    receiving: true,
    reports: true,
    dailySummary: false,
    weeklySummary: true,
  },
  appearance: {
    theme: "system",
    primaryColor: "teal",
    compactMode: false,
    animations: true,
    language: "id",
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
  },
}

const themeOptions = [
  { value: "light", label: "Terang (Light)" },
  { value: "dark", label: "Gelap (Dark)" },
  { value: "system", label: "Ikuti Sistem (System)" },
]

const colorOptions = [
  { value: "teal", label: "Teal (Default)" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Red" },
]

const languageOptions = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
]

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "appearance" | "security">("profile")
  const [formData, setFormData] = useState({
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    bio: profileData.bio,
  })
  const [notificationSettings, setNotificationSettings] = useState(profileData.notifications)
  const [appearanceSettings, setAppearanceSettings] = useState(profileData.appearance)
  const [securitySettings, setSecuritySettings] = useState(profileData.security)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSave = (tab: string) => {
    alert(`Pengaturan ${tab} disimpan!`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Profil Saya</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Kelola profil, preferensi, dan keamanan akun</p>
        </div>
      </div>

      {/* Sidebar Tabs */}
      <div className="flex gap-6">
        <nav className="w-48 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
                  ) : (
                    <User className="h-10 w-10 text-primary" />
                  )}
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{profileData.name}</h3>
                <p className="text-sm text-on-surface-variant">{profileData.email}</p>
                <Badge variant="secondary" className="mt-2">{profileData.role}</Badge>
              </div>

              <div className="space-y-1 border-t border-outline-variant/60 pt-4">
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">MENU</p>
                {[
                  { id: "profile", label: "Profil", icon: User },
                  { id: "notifications", label: "Notifikasi", icon: Bell },
                  { id: "appearance", label: "Tampilan", icon: Palette },
                  { id: "security", label: "Keamanan", icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant/60">
                <Button variant="outline" className="w-full text-error hover:bg-error-container border-error/30" size="sm">
                  <LogOut className="h-4 w-4" />
                  Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === "profile" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {profileData.avatar ? (
                          <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-primary" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full cursor-pointer hover:bg-primary-container transition-colors">
                        <Camera className="h-4 w-4" />
                        <input type="file" className="sr-only" accept="image/*" />
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Foto Profil</h3>
                      <p className="text-sm text-on-surface-variant">PNG, JPG maksimal 2MB. Rasio 1:1 direkomendasikan.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Nama Lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Budi Santoso"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="budi@rsud.co.id"
                    />
                    <Input
                      label="Telepon"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812-3456-7890"
                    />
                    <Select
                      label="Role"
                      value={profileData.role}
                      onChange={() => {}}
                      disabled
                      options={[
                        { value: "DOKTER", label: "Dokter" },
                        { value: "APOTEKER", label: "Apoteker" },
                        { value: "KEPALA_GUDANG", label: "Kepala Gudang" },
                        { value: "PETUGAS_GUDANG", label: "Petugas Gudang" },
                        { value: "TEKNISI", label: "Teknisi Biomedis" },
                        { value: "CSSD", label: "CSSD Staff" },
                        { value: "PERAWAT", label: "Perawat" },
                        { value: "ADMIN", label: "Admin Sistem" },
                      ]}
                    />
                    <Select
                      label="Departemen"
                      value={profileData.department}
                      onChange={() => {}}
                      disabled
                      options={[
                        { value: "ICU", label: "ICU" },
                        { value: "OK", label: "OK" },
                        { value: "VIP", label: "VIP" },
                        { value: "Farmasi & Gudang", label: "Farmasi & Gudang" },
                        { value: "Teknik Biomedis", label: "Teknik Biomedis" },
                        { value: "CSSD", label: "CSSD" },
                        { value: "Teknologi Informasi", label: "Teknologi Informasi" },
                      ]}
                    />
                  </div>

                  <Input
                    label="Bio / Deskripsi"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tentang Anda..."
                    className="min-h-[100px]"
                  />

                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-on-surface-variant">Bergabung Sejak</p>
                      <p className="font-medium text-on-surface">{profileData.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant">Login Terakhir</p>
                      <p className="font-medium text-on-surface">{profileData.lastLogin}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                    <Button onClick={() => handleSave("profil")}>
                      <Save className="h-4 w-4" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Notifikasi Email", desc: "Terima notifikasi via email" },
                    { key: "push", label: "Notifikasi In-App", desc: "Tampilkan notifikasi di aplikasi" },
                    { key: "lowStock", label: "Peringatan Stok Rendah", desc: "Notifikasi ketika stok di bawah threshold" },
                    { key: "maintenance", label: "Peringatan Perawatan", desc: "Notifikasi jadwal perawatan alat" },
                    { key: "receiving", label: "Notifikasi Penerimaan", desc: "Notifikasi barang masuk & verifikasi" },
                    { key: "reports", label: "Laporan Siap Diunduh", desc: "Notifikasi ketika laporan selesai digenerate" },
                    { key: "dailySummary", label: "Ringkasan Harian", desc: "Kirim ringkasan aktivitas harian via email" },
                    { key: "weeklySummary", label: "Ringkasan Mingguan", desc: "Kirim ringkasan aktivitas mingguan via email" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                      <div>
                        <p className="font-medium text-on-surface">{item.label}</p>
                        <p className="text-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                      <Switch
                        checked={!!notificationSettings[item.key as keyof typeof notificationSettings]}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, [item.key]: checked })}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                  <Button onClick={() => handleSave("notifikasi")}>
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
                    options={themeOptions}
                  />
                  <Select
                    label="Warna Primer"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                    options={colorOptions}
                  />
                  <Select
                    label="Bahasa"
                    value={appearanceSettings.language}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                    options={languageOptions}
                  />
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Opsi Tampilan</h3>
                  <div className="space-y-4">
                    {[
                      { key: "compactMode", label: "Mode Kompak", desc: "Mengurangi padding & spacing untuk tampilan lebih padat" },
                      { key: "animations", label: "Tampilkan Animasi", desc: "Aktifkan transisi & animasi UI" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                        <div>
                          <p className="font-medium text-on-surface">{item.label}</p>
                          <p className="text-sm text-on-surface-variant">{item.desc}</p>
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
                  <Button onClick={() => handleSave("tampilan")}>
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
                <CardTitle>Keamanan Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div>
                      <p className="font-medium text-on-surface">Two-Factor Authentication (2FA)</p>
                      <p className="text-sm text-on-surface-variant">Tambahkan lapisan keamanan tambahan saat login</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactor}
                      onChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactor: checked })}
                    />
                  </div>

                  <Input
                    label="Timeout Sesi (menit)"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Ubah Password</h3>
                  <div className="space-y-4 max-w-md">
                    <Input
                      label="Password Saat Ini"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Masukkan password lama"
                    />
                    <Input
                      label="Password Baru"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Minimal 8 karakter"
                    />
                    <Input
                      label="Konfirmasi Password Baru"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Ulangi password baru"
                    />
                    <p className="text-sm text-on-surface-variant">
                      Password harus minimal 8 karakter, mengandung huruf besar, angka, dan karakter khusus.
                    </p>
                    <Button variant="outline" onClick={() => handleSave("password")}>
                      <Key className="h-4 w-4" />
                      Ubah Password
                    </Button>
                  </div>
                </div>

                <div className="border-t border-outline-variant/60 pt-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Sesi Aktif</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">Sesi Saat Ini</p>
                          <p className="text-sm text-on-surface-variant">Chrome on Windows • 192.168.1.45 • Baru saja</p>
                        </div>
                      </div>
                      <Badge variant="success">Aktif</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/60 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-outline" />
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">Chrome on iPhone</p>
                          <p className="text-sm text-on-surface-variant">Safari on iOS • 192.168.1.45 • 2 hari lalu</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Nonaktif</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 text-error hover:bg-error-container border-error/30">
                    <Trash2 className="h-4 w-4" />
                    Keluar dari Semua Sesi Lain
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
