import type { Post } from "./types";

const post: Post = {
  slug: "transcripts-as-an-event-log",
  category: "studies",
  date: "2026-11-07",
  published: "2026-11-21",
  title: "A transcript is an event log",
  summary: "No protocol both drives an agent CLI and lets you own the conversation. What the vendor formats disagree on, and a proposal, not a build, for an append-only event stream with gap-free sequence numbers.",
  tags: ["agents", "transcripts", "event-log", "acp", "postgres"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "The question",
      blocks: [
        { kind: "p", text: "Is there a middle ground between ACP and the vendor message APIs that lets a platform keep conversations on its own side, for both model APIs and agent CLIs? The study ran on 2026-11-07 and 2026-11-08, reading source at pinned versions: Claude Code 2.1.319 and its Agent SDK 0.3.319, the Codex repository at d960b36, ACP schema 1.29.1 at 7441d10, the Anthropic SDK 1.6.0, the OpenAI SDK 7.53.0, and others." },
        { kind: "p", text: "The answer, as its record states: no protocol both talks to CLIs and holds a conversation you own. The observed fact is that resume depends on each engine's own native record. What follows the answer is a proposal." },
      ],
    },
    {
      id: "formats",
      title: "What the formats disagree on",
      blocks: [
        { kind: "table", head: ["Source", "Container"], rows: [
          ["Anthropic Messages", "A message with content blocks; system is a request parameter, not a message"],
          ["OpenAI Responses", "A flat list of typed items; a message is one item kind among many"],
          ["ACP v1", "No message object: a stream of session/update notifications, chunks grouped by message id"],
          ["Claude Agent SDK stream-json", "A union of 40 frame types"],
          ["Codex exec --json", "Thread, turn and item events; item kinds instead of roles"],
        ] },
        { kind: "p", text: "Reasoning is where they split most. Anthropic carries a readable thinking block with a signature, plus redacted thinking. OpenAI has reasoning summaries and optional encrypted content. ACP has thought chunks and no opaque reasoning at all. Codex does not expose it on the exec stream, though it keeps encrypted content in its own rollout. A store that wants to switch engine mid-conversation has to decide what to do with a blob only one provider can read." },
        { kind: "p", text: "A hypothesis the study left open for a test with a real key: whether the provider-specific encrypted blobs validate only for the same organisation and model family." },
      ],
    },
    {
      id: "streams",
      title: "Replay is not a log",
      blocks: [
        { kind: "p", text: "LangChain's Agent Protocol keeps a checkpoint history per thread, which its README calls an append-only log of states. Its thread streaming, by contrast, says servers may keep a ring buffer of recent events and, if a client's position was evicted, the client resyncs through state. The study's reading: live-stream replay is best effort, and the durable record is the checkpoint history." },
        { kind: "p", text: "That distinction is the point of this post. A transcript that people reconnect to, branch from and audit needs the durable thing, with the stream as a view over it." },
      ],
    },
    {
      id: "proposal",
      title: "The proposal: an item stream with an envelope",
      blocks: [
        { kind: "p", text: "Proposed, not built: an item stream modelled on Open Responses with ACP's tool-call fields, the raw provider payload kept beside each item, and official ACP adapters behind one Go ACP client. For live sync, a design note proposes an event envelope per conversation." },
        { kind: "table", head: ["Field", "Role"], rows: [
          ["seq", "Per conversation, gap-free, assigned in the append transaction so a client can detect loss"],
          ["id", "ULID, globally unique; the SSE event id"],
          ["causation_id", "The input or command that caused the event"],
          ["idempotency_key", "Client message id, or producer lease, attempt and sequence"],
          ["producer", "id, epoch, sequence; a stale epoch is rejected (fencing)"],
          ["occurred_at", "Producer clock, diagnostic only, never used to order"],
        ] },
        { kind: "code", lang: "sql", code: "UPDATE conversation SET head_seq = head_seq + 1 WHERE id = $1 RETURNING head_seq;", caption: "The sequence rule from the note: a row lock on one conversation, so writes serialise per conversation and nowhere else." },
        { kind: "p", text: "Token deltas would not be rows: they carry a position inside the open part and are ephemeral, with a snapshot of the open part sent on reconnect. Inputs are events too, with modes queue, steer and interrupt, and one lease holder drives a conversation at a time." },
      ],
    },
    {
      id: "evidence",
      title: "What was run and what was not",
      blocks: [
        { kind: "p", text: "Vendor formats, CLIs and other products were read from source. The schema is specified only. The live-session behaviour of Claude Code, Codex, Goose and ACP adapters was run offline against local mock model servers with fake keys, and most of the checks were confirmed. A Go driver spike confirmed steering, signed approvals and resume over the official claude-agent-acp and codex-acp adapters." },
        { kind: "callout", tone: "warn", text: "Open: whether injecting items into a fresh Codex thread is enough to continue a conversation stored only in your own database, and whether a daemon may drive a subscription-logged-in Claude Code, which is a terms question for the vendors. The sequence and envelope design is a proposal with no measurement behind it." },
      ],
    },
  ],
};

export default post;
