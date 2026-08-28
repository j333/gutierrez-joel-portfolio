import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { site, socialLinks } from 'app/lib/site'

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col gap-8">
        <nav aria-label="Social">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 text-neutral-600 dark:text-neutral-400 sm:flex sm:flex-row sm:gap-x-6 sm:gap-y-0">
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
        <p className="max-w-xl text-xs leading-5 text-neutral-600 dark:text-neutral-400">
          Designed and built in Cursor by yours truly. Built with Next.js and
          Tailwind CSS, deployed with Vercel. Type is set in IBM Plex.{' '}
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link inline-flex w-fit items-center"
            aria-label="View source on GitHub, opens in a new tab"
          >
            View source on GitHub
            <ArrowIcon />
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
