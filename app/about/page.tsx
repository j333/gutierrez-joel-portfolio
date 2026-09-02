import { ExperiencePosts } from 'app/components/experience'
import {
  PageHeader,
  pageSectionClassName,
  sectionHeadingClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import { YearRange } from 'app/components/year-range'
import { JsonLd } from 'app/components/json-ld'
import {
  aboutBio,
  aboutEducation,
  aboutLanguages,
  aboutSkills,
  aboutStack,
  aboutStackNote,
} from 'app/lib/about-data'
import { createPageMetadata, createProfilePageJsonLd } from 'app/lib/metadata'
import { buildPersonEntity } from 'app/lib/person'
import { aboutIndex, site } from 'app/lib/site'
import type { ReactNode } from 'react'

export const dynamic = 'force-static'

export const metadata = createPageMetadata({
  title: aboutIndex.title,
  description: aboutIndex.description,
  canonical: `${site.url}${aboutIndex.path}`,
  markdownUrl: `${site.url}/about.md`,
})

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
    <>
      <JsonLd
        data={createProfilePageJsonLd(
          `${site.url}${aboutIndex.path}`,
          buildPersonEntity()
        )}
      />
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
            {aboutBio[0]}
          </p>
          <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
            {aboutBio[1]}
          </p>
          <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
            {aboutBio[2]}
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
                        {aboutEducation.degree}
                      </h3>
                      <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                        {aboutEducation.school}
                      </p>
                    </div>
                    <YearRange
                      start={aboutEducation.start}
                      end={aboutEducation.end}
                    />
                  </div>
                </li>
              </ul>
            </AboutSection>
          </div>

          <div className={textColumnClassName}>
            <AboutSection title="Capabilities">
              <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
                {aboutSkills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </AboutSection>

            <AboutSection title="Stack">
              <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
                {aboutStack.map((tool) => (
                  <li
                    key={tool}
                    className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-pretty text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                {aboutStackNote}
              </p>
            </AboutSection>

            <AboutSection title="Languages">
              <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
                {aboutLanguages.map((language) => (
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
    </>
  )
}

export default Page
