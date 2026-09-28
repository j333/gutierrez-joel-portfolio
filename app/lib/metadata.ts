import type { Metadata } from 'next'
import { locales, localePath, ogLocales, type Locale } from 'app/lib/locale'
import { site } from './site'

type PageMetadataInput = {
  locale: Locale
  path: string
  title: string
  description: string
  markdownPath?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

export const languageAlternates = (path: string) => {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${site.url}${localePath(locale, path)}`])
  )

  return {
    ...languages,
    'x-default': `${site.url}${localePath('en', path)}`,
  }
}

export const createPageMetadata = ({
  locale,
  path,
  title,
  description,
  markdownPath,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Metadata => {
  const canonical = `${site.url}${localePath(locale, path)}`
  const markdownUrl = markdownPath
    ? `${site.url}${localePath(locale, markdownPath)}.md`
    : undefined

  return {
  title,
  description,
  alternates: {
    canonical,
    languages: languageAlternates(path),
    ...(markdownUrl ? { types: { 'text/markdown': markdownUrl } } : {}),
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: site.name,
    locale: ogLocales[locale],
    alternateLocale: locales
      .filter((item) => item !== locale)
      .map((item) => ogLocales[item]),
    type,
    ...(publishedTime ? { publishedTime } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  }
}

export const getSocialImageUrl = (
  image: string | undefined,
  title: string,
  eyebrow: string
) =>
  image
    ? `${site.url}${image}`
    : `${site.url}/og?title=${encodeURIComponent(title)}&eyebrow=${eyebrow}`

type CreativeWorkJsonLdInput = {
  type: 'BlogPosting' | 'CreativeWork'
  headline: string
  datePublished: string
  dateModified?: string
  description: string
  image: string
  url: string
  sameAs?: string
}

export const createCreativeWorkJsonLd = ({
  type,
  headline,
  datePublished,
  dateModified = datePublished,
  description,
  image,
  url,
  sameAs,
}: CreativeWorkJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': type,
  name: headline,
  headline,
  datePublished,
  dateModified,
  description,
  image,
  url,
  ...(sameAs ? { sameAs } : {}),
  author: {
    '@type': 'Person',
    name: site.name,
  },
  creator: {
    '@type': 'Person',
    name: site.name,
  },
})

type EmploymentJsonLdInput = {
  organizationName: string
  roleName?: string
  startDate: string
  endDate: string
  description: string
  url: string
}

export const createEmploymentJsonLd = ({
  organizationName,
  roleName,
  startDate,
  endDate,
  description,
  url,
}: EmploymentJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': 'OrganizationRole',
  ...(roleName ? { roleName } : {}),
  startDate: `${startDate}-01-01`,
  endDate: `${endDate}-12-31`,
  description,
  url,
  memberOf: {
    '@type': 'Organization',
    name: organizationName,
  },
  member: {
    '@type': 'Person',
    name: site.name,
    url: site.url,
  },
})

export const createProfilePageJsonLd = (url: string, mainEntity: object) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url,
  mainEntity,
})
