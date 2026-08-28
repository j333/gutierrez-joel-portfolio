import { createEntryOgImage, ogContentType, ogImageSize } from '../../og/card'
import type { SlugPageProps } from 'app/lib/params'
import { site, writingIndex } from 'app/lib/site'
import { getWritingPostBySlug } from 'app/writing/utils'

export const alt = `${writingIndex.title} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const post = getWritingPostBySlug(slug)

  return createEntryOgImage({
    eyebrow: writingIndex.eyebrow,
    title: post?.metadata.title,
  })
}

export default Image
