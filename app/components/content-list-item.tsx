import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

const PREVIEW_WIDTH = 160
const PREVIEW_HEIGHT = 100

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

export const contentListClassName = 'space-y-8'

export const ContentListItem = ({
  href,
  title,
  heading: Heading = 'h2',
  aside,
  image,
  children,
}: ContentListItemProps) => {
  return (
    <article>
      <Link
        href={href}
        className="group flex flex-col-reverse items-stretch gap-4 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:flex-row sm:items-start dark:focus-visible:outline-neutral-100"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Heading className="text-base font-medium leading-6 text-neutral-900 [text-decoration-skip-ink:all] underline-offset-[0.1em] group-hover:underline group-focus-visible:underline dark:text-neutral-100">
              {title}
            </Heading>
            {children}
          </div>
          {aside}
        </div>
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            sizes={`(max-width: 639px) calc(100vw - 2rem), ${PREVIEW_WIDTH}px`}
            className="h-auto w-full rounded-none object-cover sm:h-[100px] sm:w-[160px] sm:shrink-0"
          />
        ) : null}
      </Link>
    </article>
  )
}
