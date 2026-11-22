import type { Post } from "./types";

const post: Post = {
  slug: "prompt-prefix-cache-53-to-88",
  category: "daily",
  date: "2026-10-29",
  published: "2026-11-21",
  title: "A clock in the prompt cost 62% per turn",
  summary: "The chat agent's system prompt started with the current time, so its cache prefix changed every minute. Moving per-turn context to the end took cached share from 53% to 88% and cost per turn down 62% on a local bench.",
  tags: ["assistant", "prompt-caching", "cost", "bench"],
  project: "versatile-sh",
  sections: [
    {
      id: "finding",
      title: "What the ledger showed",
      blocks: [
        { kind: "p", text: "I read the production usage ledger for one store of the chat assistant: 53 customer turns and 251 model calls. About 85% of the spend came from 51 large calls (roughly 17,500 prompt tokens each) that missed the provider's prompt cache." },
        { kind: "p", text: "The cause was the order of the prompt. It began with the store's name, then a clock block with the current minute, then saved customer memory, and only then the rules, personality and tools. A new minute, or a new saved memory, changed the first bytes, and everything after was billed as uncached. The first model call of a turn missed the cache in 39 of 45 turns." },
        { kind: "p", text: "A second bug sat beside it. The memory section iterated a Go map, so two keys could render in a different order on the next turn." },
      ],
    },
    {
      id: "fix",
      title: "The fix",
      blocks: [
        { kind: "list", items: [
          "The system prompt keeps only per-store content: name, greeting, personality, rules, payment policy.",
          "The clock, the customer memory (keys sorted) and the registered cases move into one message placed after the history and just before the customer message.",
          "The system prompt, the tool schemas and the history are now a byte-identical prefix across turns and across customers of the same store.",
          "The agent chooses one provider per store per local day, so the cache is not split across providers.",
        ] },
      ],
    },
    {
      id: "bench",
      title: "Bench result",
      blocks: [
        { kind: "p", text: "Local bench: 8 scripted conversations of 4 turns on a test store, the production prompt parts, the provider pinned in both arms with no fallbacks. The low-concurrency regime sends one turn a minute, like production." },
        {
          kind: "table",
          head: ["Arm", "Cached share", "First-call cache hits", "Calls / turn", "Cost / turn"],
          rows: [
            ["base", "53.0%", "0 / 16", "3.94", "baseline"],
            ["branch", "88.1%", "14 / 16", "3.44", "-62%"],
          ],
        },
        { kind: "p", text: "Under interleaved traffic base already got 74.9% cached, because conversations that land in the same minute share a prefix. A busy store gets that by luck. A store with one turn a minute, like production, does not." },
        { kind: "p", text: "Calls per turn moved from 3.94 to 3.44, but I did not touch the loop, so I treat that as model variance. In the blind accuracy check of the transcripts, base passed 6 of 12 conversations and the branch 8 of 12, and nothing that passed on base failed on the branch." },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        { kind: "p", text: "The bench skips the routing in front of the agent and measures the agent path only. Twelve conversations is a small sample for the accuracy line. The cost line is a ratio from one bench setup, not a promise for production." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Un reloj en el prompt costó 62% por turno",
  summary: "El system prompt del agente de chat empezaba con la hora actual, así que su prefijo de caché cambiaba cada minuto. Mover el contexto por turno al final llevó la parte en caché de 53% a 88% y bajó el costo por turno 62% en un bench local.",
  sections: [
    {
      id: "finding",
      title: "Qué mostró el ledger",
      blocks: [
        { kind: "p", text: "Leí el ledger de uso de producción de una tienda del asistente de chat: 53 turnos de clientes y 251 llamadas al modelo. Cerca del 85% del gasto vino de 51 llamadas grandes (unos 17.500 tokens de prompt cada una) que no acertaron el caché de prompts del proveedor." },
        { kind: "p", text: "La causa era el orden del prompt. Empezaba con el nombre de la tienda, luego un bloque de reloj con el minuto actual, luego la memoria guardada del cliente, y solo después las reglas, la personalidad y las herramientas. Un minuto nuevo, o una memoria guardada nueva, cambiaba los primeros bytes, y todo lo que seguía se facturaba como sin caché. La primera llamada al modelo de un turno falló el caché en 39 de 45 turnos." },
        { kind: "p", text: "Había un segundo bug al lado. La sección de memoria iteraba un map de Go, así que dos claves podían renderizarse en otro orden en el turno siguiente." },
      ],
    },
    {
      id: "fix",
      title: "El arreglo",
      blocks: [
        { kind: "list", items: [
          "El system prompt conserva solo contenido por tienda: nombre, saludo, personalidad, reglas, política de pago.",
          "El reloj, la memoria del cliente (claves ordenadas) y los casos registrados pasan a un solo mensaje ubicado después del historial y justo antes del mensaje del cliente.",
          "El system prompt, los esquemas de herramientas y el historial ahora son un prefijo idéntico byte a byte entre turnos y entre clientes de la misma tienda.",
          "El agente elige un proveedor por tienda por día local, para que el caché no se divida entre proveedores.",
        ] },
      ],
    },
    {
      id: "bench",
      title: "Resultado del bench",
      blocks: [
        { kind: "p", text: "Bench local: 8 conversaciones guionadas de 4 turnos en una tienda de prueba, con las partes del prompt de producción y el proveedor fijado en ambos brazos, sin fallbacks. El régimen de baja concurrencia envía un turno por minuto, como producción." },
        {
          kind: "table",
          head: ["Brazo", "Parte en caché", "Aciertos de caché en la primera llamada", "Llamadas / turno", "Costo / turno"],
          rows: [
            ["base", "53.0%", "0 / 16", "3.94", "línea base"],
            ["branch", "88.1%", "14 / 16", "3.44", "-62%"],
          ],
        },
        { kind: "p", text: "Con tráfico intercalado, base ya tenía 74.9% en caché, porque las conversaciones que caen en el mismo minuto comparten prefijo. Una tienda con mucho movimiento obtiene eso por suerte. Una tienda con un turno por minuto, como producción, no." },
        { kind: "p", text: "Las llamadas por turno pasaron de 3.94 a 3.44, pero no toqué el loop, así que lo trato como varianza del modelo. En la verificación de precisión a ciegas de las transcripciones, base aprobó 6 de 12 conversaciones y el branch 8 de 12, y nada que pasara en base falló en el branch." },
      ],
    },
    {
      id: "limits",
      title: "Límites",
      blocks: [
        { kind: "p", text: "El bench omite el enrutamiento delante del agente y mide solo el camino del agente. Doce conversaciones es una muestra pequeña para la línea de precisión. La línea de costo es una razón de una sola configuración de bench, no una promesa para producción." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Um relógio no prompt custou 62% por turno",
  summary: "O system prompt do agente de chat começava com a hora atual, então o prefixo de cache mudava a cada minuto. Mover o contexto por turno para o fim levou a parcela em cache de 53% para 88% e reduziu o custo por turno em 62% em um bench local.",
  sections: [
    {
      id: "finding",
      title: "O que o ledger mostrou",
      blocks: [
        { kind: "p", text: "Li o ledger de uso de produção de uma loja do assistente de chat: 53 turnos de clientes e 251 chamadas ao modelo. Cerca de 85% do gasto veio de 51 chamadas grandes (cerca de 17.500 tokens de prompt cada) que erraram o cache de prompt do provedor." },
        { kind: "p", text: "A causa era a ordem do prompt. Ele começava com o nome da loja, depois um bloco de relógio com o minuto atual, depois a memória salva do cliente, e só então as regras, a personalidade e as ferramentas. Um minuto novo, ou uma memória salva nova, mudava os primeiros bytes, e tudo o que vinha depois era cobrado como sem cache. A primeira chamada ao modelo de um turno errou o cache em 39 de 45 turnos." },
        { kind: "p", text: "Um segundo bug ficava ao lado. A seção de memória iterava um map do Go, então duas chaves podiam ser renderizadas em ordem diferente no turno seguinte." },
      ],
    },
    {
      id: "fix",
      title: "A correção",
      blocks: [
        { kind: "list", items: [
          "O system prompt mantém só o conteúdo por loja: nome, saudação, personalidade, regras, política de pagamento.",
          "O relógio, a memória do cliente (chaves ordenadas) e os casos registrados vão para uma única mensagem posicionada depois do histórico e logo antes da mensagem do cliente.",
          "O system prompt, os esquemas de ferramentas e o histórico agora formam um prefixo idêntico byte a byte entre turnos e entre clientes da mesma loja.",
          "O agente escolhe um provedor por loja por dia local, para o cache não ser dividido entre provedores.",
        ] },
      ],
    },
    {
      id: "bench",
      title: "Resultado do bench",
      blocks: [
        { kind: "p", text: "Bench local: 8 conversas roteirizadas de 4 turnos em uma loja de teste, com as partes do prompt de produção e o provedor fixado nos dois braços, sem fallbacks. O regime de baixa concorrência envia um turno por minuto, como a produção." },
        {
          kind: "table",
          head: ["Braço", "Parcela em cache", "Acertos de cache na primeira chamada", "Chamadas / turno", "Custo / turno"],
          rows: [
            ["base", "53.0%", "0 / 16", "3.94", "linha de base"],
            ["branch", "88.1%", "14 / 16", "3.44", "-62%"],
          ],
        },
        { kind: "p", text: "Com tráfego intercalado, a base já tinha 74.9% em cache, porque conversas que caem no mesmo minuto compartilham prefixo. Uma loja movimentada consegue isso por sorte. Uma loja com um turno por minuto, como a produção, não." },
        { kind: "p", text: "As chamadas por turno foram de 3.94 para 3.44, mas não mexi no loop, então trato isso como variância do modelo. Na checagem cega de acurácia das transcrições, a base passou em 6 de 12 conversas e o branch em 8 de 12, e nada que passou na base falhou no branch." },
      ],
    },
    {
      id: "limits",
      title: "Limites",
      blocks: [
        { kind: "p", text: "O bench pula o roteamento na frente do agente e mede só o caminho do agente. Doze conversas é uma amostra pequena para a linha de acurácia. A linha de custo é uma razão de uma única configuração de bench, não uma promessa para produção." },
      ],
    },
  ],
};
