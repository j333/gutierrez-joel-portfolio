import { getExperience } from 'app/experience/utils'
import { getListedProjects } from 'app/projects/utils'
import {
  aboutBio,
  aboutEducation,
  aboutLanguages,
  aboutSkills,
  aboutStack,
  aboutStackNote,
} from 'app/lib/about-data'
import { site, workIndex } from 'app/lib/site'

export {
  aboutBio,
  aboutEducation,
  aboutLanguages,
  aboutSkills,
  aboutStack,
  aboutStackNote,
} from 'app/lib/about-data'

export const buildAboutMarkdown = () => {
  const experience = getExperience()
    .map(
      (entry) =>
        `- **${entry.metadata.title}** (${entry.metadata.startedAt}–${entry.metadata.endedAt}): ${entry.metadata.summary}`
    )
    .join('\n')

  return `# About

${aboutBio.join('\n\n')}

## Experience

${experience}

## Education

- **${aboutEducation.degree}**, ${aboutEducation.school} (${aboutEducation.start}–${aboutEducation.end})

## Capabilities

${aboutSkills.map((skill) => `- ${skill}`).join('\n')}

## Stack

${aboutStack.map((tool) => `- ${tool}`).join('\n')}

${aboutStackNote}

## Languages

${aboutLanguages.map((language) => `- ${language}`).join('\n')}
`
}

export const buildHomeMarkdown = () => {
  const caseStudies = getListedProjects()
    .map(
      (project) =>
        `- **${project.metadata.title}** (${project.metadata.product}): ${project.metadata.summary ?? project.metadata.title}`
    )
    .join('\n')

  return `# ${workIndex.title}

> ${workIndex.description}

${workIndex.intro}

## Projects

These are portfolio case studies, not employers.

${caseStudies}

For employment history, see [/about.md](${site.url}/about.md).
`
}
