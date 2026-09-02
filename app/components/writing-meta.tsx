import { MetaRow, metaListClassName } from 'app/components/page-layout'
import { formatDate } from 'app/writing/utils'

type WritingMetaProps = {
  publishedAt: string
}

export const WritingMeta = ({ publishedAt }: WritingMetaProps) => {
  return (
    <dl className={metaListClassName}>
      <MetaRow label="Published">
        <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      </MetaRow>
    </dl>
  )
}
