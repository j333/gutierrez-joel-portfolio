import { createOgImage, ogContentType, ogImageSize } from '../og/card'

export const alt = 'Experience by Joel Gutiérrez'
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    eyebrow: 'EXPERIENCE',
    title: 'Experience',
    subtitle: 'Selected work across product, systems, and brand.',
    footer: 'Joel Gutiérrez',
  })

export default Image
