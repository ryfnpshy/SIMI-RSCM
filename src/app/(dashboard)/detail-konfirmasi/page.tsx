import Link from "next/link"
import { notFound } from "next/navigation"
import { FormKonfirmasi } from "../konfirmasi-penerimaan/FormKonfirmasi"
import { PageHeader } from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { daftarKonfirmasi, detailKeluar } from "@/lib/data"
import { tanggalSingkat } from "@/lib/utils"

export default async function DetailKonfirmasiPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) notFound()

  const transaksi = await detailKeluar(id)
  if (!transaksi) notFound()

  const semuaKonfirmasi = await daftarKonfirmasi(80)
  const konfirmasi = semuaKonfirmasi.find((item) => item.transaksi?.id === id)

  const belumDikonfirmasi = transaksi.status === "menunggu_konfirmasi"

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        judul={`Detail Transaksi ${transaksi.nomor}`}
        deskripsi="Rincian pengiriman alat dan status serah terima di unit penerima."
        remah={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Konfirmasi", href: "/konfirmasi-penerimaan" },
          { label: transaksi.nomor },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Rincian Pengiriman</h2>
          <div className="grid grid-cols-2 gap-3 font-body-md text-body-md">
            <span className="text-on-surface-variant">Kode unik</span>
            <span className="font-label-code font-bold text-primary">{transaksi.alat?.kode_unik}</span>
            <span className="text-on-surface-variant">Nama alat</span>
            <span className="text-on-surface">{transaksi.alat?.nama}</span>
            <span className="text-on-surface-variant">Jumlah dikirim</span>
            <span className="font-label-code font-bold text-on-surface">
              {transaksi.jumlah} {transaksi.alat?.satuan ?? ""}
            </span>
            <span className="text-on-surface-variant">Tanggal</span>
            <span className="text-on-surface">{tanggalSingkat(transaksi.tanggal)}</span>
            <span className="text-on-surface-variant">Unit asal</span>
            <span className="text-on-surface">{transaksi.asal?.nama ?? "—"}</span>
            <span className="text-on-surface-variant">Unit tujuan</span>
            <span className="text-on-surface">{transaksi.tujuan?.nama ?? "—"}</span>
            <span className="text-on-surface-variant">Nomor BAST</span>
            <span className="text-on-surface">{transaksi.nomor_bast ?? "—"}</span>
            <span className="text-on-surface-variant">Petugas pengirim</span>
            <span className="text-on-surface">{transaksi.petugas?.nama ?? "—"}</span>
            <span className="text-on-surface-variant">Status</span>
            <span>
              {belumDikonfirmasi ? (
                <Badge variant="warning">Menunggu Konfirmasi</Badge>
              ) : transaksi.status === "diterima" ? (
                <Badge variant="success">Diterima</Badge>
              ) : (
                <Badge variant="destructive">Perlu Tindak Lanjut</Badge>
              )}
            </span>
          </div>
          <Link
            className="mt-6 inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:underline"
            href="/konfirmasi-penerimaan"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Kembali ke daftar konfirmasi
          </Link>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          {belumDikonfirmasi ? (
            <>
              <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Verifikasi Penerimaan</h2>
              <FormKonfirmasi transaksi={[transaksi]} terpilih={transaksi.id} />
            </>
          ) : (
            <>
              <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Hasil Konfirmasi</h2>
              {konfirmasi ? (
                <div className="grid grid-cols-2 gap-3 font-body-md text-body-md">
                  <span className="text-on-surface-variant">Jumlah dikirim</span>
                  <span className="font-label-code font-bold">{konfirmasi.jumlah_dikirim}</span>
                  <span className="text-on-surface-variant">Jumlah diterima</span>
                  <span className="font-label-code font-bold">{konfirmasi.jumlah_diterima}</span>
                  <span className="text-on-surface-variant">Selisih</span>
                  <span className="font-label-code font-bold">{konfirmasi.jumlah_selisih}</span>
                  <span className="text-on-surface-variant">Kondisi</span>
                  <span className="text-on-surface">{konfirmasi.kondisi === "baik" ? "Baik" : "Rusak"}</span>
                  <span className="text-on-surface-variant">Keterangan</span>
                  <span className="text-on-surface">{konfirmasi.keterangan ?? "—"}</span>
                  <span className="text-on-surface-variant">Dikonfirmasi oleh</span>
                  <span className="text-on-surface">{konfirmasi.petugas?.nama ?? "—"}</span>
                  <span className="text-on-surface-variant">Waktu</span>
                  <span className="text-on-surface">
                    {new Date(konfirmasi.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Transaksi sudah berstatus {transaksi.status.replace(/_/g, " ")} namun tidak ada baris konfirmasi yang
                  ditemukan. Hubungi Admin Inventori.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
