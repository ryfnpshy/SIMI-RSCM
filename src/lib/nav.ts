import { Bell, ClipboardCheck, FileText, FlaskConical, History, LayoutDashboard, Package, PackageCheck, Settings, Truck, Activity, Users, User } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { LABEL_PERAN, SEMUA_PERAN, peranUntukRute, type Peran } from "@/lib/akses"

export { LABEL_PERAN, SEMUA_PERAN, peranUntukRute }
export type { Peran }

export type ItemNav = {
  name: string
  href: string
  icon: LucideIcon
}

export type GrupNav = { title?: string; items: ItemNav[] }

// Hak akses menu mengikuti matriks RBAC pada laporan (4.3.x). Matriksnya ada di
// src/lib/akses.ts (peranUntukRute) agar proxy dan Sidebar memakai sumber sama;
// RLS tetap jadi penjaga terakhir.
export const NAVIGASI: GrupNav[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Data Alat", href: "/data-alat", icon: Package },
      { name: "Alat Masuk", href: "/alat-masuk", icon: PackageCheck },
      { name: "Alat Keluar / Distribusi", href: "/alat-keluar", icon: Truck },
      { name: "Status Alat", href: "/status-alat", icon: Activity },
      { name: "Riwayat Pergerakan", href: "/riwayat-pergerakan", icon: History },
    ],
  },
  {
    title: "Operasional CSSD",
    items: [
      { name: "Batch Sterilisasi", href: "/batch-sterilisasi", icon: FlaskConical },
      { name: "Konfirmasi Penerimaan", href: "/konfirmasi-penerimaan", icon: ClipboardCheck },
    ],
  },
  {
    title: "Laporan",
    items: [{ name: "Daftar Laporan", href: "/daftar-laporan", icon: FileText }],
  },
  {
    title: "Administrasi",
    items: [{ name: "Manajemen Pengguna", href: "/manajemen-pengguna", icon: Users }],
  },
  {
    title: "Pengaturan",
    items: [
      { name: "Pengaturan", href: "/pengaturan", icon: Settings },
      { name: "Notifikasi", href: "/notifikasi", icon: Bell },
      { name: "Profil", href: "/profil", icon: User },
    ],
  },
]

export function navigasiUntuk(peran: Peran): GrupNav[] {
  return NAVIGASI.map((grup) => ({
    title: grup.title,
    items: grup.items.filter((item) => peranUntukRute(item.href)?.includes(peran) ?? false),
  })).filter((grup) => grup.items.length > 0)
}
