import { WritingPosts } from 'app/components/writing'
import { PageHeader } from 'app/components/page-layout'
import { createPageMetadata } from 'app/lib/metadata'
import { site, writingIndex } from 'app/lib/site'

export const metadata = createPageMetadata({
  title: writingIndex.title,
  description: writingIndex.description,
  canonical: `${site.url}${writingIndex.path}`,
})

const Page = () => {
  return (
    <>
      <PageHeader
        title={writingIndex.title}
        description={writingIndex.intro}
      />
      <div className="mb-16">
        <WritingPosts />
      </div>
    </>
  )
}

export default Page
