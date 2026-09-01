import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { JsonLd } from 'app/components/json-ld'
import {
  PageHeader,
  pageSectionClassName,
  textColumnClassName,
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
import { projectsIndex } from 'app/lib/site'
import {
  getProjectBySlug,
  getProjectCanonicalUrl,
  getProjectCaseStudyDescription,
  getProjectImage,
  getProjectMarkdownUrl,
  getProjects,
  projectImageQuality,
} from 'app/projects/utils'

export const generateStaticParams = async () =>
  getProjects().map((project) => ({
    slug: project.slug,
  }))

export const generateMetadata = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return
  }

  const description = getProjectCaseStudyDescription(project)

  return createPageMetadata({
    title: project.metadata.title,
    description,
    canonical: getProjectCanonicalUrl(project),
    markdownUrl: getProjectMarkdownUrl(project),
    type: 'article',
    publishedTime: `${project.metadata.startedAt}-01-01`,
  })
}

const Project = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const image = getProjectImage(project)
  const { title, startedAt, endedAt, summary } = project.metadata
  const caseStudyDescription = getProjectCaseStudyDescription(project)

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
            projectsIndex.eyebrow
          ),
          url: getProjectCanonicalUrl(project),
        })}
      />
      <article className={pageSectionClassName}>
        <PageHeader title={title} description={summary} spacing="hero" />
        <ProjectMeta metadata={project.metadata} />
        {image ? (
          <div
            className={`relative mb-14 aspect-video w-full overflow-hidden ${imagePlaceholderClassName}`}
          >
            <Image
              src={image.src}
              alt=""
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
            className={`mb-14 aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        {project.content.trim() ? (
          <div className={`${textColumnClassName} prose prose-project`}>
            <CustomMDX source={project.content} />
          </div>
        ) : null}
      </article>
    </>
  )
}

export default Project
