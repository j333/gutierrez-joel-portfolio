'use client'

import type { MouseEvent } from 'react'
import { AssistantOrb } from './assistant-orb'
import { useAssistant } from './assistant-context'
import { rememberAssistantTrigger } from './assistant-panel'

const triggerClassName =
  'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 size-20 cursor-pointer overflow-hidden rounded-sm bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:right-6 dark:focus-visible:outline-neutral-100'

export const AssistantFloatingTrigger = ({ label }: { label: string }) => {
  const { isOpen, openAssistant } = useAssistant()

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    rememberAssistantTrigger(event.currentTarget)
    openAssistant('button')
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      hidden={isOpen}
      onClick={handleOpen}
      className={triggerClassName}
    >
      <AssistantOrb className="block size-full" />
    </button>
  )
}
