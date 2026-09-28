import { site } from 'app/lib/site'

const robots = () => {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}

export default robots
