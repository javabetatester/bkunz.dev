import type { Post } from "./types";

const post: Post = {
  slug: "exactly-once-over-a-journal",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "What exactly-once over a journal costs",
  summary: "Measured numbers for putting a durable workflow engine's memory behind a transactional journal and outbox: per-step latency, relay throughput, and where the same hop did not pay off.",
  tags: ["workflow", "postgres", "outbox", "latency"],
  project: "versatile-sh",
  sections: [
    {
      id: "claim",
      title: "What the claim means",
      blocks: [
        { kind: "p", text: "Nobody gets exactly-once delivery over a network. What a durable workflow engine can give is exactly-once effects: a step may run twice, but its recorded result is written once and read back on replay. nagare, the durable workflow engine I work on, is built on that split." },
        { kind: "p", text: "The engine keeps its interpreter in the host and treats the durable part as a journal: an append-only sequence of entries per run. Steps are at-least-once by decision (ADR-0002). A step that ran but was not recorded runs again after its lease expires. The journal makes everything after the record exactly-once." },
        { kind: "p", text: "This post is about what that costs in milliseconds. All figures come from the engine's performance notes, one ADR and a latency study. Each carries its conditions, and none is a promise for other hardware." },
      ],
    },
    {
      id: "mechanism",
      title: "The mechanism",
      blocks: [
        {
          kind: "list",
          items: [
            "Every durable call (step, now, id, sleep, wait, recv, start-child) takes the next sequence number. Replay returns the recorded entry and fails the run as non-deterministic when the kind or key differ.",
            "A run is leased with a fence. Claim increments the fence and attempt count, and every write carries (run_id, fence). A write with a stale fence changes nothing, so a zombie executor cannot overwrite the live one.",
            "Receive consumes a mailbox message into the recv entry atomically. The message is never lost or read twice across a crash, and a dedup id stays delivered for the life of the run.",
            "Events leave through a transactional outbox. A state change and its event row commit in one transaction, and a relay publishes later.",
          ],
        },
        { kind: "p", text: "The outbox side is plain Postgres. An AFTER INSERT statement trigger calls pg_notify, one LISTEN connection wakes the workers, and polling every 2 s stays as the fallback. Workers shard by hash(tenant/kind/stream/epoch) modulo N, so one stream is never served by two workers of a process. Replicas split work with FOR UPDATE SKIP LOCKED. Delivered events are settled with one UPDATE ... FROM unnest(...) instead of one statement each." },
      ],
    },
    {
      id: "per-step",
      title: "Per-step cost",
      blocks: [
        { kind: "p", text: "The first question was whether a journal behind a gRPC hop would add latency over an in-process durable library. The study measured a 3000-step workflow of no-op steps returning a 1 KB result, 5 runs, 1000 warm-up steps, Postgres 16 on tmpfs, one machine." },
        {
          kind: "table",
          head: ["Variant", "serial p50", "serial p99", "steps/s, 16 callers"],
          rows: [
            ["DBOS in-process", "752 us", "1776 us", "5810"],
            ["Direct insert, no hop", "156 us", "309 us", "29913"],
            ["Remote Record, unix socket", "295 us", "615 us", "18653"],
            ["Remote Record, tcp", "291 us", "509 us", "15772"],
          ],
        },
        { kind: "p", text: "The hop cost +0.14 ms at p50 and +0.2 to 0.3 ms at p99 over a direct insert. The remote journal was faster per step than DBOS in process, which does more work per step: its own system tables, a check, then a write. The study's reading is that DBOS does more per step, not that the hop is free." },
        { kind: "p", text: "The ADR then re-measured with the real journal: 2000 sequential 1 KB steps, compose Postgres, gRPC over loopback, 3 runs. Remote p50 was 1.13 to 1.17 ms and p99 1.71 to 1.80 ms. DBOS was p50 1.11 to 1.19 ms and p99 1.68 to 2.27 ms. At that point the two are indistinguishable. A real step is a call-out that takes several milliseconds, so 0.3 ms is under 10% of it." },
        { kind: "callout", tone: "warn", text: "The study did not measure Claim, Heartbeat, Load, Wake or Signal, and its prototype table had no fencing check. A real Record is somewhat slower than the prototype row. The run load average was 12 to 21 on 16 cores, so p99 is noisy." },
      ],
    },
    {
      id: "throughput",
      title: "Throughput and the outbox",
      blocks: [
        { kind: "p", text: "Two benchmarks in the engine repository cover the Postgres store. Both ran on 2026-11-07 on an AMD Ryzen 7 5700X with Postgres 16 in Docker on the same host, default settings." },
        {
          kind: "table",
          head: ["Benchmark", "Conditions", "Result"],
          rows: [
            ["Transitions", "8 clients, Create plus four Append calls per run, outbox inserts included", "676 to 784 transitions/s"],
            ["Outbox relay", "4 sharded sources, 30000 preloaded events, batches of 500, no-op sink", "17000 to 18600 events/s"],
          ],
        },
        { kind: "p", text: "So the relay drains roughly 25 times faster than the store produces on this box. That ratio matters more than either number: the outbox is not the bottleneck, the transactional write path is." },
        { kind: "p", text: "A third measurement guards a different cost. Runs at interpreter level 1 peek at an already delivered inbox message before each call or subflow. The gate was at most 2 ms p99 added per call and at most 15% throughput loss. Across 30 workflows of 10 sequential stub calls, the in-memory engine added 0.04 ms per call at p99 (3.4% throughput loss), and the remote journal showed no loss. Before the non-blocking read, the same run cost Temporal 9.9 ms per call." },
      ],
    },
    {
      id: "negative",
      title: "Where the hop did not pay",
      blocks: [
        { kind: "p", text: "The same study tried the same idea on a different workload: putting a transactional store behind a streaming session, one round trip per store call. That one failed its gate, and I think it is the more useful half of the result." },
        { kind: "list", items: [
          "An 8-call create session added 928 us at p50 on a unix socket and 1327 us over tcp, with p99 added of +2140 us and +2489 us. The gate was 2 ms.",
          "Mixed throughput with 16 callers dropped 20.6% to 32.5% against in-process, against a limit of 15%.",
          "A second, test-orchestration workload with 7-call sessions lost 42 to 47% of throughput on tmpfs.",
        ] },
        { kind: "p", text: "The cause is structural. A transaction and its pool connection stay open across every round trip, so a 16-connection pool saturates sooner and locks are held longer. A journal does not have that shape: each Record is one statement and one unary call, with no transaction held open across calls. My conclusion is a hypothesis, not a proof: the hop is cheap when each call is independent, and expensive when calls share a transaction." },
      ],
    },
    {
      id: "limits",
      title: "Limits of these numbers",
      blocks: [
        { kind: "list", items: [
          "One machine, loopback or unix sockets. Cross-node latency was not measured.",
          "tmpfs makes commits cheap. Disk-backed Postgres was fsync-bound in the one disk run I have and was inconclusive.",
          "The outbox and transition benchmarks are single runs on one date. The ranges are what the repository reports.",
          "Lease fencing under contention, crash recovery time and long waits are covered by tests, not by these latency numbers.",
        ] },
        { kind: "p", text: "What I would take from it: exactly-once effects are cheap when the journal is a thin unary interface over single statements, and the cost shows up when you stretch a transaction across a network." },
      ],
    },
  ],
};

export default post;
