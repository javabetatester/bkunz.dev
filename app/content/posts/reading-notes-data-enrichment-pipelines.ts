import type { Post } from "./types";

const post: Post = {
  slug: "reading-notes-data-enrichment-pipelines",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Reading notes: enrichment, backfills and late data",
  summary: "Notes on public material, not my benchmarks: what Stripe, Apache Beam, Airflow and the Dataflow paper say about idempotency, backfills and late data, and how I would carry that into an enrichment pipeline.",
  tags: ["data-pipelines", "idempotency", "backfill", "late-data", "reading-notes"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-this-is",
      title: "What this is",
      blocks: [
        { kind: "p", text: "Reading notes on public documentation and one paper, fetched on 2026-11-21. I ran no pipeline for this and quote no figure that is not on the page I link. Where I extend a source to enrichment, I mark it as my reading." },
        { kind: "list", items: [
          "Stripe, Designing robust and predictable APIs with idempotency: https://stripe.com/blog/idempotency",
          "Apache Beam programming guide, windowing, watermarks and late data: https://beam.apache.org/documentation/programming-guide/",
          "Apache Airflow, Dag runs, catchup and backfill: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dag-run.html",
          "Akidau et al., The Dataflow Model: https://research.google/pubs/the-dataflow-model-a-practical-approach-to-balancing-correctness-latency-and-cost-in-massive-scale-unbounded-out-of-order-data-processing/",
        ] },
        { kind: "p", text: "By enrichment I mean a step that takes a record and adds fields computed from a lookup or a model, such as a company name resolved from a domain." },
      ],
    },
    {
      id: "idempotent",
      title: "Idempotent enrichment",
      blocks: [
        { kind: "p", text: "Stripe's post describes the client generating a unique ID for each operation and sending it in an Idempotency-Key header on POST requests. The server correlates it with the state of the request. The post separates three failure cases: on a connection failure the server sees the key for the first time and processes normally; on a failure midway it picks up the work and carries it through; when the response was lost after success it replies with a cached result of the successful operation." },
        { kind: "p", text: "The post gives no key expiry, retention period or retry limit, so I will not guess one. Its only numeric rule is client backoff growing proportionally to 2^n, where n is the number of failures." },
        { kind: "p", text: "My reading for enrichment: the key is the record's identity plus the version of whatever the enrichment depends on. Same key, same stored result. Hypothesis: the useful design question is what goes into that version, such as the reference dataset, the model, or the code, because a retry that sees a newer lookup table will produce a different answer under an unchanged key." },
      ],
    },
    {
      id: "backfill",
      title: "Backfills",
      blocks: [
        { kind: "p", text: "Airflow's docs say catchup is off by default: missed scheduled run times between start_date and now are not backfilled when a Dag is activated. With catchup on, the scheduler creates a run for any scheduled time not yet run since the last run. Each run has a data interval, the time range it operates in, and the logical date for data-interval timetables is the start of that window, not when it executes." },
        { kind: "p", text: "Backfill re-runs a Dag for a past period, from the UI or with airflow backfill create, which re-runs all instances for every interval between the start and end dates. The page does not use the word idempotency or say tasks must be idempotent. It warns that logic written to use now instead of the interval is a case where catchup should be off." },
        { kind: "p", text: "My reading: a backfill is only safe if a run is a function of its interval and of versioned inputs. A job that reads the wall clock or the latest reference table will give a different answer for last month today than it did then. Hypothesis: for enrichment, stamping each output with the input version lets you tell a deliberate re-enrichment from an accidental drift." },
      ],
    },
    {
      id: "late",
      title: "Late data",
      blocks: [
        { kind: "p", text: "Beam defines the watermark as the system's notion of when all data in a certain window can be expected to have arrived. Once the watermark passes a window's end, an element arriving with a timestamp in that window is late data. The default windowing configuration does not allow late data, and the guide's caution says the default is to discard it. Allowed lateness is enabled with withAllowedLateness; the guide's example allows late data up to two days after the end of a window." },
        { kind: "p", text: "The Dataflow paper states the underlying limit: one can never fully optimise along all of correctness, latency and cost for unbounded, out-of-order input, and we will never know if or when we have seen all of our data. Its answer is not a rule but abstractions that let you choose the trade-off." },
        { kind: "table", head: ["Situation in an enrichment pipeline", "Reading"], rows: [
          ["Record arrives after its window closed", "Beam: late; dropped by default unless lateness is allowed."],
          ["Reference data arrives after the records that need it", "Not covered by the sources. My hypothesis: treat it as a re-enrichment trigger keyed by the lookup key, not as late data."],
          ["A late record changes an earlier aggregate", "The Dataflow model's trade-off applies: emit a correction, or accept the drop."],
        ] },
      ],
    },
    {
      id: "gaps",
      title: "What these sources do not say",
      blocks: [
        { kind: "list", items: [
          "None of them gives a number for the cost of re-enrichment, so I have none.",
          "Airflow's page does not define idempotency for tasks. The Stripe post is about API calls, not batch jobs; carrying it over is my extension.",
          "I read only part of the Beam guide: the sections on watermarks and late data.",
          "These notes are a starting list of questions for my own pipelines, not evidence about how they behave.",
        ] },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Notas de lectura: enriquecimiento, backfills y datos tardíos",
  summary: "Notas sobre material público, no sobre mis benchmarks: qué dicen Stripe, Apache Beam, Airflow y el paper de Dataflow sobre idempotencia, backfills y datos tardíos, y cómo lo llevaría a un pipeline de enriquecimiento.",
  sections: [
    {
      id: "what-this-is",
      title: "Qué es esto",
      blocks: [
        { kind: "p", text: "Notas de lectura sobre documentación pública y un paper, consultados el 2026-11-21. No corrí ningún pipeline para esto y no cito ninguna cifra que no esté en la página que enlazo. Donde extiendo una fuente al enriquecimiento, lo marco como lectura mía." },
        { kind: "list", items: [
          "Stripe, Designing robust and predictable APIs with idempotency: https://stripe.com/blog/idempotency",
          "Apache Beam programming guide, windowing, watermarks and late data: https://beam.apache.org/documentation/programming-guide/",
          "Apache Airflow, Dag runs, catchup and backfill: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dag-run.html",
          "Akidau et al., The Dataflow Model: https://research.google/pubs/the-dataflow-model-a-practical-approach-to-balancing-correctness-latency-and-cost-in-massive-scale-unbounded-out-of-order-data-processing/",
        ] },
        { kind: "p", text: "Por enriquecimiento entiendo un paso que toma un registro y le agrega campos calculados a partir de una consulta o un modelo, como el nombre de una empresa resuelto desde un dominio." },
      ],
    },
    {
      id: "idempotent",
      title: "Enriquecimiento idempotente",
      blocks: [
        { kind: "p", text: "El post de Stripe describe al cliente generando un ID único por operación y enviándolo en un header Idempotency-Key en los POST. El servidor lo correlaciona con el estado de la solicitud. El post separa tres casos de falla: ante una falla de conexión el servidor ve la clave por primera vez y procesa con normalidad; ante una falla a mitad de camino retoma el trabajo y lo completa; cuando la respuesta se perdió después de un éxito, responde con un resultado en caché de la operación exitosa." },
        { kind: "p", text: "El post no da expiración de claves, período de retención ni límite de reintentos, así que no voy a adivinar uno. Su única regla numérica es un backoff del cliente que crece proporcionalmente a 2^n, donde n es la cantidad de fallas." },
        { kind: "p", text: "Mi lectura para enriquecimiento: la clave es la identidad del registro más la versión de aquello de lo que depende el enriquecimiento. Misma clave, mismo resultado guardado. Hipótesis: la pregunta de diseño útil es qué entra en esa versión, como el dataset de referencia, el modelo o el código, porque un reintento que ve una tabla de consulta más nueva producirá otra respuesta con la misma clave." },
      ],
    },
    {
      id: "backfill",
      title: "Backfills",
      blocks: [
        { kind: "p", text: "La documentación de Airflow dice que catchup viene desactivado por defecto: los horarios programados perdidos entre start_date y ahora no se rellenan al activar un Dag. Con catchup activado, el scheduler crea una ejecución por cada horario programado que no corrió desde la última ejecución. Cada ejecución tiene un data interval, el rango de tiempo en el que opera, y la logical date en los timetables por data interval es el inicio de esa ventana, no el momento en que se ejecuta." },
        { kind: "p", text: "Backfill vuelve a ejecutar un Dag para un período pasado, desde la UI o con airflow backfill create, que reejecuta todas las instancias de cada intervalo entre las fechas de inicio y fin. La página no usa la palabra idempotencia ni dice que las tareas deban ser idempotentes. Advierte que la lógica escrita para usar now en lugar del intervalo es un caso en que catchup debería estar desactivado." },
        { kind: "p", text: "Mi lectura: un backfill solo es seguro si una ejecución es función de su intervalo y de entradas versionadas. Un job que lee el reloj de pared o la última tabla de referencia dará hoy una respuesta distinta para el mes pasado de la que dio entonces. Hipótesis: para enriquecimiento, marcar cada salida con la versión de la entrada permite distinguir un re-enriquecimiento deliberado de una deriva accidental." },
      ],
    },
    {
      id: "late",
      title: "Datos tardíos",
      blocks: [
        { kind: "p", text: "Beam define el watermark como la noción del sistema de cuándo se puede esperar que hayan llegado todos los datos de una ventana. Cuando el watermark pasa el final de una ventana, un elemento que llega con un timestamp dentro de esa ventana es un dato tardío. La configuración de windowing por defecto no permite datos tardíos, y la advertencia de la guía dice que por defecto se descartan. La tolerancia a datos tardíos se activa con withAllowedLateness; el ejemplo de la guía permite datos tardíos hasta dos días después del final de una ventana." },
        { kind: "p", text: "El paper de Dataflow enuncia el límite de fondo: nunca se puede optimizar del todo corrección, latencia y costo a la vez para entradas no acotadas y desordenadas, y nunca sabremos si o cuándo hemos visto todos nuestros datos. Su respuesta no es una regla sino abstracciones que permiten elegir el trade-off." },
        { kind: "table", head: ["Situación en un pipeline de enriquecimiento", "Lectura"], rows: [
          ["El registro llega después de que su ventana se cerró", "Beam: tardío; se descarta por defecto salvo que se permita tolerancia."],
          ["El dato de referencia llega después de los registros que lo necesitan", "No lo cubren las fuentes. Mi hipótesis: tratarlo como disparador de re-enriquecimiento por la clave de consulta, no como dato tardío."],
          ["Un registro tardío cambia un agregado anterior", "Aplica el trade-off del modelo Dataflow: emitir una corrección o aceptar el descarte."],
        ] },
      ],
    },
    {
      id: "gaps",
      title: "Lo que estas fuentes no dicen",
      blocks: [
        { kind: "list", items: [
          "Ninguna da una cifra del costo de re-enriquecer, así que no tengo ninguna.",
          "La página de Airflow no define idempotencia para tareas. El post de Stripe trata de llamadas a una API, no de jobs batch; trasladarlo es una extensión mía.",
          "Leí solo parte de la guía de Beam: las secciones sobre watermarks y datos tardíos.",
          "Estas notas son una lista inicial de preguntas para mis propios pipelines, no evidencia de cómo se comportan.",
        ] },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Notas de leitura: enriquecimento, backfills e dados atrasados",
  summary: "Notas sobre material público, não sobre meus benchmarks: o que Stripe, Apache Beam, Airflow e o paper do Dataflow dizem sobre idempotência, backfills e dados atrasados, e como eu levaria isso para um pipeline de enriquecimento.",
  sections: [
    {
      id: "what-this-is",
      title: "O que é isto",
      blocks: [
        { kind: "p", text: "Notas de leitura sobre documentação pública e um paper, consultados em 2026-11-21. Não rodei nenhum pipeline para isto e não cito nenhum número que não esteja na página que linko. Onde estendo uma fonte para enriquecimento, marco como leitura minha." },
        { kind: "list", items: [
          "Stripe, Designing robust and predictable APIs with idempotency: https://stripe.com/blog/idempotency",
          "Apache Beam programming guide, windowing, watermarks and late data: https://beam.apache.org/documentation/programming-guide/",
          "Apache Airflow, Dag runs, catchup and backfill: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dag-run.html",
          "Akidau et al., The Dataflow Model: https://research.google/pubs/the-dataflow-model-a-practical-approach-to-balancing-correctness-latency-and-cost-in-massive-scale-unbounded-out-of-order-data-processing/",
        ] },
        { kind: "p", text: "Por enriquecimento entendo uma etapa que pega um registro e acrescenta campos calculados a partir de uma consulta ou de um modelo, como o nome de uma empresa resolvido a partir de um domínio." },
      ],
    },
    {
      id: "idempotent",
      title: "Enriquecimento idempotente",
      blocks: [
        { kind: "p", text: "O post da Stripe descreve o cliente gerando um ID único para cada operação e enviando-o em um header Idempotency-Key nos POSTs. O servidor o correlaciona com o estado da requisição. O post separa três casos de falha: em uma falha de conexão o servidor vê a chave pela primeira vez e processa normalmente; em uma falha no meio do caminho ele retoma o trabalho e o conclui; quando a resposta se perdeu depois de um sucesso, ele responde com um resultado em cache da operação bem-sucedida." },
        { kind: "p", text: "O post não dá expiração de chave, período de retenção nem limite de tentativas, então não vou chutar um. Sua única regra numérica é um backoff do cliente que cresce proporcionalmente a 2^n, onde n é o número de falhas." },
        { kind: "p", text: "Minha leitura para enriquecimento: a chave é a identidade do registro mais a versão de tudo de que o enriquecimento depende. Mesma chave, mesmo resultado guardado. Hipótese: a pergunta de design útil é o que entra nessa versão, como o dataset de referência, o modelo ou o código, porque uma nova tentativa que enxerga uma tabela de consulta mais nova produzirá outra resposta sob a mesma chave." },
      ],
    },
    {
      id: "backfill",
      title: "Backfills",
      blocks: [
        { kind: "p", text: "A documentação do Airflow diz que catchup vem desligado por padrão: horários agendados perdidos entre start_date e agora não são preenchidos quando um Dag é ativado. Com catchup ligado, o scheduler cria uma execução para cada horário agendado que ainda não rodou desde a última execução. Cada execução tem um data interval, a faixa de tempo em que opera, e a logical date nos timetables por data interval é o início dessa janela, não o momento em que executa." },
        { kind: "p", text: "Backfill reexecuta um Dag para um período passado, pela UI ou com airflow backfill create, que reexecuta todas as instâncias de cada intervalo entre as datas de início e fim. A página não usa a palavra idempotência nem diz que as tarefas precisam ser idempotentes. Ela avisa que uma lógica escrita para usar now em vez do intervalo é um caso em que o catchup deve ficar desligado." },
        { kind: "p", text: "Minha leitura: um backfill só é seguro se uma execução for função do seu intervalo e de entradas versionadas. Um job que lê o relógio de parede ou a última tabela de referência vai dar hoje uma resposta diferente para o mês passado da que deu na época. Hipótese: para enriquecimento, carimbar cada saída com a versão da entrada permite distinguir um re-enriquecimento deliberado de uma deriva acidental." },
      ],
    },
    {
      id: "late",
      title: "Dados atrasados",
      blocks: [
        { kind: "p", text: "O Beam define o watermark como a noção do sistema de quando se pode esperar que todos os dados de uma janela tenham chegado. Quando o watermark passa do fim de uma janela, um elemento que chega com timestamp nessa janela é dado atrasado. A configuração padrão de windowing não permite dados atrasados, e o aviso do guia diz que o padrão é descartá-los. A tolerância a atraso é ativada com withAllowedLateness; o exemplo do guia permite dados atrasados até dois dias depois do fim de uma janela." },
        { kind: "p", text: "O paper do Dataflow enuncia o limite de fundo: nunca se consegue otimizar totalmente correção, latência e custo ao mesmo tempo para entradas ilimitadas e fora de ordem, e nunca saberemos se ou quando vimos todos os nossos dados. A resposta dele não é uma regra, mas abstrações que permitem escolher o trade-off." },
        { kind: "table", head: ["Situação em um pipeline de enriquecimento", "Leitura"], rows: [
          ["O registro chega depois de a janela fechar", "Beam: atrasado; descartado por padrão, a menos que a tolerância seja permitida."],
          ["O dado de referência chega depois dos registros que precisam dele", "Não é coberto pelas fontes. Minha hipótese: tratar como gatilho de re-enriquecimento pela chave de consulta, não como dado atrasado."],
          ["Um registro atrasado altera um agregado anterior", "Vale o trade-off do modelo Dataflow: emitir uma correção ou aceitar o descarte."],
        ] },
      ],
    },
    {
      id: "gaps",
      title: "O que estas fontes não dizem",
      blocks: [
        { kind: "list", items: [
          "Nenhuma delas dá um número para o custo de re-enriquecer, então não tenho nenhum.",
          "A página do Airflow não define idempotência para tarefas. O post da Stripe trata de chamadas de API, não de jobs batch; transportá-lo é uma extensão minha.",
          "Li só parte do guia do Beam: as seções sobre watermarks e dados atrasados.",
          "Estas notas são uma lista inicial de perguntas para os meus próprios pipelines, não evidência de como eles se comportam.",
        ] },
      ],
    },
  ],
};
