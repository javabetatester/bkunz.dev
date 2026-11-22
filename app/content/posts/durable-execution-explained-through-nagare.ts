import type { Post } from "./types";

const post: Post = {
  slug: "durable-execution-explained-through-nagare",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Durable execution, explained through nagare",
  summary: "What a journal, deterministic replay, an inbox and an outbox actually do in a durable workflow engine, and why at-least-once plus idempotent boundaries is what exactly-once means in practice.",
  tags: ["workflow", "durable-execution", "journal", "inbox", "outbox"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem",
      blocks: [
        { kind: "p", text: "A workflow that calls three services can crash between the second and the third call. A durable engine's job is to make that crash boring: the run resumes where it was, and the calls that already happened do not happen again." },
        { kind: "p", text: "nagare is the durable workflow engine I work on. A workflow is a JSON graph with nine node types. Every side effect is a call of an operation on a connection. This post explains the four mechanisms that make a crash boring, using the engine's own ADRs as the source: the journal, deterministic replay, the inbox and the outbox. There are no benchmarks here. The numbers are in a separate post, What exactly-once over a journal costs." },
      ],
    },
    {
      id: "journal",
      title: "The journal",
      blocks: [
        { kind: "p", text: "A journal is an append-only list of entries per run. Each durable thing the interpreter does takes the next sequence number: a step, a read of the clock, a generated id, a sleep, a wait, a received message, the start of a child run." },
        { kind: "p", text: "A step is a named command. Its key is built from the node, how often the node was entered, and the attempt, for example `<node>#<visit>@<attempt>`. The same string, prefixed with the run id, is the idempotency key handed to whatever answers the call." },
        { kind: "code", lang: "text", caption: "Step keys the interpreter uses (ADR-0003 addendum)", code: "load                       definition load\ncreate:<node>              child run creation\n<node>#<visit>@<attempt>   call attempt\n<key>/status<n>            status poll\nemit:<seq>                 event flush\n<key>~r<n>                 infrastructure retry, n above 1" },
        { kind: "p", text: "Keys are part of the replay contract. Changing one is an incompatible interpreter change, and the ADR says it ships as a new build that drains the old one instead of patching parked runs." },
      ],
    },
    {
      id: "replay",
      title: "Deterministic replay",
      blocks: [
        { kind: "p", text: "After a crash the engine does not restore a memory snapshot. It runs the interpreter again from the start. Each durable call asks the journal first: if an entry exists at that position, the recorded result is returned and nothing executes. Only the first position with no entry runs for real." },
        { kind: "p", text: "That only works if the interpreter makes the same sequence of calls every time. So the interpreter is deterministic by rule. Inside the interpreter package there is no `time.Now`, no `math/rand`, no goroutines, no `select`, no unsorted map iteration, no I/O and no globals. Time and ids come from the durable context, so they are recorded once and replayed." },
        { kind: "p", text: "The journal checks this at runtime. If replay asks for a call whose kind or key differs from the recorded entry, the run fails with a non-determinism error instead of continuing on a wrong history." },
        { kind: "callout", tone: "note", text: "Retries follow the same rule. Each attempt is its own step, backoff is a durable sleep, and the engine's native retry is switched off. One interpreter owns retry semantics, so every engine behind the port behaves the same." },
      ],
    },
    {
      id: "inbox-outbox",
      title: "Inbox and outbox",
      blocks: [
        { kind: "p", text: "The journal covers what happens inside a run. The edges need the same treatment. A callback that arrives while the engine is down must not be lost, and an event that a run emits must not be lost or published twice." },
        { kind: "p", text: "Inbound, ADR-0012 says: persist, then acknowledge. Every webhook, callback, signal and event is inserted into a table and answered at once. The key is tenant, source and message id, unique across replicas. A new message answers 202 and a duplicate answers 200. The handler never calls the engine. A dispatcher delivers later, in order per ordering key, at least once. Before this change, an engine outage returned 5xx to a caller that would never resend." },
        { kind: "p", text: "Outbound is the mirror. Appending run events writes the events, the read-model projection and the outbox rows in one transaction, guarded by the last sequence number. A relay publishes the rows to sinks afterwards, also at least once. The event id is built from tenant, stream and sequence, so a consumer can drop repeats. When a run id is reused after a delete, an epoch is added to the id so the new history does not collide with the old one (ADR-0015)." },
      ],
    },
    {
      id: "exactly-once",
      title: "What exactly-once means here",
      blocks: [
        { kind: "p", text: "The README is blunt: the engine is not exactly-once. Delivery is at least once everywhere, and every boundary is idempotent instead. A step can run twice if the process dies after the call and before the record. Under the remote journal that case is explicit: the step runs again after the lease expires." },
        { kind: "list", items: [
          "Inbound duplicates are absorbed by the unique message key and by the engine's own inbox dedupe for signals.",
          "A repeated step carries the same idempotency key, so a callee that honours it applies the effect once.",
          "A retried event flush never duplicates events, because the append is idempotent by expected sequence.",
          "Outbound repeats carry the same event id, so a consumer that deduplicates on it sees each event once.",
        ] },
        { kind: "p", text: "So exactly-once is a property of effects, achieved by recording results once and making every repeat harmless. It depends on the callee honouring the key. The engine can prove its own side with a side-effect ledger in the test suite, where a duplicate key fails a case. It cannot prove a callee it does not control." },
        { kind: "p", text: "One more guard keeps a zombie from undoing this: runs are leased with a fence. Every journal write carries the run id and the fence, and a write with a stale fence changes nothing." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "durable-execution-explained-through-nagare",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Durable execution, explicada a través de nagare",
  summary: "Qué hacen realmente un journal, el replay determinista, un inbox y un outbox en un engine de workflows durable, y por qué at-least-once más fronteras idempotentes es lo que exactly-once significa en la práctica.",
  tags: ["workflow", "durable-execution", "journal", "inbox", "outbox"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "El problema",
      blocks: [
        { kind: "p", text: "Un workflow que llama a tres servicios puede caerse entre la segunda y la tercera llamada. El trabajo de un engine durable es hacer que esa caída sea aburrida: la ejecución se reanuda donde estaba, y las llamadas que ya ocurrieron no vuelven a ocurrir." },
        { kind: "p", text: "nagare es el engine de workflows durable en el que trabajo. Un workflow es un grafo JSON con nueve tipos de nodo. Cada efecto secundario es una llamada a una operación sobre una conexión. Este post explica los cuatro mecanismos que hacen aburrida una caída, usando como fuente los propios ADRs del engine: el journal, el replay determinista, el inbox y el outbox. Aquí no hay benchmarks. Los números están en otro post, What exactly-once over a journal costs." },
      ],
    },
    {
      id: "journal",
      title: "El journal",
      blocks: [
        { kind: "p", text: "Un journal es una lista append-only de entradas por ejecución. Cada cosa durable que hace el intérprete toma el siguiente número de secuencia: un paso, una lectura del reloj, un id generado, un sleep, un wait, un mensaje recibido, el inicio de una ejecución hija." },
        { kind: "p", text: "Un paso es un comando con nombre. Su key se construye con el nodo, cuántas veces se entró al nodo y el intento, por ejemplo `<node>#<visit>@<attempt>`. La misma cadena, con el id de la ejecución como prefijo, es la idempotency key que se entrega a quien responde la llamada." },
        { kind: "code", lang: "text", caption: "Keys de paso que usa el intérprete (addendum de ADR-0003)", code: "load                       definition load\ncreate:<node>              child run creation\n<node>#<visit>@<attempt>   call attempt\n<key>/status<n>            status poll\nemit:<seq>                 event flush\n<key>~r<n>                 infrastructure retry, n above 1" },
        { kind: "p", text: "Las keys son parte del contrato de replay. Cambiar una es un cambio incompatible del intérprete, y el ADR dice que sale como una build nueva que drena la anterior en lugar de parchear ejecuciones aparcadas." },
      ],
    },
    {
      id: "replay",
      title: "Replay determinista",
      blocks: [
        { kind: "p", text: "Tras una caída el engine no restaura un snapshot de memoria. Ejecuta el intérprete otra vez desde el principio. Cada llamada durable consulta primero el journal: si existe una entrada en esa posición, se devuelve el resultado registrado y no se ejecuta nada. Solo la primera posición sin entrada se ejecuta de verdad." },
        { kind: "p", text: "Eso solo funciona si el intérprete hace la misma secuencia de llamadas cada vez. Por eso el intérprete es determinista por regla. Dentro del paquete del intérprete no hay `time.Now`, ni `math/rand`, ni goroutines, ni `select`, ni iteración de maps sin ordenar, ni I/O, ni globales. El tiempo y los ids vienen del contexto durable, así que se registran una vez y se reproducen." },
        { kind: "p", text: "El journal lo verifica en runtime. Si el replay pide una llamada cuyo kind o key difiere de la entrada registrada, la ejecución falla con un error de no determinismo en lugar de continuar sobre una historia equivocada." },
        { kind: "callout", tone: "note", text: "Los reintentos siguen la misma regla. Cada intento es su propio paso, el backoff es un sleep durable y el retry nativo del engine está desactivado. Un solo intérprete es dueño de la semántica de reintentos, así que todos los engines detrás del port se comportan igual." },
      ],
    },
    {
      id: "inbox-outbox",
      title: "Inbox y outbox",
      blocks: [
        { kind: "p", text: "El journal cubre lo que ocurre dentro de una ejecución. Los bordes necesitan el mismo tratamiento. Un callback que llega mientras el engine está caído no debe perderse, y un evento que una ejecución emite no debe perderse ni publicarse dos veces." },
        { kind: "p", text: "Para lo entrante, el ADR-0012 dice: persistir y luego confirmar. Cada webhook, callback, señal y evento se inserta en una tabla y se responde al instante. La key es tenant, source y message id, única entre réplicas. Un mensaje nuevo responde 202 y un duplicado responde 200. El handler nunca llama al engine. Un dispatcher entrega después, en orden por ordering key, at least once. Antes de este cambio, una caída del engine devolvía 5xx a un llamador que nunca reenviaría." },
        { kind: "p", text: "Lo saliente es el espejo. Añadir eventos de una ejecución escribe los eventos, la proyección del read-model y las filas del outbox en una sola transacción, protegida por el último número de secuencia. Un relay publica las filas a los sinks después, también at least once. El id del evento se construye con tenant, stream y secuencia, así que un consumidor puede descartar repetidos. Cuando se reutiliza el id de una ejecución tras un borrado, se añade un epoch al id para que la historia nueva no colisione con la antigua (ADR-0015)." },
      ],
    },
    {
      id: "exactly-once",
      title: "Qué significa exactly-once aquí",
      blocks: [
        { kind: "p", text: "El README es directo: el engine no es exactly-once. La entrega es at least once en todas partes, y cada frontera es idempotente en su lugar. Un paso puede ejecutarse dos veces si el proceso muere después de la llamada y antes del registro. Bajo el journal remoto ese caso es explícito: el paso se ejecuta de nuevo cuando expira el lease." },
        { kind: "list", items: [
          "Los duplicados entrantes los absorbe la message key única y el propio dedupe del inbox del engine para las señales.",
          "Un paso repetido lleva la misma idempotency key, así que un callee que la respete aplica el efecto una vez.",
          "Un flush de eventos reintentado nunca duplica eventos, porque el append es idempotente por secuencia esperada.",
          "Las repeticiones salientes llevan el mismo id de evento, así que un consumidor que deduplica sobre él ve cada evento una vez.",
        ] },
        { kind: "p", text: "Así que exactly-once es una propiedad de los efectos, lograda registrando los resultados una vez y haciendo inofensiva cada repetición. Depende de que el callee respete la key. El engine puede probar su propio lado con un ledger de efectos secundarios en la suite de tests, donde una key duplicada hace fallar un caso. No puede probar a un callee que no controla." },
        { kind: "p", text: "Una guarda más impide que un zombi deshaga esto: las ejecuciones se arriendan con un fence. Cada escritura del journal lleva el id de la ejecución y el fence, y una escritura con un fence obsoleto no cambia nada." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "durable-execution-explained-through-nagare",
  category: "studies",
  date: "2026-11-13",
  published: "2026-11-21",
  title: "Durable execution, explicada através do nagare",
  summary: "O que um journal, o replay determinístico, um inbox e um outbox realmente fazem em um engine de workflows durável, e por que at-least-once mais fronteiras idempotentes é o que exactly-once significa na prática.",
  tags: ["workflow", "durable-execution", "journal", "inbox", "outbox"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "O problema",
      blocks: [
        { kind: "p", text: "Um workflow que chama três serviços pode cair entre a segunda e a terceira chamada. O trabalho de um engine durável é tornar essa queda entediante: a execução retoma de onde estava, e as chamadas que já aconteceram não acontecem de novo." },
        { kind: "p", text: "nagare é o engine de workflows durável em que trabalho. Um workflow é um grafo JSON com nove tipos de nó. Todo efeito colateral é uma chamada de uma operação sobre uma conexão. Este post explica os quatro mecanismos que tornam uma queda entediante, usando os próprios ADRs do engine como fonte: o journal, o replay determinístico, o inbox e o outbox. Não há benchmarks aqui. Os números estão em outro post, What exactly-once over a journal costs." },
      ],
    },
    {
      id: "journal",
      title: "O journal",
      blocks: [
        { kind: "p", text: "Um journal é uma lista append-only de entradas por execução. Cada coisa durável que o interpretador faz pega o próximo número de sequência: um passo, uma leitura do relógio, um id gerado, um sleep, um wait, uma mensagem recebida, o início de uma execução filha." },
        { kind: "p", text: "Um passo é um comando nomeado. Sua key é montada com o nó, quantas vezes o nó foi visitado e a tentativa, por exemplo `<node>#<visit>@<attempt>`. A mesma string, prefixada com o id da execução, é a idempotency key entregue a quem responde à chamada." },
        { kind: "code", lang: "text", caption: "Keys de passo que o interpretador usa (adendo do ADR-0003)", code: "load                       definition load\ncreate:<node>              child run creation\n<node>#<visit>@<attempt>   call attempt\n<key>/status<n>            status poll\nemit:<seq>                 event flush\n<key>~r<n>                 infrastructure retry, n above 1" },
        { kind: "p", text: "As keys fazem parte do contrato de replay. Mudar uma é uma mudança incompatível do interpretador, e o ADR diz que ela sai como uma build nova que drena a antiga em vez de remendar execuções estacionadas." },
      ],
    },
    {
      id: "replay",
      title: "Replay determinístico",
      blocks: [
        { kind: "p", text: "Depois de uma queda o engine não restaura um snapshot de memória. Ele roda o interpretador de novo desde o início. Cada chamada durável consulta o journal primeiro: se existe uma entrada naquela posição, o resultado registrado é devolvido e nada executa. Só a primeira posição sem entrada executa de verdade." },
        { kind: "p", text: "Isso só funciona se o interpretador faz a mesma sequência de chamadas toda vez. Por isso o interpretador é determinístico por regra. Dentro do pacote do interpretador não há `time.Now`, nem `math/rand`, nem goroutines, nem `select`, nem iteração de maps sem ordenar, nem I/O, nem globais. O tempo e os ids vêm do contexto durável, então são registrados uma vez e reproduzidos." },
        { kind: "p", text: "O journal verifica isso em runtime. Se o replay pede uma chamada cujo kind ou key difere da entrada registrada, a execução falha com um erro de não determinismo em vez de seguir sobre uma história errada." },
        { kind: "callout", tone: "note", text: "Os retries seguem a mesma regra. Cada tentativa é seu próprio passo, o backoff é um sleep durável e o retry nativo do engine fica desligado. Um único interpretador é dono da semântica de retry, então todos os engines atrás do port se comportam igual." },
      ],
    },
    {
      id: "inbox-outbox",
      title: "Inbox e outbox",
      blocks: [
        { kind: "p", text: "O journal cobre o que acontece dentro de uma execução. As bordas precisam do mesmo tratamento. Um callback que chega enquanto o engine está fora não pode se perder, e um evento que uma execução emite não pode se perder nem ser publicado duas vezes." },
        { kind: "p", text: "Para o que entra, o ADR-0012 diz: persistir e depois confirmar. Todo webhook, callback, sinal e evento é inserido em uma tabela e respondido na hora. A key é tenant, source e message id, única entre réplicas. Uma mensagem nova responde 202 e uma duplicada responde 200. O handler nunca chama o engine. Um dispatcher entrega depois, em ordem por ordering key, at least once. Antes dessa mudança, uma queda do engine devolvia 5xx a um chamador que nunca reenviaria." },
        { kind: "p", text: "O que sai é o espelho. Acrescentar eventos de uma execução escreve os eventos, a projeção do read-model e as linhas do outbox em uma transação, protegida pelo último número de sequência. Um relay publica as linhas nos sinks depois, também at least once. O id do evento é montado com tenant, stream e sequência, então um consumidor pode descartar repetidos. Quando o id de uma execução é reutilizado após uma exclusão, um epoch é adicionado ao id para que a história nova não colida com a antiga (ADR-0015)." },
      ],
    },
    {
      id: "exactly-once",
      title: "O que exactly-once significa aqui",
      blocks: [
        { kind: "p", text: "O README é direto: o engine não é exactly-once. A entrega é at least once em todo lugar, e cada fronteira é idempotente em vez disso. Um passo pode rodar duas vezes se o processo morre depois da chamada e antes do registro. Sob o journal remoto esse caso é explícito: o passo roda de novo depois que o lease expira." },
        { kind: "list", items: [
          "Duplicados de entrada são absorvidos pela message key única e pelo próprio dedupe do inbox do engine para sinais.",
          "Um passo repetido carrega a mesma idempotency key, então um callee que a respeita aplica o efeito uma vez.",
          "Um flush de eventos retentado nunca duplica eventos, porque o append é idempotente por sequência esperada.",
          "Repetições de saída carregam o mesmo id de evento, então um consumidor que deduplica nele vê cada evento uma vez.",
        ] },
        { kind: "p", text: "Então exactly-once é uma propriedade dos efeitos, obtida registrando os resultados uma vez e tornando cada repetição inofensiva. Depende de o callee respeitar a key. O engine pode provar o próprio lado com um ledger de efeitos colaterais na suíte de testes, onde uma key duplicada falha um caso. Ele não pode provar um callee que não controla." },
        { kind: "p", text: "Mais uma guarda impede que um zumbi desfaça isso: as execuções são alugadas com um fence. Toda escrita do journal carrega o id da execução e o fence, e uma escrita com fence obsoleto não muda nada." },
      ],
    },
  ],
};
