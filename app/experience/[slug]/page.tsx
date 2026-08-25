import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { PageHeader } from 'app/components/page-layout'
import { getExperience, getExperienceCanonicalUrl } from 'app/experience/utils'
import { ExperienceMeta } from 'app/components/experience-meta'
import { toJsonLd } from 'app/lib/escape'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let entries = getExperience()

  return entries.map((entry) => ({
    slug: entry.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let entry = getExperience().find((entry) => entry.slug === slug)
  if (!entry) {
    return
  }

  let { title, startedAt, summary, role } = entry.metadata
  const description = role ? `${role}. ${summary}` : summary
  const canonical = getExperienceCanonicalUrl(entry, baseUrl)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: `${startedAt}-01-01`,
      url: canonical,
      siteName: 'Joel Gutiérrez',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function Experience({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let entry = getExperience().find((entry) => entry.slug === slug)

  if (!entry) {
    notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: toJsonLd({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            headline: entry.metadata.title,
            datePublished: entry.metadata.startedAt,
            dateModified: entry.metadata.endedAt,
            description: entry.metadata.summary,
            image: entry.metadata.image
              ? `${baseUrl}${entry.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(entry.metadata.title)}&eyebrow=EXPERIENCE`,
            url: getExperienceCanonicalUrl(entry, baseUrl),
            author: {
              '@type': 'Person',
              name: 'Joel Gutiérrez',
            },
          }),
        }}
      />
      <article className="mb-16">
        <PageHeader
          title={entry.metadata.title}
          description={entry.metadata.role}
        >
          <ExperienceMeta metadata={entry.metadata} />
        </PageHeader>
        <div className="prose">
          <CustomMDX source={entry.content} />
        </div>
      </article>
    </>
  )
}
