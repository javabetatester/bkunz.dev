import type { Post } from "./types";

const post: Post = {
  slug: "a-deny-list-nobody-has-to-write",
  category: "daily",
  date: "2026-11-20",
  published: "2026-11-21",
  title: "A deny list nobody has to write",
  summary: "Shared repositories must never contain names from other projects. The list of names comes from the checkouts already on your machine, so there is nothing to fill in by hand.",
  tags: ["harness", "neutrality", "python", "git"],
  project: "versatile-sh",
  sections: [
    {
      id: "problem",
      title: "A rule that depends on a list",
      blocks: [
        { kind: "p", text: "A team repository that is meant to be public tomorrow cannot contain the name of an employer, a customer, or someone's other project. The obvious guard is a deny list. The obvious problem is that the list is itself a list of those names. Committing it defeats the purpose." },
        { kind: "p", text: "The harness already had the shape of an answer. `bin/harness_deny.py` combines three sources, strongest first: generic patterns, hashed names, and a personal list that stays outside git. Pull request #174 on 2026-11-20 made the third source generate itself." },
      ],
    },
    {
      id: "layers",
      title: "Three layers",
      blocks: [
        { kind: "table", head: ["Layer", "Where it lives", "What it catches"], rows: [
          ["Generic patterns", "In the script, tracked", "Personal home paths, e-mail addresses, IP addresses, tokens, private keys, secret-store references, attribution trailers, a tax-id shape"],
          ["Hashed names", "A tracked file of SHA-256 digests of lowercase words", "A name blocked for everyone, without the name being written anywhere"],
          ["Personal list", "A file in the user's config directory, never committed", "One case-insensitive regular expression per line: the real names on this machine"],
        ] },
        { kind: "p", text: "A repository can carry an allow file for one exception per line, with a path glob and a reason. The same patterns are shared by `bin/check`, by `bin/harvest` and by the validator a repository passes before going public." },
      ],
    },
    {
      id: "generated",
      title: "Where the personal list comes from",
      blocks: [
        { kind: "p", text: "`bin/harness_scan.py` walks the git checkouts under the Versatile folder. A checkout is ours if its origin is a `versatile-sh` repository. Everything else, another organization or no remote at all, is listed in an ignored `local/repos.md`. The owner and the distinctive repository names of those remotes become a managed block in the personal list." },
        { kind: "p", text: "Generic words must not become deny patterns, or every doc mentioning a server would be blocked. The scanner carries a stoplist of common repository words (app, api, docs, backend, platform, agent, and 137 words in all) and drops them." },
        { kind: "list", items: [
          "`bin/install` and `bin/sync` both run the scan, so a new checkout joins the list on the next sync.",
          "The block is marked as generated and managed. A person's own lines outside the block are kept.",
          "`local/repos.md` has a section called Extra for anything the scan cannot see.",
        ] },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        { kind: "p", text: "It only knows what is on this machine. A customer that exists in no checkout is not in the list, and a name that is also a common word may slip through the stoplist or be dropped by it. That is why the generic patterns and the harvest sanitizer stay on top." },
        { kind: "callout", tone: "warn", text: "I have not measured false positives or misses. A harvest that holds back files it should not, or one that lets a name through, would be the first evidence, and none is recorded yet." },
      ],
    },
  ],
};

export default post;
