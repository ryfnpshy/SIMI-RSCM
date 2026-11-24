import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/ui/PageHeader"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { labelTahap, URUTAN_TAHAP } from "@/components/ui/StatusBadge"
import { AksiForm } from "@/components/ui/AksiForm"
import { majukanBatch, verifikasiBatch } from "@/lib/actions/sterilisasi"
import { detailBatch } from "@/lib/data"

type LogBaris = {
  id: number
  tahap: string
  jumlah: number
  catatan: string | null
  created_at: string
  alat: { kode_unik: string; nama: string } | null
  petugas: { nama: string } | null
}

export default async function DetailBatchPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; status?: string; error?: string }>
}) {
  const { id, status, error } = await searchParams
  if (!id) notFound()

  const batch = await detailBatch(id)
  if (!batch) notFound()

  const indexTahap = URUTAN_TAHAP.indexOf(batch.tahap as (typeof URUTAN_TAHAP)[number])
  const tahapBerikut = indexTahap >= 0 && indexTahap < URUTAN_TAHAP.length - 1 ? URUTAN_TAHAP[indexTahap + 1] : null
  const selesai = batch.tahap === "terdistribusi" || batch.tahap === "gagal"

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul={`Batch ${batch.nomor}`}
        deskripsi={`Mesin ${batch.mesin} • dibentuk ${new Date(batch.mulai_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}`}
        remah={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Batch Sterilisasi", href: "/batch-sterilisasi" },
          { label: batch.nomor },
        ]}
      />

      {status === "maju" && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Tahap batch berhasil dimajukan.
        </div>
      )}
      {status === "verifikasi" && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 font-body-md text-body-md text-on-surface">
          Hasil verifikasi mutu tersimpan.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {error}
        </div>
      )}

      {/* Stepper */}
      <section className="mb-6 rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
        <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Progres Tahap</h2>
        <div className="flex flex-wrap items-center gap-2">
          {URUTAN_TAHAP.map((tahap, index) => {
            const lewat = indexTahap >= 0 && index < indexTahap
            const aktif = batch.tahap === tahap
            return (
              <span key={tahap} className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-label-md text-label-md ${
                    aktif
                      ? "bg-primary text-on-primary"
                      : lewat
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {lewat ? "check_circle" : aktif ? "radio_button_checked" : "circle"}
                  </span>
                  {labelTahap(tahap)}
                </span>
                {index < URUTAN_TAHAP.length - 1 && <span className="text-outline-variant">›</span>}
              </span>
            )
          })}
          {batch.tahap === "gagal" && <Badge variant="destructive">Gagal Verifikasi — perlu resterilisasi</Badge>}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!selesai && tahapBerikut && (
            <AksiForm aksi={majukanBatch}>
              <input name="batch_id" type="hidden" value={batch.id} />
              <input name="tahap" type="hidden" value={tahapBerikut} />
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-lg text-label-lg text-on-primary shadow-primary transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 hover:bg-primary-container"
                type="submit"
              >
                <span className="material-symbols-outlined text-base">arrow_forward</span>
                Majukan ke {labelTahap(tahapBerikut)}
              </button>
            </AksiForm>
          )}
          {batch.tahap === "gagal" && (
            <AksiForm aksi={majukanBatch}>
              <input name="batch_id" type="hidden" value={batch.id} />
              <input name="tahap" type="hidden" value="pencucian" />
              <button
                className="flex items-center gap-2 rounded-lg bg-tertiary px-5 py-2.5 font-label-lg text-label-lg text-on-tertiary shadow-sm transition-colors hover:opacity-90"
                type="submit"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                Restrerilisasi (kembali ke Pencucian)
              </button>
            </AksiForm>
          )}
          {selesai && batch.tahap === "terdistribusi" && (
            <span className="flex items-center gap-2 font-label-lg text-label-lg text-primary">
              <span className="material-symbols-outlined text-base">task_alt</span>
              Siklus selesai dan alat siap didistribusikan.
            </span>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Verifikasi mutu */}
        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-card ring-1 ring-outline-variant/50">
          <h2 className="mb-1 font-headline-sm text-headline-sm text-on-surface">Verifikasi Mutu</h2>
          <p className="mb-4 font-body-sm text-body-sm text-on-surface-variant">
            Indikator Bowie-Dick dan uji biologis. Gagal salah satu berarti batch tidak lulus.
          </p>
          <div className="mb-4 flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Status sekarang:</span>
            {batch.hasil_verifikasi === "lulus" ? (
              <Badge variant="success">Lulus</Badge>
            ) : batch.hasil_verifikasi === "gagal" ? (
              <Badge variant="destructive">Gagal</Badge>
            ) : (
              <Badge variant="default">Belum diuji</Badge>
            )}
          </div>
          <AksiForm className="flex flex-col gap-3" aksi={verifikasiBatch}>
            <input name="batch_id" type="hidden" value={batch.id} />
            <label className="flex flex-col gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface">Indikator Bowie-Dick</span>
              <select
                className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue={batch.indikator_bowie_dick ? "true" : "false"}
                name="bowie"
              >
                <option value="true">Lulus</option>
                <option value="false">Tidak Lulus</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface">Uji Biologis (Spore Test)</span>
              <select
                className="w-full appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue={batch.indikator_biologis ? "true" : "false"}
                name="biologis"
              >
                <option value="true">Lulus</option>
                <option value="false">Tidak Lulus</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface">Catatan</span>
              <input
                className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface shadow-xs ring-1 ring-inset ring-outline-variant/50 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue={batch.catatan ?? ""}
                name="catatan"
                placeholder="opsional"
              />
            </label>
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-lg text-label-lg text-on-primary shadow-primary transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 hover:bg-primary-container"
              type="submit"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              Simpan Hasil Verifikasi
            </button>
          </AksiForm>
        </section>

        {/* Log tahap */}
        <section className="xl:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card ring-1 ring-outline-variant/50">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Jejak Tahap &amp; Instrumen</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{batch.log?.length ?? 0} catatan pada batch ini</p>
          </div>
          <Table<LogBaris>
            columns={[
              {
                header: "Waktu",
                accessor: (row) => new Date(row.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
              },
              { header: "Tahap", accessor: (row) => labelTahap(row.tahap) },
              {
                header: "Kode Unik",
                accessor: (row) => (
                  <span className="font-label-code text-label-code font-bold text-primary">{row.alat?.kode_unik ?? "(batch)"}</span>
                ),
              },
              { header: "Nama Alat", accessor: (row) => row.alat?.nama ?? "—" },
              { header: "Petugas", accessor: (row) => row.petugas?.nama ?? "—" },
              { header: "Catatan", accessor: (row) => row.catatan ?? "—" },
            ]}
            data={(batch.log ?? []) as LogBaris[]}
            keyAccessor="id"
            emptyMessage="Belum ada catatan tahap."
          />
          <Link className="font-label-lg text-label-lg text-primary hover:underline" href="/batch-sterilisasi">
            ← Kembali ke daftar batch
          </Link>
        </section>
      </div>
    </div>
  )
}
