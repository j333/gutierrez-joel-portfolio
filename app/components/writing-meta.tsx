import { MetaRow } from 'app/components/page-layout'
import { formatDate } from 'app/writing/utils'

type WritingMetaProps = {
  publishedAt: string
}

export const WritingMeta = ({ publishedAt }: WritingMetaProps) => {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      <MetaRow label="Published">
        <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      </MetaRow>
    </dl>
  )
}
