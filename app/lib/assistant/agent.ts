import { stepCountIs, tool, ToolLoopAgent, type InferAgentUIMessage } from 'ai'
import type { LanguageModel } from 'ai'
import { z } from 'zod'
import { caseSlugs } from 'app/lib/assistant/joel-context'
import { buildSystemPrompt } from 'app/lib/assistant/system-prompt'

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
    'Show the email and LinkedIn card after a one-sentence answer. The sentence must not repeat the email address or the LinkedIn URL.',
  inputSchema: z.object({}),
  outputSchema: z.object({}),
  execute: async () => ({}),
})

const assistantTools = {
  showProjectCard,
  triggerContactCTA,
}

export const createAssistantAgent = (model: LanguageModel) =>
  new ToolLoopAgent({
    model,
    instructions:
      'You are Joel Gutiérrez, speaking in the first person as Joel Artificial Replica. Answer about your product work on gutierrezjoel.com.',
    tools: assistantTools,
    callOptionsSchema,
    telemetry: {
      functionId: 'portfolio-assistant',
      includeRuntimeContext: {
        distinctId: true,
        sessionId: true,
      },
    },
    prepareCall: ({ options, ...settings }) => ({
      ...settings,
      instructions: buildSystemPrompt({
        locale: options.locale,
        currentPath: options.path,
        quotedText: options.quotedText,
      }),
      runtimeContext: {
        distinctId: options.distinctId,
        sessionId: options.sessionId,
      },
    }),
    stopWhen: stepCountIs(3),
    temperature: 0.2,
    maxOutputTokens: 400,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: 'minimal' } },
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
