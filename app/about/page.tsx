import { ExperiencePosts } from 'app/components/experience'
import {
  PageHeader,
  pageSectionClassName,
  pageStackClassName,
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

const aboutListClassName =
  'grid grid-cols-2 gap-y-2 sm:grid-cols-3 2xl:grid-cols-1'

const AboutSection = ({ title, children }: AboutSectionProps) => (
  <section className={textColumnClassName}>
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
      <div className={`w-full ${pageSectionClassName}`}>
        <PageHeader
          title={aboutIndex.heading}
          description={aboutIndex.intro}
          spacing="section"
        />

        <div className={`${pageSectionClassName} ${textColumnClassName} space-y-4`}>
          {aboutBio.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? 'text-lg leading-relaxed text-neutral-800 dark:text-neutral-200'
                  : 'text-base leading-relaxed text-neutral-600 dark:text-neutral-400'
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-6 2xl:grid-cols-4">
          <div className={`${pageStackClassName} 2xl:contents`}>
            <AboutSection title="Experience">
              <ExperiencePosts heading="h3" />
            </AboutSection>

            <AboutSection title="Education">
              <ul className="space-y-8">
                <li>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
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

          <div className={`${pageStackClassName} 2xl:contents`}>
            <AboutSection title="Capabilities">
              <ul className={aboutListClassName}>
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

            <div className={`${pageStackClassName} ${textColumnClassName}`}>
              <AboutSection title="Stack">
                <ul className={aboutListClassName}>
                  {aboutStack.map((tool) => (
                    <li
                      key={tool}
                      className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-pretty text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                  {aboutStackNote}
                </p>
              </AboutSection>

              <AboutSection title="Languages">
                <ul className={aboutListClassName}>
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
      </div>
    </>
  )
}

export default Page
