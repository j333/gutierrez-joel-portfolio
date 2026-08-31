import './global.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { JsonLd } from './components/json-ld'
import { chromeLinkClassName } from './components/link-styles'
import { cx } from './lib/cx'
import { personJsonLd, site, siteTitle } from './lib/site'
import { themeInitScript } from './lib/theme'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  variable: '--font-ibm-plex-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  display: 'swap',
  preload: true,
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: siteTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: siteTitle,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(
        'font-sans text-black bg-white dark:text-white dark:bg-black',
        ibmPlexSans.className,
        ibmPlexSans.variable,
        ibmPlexMono.variable
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
        <JsonLd data={personJsonLd} />
      </head>
      <body className="mx-auto flex min-h-dvh w-full max-w-site flex-col gap-2 px-6 pb-4 antialiased">
        <a href="#main-content" className={`skip-link ${chromeLinkClassName}`}>
          Skip to main content
        </a>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="mt-16 flex min-h-0 min-w-0 flex-1 flex-col focus:outline-none"
          >
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout
