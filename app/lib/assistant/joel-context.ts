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

export const extraSkills = {
  en: ['Process automation', 'Project management'],
  es: ['Automatización de procesos', 'Gestión de proyectos'],
} as const

const certifications = [
  'UX Foundations: Accessibility',
  'Scrum: The Basics',
  'Creating a Design System with Adobe XD',
  'Learning Design Sprints',
  'Project Management for Designers',
] as const

type Background = {
  ventures: readonly string[]
  otherRoles: readonly string[]
  education: string
  languages: string
  certifications: readonly string[]
}

export const backgroundCopy: { en: Background; es: Background } = {
  en: {
    ventures: [
      'Cofactor, Co-Founder and Product Lead, Mendoza, since September 2026. Product strategy, client relationships, a design system, brand, the company landing page, and front-end with the technical co-founder. cofactor.team.',
      'Kywise, Founder and Director, Mendoza, since August 2025. Process automation and digital transformation for B2B clients, custom AI agents, and the company brand and website. kywise.com.',
    ],
    otherRoles: [
      'Viña Errázuriz, Product Manager, Santiago, 2017–2020. Product strategy for digital asset management, with market research and cross-functional work on workflows. There is no case study for this role.',
    ],
    education: 'Graphic Designer, Universidad Nacional de Cuyo, Mendoza, 2008–2013.',
    languages: 'English, professional working proficiency. Spanish, native.',
    certifications,
  },
  es: {
    ventures: [
      'Cofactor, cofundador y Product Lead, Mendoza, desde septiembre de 2026. Estrategia de producto, relación con clientes, un sistema de diseño, marca, la landing de la empresa y front-end con el cofundador técnico. cofactor.team.',
      'Kywise, fundador y director, Mendoza, desde agosto de 2025. Automatización de procesos y transformación digital para clientes B2B, agentes de IA a medida, y la marca y el sitio de la empresa. kywise.com.',
    ],
    otherRoles: [
      'Viña Errázuriz, Product Manager, Santiago, 2017–2020. Estrategia de producto para la gestión de activos digitales, con investigación de mercado y trabajo entre equipos sobre los flujos. No hay un caso de estudio para este rol.',
    ],
    education: 'Diseñador gráfico, Universidad Nacional de Cuyo, Mendoza, 2008–2013.',
    languages: 'Inglés, competencia profesional de trabajo. Español, nativo.',
    certifications,
  },
}

export const caseDetails: Record<CaseSlug, Copy> = {
  marketfully: {
    en: 'After GetGloby was acquired, Joel led product design at Marketfully: one web app to translate, transcreate, and generate on-brand content, with native-language experts for review. Research showed the human could not be removed; the loop he designed keeps a person directing while the agent drafts from brand data. Brand, audience, and glossary travel with every brief. He also led design-team growth, shared design systems, and the move to PostHog, which cut analytics cost while expanding the metrics collected.',
    es: 'Después de la adquisición de GetGloby, Joel lideró el diseño de producto en Marketfully: una web app para traducir, transcrear y generar contenido de marca, con expertos nativos para la revisión. La investigación mostró que lo humano no se podía sacar del proceso; el loop que diseñó deja a una persona dirigiendo mientras el agente redacta desde los datos de marca. Marca, audiencia y glosario viajan con cada brief. También lideró el crecimiento del equipo de diseño, los sistemas de diseño compartidos y el paso a PostHog, que bajó el costo de analytics y amplió las métricas que se recolectan.',
  },
  jaga: {
    en: 'Jaga is GetGloby’s transcreation engine: AI and NLP that read tone, cultural context, and intent, not just words. The engine was powerful and invisible. Joel named it and built one language for the product UI and the sales materials, so screens and decks told the same story. An internal workshop set the positioning. LinkedIn records the same work as the UX architecture for Jaga, the core AI engine.',
    es: 'Jaga es el motor de transcreación de GetGloby: IA y NLP que leen tono, contexto cultural e intención, no solo palabras. El motor era potente e invisible. Joel lo nombró y armó un solo lenguaje para la UI del producto y el material de ventas, para que las pantallas y los decks contaran la misma historia. Un workshop interno definió el posicionamiento. LinkedIn registra el mismo trabajo como la arquitectura de UX de Jaga, el motor central de IA.',
  },
  getgloby: {
    en: 'Joel joined in 2022 as the first product hire, reporting to the CTO and CPO, and took the service MVP to a product teams could run: brand, design system, and a shared backlog. He built the design team and the operating stack. He started as Lead Product Designer in 2022 and became Head of Design and UX through the acquisition by Marketfully, keeping product and design aligned across the handoff.',
    es: 'Joel entró en 2022 como la primera contratación de producto, reportando al CTO y al CPO, y llevó el MVP de servicios a un producto que los equipos podían operar: marca, sistema de diseño y un backlog compartido. Armó el equipo de diseño y el stack de operación. Empezó como Lead Product Designer en 2022 y pasó a Head of Design and UX durante la adquisición por Marketfully, manteniendo producto y diseño alineados en el traspaso.',
  },
  'golf-boost': {
    en: 'Part-time iOS app for Golf Boost Software Company in Miami. Body recognition captured the swing and returned feedback people could follow. Joel led the rebrand and the visual and interaction foundations, shaped by user interviews. The public case covers 2019–2022. Earlier in that span he was UX Designer (2019–2021), including the Golf Boost rebrand and Rehab Boost, an AI iOS app for rehabilitation exercises.',
    es: 'App de iOS a tiempo parcial para Golf Boost Software Company, en Miami. El reconocimiento corporal capturaba el swing y devolvía un feedback que se podía seguir. Joel lideró el rebrand y las bases visuales y de interacción, definidas con entrevistas a usuarios. El caso público cubre 2019–2022. Antes, en ese mismo período, fue UX Designer (2019–2021), incluido el rebrand de Golf Boost y Rehab Boost, una app de iOS con IA para ejercicios de rehabilitación.',
  },
  'kove-800x-rally': {
    en: 'A personal experiment, not a commissioned case and not a live product. Kove already had a performance story and a teal color. Joel simplified the wordmark and tank graphics and designed a first impression for the model page: one hero, a quiet nav, the name, and four specs. The study did not invent a new brand story. It tried to let the existing one read more clearly.',
    es: 'Un experimento personal, no un caso encargado y no un producto en producción. Kove ya tenía una historia de performance y un color teal. Joel simplificó el wordmark y la gráfica del tanque, y diseñó una primera impresión para la página del modelo: un hero, una nav quieta, el nombre y cuatro specs. El estudio no inventó una historia de marca nueva. Intentó que la que ya existía se leyera con más claridad.',
  },
}

export const experienceDetails: Record<string, Copy> = {
  marketfully: {
    en: 'First product hire at GetGloby in 2022, reporting to the CTO and CPO. Stayed from the services MVP through acquisition into Marketfully.AI. Shaped the product, the value proposition, and the systems a small team needed to grow. On the Marketfully side he prioritized work, grew the design team, maintained shared design systems for content generation, and selected PostHog, cutting analytics cost while collecting more of the metrics that mattered.',
    es: 'Primera contratación de producto en GetGloby en 2022, reportando al CTO y al CPO. Se quedó desde el MVP de servicios hasta la adquisición dentro de Marketfully.AI. Dio forma al producto, a la propuesta de valor y a los sistemas que un equipo chico necesitaba para crecer. Del lado de Marketfully priorizó el trabajo, hizo crecer el equipo de diseño, mantuvo sistemas de diseño compartidos para la generación de contenido y eligió PostHog, bajando el costo de analytics y recolectando más de las métricas que importaban.',
  },
  'dickeys-barbecue': {
    en: 'Remote, with design and development in Croatia, development in Argentina, and product in the United States. Most of the time went to Barbecue at Home, the ecommerce launch that ships meats, sauces, and rubs with recipes. Wing Boss, Big Deal Burger, and Trailer Birds already existed; the work there was new features, informed by user research, not new products from scratch.',
    es: 'Remoto, con diseño y desarrollo en Croacia, desarrollo en Argentina y producto en Estados Unidos. La mayor parte del tiempo fue para Barbecue at Home, el lanzamiento de ecommerce que envía carnes, salsas y rubs con recetas. Wing Boss, Big Deal Burger y Trailer Birds ya existían; el trabajo ahí fueron features nuevas, informadas por investigación con usuarios, no productos nuevos desde cero.',
  },
  'centric-digital': {
    en: 'Started in Mendoza doing design and front-end, then focused on design, with product and account leads in New York. Clients included AIG, Kaiser Permanente, Humana, and Victoria’s Secret, plus brand identities for Dear Jack and Premo. Led the Dummies rebrand, a system for a catalog of more than 200 million books in print and 2,500 titles. Joined AIG code-a-thons in New York, Malaysia, and remotely across other offices. The public title is Senior Product Designer for the whole span; the work moved from interface design into product design and then senior product design.',
    es: 'Empezó en Mendoza haciendo diseño y front-end, y después se concentró en diseño, con leads de producto y de cuenta en Nueva York. Los clientes incluyeron AIG, Kaiser Permanente, Humana y Victoria’s Secret, más identidades de marca para Dear Jack y Premo. Lideró el rebrand de Dummies, un sistema para un catálogo de más de 200 millones de libros impresos y 2.500 títulos. Participó en code-a-thons de AIG en Nueva York, Malasia y en remoto con otras oficinas. El título público es Senior Product Designer para todo el período; el trabajo pasó de diseño de interfaz a diseño de producto y después a diseño de producto senior.',
  },
  'vspt-wine-group': {
    en: 'First in-house marketing design role after design school. Web and graphic materials for eight major brands, including winery labels that had to ship into more than 23 countries. Also organized marketing assets for dealers so the library was usable.',
    es: 'Primer rol in-house de diseño de marketing después de la facultad. Materiales web y gráficos para ocho marcas grandes, incluidas etiquetas de bodega que tenían que salir a más de 23 países. También ordenó los assets de marketing para los distribuidores, para que la biblioteca se pudiera usar.',
  },
}
