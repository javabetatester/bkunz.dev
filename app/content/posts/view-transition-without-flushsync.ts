import type { Post } from "./types";

const post: Post = {
  slug: "view-transition-without-flushsync",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "The theme reveal that jumped at its end",
  summary: "A circular theme reveal finished, then the page popped to its final look. The cause was React state changing inside startViewTransition without flushSync, and it became a lint.",
  tags: ["react", "view-transitions", "semgrep", "learning-loop"],
  project: "versatile-sh",
  sections: [
    {
      id: "symptom",
      title: "The symptom",
      blocks: [
        { kind: "p", text: "A web console had a light theme and a swap drawn as an iris: a circle opening from the click. The reveal ran, ended, and the page changed once more. The owner described it as a hiccup and said it happens often. It was recorded as an issue in the project's records on 2026-11-21." },
      ],
    },
    {
      id: "cause",
      title: "The cause",
      blocks: [
        { kind: "p", text: "`document.startViewTransition(callback)` takes a snapshot of the old page, runs the callback, then takes a snapshot of the new page and animates between them. The browser assumes the DOM is final when the callback returns." },
        { kind: "p", text: "In React, a state update inside that callback is not committed when the callback returns. It is scheduled. The browser snapshots a page that has not changed yet, plays the animation to it, and React then commits the real change afterwards. The user sees the transition finish and then the page move." },
        { kind: "code", lang: "ts", caption: "Before and after, as recorded in the lint's catalog entry", code: "// before: the new snapshot is taken before React commits\ndocument.startViewTransition(() => draw(next));\n\n// after\ndocument.startViewTransition(() => flushSync(() => draw(next)));" },
        { kind: "p", text: "`flushSync` forces the commit inside the callback, so the snapshot is of the finished page. The fix is one wrapper. The code looks correct, which is why the class is easy to write again." },
      ],
    },
    {
      id: "lint",
      title: "From fix to lint",
      blocks: [
        { kind: "p", text: "The team's learning loop says a recurring class of mistake becomes a guard, after the owner confirms. This was a named class: React state changed inside a view transition callback with no flushSync. The cheapest guard that fits is a Semgrep rule in the shared rules repository, which every project already runs." },
        { kind: "list", items: [
          "It reports `startViewTransition` on any receiver, and the `{ update }` form, in a module that imports React.",
          "Only when the callback is an inline function with no `flushSync(`, no `new Promise` and no `await`.",
          "A callback passed by name is not reported, because a pattern cannot see inside it.",
          "A module without React is not reported. A CSS-only swap is the preferred shape, and the message says so.",
        ] },
        { kind: "p", text: "The rule's tests hold five must-report cases and nine must-not-report ones, two of them in a module without React. Without the React scope, those two are reported, which is how I know the scope matters. Run over the organization's local checkouts, the only other inline callbacks were two page-transition helpers that return a promise resolved after the route renders; the Promise and await exemption exists for them." },
      ],
    },
    {
      id: "status",
      title: "Where it stands",
      blocks: [
        { kind: "p", text: "The catalog entry says the rule is in review in the shared rules repository, to be released as tag `v0.2.0`, and that no project pins it yet. A project enables it by moving one pin in its check command." },
        { kind: "callout", tone: "warn", text: "One honest wrinkle. The entry says the owner asked for the lint the same day, while the fix itself was not yet confirmed. The learning loop wants a confirmation before a guard. Here the lint was asked for explicitly, so I read it as that yes, but the record keeps the distinction." },
        { kind: "p", text: "A second rule of the same standard, that the reveal must end past the screen with an in-out curve, has no lint. It is a unit test on the project's radius function, because a pattern could not follow the helper without noise. Choosing which guard fits is part of the job: a rule that is too noisy gets turned off." },
      ],
    },
  ],
};

export default post;
