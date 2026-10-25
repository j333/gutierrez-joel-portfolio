'use client'

import { Spinner } from 'app/components/ui/spinner'
import { cn } from 'app/lib/utils'
import type { ChatStatus, FileUIPart } from 'ai'
import { SquareIcon } from 'lucide-react'
import type {
  ComponentProps,
  FormEvent,
  FormEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEvent,
} from 'react'
import { useCallback, useState } from 'react'

export type PromptInputMessage = {
  text: string
  files: FileUIPart[]
}

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>
}

export const PromptInput = ({
  className,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault()
      const form = event.currentTarget
      const text = String(new FormData(form).get('message') ?? '')
      onSubmit({ text, files: [] }, event)
    },
    [onSubmit]
  )

  return (
    <form className={cn('w-full', className)} onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  )
}

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>

export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => (
  <div className={cn('flex flex-col gap-3', className)} {...props} />
)

export type PromptInputTextareaProps = ComponentProps<'textarea'>

export const PromptInputTextarea = ({
  onKeyDown,
  className,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const [isComposing, setIsComposing] = useState(false)

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onKeyDown?.(event)

      if (event.defaultPrevented) {
        return
      }

      if (event.key !== 'Enter' || event.shiftKey) {
        return
      }

      if (isComposing || event.nativeEvent.isComposing) {
        return
      }

      event.preventDefault()
      const submitButton = event.currentTarget.form?.querySelector(
        'button[type="submit"]'
      )

      if (submitButton instanceof HTMLButtonElement && submitButton.disabled) {
        return
      }

      event.currentTarget.form?.requestSubmit()
    },
    [isComposing, onKeyDown]
  )

  return (
    <textarea
      className={cn(
        'field-sizing-content max-h-[200px] min-h-[56px] w-full resize-none overflow-y-auto bg-transparent py-2 text-base leading-relaxed text-neutral-800 outline-none placeholder:text-neutral-500 disabled:opacity-40 dark:text-neutral-200 dark:placeholder:text-neutral-400',
        className
      )}
      name="message"
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={2}
      {...props}
    />
  )
}

export type PromptInputFooterProps = HTMLAttributes<HTMLDivElement>

export const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => (
  <div className={cn('flex items-end gap-3', className)} {...props} />
)

export type PromptInputSubmitProps = ComponentProps<'button'> & {
  status?: ChatStatus
  onStop?: () => void
}

export const PromptInputSubmit = ({
  className,
  status,
  onStop,
  onClick,
  children,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === 'submitted' || status === 'streaming'

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isGenerating && onStop) {
        event.preventDefault()
        onStop()
        return
      }

      onClick?.(event)
    },
    [isGenerating, onClick, onStop]
  )

  return (
    <button
      className={cn(
        'cursor-pointer font-mono text-xs uppercase leading-4 tracking-wider text-neutral-900 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-40 dark:text-neutral-100 dark:hover:text-white dark:focus-visible:outline-neutral-100',
        className
      )}
      onClick={handleClick}
      type={isGenerating && onStop ? 'button' : 'submit'}
      {...props}
    >
      {children ??
        (status === 'submitted' ? (
          <Spinner />
        ) : status === 'streaming' ? (
          <SquareIcon className="size-3.5" />
        ) : null)}
    </button>
  )
}
