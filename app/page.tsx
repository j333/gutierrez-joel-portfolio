import { BlogPosts } from 'app/components/posts'

const places = [
  {
    name: 'Marketfully',
    href: 'https://marketfully.com/',
    role: 'Product Design Manager. Design leadership, product definition, AI exploration.',
    years: '2025-2026',
  },
  {
    name: 'GetGloby',
    href: 'https://getgloby.ai/',
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
    href: 'https://www.centricdigital.com/',
    role: "Senior Product Designer. Enterprise and startup work (AIG, Kaiser Permanente, Humana, Victoria's Secret, Dummies).",
    years: '2014-2021',
  },
]

const skills = [
  'Product Design',
  'Design Systems',
  'Product Strategy',
  'UX Design',
  'User Research',
  'Team Leadership',
  'AI Products',
  'Branding',
]

export default function Page() {
  return (
    <section>
      <h1 className="mb-2 text-2xl font-semibold tracking-tighter">
        Joel Gutiérrez
      </h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        Product Design Manager
      </p>

      <div className="mb-8 space-y-4">
        <p className="mb-4">
          {`With years of experience in SaaS and AI-driven products for global
          teams, I collaborate closely with product and engineering to design
          experiences that support product decisions and business goals.`}
        </p>
        <p className="mb-4">
          {`I recently led the design of an AI-powered marketing content
          generation product for global audiences, focused on speed,
          consistency, and quality.`}
        </p>
        <p className="mb-4">
          {`I started at Centric Digital in a junior role and grew into a Senior
          Product Designer, shipping web and mobile products for clients like
          AIG, Kaiser Permanente, Humana, and Victoria's Secret, and leading
          branding work including the Dummies brand. Later I led design for web
          and mobile across Dickey's brands, partnering with cross-functional
          teams to elevate the customer experience and drive ecommerce
          adoption.`}
        </p>
        <p className="mb-4">
          {`At GetGloby I led the platform from MVP to a scalable SaaS product,
          built the design function, and worked with the founders on product
          strategy through the company's acquisition by Marketfully. At
          Marketfully I led the design team and the end-to-end design process,
          shared ownership of objectives with product and engineering, and
          guided exploratory work on AI-based solutions alongside AI engineers.`}
        </p>
        <p className="mb-4">
          {`I'm currently open to my next role.`}
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        Places I&apos;ve worked
      </h2>
      <ul className="mb-8 space-y-3">
        {places.map((place) => (
          <li key={place.name} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <p>
              <a
                href={place.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                {place.name}
              </a>
              <span className="text-neutral-600 dark:text-neutral-400">
                {' '}
                {place.role}
              </span>
            </p>
            <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
              {place.years}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        What I work on
      </h2>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        {skills.join(' · ')}
      </p>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Education</h2>
      <ul className="mb-8 space-y-3">
        <li className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <p>
            <span className="font-medium">Graphic Design</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              {' '}
              Universidad Nacional de Cuyo.
            </span>
          </p>
          <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
            2008-2013
          </span>
        </li>
        <li>
          <p>
            <span className="font-medium">Languages</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              {' '}
              English (C1), Spanish (native).
            </span>
          </p>
        </li>
      </ul>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Writing</h2>
      <div className="mb-8">
        <BlogPosts />
      </div>
    </section>
  )
}
