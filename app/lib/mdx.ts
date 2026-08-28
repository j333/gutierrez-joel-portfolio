import fs from 'fs'
import path from 'path'

export type MdxEntry<TMetadata> = {
  metadata: TMetadata
  slug: string
  content: string
}

const parseFrontmatter = <TMetadata>(fileContent: string) => {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Record<string, string> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    const value = valueArr
      .join(': ')
      .trim()
      .replace(/^['"](.*)['"]$/, '$1')

    metadata[key.trim()] = value
  })

  return { metadata: metadata as TMetadata, content }
}

const getMdxFiles = (dir: string) =>
  fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')

export const getMdxDirectory = (...segments: string[]) =>
  path.join(process.cwd(), 'app', ...segments)

export const getMdxData = <TMetadata>(dir: string): MdxEntry<TMetadata>[] => {
  const mdxFiles = getMdxFiles(dir)

  return mdxFiles.map((file) => {
    const rawContent = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { metadata, content } = parseFrontmatter<TMetadata>(rawContent)
    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}
