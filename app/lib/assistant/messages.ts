import type { UIMessage } from 'ai'

const messageLimit = 8
const messageCharLimit = 2000

const scratchpadOpen =
  /^(?:thinking process|proceso de pensamiento)\b/i

const scratchpadLine =
  /^(?:#{1,6}\s*|\d+\.\s+)?(?:\*\*)?(?:thinking process|proceso de pensamiento|analyze the request|analiza(?:r)? (?:la solicitud|el pedido)|retrieve relevant information|internal knowledge|informaci[oó]n interna|interpreting user input|formulating the response|refining my answer)\b/i

const isScratchpadParagraph = (paragraph: string) => {
  const lines = paragraph
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return true
  }

  return lines.every((line) => scratchpadLine.test(line) || /^[-*•]/.test(line))
}

export const spokenAnswer = (text: string) => {
  const trimmed = text.trim()

  if (!trimmed) {
    return ''
  }

  const paragraphs = trimmed.split(/\n\s*\n/)
  const labels = paragraphs[0]?.match(
    /\b(?:pregunta|question|idioma(?: de respuesta)?|language|hechos(?: utilizados)?|facts|thinking process|proceso de pensamiento)\s*:/gi
  )
  const labeledScratchpad = Boolean(labels && labels.length >= 2)
  const openedScratchpad = scratchpadOpen.test(trimmed)

  if (!labeledScratchpad && !openedScratchpad) {
    return text
  }

  const body = labeledScratchpad ? paragraphs.slice(1) : paragraphs
  const kept = openedScratchpad ? body.filter((paragraph) => !isScratchpadParagraph(paragraph)) : body

  return kept.join('\n\n').trim()
}

export const trimMessages = <T extends UIMessage>(messages: T[]) =>
  messages.slice(-messageLimit).map((message) => ({
    ...message,
    parts: message.parts.map((part) => {
      if (part.type !== 'text') {
        return part
      }

      const text = message.role === 'assistant' ? spokenAnswer(part.text) : part.text

      return {
        ...part,
        text: text.slice(0, messageCharLimit),
      }
    }),
  }))
