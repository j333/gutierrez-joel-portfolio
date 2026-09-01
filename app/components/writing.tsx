import Image from 'next/image'
import Link from 'next/link'
import { projectGridClassName } from 'app/components/project-card'
import { projectCardImageSizes } from 'app/lib/image-sizes'
import { preventWidow } from 'app/lib/text'
import {
  formatListDate,
  getWritingPostImage,
  getWritingPosts,
  type WritingPost,
} from 'app/writing/utils'

type WritingHeading = 'h2' | 'h3'

type WritingPostsProps = {
  limit?: number
  heading?: WritingHeading
}

type WritingCardProps = {
  post: WritingPost
  heading?: WritingHeading
  priority?: boolean
}

const WritingCard = ({
  post,
  heading: Heading = 'h2',
  priority = false,
}: WritingCardProps) => {
  const { title, publishedAt, summary } = post.metadata
  const image = getWritingPostImage(post)
  const href = `/writing/${post.slug}`

  return (
    <article className="min-w-0">
      <Link
        href={href}
        className="group flex flex-col gap-1 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes={projectCardImageSizes}
            priority={priority}
            className="aspect-video h-auto w-full rounded-none object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="aspect-video w-full bg-neutral-100 dark:bg-neutral-900"
          />
        )}
        <div className="flex items-baseline justify-between gap-4">
          <Heading className="min-w-0 text-base font-medium leading-6 text-neutral-900 group-hover:underline group-focus-visible:underline dark:text-neutral-100">
            {title}
          </Heading>
          <time
            dateTime={publishedAt}
            className="shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400"
          >
            {formatListDate(publishedAt)}
          </time>
        </div>
        {summary ? (
          <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            {preventWidow(summary)}
          </p>
        ) : null}
      </Link>
    </article>
  )
}

export const WritingPosts = ({ limit, heading = 'h2' }: WritingPostsProps) => {
  const posts = getWritingPosts()
  const visiblePosts = limit ? posts.slice(0, limit) : posts

  return (
    <div className={projectGridClassName}>
      {visiblePosts.map((post, index) => (
        <WritingCard
          key={post.slug}
          post={post}
          heading={heading}
          priority={index === 0}
        />
      ))}
    </div>
  )
}
