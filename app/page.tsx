import { BlogPosts } from 'app/components/posts'
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
      <div className="mb-16">
        <h1 className="mb-2 text-2xl font-semibold tracking-tighter">
          Joel Gutiérrez
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Product Design Manager
        </p>
      </div>

      <div className="mb-16 space-y-6 leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          {`With years of experience in SaaS and AI-driven products for global
          teams, I collaborate closely with product and engineering to design
          experiences that support product decisions and business goals.`}
        </p>
        <p>
          {`I recently led the design of an AI-powered marketing content
          generation product for global audiences, focused on speed,
          consistency, and quality.`}
        </p>
        <p>
          {`I started at Centric Digital in a junior role and grew into a Senior
          Product Designer, shipping web and mobile products for clients like
          AIG, Kaiser Permanente, Humana, and Victoria's Secret, and leading
          branding work including the Dummies brand. Later I led design for web
          and mobile across Dickey's brands, partnering with cross-functional
          teams to elevate the customer experience and drive ecommerce
          adoption.`}
        </p>
        <p>
          {`At GetGloby I led the platform from MVP to a scalable SaaS product,
          built the design function, and worked with the founders on product
          strategy through the company's acquisition by Marketfully. At
          Marketfully I led the design team and the end-to-end design process,
          shared ownership of objectives with product and engineering, and
          guided exploratory work on AI-based solutions alongside AI engineers.`}
        </p>
        <p>
          {`I'm currently open to my next role.`}
        </p>
      </div>

      <h2 className="mb-6 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Experience
      </h2>
      <ul className="mb-16 space-y-8">
        {places.map((place) => (
          <li key={place.name} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex flex-col">
              <a
                href={place.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center font-medium text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 w-fit mb-1"
              >
                {place.name}
                <ArrowIcon className="ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 leading-snug">
                {place.role}
              </span>
            </div>
            <span className="mt-2 sm:mt-0 shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {place.years}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mb-6 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Capabilities
      </h2>
      <ul className="mb-16 grid grid-cols-2 gap-y-3 sm:grid-cols-3">
        {skills.map((skill) => (
          <li key={skill} className="text-sm text-neutral-600 dark:text-neutral-400">
            {skill}
          </li>
        ))}
      </ul>

      <h2 className="mb-6 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Education
      </h2>
      <ul className="mb-16 space-y-8">
        <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Graphic Design
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Universidad Nacional de Cuyo
            </span>
          </div>
          <span className="mt-2 sm:mt-0 shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            2008-2013
          </span>
        </li>
        <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Languages
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              English (C1), Spanish (native)
            </span>
          </div>
        </li>
      </ul>

      <h2 className="mb-6 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Writing
      </h2>
      <div className="mb-16">
        <BlogPosts />
      </div>
    </section>
  )
}
