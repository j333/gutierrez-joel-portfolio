---
name: new-project-case
description: Publish a new project case as MDX with a 1920×1080 WebP cover. Use when adding a project, case study, or MDX in app/projects/posts.
---

# New project case

Copy [app/projects/posts/jaga.mdx](app/projects/posts/jaga.mdx) and [app/projects/posts/marketfully.mdx](app/projects/posts/marketfully.mdx) for tone and internal links. Read [`.cursor/rules/optimized-images.mdc`](.cursor/rules/optimized-images.mdc). Do not edit `app/page.tsx` or the sitemap. `getListedProjects()` paints the home grid. Add `listed: false` to keep a case off home, sitemap, `llms.txt`, and JSON-LD work examples; the slug page still ships. Never use an em dash (—) in published copy. Prefer commas, periods, colons, or parentheses.

## Checklist

1. Slug = filename (`my-slug.mdx` → `/my-slug`). Reserved: `about`, `writing`, `experience`, `og`, `md`, `design`. English body.
2. `order`: integer, lower first. If this case goes on top, increment `order` on the other project MDX files. Skip bumping others when `listed: false`.
3. Cover: `pnpm optimize-cover -- <input> public/projects/<slug>/cover.webp`. Source must be at least 1920×1080. Chat attachments at 1024px are not a source.
4. Any extra raster in the body: `pnpm optimize-image -- <input> public/projects/<slug>/<name>.webp --max 1920`. Output is always `.webp`.
5. Write `app/projects/posts/<slug>.mdx` with the template below. Do not repeat the cover as the first `![]()`. The page already renders `image`.
6. Link related cases (`/getgloby`, `/marketfully`, `/jaga`) when the story connects.
7. Optional: `listed: false` to keep the case off home and other listings. Omit the field to list it.

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
type: 'Full-time'
industry: 'Marketing / SaaS'
---

Opening paragraph.

## Section
```
