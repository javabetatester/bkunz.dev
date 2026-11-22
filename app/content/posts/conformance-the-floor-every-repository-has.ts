import type { Post } from "./types";

const post: Post = {
  slug: "conformance-the-floor-every-repository-has",
  category: "daily",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "The floor every repository has",
  summary: "bin/conformance lists what each repository of the organization misses from one baseline: Dependabot, Semgrep pinned by tag, lefthook, licence, README lint, go-lint.",
  tags: ["harness", "conformance", "semgrep", "dependabot"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "A standard only a reviewer remembers",
      blocks: [
        { kind: "p", text: "A new repository gets the baseline if the person creating it remembers all of it. Otherwise it quietly does not. The rule file for the baseline says it plainly: the floor is the same everywhere, and a machine says where it is not. Pull request #192 added `bin/conformance` on 2026-11-21." },
      ],
    },
    {
      id: "floor",
      title: "The floor",
      blocks: [
        { kind: "table", head: ["Piece", "What counts"], rows: [
          ["Dependabot", "A `dependabot.yml` with one entry per ecosystem present, weekly, minor and patch grouped"],
          ["Semgrep", "A target in the check command: registry packs for the repository's languages plus the shared rules loaded by URL at a tag; code-free repositories run the secrets pack only"],
          ["Gate shape", "`--baseline-commit` on the merge base with `origin/main`, so a branch fails only on findings it adds"],
          ["lefthook", "Pre-push runs the check command"],
          ["Hygiene", "LICENSE everywhere, SECURITY.md in products, a README that passes the lint"],
          ["go-lint", "In every Go repository's check"],
          ["Check command", "A `mise.toml` with the check task and no Makefile with real targets"],
          ["Branch cleanup", "Delete-branch-on-merge switched on"],
        ] },
        { kind: "p", text: "Two details I like. Shared Semgrep rules are referenced by tag URL and never copied, so adopting a new rule means changing one line. And the scan is local: a workflow may exist for when CI returns, but never as the only gate." },
      ],
    },
    {
      id: "tool",
      title: "How the tool works",
      blocks: [
        { kind: "code", lang: "text", code: "bin/conformance [--org <org>] [--only <repo>,...] [--json]\nbin/conformance --summary [--cached <hours>]\nbin/conformance --repo <dir> [--name <repo>]" },
        { kind: "p", text: "Without arguments it reads every non-archived repository through the GitHub API, reading the file tree and the few files it needs. With `--repo` it checks one local checkout without the API, which is what a new repository runs before its first merge. It exits 1 while anything is missing. Test fixtures, vendored code, templates and research spikes are skipped when it looks for ecosystems, so a fixture's lockfile does not demand a Dependabot entry." },
        { kind: "p", text: "`bin/sync` prints the one-line summary and caches it for 12 hours. That makes the floor visible every morning without being a nag." },
      ],
    },
    {
      id: "note",
      title: "What I am not claiming",
      blocks: [
        { kind: "p", text: "The same day the Semgrep rollout was recorded for every non-archived repository, and the baseline got its own rule file. I did not run the tool against the whole organization for this post, so I have no count of what is missing. That number is the first thing the tool gives you, and it belongs to its own post." },
        { kind: "callout", tone: "note", text: "The pull request series also added a mise task layout in #198 so that the check, conformance and the lints share one command name. Same lesson as the rest of the harness: one definition of green." },
      ],
    },
  ],
};

export default post;
