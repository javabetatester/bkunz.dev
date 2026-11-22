import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const en: ProjectDoc = {
  tagline: "One lint kit for Go repositories: a generated golangci-lint config, a drift check for it, and seven analyzers for what stock linters cannot see.",
  status: "open source",
  facts: [
    { label: "Language", value: "Go 1.27" },
    { label: "License", value: "MIT" },
    { label: "Binary", value: "vlint" },
    { label: "Analyzers", value: "7 (go/analysis)" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      group: "start",
      blocks: [
        { kind: "p", text: "go-lint is a versioned Go module with one command, vlint. A repository pins it in mise.toml (or runs it with go run at a pinned version), so nothing is added to its go.mod and every machine runs the same rules." },
        { kind: "p", text: "It exists so that the same lint rules, the same config and the same checks apply to every Go repository that follows the Versatile engineering standard. It does not replace golangci-lint: it generates that tool's config and runs beside it." },
        {
          kind: "table",
          head: ["It does", "It does not"],
          rows: [
            ["Write .golangci.yml, .golangci-fast.yml and .revive.toml from one shared config plus a small overlay", "Let a repository enable extra linters or loosen shared settings"],
            ["Run the linters in three tiers (fast on staged files, changed since the merge base, full)", "Apply risky autofixes: only errorlint and the formatters"],
            ["Run seven go/analysis analyzers: layout, clock, environment, errors, tests, comments, design-record references", "Replace golangci-lint"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Bootstrap",
      group: "start",
      blocks: [
        { kind: "p", text: "Prerequisites: Go 1.27, golangci-lint 2.15 and revive 1.17. From the root of a Go module:" },
        {
          kind: "code",
          lang: "sh",
          code: "vlint golangci          # writes .golangci.yml, .golangci-fast.yml and .revive.toml\nvlint ./...             # full tier: the analyzers on every package\ngolangci-lint run ./... # full tier: the stock linters",
        },
        { kind: "p", text: "vlint prints one line per finding as file:line:col: message and exits 3 when there is any, 1 when a package fails to load or type-check. Pin the tools and wire the tiers in mise.toml:" },
        {
          kind: "code",
          lang: "toml",
          code: '[tools]\ngo = "1.27.3"\n"go:github.com/versatile-sh/go-lint/cmd/vlint" = "0.3.0"\n"go:github.com/golangci/golangci-lint/v2/cmd/golangci-lint" = "2.15.0"\n"go:github.com/mgechev/revive" = "1.17.1"\n\n[tasks.lint-fast]\nrun = "vlint fast -fix"\n\n[tasks.lint]\nrun = ["vlint golangci -check", "vlint changed"]\n\n[tasks.lint-full]\nrun = ["vlint golangci -check", "vlint ./...", "golangci-lint run ./..."]\n\n[tasks.check]\nrun = [{ task = "lint-full" }, { task = "test" }]',
        },
        { kind: "p", text: "With lefthook, pre-commit runs mise run lint-fast {staged_files} and pre-push runs mise run lint." },
        {
          kind: "table",
          head: ["Flag or file", "Effect"],
          rows: [
            ["-layout, -errstring, ...", "Run only the named analyzers; -clockseam=false runs all but one"],
            ["-tags integration", "Analyze files behind build tags (comma-separated, passed to package loading)"],
            ["-baseline f [-write]", "Fail only on findings absent from the baseline file; -write records today's findings"],
            ["lint/golangci.local.yml", "The repository overlay; accepts exclusions, depguard and issues.new-from-merge-base only"],
            ["vlint fix ./...", "golangci-lint --fix limited to errorlint, then golangci-lint fmt"],
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      group: "how",
      blocks: [
        { kind: "scene", id: "go-lint/stamp", caption: "One shared template plus a small overlay is stamped into the same three config sheets in every repository." },
        { kind: "p", text: "vlint is a single binary (cmd/vlint) over four internal packages, the golangci generator and one package per analyzer under passes/." },
        {
          kind: "code",
          lang: "text",
          code: "mise run check\n   |\n   v\n vlint golangci -check --> golangci/ (shared.yml + revive.toml + overlay) --> drift?\n   |\n   v\n vlint ./...  --> internal/driver --> passes/{layout,clockseam,envroot,\n   |                                         errstring,noskipenv,doccomment,adrref}\n   |            \\-> internal/baseline (optional \"don't get worse\" filter)\n   v\n golangci-lint run ./...  (with the generated .golangci.yml)",
        },
        {
          kind: "list",
          items: [
            "golangci/: embeds shared.yml and revive.toml, merges the repository overlay, writes the three config files and reports ErrDrift when a committed file differs.",
            "internal/driver: loads packages and runs the selected analyzers, producing Finding values.",
            "internal/baseline: reads and writes the baseline file and subtracts it from the findings.",
            "internal/changed: maps changed files to packages and modules for the changed tier.",
            "internal/module: finds module roots and their go.mod files.",
          ],
        },
      ],
    },
    {
      id: "gate",
      title: "The gate",
      group: "how",
      blocks: [
        { kind: "scene", id: "go-lint/drift", caption: "The drift check regenerates each sheet and measures it against the committed one; a mismatch fails with ErrDrift." },
        { kind: "p", text: "The same rules run at three depths, because the heavy linters and a whole-repository run are too slow for every commit." },
        {
          kind: "table",
          head: ["Tier", "When", "Command", "Runs"],
          rows: [
            ["fast", "pre-commit", "vlint fast [-fix] <files>", "goimports on staged files, then revive (AST only) on their packages, reporting only lines changed since HEAD"],
            ["changed", "pre-push", "vlint changed [-base origin/main] [-tags t] [-baseline f]", "vlint analyzers and golangci-lint -c .golangci-fast.yml --new-from-merge-base on packages changed since the merge base"],
            ["full", "on demand", "vlint ./... and golangci-lint run ./...", "Everything, with .golangci.yml"],
          ],
        },
        {
          kind: "steps",
          items: [
            { title: "Check drift", text: "vlint golangci -check regenerates the three configs in memory and fails when one differs from the committed file." },
            { title: "Run analyzers", text: "vlint ./... runs the analyzers over every package, test files included where a rule covers them." },
            { title: "Run golangci-lint", text: "golangci-lint run ./... runs the stock linters with the generated config." },
          ],
        },
        { kind: "p", text: "vlint changed counts committed, staged, unstaged and untracked .go files (skipping testdata, vendor and dot or underscore folders), maps each to its package and nearest go.mod, and lints the whole module when go.mod, go.sum or a lint config changed. -list prints the packages and runs nothing." },
      ],
    },
    {
      id: "analyzers",
      title: "Analyzers",
      group: "deep",
      blocks: [
        { kind: "scene", id: "go-lint/sieves", caption: "Every package passes through the seven analyzers; findings drop into the reject tray." },
        {
          kind: "table",
          head: ["Analyzer", "Reports", "Fix"],
          rows: [
            ["layout", "A folder outside the layout, or an import against the layers", "Move the package; invert the dependency through a port"],
            ["clockseam", "time.Now, time.Since, time.Until outside the composition root", "Inject a clock port"],
            ["envroot", "os.Getenv, os.LookupEnv, os.Environ outside the composition root", "Read configuration once in app/ and pass values in"],
            ["errstring", "err.Error() compared with ==, !=, switch or a strings matcher, outside tests", "A sentinel with errors.Is, or a typed error with errors.As"],
            ["noskipenv", "A test that skips silently", "t.Fatal when the environment is missing; skip only under testing.Short(), a SKIP-token opt-out variable, or runtime.GOOS/GOARCH"],
            ["doccomment", "Exported symbol without a doc comment, doc over two lines, doc on an unexported symbol, any other comment", "Name things so the code reads without comments; two lines on exported symbols"],
            ["adrref", "A design-record id (ADR-12) or record folder path in a Go comment or string literal, or a .proto comment", "State the behaviour; keep records outside the repository"],
          ],
        },
        { kind: "p", text: "Exemptions: clockseam and envroot skip main packages, app/, cmd/, _test.go files and test-kit packages whose name ends in test. doccomment allows directives (//go:, //nolint:, build tags), example Output blocks, generated files, comments above the package clause, and two-line docs on struct fields and interface methods. noskipenv exempts the re-exec idiom, a test named *HelperProcess. adrref skips generated Go files and reads every .proto file of each analyzed module instead, skipping testdata, vendor, node_modules, dot and underscore folders and nested modules." },
        { kind: "p", text: "Each analyzer has analysistest cases in passes/<analyzer>/testdata: every rule has a case that must be reported and a case that must not." },
      ],
    },
    {
      id: "layout",
      title: "Folder layout",
      group: "deep",
      blocks: [
        { kind: "p", text: "The layout analyzer enforces one layered structure. Paths are relative to the Go module root." },
        {
          kind: "table",
          head: ["Folder", "Role", "May import from the module"],
          rows: [
            ["app/", "Composition root: configuration, wiring, the real clock", "Anything; only cmd/ and main packages import it"],
            ["cmd/<binary>/", "Thin mains and generators", "Anything; nothing imports it"],
            ["port/", "Interfaces, plain types, sentinel errors, the coded error type", "port/, schema/, api/"],
            ["core/", "Pure domain rules, no I/O", "core/, port/, schema/"],
            ["service/", "Operations over core and ports; knows no transport", "Anything but app/ and cmd/"],
            ["schema/, api/", "Contract data and generated types", "Their own subtree (api/ may use schema/)"],
            ["store/, server/, internal/<helper>/", "Adapters (one folder per driver) and private helpers", "Anything but app/ and cmd/"],
          ],
        },
        { kind: "p", text: "Test files may import anything except cmd/. Reported folder names at the root or under internal/: domain, ports, application, adapters, adapter, bootstrap, infrastructure, infra, usecase, usecases, pkg, util, utils, common, helpers, shared, lib. Layer folders sit at the module root, not under internal/." },
      ],
    },
    {
      id: "baseline",
      title: "Baseline gate",
      group: "deep",
      blocks: [
        { kind: "p", text: "A repository that cannot reach zero findings in one change commits a baseline and fails only on new findings." },
        {
          kind: "code",
          lang: "sh",
          code: "vlint -baseline lint/vlint-baseline.txt -write ./...   # record today's findings\nvlint -baseline lint/vlint-baseline.txt ./...          # in mise run check",
        },
        { kind: "p", text: "Each baseline line is the module-relative file, the analyzer, a hash of the reported source line (whitespace collapsed) and the message. There is no line number, so edits elsewhere in a file do not disturb it; editing the reported line makes its finding new. Repeated identical lines count one finding each. The check prints N new findings and exits 3 when N > 0; entries that no longer occur are listed as fixed: without failing. Use the same flags when writing and checking. A package that fails to load fails the run." },
        { kind: "p", text: "For golangci-lint the equivalent is issues.new-from-merge-base in the overlay. It is diff-based: it needs the git history and the ref locally (fetch origin/main in a shallow CI clone) and checks nothing on the base branch itself." },
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
            ["How a repository gets the rules", "Pinned vlint binary via mise.toml or go run", "A dependency in each go.mod", "Nothing added to go.mod; every machine runs the same rules"],
            ["Config ownership", "Generated from shared.yml plus an overlay limited to three keys", "Per-repository free-form config", "Repositories cannot enable extra linters or loosen shared settings"],
            ["Overlay conflicts", "Any other key refused; a depguard rule may not reuse a shared rule's name", "Silent override", "Keeps the shared rules authoritative"],
            ["Autofix", "errorlint and formatters only", "Broad --fix", "Risky fixes stay manual; run tests after %v to %w"],
            ["Baseline key", "File, analyzer, line hash, message", "Line numbers", "Edits elsewhere in a file do not disturb it"],
            ["Speed", "Three tiers with a lighter preset", "One full run on every commit", "Fast preset drops gosec, contextcheck, sloglint, testifylint, which run in the full tier only"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          text: "Known limits: files behind a build tag are analyzed only when the tag is set; a partial run cannot list fixed baseline entries for vlint changed; the diff-based golangci gate checks nothing on the base branch; the repository's own dependency table governs finer edges between adapters.",
        },
      ],
    },
    {
      id: "files",
      title: "Key files",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "README.md", note: "Rules, tiers, layout, configuration and security notes" },
            { path: "cmd/vlint/main.go", note: "Entry point: analyzer run, golangci and fix subcommands" },
            { path: "cmd/vlint/changed.go", note: "The changed tier" },
            { path: "cmd/vlint/fast.go", note: "The fast tier: goimports and revive" },
            { path: "golangci/golangci.go", note: "Config generation, overlay, drift check" },
            { path: "golangci/shared.yml", note: "The shared golangci-lint config" },
            { path: "golangci/revive.toml", note: "The shared revive config" },
            { path: "internal/driver/driver.go", note: "Package loading and analyzer execution" },
            { path: "internal/baseline/baseline.go", note: "Baseline read, write and filter" },
            { path: "internal/changed/changed.go", note: "Changed files to packages and modules" },
            { path: "passes/layout", note: "The layout analyzer and its testdata" },
            { path: "mise.toml", note: "Tasks: lint-fast, lint, lint-full, test, check, semgrep" },
            { path: "lefthook.yml", note: "pre-commit and pre-push wiring" },
          ],
        },
      ],
    },
  ],
};

const doc: Partial<Record<Lang, ProjectDoc>> = { en };

export default doc;
