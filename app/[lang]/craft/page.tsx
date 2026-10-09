import { ProjectCard, projectGridClassName } from 'app/components/project-card'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { createPageMetadata } from 'app/lib/metadata'
import { getListedProjects } from 'app/projects/utils'

export const dynamic = 'force-static'

export const generateMetadata = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return createPageMetadata({
    locale,
    path: '/craft',
    title: copy.craft.title,
    description: copy.craft.description,
    markdownPath: '/craft',
  })
}

const Page = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()
  const projects = getListedProjects(locale)

  return (
    <div className={pageSectionClassName}>
      <div className={textColumnClassName}>
        <PageHeader
          title={copy.craft.title}
          description={copy.craft.intro}
          spacing="section"
        />
      </div>
      <div className={projectGridClassName}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} heading="h2" />
        ))}
      </div>
    </div>
  )
}

export default Page
