import posthog from 'posthog-js'
import { socialLinks } from 'app/lib/site'

export const capture = (
  event: string,
  properties?: Record<string, string>
) => {
  if (!posthog.__loaded) {
    return
  }

  void posthog.capture(event, properties)
}

export const assistantTraceIdentity = () => {
  if (!posthog.__loaded || posthog.has_opted_out_capturing()) {
    return {}
  }

  const distinctId = posthog.get_distinct_id()
  const sessionId = posthog.get_session_id()

  return {
    ...(distinctId ? { distinctId } : {}),
    ...(sessionId ? { sessionId } : {}),
  }
}

export const captureOutboundClick = (href: string) => {
  if (href.startsWith('mailto:')) {
    capture('contact_clicked')
    return
  }

  const network = socialLinks.find((link) => link.url === href)?.name

  if (!network) {
    return
  }

  capture('social_clicked', { network })
}

export const captureProjectOpened = (slug: string) => {
  capture('project_opened', { slug })
}
