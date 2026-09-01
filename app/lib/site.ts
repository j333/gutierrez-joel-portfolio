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
  ...socialLinks.map((link) => link.url),
  'https://github.com/j333',
] as const

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

export const aboutIndex = {
  title: 'About',
  description:
    'Product designer with over a decade of experience in product strategy, design systems, design leadership, and UX.',
  intro: 'Background, experience, and how I work.',
  path: '/about',
  eyebrow: 'ABOUT',
} as const

export const projectsIndex = {
  eyebrow: 'PROJECT',
} as const
