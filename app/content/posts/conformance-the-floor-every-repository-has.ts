import type { Post } from "./types";

const post: Post = {
  slug: "conformance-the-floor-every-repository-has",
  category: "daily",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "The floor every repository has",
  summary: "bin/conformance lists what each repository of the organization misses from one baseline: Dependabot, Semgrep pinned by tag, lefthook, licence, README lint, go-lint.",
  tags: ["harness", "conformance", "semgrep", "dependabot"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "A standard only a reviewer remembers",
      blocks: [
        { kind: "p", text: "A new repository gets the baseline if the person creating it remembers all of it. Otherwise it quietly does not. The rule file for the baseline says it plainly: the floor is the same everywhere, and a machine says where it is not. Pull request #192 added `bin/conformance` on 2026-11-21." },
      ],
    },
    {
      id: "floor",
      title: "The floor",
      blocks: [
        { kind: "table", head: ["Piece", "What counts"], rows: [
          ["Dependabot", "A `dependabot.yml` with one entry per ecosystem present, weekly, minor and patch grouped"],
          ["Semgrep", "A target in the check command: registry packs for the repository's languages plus the shared rules loaded by URL at a tag; code-free repositories run the secrets pack only"],
          ["Gate shape", "`--baseline-commit` on the merge base with `origin/main`, so a branch fails only on findings it adds"],
          ["lefthook", "Pre-push runs the check command"],
          ["Hygiene", "LICENSE everywhere, SECURITY.md in products, a README that passes the lint"],
          ["go-lint", "In every Go repository's check"],
          ["Check command", "A `mise.toml` with the check task and no Makefile with real targets"],
          ["Branch cleanup", "Delete-branch-on-merge switched on"],
        ] },
        { kind: "p", text: "Two details I like. Shared Semgrep rules are referenced by tag URL and never copied, so adopting a new rule means changing one line. And the scan is local: a workflow may exist for when CI returns, but never as the only gate." },
      ],
    },
    {
      id: "tool",
      title: "How the tool works",
      blocks: [
        { kind: "code", lang: "text", code: "bin/conformance [--org <org>] [--only <repo>,...] [--json]\nbin/conformance --summary [--cached <hours>]\nbin/conformance --repo <dir> [--name <repo>]" },
        { kind: "p", text: "Without arguments it reads every non-archived repository through the GitHub API, reading the file tree and the few files it needs. With `--repo` it checks one local checkout without the API, which is what a new repository runs before its first merge. It exits 1 while anything is missing. Test fixtures, vendored code, templates and research spikes are skipped when it looks for ecosystems, so a fixture's lockfile does not demand a Dependabot entry." },
        { kind: "p", text: "`bin/sync` prints the one-line summary and caches it for 12 hours. That makes the floor visible every morning without being a nag." },
      ],
    },
    {
      id: "note",
      title: "What I am not claiming",
      blocks: [
        { kind: "p", text: "The same day the Semgrep rollout was recorded for every non-archived repository, and the baseline got its own rule file. I did not run the tool against the whole organization for this post, so I have no count of what is missing. That number is the first thing the tool gives you, and it belongs to its own post." },
        { kind: "callout", tone: "note", text: "The pull request series also added a mise task layout in #198 so that the check, conformance and the lints share one command name. Same lesson as the rest of the harness: one definition of green." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "conformance-the-floor-every-repository-has",
  category: "daily",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "El piso que todo repositorio tiene",
  summary: "bin/conformance lista lo que a cada repositorio de la organización le falta de un baseline: Dependabot, Semgrep fijado por tag, lefthook, licencia, lint de README, go-lint.",
  tags: ["harness", "conformance", "semgrep", "dependabot"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "Un estándar que solo recuerda un reviewer",
      blocks: [
        { kind: "p", text: "Un repositorio nuevo recibe el baseline si quien lo crea lo recuerda entero. Si no, silenciosamente no lo recibe. El archivo de reglas del baseline lo dice sin rodeos: el piso es el mismo en todas partes, y una máquina dice dónde no lo es. El pull request #192 añadió `bin/conformance` el 2026-11-21." },
      ],
    },
    {
      id: "floor",
      title: "El piso",
      blocks: [
        { kind: "table", head: ["Pieza", "Qué cuenta"], rows: [
          ["Dependabot", "Un `dependabot.yml` con una entrada por ecosistema presente, semanal, con minor y patch agrupados"],
          ["Semgrep", "Un target en el comando de check: packs del registry para los lenguajes del repositorio más las reglas compartidas cargadas por URL en un tag; los repositorios sin código ejecutan solo el pack de secrets"],
          ["Forma del gate", "`--baseline-commit` sobre el merge base con `origin/main`, de modo que una rama falla solo por los hallazgos que añade"],
          ["lefthook", "Pre-push ejecuta el comando de check"],
          ["Higiene", "LICENSE en todos, SECURITY.md en los productos, un README que pasa el lint"],
          ["go-lint", "En el check de todo repositorio Go"],
          ["Comando de check", "Un `mise.toml` con la tarea check y ningún Makefile con targets reales"],
          ["Limpieza de ramas", "Delete-branch-on-merge activado"],
        ] },
        { kind: "p", text: "Dos detalles que me gustan. Las reglas compartidas de Semgrep se referencian por URL de tag y nunca se copian, así que adoptar una regla nueva es cambiar una línea. Y el escaneo es local: puede existir un workflow para cuando vuelva el CI, pero nunca como único gate." },
      ],
    },
    {
      id: "tool",
      title: "Cómo funciona la herramienta",
      blocks: [
        { kind: "code", lang: "text", code: "bin/conformance [--org <org>] [--only <repo>,...] [--json]\nbin/conformance --summary [--cached <hours>]\nbin/conformance --repo <dir> [--name <repo>]" },
        { kind: "p", text: "Sin argumentos lee cada repositorio no archivado a través de la API de GitHub, leyendo el árbol de archivos y los pocos archivos que necesita. Con `--repo` revisa un checkout local sin la API, que es lo que ejecuta un repositorio nuevo antes de su primer merge. Sale con 1 mientras falte algo. Los fixtures de tests, el código vendored, las plantillas y los spikes de investigación se saltan al buscar ecosistemas, así que el lockfile de un fixture no exige una entrada de Dependabot." },
        { kind: "p", text: "`bin/sync` imprime el resumen de una línea y lo cachea durante 12 horas. Eso hace visible el piso cada mañana sin ser una molestia." },
      ],
    },
    {
      id: "note",
      title: "Lo que no afirmo",
      blocks: [
        { kind: "p", text: "El mismo día se registró el despliegue de Semgrep para cada repositorio no archivado, y el baseline recibió su propio archivo de reglas. No ejecuté la herramienta contra toda la organización para este post, así que no tengo un conteo de lo que falta. Ese número es lo primero que da la herramienta, y merece su propio post." },
        { kind: "callout", tone: "note", text: "La serie de pull requests también añadió un layout de tareas de mise en #198 para que el check, conformance y los lints compartan un mismo nombre de comando. La misma lección que el resto del harness: una sola definición de verde." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "conformance-the-floor-every-repository-has",
  category: "daily",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "O piso que todo repositório tem",
  summary: "bin/conformance lista o que cada repositório da organização não tem de um baseline: Dependabot, Semgrep fixado por tag, lefthook, licença, lint de README, go-lint.",
  tags: ["harness", "conformance", "semgrep", "dependabot"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "Um padrão que só um reviewer lembra",
      blocks: [
        { kind: "p", text: "Um repositório novo recebe o baseline se quem o cria lembra dele inteiro. Senão, silenciosamente não recebe. O arquivo de regras do baseline diz sem rodeios: o piso é o mesmo em todo lugar, e uma máquina diz onde não é. O pull request #192 adicionou o `bin/conformance` em 2026-11-21." },
      ],
    },
    {
      id: "floor",
      title: "O piso",
      blocks: [
        { kind: "table", head: ["Peça", "O que conta"], rows: [
          ["Dependabot", "Um `dependabot.yml` com uma entrada por ecossistema presente, semanal, com minor e patch agrupados"],
          ["Semgrep", "Um target no comando de check: packs do registry para as linguagens do repositório mais as regras compartilhadas carregadas por URL em um tag; repositórios sem código rodam só o pack de secrets"],
          ["Formato do gate", "`--baseline-commit` no merge base com `origin/main`, de modo que uma branch falha só pelos achados que ela adiciona"],
          ["lefthook", "Pre-push roda o comando de check"],
          ["Higiene", "LICENSE em todos, SECURITY.md nos produtos, um README que passa no lint"],
          ["go-lint", "No check de todo repositório Go"],
          ["Comando de check", "Um `mise.toml` com a task check e nenhum Makefile com targets reais"],
          ["Limpeza de branches", "Delete-branch-on-merge ligado"],
        ] },
        { kind: "p", text: "Dois detalhes de que gosto. As regras compartilhadas do Semgrep são referenciadas por URL de tag e nunca copiadas, então adotar uma regra nova é mudar uma linha. E o scan é local: pode existir um workflow para quando o CI voltar, mas nunca como único gate." },
      ],
    },
    {
      id: "tool",
      title: "Como a ferramenta funciona",
      blocks: [
        { kind: "code", lang: "text", code: "bin/conformance [--org <org>] [--only <repo>,...] [--json]\nbin/conformance --summary [--cached <hours>]\nbin/conformance --repo <dir> [--name <repo>]" },
        { kind: "p", text: "Sem argumentos, ela lê todo repositório não arquivado pela API do GitHub, lendo a árvore de arquivos e os poucos arquivos de que precisa. Com `--repo`, verifica um checkout local sem a API, que é o que um repositório novo roda antes do primeiro merge. Sai com 1 enquanto faltar algo. Fixtures de testes, código vendored, templates e spikes de pesquisa são ignorados ao procurar ecossistemas, então o lockfile de um fixture não exige uma entrada do Dependabot." },
        { kind: "p", text: "`bin/sync` imprime o resumo de uma linha e o guarda em cache por 12 horas. Isso torna o piso visível toda manhã sem virar uma chateação." },
      ],
    },
    {
      id: "note",
      title: "O que eu não estou afirmando",
      blocks: [
        { kind: "p", text: "No mesmo dia foi registrado o rollout do Semgrep para todo repositório não arquivado, e o baseline ganhou seu próprio arquivo de regras. Não rodei a ferramenta contra a organização inteira para este post, então não tenho uma contagem do que falta. Esse número é a primeira coisa que a ferramenta entrega, e merece o próprio post." },
        { kind: "callout", tone: "note", text: "A série de pull requests também adicionou um layout de tasks do mise em #198 para que o check, o conformance e os lints compartilhem um único nome de comando. Mesma lição do resto do harness: uma única definição de verde." },
      ],
    },
  ],
};
