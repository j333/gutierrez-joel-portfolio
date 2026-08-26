import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import {
  ZoomableImage,
  type ArticleImageSize,
} from './zoomable-image'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
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

const DEFAULT_IMAGE_ALT = 'Joel Gutiérrez, Product Design Manager'

function descriptiveAlt(alt?: string) {
  return typeof alt === 'string' && alt.trim() ? alt : DEFAULT_IMAGE_ALT
}

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

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
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
    return { src: '', size: 'column' as ArticleImageSize }
  }

  const hashIndex = rawSrc.indexOf('#')
  if (hashIndex === -1) {
    return { src: rawSrc, size: 'column' as ArticleImageSize }
  }

  const src = rawSrc.slice(0, hashIndex)
  const hash = rawSrc.slice(hashIndex + 1).toLowerCase()
  const size: ArticleImageSize = hash === 'wide' ? 'wide' : 'column'

  return { src, size }
}

function MarkdownImage(props) {
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
  const { src, size } = parseArticleImage(props.src)

  return (
    <ZoomableImage src={src} alt={alt} size={size} caption={caption} />
  )
}

function Paragraph({ children, ...props }) {
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

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

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

function headingLabel(children) {
  return headingText(children) || 'this section'
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const label = headingLabel(children)
    let slug = slugify(label)
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

let components = {
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

export function CustomMDX(props) {
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
