'use client'

import { useEffect, useMemo, useState } from 'react'
import { metaLabelClassName } from 'app/components/page-layout'
import {
  DESIGN_CHAPTERS,
  type DesignChapter,
} from 'app/lib/design-chapters'
import { cx } from 'app/lib/cx'

export type DesignSectionNavItem = {
  id: string
  title: string
}

type DesignSectionNavProps = {
  sections: DesignSectionNavItem[]
}

type NavChapter = {
  chapter: DesignChapter
  sections: DesignSectionNavItem[]
}

const chapterLinkClassName =
  'inline-flex min-h-11 w-fit items-center rounded-sm py-1 text-sm font-medium leading-5 outline-none transition-colors hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:focus-visible:outline-neutral-100'

const subsectionLinkClassName =
  'inline-flex min-h-11 w-fit items-center rounded-sm py-1 text-sm leading-5 outline-none transition-colors hover:text-neutral-900 hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-0 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (!element) {
    return
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

export const DesignSectionNav = ({ sections }: DesignSectionNavProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  const chapters = useMemo((): NavChapter[] => {
    const byId = new Map(sections.map((section) => [section.id, section]))

    return DESIGN_CHAPTERS.map((chapter) => ({
      chapter,
      sections: chapter.sectionIds
        .map((id) => byId.get(id) ?? null)
        .filter((section): section is DesignSectionNavItem => section !== null),
    })).filter((group) => group.sections.length > 0)
  }, [sections])

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

    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (hash && sectionIds.includes(hash)) {
        setActiveId(hash)
      }
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    window.addEventListener('popstate', syncFromHash)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', syncFromHash)
      window.removeEventListener('popstate', syncFromHash)
    }
  }, [sections])

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault()
    setActiveId(id)
    scrollToSection(id)
    window.history.pushState(null, '', `#${id}`)
  }

  return (
    <nav
      aria-label="On this page"
      className="border-b border-neutral-200 pb-6 dark:border-neutral-800 lg:sticky lg:top-20 lg:self-start lg:border-b-0 lg:pb-0"
    >
      <p className={`${metaLabelClassName} mb-4`}>On this page</p>
      <ol className="m-0 flex list-none flex-col gap-5 p-0">
        {chapters.map(({ chapter, sections: chapterSections }) => {
          const hasSubsections = chapterSections.length > 1
          const soleSection = chapterSections[0]

          if (!hasSubsections && soleSection) {
            const isActive = soleSection.id === activeId

            return (
              <li key={chapter.id} className="min-w-0">
                <a
                  href={`#${soleSection.id}`}
                  onClick={(event) => handleNavClick(event, soleSection.id)}
                  className={cx(
                    chapterLinkClassName,
                    isActive
                      ? 'text-neutral-900 underline dark:text-neutral-100'
                      : 'text-neutral-800 dark:text-neutral-200'
                  )}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {chapter.label}
                </a>
              </li>
            )
          }

          const firstSection = chapterSections[0]
          const isChapterActive = chapterSections.some(
            (section) => section.id === activeId
          )

          return (
            <li key={chapter.id} className="min-w-0">
              {firstSection ? (
                <a
                  href={`#${firstSection.id}`}
                  onClick={(event) => handleNavClick(event, firstSection.id)}
                  className={cx(
                    chapterLinkClassName,
                    'mb-1',
                    isChapterActive
                      ? 'text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-800 dark:text-neutral-200'
                  )}
                >
                  {chapter.label}
                </a>
              ) : (
                <p className="mb-1 text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200">
                  {chapter.label}
                </p>
              )}
              <ol className="m-0 flex list-none flex-col gap-0.5 border-l border-neutral-200 py-0.5 pl-3 dark:border-neutral-800">
                {chapterSections.map((section) => {
                  const isActive = section.id === activeId

                  return (
                    <li key={section.id} className="min-w-0">
                      <a
                        href={`#${section.id}`}
                        onClick={(event) => handleNavClick(event, section.id)}
                        className={cx(
                          subsectionLinkClassName,
                          isActive
                            ? 'text-neutral-900 underline dark:text-neutral-100'
                            : 'text-neutral-500 dark:text-neutral-400'
                        )}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        {section.title}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
