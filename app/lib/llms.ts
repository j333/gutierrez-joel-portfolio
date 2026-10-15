import {
  buildAboutMarkdown,
  buildCraftMarkdown,
  buildHomeMarkdown,
  buildNotesMarkdown,
} from 'app/lib/about'
import { dictionaries } from 'app/lib/i18n'
import { locales, localePath, isLocale, type Locale } from 'app/lib/locale'
import { site, socialLinks } from 'app/lib/site'
import { getExperience, getExperienceBySlug } from 'app/experience/utils'
import { getListedProjects, getProjectBySlug } from 'app/projects/utils'
import { getWritingPostBySlug, getWritingPosts } from 'app/notes/utils'

export const markdownContentType = 'text/markdown; charset=utf-8'

export const markdownResponse = (body: string) =>
  new Response(`${body.trim()}\n`, {
    headers: {
      'Content-Type': markdownContentType,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  })

const formatMdxEntryMarkdown = (
  frontmatter: Record<string, string | undefined>,
  content: string
) => {
  const lines = Object.entries(frontmatter)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: '${value?.replace(/'/g, "\\'")}'`)

  return `---\n${lines.join('\n')}\n---\n\n${content.trim()}\n`
}

export const resolveMarkdownPath = (segments: string[] | undefined) => {
  const path = segments ?? []
  const locale = path[0]

  if (!isLocale(locale)) {
    return null
  }

  const rest = path.slice(1)

  if (rest.length === 0 || (rest.length === 1 && rest[0] === 'index')) {
    return buildHomeMarkdown(locale)
  }

  if (rest.length === 1 && rest[0] === 'craft') {
    return buildCraftMarkdown(locale)
  }

  if (rest.length === 1 && rest[0] === 'about') {
    return buildAboutMarkdown(locale)
  }

  if (rest.length === 1 && rest[0] === 'notes') {
    return buildNotesMarkdown(locale)
  }

  if (rest.length === 2 && rest[0] === 'notes') {
    const post = getWritingPostBySlug(rest[1], locale)

    if (!post) {
      return null
    }

    return formatMdxEntryMarkdown(
      {
        title: post.metadata.title,
        publishedAt: post.metadata.publishedAt,
        summary: post.metadata.summary,
        ...(post.metadata.medium ? { medium: post.metadata.medium } : {}),
      },
      post.content
    )
  }

  if (rest.length === 2 && rest[0] === 'experience') {
    const entry = getExperienceBySlug(rest[1], locale)

    if (!entry) {
      return null
    }

    return formatMdxEntryMarkdown(
      {
        title: entry.metadata.title,
        startedAt: entry.metadata.startedAt,
        endedAt: entry.metadata.endedAt,
        summary: entry.metadata.summary,
        ...(entry.metadata.role ? { role: entry.metadata.role } : {}),
      },
      entry.content
    )
  }

  if (rest.length === 1) {
    const project = getProjectBySlug(rest[0], locale)

    if (!project) {
      return null
    }

    return formatMdxEntryMarkdown(
      {
        title: project.metadata.title,
        product: project.metadata.product,
        deliverable: project.metadata.deliverable,
        startedAt: project.metadata.startedAt,
        endedAt: project.metadata.endedAt,
        ...(project.metadata.summary
          ? { summary: project.metadata.summary }
          : {}),
        ...(project.metadata.role ? { role: project.metadata.role } : {}),
      },
      project.content
    )
  }

  return null
}

const yearRange = (startedAt: string, endedAt: string) =>
  startedAt === endedAt ? startedAt : `${startedAt}–${endedAt}`

const markdownUrl = (locale: Locale, path: string) =>
  `${site.url}${localePath(locale, path)}.md`

const linkLine = (title: string, url: string, description: string) =>
  `- [${title}](${url}): ${description}`

type LlmsSectionCopy = {
  pages: string
  cases: string
  experience: string
  notes: string
  home: string
  about: string
}

const llmsSectionCopy: Record<Locale, LlmsSectionCopy> = {
  en: {
    pages: 'Pages (English)',
    cases: 'Case studies (English)',
    experience: 'Experience (English)',
    notes: 'Notes (English)',
    home: 'Headline, what Joel is working on now, selected work, previous roles, kind words, and contact',
    about: 'Bio, employment history, capabilities, and tools',
  },
  es: {
    pages: 'Páginas (español)',
    cases: 'Proyectos (español)',
    experience: 'Experiencia (español)',
    notes: 'Artículos (español)',
    home: 'Titular, en qué está trabajando ahora, trabajo seleccionado, roles anteriores, palabras amables y contacto',
    about: 'Bio, trayectoria laboral, capacidades y herramientas',
  },
}

const localeSections = (locale: Locale) => {
  const copy = dictionaries[locale]
  const labels = llmsSectionCopy[locale]

  const pages = [
    linkLine(copy.home.title, markdownUrl(locale, '/index'), labels.home),
    linkLine(copy.craft.title, markdownUrl(locale, '/craft'), copy.craft.intro),
    linkLine(copy.about.title, markdownUrl(locale, '/about'), labels.about),
    linkLine(copy.notes.title, markdownUrl(locale, '/notes'), copy.notes.intro),
  ]

  const cases = getListedProjects(locale).map((project) => {
    const meta = [
      project.metadata.product,
      project.metadata.role,
      yearRange(project.metadata.startedAt, project.metadata.endedAt),
    ]
      .filter(Boolean)
      .join(', ')

    return linkLine(
      project.metadata.title,
      markdownUrl(locale, `/${project.slug}`),
      `${meta}. ${project.metadata.summary ?? project.metadata.deliverable}`
    )
  })

  const experience = getExperience(locale).map((entry) => {
    const meta = [
      entry.metadata.role,
      yearRange(entry.metadata.startedAt, entry.metadata.endedAt),
    ]
      .filter(Boolean)
      .join(', ')

    return linkLine(
      entry.metadata.title,
      markdownUrl(locale, `/experience/${entry.slug}`),
      `${meta}. ${entry.metadata.summary}`
    )
  })

  const notes = getWritingPosts(locale).map((post) =>
    linkLine(
      post.metadata.title,
      markdownUrl(locale, `/notes/${post.slug}`),
      `${copy.meta.published} ${post.metadata.publishedAt}. ${post.metadata.summary}`
    )
  )

  return [
    `## ${labels.pages}\n\n${pages.join('\n')}`,
    `## ${labels.cases}\n\n${cases.join('\n')}`,
    `## ${labels.experience}\n\n${experience.join('\n')}`,
    `## ${labels.notes}\n\n${notes.join('\n')}`,
  ].join('\n\n')
}

export const buildLlmsTxt = () => {
  const copy = dictionaries.en
  const optionalLinks = [
    ...socialLinks.map((link) =>
      linkLine(link.name, link.url, `Joel's ${link.name} profile`)
    ),
    linkLine('Source on GitHub', site.githubUrl, 'Code for this site'),
  ].join('\n')

  return `# ${site.name}

> Portfolio of ${site.name}, ${copy.jobTitle} based in Mendoza, Argentina. ${copy.description} Case studies, employment history, and notes on design, product, and craft, in English and Spanish.

${copy.home.intro} Now: ${copy.home.now}

The site lives at [${site.host}](${site.url}). English is under /en and Spanish under /es, with the same slugs in both languages. Every page listed below has a Markdown mirror at the same path with \`.md\` appended; these are the links used here. Prefer them over the HTML pages when answering questions. The full text of every page, in both languages, is concatenated at [llms-full.txt](${site.url}/llms-full.txt).

${copy.projects.homeNote} ${copy.projects.employmentNote} the Experience entries and the About page. Contact: ${site.email}.

${localeSections('en')}

${localeSections('es')}

## Optional

${optionalLinks}
`
}

export const buildLlmsFullTxt = () => {
  const sections = locales.flatMap((locale) => [
    buildHomeMarkdown(locale),
    buildCraftMarkdown(locale),
    buildAboutMarkdown(locale),
    buildNotesMarkdown(locale),
    ...getExperience(locale).map(
      (entry) => resolveMarkdownPath([locale, 'experience', entry.slug]) ?? ''
    ),
    ...getListedProjects(locale).map(
      (project) => resolveMarkdownPath([locale, project.slug]) ?? ''
    ),
    ...getWritingPosts(locale).map(
      (post) => resolveMarkdownPath([locale, 'notes', post.slug]) ?? ''
    ),
  ])

  return sections.filter(Boolean).join('\n\n---\n\n')
}
