import type { Post } from "./types";

const post: Post = {
  slug: "reading-notes-elixir-otp-and-durable-workflows",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Reading notes: Elixir/OTP and durable workflows",
  summary: "Notes on public material, not my benchmarks: processes, supervisors and let it crash from the Erlang and Elixir docs and Armstrong's thesis, then my own mapping of GenServer messages onto durable workflow ideas, labelled as hypothesis.",
  tags: ["elixir", "otp", "supervision", "durable-execution", "reading-notes"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-this-is",
      title: "What this is",
      blocks: [
        { kind: "p", text: "Reading notes on public documentation, fetched on 2026-11-21. I did not write or run any Elixir for this. The sources:" },
        { kind: "list", items: [
          "GenServer docs: https://elixir.hexdocs.pm/GenServer.html",
          "OTP design principles: https://www.erlang.org/doc/system/design_principles.html",
          "Supervisor behaviour principles: https://www.erlang.org/doc/system/sup_princ.html",
          "Joe Armstrong, Making reliable distributed systems in the presence of software errors (2003): https://erlang.org/download/armstrong_thesis_2003.pdf",
        ] },
        { kind: "p", text: "The second half is my own mapping onto durable workflows, such as the one nagare provides. That part is analogy, and I say so where it starts." },
      ],
    },
    {
      id: "supervision",
      title: "Workers, supervisors and restart rules",
      blocks: [
        { kind: "p", text: "The design principles page calls the supervision tree a process structuring model based on workers and supervisors. Workers perform the actual work. Supervisors monitor workers, and a supervisor can restart a worker if something goes wrong." },
        { kind: "p", text: "The supervisor principles page defines the restart strategies:" },
        { kind: "table", head: ["Strategy", "On a child exit"], rows: [
          ["one_for_one", "Only that child is restarted."],
          ["one_for_all", "All remaining children are terminated, then all, including the dead one, are restarted."],
          ["rest_for_one", "Children started after the dead one are terminated; the dead one and those are restarted."],
          ["simple_one_for_one", "A one_for_one where all children are dynamically added instances of the same process."],
        ] },
        { kind: "p", text: "Restart intensity bounds it: if more than MaxR restarts occur in the last MaxT seconds, the supervisor terminates all its children and then itself, with reason shutdown. The defaults on that page are intensity 1 and period 5. The page says the mechanism aims to prevent a process from repeatedly dying for the same reason. Child restart types are permanent (always restarted, the default), transient (restarted only on abnormal exit) and temporary (never restarted)." },
      ],
    },
    {
      id: "crash",
      title: "Let it crash, in Armstrong's words",
      blocks: [
        { kind: "p", text: "Section 4.3 of the thesis lists the slogans: let some other process do the error recovery, if you cannot do what you want to do, die, let it crash, do not program defensively. The reasoning starts from hardware. To survive the failure of a whole computer you need a second one, so the system must handle an error somewhere other than where it occurred. Armstrong makes a hardware failure look like a software one, an exit message from the runtime, so that there is one uniform mechanism." },
        { kind: "p", text: "Section 4.4 draws the line between exceptions and errors. Exceptions occur when the runtime does not know what to do. Errors occur when the programmer does not know what to do. If the programmer foresaw the condition, such as opening a file that may not exist, it is not an error and the code handles it. The slogan applies to the second case: when the specification is silent, do not invent behaviour, crash and let the supervisor decide." },
        { kind: "callout", tone: "note", text: "Note that the Elixir getting-started page I fetched does not use the phrase let it crash, and only says a supervisor controls if and how processes should be restarted. The phrase's source here is the thesis." },
      ],
    },
    {
      id: "genserver",
      title: "GenServer: what a message is",
      blocks: [
        { kind: "p", text: "A GenServer is described as a behaviour module for implementing the server of a client-server relation: a process that holds state and runs code. Call messages expect a reply and are synchronous, handled by handle_call/3. Cast messages do not, handled by handle_cast/2. Everything else, including messages from send/2, Process.send_after/4 and timeouts, goes to handle_info/2. init/1 builds the initial state and is the only required callback. A timeout value, default infinity, detects a lull in messages and arrives as :timeout." },
        { kind: "p", text: "It is most commonly started under a supervisor. use GenServer generates a child_spec, with :restart defaulting to :permanent, and the exit reason decides whether the supervisor restarts it." },
      ],
    },
    {
      id: "mapping",
      title: "My mapping to durable workflows (hypothesis)",
      blocks: [
        { kind: "p", text: "From here on, nothing is from the sources. It is how I read the two models side by side." },
        { kind: "table", head: ["OTP idea", "Durable workflow counterpart"], rows: [
          ["init/1 builds state from an argument", "Starting a run from its input"],
          ["handle_call, reply expected", "A synchronous query or an update that returns a result"],
          ["handle_cast, fire and forget", "A signal appended to the run's inbox"],
          ["handle_info, timers and timeouts", "A durable timer firing, or an external event"],
          ["Supervisor restarts the process", "A worker resuming the run from its journal"],
          ["MaxR in MaxT seconds", "A retry budget before a run is parked as failed"],
        ] },
        { kind: "p", text: "The difference that matters: after an OTP restart, init/1 runs again and the old in-memory state is gone, unless you persisted it yourself. A durable engine makes the opposite choice. State is rebuilt by replaying a record of what already happened, so a restart continues instead of starting over. Supervision answers who restarts it. Durability answers what it remembers." },
        { kind: "p", text: "A second hypothesis: let it crash needs the code under the supervisor to be safe to run twice. In a durable engine that means the side-effecting steps need idempotency keys, which is why a journal and an outbox show up together. I have not built an OTP system to test this analogy, so treat it as a way to ask questions of nagare, not as a result." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Notas de lectura: Elixir/OTP y workflows durables",
  summary: "Notas sobre material público, no sobre mis benchmarks: procesos, supervisores y let it crash según la documentación de Erlang y Elixir y la tesis de Armstrong, y luego mi propio mapeo de los mensajes de GenServer a ideas de workflows durables, marcado como hipótesis.",
  sections: [
    {
      id: "what-this-is",
      title: "Qué es esto",
      blocks: [
        { kind: "p", text: "Notas de lectura sobre documentación pública, consultada el 2026-11-21. No escribí ni corrí nada de Elixir para esto. Las fuentes:" },
        { kind: "list", items: [
          "GenServer docs: https://elixir.hexdocs.pm/GenServer.html",
          "OTP design principles: https://www.erlang.org/doc/system/design_principles.html",
          "Supervisor behaviour principles: https://www.erlang.org/doc/system/sup_princ.html",
          "Joe Armstrong, Making reliable distributed systems in the presence of software errors (2003): https://erlang.org/download/armstrong_thesis_2003.pdf",
        ] },
        { kind: "p", text: "La segunda mitad es mi propio mapeo a workflows durables, como el que ofrece nagare. Esa parte es analogía, y lo digo donde empieza." },
      ],
    },
    {
      id: "supervision",
      title: "Workers, supervisores y reglas de reinicio",
      blocks: [
        { kind: "p", text: "La página de design principles llama al árbol de supervisión un modelo de estructuración de procesos basado en workers y supervisores. Los workers hacen el trabajo real. Los supervisores monitorean a los workers, y un supervisor puede reiniciar un worker si algo sale mal." },
        { kind: "p", text: "La página de principios del supervisor define las estrategias de reinicio:" },
        { kind: "table", head: ["Estrategia", "Cuando un hijo termina"], rows: [
          ["one_for_one", "Solo se reinicia ese hijo."],
          ["one_for_all", "Se terminan todos los hijos restantes y luego se reinician todos, incluido el que murió."],
          ["rest_for_one", "Se terminan los hijos iniciados después del que murió; se reinician el que murió y esos."],
          ["simple_one_for_one", "Un one_for_one donde todos los hijos son instancias del mismo proceso agregadas dinámicamente."],
        ] },
        { kind: "p", text: "La intensidad de reinicio lo acota: si ocurren más de MaxR reinicios en los últimos MaxT segundos, el supervisor termina a todos sus hijos y luego a sí mismo, con razón shutdown. Los valores por defecto de esa página son intensidad 1 y período 5. La página dice que el mecanismo busca evitar que un proceso muera repetidamente por la misma razón. Los tipos de reinicio de un hijo son permanent (siempre se reinicia, el valor por defecto), transient (se reinicia solo ante una salida anormal) y temporary (nunca se reinicia)." },
      ],
    },
    {
      id: "crash",
      title: "Let it crash, en palabras de Armstrong",
      blocks: [
        { kind: "p", text: "La sección 4.3 de la tesis enumera los lemas: que otro proceso haga la recuperación de errores, si no puedes hacer lo que quieres hacer, muere, let it crash, no programes a la defensiva. El razonamiento parte del hardware. Para sobrevivir a la falla de un computador entero necesitas un segundo, así que el sistema debe manejar un error en un lugar distinto de donde ocurrió. Armstrong hace que una falla de hardware parezca una de software, un mensaje de salida del runtime, de modo que haya un único mecanismo uniforme." },
        { kind: "p", text: "La sección 4.4 traza la línea entre excepciones y errores. Las excepciones ocurren cuando el runtime no sabe qué hacer. Los errores ocurren cuando el programador no sabe qué hacer. Si el programador previó la condición, como abrir un archivo que puede no existir, no es un error y el código la maneja. El lema se aplica al segundo caso: cuando la especificación calla, no inventes comportamiento, haz crash y deja que el supervisor decida." },
        { kind: "callout", tone: "note", text: "Nota: la página de getting-started de Elixir que consulté no usa la frase let it crash, y solo dice que un supervisor controla si y cómo se deben reiniciar los procesos. La fuente de la frase aquí es la tesis." },
      ],
    },
    {
      id: "genserver",
      title: "GenServer: qué es un mensaje",
      blocks: [
        { kind: "p", text: "Un GenServer se describe como un módulo de comportamiento para implementar el servidor de una relación cliente-servidor: un proceso que guarda estado y ejecuta código. Los mensajes call esperan respuesta y son síncronos, manejados por handle_call/3. Los mensajes cast no, manejados por handle_cast/2. Todo lo demás, incluidos los mensajes de send/2, Process.send_after/4 y los timeouts, va a handle_info/2. init/1 construye el estado inicial y es el único callback obligatorio. Un valor de timeout, por defecto infinity, detecta una pausa en los mensajes y llega como :timeout." },
        { kind: "p", text: "Lo más habitual es iniciarlo bajo un supervisor. use GenServer genera un child_spec, con :restart por defecto en :permanent, y la razón de salida decide si el supervisor lo reinicia." },
      ],
    },
    {
      id: "mapping",
      title: "Mi mapeo a workflows durables (hipótesis)",
      blocks: [
        { kind: "p", text: "De aquí en adelante, nada viene de las fuentes. Es cómo leo los dos modelos lado a lado." },
        { kind: "table", head: ["Idea de OTP", "Contraparte en workflows durables"], rows: [
          ["init/1 construye el estado desde un argumento", "Iniciar una ejecución desde su entrada"],
          ["handle_call, se espera respuesta", "Una consulta síncrona o una actualización que devuelve un resultado"],
          ["handle_cast, dispara y olvida", "Una señal agregada a la bandeja de entrada de la ejecución"],
          ["handle_info, timers y timeouts", "Un timer durable que se dispara, o un evento externo"],
          ["El supervisor reinicia el proceso", "Un worker que retoma la ejecución desde su journal"],
          ["MaxR en MaxT segundos", "Un presupuesto de reintentos antes de dejar una ejecución como fallida"],
        ] },
        { kind: "p", text: "La diferencia que importa: tras un reinicio de OTP, init/1 se ejecuta de nuevo y el estado anterior en memoria se pierde, salvo que lo hayas persistido tú. Un motor durable toma la decisión opuesta. El estado se reconstruye reproduciendo un registro de lo que ya ocurrió, así que un reinicio continúa en vez de empezar de cero. La supervisión responde quién lo reinicia. La durabilidad responde qué recuerda." },
        { kind: "p", text: "Una segunda hipótesis: let it crash exige que el código bajo el supervisor sea seguro de ejecutar dos veces. En un motor durable eso significa que los pasos con efectos secundarios necesitan claves de idempotencia, por eso un journal y un outbox aparecen juntos. No construí un sistema OTP para probar esta analogía, así que tómala como una forma de hacerle preguntas a nagare, no como un resultado." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Notas de leitura: Elixir/OTP e workflows duráveis",
  summary: "Notas sobre material público, não sobre meus benchmarks: processos, supervisores e let it crash segundo a documentação do Erlang e do Elixir e a tese de Armstrong, e depois meu próprio mapeamento das mensagens do GenServer para ideias de workflows duráveis, marcado como hipótese.",
  sections: [
    {
      id: "what-this-is",
      title: "O que é isto",
      blocks: [
        { kind: "p", text: "Notas de leitura sobre documentação pública, consultada em 2026-11-21. Não escrevi nem rodei nenhum Elixir para isto. As fontes:" },
        { kind: "list", items: [
          "GenServer docs: https://elixir.hexdocs.pm/GenServer.html",
          "OTP design principles: https://www.erlang.org/doc/system/design_principles.html",
          "Supervisor behaviour principles: https://www.erlang.org/doc/system/sup_princ.html",
          "Joe Armstrong, Making reliable distributed systems in the presence of software errors (2003): https://erlang.org/download/armstrong_thesis_2003.pdf",
        ] },
        { kind: "p", text: "A segunda metade é meu próprio mapeamento para workflows duráveis, como o que o nagare oferece. Essa parte é analogia, e aviso onde ela começa." },
      ],
    },
    {
      id: "supervision",
      title: "Workers, supervisores e regras de reinício",
      blocks: [
        { kind: "p", text: "A página de design principles chama a árvore de supervisão de um modelo de estruturação de processos baseado em workers e supervisores. Os workers fazem o trabalho de fato. Os supervisores monitoram os workers, e um supervisor pode reiniciar um worker se algo der errado." },
        { kind: "p", text: "A página de princípios do supervisor define as estratégias de reinício:" },
        { kind: "table", head: ["Estratégia", "Quando um filho termina"], rows: [
          ["one_for_one", "Só esse filho é reiniciado."],
          ["one_for_all", "Todos os filhos restantes são terminados, e depois todos, incluindo o que morreu, são reiniciados."],
          ["rest_for_one", "Os filhos iniciados depois do que morreu são terminados; o que morreu e esses são reiniciados."],
          ["simple_one_for_one", "Um one_for_one em que todos os filhos são instâncias do mesmo processo adicionadas dinamicamente."],
        ] },
        { kind: "p", text: "A intensidade de reinício limita isso: se ocorrerem mais de MaxR reinícios nos últimos MaxT segundos, o supervisor termina todos os seus filhos e depois a si mesmo, com razão shutdown. Os padrões dessa página são intensidade 1 e período 5. A página diz que o mecanismo busca impedir que um processo morra repetidamente pela mesma razão. Os tipos de reinício de um filho são permanent (sempre reiniciado, o padrão), transient (reiniciado só em saída anormal) e temporary (nunca reiniciado)." },
      ],
    },
    {
      id: "crash",
      title: "Let it crash, nas palavras de Armstrong",
      blocks: [
        { kind: "p", text: "A seção 4.3 da tese lista os lemas: deixe outro processo fazer a recuperação de erros, se você não consegue fazer o que quer, morra, let it crash, não programe defensivamente. O raciocínio parte do hardware. Para sobreviver à falha de um computador inteiro você precisa de um segundo, então o sistema deve tratar um erro em outro lugar que não onde ele ocorreu. Armstrong faz uma falha de hardware parecer uma de software, uma mensagem de saída do runtime, para haver um único mecanismo uniforme." },
        { kind: "p", text: "A seção 4.4 traça a linha entre exceções e erros. Exceções ocorrem quando o runtime não sabe o que fazer. Erros ocorrem quando o programador não sabe o que fazer. Se o programador previu a condição, como abrir um arquivo que pode não existir, não é um erro e o código a trata. O lema vale para o segundo caso: quando a especificação é silente, não invente comportamento, dê crash e deixe o supervisor decidir." },
        { kind: "callout", tone: "note", text: "Nota: a página de getting-started do Elixir que consultei não usa a frase let it crash, e só diz que um supervisor controla se e como os processos devem ser reiniciados. A fonte da frase aqui é a tese." },
      ],
    },
    {
      id: "genserver",
      title: "GenServer: o que é uma mensagem",
      blocks: [
        { kind: "p", text: "Um GenServer é descrito como um módulo de comportamento para implementar o servidor de uma relação cliente-servidor: um processo que guarda estado e executa código. Mensagens call esperam resposta e são síncronas, tratadas por handle_call/3. Mensagens cast não, tratadas por handle_cast/2. Todo o resto, incluindo mensagens de send/2, Process.send_after/4 e timeouts, vai para handle_info/2. init/1 constrói o estado inicial e é o único callback obrigatório. Um valor de timeout, padrão infinity, detecta uma pausa nas mensagens e chega como :timeout." },
        { kind: "p", text: "Mais comumente ele é iniciado sob um supervisor. use GenServer gera um child_spec, com :restart padrão em :permanent, e a razão de saída decide se o supervisor o reinicia." },
      ],
    },
    {
      id: "mapping",
      title: "Meu mapeamento para workflows duráveis (hipótese)",
      blocks: [
        { kind: "p", text: "Daqui em diante, nada vem das fontes. É como leio os dois modelos lado a lado." },
        { kind: "table", head: ["Ideia do OTP", "Contrapartida em workflows duráveis"], rows: [
          ["init/1 constrói o estado a partir de um argumento", "Iniciar uma execução a partir da sua entrada"],
          ["handle_call, resposta esperada", "Uma consulta síncrona ou uma atualização que devolve um resultado"],
          ["handle_cast, dispara e esquece", "Um sinal adicionado à caixa de entrada da execução"],
          ["handle_info, timers e timeouts", "Um timer durável disparando, ou um evento externo"],
          ["O supervisor reinicia o processo", "Um worker retomando a execução a partir do seu journal"],
          ["MaxR em MaxT segundos", "Um orçamento de tentativas antes de uma execução ser estacionada como falha"],
        ] },
        { kind: "p", text: "A diferença que importa: depois de um reinício do OTP, init/1 roda de novo e o estado antigo em memória se perde, a menos que você mesmo o tenha persistido. Um motor durável faz a escolha oposta. O estado é reconstruído reproduzindo um registro do que já aconteceu, então um reinício continua em vez de recomeçar. A supervisão responde quem reinicia. A durabilidade responde o que ele lembra." },
        { kind: "p", text: "Uma segunda hipótese: let it crash exige que o código sob o supervisor seja seguro para rodar duas vezes. Em um motor durável isso significa que os passos com efeitos colaterais precisam de chaves de idempotência, e por isso um journal e um outbox aparecem juntos. Não construí um sistema OTP para testar essa analogia, então trate-a como uma forma de fazer perguntas ao nagare, não como um resultado." },
      ],
    },
  ],
};
