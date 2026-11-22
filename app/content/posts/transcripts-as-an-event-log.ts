import type { Post } from "./types";

const post: Post = {
  slug: "transcripts-as-an-event-log",
  category: "studies",
  date: "2026-11-07",
  published: "2026-11-21",
  title: "A transcript is an event log",
  summary: "No protocol both drives an agent CLI and lets you own the conversation. What the vendor formats disagree on, and a proposal, not a build, for an append-only event stream with gap-free sequence numbers.",
  tags: ["agents", "transcripts", "event-log", "acp", "postgres"],
  project: "versatile-sh",
  sections: [
    {
      id: "question",
      title: "The question",
      blocks: [
        { kind: "p", text: "Is there a middle ground between ACP and the vendor message APIs that lets a platform keep conversations on its own side, for both model APIs and agent CLIs? The study ran on 2026-11-07 and 2026-11-08, reading source at pinned versions: Claude Code 2.1.319 and its Agent SDK 0.3.319, the Codex repository at d960b36, ACP schema 1.29.1 at 7441d10, the Anthropic SDK 1.6.0, the OpenAI SDK 7.53.0, and others." },
        { kind: "p", text: "The answer, as its record states: no protocol both talks to CLIs and holds a conversation you own. The observed fact is that resume depends on each engine's own native record. What follows the answer is a proposal." },
      ],
    },
    {
      id: "formats",
      title: "What the formats disagree on",
      blocks: [
        { kind: "table", head: ["Source", "Container"], rows: [
          ["Anthropic Messages", "A message with content blocks; system is a request parameter, not a message"],
          ["OpenAI Responses", "A flat list of typed items; a message is one item kind among many"],
          ["ACP v1", "No message object: a stream of session/update notifications, chunks grouped by message id"],
          ["Claude Agent SDK stream-json", "A union of 40 frame types"],
          ["Codex exec --json", "Thread, turn and item events; item kinds instead of roles"],
        ] },
        { kind: "p", text: "Reasoning is where they split most. Anthropic carries a readable thinking block with a signature, plus redacted thinking. OpenAI has reasoning summaries and optional encrypted content. ACP has thought chunks and no opaque reasoning at all. Codex does not expose it on the exec stream, though it keeps encrypted content in its own rollout. A store that wants to switch engine mid-conversation has to decide what to do with a blob only one provider can read." },
        { kind: "p", text: "A hypothesis the study left open for a test with a real key: whether the provider-specific encrypted blobs validate only for the same organisation and model family." },
      ],
    },
    {
      id: "streams",
      title: "Replay is not a log",
      blocks: [
        { kind: "p", text: "LangChain's Agent Protocol keeps a checkpoint history per thread, which its README calls an append-only log of states. Its thread streaming, by contrast, says servers may keep a ring buffer of recent events and, if a client's position was evicted, the client resyncs through state. The study's reading: live-stream replay is best effort, and the durable record is the checkpoint history." },
        { kind: "p", text: "That distinction is the point of this post. A transcript that people reconnect to, branch from and audit needs the durable thing, with the stream as a view over it." },
      ],
    },
    {
      id: "proposal",
      title: "The proposal: an item stream with an envelope",
      blocks: [
        { kind: "p", text: "Proposed, not built: an item stream modelled on Open Responses with ACP's tool-call fields, the raw provider payload kept beside each item, and official ACP adapters behind one Go ACP client. For live sync, a design note proposes an event envelope per conversation." },
        { kind: "table", head: ["Field", "Role"], rows: [
          ["seq", "Per conversation, gap-free, assigned in the append transaction so a client can detect loss"],
          ["id", "ULID, globally unique; the SSE event id"],
          ["causation_id", "The input or command that caused the event"],
          ["idempotency_key", "Client message id, or producer lease, attempt and sequence"],
          ["producer", "id, epoch, sequence; a stale epoch is rejected (fencing)"],
          ["occurred_at", "Producer clock, diagnostic only, never used to order"],
        ] },
        { kind: "code", lang: "sql", code: "UPDATE conversation SET head_seq = head_seq + 1 WHERE id = $1 RETURNING head_seq;", caption: "The sequence rule from the note: a row lock on one conversation, so writes serialise per conversation and nowhere else." },
        { kind: "p", text: "Token deltas would not be rows: they carry a position inside the open part and are ephemeral, with a snapshot of the open part sent on reconnect. Inputs are events too, with modes queue, steer and interrupt, and one lease holder drives a conversation at a time." },
      ],
    },
    {
      id: "evidence",
      title: "What was run and what was not",
      blocks: [
        { kind: "p", text: "Vendor formats, CLIs and other products were read from source. The schema is specified only. The live-session behaviour of Claude Code, Codex, Goose and ACP adapters was run offline against local mock model servers with fake keys, and most of the checks were confirmed. A Go driver spike confirmed steering, signed approvals and resume over the official claude-agent-acp and codex-acp adapters." },
        { kind: "callout", tone: "warn", text: "Open: whether injecting items into a fresh Codex thread is enough to continue a conversation stored only in your own database, and whether a daemon may drive a subscription-logged-in Claude Code, which is a terms question for the vendors. The sequence and envelope design is a proposal with no measurement behind it." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Una transcripción es un event log",
  summary: "Ningún protocolo maneja una CLI de agente y a la vez te deja ser dueño de la conversación. En qué discrepan los formatos de los proveedores, y una propuesta, no un build, de un stream de eventos append-only con números de secuencia sin huecos.",
  sections: [
    {
      id: "question",
      title: "La pregunta",
      blocks: [
        { kind: "p", text: "¿Hay un punto medio entre ACP y las APIs de mensajes de los proveedores que permita a una plataforma mantener las conversaciones de su lado, tanto para APIs de modelos como para CLIs de agentes? El estudio corrió el 2026-11-07 y el 2026-11-08, leyendo código fuente en versiones fijadas: Claude Code 2.1.319 y su Agent SDK 0.3.319, el repositorio de Codex en d960b36, el esquema ACP 1.29.1 en 7441d10, el SDK de Anthropic 1.6.0, el SDK de OpenAI 7.53.0, y otros." },
        { kind: "p", text: "La respuesta, tal como la enuncia su registro: ningún protocolo habla con CLIs y a la vez mantiene una conversación que sea tuya. El hecho observado es que el resume depende del registro nativo de cada motor. Lo que sigue a la respuesta es una propuesta." },
      ],
    },
    {
      id: "formats",
      title: "En qué discrepan los formatos",
      blocks: [
        { kind: "table", head: ["Fuente", "Contenedor"], rows: [
          ["Anthropic Messages", "Un mensaje con bloques de contenido; system es un parámetro de la solicitud, no un mensaje"],
          ["OpenAI Responses", "Una lista plana de ítems tipados; un mensaje es un tipo de ítem entre muchos"],
          ["ACP v1", "Sin objeto de mensaje: un stream de notificaciones session/update, con chunks agrupados por id de mensaje"],
          ["Claude Agent SDK stream-json", "Una unión de 40 tipos de frame"],
          ["Codex exec --json", "Eventos de thread, turn e item; tipos de ítem en lugar de roles"],
        ] },
        { kind: "p", text: "El razonamiento es donde más se separan. Anthropic lleva un bloque thinking legible con una firma, más thinking redactado. OpenAI tiene resúmenes de razonamiento y contenido cifrado opcional. ACP tiene chunks de pensamiento y ningún razonamiento opaco. Codex no lo expone en el stream de exec, aunque guarda contenido cifrado en su propio rollout. Un almacén que quiera cambiar de motor a mitad de conversación tiene que decidir qué hacer con un blob que solo un proveedor puede leer." },
        { kind: "p", text: "Una hipótesis que el estudio dejó abierta para probar con una clave real: si los blobs cifrados específicos de cada proveedor se validan solo para la misma organización y familia de modelos." },
      ],
    },
    {
      id: "streams",
      title: "Replay no es un log",
      blocks: [
        { kind: "p", text: "El Agent Protocol de LangChain guarda un historial de checkpoints por thread, que su README llama un log append-only de estados. Su streaming de threads, en cambio, dice que los servidores pueden mantener un ring buffer de eventos recientes y que, si la posición de un cliente fue desalojada, el cliente se resincroniza a través del estado. La lectura del estudio: el replay del stream en vivo es de mejor esfuerzo, y el registro durable es el historial de checkpoints." },
        { kind: "p", text: "Esa distinción es el punto de este post. Una transcripción a la que la gente se reconecta, de la que bifurca y que audita necesita lo durable, con el stream como una vista sobre ello." },
      ],
    },
    {
      id: "proposal",
      title: "La propuesta: un stream de ítems con un envelope",
      blocks: [
        { kind: "p", text: "Propuesto, no construido: un stream de ítems modelado sobre Open Responses con los campos de tool-call de ACP, el payload crudo del proveedor guardado junto a cada ítem y adaptadores ACP oficiales detrás de un único cliente ACP en Go. Para la sincronización en vivo, una nota de diseño propone un envelope de eventos por conversación." },
        { kind: "table", head: ["Campo", "Rol"], rows: [
          ["seq", "Por conversación, sin huecos, asignado en la transacción de append para que un cliente pueda detectar pérdidas"],
          ["id", "ULID, único globalmente; el id de evento SSE"],
          ["causation_id", "La entrada o comando que causó el evento"],
          ["idempotency_key", "Id de mensaje del cliente, o lease del productor, intento y secuencia"],
          ["producer", "id, epoch, secuencia; un epoch obsoleto se rechaza (fencing)"],
          ["occurred_at", "Reloj del productor, solo diagnóstico, nunca se usa para ordenar"],
        ] },
        { kind: "code", lang: "sql", code: "UPDATE conversation SET head_seq = head_seq + 1 WHERE id = $1 RETURNING head_seq;", caption: "La regla de secuencia de la nota: un lock de fila sobre una conversación, de modo que las escrituras se serializan por conversación y en ningún otro lado." },
        { kind: "p", text: "Los deltas de tokens no serían filas: llevan una posición dentro de la parte abierta y son efímeros, con un snapshot de la parte abierta enviado al reconectar. Las entradas también son eventos, con modos queue, steer e interrupt, y un solo titular del lease maneja una conversación a la vez." },
      ],
    },
    {
      id: "evidence",
      title: "Qué se ejecutó y qué no",
      blocks: [
        { kind: "p", text: "Los formatos de los proveedores, las CLIs y otros productos se leyeron desde el código fuente. El esquema solo está especificado. El comportamiento de sesión en vivo de Claude Code, Codex, Goose y los adaptadores ACP se ejecutó offline contra servidores de modelo simulados locales con claves falsas, y la mayoría de las verificaciones se confirmaron. Un spike de un driver en Go confirmó steering, aprobaciones firmadas y resume sobre los adaptadores oficiales claude-agent-acp y codex-acp." },
        { kind: "callout", tone: "warn", text: "Abierto: si inyectar ítems en un thread nuevo de Codex basta para continuar una conversación guardada solo en tu propia base de datos, y si un daemon puede manejar un Claude Code con sesión de suscripción, que es una cuestión de términos para los proveedores. El diseño de secuencia y envelope es una propuesta sin ninguna medición detrás." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Uma transcrição é um event log",
  summary: "Nenhum protocolo conduz uma CLI de agente e ao mesmo tempo deixa você ser dono da conversa. No que os formatos dos fornecedores divergem, e uma proposta, não um build, de um stream de eventos append-only com números de sequência sem lacunas.",
  sections: [
    {
      id: "question",
      title: "A pergunta",
      blocks: [
        { kind: "p", text: "Existe um meio-termo entre o ACP e as APIs de mensagens dos fornecedores que permita a uma plataforma manter as conversas do seu lado, tanto para APIs de modelos quanto para CLIs de agentes? O estudo rodou em 2026-11-07 e 2026-11-08, lendo código-fonte em versões fixadas: Claude Code 2.1.319 e seu Agent SDK 0.3.319, o repositório do Codex em d960b36, o esquema ACP 1.29.1 em 7441d10, o SDK da Anthropic 1.6.0, o SDK da OpenAI 7.53.0, e outros." },
        { kind: "p", text: "A resposta, como o registro a enuncia: nenhum protocolo fala com CLIs e ao mesmo tempo mantém uma conversa que seja sua. O fato observado é que o resume depende do registro nativo de cada motor. O que vem depois da resposta é uma proposta." },
      ],
    },
    {
      id: "formats",
      title: "No que os formatos divergem",
      blocks: [
        { kind: "table", head: ["Fonte", "Contêiner"], rows: [
          ["Anthropic Messages", "Uma mensagem com blocos de conteúdo; system é um parâmetro da requisição, não uma mensagem"],
          ["OpenAI Responses", "Uma lista plana de itens tipados; uma mensagem é um tipo de item entre vários"],
          ["ACP v1", "Sem objeto de mensagem: um stream de notificações session/update, com chunks agrupados por id de mensagem"],
          ["Claude Agent SDK stream-json", "Uma união de 40 tipos de frame"],
          ["Codex exec --json", "Eventos de thread, turn e item; tipos de item em vez de papéis"],
        ] },
        { kind: "p", text: "O raciocínio é onde eles mais se separam. A Anthropic carrega um bloco thinking legível com uma assinatura, mais thinking redigido. A OpenAI tem resumos de raciocínio e conteúdo criptografado opcional. O ACP tem chunks de pensamento e nenhum raciocínio opaco. O Codex não o expõe no stream do exec, embora guarde conteúdo criptografado no seu próprio rollout. Um armazém que queira trocar de motor no meio da conversa precisa decidir o que fazer com um blob que só um fornecedor consegue ler." },
        { kind: "p", text: "Uma hipótese que o estudo deixou em aberto para testar com uma chave real: se os blobs criptografados específicos de cada fornecedor só validam para a mesma organização e família de modelos." },
      ],
    },
    {
      id: "streams",
      title: "Replay não é um log",
      blocks: [
        { kind: "p", text: "O Agent Protocol do LangChain guarda um histórico de checkpoints por thread, que o README chama de log append-only de estados. O streaming de threads dele, por outro lado, diz que os servidores podem manter um ring buffer de eventos recentes e que, se a posição de um cliente foi descartada, o cliente ressincroniza pelo estado. A leitura do estudo: o replay do stream ao vivo é de melhor esforço, e o registro durável é o histórico de checkpoints." },
        { kind: "p", text: "Essa distinção é o ponto deste post. Uma transcrição à qual as pessoas se reconectam, da qual fazem branch e que auditam precisa do durável, com o stream como uma visão sobre ele." },
      ],
    },
    {
      id: "proposal",
      title: "A proposta: um stream de itens com um envelope",
      blocks: [
        { kind: "p", text: "Proposto, não construído: um stream de itens modelado sobre o Open Responses com os campos de tool-call do ACP, o payload bruto do fornecedor guardado junto de cada item e adaptadores ACP oficiais atrás de um único cliente ACP em Go. Para a sincronização ao vivo, uma nota de design propõe um envelope de eventos por conversa." },
        { kind: "table", head: ["Campo", "Papel"], rows: [
          ["seq", "Por conversa, sem lacunas, atribuído na transação de append para que um cliente detecte perdas"],
          ["id", "ULID, globalmente único; o id de evento SSE"],
          ["causation_id", "A entrada ou comando que causou o evento"],
          ["idempotency_key", "Id de mensagem do cliente, ou lease do produtor, tentativa e sequência"],
          ["producer", "id, epoch, sequência; um epoch obsoleto é rejeitado (fencing)"],
          ["occurred_at", "Relógio do produtor, só diagnóstico, nunca usado para ordenar"],
        ] },
        { kind: "code", lang: "sql", code: "UPDATE conversation SET head_seq = head_seq + 1 WHERE id = $1 RETURNING head_seq;", caption: "A regra de sequência da nota: um lock de linha em uma conversa, de modo que as escritas se serializam por conversa e em nenhum outro lugar." },
        { kind: "p", text: "Os deltas de tokens não seriam linhas: carregam uma posição dentro da parte aberta e são efêmeros, com um snapshot da parte aberta enviado na reconexão. As entradas também são eventos, com modos queue, steer e interrupt, e um único detentor do lease conduz uma conversa por vez." },
      ],
    },
    {
      id: "evidence",
      title: "O que foi executado e o que não foi",
      blocks: [
        { kind: "p", text: "Os formatos dos fornecedores, as CLIs e outros produtos foram lidos a partir do código-fonte. O esquema é apenas especificado. O comportamento de sessão ao vivo do Claude Code, do Codex, do Goose e dos adaptadores ACP foi executado offline contra servidores de modelo simulados locais com chaves falsas, e a maioria das checagens foi confirmada. Um spike de um driver em Go confirmou steering, aprovações assinadas e resume sobre os adaptadores oficiais claude-agent-acp e codex-acp." },
        { kind: "callout", tone: "warn", text: "Em aberto: se injetar itens em uma thread nova do Codex basta para continuar uma conversa guardada apenas no seu próprio banco de dados, e se um daemon pode conduzir um Claude Code logado por assinatura, o que é uma questão de termos com os fornecedores. O design de sequência e envelope é uma proposta sem nenhuma medição por trás." },
      ],
    },
  ],
};
