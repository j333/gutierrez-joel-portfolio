'use client'

import { useEffect, useState } from 'react'
import {
  applyTheme,
  cycleTheme,
  DEFAULT_THEME,
  getResolvedSystemTheme,
  getStoredTheme,
  resolveInitialTheme,
  setTheme,
  type ThemePreference,
} from '../lib/theme'
import { navTextClassName } from './link-styles'
import { MoonIcon, SunIcon } from './theme-icons'

export type ThemeToggleCopy = {
  light: string
  dark: string
  lightShort: string
  darkShort: string
  switchToDark: string
  switchToLight: string
  toggle: string
  colorTheme: string
}

const themeToggleClassName =
  'theme-toggle group relative inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent -mx-1 px-1 py-1 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:hover:text-white dark:focus-visible:outline-neutral-100'

const themeToggleTouchClassName =
  'theme-toggle group relative inline-flex size-11 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const themeToggleIconClassName = 'shrink-0'

type ThemeToggleProps = {
  copy: ThemeToggleCopy
  touch?: boolean
}

export const ThemeToggle = ({
  copy,
  touch = false,
}: ThemeToggleProps) => {
  const [theme, setThemeState] = useState<ThemePreference>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialTheme = resolveInitialTheme()
    setThemeState(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (getStoredTheme()) {
        return
      }

      const resolvedTheme = getResolvedSystemTheme()
      applyTheme(resolvedTheme)
      setThemeState(resolvedTheme)
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  const handleToggleTheme = () => {
    const currentTheme = getStoredTheme() ?? getResolvedSystemTheme()
    const nextTheme = cycleTheme(currentTheme)
    setTheme(nextTheme)
    setThemeState(nextTheme)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    handleToggleTheme()
  }

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      onKeyDown={handleKeyDown}
      className={
        touch
          ? `${navTextClassName} ${themeToggleTouchClassName}`
          : `${navTextClassName} ${themeToggleClassName} w-fit`
      }
      aria-label={
        mounted
          ? theme === 'light'
            ? copy.switchToDark
            : copy.switchToLight
          : copy.toggle
      }
    >
      <span className="sr-only">
        {mounted
          ? theme === 'light'
            ? copy.light
            : copy.dark
          : copy.colorTheme}
      </span>
      <SunIcon
        className={
          touch
            ? `${themeToggleIconClassName} size-5 dark:hidden`
            : `${themeToggleIconClassName} size-4 dark:hidden`
        }
      />
      <MoonIcon
        className={
          touch
            ? `${themeToggleIconClassName} size-5 hidden dark:inline`
            : `${themeToggleIconClassName} size-4 hidden dark:inline`
        }
      />
    </button>
  )
}
