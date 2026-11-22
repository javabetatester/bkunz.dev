import type { Post } from "./types";

const post: Post = {
  slug: "a-plugin-hop-that-did-not-pay-for-itself",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "A plugin hop that did not pay for itself",
  summary: "A latency study for tsugite, the plugin protocol: a journal behind a remote call passed its gate, but a database transaction streamed through a plugin failed on both limbs, in two engines.",
  tags: ["tsugite", "latency", "grpc", "postgres", "negative-result"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "The question",
      blocks: [
        { kind: "p", text: "tsugite is the protocol that lets an engine's ports be served by an out-of-process plugin. Before building the store half of it, I wanted to know what a remote hop costs when the thing behind it is a database transaction. The gate: at most 2 ms of added p99 per write session and at most 15% throughput loss. Both limbs must hold." },
        { kind: "p", text: "The same study measured the journal case for the workflow engine. That part passed, and is covered in What exactly-once over a journal costs. This post is about the part that failed." },
      ],
    },
    {
      id: "method",
      title: "Method and conditions",
      blocks: [
        { kind: "list", items: [
          "Machine: 16 cores, Linux 7.2, Go 1.27.3, gRPC 1.83.2, everything on one box, `nice -n 10`.",
          "Postgres 16.16 alpine in a container, on tmpfs. tmpfs makes commits cheap, so relative throughput loss is pessimistic and absolute p99 added is not affected. One of the two engines was also run against a Docker volume on disk.",
          "The prototype imported the real store package of each engine, so the SQL was production SQL.",
          "Wire format: a gRPC bidirectional stream, JSON frames, one synchronous round trip per operation. No schema, no batching.",
          "Latency is closed-loop with one caller, throughput uses 16 goroutines for 8 s after a 3 s warm-up, 5 runs, medians reported. Warm-up before every measurement.",
        ] },
        { kind: "callout", tone: "warn", text: "The machine was not quiet: load average 12 to 21 on 16 cores for the first engine, 7 to 20 for the second. p99 and throughput are noisy. One tcp-loopback run had p99 1864 us against 162 to 265 us in the others." },
      ],
    },
    {
      id: "hop",
      title: "A hop is cheap",
      blocks: [
        { kind: "p", text: "A unary gRPC echo, one caller, 20000 calls per run: 63 us p50 and 222 us p99 over a unix socket with a 64 B payload, 80 us and 184 us over tcp loopback. A hop costs 0.06 to 0.10 ms at p50 and about 0.2 ms at p99. That matched the hypothesis for p50 and beat it for p99." },
        { kind: "p", text: "A store operation through the session stream costs about 115 us at p50 per op, which is the hop plus JSON and the plugin goroutine. Small, until you multiply it." },
      ],
    },
    {
      id: "sessions",
      title: "Sessions multiply it",
      blocks: [
        { kind: "p", text: "A write session is several operations inside one transaction: for the first engine, create is 8 operations. The transaction and its pool connection stay open for all the round trips." },
        { kind: "table", head: ["Variant, first engine", "create p50 us", "create p99 us", "sessions/s, 16 callers"], rows: [
          ["in-process", "1346", "2743", "3801"],
          ["session stream, unix", "2274", "4883", "2565 (-32.5%)"],
          ["session stream, tcp", "2673", "5232", "3017 (-20.6%)"],
        ] },
        { kind: "p", text: "Added p99 for create was +2140 us over unix and +2489 us over tcp. Throughput loss was 21 to 33%. Both limbs failed. The study notes that the unix run being slower than tcp is noise from machine load: runs ranged 2378 to 3048 for tcp and 2565 to 3500 for unix." },
        { kind: "p", text: "For hakoniwa's store the hot sessions have 7 operations (report a step, finish a run). On tmpfs the added p99 was 2.1 to 6.8 ms across the hot run paths, and throughput fell 41.9% over unix and 47.4% over tcp. On disk-backed Postgres the unix loss was 28.5% and tcp 7.5%, but that run is inconclusive: fsync-bound, only 3 rounds, with added p99 spikes of +21 to +42 ms in several rows." },
      ],
    },
    {
      id: "why",
      title: "Why, and what I did instead",
      blocks: [
        { kind: "p", text: "The study's explanation, which fits the numbers: the transaction holds a pooled connection across N round trips, so a 16-connection pool saturates sooner, and the host and plugin burn CPU on the same box. Locks taken inside the transaction are held across all of them too." },
        { kind: "p", text: "The consequence was a plan change, not an abandoned plugin. The store takes the cheaper path: an embedded tier plus command-shaped operations, where one RPC carries one whole transaction. The study's plan table puts both store plugins on that path. The hakoniwa commits of the same day include the embedded store tier template." },
        { kind: "callout", tone: "note", text: "A pipelined session, sending blind writes without waiting and surfacing errors at the next read or commit, projects to roughly +0.4 to 0.5 ms p50 and 1 to 1.3 ms p99 for create. That is a projection from round-trip counts. It was not built or measured, and it would change the meaning of a write error." },
        { kind: "p", text: "Not measured: cross-node, lock contention between callers, and the full store test suite through the remote path, since the prototype proxied only the workload's methods." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "a-plugin-hop-that-did-not-pay-for-itself",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Un salto de plugin que no se pagó solo",
  summary: "Un estudio de latencia para tsugite, el protocolo de plugins: un journal detrás de una llamada remota pasó su gate, pero una transacción de base de datos transmitida por un plugin falló en los dos límites, en dos engines.",
  tags: ["tsugite", "latency", "grpc", "postgres", "negative-result"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "La pregunta",
      blocks: [
        { kind: "p", text: "tsugite es el protocolo que permite que un plugin fuera de proceso sirva los ports de un engine. Antes de construir la mitad de store, quería saber cuánto cuesta un salto remoto cuando lo que hay detrás es una transacción de base de datos. El gate: como máximo 2 ms de p99 añadido por sesión de escritura y como máximo 15% de pérdida de throughput. Los dos límites deben cumplirse." },
        { kind: "p", text: "El mismo estudio midió el caso del journal para el engine de workflows. Esa parte pasó y se trata en What exactly-once over a journal costs. Este post trata de la parte que falló." },
      ],
    },
    {
      id: "method",
      title: "Método y condiciones",
      blocks: [
        { kind: "list", items: [
          "Máquina: 16 núcleos, Linux 7.2, Go 1.27.3, gRPC 1.83.2, todo en una sola caja, `nice -n 10`.",
          "Postgres 16.16 alpine en un contenedor, sobre tmpfs. tmpfs abarata los commits, así que la pérdida relativa de throughput es pesimista y el p99 absoluto añadido no se ve afectado. Uno de los dos engines también se ejecutó contra un volumen Docker en disco.",
          "El prototipo importó el paquete store real de cada engine, así que el SQL era SQL de producción.",
          "Formato de wire: un stream bidireccional gRPC, frames JSON, un round trip síncrono por operación. Sin schema, sin batching.",
          "La latencia es de bucle cerrado con un solo llamador; el throughput usa 16 goroutines durante 8 s tras 3 s de warm-up, 5 ejecuciones, se reportan medianas. Warm-up antes de cada medición.",
        ] },
        { kind: "callout", tone: "warn", text: "La máquina no estaba tranquila: load average de 12 a 21 en 16 núcleos para el primer engine, de 7 a 20 para el segundo. p99 y throughput son ruidosos. Una ejecución por tcp-loopback tuvo p99 de 1864 us frente a 162 a 265 us en las demás." },
      ],
    },
    {
      id: "hop",
      title: "Un salto es barato",
      blocks: [
        { kind: "p", text: "Un echo gRPC unario, un llamador, 20000 llamadas por ejecución: 63 us de p50 y 222 us de p99 sobre un unix socket con payload de 64 B, 80 us y 184 us sobre tcp loopback. Un salto cuesta de 0.06 a 0.10 ms en p50 y cerca de 0.2 ms en p99. Eso coincidió con la hipótesis para p50 y la superó para p99." },
        { kind: "p", text: "Una operación de store a través del stream de sesión cuesta unos 115 us de p50 por operación, que es el salto más JSON y la goroutine del plugin. Poco, hasta que se multiplica." },
      ],
    },
    {
      id: "sessions",
      title: "Las sesiones lo multiplican",
      blocks: [
        { kind: "p", text: "Una sesión de escritura son varias operaciones dentro de una transacción: para el primer engine, create son 8 operaciones. La transacción y su conexión del pool permanecen abiertas durante todos los round trips." },
        { kind: "table", head: ["Variante, primer engine", "create p50 us", "create p99 us", "sesiones/s, 16 llamadores"], rows: [
          ["in-process", "1346", "2743", "3801"],
          ["session stream, unix", "2274", "4883", "2565 (-32.5%)"],
          ["session stream, tcp", "2673", "5232", "3017 (-20.6%)"],
        ] },
        { kind: "p", text: "El p99 añadido para create fue de +2140 us sobre unix y +2489 us sobre tcp. La pérdida de throughput fue de 21 a 33%. Los dos límites fallaron. El estudio anota que el hecho de que unix saliera más lento que tcp es ruido por la carga de la máquina: las ejecuciones fueron de 2378 a 3048 para tcp y de 2565 a 3500 para unix." },
        { kind: "p", text: "Para el store de hakoniwa, las sesiones calientes tienen 7 operaciones (reportar un paso, terminar una ejecución). En tmpfs el p99 añadido fue de 2.1 a 6.8 ms en las rutas de ejecución calientes, y el throughput cayó 41.9% sobre unix y 47.4% sobre tcp. Con Postgres respaldado por disco la pérdida en unix fue de 28.5% y en tcp de 7.5%, pero esa ejecución no es concluyente: limitada por fsync, solo 3 rondas, con picos de p99 añadido de +21 a +42 ms en varias filas." },
      ],
    },
    {
      id: "why",
      title: "Por qué, y qué hice en su lugar",
      blocks: [
        { kind: "p", text: "La explicación del estudio, que encaja con los números: la transacción retiene una conexión del pool durante N round trips, así que un pool de 16 conexiones se satura antes, y el host y el plugin gastan CPU en la misma caja. Los locks tomados dentro de la transacción también se mantienen durante todos ellos." },
        { kind: "p", text: "La consecuencia fue un cambio de plan, no un plugin abandonado. El store toma el camino más barato: un tier embebido más operaciones con forma de comando, donde un RPC lleva una transacción entera. La tabla de plan del estudio pone los dos plugins de store en ese camino. Los commits de hakoniwa del mismo día incluyen la plantilla del tier de store embebido." },
        { kind: "callout", tone: "note", text: "Una sesión con pipeline, que envía escrituras a ciegas sin esperar y muestra los errores en la siguiente lectura o commit, se proyecta en aproximadamente +0.4 a 0.5 ms de p50 y de 1 a 1.3 ms de p99 para create. Es una proyección a partir de conteos de round trips. No se construyó ni se midió, y cambiaría el significado de un error de escritura." },
        { kind: "p", text: "No medido: entre nodos, contención de locks entre llamadores y la suite completa de tests del store a través del camino remoto, ya que el prototipo solo hizo proxy de los métodos del workload." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "a-plugin-hop-that-did-not-pay-for-itself",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Um salto de plugin que não se pagou",
  summary: "Um estudo de latência para o tsugite, o protocolo de plugins: um journal atrás de uma chamada remota passou no gate, mas uma transação de banco de dados transmitida por um plugin falhou nos dois limites, em dois engines.",
  tags: ["tsugite", "latency", "grpc", "postgres", "negative-result"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "A pergunta",
      blocks: [
        { kind: "p", text: "tsugite é o protocolo que permite que um plugin fora de processo sirva os ports de um engine. Antes de construir a metade de store, eu queria saber quanto custa um salto remoto quando o que está atrás é uma transação de banco de dados. O gate: no máximo 2 ms de p99 adicionado por sessão de escrita e no máximo 15% de perda de throughput. Os dois limites precisam valer." },
        { kind: "p", text: "O mesmo estudo mediu o caso do journal para o engine de workflows. Essa parte passou e está coberta em What exactly-once over a journal costs. Este post é sobre a parte que falhou." },
      ],
    },
    {
      id: "method",
      title: "Método e condições",
      blocks: [
        { kind: "list", items: [
          "Máquina: 16 núcleos, Linux 7.2, Go 1.27.3, gRPC 1.83.2, tudo em uma só caixa, `nice -n 10`.",
          "Postgres 16.16 alpine em um container, em tmpfs. tmpfs barateia os commits, então a perda relativa de throughput é pessimista e o p99 absoluto adicionado não é afetado. Um dos dois engines também rodou contra um volume Docker em disco.",
          "O protótipo importou o pacote store real de cada engine, então o SQL era SQL de produção.",
          "Formato de wire: um stream bidirecional gRPC, frames JSON, um round trip síncrono por operação. Sem schema, sem batching.",
          "A latência é de malha fechada com um único chamador; o throughput usa 16 goroutines por 8 s após 3 s de warm-up, 5 execuções, medianas reportadas. Warm-up antes de cada medição.",
        ] },
        { kind: "callout", tone: "warn", text: "A máquina não estava quieta: load average de 12 a 21 em 16 núcleos para o primeiro engine, de 7 a 20 para o segundo. p99 e throughput são ruidosos. Uma execução por tcp-loopback teve p99 de 1864 us contra 162 a 265 us nas outras." },
      ],
    },
    {
      id: "hop",
      title: "Um salto é barato",
      blocks: [
        { kind: "p", text: "Um echo gRPC unário, um chamador, 20000 chamadas por execução: 63 us de p50 e 222 us de p99 sobre um unix socket com payload de 64 B, 80 us e 184 us sobre tcp loopback. Um salto custa de 0.06 a 0.10 ms em p50 e cerca de 0.2 ms em p99. Isso bateu com a hipótese para p50 e a superou para p99." },
        { kind: "p", text: "Uma operação de store pelo stream de sessão custa cerca de 115 us de p50 por operação, que é o salto mais JSON e a goroutine do plugin. Pouco, até você multiplicar." },
      ],
    },
    {
      id: "sessions",
      title: "As sessões multiplicam",
      blocks: [
        { kind: "p", text: "Uma sessão de escrita são várias operações dentro de uma transação: para o primeiro engine, create são 8 operações. A transação e sua conexão do pool ficam abertas durante todos os round trips." },
        { kind: "table", head: ["Variante, primeiro engine", "create p50 us", "create p99 us", "sessões/s, 16 chamadores"], rows: [
          ["in-process", "1346", "2743", "3801"],
          ["session stream, unix", "2274", "4883", "2565 (-32.5%)"],
          ["session stream, tcp", "2673", "5232", "3017 (-20.6%)"],
        ] },
        { kind: "p", text: "O p99 adicionado para create foi de +2140 us sobre unix e +2489 us sobre tcp. A perda de throughput foi de 21 a 33%. Os dois limites falharam. O estudo observa que o unix ter saído mais lento que o tcp é ruído da carga da máquina: as execuções variaram de 2378 a 3048 para tcp e de 2565 a 3500 para unix." },
        { kind: "p", text: "Para o store do hakoniwa, as sessões quentes têm 7 operações (reportar um passo, terminar uma execução). Em tmpfs o p99 adicionado foi de 2.1 a 6.8 ms nos caminhos de execução quentes, e o throughput caiu 41.9% sobre unix e 47.4% sobre tcp. Com Postgres em disco a perda no unix foi de 28.5% e no tcp de 7.5%, mas essa execução é inconclusiva: limitada por fsync, só 3 rodadas, com picos de p99 adicionado de +21 a +42 ms em várias linhas." },
      ],
    },
    {
      id: "why",
      title: "Por quê, e o que fiz em vez disso",
      blocks: [
        { kind: "p", text: "A explicação do estudo, que bate com os números: a transação segura uma conexão do pool por N round trips, então um pool de 16 conexões satura mais cedo, e o host e o plugin gastam CPU na mesma caixa. Os locks tomados dentro da transação também ficam presos durante todos eles." },
        { kind: "p", text: "A consequência foi uma mudança de plano, não um plugin abandonado. O store toma o caminho mais barato: um tier embutido mais operações em formato de comando, onde um RPC carrega uma transação inteira. A tabela de plano do estudo coloca os dois plugins de store nesse caminho. Os commits do hakoniwa do mesmo dia incluem o template do tier de store embutido." },
        { kind: "callout", tone: "note", text: "Uma sessão com pipeline, que manda escritas às cegas sem esperar e mostra os erros na próxima leitura ou commit, projeta-se em aproximadamente +0.4 a 0.5 ms de p50 e de 1 a 1.3 ms de p99 para create. É uma projeção a partir de contagens de round trips. Não foi construída nem medida, e mudaria o significado de um erro de escrita." },
        { kind: "p", text: "Não medido: entre nós, contenção de locks entre chamadores e a suíte completa de testes do store pelo caminho remoto, já que o protótipo só fez proxy dos métodos do workload." },
      ],
    },
  ],
};
