import type { Post } from "./types";

const post: Post = {
  slug: "triage-calibration-81-to-96",
  category: "daily",
  date: "2026-09-26",
  published: "2026-11-21",
  title: "Triage calibration: 81.5 to 96.2",
  summary: "A day spent calibrating the small model that routes each question in an AI assistant I build at work: path accuracy 81.5 to 96.2 on dev, 73.3 to 95.6 on holdout, with latency unchanged.",
  tags: ["assistant", "routing", "calibration", "evals"],
  project: "versatile-sh",
  sections: [
    {
      id: "setup",
      title: "What triage does",
      blocks: [
        { kind: "p", text: "The assistant answers questions over business data. Every question first goes through a small, fast classifier with an 800 ms timeout. It decides the path: a precomputed report template when one fits, or the slower tool-using model loop when none does." },
        { kind: "p", text: "A wrong path is expensive in either direction. Too eager a template gives a confident wrong answer. Too cautious sends a simple question into the slow loop." },
        { kind: "p", text: "Today I ran the production triage code, with the same client and timeout, against two labelled sets: dev (130 questions) and holdout (45). The tool also replays a threshold sweep offline from the saved raw answers, so tuning costs no new calls." },
      ],
    },
    {
      id: "failures",
      title: "What was failing",
      blocks: [
        { kind: "list", items: [
          "The classifier picked the right template at 0.98 or more but was unsure about the route (0.13 to 0.63) on slang and typo asks that literally said the word for report. They fell into the slow loop.",
          "Out-of-scope questions scored 0.84 to 0.89 on the out-of-scope class and slipped under the 0.9 block.",
          "Comparisons with the previous period were flagged as custom, although every template already benchmarks against it.",
        ] },
        { kind: "p", text: "I changed the classifier's instructions and thresholds against those three patterns. The sweep was flat for the route threshold between 0.5 and 0.7 and for the template threshold between 0.3 and 0.5. For the custom class, 0.6 was the optimum." },
      ],
    },
    {
      id: "numbers",
      title: "Numbers",
      blocks: [
        {
          kind: "table",
          head: ["Set", "Build", "Path acc.", "Route acc.", "No slow loop", "p50 / p95"],
          rows: [
            ["dev (130)", "before", "81.5%", "89.2%", "52.3%", "288 / 396 ms"],
            ["dev (130)", "after", "96.2%", "100%", "63.8%", "311 / 392 ms"],
            ["holdout (45)", "before", "73.3%", "84.4%", "46.7%", "322 / 422 ms"],
            ["holdout (45)", "after", "95.6%", "97.8%", "66.7%", "301 / 416 ms"],
          ],
        },
        { kind: "p", text: "Latency stayed at roughly 300 ms p50 and 400 ms p95. Triage failures were 0 of 175. The holdout was not used while tuning, which is why I trust the 95.6 more than the 96.2." },
        { kind: "p", text: "With 45 holdout items, 95.6% is 43 correct. Its interval is wide (about 85 to 99 with Wilson, my calculation), so I read the holdout as a sanity check on overfitting, not as a precise rate." },
      ],
    },
    {
      id: "left",
      title: "Left over",
      blocks: [
        { kind: "p", text: "Product and category names in free text, and derived views such as price variation, are still built without adapting. A request for three payment methods is adapted although a template covers it, which costs one extra round but still returns the right output. I wrote these into the doc as known residual misses." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Calibración del triage: 81.5 a 96.2",
  summary: "Un día dedicado a calibrar el modelo pequeño que enruta cada pregunta en un asistente de IA que construyo en el trabajo: precisión de ruta de 81.5 a 96.2 en dev, de 73.3 a 95.6 en holdout, con la latencia sin cambios.",
  sections: [
    {
      id: "setup",
      title: "Qué hace el triage",
      blocks: [
        { kind: "p", text: "El asistente responde preguntas sobre datos de negocio. Cada pregunta pasa primero por un clasificador pequeño y rápido con un timeout de 800 ms. Decide la ruta: una plantilla de reporte precalculada cuando alguna encaja, o el loop más lento del modelo con herramientas cuando ninguna lo hace." },
        { kind: "p", text: "Una ruta equivocada es cara en ambas direcciones. Una plantilla demasiado ansiosa da una respuesta equivocada con seguridad. Una demasiado cauta manda una pregunta simple al loop lento." },
        { kind: "p", text: "Hoy corrí el código de triage de producción, con el mismo cliente y timeout, contra dos conjuntos etiquetados: dev (130 preguntas) y holdout (45). La herramienta además reproduce offline un barrido de umbrales a partir de las respuestas crudas guardadas, así que ajustar no cuesta llamadas nuevas." },
      ],
    },
    {
      id: "failures",
      title: "Qué fallaba",
      blocks: [
        { kind: "list", items: [
          "El clasificador elegía la plantilla correcta con 0.98 o más, pero dudaba de la ruta (0.13 a 0.63) en pedidos con jerga y erratas que decían literalmente la palabra para reporte. Caían en el loop lento.",
          "Las preguntas fuera de alcance puntuaban 0.84 a 0.89 en la clase fuera de alcance y se colaban bajo el bloqueo de 0.9.",
          "Las comparaciones con el período anterior se marcaban como custom, aunque todas las plantillas ya se comparan contra él.",
        ] },
        { kind: "p", text: "Cambié las instrucciones y los umbrales del clasificador frente a esos tres patrones. El barrido fue plano para el umbral de ruta entre 0.5 y 0.7 y para el umbral de plantilla entre 0.3 y 0.5. Para la clase custom, 0.6 fue el óptimo." },
      ],
    },
    {
      id: "numbers",
      title: "Números",
      blocks: [
        {
          kind: "table",
          head: ["Conjunto", "Build", "Prec. de ruta", "Prec. de route", "Sin loop lento", "p50 / p95"],
          rows: [
            ["dev (130)", "antes", "81.5%", "89.2%", "52.3%", "288 / 396 ms"],
            ["dev (130)", "después", "96.2%", "100%", "63.8%", "311 / 392 ms"],
            ["holdout (45)", "antes", "73.3%", "84.4%", "46.7%", "322 / 422 ms"],
            ["holdout (45)", "después", "95.6%", "97.8%", "66.7%", "301 / 416 ms"],
          ],
        },
        { kind: "p", text: "La latencia se mantuvo en unos 300 ms de p50 y 400 ms de p95. Las fallas de triage fueron 0 de 175. El holdout no se usó al ajustar, por eso confío más en el 95.6 que en el 96.2." },
        { kind: "p", text: "Con 45 ítems de holdout, 95.6% son 43 aciertos. Su intervalo es amplio (cerca de 85 a 99 con Wilson, cálculo mío), así que leo el holdout como una verificación de sobreajuste, no como una tasa precisa." },
      ],
    },
    {
      id: "left",
      title: "Lo que queda",
      blocks: [
        { kind: "p", text: "Los nombres de productos y categorías en texto libre, y las vistas derivadas como la variación de precio, todavía se construyen sin adaptar. Un pedido de tres métodos de pago se adapta aunque una plantilla lo cubre, lo que cuesta una ronda extra pero igual devuelve la salida correcta. Escribí esto en el doc como fallas residuales conocidas." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Calibração do triage: 81.5 para 96.2",
  summary: "Um dia dedicado a calibrar o modelo pequeno que roteia cada pergunta em um assistente de IA que construo no trabalho: acurácia de caminho de 81.5 para 96.2 no dev, de 73.3 para 95.6 no holdout, com a latência inalterada.",
  sections: [
    {
      id: "setup",
      title: "O que o triage faz",
      blocks: [
        { kind: "p", text: "O assistente responde perguntas sobre dados de negócio. Toda pergunta passa primeiro por um classificador pequeno e rápido com timeout de 800 ms. Ele decide o caminho: um template de relatório pré-calculado quando algum serve, ou o loop mais lento do modelo com ferramentas quando nenhum serve." },
        { kind: "p", text: "Um caminho errado é caro nas duas direções. Um template ansioso demais dá uma resposta errada com confiança. Um cauteloso demais manda uma pergunta simples para o loop lento." },
        { kind: "p", text: "Hoje rodei o código de triage de produção, com o mesmo cliente e timeout, contra dois conjuntos rotulados: dev (130 perguntas) e holdout (45). A ferramenta também reproduz offline uma varredura de limiares a partir das respostas brutas salvas, então ajustar não custa chamadas novas." },
      ],
    },
    {
      id: "failures",
      title: "O que estava falhando",
      blocks: [
        { kind: "list", items: [
          "O classificador escolhia o template certo com 0.98 ou mais, mas ficava em dúvida sobre a rota (0.13 a 0.63) em pedidos com gíria e erros de digitação que diziam literalmente a palavra para relatório. Eles caíam no loop lento.",
          "Perguntas fora de escopo pontuavam 0.84 a 0.89 na classe fora de escopo e escapavam do bloqueio de 0.9.",
          "Comparações com o período anterior eram marcadas como custom, embora todo template já faça benchmark contra ele.",
        ] },
        { kind: "p", text: "Mudei as instruções e os limiares do classificador contra esses três padrões. A varredura ficou plana para o limiar de rota entre 0.5 e 0.7 e para o limiar de template entre 0.3 e 0.5. Para a classe custom, 0.6 foi o ótimo." },
      ],
    },
    {
      id: "numbers",
      title: "Números",
      blocks: [
        {
          kind: "table",
          head: ["Conjunto", "Build", "Acur. de caminho", "Acur. de rota", "Sem loop lento", "p50 / p95"],
          rows: [
            ["dev (130)", "antes", "81.5%", "89.2%", "52.3%", "288 / 396 ms"],
            ["dev (130)", "depois", "96.2%", "100%", "63.8%", "311 / 392 ms"],
            ["holdout (45)", "antes", "73.3%", "84.4%", "46.7%", "322 / 422 ms"],
            ["holdout (45)", "depois", "95.6%", "97.8%", "66.7%", "301 / 416 ms"],
          ],
        },
        { kind: "p", text: "A latência ficou em cerca de 300 ms de p50 e 400 ms de p95. As falhas de triage foram 0 de 175. O holdout não foi usado durante o ajuste, por isso confio mais nos 95.6 do que nos 96.2." },
        { kind: "p", text: "Com 45 itens de holdout, 95.6% são 43 acertos. O intervalo é largo (cerca de 85 a 99 com Wilson, cálculo meu), então leio o holdout como uma checagem de overfitting, não como uma taxa precisa." },
      ],
    },
    {
      id: "left",
      title: "O que sobrou",
      blocks: [
        { kind: "p", text: "Nomes de produtos e categorias em texto livre, e visões derivadas como variação de preço, ainda são construídos sem adaptar. Um pedido de três formas de pagamento é adaptado embora um template o cubra, o que custa uma rodada extra mas ainda devolve a saída certa. Registrei isso no doc como erros residuais conhecidos." },
      ],
    },
  ],
};
