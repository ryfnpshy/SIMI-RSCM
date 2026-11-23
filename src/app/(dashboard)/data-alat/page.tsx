import { DataAlatView } from "./DataAlatView"
import { daftarAlat } from "@/lib/data"

export default async function DataAlatPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>
}) {
  const { status, error } = await searchParams
  const rows = await daftarAlat()

  return (
    <div className="flex flex-col gap-4">
      {status === "tersimpan" && (
        <div className="rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Data alat berhasil disimpan.
        </div>
      )}
      {status === "diperbarui" && (
        <div className="rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Status alat berhasil diperbarui.
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {error}
        </div>
      )}
      <DataAlatView rows={rows} />
    </div>
  )
}
