export type DesignChapter = {
  id: string
  label: string
  sectionIds: string[]
  /** Shown under the chapter title only when there are multiple subsections. */
  description?: string
}

/** View-only grouping for `/design`. Markdown H2s stay flat. */
export const DESIGN_CHAPTERS: DesignChapter[] = [
  { id: 'foundations', label: 'Foundations', sectionIds: ['principles'] },
  {
    id: 'color',
    label: 'Color',
    sectionIds: ['palette', 'roles'],
    description:
      'A monochrome scale. Each role has a pair for light and dark.',
  },
  {
    id: 'type',
    label: 'Type',
    sectionIds: ['faces', 'scale', 'weights'],
    description:
      'IBM Plex Sans for reading, IBM Plex Mono for chrome. Each size has one job.',
  },
  {
    id: 'space',
    label: 'Space',
    sectionIds: ['layout', 'spacing', 'elevation-and-shape'],
    description:
      'A wide shell, a focused reading column, and the flat shapes that keep the interface quiet.',
  },
  { id: 'interaction', label: 'Interaction', sectionIds: ['interaction'] },
  {
    id: 'components',
    label: 'Components',
    sectionIds: [
      'buttons',
      'chrome-link',
      'content-link',
      'cta-link',
      'image-overlay',
      'page-header-and-meta',
      'project-writing-card',
      'theme-toggle',
    ],
    description:
      'Links do most of the work. Buttons appear only when the action stays on the page.',
  },
  {
    id: 'guardrails',
    label: 'Guardrails',
    sectionIds: ['dos-and-donts'],
  },
]

export const getChapterForSectionId = (sectionId: string) =>
  DESIGN_CHAPTERS.find((chapter) => chapter.sectionIds.includes(sectionId)) ??
  null

/** Public hash for a content section. Sole chapters use the chapter title id. */
export const getSectionAnchorId = (sectionId: string) => {
  const chapter = getChapterForSectionId(sectionId)
  if (chapter && chapter.sectionIds.length === 1) {
    return chapter.id
  }
  return sectionId
}

export const getDesignNavAnchorIds = (sectionIds: string[]) => {
  const ids = new Set<string>()

  for (const sectionId of sectionIds) {
    const chapter = getChapterForSectionId(sectionId)
    if (chapter) {
      ids.add(chapter.id)
    }
    ids.add(getSectionAnchorId(sectionId))
  }

  return [...ids]
}

export const isChapterLeadSection = (sectionId: string) => {
  const chapter = getChapterForSectionId(sectionId)
  return chapter?.sectionIds[0] === sectionId
}
