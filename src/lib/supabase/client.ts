"use client"

import { createBrowserClient } from "@supabase/ssr"

/** Klien Supabase untuk komponen client (form interaktif). */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi di .env.local")
  }
  return createBrowserClient(url, key)
}