'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react'
import { buttonDisabledClassName } from 'app/components/button-styles'
import { GlitchCover } from 'app/components/glitch-cover'
import { HomeActionLink } from 'app/components/home-action-link'
import { cardTitleClassName } from 'app/components/link-styles'
import { cx } from 'app/lib/cx'
import { type RecommendationPhoto } from 'app/lib/recommendation-photos'
import {
  projectCardImageSizes,
  projectImageQuality,
} from 'app/lib/image-sizes'

const desktopQuery = '(min-width: 1024px)'

const cardLinkClassName =
  'group flex flex-col rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const metaClassName =
  'shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

const pagerButtonClassName =
  'inline-flex size-10 cursor-pointer items-center justify-center rounded-sm text-neutral-900 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-40 dark:text-white dark:hover:text-white dark:focus-visible:outline-neutral-100'

type PagerAction = {
  href: string
  label: string
  external?: boolean
}

type HomeImage = {
  src: string
  width: number
  height: number
}

export type HomeCaseSlide = {
  slug: string
  href: string
  title: string
  meta: string
  image: (HomeImage & { alt: string }) | null
  priority: boolean
}

export type HomeQuoteSlide = {
  name: string
  role: string
  quote: string
  image: RecommendationPhoto
}

type HomePagerProps<T> = {
  items: readonly T[]
  desktopVisible: 2 | 3
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  action: PagerAction
  previousLabel: string
  nextLabel: string
  gridClassName?: string
  stackClassName?: string
  matchTallest?: boolean
}

const HomePager = <T,>({
  items,
  desktopVisible,
  getKey,
  renderItem,
  action,
  previousLabel,
  nextLabel,
  gridClassName,
  stackClassName = 'gap-8',
  matchTallest = false,
}: HomePagerProps<T>) => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState<number>(desktopVisible)
  const [tallest, setTallest] = useState(0)
  const swipeOrigin = useRef<{ x: number; y: number } | null>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia(desktopQuery)

    const handleChange = () => {
      setVisible(media.matches ? desktopVisible : 1)
    }

    handleChange()
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [desktopVisible])

  useLayoutEffect(() => {
    if (!matchTallest) {
      return
    }

    const root = measureRef.current
    if (!root) {
      return
    }

    const updateTallest = () => {
      let next = 0

      for (const cell of root.children) {
        next = Math.max(next, (cell as HTMLElement).offsetHeight)
      }

      setTallest((current) => (current === next ? current : next))
    }

    updateTallest()
    const observer = new ResizeObserver(updateTallest)
    observer.observe(root)

    for (const cell of root.children) {
      observer.observe(cell)
    }

    return () => observer.disconnect()
  }, [matchTallest, items, visible])

  const count = items.length
  const canLoop = count > 1
  const start = canLoop ? ((index % count) + count) % count : 0
  const windowSize = Math.min(visible, count)
  const page =
    count === 0
      ? []
      : Array.from({ length: windowSize }, (_, offset) => items[(start + offset) % count])
  const columns = desktopVisible === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'

  const handlePrevious = () => {
    if (!canLoop) {
      return
    }

    setIndex((current) => (((current % count) + count) % count - 1 + count) % count)
  }

  const handleNext = () => {
    if (!canLoop) {
      return
    }

    setIndex((current) => (((current % count) + count) % count + 1) % count)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!canLoop || visible !== 1) {
      swipeOrigin.current = null
      return
    }

    const touch = event.changedTouches[0]
    if (!touch) {
      return
    }

    swipeOrigin.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const origin = swipeOrigin.current
    swipeOrigin.current = null

    if (!origin || !canLoop || visible !== 1) {
      return
    }

    const touch = event.changedTouches[0]
    if (!touch) {
      return
    }

    const deltaX = touch.clientX - origin.x
    const deltaY = touch.clientY - origin.y

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return
    }

    if (deltaX < 0) {
      handleNext()
      return
    }

    handlePrevious()
  }

  return (
    <div className={cx('flex w-full flex-col', stackClassName)}>
      <div className="relative">
        <div
          className={cx('grid w-full grid-cols-1 touch-pan-y', columns, gridClassName)}
          style={matchTallest && tallest > 0 ? { minHeight: tallest } : undefined}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            swipeOrigin.current = null
          }}
        >
          {page.map((item) => (
            <div key={getKey(item)} className={cx('min-w-0', matchTallest && 'h-full')}>
              {renderItem(item)}
            </div>
          ))}
        </div>
        {matchTallest ? (
          <div
            ref={measureRef}
            aria-hidden="true"
            inert
            className={cx(
              'pointer-events-none invisible absolute inset-x-0 top-0 grid w-full grid-cols-1',
              columns,
              gridClassName,
            )}
          >
            {items.map((item) => (
              <div key={getKey(item)} className="min-w-0">
                {renderItem(item)}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex w-full items-center justify-between gap-5">
        <HomeActionLink href={action.href} external={action.external}>
          {action.label}
        </HomeActionLink>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={!canLoop}
            onClick={handlePrevious}
            className={cx(pagerButtonClassName, !canLoop && buttonDisabledClassName)}
          >
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={!canLoop}
            onClick={handleNext}
            className={cx(pagerButtonClassName, !canLoop && buttonDisabledClassName)}
          >
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

type PagerLabels = {
  previousLabel: string
  nextLabel: string
  action: PagerAction
}

const homeCaseCount = 4

export const HomeCasePager = ({
  items,
  action,
}: {
  items: HomeCaseSlide[]
  action: PagerAction
}) => {
  const cases = items.slice(0, homeCaseCount)

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        {cases.map((item) => (
          <Link key={item.slug} href={item.href} className={`${cardLinkClassName} gap-2`}>
            {item.image ? (
              <GlitchCover
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                sizes={projectCardImageSizes}
                quality={projectImageQuality}
                priority={item.priority}
              />
            ) : null}
            <div className="flex w-full items-center justify-between gap-4">
              <h3 className={`min-w-0 ${cardTitleClassName}`}>{item.title}</h3>
              <span className={metaClassName}>{item.meta}</span>
            </div>
          </Link>
        ))}
      </div>
      <HomeActionLink href={action.href} external={action.external}>
        {action.label}
      </HomeActionLink>
    </div>
  )
}

export const HomeQuotePager = ({
  items,
  previousLabel,
  nextLabel,
  action,
}: PagerLabels & { items: HomeQuoteSlide[] }) => (
  <HomePager
    items={items}
    desktopVisible={3}
    getKey={(item) => item.name}
    gridClassName="gap-12"
    stackClassName="gap-8"
    matchTallest
    previousLabel={previousLabel}
    nextLabel={nextLabel}
    action={action}
    renderItem={(item) => (
      <figure className="flex h-full min-w-0 flex-col gap-5">
        <blockquote className="text-pretty text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
          {item.quote}
        </blockquote>
        <figcaption className="mt-auto flex min-w-0 items-center gap-4">
          <Image
            src={item.image.src}
            alt=""
            width={item.image.width}
            height={item.image.height}
            sizes="40px"
            className="size-10 shrink-0 object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <cite className="not-italic text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
              {item.name}
            </cite>
            <p className="text-[13px] leading-[1.63] text-neutral-500 dark:text-neutral-400">
              {item.role}
            </p>
          </div>
        </figcaption>
      </figure>
    )}
  />
)
