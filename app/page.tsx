import { BlogPosts } from 'app/components/posts'

const places = [
  {
    name: 'Marketfully',
    href: 'https://marketfully.com/',
    role: 'Product Design Manager. Design leadership, product definition, AI exploration.',
    years: '2025–2026',
  },
  {
    name: 'GetGloby',
    href: 'https://getgloby.ai/',
    role: 'Principal Product Designer. MVP → scalable SaaS; built the design function.',
    years: '2022–2025',
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
    role: 'Senior Product Designer. Enterprise and startup work (AIG, Kaiser, Humana, Dummies).',
    years: '2014–2021',
  },
]

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Joel Gutiérrez
      </h1>

      <div className="mb-8 space-y-4">
        <p className="mb-4">
          {`I'm a Product Design Manager. I design SaaS and AI products for global
          teams—leading design end to end, shaping product direction with product
          and engineering, and exploring AI-based solutions with AI engineers.`}
        </p>
        <p className="mb-4">
          {`I started at Centric Digital in a junior role and grew into a Senior
          Product Designer, shipping web and mobile products for clients like AIG,
          Kaiser Permanente, and Humana, and leading branding work including the
          Dummies brand. Later I led design for web and mobile across Dickey's
          brands, partnering with cross-functional teams to elevate the customer
          experience and drive ecommerce adoption.`}
        </p>
        <p className="mb-4">
          {`At GetGloby I led the platform from MVP to a scalable SaaS product,
          built the design function, and worked with the founders on product
          strategy through the company's acquisition by Marketfully. Today I lead
          design at Marketfully—contributing to product definition and
          prioritization, owning objectives with product and engineering, and
          guiding exploratory work on AI-based solutions.`}
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
                — {place.role}
              </span>
            </p>
            <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
              {place.years}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Elsewhere</h2>
      <ul className="mb-8">
        <li>
          <a
            href="https://linkedin.com/in/gutierrezjoel"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            LinkedIn
          </a>
          <span className="text-neutral-600 dark:text-neutral-400">
            {' '}
            — The professional one.
          </span>
        </li>
      </ul>

      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
