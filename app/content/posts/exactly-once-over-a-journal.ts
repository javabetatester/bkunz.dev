import type { Post } from "./types";

const post: Post = {
  slug: "exactly-once-over-a-journal",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "What exactly-once over a journal costs",
  summary: "Measured numbers for putting a durable workflow engine's memory behind a transactional journal and outbox: per-step latency, relay throughput, and where the same hop did not pay off.",
  tags: ["workflow", "postgres", "outbox", "latency"],
  project: "versatile-sh",
  sections: [
    {
      id: "claim",
      title: "What the claim means",
      blocks: [
        { kind: "p", text: "Nobody gets exactly-once delivery over a network. What a durable workflow engine can give is exactly-once effects: a step may run twice, but its recorded result is written once and read back on replay. nagare, the durable workflow engine I work on, is built on that split." },
        { kind: "p", text: "The engine keeps its interpreter in the host and treats the durable part as a journal: an append-only sequence of entries per run. Steps are at-least-once by decision (ADR-0002). A step that ran but was not recorded runs again after its lease expires. The journal makes everything after the record exactly-once." },
        { kind: "p", text: "This post is about what that costs in milliseconds. All figures come from the engine's performance notes, one ADR and a latency study. Each carries its conditions, and none is a promise for other hardware." },
      ],
    },
    {
      id: "mechanism",
      title: "The mechanism",
      blocks: [
        {
          kind: "list",
          items: [
            "Every durable call (step, now, id, sleep, wait, recv, start-child) takes the next sequence number. Replay returns the recorded entry and fails the run as non-deterministic when the kind or key differ.",
            "A run is leased with a fence. Claim increments the fence and attempt count, and every write carries (run_id, fence). A write with a stale fence changes nothing, so a zombie executor cannot overwrite the live one.",
            "Receive consumes a mailbox message into the recv entry atomically. The message is never lost or read twice across a crash, and a dedup id stays delivered for the life of the run.",
            "Events leave through a transactional outbox. A state change and its event row commit in one transaction, and a relay publishes later.",
          ],
        },
        { kind: "p", text: "The outbox side is plain Postgres. An AFTER INSERT statement trigger calls pg_notify, one LISTEN connection wakes the workers, and polling every 2 s stays as the fallback. Workers shard by hash(tenant/kind/stream/epoch) modulo N, so one stream is never served by two workers of a process. Replicas split work with FOR UPDATE SKIP LOCKED. Delivered events are settled with one UPDATE ... FROM unnest(...) instead of one statement each." },
      ],
    },
    {
      id: "per-step",
      title: "Per-step cost",
      blocks: [
        { kind: "p", text: "The first question was whether a journal behind a gRPC hop would add latency over an in-process durable library. The study measured a 3000-step workflow of no-op steps returning a 1 KB result, 5 runs, 1000 warm-up steps, Postgres 16 on tmpfs, one machine." },
        {
          kind: "table",
          head: ["Variant", "serial p50", "serial p99", "steps/s, 16 callers"],
          rows: [
            ["DBOS in-process", "752 us", "1776 us", "5810"],
            ["Direct insert, no hop", "156 us", "309 us", "29913"],
            ["Remote Record, unix socket", "295 us", "615 us", "18653"],
            ["Remote Record, tcp", "291 us", "509 us", "15772"],
          ],
        },
        { kind: "p", text: "The hop cost +0.14 ms at p50 and +0.2 to 0.3 ms at p99 over a direct insert. The remote journal was faster per step than DBOS in process, which does more work per step: its own system tables, a check, then a write. The study's reading is that DBOS does more per step, not that the hop is free." },
        { kind: "p", text: "The ADR then re-measured with the real journal: 2000 sequential 1 KB steps, compose Postgres, gRPC over loopback, 3 runs. Remote p50 was 1.13 to 1.17 ms and p99 1.71 to 1.80 ms. DBOS was p50 1.11 to 1.19 ms and p99 1.68 to 2.27 ms. At that point the two are indistinguishable. A real step is a call-out that takes several milliseconds, so 0.3 ms is under 10% of it." },
        { kind: "callout", tone: "warn", text: "The study did not measure Claim, Heartbeat, Load, Wake or Signal, and its prototype table had no fencing check. A real Record is somewhat slower than the prototype row. The run load average was 12 to 21 on 16 cores, so p99 is noisy." },
      ],
    },
    {
      id: "throughput",
      title: "Throughput and the outbox",
      blocks: [
        { kind: "p", text: "Two benchmarks in the engine repository cover the Postgres store. Both ran on 2026-11-07 on an AMD Ryzen 7 5700X with Postgres 16 in Docker on the same host, default settings." },
        {
          kind: "table",
          head: ["Benchmark", "Conditions", "Result"],
          rows: [
            ["Transitions", "8 clients, Create plus four Append calls per run, outbox inserts included", "676 to 784 transitions/s"],
            ["Outbox relay", "4 sharded sources, 30000 preloaded events, batches of 500, no-op sink", "17000 to 18600 events/s"],
          ],
        },
        { kind: "p", text: "So the relay drains roughly 25 times faster than the store produces on this box. That ratio matters more than either number: the outbox is not the bottleneck, the transactional write path is." },
        { kind: "p", text: "A third measurement guards a different cost. Runs at interpreter level 1 peek at an already delivered inbox message before each call or subflow. The gate was at most 2 ms p99 added per call and at most 15% throughput loss. Across 30 workflows of 10 sequential stub calls, the in-memory engine added 0.04 ms per call at p99 (3.4% throughput loss), and the remote journal showed no loss. Before the non-blocking read, the same run cost Temporal 9.9 ms per call." },
      ],
    },
    {
      id: "negative",
      title: "Where the hop did not pay",
      blocks: [
        { kind: "p", text: "The same study tried the same idea on a different workload: putting a transactional store behind a streaming session, one round trip per store call. That one failed its gate, and I think it is the more useful half of the result." },
        { kind: "list", items: [
          "An 8-call create session added 928 us at p50 on a unix socket and 1327 us over tcp, with p99 added of +2140 us and +2489 us. The gate was 2 ms.",
          "Mixed throughput with 16 callers dropped 20.6% to 32.5% against in-process, against a limit of 15%.",
          "A second, test-orchestration workload with 7-call sessions lost 42 to 47% of throughput on tmpfs.",
        ] },
        { kind: "p", text: "The cause is structural. A transaction and its pool connection stay open across every round trip, so a 16-connection pool saturates sooner and locks are held longer. A journal does not have that shape: each Record is one statement and one unary call, with no transaction held open across calls. My conclusion is a hypothesis, not a proof: the hop is cheap when each call is independent, and expensive when calls share a transaction." },
      ],
    },
    {
      id: "limits",
      title: "Limits of these numbers",
      blocks: [
        { kind: "list", items: [
          "One machine, loopback or unix sockets. Cross-node latency was not measured.",
          "tmpfs makes commits cheap. Disk-backed Postgres was fsync-bound in the one disk run I have and was inconclusive.",
          "The outbox and transition benchmarks are single runs on one date. The ranges are what the repository reports.",
          "Lease fencing under contention, crash recovery time and long waits are covered by tests, not by these latency numbers.",
        ] },
        { kind: "p", text: "What I would take from it: exactly-once effects are cheap when the journal is a thin unary interface over single statements, and the cost shows up when you stretch a transaction across a network." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "exactly-once-over-a-journal",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Lo que cuesta el exactly-once sobre un journal",
  summary: "Números medidos de poner la memoria de un engine de workflows durable detrás de un journal transaccional y un outbox: latencia por paso, throughput del relay y dónde el mismo salto no se pagó.",
  tags: ["workflow", "postgres", "outbox", "latency"],
  project: "versatile-sh",
  sections: [
    {
      id: "claim",
      title: "Qué significa la afirmación",
      blocks: [
        { kind: "p", text: "Nadie obtiene entrega exactly-once sobre una red. Lo que un engine de workflows durable puede dar son efectos exactly-once: un paso puede ejecutarse dos veces, pero su resultado registrado se escribe una vez y se lee de vuelta en el replay. nagare, el engine de workflows durable en el que trabajo, está construido sobre esa división." },
        { kind: "p", text: "El engine mantiene su intérprete en el host y trata la parte durable como un journal: una secuencia append-only de entradas por ejecución. Los pasos son at-least-once por decisión (ADR-0002). Un paso que se ejecutó pero no se registró vuelve a ejecutarse cuando expira su lease. El journal hace exactly-once todo lo que viene después del registro." },
        { kind: "p", text: "Este post trata de lo que eso cuesta en milisegundos. Todas las cifras salen de las notas de rendimiento del engine, un ADR y un estudio de latencia. Cada una lleva sus condiciones, y ninguna es una promesa para otro hardware." },
      ],
    },
    {
      id: "mechanism",
      title: "El mecanismo",
      blocks: [
        {
          kind: "list",
          items: [
            "Cada llamada durable (step, now, id, sleep, wait, recv, start-child) toma el siguiente número de secuencia. El replay devuelve la entrada registrada y hace fallar la ejecución como no determinista cuando el kind o la key difieren.",
            "Una ejecución se arrienda con un fence. Claim incrementa el fence y el conteo de intentos, y cada escritura lleva (run_id, fence). Una escritura con un fence obsoleto no cambia nada, así que un executor zombi no puede sobrescribir al vivo.",
            "Receive consume un mensaje del mailbox hacia la entrada recv de forma atómica. El mensaje nunca se pierde ni se lee dos veces tras un crash, y un id de dedup queda entregado durante toda la vida de la ejecución.",
            "Los eventos salen por un outbox transaccional. Un cambio de estado y su fila de evento se confirman en una transacción, y un relay publica después.",
          ],
        },
        { kind: "p", text: "El lado del outbox es Postgres llano. Un trigger de statement AFTER INSERT llama a pg_notify, una conexión LISTEN despierta a los workers, y el polling cada 2 s queda como fallback. Los workers se reparten por hash(tenant/kind/stream/epoch) módulo N, así que un stream nunca es atendido por dos workers de un proceso. Las réplicas se reparten el trabajo con FOR UPDATE SKIP LOCKED. Los eventos entregados se liquidan con un UPDATE ... FROM unnest(...) en lugar de una sentencia por evento." },
      ],
    },
    {
      id: "per-step",
      title: "Costo por paso",
      blocks: [
        { kind: "p", text: "La primera pregunta era si un journal detrás de un salto gRPC añadiría latencia frente a una librería durable en proceso. El estudio midió un workflow de 3000 pasos no-op que devuelven un resultado de 1 KB, 5 ejecuciones, 1000 pasos de warm-up, Postgres 16 en tmpfs, una máquina." },
        {
          kind: "table",
          head: ["Variante", "serial p50", "serial p99", "pasos/s, 16 llamadores"],
          rows: [
            ["DBOS in-process", "752 us", "1776 us", "5810"],
            ["Direct insert, no hop", "156 us", "309 us", "29913"],
            ["Remote Record, unix socket", "295 us", "615 us", "18653"],
            ["Remote Record, tcp", "291 us", "509 us", "15772"],
          ],
        },
        { kind: "p", text: "El salto costó +0.14 ms en p50 y +0.2 a 0.3 ms en p99 sobre un insert directo. El journal remoto fue más rápido por paso que DBOS en proceso, que hace más trabajo por paso: sus propias tablas de sistema, una comprobación y luego una escritura. La lectura del estudio es que DBOS hace más por paso, no que el salto sea gratis." },
        { kind: "p", text: "El ADR volvió a medir entonces con el journal real: 2000 pasos secuenciales de 1 KB, Postgres de compose, gRPC sobre loopback, 3 ejecuciones. El p50 remoto fue de 1.13 a 1.17 ms y el p99 de 1.71 a 1.80 ms. DBOS tuvo p50 de 1.11 a 1.19 ms y p99 de 1.68 a 2.27 ms. En ese punto los dos son indistinguibles. Un paso real es una llamada externa que tarda varios milisegundos, así que 0.3 ms es menos del 10% de ella." },
        { kind: "callout", tone: "warn", text: "El estudio no midió Claim, Heartbeat, Load, Wake ni Signal, y la tabla de su prototipo no tenía check de fencing. Un Record real es algo más lento que la fila del prototipo. El load average de la ejecución fue de 12 a 21 en 16 núcleos, así que el p99 es ruidoso." },
      ],
    },
    {
      id: "throughput",
      title: "Throughput y el outbox",
      blocks: [
        { kind: "p", text: "Dos benchmarks del repositorio del engine cubren el store de Postgres. Ambos corrieron el 2026-11-07 en un AMD Ryzen 7 5700X con Postgres 16 en Docker en el mismo host, con configuración por defecto." },
        {
          kind: "table",
          head: ["Benchmark", "Condiciones", "Resultado"],
          rows: [
            ["Transitions", "8 clientes, Create más cuatro llamadas Append por ejecución, inserts de outbox incluidos", "676 a 784 transitions/s"],
            ["Outbox relay", "4 fuentes con sharding, 30000 eventos precargados, lotes de 500, sink no-op", "17000 a 18600 eventos/s"],
          ],
        },
        { kind: "p", text: "Así que el relay drena unas 25 veces más rápido de lo que el store produce en esta caja. Esa razón importa más que cualquiera de los dos números: el outbox no es el cuello de botella, lo es el camino de escritura transaccional." },
        { kind: "p", text: "Una tercera medición protege un costo distinto. Las ejecuciones en el nivel 1 del intérprete miran de reojo un mensaje del inbox ya entregado antes de cada llamada o subflow. El gate era como máximo 2 ms de p99 añadido por llamada y como máximo 15% de pérdida de throughput. En 30 workflows de 10 llamadas stub secuenciales, el engine en memoria añadió 0.04 ms por llamada en p99 (3.4% de pérdida de throughput), y el journal remoto no mostró pérdida. Antes de la lectura no bloqueante, la misma ejecución le costaba a Temporal 9.9 ms por llamada." },
      ],
    },
    {
      id: "negative",
      title: "Dónde el salto no se pagó",
      blocks: [
        { kind: "p", text: "El mismo estudio probó la misma idea en otro workload: poner un store transaccional detrás de una sesión en streaming, un round trip por llamada al store. Ese falló su gate, y creo que es la mitad más útil del resultado." },
        { kind: "list", items: [
          "Una sesión create de 8 llamadas añadió 928 us en p50 sobre un unix socket y 1327 us sobre tcp, con p99 añadido de +2140 us y +2489 us. El gate era 2 ms.",
          "El throughput mixto con 16 llamadores cayó de 20.6% a 32.5% frente a in-process, contra un límite de 15%.",
          "Un segundo workload, de orquestación de tests, con sesiones de 7 llamadas perdió de 42 a 47% de throughput en tmpfs.",
        ] },
        { kind: "p", text: "La causa es estructural. Una transacción y su conexión del pool permanecen abiertas durante cada round trip, así que un pool de 16 conexiones se satura antes y los locks se mantienen más tiempo. Un journal no tiene esa forma: cada Record es una sentencia y una llamada unaria, sin transacción abierta entre llamadas. Mi conclusión es una hipótesis, no una prueba: el salto es barato cuando cada llamada es independiente, y caro cuando las llamadas comparten una transacción." },
      ],
    },
    {
      id: "limits",
      title: "Límites de estos números",
      blocks: [
        { kind: "list", items: [
          "Una máquina, sockets loopback o unix. No se midió la latencia entre nodos.",
          "tmpfs abarata los commits. Postgres respaldado por disco estuvo limitado por fsync en la única ejecución en disco que tengo y no fue concluyente.",
          "Los benchmarks de outbox y transitions son ejecuciones únicas en una fecha. Los rangos son lo que reporta el repositorio.",
          "El fencing de leases bajo contención, el tiempo de recuperación tras un crash y las esperas largas están cubiertos por tests, no por estos números de latencia.",
        ] },
        { kind: "p", text: "Lo que me llevaría: los efectos exactly-once son baratos cuando el journal es una interfaz unaria delgada sobre sentencias individuales, y el costo aparece cuando estiras una transacción a través de una red." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "exactly-once-over-a-journal",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "O que o exactly-once sobre um journal custa",
  summary: "Números medidos de colocar a memória de um engine de workflows durável atrás de um journal transacional e um outbox: latência por passo, throughput do relay e onde o mesmo salto não se pagou.",
  tags: ["workflow", "postgres", "outbox", "latency"],
  project: "versatile-sh",
  sections: [
    {
      id: "claim",
      title: "O que a afirmação significa",
      blocks: [
        { kind: "p", text: "Ninguém consegue entrega exactly-once sobre uma rede. O que um engine de workflows durável pode dar são efeitos exactly-once: um passo pode rodar duas vezes, mas seu resultado registrado é escrito uma vez e lido de volta no replay. O nagare, o engine de workflows durável em que trabalho, é construído sobre essa divisão." },
        { kind: "p", text: "O engine mantém seu interpretador no host e trata a parte durável como um journal: uma sequência append-only de entradas por execução. Os passos são at-least-once por decisão (ADR-0002). Um passo que rodou mas não foi registrado roda de novo depois que o lease expira. O journal torna exactly-once tudo que vem depois do registro." },
        { kind: "p", text: "Este post é sobre o que isso custa em milissegundos. Todos os números vêm das notas de desempenho do engine, de um ADR e de um estudo de latência. Cada um traz suas condições, e nenhum é promessa para outro hardware." },
      ],
    },
    {
      id: "mechanism",
      title: "O mecanismo",
      blocks: [
        {
          kind: "list",
          items: [
            "Toda chamada durável (step, now, id, sleep, wait, recv, start-child) pega o próximo número de sequência. O replay devolve a entrada registrada e falha a execução como não determinística quando o kind ou a key diferem.",
            "Uma execução é alugada com um fence. Claim incrementa o fence e a contagem de tentativas, e toda escrita carrega (run_id, fence). Uma escrita com fence obsoleto não muda nada, então um executor zumbi não consegue sobrescrever o vivo.",
            "Receive consome uma mensagem do mailbox para a entrada recv de forma atômica. A mensagem nunca se perde nem é lida duas vezes após um crash, e um id de dedup fica entregue durante toda a vida da execução.",
            "Os eventos saem por um outbox transacional. Uma mudança de estado e sua linha de evento são confirmadas em uma transação, e um relay publica depois.",
          ],
        },
        { kind: "p", text: "O lado do outbox é Postgres puro. Um trigger de statement AFTER INSERT chama pg_notify, uma conexão LISTEN acorda os workers, e o polling a cada 2 s fica como fallback. Os workers fazem shard por hash(tenant/kind/stream/epoch) módulo N, então um stream nunca é atendido por dois workers de um processo. As réplicas dividem o trabalho com FOR UPDATE SKIP LOCKED. Os eventos entregues são liquidados com um UPDATE ... FROM unnest(...) em vez de uma instrução por evento." },
      ],
    },
    {
      id: "per-step",
      title: "Custo por passo",
      blocks: [
        { kind: "p", text: "A primeira pergunta era se um journal atrás de um salto gRPC adicionaria latência frente a uma biblioteca durável em processo. O estudo mediu um workflow de 3000 passos no-op que devolvem um resultado de 1 KB, 5 execuções, 1000 passos de warm-up, Postgres 16 em tmpfs, uma máquina." },
        {
          kind: "table",
          head: ["Variante", "serial p50", "serial p99", "passos/s, 16 chamadores"],
          rows: [
            ["DBOS in-process", "752 us", "1776 us", "5810"],
            ["Direct insert, no hop", "156 us", "309 us", "29913"],
            ["Remote Record, unix socket", "295 us", "615 us", "18653"],
            ["Remote Record, tcp", "291 us", "509 us", "15772"],
          ],
        },
        { kind: "p", text: "O salto custou +0.14 ms em p50 e +0.2 a 0.3 ms em p99 sobre um insert direto. O journal remoto foi mais rápido por passo que o DBOS em processo, que faz mais trabalho por passo: suas próprias tabelas de sistema, uma verificação e então uma escrita. A leitura do estudo é que o DBOS faz mais por passo, não que o salto seja de graça." },
        { kind: "p", text: "O ADR então mediu de novo com o journal real: 2000 passos sequenciais de 1 KB, Postgres do compose, gRPC sobre loopback, 3 execuções. O p50 remoto foi de 1.13 a 1.17 ms e o p99 de 1.71 a 1.80 ms. O DBOS teve p50 de 1.11 a 1.19 ms e p99 de 1.68 a 2.27 ms. Nesse ponto os dois são indistinguíveis. Um passo real é uma chamada externa que leva vários milissegundos, então 0.3 ms é menos de 10% dela." },
        { kind: "callout", tone: "warn", text: "O estudo não mediu Claim, Heartbeat, Load, Wake nem Signal, e a tabela do protótipo não tinha check de fencing. Um Record real é um pouco mais lento que a linha do protótipo. O load average da execução foi de 12 a 21 em 16 núcleos, então o p99 é ruidoso." },
      ],
    },
    {
      id: "throughput",
      title: "Throughput e o outbox",
      blocks: [
        { kind: "p", text: "Dois benchmarks no repositório do engine cobrem o store de Postgres. Ambos rodaram em 2026-11-07 em um AMD Ryzen 7 5700X com Postgres 16 em Docker no mesmo host, com configuração padrão." },
        {
          kind: "table",
          head: ["Benchmark", "Condições", "Resultado"],
          rows: [
            ["Transitions", "8 clientes, Create mais quatro chamadas Append por execução, inserts de outbox incluídos", "676 a 784 transitions/s"],
            ["Outbox relay", "4 fontes com shard, 30000 eventos pré-carregados, lotes de 500, sink no-op", "17000 a 18600 eventos/s"],
          ],
        },
        { kind: "p", text: "Ou seja, o relay drena umas 25 vezes mais rápido do que o store produz nesta caixa. Essa razão importa mais que qualquer um dos dois números: o outbox não é o gargalo, o caminho de escrita transacional é." },
        { kind: "p", text: "Uma terceira medição protege um custo diferente. As execuções no nível 1 do interpretador dão uma espiada em uma mensagem do inbox já entregue antes de cada chamada ou subflow. O gate era no máximo 2 ms de p99 adicionado por chamada e no máximo 15% de perda de throughput. Em 30 workflows de 10 chamadas stub sequenciais, o engine em memória adicionou 0.04 ms por chamada em p99 (3.4% de perda de throughput), e o journal remoto não mostrou perda. Antes da leitura não bloqueante, a mesma execução custava ao Temporal 9.9 ms por chamada." },
      ],
    },
    {
      id: "negative",
      title: "Onde o salto não se pagou",
      blocks: [
        { kind: "p", text: "O mesmo estudo testou a mesma ideia em outro workload: colocar um store transacional atrás de uma sessão em streaming, um round trip por chamada ao store. Esse falhou no gate, e acho que é a metade mais útil do resultado." },
        { kind: "list", items: [
          "Uma sessão create de 8 chamadas adicionou 928 us em p50 sobre um unix socket e 1327 us sobre tcp, com p99 adicionado de +2140 us e +2489 us. O gate era 2 ms.",
          "O throughput misto com 16 chamadores caiu de 20.6% a 32.5% frente a in-process, contra um limite de 15%.",
          "Um segundo workload, de orquestração de testes, com sessões de 7 chamadas perdeu de 42 a 47% de throughput em tmpfs.",
        ] },
        { kind: "p", text: "A causa é estrutural. Uma transação e sua conexão do pool ficam abertas durante cada round trip, então um pool de 16 conexões satura mais cedo e os locks são segurados por mais tempo. Um journal não tem esse formato: cada Record é uma instrução e uma chamada unária, sem transação aberta entre chamadas. Minha conclusão é uma hipótese, não uma prova: o salto é barato quando cada chamada é independente, e caro quando as chamadas compartilham uma transação." },
      ],
    },
    {
      id: "limits",
      title: "Limites desses números",
      blocks: [
        { kind: "list", items: [
          "Uma máquina, sockets loopback ou unix. A latência entre nós não foi medida.",
          "tmpfs barateia os commits. O Postgres em disco ficou limitado por fsync na única execução em disco que tenho e foi inconclusivo.",
          "Os benchmarks de outbox e transitions são execuções únicas em uma data. As faixas são o que o repositório reporta.",
          "O fencing de leases sob contenção, o tempo de recuperação após crash e as esperas longas são cobertos por testes, não por estes números de latência.",
        ] },
        { kind: "p", text: "O que eu levaria: efeitos exactly-once são baratos quando o journal é uma interface unária fina sobre instruções individuais, e o custo aparece quando você estica uma transação por uma rede." },
      ],
    },
  ],
};
