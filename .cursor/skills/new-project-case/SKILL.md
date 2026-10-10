---
name: new-project-case
description: Publish a new project case as MDX with a 1920×1080 WebP cover. Use when adding a project, case study, or MDX in app/projects/posts.
---

# New project case

Copy [app/projects/posts/en/jaga.mdx](app/projects/posts/en/jaga.mdx) and [app/projects/posts/en/marketfully.mdx](app/projects/posts/en/marketfully.mdx) for tone and internal links. Read [`.cursor/rules/optimized-images.mdc`](.cursor/rules/optimized-images.mdc). Do not edit `app/[lang]/page.tsx` or the sitemap. `getListedProjects(locale)` paints the home grid. Add `listed: false` to keep a case off home, sitemap, `llms.txt`, and JSON-LD work examples; the slug page still ships. Write the same slug in `en` and `es`. Never use an em dash (—) in published copy. Prefer commas, periods, colons, or parentheses.

## Checklist

1. Slug = filename (`my-slug.mdx` → `/en/my-slug` and `/es/my-slug`). Reserved: `about`, `writing`, `experience`, `og`, `md`, `design`, `en`, `es`. Write `app/projects/posts/en/<slug>.mdx` and `app/projects/posts/es/<slug>.mdx`.
2. `order`: integer, lower first. If this case goes on top, increment `order` on the other project MDX files. Skip bumping others when `listed: false`.
3. Cover: `pnpm optimize-cover -- <input> public/projects/<slug>/cover.webp`. Source must be at least 1920×1080. Chat attachments at 1024px are not a source.
4. Any extra raster in the body: `pnpm optimize-image -- <input> public/projects/<slug>/<name>.webp --max 1920`. Output is always `.webp`.
5. Write `app/projects/posts/en/<slug>.mdx` and `app/projects/posts/es/<slug>.mdx` with the template below. Do not repeat the cover as the first `![]()`. The page already renders `image`. Internal links stay unprefixed (`/getgloby`); the site adds `/en` or `/es`. `##` headings become the sticky index (needs 3 or more). Keep those headings as plain text. Use `###` for Problem and Opportunity so they stay in the column and out of the index.
6. Link related cases (`/getgloby`, `/marketfully`, `/jaga`) when the story connects. Do not put markdown links inside `Fact` or `Flow`. JSX children are not parsed as markdown.
7. Optional: `listed: false` to keep the case off home and other listings. Omit the field to list it.
8. Stand-in art, until a real export exists: `pnpm placeholder-image -- public/projects/<slug>/<name>.webp --label "Scene name" --size 1920x1080`. Use `1200x1500` for a phone flow. The script gitignores that file, so it shows in `next dev` and stays off deploys. The case still renders the caption text without the image. Replace it later with `pnpm optimize-image` or `pnpm optimize-cover` at the same path. That removes the ignore so the real file can ship. Do not change the MDX path.

## Case shape

Order: question (`##`) and three `Fact`s, then `### Problem` and `### Opportunity`, then solution (`##`) with `Label` and two to four `Flow`s, then process (`##`), a trade-off (`##` plus a blockquote), and `## What I learned` with two `Fact`s. Write the same headings, in Spanish, in `es`.

- `Facts` / `Fact`: a 3-column grid. `title` is the short label. The child is one line.
- `Flows` / `Flow`: a column grid that breaks out of the reading column. Each `Flow` is an image with title and one line below it. Two flows make two columns; three or more make three. Always wrap `Flow`s in `Flows`. `src`, `alt`, and `title` are required.
- `Label`: a mono eyebrow above a group of flows.
- Wide images stay `![](/projects/<slug>/<name>.webp#wide "Caption")`.

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

## Question that defines the case?

One or two sentences.

<Facts>
  <Fact title="Focus">One line.</Fact>
  <Fact title="Constraint">One line.</Fact>
  <Fact title="Outcome">One line.</Fact>
</Facts>

### Problem: short claim.

Paragraph.

![Alt](/projects/my-slug/problem.webp#wide "Caption.")

### Opportunity: short claim.

<Facts>
  <Fact title="Reason">One line.</Fact>
  <Fact title="Reason">One line.</Fact>
  <Fact title="Reason">One line.</Fact>
</Facts>

## What we built.

<Label>Core flows</Label>

<Flows>
  <Flow src="/projects/my-slug/flow-1.webp" alt="Descriptive alt" title="Flow name">One line.</Flow>
  <Flow src="/projects/my-slug/flow-2.webp" alt="Descriptive alt" title="Flow name">One line.</Flow>
  <Flow src="/projects/my-slug/flow-3.webp" alt="Descriptive alt" title="Flow name">One line.</Flow>
</Flows>

## What we were willing to trade

> The decision, in one sentence.

## What I learned

<Facts>
  <Fact title="Lesson">One line.</Fact>
  <Fact title="Lesson">One line.</Fact>
</Facts>
```
