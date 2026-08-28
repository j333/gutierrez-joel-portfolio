import { ContentListItem } from 'app/components/content-list-item'
import {
  formatListDate,
  getWritingPostImage,
  getWritingPosts,
} from 'app/writing/utils'

type WritingPostsProps = {
  limit?: number
  heading?: 'h2' | 'h3'
}

export const WritingPosts = ({ limit, heading = 'h2' }: WritingPostsProps) => {
  const posts = getWritingPosts()
  const visiblePosts = limit ? posts.slice(0, limit) : posts

  return (
    <ul className="space-y-12 sm:space-y-8">
      {visiblePosts.map((post) => (
        <li key={post.slug}>
          <ContentListItem
            href={`/writing/${post.slug}`}
            title={post.metadata.title}
            heading={heading}
            image={getWritingPostImage(post)}
            aside={
              <time
                dateTime={post.metadata.publishedAt}
                className="mt-2 shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:mt-0"
              >
                {formatListDate(post.metadata.publishedAt)}
              </time>
            }
          >
            {post.metadata.summary ? (
              <p className="text-sm leading-snug text-neutral-500 dark:text-neutral-400">
                {post.metadata.summary}
              </p>
            ) : null}
          </ContentListItem>
        </li>
      ))}
    </ul>
  )
}
