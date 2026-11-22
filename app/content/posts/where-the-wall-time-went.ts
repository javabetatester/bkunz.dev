import type { Post } from "./types";

const post: Post = {
  slug: "where-the-wall-time-went",
  category: "studies",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "Where the wall time went",
  summary: "hakoniwa was meant to run browser tests in half the time of plain Playwright. It used 37 to 39% less CPU and the same wall time. A phase profile shows why, and what the follow-up decisions changed.",
  tags: ["hakoniwa", "benchmark", "playwright", "negative-result"],
  project: "versatile-sh",
  sections: [
    {
      id: "target",
      title: "The target and the setup",
      blocks: [
        { kind: "p", text: "ADR-0011 set a goal for hakoniwa's front-end test path: at least 50% less wall time and at least 50% less CPU-seconds than plain Playwright with default settings, with the same verdicts. Until measured, the ADR calls every gain a hypothesis." },
        { kind: "p", text: "The benchmark app is a small React SPA with a Bun API, a second-origin widget and seeded faults. The suite has 17 specs. Each configuration ran in a container limited to 4 CPUs and 6 GB, with the Playwright v1.65.0 image. The machine is an AMD Ryzen 7 5700X with 16 threads and 47 GiB of RAM, Linux 7.2.5, Docker 29.7.2. Healthy runs are the median of 3. The fault run is a single repetition." },
        { kind: "list", items: [
          "A: plain Playwright, 8 workers on 4 CPUs.",
          "B: the engine on Chromium with every shortcut off, 4 slots, batch 5.",
          "B+: B with the bench-only admitted shortcuts: session store, asset cache, CDP blocking, motion freezing.",
          "C: B+ with Lightpanda admitted.",
        ] },
      ],
    },
    {
      id: "result",
      title: "Result",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"], rows: [
          ["A", "5.3", "-", "16.4", "-", "1687"],
          ["B", "5.1", "-4%", "10.4", "-37%", "817"],
          ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
          ["C", "5.1", "-5%", "10.1", "-39%", "627"],
        ] },
        { kind: "p", text: "Verdicts matched A in every repetition. CPU fell by 37 to 39% and memory by about half. Wall time stayed within noise. The shortcuts cut response bytes from 3.9 to 1.0 MB, so the CDP blocking works, and they changed neither time nor CPU on this suite. The target was not met." },
      ],
    },
    {
      id: "profile",
      title: "Where the time goes",
      blocks: [
        { kind: "p", text: "A traced run of B, one repetition, shows the first step reported about 1.8 s after the lease loop started. The pieces the trace attributes: listing the test ids of the group takes about 0.26 s, the load inside the test run another 0.24 s, and forking Playwright workers and launching their browsers about 0.3 s. The 17 specs then run for about 2.5 to 3 s on four workers." },
        { kind: "p", text: "So roughly a third of a 5 s suite is a fixed start that the engine path pays and plain Playwright pays less of, because it forks workers directly. A suite this short cannot amortise it. The engine saves CPU by running one browser per worker, 4 workers against A's 8, and without a per-slot browser server or test server. Saving CPU does not shorten a start-up chain." },
      ],
    },
    {
      id: "fault",
      title: "Under a seeded fault it was worse",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A"], rows: [
          ["A", "9.3", "-", "17.1", "-"],
          ["B", "15.0", "+61%", "15.5", "-9%"],
          ["B+", "15.2", "+63%", "15.0", "-12%"],
          ["C", "21.5", "+130%", "18.4", "+8%"],
        ] },
        { kind: "p", text: "The fault was a search that ignores its query, failing 3 of 17 specs, one repetition per configuration. The cause is a design choice in the execution path. Each failing spec was run again with its trace on, so a failure cost two attempts, each waiting out the 5 s expect timeout, plus a new worker and browser after each failure. C was slower still: Lightpanda attempts failed first, fell back to Chromium and ran again." },
      ],
    },
    {
      id: "after",
      title: "What the negative result changed",
      blocks: [
        { kind: "p", text: "The result fed directly into ADR-0019, written the same day. It removes the rerun on failure: the first attempt keeps a lean trace and the failing run finishes, so flakiness is judged across runs and not inside one. The ADR lists keeping the rerun as a rejected option, because it made failing suites 61% slower than a baseline that does not rerun." },
        { kind: "p", text: "It also drops the separate listing pass, keeps one spare runner started and idle, and sweeps slot counts of 4, 6 and 8. All three savings are labelled hypotheses in the ADR until a heavier benchmark shows them. The only follow-up measurement in the records is on 60 specs, 2 repetitions: the lean trace cost 64.3 and 70.0 CPU-s against 68.2 and 71.0 with no trace, inside the run-to-run noise." },
        { kind: "callout", tone: "warn", text: "I have no record of the heavier benchmark meeting the 50% target. The claim today is lower CPU and memory at equal verdicts, not faster wall time." },
      ],
    },
  ],
};

export default post;
