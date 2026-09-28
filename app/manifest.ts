import type { MetadataRoute } from 'next'
import { dictionaries } from 'app/lib/i18n'
import { site } from 'app/lib/site'

const manifest = (): MetadataRoute.Manifest => {
  return {
    name: site.name,
    short_name: site.name,
    description: dictionaries.en.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

export default manifest
