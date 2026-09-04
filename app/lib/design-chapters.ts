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
    sectionIds: ['palette', 'color'],
    description:
      'A monochrome scale and the semantic roles that map onto it in light and dark.',
  },
  {
    id: 'type',
    label: 'Type',
    sectionIds: ['faces', 'scale', 'weights'],
    description:
      'IBM Plex Sans for reading; IBM Plex Mono for chrome. One size, one job.',
  },
  {
    id: 'space',
    label: 'Space',
    sectionIds: ['layout', 'spacing', 'elevation-and-shape'],
    description:
      'Shell width, vertical rhythm, and the flat shapes that keep the interface quiet.',
  },
  { id: 'interaction', label: 'Interaction', sectionIds: ['interaction'] },
  {
    id: 'components',
    label: 'Components',
    sectionIds: ['components', 'buttons'],
    description:
      'Text-forward primitives and the three-button kit for non-navigating actions.',
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

export const isChapterLeadSection = (sectionId: string) => {
  const chapter = getChapterForSectionId(sectionId)
  return chapter?.sectionIds[0] === sectionId
}
