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
  getExperienceMarkdownUrl,
} from 'app/experience/utils'
import {
  getExperienceProjects,
  splitSelectedWork,
} from 'app/experience/projects'
import {
  createEmploymentJsonLd,
  createPageMetadata,
} from 'app/lib/metadata'
import type { SlugPageProps } from 'app/lib/params'

export const generateStaticParams = async () =>
  getExperience().map((entry) => ({
    slug: entry.slug,
  }))

export const generateMetadata = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const entry = getExperienceBySlug(slug)

  if (!entry) {
    return
  }

  const { title, startedAt, summary, role } = entry.metadata
  const description = role ? `${role}. ${summary}` : summary

  return createPageMetadata({
    title,
    description,
    canonical: getExperienceCanonicalUrl(entry),
    markdownUrl: getExperienceMarkdownUrl(entry),
    type: 'article',
    publishedTime: `${startedAt}-01-01`,
  })
}

const Experience = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const entry = getExperienceBySlug(slug)

  if (!entry) {
    notFound()
  }

  const projects = getExperienceProjects(entry.slug)
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
          url: getExperienceCanonicalUrl(entry),
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
            heading={after ? undefined : 'Selected work'}
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
