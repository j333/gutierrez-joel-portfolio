'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowIcon } from './arrow-icon'
import { chromeLinkClassName } from './link-styles'

const navLinkClassName = `${chromeLinkClassName} -mx-1`

const navItems = [
  { href: '/', name: 'Home' },
  { href: '/experience', name: 'Experience' },
  { href: '/blog', name: 'Writing' },
]

const isCurrentPath = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname() ?? ''

  return (
    <nav className="mb-16" id="nav" aria-label="Primary">
      <ul className="flex w-full flex-row items-center gap-x-5">
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
        <li className="ml-auto">
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
  )
}
