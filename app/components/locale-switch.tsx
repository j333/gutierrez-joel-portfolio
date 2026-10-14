'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  localeCookieMaxAge,
  localeCookieName,
  localePath,
  locales,
  stripLocale,
  type Locale,
} from 'app/lib/locale'
import { chromeLinkSharedClassName } from './link-styles'

const localeShortLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
}

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

const triggerClassName = `${chromeLinkSharedClassName} min-h-11 cursor-pointer gap-1.5 border-0 bg-transparent uppercase tracking-wider transition-colors hover:text-black aria-expanded:text-neutral-900 sm:min-h-0 dark:hover:text-white dark:aria-expanded:text-neutral-100`

const triggerTouchClassName =
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-3 font-mono text-sm uppercase leading-5 tracking-wider text-neutral-600 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 aria-expanded:text-neutral-900 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100 dark:aria-expanded:text-neutral-100'

const menuClassName =
  'absolute z-50 w-max min-w-32 border border-neutral-200 bg-white py-1 dark:border-neutral-800 dark:bg-black'

const optionClassName =
  'flex w-full cursor-pointer items-center px-3 text-left text-sm leading-5 whitespace-nowrap text-neutral-600 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900 aria-selected:text-black dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100 dark:aria-selected:text-white'

const optionTouchClassName = 'min-h-11'
const optionCompactClassName = 'min-h-9'

const menuMargin = 8
const menuEstimate = { width: 144, height: 96 }

type MenuPlacement = {
  vertical: 'up' | 'down'
  horizontal: 'start' | 'end'
}

type LocaleSwitchProps = {
  locale: Locale
  label: string
  id?: string
  compact?: boolean
  touch?: boolean
}

const rememberLocale = (locale: Locale) => {
  document.cookie = `${localeCookieName}=${locale}; Path=/; Max-Age=${localeCookieMaxAge}; SameSite=Lax`
}

const placementClassName = ({ vertical, horizontal }: MenuPlacement) => {
  const verticalClass = vertical === 'down' ? 'top-full mt-1' : 'bottom-full mb-1'
  const horizontalClass = horizontal === 'start' ? 'left-0' : 'right-0'

  return `${verticalClass} ${horizontalClass}`
}

export const LocaleSwitch = ({
  locale,
  label,
  id = 'locale-switch',
  compact = false,
  touch = false,
}: LocaleSwitchProps) => {
  const pathname = usePathname() ?? localePath(locale, '/')
  const router = useRouter()
  const barePath = stripLocale(pathname)
  const [isOpen, setIsOpen] = useState(false)
  const [placement, setPlacement] = useState<MenuPlacement>({
    vertical: 'down',
    horizontal: 'start',
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Partial<Record<Locale, HTMLDivElement | null>>>({})
  const listId = `${id}-list`

  const placeMenu = () => {
    const button = buttonRef.current

    if (!button) {
      return
    }

    const rect = button.getBoundingClientRect()
    const menuWidth = menuRef.current?.offsetWidth ?? menuEstimate.width
    const menuHeight = menuRef.current?.offsetHeight ?? menuEstimate.height
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const vertical =
      spaceBelow < menuHeight + menuMargin && spaceAbove > spaceBelow ? 'up' : 'down'
    const horizontal =
      rect.left + menuWidth > window.innerWidth - menuMargin ? 'end' : 'start'

    setPlacement((current) => {
      if (current.vertical === vertical && current.horizontal === horizontal) {
        return current
      }

      return { vertical, horizontal }
    })
  }

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    placeMenu()
    optionRefs.current[locale]?.focus()
  }, [isOpen, locale])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    const handleResize = () => {
      placeMenu()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  const selectLocale = (next: Locale) => {
    setIsOpen(false)

    if (next === locale) {
      buttonRef.current?.focus()
      return
    }

    rememberLocale(next)
    router.replace(localePath(next, barePath))
  }

  const focusOption = (next: Locale) => {
    optionRefs.current[next]?.focus()
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      setIsOpen(true)
      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    item: Locale,
  ) => {
    const index = locales.indexOf(item)

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const next = locales[(index + direction + locales.length) % locales.length]
      focusOption(next)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusOption(locales[0])
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusOption(locales[locales.length - 1])
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      buttonRef.current?.focus()
      return
    }

    if (event.key === 'Tab') {
      setIsOpen(false)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectLocale(item)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget

    if (next instanceof Node && rootRef.current?.contains(next)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={
        touch
          ? 'relative inline-flex items-center'
          : 'relative -mx-1 inline-flex w-fit items-center justify-self-start'
      }
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={touch ? triggerTouchClassName : triggerClassName}
        aria-label={`${label}: ${localeNames[locale]}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => {
          setIsOpen((open) => !open)
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{localeShortLabels[locale]}</span>
        <svg
          viewBox="0 0 10 6"
          width="10"
          height="6"
          aria-hidden="true"
          className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1.25 L5 4.75 L9 1.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </button>
      {isOpen ? (
        <div
          ref={menuRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className={`${menuClassName} ${placementClassName(placement)}`}
        >
          {locales.map((item) => (
            <div
              key={item}
              ref={(node) => {
                optionRefs.current[item] = node
              }}
              role="option"
              lang={item}
              tabIndex={item === locale ? 0 : -1}
              aria-selected={item === locale}
              className={
                compact
                  ? `${optionClassName} ${optionCompactClassName}`
                  : `${optionClassName} ${optionTouchClassName}`
              }
              onClick={() => {
                selectLocale(item)
              }}
              onKeyDown={(event) => {
                handleOptionKeyDown(event, item)
              }}
            >
              {localeNames[item]}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
