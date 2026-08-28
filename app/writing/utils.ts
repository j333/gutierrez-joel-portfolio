import { getMdxData, getMdxDirectory, type MdxEntry } from 'app/lib/mdx'
import { getPublicImageSize } from 'app/lib/public-image'
import { site } from 'app/lib/site'

const FIRST_MARKDOWN_IMAGE = /!\[[^\]]*]\(([^)\s]+)/

export type WritingPostImage = {
  src: string
  width: number
  height: number
}

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

export const getWritingPostImage = (
  post: WritingPost
): WritingPostImage | null => {
  const match = FIRST_MARKDOWN_IMAGE.exec(post.content)
  const rawSrc = match?.[1] ?? post.metadata.image

  if (!rawSrc) {
    return null
  }

  const src = rawSrc.split('#')[0]
  const size = getPublicImageSize(src)

  if (!size) {
    return null
  }

  return {
    src,
    width: size.width,
    height: size.height,
  }
}

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
