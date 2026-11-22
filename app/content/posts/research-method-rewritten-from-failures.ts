import type { Post } from "./types";

const post: Post = {
  slug: "research-method-rewritten-from-failures",
  category: "studies",
  date: "2026-11-12",
  published: "2026-11-21",
  title: "A research method rewritten from its own failures",
  summary: "The research harness's method file lists each rule next to the mistake that produced it: proof levels, a judge who is not the auditor, and an audit sample drawn by a seeded script.",
  tags: ["research", "method", "audit", "evidence"],
  project: "versatile-sh",
  sections: [
    {
      id: "form",
      title: "A table of rules and mistakes",
      blocks: [
        { kind: "p", text: "The research harness has one method file, rewritten on 2026-11-12 (commit `7575561`, one generic method for any study) from what the first loop of 2026-11-05 did well and badly. A lesson from a later study was added on 2026-11-13. I like the file's shape: every rule has a column for the mistake it prevents and a column for evidence, a path and often a line." },
        { kind: "p", text: "Below are the rules I think carry the most weight, with the numbers as the file gives them. These are the harness's records, not my measurements. I did not rerun any study." },
      ],
    },
    {
      id: "proof",
      title: "Proof levels",
      blocks: [
        { kind: "p", text: "Every claim about our own code or design carries one of three levels." },
        { kind: "table", head: ["Level", "Means", "Evidence"], rows: [
          ["Read", "The code or document says so", "path:line at a pinned commit"],
          ["Specified", "A public contract covers it", "The spec, version, section"],
          ["Run", "It was executed and observed", "The command, result, commit, date"],
        ] },
        { kind: "p", text: "A claim with none of the three is a hypothesis and never enters as fact. The mistake behind it: statements like replaceable or works offline made from reading. The file records that every runs-with-act claim was downgraded in round 1." },
        { kind: "p", text: "The rule I find sharpest is that run is narrow. A spike must run the part of the claim the cell's value rests on, in the kind of deployment and with the kind of sign-in the cell describes. One spike used a development sign-in that a deployment shared by many organizations refuses. Four cells fell from partial at run to no at read, and three more were lowered because a spike ran one half of a two-part value." },
      ],
    },
    {
      id: "roles",
      title: "The judge is not the auditor",
      blocks: [
        { kind: "p", text: "The judge wrote no proposal. The auditor is not the judge. A reviewer gets the sources, never the conclusion. The mistake behind this: in one study the reviewer inherited the author's frame and kept it. The same study listed 13 seams and missed model connections, an agent endpoint and teams, because its inventory began from the code, not from the person who uses the result." },
        { kind: "p", text: "The same separation closes a study: a closing pass has a judge who corrects, then an auditor, not that judge, who checks only the corrections. Without it, the file notes, a final audit gets filed and not acted on, or a lead edits cells to answer it." },
      ],
    },
    {
      id: "numbers",
      title: "Single passes are drafts",
      blocks: [
        { kind: "p", text: "The file's evidence for treating a single pass as a draft: round 2 of the first loop overturned 25 statements and round 3 overturned 26. One study had four claims corrected the same day by a review. That loop stopped at round 3 of 8 with three of five criteria failing, and the owner paused it." },
        { kind: "callout", tone: "note", text: "These are counts of overturned statements, not error rates. The file reports them as the reason a pass is a draft, and I read them the same way." },
      ],
    },
    {
      id: "sample",
      title: "Seeded samples and where errors come from",
      blocks: [
        { kind: "p", text: "The auditor samples in three pools: cells changed this round, cells never audited, and a draw from the rest. It reports the error rate per pool. The stop rule reads a sample drawn from the whole result by a script with a recorded seed, because an auditor-chosen sample, or one full of cells just written, measures the last round and not the result." },
        { kind: "p", text: "The per-pool rate told the story in the studio modularity study. While only the auditor read cited lines, the audit error was 0.227, 0.075 and 0.104 across rounds. Cells written under the writer's own check, where the writer prints the cited lines and reads them against the sentence first, were audited at 0.043. The stop criterion is under 5 percent on at least 30 cells." },
        { kind: "p", text: "When the error comes from old text, the next round is a verification round. In that study it made 217 repairs across 163 of 222 cells and brought the rate of the whole map to 0.0375." },
      ],
    },
    {
      id: "lesson",
      title: "The last rule",
      blocks: [
        { kind: "p", text: "The method's final row says the method is amended after every study. Its evidence column points at the file itself. I take that as the point of the document: the table is a log of mistakes with fixes attached." },
        { kind: "p", text: "A caveat on what I know. The file cites evidence under a study branch that had not merged when it was written, so some of those paths could not be opened from the main branch at that time. I read the method; I did not audit the audits." },
      ],
    },
  ],
};

export default post;
