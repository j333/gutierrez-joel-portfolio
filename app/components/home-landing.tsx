import Image from 'next/image'
import Link from 'next/link'
import { HomeActionLink } from 'app/components/home-action-link'
import { GlitchCover } from 'app/components/glitch-cover'
import { metaLabelClassName } from 'app/components/page-layout'
import {
  homeBrands,
  homeFeaturedCaseSlugs,
  type HomeFeaturedCaseSlug,
} from 'app/lib/home-data'
import { projectCardImageSizes } from 'app/lib/image-sizes'
import type { Dictionary } from 'app/lib/dictionaries/en'
import { localePath, type Locale } from 'app/lib/locale'
import { site, socialLinks } from 'app/lib/site'
import {
  getProjectImage,
  projectImageQuality,
  type Project,
} from 'app/projects/utils'
import type { WritingPost } from 'app/notes/utils'

type HomeLandingProps = {
  locale: Locale
  copy: Dictionary
  projects: Project[]
  notes: WritingPost[]
}

const sectionLabelClassName = metaLabelClassName
const sectionTitleClassName =
  'text-xl font-normal leading-7 tracking-tight text-black dark:text-white'
const sectionSubtitleClassName =
  'text-base leading-relaxed text-neutral-600 dark:text-neutral-400'

const formatNoteIndex = (index: number) => String(index + 1).padStart(2, '0')

const formatHomeNoteDate = (date: string, locale: Locale, months: string[]) => {
  const value = date.includes('T') ? date : `${date}T00:00:00`
  const parsed = new Date(value)
  const month = months[parsed.getMonth()]?.toUpperCase() ?? ''

  return `${month} ${parsed.getFullYear()}`
}

const SectionHeader = ({
  title,
  subtitle,
  href,
  linkLabel,
  external,
}: {
  title: string
  subtitle: string
  href: string
  linkLabel: string
  external?: boolean
}) => {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className={sectionTitleClassName}>{title}</h2>
        <p className={sectionSubtitleClassName}>{subtitle}</p>
      </div>
      <HomeActionLink href={href} external={external}>
        {linkLabel}
      </HomeActionLink>
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
      <section className="flex w-full flex-col gap-10 pt-16 md:pt-28">
        <p className={sectionLabelClassName}>{copy.home.eyebrow}</p>
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:gap-6">
          <h1 className="w-full max-w-[860px] shrink-0 text-[2rem] font-normal leading-[1.12] tracking-[-0.04em] text-black sm:text-4xl md:text-[3.25rem] lg:w-[860px] dark:text-white">
            {copy.home.headline}
          </h1>
          <div className="flex w-full flex-col gap-2.5 pb-1.5 lg:min-w-0 lg:flex-1">
            <p className={sectionLabelClassName}>{copy.home.nowLabel}</p>
            <p className="max-w-[45ch] text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {copy.home.now}
            </p>
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

      <section className="flex w-full flex-col gap-6 pt-28">
        <div className="flex w-full items-center justify-between gap-4">
          <p className={sectionLabelClassName}>{copy.home.workedWith.label}</p>
          <p className={sectionLabelClassName}>{copy.home.workedWith.years}</p>
        </div>
        <ul className="grid w-full grid-cols-2 border-t border-l border-neutral-200 dark:border-neutral-800 sm:grid-cols-4">
          {homeBrands.map((brand) => (
            <li
              key={brand.name}
              className="flex h-24 items-center justify-center border-r border-b border-neutral-200 px-4 dark:border-neutral-800"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.width}
                height={brand.height}
                className="h-auto max-h-12 w-auto max-w-[170px] object-contain dark:invert"
              />
            </li>
          ))}
          <li className="flex h-24 items-center justify-center border-r border-b border-neutral-200 dark:border-neutral-800">
            <span className={sectionLabelClassName}>
              {copy.home.workedWith.andMore}
            </span>
          </li>
        </ul>
      </section>

      <section className="flex w-full flex-col gap-8 pt-[120px]">
        <SectionHeader
          title={copy.home.selectedWork.title}
          subtitle={copy.home.selectedWork.subtitle}
          href={craftHref}
          linkLabel={copy.home.selectedWork.allCases}
        />
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
              <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
                    <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
      </section>

      <section className="flex w-full flex-col gap-6 pt-[120px]">
        <div className="flex w-full flex-col gap-6">
          <p className="max-w-xl text-[1.375rem] font-normal leading-[1.45] tracking-[-0.025em] text-black dark:text-white">
            {copy.home.aboutTeaser.lead}
          </p>
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              {copy.home.aboutTeaser.body}
            </p>
            <div className="flex w-full flex-col gap-3 pt-1.5">
              <p className={sectionLabelClassName}>
                {copy.home.aboutTeaser.previously}
              </p>
              <ul className="flex w-full flex-col">
                {copy.home.aboutTeaser.roles.map((role, index) => (
                  <li
                    key={role.company}
                    className={`flex w-full flex-col gap-1 border-neutral-200 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 dark:border-neutral-800 ${
                      index === 0 ? 'border-t-0' : 'border-t'
                    }`}
                  >
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
                        {role.company}
                      </span>
                      <span className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                        {role.role}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                      {role.years}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <HomeActionLink href={aboutHref}>
            {copy.home.aboutTeaser.more}
          </HomeActionLink>
        </div>
      </section>

      <section className="flex w-full flex-col gap-8 pt-[120px]">
        <SectionHeader
          title={copy.home.kindWords.title}
          subtitle={copy.home.kindWords.subtitle}
          href={linkedIn}
          linkLabel={copy.home.kindWords.allOnLinkedIn}
          external
        />
        <figure className="flex w-full flex-col gap-6 border-t border-neutral-200 pt-8 pb-10 dark:border-neutral-800 lg:flex-row lg:gap-6">
          <figcaption className="flex w-full max-w-[272px] flex-col gap-1 pt-1.5">
            <cite className="not-italic text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
              {copy.home.kindWords.featured.name}
            </cite>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {copy.home.kindWords.featured.role}
            </p>
          </figcaption>
          <blockquote className="min-w-0 flex-1 text-[1.375rem] font-normal leading-[1.45] tracking-[-0.025em] text-black dark:text-white">
            {copy.home.kindWords.featured.quote}
          </blockquote>
        </figure>
        <div className="grid w-full grid-cols-1 gap-12 border-t border-neutral-200 pt-6 dark:border-neutral-800 lg:grid-cols-3 lg:gap-6">
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
              <blockquote className="text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                {item.quote}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col gap-8 pt-[120px]">
        <SectionHeader
          title={copy.home.notesTeaser.title}
          subtitle={copy.home.notesTeaser.subtitle}
          href={notesHref}
          linkLabel={copy.home.notesTeaser.allNotes}
        />
        <ul className="flex w-full flex-col">
          {previewNotes.map((post, index) => (
            <li key={post.slug}>
              <Link
                href={localePath(locale, `/notes/${post.slug}`)}
                className={`group flex w-full items-center justify-between gap-4 border-neutral-200 py-5 outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:focus-visible:outline-neutral-100 ${
                  index === 0 ? 'border-t' : 'border-t border-b'
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                    {formatNoteIndex(index)}
                  </span>
                  <span className="min-w-0 text-base font-medium leading-6 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white">
                    {post.metadata.title}
                  </span>
                </div>
                <span className="hidden shrink-0 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500 sm:inline dark:text-neutral-400">
                  {formatHomeNoteDate(
                    post.metadata.publishedAt,
                    locale,
                    copy.months
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex w-full flex-col items-center gap-6 pt-[160px] pb-[120px] text-center">
        <p className={sectionLabelClassName}>{copy.home.contact.label}</p>
        <h2 className="max-w-[45rem] text-3xl font-normal leading-[1.2] tracking-[-0.03em] text-black md:text-4xl dark:text-white">
          {copy.home.contact.headline}
        </h2>
        <a
          href={contactHref}
          className="rounded-sm text-lg leading-relaxed text-neutral-800 outline-none transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-200 dark:focus-visible:outline-neutral-100"
        >
          {site.email}
        </a>
      </section>
    </div>
  )
}
