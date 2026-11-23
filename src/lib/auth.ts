import { cache } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Peran } from "@/lib/nav"

export type Profil = {
  id: string
  nama: string
  email: string
  role_id: Peran
  unit_id: string | null
  status: "menunggu_aktivasi" | "aktif" | "nonaktif"
  nip: string | null
  telepon: string | null
  unit: { nama: string; kode: string; tipe: string } | null
}

/** Profil pengguna yang sedang login (dibaca sekali per request). */
export const getProfil = cache(async (): Promise<Profil | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("id, nama, email, role_id, unit_id, status, nip, telepon, unit:units(nama, kode, tipe)")
    .eq("id", user.id)
    .maybeSingle()

  return (data as Profil | null) ?? null
})

export async function requireProfil(): Promise<Profil> {
  const profil = await getProfil()
  if (!profil) redirect("/login")
  if (profil.status !== "aktif") redirect("/login?alasan=belum-aktif")
  return profil
}

export async function requirePeran(...peran: Peran[]): Promise<Profil> {
  const profil = await requireProfil()
  if (!peran.includes(profil.role_id)) redirect("/dashboard?alasan=akses-ditolak")
  return profil
}