import type { Post } from "./types";

const post: Post = {
  slug: "mcnemar-for-paired-evals",
  category: "studies",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "McNemar for paired evals",
  summary: "Why a before-and-after eval on the same items needs a paired test, the exact two-sided McNemar test in a dozen lines, and a worked example: 172 to 183 correct of 188, 15 fixed, 4 broken, p = 0.019.",
  tags: ["evals", "statistics", "mcnemar", "typescript"],
  project: "versatile-sh",
  sections: [
    {
      id: "why-paired",
      title: "Why the comparison is paired",
      blocks: [
        { kind: "p", text: "When I change a prompt or a router in an AI assistant, I run the same fixed set of items through the old build and the new one. Every item then has two outcomes: pass or fail on the baseline, pass or fail on the candidate. That is a paired design, and the usual two-proportion test ignores it." },
        { kind: "p", text: "A two-proportion test treats 172/188 and 183/188 as two independent samples. They are not. The same 188 items sit on both sides, and most of them behave the same way in both builds. That shared difficulty is variance the unpaired test counts as noise, so it is less sensitive than it needs to be." },
        { kind: "p", text: "The paired view throws the shared part away. Items that pass on both builds, or fail on both, say nothing about which build is better. Only the items that changed side carry information." },
      ],
    },
    {
      id: "the-table",
      title: "The 2x2 table and the test",
      blocks: [
        { kind: "p", text: "Count the items by their pair of outcomes. Two cells are the discordant ones: fixed (failed on baseline, passes on candidate) and broken (the reverse)." },
        {
          kind: "table",
          head: ["", "candidate pass", "candidate fail"],
          rows: [
            ["baseline pass", "168 (both pass)", "4 (broken)"],
            ["baseline fail", "15 (fixed)", "1 (both fail)"],
          ],
        },
        { kind: "p", text: "Under the null hypothesis that the two builds are equally good, each discordant item is equally likely to fall in either cell. So with n = fixed + broken discordant items, the number of fixed ones is Binomial(n, 1/2). The exact two-sided p-value is twice the smaller tail, capped at 1." },
        { kind: "p", text: "No chi-square approximation is needed, and none is wise here: with 19 discordant items the approximation has little to stand on. The exact version is cheap." },
        { kind: "callout", tone: "note", text: "The both-pass and both-fail counts in the table follow from the totals. 172 + 15 - 4 = 183 pass on the candidate, and the 188 - 172 - 15 = 1 item that fails on both builds is the remainder." },
      ],
    },
    {
      id: "code",
      title: "The function",
      blocks: [
        { kind: "p", text: "The loop below walks the binomial pmf upward with the ratio term(i+1) = term(i) * (n - i) / (i + 1), starting from 0.5^n. It accumulates the lower tail up to min(b, c) and doubles it." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function mcnemarExact(b: number, c: number): number {",
            "  const n = b + c;",
            "  if (n === 0) return 1;",
            "  const k = Math.min(b, c);",
            "  let term = 0.5 ** n;",
            "  let cdf = 0;",
            "  for (let i = 0; i <= k; i++) {",
            "    cdf += term;",
            "    term = (term * (n - i)) / (i + 1);",
            "  }",
            "  return Math.min(1, 2 * cdf);",
            "}",
          ].join("\n"),
          caption: "b = items fixed, c = items broken. Returns the exact two-sided p-value.",
        },
        { kind: "p", text: "Limit: 0.5^n underflows to zero once n passes roughly 1,070 discordant items, and the loop would then return 0. Eval sets I run are far below that. If yours are not, work in log space." },
        { kind: "p", text: "I ran it on this machine (AMD Ryzen 7 5700X, Linux, Node v26.13.0, node --experimental-strip-types run.ts). The code lives in my lab repository under paired-evals. The results are deterministic, so there is no spread to report." },
        {
          kind: "table",
          head: ["fixed", "broken", "exact two-sided p"],
          rows: [
            ["15", "4", "0.0192"],
            ["8", "1", "0.0391"],
            ["2", "1", "1"],
            ["47", "0", "1.42e-14"],
          ],
        },
      ],
    },
    {
      id: "worked",
      title: "The worked example",
      blocks: [
        { kind: "p", text: "A recent change to the assistant's front door was evaluated on 188 items. The baseline answered 172 correctly (91.5%) and the candidate 183 (97.3%). The candidate fixed 15 items and broke 4." },
        { kind: "p", text: "n = 19 discordant items, and the smaller side is 4. The exact two-sided p is 0.0192, which I report as p = 0.019." },
        { kind: "p", text: "A 5.9-point gain on 188 items sounds decisive, but the test only sees 19 items. The evidence is real but not huge. If the candidate had fixed 15 and broken 8, p would be 0.21 and I would not claim a win." },
        { kind: "callout", tone: "warn", text: "Four items broke. The p-value says the net gain is unlikely to be chance. It does not say the four regressions are acceptable. I read those four before shipping, whatever the test says." },
      ],
    },
    {
      id: "limits",
      title: "What it does not tell you",
      blocks: [
        { kind: "list", items: [
          "It tests this item set only. Items drawn from one generator and one seed generalise to that distribution, not to production traffic.",
          "It needs pass/fail per item. A graded score per item wants a paired test on differences instead.",
          "It says nothing about effect size. Pair it with an interval on each pass rate (see the Wilson post) and the raw counts of fixed and broken.",
          "If the grader is noisy, the discordant cells fill with grader disagreement. I use two blind graders and a third on disagreements, and report the agreement.",
        ] },
        { kind: "p", text: "The habit I keep: always publish the 2x2, not only the p. 15 fixed and 4 broken tells a reader more than any single number." },
      ],
    },
  ],
};

export default post;
