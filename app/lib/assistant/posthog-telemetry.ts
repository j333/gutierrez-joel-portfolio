import { OpenTelemetry } from '@ai-sdk/otel'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { PostHogSpanProcessor } from '@posthog/ai/otel'
import { registerTelemetry } from 'ai'

const posthogAiGlobal = globalThis as typeof globalThis & {
  __posthogAiSpanProcessor?: PostHogSpanProcessor
  __posthogAiStarted?: boolean
}

const spanAttribute = (value: unknown) =>
  typeof value === 'string' && value.length > 0 ? value : undefined

const spanNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined

export const startPostHogAiTelemetry = () => {
  if (posthogAiGlobal.__posthogAiStarted) {
    return
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    return
  }

  posthogAiGlobal.__posthogAiStarted = true

  try {
    const processor = new PostHogSpanProcessor({ projectToken, host })

    posthogAiGlobal.__posthogAiSpanProcessor = processor

    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'gutierrez-joel-portfolio',
      }),
      spanProcessors: [processor],
    })

    sdk.start()

    registerTelemetry(
      new OpenTelemetry({
        agentSpanName: 'functionId',
        enrichSpan: ({ runtimeContext }) => ({
          'posthog.distinct_id': spanAttribute(runtimeContext?.distinctId),
          $ai_session_id: spanAttribute(runtimeContext?.sessionId),
          $ai_prompt_name: spanAttribute(runtimeContext?.promptName),
          $ai_prompt_version: spanNumber(runtimeContext?.promptVersion),
          $ai_replica_notes: spanAttribute(runtimeContext?.replicaNotes),
        }),
      })
    )
  } catch (error) {
    posthogAiGlobal.__posthogAiStarted = false
    posthogAiGlobal.__posthogAiSpanProcessor = undefined
    console.error('PostHog AI telemetry failed to start', error)
  }
}

export const flushPostHogAiTraces = async () => {
  try {
    await posthogAiGlobal.__posthogAiSpanProcessor?.forceFlush()
  } catch (error) {
    console.error('PostHog AI telemetry failed to flush', error)
  }
}
