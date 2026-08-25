import { BlogPosts } from 'app/components/posts'
import { PageHeader } from 'app/components/page-layout'
import { baseUrl } from 'app/sitemap'

const title = 'Blog'
const description = 'Writing and notes from Joel Gutiérrez.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/blog`,
    siteName: 'Joel Gutiérrez',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function Page() {
  return (
    <>
      <PageHeader
        title="Blog"
        description="Notes on design, product, and the ideas that stick."
      />
      <div className="mb-16">
        <BlogPosts />
      </div>
    </>
  )
}
