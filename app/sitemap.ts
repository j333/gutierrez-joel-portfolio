import { getWritingPosts } from 'app/writing/utils'
import { getExperience } from 'app/experience/utils'

export const baseUrl = 'https://www.gutierrezjoel.com'

export default async function sitemap() {
  let writing = getWritingPosts().map((post) => ({
    url: `${baseUrl}/writing/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let experience = getExperience().map((entry) => ({
    url: `${baseUrl}/experience/${entry.slug}`,
    lastModified: entry.metadata.endedAt,
  }))

  let routes = ['', '/writing', '/experience'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...writing, ...experience]
}
