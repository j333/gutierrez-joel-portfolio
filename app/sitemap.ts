import { getWritingPosts } from 'app/writing/utils'
import { getExperience } from 'app/experience/utils'
import { site } from 'app/lib/site'

export const baseUrl = site.url

const sitemap = async () => {
  const writing = getWritingPosts().map((post) => ({
    url: `${site.url}/writing/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const experience = getExperience().map((entry) => ({
    url: `${site.url}/experience/${entry.slug}`,
    lastModified: entry.metadata.endedAt,
  }))

  const routes = ['', '/writing', '/experience'].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...writing, ...experience]
}

export default sitemap
