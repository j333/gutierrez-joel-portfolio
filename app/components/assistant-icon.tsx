const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 32 32',
  fill: 'currentColor' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

type AssistantIconProps = {
  className?: string
}

export const AssistantIcon = ({ className }: AssistantIconProps) => {
  return (
    <svg {...iconProps} className={className ?? 'shrink-0'}>
      <path d="M16 5 19 13 27 16 19 19 16 27 13 19 5 16 13 13 16 5z" />
    </svg>
  )
}
