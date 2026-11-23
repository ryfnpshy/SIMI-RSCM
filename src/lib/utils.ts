import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inisial(nama: string) {
  return nama
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((bagian) => bagian[0]?.toUpperCase() ?? "")
    .join("")
}

export function rupiah(nilai: number) {
  return new Intl.NumberFormat("id-ID").format(nilai)
}

export function tanggalSingkat(nilai: string | null | undefined) {
  if (!nilai) return "—"
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(nilai))
}