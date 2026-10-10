import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArticleToc } from 'app/components/article-toc'
import { CustomMDX } from 'app/components/mdx'
import { JsonLd } from 'app/components/json-ld'
import {
  PageHeader,
  articleBodyClassName,
  articleCoverClassName,
  pageSectionClassName,
} from 'app/components/page-layout'
import { ProjectMeta } from 'app/components/project-meta'
import {
  fullWidthImageSizes,
  imagePlaceholderClassName,
} from 'app/lib/image-sizes'
import {
  createCreativeWorkJsonLd,
  createPageMetadata,
  getSocialImageUrl,
} from 'app/lib/metadata'
import type { SlugPageProps } from 'app/lib/params'
import { getDictionary } from 'app/lib/i18n'
import { isLocale, locales } from 'app/lib/locale'
import { getHeadings } from 'app/lib/toc'
import {
  getProjectBySlug,
  getProjectCanonicalUrl,
  getProjectCaseStudyDescription,
  getProjectImage,
  getProjects,
  projectImageQuality,
} from 'app/projects/utils'

export const generateStaticParams = async () =>
  locales.flatMap((lang) =>
    getProjects('en').map((project) => ({
      lang,
      slug: project.slug,
    }))
  )

export const generateMetadata = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params

  if (!isLocale(lang)) {
    return
  }

  const project = getProjectBySlug(slug, lang)

  if (!project) {
    return
  }

  const description = getProjectCaseStudyDescription(project)

  return createPageMetadata({
    locale: lang,
    path: `/${project.slug}`,
    title: project.metadata.title,
    description,
    markdownPath: `/${project.slug}`,
    type: 'article',
    publishedTime: `${project.metadata.startedAt}-01-01`,
  })
}

const Project = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const copy = await getDictionary()
  const project = getProjectBySlug(slug, lang)

  if (!project) {
    notFound()
  }

  const image = getProjectImage(project)
  const { title, startedAt, endedAt, summary } = project.metadata
  const caseStudyDescription = getProjectCaseStudyDescription(project)
  const headings = getHeadings(project.content)

  return (
    <>
      <JsonLd
        data={createCreativeWorkJsonLd({
          type: 'CreativeWork',
          headline: title,
          datePublished: startedAt,
          dateModified: endedAt,
          description: caseStudyDescription,
          image: getSocialImageUrl(
            project.metadata.image,
            title,
            copy.projects.eyebrow
          ),
          url: getProjectCanonicalUrl(project, lang),
          inLanguage: lang,
        })}
      />
      <article className={pageSectionClassName}>
        <PageHeader title={title} description={summary} spacing="article">
          <ProjectMeta metadata={project.metadata} />
        </PageHeader>
        {image ? (
          <div
            className={`relative overflow-hidden ${articleCoverClassName} ${imagePlaceholderClassName}`}
          >
            <Image
              src={image.src}
              alt={title}
              fill
              sizes={fullWidthImageSizes}
              quality={projectImageQuality}
              unoptimized
              className="rounded-none object-cover"
              priority
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={`${articleCoverClassName} ${imagePlaceholderClassName}`}
          />
        )}
        {project.content.trim() ? (
          <div className="relative">
            {headings.length >= 3 ? (
              <aside className="hidden lg:absolute lg:left-0 lg:top-0 lg:block lg:h-full lg:w-44">
                <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-4">
                  <ArticleToc headings={headings} label={copy.projects.toc} />
                </div>
              </aside>
            ) : null}
            <div className={`${articleBodyClassName} prose`}>
              <CustomMDX source={project.content} />
            </div>
          </div>
        ) : null}
      </article>
    </>
  )
}

export default Project
