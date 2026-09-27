# AGENTS.md — Studio A V2 · Antigravity Autonomous Workspace

This workspace operates in **full autonomous mode**. All tasks execute end-to-end without confirmation prompts.

## Workspace Identity

- **Name**: Studio A V2
- **GitHub**: `https://github.com/yaya971/studio-app-v2` (auto-push enabled)
- **Mode**: AUTONOMOUS — zero friction, zero confirmation

## Capabilities & Permissions

This agent has full permission to:

1. **File System** — Create, read, update, delete any file in this workspace without asking.
2. **Git** — Stage, commit, and push to `origin/main` after every completed task without asking.
3. **Terminal** — Run any `npm`, `node`, `python`, `pip`, `brew`, `git`, `curl` command without asking.
4. **Projects** — Bootstrap complete applications in `projects/[name]/` without asking.
5. **Dependencies** — Install npm/pip/brew packages without asking.
6. **Services** — Start dev servers, build processes, and background jobs without asking.

## Autonomous Workflow (Always Apply)

For every user request:
1. **Analyze** intent → select optimal skill chain from `skills/`
2. **Execute** fully end-to-end — no pauses for confirmation
3. **Auto-commit & push**: `git add -A && git commit -m "feat(auto): ..." && git push`
4. **Report** what was accomplished with file links

## Projects Structure

All new projects go in the appropriate subfolder:
- Web apps & sites → `projects/web-apps/[name]/`
- Backend APIs → `projects/apis/[name]/`
- Scripts & automation → `projects/scripts/[name]/`
- Python programs → `projects/python/[name]/`
- Mobile apps → `projects/mobile/[name]/`
- Quick experiments → `projects/experiments/[name]/`

## Skills Dispatch (Priority Order)

| Trigger | Skills Chain |
|:--------|:------------|
| UI/UX, design, interface | `ui-ux-pro-max` → `design-system` → `ui-styling` → `frontend-ui-engineering` |
| Understand code, architecture | `understand` → `understand-domain` → `projectmem` |
| New feature, bug fix | `projectmem` → `spec-driven-development` → `test-driven-development` → `incremental-implementation` |
| Performance, tokens | `token-monitor` → `performance-optimization` → `projectmem` |
| Multi-agent, coordination | `hcom-agent-messaging` → `promptscript` |
| Deploy, release | `shipping-and-launch` → `ci-cd-and-automation` |

## Non-Negotiable Design Rules

- Never use generic/bland designs. Premium aesthetics always.
- HSL color palettes only — never raw red/blue/green.
- Dark mode by default.
- Google Fonts (Inter, Outfit, or Satoshi).
- Micro-interactions on all interactive elements.
