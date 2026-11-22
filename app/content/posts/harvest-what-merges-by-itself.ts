import type { Post } from "./types";

const post: Post = {
  slug: "harvest-what-merges-by-itself",
  category: "discoveries",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "What a knowledge collector may merge by itself",
  summary: "bin/harvest turns uncommitted notes in the harness repositories into pull requests. The interesting part is the short list of changes it is allowed to merge without a human.",
  tags: ["harness", "automation", "pull-requests", "python"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "Knowledge left in a working tree",
      blocks: [
        { kind: "p", text: "Sessions learn things. Some of them end with the learning written into a file and never committed. In a shared harness that is a loss for everyone else, and it is also a risk: an uncommitted file is not reviewed by anyone." },
        { kind: "p", text: "`bin/harvest` is the safety net. It looks at the center and at the sibling working copies of each harness, and turns uncommitted changes into pull requests on a `harvest/<user>-<date>` branch. I read the script and the learning-loop doc to write this." },
      ],
    },
    {
      id: "careful",
      title: "How careful it is",
      blocks: [
        { kind: "list", items: [
          "Only the default branch of a working copy. Anything else is skipped.",
          "It fetches first and refuses a copy that has local commits the remote does not have.",
          "It waits until nobody is editing. A file modified within the last 15 minutes counts as still in use (`VERSATILE_HARVEST_QUIET_MINUTES`). At the end of a session it waits up to 45.",
          "It builds the proposal in a temporary worktree, so the person's checkout never changes branch.",
          "It runs the sanitizer over what it staged and holds back only the files the sanitizer flags. A new file naming something outside Versatile moves to the personal `local/` area; a new folder with no home is skipped as ambiguous.",
          "Media and binary files are never collected.",
          "It runs the repository's check before pushing. A failure restores the state and leaves a note that `bin/sync` prints.",
        ] },
        { kind: "p", text: "It never commits to `main`, never force-pushes, and can be turned off with an environment variable or a file in the config directory." },
      ],
    },
    {
      id: "merge",
      title: "What merges without a person",
      blocks: [
        { kind: "p", text: "Everything opens a pull request. Almost nothing merges by itself. The merge rule is a single regular expression in the script:" },
        { kind: "code", lang: "python", code: "APPEND_ONLY = re.compile(r\"^projects/[^/]+/(?:issues|findings|operations)\\.md$\")" },
        { kind: "p", text: "Only additions to those three record files of a project merge automatically. A changed or removed line does not. An ADR, a rule, a way-of-working doc, a skill or a script stays open." },
        { kind: "p", text: "The reason is in the learning-loop doc: those latter files change what everyone does. A new entry in a findings log changes what people know. That is a different risk, and I think it is the right line, though I have no data on how often a harvest pull request has been wrong. The script first appears in the center's history on 2026-11-20." },
      ],
    },
    {
      id: "when",
      title: "When it runs",
      blocks: [
        { kind: "p", text: "Two triggers, both installed by `bin/install --with-hooks --with-timer`. A SessionEnd hook starts it detached, but only on a real exit, not on `/clear`, a resume or a compaction. And a daily timer runs it after `bin/sync`." },
        { kind: "p", text: "The same script reports two kinds of stale pull request as attention notes: a `turbo` pull request open for more than 7 days, and a Dependabot pull request open for more than 24 hours. The thresholds are in the source; whether they are the right ones is something I will only know after living with them." },
        { kind: "callout", tone: "note", text: "Surprise worth recording: the safest design was not a smarter merge decision. It was a much smaller one. One path to auto-merge, defined by a filename pattern and a rule that lines are only added." },
      ],
    },
  ],
};

export default post;
