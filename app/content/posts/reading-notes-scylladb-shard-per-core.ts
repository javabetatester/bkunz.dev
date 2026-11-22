import type { Post } from "./types";

const post: Post = {
  slug: "reading-notes-scylladb-shard-per-core",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Reading notes: ScyllaDB's shard-per-core design",
  summary: "Notes on public material, not my benchmarks: what ScyllaDB and Seastar say about one shard per core, per-core memory and no locks, and what that does and does not tell you about tail latency.",
  tags: ["scylladb", "seastar", "tail-latency", "reading-notes", "architecture"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-this-is",
      title: "What this is",
      blocks: [
        { kind: "p", text: "These are reading notes on public documentation. I did not run ScyllaDB or Seastar, and every number below comes from a page I link, with the conditions that page states. Where I draw an implication, I mark it as my reading." },
        { kind: "list", items: [
          "ScyllaDB, shard-per-core architecture: https://www.scylladb.com/product/technology/shard-per-core-architecture/",
          "Seastar, shared-nothing design: https://seastar.io/shared-nothing/",
          "Seastar tutorial: https://docs.seastar.io/master/tutorial.html",
          "Dean and Barroso, The Tail at Scale (abstract page): https://research.google/pubs/the-tail-at-scale/",
        ] },
        { kind: "p", text: "Fetched on 2026-11-21. The tutorial is a long page and I read only its first part and a later slice, so I quote only what I saw." },
      ],
    },
    {
      id: "model",
      title: "The model, as the sources state it",
      blocks: [
        { kind: "p", text: "ScyllaDB's page says each core runs one shard that owns a slice of the data. Data is partitioned across the cluster by token range, then, in the page's words, the shards within each node are mapped to vCPUs bound to specific cores. Each of those has its own dedicated resources, including a separate cache, memtables and SSTables, and its own networking I/O channel." },
        { kind: "p", text: "Seastar, the framework underneath, describes the same thing from the programming side. It shards requests onto individual cores and runs one application thread per core, with communication by explicit message passing, not shared memory between threads. The tutorial says the available memory is divided between the cores and each core works on data in its own part of memory. Each thread is preallocated a large piece of memory, on the NUMA node it runs on." },
        { kind: "table", head: ["Claim", "Where"], rows: [
          ["One application thread per core; requests sharded onto cores", "seastar.io/shared-nothing"],
          ["Memory divided between cores; each works in its own part", "Seastar tutorial, introduction"],
          ["Inter-core communication by explicit message passing; resources shared across cores must be handled explicitly", "ScyllaDB page and Seastar page"],
          ["smp::submit_to(cpu, lambda) runs a lambda on another core and returns a future", "seastar.io/shared-nothing"],
        ] },
      ],
    },
    {
      id: "locks",
      title: "Why no locks",
      blocks: [
        { kind: "p", text: "The tutorial gives the reason in one sentence: unscalable programming practices such as taking locks can devastate performance on many cores. It adds that shared-memory and lock-free primitives are dramatically slower than operations on data in a single core's cache, because multi-core machines penalise atomic instructions, cache-line bouncing and memory fences." },
        { kind: "p", text: "Careful reading matters here. Seastar's page does not claim the system is entirely lock-free. It says the design avoids slow, unscalable lock primitives and cache bounces, provides facilities that limit cross-core communication, and offers non-blocking primitives for when communication is unavoidable. The example it gives: two requests from the same session land on different CPUs and depend on the same session state, so one CPU explicitly forwards the request to the other." },
        { kind: "p", text: "One number from the Seastar page, with its conditions: a budget of 1670 clock cycles per packet, for a 2 GHz processor handling 1024-byte packets at wire speed on a 10 Gbps network. The page attributes that figure to an Intel DPDK overview. It explains the pressure the design answers, not a ScyllaDB measurement." },
      ],
    },
    {
      id: "numbers",
      title: "Numbers, and what they do not tell you",
      blocks: [
        { kind: "list", items: [
          "The tutorial reports that a Cassandra rewrite on Seastar gained up to a tenfold throughput increase, as well as significantly lower and more consistent latencies. No hardware or workload is given on that page.",
          "ScyllaDB's main page says the design lets it scale to millions of operations per second, sustaining sub-millisecond average latencies, even with regional and global replication. A menu item says predictable single-digit millisecond latencies. Neither states hardware, cluster size or workload.",
          "Tutorial defaults: one engine thread per hardware thread; a task quota of 500 microseconds, after which a task yields at preemption points; a reactor can stall when a task runs a long time without yielding, with more than 20 ms given as an example.",
          "Memory: all memory except an OS reservation is preallocated by default, and the reservation defaults to the larger of 1.5G or 7% of total memory.",
        ] },
        { kind: "callout", tone: "warn", text: "None of the latency figures here are benchmarks I can compare. They are claims without stated conditions, and the averages quoted say nothing about the tail." },
      ],
    },
    {
      id: "tail",
      title: "What it implies for tail latency: my reading",
      blocks: [
        { kind: "p", text: "The Tail at Scale abstract says it is challenging to keep the tail of the latency distribution low for interactive services, and that temporary high-latency episodes that are unimportant in moderate-size systems may come to dominate at large scale. The abstract page carries no percentile figures, so I quote none." },
        { kind: "p", text: "Hypotheses, mine, not from the sources. First, a shard is a single execution lane, so anything that holds a core without yielding delays every request owned by that core. That is consistent with the tutorial's warning that continuations must not block, but I have not measured it. Second, skew becomes a tail problem: a hot key concentrates load on one shard while the other cores idle, and no lock was ever involved. Third, a request that needs two shards pays a message hop and the slower of the two queues." },
        { kind: "p", text: "What I would test before believing any of this: one workload, one machine, per-shard queue depth next to client-side p99, with the hot-key case run on purpose. I have not run it." },
      ],
    },
  ],
};

export default post;
