import type { Post } from "./types";

const post: Post = {
  slug: "hakoniwa-2026-11-13-plugins-and-executors",
  category: "daily",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "hakoniwa, 2026-11-13: plugins and executors",
  summary: "A dev log of one day in the test engine's history: adopting the shared plugin kit, routing leases by runner, an executor port, evidence archiving by events, and a reference executor run on real k6.",
  tags: ["hakoniwa", "plugins", "devlog", "k6"],
  project: "versatile-sh",
  sections: [
    {
      id: "day",
      title: "The day in one paragraph",
      blocks: [
        { kind: "p", text: "After the 9th, hakoniwa's history is quiet: 3 non-merge commits on the 10th, none on the 11th or 12th, then 38 non-merge commits on the 13th. Nearly all of them are one theme. The engine stops being the only thing that can run a test and learns to hand an attempt to someone else." },
      ],
    },
    {
      id: "sequence",
      title: "Sequence",
      blocks: [
        { kind: "steps", items: [
          { title: "Adopt the plugin kit", text: "The first commit of the day adopts the shared plugin kit: plugin ports, conformance suites, an adapters file, discovery and a conform CLI. A second wave added env helpers, built-in config keys and an embedded marking for ports. The kit was bumped three times during the day as its own fixes landed." },
          { title: "Event catalog and webhooks", text: "The engine serves its event catalog and delivers its outbox through a Standard Webhooks sink. Inbound moved to the same shape in inbox v2: Standard Webhooks CloudEvents, accept lists, ordering keys, and attempt results under a grant." },
          { title: "Route by runner, record the trust", text: "Leases are routed by the runners a worker declares, and every run records a trust class. Later commits made starvation visible, bounded runner declarations and cancelled queued runs that no executor can run." },
          { title: "Ingest reported results", text: "A results report can become a finished run of trust reported. The evidence is bound to the principal that ingested it, and in production reported results sit behind a reviewed, acknowledged adapters file." },
          { title: "Control and live API", text: "A public run event log, retryRun, watchRun, watchControl and listExecutors, with regenerated SDKs." },
          { title: "Executor port and attempt protocol", text: "A plugin binding of the attempt protocol, judged per attempt by the holder's capability set and not the union of all holders. Then an event binding on its own route, with grants minted at delivery." },
          { title: "A reference executor on real k6", text: "A k6 executor and a k6 dialect, with an acceptance test over four bindings. The examples were then run on real k6, over gRPC, including the stop path." },
        ] },
      ],
    },
    {
      id: "details",
      title: "Two details worth keeping",
      blocks: [
        { kind: "p", text: "Capability sets per attempt. A commit titled Judge each attempt by the holder's capability set, not the union changed the rule: an attempt is checked against the executor that would run it, and not against everything all connected executors can do together. The union is wrong when no single executor has the whole set." },
        { kind: "p", text: "Stale requests. Several commits are about the same hazard: an attempt request that arrives after the attempt moved on. The fixes judge accept at arrival, mint no grant for a stale attempt, count and log such requests, and make a repeated accept idempotent. A missing version is never called stale." },
      ],
    },
    {
      id: "same-day",
      title: "The same day, next door",
      blocks: [
        { kind: "p", text: "The commit that adds the embedded store tier and the mapped command-shaped store ADR is a consequence of a latency study run that day. The study found that putting a database transaction behind a plugin session fails a latency gate. It is the subject of a separate post, A plugin hop that did not pay for itself." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "hakoniwa-2026-11-13-plugins-and-executors",
  category: "daily",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "hakoniwa, 2026-11-13: plugins y executors",
  summary: "Un devlog de un día en la historia del engine de tests: adopción del plugin kit compartido, enrutamiento de leases por runner, un executor port, archivado de evidencia por eventos y un executor de referencia ejecutado en k6 real.",
  tags: ["hakoniwa", "plugins", "devlog", "k6"],
  project: "versatile-sh",
  sections: [
    {
      id: "day",
      title: "El día en un párrafo",
      blocks: [
        { kind: "p", text: "Después del día 9, la historia de hakoniwa está tranquila: 3 commits sin merge el día 10, ninguno el 11 ni el 12, y luego 38 commits sin merge el 13. Casi todos son de un mismo tema. El engine deja de ser lo único que puede ejecutar un test y aprende a entregar un intento a otro." },
      ],
    },
    {
      id: "sequence",
      title: "Secuencia",
      blocks: [
        { kind: "steps", items: [
          { title: "Adoptar el plugin kit", text: "El primer commit del día adopta el plugin kit compartido: plugin ports, suites de conformance, un archivo de adapters, discovery y una CLI conform. Una segunda tanda añadió helpers de env, claves de config integradas y una marca de embedded para los ports. El kit se actualizó tres veces durante el día a medida que llegaban sus propias correcciones." },
          { title: "Catálogo de eventos y webhooks", text: "El engine sirve su catálogo de eventos y entrega su outbox mediante un sink Standard Webhooks. Lo entrante pasó a la misma forma en inbox v2: CloudEvents de Standard Webhooks, listas de aceptación, ordering keys y resultados de intento bajo un grant." },
          { title: "Enrutar por runner, registrar la confianza", text: "Los leases se enrutan por los runners que declara un worker, y cada ejecución registra una clase de confianza. Commits posteriores hicieron visible la inanición, acotaron las declaraciones de runner y cancelaron las ejecuciones en cola que ningún executor puede ejecutar." },
          { title: "Ingerir resultados reportados", text: "Un reporte de resultados puede convertirse en una ejecución terminada de confianza reported. La evidencia queda ligada al principal que la ingirió, y en producción los resultados reportados quedan detrás de un archivo de adapters revisado y reconocido." },
          { title: "Control y API en vivo", text: "Un log público de eventos de ejecución, retryRun, watchRun, watchControl y listExecutors, con SDKs regenerados." },
          { title: "Executor port y protocolo de intento", text: "Un binding de plugin del protocolo de intento, juzgado por intento según el conjunto de capacidades del titular y no la unión de todos los titulares. Luego un binding de eventos en su propia ruta, con grants emitidos en la entrega." },
          { title: "Un executor de referencia en k6 real", text: "Un executor k6 y un dialecto k6, con un test de aceptación sobre cuatro bindings. Los ejemplos se ejecutaron después en k6 real, sobre gRPC, incluido el camino de stop." },
        ] },
      ],
    },
    {
      id: "details",
      title: "Dos detalles que vale la pena conservar",
      blocks: [
        { kind: "p", text: "Conjuntos de capacidades por intento. Un commit titulado Judge each attempt by the holder's capability set, not the union cambió la regla: un intento se comprueba contra el executor que lo ejecutaría, y no contra todo lo que todos los executors conectados pueden hacer juntos. La unión es incorrecta cuando ningún executor individual tiene el conjunto completo." },
        { kind: "p", text: "Solicitudes obsoletas. Varios commits tratan del mismo riesgo: una solicitud de intento que llega después de que el intento siguió adelante. Las correcciones juzgan el accept en la llegada, no emiten grant para un intento obsoleto, cuentan y registran esas solicitudes, y hacen idempotente un accept repetido. Una versión ausente nunca se considera obsoleta." },
      ],
    },
    {
      id: "same-day",
      title: "El mismo día, en la puerta de al lado",
      blocks: [
        { kind: "p", text: "El commit que añade el tier de store embebido y el ADR mapeado del store con forma de comando es consecuencia de un estudio de latencia ejecutado ese día. El estudio encontró que poner una transacción de base de datos detrás de una sesión de plugin no pasa un gate de latencia. Es el tema de otro post, A plugin hop that did not pay for itself." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "hakoniwa-2026-11-13-plugins-and-executors",
  category: "daily",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "hakoniwa, 2026-11-13: plugins e executors",
  summary: "Um devlog de um dia na história do engine de testes: adoção do plugin kit compartilhado, roteamento de leases por runner, um executor port, arquivamento de evidência por eventos e um executor de referência rodando em k6 real.",
  tags: ["hakoniwa", "plugins", "devlog", "k6"],
  project: "versatile-sh",
  sections: [
    {
      id: "day",
      title: "O dia em um parágrafo",
      blocks: [
        { kind: "p", text: "Depois do dia 9, o histórico do hakoniwa fica quieto: 3 commits sem merge no dia 10, nenhum no 11 nem no 12, e depois 38 commits sem merge no dia 13. Quase todos de um mesmo tema. O engine deixa de ser a única coisa que pode rodar um teste e aprende a entregar uma tentativa para outro." },
      ],
    },
    {
      id: "sequence",
      title: "Sequência",
      blocks: [
        { kind: "steps", items: [
          { title: "Adotar o plugin kit", text: "O primeiro commit do dia adota o plugin kit compartilhado: plugin ports, suítes de conformance, um arquivo de adapters, discovery e uma CLI conform. Uma segunda leva adicionou helpers de env, chaves de config embutidas e uma marcação de embedded para os ports. O kit foi atualizado três vezes durante o dia conforme suas próprias correções entravam." },
          { title: "Catálogo de eventos e webhooks", text: "O engine serve seu catálogo de eventos e entrega seu outbox por um sink Standard Webhooks. O que entra passou para o mesmo formato no inbox v2: CloudEvents do Standard Webhooks, listas de aceitação, ordering keys e resultados de tentativa sob um grant." },
          { title: "Rotear por runner, registrar a confiança", text: "Os leases são roteados pelos runners que um worker declara, e cada execução registra uma classe de confiança. Commits posteriores tornaram a starvation visível, limitaram as declarações de runner e cancelaram execuções na fila que nenhum executor consegue rodar." },
          { title: "Ingerir resultados reportados", text: "Um relatório de resultados pode virar uma execução finalizada de confiança reported. A evidência fica atrelada ao principal que a ingeriu, e em produção os resultados reportados ficam atrás de um arquivo de adapters revisado e reconhecido." },
          { title: "Controle e API ao vivo", text: "Um log público de eventos de execução, retryRun, watchRun, watchControl e listExecutors, com SDKs regenerados." },
          { title: "Executor port e protocolo de tentativa", text: "Um binding de plugin do protocolo de tentativa, julgado por tentativa pelo conjunto de capacidades do titular e não pela união de todos os titulares. Depois um binding de eventos em rota própria, com grants emitidos na entrega." },
          { title: "Um executor de referência em k6 real", text: "Um executor k6 e um dialeto k6, com um teste de aceitação sobre quatro bindings. Os exemplos foram então rodados em k6 real, sobre gRPC, incluindo o caminho de stop." },
        ] },
      ],
    },
    {
      id: "details",
      title: "Dois detalhes que valem guardar",
      blocks: [
        { kind: "p", text: "Conjuntos de capacidades por tentativa. Um commit intitulado Judge each attempt by the holder's capability set, not the union mudou a regra: uma tentativa é verificada contra o executor que a rodaria, e não contra tudo que todos os executors conectados conseguem fazer juntos. A união está errada quando nenhum executor sozinho tem o conjunto inteiro." },
        { kind: "p", text: "Requisições obsoletas. Vários commits tratam do mesmo risco: uma requisição de tentativa que chega depois que a tentativa já avançou. As correções julgam o accept na chegada, não emitem grant para uma tentativa obsoleta, contam e registram essas requisições, e tornam idempotente um accept repetido. Uma versão ausente nunca é considerada obsoleta." },
      ],
    },
    {
      id: "same-day",
      title: "No mesmo dia, ao lado",
      blocks: [
        { kind: "p", text: "O commit que adiciona o tier de store embutido e o ADR mapeado do store em formato de comando é consequência de um estudo de latência rodado naquele dia. O estudo descobriu que colocar uma transação de banco de dados atrás de uma sessão de plugin reprova em um gate de latência. É o assunto de outro post, A plugin hop that did not pay for itself." },
      ],
    },
  ],
};
