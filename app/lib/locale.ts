export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeCookieName = 'locale'

export const localeCookieMaxAge = 60 * 60 * 24 * 365

export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_AR',
}

export const isLocale = (value: string | undefined): value is Locale =>
  value === 'en' || value === 'es'

export const localePath = (locale: Locale, path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`

  if (normalized === '/') {
    return `/${locale}`
  }

  return `/${locale}${normalized}`
}

export const stripLocale = (pathname: string) => {
  const segments = pathname.split('/')

  if (!isLocale(segments[1])) {
    return pathname || '/'
  }

  const rest = segments.slice(2).join('/')

  return rest ? `/${rest}` : '/'
}

export const localeFromPathname = (pathname: string): Locale => {
  const first = pathname.split('/')[1]

  return isLocale(first) ? first : defaultLocale
}

export const negotiateLocale = (header: string | null) => {
  if (!header) {
    return defaultLocale
  }

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const quality = params.find((param) => param.trim().startsWith('q='))
      const parsed = quality ? Number(quality.trim().slice(2)) : 1

      return {
        tag: tag.toLowerCase(),
        quality: Number.isFinite(parsed) ? parsed : 0,
      }
    })
    .filter((item) => item.tag && item.quality > 0)
    .sort((a, b) => b.quality - a.quality)

  for (const item of ranked) {
    if (item.tag === 'es' || item.tag.startsWith('es-')) {
      return 'es' as const
    }

    if (item.tag === 'en' || item.tag.startsWith('en-')) {
      return 'en' as const
    }
  }

  return defaultLocale
}

export const legacyContentPath = (pathname: string) => {
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    return pathname.replace(/^\/blog/, '/notes')
  }

  if (pathname === '/writing') {
    return '/notes'
  }

  if (pathname.startsWith('/writing/')) {
    const rest = pathname.slice('/writing/'.length)

    if (rest && !rest.includes('/')) {
      return `/notes/${rest}`
    }
  }

  if (pathname === '/experience') {
    return '/about'
  }

  if (pathname === '/experience/getgloby') {
    return '/experience/marketfully'
  }

  if (
    pathname === '/rehab-boost' ||
    pathname === '/experience/golf-boost' ||
    pathname === '/experience/rehab-boost'
  ) {
    return '/golf-boost'
  }

  if (pathname === '/experience/vina-errazuriz') {
    return '/about'
  }

  return pathname
}
