import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'

function formatListDate(date: string) {
  const value = date.includes('T') ? date : `${date}T00:00:00`
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

type BlogPostsProps = {
  limit?: number
  heading?: 'h2' | 'h3'
}

export function BlogPosts({ limit, heading = 'h2' }: BlogPostsProps) {
  const Heading = heading
  let posts = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  if (limit) {
    posts = posts.slice(0, limit)
  }

  return (
    <ul className="space-y-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex flex-col">
              <Heading className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                <Link
                  href={`/blog/${post.slug}`}
                  className="content-link w-fit"
                >
                  {post.metadata.title}
                </Link>
              </Heading>
              {post.metadata.summary && (
                <p className="text-sm leading-snug text-neutral-500 dark:text-neutral-400">
                  {post.metadata.summary}
                </p>
              )}
            </div>
            <time
              dateTime={post.metadata.publishedAt}
              className="mt-2 shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:mt-0"
            >
              {formatListDate(post.metadata.publishedAt)}
            </time>
          </article>
        </li>
      ))}
    </ul>
  )
}
