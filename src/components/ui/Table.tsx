import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  className?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyAccessor: keyof T | ((row: T) => string)
  className?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
  striped?: boolean
  hoverable?: boolean
}

function Table<T>({
  columns,
  data,
  keyAccessor,
  className,
  emptyMessage = "Tidak ada data",
  onRowClick,
  striped = false,
  hoverable = true,
}: TableProps<T>) {
  const getKey = (row: T) => (typeof keyAccessor === "function" ? keyAccessor(row) : String(row[keyAccessor]))
  const getValue = (row: T, accessor: keyof T | ((row: T) => ReactNode)): ReactNode =>
    typeof accessor === "function" ? accessor(row) : String(row[accessor] ?? "")

  return (
    <div className={cn("overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm", className)}>
      <table className="w-full caption-bottom font-body-md text-body-md">
        <thead className="border-b border-outline-variant/60 bg-surface-container-low">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "h-12 px-4 text-left align-middle font-label-md text-label-md text-on-surface-variant uppercase tracking-wide",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-32 px-4 text-center text-on-surface-variant">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={getKey(row)}
                className={cn(
                  "transition-colors",
                  striped && rowIndex % 2 === 1 && "bg-surface-container-low/40",
                  hoverable && onRowClick && "hover:bg-surface-container-low cursor-pointer"
                )}
                {...(onRowClick ? { onClick: () => onRowClick(row) } : {})}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn("px-4 py-3 align-middle text-on-surface", column.className)}
                  >
                    {getValue(row, column.accessor)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export { Table }