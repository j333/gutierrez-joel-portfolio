export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export const DEFAULT_THEME: ThemePreference = 'light'

const parseThemePreference = (value: string | null): ThemePreference | null => {
  if (value === 'light' || value === 'dark') {
    return value
  }

  return null
}

export const getStoredTheme = (): ThemePreference | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return parseThemePreference(localStorage.getItem(STORAGE_KEY))
}

export const getSystemPrefersDark = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const getResolvedSystemTheme = (): ThemePreference => {
  return getSystemPrefersDark() ? 'dark' : 'light'
}

export const resolveInitialTheme = (): ThemePreference => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(STORAGE_KEY)

    if (storedValue !== null && !parseThemePreference(storedValue)) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return getStoredTheme() ?? getResolvedSystemTheme()
}

export const resolveIsDark = (theme: ThemePreference): boolean => {
  return theme === 'dark'
}

export const applyTheme = (theme: ThemePreference) => {
  const isDark = resolveIsDark(theme)
  const root = document.documentElement

  root.classList.remove('light', 'dark')

  if (theme === 'light') {
    root.classList.add('light')
  }

  if (isDark) {
    root.classList.add('dark')
  }

  root.style.colorScheme = isDark ? 'dark' : 'light'
}

export const setTheme = (theme: ThemePreference) => {
  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
}

export const cycleTheme = (current: ThemePreference): ThemePreference => {
  return current === 'light' ? 'dark' : 'light'
}

export const themeInitScript = `(function(){try{var k='theme',s=localStorage.getItem(k),t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(s!==null&&s!=='light'&&s!=='dark')localStorage.removeItem(k);var d=t==='dark';var r=document.documentElement;r.classList.remove('light','dark');if(t==='light')r.classList.add('light');if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light'}catch(e){}})()`

export const themeLabels: Record<ThemePreference, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
}

export const themeTooltipLabels: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
}

export const themeToggleLabels: Record<ThemePreference, string> = {
  light: 'Switch to dark mode',
  dark: 'Switch to light mode',
}
