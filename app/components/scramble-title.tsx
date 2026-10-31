'use client'

import { useEffect } from 'react'
import { useScrambleText } from 'app/hooks/use-scramble-text'
import { cx } from 'app/lib/cx'

type ScrambleTitleProps = {
  text: string
  className?: string
}

export const ScrambleTitle = ({ text, className }: ScrambleTitleProps) => {
  const { ref, replay } = useScrambleText(text, {
    scramble: 5,
    maxFrames: 36,
  })

  useEffect(() => {
    const link = ref.current?.closest('a')

    if (!link) {
      return
    }

    link.addEventListener('mouseenter', replay)

    return () => {
      link.removeEventListener('mouseenter', replay)
    }
  }, [ref, replay])

  return (
    <span className={cx('relative', className)}>
      <span className="invisible select-none" aria-hidden="true">
        {text}
      </span>
      <span ref={ref} className="absolute inset-0 overflow-hidden">
        {text}
      </span>
    </span>
  )
}
