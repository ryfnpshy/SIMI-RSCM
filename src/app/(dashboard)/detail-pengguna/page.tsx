"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, XCircle, Loader2, Package, ClipboardCheck, PackageOpen, Search, Filter, Download, Calendar, Plus, Eye, Edit, Truck, Users, UserCheck, UserX, Key, Mail, Phone, Building2, Shield, LogOut, Activity, Settings, Bell, FileText, History, Clock } from "lucide-react"
import Link from "next/link"

const userDetailData = {
  id: "1",
  name: "Dr. Budi Santoso",
  email: "budi.santoso@rsud.co.id",
  phone: "0812-3456-7890",
  role: "DOKTER",
  department: "ICU",
  status: "active",
  lastLogin: "2024-01-15 08:30",
  createdAt: "2023-06-15",
  avatar: null,
}

const activityData = [
  { id: "1", date: "2024-01-15", time: "08:30", action: "LOGIN", description: "Masuk ke sistem", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "2", date: "2024-01-15", time: "08:35", action: "VIEW", description: "Melihat dashboard inventori", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "3", date: "2024-01-15", time: "08:42", action: "VIEW", description: "Melihat data alat - ICU", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "4", date: "2024-01-15", time: "09:15", action: "CREATE", description: "Membuat permintaan alat: Infus Pump (2 unit)", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "5", date: "2024-01-15", time: "09:30", action: "VIEW", description: "Melihat riwayat pergerakan alat", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "6", date: "2024-01-15", time: "10:00", action: "LOGOUT", description: "Keluar dari sistem", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "7", date: "2024-01-14", time: "16:30", action: "LOGIN", description: "Masuk ke sistem", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "8", date: "2024-01-14", time: "16:35", action: "VIEW", description: "Melihat status alat perawatan", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "9", date: "2024-01-14", time: "17:00", action: "LOGOUT", description: "Keluar dari sistem", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "10", date: "2024-01-13", time: "08:15", action: "LOGIN", description: "Masuk ke sistem", ip: "192.168.1.45", device: "Chrome / Windows" },
]

const permissionsData = [
  { module: "Dashboard", read: true, write: false, delete: false, export: true },
  { module: "Data Alat", read: true, write: true, delete: false, export: true },
  { module: "Alat Masuk", read: true, write: true, delete: false, export: true },
  { module: "Alat Keluar", read: true, write: true, delete: false, export: true },
  { module: "Status Alat", read: true, write: false, delete: false, export: true },
  { module: "Riwayat Pergerakan", read: true, write: false, delete: false, export: true },
  { module: "Batch Sterilisasi", read: true, write: false, delete: false, export: true },
  { module: "Konfirmasi Penerimaan", read: true, write: false, delete: false, export: true },
  { module: "Daftar Laporan", read: true, write: false, delete: false, export: true },
  { module: "Manajemen Pengguna", read: false, write: false, delete: false, export: false },
  { module: "Pengaturan", read: false, write: false, delete: false, export: false },
]

function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    ADMIN: "destructive",
    DOKTER: "success",
    APOTEKER: "info",
    KEPALA_GUDANG: "warning",
    PETUGAS_GUDANG: "secondary",
    TEKNISI: "default",
    CSSD: "info",
    PERAWAT: "success",
  }
  return <Badge variant={variants[role] || "default"}>Role: {role}</Badge>
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    active: "success",
    inactive: "secondary",
    pending: "warning",
  }
  const labels: Record<string, string> = {
    active: "Aktif",
    inactive: "Nonaktif",
    pending: "Menunggu",
  }
  const icons: Record<string, React.ReactNode> = {
    active: <UserCheck className="h-3 w-3" />,
    inactive: <UserX className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
  }
  return (
    <Badge variant={variants[status] || "secondary"} className="gap-1">
      {icons[status]}
      {labels[status] || status}
    </Badge>
  )
}

function ActionBadge({ action }: { action: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    LOGIN: "success",
    LOGOUT: "secondary",
    VIEW: "info",
    CREATE: "success",
    UPDATE: "warning",
    DELETE: "destructive",
    EXPORT: "default",
  }
  return <Badge variant={variants[action] || "default"} size="sm">{action}</Badge>
}

export default function DetailPenggunaPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "permissions" | "activity">("profile")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Detail Pengguna</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Profil, hak akses, dan aktivitas pengguna</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline">
            <Key className="h-4 w-4" />
            Reset Password
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h2 className="mt-4 font-headline-sm text-headline-sm text-on-surface">{userDetailData.name}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <RoleBadge role={userDetailData.role} />
                <StatusBadge status={userDetailData.status} />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Email</p>
                  <p className="font-medium text-on-surface flex items-center gap-2">
                    <Mail className="h-4 w-4 text-outline" />
                    {userDetailData.email}
                  </p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Telepon</p>
                  <p className="font-medium text-on-surface flex items-center gap-2">
                    <Phone className="h-4 w-4 text-outline" />
                    {userDetailData.phone}
                  </p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Departemen</p>
                  <p className="font-medium text-on-surface flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-outline" />
                    {userDetailData.department}
                  </p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Terdaftar Sejak</p>
                  <p className="font-medium text-on-surface flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-outline" />
                    {userDetailData.createdAt}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-label-md text-label-md text-on-surface-variant">Login Terakhir</p>
                  <p className="font-medium text-on-surface flex items-center gap-2">
                    <Activity className="h-4 w-4 text-outline" />
                    {userDetailData.lastLogin}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/60">
                <Button variant="outline">
                  <Shield className="h-4 w-4" />
                  Kelola Hak Akses
                </Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4" />
                  Notifikasi
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4" />
                  Preferensi
                </Button>
                <Button variant="outline" className="text-error hover:bg-error-container border-error/40">
                  <LogOut className="h-4 w-4" />
                  Nonaktifkan Akun
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-outline-variant/60">
        <nav className="flex gap-8" aria-label="Tabs">
          {[
            { id: "profile", label: "Profil", icon: Users },
            { id: "permissions", label: "Hak Akses", icon: Shield },
            { id: "activity", label: "Aktivitas", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Lengkap</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 md:grid-cols-2">
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">ID Pengguna</dt>
                <dd className="font-mono text-on-surface">{userDetailData.id}</dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Nama Lengkap</dt>
                <dd className="font-medium text-on-surface">{userDetailData.name}</dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Email</dt>
                <dd className="font-medium text-on-surface">{userDetailData.email}</dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Telepon</dt>
                <dd className="font-mono text-on-surface">{userDetailData.phone}</dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Role</dt>
                <dd className="font-medium text-on-surface">{userDetailData.role}</dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Departemen</dt>
                <dd className="font-medium text-on-surface">{userDetailData.department}</dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Status</dt>
                <dd className="font-medium text-on-surface">
                  <StatusBadge status={userDetailData.status} />
                </dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md text-on-surface-variant">Login Terakhir</dt>
                <dd className="font-mono text-on-surface">{userDetailData.lastLogin}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-label-md text-label-md text-on-surface-variant">Dibuat Pada</dt>
                <dd className="font-medium text-on-surface">{userDetailData.createdAt}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {activeTab === "permissions" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hak Akses Modul</CardTitle>
              <Badge variant="secondary">Role: {userDetailData.role}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-left font-label-md text-label-md text-on-surface-variant">
                    <th className="pb-3 font-medium w-48">Modul</th>
                    <th className="pb-3 font-medium text-center w-20">Lihat</th>
                    <th className="pb-3 font-medium text-center w-20">Tambah/Edit</th>
                    <th className="pb-3 font-medium text-center w-20">Hapus</th>
                    <th className="pb-3 font-medium text-center w-20">Ekspor</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionsData.map((perm) => (
                    <tr key={perm.module} className="border-b border-outline-variant/40">
                      <td className="py-3 font-medium text-on-surface">{perm.module}</td>
                      <td className="py-3 text-center">
                        {perm.read ? <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : <XCircle className="h-5 w-5 text-outline-variant mx-auto" />}
                      </td>
                      <td className="py-3 text-center">
                        {perm.write ? <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : <XCircle className="h-5 w-5 text-outline-variant mx-auto" />}
                      </td>
                      <td className="py-3 text-center">
                        {perm.delete ? <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : <XCircle className="h-5 w-5 text-outline-variant mx-auto" />}
                      </td>
                      <td className="py-3 text-center">
                        {perm.export ? <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : <XCircle className="h-5 w-5 text-outline-variant mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
              Hak akses ditentukan oleh role <strong>{userDetailData.role}</strong>. 
              Perubahan hak akses memerlukan role Admin.
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === "activity" && (
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru (30 Hari)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { header: "Tanggal", accessor: "date", className: "w-28" },
                { header: "Waktu", accessor: "time", className: "w-20 font-mono" },
                { header: "Aksi", accessor: (row) => <ActionBadge action={row.action} />, className: "w-24" },
                { header: "Deskripsi", accessor: "description" },
                { header: "IP Address", accessor: "ip", className: "w-36 font-mono text-sm hidden lg:table-cell" },
                { header: "Device", accessor: "device", className: "hidden lg:table-cell" },
              ]}
              data={activityData}
              keyAccessor="id"
              emptyMessage="Belum ada aktivitas"
            />
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="text-outline">...</span>
              <Button variant="outline" size="sm">5</Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}