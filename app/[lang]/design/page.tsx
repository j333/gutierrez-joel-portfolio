import { DesignSystemView } from 'app/components/design-system-view'
import { applyDesignGuideCopy } from 'app/lib/design-guide'
import { readDesignRule } from 'app/lib/design-rule'
import { site } from 'app/lib/site'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

const pageTitle = 'Design system'
const pageDescription =
  'A living reference for color, type, space, and quiet interaction across the portfolio.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: `${site.url}/design`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${site.url}/design`,
    siteName: site.name,
    locale: site.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
  },
}

const Page = () => {
  const designRule = applyDesignGuideCopy(readDesignRule())

  return (
    <DesignSystemView
      rule={designRule}
      title={pageTitle}
      description={pageDescription}
    />
  )
}

export default Page
