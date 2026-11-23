"use client"

export default function DetailBatchPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Top Page Header & Breadcrumb */}
      <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <a className="hover:text-primary transition-colors" href="#">Sterilisasi CSSD</a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Detail Batch</span>
          </nav>
          <div className="flex items-center gap-2 pt-1">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Batch CSSD-20261105-001</h1>
            <span className="font-label-code text-label-code bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">AUTOCLAVE-01</span>
          </div>
        </div>
        {/* Actions & Badges */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="font-badge-sm text-badge-sm uppercase tracking-wide font-bold text-secondary">Dalam Proses (Tahap 5)</span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-label-md text-label-md rounded-lg shadow-sm transition-all" onClick={() => window.print()} type="button">
            <span className="material-symbols-outlined text-[18px] text-primary">print</span>
            <span>Cetak Label Batch</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6 pb-8">
        {/* CARD 1: Informasi Batch */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">inventory_2</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Informasi Batch</h2>
            </div>
            <span className="font-badge-sm text-badge-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">RFID Linked</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 pt-1">
            <div className="flex flex-col p-2 bg-surface-container-low rounded-lg">
              <span className="font-label-md text-label-md text-on-surface-variant">Kode Batch CSSD</span>
              <span className="font-label-code text-body-lg text-primary font-bold tracking-tight">CSSD-20261105-001</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-container-low rounded-lg">
              <span className="font-label-md text-label-md text-on-surface-variant">Waktu Mulai Penerimaan</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold">05 Nov 2026, 08:15 WIB</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-container-low rounded-lg">
              <span className="font-label-md text-label-md text-on-surface-variant">Unit Asal</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold truncate" title="Instalasi Bedah Sentral (IBS / OK) — Kamar Bedah 02">
                IBS / OK — Kamar Bedah 02
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-container-low rounded-lg">
              <span className="font-label-md text-label-md text-on-surface-variant">Muatan Instrumen</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span>
                24 Unit Instrumen Bedah Mayor
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-container-low rounded-lg">
              <span className="font-label-md text-label-md text-on-surface-variant">Penanggung Jawab Sterilisasi</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">badge</span>
                Dedi Prasetyo, A.Md.Kes
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-container-low rounded-lg">
              <span className="font-label-md text-label-md text-on-surface-variant">Status Siklus CSSD</span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-body-md text-body-md text-primary font-bold">Tahap 5: Sterilization (Steam)</span>
              </div>
            </div>
          </div>
        </section>
        {/* CARD 2: Progress Tahapan Sterilisasi (HORIZONTAL STEPPER) */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">timeline</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Progress Tahapan Sterilisasi</h2>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
              <span>Est. Siklus: <strong>11:30 WIB</strong></span>
            </div>
          </div>
          {/* Horizontal Visual Stepper Container */}
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="min-w-[760px] flex items-center justify-between relative px-4">
              {/* Step 1: Penerimaan Kotor */}
              <div className="flex flex-col items-center text-center relative z-10 w-28 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm mb-2">
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">Penerimaan Kotor</span>
                <span className="font-label-code text-body-sm text-on-surface-variant font-medium mt-0.5">08:15 WIB</span>
              </div>
              {/* Line 1 to 2 (Solid Teal/Green) */}
              <div className="flex-1 h-1 bg-primary rounded-full mx-1"></div>
              {/* Step 2: Cleaning */}
              <div className="flex flex-col items-center text-center relative z-10 w-28 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm mb-2">
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">Cleaning / Cuci</span>
                <span className="font-label-code text-body-sm text-on-surface-variant font-medium mt-0.5">09:00 WIB</span>
              </div>
              {/* Line 2 to 3 (Solid Teal/Green) */}
              <div className="flex-1 h-1 bg-primary rounded-full mx-1"></div>
              {/* Step 3: Disinfection */}
              <div className="flex flex-col items-center text-center relative z-10 w-28 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm mb-2">
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">Disinfection</span>
                <span className="font-label-code text-body-sm text-on-surface-variant font-medium mt-0.5">09:45 WIB</span>
              </div>
              {/* Line 3 to 4 (Solid Teal/Green) */}
              <div className="flex-1 h-1 bg-primary rounded-full mx-1"></div>
              {/* Step 4: Packing */}
              <div className="flex flex-col items-center text-center relative z-10 w-28 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm mb-2">
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">Packing / Kemas</span>
                <span className="font-label-code text-body-sm text-on-surface-variant font-medium mt-0.5">10:30 WIB</span>
              </div>
              {/* Line 4 to 5 (Gradient/Solid Active) */}
              <div className="flex-1 h-1 bg-primary rounded-full mx-1"></div>
              {/* Step 5: Sterilization (ACTIVE) */}
              <div className="flex flex-col items-center text-center relative z-10 w-32 group">
                <div className="relative w-10 h-10 flex items-center justify-center mb-2">
                  <span className="absolute inset-0 rounded-full bg-primary-fixed animate-ping opacity-75"></span>
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md relative z-10">
                    <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                  </div>
                </div>
                <span className="font-label-md text-label-md font-bold text-primary">Sterilization</span>
                <span className="font-label-code text-body-sm text-primary font-semibold mt-0.5 px-2 py-0.5 bg-primary-fixed/30 rounded-full">Berlangsung</span>
              </div>
              {/* Line 5 to 6 (Dashed Gray) */}
              <div className="flex-1 h-0.5 bg-outline-variant/60 border-t-2 border-dashed border-outline-variant mx-1"></div>
              {/* Step 6: Distribusi (PENDING) */}
              <div className="flex flex-col items-center text-center relative z-10 w-28 group opacity-60">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-2 shadow-inner">
                  <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                </div>
                <span className="font-label-md text-label-md font-medium text-on-surface-variant">Distribusi</span>
                <span className="font-label-code text-body-sm text-on-surface-variant font-normal mt-0.5">Menunggu</span>
              </div>
            </div>
          </div>
        </section>
        {/* CARD 3: Input Tahap Berikutnya / Selesaikan Tahap Aktif */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">fact_check</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Input Tahap Berikutnya / Selesaikan Tahap Aktif</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Validasi parameter mesin dan konfirmasi rilis batch instrumen</p>
              </div>
            </div>
            <span className="font-badge-sm text-badge-sm px-2.5 py-1 bg-surface-container-high text-on-secondary-container font-semibold rounded">
              Siklus Autoclave Uap #01
            </span>
          </div>
          <form className="space-y-4 pt-1" onSubmit={(event) => event.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Field 1: Tahap Saat Ini */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">Tahap Saat Ini</label>
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface font-semibold text-body-md">
                  <span className="material-symbols-outlined text-primary text-[20px]">sanitizer</span>
                  <span className="truncate">Tahap 5: Sterilization (Autoclave)</span>
                </div>
              </div>
              {/* Field 2: Waktu Mulai */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="waktu-mulai">Waktu Mulai Siklus</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">schedule</span>
                  <input className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-code text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all" id="waktu-mulai" readOnly type="text" defaultValue="05/11/2026, 10:30 WIB" />
                </div>
              </div>
              {/* Field 3: Waktu Selesai */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="waktu-selesai">Estimasi / Waktu Selesai</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">update</span>
                  <input className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-code text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all" id="waktu-selesai" type="text" defaultValue="05/11/2026, 11:30 WIB" />
                </div>
              </div>
              {/* Field 4: Suhu / Parameter Mesin */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="parameter-mesin">Suhu & Parameter Mesin</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">thermostat</span>
                  <input className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none transition-all" id="parameter-mesin" type="text" defaultValue="134°C, 4 menit (Autoclave Mesin 01 - Siklus Bowie-Dick OK)" />
                </div>
              </div>
              {/* Field 5: Operator / Petugas */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="operator-select">Operator / Petugas Sterilisasi</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">person</span>
                  <select className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none appearance-none transition-all" id="operator-select" defaultValue="Dedi Prasetyo, A.Md.Kes">
                    <option>Dedi Prasetyo, A.Md.Kes</option>
                    <option>Agus Supriyadi</option>
                    <option>Siti Nurhaliza</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
                </div>
              </div>
              {/* Field Indicators Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">Uji Indikator Kimia / Biologis</label>
                <div className="flex items-center gap-3 py-2.5 px-3 bg-surface-container-low rounded-lg">
                  <span className="font-badge-sm text-badge-sm px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">CLASS 5 PASS</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">Strip Reaktif Berubah Gelap</span>
                </div>
              </div>
            </div>
            {/* Field 6: Catatan Klinis / Indikator */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="catatan-klinis">Catatan Klinis / Indikator Sterilisasi</label>
              <textarea className="w-full p-3 rounded-lg bg-surface-container text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none transition-all" id="catatan-klinis" rows={2} defaultValue="Indikator kimia Class 5 di dalam pouch berubah hitam merata, indikator biologis terpasang." />
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-error-container text-on-error-container hover:bg-error hover:text-on-error rounded-lg font-label-lg text-label-lg transition-colors shadow-sm" type="button">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>Tandai Gagal / Ulang Proses</span>
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-lg text-label-lg shadow-sm transition-all" type="submit">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Selesaikan Tahap & Lanjut Distribusi</span>
              </button>
            </div>
          </form>
        </section>
        {/* CARD 4: Log Tahapan yang Telah Dilalui */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">history</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Log Tahapan yang Telah Dilalui</h2>
            </div>
            <span className="font-badge-sm text-badge-sm text-on-surface-variant">4 Dari 6 Tahapan Selesai</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                  <th className="py-3 px-4 rounded-l-lg">Tahap</th>
                  <th className="py-3 px-4">Waktu Mulai</th>
                  <th className="py-3 px-4">Waktu Selesai</th>
                  <th className="py-3 px-4">Durasi</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4 rounded-r-lg">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent font-body-md text-body-md text-on-surface">
                {/* Row 1: Penerimaan Kotor */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                      Penerimaan Kotor
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">08:15 WIB</td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">08:45 WIB</td>
                  <td className="py-3.5 px-4 font-semibold">30 menit</td>
                  <td className="py-3.5 px-4">Dedi Prasetyo</td>
                  <td className="py-3.5 px-4 text-on-surface-variant text-body-sm">Serah terima dari perawat IBS lengkap 24 instrumen</td>
                </tr>
                {/* Row 2: Cleaning */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      Cleaning / Cuci
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">08:45 WIB</td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">09:30 WIB</td>
                  <td className="py-3.5 px-4 font-semibold">45 menit</td>
                  <td className="py-3.5 px-4">Hendri Irawan</td>
                  <td className="py-3.5 px-4 text-on-surface-variant text-body-sm">Pembersihan enzimatik & ultrasonic bath</td>
                </tr>
                {/* Row 3: Disinfection */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed-dim/40 text-on-tertiary-fixed-variant font-label-md text-label-md font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                      Disinfection
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">09:30 WIB</td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">10:15 WIB</td>
                  <td className="py-3.5 px-4 font-semibold">45 menit</td>
                  <td className="py-3.5 px-4">Hendri Irawan</td>
                  <td className="py-3.5 px-4 text-on-surface-variant text-body-sm">Disinfeksi thermal washer disinfector 90°C</td>
                </tr>
                {/* Row 4: Packing */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Packing / Kemas
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">10:15 WIB</td>
                  <td className="py-3.5 px-4 font-label-code text-body-sm text-on-surface-variant">10:45 WIB</td>
                  <td className="py-3.5 px-4 font-semibold">30 menit</td>
                  <td className="py-3.5 px-4">Siti Nurhaliza</td>
                  <td className="py-3.5 px-4 text-on-surface-variant text-body-sm">Double pouching medical grade paper + chemical indicator strip</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* CARD 5: Daftar Alat dalam Batch */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">format_list_bulleted</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Daftar Alat dalam Batch</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-badge-sm text-badge-sm bg-surface-container px-2.5 py-1 rounded font-semibold text-on-surface-variant">
                5 dari 24 item ditampilkan
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                  <th className="py-3 px-4 rounded-l-lg w-48">Kode Alat</th>
                  <th className="py-3 px-4">Nama Alat / Instrumen Medis</th>
                  <th className="py-3 px-4 rounded-r-lg w-48 text-right">Status Instrumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent font-body-md text-body-md text-on-surface">
                {/* Item 1 */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-label-code text-label-code text-primary font-bold">ALT-BDH-004</td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">medical_services</span>
                    Set Bedah Mayor Laparatomi
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-badge-sm text-badge-sm uppercase font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Siap Steril
                    </span>
                  </td>
                </tr>
                {/* Item 2 */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-label-code text-label-code text-primary font-bold">ALT-BDH-045</td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">content_cut</span>
                    Gunting Jaringan Metzenbaum Curved
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-badge-sm text-badge-sm uppercase font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Siap Steril
                    </span>
                  </td>
                </tr>
                {/* Item 3 */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-label-code text-label-code text-primary font-bold">ALT-BDH-077</td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">handyman</span>
                    Klem Hemostatik Pean Lurus 14cm
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-badge-sm text-badge-sm uppercase font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Siap Steril
                    </span>
                  </td>
                </tr>
                {/* Item 4 */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-label-code text-label-code text-primary font-bold">ALT-BDH-019</td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">pin</span>
                    Needle Holder Mayo-Hegar 16cm
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-badge-sm text-badge-sm uppercase font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Siap Steril
                    </span>
                  </td>
                </tr>
                {/* Item 5 */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-label-code text-label-code text-primary font-bold">ALT-BDH-091</td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">straighten</span>
                    Retractor Langenbeck Set
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-badge-sm text-badge-sm uppercase font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Siap Steril
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-2 flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
            <span>Menampilkan 5 dari 24 item dalam baki instrumen</span>
            <button className="text-primary hover:text-primary-container font-label-md text-label-md font-semibold inline-flex items-center gap-1" type="button">
              <span>Lihat Semua 24 Instrumen</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
