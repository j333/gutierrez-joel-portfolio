import { createOgImage, ogContentType, ogImageSize } from '../og/card'
import { experienceIndex, site } from 'app/lib/site'

export const alt = `${experienceIndex.title} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    eyebrow: experienceIndex.eyebrow,
    title: experienceIndex.title,
    subtitle: experienceIndex.description,
    footer: site.name,
  })

export default Image
