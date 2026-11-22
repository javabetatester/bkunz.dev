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

const es: ProjectDoc = {
  tagline: "Un kit de lint para repositorios Go: una config de golangci-lint generada, una comprobación de deriva para ella y siete analizadores para lo que los linters estándar no ven.",
  status: "código abierto",
  facts: [
    { label: "Lenguaje", value: "Go 1.27" },
    { label: "Licencia", value: "MIT" },
    { label: "Binario", value: "vlint" },
    { label: "Analizadores", value: "7 (go/analysis)" },
  ],
  sections: [
    {
      id: "overview",
      title: "Visión general",
      group: "start",
      blocks: [
        { kind: "p", text: "go-lint es un módulo Go versionado con un único comando, vlint. Un repositorio lo fija en mise.toml (o lo ejecuta con go run en una versión fija), así que no se añade nada a su go.mod y cada máquina ejecuta las mismas reglas." },
        { kind: "p", text: "Existe para que las mismas reglas de lint, la misma config y las mismas comprobaciones se apliquen a todo repositorio Go que siga el estándar de ingeniería de Versatile. No reemplaza a golangci-lint: genera la config de esa herramienta y corre a su lado." },
        {
          kind: "table",
          head: ["Hace", "No hace"],
          rows: [
            ["Escribir .golangci.yml, .golangci-fast.yml y .revive.toml a partir de una config compartida más un pequeño overlay", "Dejar que un repositorio active linters extra o relaje ajustes compartidos"],
            ["Ejecutar los linters en tres niveles (rápido sobre archivos staged, cambiados desde el merge base, completo)", "Aplicar autofixes riesgosos: solo errorlint y los formateadores"],
            ["Ejecutar siete analizadores go/analysis: layout, clock, entorno, errores, tests, comentarios, referencias a registros de diseño", "Reemplazar a golangci-lint"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Puesta en marcha",
      group: "start",
      blocks: [
        { kind: "p", text: "Requisitos: Go 1.27, golangci-lint 2.15 y revive 1.17. Desde la raíz de un módulo Go:" },
        {
          kind: "code",
          lang: "sh",
          code: "vlint golangci          # writes .golangci.yml, .golangci-fast.yml and .revive.toml\nvlint ./...             # full tier: the analyzers on every package\ngolangci-lint run ./... # full tier: the stock linters",
        },
        { kind: "p", text: "vlint imprime una línea por hallazgo como file:line:col: message y termina con 3 cuando hay alguno, y con 1 cuando un paquete falla al cargar o al comprobar tipos. Fija las herramientas y conecta los niveles en mise.toml:" },
        {
          kind: "code",
          lang: "toml",
          code: '[tools]\ngo = "1.27.3"\n"go:github.com/versatile-sh/go-lint/cmd/vlint" = "0.3.0"\n"go:github.com/golangci/golangci-lint/v2/cmd/golangci-lint" = "2.15.0"\n"go:github.com/mgechev/revive" = "1.17.1"\n\n[tasks.lint-fast]\nrun = "vlint fast -fix"\n\n[tasks.lint]\nrun = ["vlint golangci -check", "vlint changed"]\n\n[tasks.lint-full]\nrun = ["vlint golangci -check", "vlint ./...", "golangci-lint run ./..."]\n\n[tasks.check]\nrun = [{ task = "lint-full" }, { task = "test" }]',
        },
        { kind: "p", text: "Con lefthook, pre-commit ejecuta mise run lint-fast {staged_files} y pre-push ejecuta mise run lint." },
        {
          kind: "table",
          head: ["Flag o archivo", "Efecto"],
          rows: [
            ["-layout, -errstring, ...", "Ejecutan solo los analizadores nombrados; -clockseam=false ejecuta todos menos uno"],
            ["-tags integration", "Analiza archivos tras build tags (separados por comas, pasados a la carga de paquetes)"],
            ["-baseline f [-write]", "Falla solo con hallazgos ausentes del archivo baseline; -write registra los hallazgos de hoy"],
            ["lint/golangci.local.yml", "El overlay del repositorio; acepta solo exclusiones, depguard e issues.new-from-merge-base"],
            ["vlint fix ./...", "golangci-lint --fix limitado a errorlint, y luego golangci-lint fmt"],
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Arquitectura",
      group: "how",
      blocks: [
        { kind: "scene", id: "go-lint/stamp", caption: "Una plantilla compartida más un pequeño overlay se estampa en las mismas tres hojas de config en cada repositorio." },
        { kind: "p", text: "vlint es un único binario (cmd/vlint) sobre cuatro paquetes internos, el generador de golangci y un paquete por analizador bajo passes/." },
        {
          kind: "code",
          lang: "text",
          code: "mise run check\n   |\n   v\n vlint golangci -check --> golangci/ (shared.yml + revive.toml + overlay) --> drift?\n   |\n   v\n vlint ./...  --> internal/driver --> passes/{layout,clockseam,envroot,\n   |                                         errstring,noskipenv,doccomment,adrref}\n   |            \\-> internal/baseline (optional \"don't get worse\" filter)\n   v\n golangci-lint run ./...  (with the generated .golangci.yml)",
        },
        {
          kind: "list",
          items: [
            "golangci/: embebe shared.yml y revive.toml, fusiona el overlay del repositorio, escribe los tres archivos de config e informa ErrDrift cuando un archivo versionado difiere.",
            "internal/driver: carga paquetes y ejecuta los analizadores seleccionados, produciendo valores Finding.",
            "internal/baseline: lee y escribe el archivo baseline y lo resta de los hallazgos.",
            "internal/changed: mapea archivos cambiados a paquetes y módulos para el nivel changed.",
            "internal/module: encuentra raíces de módulos y sus archivos go.mod.",
          ],
        },
      ],
    },
    {
      id: "gate",
      title: "La compuerta",
      group: "how",
      blocks: [
        { kind: "scene", id: "go-lint/drift", caption: "La comprobación de deriva regenera cada hoja y la mide contra la versionada; una diferencia falla con ErrDrift." },
        { kind: "p", text: "Las mismas reglas corren en tres profundidades, porque los linters pesados y una ejecución sobre todo el repositorio son demasiado lentos para cada commit." },
        {
          kind: "table",
          head: ["Nivel", "Cuándo", "Comando", "Ejecuta"],
          rows: [
            ["fast", "pre-commit", "vlint fast [-fix] <files>", "goimports sobre archivos staged, luego revive (solo AST) sobre sus paquetes, informando solo las líneas cambiadas desde HEAD"],
            ["changed", "pre-push", "vlint changed [-base origin/main] [-tags t] [-baseline f]", "analizadores de vlint y golangci-lint -c .golangci-fast.yml --new-from-merge-base sobre los paquetes cambiados desde el merge base"],
            ["full", "bajo demanda", "vlint ./... y golangci-lint run ./...", "Todo, con .golangci.yml"],
          ],
        },
        {
          kind: "steps",
          items: [
            { title: "Comprobar deriva", text: "vlint golangci -check regenera las tres configs en memoria y falla cuando una difiere del archivo versionado." },
            { title: "Ejecutar analizadores", text: "vlint ./... ejecuta los analizadores sobre cada paquete, incluidos los archivos de test donde una regla los cubre." },
            { title: "Ejecutar golangci-lint", text: "golangci-lint run ./... ejecuta los linters estándar con la config generada." },
          ],
        },
        { kind: "p", text: "vlint changed cuenta los archivos .go con commit, staged, unstaged y no rastreados (omitiendo testdata, vendor y carpetas que empiezan con punto o guion bajo), mapea cada uno a su paquete y al go.mod más cercano, y analiza todo el módulo cuando cambió go.mod, go.sum o una config de lint. -list imprime los paquetes y no ejecuta nada." },
      ],
    },
    {
      id: "analyzers",
      title: "Analizadores",
      group: "deep",
      blocks: [
        { kind: "scene", id: "go-lint/sieves", caption: "Cada paquete pasa por los siete analizadores; los hallazgos caen en la bandeja de rechazo." },
        {
          kind: "table",
          head: ["Analizador", "Informa", "Corrección"],
          rows: [
            ["layout", "Una carpeta fuera del layout, o un import contra las capas", "Mover el paquete; invertir la dependencia mediante un port"],
            ["clockseam", "time.Now, time.Since, time.Until fuera de la raíz de composición", "Inyectar un port de reloj"],
            ["envroot", "os.Getenv, os.LookupEnv, os.Environ fuera de la raíz de composición", "Leer la configuración una vez en app/ y pasar los valores"],
            ["errstring", "err.Error() comparado con ==, !=, switch o un matcher de strings, fuera de tests", "Un sentinel con errors.Is, o un error tipado con errors.As"],
            ["noskipenv", "Un test que se omite en silencio", "t.Fatal cuando falta el entorno; omitir solo bajo testing.Short(), una variable de exclusión con token SKIP, o runtime.GOOS/GOARCH"],
            ["doccomment", "Símbolo exportado sin doc comment, doc de más de dos líneas, doc en un símbolo no exportado, cualquier otro comentario", "Nombrar las cosas para que el código se lea sin comentarios; dos líneas en símbolos exportados"],
            ["adrref", "Un id de registro de diseño (ADR-12) o ruta de carpeta de registros en un comentario o string literal de Go, o un comentario de .proto", "Describir el comportamiento; mantener los registros fuera del repositorio"],
          ],
        },
        { kind: "p", text: "Exenciones: clockseam y envroot omiten paquetes main, app/, cmd/, archivos _test.go y paquetes test-kit cuyo nombre termina en test. doccomment permite directivas (//go:, //nolint:, build tags), bloques Output de ejemplos, archivos generados, comentarios sobre la cláusula package y docs de dos líneas en campos de struct y métodos de interfaz. noskipenv exime el idioma de re-exec, un test llamado *HelperProcess. adrref omite archivos Go generados y lee todos los archivos .proto de cada módulo analizado, omitiendo testdata, vendor, node_modules, carpetas con punto o guion bajo y módulos anidados." },
        { kind: "p", text: "Cada analizador tiene casos analysistest en passes/<analyzer>/testdata: cada regla tiene un caso que debe informarse y un caso que no." },
      ],
    },
    {
      id: "layout",
      title: "Estructura de carpetas",
      group: "deep",
      blocks: [
        { kind: "p", text: "El analizador layout hace cumplir una estructura en capas. Las rutas son relativas a la raíz del módulo Go." },
        {
          kind: "table",
          head: ["Carpeta", "Función", "Puede importar del módulo"],
          rows: [
            ["app/", "Raíz de composición: configuración, cableado, el reloj real", "Cualquier cosa; solo cmd/ y los paquetes main la importan"],
            ["cmd/<binary>/", "Mains finos y generadores", "Cualquier cosa; nada lo importa"],
            ["port/", "Interfaces, tipos simples, errores sentinel, el tipo de error con código", "port/, schema/, api/"],
            ["core/", "Reglas de dominio puras, sin I/O", "core/, port/, schema/"],
            ["service/", "Operaciones sobre core y ports; no conoce ningún transporte", "Cualquier cosa salvo app/ y cmd/"],
            ["schema/, api/", "Datos de contrato y tipos generados", "Su propio subárbol (api/ puede usar schema/)"],
            ["store/, server/, internal/<helper>/", "Adaptadores (una carpeta por driver) y helpers privados", "Cualquier cosa salvo app/ y cmd/"],
          ],
        },
        { kind: "p", text: "Los archivos de test pueden importar cualquier cosa excepto cmd/. Nombres de carpeta que se informan en la raíz o bajo internal/: domain, ports, application, adapters, adapter, bootstrap, infrastructure, infra, usecase, usecases, pkg, util, utils, common, helpers, shared, lib. Las carpetas de capa van en la raíz del módulo, no bajo internal/." },
      ],
    },
    {
      id: "baseline",
      title: "Compuerta baseline",
      group: "deep",
      blocks: [
        { kind: "p", text: "Un repositorio que no puede llegar a cero hallazgos en un solo cambio versiona un baseline y falla solo con hallazgos nuevos." },
        {
          kind: "code",
          lang: "sh",
          code: "vlint -baseline lint/vlint-baseline.txt -write ./...   # record today's findings\nvlint -baseline lint/vlint-baseline.txt ./...          # in mise run check",
        },
        { kind: "p", text: "Cada línea del baseline es el archivo relativo al módulo, el analizador, un hash de la línea de código informada (espacios colapsados) y el mensaje. No hay número de línea, así que editar otra parte de un archivo no lo altera; editar la línea informada hace nuevo su hallazgo. Las líneas idénticas repetidas cuentan un hallazgo cada una. La comprobación imprime N new findings y termina con 3 cuando N > 0; las entradas que ya no ocurren se listan como fixed: sin fallar. Usa los mismos flags al escribir y al comprobar. Un paquete que falla al cargar hace fallar la ejecución." },
        { kind: "p", text: "Para golangci-lint el equivalente es issues.new-from-merge-base en el overlay. Se basa en diff: necesita el historial de git y la ref en local (haz fetch de origin/main en un clon superficial de CI) y no comprueba nada en la propia rama base." },
      ],
    },
    {
      id: "decisions",
      title: "Decisiones",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decisión", "Elegido", "Descartado", "Por qué"],
          rows: [
            ["Cómo obtiene las reglas un repositorio", "Binario vlint fijado mediante mise.toml o go run", "Una dependencia en cada go.mod", "No se añade nada a go.mod; cada máquina ejecuta las mismas reglas"],
            ["Propiedad de la config", "Generada desde shared.yml más un overlay limitado a tres claves", "Config libre por repositorio", "Los repositorios no pueden activar linters extra ni relajar ajustes compartidos"],
            ["Conflictos del overlay", "Cualquier otra clave se rechaza; una regla depguard no puede reutilizar el nombre de una regla compartida", "Reemplazo silencioso", "Mantiene autoritativas las reglas compartidas"],
            ["Autofix", "Solo errorlint y formateadores", "--fix amplio", "Las correcciones riesgosas quedan manuales; ejecuta los tests tras %v a %w"],
            ["Clave del baseline", "Archivo, analizador, hash de línea, mensaje", "Números de línea", "Editar otras partes de un archivo no lo altera"],
            ["Velocidad", "Tres niveles con un preset más ligero", "Una ejecución completa en cada commit", "El preset rápido omite gosec, contextcheck, sloglint, testifylint, que corren solo en el nivel completo"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          text: "Límites conocidos: los archivos tras un build tag se analizan solo cuando el tag está definido; una ejecución parcial no puede listar entradas arregladas del baseline en vlint changed; la compuerta de golangci basada en diff no comprueba nada en la rama base; la tabla de dependencias del propio repositorio gobierna los bordes más finos entre adaptadores.",
        },
      ],
    },
    {
      id: "files",
      title: "Archivos clave",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "README.md", note: "Reglas, niveles, layout, configuración y notas de seguridad" },
            { path: "cmd/vlint/main.go", note: "Punto de entrada: ejecución de analizadores, subcomandos golangci y fix" },
            { path: "cmd/vlint/changed.go", note: "El nivel changed" },
            { path: "cmd/vlint/fast.go", note: "El nivel fast: goimports y revive" },
            { path: "golangci/golangci.go", note: "Generación de config, overlay, comprobación de deriva" },
            { path: "golangci/shared.yml", note: "La config compartida de golangci-lint" },
            { path: "golangci/revive.toml", note: "La config compartida de revive" },
            { path: "internal/driver/driver.go", note: "Carga de paquetes y ejecución de analizadores" },
            { path: "internal/baseline/baseline.go", note: "Lectura, escritura y filtrado del baseline" },
            { path: "internal/changed/changed.go", note: "De archivos cambiados a paquetes y módulos" },
            { path: "passes/layout", note: "El analizador layout y su testdata" },
            { path: "mise.toml", note: "Tareas: lint-fast, lint, lint-full, test, check, semgrep" },
            { path: "lefthook.yml", note: "Cableado de pre-commit y pre-push" },
          ],
        },
      ],
    },
  ],
};

const ptBr: ProjectDoc = {
  tagline: "Um kit de lint para repositórios Go: uma config do golangci-lint gerada, uma checagem de drift para ela e sete analisadores para o que os linters padrão não enxergam.",
  status: "código aberto",
  facts: [
    { label: "Linguagem", value: "Go 1.27" },
    { label: "Licença", value: "MIT" },
    { label: "Binário", value: "vlint" },
    { label: "Analisadores", value: "7 (go/analysis)" },
  ],
  sections: [
    {
      id: "overview",
      title: "Visão geral",
      group: "start",
      blocks: [
        { kind: "p", text: "O go-lint é um módulo Go versionado com um único comando, vlint. Um repositório o fixa no mise.toml (ou o roda com go run numa versão fixa), então nada é adicionado ao seu go.mod e toda máquina roda as mesmas regras." },
        { kind: "p", text: "Ele existe para que as mesmas regras de lint, a mesma config e as mesmas checagens valham para todo repositório Go que segue o padrão de engenharia da Versatile. Não substitui o golangci-lint: gera a config dessa ferramenta e roda ao lado dela." },
        {
          kind: "table",
          head: ["Faz", "Não faz"],
          rows: [
            ["Escrever .golangci.yml, .golangci-fast.yml e .revive.toml a partir de uma config compartilhada mais um pequeno overlay", "Deixar um repositório ativar linters extras ou afrouxar configurações compartilhadas"],
            ["Rodar os linters em três níveis (rápido em arquivos staged, alterados desde o merge base, completo)", "Aplicar autofixes arriscados: só errorlint e os formatadores"],
            ["Rodar sete analisadores go/analysis: layout, clock, ambiente, erros, testes, comentários, referências a registros de design", "Substituir o golangci-lint"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Primeiros passos",
      group: "start",
      blocks: [
        { kind: "p", text: "Pré-requisitos: Go 1.27, golangci-lint 2.15 e revive 1.17. A partir da raiz de um módulo Go:" },
        {
          kind: "code",
          lang: "sh",
          code: "vlint golangci          # writes .golangci.yml, .golangci-fast.yml and .revive.toml\nvlint ./...             # full tier: the analyzers on every package\ngolangci-lint run ./... # full tier: the stock linters",
        },
        { kind: "p", text: "O vlint imprime uma linha por achado como file:line:col: message e sai com 3 quando há algum, e com 1 quando um pacote falha ao carregar ou ao checar tipos. Fixe as ferramentas e ligue os níveis no mise.toml:" },
        {
          kind: "code",
          lang: "toml",
          code: '[tools]\ngo = "1.27.3"\n"go:github.com/versatile-sh/go-lint/cmd/vlint" = "0.3.0"\n"go:github.com/golangci/golangci-lint/v2/cmd/golangci-lint" = "2.15.0"\n"go:github.com/mgechev/revive" = "1.17.1"\n\n[tasks.lint-fast]\nrun = "vlint fast -fix"\n\n[tasks.lint]\nrun = ["vlint golangci -check", "vlint changed"]\n\n[tasks.lint-full]\nrun = ["vlint golangci -check", "vlint ./...", "golangci-lint run ./..."]\n\n[tasks.check]\nrun = [{ task = "lint-full" }, { task = "test" }]',
        },
        { kind: "p", text: "Com o lefthook, o pre-commit roda mise run lint-fast {staged_files} e o pre-push roda mise run lint." },
        {
          kind: "table",
          head: ["Flag ou arquivo", "Efeito"],
          rows: [
            ["-layout, -errstring, ...", "Rodam só os analisadores nomeados; -clockseam=false roda todos menos um"],
            ["-tags integration", "Analisa arquivos atrás de build tags (separadas por vírgula, passadas ao carregamento de pacotes)"],
            ["-baseline f [-write]", "Falha só com achados ausentes do arquivo baseline; -write registra os achados de hoje"],
            ["lint/golangci.local.yml", "O overlay do repositório; aceita só exclusões, depguard e issues.new-from-merge-base"],
            ["vlint fix ./...", "golangci-lint --fix limitado ao errorlint, e depois golangci-lint fmt"],
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Arquitetura",
      group: "how",
      blocks: [
        { kind: "scene", id: "go-lint/stamp", caption: "Um template compartilhado mais um pequeno overlay é carimbado nas mesmas três folhas de config em todo repositório." },
        { kind: "p", text: "O vlint é um único binário (cmd/vlint) sobre quatro pacotes internos, o gerador do golangci e um pacote por analisador em passes/." },
        {
          kind: "code",
          lang: "text",
          code: "mise run check\n   |\n   v\n vlint golangci -check --> golangci/ (shared.yml + revive.toml + overlay) --> drift?\n   |\n   v\n vlint ./...  --> internal/driver --> passes/{layout,clockseam,envroot,\n   |                                         errstring,noskipenv,doccomment,adrref}\n   |            \\-> internal/baseline (optional \"don't get worse\" filter)\n   v\n golangci-lint run ./...  (with the generated .golangci.yml)",
        },
        {
          kind: "list",
          items: [
            "golangci/: embute shared.yml e revive.toml, mescla o overlay do repositório, escreve os três arquivos de config e reporta ErrDrift quando um arquivo commitado difere.",
            "internal/driver: carrega pacotes e roda os analisadores selecionados, produzindo valores Finding.",
            "internal/baseline: lê e escreve o arquivo baseline e o subtrai dos achados.",
            "internal/changed: mapeia arquivos alterados para pacotes e módulos para o nível changed.",
            "internal/module: encontra raízes de módulo e seus arquivos go.mod.",
          ],
        },
      ],
    },
    {
      id: "gate",
      title: "O gate",
      group: "how",
      blocks: [
        { kind: "scene", id: "go-lint/drift", caption: "A checagem de drift regenera cada folha e a compara com a commitada; uma diferença falha com ErrDrift." },
        { kind: "p", text: "As mesmas regras rodam em três profundidades, porque os linters pesados e uma execução no repositório inteiro são lentos demais para cada commit." },
        {
          kind: "table",
          head: ["Nível", "Quando", "Comando", "Roda"],
          rows: [
            ["fast", "pre-commit", "vlint fast [-fix] <files>", "goimports nos arquivos staged, depois revive (só AST) nos pacotes deles, reportando só linhas alteradas desde o HEAD"],
            ["changed", "pre-push", "vlint changed [-base origin/main] [-tags t] [-baseline f]", "analisadores do vlint e golangci-lint -c .golangci-fast.yml --new-from-merge-base nos pacotes alterados desde o merge base"],
            ["full", "sob demanda", "vlint ./... e golangci-lint run ./...", "Tudo, com .golangci.yml"],
          ],
        },
        {
          kind: "steps",
          items: [
            { title: "Checar drift", text: "vlint golangci -check regenera as três configs em memória e falha quando uma difere do arquivo commitado." },
            { title: "Rodar analisadores", text: "vlint ./... roda os analisadores em todo pacote, incluindo arquivos de teste onde uma regra os cobre." },
            { title: "Rodar o golangci-lint", text: "golangci-lint run ./... roda os linters padrão com a config gerada." },
          ],
        },
        { kind: "p", text: "vlint changed conta arquivos .go commitados, staged, unstaged e não rastreados (ignorando testdata, vendor e pastas iniciadas por ponto ou sublinhado), mapeia cada um para seu pacote e o go.mod mais próximo, e analisa o módulo inteiro quando go.mod, go.sum ou uma config de lint mudou. -list imprime os pacotes e não roda nada." },
      ],
    },
    {
      id: "analyzers",
      title: "Analisadores",
      group: "deep",
      blocks: [
        { kind: "scene", id: "go-lint/sieves", caption: "Todo pacote passa pelos sete analisadores; os achados caem na bandeja de rejeitados." },
        {
          kind: "table",
          head: ["Analisador", "Reporta", "Correção"],
          rows: [
            ["layout", "Uma pasta fora do layout, ou um import contra as camadas", "Mover o pacote; inverter a dependência por um port"],
            ["clockseam", "time.Now, time.Since, time.Until fora da raiz de composição", "Injetar um port de relógio"],
            ["envroot", "os.Getenv, os.LookupEnv, os.Environ fora da raiz de composição", "Ler a configuração uma vez em app/ e passar os valores"],
            ["errstring", "err.Error() comparado com ==, !=, switch ou um matcher de strings, fora de testes", "Um sentinel com errors.Is, ou um erro tipado com errors.As"],
            ["noskipenv", "Um teste que pula em silêncio", "t.Fatal quando falta o ambiente; pular só sob testing.Short(), uma variável de opt-out com token SKIP, ou runtime.GOOS/GOARCH"],
            ["doccomment", "Símbolo exportado sem doc comment, doc com mais de duas linhas, doc em símbolo não exportado, qualquer outro comentário", "Nomear as coisas para o código ser lido sem comentários; duas linhas em símbolos exportados"],
            ["adrref", "Um id de registro de design (ADR-12) ou caminho de pasta de registros num comentário ou string literal Go, ou num comentário de .proto", "Descrever o comportamento; manter os registros fora do repositório"],
          ],
        },
        { kind: "p", text: "Isenções: clockseam e envroot ignoram pacotes main, app/, cmd/, arquivos _test.go e pacotes test-kit cujo nome termina em test. doccomment permite diretivas (//go:, //nolint:, build tags), blocos Output de exemplos, arquivos gerados, comentários acima da cláusula package e docs de duas linhas em campos de struct e métodos de interface. noskipenv isenta o idioma de re-exec, um teste chamado *HelperProcess. adrref ignora arquivos Go gerados e lê todo arquivo .proto de cada módulo analisado, ignorando testdata, vendor, node_modules, pastas iniciadas por ponto ou sublinhado e módulos aninhados." },
        { kind: "p", text: "Cada analisador tem casos analysistest em passes/<analyzer>/testdata: cada regra tem um caso que precisa ser reportado e um caso que não pode." },
      ],
    },
    {
      id: "layout",
      title: "Estrutura de pastas",
      group: "deep",
      blocks: [
        { kind: "p", text: "O analisador layout impõe uma estrutura em camadas. Os caminhos são relativos à raiz do módulo Go." },
        {
          kind: "table",
          head: ["Pasta", "Papel", "Pode importar do módulo"],
          rows: [
            ["app/", "Raiz de composição: configuração, wiring, o relógio real", "Qualquer coisa; só cmd/ e pacotes main a importam"],
            ["cmd/<binary>/", "Mains finos e geradores", "Qualquer coisa; nada o importa"],
            ["port/", "Interfaces, tipos simples, erros sentinel, o tipo de erro com código", "port/, schema/, api/"],
            ["core/", "Regras de domínio puras, sem I/O", "core/, port/, schema/"],
            ["service/", "Operações sobre core e ports; não conhece transporte", "Qualquer coisa exceto app/ e cmd/"],
            ["schema/, api/", "Dados de contrato e tipos gerados", "Sua própria subárvore (api/ pode usar schema/)"],
            ["store/, server/, internal/<helper>/", "Adaptadores (uma pasta por driver) e helpers privados", "Qualquer coisa exceto app/ e cmd/"],
          ],
        },
        { kind: "p", text: "Arquivos de teste podem importar qualquer coisa exceto cmd/. Nomes de pasta reportados na raiz ou sob internal/: domain, ports, application, adapters, adapter, bootstrap, infrastructure, infra, usecase, usecases, pkg, util, utils, common, helpers, shared, lib. As pastas de camada ficam na raiz do módulo, não sob internal/." },
      ],
    },
    {
      id: "baseline",
      title: "Gate de baseline",
      group: "deep",
      blocks: [
        { kind: "p", text: "Um repositório que não consegue chegar a zero achados numa só mudança commita um baseline e falha apenas com achados novos." },
        {
          kind: "code",
          lang: "sh",
          code: "vlint -baseline lint/vlint-baseline.txt -write ./...   # record today's findings\nvlint -baseline lint/vlint-baseline.txt ./...          # in mise run check",
        },
        { kind: "p", text: "Cada linha do baseline é o arquivo relativo ao módulo, o analisador, um hash da linha de código reportada (espaços colapsados) e a mensagem. Não há número de linha, então edições em outras partes do arquivo não o perturbam; editar a linha reportada torna o achado novo. Linhas idênticas repetidas contam um achado cada. A checagem imprime N new findings e sai com 3 quando N > 0; entradas que não ocorrem mais são listadas como fixed: sem falhar. Use as mesmas flags ao escrever e ao checar. Um pacote que falha ao carregar faz a execução falhar." },
        { kind: "p", text: "Para o golangci-lint o equivalente é issues.new-from-merge-base no overlay. Ele é baseado em diff: precisa do histórico do git e da ref localmente (faça fetch de origin/main num clone raso de CI) e não checa nada na própria branch base." },
      ],
    },
    {
      id: "decisions",
      title: "Decisões",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decisão", "Escolhido", "Rejeitado", "Por quê"],
          rows: [
            ["Como um repositório recebe as regras", "Binário vlint fixado via mise.toml ou go run", "Uma dependência em cada go.mod", "Nada é adicionado ao go.mod; toda máquina roda as mesmas regras"],
            ["Propriedade da config", "Gerada de shared.yml mais um overlay limitado a três chaves", "Config livre por repositório", "Repositórios não podem ativar linters extras nem afrouxar configurações compartilhadas"],
            ["Conflitos do overlay", "Qualquer outra chave é recusada; uma regra depguard não pode reusar o nome de uma regra compartilhada", "Sobrescrita silenciosa", "Mantém as regras compartilhadas como autoridade"],
            ["Autofix", "Só errorlint e formatadores", "--fix amplo", "Correções arriscadas continuam manuais; rode os testes após %v para %w"],
            ["Chave do baseline", "Arquivo, analisador, hash da linha, mensagem", "Números de linha", "Edições em outras partes do arquivo não o perturbam"],
            ["Velocidade", "Três níveis com um preset mais leve", "Uma execução completa a cada commit", "O preset rápido tira gosec, contextcheck, sloglint, testifylint, que rodam só no nível completo"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          text: "Limites conhecidos: arquivos atrás de uma build tag só são analisados quando a tag está definida; uma execução parcial não consegue listar entradas corrigidas do baseline em vlint changed; o gate do golangci baseado em diff não checa nada na branch base; a tabela de dependências do próprio repositório governa as bordas mais finas entre adaptadores.",
        },
      ],
    },
    {
      id: "files",
      title: "Arquivos principais",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "README.md", note: "Regras, níveis, layout, configuração e notas de segurança" },
            { path: "cmd/vlint/main.go", note: "Ponto de entrada: execução de analisadores, subcomandos golangci e fix" },
            { path: "cmd/vlint/changed.go", note: "O nível changed" },
            { path: "cmd/vlint/fast.go", note: "O nível fast: goimports e revive" },
            { path: "golangci/golangci.go", note: "Geração de config, overlay, checagem de drift" },
            { path: "golangci/shared.yml", note: "A config compartilhada do golangci-lint" },
            { path: "golangci/revive.toml", note: "A config compartilhada do revive" },
            { path: "internal/driver/driver.go", note: "Carregamento de pacotes e execução de analisadores" },
            { path: "internal/baseline/baseline.go", note: "Leitura, escrita e filtro do baseline" },
            { path: "internal/changed/changed.go", note: "De arquivos alterados para pacotes e módulos" },
            { path: "passes/layout", note: "O analisador layout e seu testdata" },
            { path: "mise.toml", note: "Tarefas: lint-fast, lint, lint-full, test, check, semgrep" },
            { path: "lefthook.yml", note: "Wiring de pre-commit e pre-push" },
          ],
        },
      ],
    },
  ],
};

const doc: Partial<Record<Lang, ProjectDoc>> = { en, es, "pt-br": ptBr };

export default doc;
