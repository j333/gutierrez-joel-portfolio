'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { captureProjectOpened } from 'app/lib/capture'

type ProjectCaseLinkProps = {
  href: string
  slug: string
  className: string
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

export const ProjectCaseLink = ({
  href,
  slug,
  className,
  children,
  onClick,
  ...props
}: ProjectCaseLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    captureProjectOpened(slug)
  }

  return (
    <Link href={href} className={className} {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}
