'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, isToolOutputErrorUIPart } from 'ai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useScrambleText } from 'app/hooks/use-scramble-text'
import { ArrowUpRightIcon } from 'app/components/home-action-link'
import { AssistantIcon } from 'app/components/assistant-icon'
import { GlitchCover } from 'app/components/glitch-cover'
import { cardTitleClassName, navTextClassName } from 'app/components/link-styles'
import { Conversation, ConversationContent, ConversationScrollButton } from 'app/components/ai-elements/conversation'
import {
  Message,
  MessageAction,
  MessageContent,
  MessageResponse,
} from 'app/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from 'app/components/ai-elements/prompt-input'
import { Suggestion, Suggestions } from 'app/components/ai-elements/suggestion'
import { Spinner } from 'app/components/ui/spinner'
import type { AssistantUIMessage } from 'app/lib/assistant/agent'
import type { AssistantCatalog } from 'app/lib/assistant/catalog'
import { assistantContact } from 'app/lib/assistant/joel-context'
import { capture } from 'app/lib/capture'
import { localePath, stripLocale, type Locale } from 'app/lib/locale'
import { useAssistant } from './assistant-context'

export type AssistantCopy = {
  title: string
  open: string
  close: string
  restart: string
  placeholder: string
  send: string
  ask: string
  selectionQuestion: string
  quoteLabel: string
  dismissQuote: string
  copyEmail: string
  copied: string
  copy: string
  stop: string
  retry: string
  thinking: string
  scrollToBottom: string
  error: string
  limit: string
  questions: {
    home: readonly string[]
    craft: readonly string[]
    case: readonly string[]
    notes: readonly string[]
    note: readonly string[]
    about: readonly string[]
    experience: readonly string[]
    default: readonly string[]
  }
}

type AssistantPanelProps = {
  locale: Locale
  copy: AssistantCopy
  catalog: AssistantCatalog
}

const fillTitle = (questions: readonly string[], title: string) =>
  questions.map((question) => question.replaceAll('{title}', title))

const questionsForPath = (
  pathname: string,
  catalog: AssistantCatalog,
  questions: AssistantCopy['questions']
) => {
  const path = stripLocale(pathname)

  if (path === '/') {
    return questions.home
  }

  if (path === '/craft') {
    return questions.craft
  }

  if (path === '/about') {
    return questions.about
  }

  if (path === '/notes') {
    return questions.notes
  }

  if (path.startsWith('/notes/')) {
    const note = catalog.notes.find((item) => item.path === path)
    return fillTitle(questions.note, note?.title ?? '')
  }

  if (path.startsWith('/experience/')) {
    const role = catalog.experience.find((item) => item.path === path)
    return fillTitle(questions.experience, role?.title ?? '')
  }

  const caseStudy = catalog.cases.find((item) => item.path === path)

  if (caseStudy) {
    return fillTitle(questions.case, caseStudy.title)
  }

  return questions.default
}

const headerIconButtonClassName =
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm text-neutral-600 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-6 sm:min-w-6 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100'

const assistantTriggerRef = { current: null as HTMLButtonElement | null }

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

const RestartIcon = () => (
  <svg {...iconProps}>
    <path d="M13.5 8a5.5 5.5 0 1 1-1.3-3.8" />
    <path d="M12.2 1.6v2.6H9.6" />
  </svg>
)

const CloseIcon = () => (
  <svg {...iconProps}>
    <path d="M3.5 3.5 12.5 12.5" />
    <path d="M12.5 3.5 3.5 12.5" />
  </svg>
)

const chatTextClassName = 'text-base leading-relaxed'

const responseClassName =
  `${chatTextClassName} text-neutral-800 dark:text-neutral-200 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-black dark:[&_a]:hover:text-white [&_code]:font-mono [&_code]:text-xs [&_li+li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:m-0 [&_p+p]:mt-4 [&_strong]:font-medium [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-4`

const projectCardLinkClassName =
  'group flex flex-col gap-3 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100'

const contactRowClassName =
  'group flex w-full cursor-pointer items-center justify-between gap-3 border-t border-neutral-200 py-3 text-left outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:focus-visible:outline-neutral-100'

const contactLabelClassName =
  'min-w-0 text-sm font-medium leading-5 text-neutral-800 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white'

const transcriptGapClassName = (
  role: AssistantUIMessage['role'],
  previousRole: AssistantUIMessage['role'] | undefined
) => {
  if (!previousRole) {
    return ''
  }

  if (role === 'user') {
    return 'mt-10'
  }

  if (previousRole === 'user') {
    return 'mt-4'
  }

  return 'mt-6'
}

const proseThenCards = (parts: AssistantUIMessage['parts']) => {
  const indexed = parts.map((part, partIndex) => ({ part, partIndex }))

  return [
    ...indexed.filter(({ part }) => part.type === 'text'),
    ...indexed.filter(({ part }) => part.type !== 'text'),
  ]
}

const ProjectToolCard = ({
  slug,
  locale,
  cases,
}: {
  slug: string
  locale: Locale
  cases: AssistantCatalog['cases']
}) => {
  const caseStudy = cases.find((item) => item.slug === slug)

  if (!caseStudy) {
    return null
  }

  const title = caseStudy.title

  return (
    <article>
      <Link
        href={localePath(locale, caseStudy.path)}
        className={projectCardLinkClassName}
      >
        <GlitchCover
          src={`/projects/${caseStudy.slug}/cover.webp`}
          alt={`${title}, ${caseStudy.product}`}
          width={1920}
          height={1080}
          sizes="(min-width: 640px) 352px, 100vw"
          quality={100}
        />
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={`min-w-0 ${cardTitleClassName}`}>{title}</h3>
          <span className="shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
            {caseStudy.product}
          </span>
        </div>
      </Link>
    </article>
  )
}

const ContactToolCard = ({ copy }: { copy: AssistantCopy }) => {
  const [copied, setCopied] = useState(false)
  const resetCopiedRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetCopiedRef.current !== null) {
        window.clearTimeout(resetCopiedRef.current)
      }
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(assistantContact.email)
    } catch {
      return
    }

    setCopied(true)

    if (resetCopiedRef.current !== null) {
      window.clearTimeout(resetCopiedRef.current)
    }

    resetCopiedRef.current = window.setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <article className="border-b border-neutral-200 dark:border-neutral-800">
      <a
        href={assistantContact.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={contactRowClassName}
      >
        <span className={contactLabelClassName}>LinkedIn</span>
        <ArrowUpRightIcon className="shrink-0 text-neutral-500 transition-colors group-hover:text-black dark:text-neutral-400 dark:group-hover:text-white" />
      </a>
      <button
        type="button"
        onClick={handleCopyEmail}
        aria-live="polite"
        className={contactRowClassName}
      >
        <span className={`${contactLabelClassName} truncate`}>{assistantContact.email}</span>
        <span className="shrink-0 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400">
          {copied ? copy.copied : copy.copyEmail}
        </span>
      </button>
    </article>
  )
}

const hasVisiblePart = (message: AssistantUIMessage) =>
  message.parts.some((part) => {
    if (part.type === 'text') {
      return part.text.trim().length > 0
    }

    return part.type === 'tool-showProjectCard' || part.type === 'tool-triggerContactCTA'
  })

const ToolPart = ({
  part,
  locale,
  copy,
  cases,
}: {
  part: AssistantUIMessage['parts'][number]
  locale: Locale
  copy: AssistantCopy
  cases: AssistantCatalog['cases']
}) => {
  if (part.type !== 'tool-showProjectCard' && part.type !== 'tool-triggerContactCTA') {
    return null
  }

  if (isToolOutputErrorUIPart(part)) {
    return (
      <p role="alert" className={`${chatTextClassName} text-neutral-600 dark:text-neutral-400`}>
        {copy.error}
      </p>
    )
  }

  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return (
      <p className="font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500">
        {copy.thinking}
      </p>
    )
  }

  if (part.state !== 'output-available') {
    return null
  }

  if (part.type === 'tool-showProjectCard') {
    return (
      <ProjectToolCard slug={part.output.slug} locale={locale} cases={cases} />
    )
  }

  return <ContactToolCard copy={copy} />
}

export const Assistant = ({ locale, copy, catalog }: AssistantPanelProps) => {
  const pathname = usePathname() ?? localePath(locale, '/')
  const {
    isOpen,
    closeAssistant,
    quotedText,
    setQuotedText,
    pendingQuestion,
    clearPendingQuestion,
  } = useAssistant()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const restoreInputFocusRef = useRef(false)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const seenToolsRef = useRef(new Set<string>())
  const sentPendingRef = useRef('')
  const [input, setInput] = useState('')
  const [sheetFrame, setSheetFrame] = useState({
    mobile: false,
    height: '100dvh',
    frameOffset: '0px',
    frameHeight: '100%',
  })
  const { ref: sendLabelRef, replay: replaySendLabel } = useScrambleText(copy.send, {
    scramble: 5,
  })

  const transport = useMemo(
    () =>
      new DefaultChatTransport<AssistantUIMessage>({
        api: '/api/chat',
        fetch: async (inputRequest, init) => {
          const response = await globalThis.fetch(inputRequest, init)

          if (response.status === 429) {
            throw new Error('rate_limit')
          }

          if (!response.ok) {
            throw new Error('unavailable')
          }

          return response
        },
      }),
    []
  )

  const { messages, sendMessage, setMessages, status, error, stop, regenerate, clearError } =
    useChat<AssistantUIMessage>({
      id: `portfolio-assistant-${locale}`,
      transport,
      throttle: 50,
      onFinish: ({ message, isAbort, isError }) => {
        if (isAbort || isError || message.role !== 'assistant') {
          return
        }

        message.parts.forEach((part) => {
          if (
            (part.type !== 'tool-showProjectCard' && part.type !== 'tool-triggerContactCTA') ||
            part.state !== 'output-available' ||
            seenToolsRef.current.has(part.toolCallId)
          ) {
            return
          }

          seenToolsRef.current.add(part.toolCallId)
          capture('assistant_tool_rendered', {
            tool: part.type === 'tool-showProjectCard' ? 'showProjectCard' : 'triggerContactCTA',
          })
        })
      },
    })

  const suggestions = questionsForPath(pathname, catalog, copy.questions)
  const busy = status === 'submitted' || status === 'streaming'
  const lastMessage = messages.at(-1)
  const waitingForReply =
    status === 'submitted' ||
    (status === 'streaming' && (!lastMessage || lastMessage.role !== 'assistant' || !hasVisiblePart(lastMessage)))
  const errorText = error
    ? error.message.includes('rate_limit')
      ? copy.limit
      : copy.error
    : ''

  const chatBody = (quote: string) => ({
    locale,
    path: pathname,
    ...(quote ? { quotedText: quote } : {}),
  })

  useLayoutEffect(() => {
    if (!restoreInputFocusRef.current || !isOpen) {
      return
    }

    inputRef.current?.focus()

    if (busy || status === 'error') {
      restoreInputFocusRef.current = false
    }
  }, [busy, isOpen, input, status])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      const active = document.activeElement
      restoreFocusRef.current =
        active instanceof HTMLElement && active !== document.body
          ? active
          : assistantTriggerRef.current
      dialog.show()
    }

    if (!isOpen && dialog.open) {
      dialog.close()
      restoreFocusRef.current?.focus()
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    const query = window.matchMedia('(max-width: 639px)')
    const html = document.documentElement
    const { body } = document
    let lockedScrollY = 0
    let locked = false

    const lock = () => {
      if (!query.matches || locked) {
        return
      }

      lockedScrollY = window.scrollY
      html.style.overflow = 'hidden'
      html.style.overscrollBehavior = 'none'
      body.style.position = 'fixed'
      body.style.top = `-${lockedScrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      body.style.overflow = 'hidden'
      locked = true
    }

    const unlock = () => {
      if (!locked) {
        return
      }

      html.style.overflow = ''
      html.style.overscrollBehavior = ''
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      body.style.overflow = ''
      locked = false
      window.scrollTo(0, lockedScrollY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!query.matches) {
        return
      }

      const target = event.target

      if (
        target instanceof Element &&
        target.closest('[data-assistant-transcript], textarea')
      ) {
        return
      }

      event.preventDefault()
    }

    const syncLock = () => {
      if (query.matches) {
        lock()
        return
      }

      unlock()
    }

    syncLock()
    query.addEventListener('change', syncLock)
    document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })

    return () => {
      query.removeEventListener('change', syncLock)
      document.removeEventListener('touchmove', handleTouchMove, { capture: true })
      unlock()
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    const viewport = window.visualViewport
    const mobileQuery = window.matchMedia('(max-width: 639px)')

    if (!viewport) {
      return
    }

    const updateFrame = () => {
      if (!mobileQuery.matches) {
        setSheetFrame({
          mobile: false,
          height: '100dvh',
          frameOffset: '0px',
          frameHeight: '100%',
        })
        return
      }

      const offsetTop = viewport.offsetTop
      const visibleHeight = viewport.height
      const layoutHeight = Math.max(window.innerHeight, document.documentElement.clientHeight)

      setSheetFrame({
        mobile: true,
        height: `${offsetTop + Math.max(visibleHeight, layoutHeight)}px`,
        frameOffset: `${offsetTop}px`,
        frameHeight: `${visibleHeight}px`,
      })
    }

    updateFrame()
    viewport.addEventListener('resize', updateFrame)
    viewport.addEventListener('scroll', updateFrame)
    mobileQuery.addEventListener('change', updateFrame)

    return () => {
      viewport.removeEventListener('resize', updateFrame)
      viewport.removeEventListener('scroll', updateFrame)
      mobileQuery.removeEventListener('change', updateFrame)
    }
  }, [isOpen])

  useEffect(() => {
    if (!pendingQuestion) {
      sentPendingRef.current = ''
      return
    }

    if (sentPendingRef.current === pendingQuestion) {
      return
    }

    sentPendingRef.current = pendingQuestion
    const question = pendingQuestion
    const quote = quotedText
    clearPendingQuestion()
    capture('assistant_message_sent')
    void sendMessage({ text: question }, { body: chatBody(quote) })
  }, [clearPendingQuestion, pendingQuestion, quotedText, sendMessage, locale, pathname])

  const handleSubmit = (message: PromptInputMessage) => {
    const text = (input.trim() || message.text.trim())

    if (!text || busy) {
      return
    }

    capture('assistant_message_sent')
    const quote = quotedText
    restoreInputFocusRef.current = true
    setInput('')
    setQuotedText('')
    void sendMessage({ text }, { body: chatBody(quote) })
  }

  const handleSuggestion = (question: string) => {
    if (busy) {
      return
    }

    capture('assistant_message_sent')
    const quote = quotedText
    setQuotedText('')
    void sendMessage({ text: question }, { body: chatBody(quote) })
  }

  const handleRetry = () => {
    void regenerate({ body: chatBody(quotedText) })
  }

  const handleRestart = () => {
    if (busy) {
      stop()
    }

    setMessages([])
    clearError()
    setInput('')
    setQuotedText('')
    seenToolsRef.current.clear()
    capture('assistant_restarted')
  }

  return (
    <dialog
      ref={dialogRef}
      data-assistant=""
      aria-labelledby="assistant-title"
      style={
        sheetFrame.mobile
          ? ({
              top: 0,
              height: sheetFrame.height,
            } as CSSProperties)
          : undefined
      }
      className="fixed top-0 left-0 z-50 m-0 hidden h-dvh w-full max-h-none max-w-none translate-y-2 flex-col overflow-visible overscroll-none border-0 border-neutral-200 bg-white p-0 text-black opacity-0 transition-discrete open:flex open:translate-y-0 open:opacity-100 motion-safe:transition-[translate,opacity,display] motion-safe:duration-200 motion-safe:ease-out motion-safe:starting:open:translate-y-2 motion-safe:starting:open:opacity-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-dvh sm:w-[400px] sm:translate-x-full sm:translate-y-0 sm:border-l sm:opacity-100 sm:open:translate-x-0 sm:motion-safe:starting:open:translate-x-full sm:motion-safe:starting:open:translate-y-0 sm:motion-safe:starting:open:opacity-100 dark:border-neutral-800 dark:bg-black dark:text-white"
      onClose={closeAssistant}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-full h-dvh bg-white sm:hidden dark:bg-black"
      />
      <div
        className="flex h-full min-h-0 w-full flex-col overflow-hidden"
        style={
          sheetFrame.mobile
            ? { marginTop: sheetFrame.frameOffset, height: sheetFrame.frameHeight, flexShrink: 0 }
            : undefined
        }
      >
      <div className="flex shrink-0 items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center gap-2">
          <AssistantIcon className="size-4 shrink-0 text-black dark:text-white" />
          <h2 id="assistant-title" className="py-1 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500">
            {copy.title}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={handleRestart}
              aria-label={copy.restart}
              className={headerIconButtonClassName}
            >
              <RestartIcon />
            </button>
          ) : null}
          <button
            type="button"
            onClick={closeAssistant}
            aria-label={copy.close}
            className={headerIconButtonClassName}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <Conversation data-assistant-transcript="" className="min-h-0">
        <ConversationContent
          scrollClassName="touch-pan-y overscroll-y-contain"
          className="gap-0 px-4 pt-4 pb-8"
        >
          {messages.map((message, index) => {
              if (!hasVisiblePart(message)) {
                return null
              }

              const isLast = index === messages.length - 1
              const previousVisible = messages.slice(0, index).findLast(hasVisiblePart)
              const gapClassName = transcriptGapClassName(
                message.role,
                previousVisible?.role
              )

              return (
                <Message
                  from={message.role}
                  key={message.id}
                  className={`${message.role === 'assistant' ? 'gap-6' : ''} ${gapClassName}`.trim()}
                >
                  {proseThenCards(message.parts).map(({ part, partIndex }) => {
                    if (part.type === 'text' && part.text) {
                      return message.role === 'assistant' ? (
                        <MessageContent key={`${message.id}-text-${partIndex}`} className={chatTextClassName}>
                          <MessageResponse
                            className={responseClassName}
                            isAnimating={status === 'streaming' && isLast}
                          >
                            {part.text}
                          </MessageResponse>
                        </MessageContent>
                      ) : (
                        <MessageContent key={`${message.id}-text-${partIndex}`} className={chatTextClassName}>
                          <p className={chatTextClassName}>{part.text}</p>
                        </MessageContent>
                      )
                    }

                    return (
                      <ToolPart
                        key={`${message.id}-part-${partIndex}`}
                        part={part}
                        locale={locale}
                        copy={copy}
                        cases={catalog.cases}
                      />
                    )
                  })}
                </Message>
              )
            })}
          {waitingForReply ? (
            <Message from="assistant" className="mt-4">
              <p className="flex items-center gap-2 font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500">
                <Spinner />
                {copy.thinking}
              </p>
            </Message>
          ) : null}
          {errorText ? (
            <div className="mt-6 flex flex-col items-start gap-2">
              <p className={`${chatTextClassName} text-neutral-600 dark:text-neutral-400`}>{errorText}</p>
              <MessageAction
                onClick={handleRetry}
                className="h-auto rounded-none bg-transparent px-0 font-mono text-xs font-normal uppercase tracking-wider text-neutral-500 hover:bg-transparent hover:text-black dark:text-neutral-400 dark:hover:bg-transparent dark:hover:text-white"
              >
                {copy.retry}
              </MessageAction>
            </div>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton
          aria-label={copy.scrollToBottom}
          className="bottom-3"
        />
      </Conversation>
      {messages.length === 0 ? (
        <Suggestions className="shrink-0 px-4 pt-3 pb-4">
          {suggestions.map((question) => (
            <Suggestion
              key={question}
              suggestion={question}
              onClick={handleSuggestion}
              disabled={busy}
            />
          ))}
        </Suggestions>
      ) : null}
      <PromptInput
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-neutral-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-neutral-800"
      >
        <PromptInputBody>
          {quotedText ? (
            <p className="flex items-start justify-between gap-3 border-l border-neutral-300 pl-3 text-sm leading-5 text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
              <span>
                <span className="mb-1 block font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500">
                  {copy.quoteLabel}
                </span>
                {quotedText}
              </span>
              <button
                type="button"
                onClick={() => setQuotedText('')}
                className="cursor-pointer font-mono text-xs uppercase leading-4 tracking-wider text-neutral-500 hover:text-black dark:hover:text-white"
              >
                {copy.dismissQuote}
              </button>
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <PromptInputTextarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
            />
            <PromptInputFooter className="w-full justify-end">
              <PromptInputSubmit
                status={status}
                onStop={() => stop()}
                aria-label={busy ? copy.stop : copy.send}
                onMouseEnter={replaySendLabel}
              >
                {busy ? undefined : <span ref={sendLabelRef}>{copy.send}</span>}
              </PromptInputSubmit>
            </PromptInputFooter>
          </div>
        </PromptInputBody>
      </PromptInput>
      </div>
    </dialog>
  )
}

const assistantTriggerClassName =
  'group relative inline-flex min-h-11 min-w-11 w-fit cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent -mx-1 px-1 py-0.5 outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 aria-expanded:text-black sm:min-h-0 sm:min-w-0 dark:focus-visible:outline-neutral-100 dark:aria-expanded:text-white'

export const AssistantTrigger = ({ label }: { label: string }) => {
  const { isOpen, openAssistant, closeAssistant } = useAssistant()

  const handleToggle = () => {
    if (isOpen) {
      closeAssistant()
      return
    }

    openAssistant('button')
  }

  return (
    <button
      ref={(node) => {
        assistantTriggerRef.current = node
      }}
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      hidden={isOpen}
      onClick={handleToggle}
      className={`${navTextClassName} ${assistantTriggerClassName}`}
    >
      <AssistantIcon className="size-5 shrink-0" />
    </button>
  )
}
