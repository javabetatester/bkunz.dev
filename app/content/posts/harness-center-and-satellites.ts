import type { Post } from "./types";

const post: Post = {
  slug: "harness-center-and-satellites",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "One center, three satellites",
  summary: "Why the team's way of working lives in one repository and every other harness has its own, carried as a submodule instead of copied content.",
  tags: ["harness", "architecture", "git", "submodules"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "The problem with one big folder",
      blocks: [
        { kind: "p", text: "Our setup for working with AI agents started as a pile of instructions. Rules, patterns, project records, infrastructure notes and research all sat close together, and every session loaded whatever was nearest. It grew until nobody could say which file owned which fact." },
        { kind: "p", text: "The team harness (`versatile-sh/.claude`) merged pull requests #166 to #178 on 2026-11-20, among them the one that restricted the team repositories to Versatile knowledge only (#169). That is the day I date this post by. It describes the shape that came out of it, not a measured result: I have no before-and-after numbers for it, and I will not invent any." },
      ],
    },
    {
      id: "shape",
      title: "The shape",
      blocks: [
        { kind: "p", text: "The center is `.claude`. It holds only how we work: the router file, the `docs/work/` guides, skills, agents, commands, the `bin/` tools and the hooks. It never holds an engineering rule, a project fact, a handoff or a personal log." },
        { kind: "p", text: "Every other harness is a satellite with its own repository:" },
        { kind: "table", head: ["Repository", "Holds"], rows: [
          ["versatile-harness", "The engineering knowledge base (premises, rules, patterns, standards, lints, design) and the record home of each project"],
          ["hosting-harness", "Infrastructure and each app's deploy configuration"],
          ["research-harness", "The research engine: method, studies, state"],
          ["<domain>-media", "The canonical copy of every image, video and design source"],
        ] },
        { kind: "p", text: "The center carries the first three as git submodules under `harness/`. Nothing is copied. A session reads `harness/versatile-harness/` the same way it reads any other file, and the content is whatever that satellite's `main` says." },
      ],
    },
    {
      id: "why",
      title: "Why separate repositories",
      blocks: [
        { kind: "p", text: "The premise is written down in the knowledge base as one short file, and its core is a single sentence: a harness can be reduced, replaced and iterated on by itself, so it is never inlined into the center or into another harness." },
        { kind: "list", items: [
          "Different change rates. The knowledge base gets many small pull requests a day. The way of working changes rarely and affects everyone. Mixing them makes every review about two things.",
          "Different audiences. Deploy configuration must never travel with a product repository. Keeping it in its own repository makes that boundary a repository boundary instead of a convention.",
          "Replaceability. If the research engine turns out wrong, it can be rewritten without touching the rest.",
          "A rule for new things. Something harness-like with no repository yet is proposed as a new `<name>-harness`. It is not folded into an existing one.",
        ] },
      ],
    },
    {
      id: "rules",
      title: "The rules that keep it honest",
      blocks: [
        { kind: "list", items: [
          "The truth of a satellite is its `main` on GitHub. The folder under `harness/` is a read copy.",
          "Never edit under `harness/`. Change the sibling working copy, on a branch, through a pull request.",
          "What a session learns about Versatile goes to a shared home through a pull request, never only to memory. What it learns about any other project stays local, in an ignored `local/` folder.",
        ] },
        { kind: "callout", tone: "note", text: "The second and third rules are the reason the split pays off. A fact has exactly one home, and a search that lands in the wrong repository finds nothing instead of a stale copy." },
      ],
    },
    {
      id: "cost",
      title: "What it costs",
      blocks: [
        { kind: "p", text: "Three things get harder. A change that spans the center and a satellite needs two pull requests. The pointers that record which commit of each satellite the center reads can fall behind. And a person has to know which repository owns a topic. The routing table in the center's router file exists for the last one. The next post covers the tool that handles the second." },
        { kind: "p", text: "I think the trade is right, but that is a judgement from days of use by a small team, not a measurement. If the pointer pull requests start to be noise, the answer will be to automate them further, not to merge the repositories back." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "harness-center-and-satellites",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Un centro, tres satélites",
  summary: "Por qué la forma de trabajar del equipo vive en un repositorio y cada otro harness tiene el suyo, incorporado como submódulo en lugar de contenido copiado.",
  tags: ["harness", "architecture", "git", "submodules"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "El problema de una carpeta grande",
      blocks: [
        { kind: "p", text: "Nuestra configuración para trabajar con agentes de IA empezó como un montón de instrucciones. Reglas, patrones, registros de proyectos, notas de infraestructura e investigación estaban todos juntos, y cada sesión cargaba lo que tuviera más cerca. Creció hasta que nadie podía decir qué archivo era dueño de qué dato." },
        { kind: "p", text: "El harness del equipo (`versatile-sh/.claude`) mergeó los pull requests #166 a #178 el 2026-11-20, entre ellos el que restringió los repositorios del equipo a conocimiento de Versatile únicamente (#169). Es el día por el que fecho este post. Describe la forma que salió de ahí, no un resultado medido: no tengo números de antes y después, y no voy a inventarlos." },
      ],
    },
    {
      id: "shape",
      title: "La forma",
      blocks: [
        { kind: "p", text: "El centro es `.claude`. Contiene solo cómo trabajamos: el archivo router, las guías de `docs/work/`, skills, agentes, comandos, las herramientas de `bin/` y los hooks. Nunca contiene una regla de ingeniería, un dato de proyecto, un handoff ni un log personal." },
        { kind: "p", text: "Cada otro harness es un satélite con su propio repositorio:" },
        { kind: "table", head: ["Repositorio", "Contiene"], rows: [
          ["versatile-harness", "La base de conocimiento de ingeniería (premises, rules, patterns, standards, lints, design) y el hogar de registros de cada proyecto"],
          ["hosting-harness", "Infraestructura y la configuración de deploy de cada app"],
          ["research-harness", "El engine de investigación: método, estudios, estado"],
          ["<domain>-media", "La copia canónica de cada imagen, video y fuente de diseño"],
        ] },
        { kind: "p", text: "El centro lleva los tres primeros como submódulos git bajo `harness/`. No se copia nada. Una sesión lee `harness/versatile-harness/` igual que cualquier otro archivo, y el contenido es lo que diga el `main` de ese satélite." },
      ],
    },
    {
      id: "why",
      title: "Por qué repositorios separados",
      blocks: [
        { kind: "p", text: "La premisa está escrita en la base de conocimiento como un archivo corto, y su núcleo es una sola frase: un harness puede reducirse, reemplazarse e iterarse por sí solo, así que nunca se mete inline en el centro ni en otro harness." },
        { kind: "list", items: [
          "Distintos ritmos de cambio. La base de conocimiento recibe muchos pull requests pequeños al día. La forma de trabajar cambia pocas veces y afecta a todos. Mezclarlos hace que cada revisión trate de dos cosas.",
          "Distintas audiencias. La configuración de deploy nunca debe viajar con el repositorio de un producto. Tenerla en su propio repositorio convierte esa frontera en una frontera de repositorio en lugar de una convención.",
          "Reemplazabilidad. Si el engine de investigación resulta equivocado, puede reescribirse sin tocar el resto.",
          "Una regla para cosas nuevas. Algo parecido a un harness sin repositorio todavía se propone como un nuevo `<name>-harness`. No se pliega en uno existente.",
        ] },
      ],
    },
    {
      id: "rules",
      title: "Las reglas que lo mantienen honesto",
      blocks: [
        { kind: "list", items: [
          "La verdad de un satélite es su `main` en GitHub. La carpeta bajo `harness/` es una copia de lectura.",
          "Nunca se edita bajo `harness/`. Se cambia la copia de trabajo hermana, en una rama, mediante un pull request.",
          "Lo que una sesión aprende sobre Versatile va a un hogar compartido mediante un pull request, nunca solo a la memoria. Lo que aprende sobre cualquier otro proyecto se queda local, en una carpeta `local/` ignorada.",
        ] },
        { kind: "callout", tone: "note", text: "La segunda y la tercera regla son la razón por la que la separación rinde. Un dato tiene exactamente un hogar, y una búsqueda que cae en el repositorio equivocado no encuentra nada en lugar de una copia obsoleta." },
      ],
    },
    {
      id: "cost",
      title: "Lo que cuesta",
      blocks: [
        { kind: "p", text: "Tres cosas se vuelven más difíciles. Un cambio que abarca el centro y un satélite necesita dos pull requests. Los punteros que registran qué commit de cada satélite lee el centro pueden quedar atrasados. Y una persona tiene que saber qué repositorio es dueño de un tema. La tabla de routing en el archivo router del centro existe para lo último. El siguiente post cubre la herramienta que maneja lo segundo." },
        { kind: "p", text: "Creo que el intercambio es correcto, pero es un juicio tras días de uso por un equipo pequeño, no una medición. Si los pull requests de punteros empiezan a ser ruido, la respuesta será automatizarlos más, no volver a unir los repositorios." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "harness-center-and-satellites",
  category: "studies",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Um centro, três satélites",
  summary: "Por que a forma de trabalhar da equipe vive em um repositório e cada outro harness tem o seu, incorporado como submódulo em vez de conteúdo copiado.",
  tags: ["harness", "architecture", "git", "submodules"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "O problema de uma pasta grande",
      blocks: [
        { kind: "p", text: "Nossa configuração para trabalhar com agentes de IA começou como uma pilha de instruções. Regras, padrões, registros de projetos, notas de infraestrutura e pesquisa ficavam todos juntos, e cada sessão carregava o que estivesse mais perto. Cresceu até ninguém conseguir dizer qual arquivo era dono de qual fato." },
        { kind: "p", text: "O harness da equipe (`versatile-sh/.claude`) mergeou os pull requests #166 a #178 em 2026-11-20, entre eles o que restringiu os repositórios da equipe a conhecimento do Versatile apenas (#169). É o dia pelo qual data este post. Ele descreve o formato que saiu daí, não um resultado medido: não tenho números de antes e depois, e não vou inventar nenhum." },
      ],
    },
    {
      id: "shape",
      title: "O formato",
      blocks: [
        { kind: "p", text: "O centro é `.claude`. Ele guarda só como trabalhamos: o arquivo router, os guias de `docs/work/`, skills, agentes, comandos, as ferramentas de `bin/` e os hooks. Nunca guarda uma regra de engenharia, um fato de projeto, um handoff nem um log pessoal." },
        { kind: "p", text: "Todo outro harness é um satélite com seu próprio repositório:" },
        { kind: "table", head: ["Repositório", "Guarda"], rows: [
          ["versatile-harness", "A base de conhecimento de engenharia (premises, rules, patterns, standards, lints, design) e o lar de registros de cada projeto"],
          ["hosting-harness", "Infraestrutura e a configuração de deploy de cada app"],
          ["research-harness", "O engine de pesquisa: método, estudos, estado"],
          ["<domain>-media", "A cópia canônica de toda imagem, vídeo e fonte de design"],
        ] },
        { kind: "p", text: "O centro carrega os três primeiros como submódulos git sob `harness/`. Nada é copiado. Uma sessão lê `harness/versatile-harness/` do mesmo jeito que lê qualquer outro arquivo, e o conteúdo é o que o `main` daquele satélite disser." },
      ],
    },
    {
      id: "why",
      title: "Por que repositórios separados",
      blocks: [
        { kind: "p", text: "A premissa está escrita na base de conhecimento como um arquivo curto, e o núcleo dela é uma única frase: um harness pode ser reduzido, substituído e iterado por si só, então nunca é embutido no centro nem em outro harness." },
        { kind: "list", items: [
          "Ritmos de mudança diferentes. A base de conhecimento recebe muitos pull requests pequenos por dia. A forma de trabalhar muda raramente e afeta todo mundo. Misturar os dois faz toda revisão tratar de duas coisas.",
          "Públicos diferentes. A configuração de deploy nunca deve viajar com o repositório de um produto. Mantê-la em um repositório próprio faz dessa fronteira uma fronteira de repositório em vez de uma convenção.",
          "Substituibilidade. Se o engine de pesquisa se mostrar errado, pode ser reescrito sem tocar no resto.",
          "Uma regra para coisas novas. Algo parecido com um harness sem repositório ainda é proposto como um novo `<name>-harness`. Não é dobrado em um existente.",
        ] },
      ],
    },
    {
      id: "rules",
      title: "As regras que o mantêm honesto",
      blocks: [
        { kind: "list", items: [
          "A verdade de um satélite é o `main` dele no GitHub. A pasta sob `harness/` é uma cópia de leitura.",
          "Nunca edite sob `harness/`. Mude a cópia de trabalho irmã, em uma branch, por um pull request.",
          "O que uma sessão aprende sobre o Versatile vai para um lar compartilhado por um pull request, nunca só para a memória. O que ela aprende sobre qualquer outro projeto fica local, em uma pasta `local/` ignorada.",
        ] },
        { kind: "callout", tone: "note", text: "A segunda e a terceira regra são o motivo de a separação compensar. Um fato tem exatamente um lar, e uma busca que cai no repositório errado não acha nada em vez de uma cópia obsoleta." },
      ],
    },
    {
      id: "cost",
      title: "O que custa",
      blocks: [
        { kind: "p", text: "Três coisas ficam mais difíceis. Uma mudança que abrange o centro e um satélite precisa de dois pull requests. Os ponteiros que registram qual commit de cada satélite o centro lê podem ficar para trás. E uma pessoa precisa saber qual repositório é dono de um assunto. A tabela de routing no arquivo router do centro existe para o último. O próximo post cobre a ferramenta que cuida do segundo." },
        { kind: "p", text: "Acho que a troca é certa, mas isso é um julgamento de dias de uso por uma equipe pequena, não uma medição. Se os pull requests de ponteiros começarem a virar ruído, a resposta será automatizá-los mais, não juntar os repositórios de novo." },
      ],
    },
  ],
};
