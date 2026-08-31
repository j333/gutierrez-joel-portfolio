'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { cx } from '../lib/cx'
import { site } from '../lib/site'
import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { ThemeToggle } from './theme-toggle'

const navLinkClassName = `${chromeLinkClassName} -mx-1`

const navShellClassName = 'sticky top-4 z-40 w-full'

const navClassName =
  'sticky-nav pointer-events-auto bg-white pb-3 dark:bg-black'

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
  const { isAwayFromTop, isHidden } = useScrollNavVisibility(pathname)

  return (
    <div className={navShellClassName}>
      <nav
        className={cx(
          navClassName,
          isAwayFromTop &&
            'shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]'
        )}
        id="nav"
        aria-label="Primary"
        data-scroll-hidden={isHidden ? 'true' : 'false'}
      >
        <div className="flex w-full items-start justify-between">
          <Link
            href="/"
            className={navLinkClassName}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            gutierrez joel
          </Link>
          <ul className="flex items-center gap-x-8">
            <li>
              <ThemeToggle />
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
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
            <li>
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
