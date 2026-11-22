import type { Post } from "./types";

const post: Post = {
  slug: "knowledge-round-4-small-gains",
  category: "daily",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "Knowledge round 4: small gains, honest numbers",
  summary: "Round four of the assistant's help answers moved paired scores by one or two items out of 120 to 160. What I changed, what I measured, and why I did not call it a win.",
  tags: ["assistant", "evals", "paired", "knowledge"],
  project: "versatile-sh",
  sections: [
    {
      id: "changes",
      title: "What changed",
      blocks: [
        { kind: "p", text: "The assistant also answers where-is-it and how-does-it-work questions about the product it lives in. Round 4 of that work was a handful of deterministic rules over what the front reading returns, with no prompt change:" },
        { kind: "list", items: [
          "When the reading says an answer is a near match, the reply says so instead of presenting it as exact.",
          "A capability the assistant cannot act on answers where to do it yourself, and says that it does not do it yet. These answers skip the brief cut, so a part of a multi-topic message keeps its place.",
          "An action request nobody builds answers where you change it.",
          "A what-or-why part with no topic picked by the reading is no longer answered by the guide of its screen.",
          "A few product areas became routable catalog entries, so their questions reach a real answer.",
        ] },
      ],
    },
    {
      id: "measure",
      title: "What I measured",
      blocks: [
        { kind: "p", text: "Paired against the current dev build, same asks in both arms at the same time, new seeds each run:" },
        {
          kind: "table",
          head: ["Run", "Dev", "Round 4", "Won / lost", "Exact p"],
          rows: [
            ["160 items, seeds 7013, 8429, 2647", "147", "149", "4 / 2", "0.69"],
            ["120 items, seeds 3911, 6083, final code", "107", "108", "2 / 1", "1.0"],
          ],
        },
        { kind: "p", text: "The 40-item slice I had been watching went from 37 to 37 in the first run and from 37 to 39 in the second. No loss in that slice in either run. Answers were shuffled with the arm hidden, graded by two blind graders, with a third on disagreements." },
        { kind: "p", text: "The same day I recorded two other paired runs from sibling work: 8 gained and 1 lost on 88 comparison asks (p = 0.039), and 17 gained and 1 lost on 30 courier asks. Those are real gains. This one is not." },
      ],
    },
    {
      id: "reading",
      title: "How I read it",
      blocks: [
        { kind: "p", text: "Six discordant items in the first run and three in the second. With that few, no outcome can reach significance: even 6 to 0 would give p = 0.031 and 3 to 0 gives p = 0.25. The test could not have said yes, and it did not." },
        { kind: "p", text: "What the round does show is no regression in the focus slice, and a clearer answer shape for cases that used to read as exact when they were not. One of the three losses was a card description cut at 140 characters; I shortened it after the run and added a test." },
        { kind: "p", text: "I shipped it for those reasons, and recorded the headline as a null." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "knowledge-round-4-small-gains",
  category: "daily",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "Knowledge ronda 4: ganancias pequeñas, números honestos",
  summary: "La cuarta ronda de las respuestas de ayuda del asistente movió los puntajes pareados en uno o dos ítems de 120 a 160. Qué cambié, qué medí y por qué no lo llamé una victoria.",
  tags: ["assistant", "evals", "paired", "knowledge"],
  project: "versatile-sh",
  sections: [
    {
      id: "changes",
      title: "Qué cambió",
      blocks: [
        { kind: "p", text: "El asistente también responde preguntas de dónde está y cómo funciona sobre el producto en el que vive. La ronda 4 de ese trabajo fue un puñado de reglas deterministas sobre lo que devuelve la lectura frontal, sin cambios en el prompt:" },
        { kind: "list", items: [
          "Cuando la lectura dice que una respuesta es una coincidencia cercana, la respuesta lo dice en lugar de presentarla como exacta.",
          "Una capacidad sobre la que el asistente no puede actuar responde dónde hacerlo uno mismo, y dice que todavía no lo hace. Estas respuestas se saltan el recorte de brevedad, así que una parte de un mensaje de varios temas conserva su lugar.",
          "Una solicitud de acción que nadie construye responde dónde se cambia.",
          "Una parte de qué o por qué sin tema elegido por la lectura ya no la responde la guía de su pantalla.",
          "Algunas áreas del producto pasaron a ser entradas de catálogo enrutables, de modo que sus preguntas llegan a una respuesta real.",
        ] },
      ],
    },
    {
      id: "measure",
      title: "Qué medí",
      blocks: [
        { kind: "p", text: "Pareado contra la build dev actual, las mismas preguntas en ambos brazos al mismo tiempo, seeds nuevas en cada ejecución:" },
        {
          kind: "table",
          head: ["Ejecución", "Dev", "Ronda 4", "Ganó / perdió", "p exacto"],
          rows: [
            ["160 ítems, seeds 7013, 8429, 2647", "147", "149", "4 / 2", "0.69"],
            ["120 ítems, seeds 3911, 6083, código final", "107", "108", "2 / 1", "1.0"],
          ],
        },
        { kind: "p", text: "El corte de 40 ítems que venía observando pasó de 37 a 37 en la primera ejecución y de 37 a 39 en la segunda. Ninguna pérdida en ese corte en ninguna de las dos. Las respuestas se mezclaron con el brazo oculto, calificadas por dos graders ciegos, con un tercero para los desacuerdos." },
        { kind: "p", text: "El mismo día registré otras dos ejecuciones pareadas de trabajo hermano: 8 ganados y 1 perdido en 88 preguntas de comparación (p = 0.039), y 17 ganados y 1 perdido en 30 preguntas de mensajería. Esas son ganancias reales. Esta no." },
      ],
    },
    {
      id: "reading",
      title: "Cómo lo leo",
      blocks: [
        { kind: "p", text: "Seis ítems discordantes en la primera ejecución y tres en la segunda. Con tan pocos, ningún resultado puede alcanzar significancia: incluso 6 a 0 daría p = 0.031 y 3 a 0 da p = 0.25. El test no podía decir que sí, y no lo dijo." },
        { kind: "p", text: "Lo que la ronda sí muestra es ninguna regresión en el corte de foco, y una forma de respuesta más clara para casos que antes parecían exactos sin serlo. Una de las tres pérdidas fue una descripción de tarjeta cortada a 140 caracteres; la acorté después de la ejecución y añadí un test." },
        { kind: "p", text: "Lo publiqué por esas razones, y registré el titular como un nulo." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "knowledge-round-4-small-gains",
  category: "daily",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "Knowledge rodada 4: ganhos pequenos, números honestos",
  summary: "A quarta rodada das respostas de ajuda do assistente moveu as pontuações pareadas em um ou dois itens de 120 a 160. O que mudei, o que medi e por que não chamei de vitória.",
  tags: ["assistant", "evals", "paired", "knowledge"],
  project: "versatile-sh",
  sections: [
    {
      id: "changes",
      title: "O que mudou",
      blocks: [
        { kind: "p", text: "O assistente também responde perguntas de onde fica e como funciona sobre o produto em que vive. A rodada 4 desse trabalho foi um punhado de regras determinísticas sobre o que a leitura frontal devolve, sem mudança no prompt:" },
        { kind: "list", items: [
          "Quando a leitura diz que uma resposta é uma correspondência próxima, a resposta diz isso em vez de apresentá-la como exata.",
          "Uma capacidade sobre a qual o assistente não pode agir responde onde fazer você mesmo, e diz que ainda não faz isso. Essas respostas pulam o corte de brevidade, então uma parte de uma mensagem com vários assuntos mantém seu lugar.",
          "Um pedido de ação que ninguém constrói responde onde você muda.",
          "Uma parte de o quê ou por quê sem tópico escolhido pela leitura não é mais respondida pelo guia da sua tela.",
          "Algumas áreas do produto viraram entradas de catálogo roteáveis, para que suas perguntas cheguem a uma resposta real.",
        ] },
      ],
    },
    {
      id: "measure",
      title: "O que medi",
      blocks: [
        { kind: "p", text: "Pareado contra a build dev atual, as mesmas perguntas nos dois braços ao mesmo tempo, seeds novas a cada execução:" },
        {
          kind: "table",
          head: ["Execução", "Dev", "Rodada 4", "Ganhou / perdeu", "p exato"],
          rows: [
            ["160 itens, seeds 7013, 8429, 2647", "147", "149", "4 / 2", "0.69"],
            ["120 itens, seeds 3911, 6083, código final", "107", "108", "2 / 1", "1.0"],
          ],
        },
        { kind: "p", text: "O recorte de 40 itens que eu vinha acompanhando foi de 37 para 37 na primeira execução e de 37 para 39 na segunda. Nenhuma perda nesse recorte em nenhuma das duas. As respostas foram embaralhadas com o braço oculto, avaliadas por dois graders cegos, com um terceiro para os desacordos." },
        { kind: "p", text: "No mesmo dia registrei duas outras execuções pareadas de trabalho irmão: 8 ganhos e 1 perda em 88 perguntas de comparação (p = 0.039), e 17 ganhos e 1 perda em 30 perguntas de entregador. Esses são ganhos reais. Este não é." },
      ],
    },
    {
      id: "reading",
      title: "Como eu leio",
      blocks: [
        { kind: "p", text: "Seis itens discordantes na primeira execução e três na segunda. Com tão poucos, nenhum resultado alcança significância: mesmo 6 a 0 daria p = 0.031 e 3 a 0 dá p = 0.25. O teste não podia dizer sim, e não disse." },
        { kind: "p", text: "O que a rodada mostra é nenhuma regressão no recorte de foco, e um formato de resposta mais claro para casos que antes pareciam exatos sem ser. Uma das três perdas foi uma descrição de card cortada em 140 caracteres; encurtei depois da execução e adicionei um teste." },
        { kind: "p", text: "Lancei por esses motivos, e registrei a manchete como um nulo." },
      ],
    },
  ],
};
