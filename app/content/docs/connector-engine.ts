import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const doc: Partial<Record<Lang, ProjectDoc>> = {
  en: {
    tagline: "A gateway between AI apps and tool servers that decides, per app and per function, what runs, what waits for a person and what is refused.",
    status: "source-available (GPL-3.0-or-later)",
    facts: [
      { label: "Language", value: "Go" },
      { label: "License", value: "GPL-3.0-or-later" },
      { label: "Surfaces", value: "MCP, HTTP, gRPC" },
      { label: "Store", value: "Postgres, SQLite, memory" },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        group: "start",
        blocks: [
          { kind: "p", text: "connector-engine sits between your AI apps and the tool servers they call (MCP, REST, gRPC). An app talks to one endpoint, /mcp. The engine decides for each function whether it is off, on, or needs a person to approve it first." },
          { kind: "p", text: "Every function definition is pinned by an RFC 8785 hash. A tool that changes after install, or a new one, is quarantined until a person accepts it, so a server cannot widen what an agent can do without notice." },
          { kind: "p", text: "It ships in two profiles: person, a local console on 127.0.0.1 that acts as the OAuth 2.1 server for every AI app on the machine, and headless, an engine with no console that trusts your OIDC issuer and exposes an operator API and CloudEvents." },
          {
            kind: "table",
            head: ["Item", "Value"],
            rows: [
              ["Default console and agent endpoint", "http://127.0.0.1:7465 and /mcp"],
              ["Default engine listeners", "server.listen :8080, server.grpcListen :9090"],
              ["Hold window for an ask", "approval.holdWindow, 20s"],
              ["Approval expiry", "approval.timeout, 10m"],
              ["Re-list schedule", "pinning.relistMin 30s to pinning.relistMax 5m"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Install and run",
        group: "start",
        blocks: [
          { kind: "p", text: "Prerequisites: Docker and mise for the working path today. The no-Docker installers and the release image are documented as available after v0.1.0." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/connector-engine\ncd connector-engine\nmise run up",
            caption: "ends with: console: http://127.0.0.1:7465   agent endpoint: http://127.0.0.1:7465/mcp",
          },
          {
            kind: "code",
            lang: "sh",
            code: "curl -fsSL https://raw.githubusercontent.com/versatile-sh/connector-engine/main/scripts/install.sh | sh\nvsh up --open",
            caption: "after v0.1.0; the installers verify the SHA-256 of every download",
          },
          { kind: "p", text: "Connect an app, then drive the same API from the terminal with vsh:" },
          {
            kind: "code",
            lang: "sh",
            code: "claude mcp add --transport http versatile http://127.0.0.1:7465/mcp\ncodex mcp add versatile --url http://127.0.0.1:7465/mcp\n\nvsh login\nvsh connectors import --mcp https://mcp.example.com/mcp\nvsh access github --kind read on\nvsh approvals",
          },
          { kind: "p", text: "The engine reads two YAML files. Unknown keys are errors and a missing key keeps its default. Secrets are never written in them: a key ending in Ref takes env:NAME or file:/path." },
          {
            kind: "table",
            head: ["File", "Flag", "Environment"],
            rows: [
              ["connector-engine.yaml", "--config", "CN_CONFIG"],
              ["adapters.yaml", "--adapters", "CN_ADAPTERS_FILE"],
            ],
          },
          {
            kind: "table",
            head: ["Key", "Default", "Meaning"],
            rows: [
              ["mode", "production", "dev relaxes production checks"],
              ["server.operatorListen", "\"\" (off)", "the operator API"],
              ["auth.issuers", "[]", "trusted OIDC issuers"],
              ["auth.agentTokenMaxLifetime", "1h", "longest agent token accepted"],
              ["permission.defaultMode", "deny", "a function with no grant"],
              ["runtime.allowPrivateHosts", "false", "let connectors reach private addresses"],
              ["gateway.skills", "off", "tools or tools+prompts serves skills"],
              ["retention.*", "0s (keep)", "prune events, keys, audit, calls every retention.every"],
            ],
          },
          { kind: "code", lang: "sh", code: "connector-engine --config connector-engine.yaml --adapters adapters.yaml adapters check", caption: "validates the adapter selection the way boot does; prints: adapters ok" },
          { kind: "callout", tone: "warn", text: "Never publish the console port directly. On a server use an SSH tunnel, or a TLS proxy with CONSOLE_PUBLIC_URL set. The first visitor of a new console becomes its Owner; CONSOLE_SETUP_TOKEN makes the first screen ask for a secret." },
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        group: "how",
        blocks: [
          { kind: "scene", id: "connector-engine/architecture", caption: "Adapters on both sides touch the pure core only through the port ring." },
          { kind: "p", text: "Ports and adapters. Dependencies point inward: adapters import port, core imports only port, and app/ wires everything. scripts/check-layering.sh enforces that nothing in the core imports selfhosted/." },
          {
            kind: "table",
            head: ["Layer", "Packages", "Rule"],
            rows: [
              ["Ports", "port/", "neutral types, interfaces, error and reason codes; no infrastructure types"],
              ["Core", "core/*", "pure functions over port types: no I/O, no clock, no globals"],
              ["Use cases", "service/", "one store transaction per mutation; service/worker runs timers and sweeps"],
              ["Inbound", "gateway/, server/", "translate MCP, HTTP, gRPC and management MCP into use cases"],
              ["Outbound", "store/, runtime/, source/, secrets/, auth/, credential/, sink/, filter/, index/", "one port each"],
              ["Composition", "app/, config/, cmd/*", "read config, open adapters, start listeners"],
            ],
          },
          {
            kind: "code",
            lang: "text",
            code: "AI app --MCP--> gateway (/mcp)\n                  | verify token, map tools/call\n                  v\n                service.Call\n                  | resolve exposed name -> connector + function\n                  | Authorizer.Evaluate -> allow | ask_once | ask | deny\n                  |-- deny  --> answers like an unknown tool\n                  |-- ask   --> approval record -> pending_approval\n                  '-- allow --> ConnectorRuntime.Call\n                                   | credential injected\n                                   v\n                                ResultFilter, projection\n          <---------------------- result\n          outbox row, same transaction -> relay -> EventSink",
          },
          {
            kind: "list",
            items: [
              "Store: postgres (row-level security per tenant), memory, and sqlite in the self-hosted build.",
              "ConnectorRuntime: remote (MCP), declarative (REST), grpc, skill, memory.",
              "ListingSource: files, official, docker, openapi, reflection, bsr, skillcatalog.",
              "SecretStore: localfile, onepassword, memory; hostkey in the self-hosted build.",
              "EventSink: log, webhook with Standard Webhooks signatures. ResultFilter: builtin. ToolIndex: lexical.",
              "adapters.yaml selects one adapter per port, several for runtimes and sources.",
            ],
          },
        ],
      },
      {
        id: "call-lifecycle",
        title: "Call lifecycle",
        group: "how",
        blocks: [
          {
            kind: "steps",
            items: [
              { title: "Authenticate", text: "The gateway verifies the bearer token (jwks, or the local issuer in the person profile) and maps tools/call to service.Call." },
              { title: "Parse arguments once", text: "core/args reads the arguments before the token scan, schema check and call hash. It refuses a repeated object key at any depth, a non-object top-level value (null and absent are accepted) and trailing data." },
              { title: "Authorize", text: "Authorizer.Evaluate returns allow, ask_once, ask or deny. Deny answers exactly like an unknown function, so an agent cannot probe what exists. Only an allowed function answers invalid_argument." },
              { title: "Run or hold", text: "Allow reaches ConnectorRuntime.Call with the stored credential injected; the result passes ResultFilter and projection. Ask opens an approval record." },
              { title: "Record", text: "The event is written to the outbox in the use case's transaction. relay/ delivers it to the EventSink at least once, in order." },
            ],
          },
          { kind: "p", text: "tools/list uses the same path through Authorizer.Search, so an agent sees only functions it may call." },
        ],
      },
      {
        id: "approval-flow",
        title: "Approval flow",
        group: "how",
        blocks: [
          { kind: "scene", id: "connector-engine/approval-flow", caption: "An ask letter waits in a tray until a person stamps it, then runs once." },
          {
            kind: "steps",
            items: [
              { title: "Hold", text: "An ask holds the call for approval.holdWindow (20s). After that the agent gets pending_approval with an id to poll through approval_status or drop through approval_cancel." },
              { title: "Decide", text: "A person decides through the operator API, the console or an approval surface (desktop, Discord, Slack, Telegram, webhook)." },
              { title: "Run once", text: "An approved call runs once. An identical call (same session, same call hash) attaches to the open record instead of opening another." },
              { title: "Never resend", text: "A forwarded call is never sent again. If its result cannot be recorded the agent gets outcome_unknown, and the row stays started until the worker sweeps it." },
            ],
          },
          { kind: "p", text: "States: pending, approved, executing, executed, failed, outcome_unknown, denied, expired, cancelled. core/approval holds the transitions; the worker runs timers and a denial brake." },
        ],
      },
      {
        id: "grants",
        title: "Grants and exposure",
        group: "deep",
        blocks: [
          { kind: "scene", id: "connector-engine/grants", caption: "Four grant layers cut an agent's key ring to one mode per function: allow, ask or deny." },
          { kind: "p", text: "Evaluation walks four grant layers, and the strictest mode wins across them. core/evaluate holds the steps, core/grant the row rules." },
          {
            kind: "table",
            head: ["Order", "Layer", "Effect"],
            rows: [
              ["1", "tenant", "optional; narrows when present"],
              ["2", "workspace", "required; a missing row denies"],
              ["3", "agent", "required; a missing row denies"],
              ["4", "user acted for", "optional; narrows when present"],
              ["then", "catalog ceiling", "the listing's visibility caps the mode"],
              ["then", "destructive functions", "allow becomes ask_once (or ask)"],
              ["then", "exposure check", "private data + untrusted content + outbound path forces ask"],
              ["then", "session grant", "an approved ask_once allows the rest of the session"],
            ],
          },
          { kind: "p", text: "core/exposure.Check fills the three legs over the functions an agent would be listed: LegA reads private data, LegB returns third-party content, LegC is anything not a read class or marked open world. An unreviewed flag counts for its leg, the cautious reading. Exposed is true only when all three are non-empty." },
          {
            kind: "list",
            items: [
              "Only a session row names an agent. A tenant, workspace or user row with agent set is refused with row_refused.",
              "A row's use count belongs to the store: only reserving a use and restoring a backup change it.",
              "Migration 0003_canonical_grants rewrites older stores; conflicting rows merge to the strictest and leave a grant.merged audit row holding the originals.",
              "Each store keeps a per-tenant, monotonically increasing log of access-setting changes (permission_head, permission_changes); a restore imports it only for a tenant whose live log is empty.",
            ],
          },
        ],
      },
      {
        id: "pinning",
        title: "Pinning",
        group: "deep",
        blocks: [
          { kind: "scene", id: "connector-engine/pinning", caption: "Each re-list is hashed and compared with the pinned seal; a change is held until accepted." },
          {
            kind: "list",
            items: [
              "Each function definition is hashed as RFC 8785 canonical JSON when captured (core/pinning).",
              "A new function, or a changed description or schema, is quarantined until a person accepts it.",
              "A grant made against an older hash goes stale and needs confirmGrant.",
              "Connectors are re-listed on a schedule between pinning.relistMin and pinning.relistMax, so a server that changes tools after install is caught.",
              "Server instructions, prompts and resources are pinned the same way when a profile relays them (gateway.relayInstructions, gateway.upstreamContent).",
            ],
          },
        ],
      },
      {
        id: "storage",
        title: "Storage and events",
        group: "deep",
        blocks: [
          { kind: "p", text: "Postgres migrations (store/postgres/migrations) create a document-style schema. All tables have forced row-level security keyed on the cn.tenant setting; a role that bypasses it is refused at boot." },
          {
            kind: "table",
            head: ["Table", "Holds"],
            rows: [
              ["records", "kind, k, tenant_id, rev, doc jsonb; unique per (kind, uniq); GIN index on doc"],
              ["audit", "audit rows per tenant and subject"],
              ["streams, outbox", "per-stream sequence; outbox rows unique on (stream, sequence), delivered_at null while pending"],
              ["inbox", "dedup of consumed ids per tenant"],
              ["due_work", "timers, indexed by due"],
              ["permission_head, permission_changes", "the access-setting change log"],
            ],
          },
          { kind: "p", text: "The outbox row is written in the same transaction as the state change. relay/ reads Outbox.Pending, delivers through the sink with a doubling backoff (one-minute cap), and records an audit row for an event it gives up on. Consumers must deduplicate by the CloudEvent id." },
        ],
      },
      {
        id: "security",
        title: "Security model",
        group: "deep",
        blocks: [
          { kind: "p", text: "The engine assumes the agent and the upstream tool server may be hostile, and the host and its administrator are trusted." },
          {
            kind: "list",
            items: [
              "Secrets use envelope encryption with a key per tenant; destroying the key shreds the data. Secrets are never returned by an API.",
              "Call arguments are stored as a hash; the console activity log redacts likely secrets.",
              "An egress guard refuses private addresses for upstream connections unless runtime.allowPrivateHosts is set, and ignores HTTP_PROXY and HTTPS_PROXY because a proxy would defeat the check.",
              "The local console listens on 127.0.0.1 with a Host allowlist, Origin checks and CSRF tokens. AI apps sign in with OAuth 2.1 and PKCE S256.",
              "The no-Docker install uses a 0700 data directory, a 0600 database and a control socket that serves only a peer of the same user.",
              "Production refuses risky settings unless adapters.yaml acknowledges them: local_token_issuer, long_lived_agent_tokens, trusted_proxy, manage_mcp_mutations, plaintext_root_key, private_egress.",
            ],
          },
          { kind: "p", text: "Out of scope: a compromised host or root, access to the Docker socket, and reading the memory of an unlocked process." },
        ],
      },
      {
        id: "decisions",
        title: "Decisions and limits",
        group: "decisions",
        blocks: [
          {
            kind: "table",
            head: ["Decision", "Chosen", "Rejected", "Why"],
            rows: [
              ["Denied function", "answers like an unknown one", "an explicit forbidden error", "an agent cannot probe what exists"],
              ["Changed tool definition", "quarantine until accepted, pinned by hash", "trust the latest listing", "a server cannot widen access silently"],
              ["Event delivery", "outbox in the same transaction, at least once", "publish after commit", "no lost events; duplicates are deduplicated by id"],
              ["Forwarded call", "never resent; outcome_unknown on lost result", "retry", "an approved side effect runs once"],
              ["Self-hosted code", "selfhosted/ imports the core, never the reverse", "one shared tree", "the headless engine stays free of console code"],
              ["Instances", "one engine per database", "replicas", "multi-replica paths are untested"],
            ],
          },
          {
            kind: "list",
            items: [
              "More than one replica is not verified: the relay can deliver twice, the worker has no leader election, and pending OAuth connects live in a process map.",
              "The secrets directory must be shared and backed up with the database; rows without the root key cannot be opened.",
              "The scanner and suggester ports have no built-in adapter; vsh admin overlays suggest answers unavailable until a build registers one.",
              "A snapshot restore does not yet write its own changes to the permission log.",
              "The repository has a benchmark for binding and grant writes against many agents and connectors, but no published numbers.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Files to read",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "ARCHITECTURE.md", note: "layers, call path, grants, approvals, pinning, profiles" },
              { path: "docs/reference/config.md", note: "configuration keys and acknowledgements" },
              { path: "docs/enterprise/security-model.md", note: "assets, threats, safe deployment" },
              { path: "docs/enterprise/scaling.md", note: "what one instance runs, and what is unverified" },
              { path: "core/exposure/exposure.go", note: "the three-leg exposure check" },
              { path: "core/pinning/canonical.go", note: "canonical JSON hashing of definitions" },
              { path: "core/approval/approval.go", note: "approval state transitions" },
              { path: "service/gateway.go", note: "use case behind a tools/call" },
              { path: "relay/relay.go", note: "at-least-once, ordered outbox delivery" },
              { path: "store/postgres/migrations/0001_schema.sql", note: "tables, row-level security, tenant functions" },
              { path: "gateway/call.go", note: "MCP call handling in the gateway" },
              { path: "scripts/check-layering.sh", note: "enforces the selfhosted boundary" },
            ],
          },
        ],
      },
    ],
  },
};

export default doc;
