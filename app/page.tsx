import { ProjectCard, projectGridClassName } from 'app/components/project-card'
import { textColumnClassName } from 'app/components/page-layout'
import { getProjects } from 'app/projects/utils'

export const dynamic = 'force-static'

const Page = () => {
  const projects = getProjects()

  return (
    <div className="flex flex-col gap-16">
      <p
        className={`${textColumnClassName} text-xl leading-[1.3] text-neutral-800 dark:text-neutral-200`}
      >
        I&apos;m a{' '}
        <em className="font-normal italic">product designer</em> with over a
        decade of experience in product strategy, design systems, design
        leadership, and UX.
      </p>
      <div className={projectGridClassName} aria-label="Project case studies">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}

export default Page
