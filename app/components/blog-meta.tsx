import { formatDate } from 'app/blog/utils'

type BlogMetaProps = {
  publishedAt: string
}

export const BlogMeta = ({ publishedAt }: BlogMetaProps) => {
  return (
    <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="flex flex-col gap-0.5">
        <dt className="font-mono text-xs font-normal uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400">
          Published
        </dt>
        <dd className="text-sm leading-5 text-neutral-800 dark:text-neutral-200">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </dd>
      </div>
    </dl>
  )
}
