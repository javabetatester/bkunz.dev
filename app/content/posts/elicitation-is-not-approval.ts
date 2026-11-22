import type { Post } from "./types";

const post: Post = {
  slug: "elicitation-is-not-approval",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Elicitation is not approval",
  summary: "MCP elicitation collects input from a person. It defines no approval message. What an approval record has to hold, from a code read of connector-engine, and how three gateways ask a human.",
  tags: ["mcp", "approval", "elicitation", "security", "gateway"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-spec-says",
      title: "What the spec says",
      blocks: [
        { kind: "p", text: "These quotes are from the MCP 2026-07-28 elicitation page, fetched on 2026-11-20 for the connector-engine controls study. The same sentences appear in 2025-11-25." },
        { kind: "list", items: [
          "Form mode collects structured data in band, and the data is exposed to the client. URL mode sends the person to an external URL, and data other than the URL is not exposed to the client.",
          "Servers MUST NOT use form mode for passwords, API keys, tokens or payment credentials, and MUST use URL mode for those.",
          "Servers MUST bind elicitation requests to the client and user identity. Clients SHOULD let the user decline at any time.",
          "The response is accept, decline or cancel. Accept means the user consented to the interaction, not that it is complete.",
          "On the tools page: there SHOULD always be a human in the loop able to deny tool invocations.",
        ] },
        { kind: "p", text: "My reading, which the scout note also states: the spec defines no approval message type. Elicitation is generic input collection. Using it for approval is a convention a gateway adds." },
      ],
    },
    {
      id: "gateways",
      title: "How gateways use it",
      blocks: [
        { kind: "table", head: ["Gateway", "How a person approves"], rows: [
          ["DigitalOcean Action Gateway", "Uses elicitation when the client supports it, otherwise a separate approve/deny path with an approval id and expiry. The approval is consumed once and bound to team, endpoint scope, tool version and arguments."],
          ["Composio", "The end user answers. With clients that do not support elicitation, calls that need approval are denied unless a fallback setting is set to allow. Always approve lasts the rest of the session."],
          ["connector-engine", "Out of band: console, chat surfaces and paired desktops. Elicitation is off by default per app."],
        ] },
        { kind: "p", text: "All three descriptions are the vendor describing its own product, read through a fetch tool, so medium confidence. The pattern is that elicitation is the in-band convenience and a second channel is the fallback." },
      ],
    },
    {
      id: "why-out-of-band",
      title: "Why connector-engine keeps it out of band",
      blocks: [
        { kind: "p", text: "The security model lists one thing as out of scope: an agent token holder approving its own call through MCP elicitation, when the owner has turned elicitation on for that app. Think about it from the threat side. If the agent's client relays the question, the agent's client also relays the answer. The party being governed sits in the approval path." },
        { kind: "p", text: "Out of band means the question travels over a channel the agent does not control. Chat surfaces accept clicks only from the configured owner id, link tokens are single-use HMACs, and call arguments stay out of third-party messages." },
      ],
    },
    {
      id: "record",
      title: "What the approval record holds",
      blocks: [
        { kind: "p", text: "The study read the approval code at commit 905a503. Nothing was run. The record carries, among about thirty fields, the definition hash, the class of the function, a call hash, sealed arguments, approvers, mode, state, channel and expiry. The state machine is: pending, then approved, denied, expired or cancelled; approved, then executing or cancelled; executing, then executed, failed or outcome unknown; then delivered once." },
        { kind: "table", head: ["Default", "Value"], rows: [
          ["Approval timeout", "600 s"],
          ["Execute within, after the decision", "60 s, else cancelled as stale"],
          ["Execute grace past the call deadline", "10 s, then outcome unknown"],
          ["Max pending per session, agent and connector", "5"],
        ] },
        { kind: "p", text: "Two choices stand out. A decided approval expires if not executed within 60 seconds, so a click cannot be banked. And an outcome unknown is never retried: the engine does not know whether the side effect happened, so it does not guess." },
        { kind: "p", text: "A repeated call with the same call hash attaches to the open record instead of opening a second one, and an approved call runs once." },
      ],
    },
    {
      id: "found",
      title: "What the read found wrong",
      blocks: [
        { kind: "p", text: "A docs claim said the engine stores only a hash of call arguments. That is true of the audit row. The approval row, however, kept the sealed plaintext until retention ended, which defaults to one hour. The study logged it as doc drift. Its closing note says every defect found by the study was fixed or kept by an owner decision; I did not re-verify each fix." },
        { kind: "callout", tone: "note", text: "The study's nine controls were paused by the owner on 2026-11-21. Only the storage of the permission change log is merged. Treat the designs as a roadmap, not a commitment." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "elicitation-is-not-approval",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Elicitation no es aprobación",
  summary: "La elicitation de MCP recoge entrada de una persona. No define ningún mensaje de aprobación. Qué tiene que guardar un registro de aprobación, a partir de una lectura de código de connector-engine, y cómo tres gateways le preguntan a un humano.",
  tags: ["mcp", "approval", "elicitation", "security", "gateway"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-spec-says",
      title: "Qué dice la spec",
      blocks: [
        { kind: "p", text: "Estas citas son de la página de elicitation de MCP 2026-07-28, obtenida el 2026-11-20 para el estudio de controles de connector-engine. Las mismas frases aparecen en 2025-11-25." },
        { kind: "list", items: [
          "El modo form recoge datos estructurados in band, y los datos se exponen al cliente. El modo URL envía a la persona a una URL externa, y los datos distintos de la URL no se exponen al cliente.",
          "Los servidores NO DEBEN usar el modo form para contraseñas, claves de API, tokens o credenciales de pago, y DEBEN usar el modo URL para ellos.",
          "Los servidores DEBEN vincular las solicitudes de elicitation a la identidad del cliente y del usuario. Los clientes DEBERÍAN dejar que el usuario decline en cualquier momento.",
          "La respuesta es accept, decline o cancel. Accept significa que el usuario consintió la interacción, no que esté completa.",
          "En la página de tools: DEBERÍA haber siempre un humano en el loop capaz de denegar las invocaciones de tools.",
        ] },
        { kind: "p", text: "Mi lectura, que la nota del scout también declara: la spec no define ningún tipo de mensaje de aprobación. La elicitation es recolección genérica de entrada. Usarla para aprobar es una convención que añade un gateway." },
      ],
    },
    {
      id: "gateways",
      title: "Cómo la usan los gateways",
      blocks: [
        { kind: "table", head: ["Gateway", "Cómo aprueba una persona"], rows: [
          ["DigitalOcean Action Gateway", "Usa elicitation cuando el cliente la soporta; si no, una ruta aparte de approve/deny con un id de aprobación y expiración. La aprobación se consume una vez y queda ligada a team, alcance del endpoint, versión de la tool y argumentos."],
          ["Composio", "Responde el usuario final. Con clientes que no soportan elicitation, las llamadas que necesitan aprobación se deniegan salvo que un ajuste de fallback esté en allow. Always approve dura el resto de la sesión."],
          ["connector-engine", "Fuera de banda: consola, superficies de chat y desktops emparejados. La elicitation está desactivada por defecto en cada app."],
        ] },
        { kind: "p", text: "Las tres descripciones son del proveedor describiendo su propio producto, leídas con una herramienta de fetch, así que confianza media. El patrón es que la elicitation es la comodidad in band y un segundo canal es el fallback." },
      ],
    },
    {
      id: "why-out-of-band",
      title: "Por qué connector-engine la mantiene fuera de banda",
      blocks: [
        { kind: "p", text: "El modelo de seguridad lista una cosa como fuera de alcance: que quien tiene el token de un agente apruebe su propia llamada mediante elicitation de MCP, cuando el owner activó elicitation para esa app. Piénsalo desde el lado de la amenaza. Si el cliente del agente retransmite la pregunta, el cliente del agente también retransmite la respuesta. La parte gobernada queda en el camino de la aprobación." },
        { kind: "p", text: "Fuera de banda significa que la pregunta viaja por un canal que el agente no controla. Las superficies de chat aceptan clics solo del id de owner configurado, los tokens de enlace son HMAC de un solo uso, y los argumentos de la llamada no aparecen en mensajes de terceros." },
      ],
    },
    {
      id: "record",
      title: "Qué guarda el registro de aprobación",
      blocks: [
        { kind: "p", text: "El estudio leyó el código de aprobación en el commit 905a503. No se ejecutó nada. El registro lleva, entre unos treinta campos, el hash de la definición, la clase de la función, un hash de la llamada, argumentos sellados, aprobadores, modo, estado, canal y expiración. La máquina de estados es: pending, luego approved, denied, expired o cancelled; approved, luego executing o cancelled; executing, luego executed, failed o outcome unknown; después delivered una vez." },
        { kind: "table", head: ["Valor por defecto", "Valor"], rows: [
          ["Timeout de aprobación", "600 s"],
          ["Ejecutar dentro de, tras la decisión", "60 s, si no se cancela por obsoleta"],
          ["Gracia de ejecución pasado el deadline de la llamada", "10 s, luego outcome unknown"],
          ["Máximo de pendientes por sesión, agente y conector", "5"],
        ] },
        { kind: "p", text: "Destacan dos decisiones. Una aprobación decidida expira si no se ejecuta en 60 segundos, así que un clic no se puede guardar para después. Y un outcome unknown nunca se reintenta: el engine no sabe si el efecto secundario ocurrió, así que no adivina." },
        { kind: "p", text: "Una llamada repetida con el mismo hash de llamada se adjunta al registro abierto en lugar de abrir un segundo, y una llamada aprobada se ejecuta una vez." },
      ],
    },
    {
      id: "found",
      title: "Qué encontró mal la lectura",
      blocks: [
        { kind: "p", text: "Una afirmación de la documentación decía que el engine guarda solo un hash de los argumentos de la llamada. Eso es cierto para la fila de auditoría. La fila de aprobación, sin embargo, conservaba el texto plano sellado hasta que terminaba la retención, que por defecto es de una hora. El estudio lo registró como doc drift. Su nota final dice que todo defecto hallado por el estudio fue corregido o se mantuvo por decisión del owner; no volví a verificar cada corrección." },
        { kind: "callout", tone: "note", text: "Los nueve controles del estudio fueron pausados por el owner el 2026-11-21. Solo está mergeado el almacenamiento del log de cambios de permisos. Trata los diseños como un roadmap, no como un compromiso." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "elicitation-is-not-approval",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Elicitation não é aprovação",
  summary: "A elicitation do MCP coleta entrada de uma pessoa. Ela não define nenhuma mensagem de aprovação. O que um registro de aprovação precisa guardar, a partir de uma leitura de código do connector-engine, e como três gateways perguntam a um humano.",
  tags: ["mcp", "approval", "elicitation", "security", "gateway"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-spec-says",
      title: "O que a spec diz",
      blocks: [
        { kind: "p", text: "Estas citações são da página de elicitation do MCP 2026-07-28, obtida em 2026-11-20 para o estudo de controles do connector-engine. As mesmas frases aparecem em 2025-11-25." },
        { kind: "list", items: [
          "O modo form coleta dados estruturados in band, e os dados são expostos ao cliente. O modo URL envia a pessoa a uma URL externa, e dados além da URL não são expostos ao cliente.",
          "Servidores NÃO DEVEM usar o modo form para senhas, chaves de API, tokens ou credenciais de pagamento, e DEVEM usar o modo URL para eles.",
          "Servidores DEVEM vincular as solicitações de elicitation à identidade do cliente e do usuário. Clientes DEVERIAM deixar o usuário recusar a qualquer momento.",
          "A resposta é accept, decline ou cancel. Accept significa que o usuário consentiu com a interação, não que ela esteja completa.",
          "Na página de tools: DEVERIA haver sempre um humano no loop capaz de negar invocações de tools.",
        ] },
        { kind: "p", text: "Minha leitura, que a nota do scout também declara: a spec não define nenhum tipo de mensagem de aprovação. Elicitation é coleta genérica de entrada. Usá-la para aprovar é uma convenção que um gateway acrescenta." },
      ],
    },
    {
      id: "gateways",
      title: "Como os gateways a usam",
      blocks: [
        { kind: "table", head: ["Gateway", "Como uma pessoa aprova"], rows: [
          ["DigitalOcean Action Gateway", "Usa elicitation quando o cliente suporta; senão, um caminho separado de approve/deny com um id de aprovação e expiração. A aprovação é consumida uma vez e fica atrelada a team, escopo do endpoint, versão da tool e argumentos."],
          ["Composio", "O usuário final responde. Com clientes que não suportam elicitation, as chamadas que precisam de aprovação são negadas, a menos que uma configuração de fallback esteja em allow. Always approve dura o resto da sessão."],
          ["connector-engine", "Fora de banda: console, superfícies de chat e desktops pareados. A elicitation vem desligada por padrão em cada app."],
        ] },
        { kind: "p", text: "As três descrições são do fornecedor descrevendo o próprio produto, lidas por uma ferramenta de fetch, então confiança média. O padrão é que a elicitation é a conveniência in band e um segundo canal é o fallback." },
      ],
    },
    {
      id: "why-out-of-band",
      title: "Por que o connector-engine a mantém fora de banda",
      blocks: [
        { kind: "p", text: "O modelo de segurança lista uma coisa como fora de escopo: quem tem o token de um agente aprovar a própria chamada via elicitation do MCP, quando o owner ligou a elicitation para aquele app. Pense pelo lado da ameaça. Se o cliente do agente repassa a pergunta, o cliente do agente também repassa a resposta. A parte governada fica no caminho da aprovação." },
        { kind: "p", text: "Fora de banda significa que a pergunta viaja por um canal que o agente não controla. As superfícies de chat só aceitam cliques do id de owner configurado, os tokens de link são HMACs de uso único, e os argumentos da chamada ficam fora de mensagens de terceiros." },
      ],
    },
    {
      id: "record",
      title: "O que o registro de aprovação guarda",
      blocks: [
        { kind: "p", text: "O estudo leu o código de aprovação no commit 905a503. Nada foi executado. O registro carrega, entre cerca de trinta campos, o hash da definição, a classe da função, um hash da chamada, argumentos selados, aprovadores, modo, estado, canal e expiração. A máquina de estados é: pending, depois approved, denied, expired ou cancelled; approved, depois executing ou cancelled; executing, depois executed, failed ou outcome unknown; então delivered uma vez." },
        { kind: "table", head: ["Padrão", "Valor"], rows: [
          ["Timeout de aprovação", "600 s"],
          ["Executar dentro de, após a decisão", "60 s, senão cancelada por obsoleta"],
          ["Tolerância de execução após o deadline da chamada", "10 s, depois outcome unknown"],
          ["Máximo de pendentes por sessão, agente e conector", "5"],
        ] },
        { kind: "p", text: "Duas escolhas se destacam. Uma aprovação decidida expira se não for executada em 60 segundos, então um clique não pode ser guardado para depois. E um outcome unknown nunca é retentado: o engine não sabe se o efeito colateral aconteceu, então não chuta." },
        { kind: "p", text: "Uma chamada repetida com o mesmo hash de chamada se anexa ao registro aberto em vez de abrir um segundo, e uma chamada aprovada roda uma vez." },
      ],
    },
    {
      id: "found",
      title: "O que a leitura achou de errado",
      blocks: [
        { kind: "p", text: "Uma afirmação da documentação dizia que o engine guarda apenas um hash dos argumentos da chamada. Isso é verdade para a linha de auditoria. A linha de aprovação, porém, mantinha o texto puro selado até o fim da retenção, que por padrão é de uma hora. O estudo registrou isso como doc drift. A nota final dele diz que todo defeito encontrado pelo estudo foi corrigido ou mantido por decisão do owner; não reverifiquei cada correção." },
        { kind: "callout", tone: "note", text: "Os nove controles do estudo foram pausados pelo owner em 2026-11-21. Só o armazenamento do log de mudanças de permissão está mergeado. Trate os designs como um roadmap, não como um compromisso." },
      ],
    },
  ],
};
