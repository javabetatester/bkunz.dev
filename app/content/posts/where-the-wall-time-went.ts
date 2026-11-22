import type { Post } from "./types";

const post: Post = {
  slug: "where-the-wall-time-went",
  category: "studies",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "Where the wall time went",
  summary: "hakoniwa was meant to run browser tests in half the time of plain Playwright. It used 37 to 39% less CPU and the same wall time. A phase profile shows why, and what the follow-up decisions changed.",
  tags: ["hakoniwa", "benchmark", "playwright", "negative-result"],
  project: "versatile-sh",
  sections: [
    {
      id: "target",
      title: "The target and the setup",
      blocks: [
        { kind: "p", text: "ADR-0011 set a goal for hakoniwa's front-end test path: at least 50% less wall time and at least 50% less CPU-seconds than plain Playwright with default settings, with the same verdicts. Until measured, the ADR calls every gain a hypothesis." },
        { kind: "p", text: "The benchmark app is a small React SPA with a Bun API, a second-origin widget and seeded faults. The suite has 17 specs. Each configuration ran in a container limited to 4 CPUs and 6 GB, with the Playwright v1.65.0 image. The machine is an AMD Ryzen 7 5700X with 16 threads and 47 GiB of RAM, Linux 7.2.5, Docker 29.7.2. Healthy runs are the median of 3. The fault run is a single repetition." },
        { kind: "list", items: [
          "A: plain Playwright, 8 workers on 4 CPUs.",
          "B: the engine on Chromium with every shortcut off, 4 slots, batch 5.",
          "B+: B with the bench-only admitted shortcuts: session store, asset cache, CDP blocking, motion freezing.",
          "C: B+ with Lightpanda admitted.",
        ] },
      ],
    },
    {
      id: "result",
      title: "Result",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"], rows: [
          ["A", "5.3", "-", "16.4", "-", "1687"],
          ["B", "5.1", "-4%", "10.4", "-37%", "817"],
          ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
          ["C", "5.1", "-5%", "10.1", "-39%", "627"],
        ] },
        { kind: "p", text: "Verdicts matched A in every repetition. CPU fell by 37 to 39% and memory by about half. Wall time stayed within noise. The shortcuts cut response bytes from 3.9 to 1.0 MB, so the CDP blocking works, and they changed neither time nor CPU on this suite. The target was not met." },
      ],
    },
    {
      id: "profile",
      title: "Where the time goes",
      blocks: [
        { kind: "p", text: "A traced run of B, one repetition, shows the first step reported about 1.8 s after the lease loop started. The pieces the trace attributes: listing the test ids of the group takes about 0.26 s, the load inside the test run another 0.24 s, and forking Playwright workers and launching their browsers about 0.3 s. The 17 specs then run for about 2.5 to 3 s on four workers." },
        { kind: "p", text: "So roughly a third of a 5 s suite is a fixed start that the engine path pays and plain Playwright pays less of, because it forks workers directly. A suite this short cannot amortise it. The engine saves CPU by running one browser per worker, 4 workers against A's 8, and without a per-slot browser server or test server. Saving CPU does not shorten a start-up chain." },
      ],
    },
    {
      id: "fault",
      title: "Under a seeded fault it was worse",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A"], rows: [
          ["A", "9.3", "-", "17.1", "-"],
          ["B", "15.0", "+61%", "15.5", "-9%"],
          ["B+", "15.2", "+63%", "15.0", "-12%"],
          ["C", "21.5", "+130%", "18.4", "+8%"],
        ] },
        { kind: "p", text: "The fault was a search that ignores its query, failing 3 of 17 specs, one repetition per configuration. The cause is a design choice in the execution path. Each failing spec was run again with its trace on, so a failure cost two attempts, each waiting out the 5 s expect timeout, plus a new worker and browser after each failure. C was slower still: Lightpanda attempts failed first, fell back to Chromium and ran again." },
      ],
    },
    {
      id: "after",
      title: "What the negative result changed",
      blocks: [
        { kind: "p", text: "The result fed directly into ADR-0019, written the same day. It removes the rerun on failure: the first attempt keeps a lean trace and the failing run finishes, so flakiness is judged across runs and not inside one. The ADR lists keeping the rerun as a rejected option, because it made failing suites 61% slower than a baseline that does not rerun." },
        { kind: "p", text: "It also drops the separate listing pass, keeps one spare runner started and idle, and sweeps slot counts of 4, 6 and 8. All three savings are labelled hypotheses in the ADR until a heavier benchmark shows them. The only follow-up measurement in the records is on 60 specs, 2 repetitions: the lean trace cost 64.3 and 70.0 CPU-s against 68.2 and 71.0 with no trace, inside the run-to-run noise." },
        { kind: "callout", tone: "warn", text: "I have no record of the heavier benchmark meeting the 50% target. The claim today is lower CPU and memory at equal verdicts, not faster wall time." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Adónde se fue el tiempo de pared",
  summary: "hakoniwa debía correr los tests de navegador en la mitad del tiempo de Playwright simple. Usó entre 37 y 39% menos CPU y el mismo tiempo de pared. Un perfil por fases muestra por qué, y qué cambiaron las decisiones posteriores.",
  sections: [
    {
      id: "target",
      title: "La meta y la configuración",
      blocks: [
        { kind: "p", text: "El ADR-0011 fijó una meta para el camino de tests de front-end de hakoniwa: al menos 50% menos de tiempo de pared y al menos 50% menos de CPU-segundos que Playwright simple con la configuración por defecto, con los mismos veredictos. Mientras no se mida, el ADR llama hipótesis a toda ganancia." },
        { kind: "p", text: "La app del benchmark es una SPA pequeña en React con una API en Bun, un widget de segundo origen y fallas sembradas. La suite tiene 17 specs. Cada configuración corrió en un contenedor limitado a 4 CPUs y 6 GB, con la imagen de Playwright v1.65.0. La máquina es un AMD Ryzen 7 5700X con 16 threads y 47 GiB de RAM, Linux 7.2.5, Docker 29.7.2. Las corridas sanas son la mediana de 3. La corrida con falla es una sola repetición." },
        { kind: "list", items: [
          "A: Playwright simple, 8 workers en 4 CPUs.",
          "B: el motor sobre Chromium con todos los atajos apagados, 4 slots, batch 5.",
          "B+: B con los atajos admitidos solo para el bench: almacén de sesión, caché de assets, bloqueo por CDP, congelado de movimiento.",
          "C: B+ con Lightpanda admitido.",
        ] },
      ],
    },
    {
      id: "result",
      title: "Resultado",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"], rows: [
          ["A", "5.3", "-", "16.4", "-", "1687"],
          ["B", "5.1", "-4%", "10.4", "-37%", "817"],
          ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
          ["C", "5.1", "-5%", "10.1", "-39%", "627"],
        ] },
        { kind: "p", text: "Los veredictos coincidieron con A en cada repetición. El CPU bajó 37 a 39% y la memoria cerca de la mitad. El tiempo de pared se mantuvo dentro del ruido. Los atajos redujeron los bytes de respuesta de 3.9 a 1.0 MB, así que el bloqueo por CDP funciona, y no cambiaron ni el tiempo ni el CPU en esta suite. La meta no se cumplió." },
      ],
    },
    {
      id: "profile",
      title: "Adónde va el tiempo",
      blocks: [
        { kind: "p", text: "Una corrida de B con traza, una repetición, muestra el primer paso reportado unos 1.8 s después de que empezó el loop de leases. Las piezas que la traza atribuye: listar los ids de tests del grupo toma unos 0.26 s, la carga dentro de la corrida de tests otros 0.24 s, y bifurcar los workers de Playwright y lanzar sus navegadores unos 0.3 s. Los 17 specs corren luego unos 2.5 a 3 s en cuatro workers." },
        { kind: "p", text: "Así que cerca de un tercio de una suite de 5 s es un arranque fijo que el camino del motor paga y Playwright simple paga menos, porque bifurca los workers directamente. Una suite tan corta no puede amortizarlo. El motor ahorra CPU al correr un navegador por worker, 4 workers contra los 8 de A, y sin un servidor de navegador ni un servidor de tests por slot. Ahorrar CPU no acorta una cadena de arranque." },
      ],
    },
    {
      id: "fault",
      title: "Bajo una falla sembrada fue peor",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A"], rows: [
          ["A", "9.3", "-", "17.1", "-"],
          ["B", "15.0", "+61%", "15.5", "-9%"],
          ["B+", "15.2", "+63%", "15.0", "-12%"],
          ["C", "21.5", "+130%", "18.4", "+8%"],
        ] },
        { kind: "p", text: "La falla era una búsqueda que ignora su consulta, con 3 de 17 specs fallando, una repetición por configuración. La causa es una decisión de diseño en el camino de ejecución. Cada spec que fallaba se volvía a ejecutar con su traza activada, así que una falla costaba dos intentos, cada uno esperando el timeout de expect de 5 s, más un worker y un navegador nuevos tras cada falla. C fue aún más lento: los intentos con Lightpanda fallaban primero, caían a Chromium y volvían a correr." },
      ],
    },
    {
      id: "after",
      title: "Qué cambió el resultado negativo",
      blocks: [
        { kind: "p", text: "El resultado alimentó directamente al ADR-0019, escrito el mismo día. Elimina la reejecución ante una falla: el primer intento conserva una traza liviana y la corrida que falla termina, así que la inestabilidad se juzga entre corridas y no dentro de una. El ADR lista conservar la reejecución como una opción rechazada, porque volvía 61% más lentas las suites que fallan frente a una línea base que no reejecuta." },
        { kind: "p", text: "También elimina la pasada de listado aparte, mantiene un runner de reserva iniciado y ocioso, y barre cantidades de slots de 4, 6 y 8. Los tres ahorros están marcados como hipótesis en el ADR hasta que un benchmark más pesado los muestre. La única medición posterior en los registros es sobre 60 specs, 2 repeticiones: la traza liviana costó 64.3 y 70.0 CPU-s frente a 68.2 y 71.0 sin traza, dentro del ruido entre corridas." },
        { kind: "callout", tone: "warn", text: "No tengo registro de que el benchmark más pesado alcance la meta de 50%. La afirmación hoy es menos CPU y memoria con veredictos iguales, no un tiempo de pared más rápido." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Para onde foi o tempo de parede",
  summary: "O hakoniwa deveria rodar testes de navegador na metade do tempo do Playwright puro. Ele usou de 37 a 39% menos CPU e o mesmo tempo de parede. Um perfil por fases mostra o porquê, e o que as decisões seguintes mudaram.",
  sections: [
    {
      id: "target",
      title: "A meta e a configuração",
      blocks: [
        { kind: "p", text: "O ADR-0011 definiu uma meta para o caminho de testes de front-end do hakoniwa: pelo menos 50% menos tempo de parede e pelo menos 50% menos CPU-segundos que o Playwright puro com a configuração padrão, com os mesmos vereditos. Até ser medido, o ADR chama todo ganho de hipótese." },
        { kind: "p", text: "O app do benchmark é uma SPA pequena em React com uma API em Bun, um widget de segunda origem e falhas semeadas. A suite tem 17 specs. Cada configuração rodou em um contêiner limitado a 4 CPUs e 6 GB, com a imagem do Playwright v1.65.0. A máquina é um AMD Ryzen 7 5700X com 16 threads e 47 GiB de RAM, Linux 7.2.5, Docker 29.7.2. As execuções saudáveis são a mediana de 3. A execução com falha é uma única repetição." },
        { kind: "list", items: [
          "A: Playwright puro, 8 workers em 4 CPUs.",
          "B: o motor sobre Chromium com todos os atalhos desligados, 4 slots, batch 5.",
          "B+: B com os atalhos admitidos só para o bench: armazém de sessão, cache de assets, bloqueio por CDP, congelamento de movimento.",
          "C: B+ com o Lightpanda admitido.",
        ] },
      ],
    },
    {
      id: "result",
      title: "Resultado",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"], rows: [
          ["A", "5.3", "-", "16.4", "-", "1687"],
          ["B", "5.1", "-4%", "10.4", "-37%", "817"],
          ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
          ["C", "5.1", "-5%", "10.1", "-39%", "627"],
        ] },
        { kind: "p", text: "Os vereditos bateram com os de A em toda repetição. A CPU caiu de 37 a 39% e a memória cerca de metade. O tempo de parede ficou dentro do ruído. Os atalhos reduziram os bytes de resposta de 3.9 para 1.0 MB, então o bloqueio por CDP funciona, e não mudaram nem o tempo nem a CPU nesta suite. A meta não foi atingida." },
      ],
    },
    {
      id: "profile",
      title: "Para onde vai o tempo",
      blocks: [
        { kind: "p", text: "Uma execução de B com trace, uma repetição, mostra o primeiro passo reportado cerca de 1.8 s depois do início do loop de leases. As peças que o trace atribui: listar os ids de testes do grupo leva cerca de 0.26 s, o carregamento dentro da execução dos testes mais 0.24 s, e bifurcar os workers do Playwright e abrir seus navegadores cerca de 0.3 s. Os 17 specs então rodam por cerca de 2.5 a 3 s em quatro workers." },
        { kind: "p", text: "Ou seja, mais ou menos um terço de uma suite de 5 s é uma largada fixa que o caminho do motor paga e o Playwright puro paga menos, porque bifurca os workers diretamente. Uma suite tão curta não consegue amortizá-la. O motor economiza CPU rodando um navegador por worker, 4 workers contra os 8 de A, e sem um servidor de navegador nem um servidor de testes por slot. Economizar CPU não encurta uma cadeia de inicialização." },
      ],
    },
    {
      id: "fault",
      title: "Sob uma falha semeada foi pior",
      blocks: [
        { kind: "table", head: ["Config", "Wall s", "vs A", "CPU-s", "vs A"], rows: [
          ["A", "9.3", "-", "17.1", "-"],
          ["B", "15.0", "+61%", "15.5", "-9%"],
          ["B+", "15.2", "+63%", "15.0", "-12%"],
          ["C", "21.5", "+130%", "18.4", "+8%"],
        ] },
        { kind: "p", text: "A falha era uma busca que ignora a consulta, com 3 de 17 specs falhando, uma repetição por configuração. A causa é uma escolha de design no caminho de execução. Cada spec que falhava era executado de novo com o trace ligado, então uma falha custava duas tentativas, cada uma esperando o timeout de expect de 5 s, mais um worker e um navegador novos após cada falha. O C foi ainda mais lento: as tentativas com Lightpanda falhavam primeiro, recorriam ao Chromium e rodavam de novo." },
      ],
    },
    {
      id: "after",
      title: "O que o resultado negativo mudou",
      blocks: [
        { kind: "p", text: "O resultado alimentou diretamente o ADR-0019, escrito no mesmo dia. Ele remove a reexecução em caso de falha: a primeira tentativa mantém um trace enxuto e a execução que falha termina, então a instabilidade é julgada entre execuções e não dentro de uma. O ADR lista manter a reexecução como uma opção rejeitada, porque tornava as suites com falha 61% mais lentas do que uma linha de base que não reexecuta." },
        { kind: "p", text: "Ele também elimina a passada de listagem separada, mantém um runner reserva iniciado e ocioso, e varre contagens de slots de 4, 6 e 8. As três economias estão rotuladas como hipóteses no ADR até um benchmark mais pesado mostrá-las. A única medição posterior nos registros é em 60 specs, 2 repetições: o trace enxuto custou 64.3 e 70.0 CPU-s contra 68.2 e 71.0 sem trace, dentro do ruído entre execuções." },
        { kind: "callout", tone: "warn", text: "Não tenho registro de o benchmark mais pesado atingir a meta de 50%. A afirmação hoje é menos CPU e memória com vereditos iguais, não um tempo de parede mais rápido." },
      ],
    },
  ],
};
