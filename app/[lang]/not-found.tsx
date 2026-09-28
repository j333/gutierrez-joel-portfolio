import { CtaLink } from 'app/components/cta-link'
import { PageHeader, textColumnClassName } from 'app/components/page-layout'

const NotFound = () => {
  return (
    <div className={textColumnClassName}>
      <PageHeader
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        spacing="section"
      >
        <CtaLink href="/">Back to home</CtaLink>
      </PageHeader>
    </div>
  )
}

export default NotFound
