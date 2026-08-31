import { WritingPosts } from 'app/components/writing'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { createPageMetadata } from 'app/lib/metadata'
import { site, writingIndex } from 'app/lib/site'

export const metadata = createPageMetadata({
  title: writingIndex.title,
  description: writingIndex.description,
  canonical: `${site.url}${writingIndex.path}`,
})

const Page = () => {
  return (
    <div className={textColumnClassName}>
      <PageHeader
        title={writingIndex.title}
        description={writingIndex.intro}
        spacing="section"
      />
      <div className={pageSectionClassName}>
        <WritingPosts />
      </div>
    </div>
  )
}

export default Page
