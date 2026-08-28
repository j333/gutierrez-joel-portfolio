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

export const getExperience = () =>
  getMdxData<Metadata>(getMdxDirectory('experience', 'posts')).sort((a, b) => {
    if (a.metadata.endedAt !== b.metadata.endedAt) {
      return b.metadata.endedAt.localeCompare(a.metadata.endedAt)
    }

    return b.metadata.startedAt.localeCompare(a.metadata.startedAt)
  })

export const getExperienceBySlug = (slug: string) =>
  getExperience().find((entry) => entry.slug === slug)

export const getExperienceCanonicalUrl = (entry: ExperienceEntry) =>
  `${site.url}/experience/${entry.slug}`
