import type { Post } from "./types";

const post: Post = {
  slug: "one-front-door-read-p95-6-to-3-seconds",
  category: "daily",
  date: "2026-10-24",
  published: "2026-11-21",
  title: "Reading a whole message up front",
  summary: "Notes from a day measuring the assistant's front reading: data questions p95 6.14 to 3.14 s, a 64/65 accuracy battery, and 12 of 15 long multi-topic messages answered without the slow planner.",
  tags: ["assistant", "latency", "routing", "measurement"],
  project: "versatile-sh",
  sections: [
    {
      id: "change",
      title: "What the front reading does",
      blocks: [
        { kind: "p", text: "In the assistant I build at work, owners often send one long message with several questions in it. The front reading is a single model call that splits the message into asks. Each ask gets its excerpt, what the person wants to know, the report route that answers it, the period and whether it is a comparison." },
        { kind: "p", text: "Asks are then answered in parallel, each under its own time budget, and composed into one reply in the order asked. A part that fails or runs out of time gets a plain line about that topic, and the finished parts are still delivered." },
      ],
    },
    {
      id: "measured",
      title: "What I measured today",
      blocks: [
        { kind: "p", text: "Setup: the native core, the live model reader, a simulated report gate of 1.2 s, 20 where-is-it asks and 20 data asks." },
        {
          kind: "table",
          head: ["Ask type", "Before p50 / p95", "After p50 / p95"],
          rows: [
            ["where is it", "0.90 / 3.40 s", "0.90 / 1.96 s"],
            ["data", "3.33 / 6.14 s", "2.49 / 3.14 s"],
          ],
        },
        { kind: "list", items: [
          "Accuracy battery: 64 of 65, with 79% of prompt tokens served from cache.",
          "15 long owner messages: 12 answered every part without the planner. The 3 misses were fixture permissions, not behaviour.",
          "Reading latency: p50 1.34 s, p95 2.35 s.",
        ] },
      ],
    },
    {
      id: "caveats",
      title: "How far to trust it",
      blocks: [
        { kind: "p", text: "These are 20 and 20 asks against a simulated gate, so the p95 is the 19th or 20th slowest of a small sample. The direction is clear. The second decimal is not." },
        { kind: "p", text: "Hypothesis, not tested here: most of the data p95 drop comes from reading the message once and routing straight to a report, so the slow planner is skipped. I did not run an ablation that isolates it." },
        { kind: "p", text: "The 12 of 15 figure has one more limit. Three of the misses were fixture grants, which I can fix in the harness. They say nothing about the assistant." },
      ],
    },
  ],
};

export default post;
