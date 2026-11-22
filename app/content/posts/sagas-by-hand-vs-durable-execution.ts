import type { Post } from "./types";

const post: Post = {
  slug: "sagas-by-hand-vs-durable-execution",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Sagas by hand vs durable execution",
  summary: "A design comparison, with no measurements, of hand-built sagas and a durable workflow engine: what you write yourself in each, and what stays your problem either way.",
  tags: ["saga", "workflow", "design", "idempotency"],
  project: "versatile-sh",
  sections: [
    {
      id: "scope",
      title: "What this is and is not",
      blocks: [
        { kind: "callout", tone: "note", text: "None of nagare's docs, ADRs or the research studies I read compare the two approaches, and nobody measured one against the other. This post is a design comparison. It contains no benchmark numbers on purpose." },
        { kind: "p", text: "The comparison is about work, not speed: which pieces you write and operate yourself, and which pieces a durable engine gives you. The engine-side claims come from nagare's ADRs. The by-hand side is the usual shape of the pattern, not a record of a specific system." },
      ],
    },
    {
      id: "by-hand",
      title: "A saga by hand",
      blocks: [
        { kind: "p", text: "A saga splits one business operation into local steps, each with a compensating step that undoes it. By hand, you end up building the same set of parts almost every time." },
        { kind: "list", items: [
          "A state table that records which step each instance reached, written in the same transaction as the step's own effect.",
          "A way to deliver the next command after that commit, which usually means an outbox table and a relay.",
          "An inbox or a unique key per message, because the relay and the broker both deliver at least once.",
          "Timers for deadlines and retries, with their own storage and a poller.",
          "Compensations that are themselves idempotent and retryable.",
          "A recovery job that finds instances stuck in the middle and moves them on.",
        ] },
        { kind: "p", text: "None of this is hard in isolation. The cost is that the control flow of the business operation ends up spread over handlers, tables and message types. To answer where an instance is, you read a state table and reconstruct the story." },
      ],
    },
    {
      id: "durable",
      title: "The same thing on a durable engine",
      blocks: [
        { kind: "p", text: "A durable engine moves the first five parts below your code. The state table is the journal. Delivery after commit is an outbox and an inbox the engine owns. Timers are durable sleeps. Recovery is replay: the run resumes from its recorded history." },
        { kind: "p", text: "In nagare the flow is a graph and each node ends with an outcome. A transport returns a failure with a code and a retryable flag. A retryable failure is retried, and a final one gives the outcome `failed`. The run then continues along the edge for that outcome, and if no edge exists the run fails. A compensation is therefore an ordinary branch of the graph, reachable from the failure edge of the step it undoes (ADR-0003)." },
        { kind: "p", text: "Where an instance is can be read from its event log. Every run's events are appended in one transaction with the read model and the outbox rows, so the story is a stored history and not a reconstruction." },
      ],
    },
    {
      id: "still-yours",
      title: "What stays yours either way",
      blocks: [
        { kind: "list", items: [
          "Compensation design. An engine cannot know how to undo a payment capture. You still decide the inverse operation and whether it is possible at all.",
          "Idempotent callees. Delivery is at least once in both worlds. In nagare every step carries a key built from run, node, visit and attempt, and it only helps if the service that receives it honours it. The cancel call is documented as at-least-once too, so it must treat an unknown or finished reference as success.",
          "Isolation. A saga is not a transaction: other readers can see the intermediate state between steps.",
        ] },
      ],
    },
    {
      id: "costs",
      title: "What the engine charges you",
      blocks: [
        { kind: "p", text: "Durable execution is not free of design cost. The workflow code, or here the interpreter, must be deterministic, so no clock, randomness or I/O outside recorded calls. Step keys become a contract, because replay matches on them. An incompatible change to the interpreter ships as a new build that drains old runs, since parked runs are not patched in place (ADR-0011)." },
        { kind: "p", text: "You also take on an engine as a dependency to operate, and in nagare's case a decision about which engine sits behind the port. That decision is the subject of the post on the durable-engine port." },
        { kind: "p", text: "My rule of thumb, as a hypothesis and not a finding: a hand-built saga is reasonable for two or three steps in one service that already has an outbox. Once timers, waits for outside events, cancellation and run history are all needed, the parts list above is a durable engine written slowly." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Sagas a mano vs ejecución durable",
  summary: "Una comparación de diseño, sin mediciones, entre sagas hechas a mano y un motor de workflows durables: qué escribes tú mismo en cada una y qué sigue siendo tu problema en ambas.",
  sections: [
    {
      id: "scope",
      title: "Qué es esto y qué no es",
      blocks: [
        { kind: "callout", tone: "note", text: "Ni los docs de nagare, ni los ADR, ni los estudios de investigación que leí comparan los dos enfoques, y nadie midió uno contra el otro. Este post es una comparación de diseño. A propósito no contiene números de benchmark." },
        { kind: "p", text: "La comparación trata de trabajo, no de velocidad: qué piezas escribes y operas tú mismo y cuáles te da un motor durable. Las afirmaciones del lado del motor vienen de los ADR de nagare. El lado a mano es la forma habitual del patrón, no el registro de un sistema concreto." },
      ],
    },
    {
      id: "by-hand",
      title: "Una saga a mano",
      blocks: [
        { kind: "p", text: "Una saga divide una operación de negocio en pasos locales, cada uno con un paso compensatorio que lo deshace. A mano, casi siempre terminas construyendo el mismo conjunto de piezas." },
        { kind: "list", items: [
          "Una tabla de estado que registra a qué paso llegó cada instancia, escrita en la misma transacción que el efecto del paso.",
          "Una forma de entregar el siguiente comando después de ese commit, lo que normalmente significa una tabla outbox y un relay.",
          "Un inbox o una clave única por mensaje, porque el relay y el broker entregan al menos una vez.",
          "Timers para deadlines y reintentos, con su propio almacenamiento y un poller.",
          "Compensaciones que a su vez son idempotentes y reintentables.",
          "Un job de recuperación que encuentra instancias atascadas a la mitad y las hace avanzar.",
        ] },
        { kind: "p", text: "Nada de esto es difícil por separado. El costo es que el flujo de control de la operación de negocio termina repartido entre handlers, tablas y tipos de mensaje. Para responder dónde está una instancia, lees una tabla de estado y reconstruyes la historia." },
      ],
    },
    {
      id: "durable",
      title: "Lo mismo en un motor durable",
      blocks: [
        { kind: "p", text: "Un motor durable mueve las primeras cinco piezas por debajo de tu código. La tabla de estado es el journal. La entrega después del commit es un outbox y un inbox que son del motor. Los timers son sleeps durables. La recuperación es replay: la ejecución se retoma desde su historial registrado." },
        { kind: "p", text: "En nagare el flujo es un grafo y cada nodo termina con un resultado. Un transporte devuelve una falla con un código y una marca retryable. Una falla retryable se reintenta, y una final da el resultado `failed`. La ejecución continúa entonces por la arista de ese resultado, y si no existe arista la ejecución falla. Una compensación es por tanto una rama normal del grafo, alcanzable desde la arista de falla del paso que deshace (ADR-0003)." },
        { kind: "p", text: "Dónde está una instancia se lee desde su event log. Los eventos de cada ejecución se agregan en una sola transacción junto con el read model y las filas del outbox, así que la historia es un historial almacenado y no una reconstrucción." },
      ],
    },
    {
      id: "still-yours",
      title: "Lo que sigue siendo tuyo en ambos casos",
      blocks: [
        { kind: "list", items: [
          "El diseño de la compensación. Un motor no puede saber cómo deshacer una captura de pago. Tú sigues decidiendo la operación inversa y si es posible siquiera.",
          "Destinatarios idempotentes. La entrega es al menos una vez en ambos mundos. En nagare cada paso lleva una clave construida con run, node, visit y attempt, y solo sirve si el servicio que la recibe la respeta. La llamada de cancelación también está documentada como at-least-once, así que debe tratar una referencia desconocida o ya terminada como éxito.",
          "Aislamiento. Una saga no es una transacción: otros lectores pueden ver el estado intermedio entre pasos.",
        ] },
      ],
    },
    {
      id: "costs",
      title: "Lo que te cobra el motor",
      blocks: [
        { kind: "p", text: "La ejecución durable no está libre de costo de diseño. El código del workflow, o aquí el intérprete, debe ser determinista: sin reloj, aleatoriedad ni I/O fuera de las llamadas registradas. Las claves de paso se vuelven un contrato, porque el replay se ancla en ellas. Un cambio incompatible en el intérprete sale como un build nuevo que drena las ejecuciones antiguas, ya que las ejecuciones estacionadas no se parchean en el lugar (ADR-0011)." },
        { kind: "p", text: "También asumes un motor como dependencia que operar y, en el caso de nagare, una decisión sobre qué motor queda detrás del port. Esa decisión es el tema del post sobre el port del motor durable." },
        { kind: "p", text: "Mi regla práctica, como hipótesis y no como hallazgo: una saga hecha a mano es razonable para dos o tres pasos en un servicio que ya tiene un outbox. Cuando hacen falta a la vez timers, esperas de eventos externos, cancelación e historial de ejecución, la lista de piezas de arriba es un motor durable escrito despacio." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Sagas à mão vs execução durável",
  summary: "Uma comparação de design, sem medições, entre sagas feitas à mão e um motor de workflows duráveis: o que você escreve por conta própria em cada uma e o que continua sendo problema seu nos dois casos.",
  sections: [
    {
      id: "scope",
      title: "O que é e o que não é",
      blocks: [
        { kind: "callout", tone: "note", text: "Nem os docs do nagare, nem os ADRs, nem os estudos de pesquisa que li comparam as duas abordagens, e ninguém mediu uma contra a outra. Este post é uma comparação de design. De propósito, não traz números de benchmark." },
        { kind: "p", text: "A comparação é sobre trabalho, não velocidade: quais peças você escreve e opera por conta própria e quais um motor durável entrega. As afirmações do lado do motor vêm dos ADRs do nagare. O lado à mão é o formato habitual do padrão, não o registro de um sistema específico." },
      ],
    },
    {
      id: "by-hand",
      title: "Uma saga à mão",
      blocks: [
        { kind: "p", text: "Uma saga divide uma operação de negócio em passos locais, cada um com um passo compensatório que o desfaz. À mão, quase sempre você acaba construindo o mesmo conjunto de peças." },
        { kind: "list", items: [
          "Uma tabela de estado que registra a que passo cada instância chegou, escrita na mesma transação que o efeito do passo.",
          "Uma forma de entregar o próximo comando depois desse commit, o que costuma significar uma tabela outbox e um relay.",
          "Um inbox ou uma chave única por mensagem, porque o relay e o broker entregam pelo menos uma vez.",
          "Timers para deadlines e novas tentativas, com armazenamento próprio e um poller.",
          "Compensações que, por sua vez, são idempotentes e repetíveis.",
          "Um job de recuperação que encontra instâncias travadas no meio e as faz seguir adiante.",
        ] },
        { kind: "p", text: "Nada disso é difícil isoladamente. O custo é que o fluxo de controle da operação de negócio acaba espalhado entre handlers, tabelas e tipos de mensagem. Para responder onde está uma instância, você lê uma tabela de estado e reconstrói a história." },
      ],
    },
    {
      id: "durable",
      title: "A mesma coisa em um motor durável",
      blocks: [
        { kind: "p", text: "Um motor durável empurra as cinco primeiras peças para baixo do seu código. A tabela de estado é o journal. A entrega depois do commit é um outbox e um inbox que pertencem ao motor. Os timers são sleeps duráveis. A recuperação é replay: a execução retoma a partir do seu histórico registrado." },
        { kind: "p", text: "No nagare o fluxo é um grafo e cada nó termina com um resultado. Um transporte devolve uma falha com um código e uma marca retryable. Uma falha retryable é repetida, e uma final dá o resultado `failed`. A execução então segue pela aresta desse resultado, e se não existir aresta a execução falha. Uma compensação é, portanto, um ramo comum do grafo, alcançável a partir da aresta de falha do passo que ela desfaz (ADR-0003)." },
        { kind: "p", text: "Onde uma instância está pode ser lido do seu event log. Os eventos de cada execução são acrescentados em uma só transação junto com o read model e as linhas do outbox, então a história é um histórico armazenado e não uma reconstrução." },
      ],
    },
    {
      id: "still-yours",
      title: "O que continua sendo seu nos dois casos",
      blocks: [
        { kind: "list", items: [
          "O design da compensação. Um motor não sabe como desfazer uma captura de pagamento. Você ainda decide a operação inversa e se ela é sequer possível.",
          "Destinatários idempotentes. A entrega é pelo menos uma vez nos dois mundos. No nagare cada passo carrega uma chave construída com run, node, visit e attempt, e ela só ajuda se o serviço que a recebe a respeitar. A chamada de cancelamento também está documentada como at-least-once, então deve tratar uma referência desconhecida ou já finalizada como sucesso.",
          "Isolamento. Uma saga não é uma transação: outros leitores podem ver o estado intermediário entre os passos.",
        ] },
      ],
    },
    {
      id: "costs",
      title: "O que o motor cobra de você",
      blocks: [
        { kind: "p", text: "A execução durável não é livre de custo de design. O código do workflow, ou aqui o interpretador, precisa ser determinístico: sem relógio, aleatoriedade nem I/O fora das chamadas registradas. As chaves de passo viram um contrato, porque o replay se apoia nelas. Uma mudança incompatível no interpretador sai como um build novo que drena as execuções antigas, já que execuções estacionadas não são corrigidas no lugar (ADR-0011)." },
        { kind: "p", text: "Você também assume um motor como dependência a operar e, no caso do nagare, uma decisão sobre qual motor fica atrás do port. Essa decisão é o assunto do post sobre o port do motor durável." },
        { kind: "p", text: "Minha regra prática, como hipótese e não como achado: uma saga feita à mão é razoável para dois ou três passos em um serviço que já tem um outbox. Quando timers, esperas por eventos externos, cancelamento e histórico de execução são todos necessários, a lista de peças acima é um motor durável escrito devagar." },
      ],
    },
  ],
};
