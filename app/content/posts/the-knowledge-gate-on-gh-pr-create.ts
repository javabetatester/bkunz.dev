import type { Post } from "./types";

const post: Post = {
  slug: "the-knowledge-gate-on-gh-pr-create",
  category: "discoveries",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "A gate the model passes by doing the work",
  summary: "A PreToolUse hook holds gh pr create until the session's knowledge checklist is recorded. The gate asks no person; it asks the model to finish the job it skipped.",
  tags: ["harness", "hooks", "pull-requests", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "idea",
      title: "The failure it targets",
      blocks: [
        { kind: "p", text: "Sessions run per repository. When a session ends a pull request in a project, what it learned usually stays in the pull request or in nowhere. The README may be updated; the record in the knowledge base, a rule that emerged, a note that the way of working changed, often are not." },
        { kind: "p", text: "The team's answer is a checklist with five lines: user-visible behaviour (README and docs), project records, rules and lints, the way of working, and a last one that asks whether anything from outside Versatile leaked into the docs. Each line ends with a pull request link, `in this PR`, or `n/a` with a reason. A checklist nobody is forced to read is decoration, so a hook enforces it." },
      ],
    },
    {
      id: "hook",
      title: "What the hook does",
      blocks: [
        { kind: "p", text: "`hooks/pr-gate.py` runs before every Bash call. It does nothing unless the command is a `gh pr create` that really runs as a command (it tokenises the shell line, follows `cd`, and reads `--repo` and `--head`). It then checks whether the repository belongs to the organization, and whether a marker exists for that branch." },
        { kind: "p", text: "No marker: the call is denied, with a reason that is a to-do list for the model. It names the checklist steps, the exact `bin/pr-ready` command to record them, and the doc section that explains it." },
        { kind: "code", lang: "bash", caption: "Recording the checklist, from the project checkout", code: "bin/pr-ready --readme \"in this PR\" --records <url> \\\n  --knowledge \"n/a: no rule or lint emerged\" \\\n  --way \"n/a: unchanged\" --versatile-only\n\nbin/pr-ready --nothing \"a typo fix; nothing was learned or decided\"" },
        { kind: "p", text: "The gate needs no approval from a person. The model satisfies it by doing the checklist. What the person gets is the last step: the hook's message also tells the model to say in the chat what was updated, with links, or why nothing was." },
      ],
    },
    {
      id: "design",
      title: "Design choices I would defend",
      blocks: [
        { kind: "list", items: [
          "It fails open. Any exception inside the hook lets the command through. A broken gate that blocks every pull request would get removed.",
          "It is a hold, not a lock. The record expires after a day, and an environment variable or a file in the config directory turns it off.",
          "It does not apply to the harness repositories themselves. Their pull requests are the knowledge update.",
          "The escape for a truly empty session exists (`--nothing`) but requires a reason string. Writing the reason is the friction.",
        ] },
        { kind: "callout", tone: "warn", text: "A symbolic gate can be satisfied symbolically. The model can write n/a on every line. What stops that is the final rule: the pilot must be told in the chat, so a lazy n/a is visible to a human." },
      ],
    },
    {
      id: "unknown",
      title: "What I have not measured",
      blocks: [
        { kind: "p", text: "I have no count of how often the gate held a pull request, or how many of the answers were n/a. The hook landed on 2026-11-20, and the doc's rule about the checklist was revised the same day (#166 made the gate cite the doc a personal skill of the same name would not carry). Until there is a log of holds, the claim that the gate improves records is a hypothesis. The first thing to look at is the ratio of n/a answers to links." },
      ],
    },
  ],
};

export default post;
