import { ProjectCard, projectGridClassName } from 'app/components/project-card'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { getProjects } from 'app/projects/utils'
import { workIndex } from 'app/lib/site'

export const dynamic = 'force-static'

const Page = () => {
  const projects = getProjects()

  return (
    <div className={pageSectionClassName}>
      <div className={textColumnClassName}>
        <PageHeader
          title={workIndex.title}
          description={workIndex.intro}
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
