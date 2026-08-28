import { createOgImage, ogContentType, ogImageSize } from '../og/card'
import { site, writingIndex } from 'app/lib/site'

export const alt = `${writingIndex.title} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    eyebrow: writingIndex.eyebrow,
    title: writingIndex.title,
    subtitle: writingIndex.intro,
    footer: site.name,
  })

export default Image
