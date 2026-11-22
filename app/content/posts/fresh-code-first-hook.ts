import type { Post } from "./types";

const post: Post = {
  slug: "fresh-code-first-hook",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Fresh code first, once per session",
  summary: "A PreToolUse hook that pulls a clean default branch the first time a session touches a repository, and otherwise only fetches and tells the model what is behind.",
  tags: ["harness", "hooks", "git", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "The bug it prevents",
      blocks: [
        { kind: "p", text: "An agent reads code that is three commits behind its remote, plans a change against it and opens a pull request that conflicts or reverts something. Nobody did anything wrong. The checkout was just old." },
        { kind: "p", text: "Rule 12 of the harness says the first time a session touches a repository, it fetches and updates it before reading or changing code. Pull request #178 added that rule on 2026-11-20, together with the hook that applies it so nobody has to remember." },
      ],
    },
    {
      id: "flow",
      title: "What the hook decides",
      blocks: [
        { kind: "p", text: "`hooks/fresh-pull.py` runs before the file and shell tools. It finds the repository from the file being touched, or from the first `cd` of a shell command. It acts only for repositories of the organization, and only once per session and repository (a marker file in the cache directory, cleaned after seven days)." },
        { kind: "table", head: ["State of the checkout", "What the hook does"], rows: [
          ["Clean, on its default branch, with an upstream", "git pull --ff-only, silently"],
          ["Anything else, and it is behind", "git fetch, then one line of context for the model: how many commits behind, on which branch, whether there are local changes"],
          ["Anything else, and it is not behind", "Nothing"],
          ["Any error or timeout (8 seconds per git call)", "Silence; the tool call proceeds"],
        ] },
        { kind: "p", text: "It never stashes, resets, rebases or switches branch, and it never blocks a tool call. When it only fetched, the message tells the model to rebase or merge after the owner of the local work agrees." },
      ],
    },
    {
      id: "tradeoffs",
      title: "Trade-offs",
      blocks: [
        { kind: "p", text: "The hook costs a fetch on first touch, bounded by the timeout. In return the common case, a clean checkout of `main`, needs no thought. The uncommon case, a feature branch that is behind, becomes a sentence in the model's context instead of a surprise at merge time." },
        { kind: "p", text: "Two choices came from caution. First, it prefers saying nothing over guessing: a failed fetch is silent. Second, it does not try to be clever about dirty trees. Untracked files are ignored when deciding whether a tree is dirty, but tracked edits stop the pull." },
        { kind: "callout", tone: "note", text: "There is an off switch (FRESH_PULL=off) and a widening switch for repositories outside the organization (FRESH_PULL_ANY=1). I kept the default narrow on purpose: a hook that touches a repository it does not own is a different kind of risk." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "fresh-code-first-hook",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Código fresco primero, una vez por sesión",
  summary: "Un hook PreToolUse que hace pull de una rama por defecto limpia la primera vez que una sesión toca un repositorio y, en los demás casos, solo hace fetch y le dice al modelo qué va atrasado.",
  tags: ["harness", "hooks", "git", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "El bug que previene",
      blocks: [
        { kind: "p", text: "Un agente lee código que va tres commits por detrás de su remote, planifica un cambio sobre él y abre un pull request que entra en conflicto o revierte algo. Nadie hizo nada mal. El checkout simplemente estaba viejo." },
        { kind: "p", text: "La regla 12 del harness dice que la primera vez que una sesión toca un repositorio, hace fetch y lo actualiza antes de leer o cambiar código. El pull request #178 añadió esa regla el 2026-11-20, junto con el hook que la aplica para que nadie tenga que acordarse." },
      ],
    },
    {
      id: "flow",
      title: "Qué decide el hook",
      blocks: [
        { kind: "p", text: "`hooks/fresh-pull.py` se ejecuta antes de las herramientas de archivos y de shell. Encuentra el repositorio a partir del archivo que se toca, o del primer `cd` de un comando de shell. Actúa solo en repositorios de la organización, y solo una vez por sesión y repositorio (un archivo marcador en el directorio de caché, limpiado tras siete días)." },
        { kind: "table", head: ["Estado del checkout", "Qué hace el hook"], rows: [
          ["Limpio, en su rama por defecto, con upstream", "git pull --ff-only, en silencio"],
          ["Cualquier otro, y va atrasado", "git fetch, luego una línea de contexto para el modelo: cuántos commits atrasado, en qué rama, si hay cambios locales"],
          ["Cualquier otro, y no va atrasado", "Nada"],
          ["Cualquier error o timeout (8 segundos por llamada a git)", "Silencio; la llamada a la herramienta continúa"],
        ] },
        { kind: "p", text: "Nunca hace stash, reset, rebase ni cambia de rama, y nunca bloquea una llamada a una herramienta. Cuando solo hizo fetch, el mensaje le dice al modelo que haga rebase o merge después de que el dueño del trabajo local esté de acuerdo." },
      ],
    },
    {
      id: "tradeoffs",
      title: "Trade-offs",
      blocks: [
        { kind: "p", text: "El hook cuesta un fetch en el primer toque, acotado por el timeout. A cambio, el caso común, un checkout limpio de `main`, no requiere pensar. El caso poco común, una rama de feature atrasada, se convierte en una frase en el contexto del modelo en lugar de una sorpresa a la hora del merge." },
        { kind: "p", text: "Dos decisiones vinieron de la cautela. Primera, prefiere no decir nada antes que adivinar: un fetch fallido es silencioso. Segunda, no intenta ser listo con los árboles sucios. Los archivos sin seguimiento se ignoran al decidir si un árbol está sucio, pero las ediciones con seguimiento detienen el pull." },
        { kind: "callout", tone: "note", text: "Hay un interruptor de apagado (FRESH_PULL=off) y uno de ampliación para repositorios fuera de la organización (FRESH_PULL_ANY=1). Mantuve el valor por defecto estrecho a propósito: un hook que toca un repositorio que no le pertenece es otro tipo de riesgo." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "fresh-code-first-hook",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Código fresco primeiro, uma vez por sessão",
  summary: "Um hook PreToolUse que faz pull de uma branch padrão limpa na primeira vez que uma sessão toca um repositório e, nos demais casos, só faz fetch e avisa o modelo o que está atrasado.",
  tags: ["harness", "hooks", "git", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "O bug que ele previne",
      blocks: [
        { kind: "p", text: "Um agente lê código que está três commits atrás do remote, planeja uma mudança em cima dele e abre um pull request que conflita ou reverte algo. Ninguém fez nada errado. O checkout só estava velho." },
        { kind: "p", text: "A regra 12 do harness diz que, na primeira vez que uma sessão toca um repositório, ela faz fetch e o atualiza antes de ler ou mudar código. O pull request #178 adicionou essa regra em 2026-11-20, junto com o hook que a aplica para que ninguém precise lembrar." },
      ],
    },
    {
      id: "flow",
      title: "O que o hook decide",
      blocks: [
        { kind: "p", text: "`hooks/fresh-pull.py` roda antes das ferramentas de arquivo e de shell. Ele descobre o repositório pelo arquivo que está sendo tocado, ou pelo primeiro `cd` de um comando de shell. Age só em repositórios da organização, e só uma vez por sessão e repositório (um arquivo marcador no diretório de cache, limpo após sete dias)." },
        { kind: "table", head: ["Estado do checkout", "O que o hook faz"], rows: [
          ["Limpo, na branch padrão, com upstream", "git pull --ff-only, em silêncio"],
          ["Qualquer outro, e está atrasado", "git fetch, depois uma linha de contexto para o modelo: quantos commits atrás, em qual branch, se há mudanças locais"],
          ["Qualquer outro, e não está atrasado", "Nada"],
          ["Qualquer erro ou timeout (8 segundos por chamada de git)", "Silêncio; a chamada da ferramenta segue"],
        ] },
        { kind: "p", text: "Ele nunca faz stash, reset, rebase nem troca de branch, e nunca bloqueia uma chamada de ferramenta. Quando só fez fetch, a mensagem diz ao modelo para fazer rebase ou merge depois que o dono do trabalho local concordar." },
      ],
    },
    {
      id: "tradeoffs",
      title: "Trade-offs",
      blocks: [
        { kind: "p", text: "O hook custa um fetch no primeiro toque, limitado pelo timeout. Em troca, o caso comum, um checkout limpo de `main`, não exige pensar. O caso incomum, uma branch de feature atrasada, vira uma frase no contexto do modelo em vez de uma surpresa na hora do merge." },
        { kind: "p", text: "Duas escolhas vieram da cautela. Primeira, ele prefere não dizer nada a chutar: um fetch que falha é silencioso. Segunda, ele não tenta ser esperto com árvores sujas. Arquivos não rastreados são ignorados ao decidir se uma árvore está suja, mas edições rastreadas interrompem o pull." },
        { kind: "callout", tone: "note", text: "Há um interruptor de desligamento (FRESH_PULL=off) e um de ampliação para repositórios fora da organização (FRESH_PULL_ANY=1). Mantive o padrão estreito de propósito: um hook que toca um repositório que não é dele é outro tipo de risco." },
      ],
    },
  ],
};
