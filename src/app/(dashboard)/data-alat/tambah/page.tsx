import { FormAlat } from "./FormAlat"
import { alatPenuh, daftarAliasAlat, daftarUnit } from "@/lib/data"

export default async function TambahAlatPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const [unit, alat] = await Promise.all([daftarUnit(), id ? alatPenuh(id) : Promise.resolve(null)])
  const alias = alat ? await daftarAliasAlat(alat.id) : []

  return (
    <FormAlat
      unit={unit}
      alat={alat}
      aliasAwal={alias
        .filter((item) => item.unit)
        .map((item) => ({ unit: (item.unit as { id: string }).id, alias: item.alias }))}
    />
  )
}
