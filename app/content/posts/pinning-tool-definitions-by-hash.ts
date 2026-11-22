import type { Post } from "./types";

const post: Post = {
  slug: "pinning-tool-definitions-by-hash",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "How tool definitions get pinned",
  summary: "A tool server can rewrite its own descriptions after you approved it. Five mechanisms from a scout of gateways, and what connector-engine does: an RFC 8785 hash per definition, quarantine on change, stale permissions.",
  tags: ["mcp", "pinning", "security", "gateway", "rfc-8785"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem",
      blocks: [
        { kind: "p", text: "An agent decides what to call from the tool's name, description and input schema. All three come from the tool server. The MCP spec (2026-07-28 tools page) says a server answering tools/list must return the set currently available to the requesting client, and that the set may change over time. It does not require a client to compare the new listing with the one it cached." },
        { kind: "p", text: "So a server you approved on Monday can ship a different description on Tuesday, and nothing in the protocol tells you. This record comes from a scout I ran on 2026-11-20 for the connector-engine controls study. Sources are vendor docs and project READMEs read through a fetch tool, which the record marks medium confidence." },
      ],
    },
    {
      id: "mechanisms",
      title: "Five mechanisms in the wild",
      blocks: [
        { kind: "table", head: ["Source", "What it does"], rows: [
          ["DigitalOcean Action Gateway", "Tool versions are numbered. A call can pin <tool>@<version>; unpinned calls pick up new versions as soon as they are released."],
          ["LiteLLM MCP", "An admin pins a server. The snapshot stores name, description and input schema. Drift raises an alert naming added, removed and changed tools; re-pin accepts it; calls to tools added after the pin return 403."],
          ["mcp-context-protector (Trail of Bits)", "Trust on first use of server instructions, tool descriptions and input schemas; blocks downstream calls until the change is approved in the CLI."],
          ["MCP SEP-3452 (issue)", "Clients would record a SHA-256 digest of each description and require re-approval on change. Closed as completed on 2026-10-26 with a note that proposals need working-group engagement first."],
          ["Cloudflare MCP portals", "Upstream changes arrive through a periodic sync. The scout found no review or diff step documented."],
        ] },
        { kind: "p", text: "The LiteLLM docs, as read through the fetch tool, do not mention hashing: the pin is a stored copy compared on re-list. That is a design difference, not a flaw. A stored copy gives you a readable diff; a hash gives you a cheap equality check and something to bind other records to." },
      ],
    },
    {
      id: "engine",
      title: "What connector-engine does",
      blocks: [
        { kind: "p", text: "Per its docs, each function definition is hashed when captured, using RFC 8785 canonical JSON. A new function, or a changed description or schema, is quarantined until a person accepts it. A permission made against an older hash goes stale and needs confirming again. Re-lists run on a schedule between two configured bounds (pinning.relistMin and pinning.relistMax), so a server that changes its tools after install is caught." },
        { kind: "code", lang: "sh", code: "vsh admin functions accept <connector id> <function name>", caption: "Accepting the current definition through the API, with a tenant admin token." },
        { kind: "p", text: "In the console a quarantined function says the definition changed. Choosing on or ask accepts it. Server instructions can be pinned too (gateway.relayInstructions: pinned), kept with the connector and quarantined again on change." },
      ],
    },
    {
      id: "call-hash",
      title: "The hash does a second job: the call hash",
      blocks: [
        { kind: "p", text: "The definition hash feeds a call hash: the RFC 8785 SHA-256 of tenant, agent, connector, function, definition hash and arguments. An approval is bound to it, so an approved call cannot silently become a call to a changed tool." },
        { kind: "p", text: "The study read this code at commit 905a503 and found properties worth knowing about any canonical-JSON hash. Numbers are re-encoded as IEEE 754 doubles, so 1 and 1.0 hash the same and integers above 2^53 collapse together. Duplicate object keys: the last value wins silently, a Go decoding behaviour the note says it did not execute. The bytes hashed were not the bytes sealed and forwarded, so two different payloads could share one call hash." },
        { kind: "p", text: "The current architecture notes say the gateway now parses arguments once before the token scan, the schema check and the call hash, and refuses an object that repeats a key at any depth, a top-level value that is not an object, and data after the top-level value. I have not re-run the original probe against that change." },
      ],
    },
    {
      id: "limits",
      title: "Limits of pinning",
      blocks: [
        { kind: "list", items: [
          "A pin proves the definition did not change, not that the first version was honest. Trust on first use is still trust.",
          "A hash says changed or not. It says nothing about whether the change matters. The study's judged design added a definition diff for that, and that part was not built; the work was paused by the owner on 2026-11-21 with only the permission change log storage merged.",
          "Hypothesis: a semantic comparison, which the mcp-context-protector README says it uses, could cut noise from harmless edits, but a person still has to read what changed.",
        ] },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Cómo se fijan las definiciones de herramientas",
  summary: "Un servidor de herramientas puede reescribir sus propias descripciones después de que lo aprobaste. Cinco mecanismos de un relevamiento de gateways, y qué hace connector-engine: un hash RFC 8785 por definición, cuarentena ante cambios y permisos obsoletos.",
  sections: [
    {
      id: "problem",
      title: "El problema",
      blocks: [
        { kind: "p", text: "Un agente decide qué llamar a partir del nombre, la descripción y el esquema de entrada de la herramienta. Los tres vienen del servidor de herramientas. La especificación de MCP (página de tools 2026-07-28) dice que un servidor que responde a tools/list debe devolver el conjunto disponible en ese momento para el cliente que consulta, y que ese conjunto puede cambiar con el tiempo. No exige que un cliente compare el nuevo listado con el que tenía en caché." },
        { kind: "p", text: "Así, un servidor que aprobaste el lunes puede publicar otra descripción el martes, y nada en el protocolo te avisa. Este registro sale de un relevamiento que hice el 2026-11-20 para el estudio de controles de connector-engine. Las fuentes son documentación de proveedores y READMEs de proyectos leídos con una herramienta de fetch, lo que el registro marca como confianza media." },
      ],
    },
    {
      id: "mechanisms",
      title: "Cinco mecanismos en la práctica",
      blocks: [
        { kind: "table", head: ["Fuente", "Qué hace"], rows: [
          ["DigitalOcean Action Gateway", "Las versiones de las herramientas están numeradas. Una llamada puede fijar <tool>@<version>; las llamadas sin fijar toman las versiones nuevas apenas se publican."],
          ["LiteLLM MCP", "Un admin fija un servidor. La instantánea guarda nombre, descripción y esquema de entrada. La deriva dispara una alerta que nombra las herramientas agregadas, quitadas y cambiadas; volver a fijar la acepta; las llamadas a herramientas agregadas después del pin devuelven 403."],
          ["mcp-context-protector (Trail of Bits)", "Confianza en el primer uso de las instrucciones del servidor, las descripciones de herramientas y los esquemas de entrada; bloquea las llamadas siguientes hasta que el cambio se aprueba en la CLI."],
          ["MCP SEP-3452 (issue)", "Los clientes registrarían un digest SHA-256 de cada descripción y exigirían una nueva aprobación ante un cambio. Cerrado como completado el 2026-10-26 con una nota de que las propuestas necesitan primero participación del grupo de trabajo."],
          ["Cloudflare MCP portals", "Los cambios upstream llegan por una sincronización periódica. El relevamiento no encontró ningún paso de revisión o diff documentado."],
        ] },
        { kind: "p", text: "La documentación de LiteLLM, tal como la leí con la herramienta de fetch, no menciona hashing: el pin es una copia guardada que se compara al volver a listar. Es una diferencia de diseño, no un defecto. Una copia guardada da un diff legible; un hash da una comparación de igualdad barata y algo a lo que atar otros registros." },
      ],
    },
    {
      id: "engine",
      title: "Qué hace connector-engine",
      blocks: [
        { kind: "p", text: "Según su documentación, cada definición de función se hashea al capturarse, con JSON canónico RFC 8785. Una función nueva, o una descripción o esquema modificado, queda en cuarentena hasta que una persona la acepte. Un permiso hecho contra un hash anterior queda obsoleto y hay que confirmarlo de nuevo. Los re-listados corren programados entre dos límites configurados (pinning.relistMin y pinning.relistMax), de modo que se detecta un servidor que cambia sus herramientas después de la instalación." },
        { kind: "code", lang: "sh", code: "vsh admin functions accept <connector id> <function name>", caption: "Aceptar la definición actual mediante la API, con un token de admin del tenant." },
        { kind: "p", text: "En la consola, una función en cuarentena indica que la definición cambió. Elegir on o ask la acepta. Las instrucciones del servidor también se pueden fijar (gateway.relayInstructions: pinned), se guardan con el conector y vuelven a cuarentena ante un cambio." },
      ],
    },
    {
      id: "call-hash",
      title: "El hash hace un segundo trabajo: el hash de la llamada",
      blocks: [
        { kind: "p", text: "El hash de la definición alimenta un hash de la llamada: el SHA-256 RFC 8785 de tenant, agente, conector, función, hash de la definición y argumentos. Una aprobación queda atada a él, así que una llamada aprobada no puede convertirse en silencio en una llamada a una herramienta modificada." },
        { kind: "p", text: "El estudio leyó este código en el commit 905a503 y encontró propiedades que conviene conocer de cualquier hash de JSON canónico. Los números se recodifican como doubles IEEE 754, así que 1 y 1.0 dan el mismo hash y los enteros por encima de 2^53 colapsan entre sí. Claves de objeto duplicadas: gana el último valor en silencio, un comportamiento de decodificación de Go que la nota dice no haber ejecutado. Los bytes hasheados no eran los bytes sellados y reenviados, así que dos payloads distintos podían compartir un hash de llamada." },
        { kind: "p", text: "Las notas de arquitectura actuales dicen que el gateway ahora parsea los argumentos una vez antes del escaneo de tokens, la validación del esquema y el hash de la llamada, y rechaza un objeto que repite una clave a cualquier profundidad, un valor de nivel superior que no es un objeto y datos después del valor de nivel superior. No volví a correr la sonda original contra ese cambio." },
      ],
    },
    {
      id: "limits",
      title: "Límites del pinning",
      blocks: [
        { kind: "list", items: [
          "Un pin prueba que la definición no cambió, no que la primera versión fuera honesta. La confianza en el primer uso sigue siendo confianza.",
          "Un hash dice cambió o no. No dice si el cambio importa. El diseño juzgado del estudio agregaba un diff de definiciones para eso, y esa parte no se construyó; el dueño pausó el trabajo el 2026-11-21 con solo el almacenamiento del registro de cambios de permisos mergeado.",
          "Hipótesis: una comparación semántica, que el README de mcp-context-protector dice usar, podría reducir el ruido de ediciones inofensivas, pero una persona igual tiene que leer qué cambió.",
        ] },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Como as definições de ferramentas são fixadas",
  summary: "Um servidor de ferramentas pode reescrever as próprias descrições depois de você aprová-lo. Cinco mecanismos de um levantamento de gateways, e o que o connector-engine faz: um hash RFC 8785 por definição, quarentena em caso de mudança e permissões obsoletas.",
  sections: [
    {
      id: "problem",
      title: "O problema",
      blocks: [
        { kind: "p", text: "Um agente decide o que chamar a partir do nome, da descrição e do esquema de entrada da ferramenta. Os três vêm do servidor de ferramentas. A especificação do MCP (página de tools de 2026-07-28) diz que um servidor que responde a tools/list deve devolver o conjunto disponível no momento para o cliente que perguntou, e que esse conjunto pode mudar com o tempo. Ela não exige que o cliente compare a nova listagem com a que guardou em cache." },
        { kind: "p", text: "Assim, um servidor que você aprovou na segunda pode publicar outra descrição na terça, e nada no protocolo avisa. Este registro vem de um levantamento que fiz em 2026-11-20 para o estudo de controles do connector-engine. As fontes são documentação de fornecedores e READMEs de projetos lidos com uma ferramenta de fetch, o que o registro marca como confiança média." },
      ],
    },
    {
      id: "mechanisms",
      title: "Cinco mecanismos na prática",
      blocks: [
        { kind: "table", head: ["Fonte", "O que faz"], rows: [
          ["DigitalOcean Action Gateway", "As versões das ferramentas são numeradas. Uma chamada pode fixar <tool>@<version>; chamadas sem fixar pegam as versões novas assim que são lançadas."],
          ["LiteLLM MCP", "Um admin fixa um servidor. O snapshot guarda nome, descrição e esquema de entrada. A deriva gera um alerta que nomeia as ferramentas adicionadas, removidas e alteradas; fixar de novo aceita; chamadas a ferramentas adicionadas depois do pin retornam 403."],
          ["mcp-context-protector (Trail of Bits)", "Confiança no primeiro uso das instruções do servidor, das descrições das ferramentas e dos esquemas de entrada; bloqueia as chamadas seguintes até a mudança ser aprovada na CLI."],
          ["MCP SEP-3452 (issue)", "Os clientes registrariam um digest SHA-256 de cada descrição e exigiriam nova aprovação em caso de mudança. Fechada como concluída em 2026-10-26 com a observação de que propostas precisam antes de engajamento do grupo de trabalho."],
          ["Cloudflare MCP portals", "As mudanças upstream chegam por uma sincronização periódica. O levantamento não encontrou nenhuma etapa de revisão ou diff documentada."],
        ] },
        { kind: "p", text: "A documentação do LiteLLM, como li pela ferramenta de fetch, não menciona hashing: o pin é uma cópia guardada comparada ao listar de novo. É uma diferença de design, não um defeito. Uma cópia guardada dá um diff legível; um hash dá uma checagem de igualdade barata e algo a que amarrar outros registros." },
      ],
    },
    {
      id: "engine",
      title: "O que o connector-engine faz",
      blocks: [
        { kind: "p", text: "Segundo a documentação, cada definição de função é hasheada quando capturada, usando JSON canônico RFC 8785. Uma função nova, ou uma descrição ou esquema alterado, fica em quarentena até uma pessoa aceitar. Uma permissão feita contra um hash mais antigo fica obsoleta e precisa ser confirmada de novo. Os re-listados rodam agendados entre dois limites configurados (pinning.relistMin e pinning.relistMax), então um servidor que muda suas ferramentas depois da instalação é detectado." },
        { kind: "code", lang: "sh", code: "vsh admin functions accept <connector id> <function name>", caption: "Aceitar a definição atual pela API, com um token de admin do tenant." },
        { kind: "p", text: "No console, uma função em quarentena avisa que a definição mudou. Escolher on ou ask aceita. As instruções do servidor também podem ser fixadas (gateway.relayInstructions: pinned), guardadas junto do conector e colocadas em quarentena de novo em caso de mudança." },
      ],
    },
    {
      id: "call-hash",
      title: "O hash faz um segundo trabalho: o hash da chamada",
      blocks: [
        { kind: "p", text: "O hash da definição alimenta um hash da chamada: o SHA-256 RFC 8785 de tenant, agente, conector, função, hash da definição e argumentos. Uma aprovação fica atada a ele, então uma chamada aprovada não pode virar, sem aviso, uma chamada a uma ferramenta alterada." },
        { kind: "p", text: "O estudo leu este código no commit 905a503 e encontrou propriedades que vale conhecer de qualquer hash de JSON canônico. Números são recodificados como doubles IEEE 754, então 1 e 1.0 geram o mesmo hash e inteiros acima de 2^53 colapsam entre si. Chaves de objeto duplicadas: o último valor vence em silêncio, um comportamento de decodificação do Go que a nota diz não ter executado. Os bytes hasheados não eram os bytes selados e encaminhados, então dois payloads diferentes podiam compartilhar um hash de chamada." },
        { kind: "p", text: "As notas de arquitetura atuais dizem que o gateway agora faz o parse dos argumentos uma vez antes da varredura de tokens, da checagem do esquema e do hash da chamada, e recusa um objeto que repete uma chave em qualquer profundidade, um valor de nível superior que não seja objeto e dados depois do valor de nível superior. Não rodei de novo a sonda original contra essa mudança." },
      ],
    },
    {
      id: "limits",
      title: "Limites do pinning",
      blocks: [
        { kind: "list", items: [
          "Um pin prova que a definição não mudou, não que a primeira versão era honesta. Confiança no primeiro uso continua sendo confiança.",
          "Um hash diz mudou ou não. Não diz se a mudança importa. O design julgado do estudo adicionava um diff de definição para isso, e essa parte não foi construída; o trabalho foi pausado pelo dono em 2026-11-21 com apenas o armazenamento do log de mudanças de permissão mergeado.",
          "Hipótese: uma comparação semântica, que o README do mcp-context-protector diz usar, poderia reduzir o ruído de edições inofensivas, mas uma pessoa ainda precisa ler o que mudou.",
        ] },
      ],
    },
  ],
};
