import { getExperience } from 'app/experience/utils'
import { createOgImage, ogContentType, ogImageSize } from '../../og/card'

export const alt = 'Experience by Joel Gutiérrez'
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const entry = getExperience().find((item) => item.slug === slug)

  if (!entry) {
    return createOgImage({
      eyebrow: 'EXPERIENCE',
      title: 'Joel Gutiérrez',
      footer: 'gutierrezjoel.com',
    })
  }

  return createOgImage({
    eyebrow: 'EXPERIENCE',
    title: entry.metadata.title,
    footer: 'Joel Gutiérrez',
  })
}

export default Image
