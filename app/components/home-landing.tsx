import Link from 'next/link'
import { ArrowIcon, rowArrowClassName } from 'app/components/arrow-icon'
import { BrandLogos } from 'app/components/brand-logos'
import { HomeActionLink } from 'app/components/home-action-link'
import {
  HomeCasePager,
  HomeNotePager,
  HomeQuotePager,
  type HomeCaseSlide,
} from 'app/components/home-pager'
import { ScrambleTitle } from 'app/components/scramble-title'
import { sectionTitleClassName } from 'app/components/page-layout'
import type { Dictionary } from 'app/lib/dictionaries/en'
import { localePath, type Locale } from 'app/lib/locale'
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
  'shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

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

  const noteSlides = notes.map((post) => {
    const image = getWritingPostImage(post)

    return {
      slug: post.slug,
      href: localePath(locale, `/notes/${post.slug}`),
      title: post.metadata.title,
      dateTime: post.metadata.publishedAt,
      dateLabel: formatHomeNoteDate(post.metadata.publishedAt, copy.months),
      image: image
        ? {
            src: image.src,
            width: image.width,
            height: image.height,
          }
        : null,
    }
  })

  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full max-w-[840px] flex-col gap-6">
        <h1 className="w-full text-balance text-[2rem] font-normal leading-[1.12] tracking-[-0.04em] text-black sm:text-4xl md:text-[3.25rem] dark:text-white">
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
          previousLabel={copy.home.previous}
          nextLabel={copy.home.next}
          action={{ href: craftHref, label: copy.home.selectedWork.allCases }}
        />
      </section>

      <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>{copy.home.aboutTeaser.title}</h2>
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          <p className="whitespace-pre-line text-[1.375rem] font-normal leading-[1.45] tracking-[-0.025em] text-black lg:pr-8 dark:text-white">
            {copy.home.aboutTeaser.lead}
          </p>
          <ul className="flex w-full flex-col">
            {copy.home.aboutTeaser.roles.map((role, index) => (
              <li key={role.slug}>
                <Link
                  href={localePath(locale, `/experience/${role.slug}`)}
                  className={`group flex w-full items-center justify-between gap-3 border-neutral-200 py-3 outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:focus-visible:outline-neutral-100 ${
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
          items={copy.home.kindWords.quotes}
          previousLabel={copy.home.previous}
          nextLabel={copy.home.next}
          action={{
            href: linkedIn,
            label: copy.home.kindWords.allOnLinkedIn,
            external: true,
          }}
        />
      </section>

      <section className="flex w-full flex-col gap-4 pt-32 pb-32">
        <h2 className={sectionTitleClassName}>{copy.home.notesTeaser.title}</h2>
        <HomeNotePager
          items={noteSlides}
          previousLabel={copy.home.previous}
          nextLabel={copy.home.next}
          action={{ href: notesHref, label: copy.home.notesTeaser.allNotes }}
        />
      </section>
    </div>
  )
}
