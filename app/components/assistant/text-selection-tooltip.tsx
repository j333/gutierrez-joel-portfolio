'use client'

import { useEffect, useState } from 'react'
import { useAssistant } from './assistant-context'

type TooltipState = {
  text: string
  top: number
  left: number
}

const selectionHighlightName = 'assistant-selection'

let activeRange: Range | null = null
let highlightVisible = false
let resizeObserver: ResizeObserver | null = null

const selectionLayer = () => {
  const existing = document.querySelector('[data-assistant-selection-layer]')

  if (existing instanceof HTMLElement) {
    return existing
  }

  const layer = document.createElement('div')
  layer.dataset.assistantSelectionLayer = ''
  layer.setAttribute('aria-hidden', 'true')
  layer.className = 'pointer-events-none absolute inset-0 z-[-1]'
  document.body.appendChild(layer)

  return layer
}

const caretElement = (x: number, y: number) => {
  const position = document.caretPositionFromPoint?.(x, y)
  const node = position?.offsetNode ?? document.caretRangeFromPoint?.(x, y)?.startContainer

  if (!node) {
    return null
  }

  return node instanceof Element ? node : node.parentElement
}

const paintSelection = () => {
  const layer = selectionLayer()
  layer.replaceChildren()

  if (!highlightVisible || !activeRange) {
    return
  }

  const fallback = activeRange.startContainer instanceof Element
    ? activeRange.startContainer
    : activeRange.startContainer.parentElement
  const rects = [...activeRange.getClientRects()].filter((rect) => rect.width > 1 && rect.height > 0)

  rects.forEach((rect) => {
    const hit = caretElement(
      Math.min(window.innerWidth - 2, Math.max(1, rect.left + 2)),
      Math.min(window.innerHeight - 2, Math.max(1, rect.top + rect.height / 2))
    )
    const source = hit && !hit.closest('[data-assistant]') ? hit : fallback
    const lineHeight = source ? Number.parseFloat(getComputedStyle(source).lineHeight) : Number.NaN
    const height = Number.isFinite(lineHeight) ? Math.max(rect.height, lineHeight) : rect.height
    const top = rect.top - (height - rect.height) / 2
    const mark = document.createElement('span')
    mark.dataset.assistantSelectionBox = ''
    mark.className = 'absolute bg-black dark:bg-white'
    mark.style.top = `${top + window.scrollY}px`
    mark.style.left = `${rect.left + window.scrollX}px`
    mark.style.width = `${rect.width}px`
    mark.style.height = `${height}px`
    layer.appendChild(mark)
  })
}

const watchSelectionLayout = () => {
  resizeObserver?.disconnect()

  if (!highlightVisible || !activeRange) {
    return
  }

  resizeObserver = new ResizeObserver(() => paintSelection())
  const shell = document.querySelector('[data-assistant-open]')
  const node = activeRange.commonAncestorContainer
  const element = node instanceof Element ? node : node.parentElement

  if (shell) {
    resizeObserver.observe(shell)
  }

  if (element) {
    resizeObserver.observe(element)
  }
}

const showSelectionHighlight = () => {
  const selection = window.getSelection()
  const source = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  if (!source || !('Highlight' in window) || !CSS.highlights) {
    return
  }

  activeRange = source.cloneRange()
  highlightVisible = true
  CSS.highlights.set(selectionHighlightName, new Highlight(activeRange))
  paintSelection()
  watchSelectionLayout()
  window.requestAnimationFrame(paintSelection)
}

const clearSelectionHighlight = () => {
  highlightVisible = false
  activeRange = null
  CSS.highlights?.delete(selectionHighlightName)
  resizeObserver?.disconnect()
  document.querySelector('[data-assistant-selection-layer]')?.replaceChildren()
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
    left: Math.max(16, Math.min(rect.left, window.innerWidth - 288)),
  }
}

export const TextSelectionTooltip = ({
  label,
}: {
  label: string
}) => {
  const { attachSelection, isOpen, quotedText, setQuotedText } = useAssistant()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    if (quotedText) {
      return
    }

    clearSelectionHighlight()
  }, [quotedText])

  useEffect(() => () => clearSelectionHighlight(), [])

  useEffect(() => {
    const show = (event: Event) => {
      const target = event.target

      if (target instanceof Element && target.closest('[data-selection-tooltip]')) {
        return
      }

      const selection = selectionText()

      if (!selection) {
        setTooltip(null)
        return
      }

      if (isOpen) {
        showSelectionHighlight()
        attachSelection(selection.text, false)
        setTooltip(null)
        window.getSelection()?.removeAllRanges()
        return
      }

      setTooltip(selection)
    }

    const hide = (event: Event) => {
      const target = event.target
      const insideAssistant = target instanceof Element && target.closest('[data-assistant]')

      if (target instanceof Element && target.closest('[data-selection-tooltip]')) {
        return
      }

      if (!insideAssistant && highlightVisible) {
        clearSelectionHighlight()
        setQuotedText('')
      }

      setTooltip(null)
    }

    const hideOnScroll = () => {
      setTooltip(null)
    }

    document.addEventListener('pointerup', show)
    document.addEventListener('keyup', show)
    document.addEventListener('pointerdown', hide, true)
    window.addEventListener('scroll', hideOnScroll, true)

    return () => {
      document.removeEventListener('pointerup', show)
      document.removeEventListener('keyup', show)
      document.removeEventListener('pointerdown', hide, true)
      window.removeEventListener('scroll', hideOnScroll, true)
    }
  }, [attachSelection, isOpen, setQuotedText])

  if (!tooltip) {
    return null
  }

  const handleAsk = () => {
    showSelectionHighlight()
    attachSelection(tooltip.text, true)
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
      className="fixed z-50 min-h-11 max-w-[calc(100vw-2rem)] cursor-pointer rounded-sm bg-black px-3 py-2 text-left font-mono text-xs uppercase leading-4 tracking-wider text-white outline-none transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:focus-visible:outline-neutral-100"
    >
      {label}
    </button>
  )
}
