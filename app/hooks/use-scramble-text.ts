'use client'

import { useCallback, useEffect, useRef } from 'react'

const SCRAMBLE_GLYPHS = ['/', '0', '_', 'x'] as const

type UseScrambleTextOptions = {
  scramble?: number
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
  { scramble = 3 }: UseScrambleTextOptions = {}
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

      if (scrambleCount >= scramble) {
        scrambleCount = 0
        position += 1
      }

      if (position > chars.length) {
        setNodeText(text)
        return
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [scramble, text])

  return { ref: nodeRef, replay }
}
