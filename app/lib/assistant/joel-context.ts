import { site, socialLinks } from 'app/lib/site'

export const caseSlugs = [
  'marketfully',
  'jaga',
  'getgloby',
  'golf-boost',
  'kove-800x-rally',
] as const

export type CaseSlug = (typeof caseSlugs)[number]

export const isCaseSlug = (value: string): value is CaseSlug =>
  caseSlugs.some((slug) => slug === value)

const linkedin =
  socialLinks.find((link) => link.name === 'LinkedIn')?.url ?? socialLinks[0].url

export const assistantContact = {
  email: site.email,
  linkedin,
} as const

type Copy = {
  en: string
  es: string
}

export const headlineCopy: Copy = {
  en: 'Product Design Manager. Strategic design, product vision, AI and emerging technology, research, B2B/B2C transformation, system thinker.',
  es: 'Product Design Manager. Diseño estratégico, visión de producto, IA y tecnología emergente, investigación, transformación B2B/B2C, pensamiento sistémico.',
}

export const locationCopy = 'Luján de Cuyo, Mendoza, Argentina'
