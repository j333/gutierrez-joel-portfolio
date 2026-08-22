import { createOgImage, ogContentType, ogImageSize } from './og/card'

export const alt = 'Joel Gutiérrez, Product Design Manager'
export const size = ogImageSize
export const contentType = ogContentType

const Image = () =>
  createOgImage({
    title: 'Joel Gutiérrez',
    subtitle: 'Product Design Manager',
  })

export default Image
