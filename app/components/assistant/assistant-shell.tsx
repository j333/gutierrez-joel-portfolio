'use client'

import type { ReactNode } from 'react'
import { useAssistant } from './assistant-context'

// The page frame is the width responsive rules measure. Closed, it is the
// viewport. From `sm` to `lg` the open panel covers the page. From `lg` up it
// takes 400px, and the frame is the screen left of it.
const frameClassName =
  '@container/page flex min-h-dvh w-full min-w-0 flex-col motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-out lg:data-[assistant-open=true]:w-[calc(100%-400px)]'

const columnClassName =
  'flex min-h-dvh w-full min-w-0 flex-col gap-2 px-4 pb-[max(7.5rem,calc(6.5rem+env(safe-area-inset-bottom)))] motion-safe:transition-[padding-bottom] motion-safe:duration-200 motion-safe:ease-out data-[assistant-open=true]:pb-[max(2.5rem,calc(1rem+env(safe-area-inset-bottom)))] @min-[40rem]/page:px-6 sm:data-[assistant-open=true]:pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] lg:pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))]'

export const AssistantShell = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useAssistant()
  const open = isOpen ? 'true' : 'false'

  return (
    <div data-page-frame="" data-assistant-open={open} className={frameClassName}>
      <div data-assistant-open={open} className={columnClassName}>
        {children}
      </div>
    </div>
  )
}
