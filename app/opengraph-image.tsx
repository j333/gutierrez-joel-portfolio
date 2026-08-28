import { createOgImage, ogContentType, ogImageSize } from './og/card'
import { site } from './lib/site'

export const alt = `${site.name}, ${site.jobTitle}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    title: site.name,
    subtitle: site.jobTitle,
  })

export default Image
