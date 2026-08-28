import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

type ContentListImage = {
  src: string
  width: number
  height: number
}

type ContentListItemProps = {
  href: string
  title: string
  heading?: 'h2' | 'h3'
  aside: ReactNode
  image?: ContentListImage | null
  children?: ReactNode
}

export const ContentListItem = ({
  href,
  title,
  heading: Heading = 'h2',
  aside,
  image,
  children,
}: ContentListItemProps) => {
  const body = (
    <>
      <div className="flex flex-col">
        <Heading className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
          <Link href={href} className="content-link w-fit">
            {title}
          </Link>
        </Heading>
        {children}
      </div>
      {aside}
    </>
  )

  if (!image) {
    return (
      <article className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        {body}
      </article>
    )
  }

  return (
    <article className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl sm:mb-0 sm:w-36 sm:shrink-0"
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(max-width: 640px) calc(100vw - 2rem), 9rem"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        {body}
      </div>
    </article>
  )
}
