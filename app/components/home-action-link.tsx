'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'
import { cx } from 'app/lib/cx'
import { useScrambleText } from 'app/hooks/use-scramble-text'
import { ctaLinkClassName } from './link-styles'

type HomeActionLinkProps = {
  href: string
  children: string
  className?: string
  external?: boolean
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>

const isExternalHref = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('mailto:')

export const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

export const HomeActionLink = ({
  href,
  children,
  className,
  external,
  onMouseEnter,
  ...props
}: HomeActionLinkProps) => {
  const { ref, replay } = useScrambleText(children, { scramble: 5 })
  const classNames = cx(ctaLinkClassName, className)
  const isExternal = external || isExternalHref(href)

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(event)
    replay()
  }

  const content = (
    <>
      <span ref={ref}>{children}</span>
      {isExternal ? <ArrowUpRightIcon /> : null}
    </>
  )

  if (isExternal) {
    return (
      <a
        href={href}
        className={classNames}
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={classNames}
      {...props}
      onMouseEnter={handleMouseEnter}
    >
      {content}
    </Link>
  )
}
