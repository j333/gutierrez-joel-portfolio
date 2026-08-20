# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Next.js 16 (App Router) portfolio + MDX blog. There is no
backend, database, or other service — the only runnable service is the Next.js
web app. Standard commands live in `README.md` and `package.json` scripts; use
those rather than duplicating them here.

- Dev server: `pnpm dev` (Next.js + Turbopack) on `http://localhost:3000`. Run it
  as a long-lived process (e.g. a tmux-backed terminal), not during install.
- Build / prod serve: `pnpm build`, then `pnpm start`.
- Lint: none configured (no `lint` script, no ESLint config). Type checking runs
  implicitly as part of `next build`.
- Tests: none configured (no test framework or test files). End-to-end checking
  means running the dev server and hitting routes: `/`, `/blog`, `/rss`,
  `/sitemap.xml`, `/robots.txt`, `/og?title=...`.

Content pipeline: blog posts are MDX files in `app/blog/posts/` (filename = slug).
Adding a `.mdx` file automatically updates the blog index, RSS feed, and sitemap.

Non-obvious caveats:
- `pnpm install` prints "Ignored build scripts: @vercel/speed-insights, sharp".
  This is expected and does NOT break `pnpm dev` or `pnpm build` (build and OG
  image generation at `/og` both succeed without approving those scripts).
- Known pre-existing code bug (NOT an environment issue): the article route
  `app/blog/[slug]/page.tsx` (and `generateMetadata`) reads `params.slug`
  synchronously, but in Next.js 16 `params` is a Promise. In `next dev` this
  makes individual article pages (`/blog/<slug>`) return 404. The home page,
  blog index, RSS, sitemap, robots, and OG image all work. Fixing requires
  awaiting `params` — out of scope for environment setup.
