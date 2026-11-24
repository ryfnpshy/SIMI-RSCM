import Link from "next/link"
import { notFound } from "next/navigation"
import { FormPengguna } from "./FormPengguna"
import { PageHeader } from "@/components/ui/PageHeader"
import { aktifkanPengguna } from "@/lib/actions/administrasi"
import { AksiForm } from "@/components/ui/AksiForm"
import { daftarPeran, daftarUnit, penggunaById } from "@/lib/data"
import { LABEL_PERAN } from "@/lib/nav"

export default async function DetailPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; error?: string }>
}) {
  const { id, error } = await searchParams
  if (!id) notFound()

  const [pengguna, unit, peran] = await Promise.all([penggunaById(id), daftarUnit(), daftarPeran()])
  if (!pengguna) notFound()

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Kelola Pengguna"
        deskripsi={`${pengguna.email} • terdaftar sejak ${new Date(pengguna.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}`}
        remah={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Manajemen Pengguna", href: "/manajemen-pengguna" },
          { label: pengguna.nama },
        ]}
        aksi={
          pengguna.status !== "aktif" ? (
            <AksiForm aksi={aktifkanPengguna}>
              <input name="id" type="hidden" value={pengguna.id} />
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-lg text-label-lg text-on-primary shadow-primary transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 hover:bg-primary-container"
                type="submit"
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                Aktifkan Akun
              </button>
            </AksiForm>
          ) : undefined
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
          <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Peran, Unit &amp; Status</h2>
          <FormPengguna pengguna={pengguna} unit={unit} peran={peran} />
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
          <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Ringkasan Akun</h2>
          <div className="grid grid-cols-2 gap-3 font-body-md text-body-md">
            <span className="text-on-surface-variant">Email</span>
            <span className="break-all text-on-surface">{pengguna.email}</span>
            <span className="text-on-surface-variant">Peran saat ini</span>
            <span className="text-on-surface">{LABEL_PERAN[pengguna.role_id as keyof typeof LABEL_PERAN] ?? pengguna.role_id}</span>
            <span className="text-on-surface-variant">Unit</span>
            <span className="text-on-surface">{pengguna.unit?.nama ?? "—"}</span>
            <span className="text-on-surface-variant">Status</span>
            <span className="text-on-surface">{pengguna.status.replace(/_/g, " ")}</span>
          </div>
          <p className="mt-4 rounded-lg bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface-variant">
            Perubahan peran langsung berlaku pada menu sidebar dan kebijakan RLS saat pengguna memuat ulang halaman.
          </p>
          <Link className="mt-4 inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:underline" href="/manajemen-pengguna">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Daftar pengguna
          </Link>
        </section>
      </div>
    </div>
  )
}
