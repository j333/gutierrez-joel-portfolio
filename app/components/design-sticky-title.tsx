'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from 'app/lib/cx'

type DesignStickyTitleProps = {
  title: string
  children: ReactNode
}

const getNavBottom = () => {
  const nav = document.querySelector('.sticky-nav')

  if (!(nav instanceof HTMLElement)) {
    return 0
  }

  return Math.max(0, Math.round(nav.getBoundingClientRect().bottom))
}

const setChromeOffset = (navBottom: number, titleHeight: number) => {
  const root = document.documentElement
  root.style.setProperty('--sticky-nav-offset', `${navBottom}px`)
  root.style.setProperty('--sticky-chrome', `${navBottom + titleHeight}px`)
}

export const DesignStickyTitle = ({
  title,
  children,
}: DesignStickyTitleProps) => {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const [isPastHeader, setIsPastHeader] = useState(false)

  useEffect(() => {
    const header = headerRef.current

    if (!header) {
      return
    }

    let frameId = 0
    let transitionFrameId = 0

    const updateVisibility = () => {
      const navBottom = getNavBottom()
      const headerBottom = header.getBoundingClientRect().bottom
      const pastHeader = headerBottom < navBottom
      const titleHeight = pastHeader
        ? Math.round(titleRef.current?.offsetHeight ?? 0)
        : 0

      setChromeOffset(navBottom, titleHeight)
      setIsPastHeader(pastHeader)
    }

    const handleScroll = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateVisibility()
      })
    }

    const handleNavTransition = () => {
      const startedAt = performance.now()

      const tick = (now: number) => {
        updateVisibility()

        if (now - startedAt < 220) {
          transitionFrameId = window.requestAnimationFrame(tick)
          return
        }

        transitionFrameId = 0
      }

      if (transitionFrameId) {
        window.cancelAnimationFrame(transitionFrameId)
      }

      transitionFrameId = window.requestAnimationFrame(tick)
    }

    const nav = document.querySelector('.sticky-nav')
    const mutationObserver =
      nav instanceof HTMLElement
        ? new MutationObserver(handleNavTransition)
        : null

    mutationObserver?.observe(nav as HTMLElement, {
      attributes: true,
      attributeFilter: ['data-scroll-hidden'],
    })

    updateVisibility()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      mutationObserver?.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      if (transitionFrameId) {
        window.cancelAnimationFrame(transitionFrameId)
      }

      document.documentElement.style.removeProperty('--sticky-page-title')
      document.documentElement.style.removeProperty('--sticky-nav-offset')
      document.documentElement.style.removeProperty('--sticky-chrome')
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sticky-page-title',
      isPastHeader ? '2.75rem' : '0px'
    )

    const navBottom = getNavBottom()
    const titleHeight = isPastHeader
      ? Math.round(titleRef.current?.offsetHeight ?? 0)
      : 0

    setChromeOffset(navBottom, titleHeight)
  }, [isPastHeader])

  return (
    <>
      <div ref={headerRef}>{children}</div>
      <div
        className="pointer-events-none fixed inset-x-0 z-30"
        style={{ top: 'var(--sticky-nav-offset, 0px)' }}
      >
        <div className="mx-auto max-w-site px-4 sm:px-6">
          <div
            ref={titleRef}
            className={cx(
              'sticky-page-title relative -mx-4 bg-white px-4 sm:-mx-6 sm:px-6 dark:bg-black',
              'transition-opacity duration-200 ease-out motion-reduce:transition-none',
              isPastHeader ? 'pointer-events-auto opacity-100' : 'opacity-0'
            )}
            aria-hidden={!isPastHeader}
          >
            <p className="py-3 text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
              {title}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
