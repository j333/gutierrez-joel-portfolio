import { typeMetaClassName } from 'app/components/page-layout'

const yearRangeClassName = typeMetaClassName

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
