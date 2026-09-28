import { createEntryOgImage, ogContentType, ogImageSize } from '../../../og/card'
import type { SlugPageProps } from 'app/lib/params'
import { dictionaries } from 'app/lib/i18n'
import { isLocale } from 'app/lib/locale'
import { site } from 'app/lib/site'
import { getWritingPostBySlug } from 'app/notes/utils'

export const alt = `Notes by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async ({ params }: SlugPageProps) => {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : 'en'
  const post = getWritingPostBySlug(slug, locale)

  return createEntryOgImage({
    eyebrow: dictionaries[locale].notes.eyebrow,
    title: post?.metadata.title,
  })
}

export default Image
