import type { Post } from "./types";

const post: Post = {
  slug: "triage-calibration-81-to-96",
  category: "daily",
  date: "2026-09-26",
  published: "2026-11-21",
  title: "Triage calibration: 81.5 to 96.2",
  summary: "A day spent calibrating the small model that routes each question in an AI assistant I build at work: path accuracy 81.5 to 96.2 on dev, 73.3 to 95.6 on holdout, with latency unchanged.",
  tags: ["assistant", "routing", "calibration", "evals"],
  project: "versatile-sh",
  sections: [
    {
      id: "setup",
      title: "What triage does",
      blocks: [
        { kind: "p", text: "The assistant answers questions over business data. Every question first goes through a small, fast classifier with an 800 ms timeout. It decides the path: a precomputed report template when one fits, or the slower tool-using model loop when none does." },
        { kind: "p", text: "A wrong path is expensive in either direction. Too eager a template gives a confident wrong answer. Too cautious sends a simple question into the slow loop." },
        { kind: "p", text: "Today I ran the production triage code, with the same client and timeout, against two labelled sets: dev (130 questions) and holdout (45). The tool also replays a threshold sweep offline from the saved raw answers, so tuning costs no new calls." },
      ],
    },
    {
      id: "failures",
      title: "What was failing",
      blocks: [
        { kind: "list", items: [
          "The classifier picked the right template at 0.98 or more but was unsure about the route (0.13 to 0.63) on slang and typo asks that literally said the word for report. They fell into the slow loop.",
          "Out-of-scope questions scored 0.84 to 0.89 on the out-of-scope class and slipped under the 0.9 block.",
          "Comparisons with the previous period were flagged as custom, although every template already benchmarks against it.",
        ] },
        { kind: "p", text: "I changed the classifier's instructions and thresholds against those three patterns. The sweep was flat for the route threshold between 0.5 and 0.7 and for the template threshold between 0.3 and 0.5. For the custom class, 0.6 was the optimum." },
      ],
    },
    {
      id: "numbers",
      title: "Numbers",
      blocks: [
        {
          kind: "table",
          head: ["Set", "Build", "Path acc.", "Route acc.", "No slow loop", "p50 / p95"],
          rows: [
            ["dev (130)", "before", "81.5%", "89.2%", "52.3%", "288 / 396 ms"],
            ["dev (130)", "after", "96.2%", "100%", "63.8%", "311 / 392 ms"],
            ["holdout (45)", "before", "73.3%", "84.4%", "46.7%", "322 / 422 ms"],
            ["holdout (45)", "after", "95.6%", "97.8%", "66.7%", "301 / 416 ms"],
          ],
        },
        { kind: "p", text: "Latency stayed at roughly 300 ms p50 and 400 ms p95. Triage failures were 0 of 175. The holdout was not used while tuning, which is why I trust the 95.6 more than the 96.2." },
        { kind: "p", text: "With 45 holdout items, 95.6% is 43 correct. Its interval is wide (about 85 to 99 with Wilson, my calculation), so I read the holdout as a sanity check on overfitting, not as a precise rate." },
      ],
    },
    {
      id: "left",
      title: "Left over",
      blocks: [
        { kind: "p", text: "Product and category names in free text, and derived views such as price variation, are still built without adapting. A request for three payment methods is adapted although a template covers it, which costs one extra round but still returns the right output. I wrote these into the doc as known residual misses." },
      ],
    },
  ],
};

export default post;
