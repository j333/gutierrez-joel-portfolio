import { createOgImage, ogContentType, ogImageSize } from '../og/card'
import { notesIndex, site } from 'app/lib/site'

export const alt = `${notesIndex.title} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    eyebrow: notesIndex.eyebrow,
    title: notesIndex.title,
    subtitle: notesIndex.intro,
    footer: site.name,
  })

export default Image
