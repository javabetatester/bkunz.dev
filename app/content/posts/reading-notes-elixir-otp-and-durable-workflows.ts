import type { Post } from "./types";

const post: Post = {
  slug: "reading-notes-elixir-otp-and-durable-workflows",
  category: "studies",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "Reading notes: Elixir/OTP and durable workflows",
  summary: "Notes on public material, not my benchmarks: processes, supervisors and let it crash from the Erlang and Elixir docs and Armstrong's thesis, then my own mapping of GenServer messages onto durable workflow ideas, labelled as hypothesis.",
  tags: ["elixir", "otp", "supervision", "durable-execution", "reading-notes"],
  project: "versatile-sh",
  sections: [
    {
      id: "what-this-is",
      title: "What this is",
      blocks: [
        { kind: "p", text: "Reading notes on public documentation, fetched on 2026-11-21. I did not write or run any Elixir for this. The sources:" },
        { kind: "list", items: [
          "GenServer docs: https://elixir.hexdocs.pm/GenServer.html",
          "OTP design principles: https://www.erlang.org/doc/system/design_principles.html",
          "Supervisor behaviour principles: https://www.erlang.org/doc/system/sup_princ.html",
          "Joe Armstrong, Making reliable distributed systems in the presence of software errors (2003): https://erlang.org/download/armstrong_thesis_2003.pdf",
        ] },
        { kind: "p", text: "The second half is my own mapping onto durable workflows, such as the one nagare provides. That part is analogy, and I say so where it starts." },
      ],
    },
    {
      id: "supervision",
      title: "Workers, supervisors and restart rules",
      blocks: [
        { kind: "p", text: "The design principles page calls the supervision tree a process structuring model based on workers and supervisors. Workers perform the actual work. Supervisors monitor workers, and a supervisor can restart a worker if something goes wrong." },
        { kind: "p", text: "The supervisor principles page defines the restart strategies:" },
        { kind: "table", head: ["Strategy", "On a child exit"], rows: [
          ["one_for_one", "Only that child is restarted."],
          ["one_for_all", "All remaining children are terminated, then all, including the dead one, are restarted."],
          ["rest_for_one", "Children started after the dead one are terminated; the dead one and those are restarted."],
          ["simple_one_for_one", "A one_for_one where all children are dynamically added instances of the same process."],
        ] },
        { kind: "p", text: "Restart intensity bounds it: if more than MaxR restarts occur in the last MaxT seconds, the supervisor terminates all its children and then itself, with reason shutdown. The defaults on that page are intensity 1 and period 5. The page says the mechanism aims to prevent a process from repeatedly dying for the same reason. Child restart types are permanent (always restarted, the default), transient (restarted only on abnormal exit) and temporary (never restarted)." },
      ],
    },
    {
      id: "crash",
      title: "Let it crash, in Armstrong's words",
      blocks: [
        { kind: "p", text: "Section 4.3 of the thesis lists the slogans: let some other process do the error recovery, if you cannot do what you want to do, die, let it crash, do not program defensively. The reasoning starts from hardware. To survive the failure of a whole computer you need a second one, so the system must handle an error somewhere other than where it occurred. Armstrong makes a hardware failure look like a software one, an exit message from the runtime, so that there is one uniform mechanism." },
        { kind: "p", text: "Section 4.4 draws the line between exceptions and errors. Exceptions occur when the runtime does not know what to do. Errors occur when the programmer does not know what to do. If the programmer foresaw the condition, such as opening a file that may not exist, it is not an error and the code handles it. The slogan applies to the second case: when the specification is silent, do not invent behaviour, crash and let the supervisor decide." },
        { kind: "callout", tone: "note", text: "Note that the Elixir getting-started page I fetched does not use the phrase let it crash, and only says a supervisor controls if and how processes should be restarted. The phrase's source here is the thesis." },
      ],
    },
    {
      id: "genserver",
      title: "GenServer: what a message is",
      blocks: [
        { kind: "p", text: "A GenServer is described as a behaviour module for implementing the server of a client-server relation: a process that holds state and runs code. Call messages expect a reply and are synchronous, handled by handle_call/3. Cast messages do not, handled by handle_cast/2. Everything else, including messages from send/2, Process.send_after/4 and timeouts, goes to handle_info/2. init/1 builds the initial state and is the only required callback. A timeout value, default infinity, detects a lull in messages and arrives as :timeout." },
        { kind: "p", text: "It is most commonly started under a supervisor. use GenServer generates a child_spec, with :restart defaulting to :permanent, and the exit reason decides whether the supervisor restarts it." },
      ],
    },
    {
      id: "mapping",
      title: "My mapping to durable workflows (hypothesis)",
      blocks: [
        { kind: "p", text: "From here on, nothing is from the sources. It is how I read the two models side by side." },
        { kind: "table", head: ["OTP idea", "Durable workflow counterpart"], rows: [
          ["init/1 builds state from an argument", "Starting a run from its input"],
          ["handle_call, reply expected", "A synchronous query or an update that returns a result"],
          ["handle_cast, fire and forget", "A signal appended to the run's inbox"],
          ["handle_info, timers and timeouts", "A durable timer firing, or an external event"],
          ["Supervisor restarts the process", "A worker resuming the run from its journal"],
          ["MaxR in MaxT seconds", "A retry budget before a run is parked as failed"],
        ] },
        { kind: "p", text: "The difference that matters: after an OTP restart, init/1 runs again and the old in-memory state is gone, unless you persisted it yourself. A durable engine makes the opposite choice. State is rebuilt by replaying a record of what already happened, so a restart continues instead of starting over. Supervision answers who restarts it. Durability answers what it remembers." },
        { kind: "p", text: "A second hypothesis: let it crash needs the code under the supervisor to be safe to run twice. In a durable engine that means the side-effecting steps need idempotency keys, which is why a journal and an outbox show up together. I have not built an OTP system to test this analogy, so treat it as a way to ask questions of nagare, not as a result." },
      ],
    },
  ],
};

export default post;
