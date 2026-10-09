'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  isLocale,
  localeCookieMaxAge,
  localeCookieName,
  localePath,
  locales,
  stripLocale,
  type Locale,
} from 'app/lib/locale'
import { chromeLinkSharedClassName } from './link-styles'

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
}

const localeSelectClassName = `${chromeLinkSharedClassName} min-h-11 cursor-pointer appearance-none border-0 bg-transparent py-1 pr-5 uppercase tracking-wider transition-colors hover:text-black sm:min-h-0 dark:hover:text-white`

type LocaleSwitchProps = {
  locale: Locale
  label: string
  id?: string
}

const rememberLocale = (locale: Locale) => {
  document.cookie = `${localeCookieName}=${locale}; Path=/; Max-Age=${localeCookieMaxAge}; SameSite=Lax`
}

export const LocaleSwitch = ({
  locale,
  label,
  id = 'locale-switch',
}: LocaleSwitchProps) => {
  const pathname = usePathname() ?? localePath(locale, '/')
  const router = useRouter()
  const barePath = stripLocale(pathname)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value

    if (!isLocale(next) || next === locale) {
      return
    }

    rememberLocale(next)
    router.replace(localePath(next, barePath))
  }

  return (
    <div className="relative -mx-1 inline-flex w-fit items-center justify-self-start">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={localeSelectClassName}
        value={locale}
        onChange={handleChange}
      >
        {locales.map((item) => (
          <option key={item} lang={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1/2 size-0 -translate-y-1/2 border-x-[3px] border-t-[4px] border-x-transparent border-t-current text-neutral-600 dark:text-neutral-400"
      />
    </div>
  )
}
