"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { pesanDb } from "@/lib/data"

export type Hasil = { error?: string; pesan?: string }

const teks = (f: FormData, k: string) => String(f.get(k) ?? "").trim()
const angka = (f: FormData, k: string) => Number(f.get(k) ?? 0)
const atauNull = (v: string) => (v === "" ? null : v)

/* --------------------------------------------------------------- data alat */

export async function simpanAlat(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const kode = teks(f, "kode_unik")
  const nama = teks(f, "nama")
  const kategori = teks(f, "kategori")
  if (!kode) return { error: "Kode unik wajib diisi." }
  if (nama.length < 3) return { error: "Nama alat minimal 3 karakter." }
  if (!kategori) return { error: "Kategori wajib dipilih." }

  const limit = teks(f, "limit_siklus")
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("api_simpan_alat", {
    p_kode_unik: kode,
    p_nama: nama,
    p_kategori: kategori,
    p_jenis: teks(f, "jenis") || "reusable",
    p_satuan: teks(f, "satuan") || "unit",
    p_merek: atauNull(teks(f, "merek")),
    p_jumlah_minimum_stok: angka(f, "jumlah_minimum_stok"),
    p_limit_siklus: limit ? angka(f, "limit_siklus") : null,
    p_masa_simpan_hari: angka(f, "masa_simpan_hari") || 30,
    p_catatan: atauNull(teks(f, "catatan")),
    p_id: atauNull(teks(f, "id")),
  })

  if (error) return { error: pesanDb(error.message) }

  const alat = data as { id: string } | null
  if (!alat?.id) return { error: "Data alat tersimpan tetapi id tidak dikembalikan database." }

  // Saldo awal hanya untuk alat baru, dan dicatat sebagai transaksi masuk resmi
  // supaya riwayat pergerakan tetap utuh (bukan tulisan langsung ke stok_unit).
  const awal = angka(f, "jumlah_awal")
  if (awal > 0) {
    const { error: eMasuk } = await supabase.rpc("api_catat_alat_masuk", {
      p_alat: alat.id,
      p_jumlah: awal,
      p_sumber: "saldo_awal",
      p_catatan: "Saldo awal saat registrasi alat",
    })
    if (eMasuk) return { error: pesanDb(eMasuk.message) }
  }

  if (teks(f, "aktif") === "nonaktif") {
    const { error: eAktif } = await supabase.rpc("api_set_alat_aktif", { p_id: alat.id, p_aktif: false })
    if (eAktif) return { error: pesanDb(eAktif.message) }
  }

  // Alias nomenklatur per unit (opsional) — disimpan setelah alat punya id.
  const unitAlias = f.getAll("alias_unit").map(String)
  const namaAlias = f.getAll("alias_nama").map(String)
  for (let i = 0; i < unitAlias.length; i += 1) {
    const unit = unitAlias[i]?.trim()
    const alias = namaAlias[i]?.trim()
    if (!unit || !alias) continue
    const { error: eAlias } = await supabase.rpc("api_simpan_alias", {
      p_alat: alat.id,
      p_unit: unit,
      p_alias: alias,
    })
    if (eAlias && !eAlias.message.includes("ALIAS_DUPLIKAT")) return { error: pesanDb(eAlias.message) }
  }

  revalidatePath("/data-alat")
  revalidatePath("/status-alat")
  redirect("/data-alat?status=tersimpan")
}

export async function setAlatAktif(f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.rpc("api_set_alat_aktif", {
    p_id: teks(f, "id"),
    p_aktif: teks(f, "aktif") === "true",
  })
  if (error) redirect(`/data-alat?error=${encodeURIComponent(pesanDb(error.message))}`)
  revalidatePath("/data-alat")
  redirect("/data-alat?status=diperbarui")
}

export async function simpanAlias(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const supabase = await createClient()
  const { error } = await supabase.rpc("api_simpan_alias", {
    p_alat: teks(f, "alat_id"),
    p_unit: teks(f, "unit_id"),
    p_alias: teks(f, "alias"),
    p_id: atauNull(teks(f, "id")),
  })
  if (error) return { error: pesanDb(error.message) }
  revalidatePath("/pengaturan")
  return { pesan: "Alias tersimpan." }
}

/* ------------------------------------------------------------ alat masuk */

export async function catatMasuk(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const alat = teks(f, "alat_id")
  const jumlah = angka(f, "jumlah")
  if (!alat) return { error: "Pilih alat terlebih dahulu." }
  if (!Number.isInteger(jumlah) || jumlah <= 0) return { error: "Jumlah harus bilangan bulat lebih dari nol." }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("api_catat_alat_masuk", {
    p_alat: alat,
    p_jumlah: jumlah,
    p_unit_tujuan: atauNull(teks(f, "unit_tujuan")),
    p_tanggal: atauNull(teks(f, "tanggal")),
    p_sumber: teks(f, "sumber") || "pemasok",
    p_nomor_bast: atauNull(teks(f, "nomor_bast")),
    p_catatan: atauNull(teks(f, "catatan")),
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/alat-masuk")
  revalidatePath("/data-alat")
  revalidatePath("/riwayat-pergerakan")
  revalidatePath("/dashboard")
  redirect(`/alat-masuk?status=tersimpan&nomor=${(data as { nomor?: string })?.nomor ?? ""}`)
}

/* -------------------------------------------------------- alat keluar */

export async function catatDistribusi(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const alat = teks(f, "alat_id")
  const tujuan = teks(f, "unit_tujuan")
  const jumlah = angka(f, "jumlah")
  if (!alat) return { error: "Pilih alat terlebih dahulu." }
  if (!tujuan) return { error: "Pilih unit tujuan distribusi." }
  if (!Number.isInteger(jumlah) || jumlah <= 0) return { error: "Jumlah harus bilangan bulat lebih dari nol." }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("api_catat_distribusi", {
    p_alat: alat,
    p_unit_tujuan: tujuan,
    p_jumlah: jumlah,
    p_tanggal: atauNull(teks(f, "tanggal")),
    p_nomor_bast: atauNull(teks(f, "nomor_bast")),
    p_catatan: atauNull(teks(f, "catatan")),
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/alat-keluar")
  revalidatePath("/data-alat")
  revalidatePath("/status-alat")
  revalidatePath("/dashboard")
  redirect(`/alat-keluar?status=tersimpan&nomor=${(data as { nomor?: string })?.nomor ?? ""}`)
}

/* -------------------------------------------------------------- status */

export async function perbaruiStatus(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const alat = teks(f, "alat_id")
  const unit = teks(f, "unit_id")
  const status = teks(f, "status")
  if (!alat || !unit || !status) return { error: "Alat, unit, dan status wajib dipilih." }

  const supabase = await createClient()
  const { error } = await supabase.rpc("api_perbarui_status", {
    p_alat: alat,
    p_unit: unit,
    p_status: status,
    p_keterangan: atauNull(teks(f, "keterangan")),
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/status-alat")
  revalidatePath("/riwayat-pergerakan")
  revalidatePath("/data-alat")
  return { pesan: "Status alat diperbarui." }
}

/* ------------------------------------------------- konfirmasi penerimaan */

export async function konfirmasiPenerimaan(_sebelumnya: Hasil | undefined, f: FormData): Promise<Hasil> {
  const transaksi = teks(f, "transaksi_id")
  const diterima = angka(f, "jumlah_diterima")
  const kondisi = teks(f, "kondisi") || "baik"
  if (!transaksi) return { error: "Transaksi tidak dikenali." }
  if (!Number.isInteger(diterima) || diterima <= 0) return { error: "Jumlah diterima harus lebih dari nol." }

  const supabase = await createClient()
  const { error } = await supabase.rpc("api_konfirmasi_penerimaan", {
    p_transaksi: transaksi,
    p_jumlah_diterima: diterima,
    p_kondisi: kondisi,
    p_keterangan: atauNull(teks(f, "keterangan")),
  })

  if (error) return { error: pesanDb(error.message) }

  revalidatePath("/konfirmasi-penerimaan")
  revalidatePath("/status-alat")
  revalidatePath("/riwayat-pergerakan")
  revalidatePath("/dashboard")
  redirect("/konfirmasi-penerimaan?status=dikonfirmasi")
}