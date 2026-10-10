import { readFile, writeFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const gitignorePath = resolve(root, '.gitignore')
const start = '# local-only project placeholders'
const end = '# end local-only project placeholders'

const repoPath = (filePath) => {
  const rel = relative(root, resolve(filePath)).split('\\').join('/')

  if (!rel.startsWith('public/projects/') || rel.includes('..')) {
    return null
  }

  return `/${rel}`
}

const readIgnore = async () => {
  const text = await readFile(gitignorePath, 'utf8')

  return text.endsWith('\n') ? text : `${text}\n`
}

const replaceBlock = (text, lines) => {
  const block = `${start}\n${lines.join('\n')}\n${end}`

  if (!text.includes(start)) {
    return `${text}\n${block}\n`
  }

  return text.replace(new RegExp(`${start}\\n[\\s\\S]*?\\n${end}`), block)
}

const blockLines = (text) => {
  const match = text.match(new RegExp(`${start}\\n([\\s\\S]*?)\\n${end}`))

  if (!match) {
    return []
  }

  return match[1].split('\n').filter(Boolean)
}

export const ignoreLocalImage = async (filePath) => {
  const entry = repoPath(filePath)

  if (!entry) {
    return
  }

  const text = await readIgnore()
  const lines = blockLines(text)

  if (lines.includes(entry)) {
    return
  }

  lines.push(entry)
  await writeFile(gitignorePath, replaceBlock(text, lines))
}

export const trackLocalImage = async (filePath) => {
  const entry = repoPath(filePath)

  if (!entry) {
    return
  }

  const text = await readIgnore()
  const lines = blockLines(text).filter((line) => line !== entry)

  if (lines.length === blockLines(text).length) {
    return
  }

  await writeFile(gitignorePath, replaceBlock(text, lines))
}
