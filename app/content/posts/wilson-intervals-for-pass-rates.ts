import type { Post } from "./types";

const post: Post = {
  slug: "wilson-intervals-for-pass-rates",
  category: "studies",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "Wilson intervals for pass rates",
  summary: "Why the normal approximation breaks for small eval sets near 100%, the Wilson score interval in a few lines, and the numbers: 183/188 gives 93.9 to 98.9, and 64/65 gives 91.8 to 99.7.",
  tags: ["evals", "statistics", "confidence-interval", "typescript"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem with p plus or minus z",
      blocks: [
        { kind: "p", text: "An eval gives me a pass rate: x passes out of n items. The textbook interval is p +/- z * sqrt(p(1-p)/n), the Wald interval. It is what most people reach for, and it is wrong exactly where evals live: small n and a pass rate near 100%." },
        { kind: "p", text: "Two failure modes. First, it can leave the valid range. Second, when p is 1 the standard error is 0, so the interval collapses to a point and claims certainty from a handful of items." },
        { kind: "p", text: "The numbers below come from a script I ran, not from memory. Node v26.13.0 on Linux, AMD Ryzen 7 5700X, z = 1.959964. The code is in my lab repository under paired-evals." },
      ],
    },
    {
      id: "wilson",
      title: "The Wilson score interval",
      blocks: [
        { kind: "p", text: "Wilson inverts the score test instead of plugging the observed p into the variance. The centre is pulled toward 1/2 and the width adapts to n. It never leaves [0, 1], and it does not collapse at p = 1." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function wilson(x: number, n: number, z = 1.959964): [number, number] {",
            "  const p = x / n;",
            "  const d = 1 + (z * z) / n;",
            "  const c = (p + (z * z) / (2 * n)) / d;",
            "  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;",
            "  return [c - h, c + h];",
            "}",
          ].join("\n"),
          caption: "95% interval for x passes in n items. Multiply by 100 for percent.",
        },
        { kind: "p", text: "For reference, the Wald version is the same three lines without the correction: p plus or minus z * sqrt(p(1-p)/n). I computed both on the same inputs." },
      ],
    },
    {
      id: "numbers",
      title: "The numbers",
      blocks: [
        {
          kind: "table",
          head: ["Pass rate", "Wilson 95%", "Wald 95%"],
          rows: [
            ["172/188", "86.6 - 94.7", "87.5 - 95.5"],
            ["183/188", "93.9 - 98.9", "95.0 - 99.6"],
            ["64/65", "91.8 - 99.7", "95.5 - 101.5"],
          ],
        },
        { kind: "p", text: "183/188 is 97.3%. Wilson says 93.9 to 98.9. Wald says 95.0 to 99.6, which is narrower and sits higher: it is optimistic at both ends." },
        { kind: "p", text: "64/65 is 98.5%. Wald gives an upper bound of 101.5%, a pass rate no eval can have. Wilson gives 91.8 to 99.7. That lower bound is the honest part: with 65 items, I cannot rule out a true pass rate near 92%." },
        { kind: "p", text: "Another pair from my records: a 52-ask battery went from 3/52 to 50/52. Wilson gives 2.0 to 15.6 for the first and 87.0 to 98.9 for the second. The intervals do not touch, and that is the story. Computing them again here reproduced those recorded figures." },
        { kind: "callout", tone: "note", text: "At the edge, 0/10 gives 0.0 to 27.8 and 10/10 gives 72.2 to 100.0. Ten clean passes do not show a 99% rate. They show a rate above about 72%." },
      ],
    },
    {
      id: "use",
      title: "How I use it",
      blocks: [
        { kind: "list", items: [
          "Every pass rate in a report carries its n and its Wilson interval. A bare 98.5% is not a result.",
          "Overlapping intervals between two builds do not prove no difference. The items are the same on both sides, so the paired test (see the McNemar post) is the right tool for the comparison. The interval is for the absolute level.",
          "I read the lower bound as the number I can defend. 64/65 is a good result and a weak claim about 98.5%.",
          "Clopper-Pearson is the exact alternative. It is conservative (wider) and fine if you prefer never to undercover. I use Wilson because it is short and its coverage is close to nominal.",
        ] },
        { kind: "p", text: "Limit: Wilson assumes the items are independent draws. Eval items generated from templates, or several asks about the same menu item, are correlated, and the true uncertainty is larger than the interval says. I note the generator and seed next to the interval for that reason." },
      ],
    },
  ],
};

export default post;
