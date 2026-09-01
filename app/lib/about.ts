import { getExperience } from 'app/experience/utils'
import {
  aboutBio,
  aboutEducation,
  aboutLanguages,
  aboutSkills,
} from 'app/lib/about-data'
import { site } from 'app/lib/site'

export {
  aboutBio,
  aboutEducation,
  aboutLanguages,
  aboutSkills,
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

## Languages

${aboutLanguages.map((language) => `- ${language}`).join('\n')}
`
}

export const buildHomeMarkdown = () => {
  return `# ${site.name}

> ${site.description}

I'm a *product designer* with over a decade of experience in product strategy, design systems, design leadership, and UX.

See [/about.md](${site.url}/about.md) for background, experience, and capabilities.
`
}
