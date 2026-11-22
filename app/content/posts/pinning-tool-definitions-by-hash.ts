import type { Post } from "./types";

const post: Post = {
  slug: "pinning-tool-definitions-by-hash",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "How tool definitions get pinned",
  summary: "A tool server can rewrite its own descriptions after you approved it. Five mechanisms from a scout of gateways, and what connector-engine does: an RFC 8785 hash per definition, quarantine on change, stale permissions.",
  tags: ["mcp", "pinning", "security", "gateway", "rfc-8785"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem",
      blocks: [
        { kind: "p", text: "An agent decides what to call from the tool's name, description and input schema. All three come from the tool server. The MCP spec (2026-07-28 tools page) says a server answering tools/list must return the set currently available to the requesting client, and that the set may change over time. It does not require a client to compare the new listing with the one it cached." },
        { kind: "p", text: "So a server you approved on Monday can ship a different description on Tuesday, and nothing in the protocol tells you. This record comes from a scout I ran on 2026-11-20 for the connector-engine controls study. Sources are vendor docs and project READMEs read through a fetch tool, which the record marks medium confidence." },
      ],
    },
    {
      id: "mechanisms",
      title: "Five mechanisms in the wild",
      blocks: [
        { kind: "table", head: ["Source", "What it does"], rows: [
          ["DigitalOcean Action Gateway", "Tool versions are numbered. A call can pin <tool>@<version>; unpinned calls pick up new versions as soon as they are released."],
          ["LiteLLM MCP", "An admin pins a server. The snapshot stores name, description and input schema. Drift raises an alert naming added, removed and changed tools; re-pin accepts it; calls to tools added after the pin return 403."],
          ["mcp-context-protector (Trail of Bits)", "Trust on first use of server instructions, tool descriptions and input schemas; blocks downstream calls until the change is approved in the CLI."],
          ["MCP SEP-3452 (issue)", "Clients would record a SHA-256 digest of each description and require re-approval on change. Closed as completed on 2026-10-26 with a note that proposals need working-group engagement first."],
          ["Cloudflare MCP portals", "Upstream changes arrive through a periodic sync. The scout found no review or diff step documented."],
        ] },
        { kind: "p", text: "The LiteLLM docs, as read through the fetch tool, do not mention hashing: the pin is a stored copy compared on re-list. That is a design difference, not a flaw. A stored copy gives you a readable diff; a hash gives you a cheap equality check and something to bind other records to." },
      ],
    },
    {
      id: "engine",
      title: "What connector-engine does",
      blocks: [
        { kind: "p", text: "Per its docs, each function definition is hashed when captured, using RFC 8785 canonical JSON. A new function, or a changed description or schema, is quarantined until a person accepts it. A permission made against an older hash goes stale and needs confirming again. Re-lists run on a schedule between two configured bounds (pinning.relistMin and pinning.relistMax), so a server that changes its tools after install is caught." },
        { kind: "code", lang: "sh", code: "vsh admin functions accept <connector id> <function name>", caption: "Accepting the current definition through the API, with a tenant admin token." },
        { kind: "p", text: "In the console a quarantined function says the definition changed. Choosing on or ask accepts it. Server instructions can be pinned too (gateway.relayInstructions: pinned), kept with the connector and quarantined again on change." },
      ],
    },
    {
      id: "call-hash",
      title: "The hash does a second job: the call hash",
      blocks: [
        { kind: "p", text: "The definition hash feeds a call hash: the RFC 8785 SHA-256 of tenant, agent, connector, function, definition hash and arguments. An approval is bound to it, so an approved call cannot silently become a call to a changed tool." },
        { kind: "p", text: "The study read this code at commit 905a503 and found properties worth knowing about any canonical-JSON hash. Numbers are re-encoded as IEEE 754 doubles, so 1 and 1.0 hash the same and integers above 2^53 collapse together. Duplicate object keys: the last value wins silently, a Go decoding behaviour the note says it did not execute. The bytes hashed were not the bytes sealed and forwarded, so two different payloads could share one call hash." },
        { kind: "p", text: "The current architecture notes say the gateway now parses arguments once before the token scan, the schema check and the call hash, and refuses an object that repeats a key at any depth, a top-level value that is not an object, and data after the top-level value. I have not re-run the original probe against that change." },
      ],
    },
    {
      id: "limits",
      title: "Limits of pinning",
      blocks: [
        { kind: "list", items: [
          "A pin proves the definition did not change, not that the first version was honest. Trust on first use is still trust.",
          "A hash says changed or not. It says nothing about whether the change matters. The study's judged design added a definition diff for that, and that part was not built; the work was paused by the owner on 2026-11-21 with only the permission change log storage merged.",
          "Hypothesis: a semantic comparison, which the mcp-context-protector README says it uses, could cut noise from harmless edits, but a person still has to read what changed.",
        ] },
      ],
    },
  ],
};

export default post;
