const activityLimit = 36

const leads = [
  /^I(?:'m| am) in the process of /i,
  /^I(?:'m| am) currently /i,
  /^I(?:'m| am) going to /i,
  /^I(?:'m| am) trying to /i,
  /^I(?:'m| am) now /i,
  /^I(?:'m| am) /i,
  /^In the response,? I(?:'m| am) /i,
  /^I(?:'ve| have) decided to /i,
  /^I(?:'ve| have) been /i,
  /^I(?:'ve| have) /i,
  /^Estoy actualmente /i,
  /^Estoy en proceso de /i,
  /^Estoy /i,
  /^Voy a /i,
  /^Currently,? /i,
  /^Now,? /i,
  /^Ahora,? /i,
]

const setupTail = /^(?:in the|the process|process of|currently|going to|trying to|now|a )\b/i

type ReasoningStep = {
  title: string
  body: string
}

const clip = (value: string) => {
  const text = value.replace(/[.!?…]+$/u, '').replace(/\s+/g, ' ').trim()

  if (text.length <= activityLimit) {
    return text
  }

  const cut = text.slice(0, activityLimit)
  const word = cut.lastIndexOf(' ')
  const base = (word > 18 ? cut.slice(0, word) : cut).trim().replace(/[,:;–—-]+$/u, '')

  return `${base}…`
}

const cleanInline = (value: string) =>
  value
    .replace(/\*\*/g, '')
    .replace(/[`_]/g, '')
    .replace(/^#+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()

const toStatus = (value: string) => {
  let text = cleanInline(value)

  for (const lead of leads) {
    const next = text.replace(lead, '').trim()

    if (next !== text && next.length >= 8 && !setupTail.test(next)) {
      text = next
      break
    }
  }

  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

const stableText = (text: string) => {
  const marks = text.match(/\*\*/g)?.length ?? 0

  if (marks % 2 === 0) {
    return text
  }

  return text.slice(0, text.lastIndexOf('**'))
}

const looksLikeTitle = (line: string) => {
  const text = cleanInline(line)
  const words = text.split(' ').filter(Boolean)
  const first = words[0] ?? ''

  return (
    words.length >= 2 &&
    words.length <= 6 &&
    text.length <= activityLimit &&
    !/[.!?,:;]$/.test(text) &&
    !/^(?:I(?:'m| am)?|Estoy|Voy|Ahora)\b/.test(text) &&
    first[0] === first[0]?.toUpperCase()
  )
}

const stepsFrom = (text: string) => {
  const steps: ReasoningStep[] = []
  let current: ReasoningStep | null = null

  const ensure = () => {
    if (!current) {
      current = { title: '', body: '' }
      steps.push(current)
    }

    return current
  }

  for (const raw of stableText(text).split('\n')) {
    const line = raw.trim()

    if (!line) {
      continue
    }

    const heading = line.match(/^#{1,6}\s+(.+)$/) ?? line.match(/^\*\*(.+?)\*\*$/)

    if (heading?.[1]) {
      const title = cleanInline(heading[1])

      if (!title) {
        continue
      }

      current = { title, body: '' }
      steps.push(current)
      continue
    }

    const inline = line.match(/^\*\*(.+?)\*\*\s+(.+)$/)

    if (inline?.[1]) {
      current = { title: cleanInline(inline[1]), body: inline[2] ?? '' }
      steps.push(current)
      continue
    }

    if (looksLikeTitle(line) && (!current || current.body)) {
      current = { title: cleanInline(line), body: '' }
      steps.push(current)
      continue
    }

    const step = ensure()
    step.body = step.body ? `${step.body} ${line}` : line
  }

  return steps
}

const clauses = (body: string) =>
  cleanInline(body)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

const statusFromClause = (clause: string, allowPartial: boolean) => {
  const complete = /[.!?]$/.test(clause)

  if (!complete && !allowPartial) {
    return null
  }

  const status = toStatus(clause)
  const minimum = complete ? 12 : 18
  const stillFirstPerson = /^(?:I(?:'m| am|'ve| have)|Estoy|Voy|Currently|Now|Ahora)\b/i.test(status)
  const stillSetup = !complete && (setupTail.test(status) || /^In the\b/i.test(status))

  if (status.length < minimum || stillFirstPerson || stillSetup) {
    return null
  }

  return clip(status)
}

export const reasoningActivity = (text: string) => {
  const latest = [...stepsFrom(text)].reverse().find((step) => step.title || step.body.trim())

  if (!latest) {
    return null
  }

  const parts = clauses(latest.body)

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const status = statusFromClause(parts[index] ?? '', index === parts.length - 1)

    if (status) {
      return status
    }
  }

  if (latest.title) {
    return clip(latest.title)
  }

  return null
}

export const reasoningLog = (text: string) => {
  const lines: string[] = []

  for (const step of stepsFrom(text)) {
    if (step.title) {
      lines.push(clip(step.title))
    }

    for (const clause of clauses(step.body)) {
      const status = statusFromClause(clause, false)

      if (status) {
        lines.push(status)
      }
    }
  }

  const live = reasoningActivity(text)

  if (live && lines.at(-1)?.toLowerCase() !== live.toLowerCase()) {
    lines.push(live)
  }

  return lines.slice(-8)
}
