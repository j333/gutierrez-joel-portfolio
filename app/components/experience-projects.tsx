import { YearRange } from 'app/components/year-range'
import { metaLabelClassName } from 'app/components/page-layout'
import type {
  ExperienceProject,
  ExperienceProjectGroup,
} from 'app/experience/projects'

const YEAR_HEADER = 'Year'
const PROJECT_HEADER = 'Project'

const yearCellClassName =
  'font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

const headerClassName = `pb-2 ${metaLabelClassName}`

const bodyRowClassName =
  'border-b border-neutral-200 last:border-b-0 dark:border-neutral-800'

const projectKey = (project: ExperienceProject) =>
  `${project.brand}-${project.name}-${project.startedAt}-${project.endedAt}`

const formatYearRange = (start: string, end: string) =>
  start === end ? end : `${start}-${end}`

const getYearColumnCh = (groups: ExperienceProjectGroup[]) =>
  Math.max(
    YEAR_HEADER.length,
    ...groups.flatMap((group) =>
      group.projects.map((project) =>
        formatYearRange(project.startedAt, project.endedAt).length
      )
    )
  )

type ExperienceProjectsProps = {
  groups: ExperienceProjectGroup[]
  heading?: string
  className?: string
}

export const ExperienceProjects = ({
  groups,
  heading,
  className,
}: ExperienceProjectsProps) => {
  if (groups.length === 0) {
    return null
  }

  const yearColumnCh = getYearColumnCh(groups)
  const yearColumnStyle = { width: `${yearColumnCh}ch` }

  return (
    <section className={className} aria-label={heading ?? 'Client work'}>
      {heading ? (
        <h2 className="mb-8 text-xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
          {heading}
        </h2>
      ) : null}
      <div className="space-y-12">
        {groups.map((group) => (
          <div key={group.name}>
            <h3 className="mb-4 text-base font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
              {group.url ? (
                <a
                  href={group.url}
                  className="content-link w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${group.name}, opens in a new tab`}
                >
                  {group.name}
                </a>
              ) : (
                group.name
              )}
            </h3>
            <table className="experience-projects-table w-full table-fixed border-collapse text-left font-mono text-xs">
              <colgroup>
                <col />
                <col style={yearColumnStyle} />
              </colgroup>
              <thead>
                <tr className="border-b border-neutral-300 dark:border-neutral-600">
                  <th className={`${headerClassName} pr-4`}>{PROJECT_HEADER}</th>
                  <th
                    className={`${headerClassName} text-right`}
                    style={yearColumnStyle}
                  >
                    {YEAR_HEADER}
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.projects.map((project) => (
                  <tr key={projectKey(project)} className={bodyRowClassName}>
                    <td className="py-2 pr-4 align-baseline font-sans text-pretty text-sm leading-5 text-neutral-800 dark:text-neutral-200">
                      {project.name}
                    </td>
                    <td
                      className="py-2 align-baseline whitespace-nowrap text-right"
                      style={yearColumnStyle}
                    >
                      <YearRange
                        start={project.startedAt}
                        end={project.endedAt}
                        className={yearCellClassName}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  )
}
