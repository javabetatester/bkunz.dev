import type { Post } from "./types";

const post: Post = {
  slug: "a-deny-list-nobody-has-to-write",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "A deny list nobody has to write",
  summary: "Shared repositories must never contain names from other projects. The list of names comes from the checkouts already on your machine, so there is nothing to fill in by hand.",
  tags: ["harness", "neutrality", "python", "git"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "A rule that depends on a list",
      blocks: [
        { kind: "p", text: "A team repository that is meant to be public tomorrow cannot contain the name of an employer, a customer, or someone's other project. The obvious guard is a deny list. The obvious problem is that the list is itself a list of those names. Committing it defeats the purpose." },
        { kind: "p", text: "The harness already had the shape of an answer. `bin/harness_deny.py` combines three sources, strongest first: generic patterns, hashed names, and a personal list that stays outside git. Pull request #174 on 2026-11-20 made the third source generate itself." },
      ],
    },
    {
      id: "layers",
      title: "Three layers",
      blocks: [
        { kind: "table", head: ["Layer", "Where it lives", "What it catches"], rows: [
          ["Generic patterns", "In the script, tracked", "Personal home paths, e-mail addresses, IP addresses, tokens, private keys, secret-store references, attribution trailers, a tax-id shape"],
          ["Hashed names", "A tracked file of SHA-256 digests of lowercase words", "A name blocked for everyone, without the name being written anywhere"],
          ["Personal list", "A file in the user's config directory, never committed", "One case-insensitive regular expression per line: the real names on this machine"],
        ] },
        { kind: "p", text: "A repository can carry an allow file for one exception per line, with a path glob and a reason. The same patterns are shared by `bin/check`, by `bin/harvest` and by the validator a repository passes before going public." },
      ],
    },
    {
      id: "generated",
      title: "Where the personal list comes from",
      blocks: [
        { kind: "p", text: "`bin/harness_scan.py` walks the git checkouts under the Versatile folder. A checkout is ours if its origin is a `versatile-sh` repository. Everything else, another organization or no remote at all, is listed in an ignored `local/repos.md`. The owner and the distinctive repository names of those remotes become a managed block in the personal list." },
        { kind: "p", text: "Generic words must not become deny patterns, or every doc mentioning a server would be blocked. The scanner carries a stoplist of common repository words (app, api, docs, backend, platform, agent, and 137 words in all) and drops them." },
        { kind: "list", items: [
          "`bin/install` and `bin/sync` both run the scan, so a new checkout joins the list on the next sync.",
          "The block is marked as generated and managed. A person's own lines outside the block are kept.",
          "`local/repos.md` has a section called Extra for anything the scan cannot see.",
        ] },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        { kind: "p", text: "It only knows what is on this machine. A customer that exists in no checkout is not in the list, and a name that is also a common word may slip through the stoplist or be dropped by it. That is why the generic patterns and the harvest sanitizer stay on top." },
        { kind: "callout", tone: "warn", text: "I have not measured false positives or misses. A harvest that holds back files it should not, or one that lets a name through, would be the first evidence, and none is recorded yet." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "a-deny-list-nobody-has-to-write",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Una deny list que nadie tiene que escribir",
  summary: "Los repositorios compartidos nunca deben contener nombres de otros proyectos. La lista de nombres sale de los checkouts que ya tienes en la máquina, así que no hay nada que rellenar a mano.",
  tags: ["harness", "neutrality", "python", "git"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "Una regla que depende de una lista",
      blocks: [
        { kind: "p", text: "Un repositorio de equipo que mañana debe poder ser público no puede contener el nombre de un empleador, de un cliente ni del otro proyecto de alguien. La protección obvia es una deny list. El problema obvio es que la propia lista es una lista de esos nombres. Commitearla anula el propósito." },
        { kind: "p", text: "El harness ya tenía la forma de una respuesta. `bin/harness_deny.py` combina tres fuentes, de la más fuerte a la más débil: patrones genéricos, nombres con hash y una lista personal que queda fuera de git. El pull request #174, del 2026-11-20, hizo que la tercera fuente se genere sola." },
      ],
    },
    {
      id: "layers",
      title: "Tres capas",
      blocks: [
        { kind: "table", head: ["Capa", "Dónde vive", "Qué detecta"], rows: [
          ["Patrones genéricos", "En el script, versionados", "Rutas de home personales, direcciones de e-mail, direcciones IP, tokens, claves privadas, referencias a secret stores, trailers de atribución, la forma de un documento fiscal"],
          ["Nombres con hash", "Un archivo versionado con digests SHA-256 de palabras en minúsculas", "Un nombre bloqueado para todos, sin que el nombre esté escrito en ningún lugar"],
          ["Lista personal", "Un archivo en el directorio de configuración del usuario, nunca commiteado", "Una expresión regular por línea, sin distinguir mayúsculas: los nombres reales de esta máquina"],
        ] },
        { kind: "p", text: "Un repositorio puede llevar un archivo allow con una excepción por línea, con un glob de ruta y un motivo. Los mismos patrones los comparten `bin/check`, `bin/harvest` y el validador que un repositorio pasa antes de hacerse público." },
      ],
    },
    {
      id: "generated",
      title: "De dónde sale la lista personal",
      blocks: [
        { kind: "p", text: "`bin/harness_scan.py` recorre los checkouts git bajo la carpeta Versatile. Un checkout es nuestro si su origin es un repositorio de `versatile-sh`. Todo lo demás, otra organización o ningún remote, se lista en un `local/repos.md` ignorado. El owner y los nombres distintivos de repositorio de esos remotes pasan a ser un bloque gestionado dentro de la lista personal." },
        { kind: "p", text: "Las palabras genéricas no pueden convertirse en patrones de bloqueo, o cada doc que mencione un servidor quedaría bloqueado. El scanner lleva una stoplist de palabras comunes de repositorio (app, api, docs, backend, platform, agent y 137 palabras en total) y las descarta." },
        { kind: "list", items: [
          "`bin/install` y `bin/sync` ejecutan el scan, así que un checkout nuevo entra en la lista en el siguiente sync.",
          "El bloque está marcado como generado y gestionado. Las líneas propias de la persona fuera del bloque se conservan.",
          "`local/repos.md` tiene una sección llamada Extra para todo lo que el scan no puede ver.",
        ] },
      ],
    },
    {
      id: "limits",
      title: "Límites",
      blocks: [
        { kind: "p", text: "Solo conoce lo que hay en esta máquina. Un cliente que no existe en ningún checkout no está en la lista, y un nombre que además es una palabra común puede escaparse de la stoplist o ser descartado por ella. Por eso los patrones genéricos y el sanitizer de harvest siguen por encima." },
        { kind: "callout", tone: "warn", text: "No medí falsos positivos ni omisiones. Un harvest que retiene archivos que no debería, o uno que deja pasar un nombre, sería la primera evidencia, y todavía no hay ninguna registrada." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "a-deny-list-nobody-has-to-write",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "Uma deny list que ninguém precisa escrever",
  summary: "Repositórios compartilhados nunca devem conter nomes de outros projetos. A lista de nomes vem dos checkouts que você já tem na máquina, então não há nada para preencher à mão.",
  tags: ["harness", "neutrality", "python", "git"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "Uma regra que depende de uma lista",
      blocks: [
        { kind: "p", text: "Um repositório de equipe que amanhã deve poder ser público não pode conter o nome de um empregador, de um cliente nem do outro projeto de alguém. A proteção óbvia é uma deny list. O problema óbvio é que a própria lista é uma lista desses nomes. Commitá-la anula o propósito." },
        { kind: "p", text: "O harness já tinha o formato de uma resposta. `bin/harness_deny.py` combina três fontes, da mais forte para a mais fraca: padrões genéricos, nomes com hash e uma lista pessoal que fica fora do git. O pull request #174, de 2026-11-20, fez a terceira fonte se gerar sozinha." },
      ],
    },
    {
      id: "layers",
      title: "Três camadas",
      blocks: [
        { kind: "table", head: ["Camada", "Onde vive", "O que pega"], rows: [
          ["Padrões genéricos", "No script, versionados", "Caminhos de home pessoais, endereços de e-mail, endereços IP, tokens, chaves privadas, referências a secret stores, trailers de atribuição, o formato de um documento fiscal"],
          ["Nomes com hash", "Um arquivo versionado com digests SHA-256 de palavras em minúsculas", "Um nome bloqueado para todos, sem que o nome esteja escrito em lugar nenhum"],
          ["Lista pessoal", "Um arquivo no diretório de configuração do usuário, nunca commitado", "Uma expressão regular por linha, sem diferenciar maiúsculas: os nomes reais desta máquina"],
        ] },
        { kind: "p", text: "Um repositório pode ter um arquivo allow com uma exceção por linha, com um glob de caminho e um motivo. Os mesmos padrões são compartilhados por `bin/check`, por `bin/harvest` e pelo validador que um repositório passa antes de ficar público." },
      ],
    },
    {
      id: "generated",
      title: "De onde vem a lista pessoal",
      blocks: [
        { kind: "p", text: "`bin/harness_scan.py` percorre os checkouts git sob a pasta Versatile. Um checkout é nosso se o origin dele é um repositório de `versatile-sh`. Todo o resto, outra organização ou nenhum remote, é listado em um `local/repos.md` ignorado. O owner e os nomes distintivos de repositório desses remotes viram um bloco gerenciado na lista pessoal." },
        { kind: "p", text: "Palavras genéricas não podem virar padrões de bloqueio, senão todo doc que mencione um servidor seria bloqueado. O scanner carrega uma stoplist de palavras comuns de repositório (app, api, docs, backend, platform, agent e 137 palavras no total) e as descarta." },
        { kind: "list", items: [
          "`bin/install` e `bin/sync` rodam o scan, então um checkout novo entra na lista no próximo sync.",
          "O bloco é marcado como gerado e gerenciado. As linhas próprias da pessoa fora do bloco são mantidas.",
          "`local/repos.md` tem uma seção chamada Extra para tudo que o scan não consegue ver.",
        ] },
      ],
    },
    {
      id: "limits",
      title: "Limites",
      blocks: [
        { kind: "p", text: "Ela só conhece o que está nesta máquina. Um cliente que não existe em nenhum checkout não está na lista, e um nome que também é uma palavra comum pode escapar da stoplist ou ser descartado por ela. Por isso os padrões genéricos e o sanitizer do harvest continuam por cima." },
        { kind: "callout", tone: "warn", text: "Não medi falsos positivos nem omissões. Um harvest que segura arquivos que não deveria, ou um que deixa passar um nome, seria a primeira evidência, e ainda não há nenhuma registrada." },
      ],
    },
  ],
};
