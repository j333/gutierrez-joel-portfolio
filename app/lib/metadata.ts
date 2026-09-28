import type { Metadata } from 'next'
import { locales, localePath, ogLocales, type Locale } from 'app/lib/locale'
import { toIsoDate } from 'app/lib/iso-date'
import { personId } from 'app/lib/person'
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
  inLanguage: string
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
  inLanguage,
  sameAs,
}: CreativeWorkJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': type,
  name: headline,
  headline,
  datePublished: toIsoDate(datePublished, 'start'),
  dateModified: toIsoDate(dateModified, 'end'),
  description,
  image,
  url,
  inLanguage,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
  ...(sameAs ? { sameAs } : {}),
  author: {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
  },
  creator: {
    '@type': 'Person',
    '@id': personId,
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
  startDate: toIsoDate(startDate, 'start'),
  endDate: toIsoDate(endDate, 'end'),
  description,
  url,
  memberOf: {
    '@type': 'Organization',
    name: organizationName,
  },
  member: {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: site.url,
  },
})

export const createProfilePageJsonLd = (url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url,
  mainEntity: {
    '@id': personId,
  },
})
