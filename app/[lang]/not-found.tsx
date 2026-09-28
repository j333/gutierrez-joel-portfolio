import { CtaLink } from 'app/components/cta-link'
import { PageHeader, textColumnClassName } from 'app/components/page-layout'
import { getDictionary, getLocale } from 'app/lib/i18n'
import { localePath } from 'app/lib/locale'

const NotFound = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return (
    <div className={textColumnClassName}>
      <PageHeader
        title={copy.notFound.title}
        description={copy.notFound.description}
        spacing="section"
      >
        <CtaLink href={localePath(locale, '/')}>{copy.notFound.home}</CtaLink>
      </PageHeader>
    </div>
  )
}

export default NotFound
