import Link from 'next/link'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { getPublicImageSize } from 'app/lib/public-image'
import { site } from 'app/lib/site'
import {
  ZoomableImage,
  type ArticleImageSize,
} from './zoomable-image'

type TableData = {
  headers: React.ReactNode[]
  rows: React.ReactNode[][]
}

const Table = ({ data }: { data: TableData }) => {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

type CustomLinkProps = {
  href?: string
  children?: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

const CustomLink = ({ href = '', children, ...props }: CustomLinkProps) => {
  if (href.startsWith('/')) {
    return <Link href={href}>{children}</Link>
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

const DEFAULT_IMAGE_ALT = `${site.name}, ${site.jobTitle}`

const descriptiveAlt = (alt?: string) =>
  typeof alt === 'string' && alt.trim() ? alt : DEFAULT_IMAGE_ALT

const getYouTubeId = (src?: string) => {
  if (!src) {
    return null
  }

  try {
    const url = new URL(src)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/')[2] || null
      }

      return url.searchParams.get('v')
    }
  } catch {
    return null
  }

  return null
}

const parseArticleImage = (rawSrc?: string) => {
  if (!rawSrc) {
    return { src: '', size: 'column' as ArticleImageSize, animated: false }
  }

  const hashIndex = rawSrc.indexOf('#')
  if (hashIndex === -1) {
    return { src: rawSrc, size: 'column' as ArticleImageSize, animated: false }
  }

  const src = rawSrc.slice(0, hashIndex)
  const hashParts = rawSrc
    .slice(hashIndex + 1)
    .toLowerCase()
    .split('-')
  const size: ArticleImageSize = hashParts.includes('wide') ? 'wide' : 'column'
  const animated = hashParts.includes('animated')

  return { src, size, animated }
}

type MarkdownImageProps = {
  src?: string
  alt?: string
  title?: string
}

const MarkdownImage = (props: MarkdownImageProps) => {
  const youtubeId = getYouTubeId(props.src)

  if (youtubeId) {
    const title = descriptiveAlt(props.alt)

    return (
      <div className="my-8 aspect-video overflow-hidden rounded-xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  const alt = descriptiveAlt(props.alt)
  const caption =
    typeof props.title === 'string' && props.title.trim()
      ? props.title
      : undefined
  const { src, size, animated } = parseArticleImage(props.src)
  const dimensions = getPublicImageSize(src)

  return (
    <ZoomableImage
      src={src}
      alt={alt}
      size={size}
      caption={caption}
      animated={animated}
      width={animated ? undefined : dimensions?.width}
      height={animated ? undefined : dimensions?.height}
    />
  )
}

const Paragraph = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  const meaningfulChildren = React.Children.toArray(children).filter((child) =>
    typeof child === 'string' ? child.trim() !== '' : true
  )
  const isStandaloneImage =
    meaningfulChildren.length === 1 &&
    React.isValidElement(meaningfulChildren[0]) &&
    meaningfulChildren[0].type === MarkdownImage

  if (isStandaloneImage) {
    return meaningfulChildren[0]
  }

  return <p {...props}>{children}</p>
}

const Code = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
  const codeHTML = highlight(String(children))
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const slugify = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')

type HeadingChildProps = {
  children?: React.ReactNode
}

const headingText = (children: React.ReactNode): string => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }

  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child)
      }

      if (React.isValidElement<HeadingChildProps>(child)) {
        return headingText(child.props.children)
      }

      return ''
    })
    .join('')
    .trim()
}

const headingLabel = (children: React.ReactNode) =>
  headingText(children) || 'this section'

const createHeading = (level: number) => {
  const Heading = ({ children }: { children?: React.ReactNode }) => {
    const label = headingLabel(children)
    const slug = slugify(label)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
          'aria-label': `Permalink to ${label}`,
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const components = {
  h1: createHeading(2),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: Paragraph,
  img: MarkdownImage,
  a: CustomLink,
  code: Code,
  Table,
}

export const CustomMDX = (props: MDXRemoteProps) => {
  return (
    <MDXRemote
      {...props}
      options={{
        mdxOptions: {
          format: 'md',
        },
      }}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
