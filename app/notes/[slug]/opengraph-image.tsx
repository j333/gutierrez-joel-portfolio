import { createEntryOgImage, ogContentType, ogImageSize } from '../../og/card'
import type { SlugPageProps } from 'app/lib/params'
import { notesIndex, site } from 'app/lib/site'
import { getWritingPostBySlug } from 'app/notes/utils'

export const alt = `${notesIndex.title} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const post = getWritingPostBySlug(slug)

  return createEntryOgImage({
    eyebrow: notesIndex.eyebrow,
    title: post?.metadata.title,
  })
}

export default Image
