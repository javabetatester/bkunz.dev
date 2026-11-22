import type { Post } from "./types";

const post: Post = {
  slug: "hakoniwa-2026-11-13-plugins-and-executors",
  category: "daily",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "hakoniwa, 2026-11-13: plugins and executors",
  summary: "A dev log of one day in the test engine's history: adopting the shared plugin kit, routing leases by runner, an executor port, evidence archiving by events, and a reference executor run on real k6.",
  tags: ["hakoniwa", "plugins", "devlog", "k6"],
  project: "versatile-sh",
  sections: [
    {
      id: "day",
      title: "The day in one paragraph",
      blocks: [
        { kind: "p", text: "After the 9th, hakoniwa's history is quiet: 3 non-merge commits on the 10th, none on the 11th or 12th, then 38 non-merge commits on the 13th. Nearly all of them are one theme. The engine stops being the only thing that can run a test and learns to hand an attempt to someone else." },
      ],
    },
    {
      id: "sequence",
      title: "Sequence",
      blocks: [
        { kind: "steps", items: [
          { title: "Adopt the plugin kit", text: "The first commit of the day adopts the shared plugin kit: plugin ports, conformance suites, an adapters file, discovery and a conform CLI. A second wave added env helpers, built-in config keys and an embedded marking for ports. The kit was bumped three times during the day as its own fixes landed." },
          { title: "Event catalog and webhooks", text: "The engine serves its event catalog and delivers its outbox through a Standard Webhooks sink. Inbound moved to the same shape in inbox v2: Standard Webhooks CloudEvents, accept lists, ordering keys, and attempt results under a grant." },
          { title: "Route by runner, record the trust", text: "Leases are routed by the runners a worker declares, and every run records a trust class. Later commits made starvation visible, bounded runner declarations and cancelled queued runs that no executor can run." },
          { title: "Ingest reported results", text: "A results report can become a finished run of trust reported. The evidence is bound to the principal that ingested it, and in production reported results sit behind a reviewed, acknowledged adapters file." },
          { title: "Control and live API", text: "A public run event log, retryRun, watchRun, watchControl and listExecutors, with regenerated SDKs." },
          { title: "Executor port and attempt protocol", text: "A plugin binding of the attempt protocol, judged per attempt by the holder's capability set and not the union of all holders. Then an event binding on its own route, with grants minted at delivery." },
          { title: "A reference executor on real k6", text: "A k6 executor and a k6 dialect, with an acceptance test over four bindings. The examples were then run on real k6, over gRPC, including the stop path." },
        ] },
      ],
    },
    {
      id: "details",
      title: "Two details worth keeping",
      blocks: [
        { kind: "p", text: "Capability sets per attempt. A commit titled Judge each attempt by the holder's capability set, not the union changed the rule: an attempt is checked against the executor that would run it, and not against everything all connected executors can do together. The union is wrong when no single executor has the whole set." },
        { kind: "p", text: "Stale requests. Several commits are about the same hazard: an attempt request that arrives after the attempt moved on. The fixes judge accept at arrival, mint no grant for a stale attempt, count and log such requests, and make a repeated accept idempotent. A missing version is never called stale." },
      ],
    },
    {
      id: "same-day",
      title: "The same day, next door",
      blocks: [
        { kind: "p", text: "The commit that adds the embedded store tier and the mapped command-shaped store ADR is a consequence of a latency study run that day. The study found that putting a database transaction behind a plugin session fails a latency gate. It is the subject of a separate post, A plugin hop that did not pay for itself." },
      ],
    },
  ],
};

export default post;
