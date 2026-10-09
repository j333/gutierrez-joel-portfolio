'use client'

import type { ComponentProps } from 'react'
import { HomeActionLink } from './home-action-link'

type CtaLinkProps = {
  href: string
  children: string
  className?: string
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>

export const CtaLink = ({ children, ...props }: CtaLinkProps) => (
  <HomeActionLink {...props}>{children}</HomeActionLink>
)
