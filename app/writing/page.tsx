import { WritingPosts } from 'app/components/writing'
import { PageHeader } from 'app/components/page-layout'
import { baseUrl } from 'app/sitemap'

const title = 'Writing'
const description = 'Writing and notes from Joel Gutiérrez.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: `${baseUrl}/writing`,
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/writing`,
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
        title="Writing"
        description="Notes on design, product, and the ideas that stick."
      />
      <div className="mb-16">
        <WritingPosts />
      </div>
    </>
  )
}
