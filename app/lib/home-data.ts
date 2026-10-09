export const homeBrands = [
  {
    name: 'AIG',
    src: '/brands/aig.png',
    width: 159,
    height: 86,
  },
  {
    name: 'Humana',
    src: '/brands/humana.png',
    width: 220,
    height: 46,
  },
  {
    name: 'Kaiser Permanente',
    src: '/brands/kaiser-permanente.png',
    width: 254,
    height: 71,
  },
  {
    name: 'For Dummies',
    src: '/brands/dummies.png',
    width: 220,
    height: 59,
  },
  {
    name: "Dickey's Barbecue Pit",
    src: '/brands/dickeys-barbecue.png',
    width: 193,
    height: 109,
  },
  {
    name: 'Marketfully',
    src: '/brands/marketfully.png',
    width: 276,
    height: 66,
  },
  {
    name: "Victoria's Secret",
    src: '/brands/victorias-secret.png',
    width: 245,
    height: 88,
  },
] as const

export const homeFeaturedCaseSlugs = [
  'marketfully',
  'jaga',
  'getgloby',
] as const

export type HomeFeaturedCaseSlug = (typeof homeFeaturedCaseSlugs)[number]
