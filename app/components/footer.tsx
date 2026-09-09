import { ArrowIcon } from './arrow-icon'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { chromeLinkNavClassName } from './link-styles'
import { site, socialLinks } from 'app/lib/site'

const Footer = () => {
  return (
    <footer>
      <div className="grid w-full grid-cols-1 items-center gap-x-6 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
        <nav aria-label="Links">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <ChromeScrambleLink
                  href={link.url}
                  text={link.name}
                  className={chromeLinkNavClassName}
                  scramble={9}
                  external
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`${link.name}, opens in a new tab`}
                >
                  <ArrowIcon />
                </ChromeScrambleLink>
              </li>
            ))}
            <li>
              <ChromeScrambleLink
                href={site.resumePath}
                text="Resume"
                className={chromeLinkNavClassName}
                scramble={9}
                external
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Resume, opens PDF in a new tab"
              >
                <ArrowIcon />
              </ChromeScrambleLink>
            </li>
          </ul>
        </nav>
        <p className="text-xs leading-4 text-neutral-500 dark:text-neutral-400">
          Designed and built in Cursor by yours truly.{' '}
          <ChromeScrambleLink
            href={site.githubUrl}
            text="Source on GitHub."
            scramble={9}
            external
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Source on GitHub, opens in a new tab"
            className="rounded-sm outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:text-white dark:focus-visible:outline-neutral-100"
          />
        </p>
      </div>
    </footer>
  )
}

export default Footer
