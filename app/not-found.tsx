import { CtaLink } from 'app/components/cta-link'
import { PageHeader } from 'app/components/page-layout'

export default function NotFound() {
  return (
    <>
      <PageHeader
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
      />
      <CtaLink href="/">Back to home</CtaLink>
    </>
  )
}
