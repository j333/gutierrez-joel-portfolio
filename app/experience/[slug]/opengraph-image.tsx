import { getExperienceBySlug } from 'app/experience/utils'
import { createEntryOgImage, ogContentType, ogImageSize } from '../../og/card'
import type { SlugPageProps } from 'app/lib/params'
import { experienceIndex, site } from 'app/lib/site'

export const alt = `${experienceIndex.title} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const entry = getExperienceBySlug(slug)

  return createEntryOgImage({
    eyebrow: experienceIndex.eyebrow,
    title: entry?.metadata.title,
  })
}

export default Image
