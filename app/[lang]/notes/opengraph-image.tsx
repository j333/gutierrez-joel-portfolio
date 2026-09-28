import { createOgImage, ogContentType, ogImageSize } from '../../og/card'
import { dictionaries, getLocale } from 'app/lib/i18n'
import { site } from 'app/lib/site'

export const alt = `Notes by ${site.name}`
export const size = ogImageSize
export const contentType = ogContentType

const Image = async () => {
  const copy = dictionaries[await getLocale()]

  return createOgImage({
    eyebrow: copy.notes.eyebrow,
    title: copy.notes.title,
    subtitle: copy.notes.intro,
    footer: site.name,
  })
}

export default Image
