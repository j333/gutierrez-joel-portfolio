import { getWritingPosts } from 'app/notes/utils'
import { getExperience } from 'app/experience/utils'
import { getListedProjects } from 'app/projects/utils'
import { locales, localePath } from 'app/lib/locale'
import { languageAlternates } from 'app/lib/metadata'
import { site } from 'app/lib/site'

export const baseUrl = site.url

const sitemap = async () =>
  locales.flatMap((locale) => {
    const writing = getWritingPosts(locale).map((post) => ({
      url: `${site.url}${localePath(locale, `/notes/${post.slug}`)}`,
      lastModified: post.metadata.publishedAt,
      alternates: {
        languages: languageAlternates(`/notes/${post.slug}`),
      },
    }))

    const experience = getExperience(locale).map((item) => ({
      url: `${site.url}${localePath(locale, `/experience/${item.slug}`)}`,
      lastModified: item.metadata.endedAt,
      alternates: {
        languages: languageAlternates(`/experience/${item.slug}`),
      },
    }))

    const projects = getListedProjects(locale).map((project) => ({
      url: `${site.url}${localePath(locale, `/${project.slug}`)}`,
      lastModified: project.metadata.endedAt,
      alternates: {
        languages: languageAlternates(`/${project.slug}`),
      },
    }))

    const routes = ['/', '/about', '/notes'].map((route) => ({
      url: `${site.url}${localePath(locale, route)}`,
      lastModified: new Date().toISOString().split('T')[0],
      alternates: {
        languages: languageAlternates(route),
      },
    }))

    return [...routes, ...projects, ...writing, ...experience]
  })

export default sitemap
