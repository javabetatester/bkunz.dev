import type { Lang } from "./copy";

export type PagesCopy = {
  work: { h1: string; lede: string };
  projects: { h1: string; lede: string; status: string; contentsLabel: string; contents: { title: string; body: string }[] };
  posts: { h1: string; lede: string; status: string; empty: string; categories: { id: string; title: string; body: string }[]; backLead: string; workLink: string; and: string; whoamiLink: string };
};

export const PAGES_COPY: Record<Lang, PagesCopy> = {
  en: {
    work: { h1: "Work", lede: "Ten years on backends that cannot stop: game networks, payments, applied AI." },
    projects: {
      h1: "Projects",
      lede: "Each project opens its own technical doc: how to bootstrap it, how it works at a high and a low level, the decisions behind it and the files that matter.",
      status: "write-up in review",
      contentsLabel: "What each write-up will contain",
      contents: [
        { title: "Architecture", body: "The pieces, their boundaries and how data moves between them." },
        { title: "Decisions and trade-offs", body: "What was chosen, what was rejected and what each choice costs." },
        { title: "How to run it", body: "The commands and configuration to run it on your own machine." },
        { title: "The files that matter", body: "A short map of the code worth reading first." },
      ],
    },
    posts: {
      h1: "Posts",
      lede: "Notes from the work as it happens: daily logs, discoveries and longer studies.",
      status: "first posts in writing",
      empty: "Nothing published yet.",
      categories: [
        { id: "daily", title: "daily", body: "Short logs of what was built, broken and fixed that day." },
        { id: "discoveries", title: "discoveries", body: "Something that behaved differently than expected, and why." },
        { id: "studies", title: "studies", body: "Longer research with measurements, alternatives and a conclusion." },
      ],
      backLead: "Meanwhile, read the",
      workLink: "work history",
      and: "or",
      whoamiLink: "who I am",
    },
  },
  es: {
    work: { h1: "Trabajo", lede: "Diez años en backends que no pueden parar: redes de juegos, pagos, IA aplicada." },
    projects: {
      h1: "Proyectos",
      lede: "Cada proyecto abre su propia doc técnica: cómo levantarlo, cómo funciona en alto y bajo nivel, las decisiones detrás y los archivos que importan.",
      status: "write-up en revisión",
      contentsLabel: "Qué contendrá cada write-up",
      contents: [
        { title: "Arquitectura", body: "Las piezas, sus fronteras y cómo se mueven los datos entre ellas." },
        { title: "Decisiones y trade-offs", body: "Qué se eligió, qué se descartó y cuánto cuesta cada elección." },
        { title: "Cómo ejecutarlo", body: "Los comandos y la configuración para correrlo en tu máquina." },
        { title: "Los archivos que importan", body: "Un mapa corto del código que vale la pena leer primero." },
      ],
    },
    posts: {
      h1: "Posts",
      lede: "Notas del trabajo mientras pasa: registros diarios, descubrimientos y estudios más largos.",
      status: "primeros posts en escritura",
      empty: "Nada publicado aún.",
      categories: [
        { id: "daily", title: "daily", body: "Registros cortos de lo que se construyó, rompió y arregló ese día." },
        { id: "discoveries", title: "discoveries", body: "Algo que se comportó distinto de lo esperado, y por qué." },
        { id: "studies", title: "studies", body: "Investigación más larga, con mediciones, alternativas y una conclusión." },
      ],
      backLead: "Mientras tanto, lee el",
      workLink: "historial de trabajo",
      and: "o",
      whoamiLink: "quién soy",
    },
  },
  "pt-br": {
    work: { h1: "Trabalho", lede: "Dez anos em backends que não podem parar: redes de jogos, pagamentos, IA aplicada." },
    projects: {
      h1: "Projetos",
      lede: "Cada projeto abre sua própria doc técnica: como subir, como funciona em alto e baixo nível, as decisões por trás e os arquivos que importam.",
      status: "write-up em revisão",
      contentsLabel: "O que cada write-up vai conter",
      contents: [
        { title: "Arquitetura", body: "As peças, suas fronteiras e como os dados circulam entre elas." },
        { title: "Decisões e trade-offs", body: "O que foi escolhido, o que foi descartado e quanto cada escolha custa." },
        { title: "Como rodar", body: "Os comandos e a configuração para rodar na sua máquina." },
        { title: "Os arquivos que importam", body: "Um mapa curto do código que vale a pena ler primeiro." },
      ],
    },
    posts: {
      h1: "Posts",
      lede: "Notas do trabalho enquanto ele acontece: registros diários, descobertas e estudos mais longos.",
      status: "primeiros posts em escrita",
      empty: "Nada publicado ainda.",
      categories: [
        { id: "daily", title: "daily", body: "Registros curtos do que foi construído, quebrado e consertado no dia." },
        { id: "discoveries", title: "discoveries", body: "Algo que se comportou diferente do esperado, e por quê." },
        { id: "studies", title: "studies", body: "Pesquisa mais longa, com medições, alternativas e uma conclusão." },
      ],
      backLead: "Enquanto isso, leia o",
      workLink: "histórico de trabalho",
      and: "ou",
      whoamiLink: "quem sou",
    },
  },
};
