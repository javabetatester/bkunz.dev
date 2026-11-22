import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const en: ProjectDoc = {
  tagline: "A personal overlay on Omarchy (Arch + Hyprland), applied by one idempotent script: terminal, editor, window manager config, a Quickshell bar with panels, and agent-usage helpers.",
  status: "personal",
  facts: [
    { label: "Base", value: "Omarchy (Arch, Hyprland)" },
    { label: "Entry point", value: "setup.sh" },
    { label: "Shell", value: "Quickshell (QML)" },
    { label: "Config language", value: "Hyprland Lua" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      group: "start",
      blocks: [
        { kind: "p", text: "omarchy-omakase is an overlay on Omarchy. It does not reinstall the window manager: it copies a personal rice into the user's config directories and never edits /usr/share/omarchy." },
        { kind: "p", text: "Everything is applied by one script, setup.sh, split into modules. Each module backs up what it overwrites, and every module can be rerun. An older script that rewrote the whole hyprland.conf and patched QML with sed was dropped in favour of this overlay model." },
        {
          kind: "table",
          head: ["Piece", "What it brings"],
          rows: [
            ["Terminal", "Kitty, with the Omarchy theme included and Ctrl+Shift+Q unbound so it cannot close the window"],
            ["Editor", "Neovim with LazyVim: explorer, bottom terminal, problems panel"],
            ["Window manager", "Hyprland user config in ~/.config/hypr (Lua), loaded after the Omarchy defaults"],
            ["Bar", "A Quickshell bar and panels, running next to the omarchy shell"],
            ["Prompt", "Starship"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Run it",
      group: "start",
      blocks: [
        { kind: "scene", id: "omarchy-omakase/installer", caption: "Each module is installed once and overwritten files are backed up; a second run finds everything already in place." },
        { kind: "p", text: "Prerequisite: Omarchy on Arch. Without it the overlay still copies files, but some Hyprland IPC calls need Omarchy; setup.sh warns when it is not detected." },
        {
          kind: "code",
          lang: "sh",
          code: "git clone https://github.com/javabetatester/archin-coding.git\ncd archin-coding\nchmod +x setup.sh\n./setup.sh all",
        },
        { kind: "p", text: "Without arguments setup.sh opens a menu. You can also name modules, or list them:" },
        {
          kind: "code",
          lang: "sh",
          code: "./setup.sh              # interactive menu\n./setup.sh nvim\n./setup.sh kitty nvim\n./setup.sh hypr\n./setup.sh --list",
        },
        { kind: "p", text: "After a run, hyprctl reload is usually enough for stale binds. Open nvim once so Lazy finishes the plugin sync." },
        {
          kind: "table",
          head: ["Module", "In all", "What it does"],
          rows: [
            ["packages", "yes", "nvim, kitty, thunar, ripgrep, fd, lazygit, grim, slurp, wl-clipboard, playerctl, pavucontrol, python-pywal, and more"],
            ["kitty", "yes", "Installs ~/.config/kitty/kitty.conf"],
            ["nvim", "yes", "LazyVim overlay; clones the starter if no config exists; adds the neo-tree extra; headless Lazy sync"],
            ["hypr", "yes", "Binds, look and feel, input, window rules, KEYBINDS.md in ~/.config/hypr"],
            ["scripts", "yes", "Helper scripts in ~/.config/scripts, bar launcher in ~/.local/bin"],
            ["starship", "yes", "~/.config/starship.toml"],
            ["bar", "yes", "Quickshell rice in ~/.config/quickshell and account helpers in ~/.local/bin"],
            ["extras", "yes", "Thunar, KDE Connect, mpd-mpris, Vesktop from the AUR when a helper exists"],
            ["shell", "yes", "alias cls='clear' appended to .bashrc (and .zshrc if present)"],
            ["hypr-monitors", "no", "monitors.lua for one specific machine; skip on other hardware"],
          ],
        },
      ],
    },
    {
      id: "changes",
      title: "What changes",
      group: "start",
      blocks: [
        { kind: "p", text: "Files land under the home directory only. Before each overwrite the previous file is copied to a backup directory." },
        {
          kind: "table",
          head: ["Path", "Written by"],
          rows: [
            ["~/.config/hypr/*.lua, KEYBINDS.md", "hypr"],
            ["~/.config/hypr/monitors.lua", "hypr-monitors"],
            ["~/.config/kitty/kitty.conf", "kitty"],
            ["~/.config/nvim/ (overlay, lazyvim.json)", "nvim"],
            ["~/.config/quickshell/", "bar"],
            ["~/.config/scripts/", "scripts"],
            ["~/.local/bin/ (bar launcher, account helpers, chaves)", "scripts, bar"],
            ["~/.config/starship.toml", "starship"],
            ["~/.dotfiles-backup-archin-<timestamp>/", "Backups of every overwritten file"],
          ],
        },
        { kind: "callout", tone: "note", text: "Copies never delete extra files in the destination: archin_install_tree backs up colliding files and copies over them, leaving anything else in place." },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      group: "how",
      blocks: [
        { kind: "scene", id: "omarchy-omakase/layers", caption: "Omarchy is the base; each overlay module is a layer copied on top of it." },
        { kind: "p", text: "setup.sh sources lib/common.sh and every modules/*.sh. Each module registers itself with archin_register and exposes one function archin_install_<name>; the runner maps a module name to that function and calls it." },
        {
          kind: "code",
          lang: "text",
          code: "setup.sh\n  |-- lib/common.sh   archin_pkg, archin_aur, archin_backup,\n  |                   archin_install_file, archin_install_tree, archin_ensure_line\n  |-- modules/*.sh    archin_register <name> <desc>; archin_install_<name>\n  `-- overlay/        files copied as-is into $HOME\n        hypr/  kitty/  nvim/  quickshell/  scripts/  local-bin/\n        starship.toml  hypr-monitors/",
        },
        {
          kind: "list",
          items: [
            "archin_pkg runs pacman -S --needed --noconfirm; archin_aur uses yay or paru and warns when neither exists.",
            "archin_install_file backs up the destination, then copies one overlay file.",
            "archin_install_tree walks an overlay directory with find, backing up and copying each file.",
            "archin_ensure_line appends a line to a file only when it is not already present, which makes the shell module idempotent.",
          ],
        },
      ],
    },
    {
      id: "boot-flow",
      title: "Session start",
      group: "how",
      blocks: [
        { kind: "p", text: "How the pieces come alive on login, through the Hyprland user config." },
        {
          kind: "steps",
          items: [
            { title: "Omarchy defaults load", text: "hyprland.lua bootstraps Omarchy, requires its defaults, then requires the user files: monitors, input, bindings, looknfeel, autostart." },
            { title: "Autostart runs", text: "autostart.lua launches kdeconnect-indicator and mpd-mpris when present, starts the bar through start-archin-bar.sh, then runs agent-usage-refresh.sh." },
            { title: "The bar starts alone", text: "start-archin-bar.sh runs qs -n -d -p ~/.config/quickshell. It never pkills quickshell by name, because that would kill the omarchy shell." },
            { title: "Binds toggle panels", text: "Bindings call the shell over IPC (for example launcher toggle, dashboard toggle, music toggle); shell.qml holds the visibility flags for each overlay." },
          ],
        },
      ],
    },
    {
      id: "keybinds",
      title: "Hyprland keys",
      group: "deep",
      blocks: [
        { kind: "p", text: "Super is the Windows key. Super+K opens the tutorial. Source: overlay/hypr/KEYBINDS.md." },
        {
          kind: "table",
          head: ["Keys", "Action"],
          rows: [
            ["Super + Enter", "Terminal (Kitty)"],
            ["Super + Shift + Enter", "Floating terminal"],
            ["Super + D", "Launcher"],
            ["Super + E", "Thunar"],
            ["Super + A", "Dashboard (agents)"],
            ["Super + M", "Music panel"],
            ["Super + X", "Lock screen (hyprlock)"],
            ["Super + Shift + K", "Chaves: copy a password (rbw)"],
            ["Super + Ctrl + Shift + K", "Chaves: copy a 2FA code"],
            ["Menu", "Define (dictionary)"],
          ],
        },
        {
          kind: "table",
          head: ["Keys", "Action"],
          rows: [
            ["Super + Shift + Q, Super + W", "Close window"],
            ["Super + Shift + Space, Super + Shift + V", "Toggle floating"],
            ["Super + F", "Fullscreen"],
            ["Super + P, Super + J", "Pseudo, toggle split"],
            ["Super + arrows", "Move focus"],
            ["Super + Shift + arrows", "Move window"],
            ["Super + Ctrl + arrows", "Resize window"],
            ["Super + Tab, Super + Shift + Tab", "Next, previous window"],
            ["Super + 1 to 5", "Go to workspace 1-5"],
            ["Super + Shift + 1 to 5", "Move window to workspace"],
            ["Super + scroll", "Switch workspace"],
            ["Super + S, Super + Shift + S", "Special workspace, move to it"],
            ["Super + N, Super + Shift + N", "Open, close notifications"],
          ],
        },
        {
          kind: "table",
          head: ["Keys", "Action"],
          rows: [
            ["F1, F2, F3", "Mute, volume down, volume up"],
            ["Print, Shift + Print", "Screenshot, area screenshot"],
            ["Super + R, Super + Shift + R", "Start, stop recording"],
            ["Super + Space", "App launcher (wofi)"],
            ["Super + C, Super + V", "Copy, paste"],
            ["Super + Ctrl + V", "Clipboard history"],
            ["Super + Escape", "Exit menu (wlogout)"],
            ["Super + Alt + Space", "Omarchy menu"],
          ],
        },
        { kind: "p", text: "Where a key is reused, bindings.lua calls hl.unbind first and then o.bind, so the Omarchy default does not conflict. Window rules in the same folder set opacity per app class and float mpv, floatingterm and scratchterm; layer rules blur every namespace starting with archin-." },
      ],
    },
    {
      id: "editor",
      title: "Neovim and Kitty",
      group: "deep",
      blocks: [
        { kind: "p", text: "Leader is Space. Source: overlay/nvim/KEYBINDS.md, also copied to ~/.config/nvim/KEYBINDS.md." },
        {
          kind: "table",
          head: ["Keys", "Action"],
          rows: [
            ["Ctrl+E", "Explorer"],
            ["Ctrl+'", "Bottom terminal, open or hide"],
            ["Ctrl+Shift+'", "New terminal"],
            ["2 then Ctrl+'", "Terminal 2"],
            ["Ctrl+H/J/K/L", "Switch split, also from inside the terminal"],
            ["Space tk, Ctrl+Shift+Q", "Kill the terminal panel"],
            ["Esc Esc then Q", "Kill the focused terminal"],
            ["Space xx", "Problems (lint)"],
            ["]d, [d", "Next, previous diagnostic"],
            ["Space Space", "Find file"],
            ["gd, K", "Go to definition, hover"],
          ],
        },
        { kind: "callout", tone: "warn", text: "Run the kitty module together with nvim. Without map ctrl+shift+q no_op in kitty.conf, Ctrl+Shift+Q closes the whole emulator instead of the terminal panel." },
      ],
    },
    {
      id: "bar",
      title: "Bar and panels",
      group: "deep",
      blocks: [
        { kind: "scene", id: "omarchy-omakase/bar", caption: "The Quickshell bar is a strip; each panel opens like a drawer under it." },
        { kind: "p", text: "The bar is a Quickshell config (shell.qml and components/*.qml). Its layer namespace starts with archin-, which is what the Hyprland layer rules match for blur. It polls the system with small Process blocks: cava for the visualizer, playerctl and wpctl for media and volume, nmcli for Wi-Fi, the battery capacity file, and hyprctl clients -j for open windows." },
        {
          kind: "table",
          head: ["Component", "Role"],
          rows: [
            ["Bar.qml", "The bar itself: media, volume, Wi-Fi, battery, open windows"],
            ["Dashboard.qml", "Overlay opened with Super+A; sections include agents and the vault"],
            ["AgentsPanel.qml", "Agent usage: reads the JSON records and refreshes every 15 and 30 seconds"],
            ["AccountTokenUsage.qml, ClaudeAccounts.qml", "Per-account usage and Claude account switching"],
            ["VaultPanel.qml", "Searchable Bitwarden logins and Infisical keys; secrets go from the CLI straight to the clipboard"],
            ["LauncherPanel.qml", "App launcher with usage-ranked results"],
            ["MusicPanel.qml", "Playback controls"],
            ["WifiPanel.qml, BluetoothPanel.qml", "Network and device panels"],
            ["AudioMixerPanel.qml", "Default volume, sinks and per-app streams, fed by audio-mixer-status"],
            ["DisplayPanel.qml", "Display controls"],
          ],
        },
      ],
    },
    {
      id: "agent-usage",
      title: "Agent usage",
      group: "deep",
      blocks: [
        { kind: "p", text: "The agents panel only reads JSON files from $XDG_STATE_HOME/omarchy/agents/usage (default ~/.local/state/omarchy/agents/usage). Collectors write one record per provider, so the panel never talks to a provider API itself." },
        {
          kind: "table",
          head: ["Script", "Source of data"],
          rows: [
            ["agent-usage-codex", "Native Codex CLI sessions, pi/omp sessions that ran through openai-codex, opencode sessions on an OpenAI provider; limits and plan from the Codex app-server RPC. Flags: --force, --limits-only"],
            ["agent-usage-cursor", "Cursor's local state.vscdb plus the Cursor dashboard plan and usage endpoints"],
            ["agent-usage-grok", "Grok billing and user endpoints plus local sessions under ~/.grok, with a token refresh"],
            ["agent-usage-refresh.sh", "Runs omarchy-agent-usage-update --limits-only for the other providers, then writes codex.json atomically from a temp file only if jq accepts it"],
          ],
        },
        {
          kind: "table",
          head: ["Helper in ~/.local/bin", "Role"],
          rows: [
            ["claude-accounts, codex-accounts", "Store and switch several accounts per CLI"],
            ["agent-account-limits, agent-account-tokens", "Limits and token usage per stored account"],
            ["desktop-vault", "Metadata-only bridge between the vault panel and the bw and infisical CLIs; clears the clipboard after a timeout only if its hash is unchanged"],
            ["chaves", "rbw picker that copies a password, user or TOTP code; the clipboard is cleared after 30 seconds"],
          ],
        },
        { kind: "p", text: "Other scripts in ~/.config/scripts: audio-mixer-status dumps volume, sinks and streams as JSON; define.sh looks the selected word up in a public dictionary API and shows a notification; Music.sh opens rmpc in Kitty, or Spotify through Omarchy, or tells you to install rmpc." },
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
            ["Relation to Omarchy", "Overlay in user config, never touching /usr/share/omarchy", "A full rewrite of hyprland.conf", "Omarchy updates keep improving defaults without clobbering personal files"],
            ["Re-running", "Idempotent modules with backups", "One-shot installer", "Safe to run again after any change"],
            ["Bar process", "Second Quickshell instance with its own config path", "pkill quickshell and replace the shell", "Killing quickshell by name would kill the omarchy shell"],
            ["Machine-specific config", "hypr-monitors excluded from all", "Monitors in the default set", "Display layout only fits one machine"],
            ["Secrets in panels", "CLI to clipboard, metadata-only bridge, timed clear", "Storing or displaying secrets", "Secrets never sit in the panel state"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          text: "Limits: the vault and Chaves need rbw, bitwarden-cli and infisical-bin installed by hand. The Infisical URL comes from ~/.config/quickshell/state/vault.json (infisical.apiUrl) or INFISICAL_API_URL. Package installs assume pacman; the AUR step is skipped without yay or paru. Stays manual: logging into each agent CLI and vault, editing monitors.lua for other hardware, and installing rmpc for the music script.",
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
            { path: "setup.sh", note: "Entry point: menu, module runner, default module list" },
            { path: "lib/common.sh", note: "Package, backup and copy helpers" },
            { path: "modules/nvim.sh", note: "LazyVim starter clone, overlay and neo-tree extra" },
            { path: "modules/bar.sh", note: "Installs the Quickshell rice and local-bin helpers" },
            { path: "overlay/hypr/bindings.lua", note: "Keybindings over Omarchy defaults" },
            { path: "overlay/hypr/autostart.lua", note: "Starts the bar and the usage refresh" },
            { path: "overlay/hypr/KEYBINDS.md", note: "Keybinding cheatsheet" },
            { path: "overlay/nvim/KEYBINDS.md", note: "Neovim cheatsheet" },
            { path: "overlay/quickshell/shell.qml", note: "Shell root: visibility flags and overlay toggles" },
            { path: "overlay/quickshell/components/Bar.qml", note: "The bar" },
            { path: "overlay/quickshell/components/AgentsPanel.qml", note: "Agent usage panel" },
            { path: "overlay/scripts/agent-usage-codex", note: "Codex usage collector" },
            { path: "overlay/scripts/agent-usage-refresh.sh", note: "Refresh orchestrator" },
            { path: "overlay/local-bin/desktop-vault", note: "Vault bridge" },
          ],
        },
      ],
    },
  ],
};

const doc: Partial<Record<Lang, ProjectDoc>> = { en };

export default doc;
