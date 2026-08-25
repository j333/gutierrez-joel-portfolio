import fs from 'fs'
import path from 'path'

export type Metadata = {
  title: string
  startedAt: string
  endedAt: string
  summary: string
  role?: string
  type?: string
  startedOn?: string
  endedOn?: string
  industry?: string
  workplace?: string
  image?: string
}

type ExperienceEntry = {
  metadata: Metadata
  slug: string
  content: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getExperience() {
  return getMDXData(
    path.join(process.cwd(), 'app', 'experience', 'posts')
  ).sort((a, b) => {
    if (a.metadata.endedAt !== b.metadata.endedAt) {
      return b.metadata.endedAt.localeCompare(a.metadata.endedAt)
    }

    return b.metadata.startedAt.localeCompare(a.metadata.startedAt)
  })
}

export function getExperienceCanonicalUrl(
  entry: ExperienceEntry,
  siteUrl: string
) {
  return `${siteUrl}/experience/${entry.slug}`
}
