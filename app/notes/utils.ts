import { dictionaries } from 'app/lib/i18n'
import { localePath, type Locale } from 'app/lib/locale'
import { getMdxData, getMdxDirectory, type MdxEntry } from 'app/lib/mdx'
import { getPublicImageSize } from 'app/lib/public-image'
import { site } from 'app/lib/site'

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

export const getWritingPosts = (locale: Locale) =>
  getMdxData<WritingMetadata>(getMdxDirectory('notes', 'posts', locale)).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )

export const getWritingPostBySlug = (slug: string, locale: Locale) =>
  getWritingPosts(locale).find((post) => post.slug === slug)

export const getWritingPostImage = (
  post: WritingPost
): WritingPostImage | null => {
  const rawSrc = post.metadata.image

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

export const getPostCanonicalUrl = (post: WritingPost, locale: Locale) =>
  `${site.url}${localePath(locale, `/notes/${post.slug}`)}`

export const getPostMarkdownUrl = (post: WritingPost, locale: Locale) =>
  `${site.url}${localePath(locale, `/notes/${post.slug}`)}.md`

const relativePhrase = (
  locale: Locale,
  count: number,
  singular: 'year' | 'month' | 'day',
  plural: 'years' | 'months' | 'days'
) => {
  const copy = dictionaries[locale].relative
  const template = count === 1 ? copy[singular] : copy[plural]

  return template.replace('{n}', String(count))
}

export const formatDate = (
  date: string,
  locale: Locale,
  includeRelative = false
) => {
  const currentDate = new Date()
  const value = date.includes('T') ? date : `${date}T00:00:00`
  const targetDate = new Date(value)
  const copy = dictionaries[locale]

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = copy.relative.today

  if (yearsAgo > 0) {
    formattedDate = relativePhrase(locale, yearsAgo, 'year', 'years')
  } else if (monthsAgo > 0) {
    formattedDate = relativePhrase(locale, monthsAgo, 'month', 'months')
  } else if (daysAgo > 0) {
    formattedDate = relativePhrase(locale, daysAgo, 'day', 'days')
  }

  const fullDate = targetDate.toLocaleString(copy.dateLocale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export const formatListDate = (date: string, locale: Locale) => {
  const value = date.includes('T') ? date : `${date}T00:00:00`

  return new Date(value).toLocaleString(dictionaries[locale].dateLocale, {
    month: 'short',
    year: 'numeric',
  })
}
