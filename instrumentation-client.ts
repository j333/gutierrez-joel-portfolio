import posthog from 'posthog-js'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

if (isProduction && posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    loaded: (client) => {
      const isOwner = localStorage.getItem('joel_owner') === 'true'

      if (window.location.hostname === 'localhost' || isOwner) {
        client.opt_out_capturing()
      }

      if (isOwner) {
        client.stopSessionRecording()
      }
    },
  })

  if (localStorage.getItem('joel_owner') === 'true') {
    posthog.opt_out_capturing()
    posthog.stopSessionRecording()
  }
}
