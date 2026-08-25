import { getBlogPosts } from 'app/blog/utils'
import { getExperience } from 'app/experience/utils'

export const baseUrl = 'https://www.gutierrezjoel.com'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let experience = getExperience().map((entry) => ({
    url: `${baseUrl}/experience/${entry.slug}`,
    lastModified: entry.metadata.endedAt,
  }))

  let routes = ['', '/blog', '/experience'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs, ...experience]
}
