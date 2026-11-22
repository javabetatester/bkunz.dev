import type { Post } from "./types";

const post: Post = {
  slug: "harvest-what-merges-by-itself",
  category: "discoveries",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "What a knowledge collector may merge by itself",
  summary: "bin/harvest turns uncommitted notes in the harness repositories into pull requests. The interesting part is the short list of changes it is allowed to merge without a human.",
  tags: ["harness", "automation", "pull-requests", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "Knowledge left in a working tree",
      blocks: [
        { kind: "p", text: "Sessions learn things. Some of them end with the learning written into a file and never committed. In a shared harness that is a loss for everyone else, and it is also a risk: an uncommitted file is not reviewed by anyone." },
        { kind: "p", text: "`bin/harvest` is the safety net. It looks at the center and at the sibling working copies of each harness, and turns uncommitted changes into pull requests on a `harvest/<user>-<date>` branch. I read the script and the learning-loop doc to write this." },
      ],
    },
    {
      id: "careful",
      title: "How careful it is",
      blocks: [
        { kind: "list", items: [
          "Only the default branch of a working copy. Anything else is skipped.",
          "It fetches first and refuses a copy that has local commits the remote does not have.",
          "It waits until nobody is editing. A file modified within the last 15 minutes counts as still in use (`VERSATILE_HARVEST_QUIET_MINUTES`). At the end of a session it waits up to 45.",
          "It builds the proposal in a temporary worktree, so the person's checkout never changes branch.",
          "It runs the sanitizer over what it staged and holds back only the files the sanitizer flags. A new file naming something outside Versatile moves to the personal `local/` area; a new folder with no home is skipped as ambiguous.",
          "Media and binary files are never collected.",
          "It runs the repository's check before pushing. A failure restores the state and leaves a note that `bin/sync` prints.",
        ] },
        { kind: "p", text: "It never commits to `main`, never force-pushes, and can be turned off with an environment variable or a file in the config directory." },
      ],
    },
    {
      id: "merge",
      title: "What merges without a person",
      blocks: [
        { kind: "p", text: "Everything opens a pull request. Almost nothing merges by itself. The merge rule is a single regular expression in the script:" },
        { kind: "code", lang: "python", code: "APPEND_ONLY = re.compile(r\"^projects/[^/]+/(?:issues|findings|operations)\\.md$\")" },
        { kind: "p", text: "Only additions to those three record files of a project merge automatically. A changed or removed line does not. An ADR, a rule, a way-of-working doc, a skill or a script stays open." },
        { kind: "p", text: "The reason is in the learning-loop doc: those latter files change what everyone does. A new entry in a findings log changes what people know. That is a different risk, and I think it is the right line, though I have no data on how often a harvest pull request has been wrong. The script first appears in the center's history on 2026-11-20." },
      ],
    },
    {
      id: "when",
      title: "When it runs",
      blocks: [
        { kind: "p", text: "Two triggers, both installed by `bin/install --with-hooks --with-timer`. A SessionEnd hook starts it detached, but only on a real exit, not on `/clear`, a resume or a compaction. And a daily timer runs it after `bin/sync`." },
        { kind: "p", text: "The same script reports two kinds of stale pull request as attention notes: a `turbo` pull request open for more than 7 days, and a Dependabot pull request open for more than 24 hours. The thresholds are in the source; whether they are the right ones is something I will only know after living with them." },
        { kind: "callout", tone: "note", text: "Surprise worth recording: the safest design was not a smarter merge decision. It was a much smaller one. One path to auto-merge, defined by a filename pattern and a rule that lines are only added." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "harvest-what-merges-by-itself",
  category: "discoveries",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Lo que un recolector de conocimiento puede mergear por sí solo",
  summary: "bin/harvest convierte notas sin commitear de los repositorios del harness en pull requests. Lo interesante es la lista corta de cambios que se le permite mergear sin un humano.",
  tags: ["harness", "automation", "pull-requests", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "Conocimiento olvidado en un working tree",
      blocks: [
        { kind: "p", text: "Las sesiones aprenden cosas. Algunas terminan con el aprendizaje escrito en un archivo y nunca commiteado. En un harness compartido eso es una pérdida para todos los demás, y también un riesgo: un archivo sin commitear no lo revisa nadie." },
        { kind: "p", text: "`bin/harvest` es la red de seguridad. Mira el centro y las copias de trabajo hermanas de cada harness, y convierte los cambios sin commitear en pull requests en una rama `harvest/<user>-<date>`. Leí el script y el doc del learning loop para escribir esto." },
      ],
    },
    {
      id: "careful",
      title: "Qué tan cuidadoso es",
      blocks: [
        { kind: "list", items: [
          "Solo la rama por defecto de una copia de trabajo. Todo lo demás se omite.",
          "Hace fetch primero y rechaza una copia que tenga commits locales que el remote no tiene.",
          "Espera a que nadie esté editando. Un archivo modificado en los últimos 15 minutos cuenta como todavía en uso (`VERSATILE_HARVEST_QUIET_MINUTES`). Al final de una sesión espera hasta 45.",
          "Construye la propuesta en un worktree temporal, así que el checkout de la persona nunca cambia de rama.",
          "Ejecuta el sanitizer sobre lo que preparó y retiene solo los archivos que el sanitizer marca. Un archivo nuevo que nombra algo fuera de Versatile pasa al área personal `local/`; una carpeta nueva sin hogar se omite por ambigua.",
          "Los archivos multimedia y binarios nunca se recolectan.",
          "Ejecuta el check del repositorio antes de hacer push. Un fallo restaura el estado y deja una nota que imprime `bin/sync`.",
        ] },
        { kind: "p", text: "Nunca hace commit en `main`, nunca hace force-push, y se puede apagar con una variable de entorno o un archivo en el directorio de configuración." },
      ],
    },
    {
      id: "merge",
      title: "Qué se mergea sin una persona",
      blocks: [
        { kind: "p", text: "Todo abre un pull request. Casi nada se mergea solo. La regla de merge es una sola expresión regular en el script:" },
        { kind: "code", lang: "python", code: "APPEND_ONLY = re.compile(r\"^projects/[^/]+/(?:issues|findings|operations)\\.md$\")" },
        { kind: "p", text: "Solo las adiciones a esos tres archivos de registro de un proyecto se mergean automáticamente. Una línea cambiada o eliminada no. Un ADR, una regla, un doc de forma de trabajo, una skill o un script se queda abierto." },
        { kind: "p", text: "La razón está en el doc del learning loop: estos últimos archivos cambian lo que todos hacen. Una entrada nueva en un log de findings cambia lo que la gente sabe. Es otro riesgo, y creo que es la línea correcta, aunque no tengo datos de con qué frecuencia un pull request de harvest ha estado equivocado. El script aparece por primera vez en el historial del centro el 2026-11-20." },
      ],
    },
    {
      id: "when",
      title: "Cuándo se ejecuta",
      blocks: [
        { kind: "p", text: "Dos disparadores, ambos instalados por `bin/install --with-hooks --with-timer`. Un hook SessionEnd lo inicia desacoplado, pero solo en una salida real, no en `/clear`, una reanudación o una compactación. Y un timer diario lo ejecuta después de `bin/sync`." },
        { kind: "p", text: "El mismo script reporta dos tipos de pull request obsoleto como notas de atención: un pull request `turbo` abierto más de 7 días y un pull request de Dependabot abierto más de 24 horas. Los umbrales están en el código fuente; si son los correctos es algo que solo sabré después de convivir con ellos." },
        { kind: "callout", tone: "note", text: "Sorpresa que vale registrar: el diseño más seguro no fue una decisión de merge más inteligente. Fue una mucho más pequeña. Un solo camino de auto-merge, definido por un patrón de nombre de archivo y una regla de que las líneas solo se añaden." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "harvest-what-merges-by-itself",
  category: "discoveries",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "O que um coletor de conhecimento pode mergear sozinho",
  summary: "bin/harvest transforma notas não commitadas dos repositórios do harness em pull requests. O interessante é a lista curta de mudanças que ele tem permissão de mergear sem um humano.",
  tags: ["harness", "automation", "pull-requests", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "Conhecimento esquecido em um working tree",
      blocks: [
        { kind: "p", text: "Sessões aprendem coisas. Algumas terminam com o aprendizado escrito em um arquivo e nunca commitado. Em um harness compartilhado isso é uma perda para todos os outros, e também um risco: um arquivo não commitado não é revisado por ninguém." },
        { kind: "p", text: "`bin/harvest` é a rede de segurança. Ele olha o centro e as cópias de trabalho irmãs de cada harness, e transforma mudanças não commitadas em pull requests em uma branch `harvest/<user>-<date>`. Li o script e o doc do learning loop para escrever isto." },
      ],
    },
    {
      id: "careful",
      title: "Quão cuidadoso ele é",
      blocks: [
        { kind: "list", items: [
          "Só a branch padrão de uma cópia de trabalho. Qualquer outra é ignorada.",
          "Faz fetch primeiro e recusa uma cópia que tenha commits locais que o remote não tem.",
          "Espera até ninguém estar editando. Um arquivo modificado nos últimos 15 minutos conta como ainda em uso (`VERSATILE_HARVEST_QUIET_MINUTES`). No fim de uma sessão espera até 45.",
          "Monta a proposta em um worktree temporário, então o checkout da pessoa nunca troca de branch.",
          "Roda o sanitizer sobre o que preparou e segura só os arquivos que o sanitizer sinaliza. Um arquivo novo que nomeia algo fora do Versatile vai para a área pessoal `local/`; uma pasta nova sem lar é ignorada por ambígua.",
          "Mídia e arquivos binários nunca são coletados.",
          "Roda o check do repositório antes de dar push. Uma falha restaura o estado e deixa uma nota que o `bin/sync` imprime.",
        ] },
        { kind: "p", text: "Ele nunca commita em `main`, nunca faz force-push, e pode ser desligado com uma variável de ambiente ou um arquivo no diretório de configuração." },
      ],
    },
    {
      id: "merge",
      title: "O que mergeia sem uma pessoa",
      blocks: [
        { kind: "p", text: "Tudo abre um pull request. Quase nada mergeia sozinho. A regra de merge é uma única expressão regular no script:" },
        { kind: "code", lang: "python", code: "APPEND_ONLY = re.compile(r\"^projects/[^/]+/(?:issues|findings|operations)\\.md$\")" },
        { kind: "p", text: "Só adições a esses três arquivos de registro de um projeto mergeiam automaticamente. Uma linha alterada ou removida não. Um ADR, uma regra, um doc de forma de trabalho, uma skill ou um script fica aberto." },
        { kind: "p", text: "O motivo está no doc do learning loop: esses últimos arquivos mudam o que todo mundo faz. Uma entrada nova em um log de findings muda o que as pessoas sabem. É outro risco, e acho que é a linha certa, embora eu não tenha dados de com que frequência um pull request do harvest esteve errado. O script aparece pela primeira vez no histórico do centro em 2026-11-20." },
      ],
    },
    {
      id: "when",
      title: "Quando ele roda",
      blocks: [
        { kind: "p", text: "Dois gatilhos, ambos instalados por `bin/install --with-hooks --with-timer`. Um hook SessionEnd o inicia desacoplado, mas só em uma saída real, não em `/clear`, uma retomada ou uma compactação. E um timer diário o roda depois do `bin/sync`." },
        { kind: "p", text: "O mesmo script reporta dois tipos de pull request parado como notas de atenção: um pull request `turbo` aberto por mais de 7 dias e um pull request do Dependabot aberto por mais de 24 horas. Os limites estão no código-fonte; se são os certos é algo que só vou saber depois de conviver com eles." },
        { kind: "callout", tone: "note", text: "Surpresa que vale registrar: o design mais seguro não foi uma decisão de merge mais inteligente. Foi uma bem menor. Um único caminho de auto-merge, definido por um padrão de nome de arquivo e uma regra de que linhas só são adicionadas." },
      ],
    },
  ],
};
