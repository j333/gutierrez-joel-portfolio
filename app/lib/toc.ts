import { slugify } from 'app/lib/slugify'

export type TocHeading = {
  id: string
  text: string
}

const headingLine = /^##\s+(.+?)\s*$/

export const getHeadings = (content: string): TocHeading[] => {
  const headings: TocHeading[] = []

  for (const line of content.split('\n')) {
    if (line.startsWith('###')) {
      continue
    }

    const match = headingLine.exec(line)

    if (!match) {
      continue
    }

    const text = match[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim()

    if (!text) {
      continue
    }

    headings.push({ id: slugify(text), text })
  }

  return headings
}
