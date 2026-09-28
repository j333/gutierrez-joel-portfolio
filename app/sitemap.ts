import { getWritingPosts } from 'app/notes/utils'
import { getExperience } from 'app/experience/utils'
import { getListedProjects } from 'app/projects/utils'
import { latestIsoDate, toIsoDate } from 'app/lib/iso-date'
import { locales, localePath } from 'app/lib/locale'
import { languageAlternates } from 'app/lib/metadata'
import { site } from 'app/lib/site'

export const baseUrl = site.url

const sitemap = async () =>
  locales.flatMap((locale) => {
    const writingPosts = getWritingPosts(locale)
    const experienceEntries = getExperience(locale)
    const listedProjects = getListedProjects(locale)

    const writing = writingPosts.map((post) => ({
      url: `${site.url}${localePath(locale, `/notes/${post.slug}`)}`,
      lastModified: toIsoDate(post.metadata.publishedAt),
      alternates: {
        languages: languageAlternates(`/notes/${post.slug}`),
      },
    }))

    const experience = experienceEntries.map((item) => ({
      url: `${site.url}${localePath(locale, `/experience/${item.slug}`)}`,
      lastModified: toIsoDate(item.metadata.endedOn ?? item.metadata.endedAt),
      alternates: {
        languages: languageAlternates(`/experience/${item.slug}`),
      },
    }))

    const projects = listedProjects.map((project) => ({
      url: `${site.url}${localePath(locale, `/${project.slug}`)}`,
      lastModified: toIsoDate(project.metadata.endedAt),
      alternates: {
        languages: languageAlternates(`/${project.slug}`),
      },
    }))

    const newestContent = latestIsoDate([
      ...listedProjects.map((project) => project.metadata.endedAt),
      ...writingPosts.map((post) => post.metadata.publishedAt),
      ...experienceEntries.map(
        (item) => item.metadata.endedOn ?? item.metadata.endedAt
      ),
    ])
    const newestNote = latestIsoDate(
      writingPosts.map((post) => post.metadata.publishedAt)
    )
    const routeLastModified: Record<string, string | undefined> = {
      '/': newestContent,
      '/about': newestContent,
      '/notes': newestNote,
    }

    const routes = ['/', '/about', '/notes'].map((route) => ({
      url: `${site.url}${localePath(locale, route)}`,
      ...(routeLastModified[route]
        ? { lastModified: routeLastModified[route] }
        : {}),
      alternates: {
        languages: languageAlternates(route),
      },
    }))

    return [...routes, ...projects, ...writing, ...experience]
  })

export default sitemap
