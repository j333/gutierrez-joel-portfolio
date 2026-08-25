export const themeIconClassName = 'ml-1 shrink-0'

type ThemeIconProps = {
  className?: string
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 32 32',
  fill: 'currentColor' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

export const SunIcon = ({ className }: ThemeIconProps) => {
  return (
    <svg
      {...iconProps}
      className={className || themeIconClassName}
    >
      <path d="M15 2H17V7H15z" />
      <path
        d="M21.668 6.854H26.626V8.854H21.668z"
        transform="rotate(-45 24.147 7.853)"
      />
      <path d="M25 15H30V17H25z" />
      <path
        d="M23.147 21.668H25.147V26.626H23.147z"
        transform="rotate(-45 24.147 24.146)"
      />
      <path d="M15 25H17V30H15z" />
      <path
        d="M5.375 23.147H10.333V25.147H5.375z"
        transform="rotate(-45 7.853 24.146)"
      />
      <path d="M2 15H7V17H2z" />
      <path
        d="M6.854 5.375H8.854V10.333H6.854z"
        transform="rotate(-45 7.854 7.853)"
      />
      <path d="M16,10a6,6,0,1,0,6,6,6,6,0,0,0-6-6Z" />
    </svg>
  )
}

export const MoonIcon = ({ className }: ThemeIconProps) => {
  return (
    <svg
      {...iconProps}
      className={className || themeIconClassName}
    >
      <path d="M14.98,3a1.0024,1.0024,0,0,0-.1746.0156A13.0959,13.0959,0,0,0,16.63,28.9973c.1641.006.3282,0,.4909,0a13.0724,13.0724,0,0,0,10.702-5.5556,1.0094,1.0094,0,0,0-.7833-1.5644A13.08,13.08,0,0,1,15.8892,4.38,1.0149,1.0149,0,0,0,14.98,3Z" />
    </svg>
  )
}

export const SystemIcon = ({ className }: ThemeIconProps) => {
  return (
    <svg
      {...iconProps}
      className={className || themeIconClassName}
    >
      <path d="M29.37,11.84a13.6,13.6,0,0,0-1.06-2.51A14.17,14.17,0,0,0,25.9,6.1a14,14,0,1,0,0,19.8,14.17,14.17,0,0,0,2.41-3.23,13.6,13.6,0,0,0,1.06-2.51,14,14,0,0,0,0-8.32ZM4,16A12,12,0,0,1,16,4V28A12,12,0,0,1,4,16Z" />
    </svg>
  )
}
