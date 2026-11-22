# bkunz.dev

The personal site of Bernardo Kunz: backend, distributed systems and AI engineering. A static, prerendered React site with a terminal look, technical write-ups of each project and a log of studies, discoveries and daily notes.

**Live:** [bkunz.dev](https://bkunz.dev) · **Languages:** English, Español, Português

## What is in it

| Route | What it shows |
| --- | --- |
| `/` | whoami: a typed terminal session, career track, core competencies and long-form sections |
| `/work` | Roles that expand into a terminal with `specs`, `projects` and `experience` sessions |
| `/projects` | A bento of projects, each with an isometric figure of what it does |
| `/project/:slug` | A technical doc per project: bootstrap, how it works, low level, decisions, files |
| `/posts`, `/post/:slug` | Studies, discoveries and daily notes, each with the date of the work it describes |

Every route exists in three languages (`/`, `/es`, `/pt-br`) and is prerendered to static HTML. `Ctrl K` opens a palette that searches pages, projects, posts and the text of every doc and post section.

## Stack

- **React 19 + TypeScript**, routed by **React Router 8** in framework mode with `ssr: false`: every route is prerendered at build time, the client hydrates and navigates with view transitions.
- **Vite 8** and **Tailwind CSS 4**; design tokens live as CSS custom properties in [`app/app.css`](app/app.css).
- **JetBrains Mono** self-hosted; **Tabler** icons.
- Isometric figures are plain SVG drawn by a small projection kernel ([`app/components/iso/kernel.tsx`](app/components/iso/kernel.tsx)), no image assets.
- Hosted on **Cloudflare Workers Static Assets**; hashed assets are cached as immutable ([`public/_headers`](public/_headers)).

## Run it

```bash
pnpm install
pnpm dev          # http://127.0.0.1:5173
pnpm check        # typecheck + collision lint
pnpm build        # prerendered site in build/client
pnpm preview      # serve the build on :4173
```

Node 26 and pnpm 9 are what it is built with.

## Layout

```text
app/
  root.tsx                 html shell, fonts, dev-only collision probe
  routes.ts                one layout per language; whoami, work, projects, posts, project/:slug, post/:slug
  routes/                  page modules
  components/
    layout/                header, footer, command palette, iris transition, smooth scroll
    home/                  hero, typed terminal, competencies, pinned sections
    docs/                  doc shell with the anchored side panel, blocks, project grid, work timeline
    iso/                   projection kernel, page scenes, project scenes, section scenes
    dev/                   collision probe (development only)
  content/
    copy.ts                interface text in en, es, pt-br
    experience.ts          roles, stack badges, specs, projects, experience
    projects.ts            the project list
    docs/<slug>.ts         one technical doc per project (typed blocks)
    posts/<slug>.ts        one post per file, picked up automatically
    searchIndex.ts         the full-text index the palette loads on demand
scripts/lint-collision.mjs a static check for boxes that can collide
```

## Writing content

- **A post** is a file in `app/content/posts/` exporting a `Post` ([`types.ts`](app/content/posts/types.ts)). `date` is the date of the work it describes; `published` is the day it went live. Set `draft: true` to keep it out of the build.
- **A project doc** is a file in `app/content/docs/` made of typed blocks: paragraphs, code, steps, tables, callouts, files and isometric scenes. Sections are grouped into `start`, `how`, `deep`, `decisions` and `reference`, which is how the side panel lists them.
- Numbers in posts and docs come from a measurement or a cited source, with their conditions.

## Checks

- `pnpm typecheck`: React Router type generation and `tsc --noEmit`.
- `pnpm lint:collision`: fails when an element combines a fixed aspect ratio with a minimum size at the same breakpoint, the pattern that pushes a card into its neighbour.
- In development, a probe outlines in red any sibling boxes that overlap and in orange any box that overflows its parent.

## Deploy

```bash
pnpm ship              # preview on workers.dev
pnpm ship:production   # bkunz.dev and www.bkunz.dev
```

The Worker serves `build/client` with `html_handling: drop-trailing-slash` and the SPA fallback as the 404 page ([`wrangler.jsonc`](wrangler.jsonc)).

## License

Code under the [MIT License](LICENSE). Written content (posts and project docs) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): reuse it with attribution.
