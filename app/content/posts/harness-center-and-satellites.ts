import type { Post } from "./types";

const post: Post = {
  slug: "harness-center-and-satellites",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "One center, three satellites",
  summary: "Why the team's way of working lives in one repository and every other harness has its own, carried as a submodule instead of copied content.",
  tags: ["harness", "architecture", "git", "submodules"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem with one big folder",
      blocks: [
        { kind: "p", text: "Our setup for working with AI agents started as a pile of instructions. Rules, patterns, project records, infrastructure notes and research all sat close together, and every session loaded whatever was nearest. It grew until nobody could say which file owned which fact." },
        { kind: "p", text: "The team harness (`versatile-sh/.claude`) merged pull requests #166 to #178 on 2026-11-20, among them the one that restricted the team repositories to Versatile knowledge only (#169). That is the day I date this post by. It describes the shape that came out of it, not a measured result: I have no before-and-after numbers for it, and I will not invent any." },
      ],
    },
    {
      id: "shape",
      title: "The shape",
      blocks: [
        { kind: "p", text: "The center is `.claude`. It holds only how we work: the router file, the `docs/work/` guides, skills, agents, commands, the `bin/` tools and the hooks. It never holds an engineering rule, a project fact, a handoff or a personal log." },
        { kind: "p", text: "Every other harness is a satellite with its own repository:" },
        { kind: "table", head: ["Repository", "Holds"], rows: [
          ["versatile-harness", "The engineering knowledge base (premises, rules, patterns, standards, lints, design) and the record home of each project"],
          ["hosting-harness", "Infrastructure and each app's deploy configuration"],
          ["research-harness", "The research engine: method, studies, state"],
          ["<domain>-media", "The canonical copy of every image, video and design source"],
        ] },
        { kind: "p", text: "The center carries the first three as git submodules under `harness/`. Nothing is copied. A session reads `harness/versatile-harness/` the same way it reads any other file, and the content is whatever that satellite's `main` says." },
      ],
    },
    {
      id: "why",
      title: "Why separate repositories",
      blocks: [
        { kind: "p", text: "The premise is written down in the knowledge base as one short file, and its core is a single sentence: a harness can be reduced, replaced and iterated on by itself, so it is never inlined into the center or into another harness." },
        { kind: "list", items: [
          "Different change rates. The knowledge base gets many small pull requests a day. The way of working changes rarely and affects everyone. Mixing them makes every review about two things.",
          "Different audiences. Deploy configuration must never travel with a product repository. Keeping it in its own repository makes that boundary a repository boundary instead of a convention.",
          "Replaceability. If the research engine turns out wrong, it can be rewritten without touching the rest.",
          "A rule for new things. Something harness-like with no repository yet is proposed as a new `<name>-harness`. It is not folded into an existing one.",
        ] },
      ],
    },
    {
      id: "rules",
      title: "The rules that keep it honest",
      blocks: [
        { kind: "list", items: [
          "The truth of a satellite is its `main` on GitHub. The folder under `harness/` is a read copy.",
          "Never edit under `harness/`. Change the sibling working copy, on a branch, through a pull request.",
          "What a session learns about Versatile goes to a shared home through a pull request, never only to memory. What it learns about any other project stays local, in an ignored `local/` folder.",
        ] },
        { kind: "callout", tone: "note", text: "The second and third rules are the reason the split pays off. A fact has exactly one home, and a search that lands in the wrong repository finds nothing instead of a stale copy." },
      ],
    },
    {
      id: "cost",
      title: "What it costs",
      blocks: [
        { kind: "p", text: "Three things get harder. A change that spans the center and a satellite needs two pull requests. The pointers that record which commit of each satellite the center reads can fall behind. And a person has to know which repository owns a topic. The routing table in the center's router file exists for the last one. The next post covers the tool that handles the second." },
        { kind: "p", text: "I think the trade is right, but that is a judgement from days of use by a small team, not a measurement. If the pointer pull requests start to be noise, the answer will be to automate them further, not to merge the repositories back." },
      ],
    },
  ],
};

export default post;
