import type { Post } from "./types";

const post: Post = {
  slug: "from-a-repeated-problem-to-a-lint",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "From a repeated problem to a catalogued lint",
  summary: "The protocol that turns a recurring mistake or a repeated request into a certified fix, a guard and a shared lint, and why it waits for one explicit yes.",
  tags: ["harness", "learning-loop", "lints", "process"],
  project: "versatile-sh",
  sections: [
    {
      id: "principle",
      title: "The team learns once",
      blocks: [
        { kind: "p", text: "The principle in the harness is one line: whatever one person teaches the AI must reach the other three without anyone repeating it, and a fixed mistake must become impossible, not remembered. Memory on one machine is not learning. A rule only in prose will be broken again." },
        { kind: "p", text: "The protocol has seven steps: recognise, fix the root cause, certify with evidence, ask the user to confirm, codify as a guard, record in the shared home, share. This post is about the three that surprised me when I read the docs." },
      ],
    },
    {
      id: "class",
      title: "Name the class, not the instance",
      blocks: [
        { kind: "p", text: "Step 1 says to state the problem as a class. The example in the doc is raw colour values in components, not the header is blue. That sounds like style advice, but it decides whether the guard can exist. A guard needs a shape to match." },
        { kind: "p", text: "It also forces a search. The catalog of lints is checked first, because the class may already have one to enable. A lint written twice is two lints that will disagree." },
      ],
    },
    {
      id: "yes",
      title: "Only an explicit yes unlocks the guard",
      blocks: [
        { kind: "p", text: "After the fix and its evidence, the agent asks one question. The certification is the agent's. The confirmation is the person's. Then three outcomes:" },
        { kind: "table", head: ["The user", "Then"], rows: [
          ["Says yes", "The guard is written and registered; the issue is marked fixed and confirmed, with the guard's command"],
          ["Does not answer", "Work continues. The fix and its regression test stay; the issue says fixed, not confirmed; no class-wide guard yet"],
          ["Says no", "The issue reopens with what was observed, and the diagnosis is redone"],
        ] },
        { kind: "p", text: "The reason is in the doc: a guard built on an unconfirmed diagnosis hard-codes a guess. I find that more convincing than the usual argument for asking, which is politeness." },
      ],
    },
    {
      id: "catalog",
      title: "The guard must bite, and have one home",
      blocks: [
        { kind: "list", items: [
          "Prove it bites. Reintroduce the mistake and watch the guard fail. A guard that has never failed proves nothing.",
          "Wire it into the project's one check command.",
          "Write the failure message as an instruction: what is wrong, where, what to do instead.",
          "Register it in the lint catalog in the same unit of work, as one shared implementation. A project enables a lint by referencing it, never by copying it.",
        ] },
        { kind: "p", text: "The catalog itself shows the cost of skipping the last point. Several older entries are marked per-repository copies or implementation not verified, and the doc calls that debt the rule exists to stop." },
      ],
    },
    {
      id: "triggers",
      title: "Nobody has to remember to start it",
      blocks: [
        { kind: "p", text: "A UserPromptSubmit hook looks for repetition markers in the user's prompt, such as already told you, again, or always, in Portuguese and English. It adds one line of context pointing at step 1. It never blocks. It also ignores automatic notifications, a fix that landed on 2026-11-21 (#196). The knowledge checklist on every pull request asks the same question from the other side." },
        { kind: "callout", tone: "note", text: "A concrete case of the whole loop, the view transition lint, is in its own post. I have no count of how many lints the loop has produced; the catalog has 19 entries, but several predate the protocol." },
      ],
    },
  ],
};

export default post;
