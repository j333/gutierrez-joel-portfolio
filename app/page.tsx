import { ArrowIcon } from 'app/components/arrow-icon'

export const dynamic = 'force-static'

const places = [
  {
    name: 'Marketfully',
    href: 'https://marketfully.com/',
    role: 'Product Design Manager. Design leadership, product definition, AI exploration.',
    years: '2025-2026',
  },
  {
    name: 'GetGloby',
    role: 'Principal Product Designer. MVP to scalable SaaS; built the design function.',
    years: '2022-2025',
  },
  {
    name: "Dickey's Barbecue",
    href: 'https://www.dickeys.com/',
    role: 'Senior Product Designer. Web and mobile across brands; ecommerce.',
    years: '2021',
  },
  {
    name: 'Centric Digital',
    role: (
      <>
        Senior Product Designer for enterprise and startup clients, including{' '}
        <em>AIG</em>, <em>Kaiser Permanente</em>, <em>Humana</em>,{' '}
        <em>Victoria&apos;s Secret</em>, and <em>Dummies</em>.
      </>
    ),
    years: '2014-2021',
  },
]

const skills = [
  'Product Design',
  'Product Strategy',
  'Team Leadership',
  'Design Systems',
  'AI Products',
  'UX Design',
  'User Research',
  'Branding',
]

const sectionHeadingClassName =
  'mb-6 font-mono text-xs font-normal uppercase leading-4 tracking-wider text-neutral-500 dark:text-neutral-400'

export default function Page() {
  return (
    <>
      <header className="mb-16">
        <h1 className="mb-2 text-2xl font-semibold leading-8 tracking-tighter">
          Joel Gutiérrez
        </h1>
        <p className="text-base leading-6 text-neutral-600 dark:text-neutral-400">
          Product Design Manager
        </p>
        <div className="mt-16 space-y-6 text-base leading-6 text-neutral-800 dark:text-neutral-200">
          <p>
            I design scalable digital experiences that align product strategy
            with business goals. My track record ranges from building design
            teams and taking startups from MVP to acquisition (<em>GetGloby →
            Marketfully</em>), to shipping enterprise solutions for global
            brands like <em>AIG</em> and <em>Victoria&apos;s Secret</em>.
          </p>
          <p>
            I&apos;m currently working on new experimental personal projects
            and open to new opportunities.
          </p>
        </div>
      </header>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Experience</h2>
        <ul className="space-y-8">
          {places.map((place) => (
            <li
              key={place.name}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <div className="flex flex-col">
                {place.href ? (
                  <a
                    href={place.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mb-1 flex w-fit items-center font-medium text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4"
                    aria-label={`${place.name}, opens in a new tab`}
                  >
                    {place.name}
                    <ArrowIcon className="ml-1.5 opacity-50 transition-opacity group-hover:opacity-100" />
                  </a>
                ) : (
                  <span className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {place.name}
                  </span>
                )}
                <span className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                  {place.role}
                </span>
              </div>
              <span className="mt-2 shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400 sm:mt-0">
                {place.years}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Capabilities</h2>
        <ul className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
          {skills.map((skill) => (
            <li
              key={skill}
              className="text-sm leading-5 text-neutral-600 dark:text-neutral-400"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Education</h2>
        <ul className="space-y-8">
          <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex flex-col">
              <span className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">
                Graphic Design
              </span>
              <span className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                Universidad Nacional de Cuyo
              </span>
            </div>
            <span className="mt-2 shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400 sm:mt-0">
              2008-2013
            </span>
          </li>
          <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex flex-col">
              <span className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">
                Languages
              </span>
              <span className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                English (C1), Spanish (native)
              </span>
            </div>
          </li>
        </ul>
      </section>
    </>
  )
}
