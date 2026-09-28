import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { JsonLd } from 'app/components/json-ld'
import {
  PageHeader,
  articleBodyClassName,
  pageSectionClassName,
} from 'app/components/page-layout'
import { ExperienceMeta } from 'app/components/experience-meta'
import { ExperienceProjects } from 'app/components/experience-projects'
import {
  getExperience,
  getExperienceBySlug,
  getExperienceCanonicalUrl,
} from 'app/experience/utils'
import {
  getExperienceProjects,
  splitSelectedWork,
} from 'app/experience/projects'
import {
  createEmploymentJsonLd,
  createPageMetadata,
} from 'app/lib/metadata'
import { getDictionary } from 'app/lib/i18n'
import { isLocale, locales } from 'app/lib/locale'
import type { SlugPageProps } from 'app/lib/params'

export const generateStaticParams = async () =>
  locales.flatMap((lang) =>
    getExperience('en').map((entry) => ({
      lang,
      slug: entry.slug,
    }))
  )

export const generateMetadata = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params

  if (!isLocale(lang)) {
    return
  }

  const entry = getExperienceBySlug(slug, lang)

  if (!entry) {
    return
  }

  const { title, startedAt, summary, role } = entry.metadata
  const description = role ? `${role}. ${summary}` : summary

  return createPageMetadata({
    locale: lang,
    path: `/experience/${entry.slug}`,
    title,
    description,
    markdownPath: `/experience/${entry.slug}`,
    type: 'article',
    publishedTime: `${startedAt}-01-01`,
  })
}

const Experience = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const copy = await getDictionary()
  const entry = getExperienceBySlug(slug, lang)

  if (!entry) {
    notFound()
  }

  const projects = getExperienceProjects(entry.slug, lang)
  const { before, after } = splitSelectedWork(entry.content)

  return (
    <>
      <JsonLd
        data={createEmploymentJsonLd({
          organizationName: entry.metadata.title,
          roleName: entry.metadata.role,
          startDate: entry.metadata.startedAt,
          endDate: entry.metadata.endedAt,
          description: entry.metadata.summary,
          url: getExperienceCanonicalUrl(entry, lang),
        })}
      />
      <article className={pageSectionClassName}>
        <PageHeader
          title={entry.metadata.title}
          description={entry.metadata.summary}
          spacing="hero"
        >
          <ExperienceMeta metadata={entry.metadata} />
        </PageHeader>
        <div className={articleBodyClassName}>
          {before.trim() ? (
            <div className="prose">
              <CustomMDX source={before} />
            </div>
          ) : null}
          <ExperienceProjects
            groups={projects}
            heading={after ? undefined : copy.experience.selectedWork}
            className={before.trim() ? 'mt-16' : undefined}
          />
          {after ? (
            <div className="prose mt-16">
              <CustomMDX source={after} />
            </div>
          ) : null}
        </div>
      </article>
    </>
  )
}

export default Experience
