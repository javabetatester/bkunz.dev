import type { Post } from "./types";

const post: Post = {
  slug: "how-agents-talk-to-agents-and-clis",
  category: "studies",
  date: "2026-11-08",
  published: "2026-11-21",
  title: "How agents talk to CLIs and to each other",
  summary: "Two read-only studies of open-source agent runtimes: the layers between a task queue and an agent CLI, how Paperclip and Multica call agents, and what delegation looks like when one agent hands work to another.",
  tags: ["agents", "acp", "delegation", "sub-agents", "protocols"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "What was read",
      blocks: [
        { kind: "p", text: "Two studies, both on code read on 2026-11-07 and 2026-11-08: how three runtimes talk to agent CLIs, and how teams of agents delegate. The three runtimes are upstream Paperclip at commit 177f642, Multica at 4239ec1, and a fork of Paperclip that we maintain. Nothing was built and nothing was run. Every finding below is labelled observed, from reading code, or proposed." },
      ],
    },
    {
      id: "layers",
      title: "Four layers between a queue and an agent",
      blocks: [
        { kind: "p", text: "The fork has four execution layers, and a run picks one at dispatch. A heartbeat layer owns queue, claim and result storage. An adapter layer has one module per adapter type, owning spawn, HTTP or WebSocket and output parsing. Inside an adapter, an engine is either cli (spawn the CLI, parse its newline-delimited JSON) or acp (the Agent Client Protocol, JSON-RPC over stdio). Beside that sits a separate native runner, a Rust daemon speaking its own protocol over an authenticated WebSocket, and an edge daemon that pulls leased tasks from the customer side." },
        { kind: "p", text: "Observed: ACP is already the default engine for Codex, Gemini and Kimi in that fork, while permission profiles lock down only the Claude CLI adapter. The adapter contract is versioned, and upstream and the fork share the same twelve legacy adapter packages." },
        { kind: "p", text: "The fork point was 1,916 upstream commits behind at read time, growing by roughly 70 a day over 27 days, per a compare call on 2026-11-07. The only proposal the wiring study made on that evidence was a hypothesis: cherry-pick upstream fixes rather than merge." },
      ],
    },
    {
      id: "multica",
      title: "Multica: the agent calls back",
      blocks: [
        { kind: "p", text: "Multica is a Go server with a daemon that detects local agent CLIs and spawns them. One Go interface, Backend.Execute, returns a session with a normalised message stream: text, thinking, tool use, tool result, status, error, log. The record counted 28 provider families in code, plus one derived runtime." },
        { kind: "p", text: "The communication pattern differs from the fork. The agent talks back to the server by calling a multica CLI over HTTPS with a per-task token. The daemon also exposes a loopback HTTP endpoint for repository checkout. So the agent's tool surface is a CLI the platform ships, not an MCP server." },
      ],
    },
    {
      id: "delegation",
      title: "Delegation: what practitioners converged on",
      blocks: [
        { kind: "p", text: "The teams study read about 30 frameworks and products. Its first finding, from sources including Anthropic and Cognition writing and the MAST failure taxonomy: practitioners converge on manager-child delegation with one writer per artifact. Peer negotiation and parallel writers fail. The same note puts multi-agent cost at about 15 times the tokens of chat, a figure it takes from those secondary sources, not from a measurement of its own." },
        { kind: "list", items: [
          "No framework gave agents a real identity or an on-behalf-of principal. Identity was a name string.",
          "Approvals were per tool call, never team-level.",
          "Only AG2 v1 counted delegation depth (limit 5). Only ADK recorded team structure on every event and fenced peer output as untrusted.",
          "Every engine modelled a sub-agent as a tool call in the parent plus a child session with its own id. Steering a child from the host was mostly impossible.",
        ] },
      ],
    },
    {
      id: "holes",
      title: "Two holes confirmed in the fork",
      blocks: [
        { kind: "p", text: "The fork had the strongest delegation guard of the three products: per-line policy, a hand-off log, a hop cap of 3 and a team autonomy switch that fails closed. It also had the most dangerous defaults. Agents could hire agents with approval off, a budget of 0 meant unlimited, and no policy row meant no limit." },
        { kind: "p", text: "Confirmed by reading code: its delegate_task tool skipped the assign permission and the contact-policy check that REST assignment enforces. And its development auth treated any loopback peer as the owner. On 2026-11-08 the owner decided not to fix these in that product and to make them requirements for the new one." },
      ],
    },
    {
      id: "proposals",
      title: "What is only a proposal",
      blocks: [
        { kind: "p", text: "The study proposed explicit team and delegation rows, one delegation service as the only path, and authority narrowed at each hop, so a child can only tighten what the parent passed. Fourteen design questions went to the owner. Their recommendations, for example a depth cap of 3 with a default depth of 1, an in-flight cap of 4 and a lifetime cap of 50 per parent conversation, are recommendations. They were still open when I stopped, and none was tested." },
        { kind: "callout", tone: "warn", text: "Not tested: whether a core can meet Linear's 10-second first-activity deadline when the agent runs on an edge daemon, brief-only context, per-run engine caps, fan-out and stall defaults, and rules-based routing. All hypotheses." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "how-agents-talk-to-agents-and-clis",
  category: "studies",
  date: "2026-11-08",
  published: "2026-11-21",
  title: "Cómo hablan los agentes con las CLIs y entre sí",
  summary: "Dos estudios de solo lectura de runtimes de agentes open source: las capas entre una cola de tareas y una CLI de agente, cómo Paperclip y Multica llaman a los agentes, y cómo se ve la delegación cuando un agente le pasa trabajo a otro.",
  tags: ["agents", "acp", "delegation", "sub-agents", "protocols"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "Qué se leyó",
      blocks: [
        { kind: "p", text: "Dos estudios, ambos sobre código leído el 2026-11-07 y el 2026-11-08: cómo tres runtimes hablan con CLIs de agentes, y cómo delegan los equipos de agentes. Los tres runtimes son Paperclip upstream en el commit 177f642, Multica en 4239ec1 y un fork de Paperclip que mantenemos. No se construyó nada y no se ejecutó nada. Cada hallazgo de abajo está etiquetado como observado, por lectura de código, o propuesto." },
      ],
    },
    {
      id: "layers",
      title: "Cuatro capas entre una cola y un agente",
      blocks: [
        { kind: "p", text: "El fork tiene cuatro capas de ejecución, y una ejecución elige una en el dispatch. Una capa de heartbeat es dueña de la cola, el claim y el almacenamiento de resultados. Una capa de adapters tiene un módulo por tipo de adapter, dueño del spawn, HTTP o WebSocket y el parseo de la salida. Dentro de un adapter, un engine es cli (lanzar la CLI, parsear su JSON delimitado por saltos de línea) o acp (el Agent Client Protocol, JSON-RPC sobre stdio). Al lado hay un native runner separado, un daemon en Rust que habla su propio protocolo sobre un WebSocket autenticado, y un edge daemon que toma tareas arrendadas desde el lado del cliente." },
        { kind: "p", text: "Observado: ACP ya es el engine por defecto para Codex, Gemini y Kimi en ese fork, mientras que los perfiles de permisos bloquean solo el adapter de la CLI de Claude. El contrato de adapters está versionado, y upstream y el fork comparten los mismos doce paquetes de adapters legacy." },
        { kind: "p", text: "El punto de fork estaba 1,916 commits de upstream por detrás al momento de la lectura, creciendo en aproximadamente 70 al día durante 27 días, según una llamada compare del 2026-11-07. La única propuesta que el estudio de wiring hizo con esa evidencia fue una hipótesis: hacer cherry-pick de las correcciones de upstream en lugar de merge." },
      ],
    },
    {
      id: "multica",
      title: "Multica: el agente llama de vuelta",
      blocks: [
        { kind: "p", text: "Multica es un servidor Go con un daemon que detecta CLIs de agentes locales y las lanza. Una interfaz Go, Backend.Execute, devuelve una sesión con un stream de mensajes normalizado: text, thinking, tool use, tool result, status, error, log. El registro contó 28 familias de providers en código, más un runtime derivado." },
        { kind: "p", text: "El patrón de comunicación difiere del fork. El agente le habla de vuelta al servidor llamando a una CLI multica sobre HTTPS con un token por tarea. El daemon también expone un endpoint HTTP loopback para el checkout de repositorios. Así que la superficie de tools del agente es una CLI que entrega la plataforma, no un servidor MCP." },
      ],
    },
    {
      id: "delegation",
      title: "Delegación: en qué convergieron los practicantes",
      blocks: [
        { kind: "p", text: "El estudio de equipos leyó unos 30 frameworks y productos. Su primer hallazgo, con fuentes que incluyen escritos de Anthropic y Cognition y la taxonomía de fallos MAST: los practicantes convergen en delegación manager-hijo con un solo escritor por artefacto. La negociación entre pares y los escritores paralelos fallan. La misma nota pone el costo multi-agente en unas 15 veces los tokens de un chat, una cifra que toma de esas fuentes secundarias, no de una medición propia." },
        { kind: "list", items: [
          "Ningún framework dio a los agentes una identidad real ni un principal on-behalf-of. La identidad era una cadena de nombre.",
          "Las aprobaciones eran por llamada a tool, nunca a nivel de equipo.",
          "Solo AG2 v1 contaba la profundidad de delegación (límite 5). Solo ADK registraba la estructura del equipo en cada evento y trataba la salida de pares como no confiable.",
          "Cada engine modelaba un sub-agente como una llamada a tool en el padre más una sesión hija con su propio id. Dirigir a un hijo desde el host era casi siempre imposible.",
        ] },
      ],
    },
    {
      id: "holes",
      title: "Dos huecos confirmados en el fork",
      blocks: [
        { kind: "p", text: "El fork tenía la guarda de delegación más fuerte de los tres productos: política por línea, un log de hand-off, un tope de 3 saltos y un interruptor de autonomía del equipo que falla cerrado. También tenía los valores por defecto más peligrosos. Los agentes podían contratar agentes con la aprobación apagada, un presupuesto de 0 significaba ilimitado y ninguna fila de política significaba ningún límite." },
        { kind: "p", text: "Confirmado leyendo código: su tool delegate_task se saltaba el permiso de asignación y la comprobación de contact-policy que la asignación REST sí aplica. Y su auth de desarrollo trataba a cualquier peer loopback como el owner. El 2026-11-08 el owner decidió no corregir esto en ese producto y convertirlo en requisitos para el nuevo." },
      ],
    },
    {
      id: "proposals",
      title: "Lo que es solo una propuesta",
      blocks: [
        { kind: "p", text: "El estudio propuso filas explícitas de equipo y de delegación, un servicio de delegación como único camino y autoridad que se estrecha en cada salto, de modo que un hijo solo pueda restringir lo que le pasó el padre. Catorce preguntas de diseño fueron al owner. Sus recomendaciones, por ejemplo un tope de profundidad de 3 con una profundidad por defecto de 1, un tope de 4 en vuelo y un tope de vida de 50 por conversación padre, son recomendaciones. Seguían abiertas cuando me detuve, y ninguna se probó." },
        { kind: "callout", tone: "warn", text: "No probado: si un core puede cumplir el plazo de primera actividad de 10 segundos de Linear cuando el agente corre en un edge daemon, contexto solo con brief, topes de engine por ejecución, valores por defecto de fan-out y stall, y routing basado en reglas. Todas son hipótesis." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "how-agents-talk-to-agents-and-clis",
  category: "studies",
  date: "2026-11-08",
  published: "2026-11-21",
  title: "Como agentes conversam com CLIs e entre si",
  summary: "Dois estudos somente de leitura de runtimes de agentes open source: as camadas entre uma fila de tarefas e uma CLI de agente, como Paperclip e Multica chamam agentes, e como é a delegação quando um agente passa trabalho para outro.",
  tags: ["agents", "acp", "delegation", "sub-agents", "protocols"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "O que foi lido",
      blocks: [
        { kind: "p", text: "Dois estudos, ambos sobre código lido em 2026-11-07 e 2026-11-08: como três runtimes conversam com CLIs de agentes, e como equipes de agentes delegam. Os três runtimes são o Paperclip upstream no commit 177f642, o Multica em 4239ec1 e um fork do Paperclip que mantemos. Nada foi construído e nada foi rodado. Cada achado abaixo está rotulado como observado, por leitura de código, ou proposto." },
      ],
    },
    {
      id: "layers",
      title: "Quatro camadas entre uma fila e um agente",
      blocks: [
        { kind: "p", text: "O fork tem quatro camadas de execução, e uma execução escolhe uma no dispatch. Uma camada de heartbeat é dona da fila, do claim e do armazenamento de resultados. Uma camada de adapters tem um módulo por tipo de adapter, dono do spawn, de HTTP ou WebSocket e do parsing da saída. Dentro de um adapter, um engine é cli (iniciar a CLI, parsear seu JSON delimitado por quebras de linha) ou acp (o Agent Client Protocol, JSON-RPC sobre stdio). Ao lado fica um native runner separado, um daemon em Rust que fala o próprio protocolo sobre um WebSocket autenticado, e um edge daemon que puxa tarefas alugadas do lado do cliente." },
        { kind: "p", text: "Observado: ACP já é o engine padrão para Codex, Gemini e Kimi nesse fork, enquanto os perfis de permissão travam só o adapter da CLI do Claude. O contrato de adapters é versionado, e o upstream e o fork compartilham os mesmos doze pacotes de adapters legados." },
        { kind: "p", text: "O ponto de fork estava 1,916 commits atrás do upstream na hora da leitura, crescendo cerca de 70 por dia ao longo de 27 dias, segundo uma chamada compare de 2026-11-07. A única proposta que o estudo de wiring fez com essa evidência foi uma hipótese: fazer cherry-pick das correções do upstream em vez de merge." },
      ],
    },
    {
      id: "multica",
      title: "Multica: o agente chama de volta",
      blocks: [
        { kind: "p", text: "Multica é um servidor Go com um daemon que detecta CLIs de agentes locais e as inicia. Uma interface Go, Backend.Execute, devolve uma sessão com um stream de mensagens normalizado: text, thinking, tool use, tool result, status, error, log. O registro contou 28 famílias de providers no código, mais um runtime derivado." },
        { kind: "p", text: "O padrão de comunicação difere do fork. O agente fala de volta com o servidor chamando uma CLI multica por HTTPS com um token por tarefa. O daemon também expõe um endpoint HTTP loopback para o checkout de repositórios. Então a superfície de tools do agente é uma CLI que a plataforma entrega, não um servidor MCP." },
      ],
    },
    {
      id: "delegation",
      title: "Delegação: em que os praticantes convergiram",
      blocks: [
        { kind: "p", text: "O estudo de equipes leu cerca de 30 frameworks e produtos. O primeiro achado, com fontes que incluem textos da Anthropic e da Cognition e a taxonomia de falhas MAST: os praticantes convergem em delegação manager-filho com um único escritor por artefato. Negociação entre pares e escritores paralelos falham. A mesma nota põe o custo multi-agente em cerca de 15 vezes os tokens de um chat, um número que ela toma dessas fontes secundárias, não de uma medição própria." },
        { kind: "list", items: [
          "Nenhum framework deu aos agentes uma identidade real nem um principal on-behalf-of. A identidade era uma string de nome.",
          "As aprovações eram por chamada de tool, nunca em nível de equipe.",
          "Só o AG2 v1 contava a profundidade de delegação (limite 5). Só o ADK registrava a estrutura da equipe em cada evento e tratava a saída de pares como não confiável.",
          "Todo engine modelava um sub-agente como uma chamada de tool no pai mais uma sessão filha com id próprio. Conduzir um filho a partir do host era quase sempre impossível.",
        ] },
      ],
    },
    {
      id: "holes",
      title: "Dois buracos confirmados no fork",
      blocks: [
        { kind: "p", text: "O fork tinha a guarda de delegação mais forte dos três produtos: política por linha, um log de hand-off, um teto de 3 saltos e uma chave de autonomia da equipe que falha fechada. Também tinha os padrões mais perigosos. Agentes podiam contratar agentes com a aprovação desligada, um orçamento de 0 significava ilimitado e nenhuma linha de política significava nenhum limite." },
        { kind: "p", text: "Confirmado lendo código: sua tool delegate_task pulava a permissão de atribuição e a checagem de contact-policy que a atribuição REST aplica. E sua auth de desenvolvimento tratava qualquer peer loopback como o owner. Em 2026-11-08 o owner decidiu não corrigir isso naquele produto e transformá-los em requisitos para o novo." },
      ],
    },
    {
      id: "proposals",
      title: "O que é só proposta",
      blocks: [
        { kind: "p", text: "O estudo propôs linhas explícitas de equipe e de delegação, um serviço de delegação como único caminho e autoridade que se estreita a cada salto, de modo que um filho só possa restringir o que o pai passou. Catorze perguntas de design foram para o owner. As recomendações, por exemplo um teto de profundidade de 3 com profundidade padrão de 1, um teto de 4 em andamento e um teto de vida de 50 por conversa pai, são recomendações. Ainda estavam abertas quando parei, e nenhuma foi testada." },
        { kind: "callout", tone: "warn", text: "Não testado: se um core consegue cumprir o prazo de primeira atividade de 10 segundos do Linear quando o agente roda em um edge daemon, contexto só com brief, tetos de engine por execução, padrões de fan-out e stall, e routing baseado em regras. Todas são hipóteses." },
      ],
    },
  ],
};
