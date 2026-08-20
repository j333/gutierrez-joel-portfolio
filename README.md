# Portfolio: Joel Gutiérrez

Personal website portfolio of Joel Gutierrez, Product Designer, built with Next.js: home, blog, and articles. Content lives in MDX; the rest is App Router, metadata, and SEO.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Geist |
| Content | MDX via `next-mdx-remote` |
| Language | TypeScript |
| Highlighting | sugar-high |
| Tooling | pnpm, PostCSS |
| Hosting | Vercel (Analytics, Speed Insights) |

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/installation)

## Usage

```bash
pnpm install
pnpm dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

| Command      | Purpose                                      |
| ------------ | -------------------------------------------- |
| `pnpm dev`   | Development server                           |
| `pnpm build` | Production build                             |
| `pnpm start` | Serve the production build (run `pnpm build` first) |

## Content

Posts live in `app/blog/posts/`. The filename is the slug (`vim.mdx` → `/blog/vim`).

Minimum frontmatter:

```mdx
---
title: 'Article title'
publishedAt: '2026-08-20'
summary: 'Short description used in listings, RSS, and Open Graph.'
---
```

`image` is optional. If omitted, `/og` generates the Open Graph image from the title.

Publishing a new `.mdx` file updates the blog index, sitemap, and RSS feed automatically.

## Configuration

Before going to production, update:

| What | Where |
| --- | --- |
| Canonical URL | `baseUrl` in `app/sitemap.ts` (SEO, RSS, OG, JSON-LD) |
| Site title and description | `metadata` in `app/layout.tsx` |
| Home | `app/page.tsx` |
| Navigation and footer | `app/components/nav.tsx`, `app/components/footer.tsx` |

## Structure

```
app/
  page.tsx               Home
  layout.tsx             Layout and global metadata
  blog/page.tsx          Index
  blog/[slug]/page.tsx   Article (includes JSON-LD)
  blog/posts/            MDX
  blog/utils.ts          Post loading and dates
  components/            Shared UI
  og/route.tsx           Open Graph images
  rss/route.ts           Feed
  sitemap.ts             Sitemap and baseUrl
  robots.ts
```

## Deploy

The project is set up for Vercel. Analytics and Speed Insights turn on once it is deployed there.

After the first deploy, set `baseUrl` to the live domain.
