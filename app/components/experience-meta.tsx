import type { Metadata } from 'app/experience/utils'
import { MetaRow } from 'app/components/page-layout'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

const formatExperienceDate = (value?: string) => {
  if (!value) {
    return null
  }

  const [year, month] = value.split('-')

  if (!year) {
    return null
  }

  if (!month) {
    return year
  }

  const monthIndex = Number(month) - 1

  if (monthIndex < 0 || monthIndex > 11) {
    return year
  }

  return `${MONTHS[monthIndex]} ${year}`
}

type MetaItem = {
  label: string
  value: string
}

type ExperienceMetaProps = {
  metadata: Metadata
}

export const ExperienceMeta = ({ metadata }: ExperienceMetaProps) => {
  const joined = formatExperienceDate(metadata.startedOn ?? metadata.startedAt)
  const left = metadata.endedOn
    ? formatExperienceDate(metadata.endedOn)
    : metadata.endedAt
      ? formatExperienceDate(metadata.endedAt)
      : 'Present'

  const rows = [
    metadata.role ? { label: 'Role', value: metadata.role } : null,
    metadata.type ? { label: 'Type', value: metadata.type } : null,
    metadata.industry ? { label: 'Industry', value: metadata.industry } : null,
    metadata.workplace ? { label: 'Mode', value: metadata.workplace } : null,
    joined ? { label: 'Start', value: joined } : null,
    left ? { label: 'End', value: left } : null,
  ].filter((row): row is MetaItem => Boolean(row))

  if (rows.length === 0) {
    return null
  }

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
      {rows.map((row) => (
        <MetaRow key={row.label} label={row.label}>
          {row.value}
        </MetaRow>
      ))}
    </dl>
  )
}
