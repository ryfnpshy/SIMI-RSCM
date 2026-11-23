"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { pesanDb } from "@/lib/data"
import type { Hasil } from "@/lib/actions/inventori"

export async function perbaruiProfil(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi berakhir. Silakan masuk kembali." }

  const nama = String(f.get("nama") ?? "").trim()
  if (nama.length < 3) return { error: "Nama lengkap minimal 3 karakter." }

  const { error } = await supabase
    .from("users")
    .update({
      nama,
      nip: String(f.get("nip") ?? "").trim() || null,
      telepon: String(f.get("telepon") ?? "").trim() || null,
    })
    .eq("id", user.id)

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/profil")
  return { pesan: "Profil berhasil diperbarui." }
}

export async function ubahKataSandi(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const sandi = String(f.get("sandi") ?? "")
  const ulangi = String(f.get("ulangi") ?? "")
  if (sandi.length < 6) return { error: "Kata sandi minimal 6 karakter." }
  if (sandi !== ulangi) return { error: "Konfirmasi kata sandi tidak sama." }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: sandi })
  if (error) return { error: pesanDb(error.message) }

  return { pesan: "Kata sandi berhasil diubah." }
}
