import Link from 'next/link'

const navLinkClassName =
  'group flex w-fit items-center font-mono text-xs uppercase leading-4 tracking-wider text-neutral-600 transition-colors hover:text-neutral-900 hover:underline underline-offset-2 dark:text-neutral-400 dark:hover:text-neutral-100'

const navItems = [
  { href: '/', name: 'Home' },
  { href: '/blog', name: 'Writing' },
]

export function Navbar() {
  return (
    <aside className="mb-16">
      <nav
        className="flex flex-row items-center justify-between overflow-x-auto"
        id="nav"
        aria-label="Primary"
      >
        <div className="flex flex-row space-x-5 pr-10">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClassName}>
              {item.name}
            </Link>
          ))}
        </div>
        <a
          href="/Joel_Gutierrez_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClassName}
          aria-label="Resume, opens PDF in a new tab"
        >
          Resume
        </a>
      </nav>
    </aside>
  )
}
