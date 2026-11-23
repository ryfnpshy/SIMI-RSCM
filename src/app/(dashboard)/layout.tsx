import { connection } from "next/server"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { requireProfil } from "@/lib/auth"

// Seluruh area dashboard bergantung pada sesi; opt-out validasi instant-navigation
// (Cache Components) sampai alur per-route dimigrasikan ke Suspense/use cache.
export const instant = false

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  // Seluruh area dashboard bergantung pada sesi, jadi kita hentikan prerender
  // di sini supaya tidak ada penilaian waktu (Date.now) saat build.
  await connection()
  const profil = await requireProfil()
  return <DashboardLayout profil={profil}>{children}</DashboardLayout>
}
