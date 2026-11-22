import type { Post } from "./types";

const post: Post = {
  slug: "evals-that-decide",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Evals that decide",
  summary: "How I build evals for an AI assistant so they can settle a ship-or-not question: seeded paired runs, deterministic checks before any LLM judge, infra errors kept out of the pass rate, and prompt-leak canaries.",
  tags: ["evals", "llm", "testing", "assistant"],
  project: "versatile-sh",
  sections: [
    {
      id: "decide",
      title: "An eval has to be able to say no",
      blocks: [
        { kind: "p", text: "I build an AI assistant at work: a conversational assistant that answers questions and runs actions over business data. Most changes I make to it are small and look good in a demo. A demo cannot tell me whether the change helped, so I want an eval whose result decides." },
        { kind: "p", text: "Four habits make that possible. This post is about them, with numbers from my own change records. Where something is my convention rather than a measured result, I say so." },
      ],
    },
    {
      id: "paired",
      title: "A seeded, paired baseline and candidate",
      blocks: [
        { kind: "p", text: "The items come from a generator with a recorded seed, so another person can regenerate the same set. The same items run through the baseline build and the candidate, with the same pinned provider and no fallbacks, at the same time. A fallback that fires in one arm only is a hidden difference." },
        { kind: "p", text: "I read the result as a 2x2 table and test the discordant items with an exact McNemar test (see the post on it). Two real examples from the records, each on 52 items:" },
        {
          kind: "table",
          head: ["Seed", "Baseline", "Candidate", "Fixed / broken", "Exact p"],
          rows: [
            ["7101", "3/52", "50/52", "47 / 0", "1.4e-14"],
            ["7202 (fresh)", "2/52", "48/52", "46 / 0", "2.8e-14"],
          ],
        },
        { kind: "p", text: "The second line matters most. A fresh seed after the change was tuned guards against having fitted the first set. A null result is recorded the same way: one run of 42 comparison items went from 5 to 6 correct, 2 fixed and 1 broken, p = 1.0. The record says what it says: no evidence of a gain." },
      ],
    },
    {
      id: "deterministic",
      title: "Deterministic checks before a judge",
      blocks: [
        { kind: "p", text: "Anything a program can check, a program checks. Does every number in the reply appear in the data the tool returned? Is there a bullet list whose length contradicts the count announced just before it? Does the reply contain payment data when it must not? These are string and set operations, they are free, and they give the same answer twice." },
        { kind: "p", text: "A model judge handles what is left: is the answer right, is it helpful, is the period correct. I use two blind graders who do not know which arm produced a transcript, and a third on disagreements. I report agreement as kappa. In one run it was 0.56, low enough that I had the third grader read every item rather than only the disputed ones." },
        { kind: "p", text: "When I considered a model judge as a runtime guard against leaking the system prompt, I rejected it for two reasons recorded in the decision: it is not deterministic, and it is paid on every turn. A fingerprint check was tuned on 146 real assistant answers and 130 real chat replies, and none of them tripped it." },
      ],
    },
    {
      id: "infra",
      title: "Infra errors are not failures",
      blocks: [
        { kind: "p", text: "A timeout from the model provider, an unauthorised query from a fixture, a harness that forgot a store: none of those says anything about the change. If they count as failures the pass rate measures my test rig." },
        { kind: "p", text: "My records have a concrete case. Two comparison runs were later found to have been taken with a probe harness that lacked a draft store, so every single ask skipped the path under test and went to the slower planner. The note went into the record with the date and time of the fix. In another run, 3 of 15 misses were fixture permissions, not behaviour, and the record says so." },
        { kind: "p", text: "My convention, not a measured result: an item whose run ended in an infra error is excluded from the pass rate and listed separately with its count. If that count is large, the run is not a result and I re-run it." },
        { kind: "callout", tone: "warn", text: "Exclusion has a cost. If the candidate causes more timeouts, dropping them flatters it. I report the excluded count per arm, and a difference in that count is itself a finding." },
      ],
    },
    {
      id: "canaries",
      title: "Prompt-leak canaries",
      blocks: [
        { kind: "p", text: "Telling a model never to reveal its prompt is not a control: an injected message can override it. So the check sits at the output edge and is deterministic." },
        { kind: "p", text: "One part is a canary: a fixed prefix plus 16 random hex digits, generated once per process and added to the model input as one extra system line. If that token ever appears in an output, the prompt leaked. The other part is a set of 5-word fingerprints of the static prompt text. A message is flagged on the canary, or on 3 non-overlapping fingerprint hits." },
        { kind: "p", text: "The guard ships in observe mode by default: it logs and does not block, so I can read false positives in real traffic before I turn blocking on. The canary line enters the prompt only in block mode, because anything that changes what the model sees ships off by default." },
        { kind: "list", items: [
          "Known gap, from the record: a leak shorter than 15 prompt words that carries no canary passes.",
          "Known gap: a paraphrase that shares no 5-word run with the prompt passes.",
          "Not done yet: the canary is not wired into my eval runner, so today it protects traffic, not benchmarks.",
        ] },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "evals-that-decide",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Evals que deciden",
  summary: "Cómo construyo evals para un asistente de IA de modo que puedan zanjar la pregunta de lanzar o no: ejecuciones pareadas con seed, checks deterministas antes de cualquier LLM judge, errores de infra fuera de la tasa de aciertos y canaries de fuga de prompt.",
  tags: ["evals", "llm", "testing", "assistant"],
  project: "versatile-sh",
  sections: [
    {
      id: "decide",
      title: "Un eval tiene que poder decir que no",
      blocks: [
        { kind: "p", text: "Construyo un asistente de IA en el trabajo: un asistente conversacional que responde preguntas y ejecuta acciones sobre datos de negocio. La mayoría de los cambios que le hago son pequeños y se ven bien en una demo. Una demo no me dice si el cambio ayudó, así que quiero un eval cuyo resultado decida." },
        { kind: "p", text: "Cuatro hábitos lo hacen posible. Este post trata de ellos, con números de mis propios registros de cambios. Donde algo es una convención mía y no un resultado medido, lo digo." },
      ],
    },
    {
      id: "paired",
      title: "Un baseline y un candidate pareados y con seed",
      blocks: [
        { kind: "p", text: "Los ítems vienen de un generador con una seed registrada, de modo que otra persona puede regenerar el mismo conjunto. Los mismos ítems pasan por la build baseline y por la candidate, con el mismo proveedor fijado y sin fallbacks, al mismo tiempo. Un fallback que se dispara solo en un brazo es una diferencia oculta." },
        { kind: "p", text: "Leo el resultado como una tabla 2x2 y pruebo los ítems discordantes con un test exacto de McNemar (ver el post sobre él). Dos ejemplos reales de los registros, cada uno con 52 ítems:" },
        {
          kind: "table",
          head: ["Seed", "Baseline", "Candidate", "Arreglados / rotos", "p exacto"],
          rows: [
            ["7101", "3/52", "50/52", "47 / 0", "1.4e-14"],
            ["7202 (fresh)", "2/52", "48/52", "46 / 0", "2.8e-14"],
          ],
        },
        { kind: "p", text: "La segunda fila es la que más importa. Una seed nueva después de afinar el cambio protege contra haber ajustado el primer conjunto. Un resultado nulo se registra igual: una ejecución de 42 ítems de comparación pasó de 5 a 6 correctos, 2 arreglados y 1 roto, p = 1.0. El registro dice lo que dice: no hay evidencia de mejora." },
      ],
    },
    {
      id: "deterministic",
      title: "Checks deterministas antes de un judge",
      blocks: [
        { kind: "p", text: "Todo lo que un programa puede comprobar, lo comprueba un programa. ¿Cada número de la respuesta aparece en los datos que devolvió la tool? ¿Hay una lista con viñetas cuya longitud contradice la cantidad anunciada justo antes? ¿La respuesta contiene datos de pago cuando no debe? Son operaciones de strings y conjuntos, son gratis y dan la misma respuesta dos veces." },
        { kind: "p", text: "Un judge basado en modelo se ocupa de lo que queda: si la respuesta es correcta, si es útil, si el período es el correcto. Uso dos graders ciegos que no saben qué brazo produjo una transcripción, y un tercero para los desacuerdos. Reporto el acuerdo como kappa. En una ejecución fue 0.56, lo bastante bajo como para que el tercer grader leyera todos los ítems y no solo los disputados." },
        { kind: "p", text: "Cuando consideré un judge basado en modelo como guard en runtime contra la fuga del system prompt, lo rechacé por dos razones registradas en la decisión: no es determinista y se paga en cada turno. Un check de fingerprints se afinó con 146 respuestas reales del asistente y 130 respuestas reales de chat, y ninguna lo disparó." },
      ],
    },
    {
      id: "infra",
      title: "Los errores de infra no son fallos",
      blocks: [
        { kind: "p", text: "Un timeout del proveedor del modelo, una consulta no autorizada desde un fixture, un harness que olvidó un store: nada de eso dice nada sobre el cambio. Si cuentan como fallos, la tasa de aciertos mide mi banco de pruebas." },
        { kind: "p", text: "Mis registros tienen un caso concreto. Se descubrió después que dos ejecuciones de comparación se tomaron con un probe harness al que le faltaba un draft store, así que cada ask saltaba el camino bajo prueba y pasaba al planner más lento. La nota entró en el registro con la fecha y hora de la corrección. En otra ejecución, 3 de 15 fallos eran permisos del fixture, no comportamiento, y el registro lo dice." },
        { kind: "p", text: "Mi convención, no un resultado medido: un ítem cuya ejecución terminó en error de infra se excluye de la tasa de aciertos y se lista aparte con su conteo. Si ese conteo es grande, la ejecución no es un resultado y la repito." },
        { kind: "callout", tone: "warn", text: "La exclusión tiene un costo. Si el candidate causa más timeouts, descartarlos lo favorece. Reporto el conteo de excluidos por brazo, y una diferencia en ese conteo es en sí un hallazgo." },
      ],
    },
    {
      id: "canaries",
      title: "Canaries de fuga de prompt",
      blocks: [
        { kind: "p", text: "Decirle a un modelo que nunca revele su prompt no es un control: un mensaje inyectado puede anularlo. Así que el check está en el borde de salida y es determinista." },
        { kind: "p", text: "Una parte es un canary: un prefijo fijo más 16 dígitos hex aleatorios, generado una vez por proceso y añadido a la entrada del modelo como una línea de sistema extra. Si ese token aparece alguna vez en una salida, el prompt se filtró. La otra parte es un conjunto de fingerprints de 5 palabras del texto estático del prompt. Un mensaje se marca por el canary, o por 3 coincidencias de fingerprint sin solapamiento." },
        { kind: "p", text: "El guard sale en modo observe por defecto: registra y no bloquea, para que pueda leer falsos positivos en tráfico real antes de activar el bloqueo. La línea del canary entra en el prompt solo en modo block, porque todo lo que cambia lo que ve el modelo sale desactivado por defecto." },
        { kind: "list", items: [
          "Brecha conocida, del registro: una fuga de menos de 15 palabras del prompt que no lleva canary pasa.",
          "Brecha conocida: una paráfrasis que no comparte ninguna secuencia de 5 palabras con el prompt pasa.",
          "Aún no hecho: el canary no está conectado a mi runner de evals, así que hoy protege el tráfico, no los benchmarks.",
        ] },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "evals-that-decide",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Evals que decidem",
  summary: "Como construo evals para um assistente de IA de modo que possam resolver a pergunta de lançar ou não: execuções pareadas com seed, checks determinísticos antes de qualquer LLM judge, erros de infra fora da taxa de acerto e canaries de vazamento de prompt.",
  tags: ["evals", "llm", "testing", "assistant"],
  project: "versatile-sh",
  sections: [
    {
      id: "decide",
      title: "Um eval precisa poder dizer não",
      blocks: [
        { kind: "p", text: "Construo um assistente de IA no trabalho: um assistente conversacional que responde perguntas e executa ações sobre dados de negócio. A maioria das mudanças que faço nele é pequena e parece boa numa demo. Uma demo não me diz se a mudança ajudou, então quero um eval cujo resultado decida." },
        { kind: "p", text: "Quatro hábitos tornam isso possível. Este post é sobre eles, com números dos meus próprios registros de mudanças. Onde algo é convenção minha e não resultado medido, eu digo." },
      ],
    },
    {
      id: "paired",
      title: "Um baseline e um candidate pareados e com seed",
      blocks: [
        { kind: "p", text: "Os itens vêm de um gerador com uma seed registrada, de modo que outra pessoa pode regenerar o mesmo conjunto. Os mesmos itens passam pela build baseline e pela candidate, com o mesmo provedor fixado e sem fallbacks, ao mesmo tempo. Um fallback que dispara em só um braço é uma diferença escondida." },
        { kind: "p", text: "Leio o resultado como uma tabela 2x2 e testo os itens discordantes com um teste exato de McNemar (veja o post sobre ele). Dois exemplos reais dos registros, cada um com 52 itens:" },
        {
          kind: "table",
          head: ["Seed", "Baseline", "Candidate", "Corrigidos / quebrados", "p exato"],
          rows: [
            ["7101", "3/52", "50/52", "47 / 0", "1.4e-14"],
            ["7202 (fresh)", "2/52", "48/52", "46 / 0", "2.8e-14"],
          ],
        },
        { kind: "p", text: "A segunda linha é a que mais importa. Uma seed nova depois que a mudança foi ajustada protege contra ter se ajustado ao primeiro conjunto. Um resultado nulo é registrado do mesmo jeito: uma execução de 42 itens de comparação foi de 5 para 6 corretos, 2 corrigidos e 1 quebrado, p = 1.0. O registro diz o que diz: nenhuma evidência de ganho." },
      ],
    },
    {
      id: "deterministic",
      title: "Checks determinísticos antes de um judge",
      blocks: [
        { kind: "p", text: "Tudo que um programa pode verificar, um programa verifica. Todo número da resposta aparece nos dados que a tool devolveu? Existe uma lista com marcadores cujo tamanho contradiz a contagem anunciada logo antes? A resposta contém dados de pagamento quando não deve? São operações de strings e conjuntos, são de graça e dão a mesma resposta duas vezes." },
        { kind: "p", text: "Um judge baseado em modelo cuida do que sobra: a resposta está certa, é útil, o período está correto. Uso dois graders cegos que não sabem qual braço produziu uma transcrição, e um terceiro para os desacordos. Reporto a concordância como kappa. Em uma execução foi 0.56, baixo o bastante para que eu fizesse o terceiro grader ler todos os itens, e não só os disputados." },
        { kind: "p", text: "Quando considerei um judge baseado em modelo como guard em runtime contra o vazamento do system prompt, rejeitei por dois motivos registrados na decisão: ele não é determinístico e é pago a cada turno. Um check de fingerprints foi ajustado com 146 respostas reais do assistente e 130 respostas reais de chat, e nenhuma o disparou." },
      ],
    },
    {
      id: "infra",
      title: "Erros de infra não são falhas",
      blocks: [
        { kind: "p", text: "Um timeout do provedor do modelo, uma consulta não autorizada vinda de um fixture, um harness que esqueceu um store: nada disso diz nada sobre a mudança. Se contam como falhas, a taxa de acerto mede a minha bancada de testes." },
        { kind: "p", text: "Meus registros têm um caso concreto. Descobriu-se depois que duas execuções de comparação foram feitas com um probe harness sem um draft store, então cada ask pulava o caminho sob teste e ia para o planner mais lento. A nota entrou no registro com a data e a hora da correção. Em outra execução, 3 de 15 erros eram permissões do fixture, não comportamento, e o registro diz isso." },
        { kind: "p", text: "Minha convenção, não um resultado medido: um item cuja execução terminou em erro de infra é excluído da taxa de acerto e listado à parte com a sua contagem. Se essa contagem é grande, a execução não é um resultado e eu a refaço." },
        { kind: "callout", tone: "warn", text: "A exclusão tem um custo. Se o candidate causa mais timeouts, descartá-los o favorece. Reporto a contagem de excluídos por braço, e uma diferença nessa contagem já é um achado." },
      ],
    },
    {
      id: "canaries",
      title: "Canaries de vazamento de prompt",
      blocks: [
        { kind: "p", text: "Dizer a um modelo para nunca revelar seu prompt não é um controle: uma mensagem injetada pode sobrescrevê-lo. Então o check fica na borda de saída e é determinístico." },
        { kind: "p", text: "Uma parte é um canary: um prefixo fixo mais 16 dígitos hex aleatórios, gerado uma vez por processo e adicionado à entrada do modelo como uma linha de sistema extra. Se esse token aparecer em alguma saída, o prompt vazou. A outra parte é um conjunto de fingerprints de 5 palavras do texto estático do prompt. Uma mensagem é sinalizada pelo canary, ou por 3 acertos de fingerprint sem sobreposição." },
        { kind: "p", text: "O guard sai em modo observe por padrão: registra e não bloqueia, para que eu possa ler falsos positivos em tráfego real antes de ligar o bloqueio. A linha do canary só entra no prompt no modo block, porque tudo que muda o que o modelo vê sai desligado por padrão." },
        { kind: "list", items: [
          "Lacuna conhecida, do registro: um vazamento de menos de 15 palavras do prompt que não carrega canary passa.",
          "Lacuna conhecida: uma paráfrase que não compartilha nenhuma sequência de 5 palavras com o prompt passa.",
          "Ainda não feito: o canary não está ligado ao meu runner de evals, então hoje ele protege o tráfego, não os benchmarks.",
        ] },
      ],
    },
  ],
};
