import Link from 'next/link'
import { GlitchCover } from 'app/components/glitch-cover'
import { typeMetaClassName } from 'app/components/page-layout'
import { cardTitleClassName } from 'app/components/link-styles'
import { projectGridClassName } from 'app/components/project-card'
import {
  imagePlaceholderClassName,
  projectCardImageSizes,
} from 'app/lib/image-sizes'
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
  const { title, publishedAt } = post.metadata
  const image = getWritingPostImage(post)
  const href = `/writing/${post.slug}`

  return (
    <article className="min-w-0">
      <Link
        href={href}
        className="group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        {image ? (
          <GlitchCover
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes={projectCardImageSizes}
            quality={100}
            priority={priority}
          />
        ) : (
          <div
            aria-hidden="true"
            className={`aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        <div className="flex items-baseline justify-between gap-4">
          <Heading className={`min-w-0 ${cardTitleClassName}`}>
            {title}
          </Heading>
          <time
            dateTime={publishedAt}
            className={`shrink-0 ${typeMetaClassName}`}
          >
            {formatListDate(publishedAt)}
          </time>
        </div>
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
