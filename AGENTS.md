# Esports Helper project instructions

## Project and distribution

This repository contains the readable source for Esports Helper, a Manifest V3
extension for Chrome/Chromium. Runtime files live at the repository root; icons
live in `icons/`. No build step is currently required.

- GitHub: https://github.com/czechitoot/esports-extension
- Approved Chrome Web Store version: 0.1.0; working update: 0.1.1
- Repository rename to esports-extension is requested; verify remote status.
- Store: https://chromewebstore.google.com/detail/ijoihdmdnameopfehjlbcjlbpmebknfe
- Distribution is intended to be unlisted.
- The self-hosted CRX, update feed, installation page, and Google Admin deployment
  plan were cancelled. Do not recreate them.
- Firefox compatibility, packaging, and Mozilla signing have not been performed.
  Wait for an explicit request before beginning that work or submitting anything.
- The separate Smash Helper site's store-link work is complete.

## Git and local files

Keep extension source, icons (including source SVG), public documentation,
sanitized reusable development tools, `.gitignore`, and this file in Git.
Use ignored `local/` for scratch files, downloaded fixtures, screenshots, and
other local-only material. Use ignored `outputs/` for generated packages.
Create those directories only when needed.

Never commit private keys, credentials, environment secrets, browser profiles,
personal data, chat exports, private page captures, dependencies, or generated
ZIP/XPI/CRX packages. Never publish signing keys. Avoid putting personal identity,
machine paths, or private task history into public documentation.

Before any commit or push:

1. Inspect `git status --short` and the diff.
2. Stage intended files explicitly; avoid blanket `git add .`.
3. Review `git diff --cached --name-status` and `git diff --cached` for unintended
   files, personal information, and secrets.
4. Use `git check-ignore -v <path>` when uncertain about an artifact.

Ignore rules do not protect files that are already tracked. Do not force-add
ignored files. Review any exception carefully against the user's requested scope.
Do not commit, push, publish, or submit a store release merely as part of local
setup. Do not rewrite tags or history without appropriate authorization.

## Product constraints

- Keep the only extension API permission as `storage`, with content scripts
  restricted to the existing match-site scope in the manifest. Settings use local browser storage.
- No analytics, remote executable code, or server collection. Chat and match
  content are processed locally and are not stored.
- Dashboard coloring is enabled by default. Match game-title substrings ignoring
  case, punctuation, and trademark symbols; first rule wins. Preserve deleted
  defaults. Target schedule rows via season and team links, including their muted
  backgrounds; do not color match pages.
- Chat links are enabled by default. Handle http/https/www links and new messages
  in full and sidebar/popout chats. Avoid editors and existing links; open in a
  new tab with `noopener noreferrer`. Disabling restores plain text.
- Moving match chat below details is off by default. Move the original wrapper,
  preserve drafts, controls, and events, and use a marker to restore its position.
  Never clone the chat.
- Unsquishing match details is enabled by default. Stack the team header below
  560px of available width and restore side-by-side layout when space permits.
- Popup bookmarks precede a divider and Settings; links open in new tabs.
  Default bookmarks are Match dashboard (derived from the manifest site scope)
  and Smash Helper (https://smashhelper.link).
- Preserve the approved white generic controller on dark red (#922D36),
  including its enlarged shape for toolbar visibility.

## Wording and documentation

Preserve the exact description:

> Quality-of-life improvements for esports matches, including game colors, chat links, layout adjustments, and bookmarks.

State that the extension is independent and not affiliated with or endorsed by
the organizations or services whose pages it enhances. Do not name those entities
in branding or documentation; keep the supported domain only in required code.
Do not add personal attribution. Say Chrome/Chromium in documentation.
Preserve the README disclaimer and store-only installation instructions.
The store link text is: `Get the Esports Helper extension!`
Do not restore manual ZIP installation instructions, support promises, or removed
taglines. Keep user-facing explanations concise and practical.

## Validation and release cautions

For runtime changes, validate the manifest and referenced assets, check JavaScript
syntax, and exercise affected behavior in an appropriate browser when available.
Report what was actually checked; do not imply Firefox or live-site testing from
static checks. No test harness was included in the GitHub source at initial setup.

The existing v0.1.0 tag and public release ZIP predate the latest main README.
Do not claim they exactly match main or silently replace them. Historical local
packages and packaging scripts from the cancelled distribution plan are not
trusted release inputs; inspect any recovered script before running it.
Extension store packages should contain runtime files only, excluding this file,
development tools, local files, and documentation that is not needed at runtime.
