import type { Post } from "./types";

const post: Post = {
  slug: "research-method-rewritten-from-failures",
  category: "studies",
  date: "2026-11-12",
  published: "2026-11-21",
  title: "A research method rewritten from its own failures",
  summary: "The research harness's method file lists each rule next to the mistake that produced it: proof levels, a judge who is not the auditor, and an audit sample drawn by a seeded script.",
  tags: ["research", "method", "audit", "evidence"],
  project: "versatile-sh",
  sections: [
    {
      id: "form",
      title: "A table of rules and mistakes",
      blocks: [
        { kind: "p", text: "The research harness has one method file, rewritten on 2026-11-12 (commit `7575561`, one generic method for any study) from what the first loop of 2026-11-05 did well and badly. A lesson from a later study was added on 2026-11-13. I like the file's shape: every rule has a column for the mistake it prevents and a column for evidence, a path and often a line." },
        { kind: "p", text: "Below are the rules I think carry the most weight, with the numbers as the file gives them. These are the harness's records, not my measurements. I did not rerun any study." },
      ],
    },
    {
      id: "proof",
      title: "Proof levels",
      blocks: [
        { kind: "p", text: "Every claim about our own code or design carries one of three levels." },
        { kind: "table", head: ["Level", "Means", "Evidence"], rows: [
          ["Read", "The code or document says so", "path:line at a pinned commit"],
          ["Specified", "A public contract covers it", "The spec, version, section"],
          ["Run", "It was executed and observed", "The command, result, commit, date"],
        ] },
        { kind: "p", text: "A claim with none of the three is a hypothesis and never enters as fact. The mistake behind it: statements like replaceable or works offline made from reading. The file records that every runs-with-act claim was downgraded in round 1." },
        { kind: "p", text: "The rule I find sharpest is that run is narrow. A spike must run the part of the claim the cell's value rests on, in the kind of deployment and with the kind of sign-in the cell describes. One spike used a development sign-in that a deployment shared by many organizations refuses. Four cells fell from partial at run to no at read, and three more were lowered because a spike ran one half of a two-part value." },
      ],
    },
    {
      id: "roles",
      title: "The judge is not the auditor",
      blocks: [
        { kind: "p", text: "The judge wrote no proposal. The auditor is not the judge. A reviewer gets the sources, never the conclusion. The mistake behind this: in one study the reviewer inherited the author's frame and kept it. The same study listed 13 seams and missed model connections, an agent endpoint and teams, because its inventory began from the code, not from the person who uses the result." },
        { kind: "p", text: "The same separation closes a study: a closing pass has a judge who corrects, then an auditor, not that judge, who checks only the corrections. Without it, the file notes, a final audit gets filed and not acted on, or a lead edits cells to answer it." },
      ],
    },
    {
      id: "numbers",
      title: "Single passes are drafts",
      blocks: [
        { kind: "p", text: "The file's evidence for treating a single pass as a draft: round 2 of the first loop overturned 25 statements and round 3 overturned 26. One study had four claims corrected the same day by a review. That loop stopped at round 3 of 8 with three of five criteria failing, and the owner paused it." },
        { kind: "callout", tone: "note", text: "These are counts of overturned statements, not error rates. The file reports them as the reason a pass is a draft, and I read them the same way." },
      ],
    },
    {
      id: "sample",
      title: "Seeded samples and where errors come from",
      blocks: [
        { kind: "p", text: "The auditor samples in three pools: cells changed this round, cells never audited, and a draw from the rest. It reports the error rate per pool. The stop rule reads a sample drawn from the whole result by a script with a recorded seed, because an auditor-chosen sample, or one full of cells just written, measures the last round and not the result." },
        { kind: "p", text: "The per-pool rate told the story in the studio modularity study. While only the auditor read cited lines, the audit error was 0.227, 0.075 and 0.104 across rounds. Cells written under the writer's own check, where the writer prints the cited lines and reads them against the sentence first, were audited at 0.043. The stop criterion is under 5 percent on at least 30 cells." },
        { kind: "p", text: "When the error comes from old text, the next round is a verification round. In that study it made 217 repairs across 163 of 222 cells and brought the rate of the whole map to 0.0375." },
      ],
    },
    {
      id: "lesson",
      title: "The last rule",
      blocks: [
        { kind: "p", text: "The method's final row says the method is amended after every study. Its evidence column points at the file itself. I take that as the point of the document: the table is a log of mistakes with fixes attached." },
        { kind: "p", text: "A caveat on what I know. The file cites evidence under a study branch that had not merged when it was written, so some of those paths could not be opened from the main branch at that time. I read the method; I did not audit the audits." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  ...post,
  title: "Un método de investigación reescrito a partir de sus propios fallos",
  summary: "El archivo de método del research harness lista cada regla junto al error que la produjo: niveles de prueba, un juez que no es el auditor y una muestra de auditoría sacada por un script con semilla.",
  sections: [
    {
      id: "form",
      title: "Una tabla de reglas y errores",
      blocks: [
        { kind: "p", text: "El research harness tiene un archivo de método, reescrito el 2026-11-12 (commit `7575561`, un método genérico para cualquier estudio) a partir de lo que el primer loop del 2026-11-05 hizo bien y mal. El 2026-11-13 se agregó una lección de un estudio posterior. Me gusta la forma del archivo: cada regla tiene una columna con el error que previene y otra con la evidencia, una ruta y muchas veces una línea." },
        { kind: "p", text: "Abajo están las reglas que creo que más pesan, con los números tal como los da el archivo. Son registros del harness, no mediciones mías. No volví a correr ningún estudio." },
      ],
    },
    {
      id: "proof",
      title: "Niveles de prueba",
      blocks: [
        { kind: "p", text: "Toda afirmación sobre nuestro propio código o diseño lleva uno de tres niveles." },
        { kind: "table", head: ["Nivel", "Significa", "Evidencia"], rows: [
          ["Read", "El código o el documento lo dice", "path:line en un commit fijado"],
          ["Specified", "Un contrato público lo cubre", "La spec, versión, sección"],
          ["Run", "Se ejecutó y se observó", "El comando, el resultado, el commit, la fecha"],
        ] },
        { kind: "p", text: "Una afirmación sin ninguno de los tres es una hipótesis y nunca entra como hecho. El error detrás: afirmaciones como reemplazable o funciona offline hechas a partir de la lectura. El archivo registra que toda afirmación de runs-with-act fue rebajada en la ronda 1." },
        { kind: "p", text: "La regla que me parece más afilada es que run es estrecho. Un spike debe ejecutar la parte de la afirmación en la que descansa el valor de la celda, en el tipo de despliegue y con el tipo de inicio de sesión que describe la celda. Un spike usó un inicio de sesión de desarrollo que un despliegue compartido por muchas organizaciones rechaza. Cuatro celdas bajaron de partial en run a no en read, y tres más se rebajaron porque un spike ejecutó una mitad de un valor de dos partes." },
      ],
    },
    {
      id: "roles",
      title: "El juez no es el auditor",
      blocks: [
        { kind: "p", text: "El juez no escribió ninguna propuesta. El auditor no es el juez. Un revisor recibe las fuentes, nunca la conclusión. El error detrás: en un estudio el revisor heredó el marco del autor y lo conservó. Ese mismo estudio listó 13 seams y omitió conexiones de modelos, un endpoint de agente y equipos, porque su inventario partió del código y no de la persona que usa el resultado." },
        { kind: "p", text: "La misma separación cierra un estudio: una pasada de cierre tiene un juez que corrige y luego un auditor, que no es ese juez, que verifica solo las correcciones. Sin eso, anota el archivo, una auditoría final se archiva sin actuar sobre ella, o un líder edita celdas para responderle." },
      ],
    },
    {
      id: "numbers",
      title: "Las pasadas únicas son borradores",
      blocks: [
        { kind: "p", text: "La evidencia del archivo para tratar una pasada única como borrador: la ronda 2 del primer loop revirtió 25 afirmaciones y la ronda 3 revirtió 26. En un estudio, una revisión corrigió cuatro afirmaciones el mismo día. Ese loop se detuvo en la ronda 3 de 8 con tres de cinco criterios fallando, y el dueño lo pausó." },
        { kind: "callout", tone: "note", text: "Son conteos de afirmaciones revertidas, no tasas de error. El archivo los reporta como la razón de que una pasada sea un borrador, y yo los leo igual." },
      ],
    },
    {
      id: "sample",
      title: "Muestras con semilla y de dónde vienen los errores",
      blocks: [
        { kind: "p", text: "El auditor muestrea en tres grupos: celdas cambiadas en esta ronda, celdas nunca auditadas y un sorteo del resto. Reporta la tasa de error por grupo. La regla de parada lee una muestra sacada de todo el resultado por un script con una semilla registrada, porque una muestra elegida por el auditor, o llena de celdas recién escritas, mide la última ronda y no el resultado." },
        { kind: "p", text: "La tasa por grupo contó la historia en el estudio de modularidad del studio. Mientras solo el auditor leía las líneas citadas, el error de auditoría fue 0.227, 0.075 y 0.104 a lo largo de las rondas. Las celdas escritas bajo la verificación propia del autor, donde el autor imprime las líneas citadas y las lee contra la frase primero, se auditaron en 0.043. El criterio de parada es menos de 5 por ciento en al menos 30 celdas." },
        { kind: "p", text: "Cuando el error viene de texto antiguo, la ronda siguiente es una ronda de verificación. En ese estudio hizo 217 reparaciones en 163 de 222 celdas y llevó la tasa de todo el mapa a 0.0375." },
      ],
    },
    {
      id: "lesson",
      title: "La última regla",
      blocks: [
        { kind: "p", text: "La fila final del método dice que el método se enmienda después de cada estudio. Su columna de evidencia apunta al propio archivo. Lo tomo como el sentido del documento: la tabla es un registro de errores con sus arreglos adjuntos." },
        { kind: "p", text: "Una salvedad sobre lo que sé. El archivo cita evidencia bajo una rama de estudio que no se había mergeado cuando se escribió, así que algunas de esas rutas no se podían abrir desde la rama principal en ese momento. Leí el método; no audité las auditorías." },
      ],
    },
  ],
};

export const ptBr: Post = {
  ...post,
  title: "Um método de pesquisa reescrito a partir das próprias falhas",
  summary: "O arquivo de método do research harness lista cada regra ao lado do erro que a produziu: níveis de prova, um juiz que não é o auditor e uma amostra de auditoria sorteada por um script com seed.",
  sections: [
    {
      id: "form",
      title: "Uma tabela de regras e erros",
      blocks: [
        { kind: "p", text: "O research harness tem um arquivo de método, reescrito em 2026-11-12 (commit `7575561`, um método genérico para qualquer estudo) a partir do que o primeiro loop de 2026-11-05 fez bem e mal. Uma lição de um estudo posterior foi acrescentada em 2026-11-13. Gosto do formato do arquivo: cada regra tem uma coluna com o erro que ela previne e outra com a evidência, um caminho e muitas vezes uma linha." },
        { kind: "p", text: "Abaixo estão as regras que acho que mais pesam, com os números como o arquivo os dá. São registros do harness, não medições minhas. Não rodei nenhum estudo de novo." },
      ],
    },
    {
      id: "proof",
      title: "Níveis de prova",
      blocks: [
        { kind: "p", text: "Toda afirmação sobre nosso próprio código ou design carrega um de três níveis." },
        { kind: "table", head: ["Nível", "Significa", "Evidência"], rows: [
          ["Read", "O código ou o documento diz isso", "path:line em um commit fixado"],
          ["Specified", "Um contrato público cobre isso", "A spec, versão, seção"],
          ["Run", "Foi executado e observado", "O comando, o resultado, o commit, a data"],
        ] },
        { kind: "p", text: "Uma afirmação sem nenhum dos três é uma hipótese e nunca entra como fato. O erro por trás: afirmações como substituível ou funciona offline feitas a partir da leitura. O arquivo registra que toda afirmação de runs-with-act foi rebaixada na rodada 1." },
        { kind: "p", text: "A regra que acho mais afiada é que run é estreito. Um spike precisa executar a parte da afirmação em que o valor da célula se apoia, no tipo de deploy e com o tipo de login que a célula descreve. Um spike usou um login de desenvolvimento que um deploy compartilhado por muitas organizações recusa. Quatro células caíram de partial em run para no em read, e mais três foram rebaixadas porque um spike executou uma metade de um valor de duas partes." },
      ],
    },
    {
      id: "roles",
      title: "O juiz não é o auditor",
      blocks: [
        { kind: "p", text: "O juiz não escreveu nenhuma proposta. O auditor não é o juiz. Um revisor recebe as fontes, nunca a conclusão. O erro por trás: em um estudo o revisor herdou o enquadramento do autor e o manteve. O mesmo estudo listou 13 seams e deixou passar conexões de modelos, um endpoint de agente e equipes, porque seu inventário partiu do código e não da pessoa que usa o resultado." },
        { kind: "p", text: "A mesma separação fecha um estudo: uma passada de fechamento tem um juiz que corrige e depois um auditor, que não é esse juiz, que confere só as correções. Sem isso, registra o arquivo, uma auditoria final é arquivada sem ação, ou um líder edita células para respondê-la." },
      ],
    },
    {
      id: "numbers",
      title: "Passadas únicas são rascunhos",
      blocks: [
        { kind: "p", text: "A evidência do arquivo para tratar uma passada única como rascunho: a rodada 2 do primeiro loop derrubou 25 afirmações e a rodada 3 derrubou 26. Um estudo teve quatro afirmações corrigidas no mesmo dia por uma revisão. Esse loop parou na rodada 3 de 8 com três de cinco critérios falhando, e o dono o pausou." },
        { kind: "callout", tone: "note", text: "São contagens de afirmações derrubadas, não taxas de erro. O arquivo as relata como o motivo de uma passada ser um rascunho, e eu as leio do mesmo jeito." },
      ],
    },
    {
      id: "sample",
      title: "Amostras com seed e de onde vêm os erros",
      blocks: [
        { kind: "p", text: "O auditor amostra em três grupos: células alteradas nesta rodada, células nunca auditadas e um sorteio do restante. Ele relata a taxa de erro por grupo. A regra de parada lê uma amostra sorteada de todo o resultado por um script com seed registrada, porque uma amostra escolhida pelo auditor, ou cheia de células recém-escritas, mede a última rodada e não o resultado." },
        { kind: "p", text: "A taxa por grupo contou a história no estudo de modularidade do studio. Enquanto só o auditor lia as linhas citadas, o erro de auditoria foi 0.227, 0.075 e 0.104 ao longo das rodadas. As células escritas sob a checagem do próprio autor, em que o autor imprime as linhas citadas e as lê contra a frase primeiro, foram auditadas em 0.043. O critério de parada é abaixo de 5 por cento em pelo menos 30 células." },
        { kind: "p", text: "Quando o erro vem de texto antigo, a rodada seguinte é uma rodada de verificação. Nesse estudo ela fez 217 reparos em 163 de 222 células e levou a taxa do mapa inteiro a 0.0375." },
      ],
    },
    {
      id: "lesson",
      title: "A última regra",
      blocks: [
        { kind: "p", text: "A linha final do método diz que o método é emendado depois de cada estudo. Sua coluna de evidência aponta para o próprio arquivo. Entendo isso como o sentido do documento: a tabela é um log de erros com as correções anexadas." },
        { kind: "p", text: "Uma ressalva sobre o que sei. O arquivo cita evidência sob uma branch de estudo que ainda não tinha sido mergeada quando foi escrito, então alguns desses caminhos não podiam ser abertos a partir da branch principal na época. Li o método; não auditei as auditorias." },
      ],
    },
  ],
};
