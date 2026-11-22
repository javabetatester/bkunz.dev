import type { Post } from "./types";

const post: Post = {
  slug: "view-transition-without-flushsync",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "The theme reveal that jumped at its end",
  summary: "A circular theme reveal finished, then the page popped to its final look. The cause was React state changing inside startViewTransition without flushSync, and it became a lint.",
  tags: ["react", "view-transitions", "semgrep", "learning-loop"],
  project: "versatile-sh",
  sections: [
    {
      id: "symptom",
      title: "The symptom",
      blocks: [
        { kind: "p", text: "A web console had a light theme and a swap drawn as an iris: a circle opening from the click. The reveal ran, ended, and the page changed once more. The owner described it as a hiccup and said it happens often. It was recorded as an issue in the project's records on 2026-11-21." },
      ],
    },
    {
      id: "cause",
      title: "The cause",
      blocks: [
        { kind: "p", text: "`document.startViewTransition(callback)` takes a snapshot of the old page, runs the callback, then takes a snapshot of the new page and animates between them. The browser assumes the DOM is final when the callback returns." },
        { kind: "p", text: "In React, a state update inside that callback is not committed when the callback returns. It is scheduled. The browser snapshots a page that has not changed yet, plays the animation to it, and React then commits the real change afterwards. The user sees the transition finish and then the page move." },
        { kind: "code", lang: "ts", caption: "Before and after, as recorded in the lint's catalog entry", code: "// before: the new snapshot is taken before React commits\ndocument.startViewTransition(() => draw(next));\n\n// after\ndocument.startViewTransition(() => flushSync(() => draw(next)));" },
        { kind: "p", text: "`flushSync` forces the commit inside the callback, so the snapshot is of the finished page. The fix is one wrapper. The code looks correct, which is why the class is easy to write again." },
      ],
    },
    {
      id: "lint",
      title: "From fix to lint",
      blocks: [
        { kind: "p", text: "The team's learning loop says a recurring class of mistake becomes a guard, after the owner confirms. This was a named class: React state changed inside a view transition callback with no flushSync. The cheapest guard that fits is a Semgrep rule in the shared rules repository, which every project already runs." },
        { kind: "list", items: [
          "It reports `startViewTransition` on any receiver, and the `{ update }` form, in a module that imports React.",
          "Only when the callback is an inline function with no `flushSync(`, no `new Promise` and no `await`.",
          "A callback passed by name is not reported, because a pattern cannot see inside it.",
          "A module without React is not reported. A CSS-only swap is the preferred shape, and the message says so.",
        ] },
        { kind: "p", text: "The rule's tests hold five must-report cases and nine must-not-report ones, two of them in a module without React. Without the React scope, those two are reported, which is how I know the scope matters. Run over the organization's local checkouts, the only other inline callbacks were two page-transition helpers that return a promise resolved after the route renders; the Promise and await exemption exists for them." },
      ],
    },
    {
      id: "status",
      title: "Where it stands",
      blocks: [
        { kind: "p", text: "The catalog entry says the rule is in review in the shared rules repository, to be released as tag `v0.2.0`, and that no project pins it yet. A project enables it by moving one pin in its check command." },
        { kind: "callout", tone: "warn", text: "One honest wrinkle. The entry says the owner asked for the lint the same day, while the fix itself was not yet confirmed. The learning loop wants a confirmation before a guard. Here the lint was asked for explicitly, so I read it as that yes, but the record keeps the distinction." },
        { kind: "p", text: "A second rule of the same standard, that the reveal must end past the screen with an in-out curve, has no lint. It is a unit test on the project's radius function, because a pattern could not follow the helper without noise. Choosing which guard fits is part of the job: a rule that is too noisy gets turned off." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "La revelación de tema que saltaba al final",
  summary: "Una revelación circular de tema terminaba y luego la página saltaba a su aspecto final. La causa era un estado de React que cambiaba dentro de startViewTransition sin flushSync, y se convirtió en un lint.",
  sections: [
    {
      id: "symptom",
      title: "El síntoma",
      blocks: [
        { kind: "p", text: "Una consola web tenía un tema claro y un cambio dibujado como un iris: un círculo que se abre desde el clic. La revelación corría, terminaba y la página cambiaba una vez más. El dueño lo describió como un tropiezo y dijo que ocurre a menudo. Se registró como un issue en los registros del proyecto el 2026-11-21." },
      ],
    },
    {
      id: "cause",
      title: "La causa",
      blocks: [
        { kind: "p", text: "`document.startViewTransition(callback)` toma un snapshot de la página vieja, ejecuta el callback, luego toma un snapshot de la página nueva y anima entre ambos. El navegador asume que el DOM es final cuando el callback retorna." },
        { kind: "p", text: "En React, una actualización de estado dentro de ese callback no está confirmada cuando el callback retorna. Está programada. El navegador toma un snapshot de una página que todavía no cambió, reproduce la animación hacia ella y React confirma después el cambio real. El usuario ve terminar la transición y luego moverse la página." },
        { kind: "code", lang: "ts", caption: "Antes y después, como se registra en la entrada del catálogo del lint", code: "// before: the new snapshot is taken before React commits\ndocument.startViewTransition(() => draw(next));\n\n// after\ndocument.startViewTransition(() => flushSync(() => draw(next)));" },
        { kind: "p", text: "`flushSync` fuerza el commit dentro del callback, de modo que el snapshot es de la página terminada. El arreglo es un wrapper. El código parece correcto, por eso esta clase es fácil de escribir otra vez." },
      ],
    },
    {
      id: "lint",
      title: "Del arreglo al lint",
      blocks: [
        { kind: "p", text: "El learning loop del equipo dice que una clase recurrente de error se convierte en un guard, después de que el dueño lo confirme. Esta era una clase con nombre: estado de React cambiado dentro de un callback de view transition sin flushSync. El guard más barato que encaja es una regla de Semgrep en el repositorio de reglas compartidas, que todos los proyectos ya ejecutan." },
        { kind: "list", items: [
          "Reporta `startViewTransition` sobre cualquier receptor, y la forma `{ update }`, en un módulo que importa React.",
          "Solo cuando el callback es una función inline sin `flushSync(`, sin `new Promise` y sin `await`.",
          "Un callback pasado por nombre no se reporta, porque un patrón no puede ver dentro de él.",
          "Un módulo sin React no se reporta. La forma preferida es un cambio solo con CSS, y el mensaje lo dice.",
        ] },
        { kind: "p", text: "Los tests de la regla tienen cinco casos que deben reportarse y nueve que no, dos de ellos en un módulo sin React. Sin el alcance de React, esos dos se reportan, y así sé que el alcance importa. Ejecutada sobre los checkouts locales de la organización, los únicos otros callbacks inline eran dos helpers de transición de página que devuelven una promesa resuelta después de que la ruta se renderiza; la excepción de Promise y await existe por ellos." },
      ],
    },
    {
      id: "status",
      title: "En qué punto está",
      blocks: [
        { kind: "p", text: "La entrada del catálogo dice que la regla está en revisión en el repositorio de reglas compartidas, para publicarse como el tag `v0.2.0`, y que ningún proyecto la fija todavía. Un proyecto la activa moviendo un pin en su comando de check." },
        { kind: "callout", tone: "warn", text: "Un detalle honesto. La entrada dice que el dueño pidió el lint el mismo día, cuando el arreglo en sí todavía no estaba confirmado. El learning loop quiere una confirmación antes de un guard. Aquí el lint se pidió explícitamente, así que lo leo como ese sí, pero el registro conserva la distinción." },
        { kind: "p", text: "Una segunda regla del mismo estándar, que la revelación debe terminar más allá de la pantalla con una curva in-out, no tiene lint. Es un test unitario sobre la función de radio del proyecto, porque un patrón no podría seguir el helper sin ruido. Elegir qué guard encaja es parte del trabajo: una regla demasiado ruidosa se apaga." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "A revelação de tema que pulava no final",
  summary: "Uma revelação circular de tema terminava e a página então pulava para o visual final. A causa era estado do React mudando dentro de startViewTransition sem flushSync, e virou um lint.",
  sections: [
    {
      id: "symptom",
      title: "O sintoma",
      blocks: [
        { kind: "p", text: "Um console web tinha um tema claro e uma troca desenhada como uma íris: um círculo se abrindo a partir do clique. A revelação rodava, terminava e a página mudava mais uma vez. O dono descreveu como um soluço e disse que acontece com frequência. Foi registrado como uma issue nos registros do projeto em 2026-11-21." },
      ],
    },
    {
      id: "cause",
      title: "A causa",
      blocks: [
        { kind: "p", text: "`document.startViewTransition(callback)` tira um snapshot da página antiga, executa o callback, tira um snapshot da página nova e anima entre os dois. O navegador assume que o DOM é final quando o callback retorna." },
        { kind: "p", text: "No React, uma atualização de estado dentro desse callback não está commitada quando o callback retorna. Ela está agendada. O navegador tira snapshot de uma página que ainda não mudou, toca a animação até ela e o React então commita a mudança real depois. O usuário vê a transição terminar e depois a página se mover." },
        { kind: "code", lang: "ts", caption: "Antes e depois, como registrado na entrada do catálogo do lint", code: "// before: the new snapshot is taken before React commits\ndocument.startViewTransition(() => draw(next));\n\n// after\ndocument.startViewTransition(() => flushSync(() => draw(next)));" },
        { kind: "p", text: "`flushSync` força o commit dentro do callback, de modo que o snapshot é da página finalizada. A correção é um wrapper. O código parece correto, e por isso essa classe é fácil de escrever de novo." },
      ],
    },
    {
      id: "lint",
      title: "Da correção ao lint",
      blocks: [
        { kind: "p", text: "O learning loop do time diz que uma classe recorrente de erro vira um guard, depois que o dono confirma. Esta era uma classe com nome: estado do React alterado dentro de um callback de view transition sem flushSync. O guard mais barato que serve é uma regra do Semgrep no repositório de regras compartilhadas, que todo projeto já executa." },
        { kind: "list", items: [
          "Ele reporta `startViewTransition` em qualquer receptor, e a forma `{ update }`, em um módulo que importa React.",
          "Só quando o callback é uma função inline sem `flushSync(`, sem `new Promise` e sem `await`.",
          "Um callback passado por nome não é reportado, porque um padrão não enxerga dentro dele.",
          "Um módulo sem React não é reportado. A forma preferida é uma troca só com CSS, e a mensagem diz isso.",
        ] },
        { kind: "p", text: "Os testes da regra têm cinco casos que devem ser reportados e nove que não, dois deles em um módulo sem React. Sem o escopo de React, esses dois são reportados, e é assim que sei que o escopo importa. Rodada sobre os checkouts locais da organização, os únicos outros callbacks inline eram dois helpers de transição de página que devolvem uma promise resolvida depois que a rota renderiza; a exceção de Promise e await existe por causa deles." },
      ],
    },
    {
      id: "status",
      title: "Em que pé está",
      blocks: [
        { kind: "p", text: "A entrada do catálogo diz que a regra está em revisão no repositório de regras compartilhadas, para ser lançada como a tag `v0.2.0`, e que nenhum projeto a fixa ainda. Um projeto a ativa movendo um pin no seu comando de check." },
        { kind: "callout", tone: "warn", text: "Uma ressalva honesta. A entrada diz que o dono pediu o lint no mesmo dia, quando a correção em si ainda não tinha sido confirmada. O learning loop quer uma confirmação antes de um guard. Aqui o lint foi pedido explicitamente, então leio isso como aquele sim, mas o registro mantém a distinção." },
        { kind: "p", text: "Uma segunda regra do mesmo padrão, a de que a revelação deve terminar além da tela com uma curva in-out, não tem lint. É um teste unitário na função de raio do projeto, porque um padrão não conseguiria seguir o helper sem ruído. Escolher qual guard serve faz parte do trabalho: uma regra barulhenta demais é desligada." },
      ],
    },
  ],
};
