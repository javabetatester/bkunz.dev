import type { Post } from "./types";

const post: Post = {
  slug: "how-agents-talk-to-agents-and-clis",
  category: "studies",
  date: "2026-11-08",
  published: "2026-11-21",
  title: "How agents talk to CLIs and to each other",
  summary: "Two read-only studies of open-source agent runtimes: the layers between a task queue and an agent CLI, how Paperclip and Multica call agents, and what delegation looks like when one agent hands work to another.",
  tags: ["agents", "acp", "delegation", "sub-agents", "protocols"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "What was read",
      blocks: [
        { kind: "p", text: "Two studies, both on code read on 2026-11-07 and 2026-11-08: how three runtimes talk to agent CLIs, and how teams of agents delegate. The three runtimes are upstream Paperclip at commit 177f642, Multica at 4239ec1, and a fork of Paperclip that we maintain. Nothing was built and nothing was run. Every finding below is labelled observed, from reading code, or proposed." },
      ],
    },
    {
      id: "layers",
      title: "Four layers between a queue and an agent",
      blocks: [
        { kind: "p", text: "The fork has four execution layers, and a run picks one at dispatch. A heartbeat layer owns queue, claim and result storage. An adapter layer has one module per adapter type, owning spawn, HTTP or WebSocket and output parsing. Inside an adapter, an engine is either cli (spawn the CLI, parse its newline-delimited JSON) or acp (the Agent Client Protocol, JSON-RPC over stdio). Beside that sits a separate native runner, a Rust daemon speaking its own protocol over an authenticated WebSocket, and an edge daemon that pulls leased tasks from the customer side." },
        { kind: "p", text: "Observed: ACP is already the default engine for Codex, Gemini and Kimi in that fork, while permission profiles lock down only the Claude CLI adapter. The adapter contract is versioned, and upstream and the fork share the same twelve legacy adapter packages." },
        { kind: "p", text: "The fork point was 1,916 upstream commits behind at read time, growing by roughly 70 a day over 27 days, per a compare call on 2026-11-07. The only proposal the wiring study made on that evidence was a hypothesis: cherry-pick upstream fixes rather than merge." },
      ],
    },
    {
      id: "multica",
      title: "Multica: the agent calls back",
      blocks: [
        { kind: "p", text: "Multica is a Go server with a daemon that detects local agent CLIs and spawns them. One Go interface, Backend.Execute, returns a session with a normalised message stream: text, thinking, tool use, tool result, status, error, log. The record counted 28 provider families in code, plus one derived runtime." },
        { kind: "p", text: "The communication pattern differs from the fork. The agent talks back to the server by calling a multica CLI over HTTPS with a per-task token. The daemon also exposes a loopback HTTP endpoint for repository checkout. So the agent's tool surface is a CLI the platform ships, not an MCP server." },
      ],
    },
    {
      id: "delegation",
      title: "Delegation: what practitioners converged on",
      blocks: [
        { kind: "p", text: "The teams study read about 30 frameworks and products. Its first finding, from sources including Anthropic and Cognition writing and the MAST failure taxonomy: practitioners converge on manager-child delegation with one writer per artifact. Peer negotiation and parallel writers fail. The same note puts multi-agent cost at about 15 times the tokens of chat, a figure it takes from those secondary sources, not from a measurement of its own." },
        { kind: "list", items: [
          "No framework gave agents a real identity or an on-behalf-of principal. Identity was a name string.",
          "Approvals were per tool call, never team-level.",
          "Only AG2 v1 counted delegation depth (limit 5). Only ADK recorded team structure on every event and fenced peer output as untrusted.",
          "Every engine modelled a sub-agent as a tool call in the parent plus a child session with its own id. Steering a child from the host was mostly impossible.",
        ] },
      ],
    },
    {
      id: "holes",
      title: "Two holes confirmed in the fork",
      blocks: [
        { kind: "p", text: "The fork had the strongest delegation guard of the three products: per-line policy, a hand-off log, a hop cap of 3 and a team autonomy switch that fails closed. It also had the most dangerous defaults. Agents could hire agents with approval off, a budget of 0 meant unlimited, and no policy row meant no limit." },
        { kind: "p", text: "Confirmed by reading code: its delegate_task tool skipped the assign permission and the contact-policy check that REST assignment enforces. And its development auth treated any loopback peer as the owner. On 2026-11-08 the owner decided not to fix these in that product and to make them requirements for the new one." },
      ],
    },
    {
      id: "proposals",
      title: "What is only a proposal",
      blocks: [
        { kind: "p", text: "The study proposed explicit team and delegation rows, one delegation service as the only path, and authority narrowed at each hop, so a child can only tighten what the parent passed. Fourteen design questions went to the owner. Their recommendations, for example a depth cap of 3 with a default depth of 1, an in-flight cap of 4 and a lifetime cap of 50 per parent conversation, are recommendations. They were still open when I stopped, and none was tested." },
        { kind: "callout", tone: "warn", text: "Not tested: whether a core can meet Linear's 10-second first-activity deadline when the agent runs on an edge daemon, brief-only context, per-run engine caps, fan-out and stall defaults, and rules-based routing. All hypotheses." },
      ],
    },
  ],
};

export default post;
