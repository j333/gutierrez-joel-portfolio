import {
  chromeLinkClassName,
  ctaLinkClassName,
} from 'app/components/link-styles'
import {
  MetaRow,
  PageHeader,
  metaLabelClassName,
  metaListClassName,
  textColumnClassName,
} from 'app/components/page-layout'
import {
  extractClassTokens,
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

const humanSectionMeta: Record<
  string,
  { heading: string; lead: string }
> = {
  principles: {
    heading: 'Principles',
    lead: 'A spare editorial system. Hierarchy comes from contrast, type, and whitespace — not decoration.',
  },
  color: {
    heading: 'Color',
    lead: 'Black, white, and neutral gray in light and dark. Contrast does the work; color is not used as brand chrome.',
  },
  typography: {
    heading: 'Typography',
    lead: 'IBM Plex Sans for reading. IBM Plex Mono for navigation, labels, and metadata. Titles stay light; emphasis is quiet.',
  },
  layout: {
    heading: 'Layout',
    lead: 'A wide site shell with generous margins, a focused reading column, and open vertical rhythm between sections.',
  },
  'elevation-and-shape': {
    heading: 'Elevation & shape',
    lead: 'The interface stays flat. Depth comes from size and placement. Corners stay sharp on images and soft only on small controls.',
  },
  'components-use-these-do-not-invent-alternatives': {
    heading: 'Components',
    lead: 'Text-forward links, full-bleed covers, and labeled meta — no filled buttons, bordered cards, or pill chips.',
  },
  'dos-and-donts': {
    heading: "Do's and don'ts",
    lead: 'Guardrails that keep the portfolio calm, readable, and consistent across themes.',
  },
}

const extractListItems = (markdown: string) =>
  markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) =>
      line
        .slice(2)
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(
          /Don't invent button\/card\/chip primitives that fight the existing chrome/,
          "Don't introduce filled buttons, bordered cards, or pill chips"
        )
        .replace(
          /Don't treat syntax-highlight colors as a general brand palette/,
          "Don't treat code highlight colors as brand accents"
        )
    )

const SectionLead = ({ children }: { children: string }) => (
  <p
    className={`${textColumnClassName} mt-3 text-lg leading-7 text-neutral-600 dark:text-neutral-400`}
  >
    {children}
  </p>
)

const SpecimenLabel = ({ children }: { children: string }) => (
  <p className={`${metaLabelClassName} mb-1`}>{children}</p>
)

const classListLabel = (classes: string[]) =>
  classes.length > 0 ? classes.join(' ') : '—'

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
            : `${lightCell}${darkCell ? ` / ${darkCell}` : ''}`}
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

const PrincipleList = ({ items }: { items: string[] }) => (
  <ul
    className={`${textColumnClassName} list-disc space-y-2 pl-6 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200`}
  >
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

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

const ComponentSpecimens = () => (
  <div className="flex flex-col gap-14">
    <div className="flex flex-col gap-3">
      <SpecimenLabel>Chrome link</SpecimenLabel>
      <a href="#components" className={chromeLinkClassName}>
        Writing
      </a>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Mono, uppercase, muted — used in navigation and site chrome
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <SpecimenLabel>CTA link</SpecimenLabel>
      <a href="#components" className={ctaLinkClassName}>
        View case study
      </a>
      <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
        Underlined text link for secondary actions — never a filled button
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

const DesignSectionBlock = ({
  section,
  index,
}: {
  section: DesignSection
  index: number
}) => {
  const meta = humanSectionMeta[section.id]
  const heading = meta?.heading ?? section.title
  const lead = meta?.lead
  const listItems = extractListItems(section.bodyMarkdown)

  const isColor = section.id === 'color'
  const isTypography = section.id === 'typography'
  const isLayout = section.id === 'layout'
  const isElevation = section.id === 'elevation-and-shape'
  const isComponents = section.id.startsWith('components')
  const isPrinciples = section.id === 'principles'
  const isDosDonts = section.id === 'dos-and-donts'

  return (
    <section
      id={section.id}
      className={cx(
        'pb-20',
        index > 0 &&
          'border-t border-neutral-200 pt-16 dark:border-neutral-800'
      )}
    >
      <header className="mb-10">
        <p className={metaLabelClassName}>
          {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="mt-3 text-2xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
          {heading}
        </h2>
        {lead ? <SectionLead>{lead}</SectionLead> : null}
      </header>
      {isPrinciples || isDosDonts ? (
        <PrincipleList items={listItems} />
      ) : null}
      {isColor && section.table ? (
        <ColorSpecimens table={section.table} />
      ) : null}
      {isTypography && section.table ? (
        <TypographySpecimens table={section.table} />
      ) : null}
      {isLayout ? <LayoutSpecimens /> : null}
      {isElevation ? <ShapeSpecimens /> : null}
      {isComponents ? <ComponentSpecimens /> : null}
    </section>
  )
}

export const DesignSystemView = ({
  rule,
  title = rule.title,
  description = rule.description,
}: DesignSystemViewProps) => {
  return (
    <div className="flex flex-col">
      <PageHeader title={title} description={description} spacing="article" />
      <p
        className={`${textColumnClassName} text-xl leading-[1.3] text-neutral-800 dark:text-neutral-200`}
      >
        A living reference for the portfolio&apos;s visual language — how color,
        type, space, and interaction should feel on screen.
      </p>
      <div className="mt-20 flex flex-col">
        {rule.sections.map((section, index) => (
          <DesignSectionBlock
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
