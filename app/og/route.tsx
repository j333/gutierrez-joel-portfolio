import { createOgImage } from './card'

const DEFAULT_TITLE = 'Joel Gutiérrez'
const DEFAULT_SUBTITLE = 'Product Design Manager'
const MAX_TITLE_LENGTH = 120
const MAX_SUBTITLE_LENGTH = 160
const MAX_EYEBROW_LENGTH = 40
const MAX_FOOTER_LENGTH = 80

const readParam = (value: string | null, maxLength: number) => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim().slice(0, maxLength)
  return trimmed || undefined
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const title = readParam(url.searchParams.get('title'), MAX_TITLE_LENGTH) || DEFAULT_TITLE
  const subtitle =
    readParam(url.searchParams.get('subtitle'), MAX_SUBTITLE_LENGTH) ||
    (title === DEFAULT_TITLE ? DEFAULT_SUBTITLE : undefined)
  const eyebrow = readParam(url.searchParams.get('eyebrow'), MAX_EYEBROW_LENGTH)
  const footer = readParam(url.searchParams.get('footer'), MAX_FOOTER_LENGTH)

  const image = createOgImage({
    title,
    subtitle,
    eyebrow,
    footer,
  })

  image.headers.set(
    'Cache-Control',
    'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
  )

  return image
}
