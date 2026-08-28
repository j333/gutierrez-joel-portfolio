import {
  ContentListItem,
  contentListClassName,
} from 'app/components/content-list-item'
import { preventWidow } from 'app/lib/text'
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
    <ul className={contentListClassName}>
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
                className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400"
              >
                {formatListDate(post.metadata.publishedAt)}
              </time>
            }
          >
            {post.metadata.summary ? (
              <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                {preventWidow(post.metadata.summary)}
              </p>
            ) : null}
          </ContentListItem>
        </li>
      ))}
    </ul>
  )
}
