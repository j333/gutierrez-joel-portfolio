export const groupHoverTextClassName =
  'transition-colors group-hover:text-black group-focus-visible:text-black dark:group-hover:text-white dark:group-focus-visible:text-white'

export const chromeLinkSharedClassName =
  'group inline-flex w-fit items-center rounded-sm px-1 py-1 font-mono text-xs leading-4 text-neutral-600 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 aria-[current=page]:text-neutral-900 dark:text-neutral-400 dark:focus-visible:outline-neutral-100 dark:aria-[current=page]:text-neutral-100'

export const chromeLinkBaseClassName =
  `${chromeLinkSharedClassName} transition-colors hover:text-black hover:underline underline-offset-2 aria-[current=page]:hover:text-black dark:hover:text-white dark:aria-[current=page]:hover:text-white`

export const chromeLinkClassName = `${chromeLinkBaseClassName} uppercase tracking-wider`

export const chromeLinkNavClassName =
  `${chromeLinkSharedClassName} uppercase tracking-wider transition-colors hover:text-black aria-[current=page]:hover:text-black dark:hover:text-white dark:aria-[current=page]:hover:text-white`

export const cardTitleClassName =
  `text-sm font-medium leading-5 text-neutral-800 dark:text-neutral-200 ${groupHoverTextClassName}`

export const navTextClassName =
  'font-mono text-xs uppercase leading-4 tracking-wider text-neutral-600 group-hover:text-black dark:text-neutral-400 dark:group-hover:text-white'

export const ctaLinkClassName =
  'rounded-sm text-sm leading-5 text-neutral-500 underline underline-offset-4 outline-none transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100'
