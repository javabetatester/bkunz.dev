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
  es: {
    tagline: "Una pasarela entre apps de IA y servidores de herramientas que decide, por app y por función, qué se ejecuta, qué espera a una persona y qué se rechaza.",
    status: "código disponible (GPL-3.0-or-later)",
    facts: [
      { label: "Lenguaje", value: "Go" },
      { label: "Licencia", value: "GPL-3.0-or-later" },
      { label: "Superficies", value: "MCP, HTTP, gRPC" },
      { label: "Almacenamiento", value: "Postgres, SQLite, memoria" },
    ],
    sections: [
      {
        id: "overview",
        title: "Visión general",
        group: "start",
        blocks: [
          { kind: "p", text: "connector-engine se sitúa entre tus apps de IA y los servidores de herramientas que llaman (MCP, REST, gRPC). Una app habla con un único endpoint, /mcp. El motor decide para cada función si está apagada, encendida o si necesita que una persona la apruebe antes." },
          { kind: "p", text: "Cada definición de función queda fijada por un hash RFC 8785. Una herramienta que cambia tras la instalación, o una nueva, queda en cuarentena hasta que una persona la acepta, así que un servidor no puede ampliar lo que un agente puede hacer sin avisar." },
          { kind: "p", text: "Se entrega en dos perfiles: person, una consola local en 127.0.0.1 que actúa como servidor OAuth 2.1 para todas las apps de IA de la máquina, y headless, un motor sin consola que confía en tu emisor OIDC y expone una API de operador y CloudEvents." },
          {
            kind: "table",
            head: ["Elemento", "Valor"],
            rows: [
              ["Consola y endpoint de agente por defecto", "http://127.0.0.1:7465 y /mcp"],
              ["Listeners del motor por defecto", "server.listen :8080, server.grpcListen :9090"],
              ["Ventana de espera de un ask", "approval.holdWindow, 20s"],
              ["Caducidad de la aprobación", "approval.timeout, 10m"],
              ["Calendario de re-listado", "pinning.relistMin 30s a pinning.relistMax 5m"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Instalar y ejecutar",
        group: "start",
        blocks: [
          { kind: "p", text: "Requisitos: Docker y mise para el camino que funciona hoy. Los instaladores sin Docker y la imagen de release están documentados como disponibles tras v0.1.0." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/connector-engine\ncd connector-engine\nmise run up",
            caption: "termina con: console: http://127.0.0.1:7465   agent endpoint: http://127.0.0.1:7465/mcp",
          },
          {
            kind: "code",
            lang: "sh",
            code: "curl -fsSL https://raw.githubusercontent.com/versatile-sh/connector-engine/main/scripts/install.sh | sh\nvsh up --open",
            caption: "tras v0.1.0; los instaladores verifican el SHA-256 de cada descarga",
          },
          { kind: "p", text: "Conecta una app y luego maneja la misma API desde la terminal con vsh:" },
          {
            kind: "code",
            lang: "sh",
            code: "claude mcp add --transport http versatile http://127.0.0.1:7465/mcp\ncodex mcp add versatile --url http://127.0.0.1:7465/mcp\n\nvsh login\nvsh connectors import --mcp https://mcp.example.com/mcp\nvsh access github --kind read on\nvsh approvals",
          },
          { kind: "p", text: "El motor lee dos archivos YAML. Las claves desconocidas son errores y una clave ausente conserva su valor por defecto. Los secretos nunca se escriben en ellos: una clave que termina en Ref acepta env:NAME o file:/path." },
          {
            kind: "table",
            head: ["Archivo", "Flag", "Entorno"],
            rows: [
              ["connector-engine.yaml", "--config", "CN_CONFIG"],
              ["adapters.yaml", "--adapters", "CN_ADAPTERS_FILE"],
            ],
          },
          {
            kind: "table",
            head: ["Clave", "Por defecto", "Significado"],
            rows: [
              ["mode", "production", "dev relaja las comprobaciones de producción"],
              ["server.operatorListen", "\"\" (off)", "la API de operador"],
              ["auth.issuers", "[]", "emisores OIDC de confianza"],
              ["auth.agentTokenMaxLifetime", "1h", "vida máxima de un token de agente aceptado"],
              ["permission.defaultMode", "deny", "una función sin permiso"],
              ["runtime.allowPrivateHosts", "false", "permite que los conectores lleguen a direcciones privadas"],
              ["gateway.skills", "off", "tools o tools+prompts sirve skills"],
              ["retention.*", "0s (keep)", "poda eventos, claves, auditoría y llamadas cada retention.every"],
            ],
          },
          { kind: "code", lang: "sh", code: "connector-engine --config connector-engine.yaml --adapters adapters.yaml adapters check", caption: "valida la selección de adaptadores como lo hace el arranque; imprime: adapters ok" },
          { kind: "callout", tone: "warn", text: "Nunca publiques el puerto de la consola directamente. En un servidor usa un túnel SSH, o un proxy TLS con CONSOLE_PUBLIC_URL definido. El primer visitante de una consola nueva se convierte en su Owner; CONSOLE_SETUP_TOKEN hace que la primera pantalla pida un secreto." },
        ],
      },
      {
        id: "architecture",
        title: "Arquitectura",
        group: "how",
        blocks: [
          { kind: "scene", id: "connector-engine/architecture", caption: "Los adaptadores de ambos lados tocan el núcleo puro solo a través del anillo de puertos." },
          { kind: "p", text: "Puertos y adaptadores. Las dependencias apuntan hacia dentro: los adaptadores importan port, el núcleo importa solo port, y app/ lo conecta todo. scripts/check-layering.sh garantiza que nada del núcleo importe selfhosted/." },
          {
            kind: "table",
            head: ["Capa", "Paquetes", "Regla"],
            rows: [
              ["Puertos", "port/", "tipos neutros, interfaces, códigos de error y de motivo; sin tipos de infraestructura"],
              ["Núcleo", "core/*", "funciones puras sobre tipos de port: sin I/O, sin reloj, sin globales"],
              ["Casos de uso", "service/", "una transacción del store por mutación; service/worker ejecuta timers y barridos"],
              ["Entrada", "gateway/, server/", "traducen MCP, HTTP, gRPC y MCP de gestión a casos de uso"],
              ["Salida", "store/, runtime/, source/, secrets/, auth/, credential/, sink/, filter/, index/", "un puerto cada uno"],
              ["Composición", "app/, config/, cmd/*", "leen la config, abren adaptadores, arrancan listeners"],
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
              "Store: postgres (row-level security por tenant), memory y sqlite en el build self-hosted.",
              "ConnectorRuntime: remote (MCP), declarative (REST), grpc, skill, memory.",
              "ListingSource: files, official, docker, openapi, reflection, bsr, skillcatalog.",
              "SecretStore: localfile, onepassword, memory; hostkey en el build self-hosted.",
              "EventSink: log, webhook con firmas Standard Webhooks. ResultFilter: builtin. ToolIndex: lexical.",
              "adapters.yaml selecciona un adaptador por puerto, varios para runtimes y sources.",
            ],
          },
        ],
      },
      {
        id: "call-lifecycle",
        title: "Ciclo de una llamada",
        group: "how",
        blocks: [
          {
            kind: "steps",
            items: [
              { title: "Autenticar", text: "El gateway verifica el bearer token (jwks, o el emisor local en el perfil person) y mapea tools/call a service.Call." },
              { title: "Parsear los argumentos una vez", text: "core/args lee los argumentos antes del escaneo de tokens, la validación del schema y el hash de la llamada. Rechaza una clave de objeto repetida a cualquier profundidad, un valor de nivel superior que no sea objeto (null y ausente se aceptan) y datos sobrantes al final." },
              { title: "Autorizar", text: "Authorizer.Evaluate devuelve allow, ask_once, ask o deny. Deny responde exactamente como una función desconocida, así que un agente no puede sondear qué existe. Solo una función permitida responde invalid_argument." },
              { title: "Ejecutar o retener", text: "Allow llega a ConnectorRuntime.Call con la credencial guardada inyectada; el resultado pasa por ResultFilter y la proyección. Ask abre un registro de aprobación." },
              { title: "Registrar", text: "El evento se escribe en el outbox dentro de la transacción del caso de uso. relay/ lo entrega al EventSink al menos una vez y en orden." },
            ],
          },
          { kind: "p", text: "tools/list usa el mismo camino a través de Authorizer.Search, así que un agente ve solo las funciones que puede llamar." },
        ],
      },
      {
        id: "approval-flow",
        title: "Flujo de aprobación",
        group: "how",
        blocks: [
          { kind: "scene", id: "connector-engine/approval-flow", caption: "Una carta ask espera en una bandeja hasta que una persona la sella, y entonces se ejecuta una vez." },
          {
            kind: "steps",
            items: [
              { title: "Retener", text: "Un ask retiene la llamada durante approval.holdWindow (20s). Después el agente recibe pending_approval con un id para consultar mediante approval_status o descartar mediante approval_cancel." },
              { title: "Decidir", text: "Una persona decide mediante la API de operador, la consola o una superficie de aprobación (escritorio, Discord, Slack, Telegram, webhook)." },
              { title: "Ejecutar una vez", text: "Una llamada aprobada se ejecuta una vez. Una llamada idéntica (misma sesión, mismo hash de llamada) se adjunta al registro abierto en lugar de abrir otro." },
              { title: "Nunca reenviar", text: "Una llamada reenviada nunca se envía de nuevo. Si no se puede registrar su resultado, el agente recibe outcome_unknown y la fila queda en started hasta que el worker la barre." },
            ],
          },
          { kind: "p", text: "Estados: pending, approved, executing, executed, failed, outcome_unknown, denied, expired, cancelled. core/approval contiene las transiciones; el worker ejecuta los timers y un freno de denegaciones." },
        ],
      },
      {
        id: "grants",
        title: "Permisos y exposición",
        group: "deep",
        blocks: [
          { kind: "scene", id: "connector-engine/grants", caption: "Cuatro capas de permisos reducen el llavero de un agente a un modo por función: allow, ask o deny." },
          { kind: "p", text: "La evaluación recorre cuatro capas de permisos, y gana el modo más estricto entre ellas. core/evaluate contiene los pasos, core/grant las reglas de fila." },
          {
            kind: "table",
            head: ["Orden", "Capa", "Efecto"],
            rows: [
              ["1", "tenant", "opcional; restringe cuando está presente"],
              ["2", "workspace", "obligatoria; una fila ausente deniega"],
              ["3", "agent", "obligatoria; una fila ausente deniega"],
              ["4", "user acted for", "opcional; restringe cuando está presente"],
              ["luego", "techo del catálogo", "la visibilidad del listado limita el modo"],
              ["luego", "funciones destructivas", "allow pasa a ask_once (o ask)"],
              ["luego", "comprobación de exposición", "datos privados + contenido no confiable + vía de salida fuerza ask"],
              ["luego", "permiso de sesión", "un ask_once aprobado permite el resto de la sesión"],
            ],
          },
          { kind: "p", text: "core/exposure.Check rellena las tres patas sobre las funciones que se listarían a un agente: LegA lee datos privados, LegB devuelve contenido de terceros, LegC es cualquier cosa que no sea de clase lectura o esté marcada como open world. Una marca sin revisar cuenta para su pata, la lectura prudente. Exposed es true solo cuando las tres están no vacías." },
          {
            kind: "list",
            items: [
              "Solo una fila de sesión nombra a un agente. Una fila de tenant, workspace o usuario con agent definido se rechaza con row_refused.",
              "El contador de usos de una fila pertenece al store: solo reservar un uso y restaurar un backup lo cambian.",
              "La migración 0003_canonical_grants reescribe los stores antiguos; las filas en conflicto se fusionan en la más estricta y dejan una fila de auditoría grant.merged con los originales.",
              "Cada store mantiene un log por tenant, monótonamente creciente, de los cambios de configuración de acceso (permission_head, permission_changes); una restauración lo importa solo para un tenant cuyo log vivo esté vacío.",
            ],
          },
        ],
      },
      {
        id: "pinning",
        title: "Pinning",
        group: "deep",
        blocks: [
          { kind: "scene", id: "connector-engine/pinning", caption: "Cada re-listado se hashea y se compara con el sello fijado; un cambio queda retenido hasta que se acepta." },
          {
            kind: "list",
            items: [
              "Cada definición de función se hashea como JSON canónico RFC 8785 al capturarse (core/pinning).",
              "Una función nueva, o una descripción o schema cambiados, queda en cuarentena hasta que una persona la acepta.",
              "Un permiso concedido sobre un hash anterior queda obsoleto y necesita confirmGrant.",
              "Los conectores se re-listan según un calendario entre pinning.relistMin y pinning.relistMax, así se detecta un servidor que cambia herramientas tras la instalación.",
              "Las instrucciones, prompts y resources del servidor se fijan igual cuando un perfil los retransmite (gateway.relayInstructions, gateway.upstreamContent).",
            ],
          },
        ],
      },
      {
        id: "storage",
        title: "Almacenamiento y eventos",
        group: "deep",
        blocks: [
          { kind: "p", text: "Las migraciones de Postgres (store/postgres/migrations) crean un esquema de estilo documento. Todas las tablas tienen row-level security forzada, basada en el ajuste cn.tenant; un rol que la eluda se rechaza en el arranque." },
          {
            kind: "table",
            head: ["Tabla", "Contiene"],
            rows: [
              ["records", "kind, k, tenant_id, rev, doc jsonb; único por (kind, uniq); índice GIN sobre doc"],
              ["audit", "filas de auditoría por tenant y sujeto"],
              ["streams, outbox", "secuencia por stream; filas de outbox únicas en (stream, sequence), delivered_at nulo mientras están pendientes"],
              ["inbox", "deduplicación de ids consumidos por tenant"],
              ["due_work", "timers, indexados por due"],
              ["permission_head, permission_changes", "el log de cambios de configuración de acceso"],
            ],
          },
          { kind: "p", text: "La fila de outbox se escribe en la misma transacción que el cambio de estado. relay/ lee Outbox.Pending, entrega mediante el sink con un backoff que se duplica (tope de un minuto) y registra una fila de auditoría por un evento que abandona. Los consumidores deben deduplicar por el id del CloudEvent." },
        ],
      },
      {
        id: "security",
        title: "Modelo de seguridad",
        group: "deep",
        blocks: [
          { kind: "p", text: "El motor asume que el agente y el servidor de herramientas upstream pueden ser hostiles, y que el host y su administrador son de confianza." },
          {
            kind: "list",
            items: [
              "Los secretos usan cifrado de sobre con una clave por tenant; destruir la clave destruye los datos. Una API nunca devuelve los secretos.",
              "Los argumentos de las llamadas se guardan como hash; el log de actividad de la consola oculta los probables secretos.",
              "Un guard de egress rechaza direcciones privadas en las conexiones upstream salvo que runtime.allowPrivateHosts esté activo, e ignora HTTP_PROXY y HTTPS_PROXY porque un proxy anularía la comprobación.",
              "La consola local escucha en 127.0.0.1 con una allowlist de Host, comprobaciones de Origin y tokens CSRF. Las apps de IA inician sesión con OAuth 2.1 y PKCE S256.",
              "La instalación sin Docker usa un directorio de datos 0700, una base de datos 0600 y un socket de control que solo atiende a un par del mismo usuario.",
              "Producción rechaza ajustes arriesgados salvo que adapters.yaml los reconozca: local_token_issuer, long_lived_agent_tokens, trusted_proxy, manage_mcp_mutations, plaintext_root_key, private_egress.",
            ],
          },
          { kind: "p", text: "Fuera de alcance: un host o root comprometido, el acceso al socket de Docker y la lectura de la memoria de un proceso desbloqueado." },
        ],
      },
      {
        id: "decisions",
        title: "Decisiones y límites",
        group: "decisions",
        blocks: [
          {
            kind: "table",
            head: ["Decisión", "Elegido", "Descartado", "Por qué"],
            rows: [
              ["Función denegada", "responde como una desconocida", "un error forbidden explícito", "un agente no puede sondear qué existe"],
              ["Definición de herramienta cambiada", "cuarentena hasta aceptarla, fijada por hash", "confiar en el último listado", "un servidor no puede ampliar el acceso en silencio"],
              ["Entrega de eventos", "outbox en la misma transacción, al menos una vez", "publicar tras el commit", "ningún evento se pierde; los duplicados se deduplican por id"],
              ["Llamada reenviada", "nunca se reenvía; outcome_unknown si se pierde el resultado", "reintentar", "un efecto secundario aprobado se ejecuta una vez"],
              ["Código self-hosted", "selfhosted/ importa el núcleo, nunca al revés", "un árbol compartido", "el motor headless queda libre de código de consola"],
              ["Instancias", "un motor por base de datos", "réplicas", "los caminos multi-réplica no están probados"],
            ],
          },
          {
            kind: "list",
            items: [
              "Más de una réplica no está verificado: el relay puede entregar dos veces, el worker no tiene elección de líder y las conexiones OAuth pendientes viven en un mapa del proceso.",
              "El directorio de secretos debe compartirse y respaldarse junto con la base de datos; las filas sin la clave raíz no se pueden abrir.",
              "Los puertos scanner y suggester no tienen adaptador integrado; los overlays vsh admin marcan las respuestas de suggest como no disponibles hasta que un build registre uno.",
              "Una restauración de snapshot todavía no escribe sus propios cambios en el log de permisos.",
              "El repositorio tiene un benchmark de escrituras de bindings y permisos contra muchos agentes y conectores, pero sin números publicados.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Archivos para leer",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "ARCHITECTURE.md", note: "capas, camino de la llamada, permisos, aprobaciones, pinning, perfiles" },
              { path: "docs/reference/config.md", note: "claves de configuración y reconocimientos" },
              { path: "docs/enterprise/security-model.md", note: "activos, amenazas, despliegue seguro" },
              { path: "docs/enterprise/scaling.md", note: "qué ejecuta una instancia y qué no está verificado" },
              { path: "core/exposure/exposure.go", note: "la comprobación de exposición de tres patas" },
              { path: "core/pinning/canonical.go", note: "hash de JSON canónico de las definiciones" },
              { path: "core/approval/approval.go", note: "transiciones de estado de la aprobación" },
              { path: "service/gateway.go", note: "caso de uso detrás de un tools/call" },
              { path: "relay/relay.go", note: "entrega del outbox al menos una vez y en orden" },
              { path: "store/postgres/migrations/0001_schema.sql", note: "tablas, row-level security, funciones de tenant" },
              { path: "gateway/call.go", note: "manejo de llamadas MCP en el gateway" },
              { path: "scripts/check-layering.sh", note: "hace cumplir la frontera selfhosted" },
            ],
          },
        ],
      },
    ],
  },
  "pt-br": {
    tagline: "Um gateway entre apps de IA e servidores de ferramentas que decide, por app e por função, o que roda, o que espera uma pessoa e o que é recusado.",
    status: "código disponível (GPL-3.0-or-later)",
    facts: [
      { label: "Linguagem", value: "Go" },
      { label: "Licença", value: "GPL-3.0-or-later" },
      { label: "Superfícies", value: "MCP, HTTP, gRPC" },
      { label: "Armazenamento", value: "Postgres, SQLite, memória" },
    ],
    sections: [
      {
        id: "overview",
        title: "Visão geral",
        group: "start",
        blocks: [
          { kind: "p", text: "O connector-engine fica entre seus apps de IA e os servidores de ferramentas que eles chamam (MCP, REST, gRPC). Um app fala com um único endpoint, /mcp. O motor decide, para cada função, se ela está desligada, ligada ou se precisa que uma pessoa a aprove antes." },
          { kind: "p", text: "Cada definição de função é fixada por um hash RFC 8785. Uma ferramenta que muda depois da instalação, ou uma nova, fica em quarentena até uma pessoa aceitá-la, então um servidor não consegue ampliar o que um agente pode fazer sem aviso." },
          { kind: "p", text: "Ele vem em dois perfis: person, um console local em 127.0.0.1 que atua como servidor OAuth 2.1 para todos os apps de IA da máquina, e headless, um motor sem console que confia no seu emissor OIDC e expõe uma API de operador e CloudEvents." },
          {
            kind: "table",
            head: ["Item", "Valor"],
            rows: [
              ["Console e endpoint de agente padrão", "http://127.0.0.1:7465 e /mcp"],
              ["Listeners padrão do motor", "server.listen :8080, server.grpcListen :9090"],
              ["Janela de espera de um ask", "approval.holdWindow, 20s"],
              ["Expiração da aprovação", "approval.timeout, 10m"],
              ["Agenda de re-listagem", "pinning.relistMin 30s a pinning.relistMax 5m"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Instalar e rodar",
        group: "start",
        blocks: [
          { kind: "p", text: "Pré-requisitos: Docker e mise para o caminho que funciona hoje. Os instaladores sem Docker e a imagem de release estão documentados como disponíveis após a v0.1.0." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/connector-engine\ncd connector-engine\nmise run up",
            caption: "termina com: console: http://127.0.0.1:7465   agent endpoint: http://127.0.0.1:7465/mcp",
          },
          {
            kind: "code",
            lang: "sh",
            code: "curl -fsSL https://raw.githubusercontent.com/versatile-sh/connector-engine/main/scripts/install.sh | sh\nvsh up --open",
            caption: "após a v0.1.0; os instaladores verificam o SHA-256 de cada download",
          },
          { kind: "p", text: "Conecte um app e depois use a mesma API pelo terminal com o vsh:" },
          {
            kind: "code",
            lang: "sh",
            code: "claude mcp add --transport http versatile http://127.0.0.1:7465/mcp\ncodex mcp add versatile --url http://127.0.0.1:7465/mcp\n\nvsh login\nvsh connectors import --mcp https://mcp.example.com/mcp\nvsh access github --kind read on\nvsh approvals",
          },
          { kind: "p", text: "O motor lê dois arquivos YAML. Chaves desconhecidas são erros e uma chave ausente mantém seu valor padrão. Segredos nunca são escritos neles: uma chave terminada em Ref aceita env:NAME ou file:/path." },
          {
            kind: "table",
            head: ["Arquivo", "Flag", "Ambiente"],
            rows: [
              ["connector-engine.yaml", "--config", "CN_CONFIG"],
              ["adapters.yaml", "--adapters", "CN_ADAPTERS_FILE"],
            ],
          },
          {
            kind: "table",
            head: ["Chave", "Padrão", "Significado"],
            rows: [
              ["mode", "production", "dev relaxa as verificações de produção"],
              ["server.operatorListen", "\"\" (off)", "a API de operador"],
              ["auth.issuers", "[]", "emissores OIDC confiáveis"],
              ["auth.agentTokenMaxLifetime", "1h", "maior duração de token de agente aceita"],
              ["permission.defaultMode", "deny", "uma função sem concessão"],
              ["runtime.allowPrivateHosts", "false", "deixa os conectores alcançarem endereços privados"],
              ["gateway.skills", "off", "tools ou tools+prompts serve skills"],
              ["retention.*", "0s (keep)", "poda eventos, chaves, auditoria e chamadas a cada retention.every"],
            ],
          },
          { kind: "code", lang: "sh", code: "connector-engine --config connector-engine.yaml --adapters adapters.yaml adapters check", caption: "valida a seleção de adaptadores do jeito que o boot faz; imprime: adapters ok" },
          { kind: "callout", tone: "warn", text: "Nunca publique a porta do console diretamente. Em um servidor, use um túnel SSH ou um proxy TLS com CONSOLE_PUBLIC_URL definido. O primeiro visitante de um console novo vira o Owner; CONSOLE_SETUP_TOKEN faz a primeira tela pedir um segredo." },
        ],
      },
      {
        id: "architecture",
        title: "Arquitetura",
        group: "how",
        blocks: [
          { kind: "scene", id: "connector-engine/architecture", caption: "Os adaptadores dos dois lados tocam o núcleo puro apenas pelo anel de portas." },
          { kind: "p", text: "Portas e adaptadores. As dependências apontam para dentro: os adaptadores importam port, o núcleo importa apenas port, e app/ liga tudo. scripts/check-layering.sh garante que nada no núcleo importe selfhosted/." },
          {
            kind: "table",
            head: ["Camada", "Pacotes", "Regra"],
            rows: [
              ["Portas", "port/", "tipos neutros, interfaces, códigos de erro e de motivo; sem tipos de infraestrutura"],
              ["Núcleo", "core/*", "funções puras sobre tipos de port: sem I/O, sem relógio, sem globais"],
              ["Casos de uso", "service/", "uma transação do store por mutação; service/worker roda timers e varreduras"],
              ["Entrada", "gateway/, server/", "traduzem MCP, HTTP, gRPC e MCP de gerenciamento em casos de uso"],
              ["Saída", "store/, runtime/, source/, secrets/, auth/, credential/, sink/, filter/, index/", "uma porta cada"],
              ["Composição", "app/, config/, cmd/*", "leem a config, abrem adaptadores, sobem listeners"],
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
              "Store: postgres (row-level security por tenant), memory e sqlite no build self-hosted.",
              "ConnectorRuntime: remote (MCP), declarative (REST), grpc, skill, memory.",
              "ListingSource: files, official, docker, openapi, reflection, bsr, skillcatalog.",
              "SecretStore: localfile, onepassword, memory; hostkey no build self-hosted.",
              "EventSink: log, webhook com assinaturas Standard Webhooks. ResultFilter: builtin. ToolIndex: lexical.",
              "adapters.yaml seleciona um adaptador por porta, vários para runtimes e sources.",
            ],
          },
        ],
      },
      {
        id: "call-lifecycle",
        title: "Ciclo de uma chamada",
        group: "how",
        blocks: [
          {
            kind: "steps",
            items: [
              { title: "Autenticar", text: "O gateway verifica o bearer token (jwks, ou o emissor local no perfil person) e mapeia tools/call para service.Call." },
              { title: "Parsear os argumentos uma vez", text: "core/args lê os argumentos antes da varredura de tokens, da checagem do schema e do hash da chamada. Recusa uma chave de objeto repetida em qualquer profundidade, um valor de nível superior que não seja objeto (null e ausente são aceitos) e dados sobrando no fim." },
              { title: "Autorizar", text: "Authorizer.Evaluate retorna allow, ask_once, ask ou deny. Deny responde exatamente como uma função desconhecida, então um agente não consegue sondar o que existe. Só uma função permitida responde invalid_argument." },
              { title: "Executar ou reter", text: "Allow chega a ConnectorRuntime.Call com a credencial guardada injetada; o resultado passa por ResultFilter e pela projeção. Ask abre um registro de aprovação." },
              { title: "Registrar", text: "O evento é escrito no outbox na transação do caso de uso. relay/ o entrega ao EventSink ao menos uma vez, em ordem." },
            ],
          },
          { kind: "p", text: "tools/list usa o mesmo caminho por Authorizer.Search, então um agente vê apenas as funções que pode chamar." },
        ],
      },
      {
        id: "approval-flow",
        title: "Fluxo de aprovação",
        group: "how",
        blocks: [
          { kind: "scene", id: "connector-engine/approval-flow", caption: "Uma carta ask espera numa bandeja até uma pessoa carimbá-la, e então roda uma vez." },
          {
            kind: "steps",
            items: [
              { title: "Reter", text: "Um ask retém a chamada por approval.holdWindow (20s). Depois disso o agente recebe pending_approval com um id para consultar por approval_status ou descartar por approval_cancel." },
              { title: "Decidir", text: "Uma pessoa decide pela API de operador, pelo console ou por uma superfície de aprovação (desktop, Discord, Slack, Telegram, webhook)." },
              { title: "Rodar uma vez", text: "Uma chamada aprovada roda uma vez. Uma chamada idêntica (mesma sessão, mesmo hash de chamada) se anexa ao registro aberto em vez de abrir outro." },
              { title: "Nunca reenviar", text: "Uma chamada encaminhada nunca é enviada de novo. Se o resultado não puder ser registrado, o agente recebe outcome_unknown, e a linha fica em started até o worker varrê-la." },
            ],
          },
          { kind: "p", text: "Estados: pending, approved, executing, executed, failed, outcome_unknown, denied, expired, cancelled. core/approval guarda as transições; o worker roda os timers e um freio de negações." },
        ],
      },
      {
        id: "grants",
        title: "Concessões e exposição",
        group: "deep",
        blocks: [
          { kind: "scene", id: "connector-engine/grants", caption: "Quatro camadas de concessão reduzem o chaveiro de um agente a um modo por função: allow, ask ou deny." },
          { kind: "p", text: "A avaliação percorre quatro camadas de concessão, e o modo mais estrito vence entre elas. core/evaluate guarda os passos, core/grant as regras de linha." },
          {
            kind: "table",
            head: ["Ordem", "Camada", "Efeito"],
            rows: [
              ["1", "tenant", "opcional; restringe quando presente"],
              ["2", "workspace", "obrigatória; linha ausente nega"],
              ["3", "agent", "obrigatória; linha ausente nega"],
              ["4", "user acted for", "opcional; restringe quando presente"],
              ["depois", "teto do catálogo", "a visibilidade da listagem limita o modo"],
              ["depois", "funções destrutivas", "allow vira ask_once (ou ask)"],
              ["depois", "checagem de exposição", "dado privado + conteúdo não confiável + caminho de saída força ask"],
              ["depois", "concessão de sessão", "um ask_once aprovado permite o resto da sessão"],
            ],
          },
          { kind: "p", text: "core/exposure.Check preenche as três pernas sobre as funções que seriam listadas para um agente: LegA lê dados privados, LegB devolve conteúdo de terceiros, LegC é qualquer coisa que não seja classe de leitura ou esteja marcada como open world. Uma flag não revisada conta para a sua perna, a leitura cautelosa. Exposed é true só quando as três não estão vazias." },
          {
            kind: "list",
            items: [
              "Só uma linha de sessão nomeia um agente. Uma linha de tenant, workspace ou usuário com agent definido é recusada com row_refused.",
              "O contador de usos de uma linha pertence ao store: só reservar um uso e restaurar um backup o alteram.",
              "A migração 0003_canonical_grants reescreve stores antigos; linhas em conflito são mescladas na mais estrita e deixam uma linha de auditoria grant.merged com as originais.",
              "Cada store mantém um log por tenant, monotonicamente crescente, das mudanças de configuração de acesso (permission_head, permission_changes); uma restauração só o importa para um tenant cujo log ativo esteja vazio.",
            ],
          },
        ],
      },
      {
        id: "pinning",
        title: "Pinning",
        group: "deep",
        blocks: [
          { kind: "scene", id: "connector-engine/pinning", caption: "Cada re-listagem é hasheada e comparada com o selo fixado; uma mudança fica retida até ser aceita." },
          {
            kind: "list",
            items: [
              "Cada definição de função é hasheada como JSON canônico RFC 8785 quando capturada (core/pinning).",
              "Uma função nova, ou uma descrição ou schema alterados, fica em quarentena até uma pessoa aceitar.",
              "Uma concessão feita sobre um hash antigo fica obsoleta e precisa de confirmGrant.",
              "Os conectores são re-listados numa agenda entre pinning.relistMin e pinning.relistMax, então um servidor que muda ferramentas após a instalação é detectado.",
              "Instruções, prompts e resources do servidor são fixados do mesmo jeito quando um perfil os repassa (gateway.relayInstructions, gateway.upstreamContent).",
            ],
          },
        ],
      },
      {
        id: "storage",
        title: "Armazenamento e eventos",
        group: "deep",
        blocks: [
          { kind: "p", text: "As migrações do Postgres (store/postgres/migrations) criam um schema em estilo de documentos. Todas as tabelas têm row-level security forçada, baseada na configuração cn.tenant; um role que a contorne é recusado no boot." },
          {
            kind: "table",
            head: ["Tabela", "Guarda"],
            rows: [
              ["records", "kind, k, tenant_id, rev, doc jsonb; único por (kind, uniq); índice GIN em doc"],
              ["audit", "linhas de auditoria por tenant e sujeito"],
              ["streams, outbox", "sequência por stream; linhas do outbox únicas em (stream, sequence), delivered_at nulo enquanto pendentes"],
              ["inbox", "deduplicação de ids consumidos por tenant"],
              ["due_work", "timers, indexados por due"],
              ["permission_head, permission_changes", "o log de mudanças de configuração de acesso"],
            ],
          },
          { kind: "p", text: "A linha do outbox é escrita na mesma transação da mudança de estado. relay/ lê Outbox.Pending, entrega pelo sink com um backoff que dobra (teto de um minuto) e registra uma linha de auditoria para um evento que abandona. Os consumidores precisam deduplicar pelo id do CloudEvent." },
        ],
      },
      {
        id: "security",
        title: "Modelo de segurança",
        group: "deep",
        blocks: [
          { kind: "p", text: "O motor assume que o agente e o servidor de ferramentas upstream podem ser hostis, e que o host e o seu administrador são confiáveis." },
          {
            kind: "list",
            items: [
              "Segredos usam envelope encryption com uma chave por tenant; destruir a chave destrói os dados. Segredos nunca são retornados por uma API.",
              "Os argumentos das chamadas são guardados como hash; o log de atividade do console oculta prováveis segredos.",
              "Um guard de egress recusa endereços privados em conexões upstream, a menos que runtime.allowPrivateHosts esteja definido, e ignora HTTP_PROXY e HTTPS_PROXY porque um proxy anularia a checagem.",
              "O console local escuta em 127.0.0.1 com allowlist de Host, checagens de Origin e tokens CSRF. Os apps de IA entram com OAuth 2.1 e PKCE S256.",
              "A instalação sem Docker usa um diretório de dados 0700, um banco 0600 e um socket de controle que atende apenas um peer do mesmo usuário.",
              "Produção recusa configurações arriscadas a menos que adapters.yaml as reconheça: local_token_issuer, long_lived_agent_tokens, trusted_proxy, manage_mcp_mutations, plaintext_root_key, private_egress.",
            ],
          },
          { kind: "p", text: "Fora de escopo: um host ou root comprometido, acesso ao socket do Docker e leitura da memória de um processo desbloqueado." },
        ],
      },
      {
        id: "decisions",
        title: "Decisões e limites",
        group: "decisions",
        blocks: [
          {
            kind: "table",
            head: ["Decisão", "Escolhido", "Rejeitado", "Por quê"],
            rows: [
              ["Função negada", "responde como uma desconhecida", "um erro forbidden explícito", "um agente não consegue sondar o que existe"],
              ["Definição de ferramenta alterada", "quarentena até aceitar, fixada por hash", "confiar na última listagem", "um servidor não consegue ampliar o acesso em silêncio"],
              ["Entrega de eventos", "outbox na mesma transação, ao menos uma vez", "publicar após o commit", "nenhum evento se perde; duplicatas são deduplicadas por id"],
              ["Chamada encaminhada", "nunca reenviada; outcome_unknown se o resultado se perde", "retry", "um efeito colateral aprovado roda uma vez"],
              ["Código self-hosted", "selfhosted/ importa o núcleo, nunca o contrário", "uma árvore compartilhada", "o motor headless fica livre de código de console"],
              ["Instâncias", "um motor por banco de dados", "réplicas", "os caminhos multi-réplica não foram testados"],
            ],
          },
          {
            kind: "list",
            items: [
              "Mais de uma réplica não é verificado: o relay pode entregar duas vezes, o worker não tem eleição de líder e as conexões OAuth pendentes vivem num mapa do processo.",
              "O diretório de segredos precisa ser compartilhado e ter backup junto com o banco; linhas sem a chave raiz não podem ser abertas.",
              "As portas scanner e suggester não têm adaptador embutido; os overlays vsh admin marcam as respostas de suggest como indisponíveis até um build registrar um.",
              "Uma restauração de snapshot ainda não escreve suas próprias mudanças no log de permissões.",
              "O repositório tem um benchmark de escritas de bindings e concessões contra muitos agentes e conectores, mas sem números publicados.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Arquivos para ler",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "ARCHITECTURE.md", note: "camadas, caminho da chamada, concessões, aprovações, pinning, perfis" },
              { path: "docs/reference/config.md", note: "chaves de configuração e reconhecimentos" },
              { path: "docs/enterprise/security-model.md", note: "ativos, ameaças, implantação segura" },
              { path: "docs/enterprise/scaling.md", note: "o que uma instância roda e o que não foi verificado" },
              { path: "core/exposure/exposure.go", note: "a checagem de exposição de três pernas" },
              { path: "core/pinning/canonical.go", note: "hash de JSON canônico das definições" },
              { path: "core/approval/approval.go", note: "transições de estado da aprovação" },
              { path: "service/gateway.go", note: "caso de uso por trás de um tools/call" },
              { path: "relay/relay.go", note: "entrega do outbox ao menos uma vez e em ordem" },
              { path: "store/postgres/migrations/0001_schema.sql", note: "tabelas, row-level security, funções de tenant" },
              { path: "gateway/call.go", note: "tratamento de chamadas MCP no gateway" },
              { path: "scripts/check-layering.sh", note: "impõe a fronteira selfhosted" },
            ],
          },
        ],
      },
    ],
  },
};

export default doc;
