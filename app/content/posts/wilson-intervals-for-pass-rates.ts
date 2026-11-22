import type { Post } from "./types";

const post: Post = {
  slug: "wilson-intervals-for-pass-rates",
  category: "studies",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "Wilson intervals for pass rates",
  summary: "Why the normal approximation breaks for small eval sets near 100%, the Wilson score interval in a few lines, and the numbers: 183/188 gives 93.9 to 98.9, and 64/65 gives 91.8 to 99.7.",
  tags: ["evals", "statistics", "confidence-interval", "typescript"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem with p plus or minus z",
      blocks: [
        { kind: "p", text: "An eval gives me a pass rate: x passes out of n items. The textbook interval is p +/- z * sqrt(p(1-p)/n), the Wald interval. It is what most people reach for, and it is wrong exactly where evals live: small n and a pass rate near 100%." },
        { kind: "p", text: "Two failure modes. First, it can leave the valid range. Second, when p is 1 the standard error is 0, so the interval collapses to a point and claims certainty from a handful of items." },
        { kind: "p", text: "The numbers below come from a script I ran, not from memory. Node v26.13.0 on Linux, AMD Ryzen 7 5700X, z = 1.959964. The code is in my lab repository under paired-evals." },
      ],
    },
    {
      id: "wilson",
      title: "The Wilson score interval",
      blocks: [
        { kind: "p", text: "Wilson inverts the score test instead of plugging the observed p into the variance. The centre is pulled toward 1/2 and the width adapts to n. It never leaves [0, 1], and it does not collapse at p = 1." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function wilson(x: number, n: number, z = 1.959964): [number, number] {",
            "  const p = x / n;",
            "  const d = 1 + (z * z) / n;",
            "  const c = (p + (z * z) / (2 * n)) / d;",
            "  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;",
            "  return [c - h, c + h];",
            "}",
          ].join("\n"),
          caption: "95% interval for x passes in n items. Multiply by 100 for percent.",
        },
        { kind: "p", text: "For reference, the Wald version is the same three lines without the correction: p plus or minus z * sqrt(p(1-p)/n). I computed both on the same inputs." },
      ],
    },
    {
      id: "numbers",
      title: "The numbers",
      blocks: [
        {
          kind: "table",
          head: ["Pass rate", "Wilson 95%", "Wald 95%"],
          rows: [
            ["172/188", "86.6 - 94.7", "87.5 - 95.5"],
            ["183/188", "93.9 - 98.9", "95.0 - 99.6"],
            ["64/65", "91.8 - 99.7", "95.5 - 101.5"],
          ],
        },
        { kind: "p", text: "183/188 is 97.3%. Wilson says 93.9 to 98.9. Wald says 95.0 to 99.6, which is narrower and sits higher: it is optimistic at both ends." },
        { kind: "p", text: "64/65 is 98.5%. Wald gives an upper bound of 101.5%, a pass rate no eval can have. Wilson gives 91.8 to 99.7. That lower bound is the honest part: with 65 items, I cannot rule out a true pass rate near 92%." },
        { kind: "p", text: "Another pair from my records: a 52-ask battery went from 3/52 to 50/52. Wilson gives 2.0 to 15.6 for the first and 87.0 to 98.9 for the second. The intervals do not touch, and that is the story. Computing them again here reproduced those recorded figures." },
        { kind: "callout", tone: "note", text: "At the edge, 0/10 gives 0.0 to 27.8 and 10/10 gives 72.2 to 100.0. Ten clean passes do not show a 99% rate. They show a rate above about 72%." },
      ],
    },
    {
      id: "use",
      title: "How I use it",
      blocks: [
        { kind: "list", items: [
          "Every pass rate in a report carries its n and its Wilson interval. A bare 98.5% is not a result.",
          "Overlapping intervals between two builds do not prove no difference. The items are the same on both sides, so the paired test (see the McNemar post) is the right tool for the comparison. The interval is for the absolute level.",
          "I read the lower bound as the number I can defend. 64/65 is a good result and a weak claim about 98.5%.",
          "Clopper-Pearson is the exact alternative. It is conservative (wider) and fine if you prefer never to undercover. I use Wilson because it is short and its coverage is close to nominal.",
        ] },
        { kind: "p", text: "Limit: Wilson assumes the items are independent draws. Eval items generated from templates, or several asks about the same menu item, are correlated, and the true uncertainty is larger than the interval says. I note the generator and seed next to the interval for that reason." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Intervalos de Wilson para tasas de aprobación",
  summary: "Por qué la aproximación normal falla en conjuntos de eval pequeños cerca de 100%, el intervalo de puntaje de Wilson en pocas líneas, y los números: 183/188 da 93.9 a 98.9, y 64/65 da 91.8 a 99.7.",
  sections: [
    {
      id: "problem",
      title: "El problema de p más o menos z",
      blocks: [
        { kind: "p", text: "Un eval me da una tasa de aprobación: x aprobados de n ítems. El intervalo de los libros de texto es p +/- z * sqrt(p(1-p)/n), el intervalo de Wald. Es lo que la mayoría busca primero, y está mal justo donde viven los evals: n pequeño y una tasa de aprobación cerca de 100%." },
        { kind: "p", text: "Dos modos de falla. Primero, puede salirse del rango válido. Segundo, cuando p es 1 el error estándar es 0, así que el intervalo colapsa a un punto y afirma certeza con un puñado de ítems." },
        { kind: "p", text: "Los números de abajo salen de un script que corrí, no de memoria. Node v26.13.0 en Linux, AMD Ryzen 7 5700X, z = 1.959964. El código está en mi repositorio de laboratorio bajo paired-evals." },
      ],
    },
    {
      id: "wilson",
      title: "El intervalo de puntaje de Wilson",
      blocks: [
        { kind: "p", text: "Wilson invierte el test de puntaje en lugar de meter la p observada en la varianza. El centro se acerca a 1/2 y el ancho se adapta a n. Nunca sale de [0, 1] y no colapsa en p = 1." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function wilson(x: number, n: number, z = 1.959964): [number, number] {",
            "  const p = x / n;",
            "  const d = 1 + (z * z) / n;",
            "  const c = (p + (z * z) / (2 * n)) / d;",
            "  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;",
            "  return [c - h, c + h];",
            "}",
          ].join("\n"),
          caption: "Intervalo de 95% para x aprobados en n ítems. Multiplica por 100 para obtener porcentaje.",
        },
        { kind: "p", text: "Como referencia, la versión de Wald son las mismas tres líneas sin la corrección: p más o menos z * sqrt(p(1-p)/n). Calculé ambas con las mismas entradas." },
      ],
    },
    {
      id: "numbers",
      title: "Los números",
      blocks: [
        {
          kind: "table",
          head: ["Tasa de aprobación", "Wilson 95%", "Wald 95%"],
          rows: [
            ["172/188", "86.6 - 94.7", "87.5 - 95.5"],
            ["183/188", "93.9 - 98.9", "95.0 - 99.6"],
            ["64/65", "91.8 - 99.7", "95.5 - 101.5"],
          ],
        },
        { kind: "p", text: "183/188 es 97.3%. Wilson dice 93.9 a 98.9. Wald dice 95.0 a 99.6, que es más angosto y está más arriba: es optimista en ambos extremos." },
        { kind: "p", text: "64/65 es 98.5%. Wald da un límite superior de 101.5%, una tasa de aprobación que ningún eval puede tener. Wilson da 91.8 a 99.7. Ese límite inferior es la parte honesta: con 65 ítems no puedo descartar una tasa real de aprobación cercana a 92%." },
        { kind: "p", text: "Otro par de mis registros: una batería de 52 pedidos pasó de 3/52 a 50/52. Wilson da 2.0 a 15.6 para la primera y 87.0 a 98.9 para la segunda. Los intervalos no se tocan, y esa es la historia. Calcularlos de nuevo aquí reprodujo esas cifras registradas." },
        { kind: "callout", tone: "note", text: "En el borde, 0/10 da 0.0 a 27.8 y 10/10 da 72.2 a 100.0. Diez aprobados limpios no muestran una tasa de 99%. Muestran una tasa por encima de cerca de 72%." },
      ],
    },
    {
      id: "use",
      title: "Cómo lo uso",
      blocks: [
        { kind: "list", items: [
          "Toda tasa de aprobación en un reporte lleva su n y su intervalo de Wilson. Un 98.5% a secas no es un resultado.",
          "Que los intervalos de dos builds se solapen no prueba que no haya diferencia. Los ítems son los mismos en ambos lados, así que el test pareado (ver el post de McNemar) es la herramienta correcta para comparar. El intervalo es para el nivel absoluto.",
          "Leo el límite inferior como el número que puedo defender. 64/65 es un buen resultado y una afirmación débil sobre 98.5%.",
          "Clopper-Pearson es la alternativa exacta. Es conservador (más ancho) y sirve si prefieres no subcubrir nunca. Uso Wilson porque es corto y su cobertura es cercana a la nominal.",
        ] },
        { kind: "p", text: "Límite: Wilson supone que los ítems son muestras independientes. Los ítems de eval generados desde plantillas, o varios pedidos sobre el mismo ítem del menú, están correlacionados, y la incertidumbre real es mayor que la que dice el intervalo. Por eso anoto el generador y la semilla junto al intervalo." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Intervalos de Wilson para taxas de aprovação",
  summary: "Por que a aproximação normal quebra em conjuntos de eval pequenos perto de 100%, o intervalo de escore de Wilson em poucas linhas, e os números: 183/188 dá 93.9 a 98.9, e 64/65 dá 91.8 a 99.7.",
  sections: [
    {
      id: "problem",
      title: "O problema de p mais ou menos z",
      blocks: [
        { kind: "p", text: "Um eval me dá uma taxa de aprovação: x aprovados de n itens. O intervalo dos livros-texto é p +/- z * sqrt(p(1-p)/n), o intervalo de Wald. É o que a maioria busca primeiro, e está errado exatamente onde os evals vivem: n pequeno e taxa de aprovação perto de 100%." },
        { kind: "p", text: "Dois modos de falha. Primeiro, ele pode sair do intervalo válido. Segundo, quando p é 1 o erro padrão é 0, então o intervalo colapsa num ponto e afirma certeza com um punhado de itens." },
        { kind: "p", text: "Os números abaixo vêm de um script que rodei, não da memória. Node v26.13.0 em Linux, AMD Ryzen 7 5700X, z = 1.959964. O código está no meu repositório de laboratório em paired-evals." },
      ],
    },
    {
      id: "wilson",
      title: "O intervalo de escore de Wilson",
      blocks: [
        { kind: "p", text: "Wilson inverte o teste de escore em vez de colocar o p observado na variância. O centro é puxado para 1/2 e a largura se adapta a n. Ele nunca sai de [0, 1] e não colapsa em p = 1." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function wilson(x: number, n: number, z = 1.959964): [number, number] {",
            "  const p = x / n;",
            "  const d = 1 + (z * z) / n;",
            "  const c = (p + (z * z) / (2 * n)) / d;",
            "  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;",
            "  return [c - h, c + h];",
            "}",
          ].join("\n"),
          caption: "Intervalo de 95% para x aprovados em n itens. Multiplique por 100 para obter porcentagem.",
        },
        { kind: "p", text: "Para referência, a versão de Wald são as mesmas três linhas sem a correção: p mais ou menos z * sqrt(p(1-p)/n). Calculei as duas com as mesmas entradas." },
      ],
    },
    {
      id: "numbers",
      title: "Os números",
      blocks: [
        {
          kind: "table",
          head: ["Taxa de aprovação", "Wilson 95%", "Wald 95%"],
          rows: [
            ["172/188", "86.6 - 94.7", "87.5 - 95.5"],
            ["183/188", "93.9 - 98.9", "95.0 - 99.6"],
            ["64/65", "91.8 - 99.7", "95.5 - 101.5"],
          ],
        },
        { kind: "p", text: "183/188 é 97.3%. Wilson diz 93.9 a 98.9. Wald diz 95.0 a 99.6, que é mais estreito e fica mais alto: é otimista nas duas pontas." },
        { kind: "p", text: "64/65 é 98.5%. Wald dá um limite superior de 101.5%, uma taxa de aprovação que nenhum eval pode ter. Wilson dá 91.8 a 99.7. Esse limite inferior é a parte honesta: com 65 itens, não consigo descartar uma taxa real de aprovação perto de 92%." },
        { kind: "p", text: "Outro par dos meus registros: uma bateria de 52 pedidos foi de 3/52 para 50/52. Wilson dá 2.0 a 15.6 para a primeira e 87.0 a 98.9 para a segunda. Os intervalos não se tocam, e essa é a história. Calculá-los de novo aqui reproduziu esses números registrados." },
        { kind: "callout", tone: "note", text: "Na borda, 0/10 dá 0.0 a 27.8 e 10/10 dá 72.2 a 100.0. Dez aprovações limpas não mostram uma taxa de 99%. Mostram uma taxa acima de cerca de 72%." },
      ],
    },
    {
      id: "use",
      title: "Como eu uso",
      blocks: [
        { kind: "list", items: [
          "Toda taxa de aprovação em um relatório carrega seu n e seu intervalo de Wilson. Um 98.5% solto não é um resultado.",
          "Intervalos que se sobrepõem entre dois builds não provam ausência de diferença. Os itens são os mesmos dos dois lados, então o teste pareado (veja o post do McNemar) é a ferramenta certa para a comparação. O intervalo serve para o nível absoluto.",
          "Leio o limite inferior como o número que consigo defender. 64/65 é um bom resultado e uma afirmação fraca sobre 98.5%.",
          "Clopper-Pearson é a alternativa exata. É conservador (mais largo) e serve se você prefere nunca subcobrir. Uso Wilson porque é curto e a cobertura dele é próxima da nominal.",
        ] },
        { kind: "p", text: "Limite: Wilson assume que os itens são amostras independentes. Itens de eval gerados a partir de templates, ou vários pedidos sobre o mesmo item do cardápio, são correlacionados, e a incerteza real é maior do que o intervalo diz. Por isso anoto o gerador e a seed ao lado do intervalo." },
      ],
    },
  ],
};
