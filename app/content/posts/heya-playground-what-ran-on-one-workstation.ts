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
