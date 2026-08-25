import { ExperiencePosts } from 'app/components/experience'
import { PageHeader } from 'app/components/page-layout'
import { baseUrl } from 'app/sitemap'

const title = 'Experience'
const description = 'Selected product design work from Joel Gutiérrez.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: `${baseUrl}/experience`,
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/experience`,
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
        title="Experience"
        description="Selected work across product, systems, and brand."
      />
      <div className="mb-16">
        <ExperiencePosts />
      </div>
    </>
  )
}
