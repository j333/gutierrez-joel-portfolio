import type { UIMessage } from 'ai'

const messageLimit = 8
const messageCharLimit = 2000

export const trimMessages = <T extends UIMessage>(messages: T[]) =>
  messages.slice(-messageLimit).map((message) => ({
    ...message,
    parts: message.parts.map((part) => {
      if (part.type !== 'text') {
        return part
      }

      return {
        ...part,
        text: part.text.slice(0, messageCharLimit),
      }
    }),
  }))
