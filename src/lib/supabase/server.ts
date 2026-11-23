import { cookies } from "next/headers"
import { connection } from "next/server"
import { createServerClient } from "@supabase/ssr"

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi di .env.local")
  }
  return { url, key }
}

/** Klien Supabase sisi server (Server Component, Server Action, Route Handler). */
export async function createClient() {
  // Paksa render waktu-request sebelum klien dibuat. Klien Supabase membaca
  // waktu (Date.now untuk cek kedaluwarsa token); tanpa ini Next menandai
  // setiap halaman ber-data sebagai nilai tak stabil saat prerender.
  await connection()
  const { url, key } = env()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (daftar) => {
        try {
          daftar.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Component tidak boleh menulis cookie; penyegaran sesi ditangani proxy.
        }
      },
    },
  })
}