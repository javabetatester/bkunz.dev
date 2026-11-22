import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const en: ProjectDoc = {
  tagline: "A small organisation run as a side project: independent engines, a shared way of working with AI agents, and the harnesses that keep both honest.",
  status: "personal side project (organisation, mostly private repositories)",
  facts: [
    { label: "Shape", value: "an organisation, not one repository" },
    { label: "Site", value: "Next.js 16 static export, Bun forms server" },
    { label: "Way of working", value: "a center harness plus satellite harnesses" },
    { label: "Visibility", value: "site and some engines public; harnesses private" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      group: "start",
      blocks: [
        { kind: "p", text: "versatile-sh is the organisation I run as a side project. It is built around one idea: independent engines. Each engine does one job (durable workflows, a test engine, a computer engine, a plugin protocol), keeps a neutral core that names no product, and can be used without the others." },
        { kind: "p", text: "The organisation is also a way of working. A small team works with AI agents, and the team learns once: what one person teaches an agent is turned into a shared rule, record or lint instead of living in one machine's memory." },
        { kind: "p", text: "This case describes that way of working in the public-safe sense: the structure, the flows and the gates. The harness repositories are private, so their paths are named but not linked. Engines appear by codename: nagare (durable workflow), hakoniwa (test engine), heya (computer engine), tsugite (plugin protocol)." },
        {
          kind: "table",
          head: ["Part", "What it is"],
          rows: [
            ["Engines", "Independent repositories with neutral cores, each with a record home"],
            ["Company site", "Static export of Next.js 16, Tailwind CSS 4 and TypeScript, with connector and skill directories and forms"],
            ["Center harness", "How the team works: router, workflow docs, skills, agents, commands, hooks, tools"],
            ["Satellite harnesses", "Engineering knowledge and project records, infrastructure config, research engine, media"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Getting started",
      group: "start",
      blocks: [
        { kind: "p", text: "A contributor clones the center harness and the satellites it needs side by side, then runs two tools. bin/sync brings everything up to date. bin/install links the skills, agents and commands into each checkout." },
        {
          kind: "code",
          lang: "sh",
          code: "bin/sync                 # fast-forward clean checkouts on main; move read copies to each satellite's main\nbin/install              # link skills, agents, commands into each versatile-sh checkout\nbin/install --with-hooks --with-timer   # team hooks and a daily sync + harvest timer\nbin/conformance          # what each repository misses from the baseline",
          caption: "Harness bootstrap",
        },
        {
          kind: "list",
          items: [
            "bin/install writes one symlink per skill, agent and command, listed in each project's .git/info/exclude so nothing is committed to a project.",
            "A project's own item with the same name wins over a linked one.",
            "bin/install creates a never-pushed local/ area for anything that is not part of the organisation, and builds a personal deny list from your other checkouts.",
            "bin/sync is idempotent: running it twice changes nothing the second time. It never stashes, resets or switches branches.",
            "--bump records the current main of each satellite as the submodule pointer, through a pull request.",
          ],
        },
        { kind: "p", text: "The company site runs with mise, which installs Node.js, pnpm and Bun." },
        {
          kind: "code",
          lang: "sh",
          code: "mise run install\nmise run dev        # pages on http://localhost:3000, without the forms API\nmise run build      # static export into out/\nmise run preview    # out/ plus the forms API",
          caption: "Company site",
        },
        {
          kind: "table",
          head: ["Variable", "Used by", "Effect"],
          rows: [
            ["DATA_DIR", "site server", "Where the forms database is stored"],
            ["CATALOG_DIR", "site tasks", "Catalog checkout read by mise run catalog and mise run skills"],
            ["VERSATILE_CONFORMANCE=off", "bin/sync", "Skips the conformance summary line"],
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      group: "how",
      blocks: [
        { kind: "scene", id: "versatile-sh/hub", caption: "The center harness is the hub; each satellite is its own repository, joined to it and never copied into it." },
        { kind: "p", text: "The center harness is the one place that gathers everything. Every other harness is a satellite with its own repository, carried as a git submodule under harness/ in the center. Nothing is copied." },
        {
          kind: "code",
          lang: "text",
          code: "          versatile-sh/.claude   (center: how we work)\n          router, docs/work, skills, agents, commands, bin, hooks\n                         |\n     +-------------------+--------------------+--------------------+\n     |                   |                    |                    |\nversatile-harness   hosting-harness     research-harness     <domain>-media\nengineering rules   infra + deploy       method, studies,     canonical images,\nproject records     config per app       generated home       video, logos\n     |\n     +-- projects/<repo>/  profile, agents.md, adr/, roadmap, issues\n\nproject repositories: the product only (code, tests, README)",
        },
        {
          kind: "table",
          head: ["Harness", "Holds"],
          rows: [
            ["Center (.claude)", "How we work: router, docs/work, skills, agents, commands, bin tools, hooks, the colleague guide. Never engineering rules or one project's facts"],
            ["versatile-harness", "Engineering knowledge base (premises, rules, patterns, standards, lints, design, decisions, architecture, research index) and the record home of each project"],
            ["hosting-harness", "Infrastructure and each app's deploy configuration"],
            ["research-harness", "The research engine: method, studies, state, a generated research home"],
            ["media repositories", "The canonical copy of every image, video, logo and design source"],
            ["A project repository", "The product only, written as if public tomorrow"],
          ],
        },
        { kind: "p", text: "The truth of a satellite is its main on GitHub. The copy under harness/ is read-only and bin/sync keeps it at that main. A change is made in the sibling working copy, on a branch, through a pull request." },
        { kind: "p", text: "Everything that is not part of the organisation stays in local/ or in a person's own memory. The inverse holds too: anything about the organisation never has personal memory as its only home." },
      ],
    },
    {
      id: "learning-loop",
      title: "Learning loop",
      group: "how",
      blocks: [
        { kind: "scene", id: "versatile-sh/loop", caption: "A recurring problem goes round fix, proof, owner confirmation, guard and record, and the guard keeps it from returning." },
        { kind: "p", text: "When a problem recurs or someone repeats a request, the response is a fixed protocol. Memory on one machine is not learning, and a rule only in prose will be broken again." },
        {
          kind: "steps",
          items: [
            { title: "Recognise the class", text: "Name the problem as a class, such as raw colour values in components. Check the open issues and the lint catalog first." },
            { title: "Fix the root cause", text: "The smallest change that removes the cause, not a patch on the symptom." },
            { title: "Certify", text: "A failing-first test or a before and after, plus a sweep for other instances of the class." },
            { title: "Ask for confirmation", text: "One line to the owner. The certification belongs to the agent, the confirmation to the owner." },
            { title: "Codify the guard", text: "Only after an explicit yes: a lint, check, test or ratchet, proved by reintroducing the mistake once, and registered in the lint catalog in the same unit of work." },
            { title: "Record and share", text: "A pull request in the shared home. Colleagues get it on their next pull." },
          ],
        },
        { kind: "p", text: "If the owner does not answer, the fix and its regression test stay, the issue is marked fixed but not confirmed, and no class-wide guard is added. Separately, when a person does something better than the harness describes, it is recorded as a field practice under the file that owns the topic and replaces the rule text on its second confirmed case." },
      ],
    },
    {
      id: "pr-gate",
      title: "Pull request gate",
      group: "how",
      blocks: [
        { kind: "scene", id: "versatile-sh/gate", caption: "The turnstile only turns once the session knowledge note is in the box; then the branch reaches main." },
        { kind: "p", text: "In every versatile-sh repository work reaches main only through a pull request from a feature branch, merged with a merge commit after local validation. There is no direct push, and no force-push or history rewrite without the owner's explicit approval." },
        {
          kind: "steps",
          items: [
            { title: "Branch", text: "git fetch, then a worktree on a feature branch from origin/main. Commits are granular, one concern each, each building." },
            { title: "Validate locally", text: "The repository's one check command. CI workflows are manual and gate nothing, so the evidence in the pull request is the proof." },
            { title: "Session knowledge checklist", text: "Before opening the pull request, update what the session changed or learned: the project README and docs, the records in versatile-harness, any rule, pattern or lint that emerged, and the center harness if the way of working changed. Each goes through its own pull request." },
            { title: "Record it", text: "bin/pr-ready stores the checklist answers for the branch. The hook on gh pr create holds the command until that record exists. It expires after a day." },
            { title: "Merge and clean", text: "gh pr merge --merge --delete-branch, delete the local branch, remove the worktree, all in the same unit of work. The owner is told in the chat what was updated, with links." },
          ],
        },
        { kind: "callout", tone: "note", text: "The gate is symbolic and fails open. It satisfies itself only by doing the checklist, it does not apply to the harness repositories themselves, and it lets every other command through." },
      ],
    },
    {
      id: "research-flow",
      title: "Research method",
      group: "how",
      blocks: [
        { kind: "p", text: "Real decisions run through one engine, the research harness. One study supports one owner decision, and a study that cannot name its decision does not start. Its method was rewritten from what earlier research did well and badly, and it is amended after every study." },
        {
          kind: "steps",
          items: [
            { title: "Intake", text: "The owner answers the questions before any work starts, recorded with the date." },
            { title: "Recover", text: "What is already closed for the topic, with its date and commit." },
            { title: "Charter", text: "Decision, unit of analysis, judging rule, proof levels, floors, scope, seats and budget. The owner releases it." },
            { title: "Frame attack", text: "A red team objects to the question and premises before any answer exists." },
            { title: "Inventory and scout", text: "A blind inventory built from the user outward and the code inward, then one macro table of candidates. The owner picks what to deepen." },
            { title: "Rounds", text: "Proposals, objections, decisions, audit and spikes, released in tranches. The owner decides after each tranche." },
            { title: "Synthesis and close", text: "A map or matrix, owner decisions with recommendations, deferred items with a trigger, a final audit by an auditor who is not the judge, and a retro that amends the method." },
          ],
        },
        { kind: "p", text: "A narrow question one source settles is one-off research and skips the rounds. A choice inside a task gets a ten-line decision matrix in the pull request body, written before the candidates run." },
      ],
    },
    {
      id: "premises",
      title: "Premises",
      group: "deep",
      blocks: [
        { kind: "p", text: "A premise is a standing assumption every design starts from and does not re-argue in each task. Each one has its own small file in versatile-harness/premises/." },
        {
          kind: "table",
          head: ["Premise", "Meaning for a design"],
          rows: [
            ["Public tomorrow", "Every project repository is written as if public tomorrow"],
            ["Neutral core", "A core names no product, customer, vendor or sibling project"],
            ["Private records", "Records are private and live in one place"],
            ["One artifact, every deployment", "One artifact serves every deployment"],
            ["Secrets are references", "A secret is a reference everywhere except the store and the process that needs it"],
            ["No customer data", "No customer, employer or personal data anywhere"],
            ["Local validation", "No remote job gates a pull request"],
            ["Pull requests only", "Work reaches main only through a pull request"],
            ["Evidence before done", "Nothing is done without evidence"],
            ["Records change with the code", "Same unit of work, same pull request flow"],
            ["Small team with AI", "The team learns once"],
            ["Every harness its own repository", "The center links satellites, never copies them"],
          ],
        },
        { kind: "p", text: "A project repository holds the product only. No ADRs, runbooks, research, deploy config, hosts or internal process appear in its files, commits, pull request bodies or branch names. That is what makes the public-tomorrow premise testable." },
      ],
    },
    {
      id: "gates",
      title: "Gates and lints",
      group: "deep",
      blocks: [
        { kind: "p", text: "Every change climbs the same gates, cheapest first, all on the developer's machine. A gate checks one thing, has one config home, and calls the repository's one check command, mise run check, instead of re-implementing it." },
        {
          kind: "table",
          head: ["Gate", "Checks"],
          rows: [
            ["Editor and format", "Formatting and fast lint while typing"],
            ["Pre-commit", "Format and AST-only lint of staged files, fixed and re-staged"],
            ["Pre-push and check", "Linters on packages changed since the merge base; the full check on demand"],
            ["Knowledge gate", "The session checklist is recorded before gh pr create"],
            ["Review", "Standards and spec axes, via /review or /pre-pr"],
            ["Merge gate", "The merged commit is the one the validation stamped; only where a repository has one"],
            ["Lint catalog", "A confirmed recurring mistake becomes one shared lint every project enables"],
            ["New-repository bootstrap", "Dependabot, Semgrep, lefthook, LICENSE, SECURITY.md, README standard, go-lint for Go"],
            ["Organisation conformance", "bin/conformance lists what each repository misses"],
          ],
        },
        { kind: "p", text: "The lint catalog lists each lint once with the problem it prevents, where it is implemented and which projects enabled it. Examples include a neutrality gate for engine cores, a dependency edge table, a comments check, a clock seam, an environment-in-composition-root check, and a Semgrep gate that ratchets on the merge base. Go checks come from one shared kit, go-lint." },
        { kind: "p", text: "Dependabot pull requests are never left idle: each is reviewed and merged, fixed and merged, migrated, or planned in an issue with its version ignored." },
      ],
    },
    {
      id: "proof-levels",
      title: "Proof levels",
      group: "deep",
      blocks: [
        { kind: "p", text: "A claim needs evidence someone else can reproduce, shown as before and after, with the baseline captured first. There is one scale, and every ADR, study or decision matrix cell uses positions on it." },
        {
          kind: "table",
          head: ["Tier", "Evidence", "Good for"],
          rows: [
            ["S", "Behaviour observed in the running system: screenshots, real command output, real request and response", "UI, end-to-end behaviour, deploys"],
            ["A", "A test that failed before the change and passes after it", "Bugs, races, rules"],
            ["B", "Targeted tests, type check, lint and build all green", "Refactors, internal changes"],
            ["C", "I read the code and it should work", "Nothing: it is not evidence"],
          ],
        },
        {
          kind: "table",
          head: ["Change", "Minimum evidence"],
          rows: [
            ["Feature", "A, plus S when it has a user interface"],
            ["Bug fix", "A: the failing-first test"],
            ["Refactor", "B, behaviour tests unchanged and green"],
            ["Configuration or deploy", "S: observed in the running system"],
            ["Visual change", "S: screenshots at desktop and phone widths"],
            ["Performance claim", "S or A with numbers, same conditions before and after"],
          ],
        },
        { kind: "p", text: "In studies, the labels read, specified and run map onto this scale. A read claim is valid only as a fact about its source, with version and date. It is never proof that our change works." },
      ],
    },
    {
      id: "company-site",
      title: "Company site",
      group: "deep",
      blocks: [
        { kind: "p", text: "The site is a static export of Next.js 16 with the App Router, Tailwind CSS 4 and TypeScript. One small Bun server hands out the export and stores the forms in SQLite, from the schema in migrations/." },
        {
          kind: "list",
          items: [
            "Pages for the company, plus /connectors and /skills directories built from two catalogs of plain files.",
            "Forms: waitlist, contact, and connector and skill submissions. Lead validation lives in lib/leads.ts.",
            "POST /api/leads applies a same-origin check, an 8 KB limit, a honeypot and a per-address rate limit.",
            "The server answers / with a Markdown mirror when the request asks for text/markdown; the site also ships llms.txt discovery routes.",
            "The site ships no deployment configuration. Design rules are in DESIGN.md.",
          ],
        },
      ],
    },
    {
      id: "decisions",
      title: "Decisions",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decision", "Chosen", "Rejected", "Why"],
          rows: [
            ["Shape of the tooling", "One center harness plus satellites as submodules", "One monorepo; copied content", "Each concern has its own history and truth; the center links, never copies"],
            ["Delivery", "Pull request, merge commit, local validation", "Direct push; squash; remote CI gate", "Main stays clean and each merge reverts as one unit; a remote job that never runs gates nothing"],
            ["Learning", "Guard after owner confirmation, registered once", "Memory only; per-repository copies", "Prose is broken again; copies disagree"],
            ["Knowledge home", "Records in a private satellite", "ADRs and runbooks in product repos", "A product repository must be publishable tomorrow"],
            ["Research", "A chartered study with an independent judge and auditor", "A single pass by one agent", "A single pass is a draft, never a result"],
            ["Proof", "One S, A, B, C scale", "Per-document scales", "Everything is comparable"],
            ["Check command", "One mise run check per repository", "Makefiles and ad hoc scripts", "Two definitions of green drift"],
          ],
        },
        {
          kind: "list",
          items: [
            "The merge gate exists only in some product repositories; elsewhere the evidence in the pull request is the gate.",
            "The knowledge gate is symbolic and fails open if its hook errors.",
            "The harnesses and several engines are private, so this case cannot link them.",
            "Some lints are listed with an implementation not yet verified; the conformance tool reports what each repository still misses.",
          ],
        },
      ],
    },
    {
      id: "files",
      title: "Files",
      group: "reference",
      blocks: [
        { kind: "p", text: "Harness paths are private and relative to each harness repository." },
        {
          kind: "files",
          items: [
            { path: ".claude/CLAUDE.md", note: "Center harness router: scope, non-negotiable rules, routing table" },
            { path: ".claude/docs/work/01-WORKFLOW.md", note: "The working loop, decision matrix, stop condition" },
            { path: ".claude/docs/work/03-EVIDENCE.md", note: "Proof tiers and before and after" },
            { path: ".claude/docs/work/04-LEARNING-LOOP.md", note: "Recurring problem to guard to shared record" },
            { path: ".claude/docs/work/06-GIT-AND-PRS.md", note: "Git rules and the session knowledge checklist" },
            { path: ".claude/docs/work/10-GATES.md", note: "The gate ladder" },
            { path: ".claude/bin/sync", note: "Updates checkouts and satellite read copies" },
            { path: ".claude/bin/install", note: "Links skills, agents, commands; hooks and timer" },
            { path: ".claude/bin/conformance", note: "Baseline check across the organisation" },
            { path: "versatile-harness/premises/00-INDEX.md", note: "Index of the standing premises" },
            { path: "versatile-harness/rules/00-INDEX.md", note: "Engineering rules index" },
            { path: "versatile-harness/lints/00-INDEX.md", note: "The lint catalog" },
            { path: "research-harness/docs/methodology.md", note: "Study rules, stages and proof levels" },
            { path: "versatile.sh/lib/leads.ts", note: "Site lead validation" },
            { path: "versatile.sh/DESIGN.md", note: "Site design rules" },
          ],
        },
      ],
    },
  ],
};

const doc: Partial<Record<Lang, ProjectDoc>> = { en };

export default doc;
