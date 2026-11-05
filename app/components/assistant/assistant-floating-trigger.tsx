'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { AssistantOrb } from './assistant-orb'
import { useAssistant } from './assistant-context'
import { rememberAssistantTrigger } from './assistant-panel'

const GREETING_DELAY_MS = 3000

const shellClassName =
  'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 sm:right-6'

const triggerClassName =
  'relative size-20 cursor-pointer overflow-hidden rounded-sm bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 lg:size-28 dark:focus-visible:outline-neutral-100'

const greetingClassName =
  'pointer-events-none absolute top-1/2 right-full -translate-y-1/2 whitespace-nowrap rounded-sm bg-white py-1 pl-2 text-sm leading-5 text-neutral-800 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 dark:bg-black dark:text-neutral-200'

export const AssistantFloatingTrigger = ({ label }: { label: string }) => {
  const { isOpen, openAssistant } = useAssistant()
  const [showGreeting, setShowGreeting] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowGreeting(true)
    }, GREETING_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    setDismissed(true)
  }, [isOpen])

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    rememberAssistantTrigger(event.currentTarget)
    openAssistant('button')
  }

  const greetingVisible = showGreeting && !dismissed && !isOpen

  return (
    <div className={shellClassName} hidden={isOpen}>
      {greetingVisible ? (
        <p className={greetingClassName} role="status">
          hey there! 👋
        </p>
      ) : null}
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleOpen}
        className={triggerClassName}
      >
        <span
          aria-hidden
          className="absolute inset-[15%] rounded-full bg-white dark:bg-black"
        />
        <AssistantOrb className="relative block size-full" />
      </button>
    </div>
  )
}
