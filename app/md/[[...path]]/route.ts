import { notFound } from 'next/navigation'
import { markdownResponse, resolveMarkdownPath } from 'app/lib/llms'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const { getProjects } = await import('app/projects/utils')
  const { getWritingPosts } = await import('app/writing/utils')
  const { getExperience } = await import('app/experience/utils')

  return [
    { path: ['index'] },
    { path: ['about'] },
    ...getProjects().map((project) => ({ path: [project.slug] })),
    ...getWritingPosts().map((post) => ({ path: ['writing', post.slug] })),
    ...getExperience().map((entry) => ({
      path: ['experience', entry.slug],
    })),
  ]
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
