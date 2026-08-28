import { ContentListItem } from 'app/components/content-list-item'
import { YearRange } from 'app/components/year-range'
import { getExperience } from 'app/experience/utils'
import { preventWidow } from 'app/lib/text'

type ExperiencePostsProps = {
  limit?: number
  heading?: 'h2' | 'h3'
}

export const ExperiencePosts = ({
  limit,
  heading = 'h2',
}: ExperiencePostsProps) => {
  const entries = getExperience()
  const visibleEntries = limit ? entries.slice(0, limit) : entries

  return (
    <ul className="space-y-8">
      {visibleEntries.map((entry) => (
        <li key={entry.slug}>
          <ContentListItem
            href={`/experience/${entry.slug}`}
            title={entry.metadata.title}
            heading={heading}
            aside={
              <YearRange
                start={entry.metadata.startedAt}
                end={entry.metadata.endedAt}
              />
            }
          >
            {entry.metadata.summary ? (
              <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                {preventWidow(entry.metadata.summary)}
              </p>
            ) : null}
          </ContentListItem>
        </li>
      ))}
    </ul>
  )
}
