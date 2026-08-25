import { createOgImage, ogContentType, ogImageSize } from '../og/card'

export const alt = 'Writing by Joel Gutiérrez'
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    eyebrow: 'WRITING',
    title: 'Writing',
    subtitle: 'Notes on design, product, and the ideas that stick.',
    footer: 'Joel Gutiérrez',
  })

export default Image
