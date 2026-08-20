import { BlogPosts } from 'app/components/posts'
import { baseUrl } from 'app/sitemap'

export const metadata = {
  title: 'Blog',
  description: 'Writing and notes from Joel Gutiérrez.',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
}

export default function Page() {
  return (
    <section>
      <h1 className="mb-2 text-2xl font-semibold tracking-tighter">Blog</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        Notes on design, product, and the ideas that stick.
      </p>
      <BlogPosts />
    </section>
  )
}
