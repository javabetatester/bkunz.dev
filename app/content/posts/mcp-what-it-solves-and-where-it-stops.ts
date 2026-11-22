import type { Post } from "./types";

const post: Post = {
  slug: "mcp-what-it-solves-and-where-it-stops",
  category: "studies",
  date: "2026-11-05",
  published: "2026-11-21",
  title: "What MCP solves, and where it stops",
  summary: "From two research records: MCP standardises the wire between an agent and a tool server. Auth for background work, approval, tool-definition drift and per-tenant catalogs are left to whoever sits in the middle.",
  tags: ["mcp", "protocols", "auth", "gateway", "multi-tenant"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "What I am reporting",
      blocks: [
        { kind: "p", text: "This is a summary of research records, not an opinion piece. The first is a survey of the MCP, identity and gateway layer: 29 products classified, sources accessed on 2026-11-05. The second is a protocol cheat sheet condensed from a longer proposal, whose own text says it was gathered and reviewed by AI agents only and not yet validated by a team. I treat everything from it as medium confidence." },
        { kind: "p", text: "Where I add a reading of my own, I label it a hypothesis. The third source is the documentation and architecture notes of connector-engine, an open-source gateway I work on, which show one concrete answer to each gap." },
      ],
    },
    {
      id: "solves",
      title: "What MCP solves",
      blocks: [
        { kind: "p", text: "MCP gives an agent one way to list and call tools, read resources and ask a person for input, over JSON-RPC and streamable HTTP. The cheat sheet records the 2026-07-28 revision as stateless: no initialize handshake, no session id header, version and capabilities carried in each request, and a discovery call in place of the handshake. Lists can carry a time-to-live and a cache scope." },
        { kind: "p", text: "That is a real result. Before it, every agent-to-tool pair was a custom integration. After it, a server written once is callable from any client that speaks the protocol, and a gateway can sit in the middle without knowing the tools in advance." },
      ],
    },
    {
      id: "auth",
      title: "Where it stops: identity for work nobody is watching",
      blocks: [
        { kind: "p", text: "The authorization side has grown a lot: protected-resource metadata so a server says which authorization server to use, client ID metadata documents as a replacement for dynamic client registration (which the 2026-07-28 revision deprecates), an enterprise token-exchange flow, and refresh-token guidance. The spec forbids token passthrough, meaning one token reused across services." },
        { kind: "p", text: "What the cheat sheet found missing is background work. It states that no enhancement proposal covers scheduled or background runs on behalf of a person who is not present. An agent that wakes at night to do a task needs a credential that is neither the person's live session nor a god-mode service key. The protocol does not say what that credential is." },
        { kind: "callout", tone: "note", text: "Hypothesis, mine: the practical answer is a per-agent identity plus a delegated grant that is the intersection of the agent's rights, the person's current rights and the task scope. That is a design stance from our own records, not something MCP specifies." },
      ],
    },
    {
      id: "approval-drift",
      title: "Where it stops: approval and drift",
      blocks: [
        { kind: "p", text: "The tools page says there should always be a human in the loop able to deny tool invocations. It is a SHOULD, and the spec defines no approval message. Elicitation is generic input collection. I wrote that up separately in the post on elicitation versus approval." },
        { kind: "p", text: "Tool annotations such as readOnlyHint are, per the cheat sheet, untrusted hints when the server is third-party. And the spec lets a server change its tool list at any time: tools/list must return the set currently available to the requesting client, and that set may change. A client is not required to compare a new listing against the cached one. An issue proposed changing that with a SHA-256 digest of each tool description; it was closed on 2026-10-26 with a note that proposals need working-group engagement first. I cover the mechanisms people use meanwhile in the post on pinning." },
      ],
    },
    {
      id: "catalogs",
      title: "Where it stops: catalogs per tenant",
      blocks: [
        { kind: "p", text: "MCP says what a server offers. It does not say what this agent, acting for this person, in this organisation, may call. In a multi-tenant setting that is the hard part. connector-engine answers it with four grant layers: tenant (optional, narrows), workspace (required, a missing row denies), agent (required, a missing row denies) and the user acted for (optional, narrows). The strictest mode wins across layers." },
        { kind: "p", text: "Two caps apply afterwards. A catalog ceiling lets a listing's visibility cap the mode any key can hold. And an exposure check forces ask on an agent that holds private data, reads untrusted content and has an outbound path. A denied function answers like an unknown tool, so an agent cannot probe what exists." },
      ],
    },
    {
      id: "market",
      title: "What the market survey added",
      blocks: [
        { kind: "p", text: "No product among the 29 combined an agent runtime, per-action approvals and an operations console; the survey classified none as a direct competitor of the job in question. It also records consolidation: Palo Alto closed its Portkey acquisition on 2026-05-29, Arcade bought Smithery on 2026-08-05, and OpenRouter joined Stripe. The note's inference is that independent, open-source gateways are becoming rarer, which favours neutral projects for a local-first product." },
        { kind: "p", text: "The survey's cheapest integration points were the official MCP registry as a catalog source and an MCP gateway as the isolation layer for third-party local servers. Pricing and traction numbers in that note come with their own source links in the record; I am not repeating them here." },
      ],
    },
    {
      id: "limits",
      title: "What I did not verify",
      blocks: [
        { kind: "list", items: [
          "Nothing here was run. The proof level of both records is reading docs, code and press releases.",
          "The cheat sheet is secondary evidence with few reliable URLs, so its protocol claims are medium confidence.",
          "Market facts come with the bias of their source: vendor docs describe the vendor's intent, not its quality.",
        ] },
      ],
    },
  ],
};

export default post;
