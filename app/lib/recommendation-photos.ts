export const recommendationPhotos = {
  'Rob Lyons': {
    src: '/recommendations/rob-lyons.webp',
    width: 200,
    height: 200,
  },
  'Asher Feldman': {
    src: '/recommendations/asher-feldman.webp',
    width: 341,
    height: 341,
  },
  'Adriel Zarate': {
    src: '/recommendations/adriel-zarate.webp',
    width: 200,
    height: 200,
  },
  'Ainhoa Lizarralde': {
    src: '/recommendations/ainhoa-lizarralde.webp',
    width: 200,
    height: 200,
  },
  'Juan Fusoni': {
    src: '/recommendations/juan-fusoni.webp',
    width: 200,
    height: 200,
  },
  'Cinthia Morabito': {
    src: '/recommendations/cinthia-morabito.webp',
    width: 200,
    height: 200,
  },
} as const

export type RecommendationPhoto =
  (typeof recommendationPhotos)[keyof typeof recommendationPhotos]

export const recommendationPhoto = (name: string) =>
  recommendationPhotos[name as keyof typeof recommendationPhotos]
