import type { ReactNode } from 'react'

export const metaLabelClassName =
  'font-mono text-xs font-normal uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400'

export const sectionHeadingClassName = `mb-6 ${metaLabelClassName}`

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

export const PageHeader = ({
  title,
  description,
  children,
}: PageHeaderProps) => {
  return (
    <header className="mb-16">
      <h1 className="mb-2 text-2xl font-semibold leading-8 tracking-tighter">
        {title}
      </h1>
      {description ? (
        <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  )
}

type MetaRowProps = {
  label: string
  children: ReactNode
}

export const MetaRow = ({ label, children }: MetaRowProps) => (
  <div className="flex flex-col gap-0.5">
    <dt className={metaLabelClassName}>{label}</dt>
    <dd className="text-sm leading-5 text-neutral-800 dark:text-neutral-200">
      {children}
    </dd>
  </div>
)
