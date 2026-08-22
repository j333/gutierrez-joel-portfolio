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
    <ul className="space-y-8">
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
            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <div className="flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 w-fit mb-1"
              >
                {post.metadata.title}
              </Link>
              {post.metadata.summary && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 leading-snug">
                  {post.metadata.summary}
                </span>
              )}
            </div>
            <span className="mt-2 sm:mt-0 shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {formatListDate(post.metadata.publishedAt)}
            </span>
          </li>
        ))}
    </ul>
  )
}
