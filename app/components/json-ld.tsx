import { toJsonLd } from 'app/lib/escape'

type JsonLdProps = {
  data: unknown
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    suppressHydrationWarning
    dangerouslySetInnerHTML={{
      __html: toJsonLd(data),
    }}
  />
)
