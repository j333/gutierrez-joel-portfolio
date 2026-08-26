'use client'

import { useEffect, useState } from 'react'

const SCROLL_DELTA_THRESHOLD = 8
const TOP_OFFSET = 8

type ScrollNavState = {
  isAwayFromTop: boolean
  isHidden: boolean
}

const initialState: ScrollNavState = {
  isAwayFromTop: false,
  isHidden: false,
}

export const useScrollNavVisibility = (pathname: string) => {
  const [state, setState] = useState<ScrollNavState>(initialState)

  useEffect(() => {
    setState(initialState)

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastScrollY = Math.max(0, window.scrollY)
    let frameId = 0

    const updateVisibility = () => {
      frameId = 0

      if (mediaQuery.matches) {
        setState(initialState)
        return
      }

      const currentScrollY = Math.max(0, window.scrollY)
      const isAwayFromTop = currentScrollY > TOP_OFFSET

      if (!isAwayFromTop) {
        lastScrollY = currentScrollY
        setState(initialState)
        return
      }

      const delta = currentScrollY - lastScrollY

      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) {
        setState((previous) =>
          previous.isAwayFromTop
            ? previous
            : { ...previous, isAwayFromTop: true }
        )
        return
      }

      lastScrollY = currentScrollY
      const isHidden = delta > 0

      setState((previous) => {
        if (
          previous.isAwayFromTop === isAwayFromTop &&
          previous.isHidden === isHidden
        ) {
          return previous
        }

        return { isAwayFromTop, isHidden }
      })
    }

    const handleScroll = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(updateVisibility)
    }

    const handleReducedMotionChange = () => {
      if (mediaQuery.matches) {
        setState(initialState)
      }
    }

    updateVisibility()
    window.addEventListener('scroll', handleScroll, { passive: true })
    mediaQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      mediaQuery.removeEventListener('change', handleReducedMotionChange)

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [pathname])

  return state
}
