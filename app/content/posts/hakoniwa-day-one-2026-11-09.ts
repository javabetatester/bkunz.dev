import type { Post } from "./types";

const post: Post = {
  slug: "hakoniwa-day-one-2026-11-09",
  category: "daily",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "hakoniwa, day one: from ADRs to a world",
  summary: "What the git history of the test engine shows for 2026-11-09: 282 commits in one day, the order things landed in, and the benchmark that did not hit its target.",
  tags: ["hakoniwa", "testing", "devlog"],
  project: "versatile-sh",
  sections: [
    {
      id: "numbers",
      title: "The numbers",
      blocks: [
        { kind: "p", text: "hakoniwa is the test engine. Its repository history starts on 2026-11-09, and 282 commits carry that date: 237 without merges, plus the merges of pull requests #5 to #13. Three non-merge commits are dated the 10th and 38 the 13th." },
        { kind: "p", text: "That is a count of commit dates, not a measure of effort. Many of those commits come from parallel branches merged the same day and named by version: v2, v3, v4, v5." },
      ],
    },
    {
      id: "order",
      title: "The order things landed",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Decisions first", text: "ADR-0001 to ADR-0005 are among the first commits: the neutral core, a run lifecycle owned by the engine with leased workers, admission gates against false tests, the worker and its evidence, and the engineering principles." },
            { title: "Lifecycle and gates", text: "A test state machine where only a person can admit, a run state machine with leases and step-boundary pause, and the admission gates G1 to G5: compile, clean replays, a seeded fault that must turn the test red, assertion provenance, and quiet implicit oracles." },
            { title: "Storage and surfaces", text: "A Postgres schema with forced row-level security, an in-memory store with the same conformance suite, then one operation table served over HTTP, gRPC and MCP, plus a CLI derived from it." },
            { title: "A speed target and a benchmark", text: "ADR-0011 set the goal: at least 50% less wall time and CPU than plain Playwright with the same verdicts. A 17-spec benchmark app and harness followed the same day." },
            { title: "Versions v2 to v5", text: "A commit titled Decide v2 to v5 and plan their build opens the second half of the day: v2 soft steps and check runs, v3 recording runs and locator healing, v4 the world host with a clock seam, fork and quiescence probe, v5 shortcuts, a result cache, suites and a signed inbox." },
            { title: "Spikes on the world", text: "Spikes S8, S10 and S11 measured the clock on Postgres, the quiescence probe and control flake. They are the subject of Testing with a frozen clock." },
          ],
        },
      ],
    },
    {
      id: "benchmark",
      title: "The benchmark, the same day",
      blocks: [
        { kind: "p", text: "The benchmark result landed the same day it was built, and it missed the target. Medians of 3 healthy repetitions, 4 CPUs and 6 GB per container: the engine used 37 to 39% less CPU than plain Playwright, and wall time was within noise at -3 to -5%. The 50% target was not met. The full reading is in a separate post, Where the wall time went." },
      ],
    },
    {
      id: "verification",
      title: "Verification in Docker",
      blocks: [
        { kind: "p", text: "The same day, v2 and v3 were verified in a container with a script replaying fixed actions over the HTTP API and no model. The v3 run recorded five sessions, compiled them, passed gates G1 to G5 and replayed them, with 0 tokens spent. A renamed test id turned a replay into healed with one locator proposal, which a person accepted." },
        { kind: "p", text: "It also found five bugs in the v2 and v3 code. The one I like best: the runner kept the metadata of its first configuration, so the second and later runs of a worker got no evidence directory. The fix reads the current run file at test time." },
      ],
    },
  ],
};

export default post;
