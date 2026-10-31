'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { buttonDisabledClassName } from 'app/components/button-styles'
import { GlitchCover } from 'app/components/glitch-cover'
import { HomeActionLink } from 'app/components/home-action-link'
import { cardTitleClassName } from 'app/components/link-styles'
import { cx } from 'app/lib/cx'
import {
  imagePlaceholderClassName,
  projectCardImageSizes,
  projectImageQuality,
} from 'app/lib/image-sizes'

const desktopQuery = '(min-width: 1024px)'

const cardLinkClassName =
  'group flex flex-col rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const metaClassName =
  'shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

const pagerButtonClassName =
  'inline-flex size-10 items-center justify-center rounded-sm text-neutral-900 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-40 dark:text-white dark:hover:text-white dark:focus-visible:outline-neutral-100'

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
}

export type HomeNoteSlide = {
  slug: string
  href: string
  title: string
  dateTime: string
  dateLabel: string
  image: HomeImage | null
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
}: HomePagerProps<T>) => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState<number>(desktopVisible)

  useEffect(() => {
    const media = window.matchMedia(desktopQuery)

    const handleChange = () => {
      setVisible(media.matches ? desktopVisible : 1)
    }

    handleChange()
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [desktopVisible])

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

  return (
    <div className={cx('flex w-full flex-col', stackClassName)}>
      <div className={cx('grid w-full grid-cols-1', columns, gridClassName)}>
        {page.map((item) => (
          <div key={getKey(item)} className="min-w-0">
            {renderItem(item)}
          </div>
        ))}
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

export const HomeCasePager = ({
  items,
  previousLabel,
  nextLabel,
  action,
}: PagerLabels & { items: HomeCaseSlide[] }) => (
  <HomePager
    items={items}
    desktopVisible={2}
    getKey={(item) => item.slug}
    gridClassName="gap-8"
    previousLabel={previousLabel}
    nextLabel={nextLabel}
    action={action}
    renderItem={(item) => (
      <Link href={item.href} className={`${cardLinkClassName} gap-2`}>
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
    )}
  />
)

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
    stackClassName="gap-4"
    previousLabel={previousLabel}
    nextLabel={nextLabel}
    action={action}
    renderItem={(item) => (
      <figure className="flex min-w-0 flex-col gap-5">
        <figcaption className="flex flex-col gap-0.5">
          <cite className="not-italic text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
            {item.name}
          </cite>
          <p className="text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {item.role}
          </p>
        </figcaption>
        <blockquote className="text-pretty text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
          {item.quote}
        </blockquote>
      </figure>
    )}
  />
)

export const HomeNotePager = ({
  items,
  previousLabel,
  nextLabel,
  action,
}: PagerLabels & { items: HomeNoteSlide[] }) => (
  <HomePager
    items={items}
    desktopVisible={2}
    getKey={(item) => item.slug}
    gridClassName="gap-6"
    stackClassName="gap-4"
    previousLabel={previousLabel}
    nextLabel={nextLabel}
    action={action}
    renderItem={(item) => (
      <Link href={item.href} className={`${cardLinkClassName} gap-3`}>
        {item.image ? (
          <GlitchCover
            src={item.image.src}
            alt={item.title}
            width={item.image.width}
            height={item.image.height}
            sizes={projectCardImageSizes}
            quality={projectImageQuality}
          />
        ) : (
          <div
            aria-hidden="true"
            className={`aspect-video w-full ${imagePlaceholderClassName}`}
          />
        )}
        <div className="flex w-full items-center justify-between gap-4">
          <h3 className={`min-w-0 ${cardTitleClassName}`}>{item.title}</h3>
          <time dateTime={item.dateTime} className={`${metaClassName} uppercase tracking-wider`}>
            {item.dateLabel}
          </time>
        </div>
      </Link>
    )}
  />
)
