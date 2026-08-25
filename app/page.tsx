import { getWritingPosts } from 'app/writing/utils'
import { ExperiencePosts } from 'app/components/experience'
import { WritingPosts } from 'app/components/writing'
import { YearRange } from 'app/components/year-range'
import { CtaLink } from 'app/components/cta-link'
import { getExperience } from 'app/experience/utils'

export const dynamic = 'force-static'

const HOME_PREVIEW_LIMIT = 3

const skills = [
  'Product Design',
  'Product Strategy',
  'Team Leadership',
  'Design Systems',
  'AI Products',
  'UX Design',
  'User Research',
  'Branding',
]

const sectionHeadingClassName =
  'mb-6 font-mono text-xs font-normal uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400'

const renderViewAll = (count: number, href: string, sectionLabel: string) => {
  if (count <= HOME_PREVIEW_LIMIT) {
    return null
  }

  return (
    <div className="mt-8">
      <CtaLink href={href} aria-label={`View all ${sectionLabel.toLowerCase()}`}>
        View all
      </CtaLink>
    </div>
  )
}

export default function Page() {
  const experienceCount = getExperience().length
  const writingCount = getWritingPosts().length

  return (
    <>
      <header className="mb-16">
        <h1 className="mb-2 text-2xl font-semibold leading-8 tracking-tighter">
          Joel Gutiérrez
        </h1>
        <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
          Product Design Manager
        </p>
        <div className="mt-16 space-y-6 text-base leading-6 text-neutral-800 dark:text-neutral-200">
          <p>
            With over 12 years of experience designing{' '}
            <em className="italic">SaaS and AI-driven products</em> for global
            teams, I work closely with product and engineering to create
            experiences that support product decisions and business goals.
          </p>
          <p>
            Recently, I led the design of an AI-powered marketing content
            product for global audiences, with a focus on{' '}
            <em className="italic">speed, consistency, and quality</em>.
          </p>
          <p>
            I&apos;m currently working on experimental personal projects
            and am open to new opportunities.
          </p>
        </div>
      </header>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Experience</h2>
        <ExperiencePosts limit={HOME_PREVIEW_LIMIT} heading="h3" />
        {renderViewAll(experienceCount, '/experience', 'Experience')}
      </section>

      {writingCount > 0 && (
        <section className="mb-16">
          <h2 className={sectionHeadingClassName}>Writing</h2>
          <WritingPosts limit={HOME_PREVIEW_LIMIT} heading="h3" />
          {renderViewAll(writingCount, '/writing', 'Writing')}
        </section>
      )}

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Capabilities</h2>
        <ul className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
          {skills.map((skill) => (
            <li
              key={skill}
              className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Education</h2>
        <ul className="space-y-8">
          <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex flex-col">
              <h3 className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                Graphic Design
              </h3>
              <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                Universidad Nacional de Cuyo
              </p>
            </div>
            <YearRange start="2008" end="2013" />
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Languages</h2>
        <ul className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
          <li className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
            English (C1)
          </li>
          <li className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
            Spanish (native)
          </li>
        </ul>
      </section>
    </>
  )
}
