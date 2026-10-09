import Link from 'next/link'
import { ArrowIcon, rowArrowClassName } from 'app/components/arrow-icon'
import { ScrambleTitle } from 'app/components/scramble-title'
import { YearRange } from 'app/components/year-range'
import { getExperience } from 'app/experience/utils'
import { getLocale } from 'app/lib/i18n'
import { localePath } from 'app/lib/locale'
import { preventWidow } from 'app/lib/text'

type ExperiencePostsProps = {
  limit?: number
  heading?: 'h2' | 'h3'
}

const rowLinkClassName =
  'group flex w-full items-start justify-between gap-3 border-neutral-200 py-3 outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:focus-visible:outline-neutral-100'

const rowTitleClassName =
  'text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white'

const rowYearClassName =
  'font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

export const ExperiencePosts = async ({
  limit,
  heading: Heading = 'h2',
}: ExperiencePostsProps) => {
  const locale = await getLocale()
  const entries = getExperience(locale)
  const visibleEntries = limit ? entries.slice(0, limit) : entries

  return (
    <ul className="flex w-full flex-col">
      {visibleEntries.map((entry, index) => (
        <li key={entry.slug}>
          <Link
            href={localePath(locale, `/experience/${entry.slug}`)}
            className={`${rowLinkClassName} ${
              index === 0 ? 'border-t-0' : 'border-t'
            }`}
          >
            <div className="flex min-w-0 flex-col gap-1">
              <Heading className={rowTitleClassName}>
                <ScrambleTitle text={entry.metadata.title} />
              </Heading>
              {entry.metadata.summary ? (
                <p className="text-pretty text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                  {preventWidow(entry.metadata.summary)}
                </p>
              ) : null}
            </div>
            <span className="flex shrink-0 items-center gap-2 pt-0.5">
              <YearRange
                start={entry.metadata.startedAt}
                end={entry.metadata.endedAt}
                className={rowYearClassName}
              />
              <ArrowIcon className={rowArrowClassName} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
