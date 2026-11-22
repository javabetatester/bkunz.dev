import type { Post } from "./types";

const post: Post = {
  slug: "durable-execution-explained-through-nagare",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Durable execution, explained through nagare",
  summary: "What a journal, deterministic replay, an inbox and an outbox actually do in a durable workflow engine, and why at-least-once plus idempotent boundaries is what exactly-once means in practice.",
  tags: ["workflow", "durable-execution", "journal", "inbox", "outbox"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem",
      blocks: [
        { kind: "p", text: "A workflow that calls three services can crash between the second and the third call. A durable engine's job is to make that crash boring: the run resumes where it was, and the calls that already happened do not happen again." },
        { kind: "p", text: "nagare is the durable workflow engine I work on. A workflow is a JSON graph with nine node types. Every side effect is a call of an operation on a connection. This post explains the four mechanisms that make a crash boring, using the engine's own ADRs as the source: the journal, deterministic replay, the inbox and the outbox. There are no benchmarks here. The numbers are in a separate post, What exactly-once over a journal costs." },
      ],
    },
    {
      id: "journal",
      title: "The journal",
      blocks: [
        { kind: "p", text: "A journal is an append-only list of entries per run. Each durable thing the interpreter does takes the next sequence number: a step, a read of the clock, a generated id, a sleep, a wait, a received message, the start of a child run." },
        { kind: "p", text: "A step is a named command. Its key is built from the node, how often the node was entered, and the attempt, for example `<node>#<visit>@<attempt>`. The same string, prefixed with the run id, is the idempotency key handed to whatever answers the call." },
        { kind: "code", lang: "text", caption: "Step keys the interpreter uses (ADR-0003 addendum)", code: "load                       definition load\ncreate:<node>              child run creation\n<node>#<visit>@<attempt>   call attempt\n<key>/status<n>            status poll\nemit:<seq>                 event flush\n<key>~r<n>                 infrastructure retry, n above 1" },
        { kind: "p", text: "Keys are part of the replay contract. Changing one is an incompatible interpreter change, and the ADR says it ships as a new build that drains the old one instead of patching parked runs." },
      ],
    },
    {
      id: "replay",
      title: "Deterministic replay",
      blocks: [
        { kind: "p", text: "After a crash the engine does not restore a memory snapshot. It runs the interpreter again from the start. Each durable call asks the journal first: if an entry exists at that position, the recorded result is returned and nothing executes. Only the first position with no entry runs for real." },
        { kind: "p", text: "That only works if the interpreter makes the same sequence of calls every time. So the interpreter is deterministic by rule. Inside the interpreter package there is no `time.Now`, no `math/rand`, no goroutines, no `select`, no unsorted map iteration, no I/O and no globals. Time and ids come from the durable context, so they are recorded once and replayed." },
        { kind: "p", text: "The journal checks this at runtime. If replay asks for a call whose kind or key differs from the recorded entry, the run fails with a non-determinism error instead of continuing on a wrong history." },
        { kind: "callout", tone: "note", text: "Retries follow the same rule. Each attempt is its own step, backoff is a durable sleep, and the engine's native retry is switched off. One interpreter owns retry semantics, so every engine behind the port behaves the same." },
      ],
    },
    {
      id: "inbox-outbox",
      title: "Inbox and outbox",
      blocks: [
        { kind: "p", text: "The journal covers what happens inside a run. The edges need the same treatment. A callback that arrives while the engine is down must not be lost, and an event that a run emits must not be lost or published twice." },
        { kind: "p", text: "Inbound, ADR-0012 says: persist, then acknowledge. Every webhook, callback, signal and event is inserted into a table and answered at once. The key is tenant, source and message id, unique across replicas. A new message answers 202 and a duplicate answers 200. The handler never calls the engine. A dispatcher delivers later, in order per ordering key, at least once. Before this change, an engine outage returned 5xx to a caller that would never resend." },
        { kind: "p", text: "Outbound is the mirror. Appending run events writes the events, the read-model projection and the outbox rows in one transaction, guarded by the last sequence number. A relay publishes the rows to sinks afterwards, also at least once. The event id is built from tenant, stream and sequence, so a consumer can drop repeats. When a run id is reused after a delete, an epoch is added to the id so the new history does not collide with the old one (ADR-0015)." },
      ],
    },
    {
      id: "exactly-once",
      title: "What exactly-once means here",
      blocks: [
        { kind: "p", text: "The README is blunt: the engine is not exactly-once. Delivery is at least once everywhere, and every boundary is idempotent instead. A step can run twice if the process dies after the call and before the record. Under the remote journal that case is explicit: the step runs again after the lease expires." },
        { kind: "list", items: [
          "Inbound duplicates are absorbed by the unique message key and by the engine's own inbox dedupe for signals.",
          "A repeated step carries the same idempotency key, so a callee that honours it applies the effect once.",
          "A retried event flush never duplicates events, because the append is idempotent by expected sequence.",
          "Outbound repeats carry the same event id, so a consumer that deduplicates on it sees each event once.",
        ] },
        { kind: "p", text: "So exactly-once is a property of effects, achieved by recording results once and making every repeat harmless. It depends on the callee honouring the key. The engine can prove its own side with a side-effect ledger in the test suite, where a duplicate key fails a case. It cannot prove a callee it does not control." },
        { kind: "p", text: "One more guard keeps a zombie from undoing this: runs are leased with a fence. Every journal write carries the run id and the fence, and a write with a stale fence changes nothing." },
      ],
    },
  ],
};

export default post;
