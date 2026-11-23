"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  PackageCheck,
  Truck,
  Activity,
  History,
  FlaskConical,
  ClipboardCheck,
  FileText,
  Users,
  Settings,
  Bell,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Data Alat", href: "/data-alat", icon: Package },
  { name: "Alat Masuk", href: "/alat-masuk", icon: PackageCheck },
  { name: "Alat Keluar / Distribusi", href: "/alat-keluar", icon: Truck },
  { name: "Status Alat", href: "/status-alat", icon: Activity },
  { name: "Riwayat Pergerakan", href: "/riwayat-pergerakan", icon: History },
]

const operasionalNavigation = [
  { name: "Batch Sterilisasi", href: "/batch-sterilisasi", icon: FlaskConical },
  { name: "Konfirmasi Penerimaan", href: "/konfirmasi-penerimaan", icon: ClipboardCheck },
]

const laporanNavigation = [
  { name: "Daftar Laporan", href: "/daftar-laporan", icon: FileText },
]

const administrasiNavigation = [
  { name: "Manajemen Pengguna", href: "/manajemen-pengguna", icon: Users },
]

const settingsNavigation = [
  { name: "Pengaturan", href: "/pengaturan", icon: Settings },
  { name: "Notifikasi", href: "/notifikasi", icon: Bell },
  { name: "Profil", href: "/profil", icon: User },
]

function NavSection({
  title,
  items,
  pathname,
}: {
  title?: string
  items: typeof navigation
  pathname: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {title && (
        <p className="px-3 py-2 font-label-code text-label-code uppercase tracking-wider text-outline">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 font-label-lg text-label-lg transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-outline-variant/60 bg-surface-container-lowest transition-all duration-300",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2 border-b border-outline-variant/60 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Package className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-headline-sm text-headline-sm text-on-surface">SIM Inventori</span>
            <span className="font-label-code text-label-code uppercase tracking-wider text-primary">
              RS Cipto Mangunkusumo
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3 overflow-y-auto p-3">
          <NavSection items={navigation} pathname={pathname} />
          <NavSection title="Operasional CSSD" items={operasionalNavigation} pathname={pathname} />
          <NavSection title="Laporan" items={laporanNavigation} pathname={pathname} />
          <NavSection title="Administrasi" items={administrasiNavigation} pathname={pathname} />
          <NavSection title="Pengaturan" items={settingsNavigation} pathname={pathname} />
        </nav>

        {/* RBAC notice */}
        <div className="border-t border-outline-variant/60 p-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-2.5 py-2 font-label-code text-label-code text-outline">
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
            Terproteksi RBAC
          </div>
        </div>
      </div>
    </aside>
  )
}