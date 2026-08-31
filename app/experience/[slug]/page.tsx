import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { JsonLd } from 'app/components/json-ld'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
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
  createCreativeWorkJsonLd,
  createPageMetadata,
  getSocialImageUrl,
} from 'app/lib/metadata'
import type { SlugPageProps } from 'app/lib/params'
import { experienceIndex } from 'app/lib/site'

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
        data={createCreativeWorkJsonLd({
          type: 'CreativeWork',
          headline: entry.metadata.title,
          datePublished: entry.metadata.startedAt,
          dateModified: entry.metadata.endedAt,
          description: entry.metadata.summary,
          image: getSocialImageUrl(
            entry.metadata.image,
            entry.metadata.title,
            experienceIndex.eyebrow
          ),
          url: getExperienceCanonicalUrl(entry),
        })}
      />
      <article className={`${textColumnClassName} ${pageSectionClassName}`}>
        <PageHeader
          title={entry.metadata.title}
          description={entry.metadata.summary}
        >
          <ExperienceMeta metadata={entry.metadata} />
        </PageHeader>
        <div className="prose">
          <CustomMDX source={before} />
        </div>
        <ExperienceProjects
          groups={projects}
          heading={after ? undefined : 'Selected work'}
        />
        {after ? (
          <div className="prose mt-16">
            <CustomMDX source={after} />
          </div>
        ) : null}
      </article>
    </>
  )
}

export default Experience
