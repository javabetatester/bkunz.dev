import type { Post } from "./types";

const post: Post = {
  slug: "the-knowledge-gate-on-gh-pr-create",
  category: "discoveries",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "A gate the model passes by doing the work",
  summary: "A PreToolUse hook holds gh pr create until the session's knowledge checklist is recorded. The gate asks no person; it asks the model to finish the job it skipped.",
  tags: ["harness", "hooks", "pull-requests", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "idea",
      title: "The failure it targets",
      blocks: [
        { kind: "p", text: "Sessions run per repository. When a session ends a pull request in a project, what it learned usually stays in the pull request or in nowhere. The README may be updated; the record in the knowledge base, a rule that emerged, a note that the way of working changed, often are not." },
        { kind: "p", text: "The team's answer is a checklist with five lines: user-visible behaviour (README and docs), project records, rules and lints, the way of working, and a last one that asks whether anything from outside Versatile leaked into the docs. Each line ends with a pull request link, `in this PR`, or `n/a` with a reason. A checklist nobody is forced to read is decoration, so a hook enforces it." },
      ],
    },
    {
      id: "hook",
      title: "What the hook does",
      blocks: [
        { kind: "p", text: "`hooks/pr-gate.py` runs before every Bash call. It does nothing unless the command is a `gh pr create` that really runs as a command (it tokenises the shell line, follows `cd`, and reads `--repo` and `--head`). It then checks whether the repository belongs to the organization, and whether a marker exists for that branch." },
        { kind: "p", text: "No marker: the call is denied, with a reason that is a to-do list for the model. It names the checklist steps, the exact `bin/pr-ready` command to record them, and the doc section that explains it." },
        { kind: "code", lang: "bash", caption: "Recording the checklist, from the project checkout", code: "bin/pr-ready --readme \"in this PR\" --records <url> \\\n  --knowledge \"n/a: no rule or lint emerged\" \\\n  --way \"n/a: unchanged\" --versatile-only\n\nbin/pr-ready --nothing \"a typo fix; nothing was learned or decided\"" },
        { kind: "p", text: "The gate needs no approval from a person. The model satisfies it by doing the checklist. What the person gets is the last step: the hook's message also tells the model to say in the chat what was updated, with links, or why nothing was." },
      ],
    },
    {
      id: "design",
      title: "Design choices I would defend",
      blocks: [
        { kind: "list", items: [
          "It fails open. Any exception inside the hook lets the command through. A broken gate that blocks every pull request would get removed.",
          "It is a hold, not a lock. The record expires after a day, and an environment variable or a file in the config directory turns it off.",
          "It does not apply to the harness repositories themselves. Their pull requests are the knowledge update.",
          "The escape for a truly empty session exists (`--nothing`) but requires a reason string. Writing the reason is the friction.",
        ] },
        { kind: "callout", tone: "warn", text: "A symbolic gate can be satisfied symbolically. The model can write n/a on every line. What stops that is the final rule: the pilot must be told in the chat, so a lazy n/a is visible to a human." },
      ],
    },
    {
      id: "unknown",
      title: "What I have not measured",
      blocks: [
        { kind: "p", text: "I have no count of how often the gate held a pull request, or how many of the answers were n/a. The hook landed on 2026-11-20, and the doc's rule about the checklist was revised the same day (#166 made the gate cite the doc a personal skill of the same name would not carry). Until there is a log of holds, the claim that the gate improves records is a hypothesis. The first thing to look at is the ratio of n/a answers to links." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Una compuerta que el modelo pasa haciendo el trabajo",
  summary: "Un hook PreToolUse retiene gh pr create hasta que se registra el checklist de conocimiento de la sesión. La compuerta no le pregunta a ninguna persona; le pide al modelo que termine el trabajo que se saltó.",
  sections: [
    {
      id: "idea",
      title: "La falla que ataca",
      blocks: [
        { kind: "p", text: "Las sesiones corren por repositorio. Cuando una sesión cierra un pull request en un proyecto, lo que aprendió suele quedarse en el pull request o en ninguna parte. Puede que el README se actualice; el registro en la base de conocimiento, una regla que surgió, una nota de que cambió la forma de trabajar, a menudo no." },
        { kind: "p", text: "La respuesta del equipo es un checklist de cinco líneas: comportamiento visible al usuario (README y docs), registros del proyecto, reglas y lints, la forma de trabajar, y una última que pregunta si algo ajeno a Versatile se filtró en los docs. Cada línea termina con un enlace a un pull request, `in this PR` o `n/a` con una razón. Un checklist que nadie está obligado a leer es decoración, así que lo hace cumplir un hook." },
      ],
    },
    {
      id: "hook",
      title: "Qué hace el hook",
      blocks: [
        { kind: "p", text: "`hooks/pr-gate.py` corre antes de cada llamada a Bash. No hace nada salvo que el comando sea un `gh pr create` que realmente se ejecuta como comando (tokeniza la línea de shell, sigue `cd` y lee `--repo` y `--head`). Luego verifica si el repositorio pertenece a la organización y si existe un marcador para esa rama." },
        { kind: "p", text: "Sin marcador: la llamada se deniega, con una razón que es una lista de tareas para el modelo. Nombra los pasos del checklist, el comando exacto de `bin/pr-ready` para registrarlos y la sección del doc que lo explica." },
        { kind: "code", lang: "bash", caption: "Registrar el checklist, desde el checkout del proyecto", code: "bin/pr-ready --readme \"in this PR\" --records <url> \\\n  --knowledge \"n/a: no rule or lint emerged\" \\\n  --way \"n/a: unchanged\" --versatile-only\n\nbin/pr-ready --nothing \"a typo fix; nothing was learned or decided\"" },
        { kind: "p", text: "La compuerta no necesita la aprobación de una persona. El modelo la satisface haciendo el checklist. Lo que la persona recibe es el último paso: el mensaje del hook también le dice al modelo que diga en el chat qué se actualizó, con enlaces, o por qué no se actualizó nada." },
      ],
    },
    {
      id: "design",
      title: "Decisiones de diseño que defendería",
      blocks: [
        { kind: "list", items: [
          "Falla abierta. Cualquier excepción dentro del hook deja pasar el comando. Una compuerta rota que bloquea todos los pull requests acabaría eliminada.",
          "Es una retención, no un candado. El registro expira después de un día, y una variable de entorno o un archivo en el directorio de configuración la apaga.",
          "No se aplica a los propios repositorios del harness. Sus pull requests son la actualización de conocimiento.",
          "La salida para una sesión realmente vacía existe (`--nothing`) pero exige una cadena con la razón. Escribir la razón es la fricción.",
        ] },
        { kind: "callout", tone: "warn", text: "Una compuerta simbólica puede satisfacerse simbólicamente. El modelo puede escribir n/a en cada línea. Lo que lo frena es la regla final: hay que avisarle al piloto en el chat, así que un n/a perezoso es visible para un humano." },
      ],
    },
    {
      id: "unknown",
      title: "Lo que no medí",
      blocks: [
        { kind: "p", text: "No tengo un conteo de cuántas veces la compuerta retuvo un pull request ni de cuántas respuestas fueron n/a. El hook aterrizó el 2026-11-20, y la regla del doc sobre el checklist se revisó el mismo día (#166 hizo que la compuerta citara el doc que una skill personal del mismo nombre no traería). Mientras no haya un log de retenciones, la afirmación de que la compuerta mejora los registros es una hipótesis. Lo primero que miraría es la proporción de respuestas n/a frente a enlaces." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Um portão que o modelo passa fazendo o trabalho",
  summary: "Um hook PreToolUse segura o gh pr create até o checklist de conhecimento da sessão ser registrado. O portão não pergunta a nenhuma pessoa; ele pede ao modelo que termine o trabalho que pulou.",
  sections: [
    {
      id: "idea",
      title: "A falha que ele ataca",
      blocks: [
        { kind: "p", text: "As sessões rodam por repositório. Quando uma sessão encerra um pull request em um projeto, o que ela aprendeu normalmente fica no pull request ou em lugar nenhum. O README pode ser atualizado; o registro na base de conhecimento, uma regra que surgiu, uma nota de que o jeito de trabalhar mudou, muitas vezes não." },
        { kind: "p", text: "A resposta do time é um checklist de cinco linhas: comportamento visível ao usuário (README e docs), registros do projeto, regras e lints, o jeito de trabalhar, e uma última que pergunta se algo de fora da Versatile vazou para os docs. Cada linha termina com um link de pull request, `in this PR` ou `n/a` com um motivo. Um checklist que ninguém é obrigado a ler é decoração, então um hook o impõe." },
      ],
    },
    {
      id: "hook",
      title: "O que o hook faz",
      blocks: [
        { kind: "p", text: "`hooks/pr-gate.py` roda antes de cada chamada de Bash. Não faz nada a menos que o comando seja um `gh pr create` que de fato roda como comando (ele tokeniza a linha de shell, segue `cd` e lê `--repo` e `--head`). Depois verifica se o repositório pertence à organização e se existe um marcador para aquela branch." },
        { kind: "p", text: "Sem marcador: a chamada é negada, com um motivo que é uma lista de tarefas para o modelo. Ele nomeia os passos do checklist, o comando exato de `bin/pr-ready` para registrá-los e a seção do doc que o explica." },
        { kind: "code", lang: "bash", caption: "Registrar o checklist, a partir do checkout do projeto", code: "bin/pr-ready --readme \"in this PR\" --records <url> \\\n  --knowledge \"n/a: no rule or lint emerged\" \\\n  --way \"n/a: unchanged\" --versatile-only\n\nbin/pr-ready --nothing \"a typo fix; nothing was learned or decided\"" },
        { kind: "p", text: "O portão não precisa da aprovação de uma pessoa. O modelo o satisfaz fazendo o checklist. O que a pessoa recebe é o último passo: a mensagem do hook também manda o modelo dizer no chat o que foi atualizado, com links, ou por que nada foi." },
      ],
    },
    {
      id: "design",
      title: "Escolhas de design que eu defenderia",
      blocks: [
        { kind: "list", items: [
          "Ele falha aberto. Qualquer exceção dentro do hook deixa o comando passar. Um portão quebrado que bloqueia todo pull request acabaria removido.",
          "É uma retenção, não um cadeado. O registro expira depois de um dia, e uma variável de ambiente ou um arquivo no diretório de configuração o desliga.",
          "Não vale para os próprios repositórios do harness. Os pull requests deles são a atualização de conhecimento.",
          "A saída para uma sessão realmente vazia existe (`--nothing`), mas exige uma string com o motivo. Escrever o motivo é o atrito.",
        ] },
        { kind: "callout", tone: "warn", text: "Um portão simbólico pode ser satisfeito simbolicamente. O modelo pode escrever n/a em todas as linhas. O que impede isso é a regra final: o piloto precisa ser avisado no chat, então um n/a preguiçoso fica visível para um humano." },
      ],
    },
    {
      id: "unknown",
      title: "O que não medi",
      blocks: [
        { kind: "p", text: "Não tenho a contagem de quantas vezes o portão segurou um pull request nem de quantas respostas foram n/a. O hook entrou em 2026-11-20, e a regra do doc sobre o checklist foi revisada no mesmo dia (o #166 fez o portão citar o doc que uma skill pessoal de mesmo nome não carregaria). Até existir um log de retenções, a afirmação de que o portão melhora os registros é uma hipótese. A primeira coisa a olhar é a proporção de respostas n/a para links." },
      ],
    },
  ],
};
