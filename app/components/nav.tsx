'use client'

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useScrollNavVisibility } from '../hooks/use-scroll-nav-visibility'
import { localePath, stripLocale, type Locale } from 'app/lib/locale'
import { ChromeScrambleLink } from './chrome-scramble-link'
import { LocaleSwitch } from './locale-switch'
import { chromeLinkNavClassName } from './link-styles'
import { ThemeToggle, type ThemeToggleCopy } from './theme-toggle'

const navLinkClassName = `${chromeLinkNavClassName} -mx-1 min-h-11 whitespace-nowrap sm:min-h-0`

const desktopNavListClassName =
  'flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 sm:flex-nowrap sm:gap-x-8 @max-[40rem]:hidden lg:grid lg:grid-cols-4'
const menuToggleClassName =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-neutral-600 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100 @min-[40rem]:hidden'

const menuIconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
  className: 'shrink-0',
}

const sheetLinkClassName =
  'group flex min-h-14 w-full items-center py-4 text-xl font-normal leading-7 tracking-tight text-neutral-600 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900 aria-[current=page]:text-black dark:text-neutral-400 dark:hover:text-white dark:aria-[current=page]:text-white dark:focus-visible:outline-neutral-100'

const sheetClassName =
  'nav-sheet fixed! inset-x-0 bottom-0 top-[var(--nav-height)] z-30 flex flex-col overflow-hidden bg-white px-4 pb-[max(2.5rem,calc(1rem+env(safe-area-inset-bottom)))] pt-4 motion-safe:translate-y-0 motion-safe:opacity-100 motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out motion-safe:starting:-translate-y-1 motion-safe:starting:opacity-0 dark:bg-black @min-[40rem]:hidden'

const navShellClassName =
  'sticky-nav sticky top-0 z-40 -mx-4 w-[calc(100%+2rem)] border-b border-transparent bg-transparent px-4 pt-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 data-[away-from-top=true]:border-neutral-200 data-[away-from-top=true]:bg-white dark:data-[away-from-top=true]:border-neutral-800 dark:data-[away-from-top=true]:bg-black'

const navClassName = 'pointer-events-auto pb-3'

const smContainerWidth = 40

type NavCopy = {
  primary: string
  home: string
  craft: string
  notes: string
  about: string
  brand: string
  menu: string
  close: string
}

type NavbarProps = {
  locale: Locale
  copy: NavCopy
  languageLabel: string
  theme: ThemeToggleCopy
}

const MenuIcon = () => (
  <svg {...menuIconProps}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

const CloseIcon = () => (
  <svg {...menuIconProps}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

const NavControls = ({
  locale,
  languageLabel,
  theme,
  id,
}: {
  locale: Locale
  languageLabel: string
  theme: ThemeToggleCopy
  id: string
}) => (
  <div className="flex items-center gap-x-6">
    <LocaleSwitch compact locale={locale} label={languageLabel} id={id} />
    <ThemeToggle copy={theme} />
  </div>
)

const isCurrentPath = (pathname: string, href: string) => {
  const current = stripLocale(pathname)
  const target = stripLocale(href)

  if (target === '/') {
    return current === '/'
  }

  return current === target || current.startsWith(`${target}/`)
}

const readContainerWidth = (entry: ResizeObserverEntry) => {
  return entry.contentBoxSize[0]?.inlineSize ?? entry.contentRect.width
}

export const Navbar = ({ locale, copy, languageLabel, theme }: NavbarProps) => {
  const pathname = usePathname() ?? localePath(locale, '/')
  const { isHidden, isAwayFromTop } = useScrollNavVisibility(pathname)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [navHeight, setNavHeight] = useState('0px')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wasMenuOpenRef = useRef(false)
  const isMenuOpenRef = useRef(isMenuOpen)
  const menuLabel = isMenuOpen ? copy.close : copy.menu
  const home = localePath(locale, '/')
  const navItems = [
    { href: localePath(locale, '/craft'), name: copy.craft },
    { href: localePath(locale, '/notes'), name: copy.notes },
    { href: localePath(locale, '/about'), name: copy.about },
  ]
  const sheetItems = [{ href: home, name: copy.home }, ...navItems]
  const navShellStyle = { '--nav-height': navHeight } as CSSProperties

  isMenuOpenRef.current = isMenuOpen

  useLayoutEffect(() => {
    const bar = barRef.current
    const shell = shellRef.current

    if (!bar || !shell) {
      return
    }

    const measureBar = () => {
      setNavHeight(`${shell.offsetHeight}px`)
    }

    measureBar()

    const observer = new ResizeObserver(measureBar)
    observer.observe(bar)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const closeIfWide = (width: number) => {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      )
      const smBreakpoint = rootFontSize * smContainerWidth

      if (width < smBreakpoint || !isMenuOpenRef.current) {
        return
      }

      setIsMenuOpen(false)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      closeIfWide(readContainerWidth(entry))
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMenuOpen) {
      wasMenuOpenRef.current = true
      const firstLink = sheetRef.current?.querySelector('a')

      if (firstLink instanceof HTMLElement) {
        firstLink.focus()
      }

      return
    }

    if (!wasMenuOpenRef.current) {
      return
    }

    wasMenuOpenRef.current = false
    menuButtonRef.current?.focus()
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      root.style.overflow = previousOverflow
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
      ref={shellRef}
      className={navShellClassName}
      style={navShellStyle}
      data-scroll-hidden={!isMenuOpen && isHidden ? 'true' : 'false'}
      data-away-from-top={isMenuOpen || isAwayFromTop ? 'true' : 'false'}
    >
      <nav className={navClassName} id="nav" aria-label={copy.primary}>
        <div ref={containerRef} className="@container flex w-full flex-col">
          <div
            ref={barRef}
            className="flex w-full items-center justify-between gap-x-6 sm:gap-x-8 lg:grid lg:grid-cols-2"
          >
            <div className="flex min-w-0 items-center gap-x-6 lg:gap-x-8">
              <ChromeScrambleLink
                href={home}
                text={copy.brand}
                className={navLinkClassName}
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-x-6 lg:gap-x-8">
              <ul className={`${desktopNavListClassName} flex-1`}>
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
                <li className="ml-auto flex min-w-0 items-center justify-end">
                  <NavControls
                    locale={locale}
                    languageLabel={languageLabel}
                    theme={theme}
                    id="locale-switch"
                  />
                </li>
              </ul>
              <button
                ref={menuButtonRef}
                type="button"
                className={menuToggleClassName}
                aria-expanded={isMenuOpen}
                aria-controls="nav-menu"
                aria-label={menuLabel}
                onClick={handleToggleMenu}
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          {isMenuOpen ? (
            <div
              ref={sheetRef}
              id="nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label={copy.menu}
              className={sheetClassName}
            >
              <ul className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                {sheetItems.map((item) => (
                  <li
                    key={item.href}
                    className="border-b border-neutral-200 dark:border-neutral-800"
                  >
                    <ChromeScrambleLink
                      href={item.href}
                      text={item.name}
                      className={sheetLinkClassName}
                      aria-current={
                        isCurrentPath(pathname, item.href) ? 'page' : undefined
                      }
                      onClick={handleCloseMenu}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex shrink-0 items-center self-start pt-6">
                <NavControls
                  locale={locale}
                  languageLabel={languageLabel}
                  theme={theme}
                  id="locale-switch-menu"
                />
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  )
}
