import { getDictionary, getLocale } from 'app/lib/i18n'
import { site, socialLinks } from 'app/lib/site'
import { ArrowIcon } from './arrow-icon'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { chromeLinkNavClassName } from './link-styles'
import { LocaleSwitch } from './locale-switch'

const footerCtaListClassName =
  'flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8 lg:grid lg:grid-cols-4'

const footerMetaClassName =
  'flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-6 sm:gap-y-2 lg:grid lg:w-full lg:grid-cols-4 lg:items-center lg:gap-x-8'

const Footer = async () => {
  const locale = await getLocale()
  const copy = await getDictionary()

  return (
    <footer>
      <div className="flex w-full min-w-0 flex-col gap-y-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 lg:grid lg:grid-cols-2 lg:items-center">
        <nav aria-label={copy.footer.links} className="min-w-0 max-w-full">
          <ul className={footerCtaListClassName}>
            {socialLinks.map((link) => (
              <li key={link.name} className="flex min-w-0 items-center">
                <ChromeScrambleLink
                  href={link.url}
                  text={link.name}
                  className={chromeLinkNavClassName}
                  external
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`${link.name}${copy.footer.externalSuffix}`}
                >
                  <ArrowIcon />
                </ChromeScrambleLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={footerMetaClassName}>
          <LocaleSwitch locale={locale} label={copy.footer.language} />
          <p className="min-w-0 max-w-full text-xs leading-4 text-neutral-500 sm:whitespace-nowrap lg:col-span-3 lg:text-right dark:text-neutral-400">
            {copy.footer.credit}{' '}
            <a
              href={site.githubUrl}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={copy.footer.sourceLabel}
              className="rounded-sm outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:text-white dark:focus-visible:outline-neutral-100"
            >
              {copy.footer.source}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
