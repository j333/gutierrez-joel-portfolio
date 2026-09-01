import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { CtaLink } from 'app/components/cta-link'
import { JsonLd } from 'app/components/json-ld'
import { WritingMeta } from 'app/components/writing-meta'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import {
  createCreativeWorkJsonLd,
  createPageMetadata,
  getSocialImageUrl,
} from 'app/lib/metadata'
import type { SlugPageProps } from 'app/lib/params'
import { writingIndex } from 'app/lib/site'
import {
  getPostCanonicalUrl,
  getPostMarkdownUrl,
  getWritingPostBySlug,
  getWritingPosts,
} from 'app/writing/utils'

export const generateStaticParams = async () =>
  getWritingPosts().map((post) => ({
    slug: post.slug,
  }))

export const generateMetadata = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const post = getWritingPostBySlug(slug)

  if (!post) {
    return
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = post.metadata

  return createPageMetadata({
    title,
    description,
    canonical: getPostCanonicalUrl(post),
    markdownUrl: getPostMarkdownUrl(post),
    type: 'article',
    publishedTime,
  })
}

const Writing = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const post = getWritingPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <JsonLd
        data={createCreativeWorkJsonLd({
          type: 'BlogPosting',
          headline: post.metadata.title,
          datePublished: post.metadata.publishedAt,
          description: post.metadata.summary,
          image: getSocialImageUrl(
            post.metadata.image,
            post.metadata.title,
            writingIndex.eyebrow
          ),
          url: getPostCanonicalUrl(post),
          ...(post.metadata.medium ? { sameAs: post.metadata.medium } : {}),
        })}
      />
      <article className={`${textColumnClassName} ${pageSectionClassName}`}>
        <PageHeader
          title={post.metadata.title}
          description={post.metadata.summary}
        >
          <WritingMeta publishedAt={post.metadata.publishedAt} />
        </PageHeader>
        <div className="prose">
          <CustomMDX source={post.content} />
        </div>
        {post.metadata.medium ? (
          <div className="mt-16">
            <CtaLink
              href={post.metadata.medium}
              aria-label="View on Medium, opens in a new tab"
            >
              View on Medium
            </CtaLink>
          </div>
        ) : null}
      </article>
    </>
  )
}

export default Writing
