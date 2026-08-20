import { ArrowIcon } from './arrow-icon'

const links = [
  { name: 'RSS', url: '/rss', external: true },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/gutierrezjoel', external: true },
  { name: 'Behance', url: 'https://behance.net/gutierrezjoel', external: true },
  { name: 'Dribbble', url: 'https://dribbble.com/gutierrezjoel', external: true },
  { name: 'Email', url: 'mailto:joelg333@gmail.com', external: true },
]

export default function Footer() {
  return (
    <footer className="mt-24 mb-16">
      <div className="flex flex-col gap-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:flex md:flex-row md:gap-x-6 md:gap-y-0 text-neutral-600 dark:text-neutral-400">
          {links.map((link) => (
            <li key={link.name}>
              <a
                className="group flex items-center font-mono text-xs uppercase tracking-wider transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-2 w-fit"
                rel={link.external ? "noopener noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
                href={link.url}
              >
                {link.name}
                {link.external && <ArrowIcon className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </a>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
          Designed & developed by Joel Gutiérrez.{' '}
          <a
            href="https://github.com/j333/gutierrez-joel-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-4"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}
