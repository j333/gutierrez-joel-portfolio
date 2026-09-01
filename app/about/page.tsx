import { ExperiencePosts } from 'app/components/experience'
import {
  PageHeader,
  pageSectionClassName,
  sectionHeadingClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { YearRange } from 'app/components/year-range'
import { createPageMetadata } from 'app/lib/metadata'
import { aboutIndex, site } from 'app/lib/site'
import type { ReactNode } from 'react'

export const dynamic = 'force-static'

export const metadata = createPageMetadata({
  title: aboutIndex.title,
  description: aboutIndex.description,
  canonical: `${site.url}${aboutIndex.path}`,
})

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

type AboutSectionProps = {
  title: string
  children: ReactNode
}

const AboutSection = ({ title, children }: AboutSectionProps) => (
  <section className={pageSectionClassName}>
    <h2 className={sectionHeadingClassName}>{title}</h2>
    {children}
  </section>
)

const Page = () => {
  return (
    <div className="w-full">
      <PageHeader
        title={aboutIndex.title}
        description={aboutIndex.intro}
        spacing="hero"
      />

      <div
        className={`${pageSectionClassName} ${textColumnClassName} space-y-4`}
      >
        <p className="text-xl leading-[1.3] text-neutral-800 dark:text-neutral-200">
          I am Joel, a product designer with over a decade of experience in
          product strategy, design systems, design leadership, and UX.
        </p>
        <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
          I have worked with teams across healthcare, insurance, retail, and
          SaaS on how to better understand their users, leverage design to turn
          that into products worth shipping, and keep the work tied to the
          business.
        </p>
        <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
          I have always loved building digital products, and keep that at the
          center of my professional world.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-16">
        <div className={textColumnClassName}>
          <AboutSection title="Experience">
            <ExperiencePosts heading="h3" />
          </AboutSection>

          <AboutSection title="Education">
            <ul className="space-y-8">
              <li>
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                      Graphic Design
                    </h3>
                    <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                      Universidad Nacional de Cuyo
                    </p>
                  </div>
                  <YearRange start="2008" end="2013" />
                </div>
              </li>
            </ul>
          </AboutSection>
        </div>

        <div className={textColumnClassName}>
          <AboutSection title="Capabilities">
            <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </AboutSection>

          <AboutSection title="Languages">
            <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
              {languages.map((language) => (
                <li
                  key={language}
                  className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
                >
                  {language}
                </li>
              ))}
            </ul>
          </AboutSection>
        </div>
      </div>
    </div>
  )
}

export default Page
