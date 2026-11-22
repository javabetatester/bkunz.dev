export const LANGS = ["en", "es", "pt-br"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_PATH: Record<Lang, string> = { en: "/", es: "/es", "pt-br": "/pt-br" };
export const LANG_LABEL: Record<Lang, string> = { en: "en", es: "es", "pt-br": "pt" };

export const TABS = ["whoami", "work", "projects", "posts"] as const;
export type Tab = (typeof TABS)[number];

export type Card = { title: string; body: string; meta?: string };

export type Section = {
  id: string;
  path: string;
  title: string;
  paragraphs: { text: string; trace: string }[];
};

export type Copy = {
  meta: { title: string; description: string };
  hero: { role: string; answer: string; about: string; track: string; trackCta: string; handleNote: string; scrollHint: string };
  tabs: Record<Tab, Card[]>;
  sections: Section[];
  elsewhere: { title: string; lead: string };
  footer: string;
};

const WORK_EN: Card[] = [
  {
    meta: "2026 — now",
    title: "MeuControle.AI · Applied AI & Backend",
    body: "Conversational orchestrator in Go over gRPC, 30+ domain adapters as tools, multi-provider LLM routing with per-attempt metering. Evals in CI: −35% deployment errors.",
  },
  {
    meta: "2025 — 2026",
    title: "Lello Condomínios · Backend",
    body: "Billing and payments on Java, Go and Kafka at millions of transactions a month: idempotent consumers, dead-letter topics, boleto and PIX reconciliation.",
  },
  {
    meta: "2020 — 2024",
    title: "Hypixel Studios · Distributed Systems & Security",
    body: "Proxy network and Netty game servers for 40k+ concurrent players at p99 < 50 ms. Real-time anti-cheat over millions of daily events.",
  },
  {
    meta: "2016 — 2020",
    title: "CraftLandia · Systems & Platform",
    body: "Proprietary anti-cheat in the Netty pipeline. Java backend for 13k+ concurrent users with a stable tick loop under load.",
  },
];

const WORK_ES: Card[] = [
  {
    meta: "2026 — hoy",
    title: "MeuControle.AI · IA aplicada y Backend",
    body: "Orquestador conversacional en Go sobre gRPC, más de 30 adaptadores de dominio como tools, ruteo multi-proveedor de LLM con medición por intento. Evals en CI: −35% de errores de despliegue.",
  },
  {
    meta: "2025 — 2026",
    title: "Lello Condomínios · Backend",
    body: "Facturación y pagos en Java, Go y Kafka con millones de transacciones al mes: consumidores idempotentes, dead-letter topics, conciliación de boleto y PIX.",
  },
  {
    meta: "2020 — 2024",
    title: "Hypixel Studios · Sistemas distribuidos y seguridad",
    body: "Red de proxies y servidores de juego en Netty para más de 40k jugadores concurrentes con p99 < 50 ms. Anti-cheat en tiempo real sobre millones de eventos diarios.",
  },
  {
    meta: "2016 — 2020",
    title: "CraftLandia · Sistemas y plataforma",
    body: "Anti-cheat propietario en el pipeline de Netty. Backend Java para más de 13k usuarios concurrentes con un tick loop estable bajo carga.",
  },
];

const WORK_PT: Card[] = [
  {
    meta: "2026 — hoje",
    title: "MeuControle.AI · IA aplicada e Backend",
    body: "Orquestrador conversacional em Go sobre gRPC, mais de 30 adapters de domínio como tools, roteamento multi-provedor de LLM com medição por tentativa. Evals no CI: −35% de erros de deploy.",
  },
  {
    meta: "2025 — 2026",
    title: "Lello Condomínios · Backend",
    body: "Cobrança e pagamentos em Java, Go e Kafka com milhões de transações por mês: consumers idempotentes, dead-letter topics, conciliação de boleto e PIX.",
  },
  {
    meta: "2020 — 2024",
    title: "Hypixel Studios · Sistemas distribuídos e segurança",
    body: "Rede de proxies e game servers em Netty para mais de 40k jogadores simultâneos com p99 < 50 ms. Anti-cheat em tempo real sobre milhões de eventos por dia.",
  },
  {
    meta: "2016 — 2020",
    title: "CraftLandia · Sistemas e plataforma",
    body: "Anti-cheat proprietário no pipeline do Netty. Backend Java para mais de 13k usuários simultâneos com tick loop estável sob carga.",
  },
];

const en: Copy = {
  meta: {
    title: "Bernardo Kunz · bkunz.dev",
    description:
      "Bernardo Kunz: backend, distributed systems and AI engineer, founder of versatile.sh. Durable execution, agent runtimes, MCP gateways and LLM evals, with technical docs and studies.",
  },
  hero: {
    role: "Backend & AI engineer: agent orchestration, evals and guardrails on top of distributed systems and security, since 2016.",
    answer: "I build software as independent engines.",
    about: "Since 2016 on backends that cannot stop: game networks with 40k+ concurrent players at p99 < 50 ms, payment systems on Kafka at millions of transactions a month, and applied AI with evals in CI. Go first, on a long Java background.",
    track: "Track",
    handleNote: "code and history on GitHub",
    trackCta: "full history",
    scrollHint: "scroll",
  },
  tabs: {
    whoami: [
      { title: "AI systems architecture", body: "Agent orchestration with tool use over domain adapters, typed intent routing, grounding on native queries, hybrid retrieval (BM25 + embeddings), purpose-based routing with provider fallback, prompt caching, token metering and per-attempt cost." },
      { title: "Evaluation & guardrails", body: "Seeded paired baseline × candidate evals, McNemar test and 95% Wilson intervals, deterministic checks, rubric-based LLM-as-judge, infrastructure errors isolated from the pass rate; prompt-leak canary and shingle guard at the output edge." },
      { title: "Distributed systems", body: "Event-driven multi-tenant platforms with Outbox and at-least-once delivery, idempotency keys, optimistic locking, rate limiting, retries with jitter and concurrency control; p99 < 50 ms at 40k+ connections; correlated traces, metrics and logs." },
      { title: "Security", body: "Large-scale anti-cheat and anti-abuse (packet inspection, statistical anomaly detection), reverse engineering and low-level dynamic analysis (decompilers, firmware, DMA), sandboxing, web and API pentesting, LLM guardrail bypass analysis." },
      { title: "Technical leadership & DevX", body: "Architecture direction through ADRs, engineering standards and internal libraries, context engineering for coding agents (skills, subagents, hooks), parallel worker orchestration, CI/CD integrated with evals." },
    ],
    work: WORK_EN,
    projects: [
      { meta: "in review", title: "Write-ups are being prepared", body: "Each project gets a technical write-up at setup.bkunz.dev: architecture, decisions, trade-offs and the files that matter." },
    ],
    posts: [
      { meta: "in review", title: "Posts follow the projects", body: "Every post is tied to a project and ships with it. Nothing published yet." },
    ],
  },
  sections: [
    {
      id: "engines",
      path: "~/engines",
      title: "What I build",
      paragraphs: [
        { trace: "workflow.run    graph → interpreter · outbox · exactly-once", text: "Most of what I build are engines: small, independent cores that each own one hard problem and run without the others. The first is durable execution. A workflow is a graph, and a deterministic interpreter walks it, so replaying the same history always produces the same decisions. State changes and outgoing messages are committed in one transaction through an inbox and an outbox, and every write is idempotent. The consequence is the property that matters: effects happen exactly once, even when the process dies halfway through a step and starts again." },
        { trace: "agent.session   event log → projections · approvals · ledger", text: "Agent runtimes are built on the same idea. One conversation can be driven from many surfaces at once, so instead of keeping state per client I keep the conversation as an event log and derive every view from it as a projection. Anything an agent wants to do that needs a person goes through an approval state machine, spending is bounded by budgets, and every step lands in an audit ledger that can be verified offline, without trusting the service that wrote it." },
        { trace: "gateway.call    mcp|rest|grpc · perms · pinned sha256", text: "An agent is only as safe as the tools it can reach, so tool access goes through a gateway: one MCP endpoint in front of MCP, REST and gRPC tool servers. Permissions are granted per agent and per function, risky calls wait for human approval, and credentials are envelope-encrypted. Tool definitions are pinned by hash, which closes a quieter hole: a tool server cannot change what a tool does, or what its description tells the model, after the agent was allowed to use it." },
        { trace: "machine.lease   desktop · volume · signed grant · stream", text: "Sometimes the tool is a whole computer. For that, agents get persistent Linux desktops with home volumes and backups, so work survives between sessions the way it would for a person. Access is given through signed grants rather than shared passwords. Inside the guest, a gateway streams the screen and hands out control leases, so perception and input belong to one holder at a time and an agent and a human never fight over the same mouse." },
        { trace: "edge.enrol      dial-out · leased task · plugin ✓", text: "Some work has to run where the data is, on customer hardware. There it is a single static binary that only dials out, enrols with a device key and runs tasks it has leased, so nothing on that network has to accept an inbound connection. What keeps all of these engines from collapsing into one monolith is a single plugin protocol: adapters run out of process over gRPC and must pass a conformance suite, so a provider plugs into every engine the same way and can be replaced without touching a core." },
      ],
    },
    {
      id: "method",
      path: "~/method",
      title: "How it holds",
      paragraphs: [
        { trace: "op.expose       http · grpc · mcp · cli", text: "The engines only stay independent if they follow the same rules, so the rules are where most of the design effort goes. Each core is written in Go or TypeScript as ports and adapters, and which adapter fills a port is chosen by configuration, not by code. Every operation is defined once and exposed over HTTP, gRPC, MCP and a CLI. A person, a service and an agent reach the same behaviour through the door that suits them, and none of them gets a private shortcut." },
        { trace: "pg.policy       rls tenant_id = current_setting()", text: "Because those doors are public, the contracts behind them are versioned and checked: operations and events carry JSON Schemas, and a change that breaks a consumer fails before it ships. Access is closed by default and opened on purpose. Tenancy is enforced in Postgres with row-level security, so isolation holds where the data lives; a query that forgets a filter in application code still cannot read another tenant's rows." },
        { trace: "write           where id=$1 and version=$2", text: "Failure is the normal case at a boundary, so every mutating one is built to be repeated. Messages leave through an outbox with at-least-once delivery, and receivers make that safe with idempotency keys. Concurrent writers are reconciled with optimistic locking, a version check inside the update itself, instead of locks held across a request. Retries back off with jitter so they do not arrive in waves, and rate limits and concurrency control keep one caller from starving the rest." },
        { trace: "world.fork      clock=fixed · db=fork · faults=on", text: "Testing follows the same logic: if behaviour depends on time, data and failure, the test has to control all three. Runs execute in controlled worlds with a fixed clock, a forked database and injected faults, so a race or a timeout is reproduced on demand rather than hoped for. Usage is metered on an append-only ledger with budgets, artifacts are versioned, and traces, metrics and logs are correlated through OpenTelemetry. Measure twice, optimize once." },
      ],
    },
    {
      id: "applied-ai",
      path: "~/applied-ai",
      title: "AI, measured",
      paragraphs: [
        { trace: "llm.route       purpose → provider · fallback · $/attempt", text: "I treat LLM features as systems with inputs, costs and failure modes, not as prompts. An agent orchestrates tool use over the same domain adapters the rest of the platform uses, so it acts through the operations a person would, under the same permissions. Requests are routed by purpose rather than by vendor: each purpose maps to a provider with a fallback, prompts are cached where the provider allows it, and every call is metered in tokens, with the cost recorded per attempt, retries included." },
        { trace: "rag.query       bm25 ⊕ embeddings · typed intent", text: "An answer is only useful when it is grounded. A request first goes through typed intent routing, so a question that has an exact answer is resolved with a native query against the system's own data instead of a guess from the model. What remains goes to hybrid retrieval, BM25 plus embeddings, because lexical matching catches identifiers and exact terms that vector similarity tends to blur, while embeddings cover the paraphrases that lexical matching misses." },
        { trace: "eval.compare    mcnemar p<0.05 · wilson 95%", text: "None of this changes without an eval. A candidate prompt or model runs against the baseline on the same seeded cases, paired, and the difference is judged with a McNemar test, with a 95% Wilson interval on each pass rate. Deterministic checks run first; a rubric-based LLM-as-judge is used only where a fixed check cannot decide. Infrastructure errors are isolated from the pass rate, so a flaky provider is never counted as a worse model." },
        { trace: "guard.output    canary · shingle · deterministic", text: "The output edge is guarded too, since a model can be talked into repeating what it was told to keep private. A canary planted in the prompt exposes a leak the moment it appears in a response, and a shingle guard catches long overlaps with the prompt even when the wording drifts. Both checks are deterministic and cheap, so they run on every response, not on a sample. The habit comes straight from security work: assume the input is adversarial and check at the boundary." },
      ],
    },
    {
      id: "security",
      path: "~/security",
      title: "Security, low level",
      paragraphs: [
        { trace: "netty.pipeline  inspect · anomaly z-score", text: "I came to security through anti-cheat and anti-abuse at large scale. The work lived inside the network pipeline: inspecting packets as they arrived and running statistical anomaly detection over millions of daily events. On that path a false positive punishes a legitimate user and a slow check adds latency for everyone, so every detector is a trade between precision and cost. That trade still decides where I place checks in any system I design." },
        { trace: "re.trace        firmware · dma · sandbox", text: "Cheats are rarely visible from the network alone, and that pulled me down the stack into reverse engineering and low-level dynamic analysis: decompilers, firmware and DMA, where the code being read was often written to resist being read. Sandboxing is the other half of that work, running untrusted code where it can be observed without being trusted. It remains the most direct way I know to learn how a system actually behaves, as opposed to how its documentation says it behaves." },
        { trace: "pentest.api     authz · injection · bypass", text: "Today most of that goes into offensive testing of web applications and APIs, where broken authorization and injection are still the first things to look for. LLM features opened a new surface, so I also analyse guardrail bypasses: the inputs that make a model ignore its instructions or leak them. That analysis is why the prompt-leak canary and the shingle guard exist. Defences are easier to design once you have broken the thing they protect." },
        { trace: "cert            bscp · mcp-sec · api-pt · pci", text: "The certifications trace the same path: BSCP, MCP Security, API Penetration Testing, API Security for PCI Compliance, and API Security for Connected Cars and Fleets. I read them less as credentials than as a map of where I have spent time, from web exploitation to the protocol agents use to reach their tools. They also explain choices made elsewhere on this page: closed by default, credentials encrypted, tool definitions pinned, risky calls behind an approval." },
      ],
    },
  ],
  elsewhere: { title: "Elsewhere", lead: "Code, history and short notes." },
  footer: "Static, prerendered, served from the edge.",
};

const es: Copy = {
  meta: {
    title: "Bernardo Kunz · bkunz.dev",
    description:
      "Bernardo Kunz: ingeniero de backend, sistemas distribuidos e IA, fundador de versatile.sh. Ejecución durable, runtimes de agentes, gateways MCP y evals de LLM, con docs técnicas y estudios.",
  },
  hero: {
    role: "Ingeniero de backend e IA: orquestación de agentes, evals y guardrails sobre sistemas distribuidos y seguridad, desde 2016.",
    answer: "Construyo software como engines independientes.",
    about: "Desde 2016 en backends que no pueden parar: redes de juego con más de 40k jugadores concurrentes a p99 < 50 ms, sistemas de pago sobre Kafka con millones de transacciones al mes e IA aplicada con evals en CI. Go primero, sobre una larga base en Java.",
    track: "Trayectoria",
    handleNote: "código e historia en GitHub",
    trackCta: "historia completa",
    scrollHint: "scroll",
  },
  tabs: {
    whoami: [
      { title: "Arquitectura de sistemas de IA", body: "Orquestación de agentes con tool use sobre adaptadores de dominio, ruteo de intención tipado, grounding en consultas nativas, recuperación híbrida (BM25 + embeddings), ruteo por propósito con fallback de proveedor, prompt caching, medición de tokens y costo por intento." },
      { title: "Evaluación y guardrails", body: "Evals pareadas baseline × candidato con semilla, test de McNemar e intervalos de Wilson al 95%, checks deterministas, LLM-as-judge con rúbrica, errores de infraestructura aislados de la tasa de aprobación; canario de fuga de prompt y shingle guard en la salida." },
      { title: "Sistemas distribuidos", body: "Plataformas multi-tenant orientadas a eventos con Outbox y entrega at-least-once, claves de idempotencia, optimistic locking, rate limiting, reintentos con jitter y control de concurrencia; p99 < 50 ms con más de 40k conexiones; trazas, métricas y logs correlacionados." },
      { title: "Seguridad", body: "Anti-cheat y anti-abuso a gran escala (inspección de paquetes, detección estadística de anomalías), ingeniería inversa y análisis dinámico de bajo nivel (decompiladores, firmware, DMA), sandboxing, pentest de web y APIs, análisis de bypass de guardrails de LLM." },
      { title: "Liderazgo técnico y DevX", body: "Dirección de arquitectura con ADRs, estándares de ingeniería y librerías internas, context engineering para agentes de código (skills, subagentes, hooks), orquestación de workers en paralelo, CI/CD integrado con evals." },
    ],
    work: WORK_ES,
    projects: [
      { meta: "en revisión", title: "Los write-ups están en preparación", body: "Cada proyecto tendrá un write-up técnico en setup.bkunz.dev: arquitectura, decisiones, trade-offs y los archivos que importan." },
    ],
    posts: [
      { meta: "en revisión", title: "Los posts siguen a los proyectos", body: "Cada post está ligado a un proyecto y sale con él. Nada publicado aún." },
    ],
  },
  sections: [
    {
      id: "engines",
      path: "~/engines",
      title: "Qué construyo",
      paragraphs: [
        { trace: "workflow.run    graph → interpreter · outbox · exactly-once", text: "Casi todo lo que construyo son motores: núcleos pequeños e independientes, cada uno dueño de un problema difícil y capaz de funcionar sin los demás. El primero es la ejecución durable. Un flujo de trabajo es un grafo que recorre un intérprete determinista, así que reproducir el mismo historial siempre produce las mismas decisiones. Los cambios de estado y los mensajes salientes se confirman en una sola transacción mediante un inbox y un outbox, y cada escritura es idempotente. La consecuencia es la propiedad que importa: los efectos ocurren exactamente una vez, incluso si el proceso muere a mitad de un paso y vuelve a arrancar." },
        { trace: "agent.session   event log → projections · approvals · ledger", text: "Los runtimes de agentes se apoyan en la misma idea. Una conversación puede manejarse desde muchas superficies a la vez, así que en lugar de guardar estado por cliente la guardo como un registro de eventos y derivo cada vista de él como una proyección. Todo lo que un agente quiera hacer y necesite a una persona pasa por una máquina de estados de aprobación, el gasto está acotado por presupuestos y cada paso queda en un libro de auditoría verificable sin conexión, sin confiar en el servicio que lo escribió." },
        { trace: "gateway.call    mcp|rest|grpc · perms · pinned sha256", text: "Un agente es tan seguro como las herramientas a las que llega, por eso el acceso a herramientas pasa por un gateway: un único endpoint MCP delante de servidores de herramientas MCP, REST y gRPC. Los permisos se conceden por agente y por función, las llamadas riesgosas esperan aprobación humana y las credenciales se cifran con cifrado de sobre. Las definiciones de herramientas se fijan por hash, lo que cierra un agujero más silencioso: un servidor no puede cambiar lo que hace una herramienta, ni lo que su descripción le dice al modelo, después de que el agente fue autorizado a usarla." },
        { trace: "machine.lease   desktop · volume · signed grant · stream", text: "A veces la herramienta es una computadora entera. Para eso, los agentes reciben escritorios Linux persistentes con volúmenes de usuario y copias de seguridad, de modo que el trabajo sobrevive entre sesiones como lo haría para una persona. El acceso se otorga con permisos firmados, no con contraseñas compartidas. Dentro del invitado, un gateway transmite la pantalla y reparte concesiones de control, así la percepción y la entrada pertenecen a un solo titular a la vez y un agente y una persona nunca se disputan el mismo ratón." },
        { trace: "edge.enrol      dial-out · leased task · plugin ✓", text: "Parte del trabajo tiene que correr donde están los datos, en el hardware del cliente. Ahí es un único binario estático que solo hace conexiones salientes, se registra con una clave de dispositivo y ejecuta las tareas que tomó en concesión, de modo que nada en esa red tiene que aceptar una conexión entrante. Lo que impide que todos estos motores se fundan en un monolito es un único protocolo de plugins: los adaptadores corren fuera del proceso sobre gRPC y deben pasar una suite de conformidad, así un proveedor se conecta igual a cada motor y se puede reemplazar sin tocar ningún núcleo." },
      ],
    },
    {
      id: "method",
      path: "~/method",
      title: "Cómo se sostiene",
      paragraphs: [
        { trace: "op.expose       http · grpc · mcp · cli", text: "Los motores solo siguen siendo independientes si obedecen las mismas reglas, así que ahí va la mayor parte del esfuerzo de diseño. Cada núcleo está escrito en Go o TypeScript como puertos y adaptadores, y qué adaptador ocupa cada puerto se elige por configuración, no por código. Cada operación se define una vez y se expone por HTTP, gRPC, MCP y una CLI. Una persona, un servicio y un agente llegan al mismo comportamiento por la puerta que les sirve, y ninguno tiene un atajo privado." },
        { trace: "pg.policy       rls tenant_id = current_setting()", text: "Como esas puertas son públicas, los contratos detrás de ellas están versionados y verificados: operaciones y eventos llevan JSON Schemas, y un cambio que rompe a un consumidor falla antes de publicarse. El acceso está cerrado por defecto y se abre a propósito. La multitenencia se aplica en Postgres con seguridad a nivel de fila, así el aislamiento se cumple donde viven los datos; una consulta que olvida un filtro en el código de la aplicación igual no puede leer filas de otro tenant." },
        { trace: "write           where id=$1 and version=$2", text: "En una frontera el fallo es el caso normal, así que cada frontera que modifica algo está hecha para repetirse. Los mensajes salen por un outbox con entrega al menos una vez, y los receptores lo vuelven seguro con claves de idempotencia. Los escritores concurrentes se reconcilian con bloqueo optimista, una verificación de versión dentro del propio update, en lugar de bloqueos mantenidos durante una petición. Los reintentos esperan con jitter para no llegar en oleadas, y los límites de tasa y el control de concurrencia evitan que un cliente deje sin recursos al resto." },
        { trace: "world.fork      clock=fixed · db=fork · faults=on", text: "Las pruebas siguen la misma lógica: si el comportamiento depende del tiempo, de los datos y de los fallos, la prueba tiene que controlar los tres. Las ejecuciones corren en mundos controlados con reloj fijo, una base de datos bifurcada y fallos inyectados, así una condición de carrera o un timeout se reproducen a demanda en lugar de esperarlos con suerte. El uso se mide en un libro solo de anexado con presupuestos, los artefactos están versionados y trazas, métricas y logs se correlacionan con OpenTelemetry. Medir dos veces, optimizar una." },
      ],
    },
    {
      id: "applied-ai",
      path: "~/applied-ai",
      title: "IA, medida",
      paragraphs: [
        { trace: "llm.route       purpose → provider · fallback · $/attempt", text: "Trato las funciones con LLM como sistemas con entradas, costos y modos de fallo, no como prompts. Un agente orquesta el uso de herramientas sobre los mismos adaptadores de dominio que usa el resto de la plataforma, así actúa mediante las operaciones que usaría una persona, con los mismos permisos. Las peticiones se enrutan por propósito y no por proveedor: cada propósito apunta a un proveedor con fallback, los prompts se cachean donde el proveedor lo permite y cada llamada se mide en tokens, con el costo registrado por intento, reintentos incluidos." },
        { trace: "rag.query       bm25 ⊕ embeddings · typed intent", text: "Una respuesta solo sirve si está fundamentada. Una petición pasa primero por un enrutamiento de intención tipado, así una pregunta con respuesta exacta se resuelve con una consulta nativa sobre los datos del propio sistema en lugar de una conjetura del modelo. Lo que queda va a la recuperación híbrida, BM25 más embeddings, porque la coincidencia léxica atrapa identificadores y términos exactos que la similitud vectorial tiende a difuminar, mientras los embeddings cubren las paráfrasis que la coincidencia léxica no ve." },
        { trace: "eval.compare    mcnemar p<0.05 · wilson 95%", text: "Nada de esto cambia sin una evaluación. Un prompt o modelo candidato corre contra la línea base sobre los mismos casos con semilla, en pares, y la diferencia se juzga con una prueba de McNemar, con un intervalo de Wilson del 95% sobre cada tasa de aprobación. Primero corren las verificaciones deterministas; un LLM como juez con rúbrica se usa solo donde una verificación fija no puede decidir. Los errores de infraestructura quedan aislados de la tasa de aprobación, así un proveedor inestable nunca cuenta como un modelo peor." },
        { trace: "guard.output    canary · shingle · deterministic", text: "La salida también está vigilada, porque a un modelo se le puede convencer de repetir lo que le pidieron mantener en privado. Un canario sembrado en el prompt delata una filtración en cuanto aparece en una respuesta, y una guarda de shingles detecta solapamientos largos con el prompt aunque la redacción cambie. Ambas verificaciones son deterministas y baratas, así que corren en cada respuesta, no en una muestra. El hábito viene directo del trabajo de seguridad: asumir que la entrada es adversaria y verificar en la frontera." },
      ],
    },
    {
      id: "security",
      path: "~/security",
      title: "Seguridad, a bajo nivel",
      paragraphs: [
        { trace: "netty.pipeline  inspect · anomaly z-score", text: "Llegué a la seguridad por el anti-cheat y el anti-abuso a gran escala. El trabajo vivía dentro del pipeline de red: inspeccionar paquetes a medida que llegaban y aplicar detección estadística de anomalías sobre millones de eventos diarios. En ese camino un falso positivo castiga a un usuario legítimo y una verificación lenta agrega latencia para todos, así que cada detector es un equilibrio entre precisión y costo. Ese equilibrio todavía decide dónde pongo las verificaciones en cualquier sistema que diseño." },
        { trace: "re.trace        firmware · dma · sandbox", text: "Los cheats rara vez se ven solo desde la red, y eso me llevó hacia abajo en la pila, a la ingeniería inversa y al análisis dinámico de bajo nivel: decompiladores, firmware y DMA, donde el código que se lee muchas veces fue escrito para resistir ser leído. El sandboxing es la otra mitad de ese trabajo: ejecutar código no confiable donde se puede observar sin confiar en él. Sigue siendo la forma más directa que conozco de aprender cómo se comporta un sistema de verdad, y no cómo dice su documentación que se comporta." },
        { trace: "pentest.api     authz · injection · bypass", text: "Hoy la mayor parte de eso va a pruebas ofensivas de aplicaciones web y APIs, donde la autorización rota y la inyección siguen siendo lo primero que hay que buscar. Las funciones con LLM abrieron una superficie nueva, así que también analizo evasiones de guardrails: las entradas que hacen que un modelo ignore sus instrucciones o las filtre. Ese análisis es la razón de que existan el canario de filtración de prompt y la guarda de shingles. Las defensas son más fáciles de diseñar cuando ya rompiste lo que protegen." },
        { trace: "cert            bscp · mcp-sec · api-pt · pci", text: "Las certificaciones siguen el mismo camino: BSCP, MCP Security, API Penetration Testing, API Security for PCI Compliance y API Security for Connected Cars and Fleets. Las leo menos como credenciales que como un mapa de dónde pasé el tiempo, desde la explotación web hasta el protocolo que usan los agentes para llegar a sus herramientas. También explican decisiones tomadas en otras partes de esta página: cerrado por defecto, credenciales cifradas, definiciones de herramientas fijadas y llamadas riesgosas detrás de una aprobación." },
      ],
    },
  ],
  elsewhere: { title: "En otros lugares", lead: "Código, historia y notas cortas." },
  footer: "Estático, prerenderizado, servido desde el edge.",
};

const ptBr: Copy = {
  meta: {
    title: "Bernardo Kunz · bkunz.dev",
    description:
      "Bernardo Kunz: engenheiro de backend, sistemas distribuídos e IA, fundador da versatile.sh. Execução durável, runtimes de agentes, gateways MCP e evals de LLM, com docs técnicas e estudos.",
  },
  hero: {
    role: "Engenheiro de backend e IA: orquestração de agentes, evals e guardrails sobre sistemas distribuídos e segurança, desde 2016.",
    answer: "Construo software como engines independentes.",
    about: "Desde 2016 em backends que não podem parar: redes de jogos com mais de 40k jogadores simultâneos a p99 < 50 ms, sistemas de pagamento em Kafka com milhões de transações por mês e IA aplicada com evals no CI. Go primeiro, sobre uma longa base em Java.",
    track: "Trajetória",
    handleNote: "código e histórico no GitHub",
    trackCta: "histórico completo",
    scrollHint: "role",
  },
  tabs: {
    whoami: [
      { title: "Arquitetura de sistemas de IA", body: "Orquestração de agentes com tool use sobre adapters de domínio, roteamento de intenção tipado, grounding em queries nativas, recuperação híbrida (BM25 + embeddings), roteamento por propósito com fallback de provedor, prompt caching, medição de tokens e custo por tentativa." },
      { title: "Avaliação e guardrails", body: "Evals pareadas baseline × candidato com seed, teste de McNemar e intervalos de Wilson a 95%, checks determinísticos, LLM-as-judge com rubrica, erros de infraestrutura isolados da taxa de aprovação; canário de vazamento de prompt e shingle guard na saída." },
      { title: "Sistemas distribuídos", body: "Plataformas multi-tenant orientadas a eventos com Outbox e entrega at-least-once, chaves de idempotência, optimistic locking, rate limiting, retries com jitter e controle de concorrência; p99 < 50 ms com mais de 40k conexões; traces, métricas e logs correlacionados." },
      { title: "Segurança", body: "Anti-cheat e anti-abuso em larga escala (inspeção de pacotes, detecção estatística de anomalias), engenharia reversa e análise dinâmica de baixo nível (decompiladores, firmware, DMA), sandboxing, pentest de web e APIs, análise de bypass de guardrails de LLM." },
      { title: "Liderança técnica e DevX", body: "Direção de arquitetura com ADRs, padrões de engenharia e bibliotecas internas, context engineering para agentes de código (skills, subagentes, hooks), orquestração de workers em paralelo, CI/CD integrado com evals." },
    ],
    work: WORK_PT,
    projects: [
      { meta: "em revisão", title: "Os write-ups estão sendo preparados", body: "Cada projeto ganha um write-up técnico em setup.bkunz.dev: arquitetura, decisões, trade-offs e os arquivos que importam." },
    ],
    posts: [
      { meta: "em revisão", title: "Os posts acompanham os projetos", body: "Cada post é ligado a um projeto e sai junto com ele. Nada publicado ainda." },
    ],
  },
  sections: [
    {
      id: "engines",
      path: "~/engines",
      title: "O que eu construo",
      paragraphs: [
        { trace: "workflow.run    graph → interpreter · outbox · exactly-once", text: "Quase tudo o que eu construo são engines: núcleos pequenos e independentes, cada um dono de um problema difícil e capaz de rodar sem os outros. O primeiro é a execução durável. Um workflow é um grafo percorrido por um interpretador determinístico, então reexecutar o mesmo histórico sempre produz as mesmas decisões. Mudanças de estado e mensagens de saída são confirmadas numa única transação por meio de um inbox e um outbox, e toda escrita é idempotente. A consequência é a propriedade que importa: os efeitos acontecem exatamente uma vez, mesmo quando o processo morre no meio de um passo e volta a subir." },
        { trace: "agent.session   event log → projections · approvals · ledger", text: "Os runtimes de agentes se apoiam na mesma ideia. Uma conversa pode ser conduzida de várias superfícies ao mesmo tempo, então, em vez de guardar estado por cliente, eu guardo a conversa como um log de eventos e derivo cada visão dele como uma projeção. Tudo o que um agente quer fazer e que precisa de uma pessoa passa por uma máquina de estados de aprovação, o gasto é limitado por orçamentos e cada passo entra num ledger de auditoria verificável offline, sem confiar no serviço que o escreveu." },
        { trace: "gateway.call    mcp|rest|grpc · perms · pinned sha256", text: "Um agente é tão seguro quanto as ferramentas que ele alcança, por isso o acesso a ferramentas passa por um gateway: um único endpoint MCP na frente de servidores de ferramentas MCP, REST e gRPC. As permissões são concedidas por agente e por função, chamadas arriscadas esperam aprovação humana e as credenciais usam criptografia de envelope. As definições de ferramentas são fixadas por hash, o que fecha um buraco mais silencioso: um servidor não consegue mudar o que uma ferramenta faz, nem o que a descrição dela diz ao modelo, depois que o agente foi autorizado a usá-la." },
        { trace: "machine.lease   desktop · volume · signed grant · stream", text: "Às vezes a ferramenta é um computador inteiro. Para isso, os agentes recebem desktops Linux persistentes, com volumes de home e backups, de modo que o trabalho sobrevive entre sessões como sobreviveria para uma pessoa. O acesso é dado por concessões assinadas, não por senhas compartilhadas. Dentro do convidado, um gateway transmite a tela e distribui leases de controle, então percepção e entrada pertencem a um único detentor por vez, e um agente e uma pessoa nunca disputam o mesmo mouse." },
        { trace: "edge.enrol      dial-out · leased task · plugin ✓", text: "Parte do trabalho precisa rodar onde os dados estão, no hardware do cliente. Lá ele é um único binário estático que só faz conexões de saída, se registra com uma chave de dispositivo e executa as tarefas que pegou em lease, então nada naquela rede precisa aceitar conexão de entrada. O que impede todas essas engines de virarem um monólito é um único protocolo de plugins: os adaptadores rodam fora do processo, sobre gRPC, e precisam passar numa suíte de conformidade, então um provedor se encaixa do mesmo jeito em cada engine e pode ser trocado sem mexer em nenhum núcleo." },
      ],
    },
    {
      id: "method",
      path: "~/method",
      title: "Como se sustenta",
      paragraphs: [
        { trace: "op.expose       http · grpc · mcp · cli", text: "As engines só continuam independentes se seguem as mesmas regras, então é nas regras que vai a maior parte do esforço de design. Cada núcleo é escrito em Go ou TypeScript como portas e adaptadores, e qual adaptador ocupa cada porta é escolhido por configuração, não por código. Cada operação é definida uma vez e exposta por HTTP, gRPC, MCP e uma CLI. Uma pessoa, um serviço e um agente chegam ao mesmo comportamento pela porta que lhes serve, e nenhum deles tem um atalho privado." },
        { trace: "pg.policy       rls tenant_id = current_setting()", text: "Como essas portas são públicas, os contratos por trás delas são versionados e verificados: operações e eventos carregam JSON Schemas, e uma mudança que quebra um consumidor falha antes de ser publicada. O acesso é fechado por padrão e aberto de propósito. A multitenancy é garantida no Postgres com row-level security, então o isolamento vale onde os dados moram; uma consulta que esquece um filtro no código da aplicação continua sem conseguir ler as linhas de outro tenant." },
        { trace: "write           where id=$1 and version=$2", text: "Numa fronteira, a falha é o caso normal, então toda fronteira que altera algo é feita para ser repetida. As mensagens saem por um outbox com entrega at-least-once, e quem recebe torna isso seguro com chaves de idempotência. Escritores concorrentes são reconciliados com optimistic locking, uma checagem de versão dentro do próprio update, em vez de locks mantidos durante uma requisição. Os retries esperam com jitter para não chegarem em ondas, e rate limits e controle de concorrência impedem que um chamador deixe os outros sem recurso." },
        { trace: "world.fork      clock=fixed · db=fork · faults=on", text: "Os testes seguem a mesma lógica: se o comportamento depende de tempo, de dados e de falhas, o teste precisa controlar os três. As execuções rodam em mundos controlados, com relógio fixo, banco de dados bifurcado e falhas injetadas, então uma condição de corrida ou um timeout é reproduzido sob demanda, em vez de esperado na sorte. O uso é medido num ledger append-only com orçamentos, os artefatos são versionados e traces, métricas e logs são correlacionados pelo OpenTelemetry. Medir duas vezes, otimizar uma." },
      ],
    },
    {
      id: "applied-ai",
      path: "~/applied-ai",
      title: "IA, medida",
      paragraphs: [
        { trace: "llm.route       purpose → provider · fallback · $/attempt", text: "Eu trato funcionalidades com LLM como sistemas com entradas, custos e modos de falha, não como prompts. Um agente orquestra o uso de ferramentas sobre os mesmos adaptadores de domínio que o resto da plataforma usa, então ele age pelas operações que uma pessoa usaria, com as mesmas permissões. As requisições são roteadas por propósito, não por fornecedor: cada propósito aponta para um provedor com fallback, os prompts ficam em cache onde o provedor permite e cada chamada é medida em tokens, com o custo registrado por tentativa, retries incluídos." },
        { trace: "rag.query       bm25 ⊕ embeddings · typed intent", text: "Uma resposta só é útil quando é fundamentada. A requisição passa primeiro por um roteamento de intenção tipado, então uma pergunta que tem resposta exata é resolvida com uma consulta nativa sobre os dados do próprio sistema, em vez de um palpite do modelo. O que sobra vai para a recuperação híbrida, BM25 mais embeddings, porque a correspondência léxica pega identificadores e termos exatos que a similaridade vetorial tende a borrar, enquanto os embeddings cobrem as paráfrases que a correspondência léxica deixa passar." },
        { trace: "eval.compare    mcnemar p<0.05 · wilson 95%", text: "Nada disso muda sem um eval. Um prompt ou modelo candidato roda contra o baseline nos mesmos casos com seed, pareados, e a diferença é julgada com um teste de McNemar, com intervalo de Wilson de 95% sobre cada taxa de aprovação. As checagens determinísticas rodam primeiro; um LLM-as-judge com rubrica só entra onde uma checagem fixa não consegue decidir. Erros de infraestrutura ficam isolados da taxa de aprovação, então um provedor instável nunca é contado como um modelo pior." },
        { trace: "guard.output    canary · shingle · deterministic", text: "A saída também é vigiada, porque um modelo pode ser convencido a repetir o que mandaram ele manter em sigilo. Um canário plantado no prompt denuncia um vazamento assim que aparece numa resposta, e uma guarda de shingles pega sobreposições longas com o prompt mesmo quando a redação muda. As duas checagens são determinísticas e baratas, então rodam em toda resposta, não numa amostra. O hábito vem direto do trabalho de segurança: assumir que a entrada é adversária e checar na fronteira." },
      ],
    },
    {
      id: "security",
      path: "~/security",
      title: "Segurança, baixo nível",
      paragraphs: [
        { trace: "netty.pipeline  inspect · anomaly z-score", text: "Cheguei à segurança pelo anti-cheat e pelo anti-abuso em larga escala. O trabalho vivia dentro do pipeline de rede: inspecionar pacotes conforme chegavam e rodar detecção estatística de anomalias sobre milhões de eventos diários. Nesse caminho, um falso positivo pune um usuário legítimo e uma checagem lenta adiciona latência para todo mundo, então cada detector é uma troca entre precisão e custo. Essa troca ainda decide onde eu coloco as checagens em qualquer sistema que desenho." },
        { trace: "re.trace        firmware · dma · sandbox", text: "Cheats raramente aparecem só pela rede, e isso me puxou para baixo na pilha, para a engenharia reversa e a análise dinâmica de baixo nível: decompiladores, firmware e DMA, onde o código lido muitas vezes foi escrito para resistir a ser lido. O sandboxing é a outra metade desse trabalho: executar código não confiável onde ele pode ser observado sem que se confie nele. Continua sendo o jeito mais direto que eu conheço de aprender como um sistema se comporta de fato, e não como a documentação diz que ele se comporta." },
        { trace: "pentest.api     authz · injection · bypass", text: "Hoje a maior parte disso vai para testes ofensivos de aplicações web e APIs, onde autorização quebrada e injeção ainda são as primeiras coisas a procurar. As funcionalidades com LLM abriram uma superfície nova, então eu também analiso bypasses de guardrails: as entradas que fazem um modelo ignorar as próprias instruções ou vazá-las. Essa análise é o motivo de existirem o canário de vazamento de prompt e a guarda de shingles. Defesas ficam mais fáceis de desenhar depois que você quebrou o que elas protegem." },
        { trace: "cert            bscp · mcp-sec · api-pt · pci", text: "As certificações seguem o mesmo caminho: BSCP, MCP Security, API Penetration Testing, API Security for PCI Compliance e API Security for Connected Cars and Fleets. Eu as leio menos como credenciais e mais como um mapa de onde passei meu tempo, da exploração web ao protocolo que os agentes usam para alcançar suas ferramentas. Elas também explicam escolhas feitas em outras partes desta página: fechado por padrão, credenciais criptografadas, definições de ferramentas fixadas e chamadas arriscadas atrás de uma aprovação." },
      ],
    },
  ],
  elsewhere: { title: "Em outros lugares", lead: "Código, histórico e notas curtas." },
  footer: "Estático, pré-renderizado, servido do edge.",
};

export const COPY: Record<Lang, Copy> = { en, es, "pt-br": ptBr };

export const LINKS = [
  { id: "github", label: "github.com/javabetatester", short: "gh/javabetatester", href: "https://github.com/javabetatester" },
  { id: "linkedin", label: "linkedin.com/in/bernardokunz", short: "in/bernardokunz", href: "https://www.linkedin.com/in/bernardokunz/" },
  { id: "x", label: "x.com/jxstbk", short: "x/jxstbk", href: "https://x.com/jxstbk" },
  { id: "versatile", label: "versatile.sh", short: "versatile.sh", href: "https://versatile.sh" },
] as const;

export const langFromPath = (pathname: string): Lang =>
  LANGS.find((l) => l !== "en" && (pathname === `/${l}` || pathname.startsWith(`/${l}/`))) ?? "en";
