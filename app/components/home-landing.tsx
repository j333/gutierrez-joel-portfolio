import Link from 'next/link'
import { ArrowIcon, rowArrowClassName } from 'app/components/arrow-icon'
import { BrandLogos } from 'app/components/brand-logos'
import { GlitchCover } from 'app/components/glitch-cover'
import { HomeActionLink } from 'app/components/home-action-link'
import {
  HomeCasePager,
  HomeQuotePager,
  type HomeCaseSlide,
} from 'app/components/home-pager'
import { cardTitleClassName } from 'app/components/link-styles'
import { ScrambleTitle } from 'app/components/scramble-title'
import { sectionTitleClassName } from 'app/components/page-layout'
import { projectGridClassName } from 'app/components/project-card'
import type { Dictionary } from 'app/lib/dictionaries/en'
import {
  imagePlaceholderClassName,
  projectCardImageSizes,
  projectImageQuality,
} from 'app/lib/image-sizes'
import { localePath, type Locale } from 'app/lib/locale'
import { recommendationPhoto } from 'app/lib/recommendation-photos'
import { socialLinks } from 'app/lib/site'
import { getProjectImage, type Project } from 'app/projects/utils'
import { getWritingPostImage, type WritingPost } from 'app/notes/utils'

type HomeLandingProps = {
  locale: Locale
  copy: Dictionary
  projects: Project[]
  notes: WritingPost[]
}

const metaClassName =
  'shrink-0 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400'

const noteLinkClassName =
  'group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const sectionClassName = 'flex w-full flex-col gap-8 pt-32'

const formatHomeNoteDate = (date: string, months: string[]) => {
  const value = date.includes('T') ? date : `${date}T00:00:00`
  const parsed = new Date(value)
  const month = months[parsed.getMonth()]?.toUpperCase() ?? ''

  return `${month} ${parsed.getFullYear()}`
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
  const linkedIn =
    socialLinks.find((link) => link.name === 'LinkedIn')?.url ??
    'https://linkedin.com/in/gutierrezjoel'

  const homeCases = copy.home.selectedWork.cases
  const caseSlides: HomeCaseSlide[] = projects.map((project, index) => {
    const projectCopy = (
      homeCases as Record<string, { title: string; meta: string } | undefined>
    )[project.slug]
    const image = getProjectImage(project)
    const title = projectCopy?.title ?? project.metadata.title
    const meta = projectCopy?.meta ?? project.metadata.product.toUpperCase()

    return {
      slug: project.slug,
      href: localePath(locale, `/${project.slug}`),
      title,
      meta,
      priority: index === 0,
      image: image
        ? {
            src: image.src,
            width: image.width,
            height: image.height,
            alt: `${title} — ${project.metadata.product}`,
          }
        : null,
    }
  })

  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full max-w-[840px] flex-col gap-6">
        <h1 className="w-full text-balance text-[2rem] font-normal leading-[1.12] tracking-[-0.04em] text-black @min-[40rem]/page:text-4xl @min-[48rem]/page:text-[3.25rem] dark:text-white">
          {copy.home.headline}
        </h1>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {copy.home.now}
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>{copy.home.selectedWork.title}</h2>
        <HomeCasePager
          items={caseSlides}
          action={{ href: craftHref, label: copy.home.selectedWork.allCases }}
        />
      </section>

      <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>{copy.home.aboutTeaser.title}</h2>
        <div className="grid w-full grid-cols-1 gap-8 @min-[64rem]/page:grid-cols-2">
          <p className="whitespace-pre-line text-[1.375rem] font-normal leading-[1.45] tracking-[-0.025em] text-black @min-[64rem]/page:pr-8 dark:text-white">
            {copy.home.aboutTeaser.lead}
          </p>
          <ul className="@container/roles flex w-full flex-col">
            {copy.home.aboutTeaser.roles.map((role, index) => (
              <li key={role.slug}>
                <Link
                  href={localePath(locale, `/experience/${role.slug}`)}
                  className={`group flex w-full items-baseline justify-between gap-3 border-neutral-200 py-3 outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:focus-visible:outline-neutral-100 ${
                    index === 0 ? 'border-t-0' : 'border-t'
                  }`}
                >
                  <div className="flex min-w-0 flex-col gap-1 @min-[35rem]/roles:flex-row @min-[35rem]/roles:items-baseline @min-[35rem]/roles:gap-3">
                    <ScrambleTitle
                      text={role.company}
                      className="shrink-0 whitespace-nowrap text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white"
                    />
                    <span className="min-w-0 text-sm leading-5 text-neutral-500 @min-[29rem]/roles:whitespace-nowrap @min-[35rem]/roles:shrink-0 dark:text-neutral-400">
                      {role.role}
                    </span>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className={metaClassName}>{role.years}</span>
                    <ArrowIcon className={rowArrowClassName} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <BrandLogos />
        <HomeActionLink href={aboutHref}>{copy.home.aboutTeaser.more}</HomeActionLink>
      </section>

      <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>{copy.home.kindWords.title}</h2>
        <HomeQuotePager
          items={copy.home.kindWords.quotes.flatMap((quote) => {
            const image = recommendationPhoto(quote.name)

            if (!image) {
              return []
            }

            return [{ ...quote, image }]
          })}
          previousLabel={copy.home.previous}
          nextLabel={copy.home.next}
          action={{
            href: linkedIn,
            label: copy.home.kindWords.allOnLinkedIn,
            external: true,
          }}
        />
      </section>

      <section className={`${sectionClassName} pb-32`}>
        <h2 className={sectionTitleClassName}>{copy.home.notesTeaser.title}</h2>
        <div className={projectGridClassName}>
          {notes.map((post) => {
            const image = getWritingPostImage(post)
            const title = post.metadata.title

            return (
              <article key={post.slug} className="min-w-0">
                <Link
                  href={localePath(locale, `/notes/${post.slug}`)}
                  className={noteLinkClassName}
                >
                  {image ? (
                    <GlitchCover
                      src={image.src}
                      alt={title}
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
                  <div className="flex w-full items-baseline justify-between gap-4">
                    <h3 className={`min-w-0 ${cardTitleClassName}`}>{title}</h3>
                    <time
                      dateTime={post.metadata.publishedAt}
                      className={metaClassName}
                    >
                      {formatHomeNoteDate(post.metadata.publishedAt, copy.months)}
                    </time>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
        <HomeActionLink href={notesHref}>{copy.home.notesTeaser.allNotes}</HomeActionLink>
      </section>
    </div>
  )
}
