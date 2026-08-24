import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { PageHeader } from 'app/components/page-layout'
import { formatDate, getBlogPosts, getPostCanonicalUrl } from 'app/blog/utils'
import { toJsonLd } from 'app/lib/escape'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = post.metadata
  const canonical = getPostCanonicalUrl(post, baseUrl)

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
      publishedTime,
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

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
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
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}&eyebrow=WRITING`,
            url: getPostCanonicalUrl(post, baseUrl),
            author: {
              '@type': 'Person',
              name: 'Joel Gutiérrez',
            },
          }),
        }}
      />
      <article className="mb-16">
        <PageHeader
          title={post.metadata.title}
          description={
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          }
        />
        <div className="prose">
          <CustomMDX source={post.content} />
        </div>
        {post.metadata.medium && (
          <p className="mt-16 text-base leading-6 text-neutral-600 dark:text-neutral-400">
            <a
              href={post.metadata.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
              aria-label="View on Medium, opens in a new tab"
            >
              View on Medium
            </a>
          </p>
        )}
      </article>
    </>
  )
}
