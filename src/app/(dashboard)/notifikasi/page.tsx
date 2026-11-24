import { PageHeader } from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { daftarNotifikasi, type BarisNotifikasi } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

const JENIS: Record<BarisNotifikasi["jenis"], { label: string; ikon: string }> = {
  kedaluwarsa: { label: "Masa Simpan Steril", ikon: "schedule" },
  stok_minimum: { label: "Stok di Bawah Minimum", ikon: "trending_down" },
  konfirmasi_tertunda: { label: "Konfirmasi Tertunda", ikon: "pending_actions" },
  batch_gagal: { label: "Batch Gagal Verifikasi", ikon: "error" },
}

const PRIORITAS: Record<BarisNotifikasi["prioritas"], "destructive" | "warning" | "default"> = {
  tinggi: "destructive",
  sedang: "warning",
  rendah: "default",
}

export default async function NotifikasiPage() {
  const notifikasi = await daftarNotifikasi()
  const tinggi = notifikasi.filter((item) => item.prioritas === "tinggi").length

  const grup = Object.keys(JENIS) as BarisNotifikasi["jenis"][]

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul="Notifikasi & Peringatan"
        deskripsi="Peringatan otomatis dari aturan inventori: masa simpan steril, stok minimum, konfirmasi tertunda, dan batch gagal."
        remah={[{ label: "Dashboard", href: "/dashboard" }, { label: "Pengaturan", href: "/notifikasi" }, { label: "Notifikasi" }]}
        aksi={
          <span className="flex items-center gap-2 rounded-full bg-error-container px-4 py-2 font-label-lg text-label-lg text-on-error-container">
            <span className="material-symbols-outlined text-base">priority_high</span>
            {tinggi} prioritas tinggi
          </span>
        }
      />

      {notifikasi.length === 0 && (
        <div className="rounded-xl bg-surface-container-lowest p-8 text-center shadow-card ring-1 ring-outline-variant/50">
          <span className="material-symbols-outlined text-4xl text-primary">verified</span>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Tidak ada peringatan aktif. Semua stok di atas minimum dan tidak ada alat mendekati kedaluwarsa steril.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {grup.map((jenis) => {
          const items = notifikasi.filter((item) => item.jenis === jenis)
          if (items.length === 0) return null
          return (
            <section key={jenis} className="rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-xl">{JENIS[jenis].ikon}</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{JENIS[jenis].label}</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{items.length} peringatan</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <div
                    key={`${jenis}-${index}`}
                    className="flex flex-col gap-2 rounded-lg bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        {item.kode_unik && (
                          <span className="font-label-code text-label-code font-bold text-primary">{item.kode_unik}</span>
                        )}
                        <span className="font-body-md text-body-md text-on-surface">{item.nama ?? "—"}</span>
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{item.pesan}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.tanggal && (
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{tanggalSingkat(item.tanggal)}</span>
                      )}
                      <Badge variant={PRIORITAS[item.prioritas]}>{item.prioritas}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
