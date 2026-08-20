import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'

function formatListDate(date: string) {
  const value = date.includes('T') ? date : `${date}T00:00:00`
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <ul className="space-y-3">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <li
            key={post.slug}
            className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <p>
              <Link
                href={`/blog/${post.slug}`}
                className="font-medium underline underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                {post.metadata.title}
              </Link>
              <span className="text-neutral-600 dark:text-neutral-400">
                {' '}
                {post.metadata.summary}
              </span>
            </p>
            <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
              {formatListDate(post.metadata.publishedAt)}
            </span>
          </li>
        ))}
    </ul>
  )
}
