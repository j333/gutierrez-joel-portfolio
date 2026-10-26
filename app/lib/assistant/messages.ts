import type { UIMessage } from 'ai'

const messageLimit = 8
const messageCharLimit = 2000

export const spokenAnswer = (text: string) => {
  const paragraphs = text.split(/\n\s*\n/)
  const labels = paragraphs[0]?.match(
    /\b(?:pregunta|question|idioma(?: de respuesta)?|language|hechos(?: utilizados)?|facts)\s*:/gi
  )

  if (!labels || labels.length < 2) {
    return text
  }

  if (paragraphs.length < 2) {
    return ''
  }

  return paragraphs.slice(1).join('\n\n').trimStart()
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
