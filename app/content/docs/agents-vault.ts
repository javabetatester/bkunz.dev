import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const doc: Partial<Record<Lang, ProjectDoc>> = {
  en: {
    tagline: "One ledger for every Claude Code, Codex and Grok account, key and router, each opened signed in on its own home folder.",
    status: "source-available (GPL-3.0-or-later)",
    facts: [
      { label: "Language", value: "Rust 1.89+" },
      { label: "License", value: "GPL-3.0-or-later" },
      { label: "Binaries", value: "vvault, vvault-app (Tauri tray)" },
      { label: "Platforms", value: "Linux, macOS, Windows" },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        group: "start",
        blocks: [
          { kind: "p", text: "agents-vault keeps a ledger of every Claude Code, Codex and Grok account, API key and router you use. Pick an account and a terminal opens already signed in, on the right model, with your shared instructions in place. A tray icon shows each account's 5-hour and weekly limits." },
          { kind: "p", text: "The problem it removes is credential sharing between accounts. Every account gets its own home folder, so a rotating refresh token only ever exists in one place. It never stores, copies or refreshes an OAuth token: sign-in, refresh and sign-out stay with claude, codex and grok themselves." },
          { kind: "p", text: "It runs on your machine as a Rust workspace: a core library, the vvault command and a Tauri tray app. It is not affiliated with Anthropic, OpenAI or xAI." },
          {
            kind: "table",
            head: ["Crate or path", "Role"],
            rows: [
              ["crates/core", "ledger, launcher, keychain, limits, keep-alive"],
              ["crates/cli", "the vvault command"],
              ["app/src-tauri", "tray app backend"],
              ["app/ui", "tray interface in plain HTML, CSS and JS, no build step"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Install and run",
        group: "start",
        blocks: [
          { kind: "p", text: "Prerequisites: Rust 1.89 or later and, for the tray app, the Tauri 2 system dependencies." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/agents-vault\ncd agents-vault\ncargo install --path crates/cli\ncargo build --release -p vvault-app --features custom-protocol",
            caption: "put vvault-app next to vvault, or keep vvault on PATH; installers come from cargo tauri build in app/src-tauri",
          },
          { kind: "p", text: "With a fresh ledger, vvault list answers: No accounts yet. Try `vvault add work` or `vvault adopt personal`." },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add work                       # official Claude Code sign-in\nvvault add team --harness codex       # official Codex sign-in\nvvault add x --harness grok           # official Grok sign-in\nvvault adopt personal                 # track your existing ~/.claude in place\nvvault list\nvvault open work                      # new terminal window on that account\nvvault run work -- --resume           # same, in the current terminal\nvvault default work                   # plain `claude` now means the work account",
          },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add router --base-url https://openrouter.ai/api --bearer --model vendor/model\nvvault provider add OpenRouter --preset openrouter --model vendor/model-a\nvvault use OpenRouter --with codex --model vendor/model-b\nvvault kit claude --dir ~/.claude\nvvault keepalive                      # exit code 1 when an account needs a new sign-in\nvvault waybar                         # JSON for a status bar",
          },
          {
            kind: "table",
            head: ["Variable", "Default", "Effect"],
            rows: [["VVAULT_HOME", "the platform data folder", "moves the ledger, to keep experiments away from real accounts"]],
          },
          {
            kind: "code",
            lang: "sh",
            code: "mise run check            # rustfmt, clippy, tests, Semgrep\nmise run test             # cargo test --workspace\nmise run dev -- list      # the CLI against a throwaway ledger in /tmp/vvault-dev",
          },
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/architecture", caption: "Tray and CLI share one store, which keeps a private locker per account and starts each harness from its own." },
          { kind: "p", text: "crates/core holds all behavior. The CLI and the Tauri backend are thin front ends over the same Store and functions, so the tray app and vvault always agree." },
          {
            kind: "code",
            lang: "text",
            code: "tray app / vvault CLI\n        |\n        v\n   store::Store  --- ledger.json (labels, models, paths; 0600)\n        |             profiles/<id>/   (one harness home per account)\n        |             limits/ status/ balance/ caches\n        v\n   launch::plan  --- secrets (OS keychain, read last)\n        |\n        v\n   claude | codex | grok   with CLAUDE_CONFIG_DIR / CODEX_HOME / GROK_HOME",
          },
          {
            kind: "list",
            items: [
              "model.rs: Harness (Claude, Codex, Grok), Auth (Login or ApiKey), Account, Config, Provider.",
              "launch.rs: builds the Launch (program, args, env) and scrubs the inherited environment.",
              "limits.rs, status.rs, balance.rs, claude.rs, codex.rs: read limits, session state and balances per harness.",
              "kit.rs: links shared instructions into profiles. machine.rs: the machine-wide default account.",
              "terminal.rs: opens a terminal window that re-enters through vvault run.",
            ],
          },
        ],
      },
      {
        id: "open-flow",
        title: "Opening an account",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/open-flow", caption: "Identity variables are dropped at a gate and the key leaves the keychain only at launch." },
          {
            kind: "steps",
            items: [
              { title: "Pick", text: "You choose an account in the tray app or run vvault open. The terminal runs vvault run <id>, so the key is resolved inside that process." },
              { title: "Validate", text: "launch::plan calls Account::validate, then ensure_home creates the profile directory private to the user." },
              { title: "Scrub", text: "Inherited variables that override identity are removed: ANTHROPIC_*, CLAUDE_CODE_OAUTH_*, CLAUDE_CODE_USE_*, CLAUDE_CONFIG_DIR, CODEX_HOME, CODEX_API_KEY, CODEX_ACCESS_TOKEN, GROK_HOME, XAI_API_KEY, OPENAI_API_KEY, OPENAI_BASE_URL." },
              { title: "Resolve the key", text: "For an API key account, the key is read from the OS keychain at that moment and passed through the environment only." },
              { title: "Launch", text: "The harness starts with the account's home variable, model arguments and any kit entries linked into the profile." },
            ],
          },
          { kind: "p", text: "Per harness, an API key arrives as ANTHROPIC_API_KEY, or ANTHROPIC_AUTH_TOKEN with --bearer, for Claude; as VVAULT_API_KEY read by a provider defined with -c flags for Codex; and as XAI_API_KEY for Grok. Codex needs an endpoint that speaks the Responses API." },
        ],
      },
      {
        id: "ledger",
        title: "Ledger and store",
        group: "deep",
        blocks: [
          {
            kind: "p",
            text: "store::Store opens VVAULT_HOME or the platform data directory (project dirs sh/versatile/vvault). The root is created mode 0700 and ledger.json is written 0600.",
          },
          {
            kind: "list",
            items: [
              "Store::update takes an exclusive lock on .lock, loads the ledger, applies your closure, validates every account and provider, then writes through write_json.",
              "write_json writes a private temporary file in the same directory, calls sync_all and renames it over ledger.json, so a crash never leaves a half-written ledger.",
              "Account fields: id (UUID), label (1 to 80 chars, no control characters), harness, auth, model, fast_model, home, native_home, env, args, kit.",
              "A managed account's home is profiles/<id>. native_home accounts use the harness's own folder, as adopt does, and are never copied.",
              "Caches live in per-id files such as limits/<id>.json; the id must parse as a UUID, which blocks path tricks.",
              "Labels are unique case-insensitively, checked again inside the locked update.",
            ],
          },
        ],
      },
      {
        id: "limits",
        title: "Limits and keep-alive",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/limits", caption: "Usage readings fill a ledger with session and weekly gauges per account, kept fresh by a keep-alive clock." },
          {
            kind: "table",
            head: ["Account", "Source", "Freshness"],
            rows: [
              ["Claude Code sign-in", "Anthropic account endpoints, plus rate_limits that Claude Code sends to its status line", "after sign-in, then at most once a minute"],
              ["Codex sign-in", "the Codex CLI's account/read and account/rateLimits/read requests", "after sign-in, then at most once a minute"],
              ["Grok sign-in", "session state only", "none"],
              ["OpenRouter, DeepSeek keys", "the provider's key or balance request", "at most every two minutes"],
            ],
          },
          {
            kind: "list",
            items: [
              "Limits hold a session and a weekly Window (percent 0 to 100, resets_at). settled zeroes any window whose reset time has passed.",
              "The status line is injected with --settings at launch, so your settings.json is not modified. An existing status line keeps running.",
              "status.rs caches login state and re-checks after 50 minutes; keepalive renews idle accounts by asking each harness for its own status.",
              "On macOS Claude Code keeps its sign-in in the Keychain, so there Claude limits come only from the status line.",
            ],
          },
        ],
      },
      {
        id: "safety",
        title: "Safety model",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/safety", caption: "One locker per account, no copying, keys stay in the keychain, and plain http is refused." },
          {
            kind: "table",
            head: ["Rule", "Meaning"],
            rows: [
              ["One home per account", "credentials are never copied between folders"],
              ["The harness owns its tokens", "sign-in, refresh and sign-out are done by the harness"],
              ["Keys in the OS keychain", "macOS Keychain, Windows Credential Manager or Secret Service, under service vvault; never in the ledger, a config file or a command line"],
              ["Keys resolved late", "read inside vvault run and passed by environment"],
              ["Clear text refused", "a custom endpoint must be https://, plain http:// only for localhost, 127.0.0.1 or [::1]"],
              ["No key reuse", "an extra env value that repeats the API key is refused"],
            ],
          },
          { kind: "callout", tone: "warn", text: "One read-only exception: to show Claude limits and the plan name, the access token Claude Code saved is read in memory and sent only to Anthropic's account endpoints (api.anthropic.com/api/oauth/usage and /profile). They are undocumented; if they change, limits fall back to the status line." },
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
              ["Token handling", "never touch OAuth tokens", "copy or refresh them", "a rotating refresh token must live in one place"],
              ["Isolation", "a home folder per account via CLAUDE_CONFIG_DIR, CODEX_HOME, GROK_HOME", "swapping credentials in one folder", "no copies, one session"],
              ["Machine default", "point the harness at the account's home", "copy the account into the default home", "nothing is copied; only login accounts, as a key would sit in every shell"],
              ["Key delivery", "keychain read at launch, environment only", "storing keys in the ledger or flags", "keys stay out of files and command lines"],
              ["Ledger writes", "locked, validated, atomic rename", "plain overwrite", "no half-written or invalid ledger"],
              ["UI", "plain HTML, CSS, JS", "a frontend build", "no build step for the tray app"],
            ],
          },
          {
            kind: "list",
            items: [
              "Grok limits are not reported: the Grok CLI exposes session state only.",
              "Grok accounts use the xAI endpoint; a custom endpoint is refused.",
              "Anthropic's usage and profile endpoints are undocumented and may change.",
              "Terminals already open keep their account until you run eval \"$(vvault env)\" or reopen them.",
              "No measured performance numbers are published for this project.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Files to read",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "README.md", note: "install, usage, configuration, layout" },
              { path: "docs/usage.md", note: "defaults, providers, kit, limits, models, keep-alive" },
              { path: "docs/safety.md", note: "the safety rules in full" },
              { path: "crates/core/src/model.rs", note: "Harness, Auth, Account and validation" },
              { path: "crates/core/src/store.rs", note: "ledger root, locking, atomic writes" },
              { path: "crates/core/src/launch.rs", note: "environment scrub and per-harness launch plan" },
              { path: "crates/core/src/secrets.rs", note: "keychain access" },
              { path: "crates/core/src/limits.rs", note: "limit windows and probe throttling" },
              { path: "crates/core/src/status.rs", note: "session state and keep-alive" },
              { path: "crates/core/src/machine.rs", note: "machine-wide default account" },
              { path: "crates/cli/src/main.rs", note: "the vvault command surface" },
              { path: "app/src-tauri/src/main.rs", note: "tray app commands" },
            ],
          },
        ],
      },
    ],
  },
};

export default doc;
