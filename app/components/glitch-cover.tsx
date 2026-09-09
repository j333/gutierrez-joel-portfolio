'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { imagePlaceholderClassName } from 'app/lib/image-sizes'

const GLITCH_BURST_MS = 280
const GLITCH_PAUSE_MS = 200
const GLITCH_TAIL_MS = 140
const GLITCH_BURST_INTENSITY = 18
const GLITCH_TAIL_INTENSITY = 16
const GLITCH_SPEED = 75
const MIN_FPS = 2
const MAX_FPS = 60

type GlitchCoverProps = {
  src: string
  alt: string
  width: number
  height: number
  sizes: string
  quality: number
  priority?: boolean
}

const canGlitch = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

const drawCover = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) => {
  const imageRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = width / height
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = image.naturalWidth
  let sourceHeight = image.naturalHeight

  if (imageRatio > canvasRatio) {
    sourceWidth = image.naturalHeight * canvasRatio
    sourceX = (image.naturalWidth - sourceWidth) / 2
  } else if (imageRatio < canvasRatio) {
    sourceHeight = image.naturalWidth / canvasRatio
    sourceY = (image.naturalHeight - sourceHeight) / 2
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height
  )
}

const paintGlitchFrame = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  intensity: number
) => {
  const { width, height } = context.canvas

  context.clearRect(0, 0, width, height)
  drawCover(context, image, width, height)

  const sliceCount = Math.floor(2 + intensity / 20)

  for (let index = 0; index < sliceCount; index += 1) {
    const sliceY = Math.random() * height
    const sliceHeight = Math.random() * (height / 16) + 1
    const offsetX = (Math.random() - 0.5) * intensity
    const slice = context.getImageData(0, sliceY, width, sliceHeight)
    context.putImageData(slice, offsetX, sliceY)
  }

  if (Math.random() < 0.15) {
    const sliceY = Math.random() * height
    const sliceHeight = Math.random() * (height / 12) + 1
    const slice = context.getImageData(0, sliceY, width, sliceHeight)
    context.globalCompositeOperation = 'lighter'
    context.putImageData(slice, 3, sliceY)
    context.putImageData(slice, -3, sliceY)
    context.globalCompositeOperation = 'source-over'
  }
}

export const GlitchCover = ({
  src,
  alt,
  width,
  height,
  sizes,
  quality,
  priority = false,
}: GlitchCoverProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const group = wrapper?.closest('a') ?? wrapper
    const timeouts: number[] = []

    if (!wrapper || !canvas || !group) {
      return
    }

    const context = canvas.getContext('2d', { willReadFrequently: true })

    if (!context) {
      return
    }

    const getSourceImage = () => wrapper.querySelector('img')

    const sizeCanvas = () => {
      const nextWidth = Math.max(1, Math.round(wrapper.clientWidth))
      const nextHeight = Math.max(1, Math.round(wrapper.clientHeight))

      if (canvas.width !== nextWidth) {
        canvas.width = nextWidth
      }

      if (canvas.height !== nextHeight) {
        canvas.height = nextHeight
      }
    }

    const hideCanvas = () => {
      canvas.removeAttribute('data-glitching')
    }

    const clearTimers = () => {
      cancelAnimationFrame(frameRef.current)
      timeouts.forEach((id) => window.clearTimeout(id))
      timeouts.length = 0
    }

    const stopGlitch = () => {
      clearTimers()
      hideCanvas()
    }

    const schedule = (callback: () => void, delay: number) => {
      timeouts.push(window.setTimeout(callback, delay))
    }

    const runBurst = (
      image: HTMLImageElement,
      durationMs: number,
      intensity: number,
      onDone: () => void
    ) => {
      cancelAnimationFrame(frameRef.current)
      canvas.dataset.glitching = 'true'

      const fps = MIN_FPS + (MAX_FPS - MIN_FPS) * (GLITCH_SPEED / 100)
      const interval = 1000 / fps
      let lastTick = 0

      const tick = (now: number) => {
        if (now - lastTick >= interval) {
          try {
            paintGlitchFrame(context, image, intensity)
          } catch {
            stopGlitch()
            return
          }

          lastTick = now
        }

        frameRef.current = requestAnimationFrame(tick)
      }

      frameRef.current = requestAnimationFrame(tick)
      schedule(() => {
        cancelAnimationFrame(frameRef.current)
        hideCanvas()
        onDone()
      }, durationMs)
    }

    const startGlitch = () => {
      if (!canGlitch()) {
        return
      }

      const image = getSourceImage()

      if (!image || !image.complete || image.naturalWidth === 0) {
        return
      }

      clearTimers()
      sizeCanvas()

      try {
        drawCover(context, image, canvas.width, canvas.height)
      } catch {
        hideCanvas()
        return
      }

      runBurst(image, GLITCH_BURST_MS, GLITCH_BURST_INTENSITY, () => {
        schedule(() => {
          runBurst(
            image,
            GLITCH_TAIL_MS,
            GLITCH_TAIL_INTENSITY,
            hideCanvas
          )
        }, GLITCH_PAUSE_MS)
      })
    }

    const handleEnter = () => {
      startGlitch()
    }

    const handleLeave = () => {
      stopGlitch()
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.currentTarget as HTMLElement).matches(':focus-visible')) {
        return
      }

      startGlitch()
    }

    group.addEventListener('mouseenter', handleEnter)
    group.addEventListener('mouseleave', handleLeave)
    group.addEventListener('focusin', handleFocusIn)
    group.addEventListener('focusout', handleLeave)

    return () => {
      stopGlitch()
      group.removeEventListener('mouseenter', handleEnter)
      group.removeEventListener('mouseleave', handleLeave)
      group.removeEventListener('focusin', handleFocusIn)
      group.removeEventListener('focusout', handleLeave)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`relative aspect-video w-full overflow-hidden ${imagePlaceholderClassName}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        unoptimized
        priority={priority}
        className="h-full w-full rounded-none object-cover"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 data-[glitching]:opacity-100"
      />
    </div>
  )
}
