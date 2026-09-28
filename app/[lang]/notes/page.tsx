import { WritingPosts } from 'app/components/writing'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { createPageMetadata } from 'app/lib/metadata'
import { notesIndex, site } from 'app/lib/site'

export const metadata = createPageMetadata({
  title: notesIndex.title,
  description: notesIndex.description,
  canonical: `${site.url}${notesIndex.path}`,
})

const Page = () => {
  return (
    <div className={pageSectionClassName}>
      <div className={textColumnClassName}>
        <PageHeader
          title={notesIndex.title}
          description={notesIndex.intro}
          spacing="section"
        />
      </div>
      <WritingPosts />
    </div>
  )
}

export default Page
