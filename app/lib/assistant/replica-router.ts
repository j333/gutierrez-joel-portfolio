import { replicaNotes, type ReplicaNote } from 'app/lib/assistant/replica-data'
import { coreNoteId, noteIdsForPath } from 'app/lib/assistant/replica-paths'
import { stripLocale } from 'app/lib/locale'

const minimumScore = 1.5
const linkBoost = 3
const highScore = 6

const stopwords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'de',
  'del',
  'did',
  'do',
  'does',
  'el',
  'en',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'la',
  'las',
  'le',
  'les',
  'lo',
  'los',
  'me',
  'mi',
  'mis',
  'my',
  'of',
  'on',
  'or',
  'para',
  'por',
  'que',
  'se',
  'te',
  'the',
  'to',
  'tu',
  'tus',
  'un',
  'una',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'who',
  'why',
  'with',
  'you',
  'your',
])

export type ReplicaSelection = {
  profile: string
  notes: ReplicaNote[]
  noteIds: string[]
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()

export const tokenize = (value: string) =>
  [...new Set(normalize(value).split(/[^a-z0-9+]+/))]
    .filter((token) => token.length > 1 && !stopwords.has(token))

const includesToken = (text: string, token: string) =>
  normalize(text).split(/[^a-z0-9+]+/).includes(token)

const fieldScore = (note: ReplicaNote, token: string) => {
  let score = 0

  if (
    includesToken(note.id.replaceAll('-', ' '), token) ||
    note.tags.some((tag) => includesToken(tag.replaceAll('-', ' '), token))
  ) {
    score += 6
  }

  if (includesToken(`${note.titleEn} ${note.titleEs}`, token)) {
    score += 4
  }

  if (includesToken(`${note.tldrEn} ${note.tldrEs}`, token)) {
    score += 3
  }

  if (includesToken(`${note.bodyEn} ${note.bodyEs}`, token)) {
    score += 1.5
  }

  return score
}

const scoreNotes = (tokens: string[]) => {
  const scores = new Map(replicaNotes.map((note) => [note.id, 0]))

  if (tokens.length === 0) {
    return scores
  }

  for (const note of replicaNotes) {
    if (note.id === coreNoteId) {
      continue
    }

    const score = tokens.reduce((total, token) => total + fieldScore(note, token), 0)
    scores.set(note.id, score)
  }

  for (const note of replicaNotes) {
    const score = scores.get(note.id) ?? 0

    if (score < highScore) {
      continue
    }

    for (const linkedId of note.links) {
      const linked = replicaNotes.find((item) => item.id === linkedId)

      if (!linked || linked.id === coreNoteId) {
        continue
      }

      const sharesToken = tokens.some((token) => fieldScore(linked, token) > 0)

      if (sharesToken) {
        scores.set(linkedId, (scores.get(linkedId) ?? 0) + linkBoost)
      }
    }
  }

  return scores
}

const byScore = (scores: Map<string, number>) => (left: ReplicaNote, right: ReplicaNote) =>
  (scores.get(right.id) ?? 0) - (scores.get(left.id) ?? 0) || left.id.localeCompare(right.id)

export const selectReplicaContext = ({
  query,
  currentPath,
  quotedText,
  maxNotes = 4,
}: {
  query: string
  currentPath: string
  quotedText?: string
  maxNotes?: number
}): ReplicaSelection => {
  const path = stripLocale(currentPath)
  const tokens = tokenize([query, quotedText ?? ''].filter(Boolean).join('\n'))
  const scores = scoreNotes(tokens)
  const pageIds = new Set(noteIdsForPath(path))
  const ranked = replicaNotes
    .filter((note) => note.id !== coreNoteId)
    .sort(byScore(scores))
  const matched = ranked.filter((note) => (scores.get(note.id) ?? 0) >= minimumScore)
  const selected: ReplicaNote[] = []

  for (const note of matched) {
    if (selected.length >= maxNotes) {
      break
    }

    selected.push(note)
  }

  if (selected.length === 0) {
    for (const note of ranked) {
      if (!pageIds.has(note.id) || selected.length >= maxNotes) {
        continue
      }

      selected.push(note)
    }
  } else {
    for (const note of ranked) {
      if (!pageIds.has(note.id) || selected.some((item) => item.id === note.id)) {
        continue
      }

      if (selected.length >= maxNotes) {
        break
      }

      selected.push(note)
    }
  }

  const profile = replicaNotes.find((note) => note.id === coreNoteId)

  return {
    profile: profile ? `${profile.titleEn}\n${profile.bodyEn}` : '',
    notes: selected,
    noteIds: selected.map((note) => note.id),
  }
}

export const englishBodiesForPath = (path: string) =>
  noteIdsForPath(stripLocale(path))
    .flatMap((id) => {
      const note = replicaNotes.find((item) => item.id === id)
      return note ? [note.bodyEn] : []
    })
    .join('\n\n')
