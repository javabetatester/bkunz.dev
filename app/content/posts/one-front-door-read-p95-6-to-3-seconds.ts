import type { Post } from "./types";

const post: Post = {
  slug: "one-front-door-read-p95-6-to-3-seconds",
  category: "daily",
  date: "2026-10-24",
  published: "2026-11-21",
  title: "Reading a whole message up front",
  summary: "Notes from a day measuring the assistant's front reading: data questions p95 6.14 to 3.14 s, a 64/65 accuracy battery, and 12 of 15 long multi-topic messages answered without the slow planner.",
  tags: ["assistant", "latency", "routing", "measurement"],
  project: "versatile-sh",
  sections: [
    {
      id: "change",
      title: "What the front reading does",
      blocks: [
        { kind: "p", text: "In the assistant I build at work, owners often send one long message with several questions in it. The front reading is a single model call that splits the message into asks. Each ask gets its excerpt, what the person wants to know, the report route that answers it, the period and whether it is a comparison." },
        { kind: "p", text: "Asks are then answered in parallel, each under its own time budget, and composed into one reply in the order asked. A part that fails or runs out of time gets a plain line about that topic, and the finished parts are still delivered." },
      ],
    },
    {
      id: "measured",
      title: "What I measured today",
      blocks: [
        { kind: "p", text: "Setup: the native core, the live model reader, a simulated report gate of 1.2 s, 20 where-is-it asks and 20 data asks." },
        {
          kind: "table",
          head: ["Ask type", "Before p50 / p95", "After p50 / p95"],
          rows: [
            ["where is it", "0.90 / 3.40 s", "0.90 / 1.96 s"],
            ["data", "3.33 / 6.14 s", "2.49 / 3.14 s"],
          ],
        },
        { kind: "list", items: [
          "Accuracy battery: 64 of 65, with 79% of prompt tokens served from cache.",
          "15 long owner messages: 12 answered every part without the planner. The 3 misses were fixture permissions, not behaviour.",
          "Reading latency: p50 1.34 s, p95 2.35 s.",
        ] },
      ],
    },
    {
      id: "caveats",
      title: "How far to trust it",
      blocks: [
        { kind: "p", text: "These are 20 and 20 asks against a simulated gate, so the p95 is the 19th or 20th slowest of a small sample. The direction is clear. The second decimal is not." },
        { kind: "p", text: "Hypothesis, not tested here: most of the data p95 drop comes from reading the message once and routing straight to a report, so the slow planner is skipped. I did not run an ablation that isolates it." },
        { kind: "p", text: "The 12 of 15 figure has one more limit. Three of the misses were fixture grants, which I can fix in the harness. They say nothing about the assistant." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Leer el mensaje entero de entrada",
  summary: "Notas de un día midiendo la lectura frontal del asistente: p95 de las preguntas de datos de 6.14 a 3.14 s, una batería de precisión de 64/65 y 12 de 15 mensajes largos con varios temas respondidos sin el planner lento.",
  sections: [
    {
      id: "change",
      title: "Qué hace la lectura frontal",
      blocks: [
        { kind: "p", text: "En el asistente que construyo en el trabajo, los dueños suelen enviar un mensaje largo con varias preguntas. La lectura frontal es una sola llamada al modelo que divide el mensaje en pedidos. Cada pedido recibe su fragmento, lo que la persona quiere saber, la ruta de reporte que lo responde, el período y si es una comparación." },
        { kind: "p", text: "Los pedidos se responden en paralelo, cada uno con su propio presupuesto de tiempo, y se componen en una sola respuesta en el orden en que se preguntó. Una parte que falla o se queda sin tiempo recibe una línea simple sobre ese tema, y las partes terminadas igual se entregan." },
      ],
    },
    {
      id: "measured",
      title: "Qué medí hoy",
      blocks: [
        { kind: "p", text: "Configuración: el núcleo nativo, el lector de modelo en vivo, una compuerta de reportes simulada de 1.2 s, 20 pedidos de tipo dónde está y 20 pedidos de datos." },
        {
          kind: "table",
          head: ["Tipo de pedido", "Antes p50 / p95", "Después p50 / p95"],
          rows: [
            ["dónde está", "0.90 / 3.40 s", "0.90 / 1.96 s"],
            ["datos", "3.33 / 6.14 s", "2.49 / 3.14 s"],
          ],
        },
        { kind: "list", items: [
          "Batería de precisión: 64 de 65, con 79% de los tokens del prompt servidos desde caché.",
          "15 mensajes largos de dueños: 12 respondieron todas las partes sin el planner. Los 3 fallos fueron permisos del fixture, no comportamiento.",
          "Latencia de lectura: p50 1.34 s, p95 2.35 s.",
        ] },
      ],
    },
    {
      id: "caveats",
      title: "Cuánto confiar en esto",
      blocks: [
        { kind: "p", text: "Son 20 y 20 pedidos contra una compuerta simulada, así que el p95 es el 19.º o 20.º más lento de una muestra pequeña. La dirección es clara. El segundo decimal no." },
        { kind: "p", text: "Hipótesis, no probada aquí: la mayor parte de la caída del p95 de datos viene de leer el mensaje una vez y enrutar directo a un reporte, de modo que se salta el planner lento. No corrí una ablación que lo aísle." },
        { kind: "p", text: "La cifra de 12 de 15 tiene un límite más. Tres de los fallos fueron permisos del fixture, que puedo arreglar en el harness. No dicen nada sobre el asistente." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Ler a mensagem inteira logo na entrada",
  summary: "Notas de um dia medindo a leitura frontal do assistente: p95 das perguntas de dados de 6.14 para 3.14 s, uma bateria de acurácia de 64/65 e 12 de 15 mensagens longas com vários assuntos respondidas sem o planner lento.",
  sections: [
    {
      id: "change",
      title: "O que a leitura frontal faz",
      blocks: [
        { kind: "p", text: "No assistente que construo no trabalho, os donos costumam mandar uma mensagem longa com várias perguntas. A leitura frontal é uma única chamada ao modelo que divide a mensagem em pedidos. Cada pedido recebe seu trecho, o que a pessoa quer saber, a rota de relatório que o responde, o período e se é uma comparação." },
        { kind: "p", text: "Os pedidos são respondidos em paralelo, cada um com seu próprio orçamento de tempo, e compostos em uma única resposta na ordem em que foram feitos. Uma parte que falha ou estoura o tempo recebe uma linha simples sobre aquele assunto, e as partes concluídas continuam sendo entregues." },
      ],
    },
    {
      id: "measured",
      title: "O que medi hoje",
      blocks: [
        { kind: "p", text: "Configuração: o núcleo nativo, o leitor de modelo ao vivo, um portão de relatórios simulado de 1.2 s, 20 pedidos de onde está e 20 pedidos de dados." },
        {
          kind: "table",
          head: ["Tipo de pedido", "Antes p50 / p95", "Depois p50 / p95"],
          rows: [
            ["onde está", "0.90 / 3.40 s", "0.90 / 1.96 s"],
            ["dados", "3.33 / 6.14 s", "2.49 / 3.14 s"],
          ],
        },
        { kind: "list", items: [
          "Bateria de acurácia: 64 de 65, com 79% dos tokens do prompt servidos do cache.",
          "15 mensagens longas de donos: 12 responderam todas as partes sem o planner. Os 3 erros foram permissões do fixture, não comportamento.",
          "Latência de leitura: p50 1.34 s, p95 2.35 s.",
        ] },
      ],
    },
    {
      id: "caveats",
      title: "Quanto confiar nisso",
      blocks: [
        { kind: "p", text: "São 20 e 20 pedidos contra um portão simulado, então o p95 é o 19º ou 20º mais lento de uma amostra pequena. A direção é clara. A segunda casa decimal não." },
        { kind: "p", text: "Hipótese, não testada aqui: a maior parte da queda do p95 de dados vem de ler a mensagem uma vez e rotear direto para um relatório, pulando o planner lento. Não rodei uma ablação que isole isso." },
        { kind: "p", text: "O número 12 de 15 tem mais um limite. Três dos erros foram permissões do fixture, que posso corrigir no harness. Eles não dizem nada sobre o assistente." },
      ],
    },
  ],
};
