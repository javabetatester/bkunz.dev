import type { Post } from "./types";

const post: Post = {
  slug: "the-1ms-animation-that-never-finished",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "The 1 ms animation that never finished",
  summary: "A typed terminal on this site left 148 of 430 glyphs invisible even though the browser reported every animation as finished. The fix, the measurement, and a second gotcha with calc() and var().",
  tags: ["css", "animation", "debugging", "chromium"],
  sections: [
    {
      id: "symptom",
      title: "Symptom",
      blocks: [
        { kind: "p", text: "The home page has a terminal that types itself. To get a per-character reveal without JavaScript timers, each glyph is a span with its own CSS animation, delayed by its index. It looked right on my machine and wrong on others: some characters never appeared." },
        { kind: "p", text: "I counted instead of trusting my eyes. After load, 148 of 430 glyphs had a computed opacity of 0. The odd part is that element.getAnimations() reported those same animations as finished." },
      ],
    },
    {
      id: "before",
      title: "The code that failed",
      blocks: [
        { kind: "code", lang: "css", caption: "before", code: ".type-glyph {\n  opacity: 0;\n  animation: type-glyph 1ms steps(1) var(--d) forwards;\n}\n\n@keyframes type-glyph {\n  to { opacity: 1; }\n}" },
        { kind: "p", text: "The base style hides the glyph. The animation is supposed to flip it to visible after its delay and hold that value with forwards. A one millisecond duration with a single step looked like the cheapest way to say \"switch on at time d\"." },
      ],
    },
    {
      id: "measure",
      title: "How I measured it",
      blocks: [
        { kind: "p", text: "The check is a short script run in the page after load. It walks every glyph, reads the computed opacity, and counts the ones still at 0. It also compares that with the animation state. This is the shape of it, not a test file in the repository." },
        { kind: "code", lang: "js", code: "const glyphs = [...document.querySelectorAll(\".type-glyph\")];\nconst hidden = glyphs.filter((g) => getComputedStyle(g).opacity === \"0\");\nconst finished = glyphs.filter((g) =>\n  g.getAnimations().every((a) => a.playState === \"finished\"),\n);\nconsole.log({ total: glyphs.length, hidden: hidden.length, finished: finished.length });" },
        { kind: "p", text: "Before the fix this printed 430 total and 148 hidden, with the animations reported as finished. A finished animation with a hidden result means the end state of the animation was not applied to the computed style." },
      ],
    },
    {
      id: "fix",
      title: "The fix",
      blocks: [
        { kind: "code", lang: "css", caption: "after", code: ".type-glyph {\n  animation: type-glyph 40ms linear var(--d) both;\n}\n\n@keyframes type-glyph {\n  from { opacity: 0; }\n}" },
        { kind: "list", items: [
          "No base opacity. The element is visible by default, so a glyph can never be stuck hidden by a missing animation effect.",
          "The keyframe animates from the hidden value to the element's own value, so the resting state is the normal style, not a filled-forward value.",
          "both fills backwards as well, which keeps the glyph hidden during its delay.",
          "40 ms linear instead of 1 ms steps(1). The reveal is a short fade rather than a switch.",
        ] },
        { kind: "p", text: "Same script, same page: 0 of 430 hidden." },
        { kind: "callout", tone: "note", text: "Cause, as hypotheses. I did not verify any of this in the Chromium source. One: with a 1 ms duration and many animations starting in the same frames, an animation can reach its end between style updates, and a forwards fill of the final keyframe may not be applied over the opacity: 0 base. Two: the base opacity: 0 and a forwards fill are two separate declarations that must win in the cascade, and I removed that dependency instead of proving which side lost. The fix works; the explanation is a guess." },
      ],
    },
    {
      id: "calc",
      title: "A second gotcha, same day",
      blocks: [
        { kind: "p", text: "The line-by-line typing used one animation per line, with its duration computed from the character count." },
        { kind: "code", lang: "css", code: ".type-line {\n  animation: type calc(var(--chars) * var(--type-step, 20ms)) steps(var(--chars), end) var(--delay, 0ms) both;\n}" },
        { kind: "p", text: "A line of 10 characters had --type-step: 90ms set inline on the same element, so I expected 0.9 s. The computed animation-duration was 0.2 s, which is 10 times the 20 ms fallback. The inline custom property was ignored inside that calc()." },
        { kind: "code", lang: "tsx", caption: "workaround", code: "<span\n  className=\"type-line\"\n  style={{ \"--chars\": text.length, animationDuration: `${text.length * 90}ms` }}\n>" },
        { kind: "p", text: "Setting animationDuration inline gave 0.9 s. As before, I do not know the root cause. My hypotheses are an ordering problem between the shorthand's var() substitution and the inline property, or a unit-typed value reaching calc() as the fallback. Neither is verified." },
      ],
    },
    {
      id: "lesson",
      title: "What I would do next time",
      blocks: [
        { kind: "list", items: [
          "Trust computed style, not getAnimations(). The first said 148 glyphs were hidden; the second said everything was fine.",
          "Make the default state the visible one, and let the animation take things away, not add them.",
          "Avoid sub-frame durations. At 60 Hz one frame is about 16.7 ms, so 1 ms asks for an effect the page cannot show.",
          "When a value is computed from a custom property and comes out as the fallback, set the final value inline and move on.",
        ] },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "La animación de 1 ms que nunca terminó",
  summary: "Una terminal tipeada en este sitio dejó 148 de 430 glifos invisibles aunque el navegador reportaba todas las animaciones como terminadas. El arreglo, la medición y un segundo problema con calc() y var().",
  sections: [
    {
      id: "symptom",
      title: "Síntoma",
      blocks: [
        { kind: "p", text: "La página de inicio tiene una terminal que se escribe sola. Para lograr una revelación por carácter sin timers de JavaScript, cada glifo es un span con su propia animación CSS, retrasada según su índice. En mi máquina se veía bien y en otras mal: algunos caracteres nunca aparecían." },
        { kind: "p", text: "Conté en lugar de confiar en mis ojos. Tras la carga, 148 de 430 glifos tenían una opacidad calculada de 0. Lo raro es que element.getAnimations() reportaba esas mismas animaciones como terminadas." },
      ],
    },
    {
      id: "before",
      title: "El código que falló",
      blocks: [
        { kind: "code", lang: "css", caption: "antes", code: ".type-glyph {\n  opacity: 0;\n  animation: type-glyph 1ms steps(1) var(--d) forwards;\n}\n\n@keyframes type-glyph {\n  to { opacity: 1; }\n}" },
        { kind: "p", text: "El estilo base oculta el glifo. La animación debía pasarlo a visible tras su retraso y mantener ese valor con forwards. Una duración de un milisegundo con un solo paso parecía la forma más barata de decir \"enciéndete en el tiempo d\"." },
      ],
    },
    {
      id: "measure",
      title: "Cómo lo medí",
      blocks: [
        { kind: "p", text: "La verificación es un script corto ejecutado en la página después de la carga. Recorre cada glifo, lee la opacidad calculada y cuenta los que siguen en 0. También lo compara con el estado de la animación. Esta es la forma, no un archivo de test del repositorio." },
        { kind: "code", lang: "js", code: "const glyphs = [...document.querySelectorAll(\".type-glyph\")];\nconst hidden = glyphs.filter((g) => getComputedStyle(g).opacity === \"0\");\nconst finished = glyphs.filter((g) =>\n  g.getAnimations().every((a) => a.playState === \"finished\"),\n);\nconsole.log({ total: glyphs.length, hidden: hidden.length, finished: finished.length });" },
        { kind: "p", text: "Antes del arreglo esto imprimía 430 en total y 148 ocultos, con las animaciones reportadas como terminadas. Una animación terminada con un resultado oculto significa que el estado final de la animación no se aplicó al estilo calculado." },
      ],
    },
    {
      id: "fix",
      title: "El arreglo",
      blocks: [
        { kind: "code", lang: "css", caption: "después", code: ".type-glyph {\n  animation: type-glyph 40ms linear var(--d) both;\n}\n\n@keyframes type-glyph {\n  from { opacity: 0; }\n}" },
        { kind: "list", items: [
          "Sin opacidad base. El elemento es visible por defecto, así que un glifo nunca puede quedar oculto por la falta de un efecto de animación.",
          "El keyframe anima desde el valor oculto hasta el valor propio del elemento, así que el estado de reposo es el estilo normal, no un valor rellenado hacia adelante.",
          "both también rellena hacia atrás, lo que mantiene el glifo oculto durante su retraso.",
          "40 ms linear en lugar de 1 ms steps(1). La revelación es un fundido corto y no un interruptor.",
        ] },
        { kind: "p", text: "Mismo script, misma página: 0 de 430 ocultos." },
        { kind: "callout", tone: "note", text: "Causa, como hipótesis. No verifiqué nada de esto en el código fuente de Chromium. Una: con una duración de 1 ms y muchas animaciones empezando en los mismos frames, una animación puede llegar a su final entre actualizaciones de estilo, y un fill forwards del keyframe final puede no aplicarse sobre la base opacity: 0. Dos: la base opacity: 0 y un fill forwards son dos declaraciones separadas que deben ganar en la cascada, y quité esa dependencia en lugar de probar cuál lado perdía. El arreglo funciona; la explicación es una conjetura." },
      ],
    },
    {
      id: "calc",
      title: "Un segundo problema, el mismo día",
      blocks: [
        { kind: "p", text: "El tipeo línea por línea usaba una animación por línea, con su duración calculada a partir de la cantidad de caracteres." },
        { kind: "code", lang: "css", code: ".type-line {\n  animation: type calc(var(--chars) * var(--type-step, 20ms)) steps(var(--chars), end) var(--delay, 0ms) both;\n}" },
        { kind: "p", text: "Una línea de 10 caracteres tenía --type-step: 90ms fijado inline en el mismo elemento, así que esperaba 0.9 s. La animation-duration calculada fue 0.2 s, que es 10 veces el fallback de 20 ms. La custom property inline se ignoró dentro de ese calc()." },
        { kind: "code", lang: "tsx", caption: "alternativa", code: "<span\n  className=\"type-line\"\n  style={{ \"--chars\": text.length, animationDuration: `${text.length * 90}ms` }}\n>" },
        { kind: "p", text: "Fijar animationDuration inline dio 0.9 s. Igual que antes, no conozco la causa raíz. Mis hipótesis son un problema de orden entre la sustitución de var() del shorthand y la propiedad inline, o un valor con unidad que llega a calc() como el fallback. Ninguna está verificada." },
      ],
    },
    {
      id: "lesson",
      title: "Qué haría la próxima vez",
      blocks: [
        { kind: "list", items: [
          "Confiar en el estilo calculado, no en getAnimations(). El primero dijo que 148 glifos estaban ocultos; el segundo dijo que todo estaba bien.",
          "Hacer que el estado por defecto sea el visible, y dejar que la animación quite cosas, no que las agregue.",
          "Evitar duraciones menores que un frame. A 60 Hz un frame son unos 16.7 ms, así que 1 ms pide un efecto que la página no puede mostrar.",
          "Cuando un valor se calcula a partir de una custom property y sale como el fallback, fijar el valor final inline y seguir adelante.",
        ] },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "A animação de 1 ms que nunca terminou",
  summary: "Um terminal digitado neste site deixou 148 de 430 glifos invisíveis, embora o navegador reportasse todas as animações como concluídas. A correção, a medição e uma segunda pegadinha com calc() e var().",
  sections: [
    {
      id: "symptom",
      title: "Sintoma",
      blocks: [
        { kind: "p", text: "A página inicial tem um terminal que digita sozinho. Para obter uma revelação por caractere sem timers de JavaScript, cada glifo é um span com sua própria animação CSS, atrasada de acordo com o índice. Na minha máquina parecia certo e nas outras errado: alguns caracteres nunca apareciam." },
        { kind: "p", text: "Contei em vez de confiar nos meus olhos. Depois do carregamento, 148 de 430 glifos tinham opacidade calculada 0. O estranho é que element.getAnimations() reportava essas mesmas animações como concluídas." },
      ],
    },
    {
      id: "before",
      title: "O código que falhou",
      blocks: [
        { kind: "code", lang: "css", caption: "antes", code: ".type-glyph {\n  opacity: 0;\n  animation: type-glyph 1ms steps(1) var(--d) forwards;\n}\n\n@keyframes type-glyph {\n  to { opacity: 1; }\n}" },
        { kind: "p", text: "O estilo base esconde o glifo. A animação deveria torná-lo visível depois do atraso e manter esse valor com forwards. Uma duração de um milissegundo com um único passo parecia a forma mais barata de dizer \"ligue no tempo d\"." },
      ],
    },
    {
      id: "measure",
      title: "Como medi",
      blocks: [
        { kind: "p", text: "A checagem é um script curto executado na página depois do carregamento. Ele percorre cada glifo, lê a opacidade calculada e conta os que ainda estão em 0. Também compara isso com o estado da animação. Este é o formato, não um arquivo de teste do repositório." },
        { kind: "code", lang: "js", code: "const glyphs = [...document.querySelectorAll(\".type-glyph\")];\nconst hidden = glyphs.filter((g) => getComputedStyle(g).opacity === \"0\");\nconst finished = glyphs.filter((g) =>\n  g.getAnimations().every((a) => a.playState === \"finished\"),\n);\nconsole.log({ total: glyphs.length, hidden: hidden.length, finished: finished.length });" },
        { kind: "p", text: "Antes da correção isto imprimia 430 no total e 148 ocultos, com as animações reportadas como concluídas. Uma animação concluída com resultado oculto significa que o estado final da animação não foi aplicado ao estilo calculado." },
      ],
    },
    {
      id: "fix",
      title: "A correção",
      blocks: [
        { kind: "code", lang: "css", caption: "depois", code: ".type-glyph {\n  animation: type-glyph 40ms linear var(--d) both;\n}\n\n@keyframes type-glyph {\n  from { opacity: 0; }\n}" },
        { kind: "list", items: [
          "Sem opacidade base. O elemento é visível por padrão, então um glifo nunca fica preso oculto por falta de um efeito de animação.",
          "O keyframe anima do valor oculto até o valor do próprio elemento, então o estado de repouso é o estilo normal, não um valor preenchido para a frente.",
          "both também preenche para trás, o que mantém o glifo oculto durante o atraso.",
          "40 ms linear em vez de 1 ms steps(1). A revelação é um fade curto, não um interruptor.",
        ] },
        { kind: "p", text: "Mesmo script, mesma página: 0 de 430 ocultos." },
        { kind: "callout", tone: "note", text: "Causa, como hipóteses. Não verifiquei nada disso no código-fonte do Chromium. Uma: com duração de 1 ms e muitas animações começando nos mesmos frames, uma animação pode chegar ao fim entre atualizações de estilo, e um fill forwards do keyframe final pode não ser aplicado sobre a base opacity: 0. Duas: a base opacity: 0 e um fill forwards são duas declarações separadas que precisam vencer na cascata, e removi essa dependência em vez de provar qual lado perdia. A correção funciona; a explicação é um palpite." },
      ],
    },
    {
      id: "calc",
      title: "Uma segunda pegadinha, no mesmo dia",
      blocks: [
        { kind: "p", text: "A digitação linha a linha usava uma animação por linha, com a duração calculada a partir da contagem de caracteres." },
        { kind: "code", lang: "css", code: ".type-line {\n  animation: type calc(var(--chars) * var(--type-step, 20ms)) steps(var(--chars), end) var(--delay, 0ms) both;\n}" },
        { kind: "p", text: "Uma linha de 10 caracteres tinha --type-step: 90ms definido inline no mesmo elemento, então esperei 0.9 s. A animation-duration calculada foi 0.2 s, que é 10 vezes o fallback de 20 ms. A custom property inline foi ignorada dentro daquele calc()." },
        { kind: "code", lang: "tsx", caption: "contorno", code: "<span\n  className=\"type-line\"\n  style={{ \"--chars\": text.length, animationDuration: `${text.length * 90}ms` }}\n>" },
        { kind: "p", text: "Definir animationDuration inline deu 0.9 s. Como antes, não sei a causa raiz. Minhas hipóteses são um problema de ordem entre a substituição de var() do shorthand e a propriedade inline, ou um valor com unidade chegando ao calc() como o fallback. Nenhuma foi verificada." },
      ],
    },
    {
      id: "lesson",
      title: "O que eu faria da próxima vez",
      blocks: [
        { kind: "list", items: [
          "Confiar no estilo calculado, não em getAnimations(). O primeiro disse que 148 glifos estavam ocultos; o segundo disse que estava tudo bem.",
          "Fazer do estado padrão o visível, e deixar a animação tirar coisas, não acrescentar.",
          "Evitar durações menores que um frame. A 60 Hz um frame tem cerca de 16.7 ms, então 1 ms pede um efeito que a página não consegue mostrar.",
          "Quando um valor é calculado a partir de uma custom property e sai como o fallback, definir o valor final inline e seguir em frente.",
        ] },
      ],
    },
  ],
};
