import { getDictionary } from 'app/lib/i18n'
import { site, socialLinks } from 'app/lib/site'
import { ArrowIcon } from './arrow-icon'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { chromeLinkNavClassName } from './link-styles'

const footerCtaListClassName =
  'flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 @min-[40rem]/page:gap-x-8 @min-[64rem]/page:grid @min-[64rem]/page:grid-cols-4'

const Footer = async () => {
  const copy = await getDictionary()

  return (
    <footer>
      <div className="flex w-full min-w-0 flex-col gap-y-6 @min-[40rem]/page:flex-row @min-[40rem]/page:flex-wrap @min-[40rem]/page:items-center @min-[40rem]/page:justify-between @min-[40rem]/page:gap-x-8 @min-[64rem]/page:grid @min-[64rem]/page:grid-cols-2 @min-[64rem]/page:items-center">
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
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-x-6 gap-y-2">
          <p className="min-w-0 max-w-full text-xs leading-4 text-neutral-500 dark:text-neutral-400">
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
