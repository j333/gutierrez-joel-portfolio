import { getProjectBySlug } from 'app/projects/utils'
import { createEntryOgImage, ogContentType, ogImageSize } from '../og/card'
import type { SlugPageProps } from 'app/lib/params'
import { projectsIndex, site } from 'app/lib/site'

export const alt = `${projectsIndex.eyebrow} by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: SlugPageProps) => {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  return createEntryOgImage({
    eyebrow: projectsIndex.eyebrow,
    title: project?.metadata.title,
  })
}

export default Image
