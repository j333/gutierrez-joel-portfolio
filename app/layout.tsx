import './global.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { toJsonLd } from './lib/escape'
import { baseUrl } from './sitemap'

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-geist-sans',
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

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        geistSans.className,
        geistSans.variable
      )}
    >
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: toJsonLd(personJsonLd),
          }}
        />
      </head>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
