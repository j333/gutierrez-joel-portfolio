export const site = {
  name: 'Joel Gutiérrez',
  url: 'https://www.gutierrezjoel.com',
  host: 'gutierrezjoel.com',
  githubUrl: 'https://github.com/j333/gutierrez-joel-portfolio/',
  resumePath: '/Joel_Gutierrez_Resume.pdf',
  email: 'joelg333@gmail.com',
  school: 'Universidad Nacional de Cuyo',
  educationStart: '2008',
  educationEnd: '2013',
  stack: [
    'Claude',
    'Cursor',
    'FigJam',
    'Figma',
    'Linear',
    'Notion',
    'PostHog',
    'Slack',
  ],
} as const

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

export const workIndex = {
  title: 'Craft',
  description:
    'Selected product design cases from Joel Gutiérrez.',
  intro: 'Selected cases in product design, systems, and strategy.',
  path: '/craft',
  eyebrow: 'CRAFT',
} as const

export const notesIndex = {
  title: 'Notes',
  description: 'Notes on design, product, and craft from Joel Gutiérrez.',
  intro: 'Notes on design, product, and the ideas that stick.',
  path: '/notes',
  eyebrow: 'NOTES',
} as const

export const aboutIndex = {
  title: 'About',
  heading: 'Gutiérrez Joel',
  description:
    'Product designer with a background in development and business, working at the intersection of design, product, and development.',
  intro: 'Product Designer',
  path: '/about',
  eyebrow: 'ABOUT',
} as const

export const projectsIndex = {
  eyebrow: 'PROJECT',
} as const
