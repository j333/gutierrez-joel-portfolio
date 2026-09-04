import fs from 'fs'
import path from 'path'

export const DESIGN_RULE_PATH = path.join(
  process.cwd(),
  '.cursor/rules/design.mdc'
)

export type DesignTable = {
  headers: string[]
  rows: string[][]
}

export type DesignSection = {
  id: string
  title: string
  leadMarkdown: string
  bodyMarkdown: string
  tables: DesignTable[]
}

export type DesignRule = {
  description: string
  title: string
  introMarkdown: string
  sections: DesignSection[]
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')

const parseTableCells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

const parseTable = (lines: string[]): DesignTable | null => {
  if (lines.length < 2) {
    return null
  }

  const headerCells = parseTableCells(lines[0])

  const separator = lines[1]
  if (!/^[\s|:-]+$/.test(separator.trim())) {
    return null
  }

  const rows = lines
    .slice(2)
    .map((line) => {
      const cells = parseTableCells(line)
      while (cells.length < headerCells.length) {
        cells.push('')
      }
      return cells.slice(0, headerCells.length)
    })
    .filter((row) => row.some((cell) => cell.length > 0))

  return {
    headers: headerCells,
    rows,
  }
}

const splitFrontmatter = (raw: string) => {
  if (!raw.startsWith('---')) {
    return { frontmatter: '', body: raw }
  }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { frontmatter: '', body: raw }
  }

  const frontmatter = raw.slice(4, end).trim()
  const body = raw.slice(end + 4).replace(/^\n/, '')

  return { frontmatter, body }
}

const readDescription = (frontmatter: string) => {
  const match = frontmatter.match(/^description:\s*(.+)$/m)
  if (!match) {
    return ''
  }

  return match[1].trim().replace(/^["']|["']$/g, '')
}

const isTableLine = (line: string) => line.trim().startsWith('|')

const extractTablesAndBody = (contentLines: string[]) => {
  const tables: DesignTable[] = []
  const bodyLines: string[] = []
  let index = 0

  while (index < contentLines.length) {
    if (!isTableLine(contentLines[index])) {
      bodyLines.push(contentLines[index])
      index += 1
      continue
    }

    const tableStart = index
    let tableEnd = tableStart
    while (tableEnd < contentLines.length && isTableLine(contentLines[tableEnd])) {
      tableEnd += 1
    }

    const table = parseTable(contentLines.slice(tableStart, tableEnd))
    if (table) {
      tables.push(table)
    } else {
      bodyLines.push(...contentLines.slice(tableStart, tableEnd))
    }

    index = tableEnd
  }

  return { tables, bodyLines }
}

const splitLeadAndBody = (markdown: string) => {
  const trimmed = markdown.trim()
  if (!trimmed) {
    return { leadMarkdown: '', bodyMarkdown: '' }
  }

  const paragraphs = trimmed.split(/\n\n+/)
  const first = paragraphs[0] ?? ''
  const isListOnly = first
    .split('\n')
    .every((line) => {
      const value = line.trim()
      return value === '' || value.startsWith('- ') || value.startsWith('* ')
    })

  if (isListOnly) {
    return { leadMarkdown: '', bodyMarkdown: trimmed }
  }

  return {
    leadMarkdown: first.trim(),
    bodyMarkdown: paragraphs.slice(1).join('\n\n').trim(),
  }
}

const parseSections = (body: string) => {
  const lines = body.replace(/^\uFEFF?/, '').split('\n')
  let title = 'Design system'
  let introStart = 0

  while (introStart < lines.length && lines[introStart].trim() === '') {
    introStart += 1
  }

  if (lines[introStart]?.startsWith('# ')) {
    title = lines[introStart].slice(2).trim()
    introStart += 1
  }

  const sectionIndices: number[] = []
  for (let i = introStart; i < lines.length; i += 1) {
    if (lines[i].startsWith('## ')) {
      sectionIndices.push(i)
    }
  }

  const introEnd = sectionIndices[0] ?? lines.length
  const introMarkdown = lines.slice(introStart, introEnd).join('\n').trim()

  const sections: DesignSection[] = sectionIndices.map((start, index) => {
    const end = sectionIndices[index + 1] ?? lines.length
    const titleLine = lines[start]
    const sectionTitle = titleLine.slice(3).trim()
    const contentLines = lines.slice(start + 1, end)
    const { tables, bodyLines } = extractTablesAndBody(contentLines)
    const { leadMarkdown, bodyMarkdown } = splitLeadAndBody(
      bodyLines.join('\n').trim()
    )

    return {
      id: slugify(sectionTitle),
      title: sectionTitle,
      leadMarkdown,
      bodyMarkdown,
      tables,
    }
  })

  return { title, introMarkdown, sections }
}

const UTILITY_PREFIX =
  /^(bg-|text-|border-|font-|leading-|tracking-|rounded-|outline-|uppercase|lowercase|italic|not-italic|antialiased|inline-flex|items-|justify-|min-h-|px-|py-|gap-|mb-|mt-|pb-|pt-|opacity-|pointer-|transition-|underline|hover:|focus-visible:|dark:|sm:|lg:)/

export const extractClassTokens = (cell: string): string[] => {
  const ticks = [...cell.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim())

  return ticks.flatMap((token) => {
    if (
      token.startsWith('.') ||
      token.includes('ClassName') ||
      token.includes('/') ||
      token.includes('(') ||
      token.includes(')')
    ) {
      return []
    }

    const parts = token.split(/\s+/).filter(Boolean)
    return parts.filter((part) => UTILITY_PREFIX.test(part))
  })
}

export const stripMarkdownInline = (value: string) =>
  value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')

export const extractListItems = (markdown: string) =>
  markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') || line.startsWith('* '))
    .map((line) => stripMarkdownInline(line.slice(2)))

export const readDesignRule = (): DesignRule => {
  const raw = fs.readFileSync(DESIGN_RULE_PATH, 'utf-8')
  const { frontmatter, body } = splitFrontmatter(raw)
  const description = readDescription(frontmatter)
  const { title, introMarkdown, sections } = parseSections(body)

  return {
    description,
    title,
    introMarkdown,
    sections,
  }
}
