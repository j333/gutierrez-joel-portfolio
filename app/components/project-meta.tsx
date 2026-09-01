import type { ReactNode } from 'react'
import { metaLabelClassName } from 'app/components/page-layout'
import { YearRange } from 'app/components/year-range'
import type { ProjectMetadata } from 'app/projects/utils'

type MetaItem = {
  label: string
  value: ReactNode
}

type ProjectMetaProps = {
  metadata: ProjectMetadata
}

const metaValueClassName =
  'text-base leading-6 text-neutral-800 dark:text-neutral-200'

export const ProjectMeta = ({ metadata }: ProjectMetaProps) => {
  const rows: MetaItem[] = []

  if (metadata.role) {
    rows.push({ label: 'Role', value: metadata.role })
  }

  if (metadata.type) {
    rows.push({ label: 'Type', value: metadata.type })
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
    <dl className="mb-16 grid grid-cols-2 gap-x-14 gap-y-8 sm:grid-cols-4">
      {rows.map((row) => (
        <div key={row.label} className="flex min-w-0 flex-col gap-1">
          <dt className={metaLabelClassName}>{row.label}</dt>
          <dd className={metaValueClassName}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
