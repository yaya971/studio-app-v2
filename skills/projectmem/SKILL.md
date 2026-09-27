---
name: projectmem
description: >
  Coding agent memory layer — saves up to 50%+ AI tokens, prevents recurring bugs,
  and retains project decisions and architecture across agent sessions. Use when starting
  a new feature, running pre-commit checks with `pjm precheck`, recalling past decisions,
  or logging solved problems.
---

# ProjectMem — Coding Agent Memory & Judgment Layer

ProjectMem provides persistent project memory and judgment for AI coding agents.

## Core Capabilities
- **Local-first memory**: Stored in `.projectmem/` in the project root.
- **Pre-check validation**: Run `pjm precheck` before proposing diffs to catch known traps and regressions.
- **Decision tracking**: Record architectural choices and bug resolutions so they aren't repeated.
- **Token efficiency**: Eliminates up to 50% of redundant token scanning by remembering past context.

## Common Workflows

### 1. Pre-task Context Check
```bash
# Check existing project memory and active constraints
pjm status
```

### 2. Pre-commit Verification
```bash
# Inspect proposed changes against historical failures and rules
pjm precheck
```

### 3. Record Architecture Decision / Solution
```bash
# Register a resolved issue or key design decision
pjm record --decision "Utiliser Zustand pour l'état global et Tailwind v4 pour le styling"
```

### 4. Visualize Memory Dashboard
```bash
pjm visualize
```
