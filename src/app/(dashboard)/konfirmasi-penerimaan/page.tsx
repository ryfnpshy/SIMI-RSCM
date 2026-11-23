"use client"

import { useState } from "react"

type DistributionItem = {
  code: string
  name: string
  origin: string
  originIcon: string
  qty: number
  courier: string
  courierFull: string
  time: string
  manifest: string
  timestamp: string
  batch?: string
  defaultNotes: string
}

const ITEM_DATABASE: DistributionItem[] = [
  {
    code: "ALT-BDH-004",
    name: "Set Bedah Mayor Laparatomi",
    origin: "Gudang Inventori Sentral",
    originIcon: "warehouse",
    qty: 2,
    courier: "Agus Supriyadi",
    courierFull: "Agus Supriyadi, A.Md.Kep",
    time: "Hari ini, 09:38 WIB",
    manifest: "#DIS-20250518-0938",
    timestamp: "18 Mei 2025, 09:38 WIB",
    batch: "#DIS-20250518-0938",
    defaultNotes:
      "Diterima langsung di meja serah terima OK 02. Indikator kimia autoclave hitam pekat, siap pakai.",
  },
  {
    code: "ALT-BDH-045",
    name: "Gunting Jaringan Metzenbaum Curved 18cm",
    origin: "CSSD Sterilisasi",
    originIcon: "sanitizer",
    qty: 5,
    courier: "Dedi Prasetyo",
    courierFull: "Dedi Prasetyo",
    time: "Hari ini, 08:15 WIB",
    manifest: "#DIS-20250518-0815",
    timestamp: "18 Mei 2025, 08:15 WIB",
    defaultNotes:
      "Indikator EO Gas kuning keemasan, kondisi pack steril rapat tanpa robekan.",
  },
  {
    code: "ALT-BDH-077",
    name: "Klem Hemostatik Pean Lurus 14cm",
    origin: "Gudang Inventori Sentral",
    originIcon: "warehouse",
    qty: 10,
    courier: "Ratna Sari",
    courierFull: "Ratna Sari",
    time: "Kemarin, 16:45 WIB",
    manifest: "#DIS-20250517-1645",
    timestamp: "17 Mei 2025, 16:45 WIB",
    defaultNotes:
      "Koleksi instrumen lengkap 10 buah dalam tray pelindung stainless steel.",
  },
]

const DAMAGED_NOTES =
  "[PERINGATAN KERUSAKAN] Ditemukan kemasan tidak steril / robek saat serah terima. Memerlukan evaluasi ulang CSSD."

export default function KonfirmasiPenerimaanPage() {
  const [currentItemKey, setCurrentItemKey] = useState("ALT-BDH-004")
  const [receivedQty, setReceivedQty] = useState("2")
  const [condition, setCondition] = useState<"good" | "damaged">("good")
  const [notes, setNotes] = useState(ITEM_DATABASE[0].defaultNotes)
  const [discrepancyReason, setDiscrepancyReason] = useState("")
  const [search, setSearch] = useState("")

  const selectedItem =
    ITEM_DATABASE.find((item) => item.code === currentItemKey) ?? ITEM_DATABASE[0]

  const receivedValue = parseInt(receivedQty, 10)
  const isDiscrepancy = receivedValue !== selectedItem.qty

  const filteredItems = ITEM_DATABASE.filter((item) =>
    [item.code, item.name, item.courier].some((field) =>
      field.toLowerCase().includes(search.toLowerCase()),
    ),
  )

  const selectDistributionItem = (code: string) => {
    const item = ITEM_DATABASE.find((entry) => entry.code === code)
    if (!item) return
    setCurrentItemKey(code)
    setReceivedQty(String(item.qty))
    setNotes(item.defaultNotes)
  }

  const toggleConditionNotes = (isDamaged: boolean) => {
    setCondition(isDamaged ? "damaged" : "good")
    setNotes(isDamaged ? DAMAGED_NOTES : selectedItem.defaultNotes)
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-outline font-label-md text-label-md">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Konfirmasi Penerimaan</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Konfirmasi Penerimaan Alat</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-badge-sm text-badge-sm uppercase">
              <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
              3 Menunggu Konfirmasi di Unit Anda
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start lg:self-center">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">local_hospital</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-outline leading-none">Unit Bertugas</span>
              <span className="font-label-lg text-label-lg font-bold text-on-surface mt-0.5">Instalasi Bedah Sentral (IBS / OK)</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 items-start">
        <section className="col-span-12 xl:col-span-5 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">inbox</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Distribusi Masuk</h2>
              </div>
              <span className="font-label-md text-label-md px-2 py-0.5 rounded-full bg-surface-container text-outline font-semibold">3 Muatan</span>
            </div>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
              <input
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm"
                placeholder="Cari barcode / nama set / kurir..."
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1" id="distribution-list">
              {filteredItems.map((item) => {
                const isSelected = item.code === currentItemKey
                return (
                  <article
                    key={item.code}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-150 relative ${
                      isSelected
                        ? "bg-surface-container-low shadow-[0_1px_4px_rgba(0,104,95,0.12)]"
                        : "bg-surface-container-lowest hover:bg-surface-container-low shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                    }`}
                    data-item-id={item.code}
                    onClick={() => selectDistributionItem(item.code)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className={`font-label-code text-label-code ${isSelected ? "text-primary font-bold" : "text-outline font-medium"}`}>{item.code}</span>
                        <h3 className={`font-label-lg text-label-lg text-on-surface leading-snug mt-0.5 truncate ${isSelected ? "font-bold" : "font-semibold"}`}>{item.name}</h3>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-badge-sm text-badge-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        Menunggu
                      </span>
                    </div>
                    <div className={`grid grid-cols-2 gap-2 mt-3 pt-3 rounded-lg p-2.5 ${isSelected ? "bg-surface-container/50" : "bg-surface-container-low/40"}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-outline text-[16px]">{item.originIcon}</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-outline uppercase font-semibold leading-none">Asal</span>
                          <span className="font-label-md text-label-md text-on-surface truncate">{item.origin}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={`material-symbols-outlined text-[16px] ${isSelected ? "text-primary" : "text-outline"}`}>inventory_2</span>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-outline uppercase font-semibold leading-none">Jumlah</span>
                          <span className={`font-label-lg text-label-lg font-bold leading-none ${isSelected ? "text-primary" : "text-on-surface"}`}>{item.qty} Unit</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-outline font-label-md text-label-md">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        <span className="truncate max-w-[140px]">{item.courier}</span>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2.5 flex items-center justify-between pt-2">
                        <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md font-bold">
                          <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
                          Aktif Dipilih
                        </span>
                        {item.batch && <span className="font-label-code text-[11px] text-outline">BATCH {item.batch}</span>}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
        <section className="col-span-12 xl:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 bg-surface-container-low/30 -mx-6 -mt-6 px-6 pt-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div>
                  <span className="font-label-code text-label-code uppercase tracking-wider text-outline font-bold">Dokumen Manifest Penerimaan</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold" id="manifest-number">Detail Pengiriman {selectedItem.manifest}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  Distribusi Terjadwal
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md text-outline">Nama Alat Medis</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold mt-1" id="detail-item-name">{selectedItem.name}</span>
                <span className="font-label-code text-label-code text-primary mt-0.5" id="detail-item-code">{selectedItem.code}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md text-outline">Jumlah Pengiriman</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-md text-headline-md text-secondary font-bold leading-none" id="detail-qty-sent">{selectedItem.qty}</span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">Unit Lengkap</span>
                </div>
                <span className="font-badge-sm text-[11px] text-outline mt-1">Sesuai Surat Jalan #SJ-884</span>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md text-outline">Unit Asal Pengirim</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-1" id="detail-origin">{selectedItem.origin}</span>
                <span className="font-label-md text-label-md text-outline mt-0.5">Lantai 1 - Gedung A</span>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md text-outline">Waktu Pengiriman</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-1" id="detail-timestamp">{selectedItem.timestamp}</span>
                <span className="font-label-md text-label-md text-outline mt-0.5">Estimasi tempuh: 8 menit</span>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md text-outline">Petugas Pengirim</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-1" id="detail-courier">{selectedItem.courierFull}</span>
                <span className="font-label-md text-label-md text-outline mt-0.5">NIP: 198504122010121002</span>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md text-outline">Penerima Sasaran</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold mt-1">IBS / Ruang Operasi 02</span>
                <span className="font-label-md text-label-md text-outline mt-0.5">Sterile Core Station</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2">
              <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Formulir Verifikasi Fisik & Serah Terima</h3>
                <p className="font-body-sm text-body-sm text-outline">Pastikan integritas sterilisasi dan kuantitas instrumen sebelum tanda tangan penerimaan.</p>
              </div>
            </div>
            <form className="flex flex-col gap-4" id="confirmation-form" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between" htmlFor="received-qty">
                    <span>Jumlah Diterima Fisik <span className="text-error">*</span></span>
                    <span className="font-label-md text-label-md text-outline">Target: <strong className="text-on-surface" id="expected-qty">{selectedItem.qty}</strong> Unit</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low font-headline-sm text-headline-sm font-bold text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                      id="received-qty"
                      min="0"
                      required
                      type="number"
                      value={receivedQty}
                      onChange={(event) => setReceivedQty(event.target.value)}
                    />
                    <span className="absolute right-3.5 top-3.5 font-label-lg text-label-lg text-outline">Unit</span>
                  </div>
                  <p className={`font-body-sm text-body-sm flex items-center gap-1 mt-0.5 ${isDiscrepancy ? "text-error" : "text-primary"}`} id="qty-feedback">
                    <span className="material-symbols-outlined text-[16px]">{isDiscrepancy ? "error" : "check_circle"}</span>
                    {isDiscrepancy
                      ? `Jumlah fisik (${Number.isNaN(receivedValue) ? 0 : receivedValue}) tidak cocok dengan manifest (${selectedItem.qty}).`
                      : "Jumlah fisik sesuai dengan manifest pengiriman."}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-lg text-label-lg text-on-surface">Kondisi Alat & Indikator Kemasan <span className="text-error">*</span></span>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="cursor-pointer flex items-center justify-between p-3 rounded-lg bg-surface-container-low transition-colors has-[:checked]:bg-primary-container/10 has-[:checked]:text-primary">
                      <div className="flex items-center gap-2.5">
                        <input
                          checked={condition === "good"}
                          className="accent-primary w-4 h-4"
                          name="item-condition"
                          type="radio"
                          value="good"
                          onChange={() => toggleConditionNotes(false)}
                        />
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold">Kondisi Baik / Steril Terjaga</span>
                          <span className="font-body-sm text-body-sm text-outline">Indikator kimia valid, segel utuh, tidak ada deformasi</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                    </label>
                    <label className="cursor-pointer flex items-center justify-between p-3 rounded-lg bg-surface-container-low transition-colors has-[:checked]:bg-error-container/20 has-[:checked]:text-error">
                      <div className="flex items-center gap-2.5">
                        <input
                          checked={condition === "damaged"}
                          className="accent-error w-4 h-4"
                          name="item-condition"
                          type="radio"
                          value="damaged"
                          onChange={() => toggleConditionNotes(true)}
                        />
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold">Kondisi Rusak / Cacat Kemasan</span>
                          <span className="font-body-sm text-body-sm text-outline">Pouch berlubang, indikator pucat, atau instrumen cacat</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className={`p-3.5 rounded-lg bg-error-container/30 flex flex-col gap-1.5 ${isDiscrepancy ? "" : "hidden"}`} id="discrepancy-wrapper">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                  <span className="font-label-lg text-label-lg font-bold">Terdeteksi Selisih Kuantitas</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-error-container">
                  Wajib diisi jika jumlah diterima tidak sama dengan jumlah dikirim. Berikan alasan selisih untuk audit farmasi/CSSD.
                </p>
                <input
                  className="mt-1 w-full px-3 py-2 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none placeholder:text-outline"
                  id="discrepancy-reason"
                  placeholder="Contoh: 1 unit tertinggal di keranjang transit..."
                  type="text"
                  value={discrepancyReason}
                  onChange={(event) => setDiscrepancyReason(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between" htmlFor="inspection-notes">
                  <span>Catatan Pemeriksaan Tambahan</span>
                  <span className="font-body-sm text-body-sm text-outline">Opsional / Rekam Klinis</span>
                </label>
                <textarea
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                  id="inspection-notes"
                  placeholder="Tuliskan catatan verifikasi..."
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span>Penanggung Jawab Penerima: <strong>Ratna Sari, S.Kep</strong> (NIP: 198902142014022001)</span>
                </div>
                <span className="text-outline font-label-code">IP: 192.168.12.44</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
                <button className="w-full sm:w-auto px-5 py-3 rounded-lg bg-surface-container text-error hover:bg-error-container hover:text-on-error-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-colors" type="button">
                  <span className="material-symbols-outlined text-[20px]">report</span>
                  Tolak / Laporkan Masalah
                </button>
                <button className="w-full sm:w-auto px-7 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all" type="submit">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Konfirmasi Penerimaan
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}
