import { ArrowIcon } from './arrow-icon'

const links = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/gutierrezjoel', external: true },
  { name: 'Behance', url: 'https://behance.net/gutierrezjoel', external: true },
  { name: 'Dribbble', url: 'https://dribbble.com/gutierrezjoel', external: true },
  { name: 'Email', url: 'mailto:joelg333@gmail.com', external: true },
]

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col gap-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 text-neutral-600 dark:text-neutral-400 sm:flex sm:flex-row sm:gap-x-6 sm:gap-y-0">
          {links.map((link) => (
            <li key={link.name}>
              <a
                className="group flex w-fit items-center font-mono text-xs uppercase leading-4 tracking-wider transition-colors hover:text-neutral-900 hover:underline underline-offset-2 dark:hover:text-neutral-100"
                rel={link.external ? 'noopener noreferrer' : undefined}
                target={link.external ? '_blank' : undefined}
                href={link.url}
                aria-label={`${link.name}, opens in a new tab`}
              >
                {link.name}
                {link.external && (
                  <ArrowIcon className="ml-1 opacity-50 transition-opacity group-hover:opacity-100" />
                )}
              </a>
            </li>
          ))}
        </ul>
        <p className="flex flex-col gap-2 font-mono text-xs leading-4 text-neutral-600 dark:text-neutral-400 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-0">
          <span className="sm:whitespace-nowrap">
            Designed & developed by Joel Gutiérrez.{' '}
          </span>
          <a
            href="https://github.com/j333/gutierrez-joel-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit shrink-0 items-center hover:text-neutral-900 hover:underline underline-offset-4 dark:hover:text-neutral-100 sm:whitespace-nowrap"
            aria-label="View this portfolio's code on GitHub, opens in a new tab"
          >
            View this portfolio&apos;s code on GitHub
            <ArrowIcon className="ml-1 opacity-50 transition-opacity group-hover:opacity-100" />
          </a>
        </p>
      </div>
    </footer>
  )
}
