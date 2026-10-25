import { en } from 'app/lib/dictionaries/en'
import { site, socialLinks } from 'app/lib/site'

export const caseSlugs = [
  'marketfully',
  'jaga',
  'getgloby',
  'golf-boost',
  'kove-800x-rally',
] as const

export type CaseSlug = (typeof caseSlugs)[number]

type Copy = {
  en: string
  es: string
}

type CaseStudy = {
  slug: (typeof caseSlugs)[number]
  path: string
  title: Copy
  summary: Copy
  product: string
  role: string
  years: string
  tags: string[]
  detail: string
}

type ExperienceRole = {
  slug: string
  path: string
  title: string
  role: string
  years: string
  summary: string
  detail: string
}

type Note = {
  slug: string
  path: string
  title: string
  summary: string
}

const profile = en.about

export const joelContext = {
  name: site.name,
  headline:
    'Product Design Manager. Strategic design, product vision, AI and emerging technology, research, B2B/B2C transformation, system thinker.',
  location: 'Luján de Cuyo, Mendoza, Argentina',
  bio: profile.bio,
  skills: [
    ...profile.skills,
    'Process automation',
    'Project management',
  ],
  email: site.email,
  linkedin: 'https://linkedin.com/in/gutierrezjoel',
  links: socialLinks.map((link) => ({ name: link.name, url: link.url })),
  stack: site.stack,
  cases: [
    {
      slug: 'marketfully',
      path: '/marketfully',
      title: {
        en: 'AI marketing platform',
        es: 'Plataforma de marketing con IA',
      },
      summary: {
        en: 'Opportunity discovery, content creation, and transcreation in one AI product for global brands and agencies.',
        es: 'Búsqueda de oportunidades, creación y transcreación de contenido de marketing con IA para marcas globales y agencias.',
      },
      product: 'Marketfully',
      role: 'Product Design Manager',
      years: '2022–2026',
      tags: ['AI platform', 'Marketing / SaaS'],
      detail:
        'After GetGloby was acquired, Joel led product design at Marketfully: one web app to translate, transcreate, and generate on-brand content, with native-language experts for review. Research showed the human could not be removed; the loop he designed keeps a person directing while the agent drafts from brand data. Brand, audience, and glossary travel with every brief. He also led design-team growth, shared design systems, and the move to PostHog, which cut analytics cost while expanding the metrics collected.',
    },
    {
      slug: 'jaga',
      path: '/jaga',
      title: {
        en: 'Product identity for transcreation',
        es: 'Identidad de producto para transcreación',
      },
      summary: {
        en: 'Led the product identity for GetGloby’s transcreation engine so a complex AI capability could be named, sold, and used, in the product and in market.',
        es: 'Lideré la identidad de producto del motor de transcreación de GetGloby para que una capacidad compleja de IA pudiera nombrarse, venderse y usarse, en el producto y en el mercado.',
      },
      product: 'Jaga',
      role: 'Head of Design and UX',
      years: '2022–2025',
      tags: ['Product identity', 'Marketing / SaaS'],
      detail:
        'Jaga is GetGloby’s transcreation engine: AI and NLP that read tone, cultural context, and intent, not just words. The engine was powerful and invisible. Joel named it and built one language for the product UI and the sales materials, so screens and decks told the same story. An internal workshop set the positioning. LinkedIn records the same work as the UX architecture for Jaga, the core AI engine.',
    },
    {
      slug: 'getgloby',
      path: '/getgloby',
      title: {
        en: 'Localization SaaS platform',
        es: 'Plataforma SaaS de localización',
      },
      summary: {
        en: 'A translation and localization platform, from first MVP through acquisition into Marketfully.AI.',
        es: 'Una plataforma de traducción y localización, del primer MVP a la adquisición dentro de Marketfully.AI.',
      },
      product: 'GetGloby',
      role: 'Head of Design and UX',
      years: '2022–2025',
      tags: ['Localization platform', 'Translation / SaaS'],
      detail:
        'Joel joined in 2022 as the first product hire, reporting to the CTO and CPO, and took the service MVP to a product teams could run: brand, design system, and a shared backlog. He built the design team and the operating stack. He started as Lead Product Designer in 2022 and became Head of Design and UX through the acquisition by Marketfully, keeping product and design aligned across the handoff.',
    },
    {
      slug: 'golf-boost',
      path: '/golf-boost',
      title: {
        en: 'Motion-based golf training app',
        es: 'App de entrenamiento de golf con reconocimiento de movimiento',
      },
      summary: {
        en: 'Part-time iOS app with body recognition for golf training.',
        es: 'App de iOS a tiempo parcial, con reconocimiento corporal para entrenar golf.',
      },
      product: 'Golf Boost',
      role: 'Principal Product Designer',
      years: '2019–2022',
      tags: ['iOS app', 'Sports'],
      detail:
        'Part-time iOS app for Golf Boost Software Company in Miami. Body recognition captured the swing and returned feedback people could follow. Joel led the rebrand and the visual and interaction foundations, shaped by user interviews. The public case covers 2019–2022. Earlier in that span he was UX Designer (2019–2021), including the Golf Boost rebrand and Rehab Boost, an AI iOS app for rehabilitation exercises.',
    },
    {
      slug: 'kove-800x-rally',
      path: '/kove-800x-rally',
      title: {
        en: 'Raising perceived value on the 800X Rally',
        es: 'Subir el valor percibido de la 800X Rally',
      },
      summary: {
        en: 'An experimental brand, graphics, and landing study to raise perceived value on Kove’s 800X Rally, adding to a performance story that is already there. Not a commissioned case.',
        es: 'Un estudio experimental de marca, gráfica y landing para subir el valor percibido de la 800X Rally de Kove, sumando a una historia de performance que ya está. No es un caso encargado.',
      },
      product: 'Kove',
      role: 'Designer',
      years: '2026',
      tags: ['Brand, graphics, and landing', 'Motorcycles'],
      detail:
        'A personal experiment, not a commissioned case and not a live product. Kove already had a performance story and a teal color. Joel simplified the wordmark and tank graphics and designed a first impression for the model page: one hero, a quiet nav, the name, and four specs. The study did not invent a new brand story. It tried to let the existing one read more clearly.',
    },
  ],
  experience: [
    {
      slug: 'marketfully',
      path: '/experience/marketfully',
      title: 'Marketfully',
      role: 'Product Design Manager',
      years: '2022–2026',
      summary:
        'From MVP to scalable SaaS through acquisition, then product leadership and AI-based marketing workflows.',
      detail:
        'First product hire at GetGloby in 2022, reporting to the CTO and CPO. Stayed from the services MVP through acquisition into Marketfully.AI. Shaped the product, the value proposition, and the systems a small team needed to grow. On the Marketfully side he prioritized work, grew the design team, maintained shared design systems for content generation, and selected PostHog, cutting analytics cost while collecting more of the metrics that mattered.',
    },
    {
      slug: 'dickeys-barbecue',
      path: '/experience/dickeys-barbecue',
      title: "Dickey's Barbecue",
      role: 'Senior Product Designer',
      years: '2021',
      summary:
        'Digital product design for the launch of Barbecue at Home, plus features across Wing Boss, Big Deal Burger, and Trailer Birds.',
      detail:
        'Remote, with design and development in Croatia, development in Argentina, and product in the United States. Most of the time went to Barbecue at Home, the ecommerce launch that ships meats, sauces, and rubs with recipes. Wing Boss, Big Deal Burger, and Trailer Birds already existed; the work there was new features, informed by user research, not new products from scratch.',
    },
    {
      slug: 'centric-digital',
      path: '/experience/centric-digital',
      title: 'Centric Digital',
      role: 'Senior Product Designer',
      years: '2014–2021',
      summary:
        "Digital product development, design, and branding for major agency clients such as AIG, Kaiser Permanente, Humana, and Victoria's Secret.",
      detail:
        'Started in Mendoza doing design and front-end, then focused on design, with product and account leads in New York. Clients included AIG, Kaiser Permanente, Humana, and Victoria’s Secret, plus brand identities for Dear Jack and Premo. Led the Dummies rebrand, a system for a catalog of more than 200 million books in print and 2,500 titles. Joined AIG code-a-thons in New York, Malaysia, and remotely across other offices. The public title is Senior Product Designer for the whole span; the work moved from interface design into product design and then senior product design.',
    },
    {
      slug: 'vspt-wine-group',
      path: '/experience/vspt-wine-group',
      title: 'VSPT Wine Group',
      role: 'Marketing Designer',
      years: '2013–2014',
      summary:
        'Marketing and design leadership for the Argentina brands, reaching markets around the world.',
      detail:
        'First in-house marketing design role after design school. Web and graphic materials for eight major brands, including winery labels that had to ship into more than 23 countries. Also organized marketing assets for dealers so the library was usable.',
    },
  ],
  notes: [
    {
      slug: 'my-2026-tool-stack',
      path: '/notes/my-2026-tool-stack',
      title: 'My 2026 Tool Stack: Daily Essentials as a Product Design Manager',
      summary:
        'The essential toolkit that drives my daily product design workflow.',
    },
    {
      slug: 'liquid-glass',
      path: '/notes/liquid-glass',
      title:
        'Liquid Glass has reignited ideas that never quite disappeared',
      summary:
        'From Apple’s Liquid Glass to Aqua Design: interfaces that behave like states of matter.',
    },
  ],
  background: {
    ventures: [
      'Cofactor, Co-Founder and Product Lead, Mendoza, since September 2026. Product strategy, client relationships, a design system, brand, the company landing page, and front-end with the technical co-founder. cofactor.team.',
      'Kywise, Founder and Director, Mendoza, since August 2025. Process automation and digital transformation for B2B clients, custom AI agents, and the company brand and website. kywise.com.',
    ],
    otherRoles: [
      'Viña Errázuriz, Product Manager, Santiago, 2017–2020. Product strategy for digital asset management, with market research and cross-functional work on workflows. There is no case study for this role.',
    ],
    education:
      'Graphic Designer, Universidad Nacional de Cuyo, Mendoza, 2008–2013.',
    languages: 'English, professional working proficiency. Spanish, native.',
    certifications: [
      'UX Foundations: Accessibility',
      'Scrum: The Basics',
      'Creating a Design System with Adobe XD',
      'Learning Design Sprints',
      'Project Management for Designers',
    ],
  },
} as const satisfies {
  name: string
  headline: string
  location: string
  bio: readonly string[]
  skills: readonly string[]
  email: string
  linkedin: string
  links: readonly { name: string; url: string }[]
  stack: readonly string[]
  cases: readonly CaseStudy[]
  experience: readonly ExperienceRole[]
  notes: readonly Note[]
  background: {
    ventures: readonly string[]
    otherRoles: readonly string[]
    education: string
    languages: string
    certifications: readonly string[]
  }
}

export type JoelContext = typeof joelContext
