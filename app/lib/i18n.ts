import { notFound } from 'next/navigation'
import { isLocale, type Locale } from 'app/lib/locale'
import { en } from 'app/lib/dictionaries/en'
import { es } from 'app/lib/dictionaries/es'

export const dictionaries = { en, es } as const

export type Dictionary = (typeof dictionaries)[Locale]

type RootParams = {
  lang: () => Promise<string>
}

export const getLocale = async () => {
  const rootParams = (await import('next/root-params')) as RootParams
  const value = await rootParams.lang()

  if (!isLocale(value)) {
    notFound()
  }

  return value
}

export const getDictionary = async () => dictionaries[await getLocale()]
