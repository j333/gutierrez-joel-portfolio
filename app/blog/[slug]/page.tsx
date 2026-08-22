import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { PageHeader } from 'app/components/page-layout'
import { formatDate, getBlogPosts } from 'app/blog/utils'
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
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Joel Gutiérrez',
            },
          }),
        }}
      />
      <PageHeader
        title={post.metadata.title}
        description={formatDate(post.metadata.publishedAt)}
        meta={
          (post.metadata.medium || post.metadata.linkedin) && (
            <p className="mt-2 text-base leading-6 text-neutral-600 dark:text-neutral-400">
              {post.metadata.medium && (
                <a
                  href={post.metadata.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline underline-offset-4 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Medium
                </a>
              )}
              {post.metadata.medium && post.metadata.linkedin && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  {' '}
                  ·{' '}
                </span>
              )}
              {post.metadata.linkedin && (
                <a
                  href={post.metadata.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline underline-offset-4 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  LinkedIn
                </a>
              )}
            </p>
          )
        }
      />
      <section className="mb-16">
        <article className="prose">
          <CustomMDX source={post.content} />
        </article>
      </section>
    </>
  )
}
