import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'

const links = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/gutierrezjoel', external: true },
  { name: 'Behance', url: 'https://behance.net/gutierrezjoel', external: true },
  { name: 'Dribbble', url: 'https://dribbble.com/gutierrezjoel', external: true },
  { name: 'Email', url: 'mailto:joelg333@gmail.com', external: false },
]

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col gap-8">
        <nav aria-label="Social">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 text-neutral-600 dark:text-neutral-400 sm:flex sm:flex-row sm:gap-x-6 sm:gap-y-0">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  className={chromeLinkClassName}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                  href={link.url}
                  aria-label={
                    link.external
                      ? `${link.name}, opens in a new tab`
                      : undefined
                  }
                >
                  {link.name}
                  {link.external && (
                    <ArrowIcon />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="flex flex-col gap-2 font-mono text-xs leading-4 text-neutral-600 dark:text-neutral-400 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-0">
          <span className="sm:whitespace-nowrap">
            Designed & developed by Joel Gutiérrez.{' '}
          </span>
          <a
            href="https://github.com/j333/gutierrez-joel-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="content-link w-fit shrink-0 sm:whitespace-nowrap"
            aria-label="View this portfolio's code on GitHub, opens in a new tab"
          >
            View this portfolio&apos;s code on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}
