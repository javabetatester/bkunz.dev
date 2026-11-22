import type { Post } from "./types";

const post: Post = {
  slug: "fresh-code-first-hook",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Fresh code first, once per session",
  summary: "A PreToolUse hook that pulls a clean default branch the first time a session touches a repository, and otherwise only fetches and tells the model what is behind.",
  tags: ["harness", "hooks", "git", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "The bug it prevents",
      blocks: [
        { kind: "p", text: "An agent reads code that is three commits behind its remote, plans a change against it and opens a pull request that conflicts or reverts something. Nobody did anything wrong. The checkout was just old." },
        { kind: "p", text: "Rule 12 of the harness says the first time a session touches a repository, it fetches and updates it before reading or changing code. Pull request #178 added that rule on 2026-11-20, together with the hook that applies it so nobody has to remember." },
      ],
    },
    {
      id: "flow",
      title: "What the hook decides",
      blocks: [
        { kind: "p", text: "`hooks/fresh-pull.py` runs before the file and shell tools. It finds the repository from the file being touched, or from the first `cd` of a shell command. It acts only for repositories of the organization, and only once per session and repository (a marker file in the cache directory, cleaned after seven days)." },
        { kind: "table", head: ["State of the checkout", "What the hook does"], rows: [
          ["Clean, on its default branch, with an upstream", "git pull --ff-only, silently"],
          ["Anything else, and it is behind", "git fetch, then one line of context for the model: how many commits behind, on which branch, whether there are local changes"],
          ["Anything else, and it is not behind", "Nothing"],
          ["Any error or timeout (8 seconds per git call)", "Silence; the tool call proceeds"],
        ] },
        { kind: "p", text: "It never stashes, resets, rebases or switches branch, and it never blocks a tool call. When it only fetched, the message tells the model to rebase or merge after the owner of the local work agrees." },
      ],
    },
    {
      id: "tradeoffs",
      title: "Trade-offs",
      blocks: [
        { kind: "p", text: "The hook costs a fetch on first touch, bounded by the timeout. In return the common case, a clean checkout of `main`, needs no thought. The uncommon case, a feature branch that is behind, becomes a sentence in the model's context instead of a surprise at merge time." },
        { kind: "p", text: "Two choices came from caution. First, it prefers saying nothing over guessing: a failed fetch is silent. Second, it does not try to be clever about dirty trees. Untracked files are ignored when deciding whether a tree is dirty, but tracked edits stop the pull." },
        { kind: "callout", tone: "note", text: "There is an off switch (FRESH_PULL=off) and a widening switch for repositories outside the organization (FRESH_PULL_ANY=1). I kept the default narrow on purpose: a hook that touches a repository it does not own is a different kind of risk." },
      ],
    },
  ],
};

export default post;
