import { WritingPosts } from 'app/components/writing'
import { PageHeader, textColumnClassName } from 'app/components/page-layout'
import { createPageMetadata } from 'app/lib/metadata'
import { site, writingIndex } from 'app/lib/site'

export const metadata = createPageMetadata({
  title: writingIndex.title,
  description: writingIndex.description,
  canonical: `${site.url}${writingIndex.path}`,
})

const Page = () => {
  return (
    <div>
      <div className={textColumnClassName}>
        <PageHeader
          title={writingIndex.title}
          description={writingIndex.intro}
          spacing="hero"
        />
      </div>
      <WritingPosts />
    </div>
  )
}

export default Page
