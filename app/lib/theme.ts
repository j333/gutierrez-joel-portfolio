export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

export const DEFAULT_THEME: ThemePreference = 'system'

export const getStoredTheme = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  return DEFAULT_THEME
}

export const ensureDefaultTheme = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored as ThemePreference
  }

  localStorage.setItem(STORAGE_KEY, DEFAULT_THEME)
  return DEFAULT_THEME
}

export const getSystemPrefersDark = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const resolveIsDark = (theme: ThemePreference): boolean => {
  if (theme === 'dark') {
    return true
  }

  if (theme === 'light') {
    return false
  }

  return getSystemPrefersDark()
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
  if (current === 'system') {
    return 'light'
  }

  if (current === 'light') {
    return 'dark'
  }

  return 'system'
}

export const themeInitScript = `(function(){try{var k='theme',s=localStorage.getItem(k),t=s==='light'||s==='dark'||s==='system'?s:'system';if(t!==s)localStorage.setItem(k,t);var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.remove('light','dark');if(t==='light')r.classList.add('light');if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light'}catch(e){}})()`

export const themeLabels: Record<ThemePreference, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
}

export const themeTooltipLabels: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export const themeToggleLabels: Record<ThemePreference, string> = {
  system: 'Switch to light mode',
  light: 'Switch to dark mode',
  dark: 'Switch to system theme',
}
