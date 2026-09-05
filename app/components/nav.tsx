'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { chromeLinkBaseClassName, chromeLinkClassName } from './link-styles'
import { ThemeToggle } from './theme-toggle'

const navLinkClassName = `${chromeLinkClassName} -mx-1 min-h-11 whitespace-nowrap sm:min-h-0`

const brandLinkClassName = `${chromeLinkBaseClassName} -mx-1 min-h-11 whitespace-nowrap sm:min-h-0`

const navListClassName = 'flex items-center gap-x-6 sm:gap-x-8'

const navShellClassName =
  'sticky-nav sticky top-0 z-40 -mx-4 w-[calc(100%+2rem)] border-b border-transparent bg-transparent px-4 pt-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 data-[away-from-top=true]:border-neutral-200 data-[away-from-top=true]:bg-white dark:data-[away-from-top=true]:border-neutral-800 dark:data-[away-from-top=true]:bg-black'

const navClassName = 'pointer-events-auto pb-3'

const navItems = [
  { href: '/', name: 'Home' },
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
        <div className="grid w-full grid-cols-1 items-center gap-x-6 sm:grid-cols-2 sm:gap-x-8">
          <Link href="/" className={`${brandLinkClassName} max-sm:hidden`}>
            Gutiérrez Joel
          </Link>
          <div className="flex min-w-0 items-center justify-between gap-x-6 sm:gap-x-8">
            <ul className={navListClassName}>
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
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
