import type { Post } from "./types";

const post: Post = {
  slug: "mcp-what-it-solves-and-where-it-stops",
  category: "studies",
  date: "2026-11-05",
  published: "2026-11-21",
  title: "What MCP solves, and where it stops",
  summary: "From two research records: MCP standardises the wire between an agent and a tool server. Auth for background work, approval, tool-definition drift and per-tenant catalogs are left to whoever sits in the middle.",
  tags: ["mcp", "protocols", "auth", "gateway", "multi-tenant"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "What I am reporting",
      blocks: [
        { kind: "p", text: "This is a summary of research records, not an opinion piece. The first is a survey of the MCP, identity and gateway layer: 29 products classified, sources accessed on 2026-11-05. The second is a protocol cheat sheet condensed from a longer proposal, whose own text says it was gathered and reviewed by AI agents only and not yet validated by a team. I treat everything from it as medium confidence." },
        { kind: "p", text: "Where I add a reading of my own, I label it a hypothesis. The third source is the documentation and architecture notes of connector-engine, an open-source gateway I work on, which show one concrete answer to each gap." },
      ],
    },
    {
      id: "solves",
      title: "What MCP solves",
      blocks: [
        { kind: "p", text: "MCP gives an agent one way to list and call tools, read resources and ask a person for input, over JSON-RPC and streamable HTTP. The cheat sheet records the 2026-07-28 revision as stateless: no initialize handshake, no session id header, version and capabilities carried in each request, and a discovery call in place of the handshake. Lists can carry a time-to-live and a cache scope." },
        { kind: "p", text: "That is a real result. Before it, every agent-to-tool pair was a custom integration. After it, a server written once is callable from any client that speaks the protocol, and a gateway can sit in the middle without knowing the tools in advance." },
      ],
    },
    {
      id: "auth",
      title: "Where it stops: identity for work nobody is watching",
      blocks: [
        { kind: "p", text: "The authorization side has grown a lot: protected-resource metadata so a server says which authorization server to use, client ID metadata documents as a replacement for dynamic client registration (which the 2026-07-28 revision deprecates), an enterprise token-exchange flow, and refresh-token guidance. The spec forbids token passthrough, meaning one token reused across services." },
        { kind: "p", text: "What the cheat sheet found missing is background work. It states that no enhancement proposal covers scheduled or background runs on behalf of a person who is not present. An agent that wakes at night to do a task needs a credential that is neither the person's live session nor a god-mode service key. The protocol does not say what that credential is." },
        { kind: "callout", tone: "note", text: "Hypothesis, mine: the practical answer is a per-agent identity plus a delegated grant that is the intersection of the agent's rights, the person's current rights and the task scope. That is a design stance from our own records, not something MCP specifies." },
      ],
    },
    {
      id: "approval-drift",
      title: "Where it stops: approval and drift",
      blocks: [
        { kind: "p", text: "The tools page says there should always be a human in the loop able to deny tool invocations. It is a SHOULD, and the spec defines no approval message. Elicitation is generic input collection. I wrote that up separately in the post on elicitation versus approval." },
        { kind: "p", text: "Tool annotations such as readOnlyHint are, per the cheat sheet, untrusted hints when the server is third-party. And the spec lets a server change its tool list at any time: tools/list must return the set currently available to the requesting client, and that set may change. A client is not required to compare a new listing against the cached one. An issue proposed changing that with a SHA-256 digest of each tool description; it was closed on 2026-10-26 with a note that proposals need working-group engagement first. I cover the mechanisms people use meanwhile in the post on pinning." },
      ],
    },
    {
      id: "catalogs",
      title: "Where it stops: catalogs per tenant",
      blocks: [
        { kind: "p", text: "MCP says what a server offers. It does not say what this agent, acting for this person, in this organisation, may call. In a multi-tenant setting that is the hard part. connector-engine answers it with four grant layers: tenant (optional, narrows), workspace (required, a missing row denies), agent (required, a missing row denies) and the user acted for (optional, narrows). The strictest mode wins across layers." },
        { kind: "p", text: "Two caps apply afterwards. A catalog ceiling lets a listing's visibility cap the mode any key can hold. And an exposure check forces ask on an agent that holds private data, reads untrusted content and has an outbound path. A denied function answers like an unknown tool, so an agent cannot probe what exists." },
      ],
    },
    {
      id: "market",
      title: "What the market survey added",
      blocks: [
        { kind: "p", text: "No product among the 29 combined an agent runtime, per-action approvals and an operations console; the survey classified none as a direct competitor of the job in question. It also records consolidation: Palo Alto closed its Portkey acquisition on 2026-05-29, Arcade bought Smithery on 2026-08-05, and OpenRouter joined Stripe. The note's inference is that independent, open-source gateways are becoming rarer, which favours neutral projects for a local-first product." },
        { kind: "p", text: "The survey's cheapest integration points were the official MCP registry as a catalog source and an MCP gateway as the isolation layer for third-party local servers. Pricing and traction numbers in that note come with their own source links in the record; I am not repeating them here." },
      ],
    },
    {
      id: "limits",
      title: "What I did not verify",
      blocks: [
        { kind: "list", items: [
          "Nothing here was run. The proof level of both records is reading docs, code and press releases.",
          "The cheat sheet is secondary evidence with few reliable URLs, so its protocol claims are medium confidence.",
          "Market facts come with the bias of their source: vendor docs describe the vendor's intent, not its quality.",
        ] },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "mcp-what-it-solves-and-where-it-stops",
  category: "studies",
  date: "2026-11-05",
  published: "2026-11-21",
  title: "Lo que MCP resuelve, y dónde se detiene",
  summary: "A partir de dos registros de investigación: MCP estandariza el wire entre un agente y un servidor de tools. La auth para trabajo en segundo plano, la aprobación, la deriva de definiciones de tools y los catálogos por tenant quedan a cargo de quien esté en el medio.",
  tags: ["mcp", "protocols", "auth", "gateway", "multi-tenant"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "Qué estoy reportando",
      blocks: [
        { kind: "p", text: "Este es un resumen de registros de investigación, no un artículo de opinión. El primero es un relevamiento de la capa de MCP, identidad y gateway: 29 productos clasificados, fuentes consultadas el 2026-11-05. El segundo es una hoja de referencia del protocolo condensada de una propuesta más larga, cuyo propio texto dice que fue reunida y revisada solo por agentes de IA y todavía no validada por un equipo. Trato todo lo que viene de ella con confianza media." },
        { kind: "p", text: "Donde añado una lectura propia, la etiqueto como hipótesis. La tercera fuente es la documentación y las notas de arquitectura de connector-engine, un gateway open source en el que trabajo, que muestran una respuesta concreta a cada brecha." },
      ],
    },
    {
      id: "solves",
      title: "Lo que MCP resuelve",
      blocks: [
        { kind: "p", text: "MCP le da a un agente una sola forma de listar y llamar tools, leer recursos y pedirle datos a una persona, sobre JSON-RPC y HTTP streamable. La hoja de referencia registra la revisión 2026-07-28 como stateless: sin handshake initialize, sin header de session id, versión y capacidades en cada solicitud, y una llamada de discovery en lugar del handshake. Las listas pueden llevar un time-to-live y un alcance de caché." },
        { kind: "p", text: "Eso es un resultado real. Antes, cada par agente-tool era una integración a medida. Después, un servidor escrito una vez es invocable desde cualquier cliente que hable el protocolo, y un gateway puede quedar en el medio sin conocer las tools de antemano." },
      ],
    },
    {
      id: "auth",
      title: "Dónde se detiene: identidad para trabajo que nadie mira",
      blocks: [
        { kind: "p", text: "El lado de autorización ha crecido mucho: metadata de protected-resource para que un servidor diga qué servidor de autorización usar, client ID metadata documents como reemplazo del dynamic client registration (que la revisión 2026-07-28 deprecia), un flujo empresarial de token-exchange y guía para refresh tokens. La spec prohíbe el token passthrough, es decir, un token reutilizado entre servicios." },
        { kind: "p", text: "Lo que la hoja de referencia encontró faltante es el trabajo en segundo plano. Afirma que ninguna propuesta de mejora cubre ejecuciones programadas o en segundo plano en nombre de una persona que no está presente. Un agente que despierta de noche para hacer una tarea necesita una credencial que no sea ni la sesión en vivo de la persona ni una clave de servicio todopoderosa. El protocolo no dice qué es esa credencial." },
        { kind: "callout", tone: "note", text: "Hipótesis, mía: la respuesta práctica es una identidad por agente más un grant delegado que sea la intersección de los derechos del agente, los derechos actuales de la persona y el alcance de la tarea. Es una postura de diseño de nuestros propios registros, no algo que MCP especifique." },
      ],
    },
    {
      id: "approval-drift",
      title: "Dónde se detiene: aprobación y deriva",
      blocks: [
        { kind: "p", text: "La página de tools dice que siempre debería haber un humano en el loop capaz de denegar invocaciones de tools. Es un SHOULD, y la spec no define ningún mensaje de aprobación. La elicitation es recolección genérica de entrada. Lo escribí aparte en el post sobre elicitation frente a aprobación." },
        { kind: "p", text: "Las anotaciones de tools como readOnlyHint son, según la hoja de referencia, pistas no confiables cuando el servidor es de terceros. Y la spec permite que un servidor cambie su lista de tools en cualquier momento: tools/list debe devolver el conjunto disponible en ese momento para el cliente solicitante, y ese conjunto puede cambiar. Un cliente no está obligado a comparar un listado nuevo con el cacheado. Un issue propuso cambiar eso con un digest SHA-256 de cada descripción de tool; se cerró el 2026-10-26 con una nota de que las propuestas necesitan primero el compromiso del grupo de trabajo. Cubro los mecanismos que la gente usa mientras tanto en el post sobre pinning." },
      ],
    },
    {
      id: "catalogs",
      title: "Dónde se detiene: catálogos por tenant",
      blocks: [
        { kind: "p", text: "MCP dice lo que ofrece un servidor. No dice qué puede llamar este agente, actuando por esta persona, en esta organización. En un entorno multi-tenant esa es la parte difícil. connector-engine la responde con cuatro capas de grants: tenant (opcional, restringe), workspace (obligatoria, una fila ausente deniega), agente (obligatoria, una fila ausente deniega) y el usuario por el que se actúa (opcional, restringe). El modo más estricto gana entre capas." },
        { kind: "p", text: "Después se aplican dos topes. Un techo de catálogo permite que la visibilidad de un listado limite el modo que cualquier clave puede tener. Y una comprobación de exposición fuerza ask en un agente que tiene datos privados, lee contenido no confiable y tiene un camino de salida. Una función denegada responde como una tool desconocida, de modo que un agente no puede sondear qué existe." },
      ],
    },
    {
      id: "market",
      title: "Lo que añadió el relevamiento de mercado",
      blocks: [
        { kind: "p", text: "Ningún producto entre los 29 combinaba un runtime de agentes, aprobaciones por acción y una consola de operaciones; el relevamiento no clasificó a ninguno como competidor directo del trabajo en cuestión. También registra consolidación: Palo Alto cerró su adquisición de Portkey el 2026-05-29, Arcade compró Smithery el 2026-08-05 y OpenRouter se unió a Stripe. La inferencia de la nota es que los gateways independientes y open source se vuelven más raros, lo que favorece a los proyectos neutrales para un producto local-first." },
        { kind: "p", text: "Los puntos de integración más baratos del relevamiento fueron el registry oficial de MCP como fuente de catálogo y un gateway MCP como capa de aislamiento para servidores locales de terceros. Los números de precios y tracción de esa nota vienen con sus propios enlaces de fuente en el registro; no los repito aquí." },
      ],
    },
    {
      id: "limits",
      title: "Lo que no verifiqué",
      blocks: [
        { kind: "list", items: [
          "Nada de esto se ejecutó. El nivel de prueba de ambos registros es leer docs, código y comunicados de prensa.",
          "La hoja de referencia es evidencia secundaria con pocas URLs confiables, así que sus afirmaciones de protocolo tienen confianza media.",
          "Los hechos de mercado llevan el sesgo de su fuente: la documentación de un proveedor describe la intención del proveedor, no su calidad.",
        ] },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "mcp-what-it-solves-and-where-it-stops",
  category: "studies",
  date: "2026-11-05",
  published: "2026-11-21",
  title: "O que o MCP resolve, e onde ele para",
  summary: "A partir de dois registros de pesquisa: o MCP padroniza o wire entre um agente e um servidor de tools. A auth para trabalho em segundo plano, a aprovação, a deriva de definições de tools e os catálogos por tenant ficam a cargo de quem está no meio.",
  tags: ["mcp", "protocols", "auth", "gateway", "multi-tenant"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "O que estou reportando",
      blocks: [
        { kind: "p", text: "Este é um resumo de registros de pesquisa, não um artigo de opinião. O primeiro é um levantamento da camada de MCP, identidade e gateway: 29 produtos classificados, fontes acessadas em 2026-11-05. O segundo é uma folha de referência do protocolo condensada de uma proposta mais longa, cujo próprio texto diz que foi reunida e revisada só por agentes de IA e ainda não validada por uma equipe. Trato tudo que vem dela com confiança média." },
        { kind: "p", text: "Onde acrescento uma leitura minha, rotulo como hipótese. A terceira fonte é a documentação e as notas de arquitetura do connector-engine, um gateway open source em que trabalho, que mostram uma resposta concreta para cada lacuna." },
      ],
    },
    {
      id: "solves",
      title: "O que o MCP resolve",
      blocks: [
        { kind: "p", text: "O MCP dá a um agente uma única forma de listar e chamar tools, ler recursos e pedir dados a uma pessoa, sobre JSON-RPC e HTTP streamable. A folha de referência registra a revisão 2026-07-28 como stateless: sem handshake initialize, sem header de session id, versão e capacidades em cada requisição, e uma chamada de discovery no lugar do handshake. As listas podem carregar um time-to-live e um escopo de cache." },
        { kind: "p", text: "Isso é um resultado real. Antes, cada par agente-tool era uma integração sob medida. Depois, um servidor escrito uma vez pode ser chamado de qualquer cliente que fale o protocolo, e um gateway pode ficar no meio sem conhecer as tools de antemão." },
      ],
    },
    {
      id: "auth",
      title: "Onde para: identidade para trabalho que ninguém está olhando",
      blocks: [
        { kind: "p", text: "O lado de autorização cresceu bastante: metadata de protected-resource para um servidor dizer qual servidor de autorização usar, client ID metadata documents como substituto do dynamic client registration (que a revisão 2026-07-28 deprecia), um fluxo empresarial de token-exchange e orientação sobre refresh tokens. A spec proíbe o token passthrough, isto é, um token reutilizado entre serviços." },
        { kind: "p", text: "O que a folha de referência achou faltando é o trabalho em segundo plano. Ela afirma que nenhuma proposta de melhoria cobre execuções agendadas ou em segundo plano em nome de uma pessoa que não está presente. Um agente que acorda de madrugada para fazer uma tarefa precisa de uma credencial que não seja nem a sessão ao vivo da pessoa nem uma chave de serviço onipotente. O protocolo não diz o que é essa credencial." },
        { kind: "callout", tone: "note", text: "Hipótese, minha: a resposta prática é uma identidade por agente mais um grant delegado que seja a interseção dos direitos do agente, dos direitos atuais da pessoa e do escopo da tarefa. É uma postura de design dos nossos próprios registros, não algo que o MCP especifica." },
      ],
    },
    {
      id: "approval-drift",
      title: "Onde para: aprovação e deriva",
      blocks: [
        { kind: "p", text: "A página de tools diz que deveria haver sempre um humano no loop capaz de negar invocações de tools. É um SHOULD, e a spec não define nenhuma mensagem de aprovação. Elicitation é coleta genérica de entrada. Escrevi isso à parte no post sobre elicitation versus aprovação." },
        { kind: "p", text: "Anotações de tools como readOnlyHint são, segundo a folha de referência, dicas não confiáveis quando o servidor é de terceiros. E a spec permite que um servidor mude sua lista de tools a qualquer momento: tools/list deve devolver o conjunto disponível naquele momento para o cliente solicitante, e esse conjunto pode mudar. Um cliente não é obrigado a comparar uma listagem nova com a que está em cache. Um issue propôs mudar isso com um digest SHA-256 de cada descrição de tool; foi fechado em 2026-10-26 com a nota de que propostas precisam primeiro do engajamento do grupo de trabalho. Cubro os mecanismos que as pessoas usam enquanto isso no post sobre pinning." },
      ],
    },
    {
      id: "catalogs",
      title: "Onde para: catálogos por tenant",
      blocks: [
        { kind: "p", text: "O MCP diz o que um servidor oferece. Não diz o que este agente, agindo por esta pessoa, nesta organização, pode chamar. Em um ambiente multi-tenant essa é a parte difícil. O connector-engine responde com quatro camadas de grants: tenant (opcional, restringe), workspace (obrigatória, uma linha ausente nega), agente (obrigatória, uma linha ausente nega) e o usuário em nome de quem se age (opcional, restringe). O modo mais estrito vence entre as camadas." },
        { kind: "p", text: "Dois tetos se aplicam depois. Um teto de catálogo permite que a visibilidade de uma listagem limite o modo que qualquer chave pode ter. E uma checagem de exposição força ask em um agente que tem dados privados, lê conteúdo não confiável e tem um caminho de saída. Uma função negada responde como uma tool desconhecida, então um agente não consegue sondar o que existe." },
      ],
    },
    {
      id: "market",
      title: "O que o levantamento de mercado acrescentou",
      blocks: [
        { kind: "p", text: "Nenhum produto entre os 29 combinava um runtime de agentes, aprovações por ação e um console de operações; o levantamento não classificou nenhum como concorrente direto do trabalho em questão. Ele também registra consolidação: a Palo Alto fechou a aquisição da Portkey em 2026-05-29, a Arcade comprou a Smithery em 2026-08-05 e a OpenRouter se juntou à Stripe. A inferência da nota é que gateways independentes e open source estão ficando mais raros, o que favorece projetos neutros para um produto local-first." },
        { kind: "p", text: "Os pontos de integração mais baratos do levantamento foram o registry oficial do MCP como fonte de catálogo e um gateway MCP como camada de isolamento para servidores locais de terceiros. Os números de preço e tração dessa nota vêm com seus próprios links de fonte no registro; não os repito aqui." },
      ],
    },
    {
      id: "limits",
      title: "O que não verifiquei",
      blocks: [
        { kind: "list", items: [
          "Nada aqui foi rodado. O nível de prova dos dois registros é leitura de docs, código e releases de imprensa.",
          "A folha de referência é evidência secundária com poucas URLs confiáveis, então suas afirmações de protocolo têm confiança média.",
          "Fatos de mercado vêm com o viés da sua fonte: a documentação de um fornecedor descreve a intenção do fornecedor, não a qualidade dele.",
        ] },
      ],
    },
  ],
};
