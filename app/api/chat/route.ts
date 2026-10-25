import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { Redis } from '@upstash/redis'
import { consumeStream, createAgentUIStreamResponse, smoothStream, type LanguageModel } from 'ai'
import { createAssistantAgent, type AssistantUIMessage } from 'app/lib/assistant/agent'
import { trimMessages } from 'app/lib/assistant/messages'
import { withModelFallback } from 'app/lib/assistant/model-fallback'
import { z } from 'zod'

export const maxDuration = 30

const hourlyLimit = 15
const hourSeconds = 3600

const bodySchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string(),
          role: z.enum(['user', 'assistant', 'system']),
          parts: z.array(z.record(z.string(), z.unknown())).max(40),
        })
        .passthrough()
    )
    .min(1)
    .max(40),
  locale: z.enum(['en', 'es']),
  path: z.string().max(300),
  quotedText: z.string().max(2000).optional(),
})

const modelChain = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemma-4-31b-it',
] as const

const groqFallbackModelId = () =>
  process.env.ASSISTANT_FALLBACK_MODEL || 'llama-3.3-70b-versatile'

let redis: Redis | null = null

const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  redis ??= new Redis({ url, token })

  return redis
}

const clientIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  return (forwarded || '127.0.0.1').slice(0, 64)
}

const withinLimit = async (ip: string) => {
  const store = getRedis()

  if (!store) {
    return true
  }

  try {
    const hour = Math.floor(Date.now() / (hourSeconds * 1000))
    const key = `assistant:${ip}:${hour}`
    const [count] = await store.pipeline().incr(key).expire(key, hourSeconds).exec()

    return Number(count) <= hourlyLimit
  } catch {
    return true
  }
}

const resolveModel = () => {
  const hasGoogle = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  const hasGroq = Boolean(process.env.GROQ_API_KEY)

  if (hasGoogle) {
    const [primaryId, ...fallbackIds] = modelChain

    return {
      model: withModelFallback(
        google(primaryId),
        fallbackIds.map((id) => google(id))
      ),
      id: primaryId,
    }
  }

  if (hasGroq) {
    return { model: groq(groqFallbackModelId()), id: groqFallbackModelId() }
  }

  return null
}

export const POST = async (request: Request) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }

  const allowed = await withinLimit(clientIp(request))

  if (!allowed) {
    return Response.json({ error: 'rate_limit' }, { status: 429 })
  }

  const resolved = resolveModel()

  if (!resolved) {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }

  const { locale, path, quotedText } = parsed.data
  const messages = trimMessages(parsed.data.messages as unknown as AssistantUIMessage[])
  const startedAt = Date.now()

  return createAgentUIStreamResponse({
    agent: createAssistantAgent(resolved.model),
    uiMessages: messages,
    options: { locale, path, quotedText },
    abortSignal: request.signal,
    experimental_transform: smoothStream({ chunking: 'word' }),
    consumeSseStream: ({ stream }) => consumeStream({ stream }),
    onError: () => 'unavailable',
    messageMetadata: ({ part }) => {
      if (part.type === 'start') {
        return { model: resolved.id }
      }

      if (part.type === 'finish') {
        return {
          totalTokens: part.totalUsage.totalTokens,
          durationMs: Date.now() - startedAt,
        }
      }
    },
  })
}
