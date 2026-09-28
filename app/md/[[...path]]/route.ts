import { notFound } from 'next/navigation'
import { markdownResponse, resolveMarkdownPath } from 'app/lib/llms'
import { locales } from 'app/lib/locale'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const { getProjects } = await import('app/projects/utils')
  const { getWritingPosts } = await import('app/notes/utils')
  const { getExperience } = await import('app/experience/utils')

  return locales.flatMap((lang) => [
    { path: [lang, 'index'] },
    { path: [lang, 'about'] },
    ...getProjects(lang).map((project) => ({ path: [lang, project.slug] })),
    ...getWritingPosts(lang).map((post) => ({
      path: [lang, 'notes', post.slug],
    })),
    ...getExperience(lang).map((entry) => ({
      path: [lang, 'experience', entry.slug],
    })),
  ])
}

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) => {
  const { path } = await params
  const markdown = resolveMarkdownPath(path)

  if (!markdown) {
    notFound()
  }

  return markdownResponse(markdown)
}
