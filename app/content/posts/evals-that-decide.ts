import type { Post } from "./types";

const post: Post = {
  slug: "evals-that-decide",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Evals that decide",
  summary: "How I build evals for an AI assistant so they can settle a ship-or-not question: seeded paired runs, deterministic checks before any LLM judge, infra errors kept out of the pass rate, and prompt-leak canaries.",
  tags: ["evals", "llm", "testing", "assistant"],
  project: "versatile-sh",
  sections: [
    {
      id: "decide",
      title: "An eval has to be able to say no",
      blocks: [
        { kind: "p", text: "I build an AI assistant at work: a conversational assistant that answers questions and runs actions over business data. Most changes I make to it are small and look good in a demo. A demo cannot tell me whether the change helped, so I want an eval whose result decides." },
        { kind: "p", text: "Four habits make that possible. This post is about them, with numbers from my own change records. Where something is my convention rather than a measured result, I say so." },
      ],
    },
    {
      id: "paired",
      title: "A seeded, paired baseline and candidate",
      blocks: [
        { kind: "p", text: "The items come from a generator with a recorded seed, so another person can regenerate the same set. The same items run through the baseline build and the candidate, with the same pinned provider and no fallbacks, at the same time. A fallback that fires in one arm only is a hidden difference." },
        { kind: "p", text: "I read the result as a 2x2 table and test the discordant items with an exact McNemar test (see the post on it). Two real examples from the records, each on 52 items:" },
        {
          kind: "table",
          head: ["Seed", "Baseline", "Candidate", "Fixed / broken", "Exact p"],
          rows: [
            ["7101", "3/52", "50/52", "47 / 0", "1.4e-14"],
            ["7202 (fresh)", "2/52", "48/52", "46 / 0", "2.8e-14"],
          ],
        },
        { kind: "p", text: "The second line matters most. A fresh seed after the change was tuned guards against having fitted the first set. A null result is recorded the same way: one run of 42 comparison items went from 5 to 6 correct, 2 fixed and 1 broken, p = 1.0. The record says what it says: no evidence of a gain." },
      ],
    },
    {
      id: "deterministic",
      title: "Deterministic checks before a judge",
      blocks: [
        { kind: "p", text: "Anything a program can check, a program checks. Does every number in the reply appear in the data the tool returned? Is there a bullet list whose length contradicts the count announced just before it? Does the reply contain payment data when it must not? These are string and set operations, they are free, and they give the same answer twice." },
        { kind: "p", text: "A model judge handles what is left: is the answer right, is it helpful, is the period correct. I use two blind graders who do not know which arm produced a transcript, and a third on disagreements. I report agreement as kappa. In one run it was 0.56, low enough that I had the third grader read every item rather than only the disputed ones." },
        { kind: "p", text: "When I considered a model judge as a runtime guard against leaking the system prompt, I rejected it for two reasons recorded in the decision: it is not deterministic, and it is paid on every turn. A fingerprint check was tuned on 146 real assistant answers and 130 real chat replies, and none of them tripped it." },
      ],
    },
    {
      id: "infra",
      title: "Infra errors are not failures",
      blocks: [
        { kind: "p", text: "A timeout from the model provider, an unauthorised query from a fixture, a harness that forgot a store: none of those says anything about the change. If they count as failures the pass rate measures my test rig." },
        { kind: "p", text: "My records have a concrete case. Two comparison runs were later found to have been taken with a probe harness that lacked a draft store, so every single ask skipped the path under test and went to the slower planner. The note went into the record with the date and time of the fix. In another run, 3 of 15 misses were fixture permissions, not behaviour, and the record says so." },
        { kind: "p", text: "My convention, not a measured result: an item whose run ended in an infra error is excluded from the pass rate and listed separately with its count. If that count is large, the run is not a result and I re-run it." },
        { kind: "callout", tone: "warn", text: "Exclusion has a cost. If the candidate causes more timeouts, dropping them flatters it. I report the excluded count per arm, and a difference in that count is itself a finding." },
      ],
    },
    {
      id: "canaries",
      title: "Prompt-leak canaries",
      blocks: [
        { kind: "p", text: "Telling a model never to reveal its prompt is not a control: an injected message can override it. So the check sits at the output edge and is deterministic." },
        { kind: "p", text: "One part is a canary: a fixed prefix plus 16 random hex digits, generated once per process and added to the model input as one extra system line. If that token ever appears in an output, the prompt leaked. The other part is a set of 5-word fingerprints of the static prompt text. A message is flagged on the canary, or on 3 non-overlapping fingerprint hits." },
        { kind: "p", text: "The guard ships in observe mode by default: it logs and does not block, so I can read false positives in real traffic before I turn blocking on. The canary line enters the prompt only in block mode, because anything that changes what the model sees ships off by default." },
        { kind: "list", items: [
          "Known gap, from the record: a leak shorter than 15 prompt words that carries no canary passes.",
          "Known gap: a paraphrase that shares no 5-word run with the prompt passes.",
          "Not done yet: the canary is not wired into my eval runner, so today it protects traffic, not benchmarks.",
        ] },
      ],
    },
  ],
};

export default post;
