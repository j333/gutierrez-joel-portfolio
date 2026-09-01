'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { site } from '../lib/site'
import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { ThemeToggle } from './theme-toggle'

const navLinkClassName = `${chromeLinkClassName} -mx-1 min-h-11 whitespace-nowrap sm:min-h-0`

const navListClassName =
  'flex items-center gap-x-4 min-[400px]:gap-x-6 sm:gap-x-8'

const navShellClassName =
  'sticky-nav sticky top-0 z-40 -mx-4 w-[calc(100%+2rem)] bg-transparent px-4 pt-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 data-[away-from-top=true]:bg-white dark:data-[away-from-top=true]:bg-black'

const navClassName = 'pointer-events-auto pb-3'

const navItems = [
  { href: '/writing', name: 'Writing' },
  { href: '/about', name: 'About' },
]

const isCurrentPath = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export const Navbar = () => {
  const pathname = usePathname() ?? ''
  const { isHidden, isAwayFromTop } = useScrollNavVisibility(pathname)

  return (
    <div
      className={navShellClassName}
      data-scroll-hidden={isHidden ? 'true' : 'false'}
      data-away-from-top={isAwayFromTop ? 'true' : 'false'}
    >
      <nav
        className={navClassName}
        id="nav"
        aria-label="Primary"
      >
        <div className="flex w-full items-center justify-between gap-x-4 min-[400px]:gap-x-6 sm:gap-x-8">
          <ul className={navListClassName}>
            <li className="flex shrink-0 items-center">
              <Link
                href="/"
                className={navLinkClassName}
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                gutierrez
                <span className="hidden sm:inline">&nbsp;joel</span>
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.href} className="flex shrink-0 items-center">
                <Link
                  href={item.href}
                  className={navLinkClassName}
                  aria-current={
                    isCurrentPath(pathname, item.href) ? 'page' : undefined
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className={navListClassName}>
            <li className="flex shrink-0 items-center">
              <ThemeToggle />
            </li>
            <li className="flex shrink-0 items-center">
              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClassName}
                aria-label="Resume, opens PDF in a new tab"
              >
                <span className="inline-flex">
                  Resume
                  <ArrowIcon />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
