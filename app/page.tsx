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
    role:
      "Senior Product Designer for enterprise and startup clients, including AIG, Kaiser Permanente, Humana, Victoria's Secret, and Dummies.",
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

const yearRangeClassName =
  'mt-2 shrink-0 font-mono text-xs leading-4 text-neutral-500 dark:text-neutral-400 sm:mt-0'

const YearRange = ({ years }: { years: string }) => {
  const [start, end] = years.split('-')

  if (!end) {
    return (
      <time dateTime={start} className={yearRangeClassName}>
        {years}
      </time>
    )
  }

  return (
    <span className={yearRangeClassName}>
      <time dateTime={start}>{start}</time>
      -
      <time dateTime={end}>{end}</time>
    </span>
  )
}

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
            teams and taking startups from MVP to acquisition (GetGloby →
            Marketfully), to shipping enterprise solutions for global brands
            like AIG and Victoria&apos;s Secret.
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
                <h3 className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                  {place.href ? (
                    <a
                      href={place.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-fit items-center hover:underline underline-offset-4"
                      aria-label={`${place.name}, opens in a new tab`}
                    >
                      {place.name}
                      <ArrowIcon className="ml-1.5 opacity-50 transition-opacity group-hover:opacity-100" />
                    </a>
                  ) : (
                    place.name
                  )}
                </h3>
                <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                  {place.role}
                </p>
              </div>
              <YearRange years={place.years} />
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
              <h3 className="mb-1 text-base font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                Graphic Design
              </h3>
              <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                Universidad Nacional de Cuyo
              </p>
            </div>
            <YearRange years="2008-2013" />
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className={sectionHeadingClassName}>Languages</h2>
        <ul className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
          <li className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
            English (C1)
          </li>
          <li className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
            Spanish (native)
          </li>
        </ul>
      </section>
    </>
  )
}
