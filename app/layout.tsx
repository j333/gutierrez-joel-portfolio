import './global.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { chromeLinkClassName } from './components/link-styles'
import { toJsonLd } from './lib/escape'
import { themeInitScript } from './lib/theme'
import { baseUrl } from './sitemap'

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

const siteTitle = 'Joel Gutiérrez | Product Design Manager'
const siteDescription =
  'Product Design Manager with experience in SaaS and AI-driven products for global teams. Specialized in product strategy and UX/UI design.'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joel Gutiérrez',
  jobTitle: 'Product Design Manager',
  url: baseUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mendoza',
    addressCountry: 'Argentina',
  },
  sameAs: [
    'https://linkedin.com/in/gutierrezjoel',
    'https://github.com/j333',
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteTitle,
    template: '%s | Joel Gutiérrez',
  },
  description: siteDescription,
  alternates: {
    canonical: 'https://www.gutierrezjoel.com',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: baseUrl,
    siteName: 'Joel Gutiérrez',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
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

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: toJsonLd(personJsonLd),
          }}
        />
      </head>
      <body className="antialiased mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
        <a href="#main-content" className={`skip-link ${chromeLinkClassName}`}>
          Skip to main content
        </a>
        <div className="flex min-w-0 flex-auto flex-col">
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex min-w-0 flex-auto flex-col focus:outline-none"
          >
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
