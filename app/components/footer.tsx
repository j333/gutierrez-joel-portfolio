import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { socialLinks } from 'app/lib/site'

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
          Designed and built in Cursor by yours truly.
        </p>
      </div>
    </footer>
  )
}

export default Footer
