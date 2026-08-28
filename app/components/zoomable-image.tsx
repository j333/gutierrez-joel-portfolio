'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from 'app/lib/cx'

export type ArticleImageSize = 'column' | 'wide'

type ZoomableImageProps = {
  src: string
  alt: string
  size?: ArticleImageSize
  caption?: string
  width?: number
  height?: number
}

const figureClassName: Record<ArticleImageSize, string> = {
  column: 'article-image my-8',
  wide: 'article-image article-image--wide my-8',
}

const triggerClassName =
  'm-0 block w-full cursor-zoom-in border-0 bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const closeButtonClassName =
  'absolute right-3 top-3 rounded-sm px-1 py-1 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-600 outline-none hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100'

const articleImageSizes: Record<ArticleImageSize, string> = {
  column: '(max-width: 36rem) calc(100vw - 2rem), 36rem',
  wide: '(max-width: 58rem) calc(100vw - 2rem), 56rem',
}

export const ZoomableImage = ({
  src,
  alt,
  size = 'column',
  caption,
  width,
  height,
}: ZoomableImageProps) => {
  const labelId = useId()
  const captionId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    overlayRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      }
    }

    let canCloseOnScroll = false
    const enableScrollCloseFrame = window.requestAnimationFrame(() => {
      canCloseOnScroll = true
    })

    const handleScrollClose = () => {
      if (!canCloseOnScroll) {
        return
      }

      handleClose()
    }

    let touchStartY: number | null = null

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY
      if (touchStartY == null || currentY == null) {
        return
      }

      if (Math.abs(currentY - touchStartY) > 16) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleScrollClose, { passive: true })
    window.addEventListener('scroll', handleScrollClose, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.cancelAnimationFrame(enableScrollCloseFrame)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleScrollClose)
      window.removeEventListener('scroll', handleScrollClose)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleClose, isOpen])

  const hasDimensions = typeof width === 'number' && typeof height === 'number'

  const handleBackdropClick = () => {
    handleClose()
  }

  const handleOverlayImageClick = (event: MouseEvent<HTMLImageElement>) => {
    event.stopPropagation()
    handleClose()
  }

  const overlayImageClassName = cx(
    'h-auto w-auto max-w-[calc(100vw-2rem)] cursor-zoom-out select-none object-contain',
    caption ? 'max-h-[calc(100vh-8rem)]' : 'max-h-[calc(100vh-3rem)]'
  )

  const overlay = isOpen ? (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      aria-describedby={caption ? captionId : undefined}
      tabIndex={-1}
      className="article-image-overlay fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-white/95 px-4 py-6 outline-none dark:bg-black/95"
      onClick={handleBackdropClick}
    >
      <span id={labelId} className="sr-only">
        {alt}. Press Escape to close.
      </span>
      <button
        type="button"
        className={closeButtonClassName}
        aria-label="Close image"
        onClick={(event) => {
          event.stopPropagation()
          handleClose()
        }}
      >
        Close
      </button>
      <div className="flex max-h-full max-w-full flex-col items-center">
        {hasDimensions ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="100vw"
            onClick={handleOverlayImageClick}
            className={overlayImageClassName}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            onClick={handleOverlayImageClick}
            className={overlayImageClassName}
          />
        )}
        {caption ? (
          <p
            id={captionId}
            className="mt-2 max-w-[calc(100vw-2rem)] shrink-0 text-center text-sm leading-6 text-neutral-600 dark:text-neutral-400"
          >
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  ) : null

  return (
    <figure className={figureClassName[size]}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={`View original size: ${alt}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleOpen}
      >
        {hasDimensions ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={articleImageSizes[size]}
            className="m-0 h-auto w-full rounded-xl"
          />
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="m-0 h-auto w-full rounded-xl"
          />
        )}
      </button>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      ) : null}
      {isOpen ? createPortal(overlay, document.body) : null}
    </figure>
  )
}
