import type { Post } from "./types";

const post: Post = {
  slug: "why-the-durable-engine-sits-behind-a-port",
  category: "studies",
  date: "2026-11-07",
  published: "2026-11-21",
  title: "Why the durable engine sits behind a port",
  summary: "The decision record for nagare's durable engine: two engines behind one interface, the alternatives that were rejected, what the choice cost, and what the first measurements showed.",
  tags: ["adr", "architecture", "workflow", "dbos", "temporal"],
  project: "versatile-sh",
  sections: [
    {
      id: "decision",
      title: "The decision",
      blocks: [
        { kind: "p", text: "On 2026-11-07 the research draft WF-ADR-002 proposed that nagare reach durability only through one Go interface, with one engine as the default and a second kept first-class. The engine ADR accepted the same day. This is what it chose, what it turned down, and what it cost." },
        { kind: "list", items: [
          "The interpreter talks to a durable context with Step, Sleep, WaitFor, Child, Now, NewID and continue-as-new hooks. The server talks to an engine with Start, Signal, Cancel and the like.",
          "DBOS Transact is the default: a Go library on the same Postgres, so v1 is one binary plus Postgres.",
          "Temporal is first-class from the first version, kept green by a differential test suite. The draft sets a trigger for moving production to it: sustained load above 2,000 transitions per second per cluster, multi-region active-active, or a contract that requires it.",
          "An in-memory engine backs unit tests and dry runs.",
        ] },
      ],
    },
    {
      id: "alternatives",
      title: "Alternatives that lost",
      blocks: [
        { kind: "table", head: ["Option", "Why not"], rows: [
          ["TypeScript core on the TS SDKs", "the owner chose Go, and the Go SDKs cover the same primitives"],
          ["Temporal as the default", "four extra services and a second database for every install from day one"],
          ["Hatchet", "separate engine process; versioning story unverified"],
          ["A home-made engine", "reimplements recovery, queues, schedules and fork with less testing"],
        ] },
        { kind: "p", text: "The research also ruled several products out on licence terms for a product sold as a service. That is a legal fit check done on the dated sources in the notes, not a judgment of quality." },
      ],
    },
    {
      id: "costs",
      title: "What it costs",
      blocks: [
        { kind: "p", text: "Two adapters have to be maintained from the start, and the lowest common denominator leaks. The accepted ADR records two consequences that the draft did not have." },
        { kind: "list", items: [
          "A closure cannot be a Temporal activity, since activities are registered functions with serializable arguments. So steps became named commands: Step(key, op, args), with handlers in a registry shared by every engine.",
          "Engine-native retry is off everywhere. The interpreter owns retry, timeouts and cancellation semantics (ADR-0003), so each retry attempt is its own step. That means more steps per retried node, which the ADR accepts for parity.",
        ] },
        { kind: "p", text: "The parity itself needs proof. A differential suite runs every case on each engine and compares normalized events plus a side-effect ledger with one row per idempotency key. Its 26 numbered scenarios cover control flow, retries, async callbacks, crash and recovery, limits and idempotent start, plus recorded Temporal histories replayed against the current interpreter. By decision there is no CI: whoever changes the core, the ports or an engine runs the suite locally before merging, and nothing enforces it." },
      ],
    },
    {
      id: "measured",
      title: "What the port later made cheap and visible",
      blocks: [
        { kind: "p", text: "Having a port made a third engine possible without touching the interpreter: a remote journal behind a plugin, accepted on 2026-11-13. A run-control feature then had a measured cost on every engine. The run-control inbox read was measured on the development machine on 2026-11-13: 30 workflows of 10 sequential stub calls, compared with and without the read." },
        { kind: "table", head: ["Engine", "p99 per run, without to with", "Added per call (p99)", "Throughput loss"], rows: [
          ["memory", "1.06 ms to 1.50 ms", "0.04 ms", "3.4%"],
          ["DBOS", "1.0037 s to 1.0037 s", "< 0.01 ms", "0.0%"],
          ["Temporal", "2.355 s to 2.353 s", "none", "0.0%"],
          ["remote journal", "42.7 ms to 35.7 ms", "none", "-3.0%"],
        ] },
        { kind: "p", text: "The same table shows what the abstraction hides: a run on DBOS takes about a second for ten stub calls. The notes attribute that to its queue polling, which also hides the cost of the read. The port gives the same behaviour. It does not give the same latency." },
        { kind: "callout", tone: "note", text: "The draft's acceptance criterion was a soak with 100 kill -9 during runs, 0 lost runs, 0 duplicated side effects. I did not find a record of that soak in the files I read, so I am not claiming it was run." },
      ],
    },
  ],
};

export default post;
