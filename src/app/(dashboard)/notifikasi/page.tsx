"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Bell, Search, Filter, Download, Calendar, Eye, Trash2, CheckCircle, AlertTriangle, Info, BellRing, BellOff, Check, X } from "lucide-react"
import Link from "next/link"

const notificationsData = [
  { id: "1", date: "2024-01-15", time: "08:30", type: "LOW_STOCK", title: "Stok Rendah: Sering Infus 50ml", message: "Stok tersisa 12 unit (threshold: 50). Segera lakukan pengadaan.", priority: "high", read: false, module: "Data Alat", actionUrl: "/data-alat" },
  { id: "2", date: "2024-01-15", time: "08:15", type: "MAINTENANCE_DUE", title: "Perawatan Jatuh Tempo: ECG Machine", message: "ECG Machine ECG-200 perlu kalibrasi Q1 2024. Jadwal: 2024-01-20.", priority: "high", read: false, module: "Status Alat", actionUrl: "/status-alat" },
  { id: "3", date: "2024-01-15", time: "07:45", type: "RECEIVING_PENDING", title: "Verifikasi Penerimaan: TERIMA-003", message: "Barang dari PT Sumber Sehat menunggu verifikasi jumlah (8 item).", priority: "medium", read: true, module: "Konfirmasi Penerimaan", actionUrl: "/konfirmasi-penerimaan/3" },
  { id: "4", date: "2024-01-14", time: "16:30", type: "REPORT_READY", title: "Laporan Siap: RPT-001", message: "Laporan Bulanan Inventori Januari 2024 telah selesai digenerate.", priority: "low", read: true, module: "Daftar Laporan", actionUrl: "/detail-laporan/1" },
  { id: "5", date: "2024-01-14", time: "14:00", type: "TRANSFER_COMPLETE", title: "Transfer Selesai: TRF-2024-001", message: "500 unit alat dari Gudang Pusat telah diterima & diverifikasi.", priority: "low", read: true, module: "Alat Masuk", actionUrl: "/alat-masuk" },
  { id: "6", date: "2024-01-14", time: "10:15", type: "BATCH_COMPLETE", title: "Batch Sterilisasi Selesai: BATCH-002", message: "150 item (Katet Foley & Masker O2) telah selesai disterisasi.", priority: "medium", read: true, module: "Batch Sterilisasi", actionUrl: "/batch-sterilisasi/2" },
  { id: "7", date: "2024-01-13", time: "15:30", type: "BATCH_FAILED", title: "Batch Sterilisasi Gagal: BATCH-006", message: "200 unit Sering Infus 50ml gagal sterilisasi. Tekanan turun di menit ke-3.", priority: "high", read: true, module: "Batch Sterilisasi", actionUrl: "/batch-sterilisasi/6" },
  { id: "8", date: "2024-01-13", time: "09:00", type: "MAINTENANCE_DUE", title: "Perawatan Jatuh Tempo: Ultrasound US-800", message: "Ultrasound US-800 perlu perawatan rutin. Overdue sejak 2024-01-10.", priority: "high", read: false, module: "Status Alat", actionUrl: "/status-alat" },
  { id: "9", date: "2024-01-12", time: "13:30", type: "RETURN_RECEIVED", title: "Retur Diterima: RTN-2024-001", message: "2 unit Infus Pump IP-200 cacat (Error E-03) diterima retur ke supplier.", priority: "medium", read: true, module: "Konfirmasi Penerimaan", actionUrl: "/konfirmasi-penerimaan/7" },
  { id: "10", date: "2024-01-12", time: "08:00", type: "SYSTEM_BACKUP", title: "Backup Otomatis Berhasil", message: "Backup database harian selesai pada 2024-01-12 02:00. Ukuran: 245 MB.", priority: "low", read: true, module: "Sistem", actionUrl: "/pengaturan" },
  { id: "11", date: "2024-01-11", time: "17:45", type: "LOW_STOCK", title: "Stok Kritis: Katet Foley 16Fr", message: "Stok tersisa 8 unit (threshold: 30). Status KRITIS - butuh restock segera.", priority: "high", read: true, module: "Data Alat", actionUrl: "/data-alat" },
  { id: "12", date: "2024-01-11", time: "12:00", type: "RECEIVING_PENDING", title: "Barang Datang: PO-2024-004", message: "Pengiriman dari PT Medika Sejahtera telah tiba di gudang. Menunggu verifikasi.", priority: "medium", read: true, module: "Alat Masuk", actionUrl: "/alat-masuk" },
]

const typeOptions = [
  { value: "", label: "Semua Jenis" },
  { value: "LOW_STOCK", label: "Stok Rendah" },
  { value: "MAINTENANCE_DUE", label: "Perawatan Jatuh Tempo" },
  { value: "RECEIVING_PENDING", label: "Verifikasi Penerimaan" },
  { value: "REPORT_READY", label: "Laporan Siap" },
  { value: "TRANSFER_COMPLETE", label: "Transfer Selesai" },
  { value: "BATCH_COMPLETE", label: "Sterilisasi Selesai" },
  { value: "BATCH_FAILED", label: "Sterilisasi Gagal" },
  { value: "RETURN_RECEIVED", label: "Retur Diterima" },
  { value: "SYSTEM_BACKUP", label: "Backup Sistem" },
]

const priorityOptions = [
  { value: "", label: "Semua Prioritas" },
  { value: "high", label: "Tinggi" },
  { value: "medium", label: "Sedang" },
  { value: "low", label: "Rendah" },
]

const statusOptions = [
  { value: "", label: "Semua" },
  { value: "unread", label: "Belum Dibaca" },
  { value: "read", label: "Sudah Dibaca" },
]

function TypeBadge({ type }: { type: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    LOW_STOCK: "destructive",
    MAINTENANCE_DUE: "warning",
    RECEIVING_PENDING: "info",
    REPORT_READY: "success",
    TRANSFER_COMPLETE: "info",
    BATCH_COMPLETE: "success",
    BATCH_FAILED: "destructive",
    RETURN_RECEIVED: "warning",
    SYSTEM_BACKUP: "secondary",
  }
  const labels: Record<string, string> = {
    LOW_STOCK: "Stok Rendah",
    MAINTENANCE_DUE: "Perawatan",
    RECEIVING_PENDING: "Verifikasi",
    REPORT_READY: "Laporan",
    TRANSFER_COMPLETE: "Transfer",
    BATCH_COMPLETE: "Sterilisasi",
    BATCH_FAILED: "Gagal",
    RETURN_RECEIVED: "Retur",
    SYSTEM_BACKUP: "Sistem",
  }
  return <Badge variant={variants[type] || "default"} size="sm">{labels[type] || type}</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    high: "destructive",
    medium: "warning",
    low: "success",
  }
  const labels: Record<string, string> = {
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",
  }
  const icons: Record<string, React.ReactNode> = {
    high: <AlertTriangle className="h-3 w-3" />,
    medium: <Info className="h-3 w-3" />,
    low: <CheckCircle className="h-3 w-3" />,
  }
  return (
    <Badge variant={variants[priority] || "secondary"} className="gap-1">
      {icons[priority]}
      {labels[priority] || priority}
    </Badge>
  )
}

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    LOW_STOCK: <AlertTriangle className="h-5 w-5 text-error" />,
    MAINTENANCE_DUE: <AlertTriangle className="h-5 w-5 text-tertiary" />,
    RECEIVING_PENDING: <Bell className="h-5 w-5 text-secondary" />,
    REPORT_READY: <CheckCircle className="h-5 w-5 text-primary" />,
    TRANSFER_COMPLETE: <CheckCircle className="h-5 w-5 text-secondary" />,
    BATCH_COMPLETE: <CheckCircle className="h-5 w-5 text-primary" />,
    BATCH_FAILED: <X className="h-5 w-5 text-error" />,
    RETURN_RECEIVED: <Bell className="h-5 w-5 text-tertiary" />,
    SYSTEM_BACKUP: <Info className="h-5 w-5 text-on-surface-variant" />,
  }
  return icons[type] || <Bell className="h-5 w-5 text-on-surface-variant" />
}

export default function NotifikasiPage() {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [priority, setPriority] = useState("")
  const [status, setStatus] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filteredData = notificationsData
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase())
      const matchesType = !type || item.type === type
      const matchesPriority = !priority || item.priority === priority
      const matchesStatus = !status || (status === "unread" ? !item.read : item.read)
      const matchesDateFrom = !dateFrom || item.date >= dateFrom
      const matchesDateTo = !dateTo || item.date <= dateTo
      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesDateFrom && matchesDateTo
    })
    .sort((a, b) => {
      // Unread first, then by date/time
      if (a.read !== b.read) return a.read ? 1 : -1
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (dateCompare !== 0) return dateCompare
      return b.time.localeCompare(a.time)
    })

  const unreadCount = notificationsData.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
            Notifikasi
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-error text-on-error rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Pusat notifikasi sistem RSCM</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BellOff className="h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-error-container text-error"><AlertTriangle className="h-5 w-5" /></div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Prioritas Tinggi</p>
                <p className="text-2xl font-bold text-on-surface">{notificationsData.filter(d => d.priority === "high" && !d.read).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-tertiary-fixed text-tertiary"><Info className="h-5 w-5" /></div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Prioritas Sedang</p>
                <p className="text-2xl font-bold text-on-surface">{notificationsData.filter(d => d.priority === "medium" && !d.read).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><CheckCircle className="h-5 w-5" /></div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Prioritas Rendah</p>
                <p className="text-2xl font-bold text-on-surface">{notificationsData.filter(d => d.priority === "low" && !d.read).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary-fixed text-secondary"><Bell className="h-5 w-5" /></div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Total Belum Dibaca</p>
                <p className="text-2xl font-bold text-on-surface">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-sm:hidden">
              <Input
                placeholder="Cari judul, pesan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              options={typeOptions}
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Jenis"
              className="w-40"
            />
            <Select
              options={priorityOptions}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Prioritas"
              className="w-40"
            />
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status"
              className="w-40"
            />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Dari"
              className="w-36"
              icon={Calendar}
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Sampai"
              className="w-36"
              icon={Calendar}
            />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline">
                <Filter className="h-4 w-4" />
                Filter Lanjut
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Ekspor
              </Button>
            </div>
          </div>
          <div className="mt-4 sm:hidden">
            <Input
              placeholder="Cari judul, pesan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            columns={[
              { header: "", accessor: (row) => <TypeIcon type={row.type} />, className: "w-12" },
              { header: "Tanggal", accessor: "date", className: "w-28" },
              { header: "Waktu", accessor: "time", className: "w-20 font-mono" },
              { header: "Jenis", accessor: (row) => <TypeBadge type={row.type} />, className: "w-28" },
              { header: "Judul", accessor: "title" },
              { header: "Pesan", accessor: "message", className: "hidden lg:table-cell max-w-xs truncate" },
              { header: "Prioritas", accessor: (row) => <PriorityBadge priority={row.priority} />, className: "w-28" },
              { header: "Modul", accessor: "module", className: "hidden md:table-cell" },
              { header: "Status", accessor: (row) => (
                <Badge variant={row.read ? "secondary" : "info"} className="gap-1">
                  {row.read ? <Check className="h-3 w-3" /> : <BellRing className="h-3 w-3" />}
                  {row.read ? "Dibaca" : "Belum Dibaca"}
                </Badge>
              ), className: "w-28" },
              { header: "Aksi", accessor: (row) => (
                <div className="flex items-center gap-1">
                  <Link href={row.actionUrl} className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant" title="Lihat Detail"><Eye className="h-4 w-4" /></Link>
                  {!row.read && (
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0" title="Tandai Dibaca">
                      <Check className="h-4 w-4 text-primary" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="h-8 w-8 p-0" title="Hapus">
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              ), className: "w-28" },
            ]}
            data={filteredData}
            keyAccessor="id"
            emptyMessage="Tidak ada notifikasi"
          />
        </CardContent>
      </Card>
    </div>
  )
}