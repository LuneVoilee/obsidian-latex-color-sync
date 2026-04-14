# Changelog

All notable changes to this project are documented in this file.

## [0.3.1] - 2026-04-15

### Changed

- Auto-sync trigger is now strictly based on newline insertion (`\n`) in document edits.
- Updated settings labels/descriptions to remove key-specific ambiguity (Enter vs other newline-producing inputs).
- Updated README and README_CN to document newline-based trigger behavior.

## [0.3.0] - 2026-04-15

### Changed

- Removed preview commands to simplify user flow.
- Rewrote README files with user-first explanations (what it does, commands, practical setting guidance).
- Improved no-change notice text with common user-facing reasons.
- Split large `main.js` into modular files: `main.js`, `i18n.js`, `latex-utils.js`.

## [0.2.0] - 2026-04-15

### Added

- English + Simplified Chinese localization for settings and notices.
- New preview commands (dry-run) for selection/current line and current document.
- Sync summary notices with changed line/formula counts.
- Open-source maintenance files: `LICENSE`, `CONTRIBUTING.md`, issue templates.

### Changed

- Manual sync commands now report richer summaries.
- Repository docs now include quick start, compatibility, limitations, privacy, and FAQ content.

## [0.1.0]

### Added

- Initial release with manual sync commands and Enter-trigger auto-sync.
