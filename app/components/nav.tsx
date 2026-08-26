'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'
import { ThemeToggle } from './theme-toggle'

const navLinkClassName = `${chromeLinkClassName} -mx-1`

const navShellClassName =
  'pointer-events-none sticky top-0 z-40 w-screen max-w-none -ml-[calc(50vw-50%)]'

const navClassName =
  'sticky-nav pointer-events-auto bg-white pb-3 pt-8 dark:bg-black'

const navItems = [
  { href: '/', name: 'Home' },
  { href: '/experience', name: 'Experience' },
  { href: '/writing', name: 'Writing' },
]

const isCurrentPath = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname() ?? ''
  const { isAwayFromTop, isHidden } = useScrollNavVisibility(pathname)

  return (
    <div className={navShellClassName}>
      <nav
        className={`${navClassName}${
          isAwayFromTop
            ? ' shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]'
            : ''
        }`}
        id="nav"
        aria-label="Primary"
        data-scroll-hidden={isHidden ? 'true' : 'false'}
      >
        <ul className="mx-auto flex w-full max-w-xl flex-row items-center gap-x-5 px-4">
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
          <li className="ml-auto flex items-center gap-x-5">
            <ThemeToggle />
            <a
              href="/Joel_Gutierrez_Resume.pdf"
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
      </nav>
    </div>
  )
}
