import type { Post } from "./types";

const post: Post = {
  slug: "hakoniwa-day-one-2026-11-09",
  category: "daily",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "hakoniwa, day one: from ADRs to a world",
  summary: "What the git history of the test engine shows for 2026-11-09: 282 commits in one day, the order things landed in, and the benchmark that did not hit its target.",
  tags: ["hakoniwa", "testing", "devlog"],
  project: "versatile-sh",
  sections: [
    {
      id: "numbers",
      title: "The numbers",
      blocks: [
        { kind: "p", text: "hakoniwa is the test engine. Its repository history starts on 2026-11-09, and 282 commits carry that date: 237 without merges, plus the merges of pull requests #5 to #13. Three non-merge commits are dated the 10th and 38 the 13th." },
        { kind: "p", text: "That is a count of commit dates, not a measure of effort. Many of those commits come from parallel branches merged the same day and named by version: v2, v3, v4, v5." },
      ],
    },
    {
      id: "order",
      title: "The order things landed",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Decisions first", text: "ADR-0001 to ADR-0005 are among the first commits: the neutral core, a run lifecycle owned by the engine with leased workers, admission gates against false tests, the worker and its evidence, and the engineering principles." },
            { title: "Lifecycle and gates", text: "A test state machine where only a person can admit, a run state machine with leases and step-boundary pause, and the admission gates G1 to G5: compile, clean replays, a seeded fault that must turn the test red, assertion provenance, and quiet implicit oracles." },
            { title: "Storage and surfaces", text: "A Postgres schema with forced row-level security, an in-memory store with the same conformance suite, then one operation table served over HTTP, gRPC and MCP, plus a CLI derived from it." },
            { title: "A speed target and a benchmark", text: "ADR-0011 set the goal: at least 50% less wall time and CPU than plain Playwright with the same verdicts. A 17-spec benchmark app and harness followed the same day." },
            { title: "Versions v2 to v5", text: "A commit titled Decide v2 to v5 and plan their build opens the second half of the day: v2 soft steps and check runs, v3 recording runs and locator healing, v4 the world host with a clock seam, fork and quiescence probe, v5 shortcuts, a result cache, suites and a signed inbox." },
            { title: "Spikes on the world", text: "Spikes S8, S10 and S11 measured the clock on Postgres, the quiescence probe and control flake. They are the subject of Testing with a frozen clock." },
          ],
        },
      ],
    },
    {
      id: "benchmark",
      title: "The benchmark, the same day",
      blocks: [
        { kind: "p", text: "The benchmark result landed the same day it was built, and it missed the target. Medians of 3 healthy repetitions, 4 CPUs and 6 GB per container: the engine used 37 to 39% less CPU than plain Playwright, and wall time was within noise at -3 to -5%. The 50% target was not met. The full reading is in a separate post, Where the wall time went." },
      ],
    },
    {
      id: "verification",
      title: "Verification in Docker",
      blocks: [
        { kind: "p", text: "The same day, v2 and v3 were verified in a container with a script replaying fixed actions over the HTTP API and no model. The v3 run recorded five sessions, compiled them, passed gates G1 to G5 and replayed them, with 0 tokens spent. A renamed test id turned a replay into healed with one locator proposal, which a person accepted." },
        { kind: "p", text: "It also found five bugs in the v2 and v3 code. The one I like best: the runner kept the metadata of its first configuration, so the second and later runs of a worker got no evidence directory. The fix reads the current run file at test time." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "hakoniwa-day-one-2026-11-09",
  category: "daily",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "hakoniwa, día uno: de los ADRs a un mundo",
  summary: "Lo que muestra el historial git del engine de tests para el 2026-11-09: 282 commits en un día, el orden en que fue llegando todo y el benchmark que no alcanzó su meta.",
  tags: ["hakoniwa", "testing", "devlog"],
  project: "versatile-sh",
  sections: [
    {
      id: "numbers",
      title: "Los números",
      blocks: [
        { kind: "p", text: "hakoniwa es el engine de tests. La historia de su repositorio empieza el 2026-11-09, y 282 commits llevan esa fecha: 237 sin merges, más los merges de los pull requests #5 a #13. Tres commits sin merge llevan fecha del día 10 y 38 del 13." },
        { kind: "p", text: "Eso es un conteo de fechas de commits, no una medida de esfuerzo. Muchos de esos commits vienen de ramas paralelas mergeadas el mismo día y nombradas por versión: v2, v3, v4, v5." },
      ],
    },
    {
      id: "order",
      title: "El orden en que llegó todo",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Primero las decisiones", text: "ADR-0001 a ADR-0005 están entre los primeros commits: el núcleo neutral, un ciclo de vida de ejecución propiedad del engine con workers arrendados, gates de admisión contra tests falsos, el worker y su evidencia, y los principios de ingeniería." },
            { title: "Ciclo de vida y gates", text: "Una máquina de estados de tests donde solo una persona puede admitir, una máquina de estados de ejecuciones con leases y pausa en el límite de un paso, y los gates de admisión G1 a G5: compilar, replays limpios, una falla sembrada que debe poner el test en rojo, procedencia de las aserciones y oráculos implícitos silenciosos." },
            { title: "Almacenamiento y superficies", text: "Un schema de Postgres con row-level security forzada, un store en memoria con la misma suite de conformance, luego una tabla de operaciones servida por HTTP, gRPC y MCP, más una CLI derivada de ella." },
            { title: "Una meta de velocidad y un benchmark", text: "ADR-0011 fijó el objetivo: al menos 50% menos de wall time y CPU que Playwright plano con los mismos veredictos. Un benchmark de 17 specs, con su app y su harness, siguió el mismo día." },
            { title: "Versiones v2 a v5", text: "Un commit titulado Decide v2 to v5 and plan their build abre la segunda mitad del día: v2 soft steps y check runs, v3 recording runs y locator healing, v4 el world host con un seam de reloj, fork y quiescence probe, v5 shortcuts, un result cache, suites y un inbox firmado." },
            { title: "Spikes sobre el mundo", text: "Los spikes S8, S10 y S11 midieron el reloj en Postgres, el quiescence probe y el control flake. Son el tema de Testing with a frozen clock." },
          ],
        },
      ],
    },
    {
      id: "benchmark",
      title: "El benchmark, el mismo día",
      blocks: [
        { kind: "p", text: "El resultado del benchmark llegó el mismo día en que se construyó, y no alcanzó la meta. Medianas de 3 repeticiones sanas, 4 CPUs y 6 GB por contenedor: el engine usó de 37 a 39% menos CPU que Playwright plano, y el wall time quedó dentro del ruido, de -3 a -5%. La meta de 50% no se cumplió. La lectura completa está en otro post, Where the wall time went." },
      ],
    },
    {
      id: "verification",
      title: "Verificación en Docker",
      blocks: [
        { kind: "p", text: "El mismo día, v2 y v3 se verificaron en un contenedor con un script que reproducía acciones fijas sobre la API HTTP y ningún modelo. La ejecución de v3 grabó cinco sesiones, las compiló, pasó los gates G1 a G5 y las reprodujo, con 0 tokens gastados. Un id de test renombrado convirtió un replay en healed con una propuesta de locator, que una persona aceptó." },
        { kind: "p", text: "También encontró cinco bugs en el código de v2 y v3. El que más me gusta: el runner conservaba los metadatos de su primera configuración, así que la segunda ejecución y las siguientes de un worker no recibían directorio de evidencia. La corrección lee el archivo de la ejecución actual en el momento del test." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "hakoniwa-day-one-2026-11-09",
  category: "daily",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "hakoniwa, dia um: dos ADRs a um mundo",
  summary: "O que o histórico git do engine de testes mostra para 2026-11-09: 282 commits em um dia, a ordem em que as coisas foram chegando e o benchmark que não atingiu a meta.",
  tags: ["hakoniwa", "testing", "devlog"],
  project: "versatile-sh",
  sections: [
    {
      id: "numbers",
      title: "Os números",
      blocks: [
        { kind: "p", text: "hakoniwa é o engine de testes. A história do repositório começa em 2026-11-09, e 282 commits levam essa data: 237 sem merges, mais os merges dos pull requests #5 a #13. Três commits sem merge são datados do dia 10 e 38 do dia 13." },
        { kind: "p", text: "Isso é uma contagem de datas de commit, não uma medida de esforço. Muitos desses commits vêm de branches paralelas mergeadas no mesmo dia e nomeadas por versão: v2, v3, v4, v5." },
      ],
    },
    {
      id: "order",
      title: "A ordem em que as coisas chegaram",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Decisões primeiro", text: "ADR-0001 a ADR-0005 estão entre os primeiros commits: o núcleo neutro, um ciclo de vida de execução de propriedade do engine com workers alugados, gates de admissão contra testes falsos, o worker e sua evidência, e os princípios de engenharia." },
            { title: "Ciclo de vida e gates", text: "Uma máquina de estados de testes em que só uma pessoa pode admitir, uma máquina de estados de execuções com leases e pausa na fronteira de um passo, e os gates de admissão G1 a G5: compilar, replays limpos, uma falha semeada que deve deixar o teste vermelho, procedência das asserções e oráculos implícitos silenciosos." },
            { title: "Armazenamento e superfícies", text: "Um schema de Postgres com row-level security forçada, um store em memória com a mesma suíte de conformance, depois uma tabela de operações servida por HTTP, gRPC e MCP, mais uma CLI derivada dela." },
            { title: "Uma meta de velocidade e um benchmark", text: "ADR-0011 definiu o objetivo: pelo menos 50% menos de wall time e CPU que o Playwright puro com os mesmos veredictos. Um benchmark de 17 specs, com app e harness, veio no mesmo dia." },
            { title: "Versões v2 a v5", text: "Um commit intitulado Decide v2 to v5 and plan their build abre a segunda metade do dia: v2 soft steps e check runs, v3 recording runs e locator healing, v4 o world host com um seam de relógio, fork e quiescence probe, v5 shortcuts, um result cache, suites e um inbox assinado." },
            { title: "Spikes sobre o mundo", text: "Os spikes S8, S10 e S11 mediram o relógio no Postgres, o quiescence probe e o control flake. São o assunto de Testing with a frozen clock." },
          ],
        },
      ],
    },
    {
      id: "benchmark",
      title: "O benchmark, no mesmo dia",
      blocks: [
        { kind: "p", text: "O resultado do benchmark chegou no mesmo dia em que foi construído, e não atingiu a meta. Medianas de 3 repetições saudáveis, 4 CPUs e 6 GB por container: o engine usou de 37 a 39% menos CPU que o Playwright puro, e o wall time ficou dentro do ruído, de -3 a -5%. A meta de 50% não foi atingida. A leitura completa está em outro post, Where the wall time went." },
      ],
    },
    {
      id: "verification",
      title: "Verificação em Docker",
      blocks: [
        { kind: "p", text: "No mesmo dia, v2 e v3 foram verificados em um container com um script que reproduzia ações fixas pela API HTTP e nenhum modelo. A execução do v3 gravou cinco sessões, as compilou, passou nos gates G1 a G5 e as reproduziu, com 0 tokens gastos. Um id de teste renomeado transformou um replay em healed com uma proposta de locator, que uma pessoa aceitou." },
        { kind: "p", text: "Também achou cinco bugs no código de v2 e v3. O de que mais gosto: o runner guardava os metadados da sua primeira configuração, então a segunda execução e as seguintes de um worker ficavam sem diretório de evidência. A correção lê o arquivo da execução atual na hora do teste." },
      ],
    },
  ],
};
