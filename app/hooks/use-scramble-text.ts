'use client'

import { useCallback, useEffect, useRef } from 'react'

const SCRAMBLE_GLYPHS = ['/', '0', '-', 'x'] as const

type UseScrambleTextOptions = {
  scramble?: number
  maxFrames?: number
}

const resolveTiming = (
  length: number,
  scramble: number,
  maxFrames?: number
) => {
  if (!maxFrames || length === 0) {
    return { framesPerStep: scramble, step: 1 }
  }

  const framesPerStep = Math.max(
    1,
    Math.min(scramble, Math.floor(maxFrames / length))
  )
  const step = Math.max(1, Math.ceil(length / maxFrames))

  return { framesPerStep, step }
}

const canScramble = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export const useScrambleText = (
  text: string,
  { scramble = 1, maxFrames }: UseScrambleTextOptions = {}
) => {
  const nodeRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef(0)

  const setNodeText = (value: string) => {
    const node = nodeRef.current

    if (node) {
      node.textContent = value
    }
  }

  useEffect(() => {
    setNodeText(text)

    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [text])

  const replay = useCallback(() => {
    if (!canScramble()) {
      setNodeText(text)
      return
    }

    cancelAnimationFrame(frameRef.current)

    const chars = Array.from(text)
    const { framesPerStep, step } = resolveTiming(
      chars.length,
      scramble,
      maxFrames
    )
    let position = 0
    let scrambleCount = 0

    const tick = () => {
      const next = chars
        .map((char, index) => {
          if (char === ' ' || index < position) {
            return char
          }

          return SCRAMBLE_GLYPHS[
            Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
          ]
        })
        .join('')

      setNodeText(next)

      scrambleCount += 1

      if (scrambleCount >= framesPerStep) {
        scrambleCount = 0
        position += step
      }

      if (position > chars.length) {
        setNodeText(text)
        return
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [maxFrames, scramble, text])

  return { ref: nodeRef, replay }
}
