import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from 'app/lib/cx'
import { ctaLinkClassName } from './link-styles'

type CtaLinkProps = {
  href: string
  children: ReactNode
  className?: string
  'aria-label'?: string
}

const isExternalHref = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('mailto:')

export const CtaLink = ({
  children,
  className,
  href,
  ...props
}: CtaLinkProps) => {
  const classNames = cx(ctaLinkClassName, className)

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={classNames}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classNames} {...props}>
      {children}
    </Link>
  )
}
