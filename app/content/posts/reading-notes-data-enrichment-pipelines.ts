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
