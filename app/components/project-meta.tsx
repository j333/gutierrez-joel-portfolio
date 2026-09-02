import type { ReactNode } from 'react'
import { MetaRow, metaListClassName, metaValueClassName } from 'app/components/page-layout'
import { YearRange } from 'app/components/year-range'
import type { ProjectMetadata } from 'app/projects/utils'

type MetaItem = {
  label: string
  value: ReactNode
}

type ProjectMetaProps = {
  metadata: ProjectMetadata
}

export const ProjectMeta = ({ metadata }: ProjectMetaProps) => {
  const rows: MetaItem[] = [
    { label: 'Brand', value: metadata.product },
    { label: 'Deliverable', value: metadata.deliverable },
  ]

  if (metadata.role) {
    rows.push({ label: 'Role', value: metadata.role })
  }

  if (metadata.industry) {
    rows.push({ label: 'Industry', value: metadata.industry })
  }

  rows.push({
    label: 'Year',
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
