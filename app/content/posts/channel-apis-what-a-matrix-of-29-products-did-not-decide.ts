import type { Post } from "./types";

const post: Post = {
  slug: "channel-apis-what-a-matrix-of-29-products-did-not-decide",
  category: "studies",
  date: "2026-11-17",
  published: "2026-11-21",
  title: "Channel APIs: what a 29-product matrix did not decide",
  summary: "A study of chat channel APIs for people and agents: 62 features across 29 products, three spikes that were only type checks, and a result that did not separate our own vocabulary from Matrix. With the proof levels.",
  tags: ["channels", "api-design", "matrix", "agents", "research"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "The question",
      blocks: [
        { kind: "p", text: "Two linked studies, 2026-11-16 and 2026-11-17. The first asked what a channel should be in an agent engine so the same screen works with people and several agents in it. The second asked which resource model and semantics the channel API should expose over the engine's existing wire." },
        { kind: "p", text: "Starting point, observed from code: a channel screen worked against an older runtime, the new engine served it only one direct message per agent, and the engine's core had no channel concept." },
      ],
    },
    {
      id: "evidence",
      title: "How much evidence, and of which kind",
      blocks: [
        { kind: "p", text: "The record keeps four proof levels per cell: read (code or type package), specified (a published API description), run, and hypothesis. After round 5 of the second study, derived by a script on 2026-11-17:" },
        { kind: "table", head: ["Item", "Count"], rows: [
          ["Products", "29 (15 direct, 14 indirect)"],
          ["Features", "62, of which 27 tagged as deciding"],
          ["Feature cells", "1,308"],
          ["Cells at read / specified / run / hypothesis", "316 / 929 / 0 / 63"],
          ["API vocabulary matrix", "9 candidates, 15 axes, 135 cells"],
        ] },
        { kind: "p", text: "Zero cells at run is the honest headline. The three spikes (57 scenarios over 5 vocabularies, with type checks and 58 tests green) ran only as type checks of the study's own transcription of each vendor wire, in an in-process model. They touched no vendor server, no vendor SDK and not our engine." },
        { kind: "p", text: "Audit error ended at 0.065 against a target under 5 percent, so that criterion was not met. Every market cell has one source, and integrator demand is, in the record's words, a hypothesis." },
      ],
    },
    {
      id: "result",
      title: "The result",
      blocks: [
        { kind: "p", text: "Observed: the matrix and spikes do not separate our own vocabulary from Matrix's, and Discord's scores four points worse. That is a statement about this scoring, which I did not independently validate." },
        { kind: "p", text: "The owner ruled on 2026-11-17: an own resource model over the existing wire, with names borrowed from vendor spec files (Matrix, Discord, Zulip), and a per-person feed of change hints with no id and no replay, built after the channel log. Designed, not built." },
        { kind: "p", text: "The first study had recommended a room with a timeline and one child conversation per agent and thread, in four phases. The second study found the room-based paths and access path did not hold and recommended a new channel log with the same mechanics." },
      ],
    },
    {
      id: "open",
      title: "Questions still open",
      blocks: [
        { kind: "list", items: [
          "Edit, delete and erasure on an append-only log. Recommendation: edits and deletes are events, delete hides, and erasure needs an event-level erase that ships with the channel log.",
          "Discord-like permissions. Recommendation: publish no permission object until a single authorizer enforces it, then start with allow-only tuples on a channel resource.",
          "Where a channel's timeline lives: a new channel log accessed through a channel resource type in the one authorizer.",
          "Whether an agent's session is per thread (recommended) or per channel, and who answers a message that names no agent: the thread's agent, else the room's auto-reply agent, else nobody.",
        ] },
        { kind: "p", text: "All four are recommendations awaiting a decision, not rulings." },
      ],
    },
    {
      id: "lesson",
      title: "What I would carry forward",
      blocks: [
        { kind: "p", text: "A wide matrix is cheap to fill and expensive to trust. The useful part was the split by proof level: it made visible that 929 of 1,308 cells rested on a published description of an interface, not on running anything. A decision between two vocabularies that score within a few points of each other is a decision about fit with your own wire, and the matrix cannot make it." },
        { kind: "callout", tone: "note", text: "Hypothesis, mine: an executable spike against one real vendor server would have been worth more than the second half of the matrix. I have not tested that." },
      ],
    },
  ],
};

export default post;
