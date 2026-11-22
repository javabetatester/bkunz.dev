import type { Post } from "./types";

const post: Post = {
  slug: "mcnemar-for-paired-evals",
  category: "studies",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "McNemar for paired evals",
  summary: "Why a before-and-after eval on the same items needs a paired test, the exact two-sided McNemar test in a dozen lines, and a worked example: 172 to 183 correct of 188, 15 fixed, 4 broken, p = 0.019.",
  tags: ["evals", "statistics", "mcnemar", "typescript"],
  project: "versatile-sh",
  sections: [
    {
      id: "why-paired",
      title: "Why the comparison is paired",
      blocks: [
        { kind: "p", text: "When I change a prompt or a router in an AI assistant, I run the same fixed set of items through the old build and the new one. Every item then has two outcomes: pass or fail on the baseline, pass or fail on the candidate. That is a paired design, and the usual two-proportion test ignores it." },
        { kind: "p", text: "A two-proportion test treats 172/188 and 183/188 as two independent samples. They are not. The same 188 items sit on both sides, and most of them behave the same way in both builds. That shared difficulty is variance the unpaired test counts as noise, so it is less sensitive than it needs to be." },
        { kind: "p", text: "The paired view throws the shared part away. Items that pass on both builds, or fail on both, say nothing about which build is better. Only the items that changed side carry information." },
      ],
    },
    {
      id: "the-table",
      title: "The 2x2 table and the test",
      blocks: [
        { kind: "p", text: "Count the items by their pair of outcomes. Two cells are the discordant ones: fixed (failed on baseline, passes on candidate) and broken (the reverse)." },
        {
          kind: "table",
          head: ["", "candidate pass", "candidate fail"],
          rows: [
            ["baseline pass", "168 (both pass)", "4 (broken)"],
            ["baseline fail", "15 (fixed)", "1 (both fail)"],
          ],
        },
        { kind: "p", text: "Under the null hypothesis that the two builds are equally good, each discordant item is equally likely to fall in either cell. So with n = fixed + broken discordant items, the number of fixed ones is Binomial(n, 1/2). The exact two-sided p-value is twice the smaller tail, capped at 1." },
        { kind: "p", text: "No chi-square approximation is needed, and none is wise here: with 19 discordant items the approximation has little to stand on. The exact version is cheap." },
        { kind: "callout", tone: "note", text: "The both-pass and both-fail counts in the table follow from the totals. 172 + 15 - 4 = 183 pass on the candidate, and the 188 - 172 - 15 = 1 item that fails on both builds is the remainder." },
      ],
    },
    {
      id: "code",
      title: "The function",
      blocks: [
        { kind: "p", text: "The loop below walks the binomial pmf upward with the ratio term(i+1) = term(i) * (n - i) / (i + 1), starting from 0.5^n. It accumulates the lower tail up to min(b, c) and doubles it." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function mcnemarExact(b: number, c: number): number {",
            "  const n = b + c;",
            "  if (n === 0) return 1;",
            "  const k = Math.min(b, c);",
            "  let term = 0.5 ** n;",
            "  let cdf = 0;",
            "  for (let i = 0; i <= k; i++) {",
            "    cdf += term;",
            "    term = (term * (n - i)) / (i + 1);",
            "  }",
            "  return Math.min(1, 2 * cdf);",
            "}",
          ].join("\n"),
          caption: "b = items fixed, c = items broken. Returns the exact two-sided p-value.",
        },
        { kind: "p", text: "Limit: 0.5^n underflows to zero once n passes roughly 1,070 discordant items, and the loop would then return 0. Eval sets I run are far below that. If yours are not, work in log space." },
        { kind: "p", text: "I ran it on this machine (AMD Ryzen 7 5700X, Linux, Node v26.13.0, node --experimental-strip-types run.ts). The code lives in my lab repository under paired-evals. The results are deterministic, so there is no spread to report." },
        {
          kind: "table",
          head: ["fixed", "broken", "exact two-sided p"],
          rows: [
            ["15", "4", "0.0192"],
            ["8", "1", "0.0391"],
            ["2", "1", "1"],
            ["47", "0", "1.42e-14"],
          ],
        },
      ],
    },
    {
      id: "worked",
      title: "The worked example",
      blocks: [
        { kind: "p", text: "A recent change to the assistant's front door was evaluated on 188 items. The baseline answered 172 correctly (91.5%) and the candidate 183 (97.3%). The candidate fixed 15 items and broke 4." },
        { kind: "p", text: "n = 19 discordant items, and the smaller side is 4. The exact two-sided p is 0.0192, which I report as p = 0.019." },
        { kind: "p", text: "A 5.9-point gain on 188 items sounds decisive, but the test only sees 19 items. The evidence is real but not huge. If the candidate had fixed 15 and broken 8, p would be 0.21 and I would not claim a win." },
        { kind: "callout", tone: "warn", text: "Four items broke. The p-value says the net gain is unlikely to be chance. It does not say the four regressions are acceptable. I read those four before shipping, whatever the test says." },
      ],
    },
    {
      id: "limits",
      title: "What it does not tell you",
      blocks: [
        { kind: "list", items: [
          "It tests this item set only. Items drawn from one generator and one seed generalise to that distribution, not to production traffic.",
          "It needs pass/fail per item. A graded score per item wants a paired test on differences instead.",
          "It says nothing about effect size. Pair it with an interval on each pass rate (see the Wilson post) and the raw counts of fixed and broken.",
          "If the grader is noisy, the discordant cells fill with grader disagreement. I use two blind graders and a third on disagreements, and report the agreement.",
        ] },
        { kind: "p", text: "The habit I keep: always publish the 2x2, not only the p. 15 fixed and 4 broken tells a reader more than any single number." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "mcnemar-for-paired-evals",
  category: "studies",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "McNemar para evals pareados",
  summary: "Por qué un eval de antes y después sobre los mismos ítems necesita un test pareado, el test exacto de McNemar de dos colas en una docena de líneas y un ejemplo resuelto: de 172 a 183 correctos de 188, 15 arreglados, 4 rotos, p = 0.019.",
  tags: ["evals", "statistics", "mcnemar", "typescript"],
  project: "versatile-sh",
  sections: [
    {
      id: "why-paired",
      title: "Por qué la comparación es pareada",
      blocks: [
        { kind: "p", text: "Cuando cambio un prompt o un router en un asistente de IA, paso el mismo conjunto fijo de ítems por la build vieja y por la nueva. Cada ítem tiene entonces dos resultados: aprobar o fallar en el baseline, aprobar o fallar en el candidate. Eso es un diseño pareado, y el test habitual de dos proporciones lo ignora." },
        { kind: "p", text: "Un test de dos proporciones trata 172/188 y 183/188 como dos muestras independientes. No lo son. Los mismos 188 ítems están en ambos lados, y la mayoría se comporta igual en ambas builds. Esa dificultad compartida es varianza que el test no pareado cuenta como ruido, así que es menos sensible de lo necesario." },
        { kind: "p", text: "La vista pareada descarta la parte compartida. Los ítems que pasan en ambas builds, o fallan en ambas, no dicen nada sobre cuál build es mejor. Solo los ítems que cambiaron de lado llevan información." },
      ],
    },
    {
      id: "the-table",
      title: "La tabla 2x2 y el test",
      blocks: [
        { kind: "p", text: "Cuenta los ítems por su par de resultados. Dos celdas son las discordantes: fixed (falló en baseline, pasa en candidate) y broken (lo contrario)." },
        {
          kind: "table",
          head: ["", "candidate pasa", "candidate falla"],
          rows: [
            ["baseline pasa", "168 (ambos pasan)", "4 (broken)"],
            ["baseline falla", "15 (fixed)", "1 (ambos fallan)"],
          ],
        },
        { kind: "p", text: "Bajo la hipótesis nula de que las dos builds son igual de buenas, cada ítem discordante tiene la misma probabilidad de caer en cualquiera de las dos celdas. Así que con n = fixed + broken ítems discordantes, el número de arreglados es Binomial(n, 1/2). El valor p exacto de dos colas es el doble de la cola menor, con tope en 1." },
        { kind: "p", text: "No hace falta la aproximación chi-cuadrado, y aquí no es prudente: con 19 ítems discordantes la aproximación tiene poco en qué apoyarse. La versión exacta es barata." },
        { kind: "callout", tone: "note", text: "Los conteos de ambos-pasan y ambos-fallan de la tabla se deducen de los totales. 172 + 15 - 4 = 183 pasan en el candidate, y el ítem 188 - 172 - 15 = 1 que falla en ambas builds es el resto." },
      ],
    },
    {
      id: "code",
      title: "La función",
      blocks: [
        { kind: "p", text: "El bucle de abajo recorre la pmf binomial hacia arriba con la razón term(i+1) = term(i) * (n - i) / (i + 1), empezando en 0.5^n. Acumula la cola inferior hasta min(b, c) y la duplica." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function mcnemarExact(b: number, c: number): number {",
            "  const n = b + c;",
            "  if (n === 0) return 1;",
            "  const k = Math.min(b, c);",
            "  let term = 0.5 ** n;",
            "  let cdf = 0;",
            "  for (let i = 0; i <= k; i++) {",
            "    cdf += term;",
            "    term = (term * (n - i)) / (i + 1);",
            "  }",
            "  return Math.min(1, 2 * cdf);",
            "}",
          ].join("\n"),
          caption: "b = ítems arreglados, c = ítems rotos. Devuelve el valor p exacto de dos colas.",
        },
        { kind: "p", text: "Límite: 0.5^n hace underflow a cero cuando n pasa de unos 1,070 ítems discordantes, y el bucle devolvería 0. Los conjuntos de eval que ejecuto están muy por debajo. Si los tuyos no, trabaja en espacio logarítmico." },
        { kind: "p", text: "Lo ejecuté en esta máquina (AMD Ryzen 7 5700X, Linux, Node v26.13.0, node --experimental-strip-types run.ts). El código vive en mi repositorio de laboratorio bajo paired-evals. Los resultados son deterministas, así que no hay dispersión que reportar." },
        {
          kind: "table",
          head: ["arreglados", "rotos", "p exacto de dos colas"],
          rows: [
            ["15", "4", "0.0192"],
            ["8", "1", "0.0391"],
            ["2", "1", "1"],
            ["47", "0", "1.42e-14"],
          ],
        },
      ],
    },
    {
      id: "worked",
      title: "El ejemplo resuelto",
      blocks: [
        { kind: "p", text: "Un cambio reciente en la puerta de entrada del asistente se evaluó con 188 ítems. El baseline respondió 172 correctamente (91.5%) y el candidate 183 (97.3%). El candidate arregló 15 ítems y rompió 4." },
        { kind: "p", text: "n = 19 ítems discordantes, y el lado menor es 4. El p exacto de dos colas es 0.0192, que reporto como p = 0.019." },
        { kind: "p", text: "Una ganancia de 5.9 puntos en 188 ítems suena decisiva, pero el test solo ve 19 ítems. La evidencia es real pero no enorme. Si el candidate hubiera arreglado 15 y roto 8, p sería 0.21 y no afirmaría una victoria." },
        { kind: "callout", tone: "warn", text: "Cuatro ítems se rompieron. El valor p dice que la ganancia neta difícilmente es azar. No dice que las cuatro regresiones sean aceptables. Leo esas cuatro antes de publicar, diga lo que diga el test." },
      ],
    },
    {
      id: "limits",
      title: "Lo que no te dice",
      blocks: [
        { kind: "list", items: [
          "Solo prueba este conjunto de ítems. Los ítems de un generador y una seed generalizan a esa distribución, no al tráfico de producción.",
          "Necesita aprobar/fallar por ítem. Un puntaje graduado por ítem pide un test pareado sobre diferencias.",
          "No dice nada sobre el tamaño del efecto. Combínalo con un intervalo para cada tasa de acierto (ver el post de Wilson) y los conteos crudos de arreglados y rotos.",
          "Si el grader es ruidoso, las celdas discordantes se llenan de desacuerdo del grader. Uso dos graders ciegos y un tercero para los desacuerdos, y reporto el acuerdo.",
        ] },
        { kind: "p", text: "El hábito que mantengo: publicar siempre el 2x2, no solo la p. 15 arreglados y 4 rotos le dice más a un lector que cualquier número solo." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "mcnemar-for-paired-evals",
  category: "studies",
  date: "2026-10-27",
  published: "2026-11-21",
  title: "McNemar para evals pareados",
  summary: "Por que um eval de antes e depois sobre os mesmos itens precisa de um teste pareado, o teste exato de McNemar bicaudal em uma dúzia de linhas e um exemplo resolvido: de 172 para 183 corretos de 188, 15 corrigidos, 4 quebrados, p = 0.019.",
  tags: ["evals", "statistics", "mcnemar", "typescript"],
  project: "versatile-sh",
  sections: [
    {
      id: "why-paired",
      title: "Por que a comparação é pareada",
      blocks: [
        { kind: "p", text: "Quando mudo um prompt ou um router em um assistente de IA, passo o mesmo conjunto fixo de itens pela build velha e pela nova. Cada item tem então dois resultados: passar ou falhar no baseline, passar ou falhar no candidate. Isso é um desenho pareado, e o teste usual de duas proporções o ignora." },
        { kind: "p", text: "Um teste de duas proporções trata 172/188 e 183/188 como duas amostras independentes. Não são. Os mesmos 188 itens estão nos dois lados, e a maioria se comporta do mesmo jeito nas duas builds. Essa dificuldade compartilhada é variância que o teste não pareado conta como ruído, então ele é menos sensível do que precisa ser." },
        { kind: "p", text: "A visão pareada descarta a parte compartilhada. Itens que passam nas duas builds, ou falham nas duas, não dizem nada sobre qual build é melhor. Só os itens que mudaram de lado carregam informação." },
      ],
    },
    {
      id: "the-table",
      title: "A tabela 2x2 e o teste",
      blocks: [
        { kind: "p", text: "Conte os itens pelo par de resultados. Duas células são as discordantes: fixed (falhou no baseline, passa no candidate) e broken (o inverso)." },
        {
          kind: "table",
          head: ["", "candidate passa", "candidate falha"],
          rows: [
            ["baseline passa", "168 (ambos passam)", "4 (broken)"],
            ["baseline falha", "15 (fixed)", "1 (ambos falham)"],
          ],
        },
        { kind: "p", text: "Sob a hipótese nula de que as duas builds são igualmente boas, cada item discordante tem a mesma chance de cair em qualquer das duas células. Então, com n = fixed + broken itens discordantes, o número de corrigidos é Binomial(n, 1/2). O valor p exato bicaudal é o dobro da cauda menor, limitado a 1." },
        { kind: "p", text: "Não é preciso a aproximação qui-quadrado, e aqui ela não é prudente: com 19 itens discordantes a aproximação tem pouco em que se apoiar. A versão exata é barata." },
        { kind: "callout", tone: "note", text: "As contagens de ambos-passam e ambos-falham da tabela decorrem dos totais. 172 + 15 - 4 = 183 passam no candidate, e o item 188 - 172 - 15 = 1 que falha nas duas builds é o resto." },
      ],
    },
    {
      id: "code",
      title: "A função",
      blocks: [
        { kind: "p", text: "O laço abaixo percorre a pmf binomial para cima com a razão term(i+1) = term(i) * (n - i) / (i + 1), começando em 0.5^n. Ele acumula a cauda inferior até min(b, c) e a dobra." },
        {
          kind: "code",
          lang: "ts",
          code: [
            "export function mcnemarExact(b: number, c: number): number {",
            "  const n = b + c;",
            "  if (n === 0) return 1;",
            "  const k = Math.min(b, c);",
            "  let term = 0.5 ** n;",
            "  let cdf = 0;",
            "  for (let i = 0; i <= k; i++) {",
            "    cdf += term;",
            "    term = (term * (n - i)) / (i + 1);",
            "  }",
            "  return Math.min(1, 2 * cdf);",
            "}",
          ].join("\n"),
          caption: "b = itens corrigidos, c = itens quebrados. Devolve o valor p exato bicaudal.",
        },
        { kind: "p", text: "Limite: 0.5^n sofre underflow para zero quando n passa de uns 1,070 itens discordantes, e o laço devolveria 0. Os conjuntos de eval que rodo ficam bem abaixo disso. Se os seus não ficam, trabalhe em espaço logarítmico." },
        { kind: "p", text: "Rodei nesta máquina (AMD Ryzen 7 5700X, Linux, Node v26.13.0, node --experimental-strip-types run.ts). O código mora no meu repositório de laboratório em paired-evals. Os resultados são determinísticos, então não há dispersão para reportar." },
        {
          kind: "table",
          head: ["corrigidos", "quebrados", "p exato bicaudal"],
          rows: [
            ["15", "4", "0.0192"],
            ["8", "1", "0.0391"],
            ["2", "1", "1"],
            ["47", "0", "1.42e-14"],
          ],
        },
      ],
    },
    {
      id: "worked",
      title: "O exemplo resolvido",
      blocks: [
        { kind: "p", text: "Uma mudança recente na porta de entrada do assistente foi avaliada com 188 itens. O baseline acertou 172 (91.5%) e o candidate 183 (97.3%). O candidate corrigiu 15 itens e quebrou 4." },
        { kind: "p", text: "n = 19 itens discordantes, e o lado menor é 4. O p exato bicaudal é 0.0192, que reporto como p = 0.019." },
        { kind: "p", text: "Um ganho de 5.9 pontos em 188 itens soa decisivo, mas o teste só vê 19 itens. A evidência é real, mas não enorme. Se o candidate tivesse corrigido 15 e quebrado 8, p seria 0.21 e eu não afirmaria vitória." },
        { kind: "callout", tone: "warn", text: "Quatro itens quebraram. O valor p diz que o ganho líquido dificilmente é acaso. Não diz que as quatro regressões são aceitáveis. Leio esses quatro antes de lançar, o que quer que o teste diga." },
      ],
    },
    {
      id: "limits",
      title: "O que ele não diz",
      blocks: [
        { kind: "list", items: [
          "Só testa este conjunto de itens. Itens de um gerador e uma seed generalizam para essa distribuição, não para o tráfego de produção.",
          "Precisa de passa/falha por item. Uma nota graduada por item pede um teste pareado sobre diferenças.",
          "Não diz nada sobre o tamanho do efeito. Combine com um intervalo para cada taxa de acerto (veja o post sobre Wilson) e as contagens cruas de corrigidos e quebrados.",
          "Se o grader é ruidoso, as células discordantes se enchem de desacordo do grader. Uso dois graders cegos e um terceiro para os desacordos, e reporto a concordância.",
        ] },
        { kind: "p", text: "O hábito que mantenho: sempre publicar o 2x2, não só o p. 15 corrigidos e 4 quebrados dizem a um leitor mais que qualquer número isolado." },
      ],
    },
  ],
};
