import Link from 'next/link'
import { ArrowIcon } from './arrow-icon'

const navItems = {
  '/': {
    name: 'Home',
  },
  '/blog': {
    name: 'Blog',
  },
  'https://linkedin.com/in/gutierrezjoel': {
    name: 'LinkedIn',
  },
}

export function Navbar() {
  return (
    <aside className="mb-16">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-5 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isExternal = path.startsWith('http')
              return (
                <Link
                  key={path}
                  href={path}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group flex items-center font-mono text-xs uppercase tracking-wider transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-2 w-fit"
                >
                  {name}
                  {isExternal && <ArrowIcon className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
