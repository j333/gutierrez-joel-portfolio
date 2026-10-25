'use client'

import { useEffect, useState } from 'react'
import { useAssistant } from './assistant-context'

type TooltipState = {
  text: string
  top: number
  left: number
}

const selectionText = () => {
  const selection = window.getSelection()

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null
  }

  const text = selection.toString().trim()

  if (text.length <= 15) {
    return null
  }

  const node = selection.anchorNode

  if (node instanceof Element && node.closest('[data-assistant]')) {
    return null
  }

  if (node?.parentElement?.closest('[data-assistant]')) {
    return null
  }

  const rect = selection.getRangeAt(0).getBoundingClientRect()

  if (rect.width === 0 && rect.height === 0) {
    return null
  }

  return {
    text,
    top: rect.bottom + 8,
    left: Math.min(rect.left, window.innerWidth - 160),
  }
}

export const TextSelectionTooltip = ({
  label,
  question,
}: {
  label: string
  question: string
}) => {
  const { askAboutSelection } = useAssistant()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    const show = (event: Event) => {
      const target = event.target

      if (target instanceof Element && target.closest('[data-selection-tooltip]')) {
        return
      }

      setTooltip(selectionText())
    }

    const hide = (event: Event) => {
      const target = event.target

      if (target instanceof Element && target.closest('[data-selection-tooltip]')) {
        return
      }

      setTooltip(null)
    }

    const hideOnScroll = () => {
      setTooltip(null)
    }

    document.addEventListener('pointerup', show)
    document.addEventListener('keyup', show)
    document.addEventListener('pointerdown', hide)
    window.addEventListener('scroll', hideOnScroll, true)

    return () => {
      document.removeEventListener('pointerup', show)
      document.removeEventListener('keyup', show)
      document.removeEventListener('pointerdown', hide)
      window.removeEventListener('scroll', hideOnScroll, true)
    }
  }, [])

  if (!tooltip) {
    return null
  }

  const handleAsk = () => {
    askAboutSelection(tooltip.text, question)
    setTooltip(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <button
      type="button"
      data-assistant=""
      data-selection-tooltip=""
      onClick={handleAsk}
      style={{ top: tooltip.top, left: tooltip.left }}
      className="fixed z-50 bg-white px-2 py-2 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-900 hover:text-black dark:bg-black dark:text-neutral-100 dark:hover:text-white"
    >
      {label}
    </button>
  )
}
