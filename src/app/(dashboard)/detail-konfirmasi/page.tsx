"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { CheckCircle, AlertTriangle, XCircle, ClipboardCheck, PackageOpen, Search, Filter, Download, Eye, Clock } from "lucide-react"
import Link from "next/link"

const detailReceivingData = [
  { id: "1", receivingId: "TERIMA-001", date: "2024-01-15", itemCode: "ALT-006", itemName: "Katet Urin Foley 16Fr", unit: "pcs", ordered: 100, received: 98, condition: "BAIK", batchNumber: "KF16-2024-001", expiryDate: "2026-01-10", status: "accepted", notes: "2 pcs kemasan robek, diganti" },
  { id: "2", receivingId: "TERIMA-001", date: "2024-01-15", itemCode: "ALT-007", itemName: "Masker O2 Nasal Kanul", unit: "pcs", ordered: 200, received: 200, condition: "BAIK", batchNumber: "MOK-2024-001", expiryDate: "2025-12-01", status: "accepted", notes: "Sesuai spesifikasi" },
  { id: "3", receivingId: "TERIMA-001", date: "2024-01-15", itemCode: "ALT-008", itemName: "Alco Swab 70%", unit: "box", ordered: 50, received: 50, condition: "BAIK", batchNumber: "AS70-2024-001", expiryDate: "2025-06-15", status: "accepted", notes: "" },
  { id: "4", receivingId: "TERIMA-001", date: "2024-01-15", itemCode: "ALT-009", itemName: "Handuk Bedah Steril", unit: "pcs", ordered: 100, received: 100, condition: "BAIK", batchNumber: "HBS-2024-001", expiryDate: "2025-08-20", status: "accepted", notes: "" },
  { id: "5", receivingId: "TERIMA-001", date: "2024-01-15", itemCode: "ALT-010", itemName: "Sering Infus 50ml", unit: "pcs", ordered: 500, received: 500, condition: "BAIK", batchNumber: "SI50-2024-001", expiryDate: "2025-11-30", status: "accepted", notes: "" },
  { id: "6", receivingId: "TERIMA-002", date: "2024-01-15", itemCode: "ALT-006", itemName: "Katet Urin Foley 16Fr", unit: "pcs", ordered: 50, received: 48, condition: "RUSAK", batchNumber: "KF16-2024-002", expiryDate: "2026-01-10", status: "rejected", notes: "2 pcs cacat produksi (lubang pada balon)" },
  { id: "7", receivingId: "TERIMA-002", date: "2024-01-15", itemCode: "ALT-011", itemName: "Katet Foley 18Fr", unit: "pcs", ordered: 30, received: 30, condition: "BAIK", batchNumber: "KF18-2024-001", expiryDate: "2026-01-10", status: "accepted", notes: "" },
  { id: "8", receivingId: "TERIMA-002", date: "2024-01-15", itemCode: "ALT-012", itemName: "Sering Infus 20ml", unit: "pcs", ordered: 200, received: 200, condition: "BAIK", batchNumber: "SI20-2024-001", expiryDate: "2025-11-30", status: "accepted", notes: "" },
  { id: "9", receivingId: "TERIMA-003", date: "2024-01-14", itemCode: "ALT-013", itemName: "Infus Pump IP-200", unit: "unit", ordered: 10, received: 0, condition: "-", batchNumber: "-", expiryDate: "-", status: "pending", notes: "Menunggu pengiriman" },
  { id: "10", receivingId: "TERIMA-003", date: "2024-01-14", itemCode: "ALT-002", itemName: "Monitor Pasien MP-500", unit: "unit", ordered: 5, received: 0, condition: "-", batchNumber: "-", expiryDate: "-", status: "pending", notes: "Menunggu pengiriman" },
  { id: "11", receivingId: "TERIMA-004", date: "2024-01-14", itemCode: "ALT-006", itemName: "Katet Urin Foley 16Fr", unit: "pcs", ordered: 200, received: 200, condition: "BAIK", batchNumber: "KF16-2024-003", expiryDate: "2026-02-15", status: "accepted", notes: "Transfer dari gudang pusat" },
  { id: "12", receivingId: "TERIMA-004", date: "2024-01-14", itemCode: "ALT-007", itemName: "Masker O2 Nasal Kanul", unit: "pcs", ordered: 300, received: 300, condition: "BAIK", batchNumber: "MOK-2024-002", expiryDate: "2025-12-01", status: "accepted", notes: "Transfer dari gudang pusat" },
  { id: "13", receivingId: "TERIMA-007", date: "2024-01-12", itemCode: "ALT-013", itemName: "Infus Pump IP-200", unit: "unit", ordered: 2, received: 2, condition: "CACAT", batchNumber: "IP200-2023-045", expiryDate: "2028-01-01", status: "rejected", notes: "Retur: Error E-03 (sensor tekanan)" },
  { id: "14", receivingId: "TERIMA-007", date: "2024-01-12", itemCode: "ALT-013", itemName: "Infus Pump IP-200", unit: "unit", ordered: 2, received: 2, condition: "CACAT", batchNumber: "IP200-2023-046", expiryDate: "2028-01-01", status: "rejected", notes: "Retur: Error E-03 (sensor tekanan)" },
]

const receivingOptions = [
  { value: "", label: "Semua Penerimaan" },
  { value: "TERIMA-001", label: "TERIMA-001: PT Medika Sejahtera (5 item)" },
  { value: "TERIMA-002", label: "TERIMA-002: CV Alat Medis Jaya (3 item, 1 reject)" },
  { value: "TERIMA-003", label: "TERIMA-003: PT Sumber Sehat (8 item, pending)" },
  { value: "TERIMA-004", label: "TERIMA-004: Transfer Gudang Pusat (12 item)" },
  { value: "TERIMA-005", label: "TERIMA-005: PT Medika Sejahtera (pending)" },
  { value: "TERIMA-006", label: "TERIMA-006: CV Alat Medis Jaya (6 item)" },
  { value: "TERIMA-007", label: "TERIMA-007: Retur PT Medika (2 item reject)" },
  { value: "TERIMA-008", label: "TERIMA-008: Transfer Gudang Cabang (5 item, pending)" },
]

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
  { value: "pending", label: "Menunggu" },
  { value: "partial", label: "Sebagian" },
]

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    accepted: "success",
    rejected: "destructive",
    pending: "warning",
    partial: "warning",
  }
  const labels: Record<string, string> = {
    accepted: "Diterima",
    rejected: "Ditolak",
    pending: "Menunggu",
    partial: "Sebagian",
  }
  const icons: Record<string, React.ReactNode> = {
    accepted: <CheckCircle className="h-3 w-3" />,
    rejected: <XCircle className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    partial: <AlertTriangle className="h-3 w-3" />,
  }
  return (
    <Badge variant={variants[status] || "secondary"} className="gap-1">
      {icons[status]}
      {labels[status] || status}
    </Badge>
  )
}

function ConditionBadge({ condition }: { condition: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
    BAIK: "success",
    RUSAK: "destructive",
    CACAT: "destructive",
    "-": "secondary",
  }
  return <Badge variant={variants[condition] || "secondary"} size="sm">{condition}</Badge>
}

export default function DetailKonfirmasiPage() {
  const [search, setSearch] = useState("")
  const [receivingId, setReceivingId] = useState("")
  const [status, setStatus] = useState("")

  const filteredData = detailReceivingData
    .filter((item) => {
      const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.notes.toLowerCase().includes(search.toLowerCase())
      const matchesReceiving = !receivingId || item.receivingId === receivingId
      const matchesStatus = !status || item.status === status
      return matchesSearch && matchesReceiving && matchesStatus
    })
    .sort((a, b) => {
      const receivingCompare = a.receivingId.localeCompare(b.receivingId)
      if (receivingCompare !== 0) return receivingCompare
      return a.itemName.localeCompare(b.itemName)
    })

  const receivingSummary = receivingId
    ? detailReceivingData.filter(d => d.receivingId === receivingId)
    : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Detail Konfirmasi Penerimaan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Verifikasi detail item per item pada penerimaan barang</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Ekspor
          </Button>
        </div>
      </div>

      {/* Receiving Selector & Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select
              options={receivingOptions}
              value={receivingId}
              onChange={(e) => setReceivingId(e.target.value)}
              placeholder="Pilih Penerimaan"
              className="w-full sm:w-96"
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

          {receivingId && receivingSummary.length > 0 && (
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary-fixed text-secondary"><PackageOpen className="h-5 w-5" /></div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">Total Baris</p>
                      <p className="text-2xl font-bold text-on-surface">{receivingSummary.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary"><CheckCircle className="h-5 w-5" /></div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">Diterima</p>
                      <p className="text-2xl font-bold text-on-surface">{receivingSummary.filter(d => d.status === "accepted").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-error-container text-on-error-container"><XCircle className="h-5 w-5" /></div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">Ditolak</p>
                      <p className="text-2xl font-bold text-on-surface">{receivingSummary.filter(d => d.status === "rejected").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-tertiary-fixed text-tertiary"><AlertTriangle className="h-5 w-5" /></div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">Menunggu</p>
                      <p className="text-2xl font-bold text-on-surface">{receivingSummary.filter(d => d.status === "pending").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary"><ClipboardCheck className="h-5 w-5" /></div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">Total Qty Diterima</p>
                      <p className="text-2xl font-bold text-on-surface">{receivingSummary.reduce((sum, d) => sum + d.received, 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-sm:hidden">
              <Input
                placeholder="Cari nama item, batch number, catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status Item"
              className="w-40"
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
              placeholder="Cari nama item, batch number, catatan..."
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
              { header: "Penerimaan", accessor: "receivingId", className: "w-28 font-mono" },
              { header: "Tanggal", accessor: "date", className: "w-28" },
              { header: "Kode Item", accessor: "itemCode", className: "w-24 font-mono hidden sm:table-cell" },
              { header: "Nama Item", accessor: "itemName" },
              { header: "Satuan", accessor: "unit", className: "w-16 text-center" },
              { header: "Pesan", accessor: (row) => <span className="font-mono">{row.ordered}</span>, className: "w-16 text-right" },
              { header: "Terima", accessor: (row) => <span className="font-mono font-semibold">{row.received}</span>, className: "w-16 text-right" },
              { header: "Kondisi", accessor: (row) => <ConditionBadge condition={row.condition} />, className: "w-24" },
              { header: "Batch Number", accessor: "batchNumber", className: "w-36 font-mono text-xs hidden md:table-cell" },
              { header: "Kadaluarsa", accessor: "expiryDate", className: "w-24 hidden sm:table-cell" },
              { header: "Status", accessor: (row) => <StatusBadge status={row.status} />, className: "w-28" },
              { header: "Catatan", accessor: "notes", className: "hidden lg:table-cell max-w-xs truncate" },
              { header: "Aksi", accessor: (row) => (
                <div className="flex items-center gap-1">
                  <Link href={`/detail-konfirmasi/${row.id}`} className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant" title="Detail"><Eye className="h-4 w-4" /></Link>
                  {row.status === "pending" && (
                    <>
                      <Button variant="outline" size="icon" className="h-8 w-8 p-0" title="Terima">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 p-0" title="Tolak">
                        <XCircle className="h-4 w-4 text-error" />
                      </Button>
                    </>
                  )}
                </div>
              ), className: "w-28" },
            ]}
            data={filteredData}
            keyAccessor="id"
            emptyMessage={receivingId
              ? "Penerimaan ini belum memiliki detail item"
              : "Pilih penerimaan untuk melihat detailnya"}
          />
        </CardContent>
      </Card>
    </div>
  )
}