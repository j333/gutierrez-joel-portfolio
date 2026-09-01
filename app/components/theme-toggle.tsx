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
  themeLabels,
  themeToggleLabels,
  themeTooltipLabels,
  type ThemePreference,
} from '../lib/theme'
import { navTextClassName } from './link-styles'
import { MoonIcon, SunIcon } from './theme-icons'

const themeToggleClassName =
  'theme-toggle group relative inline-flex min-h-11 w-fit cursor-pointer items-center rounded-sm border-0 bg-transparent -mx-1 px-1 py-1 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:focus-visible:outline-neutral-100'

const themeLabelClassName = `${navTextClassName} theme-toggle-label whitespace-nowrap`

const themeToggleIconClassName = 'shrink-0'

export const ThemeToggle = () => {
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
      className={`${navTextClassName} ${themeToggleClassName}`}
      aria-label={mounted ? themeToggleLabels[theme] : 'Toggle color theme'}
      aria-describedby={mounted ? 'theme-tooltip' : undefined}
    >
      <span className="sr-only">
        {mounted ? themeLabels[theme] : 'Color theme'}
      </span>
      {mounted ? (
        <span id="theme-tooltip" role="tooltip" className={themeLabelClassName}>
          {themeTooltipLabels[theme]}
        </span>
      ) : null}
      <SunIcon className={`${themeToggleIconClassName} dark:hidden`} />
      <MoonIcon className={`${themeToggleIconClassName} hidden dark:inline`} />
    </button>
  )
}
