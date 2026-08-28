import { getMdxData, getMdxDirectory, type MdxEntry } from 'app/lib/mdx'
import { site } from 'app/lib/site'

export type WritingMetadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  medium?: string
}

export type WritingPost = MdxEntry<WritingMetadata>

export const getWritingPosts = () =>
  getMdxData<WritingMetadata>(getMdxDirectory('writing', 'posts')).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )

export const getWritingPostBySlug = (slug: string) =>
  getWritingPosts().find((post) => post.slug === slug)

export const getPostCanonicalUrl = (post: WritingPost) => {
  if (post.metadata.medium) {
    return post.metadata.medium
  }

  return `${site.url}/writing/${post.slug}`
}

export const formatDate = (date: string, includeRelative = false) => {
  const currentDate = new Date()
  const value = date.includes('T') ? date : `${date}T00:00:00`
  const targetDate = new Date(value)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = 'Today'

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export const formatListDate = (date: string) => {
  const value = date.includes('T') ? date : `${date}T00:00:00`

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}
