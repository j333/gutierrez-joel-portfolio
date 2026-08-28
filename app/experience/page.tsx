import { ExperiencePosts } from 'app/components/experience'
import { PageHeader } from 'app/components/page-layout'
import { createPageMetadata } from 'app/lib/metadata'
import { experienceIndex, site } from 'app/lib/site'

export const metadata = createPageMetadata({
  title: experienceIndex.title,
  description: experienceIndex.description,
  canonical: `${site.url}${experienceIndex.path}`,
})

const Page = () => {
  return (
    <>
      <PageHeader
        title={experienceIndex.title}
        description={experienceIndex.description}
      />
      <div className="mb-16">
        <ExperiencePosts />
      </div>
    </>
  )
}

export default Page
