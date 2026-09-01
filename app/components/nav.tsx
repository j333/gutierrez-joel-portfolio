'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { site } from '../lib/site'
import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { ThemeToggle } from './theme-toggle'

const navLinkClassName = `${chromeLinkClassName} -mx-1`

const navShellClassName =
  'sticky-nav sticky top-0 z-40 w-full bg-white pt-4 dark:bg-black'

const navClassName = 'pointer-events-auto bg-white pb-3 dark:bg-black'

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
  const { isHidden } = useScrollNavVisibility(pathname)

  return (
    <div
      className={navShellClassName}
      data-scroll-hidden={isHidden ? 'true' : 'false'}
    >
      <nav
        className={navClassName}
        id="nav"
        aria-label="Primary"
      >
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className={navLinkClassName}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            gutierrez joel
          </Link>
          <ul className="flex items-center gap-x-8">
            <li className="flex items-center">
              <ThemeToggle />
            </li>
            {navItems.map((item) => (
              <li key={item.href} className="flex items-center">
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
            <li className="flex items-center">
              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClassName}
                aria-label="Resume, opens PDF in a new tab"
              >
                Resume
                <ArrowIcon />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
