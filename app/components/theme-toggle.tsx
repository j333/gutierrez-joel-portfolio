'use client'

import { useEffect, useState } from 'react'
import {
  applyTheme,
  cycleTheme,
  DEFAULT_THEME,
  ensureDefaultTheme,
  getStoredTheme,
  setTheme,
  themeLabels,
  themeToggleLabels,
  themeTooltipLabels,
  type ThemePreference,
} from '../lib/theme'
import { navTextClassName } from './link-styles'
import { MoonIcon, SunIcon, SystemIcon } from './theme-icons'

const themeToggleClassName =
  'theme-toggle group relative inline-flex w-fit cursor-pointer items-center rounded-sm border-0 bg-transparent -mx-1 px-1 py-1 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const themeLabelClassName = `${navTextClassName} theme-toggle-label whitespace-nowrap`

const themeToggleIconClassName = 'shrink-0'

const themeIcons: Record<ThemePreference, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
}

export const ThemeToggle = () => {
  const [theme, setThemeState] = useState<ThemePreference>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = ensureDefaultTheme()
    setThemeState(storedTheme)
    applyTheme(storedTheme)
    setMounted(true)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (getStoredTheme() === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  const handleToggleTheme = () => {
    const nextTheme = cycleTheme(theme)
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

  const Icon = themeIcons[theme]

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
      <Icon className={themeToggleIconClassName} />
    </button>
  )
}
