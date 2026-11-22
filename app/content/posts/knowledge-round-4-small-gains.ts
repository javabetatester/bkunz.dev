import type { Post } from "./types";

const post: Post = {
  slug: "knowledge-round-4-small-gains",
  category: "daily",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "Knowledge round 4: small gains, honest numbers",
  summary: "Round four of the assistant's help answers moved paired scores by one or two items out of 120 to 160. What I changed, what I measured, and why I did not call it a win.",
  tags: ["assistant", "evals", "paired", "knowledge"],
  project: "versatile-sh",
  sections: [
    {
      id: "changes",
      title: "What changed",
      blocks: [
        { kind: "p", text: "The assistant also answers where-is-it and how-does-it-work questions about the product it lives in. Round 4 of that work was a handful of deterministic rules over what the front reading returns, with no prompt change:" },
        { kind: "list", items: [
          "When the reading says an answer is a near match, the reply says so instead of presenting it as exact.",
          "A capability the assistant cannot act on answers where to do it yourself, and says that it does not do it yet. These answers skip the brief cut, so a part of a multi-topic message keeps its place.",
          "An action request nobody builds answers where you change it.",
          "A what-or-why part with no topic picked by the reading is no longer answered by the guide of its screen.",
          "A few product areas became routable catalog entries, so their questions reach a real answer.",
        ] },
      ],
    },
    {
      id: "measure",
      title: "What I measured",
      blocks: [
        { kind: "p", text: "Paired against the current dev build, same asks in both arms at the same time, new seeds each run:" },
        {
          kind: "table",
          head: ["Run", "Dev", "Round 4", "Won / lost", "Exact p"],
          rows: [
            ["160 items, seeds 7013, 8429, 2647", "147", "149", "4 / 2", "0.69"],
            ["120 items, seeds 3911, 6083, final code", "107", "108", "2 / 1", "1.0"],
          ],
        },
        { kind: "p", text: "The 40-item slice I had been watching went from 37 to 37 in the first run and from 37 to 39 in the second. No loss in that slice in either run. Answers were shuffled with the arm hidden, graded by two blind graders, with a third on disagreements." },
        { kind: "p", text: "The same day I recorded two other paired runs from sibling work: 8 gained and 1 lost on 88 comparison asks (p = 0.039), and 17 gained and 1 lost on 30 courier asks. Those are real gains. This one is not." },
      ],
    },
    {
      id: "reading",
      title: "How I read it",
      blocks: [
        { kind: "p", text: "Six discordant items in the first run and three in the second. With that few, no outcome can reach significance: even 6 to 0 would give p = 0.031 and 3 to 0 gives p = 0.25. The test could not have said yes, and it did not." },
        { kind: "p", text: "What the round does show is no regression in the focus slice, and a clearer answer shape for cases that used to read as exact when they were not. One of the three losses was a card description cut at 140 characters; I shortened it after the run and added a test." },
        { kind: "p", text: "I shipped it for those reasons, and recorded the headline as a null." },
      ],
    },
  ],
};

export default post;
