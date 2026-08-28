import type { Metadata } from 'next'
import { site } from './site'

type PageMetadataInput = {
  title: string
  description: string
  canonical: string
  type?: 'website' | 'article'
  publishedTime?: string
}

export const createPageMetadata = ({
  title,
  description,
  canonical,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Metadata => ({
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: site.name,
    locale: site.locale,
    type,
    ...(publishedTime ? { publishedTime } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
})

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
}

export const createCreativeWorkJsonLd = ({
  type,
  headline,
  datePublished,
  dateModified = datePublished,
  description,
  image,
  url,
}: CreativeWorkJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': type,
  headline,
  datePublished,
  dateModified,
  description,
  image,
  url,
  author: {
    '@type': 'Person',
    name: site.name,
  },
})
