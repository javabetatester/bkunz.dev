import type { Post } from "./types";

const post: Post = {
  slug: "elicitation-is-not-approval",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Elicitation is not approval",
  summary: "MCP elicitation collects input from a person. It defines no approval message. What an approval record has to hold, from a code read of connector-engine, and how three gateways ask a human.",
  tags: ["mcp", "approval", "elicitation", "security", "gateway"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-spec-says",
      title: "What the spec says",
      blocks: [
        { kind: "p", text: "These quotes are from the MCP 2026-07-28 elicitation page, fetched on 2026-11-20 for the connector-engine controls study. The same sentences appear in 2025-11-25." },
        { kind: "list", items: [
          "Form mode collects structured data in band, and the data is exposed to the client. URL mode sends the person to an external URL, and data other than the URL is not exposed to the client.",
          "Servers MUST NOT use form mode for passwords, API keys, tokens or payment credentials, and MUST use URL mode for those.",
          "Servers MUST bind elicitation requests to the client and user identity. Clients SHOULD let the user decline at any time.",
          "The response is accept, decline or cancel. Accept means the user consented to the interaction, not that it is complete.",
          "On the tools page: there SHOULD always be a human in the loop able to deny tool invocations.",
        ] },
        { kind: "p", text: "My reading, which the scout note also states: the spec defines no approval message type. Elicitation is generic input collection. Using it for approval is a convention a gateway adds." },
      ],
    },
    {
      id: "gateways",
      title: "How gateways use it",
      blocks: [
        { kind: "table", head: ["Gateway", "How a person approves"], rows: [
          ["DigitalOcean Action Gateway", "Uses elicitation when the client supports it, otherwise a separate approve/deny path with an approval id and expiry. The approval is consumed once and bound to team, endpoint scope, tool version and arguments."],
          ["Composio", "The end user answers. With clients that do not support elicitation, calls that need approval are denied unless a fallback setting is set to allow. Always approve lasts the rest of the session."],
          ["connector-engine", "Out of band: console, chat surfaces and paired desktops. Elicitation is off by default per app."],
        ] },
        { kind: "p", text: "All three descriptions are the vendor describing its own product, read through a fetch tool, so medium confidence. The pattern is that elicitation is the in-band convenience and a second channel is the fallback." },
      ],
    },
    {
      id: "why-out-of-band",
      title: "Why connector-engine keeps it out of band",
      blocks: [
        { kind: "p", text: "The security model lists one thing as out of scope: an agent token holder approving its own call through MCP elicitation, when the owner has turned elicitation on for that app. Think about it from the threat side. If the agent's client relays the question, the agent's client also relays the answer. The party being governed sits in the approval path." },
        { kind: "p", text: "Out of band means the question travels over a channel the agent does not control. Chat surfaces accept clicks only from the configured owner id, link tokens are single-use HMACs, and call arguments stay out of third-party messages." },
      ],
    },
    {
      id: "record",
      title: "What the approval record holds",
      blocks: [
        { kind: "p", text: "The study read the approval code at commit 905a503. Nothing was run. The record carries, among about thirty fields, the definition hash, the class of the function, a call hash, sealed arguments, approvers, mode, state, channel and expiry. The state machine is: pending, then approved, denied, expired or cancelled; approved, then executing or cancelled; executing, then executed, failed or outcome unknown; then delivered once." },
        { kind: "table", head: ["Default", "Value"], rows: [
          ["Approval timeout", "600 s"],
          ["Execute within, after the decision", "60 s, else cancelled as stale"],
          ["Execute grace past the call deadline", "10 s, then outcome unknown"],
          ["Max pending per session, agent and connector", "5"],
        ] },
        { kind: "p", text: "Two choices stand out. A decided approval expires if not executed within 60 seconds, so a click cannot be banked. And an outcome unknown is never retried: the engine does not know whether the side effect happened, so it does not guess." },
        { kind: "p", text: "A repeated call with the same call hash attaches to the open record instead of opening a second one, and an approved call runs once." },
      ],
    },
    {
      id: "found",
      title: "What the read found wrong",
      blocks: [
        { kind: "p", text: "A docs claim said the engine stores only a hash of call arguments. That is true of the audit row. The approval row, however, kept the sealed plaintext until retention ended, which defaults to one hour. The study logged it as doc drift. Its closing note says every defect found by the study was fixed or kept by an owner decision; I did not re-verify each fix." },
        { kind: "callout", tone: "note", text: "The study's nine controls were paused by the owner on 2026-11-21. Only the storage of the permission change log is merged. Treat the designs as a roadmap, not a commitment." },
      ],
    },
  ],
};

export default post;
