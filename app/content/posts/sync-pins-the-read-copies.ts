import type { Post } from "./types";

const post: Post = {
  slug: "sync-pins-the-read-copies",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "bin/sync and the pointer pull request",
  summary: "How one script fast-forwards every shared checkout, reports a submodule pointer that fell behind, and opens the pull request that moves it.",
  tags: ["harness", "git", "submodules", "bash"],
  project: "versatile-sh",
  sections: [
    {
      id: "why",
      title: "Two kinds of stale",
      blocks: [
        { kind: "p", text: "With submodules there are two ways to read old knowledge. The sibling working copy of a satellite can be behind its remote. And the read copy under `harness/` can be at a commit older than the satellite's `main`, because the center records a pointer and nobody moved it." },
        { kind: "p", text: "`bin/sync` handles both. I read through the script today; this is what it does, in order." },
      ],
    },
    {
      id: "pull",
      title: "Step 1: fast-forward, never force",
      blocks: [
        { kind: "p", text: "It finds the shared checkouts by their `versatile-sh` remote, whatever the folder is called. For each one it fast-forwards only when two conditions hold: the checkout is on its default branch and the working tree is clean. Otherwise it prints one line and moves on:" },
        { kind: "code", lang: "text", caption: "The three refusals, from the script's own messages", code: "<name>: on branch '<branch>', not pulled\n<name>: uncommitted changes, not pulled (bin/harvest collects them)\n<name>: local commits diverge from origin/<default>, not pulled" },
        { kind: "p", text: "It merges with `--ff-only`. It never stashes, resets or switches branch. A person's half-finished work is never touched. After a pull that moved a harness repository, it runs the forbidden-content check on the new commits and says so if it fails." },
      ],
    },
    {
      id: "pointers",
      title: "Step 2: move the read copies, report the gap",
      blocks: [
        { kind: "p", text: "Then `git submodule update --init --remote --merge` moves each read copy under `harness/` to the tip of that satellite's `main`. For every submodule it compares the pointer recorded in the center with what is checked out, and prints how many commits the read copy is ahead:" },
        { kind: "code", lang: "text", code: "harness/<name>: reading <sha>, its main (<n> commit(s) after the recorded pointer; <pull request or hint>)" },
        { kind: "p", text: "The hint is either the open pull request that would move it, found by branch name, or `no pull request moves it yet: bin/sync --bump opens it`." },
      ],
    },
    {
      id: "bump",
      title: "Step 3: --bump opens the pull request",
      blocks: [
        { kind: "p", text: "The pointer change is a pull request like any other, because the center's `main` is never pushed to directly. `--bump` does all of it:" },
        { kind: "steps", items: [
          { title: "Temporary worktree", text: "Creates a worktree from `origin/main` on a timestamped `chore/harness-pointers-` branch, so the person's checkout is untouched." },
          { title: "Safety check", text: "For each satellite, refuses to move a pointer if the satellite's main does not contain the recorded one." },
          { title: "Write the pointer", text: "Updates the index entry directly with `update-index --cacheinfo`, no checkout of the submodule needed." },
          { title: "Run the check", text: "Runs the center's `bin/check` with the new pointers. If it fails (often a doc that links to a path a satellite no longer has), nothing is pushed and the script says so." },
          { title: "Open and merge", text: "Commits, pushes, opens the pull request with the old and new short hashes in the body, and merges it with a merge commit, deleting the branch." },
        ] },
        { kind: "p", text: "Running `bin/sync` twice changes nothing the second time. The header says so, and it is the property I rely on when a timer runs it." },
      ],
    },
    {
      id: "notes",
      title: "What the history shows",
      blocks: [
        { kind: "p", text: "The center's log has pointer-move pull requests on both days of this series: `chore: move the harness pointers` as #167, #170 and others on 2026-11-20, and #193 and #199 on 2026-11-21. I did not count how many a week they will be. If it is high, the pointer move is a candidate for the daily timer instead of a manual `--bump`." },
        { kind: "callout", tone: "note", text: "The script also prints one line from `bin/conformance` (cached for 12 hours) and any notes `bin/harvest` left behind. Sync is the one command that tells you whether the shared state is healthy." },
      ],
    },
  ],
};

export default post;
