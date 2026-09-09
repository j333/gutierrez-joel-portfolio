import { ArrowIcon } from './arrow-icon'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { chromeCtaListClassName, chromeLinkNavClassName } from './link-styles'
import { site, socialLinks } from 'app/lib/site'

const Footer = () => {
  return (
    <footer>
      <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-6 lg:grid lg:grid-cols-2 lg:items-center">
        <nav aria-label="Links" className="shrink-0">
          <ul className={chromeCtaListClassName}>
            {socialLinks.map((link) => (
              <li key={link.name} className="flex min-w-0 items-center">
                <ChromeScrambleLink
                  href={link.url}
                  text={link.name}
                  className={chromeLinkNavClassName}
                  external
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`${link.name}, opens in a new tab`}
                >
                  <ArrowIcon />
                </ChromeScrambleLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="whitespace-nowrap text-xs leading-4 text-neutral-500 lg:justify-self-end lg:text-right dark:text-neutral-400">
          Designed and built by yours truly.{' '}
          <a
            href={site.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Source on GitHub, opens in a new tab"
            className="rounded-sm outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:text-white dark:focus-visible:outline-neutral-100"
          >
            Source on GitHub.
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
