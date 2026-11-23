"use client"

import { Bell, Menu, Search } from "lucide-react"
import Link from "next/link"

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = {
    name: "Ratna Sari, S.Kep",
    role: "Admin Inventori",
    avatar: "RS",
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-outline-variant/60 bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container lg:hidden"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search */}
        <div className="hidden sm:block sm:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <input
              type="search"
              placeholder="Cari alat, batch, laporan..."
              className="w-full rounded-lg bg-surface-container-low py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 shadow-sm transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 font-label-md text-label-md text-on-surface-variant lg:inline-flex">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-semibold">Supabase DB</span>
          </span>

          <button
            className="relative rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-medium text-on-error">
              3
            </span>
          </button>

          <Link
            href="/profil"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-container"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-label-lg text-label-lg text-primary">
              {user.avatar}
            </div>
            <div className="hidden text-left md:block">
              <p className="font-label-lg text-label-lg text-on-surface">{user.name}</p>
              <p className="font-label-md text-label-md text-on-surface-variant">{user.role}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}