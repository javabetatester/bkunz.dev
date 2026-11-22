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
