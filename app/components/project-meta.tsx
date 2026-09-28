import type { ReactNode } from 'react'
import { MetaRow, metaListClassName, metaValueClassName } from 'app/components/page-layout'
import { YearRange } from 'app/components/year-range'
import { getDictionary } from 'app/lib/i18n'
import type { ProjectMetadata } from 'app/projects/utils'

type MetaItem = {
  label: string
  value: ReactNode
}

type ProjectMetaProps = {
  metadata: ProjectMetadata
}

export const ProjectMeta = async ({ metadata }: ProjectMetaProps) => {
  const copy = await getDictionary()
  const rows: MetaItem[] = [
    { label: copy.meta.brand, value: metadata.product },
    { label: copy.meta.deliverable, value: metadata.deliverable },
  ]

  if (metadata.role) {
    rows.push({ label: copy.meta.role, value: metadata.role })
  }

  if (metadata.industry) {
    rows.push({ label: copy.meta.industry, value: metadata.industry })
  }

  rows.push({
    label: copy.meta.year,
    value: (
      <YearRange
        start={metadata.startedAt}
        end={metadata.endedAt}
        className={metaValueClassName}
      />
    ),
  })

  return (
    <dl className={metaListClassName}>
      {rows.map((row) => (
        <MetaRow key={row.label} label={row.label}>
          {row.value}
        </MetaRow>
      ))}
    </dl>
  )
}
