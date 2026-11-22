import type { Post } from "./types";

const post: Post = {
  slug: "channel-apis-what-a-matrix-of-29-products-did-not-decide",
  category: "studies",
  date: "2026-11-17",
  published: "2026-11-21",
  title: "Channel APIs: what a 29-product matrix did not decide",
  summary: "A study of chat channel APIs for people and agents: 62 features across 29 products, three spikes that were only type checks, and a result that did not separate our own vocabulary from Matrix. With the proof levels.",
  tags: ["channels", "api-design", "matrix", "agents", "research"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "The question",
      blocks: [
        { kind: "p", text: "Two linked studies, 2026-11-16 and 2026-11-17. The first asked what a channel should be in an agent engine so the same screen works with people and several agents in it. The second asked which resource model and semantics the channel API should expose over the engine's existing wire." },
        { kind: "p", text: "Starting point, observed from code: a channel screen worked against an older runtime, the new engine served it only one direct message per agent, and the engine's core had no channel concept." },
      ],
    },
    {
      id: "evidence",
      title: "How much evidence, and of which kind",
      blocks: [
        { kind: "p", text: "The record keeps four proof levels per cell: read (code or type package), specified (a published API description), run, and hypothesis. After round 5 of the second study, derived by a script on 2026-11-17:" },
        { kind: "table", head: ["Item", "Count"], rows: [
          ["Products", "29 (15 direct, 14 indirect)"],
          ["Features", "62, of which 27 tagged as deciding"],
          ["Feature cells", "1,308"],
          ["Cells at read / specified / run / hypothesis", "316 / 929 / 0 / 63"],
          ["API vocabulary matrix", "9 candidates, 15 axes, 135 cells"],
        ] },
        { kind: "p", text: "Zero cells at run is the honest headline. The three spikes (57 scenarios over 5 vocabularies, with type checks and 58 tests green) ran only as type checks of the study's own transcription of each vendor wire, in an in-process model. They touched no vendor server, no vendor SDK and not our engine." },
        { kind: "p", text: "Audit error ended at 0.065 against a target under 5 percent, so that criterion was not met. Every market cell has one source, and integrator demand is, in the record's words, a hypothesis." },
      ],
    },
    {
      id: "result",
      title: "The result",
      blocks: [
        { kind: "p", text: "Observed: the matrix and spikes do not separate our own vocabulary from Matrix's, and Discord's scores four points worse. That is a statement about this scoring, which I did not independently validate." },
        { kind: "p", text: "The owner ruled on 2026-11-17: an own resource model over the existing wire, with names borrowed from vendor spec files (Matrix, Discord, Zulip), and a per-person feed of change hints with no id and no replay, built after the channel log. Designed, not built." },
        { kind: "p", text: "The first study had recommended a room with a timeline and one child conversation per agent and thread, in four phases. The second study found the room-based paths and access path did not hold and recommended a new channel log with the same mechanics." },
      ],
    },
    {
      id: "open",
      title: "Questions still open",
      blocks: [
        { kind: "list", items: [
          "Edit, delete and erasure on an append-only log. Recommendation: edits and deletes are events, delete hides, and erasure needs an event-level erase that ships with the channel log.",
          "Discord-like permissions. Recommendation: publish no permission object until a single authorizer enforces it, then start with allow-only tuples on a channel resource.",
          "Where a channel's timeline lives: a new channel log accessed through a channel resource type in the one authorizer.",
          "Whether an agent's session is per thread (recommended) or per channel, and who answers a message that names no agent: the thread's agent, else the room's auto-reply agent, else nobody.",
        ] },
        { kind: "p", text: "All four are recommendations awaiting a decision, not rulings." },
      ],
    },
    {
      id: "lesson",
      title: "What I would carry forward",
      blocks: [
        { kind: "p", text: "A wide matrix is cheap to fill and expensive to trust. The useful part was the split by proof level: it made visible that 929 of 1,308 cells rested on a published description of an interface, not on running anything. A decision between two vocabularies that score within a few points of each other is a decision about fit with your own wire, and the matrix cannot make it." },
        { kind: "callout", tone: "note", text: "Hypothesis, mine: an executable spike against one real vendor server would have been worth more than the second half of the matrix. I have not tested that." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "channel-apis-what-a-matrix-of-29-products-did-not-decide",
  category: "studies",
  date: "2026-11-17",
  published: "2026-11-21",
  title: "APIs de canal: lo que una matriz de 29 productos no decidió",
  summary: "Un estudio de APIs de canal de chat para personas y agentes: 62 características en 29 productos, tres spikes que fueron solo type checks, y un resultado que no separó nuestro propio vocabulario de Matrix. Con los niveles de prueba.",
  tags: ["channels", "api-design", "matrix", "agents", "research"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "La pregunta",
      blocks: [
        { kind: "p", text: "Dos estudios enlazados, 2026-11-16 y 2026-11-17. El primero preguntó qué debería ser un canal en un engine de agentes para que la misma pantalla funcione con personas y varios agentes dentro. El segundo preguntó qué modelo de recursos y qué semántica debería exponer la API de canal sobre el wire existente del engine." },
        { kind: "p", text: "Punto de partida, observado en el código: una pantalla de canal funcionaba contra un runtime anterior, el nuevo engine solo le servía un mensaje directo por agente, y el núcleo del engine no tenía concepto de canal." },
      ],
    },
    {
      id: "evidence",
      title: "Cuánta evidencia, y de qué tipo",
      blocks: [
        { kind: "p", text: "El registro guarda cuatro niveles de prueba por celda: read (código o paquete de tipos), specified (una descripción de API publicada), run e hypothesis. Tras la ronda 5 del segundo estudio, derivado por un script el 2026-11-17:" },
        { kind: "table", head: ["Elemento", "Cantidad"], rows: [
          ["Productos", "29 (15 directos, 14 indirectos)"],
          ["Características", "62, de las cuales 27 marcadas como decisivas"],
          ["Celdas de características", "1,308"],
          ["Celdas en read / specified / run / hypothesis", "316 / 929 / 0 / 63"],
          ["Matriz de vocabulario de API", "9 candidatos, 15 ejes, 135 celdas"],
        ] },
        { kind: "p", text: "Cero celdas en run es el titular honesto. Los tres spikes (57 escenarios sobre 5 vocabularios, con type checks y 58 tests en verde) se ejecutaron solo como type checks de la propia transcripción del estudio de cada wire de proveedor, en un modelo en proceso. No tocaron ningún servidor de proveedor, ningún SDK de proveedor ni nuestro engine." },
        { kind: "p", text: "El error de auditoría terminó en 0,065 frente a una meta por debajo de 5 por ciento, así que ese criterio no se cumplió. Cada celda de mercado tiene una fuente, y la demanda de integradores es, en palabras del registro, una hipótesis." },
      ],
    },
    {
      id: "result",
      title: "El resultado",
      blocks: [
        { kind: "p", text: "Observado: la matriz y los spikes no separan nuestro propio vocabulario del de Matrix, y el de Discord puntúa cuatro puntos peor. Es una afirmación sobre esta puntuación, que no validé de forma independiente." },
        { kind: "p", text: "El owner decidió el 2026-11-17: un modelo de recursos propio sobre el wire existente, con nombres tomados de archivos de especificación de proveedores (Matrix, Discord, Zulip), y un feed por persona de pistas de cambio sin id y sin replay, construido después del channel log. Diseñado, no construido." },
        { kind: "p", text: "El primer estudio había recomendado una room con timeline y una conversación hija por agente y por hilo, en cuatro fases. El segundo estudio encontró que los caminos basados en room y el camino de acceso no se sostenían y recomendó un nuevo channel log con la misma mecánica." },
      ],
    },
    {
      id: "open",
      title: "Preguntas aún abiertas",
      blocks: [
        { kind: "list", items: [
          "Editar, borrar y eliminar definitivamente en un log append-only. Recomendación: las ediciones y los borrados son eventos, borrar oculta, y la eliminación definitiva necesita un erase a nivel de evento que llegue con el channel log.",
          "Permisos al estilo Discord. Recomendación: no publicar ningún objeto de permisos hasta que un único authorizer lo aplique, y entonces empezar con tuplas solo-allow sobre un recurso de canal.",
          "Dónde vive el timeline de un canal: un nuevo channel log accedido mediante un tipo de recurso de canal en el único authorizer.",
          "Si la sesión de un agente es por hilo (recomendado) o por canal, y quién responde a un mensaje que no nombra a ningún agente: el agente del hilo, si no el agente de auto-respuesta de la room, si no nadie.",
        ] },
        { kind: "p", text: "Las cuatro son recomendaciones a la espera de una decisión, no resoluciones." },
      ],
    },
    {
      id: "lesson",
      title: "Qué me llevaría",
      blocks: [
        { kind: "p", text: "Una matriz ancha es barata de llenar y cara de creer. Lo útil fue la separación por nivel de prueba: hizo visible que 929 de 1,308 celdas descansaban en la descripción publicada de una interfaz, no en ejecutar nada. Una decisión entre dos vocabularios que puntúan a pocos puntos de distancia es una decisión sobre el encaje con tu propio wire, y la matriz no puede tomarla." },
        { kind: "callout", tone: "note", text: "Hipótesis, mía: un spike ejecutable contra un servidor real de un proveedor habría valido más que la segunda mitad de la matriz. No lo he probado." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "channel-apis-what-a-matrix-of-29-products-did-not-decide",
  category: "studies",
  date: "2026-11-17",
  published: "2026-11-21",
  title: "APIs de canal: o que uma matriz de 29 produtos não decidiu",
  summary: "Um estudo de APIs de canal de chat para pessoas e agentes: 62 características em 29 produtos, três spikes que foram só type checks, e um resultado que não separou nosso próprio vocabulário do Matrix. Com os níveis de prova.",
  tags: ["channels", "api-design", "matrix", "agents", "research"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "A pergunta",
      blocks: [
        { kind: "p", text: "Dois estudos ligados, 2026-11-16 e 2026-11-17. O primeiro perguntou o que um canal deveria ser em um engine de agentes para que a mesma tela funcione com pessoas e vários agentes dentro. O segundo perguntou qual modelo de recursos e quais semânticas a API de canal deveria expor sobre o wire existente do engine." },
        { kind: "p", text: "Ponto de partida, observado no código: uma tela de canal funcionava contra um runtime anterior, o novo engine só servia a ela uma mensagem direta por agente, e o núcleo do engine não tinha conceito de canal." },
      ],
    },
    {
      id: "evidence",
      title: "Quanta evidência, e de que tipo",
      blocks: [
        { kind: "p", text: "O registro guarda quatro níveis de prova por célula: read (código ou pacote de tipos), specified (uma descrição de API publicada), run e hypothesis. Após a rodada 5 do segundo estudo, derivado por um script em 2026-11-17:" },
        { kind: "table", head: ["Item", "Quantidade"], rows: [
          ["Produtos", "29 (15 diretos, 14 indiretos)"],
          ["Características", "62, das quais 27 marcadas como decisivas"],
          ["Células de características", "1,308"],
          ["Células em read / specified / run / hypothesis", "316 / 929 / 0 / 63"],
          ["Matriz de vocabulário de API", "9 candidatos, 15 eixos, 135 células"],
        ] },
        { kind: "p", text: "Zero células em run é a manchete honesta. Os três spikes (57 cenários sobre 5 vocabulários, com type checks e 58 testes verdes) rodaram apenas como type checks da própria transcrição do estudo de cada wire de fornecedor, em um modelo em processo. Não tocaram nenhum servidor de fornecedor, nenhum SDK de fornecedor nem o nosso engine." },
        { kind: "p", text: "O erro de auditoria terminou em 0,065 contra uma meta abaixo de 5 por cento, então esse critério não foi atingido. Cada célula de mercado tem uma fonte, e a demanda de integradores é, nas palavras do registro, uma hipótese." },
      ],
    },
    {
      id: "result",
      title: "O resultado",
      blocks: [
        { kind: "p", text: "Observado: a matriz e os spikes não separam nosso próprio vocabulário do do Matrix, e o do Discord pontua quatro pontos pior. É uma afirmação sobre esta pontuação, que não validei de forma independente." },
        { kind: "p", text: "O owner decidiu em 2026-11-17: um modelo de recursos próprio sobre o wire existente, com nomes emprestados de arquivos de especificação de fornecedores (Matrix, Discord, Zulip), e um feed por pessoa de dicas de mudança sem id e sem replay, construído depois do channel log. Projetado, não construído." },
        { kind: "p", text: "O primeiro estudo havia recomendado uma room com timeline e uma conversa filha por agente e por thread, em quatro fases. O segundo estudo descobriu que os caminhos baseados em room e o caminho de acesso não se sustentavam e recomendou um novo channel log com a mesma mecânica." },
      ],
    },
    {
      id: "open",
      title: "Perguntas ainda abertas",
      blocks: [
        { kind: "list", items: [
          "Editar, apagar e eliminar definitivamente em um log append-only. Recomendação: edições e exclusões são eventos, apagar oculta, e a eliminação definitiva precisa de um erase em nível de evento que chegue junto com o channel log.",
          "Permissões no estilo Discord. Recomendação: não publicar nenhum objeto de permissão até que um único authorizer o aplique, e então começar com tuplas só-allow sobre um recurso de canal.",
          "Onde vive o timeline de um canal: um novo channel log acessado por um tipo de recurso de canal no único authorizer.",
          "Se a sessão de um agente é por thread (recomendado) ou por canal, e quem responde a uma mensagem que não nomeia nenhum agente: o agente da thread, senão o agente de resposta automática da room, senão ninguém.",
        ] },
        { kind: "p", text: "As quatro são recomendações aguardando decisão, não decisões." },
      ],
    },
    {
      id: "lesson",
      title: "O que eu levaria adiante",
      blocks: [
        { kind: "p", text: "Uma matriz larga é barata de preencher e cara de confiar. A parte útil foi a separação por nível de prova: ela tornou visível que 929 de 1,308 células se apoiavam na descrição publicada de uma interface, não em rodar algo. Uma decisão entre dois vocabulários que pontuam a poucos pontos de distância é uma decisão sobre o encaixe com o seu próprio wire, e a matriz não consegue tomá-la." },
        { kind: "callout", tone: "note", text: "Hipótese, minha: um spike executável contra um servidor real de um fornecedor teria valido mais que a segunda metade da matriz. Não testei isso." },
      ],
    },
  ],
};
