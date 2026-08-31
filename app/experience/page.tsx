import { ExperiencePosts } from 'app/components/experience'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { createPageMetadata } from 'app/lib/metadata'
import { experienceIndex, site } from 'app/lib/site'

export const metadata = createPageMetadata({
  title: experienceIndex.title,
  description: experienceIndex.description,
  canonical: `${site.url}${experienceIndex.path}`,
})

const Page = () => {
  return (
    <div className={textColumnClassName}>
      <PageHeader
        title={experienceIndex.title}
        description={experienceIndex.description}
        spacing="section"
      />
      <div className={pageSectionClassName}>
        <ExperiencePosts />
      </div>
    </div>
  )
}

export default Page
