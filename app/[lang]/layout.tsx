import '../global.css'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from 'app/components/nav'
import Footer from 'app/components/footer'
import { Assistant } from 'app/components/assistant/assistant-panel'
import { getAssistantCatalog } from 'app/lib/assistant/catalog'
import { AssistantProvider } from 'app/components/assistant/assistant-context'
import { AssistantShell } from 'app/components/assistant/assistant-shell'
import { AssistantFloatingTrigger } from 'app/components/assistant/assistant-floating-trigger'
import { TextSelectionTooltip } from 'app/components/assistant/text-selection-tooltip'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
}

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
  const catalog = getAssistantCatalog(locale)

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
        <AssistantProvider>
          <div aria-hidden="true" className="site-noise" />
          <AssistantShell>
            <a href="#main-content" className={`skip-link ${chromeLinkClassName}`}>
              {copy.skip}
            </a>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <Navbar
                locale={locale}
                copy={{
                  primary: copy.nav.primary,
                  home: copy.nav.home,
                  craft: copy.nav.craft,
                  notes: copy.nav.notes,
                  about: copy.nav.about,
                  brand: copy.nav.brand,
                  menu: copy.nav.menu,
                  close: copy.nav.close,
                  assistant: copy.assistant.open,
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
          </AssistantShell>
          <Assistant locale={locale} copy={copy.assistant} catalog={catalog} />
          <AssistantFloatingTrigger label={copy.assistant.open} />
          <TextSelectionTooltip
            label={copy.assistant.ask}
            question={copy.assistant.selectionQuestion}
          />
          <Analytics />
        </AssistantProvider>
      </body>
    </html>
  )
}

export default RootLayout
