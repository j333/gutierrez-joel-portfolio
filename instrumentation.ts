export const register = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  const { startPostHogAiTelemetry } = await import('./app/lib/assistant/posthog-telemetry')

  startPostHogAiTelemetry()
}
