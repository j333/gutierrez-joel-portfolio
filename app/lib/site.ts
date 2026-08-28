export const site = {
  name: 'Joel Gutiérrez',
  jobTitle: 'Product Design Manager',
  url: 'https://www.gutierrezjoel.com',
  host: 'gutierrezjoel.com',
  description:
    'Product designer with over a decade of experience in product strategy, design systems, design leadership, and UX.',
  locale: 'en_US',
  githubUrl: 'https://github.com/j333/gutierrez-joel-portfolio/',
  resumePath: '/Joel_Gutierrez_Resume.pdf',
} as const

export const siteTitle = `${site.name} | ${site.jobTitle}`

export const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/gutierrezjoel' },
  { name: 'Behance', url: 'https://behance.net/gutierrezjoel' },
  { name: 'Dribbble', url: 'https://dribbble.com/gutierrezjoel' },
  { name: 'Medium', url: 'https://medium.com/@j333' },
] as const

export const sameAs = [
  socialLinks[0].url,
  'https://github.com/j333',
] as const

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.jobTitle,
  url: site.url,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mendoza',
    addressCountry: 'Argentina',
  },
  sameAs,
}

export const experienceIndex = {
  title: 'Experience',
  description: 'Brands, companies, and the projects in between.',
  path: '/experience',
  eyebrow: 'EXPERIENCE',
} as const

export const writingIndex = {
  title: 'Writing',
  description: 'Writing and notes from Joel Gutiérrez.',
  intro: 'Notes on design, product, and the ideas that stick.',
  path: '/writing',
  eyebrow: 'WRITING',
} as const
