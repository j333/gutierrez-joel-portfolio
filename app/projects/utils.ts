import { getMdxData, getMdxDirectory, type MdxEntry } from 'app/lib/mdx'
import { getPublicImageSize } from 'app/lib/public-image'
import { site } from 'app/lib/site'

export type ProjectMetadata = {
  title: string
  startedAt: string
  endedAt: string
  order: number
  summary?: string
  image?: string
  role?: string
  type?: string
  industry?: string
}

export type Project = MdxEntry<ProjectMetadata>

export type ProjectImage = {
  src: string
  width: number
  height: number
}

export const projectImageQuality = 100

export const getProjects = () =>
  getMdxData<ProjectMetadata>(getMdxDirectory('projects', 'posts')).sort(
    (a, b) => a.metadata.order - b.metadata.order
  )

export const getProjectBySlug = (slug: string) =>
  getProjects().find((project) => project.slug === slug)

export const getProjectCanonicalUrl = (project: Project) =>
  `${site.url}/${project.slug}`

export const getProjectMarkdownUrl = (project: Project) =>
  `${site.url}/${project.slug}.md`

export const getProjectImage = (project: Project): ProjectImage | null => {
  const rawSrc = project.metadata.image

  if (!rawSrc) {
    return null
  }

  const src = rawSrc.split('#')[0]
  const size = getPublicImageSize(src)

  if (!size) {
    return null
  }

  return {
    src,
    width: size.width,
    height: size.height,
  }
}
