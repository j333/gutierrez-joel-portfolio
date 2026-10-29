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

const listKeys = new Set(['tags', 'sources'])

const parseInlineList = (raw) =>
  raw
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((item) => readYamlValue(item))
    .filter(Boolean)

const parseFrontmatter = (block) => {
  const meta = {}
  const lines = block.split('\n')
  let index = 0

  while (index < lines.length) {
    const match = lines[index].match(/^([A-Za-z0-9_]+):\s*(.*)$/)

    if (!match) {
      index += 1
      continue
    }

    const [, key, raw] = match
    const value = raw.trim()

    if (listKeys.has(key) && value === '') {
      const items = []
      index += 1

      while (index < lines.length && /^\s+-\s+/.test(lines[index])) {
        items.push(readYamlValue(lines[index].replace(/^\s+-\s+/, '')))
        index += 1
      }

      meta[key] = items.filter(Boolean)
      continue
    }

    if (listKeys.has(key) && value.startsWith('[')) {
      meta[key] = parseInlineList(value)
      index += 1
      continue
    }

    meta[key] = readYamlValue(value)
    index += 1
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
      `Summary: ${note.tldrEs}`,
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

const translationGapMs = 5000

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const writeNotes = async (notes) => {
  await writeFile(
    outputPath,
    `${JSON.stringify({ notes: [...notes].sort((a, b) => a.id.localeCompare(b.id)) }, null, 2)}\n`
  )
}

const files = await collectFiles()
const rawNotes = []

for (const relativePath of files) {
  const absolute = path.join(vaultPath, relativePath)
  const raw = await readFile(absolute, 'utf8')
  const { meta, body } = splitNote(raw)

  if (!meta.id || !meta.title || !meta.summary) {
    fail(`Missing id, title, or summary in ${relativePath}`)
  }

  const published =
    meta.status === 'canonical' &&
    (meta.visibility === 'public' || meta.visibility === 'professional')

  if (!published) {
    continue
  }

  rawNotes.push({
    id: meta.id,
    file: relativePath,
    stem: path.basename(relativePath, '.md'),
    type: meta.type ?? '',
    period: meta.period ?? '',
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    titleEs: meta.title,
    tldrEs: meta.summary,
    body,
    hash: hashText(raw),
  })
}

const idByStem = new Map(rawNotes.map((note) => [note.stem, note.id]))
const previous = await readPrevious()
let translatedCount = 0

const notes = []

for (const note of rawNotes) {
  const cleaned = cleanBody(note.body, idByStem)
  const cached = !force ? previous.get(note.hash) : undefined

  if (
    cached &&
    cached.id === note.id &&
    cached.bodyEs === cleaned.body &&
    !/\+54[\d\s().-]{6,}\d/.test(`${cached.bodyEn}\n${cached.titleEn}`)
  ) {
    console.log(`keep ${note.id}`)
    notes.push({
      ...cached,
      links: cleaned.links,
      bodyEs: cleaned.body,
    })
    continue
  }

  if (translatedCount > 0) {
    await pause(translationGapMs)
  }

  console.log(`translate ${note.id}`)
  translatedCount += 1
  let translated

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      translated = await translateNote({ ...note, bodyEs: cleaned.body })
      break
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const rateLimited = /quota|429|RESOURCE_EXHAUSTED/i.test(message)

      if (!rateLimited || attempt === 4) {
        throw error
      }

      console.log(`rate limit on ${note.id}, waiting 30s`)
      await pause(30000)
    }
  }

  notes.push({
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
  })
  await writeNotes(notes)
}

const missingCore = notes.some((note) => note.id === 'core-perfil-tldr')

if (!missingCore) {
  fail('Core profile note was not included')
}

await writeNotes(notes)

console.log(`wrote ${notes.length} notes, translated ${translatedCount}`)
