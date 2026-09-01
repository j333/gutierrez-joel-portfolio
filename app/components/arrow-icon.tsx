export const arrowIconClassName =
  'ml-1 size-2.5 shrink-0 self-start translate-y-[2px]'

export const ArrowIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className || arrowIconClassName}
    >
      <path
        d="M10 6 10 8 22.59 8 6 24.59 7.41 26 24 9.41 24 22 26 22 26 6 10 6z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
