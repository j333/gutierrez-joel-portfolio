'use client'

import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { useScrambleText } from '../hooks/use-scramble-text'

type ChromeScrambleLinkProps = {
  href: string
  text: string
  className: string
  scramble?: number
  external?: boolean
  children?: ReactNode
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>

export const ChromeScrambleLink = ({
  href,
  text,
  className,
  scramble = 5,
  external = false,
  children,
  ...rest
}: ChromeScrambleLinkProps) => {
  const { ref, replay } = useScrambleText(text, { scramble })

  const content = (
    <>
      <span ref={ref}>{text}</span>
      {children}
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        className={className}
        {...rest}
        onMouseEnter={replay}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} {...rest} onMouseEnter={replay}>
      {content}
    </Link>
  )
}
