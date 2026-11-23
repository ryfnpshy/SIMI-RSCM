// Uji matriks rute->peran (src/lib/akses.ts) tanpa framework.
//   node scripts/akses-check.mjs
// Node 23+ menjalankan impor .ts lewat type stripping bawaan.
import assert from "node:assert/strict"
import { peranUntukRute } from "../src/lib/akses.ts"

const A = "admin_inventori"
const I = "petugas_inventori"
const U = "petugas_unit_medis"
const S = "petugas_sterilisasi"
const SEMUA = [A, I, U, S]

const HARUS = [
  ["/dashboard", SEMUA],
  ["/data-alat", SEMUA],
  ["/data-alat/tambah", SEMUA],
  ["/alat-masuk", [A, I]],
  ["/alat-keluar", [A, I]],
  ["/status-alat", SEMUA],
  ["/riwayat-pergerakan", SEMUA],
  ["/batch-sterilisasi", [A, S]],
  ["/detail-batch", [A, S]],
  ["/konfirmasi-penerimaan", [A, U]],
  ["/detail-konfirmasi", [A, U]],
  ["/daftar-laporan", [A, I, S]],
  ["/detail-laporan", [A, I, S]],
  ["/manajemen-pengguna", [A]],
  ["/detail-pengguna", [A]],
  ["/pengaturan", SEMUA],
  ["/notifikasi", SEMUA],
  ["/profil", SEMUA],
]

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

console.log("\n[1] Rute terdaftar -> peran sesuai matriks")
for (const [rute, roles] of HARUS) {
  const dapat = peranUntukRute(rute)
  const sama =
    dapat !== null && dapat.length === roles.length && roles.every((r) => dapat.includes(r))
  cek(rute, sama, dapat ? dapat.join(",") : "null")
}

console.log("\n[2] Prefix anak rute mewarisi peran induk")
cek("/detail-batch?id=x".startsWith("/detail-batch"), true)
{
  const dapat = peranUntukRute("/data-alat/tambah/apa-pun")
  cek("/data-alat/tambah/apa-pun -> semua peran", dapat?.length === SEMUA.length, String(dapat))
}

console.log("\n[3] Rute tak diatur -> null (tidak dibatasi)")
for (const rute of ["/", "/login", "/daftar", "/halaman-lain"]) {
  const dapat = peranUntukRute(rute)
  cek(`${rute} -> null`, dapat === null, String(dapat))
}

console.log("\n[4] Invarian anti-loop: halaman publik harus terbuka untuk semua peran")
for (const rute of ["/login", "/daftar"]) {
  cek(`${rute} tidak dibatasi peran`, peranUntukRute(rute) === null)
}
assert.ok(peranUntukRute("/dashboard")?.length === 4, "/dashboard harus boleh semua peran")

console.log(`\n${lulus} lulus, ${gagal} gagal`)
process.exit(gagal === 0 ? 0 : 1)
