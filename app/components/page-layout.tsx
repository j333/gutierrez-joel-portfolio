import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  children?: ReactNode
}

export const PageHeader = ({
  title,
  description,
  meta,
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
      {meta}
      {children ? <div className="mt-16">{children}</div> : null}
    </header>
  )
}
