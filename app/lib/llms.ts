import { buildAboutMarkdown, buildHomeMarkdown } from 'app/lib/about'
import { site, socialLinks } from 'app/lib/site'
import { getExperienceBySlug } from 'app/experience/utils'
import { getProjectBySlug, getProjects } from 'app/projects/utils'
import {
  getWritingPostBySlug,
  getWritingPosts,
} from 'app/writing/utils'

export const markdownContentType = 'text/markdown; charset=utf-8'

export const markdownResponse = (body: string) =>
  new Response(`${body.trim()}\n`, {
    headers: {
      'Content-Type': markdownContentType,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
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

  if (path.length === 0 || (path.length === 1 && path[0] === 'index')) {
    return buildHomeMarkdown()
  }

  if (path.length === 1 && path[0] === 'about') {
    return buildAboutMarkdown()
  }

  if (path.length === 2 && path[0] === 'writing') {
    const post = getWritingPostBySlug(path[1])

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

  if (path.length === 2 && path[0] === 'experience') {
    const entry = getExperienceBySlug(path[1])

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

  if (path.length === 1) {
    const project = getProjectBySlug(path[0])

    if (!project) {
      return null
    }

    return formatMdxEntryMarkdown(
      {
        title: project.metadata.title,
        startedAt: project.metadata.startedAt,
        endedAt: project.metadata.endedAt,
        ...(project.metadata.summary ? { summary: project.metadata.summary } : {}),
        ...(project.metadata.role ? { role: project.metadata.role } : {}),
      },
      project.content
    )
  }

  return null
}

export const buildLlmsTxt = () => {
  const projects = getProjects()
  const writing = getWritingPosts()

  const projectLinks = projects
    .map(
      (project) =>
        `- [${project.metadata.title}](${site.url}/${project.slug}.md): ${project.metadata.summary ?? project.metadata.title}`
    )
    .join('\n')

  const writingLinks = writing
    .map(
      (post) =>
        `- [${post.metadata.title}](${site.url}/writing/${post.slug}.md): ${post.metadata.summary}`
    )
    .join('\n')

  const optionalLinks = [
    `- [Resume PDF](${site.url}${site.resumePath})`,
    ...socialLinks.map((link) => `- [${link.name}](${link.url})`),
  ].join('\n')

  return `# ${site.name}
> ${site.description}

Use this index to answer questions about Joel's work, writing, and background. Prefer the markdown versions of pages when available.

## About
- [About](${site.url}/about.md): Background, experience, capabilities, and languages

## Projects
${projectLinks}

## Writing
${writingLinks}

## Optional
${optionalLinks}
`
}

export const buildLlmsFullTxt = () => {
  const projects = getProjects()
  const writing = getWritingPosts()
  const sections = [
    buildAboutMarkdown(),
    ...projects.map((project) => resolveMarkdownPath([project.slug]) ?? ''),
    ...writing.map((post) => resolveMarkdownPath(['writing', post.slug]) ?? ''),
  ]

  return sections.filter(Boolean).join('\n\n---\n\n')
}
