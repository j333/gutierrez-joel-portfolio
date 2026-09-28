import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { CtaLink } from 'app/components/cta-link'
import { JsonLd } from 'app/components/json-ld'
import { WritingMeta } from 'app/components/writing-meta'
import {
  PageHeader,
  articleBodyClassName,
  articleCoverClassName,
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
import { getDictionary } from 'app/lib/i18n'
import { isLocale, locales } from 'app/lib/locale'
import {
  getPostCanonicalUrl,
  getWritingPostBySlug,
  getWritingPostImage,
  getWritingPosts,
} from 'app/notes/utils'

export const generateStaticParams = async () =>
  locales.flatMap((lang) =>
    getWritingPosts('en').map((post) => ({
      lang,
      slug: post.slug,
    }))
  )

export const generateMetadata = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params

  if (!isLocale(lang)) {
    return
  }

  const post = getWritingPostBySlug(slug, lang)

  if (!post) {
    return
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = post.metadata

  return createPageMetadata({
    locale: lang,
    path: `/notes/${post.slug}`,
    title,
    description,
    markdownPath: `/notes/${post.slug}`,
    type: 'article',
    publishedTime,
  })
}

const Writing = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const copy = await getDictionary()
  const post = getWritingPostBySlug(slug, lang)

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
            copy.notes.eyebrow
          ),
          url: getPostCanonicalUrl(post, lang),
          ...(post.metadata.medium ? { sameAs: post.metadata.medium } : {}),
        })}
      />
      <article className={pageSectionClassName}>
        <PageHeader title={title} description={summary} spacing="article">
          <WritingMeta publishedAt={publishedAt} />
        </PageHeader>
        {image ? (
          <div
            className={`relative overflow-hidden ${articleCoverClassName} ${imagePlaceholderClassName}`}
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
            className={`${articleCoverClassName} ${imagePlaceholderClassName}`}
          />
        )}
        <div className={`${articleBodyClassName} prose`}>
          <CustomMDX source={post.content} />
        </div>
        {post.metadata.medium ? (
          <div className={`mt-16 ${articleBodyClassName}`}>
            <CtaLink
              href={post.metadata.medium}
              aria-label={copy.notes.mediumLabel}
            >
              {copy.notes.medium}
            </CtaLink>
          </div>
        ) : null}
      </article>
    </>
  )
}

export default Writing
