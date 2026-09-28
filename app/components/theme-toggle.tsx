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
  'theme-toggle group relative inline-flex min-h-11 cursor-pointer items-center rounded-sm border-0 bg-transparent -mx-1 px-1 py-1 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:focus-visible:outline-neutral-100'

const themeLabelClassName = `${navTextClassName} theme-toggle-label whitespace-nowrap`

const themeToggleIconClassName = 'shrink-0'

type ThemeToggleProps = {
  copy: ThemeToggleCopy
  showLabel?: boolean
}

export const ThemeToggle = ({ copy, showLabel = false }: ThemeToggleProps) => {
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
        showLabel
          ? `${navTextClassName} ${themeToggleClassName} w-full justify-start gap-1 whitespace-nowrap`
          : `${navTextClassName} ${themeToggleClassName} w-fit`
      }
      aria-label={
        mounted
          ? theme === 'light'
            ? copy.switchToDark
            : copy.switchToLight
          : copy.toggle
      }
      aria-describedby={!showLabel && mounted ? 'theme-tooltip' : undefined}
    >
      <span className="sr-only">
        {mounted
          ? theme === 'light'
            ? copy.light
            : copy.dark
          : copy.colorTheme}
      </span>
      {showLabel && mounted ? (
        <span>{theme === 'light' ? copy.lightShort : copy.darkShort}</span>
      ) : null}
      {!showLabel && mounted ? (
        <span id="theme-tooltip" role="tooltip" className={themeLabelClassName}>
          {theme === 'light' ? copy.lightShort : copy.darkShort}
        </span>
      ) : null}
      <SunIcon className={`${themeToggleIconClassName} dark:hidden`} />
      <MoonIcon className={`${themeToggleIconClassName} hidden dark:inline`} />
    </button>
  )
}
