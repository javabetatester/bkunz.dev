import type { Post } from "./types";

const post: Post = {
  slug: "sync-pins-the-read-copies",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "bin/sync and the pointer pull request",
  summary: "How one script fast-forwards every shared checkout, reports a submodule pointer that fell behind, and opens the pull request that moves it.",
  tags: ["harness", "git", "submodules", "bash"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "Two kinds of stale",
      blocks: [
        { kind: "p", text: "With submodules there are two ways to read old knowledge. The sibling working copy of a satellite can be behind its remote. And the read copy under `harness/` can be at a commit older than the satellite's `main`, because the center records a pointer and nobody moved it." },
        { kind: "p", text: "`bin/sync` handles both. I read through the script today; this is what it does, in order." },
      ],
    },
    {
      id: "pull",
      title: "Step 1: fast-forward, never force",
      blocks: [
        { kind: "p", text: "It finds the shared checkouts by their `versatile-sh` remote, whatever the folder is called. For each one it fast-forwards only when two conditions hold: the checkout is on its default branch and the working tree is clean. Otherwise it prints one line and moves on:" },
        { kind: "code", lang: "text", caption: "The three refusals, from the script's own messages", code: "<name>: on branch '<branch>', not pulled\n<name>: uncommitted changes, not pulled (bin/harvest collects them)\n<name>: local commits diverge from origin/<default>, not pulled" },
        { kind: "p", text: "It merges with `--ff-only`. It never stashes, resets or switches branch. A person's half-finished work is never touched. After a pull that moved a harness repository, it runs the forbidden-content check on the new commits and says so if it fails." },
      ],
    },
    {
      id: "pointers",
      title: "Step 2: move the read copies, report the gap",
      blocks: [
        { kind: "p", text: "Then `git submodule update --init --remote --merge` moves each read copy under `harness/` to the tip of that satellite's `main`. For every submodule it compares the pointer recorded in the center with what is checked out, and prints how many commits the read copy is ahead:" },
        { kind: "code", lang: "text", code: "harness/<name>: reading <sha>, its main (<n> commit(s) after the recorded pointer; <pull request or hint>)" },
        { kind: "p", text: "The hint is either the open pull request that would move it, found by branch name, or `no pull request moves it yet: bin/sync --bump opens it`." },
      ],
    },
    {
      id: "bump",
      title: "Step 3: --bump opens the pull request",
      blocks: [
        { kind: "p", text: "The pointer change is a pull request like any other, because the center's `main` is never pushed to directly. `--bump` does all of it:" },
        { kind: "steps", items: [
          { title: "Temporary worktree", text: "Creates a worktree from `origin/main` on a timestamped `chore/harness-pointers-` branch, so the person's checkout is untouched." },
          { title: "Safety check", text: "For each satellite, refuses to move a pointer if the satellite's main does not contain the recorded one." },
          { title: "Write the pointer", text: "Updates the index entry directly with `update-index --cacheinfo`, no checkout of the submodule needed." },
          { title: "Run the check", text: "Runs the center's `bin/check` with the new pointers. If it fails (often a doc that links to a path a satellite no longer has), nothing is pushed and the script says so." },
          { title: "Open and merge", text: "Commits, pushes, opens the pull request with the old and new short hashes in the body, and merges it with a merge commit, deleting the branch." },
        ] },
        { kind: "p", text: "Running `bin/sync` twice changes nothing the second time. The header says so, and it is the property I rely on when a timer runs it." },
      ],
    },
    {
      id: "notes",
      title: "What the history shows",
      blocks: [
        { kind: "p", text: "The center's log has pointer-move pull requests on both days of this series: `chore: move the harness pointers` as #167, #170 and others on 2026-11-20, and #193 and #199 on 2026-11-21. I did not count how many a week they will be. If it is high, the pointer move is a candidate for the daily timer instead of a manual `--bump`." },
        { kind: "callout", tone: "note", text: "The script also prints one line from `bin/conformance` (cached for 12 hours) and any notes `bin/harvest` left behind. Sync is the one command that tells you whether the shared state is healthy." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "bin/sync y el pull request de punteros",
  summary: "Cómo un script avanza (fast-forward) todos los checkouts compartidos, avisa cuando el puntero de un submódulo quedó atrás y abre el pull request que lo mueve.",
  sections: [
    {
      id: "why",
      title: "Dos clases de desactualizado",
      blocks: [
        { kind: "p", text: "Con submódulos hay dos maneras de leer conocimiento viejo. La copia de trabajo hermana de un satélite puede estar detrás de su remoto. Y la copia de lectura bajo `harness/` puede estar en un commit anterior al `main` del satélite, porque el centro registra un puntero y nadie lo movió." },
        { kind: "p", text: "`bin/sync` maneja las dos. Hoy leí el script; esto es lo que hace, en orden." },
      ],
    },
    {
      id: "pull",
      title: "Paso 1: fast-forward, nunca force",
      blocks: [
        { kind: "p", text: "Encuentra los checkouts compartidos por su remoto `versatile-sh`, sin importar cómo se llame la carpeta. En cada uno hace fast-forward solo cuando se cumplen dos condiciones: el checkout está en su rama por defecto y el árbol de trabajo está limpio. Si no, imprime una línea y sigue:" },
        { kind: "code", lang: "text", caption: "Los tres rechazos, con los mensajes del propio script", code: "<name>: on branch '<branch>', not pulled\n<name>: uncommitted changes, not pulled (bin/harvest collects them)\n<name>: local commits diverge from origin/<default>, not pulled" },
        { kind: "p", text: "Hace merge con `--ff-only`. Nunca hace stash, reset ni cambia de rama. El trabajo a medias de una persona nunca se toca. Después de un pull que movió un repositorio del harness, ejecuta la verificación de contenido prohibido sobre los commits nuevos y avisa si falla." },
      ],
    },
    {
      id: "pointers",
      title: "Paso 2: mover las copias de lectura, informar la brecha",
      blocks: [
        { kind: "p", text: "Luego `git submodule update --init --remote --merge` mueve cada copia de lectura bajo `harness/` a la punta del `main` de ese satélite. Para cada submódulo compara el puntero registrado en el centro con lo que está en el checkout, e imprime cuántos commits adelante está la copia de lectura:" },
        { kind: "code", lang: "text", code: "harness/<name>: reading <sha>, its main (<n> commit(s) after the recorded pointer; <pull request or hint>)" },
        { kind: "p", text: "La pista es o bien el pull request abierto que lo movería, encontrado por nombre de rama, o bien `no pull request moves it yet: bin/sync --bump opens it`." },
      ],
    },
    {
      id: "bump",
      title: "Paso 3: --bump abre el pull request",
      blocks: [
        { kind: "p", text: "El cambio de puntero es un pull request como cualquier otro, porque al `main` del centro nunca se le hace push directo. `--bump` hace todo:" },
        { kind: "steps", items: [
          { title: "Worktree temporal", text: "Crea un worktree desde `origin/main` en una rama `chore/harness-pointers-` con timestamp, de modo que el checkout de la persona no se toca." },
          { title: "Verificación de seguridad", text: "Para cada satélite, se niega a mover un puntero si el main del satélite no contiene el registrado." },
          { title: "Escribir el puntero", text: "Actualiza la entrada del índice directamente con `update-index --cacheinfo`, sin necesidad de hacer checkout del submódulo." },
          { title: "Ejecutar el check", text: "Ejecuta el `bin/check` del centro con los punteros nuevos. Si falla (a menudo un doc que enlaza una ruta que un satélite ya no tiene), no se hace push de nada y el script lo dice." },
          { title: "Abrir y mergear", text: "Hace commit, push, abre el pull request con los hashes cortos viejo y nuevo en el cuerpo, y lo mergea con un merge commit, borrando la rama." },
        ] },
        { kind: "p", text: "Ejecutar `bin/sync` dos veces no cambia nada la segunda vez. El encabezado lo dice, y es la propiedad en la que me apoyo cuando lo ejecuta un timer." },
      ],
    },
    {
      id: "notes",
      title: "Qué muestra el historial",
      blocks: [
        { kind: "p", text: "El log del centro tiene pull requests de movimiento de punteros en los dos días de esta serie: `chore: move the harness pointers` como #167, #170 y otros el 2026-11-20, y #193 y #199 el 2026-11-21. No conté cuántos habrá por semana. Si son muchos, el movimiento de punteros es candidato para el timer diario en lugar de un `--bump` manual." },
        { kind: "callout", tone: "note", text: "El script también imprime una línea de `bin/conformance` (en caché por 12 horas) y las notas que `bin/harvest` haya dejado. Sync es el único comando que te dice si el estado compartido está sano." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "bin/sync e o pull request de ponteiros",
  summary: "Como um script avança (fast-forward) todos os checkouts compartilhados, avisa quando o ponteiro de um submódulo ficou para trás e abre o pull request que o move.",
  sections: [
    {
      id: "why",
      title: "Dois tipos de desatualizado",
      blocks: [
        { kind: "p", text: "Com submódulos há duas formas de ler conhecimento velho. A cópia de trabalho irmã de um satélite pode estar atrás do seu remoto. E a cópia de leitura sob `harness/` pode estar em um commit mais antigo que o `main` do satélite, porque o centro registra um ponteiro e ninguém o moveu." },
        { kind: "p", text: "`bin/sync` cuida das duas. Hoje li o script; isto é o que ele faz, em ordem." },
      ],
    },
    {
      id: "pull",
      title: "Passo 1: fast-forward, nunca force",
      blocks: [
        { kind: "p", text: "Ele encontra os checkouts compartilhados pelo remoto `versatile-sh`, seja qual for o nome da pasta. Em cada um faz fast-forward só quando duas condições valem: o checkout está na branch padrão e a árvore de trabalho está limpa. Caso contrário, imprime uma linha e segue:" },
        { kind: "code", lang: "text", caption: "As três recusas, com as mensagens do próprio script", code: "<name>: on branch '<branch>', not pulled\n<name>: uncommitted changes, not pulled (bin/harvest collects them)\n<name>: local commits diverge from origin/<default>, not pulled" },
        { kind: "p", text: "Ele faz merge com `--ff-only`. Nunca faz stash, reset nem troca de branch. O trabalho pela metade de uma pessoa nunca é tocado. Depois de um pull que moveu um repositório do harness, ele roda a checagem de conteúdo proibido nos commits novos e avisa se falhar." },
      ],
    },
    {
      id: "pointers",
      title: "Passo 2: mover as cópias de leitura, informar a diferença",
      blocks: [
        { kind: "p", text: "Depois `git submodule update --init --remote --merge` move cada cópia de leitura sob `harness/` para a ponta do `main` daquele satélite. Para cada submódulo, compara o ponteiro registrado no centro com o que está no checkout e imprime quantos commits a cópia de leitura está à frente:" },
        { kind: "code", lang: "text", code: "harness/<name>: reading <sha>, its main (<n> commit(s) after the recorded pointer; <pull request or hint>)" },
        { kind: "p", text: "A dica é o pull request aberto que o moveria, encontrado pelo nome da branch, ou `no pull request moves it yet: bin/sync --bump opens it`." },
      ],
    },
    {
      id: "bump",
      title: "Passo 3: --bump abre o pull request",
      blocks: [
        { kind: "p", text: "A mudança de ponteiro é um pull request como qualquer outro, porque o `main` do centro nunca recebe push direto. `--bump` faz tudo:" },
        { kind: "steps", items: [
          { title: "Worktree temporário", text: "Cria um worktree a partir de `origin/main` em uma branch `chore/harness-pointers-` com timestamp, de modo que o checkout da pessoa não é tocado." },
          { title: "Checagem de segurança", text: "Para cada satélite, recusa mover um ponteiro se o main do satélite não contiver o registrado." },
          { title: "Gravar o ponteiro", text: "Atualiza a entrada do índice diretamente com `update-index --cacheinfo`, sem precisar de checkout do submódulo." },
          { title: "Rodar o check", text: "Roda o `bin/check` do centro com os novos ponteiros. Se falhar (muitas vezes um doc que linka um caminho que o satélite não tem mais), nada é enviado e o script avisa." },
          { title: "Abrir e mergear", text: "Faz commit, push, abre o pull request com os hashes curtos antigo e novo no corpo, e o mergeia com um merge commit, apagando a branch." },
        ] },
        { kind: "p", text: "Rodar `bin/sync` duas vezes não muda nada na segunda. O cabeçalho diz isso, e é a propriedade em que me apoio quando um timer o executa." },
      ],
    },
    {
      id: "notes",
      title: "O que o histórico mostra",
      blocks: [
        { kind: "p", text: "O log do centro tem pull requests de movimentação de ponteiros nos dois dias desta série: `chore: move the harness pointers` como #167, #170 e outros em 2026-11-20, e #193 e #199 em 2026-11-21. Não contei quantos serão por semana. Se forem muitos, a movimentação de ponteiros é candidata ao timer diário em vez de um `--bump` manual." },
        { kind: "callout", tone: "note", text: "O script também imprime uma linha do `bin/conformance` (em cache por 12 horas) e as notas que o `bin/harvest` deixou. Sync é o único comando que diz se o estado compartilhado está saudável." },
      ],
    },
  ],
};
