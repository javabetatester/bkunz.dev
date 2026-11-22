import type { Lang } from "./copy";

export const SESSIONS = ["specs", "projects", "experience"] as const;
export type Session = (typeof SESSIONS)[number];

export type Role = {
  id: string;
  period: string;
  org: string;
  title: string;
  stack: string[];
  specs: Spec[];
  projects: string[];
  experience: string[];
};

export type Spec = { value: string; text: string };

const en: Role[] = [
  {
    id: "versatile",
    period: "2026 — now",
    org: "versatile.sh",
    title: "Side project · Architecture, engines, research",
    stack: ["Go", "TypeScript", "Rust", "PostgreSQL", "gRPC", "MCP", "JSON Schema", "k3s", "OpenTelemetry", "Semgrep"],
    specs: [{"value": "17,000–18,600 events/s", "text": "Built the durable workflow engine (nagare) with a transactional outbox relayed by 4 sharded sources in batches of 500, sustaining 17–18.6k events/s on Postgres 16 with exactly-once effects."}, {"value": "p99 1.80 ms", "text": "Designed the journal behind every durable step, recording over gRPC with +0.14 ms p50 over a direct insert, so a step costs p50 1.13 ms and p99 1.80 ms."}, {"value": "−37% CPU · −50% memory", "text": "Built a test engine (hakoniwa) on the workflow engine with controlled worlds (frozen clock, forked Postgres, injected faults), cutting CPU by 37% and peak memory by 50% against plain Playwright with identical verdicts."}, {"value": "0 false in 200", "text": "Made time a test input: clock jumps of +1 h to +30 d run in about 155 ms, with 0 false results across 200 jumps."}],
    projects: ["nagare: deterministic interpreter over a journal → inbox/outbox in one transaction, idempotent writes, exactly-once effects, sagas", "hakoniwa: test runs on nagare in controlled worlds → frozen clock, forked Postgres, injected faults", "heya: persistent Linux desktops for agents → home volumes, backups, signed grants, in-guest stream and input gateway; k3s", "connector-engine: one MCP endpoint over MCP/REST/gRPC → per-function grants, approval on use, definitions pinned by sha256", "tsugite: out-of-process adapters over gRPC → versioned contracts, conformance suite, swapped by configuration"],
    experience: ["Decisions through 60+ ADRs and 25 research studies, each with alternatives, costs and a measured gate", "Sole architect: specs, ADRs, research and code", "Parallel AI agents with briefs, gates and evidence before done", "A shared harness: 46 skills, 18 role agents, 20 lints"],
  },
  {
    id: "meucontrole",
    period: "2026 — now",
    org: "MeuControle.AI",
    title: "Sr. Software Engineer · Applied AI & Backend",
    stack: ["Go", "gRPC", "AWS", "EventBridge", "SQS", "DynamoDB", "PostgreSQL", "Redis", "OpenTelemetry", "k3s", "Claude"],
    specs: [{"value": "73% → 96% triage accuracy", "text": "Rebuilt the WhatsApp assistant's triage on typed intent routing and re-measured it on a 45-case holdout: path accuracy 73.3% → 95.6% and routing 84.4% → 97.8%, with p95 still near 400 ms."}, {"value": "−62% cost per turn", "text": "Restructured the agent's prompts for caching: cached prompt share 53% → 88% and first-call cache hits 0/16 → 14/16, cutting cost per turn by 62% while blind-graded passes rose from 6/12 to 8/12."}, {"value": "91.5% → 97.3% accuracy", "text": "Gave support questions a dedicated reading router and validated it on a 188-item blind-graded battery: 91.5% → 97.3% (95% CI 93.9–98.9), 15 fixed vs 4 broken, exact McNemar p = 0.019."}, {"value": "p95 6.1 s → 3.1 s", "text": "Reworked how the portal assistant reads store data, halving data-question latency (p95 6.14 s → 3.14 s, p50 3.33 s → 2.49 s) at 64/65 accuracy and 79% cached prompt tokens."}, {"value": "−35% deployment errors", "text": "Built an evals harness with versioned batteries, a calibrated LLM judge and a candidate deployed on every push, wired into CI, cutting deployment errors by 35%."}, {"value": "+50% reuse · +20% delivery", "text": "Introduced agent-assisted engineering with an internal library of 37 skills and 18 role subagents running in parallel worktrees, raising code reuse by 50% and delivery speed by 20%."}],
    projects: ["AI orchestrator in Go (gRPC, hexagonal) → intent router with guarded admission, multi-turn slots, 30+ adapters as tools, STT/TTS", "LLM gateway → Anthropic/Bedrock/OpenAI adapters, routing by purpose, fallback, prompt caching, per-attempt cost on a protobuf contract", "evals harness → seeded batteries, calibrated LLM judge, regex/number checks, A/B flags, candidates as Kubernetes jobs", "platform → transactional outbox to EventBridge/SQS, idempotency keys, DLQ and poison events, saga journal, OTLP traces/metrics/logs"],
    experience: ["Ship AI features end to end, from prompt to metering", "Own payments, POS and logistics services in production", "Lead agent-assisted engineering: 37 skills, 18 subagents"],
  },
  {
    id: "lello",
    period: "2025 — 2026",
    org: "Lello Condomínios",
    title: "Software Engineer · Backend",
    stack: ["Java", "Spring Boot", "Go", "Kafka", "SQL"],
    specs: [{"value": "millions of tx/month", "text": "Built billing and payment services in Java, Go and Kafka for Brazil's largest condominium manager, processing millions of transactions per month."}, {"value": "no double charge", "text": "Made every consumer idempotent by business key, with bounded retries, dead-letter topics and replay after a fix, so a redelivered event never charges twice."}, {"value": "zero downtime", "text": "Led the strangler migration of the legacy monolith, extracting financial flows one at a time behind a routing facade, with zero downtime."}, {"value": "boleto · PIX", "text": "Built boleto and PIX reconciliation against the payment gateways, matching settlement files and webhooks to open charges and flagging every divergence."}],
    projects: ["billing and payments on Java, Go and Kafka → consumers idempotent by business key, bounded retries with backoff, dead-letter topics, replay after a fix", "boleto and PIX reconciliation → settlement files and webhook events matched to open charges; divergences flagged, never silently fixed", "strangler migration → financial flows extracted one at a time behind a routing facade; old path kept as fallback until each slice proved itself", "CRM ↔ gateway integration → webhooks and events with transactional consistency (state and event written together); index tuning on hot paths"],
    experience: ["Keep billing correct: no double charge, no lost payment", "Query and index tuning on hot paths"],
  },
  {
    id: "hypixel",
    period: "2020 — 2024",
    org: "Hypixel Studios",
    title: "Software Engineer · Distributed Systems & Security",
    stack: ["Java", "Netty", "BungeeCord", "JVM", "Pub/Sub"],
    specs: [{"value": "40k+ players · p99 < 50 ms", "text": "Ran a BungeeCord proxy network and Netty game servers for 40k+ concurrent players (100k+ daily peaks) with session routing and load-based lobby balancing, at p99 under 50 ms."}, {"value": "millions of events/day", "text": "Built a real-time anti-cheat and anti-fraud pipeline that scores movement, combat and economy against per-player baselines over millions of daily events."}, {"value": "POC → release", "text": "Took EggWars and BedWars from proof of concept to release, and built Hytale's server-side modding engine in Java with a plugin API and ECS systems."}],
    projects: ["proxy network → BungeeCord session routing, load-based lobby balancing, minigame instance lifecycle, Netty backpressure", "cross-server state → pub/sub with binary serialization, player state shared across instances; GC tuning, heap and thread dumps", "anti-cheat → real-time pipeline scoring movement, combat and economy against per-player baselines", "EggWars, BedWars from POC to release; Hytale server modding engine → plugin API, ECS systems, data-driven assets"],
    experience: ["JVM profiling: GC tuning, heap and thread dumps", "RBAC and distributed debugging tooling"],
  },
  {
    id: "craftlandia",
    period: "2016 — 2020",
    org: "CraftLandia",
    title: "Software Developer · Systems & Platform",
    stack: ["Java", "Netty", "MySQL", "Redis", "MongoDB"],
    specs: [{"value": "13k+ concurrent users", "text": "Kept a Java backend for 13k+ concurrent users stable by moving database I/O off the main thread and tuning MySQL indexes, so the tick loop held under load."}, {"value": "protocol level", "text": "Built a proprietary anti-cheat that intercepts packets in the Netty pipeline and validates speed, fly and reach on the server, blocking duplication and crash exploits."}],
    projects: ["anti-cheat → packets intercepted in the Netty pipeline; server-side speed, fly and reach checks; duplication and crash exploits detected", "backend → DB I/O moved off the main thread to async workers; MySQL indexes for real-time rankings and audit logs"],
    experience: ["Leak and crash analysis from heap and thread dumps", "Automated deploy and backup pipeline"],
  },
  {
    id: "splora",
    period: "2016 — 2017",
    org: "Splora Tecnologia",
    title: "Junior Software Developer · Apprentice Program",
    stack: ["JavaScript", "Apache Cordova", "SQL", "HTML", "CSS"],
    specs: [{"value": "first role", "text": "Joined through the apprentice program and shipped CRUD features in Apache Cordova, JavaScript web UIs and SQL reports for an internal customer system."}],
    projects: ["internal customer system → CRUD in Apache Cordova, web UIs in JavaScript, SQL reports"],
    experience: ["Web UIs, SQL reports, docs and tests"],
  },
];

const es: Role[] = [
  {
    id: "versatile",
    period: "2026 — hoy",
    org: "versatile.sh",
    title: "Proyecto propio · Arquitectura, engines, investigación",
    stack: ["Go", "TypeScript", "Rust", "PostgreSQL", "gRPC", "MCP", "JSON Schema", "k3s", "OpenTelemetry", "Semgrep"],
    specs: [{"value": "17,000–18,600 events/s", "text": "Construí el motor de workflows durable (nagare) con un outbox transaccional relayado por 4 fuentes con sharding en lotes de 500, sosteniendo 17–18,6k eventos/s en Postgres 16 con efectos exactly-once."}, {"value": "p99 1.80 ms", "text": "Diseñé el journal detrás de cada paso durable, grabando sobre gRPC con +0,14 ms p50 sobre un insert directo, de modo que un paso cuesta p50 1,13 ms y p99 1,80 ms."}, {"value": "−37% CPU · −50% memoria", "text": "Construí un motor de pruebas (hakoniwa) sobre el motor de workflows con mundos controlados (reloj congelado, Postgres bifurcado, fallas inyectadas), reduciendo 37% de CPU y 50% del pico de memoria frente a Playwright puro con veredictos idénticos."}, {"value": "0 falsos en 200", "text": "Convertí el tiempo en entrada de prueba: saltos de reloj de +1 h a +30 d corren en unos 155 ms, con 0 resultados falsos en 200 saltos."}],
    projects: ["nagare: intérprete determinista sobre un journal → inbox/outbox en una transacción, escrituras idempotentes, efectos exactly-once, sagas", "hakoniwa: pruebas sobre nagare en mundos controlados → reloj congelado, Postgres bifurcado, fallas inyectadas", "heya: escritorios Linux persistentes para agentes → volúmenes home, backups, accesos firmados, gateway in-guest de stream e input; k3s", "connector-engine: un endpoint MCP sobre MCP/REST/gRPC → permisos por función, aprobación en el uso, definiciones fijadas por sha256", "tsugite: adaptadores fuera de proceso sobre gRPC → contratos versionados, suite de conformidad, intercambio por configuración"],
    experience: ["Decisiones con 60+ ADRs y 25 estudios, cada uno con alternativas, costos y un gate medido", "Arquitecto único: specs, ADRs, investigación y código", "Agentes de IA en paralelo con briefs, gates y evidencia antes de dar por terminado", "Un harness compartido: 46 skills, 18 agentes por rol, 20 lints"],
  },
  {
    id: "meucontrole",
    period: "2026 — hoy",
    org: "MeuControle.AI",
    title: "Sr. Software Engineer · IA aplicada y Backend",
    stack: ["Go", "gRPC", "AWS", "EventBridge", "SQS", "DynamoDB", "PostgreSQL", "Redis", "OpenTelemetry", "k3s", "Claude"],
    specs: [{"value": "73% → 96% acierto de triaje", "text": "Reconstruí el triaje del asistente de WhatsApp sobre ruteo de intención tipado y lo medí en un holdout de 45 casos: acierto de camino 73,3% → 95,6% y de ruteo 84,4% → 97,8%, con p95 todavía cerca de 400 ms."}, {"value": "−62% costo por turno", "text": "Reestructuré los prompts del agente para cache: porción cacheada 53% → 88% y aciertos de cache en la primera llamada 0/16 → 14/16, reduciendo el costo por turno en 62% mientras los aprobados a ciegas subieron de 6/12 a 8/12."}, {"value": "91,5% → 97,3% de acierto", "text": "Di a las preguntas de soporte un router de lectura dedicado y lo validé en una batería de 188 ítems calificada a ciegas: 91,5% → 97,3% (IC 95% 93,9–98,9), 15 corregidos vs 4 rotos, McNemar exacto p = 0,019."}, {"value": "p95 6,1 s → 3,1 s", "text": "Rehice cómo el asistente del portal lee los datos de la tienda, reduciendo a la mitad la latencia de preguntas de datos (p95 6,14 s → 3,14 s, p50 3,33 s → 2,49 s) con 64/65 de acierto y 79% de tokens cacheados."}, {"value": "−35% errores de deploy", "text": "Construí un harness de evals con baterías versionadas, un juez LLM calibrado y un candidato desplegado en cada push, conectado al CI, reduciendo los errores de deploy en 35%."}, {"value": "+50% reuso · +20% entrega", "text": "Introduje ingeniería asistida por agentes con una biblioteca interna de 37 skills y 18 subagentes por rol corriendo en worktrees paralelos, subiendo el reuso de código en 50% y la velocidad de entrega en 20%."}],
    projects: ["orquestador de IA en Go (gRPC, hexagonal) → router de intención con admisión protegida, slots multi-turno, 30+ adaptadores como tools, STT/TTS", "gateway LLM → adaptadores Anthropic/Bedrock/OpenAI, ruteo por propósito, fallback, prompt caching, costo por intento en contrato protobuf", "harness de evals → baterías con semilla, juez LLM calibrado, checks de regex/números, flags A/B, candidatos como jobs de Kubernetes", "plataforma → outbox transaccional a EventBridge/SQS, claves de idempotencia, DLQ y eventos poison, journal de sagas, OTLP traces/metrics/logs"],
    experience: ["Entrego features de IA de punta a punta, del prompt a la medición", "Responsable de servicios de pagos, POS y logística en producción", "Lidero ingeniería asistida por agentes: 37 skills, 18 subagentes"],
  },
  {
    id: "lello",
    period: "2025 — 2026",
    org: "Lello Condomínios",
    title: "Software Engineer · Backend",
    stack: ["Java", "Spring Boot", "Go", "Kafka", "SQL"],
    specs: [{"value": "millones de tx/mes", "text": "Construí servicios de cobro y pagos en Java, Go y Kafka para la mayor administradora de condominios de Brasil, procesando millones de transacciones por mes."}, {"value": "sin cobro doble", "text": "Hice cada consumidor idempotente por clave de negocio, con reintentos acotados, dead-letter topics y replay tras el fix, para que un evento reentregado nunca cobre dos veces."}, {"value": "cero downtime", "text": "Lideré la migración strangler del monolito legado, extrayendo flujos financieros uno a uno detrás de una fachada de ruteo, con cero downtime."}, {"value": "boleto · PIX", "text": "Construí la conciliación de boleto y PIX contra los gateways de pago, cruzando archivos de liquidación y webhooks con cobros abiertos y marcando cada divergencia."}],
    projects: ["cobro y pagos en Java, Go y Kafka → consumidores idempotentes por clave de negocio, reintentos acotados con backoff, dead-letter topics, replay tras el fix", "conciliación de boleto y PIX → archivos de liquidación y webhooks cruzados con cobros abiertos; divergencias marcadas, nunca corregidas en silencio", "migración strangler → flujos financieros extraídos uno a uno detrás de una fachada de ruteo; camino viejo como fallback hasta probar cada parte", "integración CRM ↔ gateway → webhooks y eventos con consistencia transaccional (estado y evento juntos); tuning de índices en rutas calientes"],
    experience: ["Mantener la facturación correcta: sin doble cobro ni pago perdido", "Ajuste de queries e índices en rutas críticas"],
  },
  {
    id: "hypixel",
    period: "2020 — 2024",
    org: "Hypixel Studios",
    title: "Software Engineer · Sistemas distribuidos y seguridad",
    stack: ["Java", "Netty", "BungeeCord", "JVM", "Pub/Sub"],
    specs: [{"value": "40k+ jugadores · p99 < 50 ms", "text": "Operé una red de proxies BungeeCord y servidores de juego Netty para 40k+ jugadores concurrentes (picos de 100k+) con ruteo de sesiones y balanceo de lobbies por carga, con p99 bajo 50 ms."}, {"value": "millones de eventos/día", "text": "Construí un pipeline anti-cheat y anti-fraude en tiempo real que puntúa movimiento, combate y economía contra baselines por jugador sobre millones de eventos diarios."}, {"value": "POC → release", "text": "Llevé EggWars y BedWars del POC al lanzamiento, y construí el motor de modding server-side de Hytale en Java con API de plugins y sistemas ECS."}],
    projects: ["red de proxies → ruteo de sesiones en BungeeCord, balanceo de lobbies por carga, ciclo de vida de instancias, backpressure en Netty", "estado entre servidores → pub/sub con serialización binaria, estado del jugador compartido entre instancias; tuning de GC, heap y thread dumps", "anti-cheat → pipeline en tiempo real que puntúa movimiento, combate y economía contra baselines por jugador", "EggWars, BedWars del POC al lanzamiento; motor de modding de Hytale → API de plugins, sistemas ECS, assets data-driven"],
    experience: ["Profiling de JVM: ajuste de GC, heap y thread dumps", "RBAC y herramientas de depuración distribuida"],
  },
  {
    id: "craftlandia",
    period: "2016 — 2020",
    org: "CraftLandia",
    title: "Software Developer · Sistemas y plataforma",
    stack: ["Java", "Netty", "MySQL", "Redis", "MongoDB"],
    specs: [{"value": "13k+ usuarios concurrentes", "text": "Mantuve estable un backend Java para 13k+ usuarios concurrentes moviendo el I/O de base de datos fuera del hilo principal y afinando índices MySQL, para que el tick loop aguantara la carga."}, {"value": "a nivel de protocolo", "text": "Construí un anti-cheat propietario que intercepta paquetes en el pipeline de Netty y valida speed, fly y reach en el servidor, bloqueando exploits de duplicación y crash."}],
    projects: ["anti-cheat → paquetes interceptados en el pipeline de Netty; checks de speed, fly y reach en el servidor; exploits de duplicación y crash detectados", "backend → I/O de base de datos fuera del hilo principal en workers asíncronos; índices MySQL para rankings en tiempo real y auditoría"],
    experience: ["Análisis de leaks y crashes a partir de heap y thread dumps", "Pipeline automatizado de deploy y backup"],
  },
  {
    id: "splora",
    period: "2016 — 2017",
    org: "Splora Tecnologia",
    title: "Desarrollador de Software Junior · Programa de aprendices",
    stack: ["JavaScript", "Apache Cordova", "SQL", "HTML", "CSS"],
    specs: [{"value": "primer puesto", "text": "Entré por el programa de aprendiz y entregué funciones CRUD en Apache Cordova, UIs web en JavaScript y reportes SQL para un sistema interno de clientes."}],
    projects: ["sistema interno de clientes → CRUD en Apache Cordova, UIs web en JavaScript, reportes SQL"],
    experience: ["UIs web, reportes SQL, docs y tests"],
  },
];

const ptBr: Role[] = [
  {
    id: "versatile",
    period: "2026 — hoje",
    org: "versatile.sh",
    title: "Projeto próprio · Arquitetura, engines, pesquisa",
    stack: ["Go", "TypeScript", "Rust", "PostgreSQL", "gRPC", "MCP", "JSON Schema", "k3s", "OpenTelemetry", "Semgrep"],
    specs: [{"value": "17,000–18,600 events/s", "text": "Construí o motor de workflows durável (nagare) com um outbox transacional relayado por 4 fontes com sharding em lotes de 500, sustentando 17–18,6k eventos/s no Postgres 16 com efeitos exactly-once."}, {"value": "p99 1.80 ms", "text": "Desenhei o journal por trás de cada passo durável, gravando sobre gRPC com +0,14 ms p50 sobre um insert direto, de modo que um passo custa p50 1,13 ms e p99 1,80 ms."}, {"value": "−37% CPU · −50% memória", "text": "Construí um motor de testes (hakoniwa) sobre o motor de workflows com mundos controlados (relógio congelado, Postgres bifurcado, falhas injetadas), reduzindo 37% de CPU e 50% do pico de memória contra Playwright puro com veredictos idênticos."}, {"value": "0 falsos em 200", "text": "Transformei o tempo em entrada de teste: saltos de relógio de +1 h a +30 d rodam em cerca de 155 ms, com 0 resultados falsos em 200 saltos."}],
    projects: ["nagare: interpretador determinístico sobre um journal → inbox/outbox numa transação, escritas idempotentes, efeitos exactly-once, sagas", "hakoniwa: testes sobre o nagare em mundos controlados → relógio congelado, Postgres bifurcado, falhas injetadas", "heya: desktops Linux persistentes para agentes → volumes home, backups, acessos assinados, gateway in-guest de stream e input; k3s", "connector-engine: um endpoint MCP sobre MCP/REST/gRPC → permissões por função, aprovação no uso, definições fixadas por sha256", "tsugite: adapters fora de processo sobre gRPC → contratos versionados, suíte de conformidade, troca por configuração"],
    experience: ["Decisões com 60+ ADRs e 25 estudos, cada um com alternativas, custos e um gate medido", "Arquiteto único: specs, ADRs, pesquisa e código", "Agentes de IA em paralelo com briefs, gates e evidência antes de dar por pronto", "Um harness compartilhado: 46 skills, 18 agentes por papel, 20 lints"],
  },
  {
    id: "meucontrole",
    period: "2026 — hoje",
    org: "MeuControle.AI",
    title: "Sr. Software Engineer · IA aplicada e Backend",
    stack: ["Go", "gRPC", "AWS", "EventBridge", "SQS", "DynamoDB", "PostgreSQL", "Redis", "OpenTelemetry", "k3s", "Claude"],
    specs: [{"value": "73% → 96% acerto de triagem", "text": "Reconstruí a triagem do assistente de WhatsApp sobre roteamento de intenção tipado e medi num holdout de 45 casos: acerto de caminho 73,3% → 95,6% e de roteamento 84,4% → 97,8%, com p95 ainda perto de 400 ms."}, {"value": "−62% custo por turno", "text": "Reestruturei os prompts do agente para cache: parcela cacheada 53% → 88% e acertos de cache na primeira chamada 0/16 → 14/16, reduzindo o custo por turno em 62% enquanto as aprovações às cegas subiram de 6/12 para 8/12."}, {"value": "91,5% → 97,3% de acerto", "text": "Dei às perguntas de suporte um router de leitura dedicado e validei numa bateria de 188 itens avaliada às cegas: 91,5% → 97,3% (IC 95% 93,9–98,9), 15 corrigidos vs 4 quebrados, McNemar exato p = 0,019."}, {"value": "p95 6,1 s → 3,1 s", "text": "Refiz como o assistente do portal lê os dados da loja, cortando pela metade a latência das perguntas de dados (p95 6,14 s → 3,14 s, p50 3,33 s → 2,49 s) com 64/65 de acerto e 79% de tokens cacheados."}, {"value": "−35% erros de deploy", "text": "Construí um harness de evals com baterias versionadas, um juiz LLM calibrado e um candidato deployado a cada push, ligado ao CI, reduzindo os erros de deploy em 35%."}, {"value": "+50% reuso · +20% entrega", "text": "Introduzi engenharia assistida por agentes com uma biblioteca interna de 37 skills e 18 subagentes por papel rodando em worktrees paralelas, aumentando o reuso de código em 50% e a velocidade de entrega em 20%."}],
    projects: ["orquestrador de IA em Go (gRPC, hexagonal) → router de intenção com admissão protegida, slots multi-turno, 30+ adapters como tools, STT/TTS", "gateway LLM → adapters Anthropic/Bedrock/OpenAI, roteamento por propósito, fallback, prompt caching, custo por tentativa em contrato protobuf", "harness de evals → baterias com seed, juiz LLM calibrado, checks de regex/números, flags A/B, candidatos como jobs Kubernetes", "plataforma → outbox transacional para EventBridge/SQS, chaves de idempotência, DLQ e eventos poison, journal de sagas, OTLP traces/metrics/logs"],
    experience: ["Entrego features de IA de ponta a ponta, do prompt à medição", "Responsável por serviços de pagamentos, POS e logística em produção", "Lidero engenharia assistida por agentes: 37 skills, 18 subagentes"],
  },
  {
    id: "lello",
    period: "2025 — 2026",
    org: "Lello Condomínios",
    title: "Software Engineer · Backend",
    stack: ["Java", "Spring Boot", "Go", "Kafka", "SQL"],
    specs: [{"value": "milhões de tx/mês", "text": "Construí serviços de cobrança e pagamentos em Java, Go e Kafka para a maior administradora de condomínios do Brasil, processando milhões de transações por mês."}, {"value": "sem cobrança dupla", "text": "Tornei cada consumer idempotente por chave de negócio, com retries limitados, dead-letter topics e replay depois do fix, para um evento reentregue nunca cobrar duas vezes."}, {"value": "zero downtime", "text": "Liderei a migração strangler do monólito legado, extraindo fluxos financeiros um a um atrás de uma fachada de roteamento, com zero downtime."}, {"value": "boleto · PIX", "text": "Construí a conciliação de boleto e PIX contra os gateways de pagamento, cruzando arquivos de liquidação e webhooks com cobranças abertas e sinalizando cada divergência."}],
    projects: ["cobrança e pagamentos em Java, Go e Kafka → consumers idempotentes por chave de negócio, retries limitados com backoff, dead-letter topics, replay depois do fix", "conciliação de boleto e PIX → arquivos de liquidação e webhooks cruzados com cobranças abertas; divergências sinalizadas, nunca corrigidas em silêncio", "migração strangler → fluxos financeiros extraídos um a um atrás de uma fachada de roteamento; caminho antigo como fallback até cada parte se provar", "integração CRM ↔ gateway → webhooks e eventos com consistência transacional (estado e evento juntos); tuning de índices nos hot paths"],
    experience: ["Manter a cobrança correta: sem cobrança dupla nem pagamento perdido", "Ajuste de queries e índices em caminhos críticos"],
  },
  {
    id: "hypixel",
    period: "2020 — 2024",
    org: "Hypixel Studios",
    title: "Software Engineer · Sistemas distribuídos e segurança",
    stack: ["Java", "Netty", "BungeeCord", "JVM", "Pub/Sub"],
    specs: [{"value": "40k+ jogadores · p99 < 50 ms", "text": "Operei uma rede de proxies BungeeCord e game servers Netty para 40k+ jogadores simultâneos (picos de 100k+) com roteamento de sessões e balanceamento de lobbies por carga, com p99 abaixo de 50 ms."}, {"value": "milhões de eventos/dia", "text": "Construí um pipeline anti-cheat e anti-fraude em tempo real que pontua movimento, combate e economia contra baselines por jogador sobre milhões de eventos diários."}, {"value": "POC → release", "text": "Levei EggWars e BedWars do POC ao lançamento, e construí a engine de modding server-side do Hytale em Java com API de plugins e sistemas ECS."}],
    projects: ["rede de proxies → roteamento de sessões no BungeeCord, balanceamento de lobbies por carga, ciclo de vida de instâncias, backpressure no Netty", "estado entre servidores → pub/sub com serialização binária, estado do jogador compartilhado entre instâncias; tuning de GC, heap e thread dumps", "anti-cheat → pipeline em tempo real que pontua movimento, combate e economia contra baselines por jogador", "EggWars, BedWars do POC ao lançamento; engine de modding do Hytale → API de plugins, sistemas ECS, assets data-driven"],
    experience: ["Profiling de JVM: ajuste de GC, heap e thread dumps", "RBAC e ferramentas de debug distribuído"],
  },
  {
    id: "craftlandia",
    period: "2016 — 2020",
    org: "CraftLandia",
    title: "Software Developer · Sistemas e plataforma",
    stack: ["Java", "Netty", "MySQL", "Redis", "MongoDB"],
    specs: [{"value": "13k+ usuários simultâneos", "text": "Mantive estável um backend Java para 13k+ usuários simultâneos tirando o I/O de banco da thread principal e ajustando índices MySQL, para o tick loop aguentar a carga."}, {"value": "no nível do protocolo", "text": "Construí um anti-cheat proprietário que intercepta pacotes no pipeline do Netty e valida speed, fly e reach no servidor, bloqueando exploits de duplicação e crash."}],
    projects: ["anti-cheat → pacotes interceptados no pipeline do Netty; checks de speed, fly e reach no servidor; exploits de duplicação e crash detectados", "backend → I/O de banco fora da thread principal em workers assíncronos; índices MySQL para rankings em tempo real e auditoria"],
    experience: ["Análise de leaks e crashes a partir de heap e thread dumps", "Pipeline automatizado de deploy e backup"],
  },
  {
    id: "splora",
    period: "2016 — 2017",
    org: "Splora Tecnologia",
    title: "Desenvolvedor de Software Júnior · Programa de aprendizes",
    stack: ["JavaScript", "Apache Cordova", "SQL", "HTML", "CSS"],
    specs: [{"value": "primeiro emprego", "text": "Entrei pelo programa Jovem Aprendiz e entreguei funcionalidades CRUD em Apache Cordova, UIs web em JavaScript e relatórios SQL para um sistema interno de clientes."}],
    projects: ["sistema interno de clientes → CRUD em Apache Cordova, UIs web em JavaScript, relatórios SQL"],
    experience: ["UIs web, relatórios SQL, docs e testes"],
  },
];

export const EXPERIENCE: Record<Lang, Role[]> = { en, es, "pt-br": ptBr };
