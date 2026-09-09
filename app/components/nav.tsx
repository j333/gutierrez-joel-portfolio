'use client'

import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { chromeLinkNavClassName } from './link-styles'
import { ThemeToggle } from './theme-toggle'

const navLinkClassName = `${chromeLinkNavClassName} -mx-1 min-h-11 whitespace-nowrap sm:min-h-0`

const navCtaGridClassName =
  'grid min-w-0 grid-cols-4 items-center gap-x-6 sm:gap-x-8'

const navShellClassName =
  'sticky-nav sticky top-0 z-40 -mx-4 w-[calc(100%+2rem)] border-b border-transparent bg-transparent px-4 pt-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 data-[away-from-top=true]:border-neutral-200 data-[away-from-top=true]:bg-white dark:data-[away-from-top=true]:border-neutral-800 dark:data-[away-from-top=true]:bg-black'

const navClassName = 'pointer-events-auto pb-3'

const navItems = [
  { href: '/', name: 'Work' },
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
          <ChromeScrambleLink
            href="/"
            text="Gutiérrez Joel"
            className={`${navLinkClassName} max-sm:hidden`}
          />
          <ul className={navCtaGridClassName}>
            {navItems.map((item) => (
              <li key={item.href} className="flex min-w-0 items-center">
                <ChromeScrambleLink
                  href={item.href}
                  text={item.name}
                  className={navLinkClassName}
                  aria-current={
                    isCurrentPath(pathname, item.href) ? 'page' : undefined
                  }
                />
              </li>
            ))}
            <li className="flex min-w-0 items-center justify-end">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
