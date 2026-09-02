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
  const rows = [
    { label: 'Brand', value: metadata.product },
    { label: 'Deliverable', value: metadata.deliverable },
    metadata.industry ? { label: 'Industry', value: metadata.industry } : null,
    {
      label: 'Year',
      value: (
        <YearRange
          start={metadata.startedAt}
          end={metadata.endedAt}
          className={metaValueClassName}
        />
      ),
    },
  ].filter((row): row is MetaItem => Boolean(row))

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
