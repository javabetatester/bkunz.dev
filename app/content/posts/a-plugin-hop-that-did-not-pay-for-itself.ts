import type { Post } from "./types";

const post: Post = {
  slug: "a-plugin-hop-that-did-not-pay-for-itself",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "A plugin hop that did not pay for itself",
  summary: "A latency study for tsugite, the plugin protocol: a journal behind a remote call passed its gate, but a database transaction streamed through a plugin failed on both limbs, in two engines.",
  tags: ["tsugite", "latency", "grpc", "postgres", "negative-result"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "The question",
      blocks: [
        { kind: "p", text: "tsugite is the protocol that lets an engine's ports be served by an out-of-process plugin. Before building the store half of it, I wanted to know what a remote hop costs when the thing behind it is a database transaction. The gate: at most 2 ms of added p99 per write session and at most 15% throughput loss. Both limbs must hold." },
        { kind: "p", text: "The same study measured the journal case for the workflow engine. That part passed, and is covered in What exactly-once over a journal costs. This post is about the part that failed." },
      ],
    },
    {
      id: "method",
      title: "Method and conditions",
      blocks: [
        { kind: "list", items: [
          "Machine: 16 cores, Linux 7.2, Go 1.27.3, gRPC 1.83.2, everything on one box, `nice -n 10`.",
          "Postgres 16.16 alpine in a container, on tmpfs. tmpfs makes commits cheap, so relative throughput loss is pessimistic and absolute p99 added is not affected. One of the two engines was also run against a Docker volume on disk.",
          "The prototype imported the real store package of each engine, so the SQL was production SQL.",
          "Wire format: a gRPC bidirectional stream, JSON frames, one synchronous round trip per operation. No schema, no batching.",
          "Latency is closed-loop with one caller, throughput uses 16 goroutines for 8 s after a 3 s warm-up, 5 runs, medians reported. Warm-up before every measurement.",
        ] },
        { kind: "callout", tone: "warn", text: "The machine was not quiet: load average 12 to 21 on 16 cores for the first engine, 7 to 20 for the second. p99 and throughput are noisy. One tcp-loopback run had p99 1864 us against 162 to 265 us in the others." },
      ],
    },
    {
      id: "hop",
      title: "A hop is cheap",
      blocks: [
        { kind: "p", text: "A unary gRPC echo, one caller, 20000 calls per run: 63 us p50 and 222 us p99 over a unix socket with a 64 B payload, 80 us and 184 us over tcp loopback. A hop costs 0.06 to 0.10 ms at p50 and about 0.2 ms at p99. That matched the hypothesis for p50 and beat it for p99." },
        { kind: "p", text: "A store operation through the session stream costs about 115 us at p50 per op, which is the hop plus JSON and the plugin goroutine. Small, until you multiply it." },
      ],
    },
    {
      id: "sessions",
      title: "Sessions multiply it",
      blocks: [
        { kind: "p", text: "A write session is several operations inside one transaction: for the first engine, create is 8 operations. The transaction and its pool connection stay open for all the round trips." },
        { kind: "table", head: ["Variant, first engine", "create p50 us", "create p99 us", "sessions/s, 16 callers"], rows: [
          ["in-process", "1346", "2743", "3801"],
          ["session stream, unix", "2274", "4883", "2565 (-32.5%)"],
          ["session stream, tcp", "2673", "5232", "3017 (-20.6%)"],
        ] },
        { kind: "p", text: "Added p99 for create was +2140 us over unix and +2489 us over tcp. Throughput loss was 21 to 33%. Both limbs failed. The study notes that the unix run being slower than tcp is noise from machine load: runs ranged 2378 to 3048 for tcp and 2565 to 3500 for unix." },
        { kind: "p", text: "For hakoniwa's store the hot sessions have 7 operations (report a step, finish a run). On tmpfs the added p99 was 2.1 to 6.8 ms across the hot run paths, and throughput fell 41.9% over unix and 47.4% over tcp. On disk-backed Postgres the unix loss was 28.5% and tcp 7.5%, but that run is inconclusive: fsync-bound, only 3 rounds, with added p99 spikes of +21 to +42 ms in several rows." },
      ],
    },
    {
      id: "why",
      title: "Why, and what I did instead",
      blocks: [
        { kind: "p", text: "The study's explanation, which fits the numbers: the transaction holds a pooled connection across N round trips, so a 16-connection pool saturates sooner, and the host and plugin burn CPU on the same box. Locks taken inside the transaction are held across all of them too." },
        { kind: "p", text: "The consequence was a plan change, not an abandoned plugin. The store takes the cheaper path: an embedded tier plus command-shaped operations, where one RPC carries one whole transaction. The study's plan table puts both store plugins on that path. The hakoniwa commits of the same day include the embedded store tier template." },
        { kind: "callout", tone: "note", text: "A pipelined session, sending blind writes without waiting and surfacing errors at the next read or commit, projects to roughly +0.4 to 0.5 ms p50 and 1 to 1.3 ms p99 for create. That is a projection from round-trip counts. It was not built or measured, and it would change the meaning of a write error." },
        { kind: "p", text: "Not measured: cross-node, lock contention between callers, and the full store test suite through the remote path, since the prototype proxied only the workload's methods." },
      ],
    },
  ],
};

export default post;
