import { ImageResponse } from 'next/og'

const DEFAULT_TITLE = 'Joel Gutiérrez'
const MAX_TITLE_LENGTH = 120

export function GET(request: Request) {
  let url = new URL(request.url)
  let rawTitle = url.searchParams.get('title') || DEFAULT_TITLE
  let title = rawTitle.slice(0, MAX_TITLE_LENGTH)

  let image = new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
            {title}
          </h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )

  image.headers.set(
    'Cache-Control',
    'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
  )

  return image
}
