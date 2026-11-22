import type { Post } from "./types";

const post: Post = {
  slug: "from-a-repeated-problem-to-a-lint",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "From a repeated problem to a catalogued lint",
  summary: "The protocol that turns a recurring mistake or a repeated request into a certified fix, a guard and a shared lint, and why it waits for one explicit yes.",
  tags: ["harness", "learning-loop", "lints", "process"],
  project: "versatile-sh",
  sections: [
    {
      id: "principle",
      title: "The team learns once",
      blocks: [
        { kind: "p", text: "The principle in the harness is one line: whatever one person teaches the AI must reach the other three without anyone repeating it, and a fixed mistake must become impossible, not remembered. Memory on one machine is not learning. A rule only in prose will be broken again." },
        { kind: "p", text: "The protocol has seven steps: recognise, fix the root cause, certify with evidence, ask the user to confirm, codify as a guard, record in the shared home, share. This post is about the three that surprised me when I read the docs." },
      ],
    },
    {
      id: "class",
      title: "Name the class, not the instance",
      blocks: [
        { kind: "p", text: "Step 1 says to state the problem as a class. The example in the doc is raw colour values in components, not the header is blue. That sounds like style advice, but it decides whether the guard can exist. A guard needs a shape to match." },
        { kind: "p", text: "It also forces a search. The catalog of lints is checked first, because the class may already have one to enable. A lint written twice is two lints that will disagree." },
      ],
    },
    {
      id: "yes",
      title: "Only an explicit yes unlocks the guard",
      blocks: [
        { kind: "p", text: "After the fix and its evidence, the agent asks one question. The certification is the agent's. The confirmation is the person's. Then three outcomes:" },
        { kind: "table", head: ["The user", "Then"], rows: [
          ["Says yes", "The guard is written and registered; the issue is marked fixed and confirmed, with the guard's command"],
          ["Does not answer", "Work continues. The fix and its regression test stay; the issue says fixed, not confirmed; no class-wide guard yet"],
          ["Says no", "The issue reopens with what was observed, and the diagnosis is redone"],
        ] },
        { kind: "p", text: "The reason is in the doc: a guard built on an unconfirmed diagnosis hard-codes a guess. I find that more convincing than the usual argument for asking, which is politeness." },
      ],
    },
    {
      id: "catalog",
      title: "The guard must bite, and have one home",
      blocks: [
        { kind: "list", items: [
          "Prove it bites. Reintroduce the mistake and watch the guard fail. A guard that has never failed proves nothing.",
          "Wire it into the project's one check command.",
          "Write the failure message as an instruction: what is wrong, where, what to do instead.",
          "Register it in the lint catalog in the same unit of work, as one shared implementation. A project enables a lint by referencing it, never by copying it.",
        ] },
        { kind: "p", text: "The catalog itself shows the cost of skipping the last point. Several older entries are marked per-repository copies or implementation not verified, and the doc calls that debt the rule exists to stop." },
      ],
    },
    {
      id: "triggers",
      title: "Nobody has to remember to start it",
      blocks: [
        { kind: "p", text: "A UserPromptSubmit hook looks for repetition markers in the user's prompt, such as already told you, again, or always, in Portuguese and English. It adds one line of context pointing at step 1. It never blocks. It also ignores automatic notifications, a fix that landed on 2026-11-21 (#196). The knowledge checklist on every pull request asks the same question from the other side." },
        { kind: "callout", tone: "note", text: "A concrete case of the whole loop, the view transition lint, is in its own post. I have no count of how many lints the loop has produced; the catalog has 19 entries, but several predate the protocol." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "from-a-repeated-problem-to-a-lint",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "De un problema repetido a un lint catalogado",
  summary: "El protocolo que convierte un error recurrente o una petición repetida en una corrección certificada, una guarda y un lint compartido, y por qué espera un sí explícito.",
  tags: ["harness", "learning-loop", "lints", "process"],
  project: "versatile-sh",
  sections: [
    {
      id: "principle",
      title: "El equipo aprende una vez",
      blocks: [
        { kind: "p", text: "El principio del harness es una línea: todo lo que una persona le enseña a la IA debe llegar a las otras tres sin que nadie lo repita, y un error corregido debe volverse imposible, no recordado. La memoria de una máquina no es aprendizaje. Una regla solo en prosa se volverá a romper." },
        { kind: "p", text: "El protocolo tiene siete pasos: reconocer, corregir la causa raíz, certificar con evidencia, pedirle al usuario que confirme, codificar como guarda, registrar en el hogar compartido, compartir. Este post trata de los tres que me sorprendieron al leer los docs." },
      ],
    },
    {
      id: "class",
      title: "Nombra la clase, no la instancia",
      blocks: [
        { kind: "p", text: "El paso 1 dice que se enuncie el problema como una clase. El ejemplo del doc es valores de color crudos en componentes, no el header es azul. Suena a consejo de estilo, pero decide si la guarda puede existir. Una guarda necesita una forma que detectar." },
        { kind: "p", text: "También obliga a buscar. Primero se revisa el catálogo de lints, porque la clase puede tener ya uno para activar. Un lint escrito dos veces son dos lints que no se pondrán de acuerdo." },
      ],
    },
    {
      id: "yes",
      title: "Solo un sí explícito desbloquea la guarda",
      blocks: [
        { kind: "p", text: "Tras la corrección y su evidencia, el agente hace una pregunta. La certificación es del agente. La confirmación es de la persona. Luego tres desenlaces:" },
        { kind: "table", head: ["El usuario", "Entonces"], rows: [
          ["Dice que sí", "La guarda se escribe y se registra; el issue se marca como corregido y confirmado, con el comando de la guarda"],
          ["No responde", "El trabajo continúa. La corrección y su test de regresión se quedan; el issue dice corregido, no confirmado; todavía no hay guarda para toda la clase"],
          ["Dice que no", "El issue se reabre con lo observado, y el diagnóstico se rehace"],
        ] },
        { kind: "p", text: "La razón está en el doc: una guarda construida sobre un diagnóstico sin confirmar cablea una suposición. Me parece más convincente que el argumento habitual para preguntar, que es la cortesía." },
      ],
    },
    {
      id: "catalog",
      title: "La guarda debe morder, y tener un solo hogar",
      blocks: [
        { kind: "list", items: [
          "Probar que muerde. Reintroducir el error y ver cómo falla la guarda. Una guarda que nunca ha fallado no prueba nada.",
          "Conectarla al único comando de check del proyecto.",
          "Escribir el mensaje de fallo como una instrucción: qué está mal, dónde, qué hacer en su lugar.",
          "Registrarla en el catálogo de lints en la misma unidad de trabajo, como una única implementación compartida. Un proyecto activa un lint referenciándolo, nunca copiándolo.",
        ] },
        { kind: "p", text: "El propio catálogo muestra el costo de omitir el último punto. Varias entradas antiguas están marcadas como copias por repositorio o implementación no verificada, y el doc llama a eso deuda que la regla existe para detener." },
      ],
    },
    {
      id: "triggers",
      title: "Nadie tiene que acordarse de iniciarlo",
      blocks: [
        { kind: "p", text: "Un hook UserPromptSubmit busca marcadores de repetición en el prompt del usuario, como ya te dije, otra vez o siempre, en portugués e inglés. Añade una línea de contexto que apunta al paso 1. Nunca bloquea. También ignora las notificaciones automáticas, una corrección que llegó el 2026-11-21 (#196). La lista de verificación de conocimiento de cada pull request hace la misma pregunta desde el otro lado." },
        { kind: "callout", tone: "note", text: "Un caso concreto de todo el loop, el lint de view transition, está en su propio post. No tengo un conteo de cuántos lints ha producido el loop; el catálogo tiene 19 entradas, pero varias son anteriores al protocolo." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "from-a-repeated-problem-to-a-lint",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "De um problema repetido a um lint catalogado",
  summary: "O protocolo que transforma um erro recorrente ou um pedido repetido em uma correção certificada, uma guarda e um lint compartilhado, e por que ele espera um sim explícito.",
  tags: ["harness", "learning-loop", "lints", "process"],
  project: "versatile-sh",
  sections: [
    {
      id: "principle",
      title: "A equipe aprende uma vez",
      blocks: [
        { kind: "p", text: "O princípio do harness é uma linha: tudo que uma pessoa ensina à IA deve chegar às outras três sem que ninguém repita, e um erro corrigido deve se tornar impossível, não lembrado. Memória em uma máquina não é aprendizado. Uma regra só em prosa será quebrada de novo." },
        { kind: "p", text: "O protocolo tem sete passos: reconhecer, corrigir a causa raiz, certificar com evidência, pedir ao usuário que confirme, codificar como guarda, registrar no lar compartilhado, compartilhar. Este post é sobre os três que me surpreenderam quando li os docs." },
      ],
    },
    {
      id: "class",
      title: "Nomeie a classe, não a instância",
      blocks: [
        { kind: "p", text: "O passo 1 diz para enunciar o problema como uma classe. O exemplo do doc é valores de cor crus em componentes, não o header é azul. Parece conselho de estilo, mas decide se a guarda pode existir. Uma guarda precisa de um formato para casar." },
        { kind: "p", text: "Isso também força uma busca. O catálogo de lints é verificado primeiro, porque a classe pode já ter um para ativar. Um lint escrito duas vezes são dois lints que vão discordar." },
      ],
    },
    {
      id: "yes",
      title: "Só um sim explícito destrava a guarda",
      blocks: [
        { kind: "p", text: "Depois da correção e da evidência, o agente faz uma pergunta. A certificação é do agente. A confirmação é da pessoa. Então três desfechos:" },
        { kind: "table", head: ["O usuário", "Então"], rows: [
          ["Diz sim", "A guarda é escrita e registrada; o issue é marcado como corrigido e confirmado, com o comando da guarda"],
          ["Não responde", "O trabalho continua. A correção e o teste de regressão ficam; o issue diz corrigido, não confirmado; ainda sem guarda para a classe inteira"],
          ["Diz não", "O issue reabre com o que foi observado, e o diagnóstico é refeito"],
        ] },
        { kind: "p", text: "O motivo está no doc: uma guarda construída sobre um diagnóstico não confirmado crava um palpite no código. Acho isso mais convincente que o argumento usual para perguntar, que é educação." },
      ],
    },
    {
      id: "catalog",
      title: "A guarda precisa morder, e ter um só lar",
      blocks: [
        { kind: "list", items: [
          "Provar que morde. Reintroduzir o erro e ver a guarda falhar. Uma guarda que nunca falhou não prova nada.",
          "Ligá-la ao único comando de check do projeto.",
          "Escrever a mensagem de falha como uma instrução: o que está errado, onde, o que fazer em vez disso.",
          "Registrá-la no catálogo de lints na mesma unidade de trabalho, como uma única implementação compartilhada. Um projeto ativa um lint referenciando-o, nunca copiando.",
        ] },
        { kind: "p", text: "O próprio catálogo mostra o custo de pular o último ponto. Várias entradas antigas estão marcadas como cópias por repositório ou implementação não verificada, e o doc chama isso de dívida que a regra existe para impedir." },
      ],
    },
    {
      id: "triggers",
      title: "Ninguém precisa lembrar de iniciar",
      blocks: [
        { kind: "p", text: "Um hook UserPromptSubmit procura marcadores de repetição no prompt do usuário, como já te falei, de novo ou sempre, em português e inglês. Ele adiciona uma linha de contexto apontando para o passo 1. Nunca bloqueia. Também ignora notificações automáticas, uma correção que entrou em 2026-11-21 (#196). A checklist de conhecimento de todo pull request faz a mesma pergunta pelo outro lado." },
        { kind: "callout", tone: "note", text: "Um caso concreto do loop inteiro, o lint de view transition, está em seu próprio post. Não tenho uma contagem de quantos lints o loop produziu; o catálogo tem 19 entradas, mas várias são anteriores ao protocolo." },
      ],
    },
  ],
};
