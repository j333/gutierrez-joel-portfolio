import { DesignSystemView } from 'app/components/design-system-view'
import { applyDesignGuideCopy } from 'app/lib/design-guide'
import { readDesignRule } from 'app/lib/design-rule'
import { getLocale } from 'app/lib/i18n'
import { createPageMetadata } from 'app/lib/metadata'

export const dynamic = 'force-static'

const pageTitle = 'Design system'
const pageDescription =
  'A living reference for color, type, space, and quiet interaction across the portfolio.'

export const generateMetadata = async () => {
  const locale = await getLocale()
  const metadata = createPageMetadata({
    locale,
    path: '/design',
    title: pageTitle,
    description: pageDescription,
  })

  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  }
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
