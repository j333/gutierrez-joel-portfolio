import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { CtaLink } from 'app/components/cta-link'
import { JsonLd } from 'app/components/json-ld'
import { WritingMeta } from 'app/components/writing-meta'
import {
  PageHeader,
  articleBodyClassName,
  pageSectionClassName,
} from 'app/components/page-layout'
import {
  fullWidthImageSizes,
  imagePlaceholderClassName,
} from 'app/lib/image-sizes'
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
  getWritingPostImage,
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

  const image = getWritingPostImage(post)
  const { title, publishedAt, summary } = post.metadata

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
      <article className={pageSectionClassName}>
        <PageHeader
          title={title}
          description={summary}
          spacing="hero"
        >
          <WritingMeta publishedAt={publishedAt} />
        </PageHeader>
        {image ? (
          <div
            className={`relative mb-14 aspect-video w-full overflow-hidden ${imagePlaceholderClassName}`}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes={fullWidthImageSizes}
              quality={100}
              unoptimized
              className="rounded-none object-cover"
              priority
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={`mb-14 aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        <div className={`${articleBodyClassName} prose`}>
          <CustomMDX source={post.content} />
        </div>
        {post.metadata.medium ? (
          <div className={`mt-16 ${articleBodyClassName}`}>
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
