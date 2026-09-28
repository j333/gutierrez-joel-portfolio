import { getProjectBySlug } from 'app/projects/utils'
import { createEntryOgImage, ogContentType, ogImageSize } from '../../og/card'
import { dictionaries } from 'app/lib/i18n'
import { isLocale } from 'app/lib/locale'
import type { SlugPageProps } from 'app/lib/params'
import { site } from 'app/lib/site'

export const alt = `Project by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : 'en'
  const project = getProjectBySlug(slug, locale)

  return createEntryOgImage({
    eyebrow: dictionaries[locale].projects.eyebrow,
    title: project?.metadata.title,
  })
}

export default Image
