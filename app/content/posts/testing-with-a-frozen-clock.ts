import type { Post } from "./types";

const post: Post = {
  slug: "testing-with-a-frozen-clock",
  category: "studies",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "Testing with a frozen clock",
  summary: "Controlled worlds for tests in hakoniwa: a clock you can jump, a database you can fork, faults you can seed. What the spikes proved, and the benchmark where wall time did not improve.",
  tags: ["testing", "clock", "postgres", "benchmark"],
  project: "versatile-sh",
  sections: [
    {
      id: "idea",
      title: "The idea",
      blocks: [
        { kind: "p", text: "Browser tests flake for reasons that are not about the code under test: real time passes, shared state leaks, an external service answers late. hakoniwa, the test engine, runs a test inside a controlled world instead: the clock is a value you set, the database is a fork of a snapshot, and the services around the app are doubles that you can make misbehave." },
        { kind: "p", text: "This post is about two things I measured. One is whether such a world is sound when you jump time hard. The other is whether the engine makes the suite faster. The first mostly worked. The second did not, and the numbers are below." },
      ],
    },
    {
      id: "clock",
      title: "A clock you can jump",
      blocks: [
        { kind: "p", text: "One Advance call sets three things at once: the doubles (the payment service), a seam in the app's own code (a clock interface), and a libfaketime offset file read by Postgres 18. The spike S8 jumped +1 h, +1 d and +30 d in sequence, each in a container limited to 2 CPUs and 4 GB." },
        {
          kind: "table",
          head: ["Jump", "Advance", "Pending order after the jump", "Fresh order settles"],
          rows: [
            ["+1 h", "158 ms", "paid at 1 ms", "2.29 s"],
            ["+1 d", "154 ms", "paid at 1 ms", "2.02 s"],
            ["+30 d", "155 ms", "paid at 2 ms", "2.02 s"],
          ],
        },
        { kind: "list", items: [
          "now(), clock_timestamp() and statement_timestamp() followed every jump, on a persistent connection and a fresh one.",
          "Autovacuum ran within 0.5 to 1 s of churn after each jump. Each jump caused one immediate checkpoint, then the normal 30 s cadence resumed.",
          "The Postgres log held only the two start-up lines. No ERROR, WARNING or PANIC.",
        ] },
        { kind: "callout", tone: "note", text: "Caveats from the same spike: libfaketime applies to a whole server process tree, so a world needs its own Postgres rather than a fork on a shared one. When the offset file is removed at teardown the server clock moves back by the jumped amount, so the server must die with its world. pg_cron was not tested." },
      ],
    },
    {
      id: "quiet",
      title: "Jumping while traffic runs",
      blocks: [
        { kind: "p", text: "A jump in the middle of a request is the dangerous case. The world only moves the clock when it judges the app quiet, by sampling in-flight work twice. Spike S10 measured how often that judgement was wrong: scripted shoppers placed, paid and showed orders over HTTP while a jumper issued 100 jumps of +10 s with 50 to 200 ms pauses." },
        { kind: "table", head: ["Load", "Requests", "Accepted / refused", "In flight at the jump", "Webhook failures"], rows: [
          ["3 shoppers, 50 to 150 ms think", "3006", "100 / 0", "0", "0 of 2997"],
          ["4 shoppers, 20 to 60 ms think", "14450", "100 / 0", "0", "0 of 14383"],
        ] },
        { kind: "p", text: "Over 400 accepted jumps, one was a probable false quiet (0.25%). On the final code it was 0 of 200, with a 95% upper bound of 1.5%. Under saturating load the probe refused: 106 of 106 jumps returned world not quiet after 10 s, and none jumped silently. The residual race is the gap between the last sample and the write of the new time." },
        { kind: "p", text: "Measuring also found an engine bug. Under saturating load the world pinned a CPU and took over 18 minutes to tear down after 221k requests. A goroutine dump showed the payment double rescanning every intent on each delivery. Settlements now wait in a FIFO ordered by time, and the same window served 55% more requests with a 0.1 s teardown." },
      ],
    },
    {
      id: "flake",
      title: "How many controls you need",
      blocks: [
        { kind: "p", text: "A reproduction verdict compares treatment runs against control runs of the unmodified world. Spike S11 ran 149 counted controls on the checkout app and saw 0 failures. One further run was not executable: the app lost a port race, which costs a run and not a verdict." },
        { kind: "p", text: "With zero failures the one-sided 95% bound on the control flake rate is 1 - 0.05^(1/N). It is 45.1% at N = 5, the default then, 25.9% at N = 10 and 5.82% at N = 50. Getting under 5% needs N = 59, which the maximum of 50 forbids. The recommendation was to raise the default to 10 and the maximum to 60." },
      ],
    },
    {
      id: "negative",
      title: "The honest negative: wall time",
      blocks: [
        { kind: "p", text: "The target in ADR-0011 was at least 50% less wall time and CPU-seconds than plain Playwright (config A), with the same verdicts. The benchmark ran a 17-spec suite in containers limited to 4 CPUs and 6 GB, median of 3. B is the engine on Chromium with every shortcut off, B+ adds bench-only shortcuts, and C adds Lightpanda." },
        {
          kind: "table",
          head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"],
          rows: [
            ["A", "5.3", "-", "16.4", "-", "1687"],
            ["B", "5.1", "-4%", "10.4", "-37%", "817"],
            ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
            ["C", "5.1", "-5%", "10.1", "-39%", "627"],
          ],
        },
        { kind: "p", text: "Verdicts matched A in every repetition. CPU fell by 37 to 39% and memory by about half, but wall time stayed within noise. The target was not met." },
        { kind: "p", text: "A traced run explains why. The engine pays about 1.8 s before the first step: roughly 0.26 s listing test ids, 0.24 s loading, and about 0.3 s forking workers and launching browsers. The 17 specs then take 2.5 to 3 s on four workers. A 5 s suite cannot amortise a fixed start of that size." },
        { kind: "p", text: "It was worse under a seeded fault (a search that ignores its query, 3 of 17 specs failing, a single repetition): wall time rose 61% for B and 130% for C. Each failing spec runs again with a trace, so a failure costs two attempts that each wait out the 5 s expect timeout." },
        { kind: "callout", tone: "warn", text: "So the engine saved CPU and memory, not time, on this suite. What would still move wall time, by the benchmark's own notes: a runner already warm when the first run arrives, no separate listing pass, and a larger suite over which the start is amortised. None of these was built or measured." },
      ],
    },
    {
      id: "takeaway",
      title: "What I take from it",
      blocks: [
        { kind: "p", text: "A controlled world earns its place on determinism: a clock that jumps cleanly, controls that do not flake, a verdict with a stated bound. It did not earn a faster suite, and I would rather say that than quote the CPU line alone. The next measurement I want is a suite large enough to hide the 1.8 s start." },
      ],
    },
  ],
};

export default post;
