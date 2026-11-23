"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type HasilAksi = { error?: string; pesan?: string }

function pesanRamah(pesan: string) {
  const p = pesan.toLowerCase()
  if (p.includes("invalid login credentials")) return "Email atau kata sandi salah."
  if (p.includes("email not confirmed")) return "Email belum dikonfirmasi. Buka tautan aktivasi di kotak masuk Anda."
  if (p.includes("user already registered")) return "Email sudah terdaftar. Gunakan halaman masuk."
  if (p.includes("password should be")) return "Kata sandi minimal 6 karakter."
  if (p.includes("rate limit")) return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi."
  return pesan
}

export async function masuk(_sebelumnya: HasilAksi | undefined, formData: FormData): Promise<HasilAksi> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Email dan kata sandi wajib diisi." }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: pesanRamah(error.message) }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profil } = await supabase.from("users").select("status").eq("id", user.id).maybeSingle()

    if (!profil) {
      await supabase.auth.signOut()
      return { error: "Profil pengguna belum terbentuk. Hubungi Admin Inventori." }
    }

    if (profil.status !== "aktif") {
      await supabase.auth.signOut()
      return {
        error:
          profil.status === "menunggu_aktivasi"
            ? "Akun menunggu aktivasi. Konfirmasi email lalu minta Admin Inventori mengaktifkan peran Anda."
            : "Akun dinonaktifkan. Hubungi Admin Inventori.",
      }
    }
  }

  redirect("/dashboard")
}

export async function daftar(_sebelumnya: HasilAksi | undefined, formData: FormData): Promise<HasilAksi> {
  const nama = String(formData.get("nama") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (nama.length < 3) return { error: "Nama lengkap wajib diisi (minimal 3 karakter)." }
  if (!email || !password) return { error: "Email dan kata sandi wajib diisi." }
  if (password.length < 6) return { error: "Kata sandi minimal 6 karakter." }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nama } },
  })

  if (error) return { error: pesanRamah(error.message) }

  // Pengguna pertama otomatis menjadi Admin Inventori yang aktif (bootstrap),
  // sisanya menunggu aktivasi email + penetapan peran oleh admin.
  if (data.session) redirect("/dashboard")

  return {
    pesan: "Pendaftaran tercatat. Buka tautan konfirmasi di email Anda, lalu tunggu Admin Inventori menetapkan peran dan unit.",
  }
}

export async function keluar() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}