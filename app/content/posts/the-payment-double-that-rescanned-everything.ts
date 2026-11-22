import type { Post } from "./types";

const post: Post = {
  slug: "the-payment-double-that-rescanned-everything",
  category: "discoveries",
  date: "2026-11-09",
  published: "2026-11-21",
  title: "The payment double that rescanned everything",
  summary: "A load spike on hakoniwa's controlled worlds found an O(n squared) scan in a fake payment provider. Fixing it with a time-ordered queue raised throughput by 55% in the same window.",
  tags: ["hakoniwa", "performance", "go", "debugging"],
  project: "versatile-sh",
  sections: [
    {
      id: "setting",
      title: "How I ran into it",
      blocks: [
        { kind: "p", text: "hakoniwa can run an app in a controlled world: a clock you can jump, a forkable Postgres and doubles for outside services. One double is a fake payment provider. It accepts payment intents, settles them at a world time and delivers signed webhooks to the app." },
        { kind: "p", text: "Spike S10 asked a narrow question. When the world clock jumps while the app is serving traffic, how often does the engine wrongly decide the app was quiet? To measure it I drove shoppers over HTTP and jumped the clock 100 times with a 50 to 200 ms pause. The setup is in Testing with a frozen clock. This post is about what the heaviest load level did to the engine instead." },
      ],
    },
    {
      id: "symptom",
      title: "Symptom",
      blocks: [
        { kind: "p", text: "Under saturating load the world host pinned one CPU, and teardown after the run took a long time. The spike notes record 11 to 23 seconds of teardown after 37k to 38k requests. After a run of 221k requests, teardown took over 18 minutes." },
        { kind: "p", text: "Teardown time growing faster than request count is the signature of a quadratic cost. Doubling the traffic was not doubling the work." },
      ],
    },
    {
      id: "cause",
      title: "Cause",
      blocks: [
        { kind: "p", text: "A goroutine dump put the time in one function, the payment double's `catchUp`. On every webhook delivery drain, every clock tick and every `Pending` call, it scanned every intent ever created to find the ones now due. With n intents and about n deliveries, that is O(intents) times O(deliveries)." },
        { kind: "p", text: "My inference, not something the notes state: as the run goes on, most of those intents are already settled, so most passes find nothing new and the work is repetition." },
      ],
    },
    {
      id: "fix",
      title: "Fix and result",
      blocks: [
        { kind: "p", text: "World time only moves forward, so due settlements are always at the front of a list ordered by settle time. The fix keeps settlements in a first-in first-out queue sorted that way, and `catchUp` pops what is due and stops at the first one that is not." },
        { kind: "table", head: ["", "Before", "After"], rows: [
          ["Requests served in the same window", "37k to 38k", "57.5k (+55%)"],
          ["Teardown", "11 to 23 s", "0.1 s"],
        ] },
        { kind: "p", text: "A test, `TestOnlyDueSettlementsSettle`, pins the due-only behaviour. The existing lifecycle, webhook and pending tests passed unchanged." },
        { kind: "callout", tone: "note", text: "The numbers come from the spike's own notes: host shared with other verifications, so wall times are indicative, and the 55% is one comparison, not a repeated benchmark. My reading of why throughput rose is a hypothesis: the CPU that went into rescanning went back into serving requests." },
      ],
    },
    {
      id: "lesson",
      title: "What I take from it",
      blocks: [
        { kind: "p", text: "The bug did not show on light or medium load. At 3 and 4 shoppers, 3006 and 14450 requests ran with no problem. It showed only when I pushed the heaviest level for a different reason. A double that is correct and slow still ruins the experiment it exists for, because the engine ends up measuring its own fake." },
        { kind: "p", text: "The measurement had a side benefit. Under that saturating load the quiescence probe never accepted a jump: 106 of 106 jumps were refused with `world not quiet`. It refused instead of jumping silently, which is the behaviour I wanted." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "El doble de pagos que reescaneaba todo",
  summary: "Un spike de carga sobre los mundos controlados de hakoniwa encontró un escaneo O(n al cuadrado) en un proveedor de pagos falso. Arreglarlo con una cola ordenada por tiempo subió el throughput 55% en la misma ventana.",
  sections: [
    {
      id: "setting",
      title: "Cómo me topé con esto",
      blocks: [
        { kind: "p", text: "hakoniwa puede ejecutar una app en un mundo controlado: un reloj que puedes saltar, un Postgres bifurcable y dobles para servicios externos. Uno de los dobles es un proveedor de pagos falso. Acepta intents de pago, los liquida a una hora del mundo y entrega webhooks firmados a la app." },
        { kind: "p", text: "El spike S10 hizo una pregunta acotada. Cuando el reloj del mundo salta mientras la app atiende tráfico, ¿con qué frecuencia decide el motor por error que la app estaba quieta? Para medirlo manejé compradores por HTTP y salté el reloj 100 veces con una pausa de 50 a 200 ms. La configuración está en Testear con un reloj congelado. Este post trata en cambio de lo que el nivel de carga más alto le hizo al motor." },
      ],
    },
    {
      id: "symptom",
      title: "Síntoma",
      blocks: [
        { kind: "p", text: "Bajo carga de saturación el host del mundo dejaba un CPU al máximo, y el desmontaje tras la corrida tardaba mucho. Las notas del spike registran de 11 a 23 segundos de desmontaje tras de 37k a 38k solicitudes. Tras una corrida de 221k solicitudes, el desmontaje tardó más de 18 minutos." },
        { kind: "p", text: "Que el tiempo de desmontaje crezca más rápido que la cantidad de solicitudes es la firma de un costo cuadrático. Duplicar el tráfico no duplicaba el trabajo." },
      ],
    },
    {
      id: "cause",
      title: "Causa",
      blocks: [
        { kind: "p", text: "Un volcado de goroutines ubicó el tiempo en una sola función, el `catchUp` del doble de pagos. En cada drenaje de entrega de webhooks, en cada tick del reloj y en cada llamada a `Pending`, escaneaba todos los intents creados alguna vez para encontrar los que ya vencían. Con n intents y unas n entregas, eso es O(intents) por O(entregas)." },
        { kind: "p", text: "Mi inferencia, no algo que digan las notas: a medida que avanza la corrida, la mayoría de esos intents ya están liquidados, así que la mayoría de las pasadas no encuentra nada nuevo y el trabajo es repetición." },
      ],
    },
    {
      id: "fix",
      title: "Arreglo y resultado",
      blocks: [
        { kind: "p", text: "El tiempo del mundo solo avanza, así que las liquidaciones vencidas siempre están al frente de una lista ordenada por hora de liquidación. El arreglo mantiene las liquidaciones en una cola first-in first-out ordenada así, y `catchUp` saca lo que vence y se detiene en el primero que no." },
        { kind: "table", head: ["", "Antes", "Después"], rows: [
          ["Solicitudes atendidas en la misma ventana", "37k to 38k", "57.5k (+55%)"],
          ["Desmontaje", "11 to 23 s", "0.1 s"],
        ] },
        { kind: "p", text: "Un test, `TestOnlyDueSettlementsSettle`, fija el comportamiento de solo vencidas. Los tests existentes de ciclo de vida, webhooks y pendientes pasaron sin cambios." },
        { kind: "callout", tone: "note", text: "Los números salen de las propias notas del spike: el host se compartió con otras verificaciones, así que los tiempos de pared son indicativos, y el 55% es una sola comparación, no un benchmark repetido. Mi lectura de por qué subió el throughput es una hipótesis: el CPU que se iba en reescanear volvió a atender solicitudes." },
      ],
    },
    {
      id: "lesson",
      title: "Qué me llevo",
      blocks: [
        { kind: "p", text: "El bug no apareció con carga ligera ni media. Con 3 y 4 compradores, 3006 y 14450 solicitudes corrieron sin problema. Apareció solo cuando empujé el nivel más alto por otra razón. Un doble que es correcto y lento igual arruina el experimento para el que existe, porque el motor termina midiendo su propio falso." },
        { kind: "p", text: "La medición tuvo un beneficio colateral. Bajo esa carga de saturación la sonda de quietud nunca aceptó un salto: 106 de 106 saltos fueron rechazados con `world not quiet`. Rechazó en lugar de saltar en silencio, que es el comportamiento que quería." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "O dublê de pagamento que reescaneava tudo",
  summary: "Um spike de carga nos mundos controlados do hakoniwa encontrou um scan O(n ao quadrado) em um provedor de pagamento falso. Corrigi-lo com uma fila ordenada por tempo aumentou o throughput em 55% na mesma janela.",
  sections: [
    {
      id: "setting",
      title: "Como esbarrei nisso",
      blocks: [
        { kind: "p", text: "O hakoniwa pode rodar um app em um mundo controlado: um relógio que você pode pular, um Postgres bifurcável e dublês para serviços externos. Um dos dublês é um provedor de pagamento falso. Ele aceita intents de pagamento, liquida-os em um horário do mundo e entrega webhooks assinados ao app." },
        { kind: "p", text: "O spike S10 fez uma pergunta estreita. Quando o relógio do mundo pula enquanto o app atende tráfego, com que frequência o motor decide errado que o app estava quieto? Para medir, conduzi compradores por HTTP e pulei o relógio 100 vezes com uma pausa de 50 a 200 ms. A configuração está em Testando com um relógio congelado. Este post trata, em vez disso, do que o nível de carga mais pesado fez com o motor." },
      ],
    },
    {
      id: "symptom",
      title: "Sintoma",
      blocks: [
        { kind: "p", text: "Sob carga de saturação o host do mundo prendia uma CPU, e o teardown depois da execução demorava muito. As notas do spike registram de 11 a 23 segundos de teardown após de 37k a 38k requisições. Depois de uma execução de 221k requisições, o teardown levou mais de 18 minutos." },
        { kind: "p", text: "O tempo de teardown crescer mais rápido que a contagem de requisições é a assinatura de um custo quadrático. Dobrar o tráfego não dobrava o trabalho." },
      ],
    },
    {
      id: "cause",
      title: "Causa",
      blocks: [
        { kind: "p", text: "Um dump de goroutines colocou o tempo em uma única função, o `catchUp` do dublê de pagamento. A cada drenagem de entrega de webhooks, a cada tick do relógio e a cada chamada a `Pending`, ele varria todos os intents já criados para achar os que já venceram. Com n intents e cerca de n entregas, isso é O(intents) vezes O(entregas)." },
        { kind: "p", text: "Minha inferência, não algo que as notas digam: conforme a execução avança, a maioria desses intents já está liquidada, então a maioria das passadas não encontra nada novo e o trabalho é repetição." },
      ],
    },
    {
      id: "fix",
      title: "Correção e resultado",
      blocks: [
        { kind: "p", text: "O tempo do mundo só anda para a frente, então as liquidações vencidas estão sempre no começo de uma lista ordenada pelo horário de liquidação. A correção mantém as liquidações em uma fila first-in first-out ordenada assim, e o `catchUp` tira o que venceu e para no primeiro que não venceu." },
        { kind: "table", head: ["", "Antes", "Depois"], rows: [
          ["Requisições atendidas na mesma janela", "37k to 38k", "57.5k (+55%)"],
          ["Teardown", "11 to 23 s", "0.1 s"],
        ] },
        { kind: "p", text: "Um teste, `TestOnlyDueSettlementsSettle`, fixa o comportamento de só liquidar o vencido. Os testes existentes de ciclo de vida, webhook e pendentes passaram sem mudança." },
        { kind: "callout", tone: "note", text: "Os números vêm das próprias notas do spike: o host foi compartilhado com outras verificações, então os tempos de parede são indicativos, e os 55% são uma única comparação, não um benchmark repetido. Minha leitura do porquê o throughput subiu é uma hipótese: a CPU que ia para reescanear voltou a atender requisições." },
      ],
    },
    {
      id: "lesson",
      title: "O que levo disso",
      blocks: [
        { kind: "p", text: "O bug não apareceu em carga leve ou média. Com 3 e 4 compradores, 3006 e 14450 requisições rodaram sem problema. Ele só apareceu quando empurrei o nível mais pesado por outro motivo. Um dublê que é correto e lento ainda estraga o experimento para o qual existe, porque o motor acaba medindo o próprio falso." },
        { kind: "p", text: "A medição teve um benefício colateral. Sob essa carga de saturação a sonda de quiescência nunca aceitou um salto: 106 de 106 saltos foram recusados com `world not quiet`. Ela recusou em vez de pular em silêncio, que é o comportamento que eu queria." },
      ],
    },
  ],
};
