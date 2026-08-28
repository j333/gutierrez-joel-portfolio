import { getWritingPosts } from 'app/writing/utils'
import { ExperiencePosts } from 'app/components/experience'
import { WritingPosts } from 'app/components/writing'
import { YearRange } from 'app/components/year-range'
import { CtaLink } from 'app/components/cta-link'
import { sectionHeadingClassName } from 'app/components/page-layout'
import { getExperience } from 'app/experience/utils'
import { site } from 'app/lib/site'
import type { ReactNode } from 'react'

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

const languages = ['English (C1)', 'Spanish (native)']

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

type HomeSectionProps = {
  title: string
  children: ReactNode
}

const HomeSection = ({ title, children }: HomeSectionProps) => (
  <section className="mb-16">
    <h2 className={sectionHeadingClassName}>{title}</h2>
    {children}
  </section>
)

const Page = () => {
  const experienceCount = getExperience().length
  const writingCount = getWritingPosts().length

  return (
    <>
      <header className="mb-16">
        <h1 className="mb-2 text-2xl font-semibold leading-8 tracking-tighter">
          {site.name}
        </h1>
        <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
          {site.jobTitle}
        </p>
        <div className="mt-16 space-y-6 text-base leading-6 text-neutral-800 dark:text-neutral-200">
          <p>
            With over a decade in the industry, I direct product design from{' '}
            <em className="italic">strategy</em> through{' '}
            <em className="italic">execution</em> for SaaS and enterprise
            companies. I work directly with engineering, marketing, and ops to
            ensure what we build moves the needle.
          </p>
          <p>
            I run my teams with clear standards and a strict focus on{' '}
            <em className="italic">business logic</em>. We use AI to accelerate
            testing and delivery, and we build{' '}
            <em className="italic">AI features</em> that give users smarter
            tools.
          </p>
          <p>
            I&apos;m currently working on experimental personal projects
            and am open to new opportunities.
          </p>
        </div>
      </header>

      {writingCount > 0 && (
        <HomeSection title="Latest writing">
          <WritingPosts limit={HOME_PREVIEW_LIMIT} heading="h3" />
          {renderViewAll(writingCount, '/writing', 'Writing')}
        </HomeSection>
      )}

      <HomeSection title="Latest experience">
        <ExperiencePosts limit={HOME_PREVIEW_LIMIT} heading="h3" />
        {renderViewAll(experienceCount, '/experience', 'Experience')}
      </HomeSection>

      <HomeSection title="Education">
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
      </HomeSection>

      <HomeSection title="Capabilities">
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
      </HomeSection>

      <HomeSection title="Languages">
        <ul className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
          {languages.map((language) => (
            <li
              key={language}
              className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
            >
              {language}
            </li>
          ))}
        </ul>
      </HomeSection>
    </>
  )
}

export default Page
