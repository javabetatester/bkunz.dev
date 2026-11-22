import type { Post } from "./types";

const post: Post = {
  slug: "testing-with-a-frozen-clock",
  category: "studies",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "Testing with a frozen clock",
  summary: "Controlled worlds for tests in hakoniwa: a clock you can jump, a database you can fork, faults you can seed. What the spikes proved, and the benchmark where wall time did not improve.",
  tags: ["testing", "clock", "postgres", "benchmark"],
  project: "versatile-sh",
  sections: [
    {
      id: "idea",
      title: "The idea",
      blocks: [
        { kind: "p", text: "Browser tests flake for reasons that are not about the code under test: real time passes, shared state leaks, an external service answers late. hakoniwa, the test engine, runs a test inside a controlled world instead: the clock is a value you set, the database is a fork of a snapshot, and the services around the app are doubles that you can make misbehave." },
        { kind: "p", text: "This post is about two things I measured. One is whether such a world is sound when you jump time hard. The other is whether the engine makes the suite faster. The first mostly worked. The second did not, and the numbers are below." },
      ],
    },
    {
      id: "clock",
      title: "A clock you can jump",
      blocks: [
        { kind: "p", text: "One Advance call sets three things at once: the doubles (the payment service), a seam in the app's own code (a clock interface), and a libfaketime offset file read by Postgres 18. The spike S8 jumped +1 h, +1 d and +30 d in sequence, each in a container limited to 2 CPUs and 4 GB." },
        {
          kind: "table",
          head: ["Jump", "Advance", "Pending order after the jump", "Fresh order settles"],
          rows: [
            ["+1 h", "158 ms", "paid at 1 ms", "2.29 s"],
            ["+1 d", "154 ms", "paid at 1 ms", "2.02 s"],
            ["+30 d", "155 ms", "paid at 2 ms", "2.02 s"],
          ],
        },
        { kind: "list", items: [
          "now(), clock_timestamp() and statement_timestamp() followed every jump, on a persistent connection and a fresh one.",
          "Autovacuum ran within 0.5 to 1 s of churn after each jump. Each jump caused one immediate checkpoint, then the normal 30 s cadence resumed.",
          "The Postgres log held only the two start-up lines. No ERROR, WARNING or PANIC.",
        ] },
        { kind: "callout", tone: "note", text: "Caveats from the same spike: libfaketime applies to a whole server process tree, so a world needs its own Postgres rather than a fork on a shared one. When the offset file is removed at teardown the server clock moves back by the jumped amount, so the server must die with its world. pg_cron was not tested." },
      ],
    },
    {
      id: "quiet",
      title: "Jumping while traffic runs",
      blocks: [
        { kind: "p", text: "A jump in the middle of a request is the dangerous case. The world only moves the clock when it judges the app quiet, by sampling in-flight work twice. Spike S10 measured how often that judgement was wrong: scripted shoppers placed, paid and showed orders over HTTP while a jumper issued 100 jumps of +10 s with 50 to 200 ms pauses." },
        { kind: "table", head: ["Load", "Requests", "Accepted / refused", "In flight at the jump", "Webhook failures"], rows: [
          ["3 shoppers, 50 to 150 ms think", "3006", "100 / 0", "0", "0 of 2997"],
          ["4 shoppers, 20 to 60 ms think", "14450", "100 / 0", "0", "0 of 14383"],
        ] },
        { kind: "p", text: "Over 400 accepted jumps, one was a probable false quiet (0.25%). On the final code it was 0 of 200, with a 95% upper bound of 1.5%. Under saturating load the probe refused: 106 of 106 jumps returned world not quiet after 10 s, and none jumped silently. The residual race is the gap between the last sample and the write of the new time." },
        { kind: "p", text: "Measuring also found an engine bug. Under saturating load the world pinned a CPU and took over 18 minutes to tear down after 221k requests. A goroutine dump showed the payment double rescanning every intent on each delivery. Settlements now wait in a FIFO ordered by time, and the same window served 55% more requests with a 0.1 s teardown." },
      ],
    },
    {
      id: "flake",
      title: "How many controls you need",
      blocks: [
        { kind: "p", text: "A reproduction verdict compares treatment runs against control runs of the unmodified world. Spike S11 ran 149 counted controls on the checkout app and saw 0 failures. One further run was not executable: the app lost a port race, which costs a run and not a verdict." },
        { kind: "p", text: "With zero failures the one-sided 95% bound on the control flake rate is 1 - 0.05^(1/N). It is 45.1% at N = 5, the default then, 25.9% at N = 10 and 5.82% at N = 50. Getting under 5% needs N = 59, which the maximum of 50 forbids. The recommendation was to raise the default to 10 and the maximum to 60." },
      ],
    },
    {
      id: "negative",
      title: "The honest negative: wall time",
      blocks: [
        { kind: "p", text: "The target in ADR-0011 was at least 50% less wall time and CPU-seconds than plain Playwright (config A), with the same verdicts. The benchmark ran a 17-spec suite in containers limited to 4 CPUs and 6 GB, median of 3. B is the engine on Chromium with every shortcut off, B+ adds bench-only shortcuts, and C adds Lightpanda." },
        {
          kind: "table",
          head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"],
          rows: [
            ["A", "5.3", "-", "16.4", "-", "1687"],
            ["B", "5.1", "-4%", "10.4", "-37%", "817"],
            ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
            ["C", "5.1", "-5%", "10.1", "-39%", "627"],
          ],
        },
        { kind: "p", text: "Verdicts matched A in every repetition. CPU fell by 37 to 39% and memory by about half, but wall time stayed within noise. The target was not met." },
        { kind: "p", text: "A traced run explains why. The engine pays about 1.8 s before the first step: roughly 0.26 s listing test ids, 0.24 s loading, and about 0.3 s forking workers and launching browsers. The 17 specs then take 2.5 to 3 s on four workers. A 5 s suite cannot amortise a fixed start of that size." },
        { kind: "p", text: "It was worse under a seeded fault (a search that ignores its query, 3 of 17 specs failing, a single repetition): wall time rose 61% for B and 130% for C. Each failing spec runs again with a trace, so a failure costs two attempts that each wait out the 5 s expect timeout." },
        { kind: "callout", tone: "warn", text: "So the engine saved CPU and memory, not time, on this suite. What would still move wall time, by the benchmark's own notes: a runner already warm when the first run arrives, no separate listing pass, and a larger suite over which the start is amortised. None of these was built or measured." },
      ],
    },
    {
      id: "takeaway",
      title: "What I take from it",
      blocks: [
        { kind: "p", text: "A controlled world earns its place on determinism: a clock that jumps cleanly, controls that do not flake, a verdict with a stated bound. It did not earn a faster suite, and I would rather say that than quote the CPU line alone. The next measurement I want is a suite large enough to hide the 1.8 s start." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Testear con un reloj congelado",
  summary: "Mundos controlados para tests en hakoniwa: un reloj que puedes saltar, una base de datos que puedes bifurcar, fallas que puedes sembrar. Qué probaron los spikes y el benchmark donde el tiempo de pared no mejoró.",
  sections: [
    {
      id: "idea",
      title: "La idea",
      blocks: [
        { kind: "p", text: "Los tests de navegador son flaky por razones que no tienen que ver con el código bajo prueba: pasa el tiempo real, se filtra estado compartido, un servicio externo responde tarde. hakoniwa, el motor de tests, ejecuta en cambio un test dentro de un mundo controlado: el reloj es un valor que tú fijas, la base de datos es un fork de un snapshot y los servicios alrededor de la app son dobles a los que puedes hacer portarse mal." },
        { kind: "p", text: "Este post trata de dos cosas que medí. Una es si un mundo así es sólido cuando saltas el tiempo con fuerza. La otra es si el motor hace más rápida la suite. Lo primero funcionó en su mayor parte. Lo segundo no, y los números están abajo." },
      ],
    },
    {
      id: "clock",
      title: "Un reloj que puedes saltar",
      blocks: [
        { kind: "p", text: "Una llamada Advance fija tres cosas a la vez: los dobles (el servicio de pagos), un seam en el código propio de la app (una interfaz de reloj) y un archivo de offset de libfaketime que lee Postgres 18. El spike S8 saltó +1 h, +1 d y +30 d en secuencia, cada uno en un contenedor limitado a 2 CPUs y 4 GB." },
        {
          kind: "table",
          head: ["Salto", "Advance", "Orden pendiente tras el salto", "La orden nueva se resuelve"],
          rows: [
            ["+1 h", "158 ms", "paid at 1 ms", "2.29 s"],
            ["+1 d", "154 ms", "paid at 1 ms", "2.02 s"],
            ["+30 d", "155 ms", "paid at 2 ms", "2.02 s"],
          ],
        },
        { kind: "list", items: [
          "now(), clock_timestamp() y statement_timestamp() siguieron cada salto, en una conexión persistente y en una nueva.",
          "Autovacuum corrió dentro de 0.5 a 1 s del churn tras cada salto. Cada salto causó un checkpoint inmediato y luego se retomó la cadencia normal de 30 s.",
          "El log de Postgres contenía solo las dos líneas de arranque. Ningún ERROR, WARNING ni PANIC.",
        ] },
        { kind: "callout", tone: "note", text: "Salvedades del mismo spike: libfaketime se aplica a todo el árbol de procesos de un servidor, así que un mundo necesita su propio Postgres y no un fork en uno compartido. Cuando el archivo de offset se elimina al desmontar, el reloj del servidor retrocede la cantidad saltada, así que el servidor debe morir con su mundo. pg_cron no se probó." },
      ],
    },
    {
      id: "quiet",
      title: "Saltar mientras corre tráfico",
      blocks: [
        { kind: "p", text: "Un salto en medio de una solicitud es el caso peligroso. El mundo solo mueve el reloj cuando juzga que la app está quieta, muestreando el trabajo en curso dos veces. El spike S10 midió con qué frecuencia ese juicio era erróneo: compradores guionados hacían pedidos, pagaban y mostraban órdenes por HTTP mientras un saltador emitía 100 saltos de +10 s con pausas de 50 a 200 ms." },
        { kind: "table", head: ["Carga", "Solicitudes", "Aceptados / rechazados", "En curso en el salto", "Fallas de webhook"], rows: [
          ["3 compradores, 50 a 150 ms de pausa", "3006", "100 / 0", "0", "0 of 2997"],
          ["4 compradores, 20 a 60 ms de pausa", "14450", "100 / 0", "0", "0 of 14383"],
        ] },
        { kind: "p", text: "En más de 400 saltos aceptados, uno fue una probable falsa quietud (0.25%). Con el código final fueron 0 de 200, con un límite superior del 95% de 1.5%. Bajo carga de saturación la sonda rechazó: 106 de 106 saltos devolvieron world not quiet after 10 s, y ninguno saltó en silencio. La carrera residual es el hueco entre la última muestra y la escritura de la hora nueva." },
        { kind: "p", text: "Medir también encontró un bug del motor. Bajo carga de saturación el mundo dejaba un CPU al máximo y tardó más de 18 minutos en desmontarse tras 221k solicitudes. Un volcado de goroutines mostró al doble de pagos reescaneando cada intent en cada entrega. Ahora las liquidaciones esperan en una FIFO ordenada por tiempo, y la misma ventana atendió 55% más solicitudes con un desmontaje de 0.1 s." },
      ],
    },
    {
      id: "flake",
      title: "Cuántos controles hacen falta",
      blocks: [
        { kind: "p", text: "Un veredicto de reproducción compara corridas de tratamiento contra corridas de control del mundo sin modificar. El spike S11 corrió 149 controles contados en la app de checkout y vio 0 fallas. Una corrida adicional no fue ejecutable: la app perdió una carrera por un puerto, lo que cuesta una corrida y no un veredicto." },
        { kind: "p", text: "Con cero fallas, el límite unilateral del 95% sobre la tasa de flake de control es 1 - 0.05^(1/N). Es 45.1% con N = 5, el valor por defecto entonces, 25.9% con N = 10 y 5.82% con N = 50. Bajar de 5% requiere N = 59, que el máximo de 50 prohíbe. La recomendación fue subir el valor por defecto a 10 y el máximo a 60." },
      ],
    },
    {
      id: "negative",
      title: "El negativo honesto: tiempo de pared",
      blocks: [
        { kind: "p", text: "La meta del ADR-0011 era al menos 50% menos de tiempo de pared y de CPU-segundos que Playwright simple (config A), con los mismos veredictos. El benchmark corrió una suite de 17 specs en contenedores limitados a 4 CPUs y 6 GB, mediana de 3. B es el motor sobre Chromium con todos los atajos apagados, B+ agrega atajos solo de bench y C agrega Lightpanda." },
        {
          kind: "table",
          head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"],
          rows: [
            ["A", "5.3", "-", "16.4", "-", "1687"],
            ["B", "5.1", "-4%", "10.4", "-37%", "817"],
            ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
            ["C", "5.1", "-5%", "10.1", "-39%", "627"],
          ],
        },
        { kind: "p", text: "Los veredictos coincidieron con A en cada repetición. El CPU bajó 37 a 39% y la memoria cerca de la mitad, pero el tiempo de pared se mantuvo dentro del ruido. La meta no se cumplió." },
        { kind: "p", text: "Una corrida con traza explica por qué. El motor paga cerca de 1.8 s antes del primer paso: unos 0.26 s listando ids de tests, 0.24 s cargando y cerca de 0.3 s bifurcando workers y lanzando navegadores. Los 17 specs toman luego de 2.5 a 3 s con cuatro workers. Una suite de 5 s no puede amortizar un arranque fijo de ese tamaño." },
        { kind: "p", text: "Fue peor bajo una falla sembrada (una búsqueda que ignora su consulta, 3 de 17 specs fallando, una sola repetición): el tiempo de pared subió 61% para B y 130% para C. Cada spec que falla se ejecuta de nuevo con una traza, así que una falla cuesta dos intentos que esperan cada uno el timeout de expect de 5 s." },
        { kind: "callout", tone: "warn", text: "Así que el motor ahorró CPU y memoria, no tiempo, en esta suite. Lo que aún movería el tiempo de pared, según las propias notas del benchmark: un runner ya caliente cuando llega la primera corrida, ninguna pasada de listado aparte y una suite más grande sobre la cual se amortice el arranque. Ninguna de esas cosas se construyó ni se midió." },
      ],
    },
    {
      id: "takeaway",
      title: "Qué me llevo",
      blocks: [
        { kind: "p", text: "Un mundo controlado se gana su lugar en determinismo: un reloj que salta limpio, controles que no son flaky, un veredicto con un límite declarado. No se ganó una suite más rápida, y prefiero decirlo antes que citar solo la línea de CPU. La próxima medición que quiero es una suite lo bastante grande como para esconder el arranque de 1.8 s." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Testando com um relógio congelado",
  summary: "Mundos controlados para testes no hakoniwa: um relógio que você pode pular, um banco de dados que você pode bifurcar, falhas que você pode semear. O que os spikes provaram e o benchmark em que o tempo de parede não melhorou.",
  sections: [
    {
      id: "idea",
      title: "A ideia",
      blocks: [
        { kind: "p", text: "Testes de navegador ficam flaky por motivos que não têm a ver com o código sob teste: o tempo real passa, estado compartilhado vaza, um serviço externo responde tarde. O hakoniwa, o motor de testes, executa um teste dentro de um mundo controlado: o relógio é um valor que você define, o banco de dados é um fork de um snapshot e os serviços ao redor do app são dublês que você pode fazer se comportarem mal." },
        { kind: "p", text: "Este post trata de duas coisas que medi. Uma é se um mundo desses é sólido quando você pula o tempo com força. A outra é se o motor deixa a suite mais rápida. A primeira funcionou na maior parte. A segunda não, e os números estão abaixo." },
      ],
    },
    {
      id: "clock",
      title: "Um relógio que você pode pular",
      blocks: [
        { kind: "p", text: "Uma chamada Advance define três coisas de uma vez: os dublês (o serviço de pagamento), um seam no código do próprio app (uma interface de relógio) e um arquivo de offset do libfaketime lido pelo Postgres 18. O spike S8 pulou +1 h, +1 d e +30 d em sequência, cada um em um contêiner limitado a 2 CPUs e 4 GB." },
        {
          kind: "table",
          head: ["Salto", "Advance", "Pedido pendente após o salto", "Pedido novo se resolve"],
          rows: [
            ["+1 h", "158 ms", "paid at 1 ms", "2.29 s"],
            ["+1 d", "154 ms", "paid at 1 ms", "2.02 s"],
            ["+30 d", "155 ms", "paid at 2 ms", "2.02 s"],
          ],
        },
        { kind: "list", items: [
          "now(), clock_timestamp() e statement_timestamp() acompanharam cada salto, em uma conexão persistente e em uma nova.",
          "O autovacuum rodou em 0.5 a 1 s do churn após cada salto. Cada salto causou um checkpoint imediato, depois a cadência normal de 30 s voltou.",
          "O log do Postgres tinha só as duas linhas de inicialização. Nenhum ERROR, WARNING ou PANIC.",
        ] },
        { kind: "callout", tone: "note", text: "Ressalvas do mesmo spike: o libfaketime se aplica a toda a árvore de processos de um servidor, então um mundo precisa do seu próprio Postgres e não de um fork em um compartilhado. Quando o arquivo de offset é removido no teardown, o relógio do servidor volta o tanto que foi pulado, então o servidor precisa morrer com o seu mundo. O pg_cron não foi testado." },
      ],
    },
    {
      id: "quiet",
      title: "Pular com tráfego rodando",
      blocks: [
        { kind: "p", text: "Um salto no meio de uma requisição é o caso perigoso. O mundo só move o relógio quando julga o app quieto, amostrando o trabalho em andamento duas vezes. O spike S10 mediu com que frequência esse julgamento errava: compradores roteirizados faziam pedidos, pagavam e mostravam pedidos por HTTP enquanto um saltador emitia 100 saltos de +10 s com pausas de 50 a 200 ms." },
        { kind: "table", head: ["Carga", "Requisições", "Aceitos / recusados", "Em andamento no salto", "Falhas de webhook"], rows: [
          ["3 compradores, 50 a 150 ms de pausa", "3006", "100 / 0", "0", "0 of 2997"],
          ["4 compradores, 20 a 60 ms de pausa", "14450", "100 / 0", "0", "0 of 14383"],
        ] },
        { kind: "p", text: "Em mais de 400 saltos aceitos, um foi uma provável falsa quietude (0.25%). No código final foram 0 de 200, com limite superior de 95% de 1.5%. Sob carga de saturação a sonda recusou: 106 de 106 saltos devolveram world not quiet after 10 s, e nenhum pulou em silêncio. A corrida residual é o intervalo entre a última amostra e a gravação do novo horário." },
        { kind: "p", text: "Medir também achou um bug do motor. Sob carga de saturação o mundo prendia uma CPU e levou mais de 18 minutos para desmontar após 221k requisições. Um dump de goroutines mostrou o dublê de pagamento reescaneando cada intent a cada entrega. Agora as liquidações esperam em uma FIFO ordenada por tempo, e a mesma janela atendeu 55% mais requisições com um teardown de 0.1 s." },
      ],
    },
    {
      id: "flake",
      title: "De quantos controles você precisa",
      blocks: [
        { kind: "p", text: "Um veredito de reprodução compara execuções de tratamento com execuções de controle do mundo sem modificação. O spike S11 rodou 149 controles contados no app de checkout e viu 0 falhas. Uma execução adicional não foi executável: o app perdeu uma corrida por porta, o que custa uma execução e não um veredito." },
        { kind: "p", text: "Com zero falhas, o limite unilateral de 95% sobre a taxa de flake do controle é 1 - 0.05^(1/N). É 45.1% com N = 5, o padrão na época, 25.9% com N = 10 e 5.82% com N = 50. Ficar abaixo de 5% exige N = 59, o que o máximo de 50 proíbe. A recomendação foi subir o padrão para 10 e o máximo para 60." },
      ],
    },
    {
      id: "negative",
      title: "O negativo honesto: tempo de parede",
      blocks: [
        { kind: "p", text: "A meta do ADR-0011 era pelo menos 50% menos tempo de parede e CPU-segundos que o Playwright puro (config A), com os mesmos vereditos. O benchmark rodou uma suite de 17 specs em contêineres limitados a 4 CPUs e 6 GB, mediana de 3. B é o motor sobre Chromium com todos os atalhos desligados, B+ acrescenta atalhos só de bench e C acrescenta o Lightpanda." },
        {
          kind: "table",
          head: ["Config", "Wall s", "vs A", "CPU-s", "vs A", "Peak MB"],
          rows: [
            ["A", "5.3", "-", "16.4", "-", "1687"],
            ["B", "5.1", "-4%", "10.4", "-37%", "817"],
            ["B+", "5.2", "-3%", "10.2", "-38%", "816"],
            ["C", "5.1", "-5%", "10.1", "-39%", "627"],
          ],
        },
        { kind: "p", text: "Os vereditos bateram com os de A em toda repetição. A CPU caiu 37 a 39% e a memória cerca de metade, mas o tempo de parede ficou dentro do ruído. A meta não foi atingida." },
        { kind: "p", text: "Uma execução com trace explica o motivo. O motor paga cerca de 1.8 s antes do primeiro passo: uns 0.26 s listando ids de testes, 0.24 s carregando e cerca de 0.3 s bifurcando workers e abrindo navegadores. Os 17 specs então levam de 2.5 a 3 s em quatro workers. Uma suite de 5 s não consegue amortizar uma largada fixa desse tamanho." },
        { kind: "p", text: "Foi pior sob uma falha semeada (uma busca que ignora a consulta, 3 de 17 specs falhando, uma única repetição): o tempo de parede subiu 61% para B e 130% para C. Cada spec que falha roda de novo com um trace, então uma falha custa duas tentativas que esperam, cada uma, o timeout de expect de 5 s." },
        { kind: "callout", tone: "warn", text: "Então o motor economizou CPU e memória, não tempo, nesta suite. O que ainda moveria o tempo de parede, segundo as próprias notas do benchmark: um runner já aquecido quando a primeira execução chega, nenhuma passada de listagem separada e uma suite maior em que a largada seja amortizada. Nada disso foi construído nem medido." },
      ],
    },
    {
      id: "takeaway",
      title: "O que levo disso",
      blocks: [
        { kind: "p", text: "Um mundo controlado conquista seu lugar em determinismo: um relógio que pula limpo, controles que não ficam flaky, um veredito com limite declarado. Ele não conquistou uma suite mais rápida, e prefiro dizer isso a citar só a linha de CPU. A próxima medição que quero é uma suite grande o bastante para esconder a largada de 1.8 s." },
      ],
    },
  ],
};
