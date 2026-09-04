import type { ReactNode } from 'react'

export const textColumnClassName = 'w-full max-w-xl'
export const articleBodyClassName = `${textColumnClassName} mx-auto`

export const metaLabelClassName =
  'font-mono text-xs font-normal uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400'

export const typeMetaClassName =
  'font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400'

export const metaListClassName =
  'grid w-full [grid-template-columns:repeat(auto-fill,minmax(min(100%,12rem),1fr))] gap-x-8 gap-y-4'

export const metaValueClassName =
  'whitespace-nowrap text-sm leading-5 text-neutral-800 dark:text-neutral-200'

export const pageTitleClassName =
  'text-3xl font-normal leading-9 tracking-tighter'

export const pageSectionClassName = 'mb-16'

export const sectionHeadingClassName = `mb-8 ${metaLabelClassName}`

type PageHeaderSpacing = 'section' | 'article' | 'hero'

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  spacing?: PageHeaderSpacing
}

const pageHeaderSpacingClassName: Record<PageHeaderSpacing, string> = {
  section: 'mb-8',
  article: 'mb-12',
  hero: 'mb-16',
}

export const PageHeader = ({
  title,
  description,
  children,
  spacing = 'article',
}: PageHeaderProps) => {
  return (
    <header className={pageHeaderSpacingClassName[spacing]}>
      <h1 className={`mb-2 ${pageTitleClassName}`}>
        {title}
      </h1>
      {description ? (
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  )
}

type MetaRowProps = {
  label: string
  children: ReactNode
}

export const MetaRow = ({ label, children }: MetaRowProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className={`whitespace-nowrap ${metaLabelClassName}`}>{label}</dt>
      <dd className={metaValueClassName}>{children}</dd>
    </div>
  )
}
