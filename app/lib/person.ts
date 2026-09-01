import { getExperience } from 'app/experience/utils'
import {
  getProjectCaseStudyDescription,
  getProjects,
} from 'app/projects/utils'
import { aboutEducation, aboutLanguages, aboutSkills } from './about-data'
import { sameAs, site } from './site'

export const buildPersonEntity = () => ({
  '@type': 'Person',
  name: site.name,
  jobTitle: site.jobTitle,
  url: site.url,
  description: site.description,
  image: `${site.url}/opengraph-image`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mendoza',
    addressCountry: 'Argentina',
  },
  sameAs,
  knowsAbout: [...aboutSkills],
  knowsLanguage: aboutLanguages.map((language) => language.split(' ')[0]),
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: aboutEducation.school,
  },
  worksFor: getExperience().map((entry) => ({
    '@type': 'Organization',
    name: entry.metadata.title,
  })),
  workExample: getProjects().map((project) => ({
    '@type': 'CreativeWork',
    name: project.metadata.title,
    url: `${site.url}/${project.slug}`,
    description: getProjectCaseStudyDescription(project),
  })),
})

export const buildPersonJsonLd = () => ({
  '@context': 'https://schema.org',
  ...buildPersonEntity(),
})
