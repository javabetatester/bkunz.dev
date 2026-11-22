import type { Post } from "./types";

const post: Post = {
  slug: "reading-notes-scylladb-shard-per-core",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Reading notes: ScyllaDB's shard-per-core design",
  summary: "Notes on public material, not my benchmarks: what ScyllaDB and Seastar say about one shard per core, per-core memory and no locks, and what that does and does not tell you about tail latency.",
  tags: ["scylladb", "seastar", "tail-latency", "reading-notes", "architecture"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-this-is",
      title: "What this is",
      blocks: [
        { kind: "p", text: "These are reading notes on public documentation. I did not run ScyllaDB or Seastar, and every number below comes from a page I link, with the conditions that page states. Where I draw an implication, I mark it as my reading." },
        { kind: "list", items: [
          "ScyllaDB, shard-per-core architecture: https://www.scylladb.com/product/technology/shard-per-core-architecture/",
          "Seastar, shared-nothing design: https://seastar.io/shared-nothing/",
          "Seastar tutorial: https://docs.seastar.io/master/tutorial.html",
          "Dean and Barroso, The Tail at Scale (abstract page): https://research.google/pubs/the-tail-at-scale/",
        ] },
        { kind: "p", text: "Fetched on 2026-11-21. The tutorial is a long page and I read only its first part and a later slice, so I quote only what I saw." },
      ],
    },
    {
      id: "model",
      title: "The model, as the sources state it",
      blocks: [
        { kind: "p", text: "ScyllaDB's page says each core runs one shard that owns a slice of the data. Data is partitioned across the cluster by token range, then, in the page's words, the shards within each node are mapped to vCPUs bound to specific cores. Each of those has its own dedicated resources, including a separate cache, memtables and SSTables, and its own networking I/O channel." },
        { kind: "p", text: "Seastar, the framework underneath, describes the same thing from the programming side. It shards requests onto individual cores and runs one application thread per core, with communication by explicit message passing, not shared memory between threads. The tutorial says the available memory is divided between the cores and each core works on data in its own part of memory. Each thread is preallocated a large piece of memory, on the NUMA node it runs on." },
        { kind: "table", head: ["Claim", "Where"], rows: [
          ["One application thread per core; requests sharded onto cores", "seastar.io/shared-nothing"],
          ["Memory divided between cores; each works in its own part", "Seastar tutorial, introduction"],
          ["Inter-core communication by explicit message passing; resources shared across cores must be handled explicitly", "ScyllaDB page and Seastar page"],
          ["smp::submit_to(cpu, lambda) runs a lambda on another core and returns a future", "seastar.io/shared-nothing"],
        ] },
      ],
    },
    {
      id: "locks",
      title: "Why no locks",
      blocks: [
        { kind: "p", text: "The tutorial gives the reason in one sentence: unscalable programming practices such as taking locks can devastate performance on many cores. It adds that shared-memory and lock-free primitives are dramatically slower than operations on data in a single core's cache, because multi-core machines penalise atomic instructions, cache-line bouncing and memory fences." },
        { kind: "p", text: "Careful reading matters here. Seastar's page does not claim the system is entirely lock-free. It says the design avoids slow, unscalable lock primitives and cache bounces, provides facilities that limit cross-core communication, and offers non-blocking primitives for when communication is unavoidable. The example it gives: two requests from the same session land on different CPUs and depend on the same session state, so one CPU explicitly forwards the request to the other." },
        { kind: "p", text: "One number from the Seastar page, with its conditions: a budget of 1670 clock cycles per packet, for a 2 GHz processor handling 1024-byte packets at wire speed on a 10 Gbps network. The page attributes that figure to an Intel DPDK overview. It explains the pressure the design answers, not a ScyllaDB measurement." },
      ],
    },
    {
      id: "numbers",
      title: "Numbers, and what they do not tell you",
      blocks: [
        { kind: "list", items: [
          "The tutorial reports that a Cassandra rewrite on Seastar gained up to a tenfold throughput increase, as well as significantly lower and more consistent latencies. No hardware or workload is given on that page.",
          "ScyllaDB's main page says the design lets it scale to millions of operations per second, sustaining sub-millisecond average latencies, even with regional and global replication. A menu item says predictable single-digit millisecond latencies. Neither states hardware, cluster size or workload.",
          "Tutorial defaults: one engine thread per hardware thread; a task quota of 500 microseconds, after which a task yields at preemption points; a reactor can stall when a task runs a long time without yielding, with more than 20 ms given as an example.",
          "Memory: all memory except an OS reservation is preallocated by default, and the reservation defaults to the larger of 1.5G or 7% of total memory.",
        ] },
        { kind: "callout", tone: "warn", text: "None of the latency figures here are benchmarks I can compare. They are claims without stated conditions, and the averages quoted say nothing about the tail." },
      ],
    },
    {
      id: "tail",
      title: "What it implies for tail latency: my reading",
      blocks: [
        { kind: "p", text: "The Tail at Scale abstract says it is challenging to keep the tail of the latency distribution low for interactive services, and that temporary high-latency episodes that are unimportant in moderate-size systems may come to dominate at large scale. The abstract page carries no percentile figures, so I quote none." },
        { kind: "p", text: "Hypotheses, mine, not from the sources. First, a shard is a single execution lane, so anything that holds a core without yielding delays every request owned by that core. That is consistent with the tutorial's warning that continuations must not block, but I have not measured it. Second, skew becomes a tail problem: a hot key concentrates load on one shard while the other cores idle, and no lock was ever involved. Third, a request that needs two shards pays a message hop and the slower of the two queues." },
        { kind: "p", text: "What I would test before believing any of this: one workload, one machine, per-shard queue depth next to client-side p99, with the hot-key case run on purpose. I have not run it." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Notas de lectura: el diseño shard-per-core de ScyllaDB",
  summary: "Notas sobre material público, no sobre mis benchmarks: qué dicen ScyllaDB y Seastar sobre un shard por core, memoria por core y ausencia de locks, y qué dice y qué no dice eso sobre la latencia de cola.",
  sections: [
    {
      id: "what-this-is",
      title: "Qué es esto",
      blocks: [
        { kind: "p", text: "Son notas de lectura sobre documentación pública. No corrí ScyllaDB ni Seastar, y cada número de abajo viene de una página que enlazo, con las condiciones que esa página indica. Donde saco una implicación, la marco como lectura mía." },
        { kind: "list", items: [
          "ScyllaDB, shard-per-core architecture: https://www.scylladb.com/product/technology/shard-per-core-architecture/",
          "Seastar, shared-nothing design: https://seastar.io/shared-nothing/",
          "Seastar tutorial: https://docs.seastar.io/master/tutorial.html",
          "Dean and Barroso, The Tail at Scale (abstract page): https://research.google/pubs/the-tail-at-scale/",
        ] },
        { kind: "p", text: "Consultadas el 2026-11-21. El tutorial es una página larga y leí solo su primera parte y un fragmento posterior, así que cito solo lo que vi." },
      ],
    },
    {
      id: "model",
      title: "El modelo, tal como lo exponen las fuentes",
      blocks: [
        { kind: "p", text: "La página de ScyllaDB dice que cada core ejecuta un shard que posee una porción de los datos. Los datos se particionan en el cluster por rango de tokens y, en palabras de la página, los shards dentro de cada nodo se asignan a vCPUs atados a cores específicos. Cada uno tiene sus propios recursos dedicados, incluidos un caché separado, memtables y SSTables, y su propio canal de I/O de red." },
        { kind: "p", text: "Seastar, el framework de base, describe lo mismo desde el lado de la programación. Reparte las solicitudes en cores individuales y ejecuta un thread de aplicación por core, con comunicación por paso de mensajes explícito, no por memoria compartida entre threads. El tutorial dice que la memoria disponible se divide entre los cores y cada core trabaja con datos en su propia parte de la memoria. A cada thread se le preasigna un gran bloque de memoria, en el nodo NUMA en el que corre." },
        { kind: "table", head: ["Afirmación", "Dónde"], rows: [
          ["Un thread de aplicación por core; solicitudes repartidas en cores", "seastar.io/shared-nothing"],
          ["Memoria dividida entre cores; cada uno trabaja en su propia parte", "Seastar tutorial, introducción"],
          ["Comunicación entre cores por paso de mensajes explícito; los recursos compartidos entre cores deben manejarse explícitamente", "Página de ScyllaDB y página de Seastar"],
          ["smp::submit_to(cpu, lambda) ejecuta una lambda en otro core y devuelve un future", "seastar.io/shared-nothing"],
        ] },
      ],
    },
    {
      id: "locks",
      title: "Por qué sin locks",
      blocks: [
        { kind: "p", text: "El tutorial da la razón en una frase: prácticas de programación no escalables, como tomar locks, pueden devastar el rendimiento en muchos cores. Agrega que las primitivas de memoria compartida y lock-free son drásticamente más lentas que las operaciones sobre datos en el caché de un solo core, porque las máquinas multi-core penalizan las instrucciones atómicas, el rebote de líneas de caché y las barreras de memoria." },
        { kind: "p", text: "Aquí importa leer con cuidado. La página de Seastar no afirma que el sistema sea totalmente lock-free. Dice que el diseño evita primitivas de lock lentas y no escalables y los rebotes de caché, ofrece facilidades que limitan la comunicación entre cores y provee primitivas no bloqueantes para cuando la comunicación es inevitable. El ejemplo que da: dos solicitudes de la misma sesión caen en CPUs distintas y dependen del mismo estado de sesión, así que un CPU reenvía explícitamente la solicitud al otro." },
        { kind: "p", text: "Un número de la página de Seastar, con sus condiciones: un presupuesto de 1670 ciclos de reloj por paquete, para un procesador de 2 GHz que maneja paquetes de 1024 bytes a velocidad de línea en una red de 10 Gbps. La página atribuye esa cifra a una presentación de Intel DPDK. Explica la presión a la que responde el diseño, no es una medición de ScyllaDB." },
      ],
    },
    {
      id: "numbers",
      title: "Números, y lo que no dicen",
      blocks: [
        { kind: "list", items: [
          "El tutorial informa que una reescritura de Cassandra sobre Seastar logró hasta diez veces más throughput, además de latencias significativamente más bajas y más consistentes. Esa página no da hardware ni carga de trabajo.",
          "La página principal de ScyllaDB dice que el diseño le permite escalar a millones de operaciones por segundo, sosteniendo latencias promedio submilisegundo, incluso con replicación regional y global. Un ítem de menú dice latencias predecibles de un solo dígito en milisegundos. Ninguno indica hardware, tamaño de cluster ni carga de trabajo.",
          "Valores por defecto del tutorial: un thread de motor por thread de hardware; una cuota de tarea de 500 microsegundos, tras la cual una tarea cede en los puntos de preemption; un reactor puede trabarse cuando una tarea corre mucho tiempo sin ceder, con más de 20 ms como ejemplo.",
          "Memoria: toda la memoria excepto una reserva del SO se preasigna por defecto, y la reserva por defecto es el mayor entre 1.5G o 7% de la memoria total.",
        ] },
        { kind: "callout", tone: "warn", text: "Ninguna de las cifras de latencia aquí son benchmarks que pueda comparar. Son afirmaciones sin condiciones declaradas, y los promedios citados no dicen nada sobre la cola." },
      ],
    },
    {
      id: "tail",
      title: "Qué implica para la latencia de cola: mi lectura",
      blocks: [
        { kind: "p", text: "El abstract de The Tail at Scale dice que es difícil mantener baja la cola de la distribución de latencia en servicios interactivos, y que episodios temporales de alta latencia sin importancia en sistemas de tamaño moderado pueden llegar a dominar a gran escala. La página del abstract no trae cifras de percentiles, así que no cito ninguna." },
        { kind: "p", text: "Hipótesis mías, no de las fuentes. Primero, un shard es un único carril de ejecución, así que cualquier cosa que retenga un core sin ceder retrasa cada solicitud que pertenece a ese core. Es coherente con la advertencia del tutorial de que las continuations no deben bloquear, pero no lo medí. Segundo, el sesgo se vuelve un problema de cola: una hot key concentra la carga en un shard mientras los otros cores están ociosos, sin que haya intervenido ningún lock. Tercero, una solicitud que necesita dos shards paga un salto de mensaje y la más lenta de las dos colas." },
        { kind: "p", text: "Lo que probaría antes de creer cualquiera de esto: una carga de trabajo, una máquina, la profundidad de cola por shard junto al p99 del lado del cliente, con el caso de hot key ejecutado a propósito. No lo corrí." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Notas de leitura: o design shard-per-core do ScyllaDB",
  summary: "Notas sobre material público, não sobre meus benchmarks: o que ScyllaDB e Seastar dizem sobre um shard por core, memória por core e ausência de locks, e o que isso diz e não diz sobre a latência de cauda.",
  sections: [
    {
      id: "what-this-is",
      title: "O que é isto",
      blocks: [
        { kind: "p", text: "Estas são notas de leitura sobre documentação pública. Não rodei ScyllaDB nem Seastar, e cada número abaixo vem de uma página que linko, com as condições que essa página informa. Onde tiro uma implicação, marco como leitura minha." },
        { kind: "list", items: [
          "ScyllaDB, shard-per-core architecture: https://www.scylladb.com/product/technology/shard-per-core-architecture/",
          "Seastar, shared-nothing design: https://seastar.io/shared-nothing/",
          "Seastar tutorial: https://docs.seastar.io/master/tutorial.html",
          "Dean and Barroso, The Tail at Scale (abstract page): https://research.google/pubs/the-tail-at-scale/",
        ] },
        { kind: "p", text: "Consultadas em 2026-11-21. O tutorial é uma página longa e li só a primeira parte e um trecho posterior, então cito apenas o que vi." },
      ],
    },
    {
      id: "model",
      title: "O modelo, como as fontes o descrevem",
      blocks: [
        { kind: "p", text: "A página do ScyllaDB diz que cada core roda um shard que é dono de uma fatia dos dados. Os dados são particionados no cluster por faixa de tokens e, nas palavras da página, os shards dentro de cada nó são mapeados para vCPUs presos a cores específicos. Cada um tem seus próprios recursos dedicados, incluindo um cache separado, memtables e SSTables, e seu próprio canal de I/O de rede." },
        { kind: "p", text: "O Seastar, o framework por baixo, descreve a mesma coisa do lado da programação. Ele distribui as requisições em cores individuais e roda uma thread de aplicação por core, com comunicação por troca explícita de mensagens, não por memória compartilhada entre threads. O tutorial diz que a memória disponível é dividida entre os cores e cada core trabalha com dados na sua própria parte da memória. Cada thread recebe pré-alocado um grande pedaço de memória, no nó NUMA em que roda." },
        { kind: "table", head: ["Afirmação", "Onde"], rows: [
          ["Uma thread de aplicação por core; requisições distribuídas pelos cores", "seastar.io/shared-nothing"],
          ["Memória dividida entre os cores; cada um trabalha na sua própria parte", "Seastar tutorial, introdução"],
          ["Comunicação entre cores por troca explícita de mensagens; recursos compartilhados entre cores devem ser tratados explicitamente", "Página do ScyllaDB e página do Seastar"],
          ["smp::submit_to(cpu, lambda) roda uma lambda em outro core e devolve um future", "seastar.io/shared-nothing"],
        ] },
      ],
    },
    {
      id: "locks",
      title: "Por que sem locks",
      blocks: [
        { kind: "p", text: "O tutorial dá a razão em uma frase: práticas de programação não escaláveis, como tomar locks, podem devastar o desempenho em muitos cores. Ele acrescenta que primitivas de memória compartilhada e lock-free são dramaticamente mais lentas que operações sobre dados no cache de um único core, porque máquinas multi-core penalizam instruções atômicas, o pingue-pongue de linhas de cache e as barreiras de memória." },
        { kind: "p", text: "Aqui importa ler com cuidado. A página do Seastar não afirma que o sistema seja totalmente lock-free. Ela diz que o design evita primitivas de lock lentas e não escaláveis e os pingue-pongues de cache, oferece facilidades que limitam a comunicação entre cores e fornece primitivas não bloqueantes para quando a comunicação é inevitável. O exemplo que dá: duas requisições da mesma sessão caem em CPUs diferentes e dependem do mesmo estado de sessão, então um CPU encaminha explicitamente a requisição para o outro." },
        { kind: "p", text: "Um número da página do Seastar, com suas condições: um orçamento de 1670 ciclos de clock por pacote, para um processador de 2 GHz tratando pacotes de 1024 bytes na velocidade da linha em uma rede de 10 Gbps. A página atribui esse valor a uma apresentação da Intel sobre DPDK. Ele explica a pressão a que o design responde, não é uma medição do ScyllaDB." },
      ],
    },
    {
      id: "numbers",
      title: "Números, e o que eles não dizem",
      blocks: [
        { kind: "list", items: [
          "O tutorial relata que uma reescrita do Cassandra sobre Seastar teve ganho de até dez vezes em throughput, além de latências significativamente menores e mais consistentes. Essa página não dá hardware nem carga de trabalho.",
          "A página principal do ScyllaDB diz que o design permite escalar para milhões de operações por segundo, sustentando latências médias abaixo de um milissegundo, mesmo com replicação regional e global. Um item de menu diz latências previsíveis de um dígito em milissegundos. Nenhum informa hardware, tamanho de cluster nem carga de trabalho.",
          "Padrões do tutorial: uma thread de motor por thread de hardware; uma cota de tarefa de 500 microssegundos, após a qual a tarefa cede nos pontos de preempção; um reactor pode travar quando uma tarefa roda muito tempo sem ceder, com mais de 20 ms dado como exemplo.",
          "Memória: toda a memória exceto uma reserva do SO é pré-alocada por padrão, e a reserva padrão é o maior entre 1.5G ou 7% da memória total.",
        ] },
        { kind: "callout", tone: "warn", text: "Nenhum dos números de latência aqui são benchmarks que eu consiga comparar. São afirmações sem condições declaradas, e as médias citadas não dizem nada sobre a cauda." },
      ],
    },
    {
      id: "tail",
      title: "O que isso implica para a latência de cauda: minha leitura",
      blocks: [
        { kind: "p", text: "O abstract de The Tail at Scale diz que é difícil manter baixa a cauda da distribuição de latência em serviços interativos, e que episódios temporários de alta latência sem importância em sistemas de tamanho moderado podem passar a dominar em larga escala. A página do abstract não traz números de percentis, então não cito nenhum." },
        { kind: "p", text: "Hipóteses minhas, não das fontes. Primeiro, um shard é uma única pista de execução, então qualquer coisa que segure um core sem ceder atrasa toda requisição pertencente a esse core. Isso é coerente com o aviso do tutorial de que as continuations não podem bloquear, mas não medi. Segundo, o desbalanceamento vira problema de cauda: uma hot key concentra a carga em um shard enquanto os outros cores ficam ociosos, sem nenhum lock envolvido. Terceiro, uma requisição que precisa de dois shards paga um salto de mensagem e a mais lenta das duas filas." },
        { kind: "p", text: "O que eu testaria antes de acreditar em qualquer disso: uma carga de trabalho, uma máquina, a profundidade de fila por shard ao lado do p99 do lado do cliente, com o caso de hot key rodado de propósito. Não rodei." },
      ],
    },
  ],
};
