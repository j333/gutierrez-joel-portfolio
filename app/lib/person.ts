import { getExperience } from 'app/experience/utils'
import { dictionaries } from 'app/lib/i18n'
import { localePath, type Locale } from 'app/lib/locale'
import {
  getListedProjects,
  getProjectCaseStudyDescription,
} from 'app/projects/utils'
import { sameAs, site } from './site'

export const personId = `${site.url}/#person`

export const buildPersonEntity = (locale: Locale) => {
  const copy = dictionaries[locale]
  const currentRole = getExperience(locale)[0]

  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    jobTitle: copy.jobTitle,
    url: `${site.url}${localePath(locale, '/')}`,
    description: copy.description,
    image: `${site.url}/opengraph-image.png`,
    inLanguage: locale,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mendoza',
      addressCountry: 'Argentina',
    },
    sameAs,
    knowsAbout: [...copy.about.skills],
    knowsLanguage: copy.about.languageList.map((language) =>
      language.split(' ')[0]
    ),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: site.school,
    },
    ...(currentRole
      ? {
          worksFor: {
            '@type': 'Organization',
            name: currentRole.metadata.title,
          },
        }
      : {}),
    workExample: getListedProjects(locale).map((project) => ({
      '@type': 'CreativeWork',
      name: project.metadata.title,
      url: `${site.url}${localePath(locale, `/${project.slug}`)}`,
      description: getProjectCaseStudyDescription(project),
    })),
  }
}

export const buildPersonJsonLd = (locale: Locale) => ({
  '@context': 'https://schema.org',
  ...buildPersonEntity(locale),
})
