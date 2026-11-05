'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { capture } from 'app/lib/capture'

type OpenSource = 'shortcut' | 'button' | 'selection'

type AssistantContextValue = {
  isOpen: boolean
  quotedText: string
  composerRequest: number
  openAssistant: (source: OpenSource) => void
  closeAssistant: () => void
  setQuotedText: (text: string) => void
  attachSelection: (text: string, focusComposer: boolean) => void
}

const AssistantContext = createContext<AssistantContextValue | null>(null)

export const AssistantProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [quotedText, setQuotedText] = useState('')
  const [composerRequest, setComposerRequest] = useState(0)
  const isOpenRef = useRef(false)

  const openAssistant = useCallback((source: OpenSource) => {
    if (!isOpenRef.current) {
      capture('assistant_opened', { source })
    }

    isOpenRef.current = true
    setIsOpen(true)
  }, [])

  const closeAssistant = useCallback(() => {
    isOpenRef.current = false
    setIsOpen(false)
  }, [])

  const attachSelection = useCallback(
    (text: string, focusComposer: boolean) => {
      setQuotedText(text)

      if (focusComposer) {
        setComposerRequest((request) => request + 1)
      }

      openAssistant('selection')
    },
    [openAssistant]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const toggle =
        event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)

      if (toggle) {
        event.preventDefault()

        if (isOpenRef.current) {
          closeAssistant()
          return
        }

        openAssistant('shortcut')
        return
      }

      if (event.key === 'Escape' && isOpenRef.current) {
        closeAssistant()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeAssistant, openAssistant])

  const value = useMemo(
    () => ({
      isOpen,
      quotedText,
      composerRequest,
      openAssistant,
      closeAssistant,
      setQuotedText,
      attachSelection,
    }),
    [
      attachSelection,
      closeAssistant,
      composerRequest,
      isOpen,
      openAssistant,
      quotedText,
    ]
  )

  return (
    <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
  )
}

export const useAssistant = () => {
  const value = useContext(AssistantContext)

  if (!value) {
    throw new Error('useAssistant must be used within AssistantProvider')
  }

  return value
}
