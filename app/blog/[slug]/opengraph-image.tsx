import { getBlogPosts } from 'app/blog/utils'
import { createOgImage, ogContentType, ogImageSize } from '../../og/card'

export const alt = 'Writing by Joel Gutiérrez'
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const post = getBlogPosts().find((entry) => entry.slug === slug)

  if (!post) {
    return createOgImage({
      eyebrow: 'WRITING',
      title: 'Joel Gutiérrez',
      footer: 'gutierrezjoel.com',
    })
  }

  return createOgImage({
    eyebrow: 'WRITING',
    title: post.metadata.title,
    footer: 'Joel Gutiérrez',
  })
}

export default Image
