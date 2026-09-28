import { WritingPosts } from 'app/components/writing'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { createPageMetadata } from 'app/lib/metadata'

export const dynamic = 'force-static'

export const generateMetadata = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return createPageMetadata({
    locale,
    path: '/notes',
    title: copy.notes.title,
    description: copy.notes.description,
  })
}

const Page = async () => {
  const copy = await getDictionary()

  return (
    <div className={pageSectionClassName}>
      <div className={textColumnClassName}>
        <PageHeader
          title={copy.notes.title}
          description={copy.notes.intro}
          spacing="section"
        />
      </div>
      <WritingPosts />
    </div>
  )
}

export default Page
