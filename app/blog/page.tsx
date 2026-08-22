import { BlogPosts } from 'app/components/posts'
import { PageHeader } from 'app/components/page-layout'
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
    <>
      <PageHeader
        title="Blog"
        description="Notes on design, product, and the ideas that stick."
      />
      <BlogPosts />
    </>
  )
}
