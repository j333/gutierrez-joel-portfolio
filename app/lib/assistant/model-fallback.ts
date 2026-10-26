import { wrapLanguageModel, type LanguageModel, type LanguageModelMiddleware } from 'ai'

type V4Model = Extract<Exclude<LanguageModel, string>, { specificationVersion: 'v4' }>
type V4StreamResult = Awaited<ReturnType<V4Model['doStream']>>
type V4GenerateResult = Awaited<ReturnType<V4Model['doGenerate']>>
type V4StreamPart = V4StreamResult['stream'] extends ReadableStream<infer Part> ? Part : never

const asV4Model = (model: LanguageModel): V4Model => {
  if (typeof model === 'string' || model.specificationVersion !== 'v4') {
    throw new Error('unavailable')
  }

  return model
}

const hasContent = (part: V4StreamPart) =>
  part.type === 'text-delta' ||
  part.type === 'reasoning-delta' ||
  part.type === 'tool-call' ||
  part.type === 'tool-input-start'

const openUntilContent = async (result: V4StreamResult) => {
  const reader = result.stream.getReader()
  const buffered: V4StreamPart[] = []

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      if (value.type === 'error') {
        await reader.cancel().catch(() => undefined)
        return { failed: true as const }
      }

      buffered.push(value)

      if (hasContent(value)) {
        break
      }
    }
  } catch {
    await reader.cancel().catch(() => undefined)
    return { failed: true as const }
  }

  const stream = new ReadableStream<V4StreamPart>({
    async start(controller) {
      for (const part of buffered) {
        controller.enqueue(part)
      }

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          controller.enqueue(value)
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
    cancel: () => reader.cancel().catch(() => undefined),
  })

  return {
    failed: false as const,
    result: { ...result, stream },
  }
}

export const withModelFallback = (primary: LanguageModel, fallbacks: LanguageModel[]) => {
  const primaryModel = asV4Model(primary)
  const fallbackModels = fallbacks.map(asV4Model)

  if (fallbackModels.length === 0) {
    return primaryModel
  }

  const middleware: LanguageModelMiddleware = {
    specificationVersion: 'v4',
    wrapGenerate: async ({ doGenerate, params }): Promise<V4GenerateResult> => {
      try {
        return await doGenerate()
      } catch {
        let lastError: unknown

        for (const candidate of fallbackModels) {
          try {
            return await candidate.doGenerate(params)
          } catch (error) {
            lastError = error
          }
        }

        throw lastError
      }
    },
    wrapStream: async ({ doStream, params }): Promise<V4StreamResult> => {
      try {
        const opened = await openUntilContent(await doStream())

        if (!opened.failed) {
          return opened.result
        }
      } catch {
        // The primary call failed before any visible token.
      }

      let lastError: unknown

      for (const candidate of fallbackModels) {
        try {
          const opened = await openUntilContent(
            await candidate.doStream(params)
          )

          if (!opened.failed) {
            return opened.result
          }
        } catch (error) {
          lastError = error
        }
      }

      throw lastError ?? new Error('unavailable')
    },
  }

  return wrapLanguageModel({
    model: primaryModel,
    middleware,
  })
}
