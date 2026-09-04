import {
  type DesignRule,
  type DesignTable,
  stripMarkdownInline,
} from 'app/lib/design-rule'

type GuideSectionCopy = {
  lead?: string
  body?: string
  items?: string[]
  remapTables?: (tables: DesignTable[]) => DesignTable[]
}

const listMarkdown = (items: string[]) =>
  items.map((item) => `- ${item}`).join('\n')

const headerIndex = (table: DesignTable, name: string) =>
  table.headers.findIndex(
    (header) => header.toLowerCase() === name.toLowerCase()
  )

const replaceColumnByRow = (
  table: DesignTable,
  rowHeader: string,
  columnHeader: string,
  replacements: Record<string, string>
): DesignTable => {
  const rowIndex = headerIndex(table, rowHeader)
  const columnIndex = headerIndex(table, columnHeader)
  if (rowIndex === -1 || columnIndex === -1) {
    return table
  }

  return {
    ...table,
    rows: table.rows.map((row) => {
      const key = stripMarkdownInline(row[rowIndex] ?? '')
      const next = replacements[key]
      if (!next) {
        return row
      }

      const copy = [...row]
      copy[columnIndex] = next
      return copy
    }),
  }
}

const remapMatchingTable = (
  tables: DesignTable[],
  requiredHeaders: string[],
  remap: (table: DesignTable) => DesignTable
) =>
  tables.map((table) => {
    const headers = table.headers.map((value) => value.toLowerCase())
    const matches = requiredHeaders.every((header) =>
      headers.includes(header.toLowerCase())
    )
    return matches ? remap(table) : table
  })

const DESIGN_GUIDE_INTRO = [
  'Spare, editorial portfolio. Craft over decoration. Hierarchy comes from contrast, typography, and whitespace — not shadows, gradients, or chrome noise.',
  'This page is the visual language of the site: how color, type, space, and interaction stay quiet in light and dark.',
].join('\n\n')

const DESIGN_GUIDE_SECTIONS: Record<string, GuideSectionCopy> = {
  principles: {
    lead: 'Quiet craft. Hierarchy from type, contrast, and space — not decoration.',
    items: [
      'Light canvas, dark ink (and the inverse in dark mode)',
      'Quiet interaction: underline, color shift, focus outline',
      'Generous space; content-led layouts',
      'Flat UI plus a subtle paper grain; no drop shadows',
      'Imagery and type carry personality; chrome stays light',
    ],
  },
  palette: {
    lead: 'The scale runs from 0, the lightest, to 100, the darkest. The interface stays on white, black, and Neutral.',
    body: '',
    remapTables: (tables) =>
      remapMatchingTable(tables, ['Step', 'Class', 'Notes'], (table) =>
        replaceColumnByRow(table, 'Step', 'Notes', {
          '0': 'Canvas in light; ink in dark',
          '5': 'Code surface in light',
          '10': 'Image placeholder in light',
          '20': 'Borders and dividers in light',
          '30': 'Stronger table rules in light',
          '40': 'Muted text in dark',
          '50': 'Meta, footer, and muted text in light',
          '60': 'Secondary text in light; strong border in dark',
          '70': 'Quotes and rules in dark',
          '80': 'Body in light; borders in dark',
          '90': 'Titles, focus, and placeholders in dark',
          '95': 'A rarer step, darker than 90',
          '100': 'Ink in light; canvas in dark',
        })
      ),
  },
  color: {
    lead: 'Every role in the interface has a pair: one value for light, one for dark.',
    body: 'Code highlighting uses its own colors. If a form ever needs an error, it uses red — never as a brand color.',
  },
  faces: {
    lead: 'IBM Plex Sans for reading; IBM Plex Mono for chrome and metadata.',
    body: '',
  },
  scale: {
    lead: 'One size, one job. Color shifts the voice — body, secondary, or muted — without inventing a new style. Titles stay light.',
    body: '',
    remapTables: (tables) =>
      remapMatchingTable(tables, ['Use', 'Classes'], (table) => {
        const useIndex = headerIndex(table, 'Use')
        const classesIndex = headerIndex(table, 'Classes')
        if (useIndex === -1 || classesIndex === -1) {
          return table
        }

        const useLabels: Record<string, string> = {
          'Section title (prose h2)': 'Section title',
          'Section title (prose h3 / page)': 'Subsection title',
          'Label (`metaLabelClassName`)': 'Label',
          'Meta (`typeMetaClassName`)': 'Meta',
        }

        return {
          ...table,
          rows: table.rows.map((row) => {
            const use = row[useIndex] ?? ''
            const useKey = stripMarkdownInline(use)
            const classesCell = row[classesIndex] ?? ''
            const [classesPart] = classesCell.split(/\s+—\s+/)
            const copy = [...row]
            const nextUse = useLabels[use] ?? useLabels[useKey]
            if (nextUse) {
              copy[useIndex] = nextUse
            }

            if (useKey.toLowerCase() === 'title') {
              copy[classesIndex] = classesPart ?? classesCell
              return copy
            }

            if (useKey.toLowerCase().startsWith('small')) {
              copy[classesIndex] =
                `${classesPart ?? classesCell} — body ink for meta values; secondary for compact lists`
              return copy
            }

            if (useKey.toLowerCase().startsWith('body')) {
              copy[classesIndex] =
                `${classesPart ?? classesCell} — secondary ink for page descriptions`
              return copy
            }

            return copy
          }),
        }
      }),
  },
  weights: {
    lead: 'Titles stay regular. Card titles and strong use medium. In running copy, italic does the work — not a heavier display weight.',
    body: '',
  },
  layout: {
    lead: 'A wide shell, a focused reading column, and open space between sections.',
    items: [
      'The site sits in a wide shell with modest side padding',
      'Long reading uses a narrower column so lines stay comfortable',
      'Project and writing cards share a two-column grid on large screens',
      'Major sections breathe with open vertical space',
      'Headers tighten or open with the page: compact on indexes, more open on articles and heroes',
      'Wide images can step out of the reading column',
    ],
  },
  spacing: {
    lead: 'Layout is the structure; this is the scale.',
    body: '',
    remapTables: (tables) =>
      remapMatchingTable(tables, ['Token', 'Classes', 'Use'], (table) =>
        replaceColumnByRow(table, 'Token', 'Use', {
          Micro: 'Meta stacks and compact chrome',
          Group: 'Headers, section headings, and card grids',
          Section: 'Page headers, page sections, and home blocks',
          Exceptional: 'Rare, extra-open blocks',
        })
      ),
  },
  'elevation-and-shape': {
    lead: 'The interface stays flat. Depth comes from size and placement.',
    items: [
      'No meaningful shadows. Depth comes from size, placement, contrast, and the occasional border',
      'A faint paper grain sits behind the content. The nav goes solid when you scroll',
      'Images stay square-cornered',
      'Interactive chrome uses a slight radius',
      'Code is the only slightly softer surface',
    ],
  },
  interaction: {
    lead: 'Shared states for links, buttons, and chrome. Hover stays quiet — no scale, glow, or drop shadow.',
    body: '',
    remapTables: (tables) =>
      remapMatchingTable(tables, ['State', 'Use'], (table) =>
        replaceColumnByRow(table, 'State', 'Use', {
          Hover: 'A color shift, an underline, or both',
          Focus: 'A clear outline on interactive chrome',
          'Focus (cards)': 'A slightly wider outline on project and writing cards',
          Disabled: 'Faded and still',
          Selection: 'Native text selection, inverted',
          Touch: 'Taller targets on small screens',
        })
      ),
  },
  components: {
    lead: 'Text-forward links, full-bleed covers, and labeled meta. No bordered cards or extra chrome.',
    body: '',
  },
  buttons: {
    lead: 'Links take you somewhere. Buttons act without leaving the page. There are three: Primary, Secondary, and Ghost. Ghost belongs with the text CTAs. Portfolio calls to action stay as links, not Primary buttons.',
    body: '',
    remapTables: (tables) =>
      remapMatchingTable(tables, ['Variant', 'Use'], (table) =>
        replaceColumnByRow(table, 'Variant', 'Use', {
          Primary: 'The strongest action on the page',
          Secondary: 'An alternative action',
          Ghost: 'The quietest action — same family as a text CTA',
          Disabled: 'Any variant can sit in a disabled state',
        })
      ),
  },
  'dos-and-donts': {
    lead: 'A few lines that keep the portfolio calm, readable, and consistent in both themes.',
    items: [
      'Do keep the UI black, white, and Neutral in both themes',
      'Do use IBM Plex Sans for reading and IBM Plex Mono for chrome and metadata',
      'Do preserve the reading column and spacious section gaps',
      'Do prefer text links for navigation; buttons only when the action stays on the page',
      'Do keep images square-cornered and covers edge-to-edge in their frame',
      "Don't introduce colorful gradients, glows, or drop shadows",
      "Don't reach for other gray scales or brand hues",
      "Don't load a bold display weight or ornate, condensed faces",
      "Don't crowd the grid or shrink the major gaps",
      "Don't add a fourth button, bordered card panels, or pill chips",
      "Don't treat code-highlight colors as brand color",
    ],
  },
}

export const applyDesignGuideCopy = (rule: DesignRule): DesignRule => ({
  ...rule,
  introMarkdown: DESIGN_GUIDE_INTRO,
  sections: rule.sections.map((section) => {
    const copy = DESIGN_GUIDE_SECTIONS[section.id]
    if (!copy) {
      return section
    }

    const bodyMarkdown =
      copy.items !== undefined
        ? listMarkdown(copy.items)
        : copy.body !== undefined
          ? copy.body
          : section.bodyMarkdown

    return {
      ...section,
      leadMarkdown:
        copy.lead !== undefined ? copy.lead : section.leadMarkdown,
      bodyMarkdown,
      tables: copy.remapTables
        ? copy.remapTables(section.tables)
        : section.tables,
    }
  }),
})
