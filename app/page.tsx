import { ProjectCard, projectGridClassName } from 'app/components/project-card'
import {
  PageHeader,
  pageSectionClassName,
  pageSectionTitleClassName,
  pageStackClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { getProjects } from 'app/projects/utils'

export const dynamic = 'force-static'

const Page = () => {
  const projects = getProjects()

  return (
    <div className={`${pageStackClassName} ${pageSectionClassName}`}>
      <div className={textColumnClassName}>
        <PageHeader
          title="Gutiérrez Joel"
          description={
            <>
              I&apos;m a{' '}
              <em className="font-normal italic">product designer</em> with over
              a decade of experience in product strategy, design systems, design
              leadership, and UX.
            </>
          }
          spacing="none"
        />
      </div>
      <section
        aria-labelledby="home-projects-heading"
        className="flex flex-col gap-8"
      >
        <h2
          id="home-projects-heading"
          className={pageSectionTitleClassName}
        >
          Projects
        </h2>
        <div className={projectGridClassName}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} heading="h3" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Page
