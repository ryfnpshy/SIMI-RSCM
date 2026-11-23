"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { pesanDb } from "@/lib/data"
import type { Hasil } from "@/lib/actions/inventori"

const teks = (f: FormData, k: string) => String(f.get(k) ?? "").trim()
const atauNull = (v: string) => (v === "" ? null : v)

export async function buatBatch(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const mesin = teks(f, "mesin")
  if (mesin.length < 2) return { error: "Nama mesin autoklaf wajib diisi." }

  const alatIds = f.getAll("alat_ids").map(String).filter(Boolean)
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("api_buat_batch", {
    p_mesin: mesin,
    p_alat_ids: alatIds,
    p_catatan: atauNull(teks(f, "catatan")),
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/batch-sterilisasi")
  revalidatePath("/status-alat")
  const id = (data as { id?: string })?.id
  redirect(id ? `/detail-batch?id=${id}` : "/batch-sterilisasi?status=dibuat")
}

export async function majukanBatch(f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.rpc("api_majukan_batch", {
    p_batch: teks(f, "batch_id"),
    p_tahap: teks(f, "tahap"),
    p_catatan: atauNull(teks(f, "catatan")),
  })
  if (error) redirect(`/detail-batch?id=${teks(f, "batch_id")}&error=${encodeURIComponent(pesanDb(error.message))}`)
  revalidatePath("/batch-sterilisasi")
  revalidatePath("/detail-batch")
  revalidatePath("/status-alat")
  redirect(`/detail-batch?id=${teks(f, "batch_id")}&status=maju`)
}

export async function verifikasiBatch(f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.rpc("api_verifikasi_batch", {
    p_batch: teks(f, "batch_id"),
    p_bowie: teks(f, "bowie") === "true",
    p_biologis: teks(f, "biologis") === "true",
    p_catatan: atauNull(teks(f, "catatan")),
  })
  if (error) redirect(`/detail-batch?id=${teks(f, "batch_id")}&error=${encodeURIComponent(pesanDb(error.message))}`)
  revalidatePath("/batch-sterilisasi")
  revalidatePath("/detail-batch")
  revalidatePath("/status-alat")
  revalidatePath("/dashboard")
  redirect(`/detail-batch?id=${teks(f, "batch_id")}&status=verifikasi`)
}