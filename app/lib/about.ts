import { getExperience } from 'app/experience/utils'
import { dictionaries } from 'app/lib/i18n'
import { localePath, type Locale } from 'app/lib/locale'
import { getListedProjects } from 'app/projects/utils'
import { site } from 'app/lib/site'

export const buildAboutMarkdown = (locale: Locale) => {
  const copy = dictionaries[locale]
  const experience = getExperience(locale)
    .map(
      (entry) =>
        `- **${entry.metadata.title}** (${entry.metadata.startedAt}–${entry.metadata.endedAt}): ${entry.metadata.summary}`
    )
    .join('\n')

  return `# ${copy.markdown.aboutTitle}

${copy.about.bio.join('\n\n')}

## ${copy.about.experience}

${experience}

## ${copy.about.education}

- **${copy.about.degree}**, ${site.school} (${site.educationStart}–${site.educationEnd})

## ${copy.markdown.capabilities}

${copy.about.skills.map((skill) => `- ${skill}`).join('\n')}

## ${copy.about.stack}

${site.stack.map((tool) => `- ${tool}`).join('\n')}

${copy.about.stackNote}

## ${copy.markdown.languages}

${copy.about.languageList.map((language) => `- ${language}`).join('\n')}
`
}

export const buildHomeMarkdown = (locale: Locale) => {
  const copy = dictionaries[locale]
  const caseStudies = getListedProjects(locale)
    .map(
      (project) =>
        `- **${project.metadata.title}** (${project.metadata.product}): ${project.metadata.summary ?? project.metadata.title}`
    )
    .join('\n')

  return `# ${copy.home.title}

> ${copy.home.description}

${copy.home.eyebrow}

${copy.home.headline}

${copy.home.intro}

${copy.home.nowLabel}: ${copy.home.now}

## ${copy.home.selectedWork.title}

${copy.home.selectedWork.subtitle}

${caseStudies}

## ${copy.home.aboutTeaser.previously}

${copy.home.aboutTeaser.roles
  .map((role) => `- **${role.company}** (${role.years}): ${role.role}`)
  .join('\n')}

${copy.projects.employmentNote} [${copy.about.title}](${site.url}${localePath(locale, '/about')}.md).

## ${copy.craft.title}

${copy.projects.homeNote}

[${copy.craft.title}](${site.url}${localePath(locale, '/craft')}.md)
`
}

export const buildCraftMarkdown = (locale: Locale) => {
  const copy = dictionaries[locale]
  const caseStudies = getListedProjects(locale)
    .map(
      (project) =>
        `- **${project.metadata.title}** (${project.metadata.product}): ${project.metadata.summary ?? project.metadata.title}`
    )
    .join('\n')

  return `# ${copy.craft.title}

> ${copy.craft.description}

${copy.craft.intro}

## ${copy.markdown.projects}

${copy.projects.homeNote}

${caseStudies}

${copy.projects.employmentNote} [${copy.about.title}](${site.url}${localePath(locale, '/about')}.md).
`
}
