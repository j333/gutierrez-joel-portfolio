import { DesignSectionNav } from 'app/components/design-section-nav'
import {
  chromeLinkClassName,
  ctaLinkClassName,
  navTextClassName,
} from 'app/components/link-styles'
import {
  buttonDisabledClassName,
  buttonGhostClassName,
  buttonPrimaryClassName,
  buttonSecondaryClassName,
} from 'app/components/button-styles'
import {
  MetaRow,
  PageHeader,
  metaLabelClassName,
  metaListClassName,
  pageTitleClassName,
  textColumnClassName,
  typeMetaClassName,
} from 'app/components/page-layout'
import { MoonIcon, SunIcon } from 'app/components/theme-icons'
import {
  extractClassTokens,
  extractListItems,
  stripMarkdownInline,
  type DesignRule,
  type DesignSection,
  type DesignTable,
} from 'app/lib/design-rule'
import { DESIGN_CHAPTERS } from 'app/lib/design-chapters'
import { imagePlaceholderClassName } from 'app/lib/image-sizes'
import { cx } from 'app/lib/cx'

type DesignSystemViewProps = {
  rule: DesignRule
  title?: string
  description?: string
}

const SpecimenLabel = ({ children }: { children: string }) => (
  <h4 className="mb-4 text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
    {children}
  </h4>
)

const SectionLead = ({ children }: { children: string }) => (
  <p
    className={`${textColumnClassName} mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 sm:mt-5`}
  >
    {children}
  </p>
)

const classListLabel = (classes: string[]) =>
  classes.length > 0 ? classes.join(' ') : '—'

const findTableByHeaders = (
  tables: DesignTable[],
  requiredHeaders: string[],
  excludedHeaders: string[] = []
) =>
  tables.find((table) => {
    const headers = table.headers.map((value) => value.toLowerCase())
    const hasRequired = requiredHeaders.every((header) =>
      headers.includes(header.toLowerCase())
    )
    if (!hasRequired) {
      return false
    }

    return !excludedHeaders.some((header) =>
      headers.includes(header.toLowerCase())
    )
  }) ?? null

const headerIndex = (table: DesignTable, name: string) =>
  table.headers.findIndex(
    (header) => header.toLowerCase() === name.toLowerCase()
  )

const paletteBackgroundClassName: Record<string, string> = {
  white: 'bg-white',
  'neutral-50': 'bg-neutral-50',
  'neutral-100': 'bg-neutral-100',
  'neutral-200': 'bg-neutral-200',
  'neutral-300': 'bg-neutral-300',
  'neutral-400': 'bg-neutral-400',
  'neutral-500': 'bg-neutral-500',
  'neutral-600': 'bg-neutral-600',
  'neutral-700': 'bg-neutral-700',
  'neutral-800': 'bg-neutral-800',
  'neutral-900': 'bg-neutral-900',
  'neutral-950': 'bg-neutral-950',
  black: 'bg-black',
}

const PaletteSpecimens = ({ table }: { table: DesignTable }) => {
  const stepIndex = headerIndex(table, 'Step')
  const classIndex = headerIndex(table, 'Class')
  const notesIndex = headerIndex(table, 'Notes')

  return (
    <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4 lg:grid-cols-7">
      {table.rows.map((row) => {
        const step = row[stepIndex] ?? ''
        const classCell = row[classIndex] ?? ''
        const notes = stripMarkdownInline(row[notesIndex] ?? '')
        const rawClass = stripMarkdownInline(classCell)
        const bgClass =
          paletteBackgroundClassName[rawClass] ?? 'bg-neutral-100'
        const stepNumber = Number(step)
        const useLightLabel = Number.isFinite(stepNumber) && stepNumber >= 70

        return (
          <li key={`${step}-${rawClass}`} className="flex min-w-0 flex-col gap-2">
            <div
              className={cx(
                'flex aspect-[4/3] w-full items-end border border-neutral-200 p-2 dark:border-neutral-800',
                bgClass
              )}
              aria-hidden="true"
            >
              <span
                className={cx(
                  'font-mono text-xs leading-4',
                  useLightLabel ? 'text-white' : 'text-neutral-900'
                )}
              >
                {step}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="font-mono text-xs leading-4 text-neutral-800 dark:text-neutral-200">
                {rawClass}
              </p>
              {notes ? (
                <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                  {notes}
                </p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const resolveThemeClasses = (
  classes: string[],
  forceTheme: 'light' | 'dark'
) => {
  if (forceTheme === 'dark') {
    const darkOnly = classes
      .filter((token) => token.startsWith('dark:'))
      .map((token) => token.replace(/^dark:/, ''))
    if (darkOnly.length > 0) {
      return darkOnly
    }
  }

  return classes.filter((token) => !token.startsWith('dark:'))
}

const ThemeSwatch = ({
  label,
  cell,
  forceTheme,
}: {
  label: string
  cell: string
  forceTheme: 'light' | 'dark'
}) => {
  const classes = extractClassTokens(cell)
  const resolved = resolveThemeClasses(classes, forceTheme)
  const hasBg = resolved.some((token) => /(^|:)bg-/.test(token))
  const hasBorder = resolved.some((token) => /(^|:)border-/.test(token))
  const hasText = resolved.some((token) => /(^|:)text-/.test(token))
  const labelClasses =
    classes.length > 0
      ? classListLabel(
          forceTheme === 'dark'
            ? classes.filter((token) => token.startsWith('dark:'))
            : classes.filter((token) => !token.startsWith('dark:'))
        )
      : stripMarkdownInline(cell) || '—'

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <p className={metaLabelClassName}>{label}</p>
      <div
        className={cx(
          'flex h-16 w-full items-center justify-center overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800',
          forceTheme === 'light' ? 'bg-white' : 'bg-black'
        )}
      >
        <div
          className={cx(
            'flex h-full w-full items-center justify-center',
            hasBg || hasBorder || hasText
              ? resolved.join(' ')
              : forceTheme === 'light'
                ? 'bg-neutral-100'
                : 'bg-neutral-900',
            hasBorder ? 'border' : '',
            !hasBg && hasText ? 'bg-transparent' : ''
          )}
          aria-hidden="true"
        >
          {hasText && !hasBg ? (
            <span className="font-mono text-xs uppercase tracking-wider">
              Aa
            </span>
          ) : null}
        </div>
      </div>
      <p className={typeMetaClassName}>
        {labelClasses}
      </p>
    </div>
  )
}

const colorRoleGroup = (role: string) => {
  const value = role.toLowerCase()
  if (
    value.includes('border') ||
    value.includes('table') ||
    value.includes('divider')
  ) {
    return 'Borders'
  }
  if (
    value.includes('canvas') ||
    value.includes('placeholder') ||
    value.includes('code') ||
    value.includes('selection')
  ) {
    return 'Surfaces'
  }
  return 'Text'
}

const ColorSpecimens = ({ table }: { table: DesignTable }) => {
  const groups = new Map<string, typeof table.rows>()
  const order = ['Text', 'Surfaces', 'Borders']

  table.rows.forEach((row) => {
    const group = colorRoleGroup(row[0] ?? '')
    const existing = groups.get(group) ?? []
    existing.push(row)
    groups.set(group, existing)
  })

  return (
    <div className="flex flex-col gap-12">
      {order.map((groupName) => {
        const rows = groups.get(groupName)
        if (!rows?.length) {
          return null
        }

        return (
          <div key={groupName} className="flex flex-col gap-6">
            <SpecimenLabel>{groupName}</SpecimenLabel>
            <ul className="list-none space-y-8 p-0">
              {rows.map((row) => {
                const role = row[0] ?? ''
                const lightCell = row[1] ?? ''
                const darkCell = row[2] ?? ''
                const isSelection = role.toLowerCase() === 'selection'

                return (
                  <li
                    key={role}
                    className="flex flex-col gap-4 border-b border-neutral-200 pb-8 last:border-b-0 dark:border-neutral-800"
                  >
                    <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
                      {role}
                    </p>
                    {isSelection ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <p className={metaLabelClassName}>Light</p>
                          <p className="bg-white p-3 text-sm leading-5 text-neutral-800">
                            <span className="bg-black text-white">
                              Select this sample
                            </span>{' '}
                            to see inverted selection.
                          </p>
                          <p className={typeMetaClassName}>
                            black on white
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className={metaLabelClassName}>Dark</p>
                          <p className="bg-black p-3 text-sm leading-5 text-neutral-200">
                            <span className="bg-white text-black">
                              Select this sample
                            </span>{' '}
                            to see inverted selection.
                          </p>
                          <p className={typeMetaClassName}>
                            white on black
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ThemeSwatch
                          label="Light"
                          cell={lightCell}
                          forceTheme="light"
                        />
                        <ThemeSwatch
                          label="Dark"
                          cell={darkCell}
                          forceTheme="dark"
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

const cleanTypeUse = (use: string) =>
  use.replace(/\s*\(`[^`]+`\)/g, '').trim()

const typeUseParts = (use: string) => {
  const cleaned = cleanTypeUse(use)
  const match = cleaned.match(/^(.+?)\s*\((.+)\)\s*$/)
  if (match) {
    return { title: match[1], note: match[2] }
  }

  return { title: cleaned, note: '' }
}

const splitClassesAndNote = (classesCell: string) => {
  const [classesPart, ...noteParts] = classesCell.split(/\s+—\s+/)
  return {
    classesPart: classesPart ?? '',
    note: stripMarkdownInline(noteParts.join(' — ')),
  }
}

const typeSampleText = (use: string) => {
  const key = cleanTypeUse(use).toLowerCase()
  if (
    key === 'title' ||
    key.startsWith('title (') ||
    key.includes('article title') ||
    key.includes('page title')
  ) {
    return 'A quiet craft'
  }
  if (key.includes('section title') && key.includes('h2')) return 'Reading column'
  if (key.includes('section title')) return 'Section rhythm'
  if (key.includes('card') && key.includes('title')) return 'Project title'
  if (key.includes('lead'))
    return 'Spare editorial portfolio. Craft over decoration.'
  if (key.includes('body'))
    return 'Hierarchy comes from contrast, typography, and whitespace.'
  if (key.includes('small')) return 'Designed and built in Cursor'
  if (key.includes('label')) return 'Writing'
  if (key.includes('meta')) return '2024'
  return 'The quick brown fox jumps over the lazy dog'
}

const typeGroupForUse = (use: string) => {
  const key = cleanTypeUse(use).toLowerCase()
  if (key.includes('title')) {
    return 'Titles'
  }
  if (key.includes('label') || key.includes('meta')) {
    return 'Chrome'
  }
  return 'Running copy'
}

const typeGroupDescription: Record<string, string> = {
  Titles: 'Light display sizes. Page and article titles share one style.',
  'Running copy':
    'Color is a modifier — body, secondary, or muted — not a new type style.',
  Chrome: 'IBM Plex Mono for labels, dates, and metadata.',
}

const splitClassAlternatives = (classesCell: string) => {
  const parts = classesCell.split(/\s+or\s+/i)
  if (parts.length <= 1) {
    return [classesCell]
  }
  return parts.map((part) => part.trim()).filter(Boolean)
}

const TypeGroupHeading = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => (
  <div className="mb-6">
    <h4 className="text-lg font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
      {title}
    </h4>
    {description ? (
      <p
        className={`${textColumnClassName} mt-2 text-sm leading-5 text-neutral-600 dark:text-neutral-400`}
      >
        {description}
      </p>
    ) : null}
  </div>
)

const FaceSpecimens = () => (
  <ul className="grid list-none grid-cols-1 gap-12 p-0 sm:grid-cols-2">
    <li className="flex min-w-0 flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <p
        className="font-sans text-5xl font-normal leading-none tracking-tight text-neutral-900 dark:text-neutral-100"
        aria-hidden="true"
      >
        Aa
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
          IBM Plex Sans
        </p>
        <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
      <p className={typeMetaClassName}>
        400 / 500 / 600 + italic · font-sans · no 700
      </p>
      <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
        Reading, titles, and body
      </p>
    </li>
    <li className="flex min-w-0 flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <p
        className="font-mono text-5xl font-normal leading-none text-neutral-900 dark:text-neutral-100"
        aria-hidden="true"
      >
        Aa
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
          IBM Plex Mono
        </p>
        <p className="font-mono text-sm leading-5 text-neutral-800 dark:text-neutral-200">
          2024 · Writing · Meta
        </p>
      </div>
      <p className={typeMetaClassName}>400 · font-mono</p>
      <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
        Chrome, dates, and tables
      </p>
    </li>
  </ul>
)

const weightSpecimens = [
  {
    label: 'Regular',
    weight: '400',
    className: 'font-normal',
    sample: 'A quiet craft',
    note: 'Page and prose titles, body',
  },
  {
    label: 'Medium',
    weight: '500',
    className: 'font-medium',
    sample: 'Project title',
    note: 'Card titles and strong',
  },
  {
    label: 'Italic',
    weight: 'em',
    className: 'italic font-normal',
    sample: 'emphasis in running copy',
    note: 'Prefer italic over bold display weights',
  },
] as const

const WeightSpecimens = () => (
  <ul className="list-none p-0">
    {weightSpecimens.map((specimen) => (
      <li
        key={specimen.label}
        className="flex flex-col gap-3 border-b border-neutral-200 py-8 first:pt-0 last:border-b-0 dark:border-neutral-800"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
            {specimen.label}
          </p>
          <p className={typeMetaClassName}>{specimen.weight}</p>
        </div>
        <p
          className={`text-2xl tracking-tight text-neutral-900 dark:text-neutral-100 ${specimen.className}`}
        >
          {specimen.sample}
        </p>
        <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
          {specimen.note}
        </p>
      </li>
    ))}
    <li className="flex flex-col gap-3 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
          Bold
        </p>
        <p className={typeMetaClassName}>700 · not loaded</p>
      </div>
      <p
        className="text-2xl font-normal tracking-tight text-neutral-900 opacity-40 dark:text-neutral-100"
        aria-hidden="true"
      >
        Do not load Plex Sans 700
      </p>
      <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
        No ornate or condensed display faces either
      </p>
    </li>
  </ul>
)

const TypographySpecimenRow = ({
  use,
  classesCell,
}: {
  use: string
  classesCell: string
}) => {
  const { title, note: useNote } = typeUseParts(use)
  const { classesPart, note: classNote } = splitClassesAndNote(classesCell)
  const alternatives = splitClassAlternatives(classesPart)
  const sample = typeSampleText(use)

  return (
    <li className="flex flex-col gap-4 border-b border-neutral-200 py-8 last:border-b-0 dark:border-neutral-800">
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
          {title}
        </p>
        {useNote ? <p className={typeMetaClassName}>{useNote}</p> : null}
      </div>
      <div className="flex flex-col gap-6">
        {alternatives.map((alt) => {
          const classes = extractClassTokens(alt)
          const sampleClassName =
            classes.length > 0
              ? classes.join(' ')
              : 'text-base leading-6 text-neutral-800 dark:text-neutral-200'

          return (
            <div key={alt} className="flex flex-col gap-2">
              <p className={sampleClassName}>{sample}</p>
              <p className={typeMetaClassName}>{classListLabel(classes)}</p>
            </div>
          )
        })}
      </div>
      {classNote ? (
        <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
          {classNote}
        </p>
      ) : null}
    </li>
  )
}

const TypographySpecimens = ({ table }: { table: DesignTable }) => {
  const groups = new Map<string, typeof table.rows>()
  const order = ['Titles', 'Running copy', 'Chrome']

  table.rows.forEach((row) => {
    const group = typeGroupForUse(row[0] ?? '')
    const existing = groups.get(group) ?? []
    existing.push(row)
    groups.set(group, existing)
  })

  return (
    <div className="flex flex-col gap-16">
      {order.map((groupName) => {
        const rows = groups.get(groupName)
        if (!rows?.length) {
          return null
        }

        return (
          <div
            key={groupName}
            className="border-t border-neutral-200 pt-10 dark:border-neutral-800"
          >
            <TypeGroupHeading
              title={groupName}
              description={typeGroupDescription[groupName]}
            />
            <ul className="list-none p-0">
              {rows.map((row) => (
                <TypographySpecimenRow
                  key={row[0]}
                  use={row[0] ?? ''}
                  classesCell={row[1] ?? ''}
                />
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

const spacingWidthClassName: Record<string, string> = {
  'gap-0.5': 'w-0.5',
  'gap-1': 'w-1',
  'gap-2': 'w-2',
  'gap-3': 'w-3',
  'gap-4': 'w-4',
  'px-1': 'w-1',
  'py-1': 'w-1',
  'gap-6': 'w-6',
  'mb-8': 'w-8',
  'mt-6': 'w-6',
  'mb-12': 'w-12',
  'mb-14': 'w-14',
  'mb-16': 'w-16',
  'gap-16': 'w-16',
  'mt-20': 'w-20',
  'pb-20': 'w-20',
}

const SpacingSpecimens = ({ table }: { table: DesignTable }) => {
  const tokenIndex = headerIndex(table, 'Token')
  const classesIndex = headerIndex(table, 'Classes')
  const useIndex = headerIndex(table, 'Use')

  return (
    <ul className="list-none space-y-10 p-0">
      {table.rows.map((row) => {
        const token = row[tokenIndex] ?? ''
        const classesCell = row[classesIndex] ?? ''
        const use = stripMarkdownInline(row[useIndex] ?? '')
        const classes = extractClassTokens(classesCell)
        const displayClasses =
          classes.length > 0
            ? classes
            : stripMarkdownInline(classesCell)
                .split(/\s+/)
                .filter(Boolean)

        return (
          <li
            key={token}
            className="flex flex-col gap-4 border-b border-neutral-200 pb-8 last:border-b-0 dark:border-neutral-800"
          >
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
                {token}
              </p>
              {use ? (
                <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                  {use}
                </p>
              ) : null}
            </div>
            <ul className="list-none space-y-3 p-0">
              {displayClasses.map((tokenClass) => {
                const widthClass =
                  spacingWidthClassName[tokenClass] ?? 'w-4'

                return (
                  <li
                    key={tokenClass}
                    className="flex items-center gap-4"
                  >
                    <p className={`w-20 shrink-0 ${typeMetaClassName}`}>
                      {tokenClass}
                    </p>
                    <div
                      className={cx(
                        'h-3 bg-neutral-900 dark:bg-neutral-100',
                        widthClass
                      )}
                      aria-hidden="true"
                    />
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

const InteractionSpecimens = ({ table }: { table: DesignTable }) => {
  const stateIndex = headerIndex(table, 'State')
  const classesIndex = headerIndex(table, 'Classes')
  const useIndex = headerIndex(table, 'Use')

  return (
    <ul className="list-none space-y-8 p-0">
      {table.rows.map((row) => {
        const state = row[stateIndex] ?? ''
        const classesCell = row[classesIndex] ?? ''
        const use = stripMarkdownInline(row[useIndex] ?? '')
        const classes = extractClassTokens(classesCell)
        const stateKey = state.toLowerCase()

        return (
          <li
            key={state}
            className="flex flex-col gap-3 border-b border-neutral-200 pb-8 last:border-b-0 dark:border-neutral-800"
          >
            <div className="flex flex-col gap-1">
              <p className={metaLabelClassName}>{state}</p>
              <p className={typeMetaClassName}>
                {classListLabel(classes) !== '—'
                  ? classListLabel(classes)
                  : stripMarkdownInline(classesCell)}
              </p>
              {use ? (
                <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                  {use}
                </p>
              ) : null}
            </div>

            {stateKey === 'hover' ? (
              <a href="#interaction" className={ctaLinkClassName}>
                Hover me
              </a>
            ) : null}

            {stateKey === 'focus' ? (
              <a
                href="#interaction"
                className="inline-flex rounded-sm px-1 py-1 font-mono text-xs uppercase tracking-wider text-neutral-600 outline outline-2 outline-offset-2 outline-neutral-900 dark:text-neutral-400 dark:outline-neutral-100"
              >
                Focus outline
              </a>
            ) : null}

            {stateKey.startsWith('focus (cards)') ? (
              <a
                href="#interaction"
                className="inline-flex rounded-sm outline outline-2 outline-offset-4 outline-neutral-900 dark:outline-neutral-100"
              >
                <span className="text-base font-medium leading-6 text-neutral-800 dark:text-neutral-200">
                  Card focus
                </span>
              </a>
            ) : null}

            {stateKey === 'disabled' ? (
              <button
                type="button"
                disabled
                className={cx(buttonSecondaryClassName, buttonDisabledClassName)}
              >
                Disabled
              </button>
            ) : null}

            {stateKey === 'selection' ? (
              <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
                Select this sample text to see the inverted selection colors.
              </p>
            ) : null}

            {stateKey === 'touch' ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-sm px-1 py-1 font-mono text-xs uppercase tracking-wider text-neutral-600 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:focus-visible:outline-neutral-100 sm:min-h-0"
              >
                Touch target
              </button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

const buttonHelperClassName: Record<string, string> = {
  buttonPrimaryClassName,
  buttonSecondaryClassName,
  buttonGhostClassName,
  buttonDisabledClassName,
}

const ButtonSpecimens = ({ table }: { table: DesignTable }) => {
  const variantIndex = headerIndex(table, 'Variant')
  const helperIndex = headerIndex(table, 'Helper')
  const useIndex = headerIndex(table, 'Use')

  const variants = table.rows.filter(
    (row) => (row[variantIndex] ?? '').toLowerCase() !== 'disabled'
  )
  const disabledRow = table.rows.find(
    (row) => (row[variantIndex] ?? '').toLowerCase() === 'disabled'
  )

  return (
    <div className="flex flex-col gap-12">
      <ul className="m-0 flex list-none flex-wrap items-start gap-6 p-0">
        {variants.map((row) => {
          const variant = row[variantIndex] ?? ''
          const helper = stripMarkdownInline(row[helperIndex] ?? '')
          const use = stripMarkdownInline(row[useIndex] ?? '')
          const className =
            buttonHelperClassName[helper] ?? buttonSecondaryClassName

          return (
            <li key={variant} className="flex min-w-[10rem] flex-col gap-3">
              <button type="button" className={cx(className, 'w-fit')}>
                {variant}
              </button>
              <div className="flex flex-col gap-1">
                <p className={metaLabelClassName}>{variant}</p>
                <p className={typeMetaClassName}>
                  {helper}
                </p>
                {use ? (
                  <p className="max-w-[16rem] text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                    {use}
                  </p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      {disabledRow ? (
        <div className="flex flex-col gap-4 border-t border-neutral-200 pt-10 dark:border-neutral-800">
          <div className="flex flex-col gap-1">
            <p className={metaLabelClassName}>Disabled</p>
            <p className={typeMetaClassName}>
              {stripMarkdownInline(disabledRow[helperIndex] ?? '')}
            </p>
            <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
              {stripMarkdownInline(disabledRow[useIndex] ?? '')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled
              className={cx(
                buttonPrimaryClassName,
                buttonDisabledClassName,
                'w-fit'
              )}
            >
              Primary
            </button>
            <button
              type="button"
              disabled
              className={cx(
                buttonSecondaryClassName,
                buttonDisabledClassName,
                'w-fit'
              )}
            >
              Secondary
            </button>
            <button
              type="button"
              disabled
              className={cx(
                buttonGhostClassName,
                buttonDisabledClassName,
                'w-fit'
              )}
            >
              Ghost
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const LayoutSpecimens = () => (
  <div className="flex flex-col gap-12">
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Shell and reading column</SpecimenLabel>
      <div className="border border-neutral-200 px-4 py-6 dark:border-neutral-800 sm:px-6">
        <p className={`mb-4 ${typeMetaClassName}`}>
          Site shell · max-w-site · px-4 sm:px-6
        </p>
        <div
          className={`${textColumnClassName} border border-neutral-200 px-4 py-6 dark:border-neutral-800`}
        >
          <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            Reading column sits inside the shell so line length stays
            comfortable for long copy.
          </p>
          <p className={`mt-2 ${typeMetaClassName}`}>
            textColumnClassName · max-w-xl
          </p>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Home / writing grid</SpecimenLabel>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className={`aspect-video w-full ${imagePlaceholderClassName}`}
          aria-hidden="true"
        />
        <div
          className={`aspect-video w-full ${imagePlaceholderClassName}`}
          aria-hidden="true"
        />
      </div>
      <p className={typeMetaClassName}>
        projectGridClassName · 1 col, 2 cols from lg, gap-6
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Section rhythm</SpecimenLabel>
      <div className="flex flex-col gap-16">
        <div className="border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
            Major sections use open vertical space
          </p>
        </div>
        <div className="border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
            so the page can breathe · gap-16
          </p>
        </div>
      </div>
    </div>
  </div>
)

const ShapeSpecimens = () => (
  <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Images</SpecimenLabel>
      <div
        className={`aspect-video w-full ${imagePlaceholderClassName}`}
        aria-hidden="true"
      />
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Square corners, edge to edge
      </p>
    </div>
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Controls</SpecimenLabel>
      <a href="#elevation-and-shape" className={chromeLinkClassName}>
        Soft 4px radius
      </a>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Small radius on interactive chrome only
      </p>
    </div>
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Code</SpecimenLabel>
      <code className="block rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm dark:border-neutral-900 dark:bg-neutral-900">
        rounded-lg
      </code>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Slightly softer on code surfaces
      </p>
    </div>
  </div>
)

const ComponentSpecimens = ({ table }: { table: DesignTable | null }) => (
  <div className="flex flex-col gap-14">
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Chrome link</SpecimenLabel>
      <a href="#components" className={chromeLinkClassName}>
        Writing
      </a>
      <p className={typeMetaClassName}>
        chromeLinkClassName
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>CTA link</SpecimenLabel>
      <a href="#components" className={ctaLinkClassName}>
        View case study
      </a>
      <p className={typeMetaClassName}>
        ctaLinkClassName
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Content link</SpecimenLabel>
      <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
        Links inside prose keep the surrounding color and use a{' '}
        <a href="#components" className="content-link">
          quiet underline
        </a>
        .
      </p>
      <p className={typeMetaClassName}>
        .content-link / .prose a
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Page header & meta</SpecimenLabel>
      <div>
        <p className={`mb-2 ${pageTitleClassName}`}>
          Project title
        </p>
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Short supporting line in the muted description style.
        </p>
        <div className="mt-6">
          <dl className={metaListClassName}>
            <MetaRow label="Brand">Marketfully</MetaRow>
            <MetaRow label="Role">Product Design Manager</MetaRow>
          </dl>
        </div>
      </div>
      <p className={typeMetaClassName}>
        metaLabelClassName · typeMetaClassName · metaListClassName · metaValueClassName
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Project / writing card</SpecimenLabel>
      <article className="max-w-md min-w-0">
        <a
          href="#components"
          className="group flex flex-col gap-1 rounded-sm text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
        >
          <div
            className={`aspect-video w-full ${imagePlaceholderClassName}`}
            aria-hidden="true"
          />
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-base font-medium leading-6 text-neutral-800 group-hover:underline group-focus-visible:underline dark:text-neutral-200">
              Project title
            </p>
            <span className={typeMetaClassName}>
              2024
            </span>
          </div>
        </a>
      </article>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Full-bleed 16:9 cover, title row, mono meta — no card border or shadow
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Theme toggle</SpecimenLabel>
      <span
        className="inline-flex min-h-11 w-fit items-center rounded-sm px-1 py-1 outline-none sm:min-h-0"
        aria-hidden="true"
      >
        <SunIcon className="shrink-0 dark:hidden" />
        <MoonIcon className="hidden shrink-0 dark:inline" />
        <span className={`${navTextClassName} ml-2 whitespace-nowrap`}>
          Dark mode
        </span>
      </span>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Text/icon control, rounded-sm, touch height on small screens
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Image overlay</SpecimenLabel>
      <div className="relative aspect-video w-full max-w-md overflow-hidden">
        <div
          className={`absolute inset-0 ${imagePlaceholderClassName}`}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 flex items-start justify-end bg-white/95 p-4 dark:bg-black/95"
          aria-hidden="true"
        >
          <span className={chromeLinkClassName}>Close</span>
        </div>
      </div>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Near-opaque white/black scrim; close uses chrome mono styles
      </p>
    </div>

    {table ? (
      <div className="overflow-x-auto border-t border-neutral-200 pt-10 dark:border-neutral-800">
        <SpecimenLabel>Reference</SpecimenLabel>
        <table className="mt-4 w-full min-w-[36rem] border-collapse text-left text-sm leading-5">
          <thead>
            <tr className="border-b border-neutral-300 dark:border-neutral-600">
              {table.headers.map((header) => (
                <th
                  key={header}
                  className={`${metaLabelClassName} py-2 pr-4 font-normal`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr
                key={row.join('-')}
                className="border-b border-neutral-200 dark:border-neutral-800"
              >
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className="py-3 pr-4 align-top text-neutral-800 dark:text-neutral-200"
                  >
                    {stripMarkdownInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null}
  </div>
)

const PrincipleList = ({ items }: { items: string[] }) => (
  <ul
    className={`${textColumnClassName} list-disc space-y-2 pl-6 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200`}
  >
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

const DosAndDontsList = ({ items }: { items: string[] }) => {
  const dos = items.filter((item) => /^do\b/i.test(item))
  const donts = items.filter((item) => /^don'?t\b/i.test(item))
  const other = items.filter(
    (item) => !/^do\b/i.test(item) && !/^don'?t\b/i.test(item)
  )

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <SpecimenLabel>Do</SpecimenLabel>
        <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          {dos.map((item) => (
            <li key={item}>{item.replace(/^do\s+/i, '')}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <SpecimenLabel>Don&apos;t</SpecimenLabel>
        <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          {donts.map((item) => (
            <li key={item}>{item.replace(/^don'?t\s+/i, '')}</li>
          ))}
        </ul>
      </div>
      {other.length > 0 ? (
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            {other.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const BodyMarkdown = ({ markdown }: { markdown: string }) => {
  const listItems = extractListItems(markdown)
  const proseBlocks = markdown
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => {
      if (!block) {
        return false
      }

      return !block
        .split('\n')
        .every((line) => {
          const value = line.trim()
          return value.startsWith('- ') || value.startsWith('* ')
        })
    })

  return (
    <div className="flex flex-col gap-6">
      {proseBlocks.map((block) => (
        <p
          key={block}
          className={`${textColumnClassName} text-lg leading-relaxed text-neutral-800 dark:text-neutral-200`}
        >
          {stripMarkdownInline(block.replace(/\n/g, ' '))}
        </p>
      ))}
      {listItems.length > 0 ? <PrincipleList items={listItems} /> : null}
    </div>
  )
}

const DesignSectionBlock = ({
  section,
  isFirstInChapter,
  flatTitle,
}: {
  section: DesignSection
  isFirstInChapter: boolean
  /** When set, this section is the only one in its chapter — render as a sole title. */
  flatTitle?: string
}) => {
  const listItems = extractListItems(section.bodyMarkdown)
  const lead = stripMarkdownInline(section.leadMarkdown)
  const paletteTable = findTableByHeaders(section.tables, ['Step', 'Class'])
  const colorTable = findTableByHeaders(section.tables, ['Role', 'Light', 'Dark'])
  const typeTable = findTableByHeaders(
    section.tables,
    ['Use', 'Classes'],
    ['Variant', 'Token', 'State', 'Helper']
  )
  const spacingTable = findTableByHeaders(section.tables, ['Token', 'Classes'])
  const interactionTable = findTableByHeaders(section.tables, [
    'State',
    'Classes',
  ])
  const buttonTable = findTableByHeaders(section.tables, [
    'Variant',
    'Helper',
    'Classes',
  ])
  const componentTable = findTableByHeaders(section.tables, [
    'Primitive',
    'Helper',
  ])

  const isPrinciples = section.id === 'principles'
  const isDosDonts = section.id === 'dos-and-donts'
  const isFaces = section.id === 'faces'
  const isWeights = section.id === 'weights'
  const isLayout = section.id === 'layout'
  const isElevation = section.id === 'elevation-and-shape'
  const isComponents = section.id === 'components'
  const isFlat = Boolean(flatTitle)

  const dosDontsItems =
    listItems.length > 0
      ? listItems
      : extractListItems(
          [section.leadMarkdown, section.bodyMarkdown]
            .filter(Boolean)
            .join('\n')
        )

  return (
    <section
      id={section.id}
      className={cx(
        'scroll-mt-24',
        isFlat ? 'pb-0' : 'pb-14',
        !isFirstInChapter && !isFlat && 'pt-10'
      )}
    >
      <header className={isFlat ? 'mb-10' : 'mb-8'}>
        {isFlat ? (
          <h2 className={`${pageTitleClassName} text-neutral-900 dark:text-neutral-100`}>
            {flatTitle}
          </h2>
        ) : (
          <h3 className="text-xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
            {section.title}
          </h3>
        )}
        {lead ? <SectionLead>{lead}</SectionLead> : null}
      </header>

      {isPrinciples ? (
        <PrincipleList
          items={
            listItems.length > 0
              ? listItems
              : extractListItems(
                  [section.leadMarkdown, section.bodyMarkdown]
                    .filter(Boolean)
                    .join('\n')
                )
          }
        />
      ) : null}

      {isDosDonts ? <DosAndDontsList items={dosDontsItems} /> : null}

      {!isPrinciples &&
      !isDosDonts &&
      !isFaces &&
      !isWeights &&
      section.bodyMarkdown ? (
        <div className="mb-10">
          <BodyMarkdown markdown={section.bodyMarkdown} />
        </div>
      ) : null}

      {isFaces ? <FaceSpecimens /> : null}
      {isWeights ? <WeightSpecimens /> : null}

      {paletteTable ? <PaletteSpecimens table={paletteTable} /> : null}
      {colorTable ? <ColorSpecimens table={colorTable} /> : null}
      {typeTable ? <TypographySpecimens table={typeTable} /> : null}
      {spacingTable ? <SpacingSpecimens table={spacingTable} /> : null}
      {interactionTable ? (
        <InteractionSpecimens table={interactionTable} />
      ) : null}
      {buttonTable ? <ButtonSpecimens table={buttonTable} /> : null}
      {isComponents ? (
        <ComponentSpecimens table={componentTable} />
      ) : null}
      {isLayout ? (
        <div className="mt-10">
          <LayoutSpecimens />
        </div>
      ) : null}
      {isElevation ? (
        <div className="mt-10">
          <ShapeSpecimens />
        </div>
      ) : null}
    </section>
  )
}

const IntroMarkdown = ({ markdown }: { markdown: string }) => {
  const blocks = markdown
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => {
      const plain = stripMarkdownInline(block)
      if (/^visual reference:/i.test(plain)) {
        return false
      }
      if (/^reuse helpers in /i.test(plain)) {
        return false
      }
      return true
    })

  if (blocks.length === 0) {
    return null
  }

  return (
    <div className={`${textColumnClassName} flex flex-col gap-4`}>
      {blocks.map((block, index) => (
        <p
          key={block}
          className={
            index === 0
              ? 'text-xl leading-[1.3] text-neutral-800 dark:text-neutral-200'
              : 'text-lg leading-relaxed text-neutral-600 dark:text-neutral-400'
          }
        >
          {stripMarkdownInline(block.replace(/\n/g, ' '))}
        </p>
      ))}
    </div>
  )
}

export const DesignSystemView = ({
  rule,
  title = rule.title,
  description = rule.description,
}: DesignSystemViewProps) => {
  const sectionsById = new Map(
    rule.sections.map((section) => [section.id, section])
  )
  const chapters = DESIGN_CHAPTERS.map((chapter) => ({
    ...chapter,
    sections: chapter.sectionIds
      .map((id) => sectionsById.get(id))
      .filter((section): section is DesignSection => section !== undefined),
  })).filter((chapter) => chapter.sections.length > 0)

  const navSections = rule.sections.map((section) => ({
    id: section.id,
    title: section.title,
  }))

  return (
    <div className="flex flex-col">
      <PageHeader title={title} description={description} spacing="article" />
      <IntroMarkdown markdown={rule.introMarkdown} />
      <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <DesignSectionNav sections={navSections} />
        <div className="flex min-w-0 flex-col gap-16">
          {chapters.map((chapter) => {
            const hasSubsections = chapter.sections.length > 1

            if (!hasSubsections) {
              const section = chapter.sections[0]
              return (
                <DesignSectionBlock
                  key={chapter.id}
                  section={section}
                  isFirstInChapter
                  flatTitle={chapter.label}
                />
              )
            }

            return (
              <div key={chapter.id} className="flex min-w-0 flex-col">
                <header className="mb-10">
                  <h2 className={`scroll-mt-24 ${pageTitleClassName} text-neutral-900 dark:text-neutral-100`}>
                    {chapter.label}
                  </h2>
                  {chapter.description ? (
                    <p
                      className={`${textColumnClassName} mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400`}
                    >
                      {chapter.description}
                    </p>
                  ) : null}
                </header>
                <div className="flex min-w-0 flex-col">
                  {chapter.sections.map((section, sectionIndex) => (
                    <DesignSectionBlock
                      key={section.id}
                      section={section}
                      isFirstInChapter={sectionIndex === 0}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
