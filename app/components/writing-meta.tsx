import { MetaRow, metaListClassName } from 'app/components/page-layout'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { formatDate } from 'app/notes/utils'

type WritingMetaProps = {
  publishedAt: string
}

export const WritingMeta = async ({ publishedAt }: WritingMetaProps) => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return (
    <dl className={metaListClassName}>
      <MetaRow label={copy.meta.published}>
        <time dateTime={publishedAt}>{formatDate(publishedAt, locale)}</time>
      </MetaRow>
    </dl>
  )
}
