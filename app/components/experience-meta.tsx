import type { Metadata } from 'app/experience/utils'
import { MetaRow, metaListClassName } from 'app/components/page-layout'
import { getDictionary } from 'app/lib/i18n'

const formatExperienceDate = (
  months: readonly string[],
  value?: string
) => {
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

  return `${months[monthIndex]} ${year}`
}

type MetaItem = {
  label: string
  value: string
}

type ExperienceMetaProps = {
  metadata: Metadata
}

export const ExperienceMeta = async ({ metadata }: ExperienceMetaProps) => {
  const copy = await getDictionary()
  const joined = formatExperienceDate(
    copy.months,
    metadata.startedOn ?? metadata.startedAt
  )
  const left = metadata.endedOn
    ? formatExperienceDate(copy.months, metadata.endedOn)
    : metadata.endedAt
      ? formatExperienceDate(copy.months, metadata.endedAt)
      : copy.meta.present

  const rows = [
    metadata.role ? { label: copy.meta.role, value: metadata.role } : null,
    metadata.type ? { label: copy.meta.type, value: metadata.type } : null,
    metadata.industry
      ? { label: copy.meta.industry, value: metadata.industry }
      : null,
    metadata.workplace
      ? { label: copy.meta.mode, value: metadata.workplace }
      : null,
    joined ? { label: copy.meta.start, value: joined } : null,
    left ? { label: copy.meta.end, value: left } : null,
  ].filter((row): row is MetaItem => Boolean(row))

  if (rows.length === 0) {
    return null
  }

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
