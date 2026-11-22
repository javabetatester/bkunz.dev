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

const doc: Partial<Record<Lang, ProjectDoc>> = { en };

export default doc;
