# [gutierrezjoel.com](https://www.gutierrezjoel.com)

This repository is the source for [gutierrezjoel.com](https://www.gutierrezjoel.com), my personal website as a Product Design Manager. It is a small, content-first portfolio: project cases on the home page, an about page with experience, and writing.

I author the content in MDX. Routing, metadata, theming, and SEO live in the Next.js App Router. I designed and built it in Cursor with Next.js and Tailwind CSS, typeset in IBM Plex, and hosted it on Vercel.

The code is open if you want to learn from it or use it as a starting point. If you do, a mention in your site credits is appreciated :)

![Homepage of gutierrezjoel.com](docs/preview.png)

## Stack


| Layer        | Choice                                                          |
| ------------ | --------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router)                                         |
| UI           | React 19, Tailwind CSS v4, IBM Plex Sans and Mono               |
| Content      | MDX via `next-mdx-remote`                                       |
| Language     | TypeScript                                                      |
| Highlighting | sugar-high                                                      |
| Theming      | Light and dark (stored in `localStorage`; first visit follows the system) |
| Images       | WebP in content folders; `next/image` with AVIF then WebP       |
| Tooling      | pnpm 11, PostCSS, Sharp (cover and in-article scripts)          |
| Hosting      | Vercel                                                          |




## Requirements

- Node.js 24
- [pnpm](https://pnpm.io/installation) 11



## Usage

```bash
pnpm install
pnpm dev
```

The site runs at [http://localhost:3000](http://localhost:3000). The dev server binds to `0.0.0.0` so other devices on the same network can load it.


| Command               | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `pnpm dev`            | Development server                                  |
| `pnpm build`          | Production build                                    |
| `pnpm start`          | Serve the production build (run `pnpm build` first) |
| `pnpm optimize-cover` | Crop a source image to a 1920×1080 WebP cover       |
| `pnpm optimize-image` | Convert a source image to WebP at a max width       |




## Content

Projects, writing, and experience are MDX collections. The filename is the slug. A new `.mdx` file updates the matching index, the sitemap, `llms.txt`, and the markdown mirrors automatically. The home page lists every project, sorted by `order`.

Every content image on the site is **WebP**. Convert PNG/JPEG sources with the scripts below; do not commit those formats to `public/projects` or `public/writing`. Platform icons (`favicon.ico`, PWA PNGs) are the exception.

HTML pages advertise a `text/markdown` alternate. Append `.md` to a URL (`/jaga.md`, `/writing/liquid-glass.md`, `/about.md`, `/index.md`) for a machine-readable version. [`/llms.txt`](https://www.gutierrezjoel.com/llms.txt) is an index of those files; [`/llms-full.txt`](https://www.gutierrezjoel.com/llms-full.txt) concatenates about, cases, and writing.

### Images

Covers (project and article) are the same 16:9 frame as the home cards: **1920×1080** WebP. The scripts crop to center and never upscale. If the source is smaller than 1920×1080, export a larger file first.

```bash
pnpm optimize-cover -- photo.jpg public/projects/<slug>/cover.webp
pnpm optimize-cover -- photo.jpg public/writing/<slug>/cover.webp
pnpm optimize-image -- shot.png public/writing/<slug>/name.webp --max 1600
pnpm optimize-image -- shot.png public/writing/<slug>/name.webp --max 1920
```

In-article photos are also WebP: max **1600px** in the text column, max **1920px** for UI screenshots or `#wide` breakouts. Do not force those to 16:9.

### Projects

Cases live in `app/projects/posts/`. `jaga.mdx` becomes `/jaga`. They sort by `order` (lower first) on `/`. The page renders the cover from frontmatter; do not repeat it as the first image in the body.

Do not use these slugs: `about`, `writing`, `experience`, `og`, `md`.

Minimum frontmatter:

```mdx
---
title: 'Project name'
startedAt: '2022'
endedAt: '2025'
order: 1
image: '/projects/my-slug/cover.webp'
product: 'Product name'
summary: 'Short description used in listings and Open Graph.'
deliverable: 'AI product'
role: 'Product Design Manager'
industry: 'Marketing / SaaS'
---
```


| Field         | Required | Notes                                                              |
| ------------- | -------- | ------------------------------------------------------------------ |
| `title`       | Yes      | Page title and home card heading                                   |
| `startedAt`   | Yes      | Year (`YYYY`). Listing range and sort fallback                     |
| `endedAt`     | Yes      | Year (`YYYY`). Listing range and sitemap                           |
| `order`       | Yes      | Integer. Home grid order; bump the others if this case goes first  |
| `image`       | Yes      | Cover at `/projects/<slug>/cover.webp` (1920×1080)                 |
| `product`     | Yes      | Brand on the case metadata grid                                    |
| `deliverable` | Yes      | Deliverable on the case metadata grid and in the meta description  |
| `summary`     | No       | Card/page subtitle, meta description, and Open Graph               |
| `role`        | No       | Metadata grid on the case page                                     |
| `industry`    | No       | Metadata grid on the case page                                     |


Each case includes JSON-LD (`CreativeWork`). Copy [jaga.mdx](app/projects/posts/jaga.mdx) or [marketfully.mdx](app/projects/posts/marketfully.mdx) for tone and internal links.

### Writing

Posts live in `app/writing/posts/`. `liquid-glass.mdx` becomes `/writing/liquid-glass`. The index is `/writing`. Posts sort by `publishedAt`, newest first. The page and the writing cards render the cover from frontmatter; do not repeat it as the first `![]()` in the body.

Minimum frontmatter:

```mdx
---
title: 'Article title'
publishedAt: '2026-08-20'
summary: 'Short description used in listings and Open Graph.'
image: '/writing/my-slug/cover.webp'
---
```


| Field         | Required | Notes                                                                                                      |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `title`       | Yes      | Page title and listing heading                                                                             |
| `publishedAt` | Yes      | `YYYY-MM-DD`. Listings show month and year                                                                 |
| `summary`     | Yes      | Listing subtitle, meta description, and Open Graph                                                         |
| `image`       | Yes      | Cover at `/writing/<slug>/cover.webp` (1920×1080)                                                          |
| `medium`      | No       | Medium URL for a “View on Medium” link. Set Medium’s canonical link to the matching `/writing/<slug>` page |


Each article includes JSON-LD (`BlogPosting`). Old `/blog` URLs redirect permanently to `/writing`. Copy [my-2026-tool-stack.mdx](app/writing/posts/my-2026-tool-stack.mdx) for structure.

### Experience

Entries live in `app/experience/posts/`. `marketfully.mdx` becomes `/experience/marketfully`. There is no experience index: `/experience` redirects to `/about`, and About lists every entry (title, summary, year range), sorted by `endedAt`, then `startedAt`, newest first.

The entry page shows a metadata grid (role, type, industry, mode, start, end). Related client work can be injected from `app/experience/projects.ts` at a `<!-- selected-work -->` marker in the MDX.

Minimum frontmatter:

```mdx
---
title: 'Company or project'
startedAt: '2022'
endedAt: '2025'
summary: 'Short description used in listings and Open Graph.'
---
```


| Field       | Required | Notes                                                                              |
| ----------- | -------- | ---------------------------------------------------------------------------------- |
| `title`     | Yes      | Company or project name                                                            |
| `startedAt` | Yes      | Year (`YYYY`). Used for listing range and sort                                     |
| `endedAt`   | Yes      | Year (`YYYY`). Used for listing range, sort, and sitemap                           |
| `summary`   | Yes      | Listing subtitle, meta description, and Open Graph                                 |
| `role`      | No       | Shown on the entry page                                                            |
| `type`      | No       | e.g. Full-time, Project                                                            |
| `industry`  | No       | Shown on the entry page                                                            |
| `workplace` | No       | Shown as Mode (Remote, Hybrid, On-site)                                            |
| `startedOn` | No       | `YYYY-MM`. Finer start date on the entry page; falls back to `startedAt`           |
| `endedOn`   | No       | `YYYY-MM`. Finer end date on the entry page; falls back to `endedAt`, then Present |
| `image`     | No       | Open Graph image. If omitted, `/og` generates one from the title                   |


Each entry includes JSON-LD (`OrganizationRole`). Old `/experience/getgloby` URLs redirect to Marketfully. Old Golf Boost and Rehab Boost experience URLs redirect to the Golf Boost project. `/experience/vina-errazuriz` redirects to About.

## Configuration


| What                                 | Where                                              |
| ------------------------------------ | -------------------------------------------------- |
| Canonical URL, title, and description | `site` in `app/lib/site.ts` (SEO, OG, JSON-LD)    |
| About bio, skills, education         | `app/lib/about-data.ts`                            |
| Home                                 | `app/page.tsx`                                     |
| Navigation, theme toggle, and resume | `app/components/nav.tsx`                           |
| Footer                               | `app/components/footer.tsx`                        |
| Resume PDF                           | `public/Joel_Gutierrez_Resume.pdf`                 |
| Redirects and `.md` rewrites         | `next.config.mjs`                                  |




## Structure

```
app/
  page.tsx                    Home (bio + project cards)
  layout.tsx                  Layout, fonts, and global metadata
  about/page.tsx              About (bio, experience list, skills)
  [slug]/page.tsx             Project case (includes JSON-LD)
  writing/page.tsx            Writing index
  writing/[slug]/page.tsx     Article (includes JSON-LD)
  writing/posts/              Writing MDX
  writing/utils.ts            Post loading and dates
  projects/posts/             Project MDX
  projects/utils.ts           Project loading and sort
  experience/[slug]/page.tsx  Experience entry (includes JSON-LD)
  experience/posts/           Experience MDX
  experience/utils.ts         Entry loading and sort
  experience/projects.ts      Client work listed on some entries
  components/                 Shared UI (nav, theme, MDX, listings)
  lib/site.ts                 Canonical URL, copy, JSON-LD person
  lib/about-data.ts           About page copy
  lib/theme.ts                Light / dark theme
  lib/llms.ts                 Markdown mirrors, llms.txt, llms-full.txt
  md/[[...path]]/route.ts     Serves `/index.md`, `/about.md`, `/*.md`
  llms.txt/route.ts
  llms-full.txt/route.ts
  og/route.tsx                Fallback Open Graph images
  sitemap.ts
  robots.ts
  manifest.ts
scripts/
  optimize-cover.mjs
  optimize-image.mjs
```



## Deploy

The project is set up for Vercel. `site.url` in `app/lib/site.ts` already matches the live domain. If you deploy your own copy, point it at yours.

## Using this project

The code is there to learn from or use as a starting point. The writing, experience, images, resume, and home copy are mine. If you fork the repo, replace:

- `app/writing/posts/`
- `app/projects/posts/`
- `app/experience/posts/`
- `app/experience/projects.ts`
- `app/lib/about-data.ts`
- `public/writing/`
- `public/projects/`
- `public/Joel_Gutierrez_Resume.pdf`
- Home copy in `app/page.tsx`
- Site title, description, and social links in `app/lib/site.ts`

If you use it, a mention in your site credits is appreciated. Something like:

> Built from [gutierrezjoel.com](https://www.gutierrezjoel.com) by Joel Gutiérrez.


## Contributing

This is a personal site. I'm not looking for features, pull requests, or anything along those lines.

## License

MIT. See [LICENSE](LICENSE).

## Contact

- [gutierrezjoel.com](https://www.gutierrezjoel.com)
- [LinkedIn](https://linkedin.com/in/gutierrezjoel)
- [GitHub](https://github.com/j333/gutierrez-joel-portfolio/)
