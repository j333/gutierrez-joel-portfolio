'use client'

import type { ReactNode } from 'react'
import { useAssistant } from './assistant-context'

const shellClassName =
  'flex min-h-dvh w-full flex-col gap-2 px-4 pb-[max(7.5rem,calc(6.5rem+env(safe-area-inset-bottom)))] motion-safe:transition-[padding-right,padding-bottom] motion-safe:duration-200 motion-safe:ease-out data-[assistant-open=true]:pb-[max(2.5rem,calc(1rem+env(safe-area-inset-bottom)))] sm:px-6 sm:data-[assistant-open=true]:pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] lg:data-[assistant-open=true]:pr-[calc(400px+1.5rem)]'

export const AssistantShell = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useAssistant()

  return (
    <div data-assistant-open={isOpen ? 'true' : 'false'} className={shellClassName}>
      {children}
    </div>
  )
}
