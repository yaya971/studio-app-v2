---
name: promptscript
description: >
  Agent platform configuration as code. Define instructions, skills, agents, MCP servers,
  hooks, and workflows once (.prs) and compile to 50 AI coding targets (Claude, Antigravity,
  Cursor, Copilot, etc.). Use when maintaining multi-platform configurations or automating agent setups.
---

# PromptScript — Agent Platform Configuration as Code

PromptScript defines agent configurations in declarative `.prs` files and compiles them to native configurations for all major agent environments.

## Core Capabilities
- **One language, 50 targets**: Compile to Antigravity, Claude, Copilot, Cursor, Roo, Codex, etc.
- **Strict validation**: Validate schema compliance, broken skill links, and circular dependencies before execution.
- **Automated sync**: Keep agent capabilities synchronized across team platforms.

## Common Workflows

### 1. Initialize Configuration
```bash
prs init --strict
```

### 2. Validate Platform Config
```bash
prs validate --strict
```

### 3. Compile Native Configurations
```bash
prs compile
```
