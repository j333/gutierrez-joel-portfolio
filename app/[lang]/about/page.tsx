import { BrandLogos } from 'app/components/brand-logos'
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
import { fullWidthImageSizes } from 'app/lib/image-sizes'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { localePath } from 'app/lib/locale'
import { createPageMetadata, createProfilePageJsonLd } from 'app/lib/metadata'
import { getPublicImageSize } from 'app/lib/public-image'
import { site } from 'app/lib/site'
import Image from 'next/image'
import type { ReactNode } from 'react'

const portraitSrc = '/about/gutierrez-joel.webp'

export const dynamic = 'force-static'

export const generateMetadata = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return createPageMetadata({
    locale,
    path: '/about',
    title: copy.about.title,
    description: copy.about.description,
    markdownPath: '/about',
  })
}

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

const Page = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()
  const portrait = getPublicImageSize(portraitSrc)

  return (
    <>
      <JsonLd
        data={createProfilePageJsonLd(
          `${site.url}${localePath(locale, '/about')}`
        )}
      />
      <div className={`w-full ${pageSectionClassName}`}>
        <PageHeader
          title={copy.about.heading}
          description={copy.about.intro}
          spacing="section"
        />

        <div className={`${pageSectionClassName} ${textColumnClassName} space-y-4`}>
          {copy.about.bio.map((paragraph, index) => (
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
            <AboutSection title={copy.about.experience}>
              <ExperiencePosts heading="h3" />
            </AboutSection>

            <AboutSection title={copy.about.education}>
              <ul className="flex w-full flex-col">
                <li className="flex w-full items-start justify-between gap-3 py-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
                      {copy.about.degree}
                    </h3>
                    <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                      {site.school}
                    </p>
                  </div>
                  <YearRange
                    start={site.educationStart}
                    end={site.educationEnd}
                    className="shrink-0 pt-0.5 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400"
                  />
                </li>
              </ul>
            </AboutSection>
          </div>

          <div className={`${pageStackClassName} 2xl:contents`}>
            <AboutSection title={copy.about.capabilities}>
              <ul className={aboutListClassName}>
                {copy.about.skills.map((skill) => (
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
              <AboutSection title={copy.about.stack}>
                <ul className={aboutListClassName}>
                  {site.stack.map((tool) => (
                    <li
                      key={tool}
                      className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-pretty text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                  {copy.about.stackNote}
                </p>
              </AboutSection>

              <AboutSection title={copy.about.languages}>
                <ul className={aboutListClassName}>
                  {copy.about.languageList.map((language) => (
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

        <BrandLogos
          label={copy.home.workedWith.label}
          years={copy.home.workedWith.years}
          className={`mt-16 ${pageSectionClassName}`}
        />

        {portrait ? (
          <Image
            src={portraitSrc}
            alt={copy.about.portraitAlt}
            width={portrait.width}
            height={portrait.height}
            sizes={fullWidthImageSizes}
            className={`${pageSectionClassName} h-auto w-full rounded-none`}
          />
        ) : null}
      </div>
    </>
  )
}

export default Page
