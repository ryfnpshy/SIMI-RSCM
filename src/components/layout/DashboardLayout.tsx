"use client"

import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Profil } from "@/lib/auth"

export function DashboardLayout({ profil, children }: { profil: Profil; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-on-surface/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: hidden below lg (CSS-driven, no hydration flash), toggled on mobile */}
      <Sidebar
        peran={profil.role_id}
        className={cn(
          "transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        <Header profil={profil} onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}