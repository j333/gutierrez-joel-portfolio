'use client'

import type { ReactNode } from 'react'
import { useAssistant } from './assistant-context'

const shellClassName =
  'flex min-h-dvh w-full flex-col gap-2 px-4 pb-[max(2.5rem,calc(1rem+env(safe-area-inset-bottom)))] motion-safe:transition-[padding-right] motion-safe:duration-200 motion-safe:ease-out sm:px-6 sm:pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] lg:data-[assistant-open=true]:pr-[calc(400px+1.5rem)]'

export const AssistantShell = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useAssistant()

  return (
    <div data-assistant-open={isOpen ? 'true' : 'false'} className={shellClassName}>
      {children}
    </div>
  )
}
