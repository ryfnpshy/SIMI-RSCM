import Link from "next/link"

/** Kepala halaman seragam: remah, judul, deskripsi, dan slot aksi. */
export function PageHeader({
  judul,
  deskripsi,
  remah,
  aksi,
}: {
  judul: string
  deskripsi?: string
  remah: { label: string; href?: string }[]
  aksi?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
          {remah.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <span className="material-symbols-outlined text-xs text-outline-variant">chevron_right</span>}
              {item.href ? (
                <Link className="transition-colors hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-primary">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">{judul}</h1>
        {deskripsi && <p className="font-body-md text-body-md text-on-surface-variant">{deskripsi}</p>}
      </div>
      {aksi && <div className="flex items-center gap-2">{aksi}</div>}
    </div>
  )
}
