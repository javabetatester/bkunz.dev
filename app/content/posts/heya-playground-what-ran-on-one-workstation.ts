import type { Post } from "./types";

const post: Post = {
  slug: "heya-playground-what-ran-on-one-workstation",
  category: "studies",
  date: "2026-11-18",
  published: "2026-11-21",
  title: "heya playground: what ran on one workstation",
  summary: "heya manages persistent Linux desktops on a fleet of hosts. This is the list of what was actually executed on one workstation: a pod under k3s, conformance suites per port, a machine moved between hosts, and a host bootstrap that is only golden-tested.",
  tags: ["heya", "k3s", "conformance", "kubernetes", "testing"],
  project: "versatile-sh",
  sections: [
    {
      id: "frame",
      title: "What heya is, technically",
      blocks: [
        { kind: "p", text: "heya is the computer and VM engine. In technical terms it manages persistent Linux desktops: a machine has a home volume, a lifecycle with an idle rule and a wake, a display that can be streamed, and a placement on a host. A runtime port starts it, a volume port keeps its files, an archive port backs them up and a scheduler picks the host." },
        { kind: "p", text: "The most useful file I have is the status document, which grades every item of the specification as Run, Built or Not built. This post keeps that discipline: each claim says what was executed and where. Everything ran on one Linux workstation. Nothing ran on a rented host." },
      ],
    },
    {
      id: "k3s",
      title: "A pod under a real kubelet",
      blocks: [
        { kind: "p", text: "The first spike run on 2026-11-17 emulated the pod with plain Docker containers. The same day, k3s v1.37.2 ran in one privileged Docker container, one node, and the pod of five containers with `hostUsers: false` started under a kubelet. Most rows are n = 1." },
        { kind: "table", head: ["Step", "Verdict", "Observation"], rows: [
          ["K1 pod start", "holds", "5 of 5 containers Running in one user namespace"],
          ["K2 browser sandbox", "holds, with a trap", "the runtime default profile gave No usable sandbox; a profile derived from the container runtime default worked"],
          ["K4 memory limits", "differs in places", "the whole desktop container is killed at its memory limit; one pid limit for the pod"],
          ["K7 network policy", "holds once synced, differs at start", "the first request of a new pod to a forbidden pod got through in 3 of 3 runs"],
          ["K9 start time", "measured", "2.52 to 2.55 s from apply to the first display banner, n = 5, image cached"],
        ] },
        { kind: "p", text: "K7 is the row I would not have guessed. A deny rule that applies a moment after the pod starts is not a fence from the first packet." },
      ],
    },
    {
      id: "conformance",
      title: "Conformance suites per port",
      blocks: [
        { kind: "p", text: "Each port has one suite package whose Run function takes a fixture, so the same cases run against every adapter that can run on this machine. A skip uses the same condition as the adapter's own real tests." },
        { kind: "list", items: [
          "Runtime: memory, Docker on the local daemon, Kubernetes on k3s.",
          "VolumeStore: memory, XFS project quotas inside a privileged container, Kubernetes on k3s with local-path. On k3s the suite asserts capability_unavailable for usage and pool usage.",
          "VolumeArchive: memory, and kopia 0.23.1 on a filesystem repository with a real file round trip.",
          "HostProvider, Scheduler, HostTelemetry, TokenSigner, Sink, Store and Outbox: memory or in-process adapters, plus Postgres for the store and a stateful fixture for the provider API.",
        ] },
        { kind: "p", text: "The status document says suites for ten ports, but its own matrix shows nine suites: the telemetry export port has none, only tests of its adapters. A thin-pool LVM adapter is also covered by a suite, in a privileged container with the kernel modules loaded." },
        { kind: "p", text: "Not run, and said so: the provider adapter against the real API, restic and ZFS and btrfs archive adapters because they are not built, and the container runtime under user namespaces or gVisor because this daemon has neither." },
      ],
    },
    {
      id: "move",
      title: "Moving a machine between hosts",
      blocks: [
        { kind: "p", text: "A test, TestMoveBetweenTwoHostsKeepsTheHome, runs a move on Docker with kopia: stop the machine, export its directory incrementally, import on the target, verify, switch the host, keep the source for a configured period. A failure leaves the machine stopped on the source. The hostname is not a function of the host, so a moved home opens under the same name." },
        { kind: "p", text: "Host loss and restore from backup run against fakes only. What is not run: a 10 GB home at a real restore rate and a target across the internet. The browser's own profile lock was not exercised." },
      ],
    },
    {
      id: "bootstrap",
      title: "Host bootstrap: golden-tested, never executed",
      blocks: [
        { kind: "p", text: "A bootstrap package renders the cloud-init user data for a server or agent host: packages, an XFS loop-file volume store with project quotas, subordinate id ranges, a kubelet configuration drop-in, the k3s flags, a seccomp profile, audit settings, manifests for a node reader and a TUN device plugin, a daily backup timer and a check script." },
        { kind: "p", text: "It is tested by golden files for a server and an agent, and by computed values for the kubelet's image-collection thresholds across disk sizes: 600 GB gives 98 and 96 percent and a 55 Gi reserve, 1200 gives 99 and 98 and 59 Gi. The pieces that can run on k3s did run there: the seccomp file, the device plugin and the admission policy. The rendered script itself has not been run on a Debian host. The measurement plan for sizing is also entirely not run." },
        { kind: "callout", tone: "warn", text: "Golden tests prove the output did not change. They do not prove it works. Until it runs on a real host, treat the bootstrap as unverified." },
      ],
    },
  ],
};

export default post;

export const es: Post = {
  slug: "heya-playground-what-ran-on-one-workstation",
  category: "studies",
  date: "2026-11-18",
  published: "2026-11-21",
  title: "heya playground: lo que se ejecutó en una estación de trabajo",
  summary: "heya gestiona escritorios Linux persistentes en una flota de hosts. Esta es la lista de lo que realmente se ejecutó en una estación de trabajo: un pod bajo k3s, suites de conformance por port, una máquina movida entre hosts y un bootstrap de host que solo tiene golden tests.",
  tags: ["heya", "k3s", "conformance", "kubernetes", "testing"],
  project: "versatile-sh",
  sections: [
    {
      id: "frame",
      title: "Qué es heya, técnicamente",
      blocks: [
        { kind: "p", text: "heya es el engine de computadoras y VMs. En términos técnicos gestiona escritorios Linux persistentes: una máquina tiene un volumen home, un ciclo de vida con una regla de idle y un wake, una pantalla que se puede transmitir y una ubicación en un host. Un runtime port la inicia, un volume port guarda sus archivos, un archive port los respalda y un scheduler elige el host." },
        { kind: "p", text: "El archivo más útil que tengo es el documento de estado, que califica cada ítem de la especificación como Run, Built o Not built. Este post mantiene esa disciplina: cada afirmación dice qué se ejecutó y dónde. Todo corrió en una estación de trabajo Linux. Nada corrió en un host alquilado." },
      ],
    },
    {
      id: "k3s",
      title: "Un pod bajo un kubelet real",
      blocks: [
        { kind: "p", text: "El primer spike, ejecutado el 2026-11-17, emulaba el pod con contenedores Docker simples. El mismo día, k3s v1.37.2 corrió en un contenedor Docker privilegiado, un nodo, y el pod de cinco contenedores con `hostUsers: false` arrancó bajo un kubelet. La mayoría de las filas son n = 1." },
        { kind: "table", head: ["Paso", "Veredicto", "Observación"], rows: [
          ["K1 pod start", "se sostiene", "5 de 5 contenedores Running en un mismo user namespace"],
          ["K2 browser sandbox", "se sostiene, con una trampa", "el perfil por defecto del runtime dio No usable sandbox; un perfil derivado del default del container runtime funcionó"],
          ["K4 memory limits", "difiere en algunos puntos", "todo el contenedor del escritorio se mata al llegar a su límite de memoria; un solo límite de pid para el pod"],
          ["K7 network policy", "se sostiene una vez sincronizada, difiere al inicio", "la primera solicitud de un pod nuevo a un pod prohibido pasó en 3 de 3 ejecuciones"],
          ["K9 start time", "medido", "2.52 a 2.55 s desde el apply hasta el primer banner de pantalla, n = 5, imagen en caché"],
        ] },
        { kind: "p", text: "K7 es la fila que no habría adivinado. Una regla de denegación que se aplica un momento después de que arranca el pod no es una valla desde el primer paquete." },
      ],
    },
    {
      id: "conformance",
      title: "Suites de conformance por port",
      blocks: [
        { kind: "p", text: "Cada port tiene un paquete de suite cuya función Run recibe un fixture, de modo que los mismos casos corren contra cada adapter que pueda ejecutarse en esta máquina. Un skip usa la misma condición que los tests reales del propio adapter." },
        { kind: "list", items: [
          "Runtime: memory, Docker en el daemon local, Kubernetes en k3s.",
          "VolumeStore: memory, cuotas de proyecto XFS dentro de un contenedor privilegiado, Kubernetes en k3s con local-path. En k3s la suite afirma capability_unavailable para el uso y el uso del pool.",
          "VolumeArchive: memory, y kopia 0.23.1 sobre un repositorio en sistema de archivos con un round trip real de archivos.",
          "HostProvider, Scheduler, HostTelemetry, TokenSigner, Sink, Store y Outbox: adapters en memoria o en proceso, más Postgres para el store y un fixture con estado para la API del provider.",
        ] },
        { kind: "p", text: "El documento de estado dice suites para diez ports, pero su propia matriz muestra nueve suites: el port de exportación de telemetría no tiene ninguna, solo tests de sus adapters. Un adapter LVM de thin-pool también está cubierto por una suite, en un contenedor privilegiado con los módulos del kernel cargados." },
        { kind: "p", text: "No ejecutado, y se dice: el adapter del provider contra la API real, los adapters de archivo restic, ZFS y btrfs porque no están construidos, y el container runtime bajo user namespaces o gVisor porque este daemon no tiene ninguno." },
      ],
    },
    {
      id: "move",
      title: "Mover una máquina entre hosts",
      blocks: [
        { kind: "p", text: "Un test, TestMoveBetweenTwoHostsKeepsTheHome, ejecuta un movimiento en Docker con kopia: detener la máquina, exportar su directorio de forma incremental, importar en el destino, verificar, cambiar el host, conservar el origen durante un período configurado. Un fallo deja la máquina detenida en el origen. El hostname no es función del host, así que un home movido se abre con el mismo nombre." },
        { kind: "p", text: "La pérdida de un host y la restauración desde backup se ejecutan solo contra fakes. Lo que no se ejecutó: un home de 10 GB a una tasa de restauración real y un destino a través de internet. El lock del perfil propio del navegador no se ejercitó." },
      ],
    },
    {
      id: "bootstrap",
      title: "Bootstrap del host: con golden tests, nunca ejecutado",
      blocks: [
        { kind: "p", text: "Un paquete de bootstrap genera el user data de cloud-init para un host servidor o agente: paquetes, un volume store de archivo loop XFS con cuotas de proyecto, rangos de ids subordinados, un drop-in de configuración del kubelet, los flags de k3s, un perfil seccomp, ajustes de audit, manifiestos para un node reader y un device plugin TUN, un timer diario de backup y un script de check." },
        { kind: "p", text: "Se prueba con golden files para un servidor y un agente, y con valores calculados para los umbrales de recolección de imágenes del kubelet según el tamaño del disco: 600 GB da 98 y 96 por ciento y una reserva de 55 Gi, 1200 da 99 y 98 y 59 Gi. Las piezas que pueden correr en k3s corrieron allí: el archivo seccomp, el device plugin y la política de admisión. El script generado en sí no se ha ejecutado en un host Debian. El plan de medición para dimensionar también está completamente sin ejecutar." },
        { kind: "callout", tone: "warn", text: "Los golden tests prueban que la salida no cambió. No prueban que funcione. Hasta que corra en un host real, trata el bootstrap como no verificado." },
      ],
    },
  ],
};

export const ptBr: Post = {
  slug: "heya-playground-what-ran-on-one-workstation",
  category: "studies",
  date: "2026-11-18",
  published: "2026-11-21",
  title: "heya playground: o que rodou em uma estação de trabalho",
  summary: "heya gerencia desktops Linux persistentes em uma frota de hosts. Esta é a lista do que foi realmente executado em uma estação de trabalho: um pod sob k3s, suítes de conformance por port, uma máquina movida entre hosts e um bootstrap de host que só tem golden tests.",
  tags: ["heya", "k3s", "conformance", "kubernetes", "testing"],
  project: "versatile-sh",
  sections: [
    {
      id: "frame",
      title: "O que é o heya, tecnicamente",
      blocks: [
        { kind: "p", text: "heya é o engine de computadores e VMs. Em termos técnicos ele gerencia desktops Linux persistentes: uma máquina tem um volume home, um ciclo de vida com uma regra de idle e um wake, uma tela que pode ser transmitida e uma posição em um host. Um runtime port a inicia, um volume port guarda seus arquivos, um archive port faz backup deles e um scheduler escolhe o host." },
        { kind: "p", text: "O arquivo mais útil que tenho é o documento de status, que classifica cada item da especificação como Run, Built ou Not built. Este post mantém essa disciplina: cada afirmação diz o que foi executado e onde. Tudo rodou em uma estação de trabalho Linux. Nada rodou em um host alugado." },
      ],
    },
    {
      id: "k3s",
      title: "Um pod sob um kubelet real",
      blocks: [
        { kind: "p", text: "O primeiro spike, rodado em 2026-11-17, emulava o pod com containers Docker simples. No mesmo dia, o k3s v1.37.2 rodou em um container Docker privilegiado, um nó, e o pod de cinco containers com `hostUsers: false` subiu sob um kubelet. A maioria das linhas é n = 1." },
        { kind: "table", head: ["Passo", "Veredicto", "Observação"], rows: [
          ["K1 pod start", "se sustenta", "5 de 5 containers Running em um mesmo user namespace"],
          ["K2 browser sandbox", "se sustenta, com uma armadilha", "o perfil padrão do runtime deu No usable sandbox; um perfil derivado do padrão do container runtime funcionou"],
          ["K4 memory limits", "difere em alguns pontos", "o container inteiro do desktop é morto ao atingir o limite de memória; um único limite de pid para o pod"],
          ["K7 network policy", "se sustenta depois de sincronizada, difere no início", "a primeira requisição de um pod novo para um pod proibido passou em 3 de 3 execuções"],
          ["K9 start time", "medido", "2.52 a 2.55 s do apply até o primeiro banner de tela, n = 5, imagem em cache"],
        ] },
        { kind: "p", text: "K7 é a linha que eu não teria adivinhado. Uma regra de negação que se aplica um instante depois de o pod subir não é uma cerca desde o primeiro pacote." },
      ],
    },
    {
      id: "conformance",
      title: "Suítes de conformance por port",
      blocks: [
        { kind: "p", text: "Cada port tem um pacote de suíte cuja função Run recebe um fixture, de modo que os mesmos casos rodam contra todo adapter que possa rodar nesta máquina. Um skip usa a mesma condição dos testes reais do próprio adapter." },
        { kind: "list", items: [
          "Runtime: memory, Docker no daemon local, Kubernetes no k3s.",
          "VolumeStore: memory, cotas de projeto XFS dentro de um container privilegiado, Kubernetes no k3s com local-path. No k3s a suíte afirma capability_unavailable para uso e uso do pool.",
          "VolumeArchive: memory, e kopia 0.23.1 sobre um repositório em sistema de arquivos com um round trip real de arquivos.",
          "HostProvider, Scheduler, HostTelemetry, TokenSigner, Sink, Store e Outbox: adapters em memória ou em processo, mais Postgres para o store e um fixture com estado para a API do provider.",
        ] },
        { kind: "p", text: "O documento de status diz suítes para dez ports, mas a própria matriz mostra nove suítes: o port de exportação de telemetria não tem nenhuma, só testes dos seus adapters. Um adapter LVM de thin-pool também é coberto por uma suíte, em um container privilegiado com os módulos do kernel carregados." },
        { kind: "p", text: "Não rodado, e dito: o adapter do provider contra a API real, os adapters de arquivamento restic, ZFS e btrfs porque não foram construídos, e o container runtime sob user namespaces ou gVisor porque este daemon não tem nenhum." },
      ],
    },
    {
      id: "move",
      title: "Mover uma máquina entre hosts",
      blocks: [
        { kind: "p", text: "Um teste, TestMoveBetweenTwoHostsKeepsTheHome, roda uma movimentação no Docker com kopia: parar a máquina, exportar o diretório de forma incremental, importar no destino, verificar, trocar o host, manter a origem por um período configurado. Uma falha deixa a máquina parada na origem. O hostname não é função do host, então um home movido abre com o mesmo nome." },
        { kind: "p", text: "Perda de host e restauração a partir de backup rodam só contra fakes. O que não foi rodado: um home de 10 GB a uma taxa real de restauração e um destino pela internet. O lock do perfil do próprio navegador não foi exercitado." },
      ],
    },
    {
      id: "bootstrap",
      title: "Bootstrap do host: com golden tests, nunca executado",
      blocks: [
        { kind: "p", text: "Um pacote de bootstrap gera o user data do cloud-init para um host servidor ou agente: pacotes, um volume store de arquivo loop XFS com cotas de projeto, faixas de ids subordinados, um drop-in de configuração do kubelet, as flags do k3s, um perfil seccomp, configurações de audit, manifestos para um node reader e um device plugin TUN, um timer diário de backup e um script de check." },
        { kind: "p", text: "Ele é testado por golden files para um servidor e um agente, e por valores calculados para os limites de coleta de imagens do kubelet conforme o tamanho do disco: 600 GB dá 98 e 96 por cento e uma reserva de 55 Gi, 1200 dá 99 e 98 e 59 Gi. As peças que podem rodar no k3s rodaram lá: o arquivo seccomp, o device plugin e a política de admissão. O script gerado em si não foi rodado em um host Debian. O plano de medição para dimensionamento também está inteiramente sem rodar." },
        { kind: "callout", tone: "warn", text: "Golden tests provam que a saída não mudou. Não provam que funciona. Até rodar em um host real, trate o bootstrap como não verificado." },
      ],
    },
  ],
};
