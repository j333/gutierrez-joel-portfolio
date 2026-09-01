import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { site, socialLinks } from 'app/lib/site'

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Social">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  className={chromeLinkClassName}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={link.url}
                  aria-label={`${link.name}, opens in a new tab`}
                >
                  {link.name}
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Designed and built in Cursor by yours truly.{' '}
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Source on GitHub, opens in a new tab"
            className="rounded-sm underline underline-offset-2 outline-none transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
          >
            Source on GitHub.
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
