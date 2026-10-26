import { createHash } from 'node:crypto'
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { google } from '@ai-sdk/google'
import { generateText, Output } from 'ai'
import { z } from 'zod'

const defaultVault =
  '/Users/joelgutierrez/Documents/Personal/Professional Profile/Artificial Replica'

const vaultPath = process.env.REPLICA_VAULT_PATH?.trim() || defaultVault
const force = process.argv.includes('--force')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = path.join(root, 'app/lib/assistant/replica-data.generated.json')

const includedDirectories = new Set([
  '01_Identidad_y_Estilo',
  '02_Experiencia_Profesional',
  '03_Proyectos_y_Casos_STAR',
  '04_Habilidades_y_Stack',
  '05_Educacion_y_Credenciales',
  '06_FAQ_Profesionales',
])

const coreNote = '00_Core_y_Router/01_Perfil_Core_TLDR.md'

const excludedNames = new Set([
  '_INDEX_ROUTER.md',
  '00_System_Prompt_Persona.md',
  '02_Arquitectura_Integracion_Web.md',
  '00_Plan_Maestro_Second_Brain.md',
  'README.md',
  'AGENTS.md',
])

const translationSchema = z.object({
  title: z.string().min(1),
  tldr: z.string().min(1),
  body: z.string().min(1),
})

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const readYamlValue = (raw) => {
  const value = raw.trim()

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

const parseFrontmatter = (block) => {
  const meta = {}
  const lines = block.split('\n')

  for (const line of lines) {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)

    if (!match) {
      continue
    }

    const [, key, raw] = match

    if (key === 'tags' && raw.trim().startsWith('[')) {
      meta.tags = raw
        .trim()
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
      continue
    }

    meta[key] = readYamlValue(raw)
  }

  return meta
}

const splitNote = (raw) => {
  let rest = raw.replace(/^\uFEFF/, '')
  let meta = {}

  while (rest.startsWith('---')) {
    const end = rest.indexOf('\n---', 3)

    if (end === -1) {
      break
    }

    const parsed = parseFrontmatter(rest.slice(3, end))
    rest = rest.slice(end + 4).trimStart()

    if (parsed.id) {
      meta = parsed
    }
  }

  return { meta, body: rest.trim() }
}

const stripPhone = (text) =>
  text
    .replace(/\s*·\s*\*\*Tel:\*\*\s*`[^`]+`/g, '')
    .replace(/\+54[\d\s().-]{6,}\d/g, '')

const cleanBody = (body, idByStem) => {
  const links = []
  const withoutWiki = stripPhone(body).replace(
    /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g,
    (_, target, label) => {
      const stem = target.trim()
      links.push(idByStem.get(stem) ?? stem)
      return (label ?? stem).trim()
    }
  )

  return {
    links: [...new Set(links)],
    body: withoutWiki.replace(/\[([^\]]+)\]\((?:https?:\/\/)?[^)]+\)/g, '$1').trim(),
  }
}

const hashText = (value) => createHash('sha256').update(value).digest('hex')

const collectFiles = async () => {
  const vaultStat = await stat(vaultPath).catch(() => null)

  if (!vaultStat?.isDirectory()) {
    fail(`Replica vault not found at ${vaultPath}`)
  }

  const files = [coreNote]
  const entries = await readdir(vaultPath, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || !includedDirectories.has(entry.name)) {
      continue
    }

    const notes = await readdir(path.join(vaultPath, entry.name))

    for (const name of notes) {
      if (!name.endsWith('.md') || excludedNames.has(name) || name.startsWith('_')) {
        continue
      }

      files.push(path.posix.join(entry.name, name))
    }
  }

  return files.sort()
}

const readPrevious = async () => {
  try {
    const parsed = JSON.parse(await readFile(outputPath, 'utf8'))
    const notes = Array.isArray(parsed.notes) ? parsed.notes : []

    return new Map(notes.filter((note) => note.hash && note.bodyEn).map((note) => [note.hash, note]))
  } catch {
    return new Map()
  }
}

const translateNote = async (note) => {
  const result = await generateText({
    model: google('gemini-3.5-flash-lite'),
    temperature: 0,
    maxOutputTokens: 2500,
    output: Output.object({
      schema: translationSchema,
      name: 'EnglishNote',
      description: 'English translation of one professional note',
    }),
    prompt: [
      'Translate this professional note into English, in the first person, as Joel Gutiérrez speaking about his own work.',
      'Do not add facts, metrics, clients, dates, or quotes.',
      'Keep numbers, dates, and proper names unchanged.',
      'Keep quotations in their original language.',
      'Keep markdown headings.',
      'The email address may stay. Do not add a phone number.',
      '',
      `Title: ${note.titleEs}`,
      `TLDR: ${note.tldrEs}`,
      'Body:',
      note.bodyEs,
    ].join('\n'),
  })

  const translated = result.output

  if (!translated?.title || !translated.tldr || !translated.body) {
    throw new Error(`empty translation for ${note.id}`)
  }

  if (/\+54[\d\s().-]{6,}\d/.test(`${translated.title}\n${translated.tldr}\n${translated.body}`)) {
    throw new Error(`phone number survived translation for ${note.id}`)
  }

  return translated
}

const mapPool = async (items, limit, mapper) => {
  const results = new Array(items.length)
  let next = 0

  const worker = async () => {
    while (next < items.length) {
      const index = next
      next += 1
      results[index] = await mapper(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))

  return results
}

const files = await collectFiles()
const rawNotes = []

for (const relativePath of files) {
  const absolute = path.join(vaultPath, relativePath)
  const raw = await readFile(absolute, 'utf8')
  const { meta, body } = splitNote(raw)

  if (!meta.id || !meta.title || !meta.tldr) {
    fail(`Missing id, title, or tldr in ${relativePath}`)
  }

  rawNotes.push({
    id: meta.id,
    file: relativePath,
    stem: path.basename(relativePath, '.md'),
    type: meta.type ?? '',
    period: meta.period ?? '',
    tags: meta.tags ?? [],
    titleEs: meta.title,
    tldrEs: meta.tldr,
    body,
    hash: hashText(raw),
  })
}

const idByStem = new Map(rawNotes.map((note) => [note.stem, note.id]))
const previous = await readPrevious()
let translatedCount = 0

const notes = await mapPool(rawNotes, 4, async (note) => {
  const cleaned = cleanBody(note.body, idByStem)
  const cached = !force ? previous.get(note.hash) : undefined

  if (
    cached &&
    cached.id === note.id &&
    cached.bodyEs === cleaned.body &&
    !/\+54[\d\s().-]{6,}\d/.test(`${cached.bodyEn}\n${cached.titleEn}`)
  ) {
    console.log(`keep ${note.id}`)
    return {
      ...cached,
      links: cleaned.links,
      bodyEs: cleaned.body,
    }
  }

  console.log(`translate ${note.id}`)
  translatedCount += 1
  const translated = await translateNote({ ...note, bodyEs: cleaned.body })

  return {
    id: note.id,
    file: note.file,
    type: note.type,
    period: note.period,
    tags: note.tags,
    titleEs: note.titleEs,
    titleEn: translated.title,
    tldrEs: note.tldrEs,
    tldrEn: translated.tldr,
    bodyEs: cleaned.body,
    bodyEn: translated.body,
    links: cleaned.links,
    hash: note.hash,
  }
})

const missingCore = notes.some((note) => note.id === 'core-perfil-tldr')

if (!missingCore) {
  fail('Core profile note was not included')
}

await writeFile(
  outputPath,
  `${JSON.stringify({ notes: notes.sort((a, b) => a.id.localeCompare(b.id)) }, null, 2)}\n`
)

console.log(`wrote ${notes.length} notes, translated ${translatedCount}`)
