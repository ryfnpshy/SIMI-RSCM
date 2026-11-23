import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { peranUntukRute, type Peran } from "@/lib/akses"

const HALAMAN_PUBLIK = ["/login", "/daftar"]

/**
 * Proxy (dulu middleware) dipakai untuk tiga hal: menyegarkan cookie sesi
 * Supabase, menjaga halaman dashboard hanya dibuka pengguna login yang aktif,
 * dan menegakkan matriks peran per rute (lihat src/lib/akses.ts).
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next()

  let respons = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (daftar) => {
        daftar.forEach(({ name, value }) => request.cookies.set(name, value))
        respons = NextResponse.next({ request })
        daftar.forEach(({ name, value, options }) => respons.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const publik = HALAMAN_PUBLIK.includes(pathname)

  function pindah(ke: string) {
    const tujuan = NextResponse.redirect(new URL(ke, request.url))
    respons.cookies.getAll().forEach((cookie) => tujuan.cookies.set(cookie))
    return tujuan
  }

  // Sesi yang ada tetapi profil belum aktif diperlakukan seperti belum masuk,
  // agar halaman publik tetap bisa dibuka dan tidak terjadi lingkar pengalihan.
  let peran: Peran | null = null
  if (user) {
    const { data } = await supabase.from("users").select("role_id, status").eq("id", user.id).maybeSingle()
    if (data?.status === "aktif") {
      peran = data.role_id as Peran
    } else {
      return publik ? respons : pindah(`/login?alasan=${data ? "belum-aktif" : "tanpa-profil"}`)
    }
  }

  if (!peran && !publik) return pindah("/login")
  if (peran && publik) return pindah("/dashboard")

  if (peran) {
    const boleh = peranUntukRute(pathname)
    if (boleh && !boleh.includes(peran)) return pindah("/dashboard?alasan=akses-ditolak")
  }

  return respons
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}