import { stepCountIs, tool, ToolLoopAgent, type InferAgentUIMessage, type ModelMessage } from 'ai'
import type { LanguageModel } from 'ai'
import { z } from 'zod'
import { caseSlugs } from 'app/lib/assistant/joel-context'
import { loadAssistantInstructions } from 'app/lib/assistant/managed-prompt'

const callOptionsSchema = z.object({
  locale: z.enum(['en', 'es']),
  path: z.string(),
  quotedText: z.string().optional(),
  distinctId: z.string().min(1).max(200).optional(),
  sessionId: z.string().min(1).max(200).optional(),
})

const showProjectCard = tool({
  description:
    'Show a published case study card. Use only a slug from the case list.',
  inputSchema: z.object({
    slug: z.enum(caseSlugs),
  }),
  outputSchema: z.object({
    slug: z.enum(caseSlugs),
  }),
  execute: async (input) => input,
})

const triggerContactCTA = tool({
  description:
    'Required when the visitor asks how to reach Joel, hire him, email him, or find him on LinkedIn. The sentence may include the email address. Never include a phone number or the LinkedIn URL.',
  inputSchema: z.object({}),
  outputSchema: z.object({}),
  execute: async () => ({}),
})

const assistantTools = {
  showProjectCard,
  triggerContactCTA,
}

const textFromMessage = (message: ModelMessage) => {
  if (typeof message.content === 'string') {
    return message.content
  }

  return message.content
    .flatMap((part) => (part.type === 'text' ? [part.text] : []))
    .join('\n')
}

const contactQuestion = /\b(hire|hiring|email|e-mail|contact|reach|linkedin|salary|rate|equity|sueldo|tarifa|contrat|contacto|escrib)/i

const lastUserText = (prompt: string | ModelMessage[] | undefined) => {
  if (!prompt) {
    return ''
  }

  if (typeof prompt === 'string') {
    return prompt
  }

  const message = [...prompt].reverse().find((item) => item.role === 'user')

  return message ? textFromMessage(message) : ''
}

export const createAssistantAgent = (model: LanguageModel) =>
  new ToolLoopAgent({
    model,
    instructions:
      'You are Joel Gutiérrez, speaking in the first person as Joel Artificial Replica. Answer about your product work on gutierrezjoel.com, in the language of the latest user message.',
    tools: assistantTools,
    callOptionsSchema,
    telemetry: {
      functionId: 'portfolio-assistant',
      includeRuntimeContext: {
        distinctId: true,
        sessionId: true,
        promptName: true,
        promptVersion: true,
        replicaNotes: true,
      },
    },
    prepareCall: async ({ options, ...settings }) => {
      const userQuery = lastUserText(settings.prompt)
      const loaded = await loadAssistantInstructions({
        locale: options.locale,
        currentPath: options.path,
        quotedText: options.quotedText,
        userQuery,
      })

      return {
        ...settings,
        instructions: loaded.instructions,
        temperature: loaded.temperature,
        maxOutputTokens: loaded.maxOutputTokens,
        prepareStep: ({ stepNumber }) => {
          if (!contactQuestion.test(userQuery)) {
            return {}
          }

          return {
            toolChoice:
              stepNumber === 0
                ? { type: 'tool', toolName: 'triggerContactCTA' }
                : 'none',
          }
        },
        runtimeContext: {
          distinctId: options.distinctId,
          sessionId: options.sessionId,
          promptName: loaded.promptName,
          promptVersion: loaded.promptVersion,
          replicaNotes: loaded.replicaNotes,
        },
      }
    },
    stopWhen: stepCountIs(3),
    temperature: 0.2,
    maxOutputTokens: 1500,
    reasoning: 'low',
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: true,
        },
      },
    },
  })

export type AssistantAgent = ReturnType<typeof createAssistantAgent>

export type AssistantMetadata = {
  model: string
  totalTokens?: number
  durationMs?: number
}

export type AssistantUIMessage = InferAgentUIMessage<
  AssistantAgent,
  AssistantMetadata
>
