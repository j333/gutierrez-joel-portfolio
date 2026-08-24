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
    <ul className="mb-16 space-y-8">
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
          <li key={post.slug}>
            <article className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <div className="flex flex-col">
                <h2 className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="content-link-hover w-fit"
                  >
                    {post.metadata.title}
                  </Link>
                </h2>
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
