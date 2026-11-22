import type { Post } from "./types";

const post: Post = {
  slug: "sagas-by-hand-vs-durable-execution",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Sagas by hand vs durable execution",
  summary: "A design comparison, with no measurements, of hand-built sagas and a durable workflow engine: what you write yourself in each, and what stays your problem either way.",
  tags: ["saga", "workflow", "design", "idempotency"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "What this is and is not",
      blocks: [
        { kind: "callout", tone: "note", text: "None of nagare's docs, ADRs or the research studies I read compare the two approaches, and nobody measured one against the other. This post is a design comparison. It contains no benchmark numbers on purpose." },
        { kind: "p", text: "The comparison is about work, not speed: which pieces you write and operate yourself, and which pieces a durable engine gives you. The engine-side claims come from nagare's ADRs. The by-hand side is the usual shape of the pattern, not a record of a specific system." },
      ],
    },
    {
      id: "by-hand",
      title: "A saga by hand",
      blocks: [
        { kind: "p", text: "A saga splits one business operation into local steps, each with a compensating step that undoes it. By hand, you end up building the same set of parts almost every time." },
        { kind: "list", items: [
          "A state table that records which step each instance reached, written in the same transaction as the step's own effect.",
          "A way to deliver the next command after that commit, which usually means an outbox table and a relay.",
          "An inbox or a unique key per message, because the relay and the broker both deliver at least once.",
          "Timers for deadlines and retries, with their own storage and a poller.",
          "Compensations that are themselves idempotent and retryable.",
          "A recovery job that finds instances stuck in the middle and moves them on.",
        ] },
        { kind: "p", text: "None of this is hard in isolation. The cost is that the control flow of the business operation ends up spread over handlers, tables and message types. To answer where an instance is, you read a state table and reconstruct the story." },
      ],
    },
    {
      id: "durable",
      title: "The same thing on a durable engine",
      blocks: [
        { kind: "p", text: "A durable engine moves the first five parts below your code. The state table is the journal. Delivery after commit is an outbox and an inbox the engine owns. Timers are durable sleeps. Recovery is replay: the run resumes from its recorded history." },
        { kind: "p", text: "In nagare the flow is a graph and each node ends with an outcome. A transport returns a failure with a code and a retryable flag. A retryable failure is retried, and a final one gives the outcome `failed`. The run then continues along the edge for that outcome, and if no edge exists the run fails. A compensation is therefore an ordinary branch of the graph, reachable from the failure edge of the step it undoes (ADR-0003)." },
        { kind: "p", text: "Where an instance is can be read from its event log. Every run's events are appended in one transaction with the read model and the outbox rows, so the story is a stored history and not a reconstruction." },
      ],
    },
    {
      id: "still-yours",
      title: "What stays yours either way",
      blocks: [
        { kind: "list", items: [
          "Compensation design. An engine cannot know how to undo a payment capture. You still decide the inverse operation and whether it is possible at all.",
          "Idempotent callees. Delivery is at least once in both worlds. In nagare every step carries a key built from run, node, visit and attempt, and it only helps if the service that receives it honours it. The cancel call is documented as at-least-once too, so it must treat an unknown or finished reference as success.",
          "Isolation. A saga is not a transaction: other readers can see the intermediate state between steps.",
        ] },
      ],
    },
    {
      id: "costs",
      title: "What the engine charges you",
      blocks: [
        { kind: "p", text: "Durable execution is not free of design cost. The workflow code, or here the interpreter, must be deterministic, so no clock, randomness or I/O outside recorded calls. Step keys become a contract, because replay matches on them. An incompatible change to the interpreter ships as a new build that drains old runs, since parked runs are not patched in place (ADR-0011)." },
        { kind: "p", text: "You also take on an engine as a dependency to operate, and in nagare's case a decision about which engine sits behind the port. That decision is the subject of the post on the durable-engine port." },
        { kind: "p", text: "My rule of thumb, as a hypothesis and not a finding: a hand-built saga is reasonable for two or three steps in one service that already has an outbox. Once timers, waits for outside events, cancellation and run history are all needed, the parts list above is a durable engine written slowly." },
      ],
    },
  ],
};

export default post;
