import '../global.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from 'app/components/nav'
import Footer from 'app/components/footer'
import { JsonLd } from 'app/components/json-ld'
import { chromeLinkClassName } from 'app/components/link-styles'
import { cx } from 'app/lib/cx'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { locales } from 'app/lib/locale'
import { createPageMetadata } from 'app/lib/metadata'
import { buildPersonJsonLd } from 'app/lib/person'
import { site } from 'app/lib/site'
import { themeInitScript } from 'app/lib/theme'

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
  weight: ['400', '600'],
  display: 'swap',
  preload: true,
  variable: '--font-ibm-plex-mono',
})

export const dynamicParams = false

export const generateStaticParams = () =>
  locales.map((lang) => ({
    lang,
  }))

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const copy = await getDictionary()
  const title = `${site.name} | ${copy.jobTitle}`
  const page = createPageMetadata({
    locale,
    path: '/',
    title,
    description: copy.home.description,
    markdownPath: '/index',
  })

  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description: page.description,
    alternates: page.alternates,
    openGraph: page.openGraph,
    twitter: page.twitter,
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
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return (
    <html
      lang={locale}
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
        <JsonLd data={buildPersonJsonLd(locale)} />
        <link rel="describedby" href="/llms.txt" />
      </head>
      <body
        suppressHydrationWarning
        className="relative isolate min-h-dvh w-full antialiased"
      >
        <div aria-hidden="true" className="site-noise" />
        <div className="flex min-h-dvh w-full flex-col gap-2 px-4 pb-[max(2.5rem,calc(1rem+env(safe-area-inset-bottom)))] sm:px-6 sm:pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))]">
          <a href="#main-content" className={`skip-link ${chromeLinkClassName}`}>
            {copy.skip}
          </a>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <Navbar
              locale={locale}
              copy={{
                primary: copy.nav.primary,
                craft: copy.nav.craft,
                notes: copy.nav.notes,
                about: copy.nav.about,
                brand: copy.nav.brand,
                menu: copy.nav.menu,
                close: copy.nav.close,
                language: copy.footer.language,
                theme: copy.theme,
              }}
            />
            <main
              id="main-content"
              tabIndex={-1}
              className="mt-16 flex min-h-0 min-w-0 flex-1 flex-col focus:outline-none"
            >
              {children}
            </main>
          </div>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
