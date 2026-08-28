import { site } from 'app/lib/site'

const robots = () => {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}

export default robots
