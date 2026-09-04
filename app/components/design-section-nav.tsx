'use client'

import { useEffect, useState } from 'react'
import { metaLabelClassName } from 'app/components/page-layout'
import { cx } from 'app/lib/cx'

export type DesignSectionNavItem = {
  id: string
  title: string
}

type DesignSectionNavProps = {
  sections: DesignSectionNavItem[]
}

const navLinkClassName =
  'group inline-flex min-h-11 w-fit items-baseline rounded-sm px-1 py-1 font-mono text-xs leading-4 outline-none transition-colors hover:text-neutral-900 hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100'

export const DesignSectionNav = ({ sections }: DesignSectionNavProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    if (sections.length === 0) {
      return
    }

    const sectionIds = sections.map((section) => section.id)
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        )

      if (visible[0]?.target.id) {
        setActiveId(visible[0].target.id)
      }
    }

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5],
    })

    elements.forEach((element) => {
      observer.observe(element)
    })

    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (hash && sectionIds.includes(hash)) {
        setActiveId(hash)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [sections])

  return (
    <nav
      aria-label="On this page"
      className="border-b border-neutral-200 pb-6 dark:border-neutral-800 lg:sticky lg:top-20 lg:self-start lg:border-b-0 lg:pb-0"
    >
      <p className={`${metaLabelClassName} mb-3`}>On this page</p>
      <ol className="m-0 flex list-none flex-wrap gap-x-1 gap-y-1 p-0 lg:flex-col">
        {sections.map((section, index) => {
          const isActive = section.id === activeId
          const number = String(index + 1).padStart(2, '0')

          return (
            <li key={section.id} className="flex min-w-0 items-center">
              <a
                href={`#${section.id}`}
                className={cx(
                  navLinkClassName,
                  isActive
                    ? 'text-neutral-900 underline dark:text-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-400'
                )}
                aria-current={isActive ? 'location' : undefined}
              >
                <span
                  className={cx(
                    'shrink-0 tabular-nums tracking-wider',
                    isActive
                      ? 'text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {number}
                </span>
                <span className="ml-2 font-sans text-sm leading-5 tracking-normal">
                  {section.title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
