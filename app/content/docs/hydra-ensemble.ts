import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const en: ProjectDoc = {
  tagline: "A cross-platform desktop app that runs coding-agent sessions in parallel, each in its own PTY, git worktree and config directory.",
  status: "open source (MIT)",
  facts: [
    { label: "Stack", value: "Tauri v2, Rust, React, TypeScript" },
    { label: "License", value: "MIT" },
    { label: "Platforms", value: "Linux, Windows, macOS" },
    { label: "Terminal", value: "xterm.js over portable-pty" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      group: "start",
      blocks: [
        { kind: "p", text: "hydra ensemble is a desktop terminal for running several coding agents side by side. Each session is a real PTY running a provider CLI (claude, codex, copilot, cursor, grok), usually inside its own git worktree, with its own configuration directory." },
        { kind: "p", text: "The problem it solves is collision. Two agents in one checkout overwrite each other's files, and two sessions sharing one config directory share logins, locks and JSONL histories. Hydra gives every session a branch and a config dir of its own, so parallel work stays separable." },
        { kind: "p", text: "On top of that it watches each session. It classifies the PTY stream into a live state, tails the CLI's JSONL transcript for tokens and cost, and surfaces the result as a status pill per session. It also bundles a CodeMirror 6 editor with LSP, a toolkit of one-click commands, a floating quick terminal and a PR inspector." },
        {
          kind: "table",
          head: ["Area", "What it does"],
          rows: [
            ["Terminal", "Multi-tab xterm.js with ANSI, true color, mouse and resize"],
            ["Isolation", "One git worktree and one provider config dir per session"],
            ["Status", "thinking, generating, idle, needs-attention from the PTY stream"],
            ["Cost", "Token and cost data read from the CLI's JSONL transcript"],
            ["Editor", "CodeMirror 6 with LSP diagnostics, hover, completions and formatting"],
            ["PR inspector", "Lists and diffs open GitHub PRs through the gh CLI"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Install and run",
      group: "start",
      blocks: [
        { kind: "p", text: "Releases ship a .deb or AppImage on Linux, an NSIS .exe on Windows and a .dmg on macOS. To build from source you need a stable Rust toolchain, Node 22 as the renderer build tool, npm and git. Node is not a runtime dependency: the shipped app is a native Tauri binary." },
        { kind: "code", lang: "bash", caption: "Linux build prerequisites (Debian/Ubuntu)", code: "sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev patchelf" },
        { kind: "code", lang: "bash", caption: "Run from source", code: "git clone https://github.com/javabetatester/hydra-ensemble.git\ncd hydra-ensemble\nnvm use\nnpm install\nnpm run tauri:dev" },
        { kind: "code", lang: "bash", caption: "Production build and the Arch package", code: "npm run tauri:build\n./scripts/install-arch.sh" },
        { kind: "p", text: "Installers land in src-tauri/target/release/bundle/. On Arch the script builds a native .pkg.tar.zst into dist/arch/ and installs it, system-wide with --system or into ~/.local without sudo." },
        {
          kind: "table",
          head: ["Requirement", "Needed for"],
          rows: [
            ["Claude Code (or another provider CLI) on PATH", "Running sessions"],
            ["gh, installed and authenticated", "PR inspector"],
            ["typescript-language-server, gopls, pyright-langserver, rust-analyzer", "Editor LSP per language; plain highlighting otherwise"],
            ["WebView2 Runtime", "Windows; preinstalled on 11, bundled with the installer on 10"],
          ],
        },
        {
          kind: "table",
          head: ["Setting", "Effect"],
          rows: [
            ["HYDRA_USER_DATA", "Overrides the user data directory, including keybindings.json"],
            ["~/.hydra-ensemble/keybindings.json", "User keybindings; a command starting with - removes a shortcut"],
            ["portable.txt or data/ sentinel", "Redirects the sessions and accounts roots next to the binary"],
            ["HYDRA_MCP=1", "Enables the MCP control plane"],
          ],
        },
        { kind: "code", lang: "bash", caption: "Quality gates", code: "npm run typecheck\nnpm run lint\nnpm test\nnpm run build\ncd src-tauri && cargo check" },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      group: "how",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/desk", caption: "Every session is a terminal wired to its own PTY and its own worktree branch." },
        { kind: "p", text: "A Rust core owns processes, files and git. A React renderer in the platform WebView owns the UI. They meet at one module, src/renderer/tauri-api, the only place that imports @tauri-apps/*." },
        {
          kind: "code",
          lang: "text",
          code: "WebView (React + zustand)\n  views -> stores -> tauri-api (invoke / listen / Channel)\n                          |\n Tauri core (Rust, src-tauri/src)\n  commands + events (generate_handler! in lib.rs)\n   |-- pty/        portable-pty, scrollback, coalescer\n   |-- analyzer/   PTY stream -> session state\n   |-- claude/     JSONL watcher, transcript parser\n   |-- session/    lifecycle, config isolation, binding\n   |-- git/        worktrees, status, diff, remote\n   |-- accounts/   per-account config dirs\n   '-- forge/      PR data via gh\n                          |\n   agent CLI in a worktree, own config dir, writes JSONL",
        },
        {
          kind: "list",
          items: [
            "Each Tauri command lives in its domain module and must be registered in the generate_handler! list in lib.rs.",
            "Hot streams (pty data, LSP messages) use a Channel per window label; other events use AppHandle::emit.",
            "Session state has two sources: the PTY analyzer and the JSONL watcher, which is authoritative.",
            "Shared TypeScript contracts live in src/shared and are mirrored by serde camelCase structs in Rust.",
            "Secrets go through the OS keychain (keyring crate) and never reach the renderer.",
          ],
        },
      ],
    },
    {
      id: "session-lifecycle",
      title: "Session lifecycle",
      group: "how",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Worktree", text: "git_create_worktree runs git worktree add -b <name> under <repo>/.hydra-ensemble/worktrees/, based on the given or detected default branch. If the branch exists it retries without -b." },
            { title: "Config isolation", text: "create_isolated_session writes ~/.hydra-ensemble/sessions/<id>/meta.json and picks a config dir: a saved account first, then a fresh per-session dir, then the host login." },
            { title: "Spawn", text: "PtyManager::spawn starts the provider CLI in a portable-pty pair with a sanitized environment and the config dir variable exported on the launch line." },
            { title: "Stream", text: "Reader output is decoded, coalesced and sent to the window over a Channel; the same text is fed to the analyzer." },
            { title: "Track", text: "The analyzer emits session:state; the JSONL watcher resolves the transcript and emits authoritative state, tokens and cost." },
            { title: "Teardown", text: "Kill drops the scrollback; destroy_isolated_session removes the session directory; git_remove_worktree runs git worktree remove --force." },
          ],
        },
      ],
    },
    {
      id: "state-detection",
      title: "State detection",
      group: "how",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/states", caption: "The analyzer reads the PTY text and lights one lamp per session; the JSONL ledger overrides it." },
        { kind: "p", text: "PtyStreamAnalyzer reads the ANSI-stripped tail of the output and compares the freshest position of four phrase families: working, thinking, idle and attention. The families are per provider (AnalyzerProfileId: Claude, Cursor, Grok, Generic). For Claude, working is for example \"esc to interrupt\"." },
        { kind: "list", items: [
          "States are SessionState: idle, thinking, generating, userInput, needsAttention.",
          "Analysis is frame-throttled at THROTTLE_MS = 80 and looks at a recent-text window of 8000 characters.",
          "A submit mark lives 8 s (SUBMIT_MARK_TTL_MS) and at most 45 s.",
          "classify_pty_failure reads the same tail for refusal, quota and login failures.",
        ] },
        { kind: "p", text: "Analyzer output alone can latch a wrong state, so the JSONL watcher overrides it. AnalyzerManager runs a watchdog every 2 s. A latched authoritative state older than 8 s (AUTHORITATIVE_STALE_MS) with a working state is re-evaluated, which reclaims sessions that stopped writing." },
      ],
    },
    {
      id: "pty-streaming",
      title: "PTY streaming",
      group: "deep",
      blocks: [
        { kind: "p", text: "The coalescer exists because of a measurement recorded in the code (spike F00.2): the cost of tauri::ipc::Channel is the message count, not the bytes. 2 KB chunks at a high rate froze WebKitGTK at 0.4 to 0.7 FPS, while the same volume in 32 KB messages ran fluidly at 165 MB/s." },
        {
          kind: "table",
          head: ["Constant", "Value", "Role"],
          rows: [
            ["WINDOW", "12 ms", "Flush even a small buffer so keystrokes stay interactive"],
            ["FLUSH_BYTES", "32 KB", "Size flush; bounds memory"],
            ["CHANNEL_CAPACITY", "256", "Reader to coalescer queue; each item at most one 64 KiB chunk"],
            ["SCROLLBACK_CAP_BYTES", "4 MiB", "Per-session replay ring"],
          ],
        },
        { kind: "p", text: "Backpressure is the bounded channel: when the consumer stalls, the reader blocks, the kernel PTY buffer fills and the child slows down. The window starts at the first byte and is not reset by later chunks, so latency is bounded by WINDOW." },
        { kind: "p", text: "PtyScrollback assigns a monotonic seq to each chunk. A snapshot carries its seq and the renderer drops live chunks with seq <= snapSeq, so no boundary byte is written twice: a duplicated byte inside an ANSI escape corrupts the frame. A respawn resets the ring and seq returns to 0." },
        { kind: "p", text: "pty/env.rs strips LD_PRELOAD, LD_LIBRARY_PATH, LD_AUDIT, the DYLD_* injection variables and NODE_OPTIONS from every spawned environment." },
      ],
    },
    {
      id: "jsonl-cost",
      title: "JSONL and cost",
      group: "deep",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/cost", caption: "The watcher tails the JSONL ledger and prices tokens by model rate into the cost meter." },
        { kind: "p", text: "JsonlWatcher tails Claude's <uuid>.jsonl, accumulating tokens, cost and context, deriving turn state, the CLI's session name and the resume id. A launch passes --session-id <uuid>, so resolving the file is a direct lookup; a recency scan is the fallback after a window." },
        { kind: "list", items: [
          "Cadences: RESOLVE_POLL 3000 ms, TAIL_POLL 5000 ms, with notify as the primary signal.",
          "Re-pin: /clear and --fork-session create a new jsonl in the same project dir. Re-pinning needs evidence from session::binding::arbitrate (fork lineage or a typed /clear within 30 s); a newer external session is never adopted.",
          "Claims: a shared uuid to session map stops two sessions in one cwd from adopting the same file.",
          "Safe catch-up: on attach or re-pin, working states derived from older lines are not emitted, so a file that ended on a tool_use cannot latch Generating on a stopped session.",
        ] },
        {
          kind: "table",
          head: ["Model", "Input / output per million tokens"],
          rows: [
            ["opus", "15 / 75"],
            ["sonnet (and fallback)", "3 / 15"],
            ["haiku", "0.25 / 1.25"],
          ],
        },
        { kind: "p", text: "These are hardcoded constants in jsonl_watcher.rs, not live prices. Cache creation is priced at 1.25 times input and cache read at 0.1 times." },
      ],
    },
    {
      id: "isolation",
      title: "Config isolation",
      group: "deep",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/lockers", caption: "Each session gets its own config directory; a saved account is shared by its sessions." },
        { kind: "p", text: "Config-dir precedence in create_isolated_session is: saved account, then fresh per-session dir, then host login. Only the last leaves the config variable unset." },
        {
          kind: "table",
          head: ["Case", "Config dir"],
          rows: [
            ["Saved account", "~/.hydra-ensemble/accounts/<provider>/<accountId>/, persistent and shared by its sessions"],
            ["Fresh config", "~/.hydra-ensemble/sessions/<id>/<provider>/, ephemeral"],
            ["Neither", "Host dir such as ~/.claude, ~/.codex, ~/.copilot, ~/.cursor, ~/.grok"],
          ],
        },
        { kind: "p", text: "Each session also gets HYDRA_ENSEMBLE_SESSION_ID in its environment. The provider variable (CLAUDE_CONFIG_DIR for Claude, CODEX_HOME for Codex) is exported on the launch line. For Grok, the resolver prefers the candidate directory that holds auth.json over an empty inherited GROK_HOME." },
        { kind: "p", text: "Persistent state goes to store.json: 2-space indented, written with a 300 ms debounce, flushed on shutdown, with .bak.v{N} snapshots on schema migration and corruption quarantine." },
      ],
    },
    {
      id: "worktrees-orchestration",
      title: "Worktrees and canvas",
      group: "deep",
      blocks: [
        { kind: "p", text: "A worktree is \"managed\" when its realpath contains /.hydra-ensemble/worktrees/, normalized for Windows separators and long-path prefixes. The first entry of git worktree list --porcelain is the main one." },
        { kind: "p", text: "The canvas surface runs multi-agent orchestration. Each node is a live CLI terminal; nodes are wired with arrows and coordinate through an on-disk file bus: BRIEFING.md, an inbox, [HYDRA:*] sentinels and hydra-send and hydra-await helpers, with server-side chaining of workflow steps. Timers and thresholds are constants at the top of orchestration/bus.rs. A legacy team orchestrator (orchestra/) still exists as an overlay." },
        { kind: "p", text: "The PR inspector shells out to gh from forge/ and git/query.rs." },
      ],
    },
    {
      id: "decisions",
      title: "Decisions and limits",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decision", "Chosen", "Rejected", "Why"],
          rows: [
            ["Shell", "Tauri v2 with a Rust core", "Electron", "Electron is no longer part of the project; native binary, no Node runtime"],
            ["PTY", "portable-pty", "node-pty", "Same crate WezTerm uses; runs in the Rust core"],
            ["IPC for output", "Coalesced Channel messages", "One event per read", "Message count was the measured cost (spike F00.2)"],
            ["State source", "PTY analyzer plus authoritative JSONL", "PTY text alone", "Phrase matching can latch; transcripts are the truth"],
            ["Isolation", "Worktree plus config dir per session", "Shared checkout and login", "Prevents file, lock and history collisions"],
            ["Cost", "Hardcoded per-model rates", "Not stated in the repo", "Rates live in code, so they can go stale"],
            ["Forge access", "gh CLI", "Not stated in the repo", "Reuses the user's existing gh login"],
          ],
        },
        {
          kind: "callout",
          tone: "warn",
          text: "Known limits: PTY state depends on provider phrases, so a CLI wording change needs a marker update. GitHub Releases do not yet ship Linux Arch assets. The e2e harness is blocked; the smoke check is the MCP scenario 09-canvas. The plugin platform RFC is marked pending review.",
        },
      ],
    },
    {
      id: "files",
      title: "Files",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "docs/MAPA.md", note: "Canonical map of where each domain lives" },
            { path: "docs/ARCHITECTURE.md", note: "Normative architecture and the two orchestration subsystems" },
            { path: "src-tauri/src/lib.rs", note: "Composition and generate_handler! registration" },
            { path: "src-tauri/src/pty/manager.rs", note: "PtyManager, PtyScrollback, spawn and write" },
            { path: "src-tauri/src/pty/coalesce.rs", note: "12 ms / 32 KB coalescer with spike numbers" },
            { path: "src-tauri/src/pty/env.rs", note: "Environment blacklist and shell resolution" },
            { path: "src-tauri/src/analyzer/stream.rs", note: "PtyStreamAnalyzer state machine" },
            { path: "src-tauri/src/analyzer/manager.rs", note: "Per-session analyzers and the watchdog" },
            { path: "src-tauri/src/analyzer/profiles.rs", note: "Per-provider marker tables" },
            { path: "src-tauri/src/claude/jsonl_watcher.rs", note: "Transcript tail, cost accumulation, re-pin" },
            { path: "src-tauri/src/session/config_isolation.rs", note: "Session and account config dirs" },
            { path: "src-tauri/src/git/worktree.rs", note: "Create, list and remove worktrees" },
            { path: "src-tauri/src/store/mod.rs", note: "Debounced store.json with recovery" },
            { path: "src/renderer/tauri-api", note: "The only module importing @tauri-apps/*" },
            { path: "src/renderer/state/keybinds.ts", note: "Default shortcuts" },
          ],
        },
      ],
    },
  ],
};

const es: ProjectDoc = {
  tagline: "Una app de escritorio multiplataforma que ejecuta sesiones de agentes de programación en paralelo, cada una con su propio PTY, git worktree y directorio de configuración.",
  status: "código abierto (MIT)",
  facts: [
    { label: "Stack", value: "Tauri v2, Rust, React, TypeScript" },
    { label: "Licencia", value: "MIT" },
    { label: "Plataformas", value: "Linux, Windows, macOS" },
    { label: "Terminal", value: "xterm.js sobre portable-pty" },
  ],
  sections: [
    {
      id: "overview",
      title: "Visión general",
      group: "start",
      blocks: [
        { kind: "p", text: "hydra ensemble es una terminal de escritorio para ejecutar varios agentes de programación lado a lado. Cada sesión es un PTY real que ejecuta la CLI de un proveedor (claude, codex, copilot, cursor, grok), normalmente dentro de su propio git worktree, con su propio directorio de configuración." },
        { kind: "p", text: "El problema que resuelve es la colisión. Dos agentes en un mismo checkout se pisan los archivos, y dos sesiones que comparten un directorio de configuración comparten logins, locks e historiales JSONL. Hydra da a cada sesión una rama y un directorio de configuración propios, de modo que el trabajo en paralelo sigue siendo separable." },
        { kind: "p", text: "Además, vigila cada sesión. Clasifica el stream del PTY en un estado en vivo, sigue la transcripción JSONL de la CLI para obtener tokens y costo, y muestra el resultado como una píldora de estado por sesión. También incluye un editor CodeMirror 6 con LSP, un conjunto de comandos de un clic, una terminal rápida flotante y un inspector de PR." },
        {
          kind: "table",
          head: ["Área", "Qué hace"],
          rows: [
            ["Terminal", "xterm.js con varias pestañas, ANSI, true color, ratón y redimensionado"],
            ["Aislamiento", "Un git worktree y un directorio de configuración de proveedor por sesión"],
            ["Estado", "thinking, generating, idle, needs-attention a partir del stream del PTY"],
            ["Costo", "Datos de tokens y costo leídos de la transcripción JSONL de la CLI"],
            ["Editor", "CodeMirror 6 con diagnósticos LSP, hover, autocompletado y formateo"],
            ["Inspector de PR", "Lista y muestra el diff de los PR abiertos de GitHub mediante la CLI gh"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Instalar y ejecutar",
      group: "start",
      blocks: [
        { kind: "p", text: "Los releases incluyen un .deb o AppImage en Linux, un .exe NSIS en Windows y un .dmg en macOS. Para compilar desde el código fuente necesitas un toolchain estable de Rust, Node 22 como herramienta de build del renderer, npm y git. Node no es una dependencia de runtime: la app distribuida es un binario nativo de Tauri." },
        { kind: "code", lang: "bash", caption: "Requisitos de build en Linux (Debian/Ubuntu)", code: "sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev patchelf" },
        { kind: "code", lang: "bash", caption: "Ejecutar desde el código fuente", code: "git clone https://github.com/javabetatester/hydra-ensemble.git\ncd hydra-ensemble\nnvm use\nnpm install\nnpm run tauri:dev" },
        { kind: "code", lang: "bash", caption: "Build de producción y el paquete de Arch", code: "npm run tauri:build\n./scripts/install-arch.sh" },
        { kind: "p", text: "Los instaladores quedan en src-tauri/target/release/bundle/. En Arch el script construye un .pkg.tar.zst nativo en dist/arch/ y lo instala, en todo el sistema con --system o en ~/.local sin sudo." },
        {
          kind: "table",
          head: ["Requisito", "Necesario para"],
          rows: [
            ["Claude Code (u otra CLI de proveedor) en el PATH", "Ejecutar sesiones"],
            ["gh, instalado y autenticado", "Inspector de PR"],
            ["typescript-language-server, gopls, pyright-langserver, rust-analyzer", "LSP del editor por lenguaje; resaltado simple en caso contrario"],
            ["WebView2 Runtime", "Windows; preinstalado en 11, incluido con el instalador en 10"],
          ],
        },
        {
          kind: "table",
          head: ["Ajuste", "Efecto"],
          rows: [
            ["HYDRA_USER_DATA", "Reemplaza el directorio de datos del usuario, incluido keybindings.json"],
            ["~/.hydra-ensemble/keybindings.json", "Atajos del usuario; un comando que empieza con - elimina un atajo"],
            ["centinela portable.txt o data/", "Redirige las raíces de sesiones y cuentas junto al binario"],
            ["HYDRA_MCP=1", "Activa el plano de control MCP"],
          ],
        },
        { kind: "code", lang: "bash", caption: "Quality gates", code: "npm run typecheck\nnpm run lint\nnpm test\nnpm run build\ncd src-tauri && cargo check" },
      ],
    },
    {
      id: "architecture",
      title: "Arquitectura",
      group: "how",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/desk", caption: "Cada sesión es una terminal conectada a su propio PTY y a su propia rama de worktree." },
        { kind: "p", text: "Un núcleo Rust es dueño de procesos, archivos y git. Un renderer React en el WebView de la plataforma es dueño de la UI. Se encuentran en un único módulo, src/renderer/tauri-api, el único lugar que importa @tauri-apps/*." },
        {
          kind: "code",
          lang: "text",
          code: "WebView (React + zustand)\n  views -> stores -> tauri-api (invoke / listen / Channel)\n                          |\n Tauri core (Rust, src-tauri/src)\n  commands + events (generate_handler! in lib.rs)\n   |-- pty/        portable-pty, scrollback, coalescer\n   |-- analyzer/   PTY stream -> session state\n   |-- claude/     JSONL watcher, transcript parser\n   |-- session/    lifecycle, config isolation, binding\n   |-- git/        worktrees, status, diff, remote\n   |-- accounts/   per-account config dirs\n   '-- forge/      PR data via gh\n                          |\n   agent CLI in a worktree, own config dir, writes JSONL",
        },
        {
          kind: "list",
          items: [
            "Cada comando de Tauri vive en su módulo de dominio y debe registrarse en la lista generate_handler! de lib.rs.",
            "Los streams calientes (datos del pty, mensajes LSP) usan un Channel por etiqueta de ventana; los demás eventos usan AppHandle::emit.",
            "El estado de la sesión tiene dos fuentes: el analizador del PTY y el watcher de JSONL, que es el autoritativo.",
            "Los contratos TypeScript compartidos viven en src/shared y se reflejan en structs serde camelCase en Rust.",
            "Los secretos pasan por el llavero del SO (crate keyring) y nunca llegan al renderer.",
          ],
        },
      ],
    },
    {
      id: "session-lifecycle",
      title: "Ciclo de vida de una sesión",
      group: "how",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Worktree", text: "git_create_worktree ejecuta git worktree add -b <name> bajo <repo>/.hydra-ensemble/worktrees/, a partir de la rama por defecto indicada o detectada. Si la rama existe, reintenta sin -b." },
            { title: "Aislamiento de configuración", text: "create_isolated_session escribe ~/.hydra-ensemble/sessions/<id>/meta.json y elige un directorio de configuración: primero una cuenta guardada, luego un directorio nuevo por sesión y, por último, el login del host." },
            { title: "Arranque", text: "PtyManager::spawn inicia la CLI del proveedor en un par portable-pty con un entorno saneado y la variable del directorio de configuración exportada en la línea de lanzamiento." },
            { title: "Stream", text: "La salida del lector se decodifica, se coalesce y se envía a la ventana por un Channel; el mismo texto alimenta al analizador." },
            { title: "Seguimiento", text: "El analizador emite session:state; el watcher de JSONL resuelve la transcripción y emite el estado autoritativo, los tokens y el costo." },
            { title: "Cierre", text: "Kill descarta el scrollback; destroy_isolated_session elimina el directorio de la sesión; git_remove_worktree ejecuta git worktree remove --force." },
          ],
        },
      ],
    },
    {
      id: "state-detection",
      title: "Detección de estado",
      group: "how",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/states", caption: "El analizador lee el texto del PTY y enciende una lámpara por sesión; el libro JSONL la anula." },
        { kind: "p", text: "PtyStreamAnalyzer lee la cola de la salida sin ANSI y compara la posición más reciente de cuatro familias de frases: working, thinking, idle y attention. Las familias son por proveedor (AnalyzerProfileId: Claude, Cursor, Grok, Generic). Para Claude, working es por ejemplo \"esc to interrupt\"." },
        { kind: "list", items: [
          "Los estados son SessionState: idle, thinking, generating, userInput, needsAttention.",
          "El análisis se limita por frame a THROTTLE_MS = 80 y mira una ventana de texto reciente de 8000 caracteres.",
          "Una marca de submit dura 8 s (SUBMIT_MARK_TTL_MS) y como máximo 45 s.",
          "classify_pty_failure lee la misma cola para detectar fallos de rechazo, cuota y login.",
        ] },
        { kind: "p", text: "La salida del analizador por sí sola puede fijar un estado erróneo, por eso el watcher de JSONL la anula. AnalyzerManager ejecuta un watchdog cada 2 s. Un estado autoritativo fijado con más de 8 s (AUTHORITATIVE_STALE_MS) junto con un estado working se reevalúa, lo que recupera las sesiones que dejaron de escribir." },
      ],
    },
    {
      id: "pty-streaming",
      title: "Streaming del PTY",
      group: "deep",
      blocks: [
        { kind: "p", text: "El coalescer existe por una medición registrada en el código (spike F00.2): el costo de tauri::ipc::Channel es la cantidad de mensajes, no los bytes. Fragmentos de 2 KB a alta tasa congelaron WebKitGTK a 0,4-0,7 FPS, mientras que el mismo volumen en mensajes de 32 KB corrió fluido a 165 MB/s." },
        {
          kind: "table",
          head: ["Constante", "Valor", "Función"],
          rows: [
            ["WINDOW", "12 ms", "Vacía incluso un buffer pequeño para que las pulsaciones sigan siendo interactivas"],
            ["FLUSH_BYTES", "32 KB", "Vaciado por tamaño; acota la memoria"],
            ["CHANNEL_CAPACITY", "256", "Cola del lector al coalescer; cada elemento es como máximo un fragmento de 64 KiB"],
            ["SCROLLBACK_CAP_BYTES", "4 MiB", "Anillo de reproducción por sesión"],
          ],
        },
        { kind: "p", text: "El backpressure es el canal acotado: cuando el consumidor se detiene, el lector se bloquea, el buffer del PTY en el kernel se llena y el proceso hijo se ralentiza. La ventana empieza en el primer byte y los fragmentos posteriores no la reinician, así que la latencia queda acotada por WINDOW." },
        { kind: "p", text: "PtyScrollback asigna un seq monótono a cada fragmento. Un snapshot lleva su seq y el renderer descarta los fragmentos en vivo con seq <= snapSeq, de modo que ningún byte de frontera se escribe dos veces: un byte duplicado dentro de una secuencia de escape ANSI corrompe el frame. Un respawn reinicia el anillo y seq vuelve a 0." },
        { kind: "p", text: "pty/env.rs elimina LD_PRELOAD, LD_LIBRARY_PATH, LD_AUDIT, las variables de inyección DYLD_* y NODE_OPTIONS de cada entorno que se lanza." },
      ],
    },
    {
      id: "jsonl-cost",
      title: "JSONL y costo",
      group: "deep",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/cost", caption: "El watcher sigue el libro JSONL y valora los tokens por la tarifa del modelo en el medidor de costo." },
        { kind: "p", text: "JsonlWatcher sigue el <uuid>.jsonl de Claude, acumulando tokens, costo y contexto, y deriva el estado del turno, el nombre de sesión de la CLI y el id de reanudación. Un lanzamiento pasa --session-id <uuid>, así que resolver el archivo es una búsqueda directa; un escaneo por recencia es el respaldo tras una ventana." },
        { kind: "list", items: [
          "Cadencias: RESOLVE_POLL 3000 ms, TAIL_POLL 5000 ms, con notify como señal principal.",
          "Re-pin: /clear y --fork-session crean un nuevo jsonl en el mismo directorio de proyecto. Re-pin requiere evidencia de session::binding::arbitrate (linaje de fork o un /clear tecleado en 30 s); nunca se adopta una sesión externa más nueva.",
          "Claims: un mapa compartido de uuid a sesión evita que dos sesiones en el mismo cwd adopten el mismo archivo.",
          "Catch-up seguro: al adjuntar o hacer re-pin, los estados working derivados de líneas antiguas no se emiten, de modo que un archivo que terminó en un tool_use no puede fijar Generating en una sesión detenida.",
        ] },
        {
          kind: "table",
          head: ["Modelo", "Entrada / salida por millón de tokens"],
          rows: [
            ["opus", "15 / 75"],
            ["sonnet (y fallback)", "3 / 15"],
            ["haiku", "0.25 / 1.25"],
          ],
        },
        { kind: "p", text: "Son constantes fijas en jsonl_watcher.rs, no precios en vivo. La creación de caché se valora a 1,25 veces la entrada y la lectura de caché a 0,1 veces." },
      ],
    },
    {
      id: "isolation",
      title: "Aislamiento de configuración",
      group: "deep",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/lockers", caption: "Cada sesión recibe su propio directorio de configuración; una cuenta guardada la comparten sus sesiones." },
        { kind: "p", text: "La precedencia del directorio de configuración en create_isolated_session es: cuenta guardada, luego directorio nuevo por sesión, luego login del host. Solo el último deja sin definir la variable de configuración." },
        {
          kind: "table",
          head: ["Caso", "Directorio de configuración"],
          rows: [
            ["Cuenta guardada", "~/.hydra-ensemble/accounts/<provider>/<accountId>/, persistente y compartido por sus sesiones"],
            ["Configuración nueva", "~/.hydra-ensemble/sessions/<id>/<provider>/, efímero"],
            ["Ninguno", "Directorio del host como ~/.claude, ~/.codex, ~/.copilot, ~/.cursor, ~/.grok"],
          ],
        },
        { kind: "p", text: "Cada sesión también recibe HYDRA_ENSEMBLE_SESSION_ID en su entorno. La variable del proveedor (CLAUDE_CONFIG_DIR para Claude, CODEX_HOME para Codex) se exporta en la línea de lanzamiento. Para Grok, el resolvedor prefiere el directorio candidato que contiene auth.json sobre un GROK_HOME heredado vacío." },
        { kind: "p", text: "El estado persistente va a store.json: indentado con 2 espacios, escrito con un debounce de 300 ms, vaciado al apagar, con snapshots .bak.v{N} en migraciones de esquema y cuarentena por corrupción." },
      ],
    },
    {
      id: "worktrees-orchestration",
      title: "Worktrees y canvas",
      group: "deep",
      blocks: [
        { kind: "p", text: "Un worktree es \"gestionado\" cuando su realpath contiene /.hydra-ensemble/worktrees/, normalizado para separadores de Windows y prefijos de ruta larga. La primera entrada de git worktree list --porcelain es la principal." },
        { kind: "p", text: "La superficie canvas ejecuta orquestación multiagente. Cada nodo es una terminal de CLI en vivo; los nodos se conectan con flechas y se coordinan mediante un bus de archivos en disco: BRIEFING.md, un inbox, centinelas [HYDRA:*] y los helpers hydra-send y hydra-await, con encadenamiento de pasos del workflow en el servidor. Los timers y umbrales son constantes al inicio de orchestration/bus.rs. Un orquestador de equipos heredado (orchestra/) sigue existiendo como overlay." },
        { kind: "p", text: "El inspector de PR invoca gh desde forge/ y git/query.rs." },
      ],
    },
    {
      id: "decisions",
      title: "Decisiones y límites",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decisión", "Elegido", "Descartado", "Por qué"],
          rows: [
            ["Shell", "Tauri v2 con núcleo Rust", "Electron", "Electron ya no forma parte del proyecto; binario nativo, sin runtime de Node"],
            ["PTY", "portable-pty", "node-pty", "El mismo crate que usa WezTerm; corre en el núcleo Rust"],
            ["IPC para la salida", "Mensajes Channel coalescidos", "Un evento por lectura", "La cantidad de mensajes era el costo medido (spike F00.2)"],
            ["Fuente de estado", "Analizador del PTY más JSONL autoritativo", "Solo el texto del PTY", "La coincidencia de frases puede fijarse; las transcripciones son la verdad"],
            ["Aislamiento", "Worktree más directorio de configuración por sesión", "Checkout y login compartidos", "Evita colisiones de archivos, locks e historiales"],
            ["Costo", "Tarifas fijas por modelo", "No indicado en el repo", "Las tarifas viven en el código, así que pueden quedar obsoletas"],
            ["Acceso a la forge", "CLI gh", "No indicado en el repo", "Reutiliza el login de gh que el usuario ya tiene"],
          ],
        },
        {
          kind: "callout",
          tone: "warn",
          text: "Límites conocidos: el estado del PTY depende de frases del proveedor, así que un cambio de redacción en una CLI requiere actualizar un marcador. Los GitHub Releases todavía no incluyen assets de Linux para Arch. El harness e2e está bloqueado; la comprobación de humo es el escenario MCP 09-canvas. El RFC de la plataforma de plugins está marcado como pendiente de revisión.",
        },
      ],
    },
    {
      id: "files",
      title: "Archivos",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "docs/MAPA.md", note: "Mapa canónico de dónde vive cada dominio" },
            { path: "docs/ARCHITECTURE.md", note: "Arquitectura normativa y los dos subsistemas de orquestación" },
            { path: "src-tauri/src/lib.rs", note: "Composición y registro de generate_handler!" },
            { path: "src-tauri/src/pty/manager.rs", note: "PtyManager, PtyScrollback, spawn y write" },
            { path: "src-tauri/src/pty/coalesce.rs", note: "Coalescer de 12 ms / 32 KB con los números del spike" },
            { path: "src-tauri/src/pty/env.rs", note: "Lista negra de entorno y resolución del shell" },
            { path: "src-tauri/src/analyzer/stream.rs", note: "Máquina de estados de PtyStreamAnalyzer" },
            { path: "src-tauri/src/analyzer/manager.rs", note: "Analizadores por sesión y el watchdog" },
            { path: "src-tauri/src/analyzer/profiles.rs", note: "Tablas de marcadores por proveedor" },
            { path: "src-tauri/src/claude/jsonl_watcher.rs", note: "Seguimiento de la transcripción, acumulación de costo, re-pin" },
            { path: "src-tauri/src/session/config_isolation.rs", note: "Directorios de configuración de sesión y cuenta" },
            { path: "src-tauri/src/git/worktree.rs", note: "Crear, listar y eliminar worktrees" },
            { path: "src-tauri/src/store/mod.rs", note: "store.json con debounce y recuperación" },
            { path: "src/renderer/tauri-api", note: "El único módulo que importa @tauri-apps/*" },
            { path: "src/renderer/state/keybinds.ts", note: "Atajos por defecto" },
          ],
        },
      ],
    },
  ],
};

const ptBr: ProjectDoc = {
  tagline: "Um app desktop multiplataforma que roda sessões de agentes de programação em paralelo, cada uma com seu próprio PTY, git worktree e diretório de configuração.",
  status: "código aberto (MIT)",
  facts: [
    { label: "Stack", value: "Tauri v2, Rust, React, TypeScript" },
    { label: "Licença", value: "MIT" },
    { label: "Plataformas", value: "Linux, Windows, macOS" },
    { label: "Terminal", value: "xterm.js sobre portable-pty" },
  ],
  sections: [
    {
      id: "overview",
      title: "Visão geral",
      group: "start",
      blocks: [
        { kind: "p", text: "O hydra ensemble é um terminal desktop para rodar vários agentes de programação lado a lado. Cada sessão é um PTY real executando a CLI de um provedor (claude, codex, copilot, cursor, grok), geralmente dentro do seu próprio git worktree, com seu próprio diretório de configuração." },
        { kind: "p", text: "O problema que ele resolve é a colisão. Dois agentes no mesmo checkout sobrescrevem os arquivos um do outro, e duas sessões que compartilham um diretório de configuração compartilham logins, locks e históricos JSONL. O Hydra dá a cada sessão uma branch e um diretório de configuração próprios, então o trabalho em paralelo continua separável." },
        { kind: "p", text: "Além disso, ele observa cada sessão. Classifica o stream do PTY num estado ao vivo, acompanha a transcrição JSONL da CLI para obter tokens e custo, e mostra o resultado como uma pílula de status por sessão. Também traz um editor CodeMirror 6 com LSP, um kit de comandos de um clique, um terminal rápido flutuante e um inspetor de PR." },
        {
          kind: "table",
          head: ["Área", "O que faz"],
          rows: [
            ["Terminal", "xterm.js com várias abas, ANSI, true color, mouse e redimensionamento"],
            ["Isolamento", "Um git worktree e um diretório de configuração de provedor por sessão"],
            ["Status", "thinking, generating, idle, needs-attention a partir do stream do PTY"],
            ["Custo", "Dados de tokens e custo lidos da transcrição JSONL da CLI"],
            ["Editor", "CodeMirror 6 com diagnósticos LSP, hover, autocomplete e formatação"],
            ["Inspetor de PR", "Lista e mostra o diff dos PRs abertos do GitHub pela CLI gh"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Instalar e rodar",
      group: "start",
      blocks: [
        { kind: "p", text: "Os releases trazem um .deb ou AppImage no Linux, um .exe NSIS no Windows e um .dmg no macOS. Para compilar do código-fonte você precisa de um toolchain estável do Rust, Node 22 como ferramenta de build do renderer, npm e git. Node não é uma dependência de runtime: o app distribuído é um binário nativo do Tauri." },
        { kind: "code", lang: "bash", caption: "Pré-requisitos de build no Linux (Debian/Ubuntu)", code: "sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev patchelf" },
        { kind: "code", lang: "bash", caption: "Rodar a partir do código-fonte", code: "git clone https://github.com/javabetatester/hydra-ensemble.git\ncd hydra-ensemble\nnvm use\nnpm install\nnpm run tauri:dev" },
        { kind: "code", lang: "bash", caption: "Build de produção e o pacote do Arch", code: "npm run tauri:build\n./scripts/install-arch.sh" },
        { kind: "p", text: "Os instaladores ficam em src-tauri/target/release/bundle/. No Arch o script gera um .pkg.tar.zst nativo em dist/arch/ e o instala, no sistema todo com --system ou em ~/.local sem sudo." },
        {
          kind: "table",
          head: ["Requisito", "Necessário para"],
          rows: [
            ["Claude Code (ou outra CLI de provedor) no PATH", "Rodar sessões"],
            ["gh, instalado e autenticado", "Inspetor de PR"],
            ["typescript-language-server, gopls, pyright-langserver, rust-analyzer", "LSP do editor por linguagem; realce simples caso contrário"],
            ["WebView2 Runtime", "Windows; já vem no 11, incluído no instalador no 10"],
          ],
        },
        {
          kind: "table",
          head: ["Configuração", "Efeito"],
          rows: [
            ["HYDRA_USER_DATA", "Substitui o diretório de dados do usuário, incluindo keybindings.json"],
            ["~/.hydra-ensemble/keybindings.json", "Atalhos do usuário; um comando que começa com - remove um atalho"],
            ["sentinela portable.txt ou data/", "Redireciona as raízes de sessões e contas para junto do binário"],
            ["HYDRA_MCP=1", "Ativa o plano de controle MCP"],
          ],
        },
        { kind: "code", lang: "bash", caption: "Quality gates", code: "npm run typecheck\nnpm run lint\nnpm test\nnpm run build\ncd src-tauri && cargo check" },
      ],
    },
    {
      id: "architecture",
      title: "Arquitetura",
      group: "how",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/desk", caption: "Cada sessão é um terminal ligado ao seu próprio PTY e à sua própria branch de worktree." },
        { kind: "p", text: "Um núcleo Rust é dono de processos, arquivos e git. Um renderer React no WebView da plataforma é dono da UI. Eles se encontram num único módulo, src/renderer/tauri-api, o único lugar que importa @tauri-apps/*." },
        {
          kind: "code",
          lang: "text",
          code: "WebView (React + zustand)\n  views -> stores -> tauri-api (invoke / listen / Channel)\n                          |\n Tauri core (Rust, src-tauri/src)\n  commands + events (generate_handler! in lib.rs)\n   |-- pty/        portable-pty, scrollback, coalescer\n   |-- analyzer/   PTY stream -> session state\n   |-- claude/     JSONL watcher, transcript parser\n   |-- session/    lifecycle, config isolation, binding\n   |-- git/        worktrees, status, diff, remote\n   |-- accounts/   per-account config dirs\n   '-- forge/      PR data via gh\n                          |\n   agent CLI in a worktree, own config dir, writes JSONL",
        },
        {
          kind: "list",
          items: [
            "Cada comando do Tauri vive no seu módulo de domínio e precisa ser registrado na lista generate_handler! em lib.rs.",
            "Streams quentes (dados do pty, mensagens LSP) usam um Channel por label de janela; os demais eventos usam AppHandle::emit.",
            "O estado da sessão tem duas fontes: o analisador do PTY e o watcher de JSONL, que é o autoritativo.",
            "Os contratos TypeScript compartilhados ficam em src/shared e são espelhados por structs serde camelCase em Rust.",
            "Segredos passam pelo chaveiro do SO (crate keyring) e nunca chegam ao renderer.",
          ],
        },
      ],
    },
    {
      id: "session-lifecycle",
      title: "Ciclo de vida de uma sessão",
      group: "how",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Worktree", text: "git_create_worktree roda git worktree add -b <name> em <repo>/.hydra-ensemble/worktrees/, a partir da branch padrão informada ou detectada. Se a branch já existe, tenta de novo sem -b." },
            { title: "Isolamento de configuração", text: "create_isolated_session escreve ~/.hydra-ensemble/sessions/<id>/meta.json e escolhe um diretório de configuração: primeiro uma conta salva, depois um diretório novo por sessão e, por fim, o login do host." },
            { title: "Spawn", text: "PtyManager::spawn inicia a CLI do provedor num par portable-pty com um ambiente saneado e a variável do diretório de configuração exportada na linha de lançamento." },
            { title: "Stream", text: "A saída do leitor é decodificada, coalescida e enviada à janela por um Channel; o mesmo texto alimenta o analisador." },
            { title: "Acompanhamento", text: "O analisador emite session:state; o watcher de JSONL resolve a transcrição e emite o estado autoritativo, os tokens e o custo." },
            { title: "Encerramento", text: "Kill descarta o scrollback; destroy_isolated_session remove o diretório da sessão; git_remove_worktree roda git worktree remove --force." },
          ],
        },
      ],
    },
    {
      id: "state-detection",
      title: "Detecção de estado",
      group: "how",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/states", caption: "O analisador lê o texto do PTY e acende uma lâmpada por sessão; o livro-razão JSONL a sobrescreve." },
        { kind: "p", text: "PtyStreamAnalyzer lê o final da saída sem ANSI e compara a posição mais recente de quatro famílias de frases: working, thinking, idle e attention. As famílias são por provedor (AnalyzerProfileId: Claude, Cursor, Grok, Generic). Para o Claude, working é por exemplo \"esc to interrupt\"." },
        { kind: "list", items: [
          "Os estados são SessionState: idle, thinking, generating, userInput, needsAttention.",
          "A análise é limitada por frame em THROTTLE_MS = 80 e olha uma janela de texto recente de 8000 caracteres.",
          "Uma marca de submit dura 8 s (SUBMIT_MARK_TTL_MS) e no máximo 45 s.",
          "classify_pty_failure lê o mesmo trecho final para detectar falhas de recusa, cota e login.",
        ] },
        { kind: "p", text: "A saída do analisador sozinha pode travar num estado errado, por isso o watcher de JSONL a sobrescreve. AnalyzerManager roda um watchdog a cada 2 s. Um estado autoritativo travado há mais de 8 s (AUTHORITATIVE_STALE_MS) junto com um estado working é reavaliado, o que recupera sessões que pararam de escrever." },
      ],
    },
    {
      id: "pty-streaming",
      title: "Streaming do PTY",
      group: "deep",
      blocks: [
        { kind: "p", text: "O coalescer existe por causa de uma medição registrada no código (spike F00.2): o custo do tauri::ipc::Channel é a contagem de mensagens, não os bytes. Pedaços de 2 KB em alta taxa congelaram o WebKitGTK a 0,4 a 0,7 FPS, enquanto o mesmo volume em mensagens de 32 KB rodou fluido a 165 MB/s." },
        {
          kind: "table",
          head: ["Constante", "Valor", "Papel"],
          rows: [
            ["WINDOW", "12 ms", "Descarrega até um buffer pequeno para as teclas continuarem interativas"],
            ["FLUSH_BYTES", "32 KB", "Descarga por tamanho; limita a memória"],
            ["CHANNEL_CAPACITY", "256", "Fila do leitor para o coalescer; cada item é no máximo um pedaço de 64 KiB"],
            ["SCROLLBACK_CAP_BYTES", "4 MiB", "Anel de replay por sessão"],
          ],
        },
        { kind: "p", text: "O backpressure é o canal limitado: quando o consumidor trava, o leitor bloqueia, o buffer do PTY no kernel enche e o processo filho desacelera. A janela começa no primeiro byte e não é reiniciada por pedaços posteriores, então a latência é limitada por WINDOW." },
        { kind: "p", text: "PtyScrollback atribui um seq monotônico a cada pedaço. Um snapshot carrega seu seq e o renderer descarta pedaços ao vivo com seq <= snapSeq, de modo que nenhum byte de fronteira é escrito duas vezes: um byte duplicado dentro de uma sequência de escape ANSI corrompe o frame. Um respawn reinicia o anel e o seq volta a 0." },
        { kind: "p", text: "pty/env.rs remove LD_PRELOAD, LD_LIBRARY_PATH, LD_AUDIT, as variáveis de injeção DYLD_* e NODE_OPTIONS de todo ambiente lançado." },
      ],
    },
    {
      id: "jsonl-cost",
      title: "JSONL e custo",
      group: "deep",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/cost", caption: "O watcher acompanha o livro-razão JSONL e precifica os tokens pela tarifa do modelo no medidor de custo." },
        { kind: "p", text: "JsonlWatcher acompanha o <uuid>.jsonl do Claude, acumulando tokens, custo e contexto, e deriva o estado do turno, o nome da sessão da CLI e o id de retomada. Um lançamento passa --session-id <uuid>, então resolver o arquivo é uma busca direta; uma varredura por recência é o fallback depois de uma janela." },
        { kind: "list", items: [
          "Cadências: RESOLVE_POLL 3000 ms, TAIL_POLL 5000 ms, com notify como sinal principal.",
          "Re-pin: /clear e --fork-session criam um novo jsonl no mesmo diretório de projeto. O re-pin exige evidência de session::binding::arbitrate (linhagem de fork ou um /clear digitado em 30 s); uma sessão externa mais nova nunca é adotada.",
          "Claims: um mapa compartilhado de uuid para sessão impede que duas sessões no mesmo cwd adotem o mesmo arquivo.",
          "Catch-up seguro: ao anexar ou fazer re-pin, estados working derivados de linhas antigas não são emitidos, então um arquivo que terminou em um tool_use não consegue travar Generating numa sessão parada.",
        ] },
        {
          kind: "table",
          head: ["Modelo", "Entrada / saída por milhão de tokens"],
          rows: [
            ["opus", "15 / 75"],
            ["sonnet (e fallback)", "3 / 15"],
            ["haiku", "0.25 / 1.25"],
          ],
        },
        { kind: "p", text: "São constantes fixas em jsonl_watcher.rs, não preços ao vivo. A criação de cache é precificada a 1,25 vez a entrada e a leitura de cache a 0,1 vez." },
      ],
    },
    {
      id: "isolation",
      title: "Isolamento de configuração",
      group: "deep",
      blocks: [
        { kind: "scene", id: "hydra-ensemble/lockers", caption: "Cada sessão ganha seu próprio diretório de configuração; uma conta salva é compartilhada pelas suas sessões." },
        { kind: "p", text: "A precedência do diretório de configuração em create_isolated_session é: conta salva, depois diretório novo por sessão, depois login do host. Só o último deixa a variável de configuração sem definir." },
        {
          kind: "table",
          head: ["Caso", "Diretório de configuração"],
          rows: [
            ["Conta salva", "~/.hydra-ensemble/accounts/<provider>/<accountId>/, persistente e compartilhado pelas suas sessões"],
            ["Configuração nova", "~/.hydra-ensemble/sessions/<id>/<provider>/, efêmero"],
            ["Nenhum", "Diretório do host como ~/.claude, ~/.codex, ~/.copilot, ~/.cursor, ~/.grok"],
          ],
        },
        { kind: "p", text: "Cada sessão também recebe HYDRA_ENSEMBLE_SESSION_ID no seu ambiente. A variável do provedor (CLAUDE_CONFIG_DIR para o Claude, CODEX_HOME para o Codex) é exportada na linha de lançamento. Para o Grok, o resolvedor prefere o diretório candidato que contém auth.json a um GROK_HOME herdado vazio." },
        { kind: "p", text: "O estado persistente vai para store.json: indentado com 2 espaços, escrito com debounce de 300 ms, descarregado no desligamento, com snapshots .bak.v{N} em migrações de schema e quarentena em caso de corrupção." },
      ],
    },
    {
      id: "worktrees-orchestration",
      title: "Worktrees e canvas",
      group: "deep",
      blocks: [
        { kind: "p", text: "Um worktree é \"gerenciado\" quando seu realpath contém /.hydra-ensemble/worktrees/, normalizado para separadores do Windows e prefixos de caminho longo. A primeira entrada de git worktree list --porcelain é a principal." },
        { kind: "p", text: "A superfície canvas roda orquestração multiagente. Cada nó é um terminal de CLI ao vivo; os nós são ligados por setas e se coordenam por um barramento de arquivos em disco: BRIEFING.md, um inbox, sentinelas [HYDRA:*] e os helpers hydra-send e hydra-await, com encadeamento dos passos do workflow no servidor. Timers e limiares são constantes no topo de orchestration/bus.rs. Um orquestrador de equipes legado (orchestra/) ainda existe como overlay." },
        { kind: "p", text: "O inspetor de PR chama o gh a partir de forge/ e git/query.rs." },
      ],
    },
    {
      id: "decisions",
      title: "Decisões e limites",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decisão", "Escolhido", "Rejeitado", "Por quê"],
          rows: [
            ["Shell", "Tauri v2 com núcleo Rust", "Electron", "O Electron não faz mais parte do projeto; binário nativo, sem runtime de Node"],
            ["PTY", "portable-pty", "node-pty", "O mesmo crate que o WezTerm usa; roda no núcleo Rust"],
            ["IPC da saída", "Mensagens Channel coalescidas", "Um evento por leitura", "A contagem de mensagens era o custo medido (spike F00.2)"],
            ["Fonte de estado", "Analisador do PTY mais JSONL autoritativo", "Só o texto do PTY", "A correspondência de frases pode travar; as transcrições são a verdade"],
            ["Isolamento", "Worktree mais diretório de configuração por sessão", "Checkout e login compartilhados", "Evita colisões de arquivos, locks e históricos"],
            ["Custo", "Tarifas fixas por modelo", "Não declarado no repo", "As tarifas vivem no código, então podem ficar desatualizadas"],
            ["Acesso à forge", "CLI gh", "Não declarado no repo", "Reaproveita o login do gh que o usuário já tem"],
          ],
        },
        {
          kind: "callout",
          tone: "warn",
          text: "Limites conhecidos: o estado do PTY depende de frases do provedor, então uma mudança de texto numa CLI exige atualizar um marcador. Os GitHub Releases ainda não trazem assets de Linux para Arch. O harness e2e está bloqueado; a checagem de fumaça é o cenário MCP 09-canvas. O RFC da plataforma de plugins está marcado como pendente de revisão.",
        },
      ],
    },
    {
      id: "files",
      title: "Arquivos",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "docs/MAPA.md", note: "Mapa canônico de onde cada domínio vive" },
            { path: "docs/ARCHITECTURE.md", note: "Arquitetura normativa e os dois subsistemas de orquestração" },
            { path: "src-tauri/src/lib.rs", note: "Composição e registro de generate_handler!" },
            { path: "src-tauri/src/pty/manager.rs", note: "PtyManager, PtyScrollback, spawn e write" },
            { path: "src-tauri/src/pty/coalesce.rs", note: "Coalescer de 12 ms / 32 KB com os números do spike" },
            { path: "src-tauri/src/pty/env.rs", note: "Lista negra de ambiente e resolução do shell" },
            { path: "src-tauri/src/analyzer/stream.rs", note: "Máquina de estados do PtyStreamAnalyzer" },
            { path: "src-tauri/src/analyzer/manager.rs", note: "Analisadores por sessão e o watchdog" },
            { path: "src-tauri/src/analyzer/profiles.rs", note: "Tabelas de marcadores por provedor" },
            { path: "src-tauri/src/claude/jsonl_watcher.rs", note: "Acompanhamento da transcrição, acúmulo de custo, re-pin" },
            { path: "src-tauri/src/session/config_isolation.rs", note: "Diretórios de configuração de sessão e conta" },
            { path: "src-tauri/src/git/worktree.rs", note: "Criar, listar e remover worktrees" },
            { path: "src-tauri/src/store/mod.rs", note: "store.json com debounce e recuperação" },
            { path: "src/renderer/tauri-api", note: "O único módulo que importa @tauri-apps/*" },
            { path: "src/renderer/state/keybinds.ts", note: "Atalhos padrão" },
          ],
        },
      ],
    },
  ],
};

const doc: Partial<Record<Lang, ProjectDoc>> = { en, es, "pt-br": ptBr };

export default doc;
