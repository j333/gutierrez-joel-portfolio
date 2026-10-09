'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { useScrambleText } from '../hooks/use-scramble-text'
import { localePath, stripLocale, type Locale } from 'app/lib/locale'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { chromeCtaListClassName, chromeLinkNavClassName } from './link-styles'
import { LocaleSwitch } from './locale-switch'
import { ThemeToggle, type ThemeToggleCopy } from './theme-toggle'

const navLinkClassName = `${chromeLinkNavClassName} -mx-1 min-h-11 whitespace-nowrap sm:min-h-0`

const brandFullClassName = `${navLinkClassName} @max-lg:hidden`
const brandShortClassName = `${navLinkClassName} @lg:hidden`
const desktopNavListClassName = `${chromeCtaListClassName} @max-[23rem]:hidden`
const menuToggleClassName = `${navLinkClassName} @min-[23rem]:hidden`
const mobileMenuShellClassName = '@min-[23rem]:hidden'
const mobileMenuClassName = 'flex flex-col gap-1 pt-2'
const menuLinkClassName = `${navLinkClassName} w-full!`

const navShellClassName =
  'sticky-nav sticky top-0 z-40 -mx-4 w-[calc(100%+2rem)] border-b border-transparent bg-transparent px-4 pt-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 data-[away-from-top=true]:border-neutral-200 data-[away-from-top=true]:bg-white dark:data-[away-from-top=true]:border-neutral-800 dark:data-[away-from-top=true]:bg-black'

const navClassName = 'pointer-events-auto pb-3'

type NavCopy = {
  primary: string
  craft: string
  notes: string
  about: string
  brand: string
  menu: string
  close: string
  language: string
  theme: ThemeToggleCopy
}

type NavbarProps = {
  locale: Locale
  copy: NavCopy
}

const isCurrentPath = (pathname: string, href: string) => {
  const current = stripLocale(pathname)
  const target = stripLocale(href)

  if (target === '/') {
    return current === '/'
  }

  return current === target || current.startsWith(`${target}/`)
}

export const Navbar = ({ locale, copy }: NavbarProps) => {
  const pathname = usePathname() ?? localePath(locale, '/')
  const { isHidden, isAwayFromTop } = useScrollNavVisibility(pathname)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuLabel = isMenuOpen ? copy.close : copy.menu
  const { ref: menuLabelRef, replay: replayMenuLabel } = useScrambleText(menuLabel)
  const home = localePath(locale, '/')
  const navItems = [
    { href: localePath(locale, '/craft'), name: copy.craft },
    { href: localePath(locale, '/notes'), name: copy.notes },
    { href: localePath(locale, '/about'), name: copy.about },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const handleToggleMenu = () => {
    setIsMenuOpen((open) => !open)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div
      className={navShellClassName}
      data-scroll-hidden={isHidden ? 'true' : 'false'}
      data-away-from-top={isAwayFromTop ? 'true' : 'false'}
    >
      <nav className={navClassName} id="nav" aria-label={copy.primary}>
        <div className="@container flex w-full flex-col">
          <div className="flex w-full items-center justify-between gap-x-6 sm:gap-x-8 lg:grid lg:grid-cols-2">
            <ChromeScrambleLink
              href={home}
              text={copy.brand}
              className={brandFullClassName}
            />
            <ChromeScrambleLink
              href={home}
              text="Gutz"
              aria-label={copy.brand}
              className={brandShortClassName}
            />
            <ul className={desktopNavListClassName}>
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
              <li className="flex min-w-0 items-center gap-x-6 lg:justify-end lg:gap-x-8">
                <LocaleSwitch locale={locale} label={copy.language} />
                <ThemeToggle copy={copy.theme} />
              </li>
            </ul>
            <button
              ref={menuButtonRef}
              type="button"
              className={menuToggleClassName}
              aria-expanded={isMenuOpen}
              aria-controls="nav-menu"
              onClick={handleToggleMenu}
              onMouseEnter={replayMenuLabel}
            >
              <span ref={menuLabelRef}>{menuLabel}</span>
            </button>
          </div>
          <div className={mobileMenuShellClassName}>
            <ul
              id="nav-menu"
              aria-label={copy.menu}
              className={isMenuOpen ? mobileMenuClassName : 'hidden'}
            >
              {navItems.map((item) => (
                <li key={item.href} className="flex">
                  <ChromeScrambleLink
                    href={item.href}
                    text={item.name}
                    className={menuLinkClassName}
                    aria-current={
                      isCurrentPath(pathname, item.href) ? 'page' : undefined
                    }
                    onClick={handleCloseMenu}
                  />
                </li>
              ))}
              <li className="flex items-center gap-x-6">
                <LocaleSwitch
                  id="locale-switch-menu"
                  locale={locale}
                  label={copy.language}
                />
                <ThemeToggle copy={copy.theme} showLabel />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
