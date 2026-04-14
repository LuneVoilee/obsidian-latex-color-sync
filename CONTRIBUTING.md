# Contributing

Thanks for contributing to LaTeX Color Sync.

## Development Setup

1. Clone this repository into your vault plugin directory:
   - `.obsidian/plugins/latex-color-sync`
2. Enable Community Plugins in Obsidian and enable this plugin.
3. After code changes, reload plugin (`Settings -> Community plugins -> Reload plugins`) and test in Source mode.

## Pull Request Scope

- Keep PRs focused; one behavior change per PR when possible.
- Include before/after notes for formula rewrite behavior.
- Add or update docs when settings/commands change.

## Test Checklist

- Manual apply on selection/current line.
- Manual apply on full document.
- Auto-sync on Enter works with and without “process previous line”.
- Existing top-level color wrapper rewrite behavior.
- Skip behavior for embedded color commands.
- English and Chinese setting strings render correctly.

## Style Notes

- Keep runtime dependencies minimal.
- Preserve compatibility with Obsidian `>= 1.5.0`.
- Prefer small pure functions for parsing/rewrite logic.

## Reporting Issues

Use GitHub issue templates in `.github/ISSUE_TEMPLATE/` and provide sample markdown lines that reproduce the behavior.
