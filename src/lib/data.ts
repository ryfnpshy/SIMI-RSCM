import { createClient } from "@/lib/supabase/server"

/** Buang prefiks KODE| dari pesan exception database. */
export function pesanDb(pesan: string | undefined | null) {
  if (!pesan) return "Terjadi kesalahan pada database."
  const index = pesan.indexOf("|")
  const teks = index >= 0 ? pesan.slice(index + 1) : pesan
  return teks.charAt(0).toUpperCase() + teks.slice(1)
}

/* ------------------------------------------------------------------ baca */

export type RingkasAlat = {
  id: string
  kode_unik: string
  nama: string
  kategori: string
  jenis: "reusable" | "aset"
  satuan: string
  aktif: boolean
  jumlah_minimum_stok: number
  limit_siklus: number | null
  jumlah_siklus: number
  perlu_maintenance: boolean
  total_stok: number
  stok_gudang: number
  stok_cssd: number
  stok_unit_medis: number
  kedaluwarsa_terdekat: string | null
}

export async function daftarAlat(cari?: string) {
  const supabase = await createClient()
  let kueri = supabase.from("v_stok_ringkas").select("*").order("nama")
  if (cari?.trim()) {
    const q = `%${cari.trim()}%`
    kueri = kueri.or(`nama.ilike.${q},kode_unik.ilike.${q},kategori.ilike.${q}`)
  }
  const { data, error } = await kueri
  if (error) throw new Error(error.message)
  return (data ?? []) as RingkasAlat[]
}

export async function detailAlat(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("v_stok_ringkas").select("*").eq("id", id).maybeSingle()
  if (error) throw new Error(error.message)
  return (data as RingkasAlat | null) ?? null
}

export type AlatPenuh = {
  id: string
  kode_unik: string
  nama: string
  kategori: string
  jenis: "reusable" | "aset"
  satuan: string
  merek: string | null
  jumlah_minimum_stok: number
  limit_siklus: number | null
  masa_simpan_hari: number
  catatan: string | null
  aktif: boolean
}

/** Dipakai form ubah alat: butuh kolom yang tidak ada di view ringkas. */
export async function alatPenuh(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("alat")
    .select("id, kode_unik, nama, kategori, jenis, satuan, merek, jumlah_minimum_stok, limit_siklus, masa_simpan_hari, catatan, aktif")
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as AlatPenuh | null) ?? null
}

export type BarisStok = {
  id: string
  jumlah: number
  status: string
  tanggal_kedaluwarsa: string | null
  alat: { kode_unik: string; nama: string; kategori: string } | null
  unit: { nama: string; kode: string; tipe: string } | null
}

export async function daftarStok() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("stok_unit")
    .select("id, jumlah, status, tanggal_kedaluwarsa, alat:alat(kode_unik, nama, kategori), unit:units(nama, kode, tipe)")
    .gt("jumlah", 0)
    .order("updated_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisStok[]
}

export type BarisMasuk = {
  id: string
  nomor: string
  jumlah: number
  tanggal: string
  sumber: string
  nomor_bast: string | null
  alat: { kode_unik: string; nama: string; satuan: string } | null
  unit: { nama: string } | null
  petugas: { nama: string } | null
}

export async function daftarMasuk(batas = 50) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transaksi_masuk")
    .select("id, nomor, jumlah, tanggal, sumber, nomor_bast, alat:alat(kode_unik, nama, satuan), unit:units(nama), petugas:users(nama)")
    .order("created_at", { ascending: false })
    .limit(batas)
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisMasuk[]
}

export type BarisKeluar = {
  id: string
  nomor: string
  jumlah: number
  tanggal: string
  status: "menunggu_konfirmasi" | "diterima" | "perlu_tindak_lanjut" | "dibatalkan"
  nomor_bast: string | null
  alat: { kode_unik: string; nama: string; satuan: string } | null
  asal: { nama: string } | null
  tujuan: { nama: string } | null
  petugas: { nama: string } | null
}

export async function daftarKeluar(status?: BarisKeluar["status"], batas = 50) {
  const supabase = await createClient()
  let kueri = supabase
    .from("transaksi_keluar")
    .select("id, nomor, jumlah, tanggal, status, nomor_bast, alat:alat(kode_unik, nama, satuan), asal:units!transaksi_keluar_unit_asal_id_fkey(nama), tujuan:units!transaksi_keluar_unit_tujuan_id_fkey(nama), petugas:users(nama)")
    .order("created_at", { ascending: false })
    .limit(batas)
  if (status) kueri = kueri.eq("status", status)
  const { data, error } = await kueri
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisKeluar[]
}

export async function detailKeluar(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transaksi_keluar")
    .select("id, nomor, jumlah, tanggal, status, nomor_bast, alat:alat(kode_unik, nama, satuan), asal:units!transaksi_keluar_unit_asal_id_fkey(nama), tujuan:units!transaksi_keluar_unit_tujuan_id_fkey(nama), petugas:users(nama)")
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as unknown as BarisKeluar | null) ?? null
}

export type BarisKonfirmasi = {
  id: string
  jumlah_dikirim: number
  jumlah_diterima: number
  jumlah_selisih: number
  kondisi: "baik" | "rusak"
  keterangan: string | null
  created_at: string
  transaksi: BarisKeluar | null
  petugas: { nama: string } | null
}

export async function daftarKonfirmasi(batas = 50) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("konfirmasi_penerimaan")
    .select(
      "id, jumlah_dikirim, jumlah_diterima, jumlah_selisih, kondisi, keterangan, created_at, petugas:users(nama), transaksi:transaksi_keluar(id, nomor, jumlah, tanggal, status, nomor_bast, alat:alat(kode_unik, nama, satuan), asal:units!transaksi_keluar_unit_asal_id_fkey(nama), tujuan:units!transaksi_keluar_unit_tujuan_id_fkey(nama), petugas:users(nama))"
    )
    .order("created_at", { ascending: false })
    .limit(batas)
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisKonfirmasi[]
}

export type BarisRiwayat = {
  id: number
  status_lama: string | null
  status_baru: string
  keterangan: string | null
  sumber: "manual" | "transaksi" | "sterilisasi"
  created_at: string
  alat: { kode_unik: string; nama: string } | null
  unit: { nama: string } | null
  petugas: { nama: string } | null
}

export async function daftarRiwayat(batas = 60) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("riwayat_status")
    .select("id, status_lama, status_baru, keterangan, sumber, created_at, alat:alat(kode_unik, nama), unit:units(nama), petugas:users(nama)")
    .order("created_at", { ascending: false })
    .limit(batas)
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisRiwayat[]
}

export type BarisBatch = {
  id: string
  nomor: string
  mesin: string
  tahap: string
  indikator_bowie_dick: boolean | null
  indikator_biologis: boolean | null
  hasil_verifikasi: "lulus" | "gagal" | null
  catatan: string | null
  mulai_at: string
  selesai_at: string | null
  pembuat: { nama: string } | null
}

export async function daftarBatch(batas = 30) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("batch_sterilisasi")
    .select("id, nomor, mesin, tahap, indikator_bowie_dick, indikator_biologis, hasil_verifikasi, catatan, mulai_at, selesai_at, pembuat:users(nama)")
    .order("created_at", { ascending: false })
    .limit(batas)
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisBatch[]
}

export async function detailBatch(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("batch_sterilisasi")
    .select(
      "id, nomor, mesin, tahap, indikator_bowie_dick, indikator_biologis, hasil_verifikasi, catatan, mulai_at, selesai_at, pembuat:users(nama), log:sterilisasi_log(id, tahap, jumlah, catatan, created_at, alat:alat(kode_unik, nama), petugas:users(nama))"
    )
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data as unknown as (BarisBatch & {
    log: { id: number; tahap: string; jumlah: number; catatan: string | null; created_at: string; alat: { kode_unik: string; nama: string } | null; petugas: { nama: string } | null }[]
  }) | null
}

export type BarisNotifikasi = {
  jenis: "kedaluwarsa" | "stok_minimum" | "konfirmasi_tertunda" | "batch_gagal"
  kode_unik: string | null
  nama: string | null
  pesan: string
  prioritas: "tinggi" | "sedang" | "rendah"
  tanggal: string | null
}

export async function daftarNotifikasi() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("v_notifikasi").select("*")
  if (error) throw new Error(error.message)
  return (data ?? []) as BarisNotifikasi[]
}

export type BarisPengguna = {
  id: string
  nama: string
  email: string
  role_id: string
  status: "menunggu_aktivasi" | "aktif" | "nonaktif"
  nip: string | null
  telepon: string | null
  created_at: string
  unit: { nama: string; kode: string } | null
}

export async function daftarPengguna() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, nama, email, role_id, status, nip, telepon, created_at, unit:units(nama, kode)")
    .order("created_at")
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisPengguna[]
}

export type BarisAlias = { id: string; alias: string; unit: { id: string; nama: string; kode: string } | null }

export async function daftarAliasAlat(alatId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("alias_alat")
    .select("id, alias, unit:units(id, nama, kode)")
    .eq("alat_id", alatId)
    .order("alias")
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisAlias[]
}

export async function daftarUnit() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("units").select("id, kode, nama, tipe").eq("aktif", true).order("kode")
  if (error) throw new Error(error.message)
  return (data ?? []) as { id: string; kode: string; nama: string; tipe: string }[]
}

export async function daftarPeran() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("roles").select("id, nama").order("id")
  if (error) throw new Error(error.message)
  return (data ?? []) as { id: string; nama: string }[]
}

export async function penggunaById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, nama, email, role_id, status, nip, telepon, created_at, unit:units(nama, kode)")
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as unknown as BarisPengguna | null) ?? null
}

export type BarisLaporan = {
  id: string
  jenis: string
  periode_mulai: string
  periode_selesai: string
  kategori: string | null
  filter: Record<string, unknown>
  created_at: string
  unit: { id: string; nama: string } | null
  pembuat: { nama: string } | null
}

export async function daftarLaporan() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("laporan")
    .select("id, jenis, periode_mulai, periode_selesai, kategori, filter, created_at, unit:units(id, nama), pembuat:users(nama)")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as BarisLaporan[]
}

export async function laporanById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("laporan")
    .select("id, jenis, periode_mulai, periode_selesai, kategori, filter, created_at, unit:units(id, nama), pembuat:users(nama)")
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as unknown as BarisLaporan | null) ?? null
}

export type RingkasanLaporan = {
  periode: { mulai: string; selesai: string }
  masuk: { transaksi: number; jumlah: number }
  keluar: { transaksi: number; jumlah: number; menunggu_konfirmasi: number }
  selisih_penerimaan: { transaksi: number; jumlah: number }
  sterilisasi: { batch: number; lulus: number; gagal: number }
  per_unit: { unit: string; jumlah: number; jenis_alat: number }[]
}

export async function ringkasanLaporan(mulai: string, selesai: string, unit: string | null = null) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("api_ringkasan_laporan", {
    p_mulai: mulai,
    p_selesai: selesai,
    p_unit: unit,
  })
  if (error) throw new Error(error.message)
  return data as unknown as RingkasanLaporan
}

export async function ringkasan() {
  const supabase = await createClient()
  const [alat, keluar, notifikasi, batch] = await Promise.all([
    supabase.from("v_stok_ringkas").select("total_stok, stok_gudang, stok_unit_medis, stok_cssd, jumlah_minimum_stok, aktif"),
    supabase.from("transaksi_keluar").select("id, status"),
    supabase.from("v_notifikasi").select("jenis, prioritas"),
    supabase.from("batch_sterilisasi").select("id, tahap, hasil_verifikasi"),
  ])

  const barisAlat = (alat.data ?? []) as { total_stok: number; stok_gudang: number; stok_unit_medis: number; stok_cssd: number; jumlah_minimum_stok: number; aktif: boolean }[]
  const totalStok = barisAlat.reduce((n, a) => n + a.total_stok, 0)
  const stokGudang = barisAlat.reduce((n, a) => n + a.stok_gudang, 0)
  const stokUnit = barisAlat.reduce((n, a) => n + a.stok_unit_medis, 0)
  const stokCssd = barisAlat.reduce((n, a) => n + a.stok_cssd, 0)
  const diBawahMinimum = barisAlat.filter((a) => a.total_stok < a.jumlah_minimum_stok).length

  const barisKeluar = (keluar.data ?? []) as { id: string; status: string }[]
  const notif = (notifikasi.data ?? []) as { jenis: string; prioritas: string }[]
  const barisBatch = (batch.data ?? []) as { id: string; tahap: string; hasil_verifikasi: string | null }[]

  return {
    jenisAlat: barisAlat.filter((a) => a.aktif).length,
    totalStok,
    stokGudang,
    stokUnit,
    stokCssd,
    diBawahMinimum,
    menungguKonfirmasi: barisKeluar.filter((k) => k.status === "menunggu_konfirmasi").length,
    perluTindakLanjut: barisKeluar.filter((k) => k.status === "perlu_tindak_lanjut").length,
    notifikasi: notif.length,
    notifikasiTinggi: notif.filter((n) => n.prioritas === "tinggi").length,
    batchBerjalan: barisBatch.filter((b) => b.tahap !== "terdistribusi" && b.tahap !== "gagal").length,
    batchGagal: barisBatch.filter((b) => b.hasil_verifikasi === "gagal").length,
  }
}