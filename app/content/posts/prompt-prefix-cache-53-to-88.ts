import type { Post } from "./types";

const post: Post = {
  slug: "prompt-prefix-cache-53-to-88",
  category: "daily",
  date: "2026-10-29",
  published: "2026-11-21",
  title: "A clock in the prompt cost 62% per turn",
  summary: "The chat agent's system prompt started with the current time, so its cache prefix changed every minute. Moving per-turn context to the end took cached share from 53% to 88% and cost per turn down 62% on a local bench.",
  tags: ["assistant", "prompt-caching", "cost", "bench"],
  project: "versatile-sh",
  sections: [
    {
      id: "finding",
      title: "What the ledger showed",
      blocks: [
        { kind: "p", text: "I read the production usage ledger for one store of the chat assistant: 53 customer turns and 251 model calls. About 85% of the spend came from 51 large calls (roughly 17,500 prompt tokens each) that missed the provider's prompt cache." },
        { kind: "p", text: "The cause was the order of the prompt. It began with the store's name, then a clock block with the current minute, then saved customer memory, and only then the rules, personality and tools. A new minute, or a new saved memory, changed the first bytes, and everything after was billed as uncached. The first model call of a turn missed the cache in 39 of 45 turns." },
        { kind: "p", text: "A second bug sat beside it. The memory section iterated a Go map, so two keys could render in a different order on the next turn." },
      ],
    },
    {
      id: "fix",
      title: "The fix",
      blocks: [
        { kind: "list", items: [
          "The system prompt keeps only per-store content: name, greeting, personality, rules, payment policy.",
          "The clock, the customer memory (keys sorted) and the registered cases move into one message placed after the history and just before the customer message.",
          "The system prompt, the tool schemas and the history are now a byte-identical prefix across turns and across customers of the same store.",
          "The agent chooses one provider per store per local day, so the cache is not split across providers.",
        ] },
      ],
    },
    {
      id: "bench",
      title: "Bench result",
      blocks: [
        { kind: "p", text: "Local bench: 8 scripted conversations of 4 turns on a test store, the production prompt parts, the provider pinned in both arms with no fallbacks. The low-concurrency regime sends one turn a minute, like production." },
        {
          kind: "table",
          head: ["Arm", "Cached share", "First-call cache hits", "Calls / turn", "Cost / turn"],
          rows: [
            ["base", "53.0%", "0 / 16", "3.94", "baseline"],
            ["branch", "88.1%", "14 / 16", "3.44", "-62%"],
          ],
        },
        { kind: "p", text: "Under interleaved traffic base already got 74.9% cached, because conversations that land in the same minute share a prefix. A busy store gets that by luck. A store with one turn a minute, like production, does not." },
        { kind: "p", text: "Calls per turn moved from 3.94 to 3.44, but I did not touch the loop, so I treat that as model variance. In the blind accuracy check of the transcripts, base passed 6 of 12 conversations and the branch 8 of 12, and nothing that passed on base failed on the branch." },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        { kind: "p", text: "The bench skips the routing in front of the agent and measures the agent path only. Twelve conversations is a small sample for the accuracy line. The cost line is a ratio from one bench setup, not a promise for production." },
      ],
    },
  ],
};

export default post;
