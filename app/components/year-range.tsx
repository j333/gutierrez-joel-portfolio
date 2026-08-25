const yearRangeClassName =
  'mt-2 shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400 sm:mt-0'

type YearRangeProps = {
  start: string
  end: string
  className?: string
}

export const YearRange = ({
  start,
  end,
  className = yearRangeClassName,
}: YearRangeProps) => {
  if (start === end) {
    return (
      <span className={className}>
        <time dateTime={end}>{end}</time>
      </span>
    )
  }

  return (
    <span className={className}>
      <time dateTime={start}>{start}</time>
      -
      <time dateTime={end}>{end}</time>
    </span>
  )
}
