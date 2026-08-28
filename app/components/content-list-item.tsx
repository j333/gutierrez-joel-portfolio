import Link from 'next/link'
import type { ReactNode } from 'react'

type ContentListItemProps = {
  href: string
  title: string
  heading?: 'h2' | 'h3'
  aside: ReactNode
  children?: ReactNode
}

export const ContentListItem = ({
  href,
  title,
  heading: Heading = 'h2',
  aside,
  children,
}: ContentListItemProps) => (
  <article className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
    <div className="flex flex-col">
      <Heading className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
        <Link href={href} className="content-link w-fit">
          {title}
        </Link>
      </Heading>
      {children}
    </div>
    {aside}
  </article>
)
