---
name: new-writing-post
description: Publish a new writing article as MDX with a 1920×1080 WebP cover. Use when adding a writing post, blog article, or MDX in app/writing/posts.
---

# New writing post

Copy [app/writing/posts/my-2026-tool-stack.mdx](app/writing/posts/my-2026-tool-stack.mdx) for tone, headings, captions, and `#wide` in-body images. Read [`.cursor/rules/optimized-images.mdc`](.cursor/rules/optimized-images.mdc). Do not edit `/writing`, the sitemap, or `app/page.tsx` — `getWritingPosts()` picks up the file.

## Checklist

1. Slug = filename (`my-slug.mdx` → `/writing/my-slug`). English body.
2. Cover: `pnpm optimize-cover -- <input> public/writing/<slug>/cover.webp`. Source must be at least 1920×1080. Chat attachments at 1024px are not a source.
3. Every other raster image: `pnpm optimize-image -- <input> public/writing/<slug>/<name>.webp --max 1600` (column) or `--max 1920` (screenshot / `#wide`). Output is always `.webp`.
4. Write `app/writing/posts/<slug>.mdx` with the template below. Do not put the cover in the markdown body.
5. Frontmatter and `![]()` paths are `.webp` only.

```mdx
---
title: 'Article title'
publishedAt: '2026-08-20'
summary: 'Short description used in listings and Open Graph.'
image: '/writing/my-slug/cover.webp'
---

Opening paragraph.

![Alt text](/writing/my-slug/name.webp "Caption")
```

`medium` is optional. If set, Medium’s canonical URL should be this site’s `/writing/<slug>`.
