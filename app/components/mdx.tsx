import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { ArrowIcon } from './arrow-icon'

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

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return (
    <a target="_blank" rel="noopener noreferrer" {...props} className={[props.className, "group inline-flex items-center"].filter(Boolean).join(" ")}>
      {props.children}
      <ArrowIcon className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

const DEFAULT_IMAGE_ALT = 'Joel Gutiérrez, Product Design Manager'

function descriptiveAlt(alt?: string) {
  return typeof alt === 'string' && alt.trim() ? alt : DEFAULT_IMAGE_ALT
}

function MarkdownImage(props) {
  const alt = descriptiveAlt(props.alt)
  const caption =
    typeof props.title === 'string' && props.title.trim()
      ? props.title
      : undefined

  return (
    <figure className="my-8">
      <img
        {...props}
        alt={alt}
        title={undefined}
        loading="lazy"
        decoding="async"
        className="m-0 h-auto w-full rounded-xl"
      />
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
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

function headingLabel(children) {
  if (typeof children === 'string') {
    return children
  }

  return React.Children.toArray(children)
    .map((child) => (typeof child === 'string' ? child : ''))
    .join('')
    .trim() || 'this section'
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    const label = headingLabel(children)
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
