import { BrandLogos } from 'app/components/brand-logos'
import { ExperiencePosts } from 'app/components/experience'
import {
  PageHeader,
  pageSectionClassName,
  pageStackClassName,
  sectionHeadingClassName,
  textColumnClassName,
} from 'app/components/page-layout'
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

const aboutListClassName = 'grid grid-cols-2 gap-y-2 sm:grid-cols-3'

// The grid gutter (gap-x-8) matches the nav and footer grids, so column left
// edges sit on the chrome axes. Right padding inside each column widens the
// visible gutter between texts to a full section gap without moving those axes.
const aboutColumnClassName = `${textColumnClassName} lg:pr-8`

const AboutSection = ({ title, children }: AboutSectionProps) => (
  <section className={aboutColumnClassName}>
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

        <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8">
          <AboutSection title={copy.about.experience}>
            <ExperiencePosts heading="h3" />
          </AboutSection>

          <div className={pageStackClassName}>
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
            </AboutSection>
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
