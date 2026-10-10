'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { cx } from 'app/lib/cx'
import type { TocHeading } from 'app/lib/toc'

type ArticleTocProps = {
  headings: TocHeading[]
  label: string
}

const scrollMarker = 128

const linkClassName =
  'block rounded-sm text-sm leading-5 outline-none transition-colors duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const ArticleToc = ({ headings, label }: ArticleTocProps) => {
  const listRef = useRef<HTMLOListElement>(null)
  const markerRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    let frameId = 0

    const placeMarker = (top: number, height: number) => {
      const marker = markerRef.current

      if (!marker) {
        return
      }

      marker.style.transform = `translate3d(0, ${top}px, 0)`
      marker.style.height = `${height}px`
    }

    const sync = () => {
      frameId = 0
      const list = listRef.current

      if (!list || headings.length === 0) {
        return
      }

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      )
      const atBottom = window.scrollY >= maxScroll - 2
      let currentIndex = 0

      for (let index = 0; index < headings.length; index += 1) {
        const element = document.getElementById(headings[index].id)

        if (!element) {
          continue
        }

        const top = element.getBoundingClientRect().top
        const hasReachedMarker = top <= scrollMarker
        const isVisibleNearEnd =
          atBottom && top < window.innerHeight * 0.75

        if (hasReachedMarker || isVisibleNearEnd) {
          currentIndex = index
        }
      }

      const currentId = headings[currentIndex]?.id ?? ''

      setActiveId((previous) => (previous === currentId ? previous : currentId))

      const currentLink = linkRefs.current.get(currentId)

      if (!currentLink) {
        return
      }

      const listTop = list.getBoundingClientRect().top
      const currentRect = currentLink.getBoundingClientRect()
      let top = currentRect.top - listTop
      let height = currentRect.height

      const nextHeading = headings[currentIndex + 1]
      const currentElement = document.getElementById(currentId)
      const nextElement = nextHeading
        ? document.getElementById(nextHeading.id)
        : null
      const nextLink = nextHeading
        ? linkRefs.current.get(nextHeading.id)
        : null

      if (
        !prefersReducedMotion() &&
        currentElement &&
        nextElement &&
        nextLink
      ) {
        const start = currentElement.getBoundingClientRect().top
        const end = nextElement.getBoundingClientRect().top
        const range = end - start
        const progress =
          range > 0
            ? Math.min(1, Math.max(0, (scrollMarker - start) / range))
            : 0
        const nextRect = nextLink.getBoundingClientRect()
        const nextTop = nextRect.top - listTop

        top += (nextTop - top) * progress
        height += (nextRect.height - height) * progress
      }

      placeMarker(top, height)
    }

    const handleScroll = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.addEventListener('hashchange', handleScroll)

    const list = listRef.current
    const resizeObserver = list ? new ResizeObserver(handleScroll) : null

    if (list && resizeObserver) {
      resizeObserver.observe(list)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('hashchange', handleScroll)
      resizeObserver?.disconnect()

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [headings])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id)

    if (!element) {
      return
    }

    event.preventDefault()
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    window.history.pushState(null, '', `#${id}`)
  }

  return (
    <nav aria-label={label}>
      <ol
        ref={listRef}
        className="relative flex flex-col gap-3 border-l border-neutral-200 pl-3 dark:border-neutral-800"
      >
        <span
          ref={markerRef}
          aria-hidden="true"
          className="pointer-events-none absolute -left-px top-0 w-0.5 bg-black dark:bg-white"
        />
        {headings.map((heading) => {
          const isActive = heading.id === activeId

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                ref={(node) => {
                  if (node) {
                    linkRefs.current.set(heading.id, node)
                    return
                  }

                  linkRefs.current.delete(heading.id)
                }}
                onClick={(event) => handleClick(event, heading.id)}
                aria-current={isActive ? 'location' : undefined}
                className={cx(
                  linkClassName,
                  isActive
                    ? 'font-medium text-black dark:text-white'
                    : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
