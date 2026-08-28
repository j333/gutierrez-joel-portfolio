import { ImageResponse } from 'next/og'
import { site } from 'app/lib/site'
import { ogFonts } from './fonts'

export const ogImageSize = {
  width: 1200,
  height: 630,
}

export const ogContentType = 'image/png'

export type OgCardProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  footer?: string
}

const titleFontSize = (title: string) => {
  if (title.length > 80) {
    return 44
  }

  if (title.length > 48) {
    return 52
  }

  return 72
}

export const OgCard = ({ title, subtitle, eyebrow, footer }: OgCardProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        color: '#fff',
        padding: '72px 80px',
        fontFamily: 'IBM Plex Sans',
        border: '1px solid #262626',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#fff',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontSize: 22,
            letterSpacing: '0.04em',
            color: '#a3a3a3',
          }}
        >
          {site.host}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          width: '100%',
          maxWidth: 980,
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: 'flex',
              fontFamily: 'IBM Plex Mono',
              fontSize: 20,
              letterSpacing: '0.16em',
              color: '#737373',
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            width: '100%',
            fontSize: titleFontSize(title),
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginTop: 20,
              fontSize: 28,
              fontWeight: 400,
              color: '#a3a3a3',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {footer ? (
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontSize: 20,
            letterSpacing: '0.04em',
            color: '#737373',
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  )
}

export const createOgImage = (props: OgCardProps) => {
  return new ImageResponse(<OgCard {...props} />, {
    ...ogImageSize,
    fonts: ogFonts,
  })
}

export const createEntryOgImage = ({
  title,
  eyebrow,
}: {
  title?: string
  eyebrow: string
}) =>
  createOgImage({
    eyebrow,
    title: title ?? site.name,
    footer: title ? site.name : site.host,
  })
