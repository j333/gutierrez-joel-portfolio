import { localePath, type Locale } from 'app/lib/locale'
import { getMdxData, getMdxDirectory, type MdxEntry } from 'app/lib/mdx'
import { site } from 'app/lib/site'

export type Metadata = {
  title: string
  startedAt: string
  endedAt: string
  summary: string
  role?: string
  type?: string
  startedOn?: string
  endedOn?: string
  industry?: string
  workplace?: string
  image?: string
}

export type ExperienceEntry = MdxEntry<Metadata>

export const getExperience = (locale: Locale) =>
  getMdxData<Metadata>(getMdxDirectory('experience', 'posts', locale)).sort(
    (a, b) => {
      if (a.metadata.endedAt !== b.metadata.endedAt) {
        return b.metadata.endedAt.localeCompare(a.metadata.endedAt)
      }

      return b.metadata.startedAt.localeCompare(a.metadata.startedAt)
    }
  )

export const getExperienceBySlug = (slug: string, locale: Locale) =>
  getExperience(locale).find((entry) => entry.slug === slug)

export const getExperienceCanonicalUrl = (
  entry: ExperienceEntry,
  locale: Locale
) => `${site.url}${localePath(locale, `/experience/${entry.slug}`)}`

export const getExperienceMarkdownUrl = (
  entry: ExperienceEntry,
  locale: Locale
) => `${site.url}${localePath(locale, `/experience/${entry.slug}`)}.md`
