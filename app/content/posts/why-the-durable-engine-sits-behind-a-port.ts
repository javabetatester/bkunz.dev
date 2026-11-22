import type { Post } from "./types";

const post: Post = {
  slug: "why-the-durable-engine-sits-behind-a-port",
  category: "studies",
  date: "2026-11-07",
  published: "2026-11-21",
  title: "Why the durable engine sits behind a port",
  summary: "The decision record for nagare's durable engine: two engines behind one interface, the alternatives that were rejected, what the choice cost, and what the first measurements showed.",
  tags: ["adr", "architecture", "workflow", "dbos", "temporal"],
  project: "versatile-sh",
  sections: [
    {
      id: "decision",
      title: "The decision",
      blocks: [
        { kind: "p", text: "On 2026-11-07 the research draft WF-ADR-002 proposed that nagare reach durability only through one Go interface, with one engine as the default and a second kept first-class. The engine ADR accepted the same day. This is what it chose, what it turned down, and what it cost." },
        { kind: "list", items: [
          "The interpreter talks to a durable context with Step, Sleep, WaitFor, Child, Now, NewID and continue-as-new hooks. The server talks to an engine with Start, Signal, Cancel and the like.",
          "DBOS Transact is the default: a Go library on the same Postgres, so v1 is one binary plus Postgres.",
          "Temporal is first-class from the first version, kept green by a differential test suite. The draft sets a trigger for moving production to it: sustained load above 2,000 transitions per second per cluster, multi-region active-active, or a contract that requires it.",
          "An in-memory engine backs unit tests and dry runs.",
        ] },
      ],
    },
    {
      id: "alternatives",
      title: "Alternatives that lost",
      blocks: [
        { kind: "table", head: ["Option", "Why not"], rows: [
          ["TypeScript core on the TS SDKs", "the owner chose Go, and the Go SDKs cover the same primitives"],
          ["Temporal as the default", "four extra services and a second database for every install from day one"],
          ["Hatchet", "separate engine process; versioning story unverified"],
          ["A home-made engine", "reimplements recovery, queues, schedules and fork with less testing"],
        ] },
        { kind: "p", text: "The research also ruled several products out on licence terms for a product sold as a service. That is a legal fit check done on the dated sources in the notes, not a judgment of quality." },
      ],
    },
    {
      id: "costs",
      title: "What it costs",
      blocks: [
        { kind: "p", text: "Two adapters have to be maintained from the start, and the lowest common denominator leaks. The accepted ADR records two consequences that the draft did not have." },
        { kind: "list", items: [
          "A closure cannot be a Temporal activity, since activities are registered functions with serializable arguments. So steps became named commands: Step(key, op, args), with handlers in a registry shared by every engine.",
          "Engine-native retry is off everywhere. The interpreter owns retry, timeouts and cancellation semantics (ADR-0003), so each retry attempt is its own step. That means more steps per retried node, which the ADR accepts for parity.",
        ] },
        { kind: "p", text: "The parity itself needs proof. A differential suite runs every case on each engine and compares normalized events plus a side-effect ledger with one row per idempotency key. Its 26 numbered scenarios cover control flow, retries, async callbacks, crash and recovery, limits and idempotent start, plus recorded Temporal histories replayed against the current interpreter. By decision there is no CI: whoever changes the core, the ports or an engine runs the suite locally before merging, and nothing enforces it." },
      ],
    },
    {
      id: "measured",
      title: "What the port later made cheap and visible",
      blocks: [
        { kind: "p", text: "Having a port made a third engine possible without touching the interpreter: a remote journal behind a plugin, accepted on 2026-11-13. A run-control feature then had a measured cost on every engine. The run-control inbox read was measured on the development machine on 2026-11-13: 30 workflows of 10 sequential stub calls, compared with and without the read." },
        { kind: "table", head: ["Engine", "p99 per run, without to with", "Added per call (p99)", "Throughput loss"], rows: [
          ["memory", "1.06 ms to 1.50 ms", "0.04 ms", "3.4%"],
          ["DBOS", "1.0037 s to 1.0037 s", "< 0.01 ms", "0.0%"],
          ["Temporal", "2.355 s to 2.353 s", "none", "0.0%"],
          ["remote journal", "42.7 ms to 35.7 ms", "none", "-3.0%"],
        ] },
        { kind: "p", text: "The same table shows what the abstraction hides: a run on DBOS takes about a second for ten stub calls. The notes attribute that to its queue polling, which also hides the cost of the read. The port gives the same behaviour. It does not give the same latency." },
        { kind: "callout", tone: "note", text: "The draft's acceptance criterion was a soak with 100 kill -9 during runs, 0 lost runs, 0 duplicated side effects. I did not find a record of that soak in the files I read, so I am not claiming it was run." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Por qué el motor durable queda detrás de un port",
  summary: "El registro de decisión del motor durable de nagare: dos motores detrás de una interfaz, las alternativas rechazadas, lo que costó la elección y lo que mostraron las primeras mediciones.",
  sections: [
    {
      id: "decision",
      title: "La decisión",
      blocks: [
        { kind: "p", text: "El 2026-11-07 el borrador de investigación WF-ADR-002 propuso que nagare alcance la durabilidad solo a través de una interfaz de Go, con un motor por defecto y un segundo mantenido como ciudadano de primera clase. El ADR del motor se aceptó el mismo día. Esto es lo que eligió, lo que rechazó y lo que costó." },
        { kind: "list", items: [
          "El intérprete habla con un contexto durable con los hooks Step, Sleep, WaitFor, Child, Now, NewID y continue-as-new. El servidor habla con un motor con Start, Signal, Cancel y similares.",
          "DBOS Transact es el valor por defecto: una librería de Go sobre el mismo Postgres, de modo que v1 es un binario más Postgres.",
          "Temporal es de primera clase desde la primera versión, mantenido en verde por una suite de tests diferencial. El borrador fija un disparador para pasar producción a él: carga sostenida por encima de 2,000 transiciones por segundo por cluster, multi-región active-active, o un contrato que lo exija.",
          "Un motor en memoria respalda los tests unitarios y las ejecuciones en seco.",
        ] },
      ],
    },
    {
      id: "alternatives",
      title: "Alternativas que perdieron",
      blocks: [
        { kind: "table", head: ["Opción", "Por qué no"], rows: [
          ["Núcleo en TypeScript sobre los SDK de TS", "el dueño eligió Go, y los SDK de Go cubren las mismas primitivas"],
          ["Temporal como valor por defecto", "cuatro servicios extra y una segunda base de datos en cada instalación desde el primer día"],
          ["Hatchet", "proceso de motor separado; la historia de versionado sin verificar"],
          ["Un motor propio", "reimplementa recuperación, colas, schedules y fork con menos pruebas"],
        ] },
        { kind: "p", text: "La investigación también descartó varios productos por sus términos de licencia para un producto vendido como servicio. Eso es una verificación legal de ajuste hecha sobre las fuentes fechadas en las notas, no un juicio de calidad." },
      ],
    },
    {
      id: "costs",
      title: "Qué cuesta",
      blocks: [
        { kind: "p", text: "Hay que mantener dos adaptadores desde el comienzo, y el mínimo común denominador se filtra. El ADR aceptado registra dos consecuencias que el borrador no tenía." },
        { kind: "list", items: [
          "Una closure no puede ser una activity de Temporal, ya que las activities son funciones registradas con argumentos serializables. Por eso los pasos pasaron a ser comandos con nombre: Step(key, op, args), con handlers en un registro compartido por todos los motores.",
          "El retry nativo del motor está apagado en todos lados. El intérprete es dueño de la semántica de retry, timeouts y cancelación (ADR-0003), así que cada intento de retry es su propio paso. Eso significa más pasos por nodo reintentado, lo que el ADR acepta por paridad.",
        ] },
        { kind: "p", text: "La paridad misma necesita prueba. Una suite diferencial ejecuta cada caso en cada motor y compara eventos normalizados más un ledger de efectos secundarios con una fila por clave de idempotencia. Sus 26 escenarios numerados cubren flujo de control, reintentos, callbacks asíncronos, crash y recuperación, límites e inicio idempotente, además de historiales de Temporal grabados y reproducidos contra el intérprete actual. Por decisión no hay CI: quien cambia el núcleo, los ports o un motor corre la suite localmente antes de mergear, y nada lo obliga." },
      ],
    },
    {
      id: "measured",
      title: "Lo que el port abarató y volvió visible después",
      blocks: [
        { kind: "p", text: "Tener un port hizo posible un tercer motor sin tocar el intérprete: un journal remoto detrás de un plugin, aceptado el 2026-11-13. Una función de control de ejecuciones tuvo entonces un costo medido en cada motor. La lectura del inbox de control de ejecuciones se midió en la máquina de desarrollo el 2026-11-13: 30 workflows de 10 llamadas stub secuenciales, comparados con y sin la lectura." },
        { kind: "table", head: ["Motor", "p99 por ejecución, sin y con", "Agregado por llamada (p99)", "Pérdida de throughput"], rows: [
          ["memory", "1.06 ms to 1.50 ms", "0.04 ms", "3.4%"],
          ["DBOS", "1.0037 s to 1.0037 s", "< 0.01 ms", "0.0%"],
          ["Temporal", "2.355 s to 2.353 s", "none", "0.0%"],
          ["remote journal", "42.7 ms to 35.7 ms", "none", "-3.0%"],
        ] },
        { kind: "p", text: "La misma tabla muestra lo que la abstracción esconde: una ejecución en DBOS toma cerca de un segundo para diez llamadas stub. Las notas lo atribuyen a su polling de cola, que también esconde el costo de la lectura. El port da el mismo comportamiento. No da la misma latencia." },
        { kind: "callout", tone: "note", text: "El criterio de aceptación del borrador era un soak con 100 kill -9 durante ejecuciones, 0 ejecuciones perdidas, 0 efectos secundarios duplicados. No encontré un registro de ese soak en los archivos que leí, así que no afirmo que se haya ejecutado." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Por que o motor durável fica atrás de um port",
  summary: "O registro de decisão do motor durável do nagare: dois motores atrás de uma interface, as alternativas rejeitadas, o que a escolha custou e o que as primeiras medições mostraram.",
  sections: [
    {
      id: "decision",
      title: "A decisão",
      blocks: [
        { kind: "p", text: "Em 2026-11-07 o rascunho de pesquisa WF-ADR-002 propôs que o nagare alcance a durabilidade só por meio de uma interface Go, com um motor como padrão e um segundo mantido como cidadão de primeira classe. O ADR do motor foi aceito no mesmo dia. Isto é o que ele escolheu, o que recusou e o que custou." },
        { kind: "list", items: [
          "O interpretador fala com um contexto durável com os hooks Step, Sleep, WaitFor, Child, Now, NewID e continue-as-new. O servidor fala com um motor com Start, Signal, Cancel e semelhantes.",
          "DBOS Transact é o padrão: uma biblioteca Go sobre o mesmo Postgres, então a v1 é um binário mais Postgres.",
          "Temporal é de primeira classe desde a primeira versão, mantido verde por uma suite de testes diferencial. O rascunho define um gatilho para mover a produção para ele: carga sustentada acima de 2,000 transições por segundo por cluster, multi-região active-active, ou um contrato que o exija.",
          "Um motor em memória sustenta os testes unitários e as execuções a seco.",
        ] },
      ],
    },
    {
      id: "alternatives",
      title: "Alternativas que perderam",
      blocks: [
        { kind: "table", head: ["Opção", "Por que não"], rows: [
          ["Núcleo em TypeScript sobre os SDKs de TS", "o dono escolheu Go, e os SDKs de Go cobrem as mesmas primitivas"],
          ["Temporal como padrão", "quatro serviços extras e um segundo banco de dados em toda instalação desde o primeiro dia"],
          ["Hatchet", "processo de motor separado; história de versionamento não verificada"],
          ["Um motor próprio", "reimplementa recuperação, filas, schedules e fork com menos testes"],
        ] },
        { kind: "p", text: "A pesquisa também descartou vários produtos pelos termos de licença para um produto vendido como serviço. Isso é uma checagem legal de adequação feita sobre as fontes datadas nas notas, não um julgamento de qualidade." },
      ],
    },
    {
      id: "costs",
      title: "O que custa",
      blocks: [
        { kind: "p", text: "Dois adaptadores precisam ser mantidos desde o começo, e o menor denominador comum vaza. O ADR aceito registra duas consequências que o rascunho não tinha." },
        { kind: "list", items: [
          "Uma closure não pode ser uma activity do Temporal, já que activities são funções registradas com argumentos serializáveis. Por isso os passos viraram comandos nomeados: Step(key, op, args), com handlers em um registro compartilhado por todos os motores.",
          "O retry nativo do motor está desligado em todo lugar. O interpretador é dono da semântica de retry, timeouts e cancelamento (ADR-0003), então cada tentativa de retry é seu próprio passo. Isso significa mais passos por nó repetido, o que o ADR aceita em nome da paridade.",
        ] },
        { kind: "p", text: "A paridade em si precisa de prova. Uma suite diferencial roda cada caso em cada motor e compara eventos normalizados mais um ledger de efeitos colaterais com uma linha por chave de idempotência. Seus 26 cenários numerados cobrem fluxo de controle, tentativas, callbacks assíncronos, crash e recuperação, limites e início idempotente, além de históricos do Temporal gravados e reproduzidos contra o interpretador atual. Por decisão não há CI: quem muda o núcleo, os ports ou um motor roda a suite localmente antes de mergear, e nada obriga isso." },
      ],
    },
    {
      id: "measured",
      title: "O que o port depois tornou barato e visível",
      blocks: [
        { kind: "p", text: "Ter um port tornou possível um terceiro motor sem tocar no interpretador: um journal remoto atrás de um plugin, aceito em 2026-11-13. Uma funcionalidade de controle de execuções passou então a ter um custo medido em cada motor. A leitura do inbox de controle de execuções foi medida na máquina de desenvolvimento em 2026-11-13: 30 workflows de 10 chamadas stub sequenciais, comparados com e sem a leitura." },
        { kind: "table", head: ["Motor", "p99 por execução, sem e com", "Acrescentado por chamada (p99)", "Perda de throughput"], rows: [
          ["memory", "1.06 ms to 1.50 ms", "0.04 ms", "3.4%"],
          ["DBOS", "1.0037 s to 1.0037 s", "< 0.01 ms", "0.0%"],
          ["Temporal", "2.355 s to 2.353 s", "none", "0.0%"],
          ["remote journal", "42.7 ms to 35.7 ms", "none", "-3.0%"],
        ] },
        { kind: "p", text: "A mesma tabela mostra o que a abstração esconde: uma execução no DBOS leva cerca de um segundo para dez chamadas stub. As notas atribuem isso ao polling de fila, que também esconde o custo da leitura. O port dá o mesmo comportamento. Não dá a mesma latência." },
        { kind: "callout", tone: "note", text: "O critério de aceitação do rascunho era um soak com 100 kill -9 durante execuções, 0 execuções perdidas, 0 efeitos colaterais duplicados. Não encontrei registro desse soak nos arquivos que li, então não afirmo que foi executado." },
      ],
    },
  ],
};
