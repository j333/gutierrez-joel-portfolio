type ThemeIconProps = {
  className?: string
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

export const SunIcon = ({ className }: ThemeIconProps) => {
  return (
    <svg {...iconProps} className={className ?? 'shrink-0'}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

export const MoonIcon = ({ className }: ThemeIconProps) => {
  return (
    <svg {...iconProps} className={className ?? 'shrink-0'}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}
