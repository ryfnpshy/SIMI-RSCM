"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { pesanDb } from "@/lib/data"
import type { Hasil } from "@/lib/actions/inventori"
import { JENIS_LAPORAN } from "@/lib/laporan"

const teks = (f: FormData, k: string) => String(f.get(k) ?? "").trim()
const atauNull = (v: string) => (v === "" ? null : v)

export async function setPengguna(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const id = teks(f, "id")
  if (!id) return { error: "Pengguna tidak dikenali." }

  const supabase = await createClient()
  const { error } = await supabase.rpc("api_set_pengguna", {
    p_id: id,
    p_role: atauNull(teks(f, "role_id")),
    p_unit: atauNull(teks(f, "unit_id")),
    p_status: atauNull(teks(f, "status")),
    p_nama: atauNull(teks(f, "nama")),
    p_nip: atauNull(teks(f, "nip")),
    p_telepon: atauNull(teks(f, "telepon")),
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/manajemen-pengguna")
  revalidatePath("/detail-pengguna")
  return { pesan: "Data pengguna diperbarui." }
}

export async function aktifkanPengguna(f: FormData) {
  const id = teks(f, "id")
  const supabase = await createClient()
  const { error } = await supabase.rpc("api_set_pengguna", { p_id: id, p_status: "aktif" })
  const tujuan = error
    ? `/manajemen-pengguna?error=${encodeURIComponent(pesanDb(error.message))}`
    : "/manajemen-pengguna?status=diaktifkan"
  revalidatePath("/manajemen-pengguna")
  redirect(tujuan)
}

export async function buatLaporan(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const jenis = teks(f, "jenis")
  const mulai = teks(f, "periode_mulai")
  const selesai = teks(f, "periode_selesai")
  if (!jenis) return { error: "Jenis laporan wajib dipilih." }
  if (!JENIS_LAPORAN.some((item) => item.value === jenis)) return { error: "Jenis laporan tidak dikenali." }
  if (!mulai || !selesai) return { error: "Periode laporan wajib diisi." }
  if (selesai < mulai) return { error: "Tanggal selesai tidak boleh sebelum tanggal mulai." }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("api_buat_laporan", {
    p_jenis: jenis,
    p_periode_mulai: mulai,
    p_periode_selesai: selesai,
    p_unit: atauNull(teks(f, "unit_id")),
    p_kategori: atauNull(teks(f, "kategori")),
    p_filter: {},
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/daftar-laporan")
  const id = (data as { id?: string })?.id
  redirect(id ? `/detail-laporan?id=${id}` : "/daftar-laporan?status=dibuat")
}