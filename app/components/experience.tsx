import Link from 'next/link'
import { getExperience } from 'app/experience/utils'
import { YearRange } from 'app/components/year-range'

const preventWidow = (text: string) => {
  const lastSpace = text.lastIndexOf(' ')

  if (lastSpace === -1) {
    return text
  }

  return `${text.slice(0, lastSpace)}\u00A0${text.slice(lastSpace + 1)}`
}

type ExperiencePostsProps = {
  limit?: number
  heading?: 'h2' | 'h3'
}

export function ExperiencePosts({
  limit,
  heading = 'h2',
}: ExperiencePostsProps) {
  const Heading = heading
  let entries = getExperience()

  if (limit) {
    entries = entries.slice(0, limit)
  }

  return (
    <ul className="space-y-8">
      {entries.map((entry) => (
        <li key={entry.slug}>
          <article className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex flex-col">
              <Heading className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                <Link
                  href={`/experience/${entry.slug}`}
                  className="content-link w-fit"
                >
                  {entry.metadata.title}
                </Link>
              </Heading>
              {entry.metadata.summary && (
                <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                  {preventWidow(
                    entry.metadata.role
                      ? `${entry.metadata.role}. ${entry.metadata.summary}`
                      : entry.metadata.summary
                  )}
                </p>
              )}
            </div>
            <YearRange
              start={entry.metadata.startedAt}
              end={entry.metadata.endedAt}
            />
          </article>
        </li>
      ))}
    </ul>
  )
}
