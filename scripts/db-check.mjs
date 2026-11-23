// Pemeriksaan logika bisnis langsung ke database Supabase.
//   node --env-file=.env.local scripts/db-check.mjs
// Menguji: invarian stok, selisih penerimaan, transisi status, alur batch,
// dan pembatasan peran. Tanpa framework, assert manual.
import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error("Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local")
  process.exit(1)
}

const GDG = "11111111-1111-1111-1111-111111111111"
const CSSD = "22222222-2222-2222-2222-222222222222"
const OK = "33333333-3333-3333-3333-333333333333"

const ALAT = {
  pinset: "00000000-0000-4000-8000-000000000001",
  pouch: "00000000-0000-4000-8000-000000000002",
  gunting: "00000000-0000-4000-8000-000000000004",
  otoscope: "00000000-0000-4000-8000-000000000005",
  klem: "00000000-0000-4000-8000-000000000006",
  kaset: "00000000-0000-4000-8000-000000000008",
  retractor: "00000000-0000-4000-8000-000000000009",
}

let lulus = 0
let gagal = 0

function cek(nama, kondisi, detail = "") {
  if (kondisi) {
    lulus++
    console.log(`  OK    ${nama}`)
  } else {
    gagal++
    console.log(`  GAGAL ${nama}${detail ? ` -> ${detail}` : ""}`)
  }
}

async function masuk(email, password) {
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) {
    console.error(`Tidak dapat login sebagai ${email}: ${error.message}`)
    process.exit(1)
  }
  return client
}

async function stokRingkas(client, alatId) {
  const { data, error } = await client
    .from("v_stok_ringkas")
    .select("*")
    .eq("id", alatId)
    .single()
  if (error) throw new Error(error.message)
  return data
}

const admin = await masuk("admin@rscm.local", "Admin123!")
const inventori = await masuk("inventori@rscm.local", "Inventori123!")
const unit = await masuk("unit@rscm.local", "Unit123!")

console.log("\n[1] Data awal & invarian stok")
{
  const klem = await stokRingkas(admin, ALAT.klem)
  cek("klem total 60 setelah masuk", klem.total_stok === 60, `total=${klem.total_stok}`)
  cek("klem gudang 42 (20 keluar, 2 kembali)", klem.stok_gudang === 42, `gudang=${klem.stok_gudang}`)
  cek("klem di unit medis 18 (selisih 2 dianggap tidak diterima)", klem.stok_unit_medis === 18, `unit=${klem.stok_unit_medis}`)

  const { data: tk } = await admin
    .from("transaksi_keluar")
    .select("id, status")
    .eq("nomor", "TK-2026-0002")
    .single()
  cek("transaksi selisih berstatus perlu_tindak_lanjut", tk?.status === "perlu_tindak_lanjut", tk?.status)

  const { data: konf } = await admin
    .from("konfirmasi_penerimaan")
    .select("jumlah_dikirim, jumlah_diterima, jumlah_selisih")
    .eq("transaksi_keluar_id", tk.id)
    .single()
  cek("selisih dihitung 20 dikirim - 18 diterima = 2", konf?.jumlah_selisih === 2,
    `${konf?.jumlah_dikirim}/${konf?.jumlah_diterima}/${konf?.jumlah_selisih}`)

  const gunting = await stokRingkas(admin, ALAT.gunting)
  cek("alat lulus sterilisasi kembali tersedia", gunting.stok_cssd === 35, `cssd=${gunting.stok_cssd}`)
  cek("alat lulus sterilisasi punya masa simpan", Boolean(gunting.kedaluwarsa_terdekat), gunting.kedaluwarsa_terdekat)
  cek("siklus sterilisasi terhitung", gunting.jumlah_siklus >= 1, `siklus=${gunting.jumlah_siklus}`)

  const { data: kasetStok } = await admin
    .from("stok_unit")
    .select("status")
    .eq("alat_id", ALAT.kaset)
    .eq("unit_id", CSSD)
    .single()
  cek("batch gagal menandai alat perlu resterilisasi", kasetStok?.status === "perlu_resterilisasi", kasetStok?.status)
}

console.log("\n[2] Alur tulis: masuk -> distribusi -> konfirmasi")
{
  const sebelum = await stokRingkas(inventori, ALAT.otoscope)

  const masukRes = await inventori.rpc("api_catat_alat_masuk", {
    p_alat: ALAT.otoscope,
    p_jumlah: 1,
    p_sumber: "Uji otomatis",
  })
  cek("catat alat masuk berhasil", !masukRes.error, masukRes.error?.message)

  const keluarRes = await inventori.rpc("api_catat_distribusi", {
    p_alat: ALAT.otoscope,
    p_unit_tujuan: OK,
    p_jumlah: 1,
  })
  cek("catat distribusi berhasil", !keluarRes.error, keluarRes.error?.message)

  const sesudah = await stokRingkas(inventori, ALAT.otoscope)
  cek("total stok naik 1", sesudah.total_stok === sebelum.total_stok + 1,
    `${sebelum.total_stok} -> ${sesudah.total_stok}`)
  cek("gudang tetap setelah +1 masuk lalu -1 keluar", sesudah.stok_gudang === sebelum.stok_gudang,
    `${sebelum.stok_gudang} -> ${sesudah.stok_gudang}`)

  const transaksiId = keluarRes.data?.id
  if (!transaksiId) {
    cek("konfirmasi penerimaan oleh unit berhasil", false, "distribusi gagal, tidak ada transaksi")
  } else {
    const konfRes = await unit.rpc("api_konfirmasi_penerimaan", {
      p_transaksi: transaksiId,
      p_jumlah_diterima: 1,
      p_kondisi: "baik",
    })
    cek("konfirmasi penerimaan oleh unit berhasil", !konfRes.error, konfRes.error?.message)

    const { data: tk } = await admin
      .from("transaksi_keluar")
      .select("status")
      .eq("id", transaksiId)
      .single()
    cek("status transaksi menjadi diterima", tk?.status === "diterima", tk?.status)
  }
}

console.log("\n[3] Aturan yang menolak")
{
  const kurang = await inventori.rpc("api_catat_distribusi", {
    p_alat: ALAT.pinset,
    p_unit_tujuan: OK,
    p_jumlah: 999999,
  })
  cek("keluar melebihi stok ditolak", Boolean(kurang.error?.message?.includes("STOK_TIDAK_CUKUP")),
    kurang.error?.message)

  const { data: tkPinset } = await admin
    .from("transaksi_keluar")
    .select("id")
    .eq("alat_id", ALAT.pinset)
    .eq("status", "diterima")
    .limit(1)
    .single()

  const dobel = await unit.rpc("api_konfirmasi_penerimaan", {
    p_transaksi: tkPinset.id,
    p_jumlah_diterima: 12,
    p_kondisi: "baik",
  })
  cek("konfirmasi ulang ditolak", Boolean(dobel.error?.message?.includes("SUDAH_DIKONFIRMASI")),
    dobel.error?.message)

  const tanpaKet = await inventori.rpc("api_perbarui_status", {
    p_alat: ALAT.pinset,
    p_unit: GDG,
    p_status: "rusak",
  })
  cek("status rusak tanpa keterangan ditolak", Boolean(tanpaKet.error?.message?.includes("KETERANGAN_WAJIB")),
    tanpaKet.error?.message)

  const denganKet = await inventori.rpc("api_perbarui_status", {
    p_alat: ALAT.pinset,
    p_unit: GDG,
    p_status: "rusak",
    p_keterangan: "Gagang retak saat pengujian",
  })
  cek("status rusak dengan keterangan diterima", !denganKet.error, denganKet.error?.message)

  await inventori.rpc("api_perbarui_status", {
    p_alat: ALAT.pinset,
    p_unit: GDG,
    p_status: "tersedia",
    p_keterangan: "Selesai perbaikan uji",
  })

  const roleSalah = await unit.rpc("api_catat_alat_masuk", { p_alat: ALAT.pinset, p_jumlah: 1 })
  cek("unit medis tidak boleh mencatat alat masuk", Boolean(roleSalah.error?.message?.includes("AKSES_DITOLAK")),
    roleSalah.error?.message)

  const { data: batch } = await admin
    .from("batch_sterilisasi")
    .select("id, tahap")
    .eq("nomor", "BATCH-2026-0003")
    .single()
  const lompat = await admin.rpc("api_majukan_batch", { p_batch: batch.id, p_tahap: "terdistribusi" })
  cek("tahap batch tidak boleh dilompati / sebelum lulus", Boolean(
    lompat.error?.message?.includes("ALUR_BATCH") ||
    lompat.error?.message?.includes("BATCH_BELUM_LULUS")
  ), lompat.error?.message)
}

console.log(`\n${lulus} lulus, ${gagal} gagal`)
process.exit(gagal === 0 ? 0 : 1)
