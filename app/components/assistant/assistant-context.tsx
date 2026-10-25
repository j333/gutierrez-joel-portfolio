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
  pendingQuestion: string
  openAssistant: (source: OpenSource) => void
  closeAssistant: () => void
  setQuotedText: (text: string) => void
  clearPendingQuestion: () => void
  askAboutSelection: (text: string, question: string) => void
}

const AssistantContext = createContext<AssistantContextValue | null>(null)

export const AssistantProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [quotedText, setQuotedText] = useState('')
  const [pendingQuestion, setPendingQuestion] = useState('')
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

  const askAboutSelection = useCallback(
    (text: string, question: string) => {
      setQuotedText(text)
      setPendingQuestion(question)
      openAssistant('selection')
    },
    [openAssistant]
  )

  const clearPendingQuestion = useCallback(() => {
    setPendingQuestion('')
  }, [])

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
      pendingQuestion,
      openAssistant,
      closeAssistant,
      setQuotedText,
      clearPendingQuestion,
      askAboutSelection,
    }),
    [
      askAboutSelection,
      clearPendingQuestion,
      closeAssistant,
      isOpen,
      openAssistant,
      pendingQuestion,
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
