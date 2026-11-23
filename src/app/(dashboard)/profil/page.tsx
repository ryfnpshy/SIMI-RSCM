import { FormProfil } from "./FormProfil"
import { PageHeader } from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { requireProfil } from "@/lib/auth"
import { LABEL_PERAN } from "@/lib/nav"

export default async function ProfilPage() {
  const profil = await requireProfil()

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Profil Saya"
        deskripsi="Data akun yang sedang aktif pada sesi ini."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Pengaturan", href: "/profil" }, { label: "Profil" }]}
      />

      <section className="mb-6 flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-headline-sm text-headline-sm text-primary">
            {profil.nama
              .split(/\s+/)
              .slice(0, 2)
              .map((bagian) => bagian[0]?.toUpperCase())
              .join("")}
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">{profil.nama}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{profil.email}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">{LABEL_PERAN[profil.role_id]}</Badge>
          <Badge variant="default">{profil.unit?.nama ?? "Tanpa unit"}</Badge>
          <Badge variant={profil.status === "aktif" ? "success" : "warning"}>{profil.status.replace(/_/g, " ")}</Badge>
        </div>
      </section>

      <FormProfil profil={profil} />
    </div>
  )
}
