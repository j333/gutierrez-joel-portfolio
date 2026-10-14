import Link from 'next/link'
import { ArrowIcon, rowArrowClassName } from 'app/components/arrow-icon'
import { BrandLogos } from 'app/components/brand-logos'
import { HomeActionLink } from 'app/components/home-action-link'
import { ScrambleTitle } from 'app/components/scramble-title'
import { GlitchCover } from 'app/components/glitch-cover'
import {
  metaLabelClassName,
  sectionTitleClassName,
} from 'app/components/page-layout'
import {
  homeFeaturedCaseSlugs,
  type HomeFeaturedCaseSlug,
} from 'app/lib/home-data'
import {
  imagePlaceholderClassName,
  projectCardImageSizes,
} from 'app/lib/image-sizes'
import type { Dictionary } from 'app/lib/dictionaries/en'
import { localePath, type Locale } from 'app/lib/locale'
import { site, socialLinks } from 'app/lib/site'
import {
  getProjectImage,
  projectImageQuality,
  type Project,
} from 'app/projects/utils'
import { getWritingPostImage, type WritingPost } from 'app/notes/utils'

type HomeLandingProps = {
  locale: Locale
  copy: Dictionary
  projects: Project[]
  notes: WritingPost[]
}

const sectionLabelClassName = metaLabelClassName
const sectionSubtitleClassName =
  'text-base leading-relaxed text-neutral-600 dark:text-neutral-400'

const formatHomeNoteDate = (date: string, locale: Locale, months: string[]) => {
  const value = date.includes('T') ? date : `${date}T00:00:00`
  const parsed = new Date(value)
  const month = months[parsed.getMonth()]?.toUpperCase() ?? ''

  return `${month} ${parsed.getFullYear()}`
}

const sectionFrameClassName =
  'flex w-full flex-col gap-8 pt-[120px] sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-x-6 sm:gap-y-8'

const sectionIntroClassName =
  'flex min-w-0 flex-col gap-1 sm:col-start-1 sm:row-start-1'

const sectionBodyClassName =
  'min-w-0 sm:col-span-2 sm:col-start-1 sm:row-start-2'

const sectionActionClassName = 'sm:col-start-2 sm:row-start-1'

const SectionIntro = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    <div className={sectionIntroClassName}>
      <h2 className={sectionTitleClassName}>{title}</h2>
      <p className={sectionSubtitleClassName}>{subtitle}</p>
    </div>
  )
}

export const HomeLanding = ({
  locale,
  copy,
  projects,
  notes,
}: HomeLandingProps) => {
  const craftHref = localePath(locale, '/craft')
  const aboutHref = localePath(locale, '/about')
  const notesHref = localePath(locale, '/notes')
  const contactHref = `mailto:${site.email}`
  const linkedIn =
    socialLinks.find((link) => link.name === 'LinkedIn')?.url ??
    'https://linkedin.com/in/gutierrezjoel'

  const projectsBySlug = new Map(projects.map((project) => [project.slug, project]))
  const featured = homeFeaturedCaseSlugs
    .map((slug) => {
      const project = projectsBySlug.get(slug)

      if (!project) {
        return null
      }

      return {
        slug: slug as HomeFeaturedCaseSlug,
        project,
        copy: copy.home.selectedWork.cases[slug],
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const [featuredCase, ...pairCases] = featured
  const previewNotes = notes.slice(0, 2)

  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full flex-col gap-10">
        <div className="flex w-full flex-col gap-4">
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-x-8">
            <h1 className="w-full max-w-[860px] text-balance text-[2rem] font-normal leading-[1.12] tracking-[-0.04em] text-black sm:text-4xl md:text-[3.25rem] lg:col-span-3 dark:text-white">
              {copy.home.headline}
            </h1>
            <div className="flex w-full min-w-0 flex-col gap-2.5 pb-1.5 lg:col-span-1 lg:pt-9">
              <p className={sectionLabelClassName}>{copy.home.nowLabel}</p>
              <p className="max-w-[65ch] text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {copy.home.now}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[576px] text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            {copy.home.intro}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <HomeActionLink href={craftHref}>
              {copy.home.viewCraft}
            </HomeActionLink>
            <HomeActionLink href={contactHref}>
              {copy.home.getInTouch}
            </HomeActionLink>
          </div>
        </div>
      </section>

      <BrandLogos
        label={copy.home.workedWith.label}
        years={copy.home.workedWith.years}
        className="pt-28"
      />

      <section className={sectionFrameClassName}>
        <SectionIntro
          title={copy.home.selectedWork.title}
          subtitle={copy.home.selectedWork.subtitle}
        />
        <div className={`flex w-full flex-col gap-8 ${sectionBodyClassName}`}>
          {featuredCase ? (
          <article className="flex w-full flex-col gap-3">
            <Link
              href={localePath(locale, `/${featuredCase.project.slug}`)}
              className="group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
            >
              {(() => {
                const image = getProjectImage(featuredCase.project)

                return image ? (
                  <GlitchCover
                    src={image.src}
                    alt={`${featuredCase.copy.title} — ${featuredCase.project.metadata.product}`}
                    width={image.width}
                    height={image.height}
                    sizes={projectCardImageSizes}
                    quality={projectImageQuality}
                    priority
                  />
                ) : null
              })()}
              <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white">
                  {featuredCase.copy.title}
                </h3>
                <span className="shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                  {featuredCase.copy.meta}
                </span>
              </div>
            </Link>
          </article>
          ) : null}
          {pairCases.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {pairCases.map((item) => {
              const image = getProjectImage(item.project)

              return (
                <article key={item.slug} className="min-w-0">
                  <Link
                    href={localePath(locale, `/${item.project.slug}`)}
                    className="group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
                  >
                    {image ? (
                      <GlitchCover
                        src={image.src}
                        alt={`${item.copy.title} — ${item.project.metadata.product}`}
                        width={image.width}
                        height={image.height}
                        sizes={projectCardImageSizes}
                        quality={projectImageQuality}
                      />
                    ) : null}
                    <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white">
                        {item.copy.title}
                      </h3>
                      <span className="shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                        {item.copy.meta}
                      </span>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
          ) : null}
        </div>
        <HomeActionLink href={craftHref} className={sectionActionClassName}>
          {copy.home.selectedWork.allCases}
        </HomeActionLink>
      </section>

      <section className="flex w-full flex-col gap-6 pt-[120px] sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-x-6 sm:gap-y-6">
        <h2 className={`${sectionTitleClassName} sm:col-start-1 sm:row-start-1`}>
          {copy.home.aboutTeaser.title}
        </h2>
        <div className={`flex w-full flex-col gap-6 ${sectionBodyClassName}`}>
          <p className="max-w-xl text-[1.375rem] font-normal leading-[1.45] tracking-[-0.025em] text-black dark:text-white">
            {copy.home.aboutTeaser.lead}
          </p>
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-8">
            <p className="text-base leading-relaxed text-neutral-600 lg:pr-8 dark:text-neutral-400">
              {copy.home.aboutTeaser.body}
            </p>
            <div className="flex w-full flex-col gap-3 pt-1.5">
              <p className={sectionLabelClassName}>
                {copy.home.aboutTeaser.previously}
              </p>
              <ul className="flex w-full flex-col">
                {copy.home.aboutTeaser.roles.map((role, index) => (
                  <li key={role.slug}>
                    <Link
                      href={localePath(locale, `/experience/${role.slug}`)}
                      className={`group flex w-full items-baseline justify-between gap-3 border-neutral-200 py-3 outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:focus-visible:outline-neutral-100 ${
                        index === 0 ? 'border-t-0' : 'border-t'
                      }`}
                    >
                      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                        <ScrambleTitle
                          text={role.company}
                          className="text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white"
                        />
                        <span className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                          {role.role}
                        </span>
                      </div>
                      <span className="flex shrink-0 items-baseline gap-2">
                        <span className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                          {role.years}
                        </span>
                        <ArrowIcon className={`${rowArrowClassName} self-center`} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <HomeActionLink href={aboutHref} className={sectionActionClassName}>
          {copy.home.aboutTeaser.more}
        </HomeActionLink>
      </section>

      <section className={sectionFrameClassName}>
        <SectionIntro
          title={copy.home.kindWords.title}
          subtitle={copy.home.kindWords.subtitle}
        />
        <div className={`grid w-full grid-cols-1 gap-12 border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:grid-cols-2 lg:grid-cols-3 ${sectionBodyClassName}`}>
          {copy.home.kindWords.quotes.map((item) => (
            <figure key={item.name} className="flex min-w-0 flex-col gap-5">
              <figcaption className="flex flex-col gap-0.5">
                <cite className="not-italic text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
                  {item.name}
                </cite>
                <p className="text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {item.role}
                </p>
              </figcaption>
              <blockquote className="max-w-[56ch] text-pretty text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                {item.quote}
              </blockquote>
            </figure>
          ))}
        </div>
        <HomeActionLink
          href={linkedIn}
          external
          className={sectionActionClassName}
        >
          {copy.home.kindWords.allOnLinkedIn}
        </HomeActionLink>
      </section>

      <section className={`${sectionFrameClassName} pb-[120px]`}>
        <SectionIntro
          title={copy.home.notesTeaser.title}
          subtitle={copy.home.notesTeaser.subtitle}
        />
        <div className={`grid w-full grid-cols-1 gap-6 lg:grid-cols-2 ${sectionBodyClassName}`}>
          {previewNotes.map((post) => {
            const image = getWritingPostImage(post)

            return (
              <article key={post.slug} className="min-w-0">
                <Link
                  href={localePath(locale, `/notes/${post.slug}`)}
                  className="group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
                >
                  {image ? (
                    <GlitchCover
                      src={image.src}
                      alt={post.metadata.title}
                      width={image.width}
                      height={image.height}
                      sizes={projectCardImageSizes}
                      quality={projectImageQuality}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className={`aspect-video w-full ${imagePlaceholderClassName}`}
                    />
                  )}
                  <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white">
                      {post.metadata.title}
                    </h3>
                    <time
                      dateTime={post.metadata.publishedAt}
                      className="shrink-0 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                      {formatHomeNoteDate(
                        post.metadata.publishedAt,
                        locale,
                        copy.months
                      )}
                    </time>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
        <HomeActionLink href={notesHref} className={sectionActionClassName}>
          {copy.home.notesTeaser.allNotes}
        </HomeActionLink>
      </section>
    </div>
  )
}
