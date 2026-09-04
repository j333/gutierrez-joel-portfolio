import { DesignSectionNav } from 'app/components/design-section-nav'
import {
  chromeLinkClassName,
  ctaLinkClassName,
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
  textColumnClassName,
} from 'app/components/page-layout'
import {
  extractClassTokens,
  extractListItems,
  stripMarkdownInline,
  type DesignRule,
  type DesignSection,
  type DesignTable,
} from 'app/lib/design-rule'
import { imagePlaceholderClassName } from 'app/lib/image-sizes'
import { cx } from 'app/lib/cx'

type DesignSystemViewProps = {
  rule: DesignRule
  title?: string
  description?: string
}

const SpecimenLabel = ({ children }: { children: string }) => (
  <p className={`${metaLabelClassName} mb-1`}>{children}</p>
)

const SectionLead = ({ children }: { children: string }) => (
  <p
    className={`${textColumnClassName} mt-3 text-lg leading-7 text-neutral-600 dark:text-neutral-400`}
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
                <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
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

const ColorSpecimenRow = ({
  role,
  lightCell,
  darkCell,
}: {
  role: string
  lightCell: string
  darkCell: string
}) => {
  const lightClasses = extractClassTokens(lightCell)
  const darkClasses = extractClassTokens(darkCell)
  const allClasses = [...lightClasses, ...darkClasses]
  const hasBg = allClasses.some((token) => /(^|:)bg-/.test(token))
  const hasBorder = allClasses.some((token) => /(^|:)border-/.test(token))
  const hasText = allClasses.some((token) => /(^|:)text-/.test(token))

  return (
    <li className="flex flex-col gap-3 border-b border-neutral-200 py-4 last:border-b-0 dark:border-neutral-800 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
          {role}
        </p>
        <p className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
          {allClasses.length > 0
            ? classListLabel(allClasses)
            : stripMarkdownInline(
                `${lightCell}${darkCell ? ` / ${darkCell}` : ''}`
              )}
        </p>
      </div>
      <div
        className={cx(
          'flex h-16 w-full shrink-0 items-center justify-center sm:w-40',
          hasBg || hasBorder || hasText
            ? allClasses.join(' ')
            : 'bg-neutral-100 dark:bg-neutral-900',
          hasBorder ? 'border' : '',
          !hasBg && hasText ? 'bg-transparent' : ''
        )}
        aria-hidden="true"
      >
        {hasText && !hasBg ? (
          <span className="font-mono text-xs uppercase tracking-wider">Aa</span>
        ) : null}
      </div>
    </li>
  )
}

const ColorSpecimens = ({ table }: { table: DesignTable }) => (
  <ul className="list-none p-0">
    {table.rows.map((row) => (
      <ColorSpecimenRow
        key={row[0]}
        role={row[0] ?? ''}
        lightCell={row[1] ?? ''}
        darkCell={row[2] ?? ''}
      />
    ))}
  </ul>
)

const cleanTypeUse = (use: string) =>
  use.replace(/\s*\(`[^`]+`\)/g, '').trim()

const TypographySpecimenRow = ({
  use,
  classesCell,
}: {
  use: string
  classesCell: string
}) => {
  const classes = extractClassTokens(classesCell)
  const sampleClassName =
    classes.length > 0
      ? classes.join(' ')
      : 'text-base leading-6 text-neutral-800 dark:text-neutral-200'

  return (
    <li className="flex flex-col gap-2 border-b border-neutral-200 py-6 last:border-b-0 dark:border-neutral-800">
      <p className={metaLabelClassName}>{cleanTypeUse(use)}</p>
      <p className={sampleClassName}>
        The quick brown fox jumps over the lazy dog
      </p>
      <p className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
        {classListLabel(classes)}
      </p>
    </li>
  )
}

const TypographySpecimens = ({ table }: { table: DesignTable }) => (
  <ul className="list-none p-0">
    {table.rows.map((row) => (
      <TypographySpecimenRow
        key={row[0]}
        use={row[0] ?? ''}
        classesCell={row[1] ?? ''}
      />
    ))}
  </ul>
)

const spacingWidthClassName: Record<string, string> = {
  Micro: 'w-8',
  Group: 'w-20',
  Section: 'w-40',
  Exceptional: 'w-56',
}

const SpacingSpecimens = ({ table }: { table: DesignTable }) => {
  const tokenIndex = headerIndex(table, 'Token')
  const classesIndex = headerIndex(table, 'Classes')
  const useIndex = headerIndex(table, 'Use')

  return (
    <ul className="list-none space-y-6 p-0">
      {table.rows.map((row) => {
        const token = row[tokenIndex] ?? ''
        const classesCell = row[classesIndex] ?? ''
        const use = stripMarkdownInline(row[useIndex] ?? '')
        const classes = extractClassTokens(classesCell)
        const widthClass = spacingWidthClassName[token] ?? 'w-16'

        return (
          <li
            key={token}
            className="flex flex-col gap-3 border-b border-neutral-200 pb-6 last:border-b-0 dark:border-neutral-800"
          >
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                {token}
              </p>
              <p className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
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
              <p className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
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
                <span className="text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
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
  const classesIndex = headerIndex(table, 'Classes')
  const useIndex = headerIndex(table, 'Use')

  return (
    <ul className="list-none space-y-10 p-0">
      {table.rows.map((row) => {
        const variant = row[variantIndex] ?? ''
        const helperCell = row[helperIndex] ?? ''
        const classesCell = row[classesIndex] ?? ''
        const use = stripMarkdownInline(row[useIndex] ?? '')
        const helper = stripMarkdownInline(helperCell)
        const fromHelper = buttonHelperClassName[helper]
        const fromTable = extractClassTokens(classesCell)
        const className =
          fromHelper ??
          (fromTable.length > 0 ? fromTable.join(' ') : buttonSecondaryClassName)
        const isDisabled = variant.toLowerCase() === 'disabled'

        return (
          <li
            key={variant}
            className="flex flex-col gap-3 border-b border-neutral-200 pb-8 last:border-b-0 dark:border-neutral-800"
          >
            <div className="flex flex-col gap-1">
              <p className={metaLabelClassName}>{variant}</p>
              <p className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
                {helper || classListLabel(fromTable)}
              </p>
              {use ? (
                <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                  {use}
                </p>
              ) : null}
            </div>
            {isDisabled ? (
              <button
                type="button"
                disabled
                className={cx(
                  buttonPrimaryClassName,
                  buttonDisabledClassName,
                  'w-fit'
                )}
              >
                Disabled
              </button>
            ) : (
              <button type="button" className={cx(className, 'w-fit')}>
                {variant}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const LayoutSpecimens = () => (
  <div className="flex flex-col gap-12">
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Site shell</SpecimenLabel>
      <div className="border border-neutral-200 px-4 py-6 dark:border-neutral-800 sm:px-6">
        <p className="font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400">
          Up to 1920px wide, with roomy side padding
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Reading column</SpecimenLabel>
      <div
        className={`${textColumnClassName} border border-neutral-200 px-4 py-6 dark:border-neutral-800`}
      >
        <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          Articles and long copy sit in a narrow column so line length stays
          comfortable.
        </p>
      </div>
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
            so the page can breathe
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
    {table ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm leading-5">
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

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Chrome link</SpecimenLabel>
      <a href="#components" className={chromeLinkClassName}>
        Writing
      </a>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>CTA link</SpecimenLabel>
      <a href="#components" className={ctaLinkClassName}>
        View case study
      </a>
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
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Page header & meta</SpecimenLabel>
      <div>
        <p className="mb-2 text-3xl font-normal leading-9 tracking-tighter">
          Project title
        </p>
        <p className="text-lg leading-7 text-neutral-600 dark:text-neutral-400">
          Short supporting line in the muted description style.
        </p>
        <div className="mt-6">
          <dl className={metaListClassName}>
            <MetaRow label="Brand">Marketfully</MetaRow>
            <MetaRow label="Role">Product Design Manager</MetaRow>
          </dl>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>Cover treatment</SpecimenLabel>
      <div
        className={`aspect-video w-full max-w-md ${imagePlaceholderClassName}`}
        aria-hidden="true"
      />
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Full-bleed 16:9 covers with no card frame, border, or shadow
      </p>
    </div>
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
  index,
}: {
  section: DesignSection
  index: number
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
  const isLayout = section.id === 'layout'
  const isElevation = section.id === 'elevation-and-shape'
  const isComponents = section.id === 'components'

  return (
    <section
      id={section.id}
      className={cx(
        'scroll-mt-24 pb-20',
        index > 0 &&
          'border-t border-neutral-200 pt-16 dark:border-neutral-800'
      )}
    >
      <header className="mb-10">
        <p className={metaLabelClassName}>
          {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="mt-3 text-2xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
          {section.title}
        </h2>
        {lead ? <SectionLead>{lead}</SectionLead> : null}
      </header>

      {isPrinciples || isDosDonts ? (
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

      {!isPrinciples && !isDosDonts && section.bodyMarkdown ? (
        <div className="mb-10">
          <BodyMarkdown markdown={section.bodyMarkdown} />
        </div>
      ) : null}

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
        <div className="flex min-w-0 flex-col">
          {rule.sections.map((section, index) => (
            <DesignSectionBlock
              key={section.id}
              section={section}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
