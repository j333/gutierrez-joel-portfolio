import { Prompts } from '@posthog/ai'
import {
  assistantPromptLabel,
  assistantPromptName,
  assistantPromptTemplate,
  assistantPromptVariables,
  assistantVisitBlock,
  type PromptInput,
} from 'app/lib/assistant/system-prompt'

const defaultTemperature = 0.2
const defaultMaxOutputTokens = 700

type PromptVariables = {
  profile: string
  context: string
  replicaNotes: string
}

export type LoadedAssistantPrompt = {
  instructions: string
  temperature: number
  maxOutputTokens: number
  promptName?: string
  promptVersion?: number
  replicaNotes?: string
}

let client: Prompts | null = null
let missingKeyWarningShown = false

const promptAppHost = () => {
  const configured = process.env.POSTHOG_APP_HOST?.trim()

  if (configured) {
    return configured
  }

  const ingestion = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim()

  if (!ingestion) {
    return null
  }

  try {
    const url = new URL(ingestion)

    url.hostname = url.hostname.replace(/\.i\.posthog\.com$/, '.posthog.com')

    return url.origin
  } catch {
    return null
  }
}

const getPromptClient = () => {
  if (client) {
    return client
  }

  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY?.trim()
  const projectApiKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
  const host = promptAppHost()

  if (!personalApiKey || !projectApiKey || !host) {
    if (!missingKeyWarningShown) {
      missingKeyWarningShown = true
      console.warn(
        'PostHog prompt management is off until POSTHOG_PERSONAL_API_KEY is set. The assistant is using the local prompt.'
      )
    }

    return null
  }

  client = new Prompts({
    personalApiKey,
    projectApiKey,
    host,
  })

  return client
}

const compileTemplate = (template: string, variables: PromptVariables) =>
  template.replace(/\{\{([\w.-]+)\}\}/g, (match, name: string) =>
    name in variables ? variables[name as keyof PromptVariables] : match
  )

const samplingFrom = (config: Record<string, unknown> | null | undefined) => {
  const temperature = config?.temperature
  const maxOutputTokens = config?.maxOutputTokens

  return {
    temperature:
      typeof temperature === 'number' && temperature >= 0 && temperature <= 2
        ? temperature
        : defaultTemperature,
    maxOutputTokens:
      typeof maxOutputTokens === 'number' &&
      Number.isInteger(maxOutputTokens) &&
      maxOutputTokens >= 1 &&
      maxOutputTokens <= 4000
        ? maxOutputTokens
        : defaultMaxOutputTokens,
  }
}

export const loadAssistantInstructions = async (
  input: PromptInput
): Promise<LoadedAssistantPrompt> => {
  const variables = assistantPromptVariables(input)
  const fallback = assistantPromptTemplate()
  const prompts = getPromptClient()
  const instructionsFrom = (template: string) => {
    const hasSlots = template.includes('{{profile}}') || template.includes('{{context}}')

    if (hasSlots) {
      return compileTemplate(template, variables)
    }

    return [template.trim(), assistantVisitBlock(input)].filter(Boolean).join('\n\n')
  }

  if (!prompts) {
    return {
      instructions: instructionsFrom(fallback),
      temperature: defaultTemperature,
      maxOutputTokens: defaultMaxOutputTokens,
      replicaNotes: variables.replicaNotes,
    }
  }

  const result = await prompts.get(assistantPromptName, {
    label: assistantPromptLabel,
    fallback,
  })

  return {
    instructions: instructionsFrom(result.prompt),
    ...samplingFrom(result.config),
    promptName: result.name,
    promptVersion: result.version,
    replicaNotes: variables.replicaNotes,
  }
}
