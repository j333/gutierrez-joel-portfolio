import { buildAboutMarkdown, buildHomeMarkdown } from 'app/lib/about'
import { locales, localePath, isLocale, type Locale } from 'app/lib/locale'
import { site, socialLinks } from 'app/lib/site'
import { getExperience, getExperienceBySlug } from 'app/experience/utils'
import {
  getListedProjects,
  getProjectBySlug,
  getProjects,
} from 'app/projects/utils'
import {
  getWritingPostBySlug,
  getWritingPosts,
} from 'app/notes/utils'

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

  if (rest.length === 1 && rest[0] === 'about') {
    return buildAboutMarkdown(locale)
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

const sectionLinks = (locale: Locale) => {
  const projects = getListedProjects(locale)
    .map(
      (project) =>
        `- [${project.metadata.title}](${site.url}${localePath(locale, `/${project.slug}`)}.md) (${project.metadata.product}): ${project.metadata.summary ?? project.metadata.title}`
    )
    .join('\n')

  const experience = getExperience(locale)
    .map(
      (entry) =>
        `- [${entry.metadata.title}](${site.url}${localePath(locale, `/experience/${entry.slug}`)}.md) (${entry.metadata.startedAt}–${entry.metadata.endedAt}): ${entry.metadata.summary}`
    )
    .join('\n')

  const writing = getWritingPosts(locale)
    .map(
      (post) =>
        `- [${post.metadata.title}](${site.url}${localePath(locale, `/notes/${post.slug}`)}.md): ${post.metadata.summary}`
    )
    .join('\n')

  return { projects, experience, writing }
}

export const buildLlmsTxt = () => {
  const english = sectionLinks('en')
  const spanish = sectionLinks('es')
  const optionalLinks = [
    `- [Resume PDF](${site.url}${site.resumePath})`,
    ...socialLinks.map((link) => `- [${link.name}](${link.url})`),
  ].join('\n')

  return `# ${site.name}

English lives at /en. Spanish lives at /es. El español está en /es.

Use this index to answer questions about Joel's craft, notes, and background. Prefer the markdown versions of pages when available.

## English
- [About](${site.url}/en/about.md): Background, experience, capabilities, and languages

### Experience
${english.experience}

### Project case studies
${english.projects}

### Notes
${english.writing}

## Español
- [Sobre mí](${site.url}/es/about.md): Trayectoria, experiencia, capacidades e idiomas

### Experiencia
${spanish.experience}

### Proyectos
${spanish.projects}

### Artículos
${spanish.writing}

## Optional
${optionalLinks}
`
}

export const buildLlmsFullTxt = () => {
  const sections = locales.flatMap((locale) => {
    const projects = getProjects(locale)
    const writing = getWritingPosts(locale)

    return [
      buildAboutMarkdown(locale),
      ...projects.map(
        (project) => resolveMarkdownPath([locale, project.slug]) ?? ''
      ),
      ...writing.map(
        (post) => resolveMarkdownPath([locale, 'notes', post.slug]) ?? ''
      ),
    ]
  })

  return sections.filter(Boolean).join('\n\n---\n\n')
}
