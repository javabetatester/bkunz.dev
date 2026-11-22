# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript through React Router framework mode, `ssr: false` with every route prerendered (static HTML for indexing). Tailwind CSS v4, tokens in CSS. Hosted on Cloudflare Workers Static Assets; every hashed static asset cached as immutable. Dev server on port 5173.

## Users

Engineers. Peers who evaluate technical depth: they read the project write-ups and posts, follow on GitHub and X, and reach out to talk or collaborate.

## Product Purpose

The personal site of Bernardo Kunz (bk). It states his premises and ambition in a short whoami, then shows the work: experience, projects (each with a deeply technical write-up) and posts tied to those projects. Success: an engineer leaves knowing what he builds, how he thinks, and where to follow.

## Positioning

Low-level and distributed-systems engineering presented with the rigour of a spec: durable execution, agent runtimes, tool gateways, edge execution, security. Versatile (versatile.sh) is presented as the organisation he founded and builds.

## Capabilities and Constraints

- Languages: en (default, at `/`), es (`/es`), pt-br (`/pt-br`).
- Landing sub-tabs: whoami, work, projects, posts. whoami is brief: premises only, no stack list.
- Project write-ups live on a subdomain, `setup.bkunz.dev/{slug}`, following a docs-style schema (category tag, lede, invocation/usage, ordered steps, rules, outputs, files, prev/next, on-this-page).
- Project selection (2026-11-21): `versatile-sh/connector-engine`, `versatile-sh/live-platform` (both open source by 2026-11-23), `javabetatester/hydra-ensemble` (needs a review pass), `versatile-sh/agents-vault`, `versatile-sh/go-lint`, the versatile.sh organisation and site as a case, and `javabetatester/omarchy-omakase` (renamed from archin-coding; rebuild in progress, docs-site model like setup.gtkatakura.com). Out for now: `burpcli`, `SubdomainRecon`, `JsRecon` (a later Go rebuild in their own repositories, real dates). Each gets an isometric visual chosen per case.
- Posts are tied to projects; none exist yet.
- Links: GitHub `javabetatester`, LinkedIn `bernardokunz`, X `jxstbk`.

## Brand Commitments

- Terminal aesthetic with parallax typing; a monospace, terminal-like face; no serif anywhere.
- Versatile colours (ink, paper, lime, with sky/violet/amber as secondary tones).
- Tab motion follows a settings-style segmented control: content swaps in place, only the selection thumb glides.
- Landing layout: pinned sections; one side stays anchored while the other side's text scrolls, sides alternating section by section.
- Cards are rectangles near 2:1, never squares.
- Laws of UX (Jakob, Fitts, Hick, Miller, Doherty, aesthetic-usability, Prägnanz, peak-end, Zeigarnik, Tesler) are the review bar.

## Evidence on Hand

- Profile README of `javabetatester` (experience, competencies, certifications) and his LinkedIn about text (engines he works on).
- No testimonials, metrics or press beyond what those sources state. Commit dates are never altered to suggest older work.

## Product Principles

1. Show the mechanism, not adjectives: every claim maps to a concrete technique or a public artifact.
2. Engineer-to-engineer voice: precise, short, no hype.
3. Honest provenance: dates, roles and project status are stated as they are.
4. Fast and indexable: static HTML, tiny JS, nothing that blocks reading.
