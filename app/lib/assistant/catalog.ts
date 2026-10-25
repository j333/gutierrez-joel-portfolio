import { getExperience } from 'app/experience/utils'
import {
  caseDetails,
  experienceDetails,
  isCaseSlug,
  type CaseSlug,
} from 'app/lib/assistant/joel-context'
import type { Locale } from 'app/lib/locale'
import { getWritingPosts } from 'app/notes/utils'
import { getProjects } from 'app/projects/utils'

export type AssistantCase = {
  slug: CaseSlug
  path: string
  title: string
  summary: string
  product: string
  role: string
  years: string
  detail: string
}

export type AssistantRole = {
  slug: string
  path: string
  title: string
  summary: string
  role: string
  years: string
  detail: string
}

export type AssistantNote = {
  slug: string
  path: string
  title: string
  summary: string
}

export type AssistantSources = {
  cases: AssistantCase[]
  experience: AssistantRole[]
  notes: AssistantNote[]
}

export type AssistantCatalog = {
  cases: Pick<AssistantCase, 'slug' | 'path' | 'title' | 'product'>[]
  experience: Pick<AssistantRole, 'slug' | 'path' | 'title'>[]
  notes: Pick<AssistantNote, 'slug' | 'path' | 'title'>[]
}

const years = (startedAt: string, endedAt: string) =>
  startedAt === endedAt ? startedAt : `${startedAt}–${endedAt}`

export const loadAssistantSources = (locale: Locale): AssistantSources => {
  const cases = getProjects(locale).flatMap((project) => {
    if (!isCaseSlug(project.slug)) {
      return []
    }

    return [
      {
        slug: project.slug,
        path: `/${project.slug}`,
        title: project.metadata.title,
        summary: project.metadata.summary ?? project.metadata.title,
        product: project.metadata.product,
        role: project.metadata.role ?? '',
        years: years(project.metadata.startedAt, project.metadata.endedAt),
        detail: caseDetails[project.slug][locale],
      },
    ]
  })

  const experience = getExperience(locale).map((entry) => ({
    slug: entry.slug,
    path: `/experience/${entry.slug}`,
    title: entry.metadata.title,
    summary: entry.metadata.summary,
    role: entry.metadata.role ?? '',
    years: years(entry.metadata.startedAt, entry.metadata.endedAt),
    detail: experienceDetails[entry.slug]?.[locale] ?? '',
  }))

  const notes = getWritingPosts(locale).map((post) => ({
    slug: post.slug,
    path: `/notes/${post.slug}`,
    title: post.metadata.title,
    summary: post.metadata.summary,
  }))

  return { cases, experience, notes }
}

export const getAssistantCatalog = (locale: Locale): AssistantCatalog => {
  const sources = loadAssistantSources(locale)

  return {
    cases: sources.cases.map(({ slug, path, title, product }) => ({
      slug,
      path,
      title,
      product,
    })),
    experience: sources.experience.map(({ slug, path, title }) => ({
      slug,
      path,
      title,
    })),
    notes: sources.notes.map(({ slug, path, title }) => ({
      slug,
      path,
      title,
    })),
  }
}
