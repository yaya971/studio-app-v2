---
name: token-monitor
description: >
  Live dashboard for monitoring AI token consumption and costs across models and machines.
  Use when analyzing token spending, auditing session efficiency, configuring multi-device sync,
  or optimizing context window usage.
---

# Token Monitor — AI Token Usage & Cost Analytics

Real-time telemetry and dashboard for monitoring token spend across AI coding agents.

## Core Capabilities
- **Real-time token telemetry**: Track input, output, cached tokens, and associated costs per model.
- **Multi-device & multi-agent sync**: Connect headless agents and developer machines to a single live view.
- **Budget alerting**: Set thresholds to prevent runaway spending during autonomous agent loops.

## Common Workflows

### 1. Launch Token Monitor
```bash
# Launch on macOS
open -a "Token Monitor" || npm run token-monitor
```

### 2. Multi-device / Agent Sync
Run headless agent tracking on machines or background sessions:
```bash
cd tools/token-monitor && npm run agent
```

### 3. Optimization Rules
- Cache prompt prefixes for stable system instructions.
- Prune intermediate tool outputs when passing context between agent steps.
- Use `token-monitor` in conjunction with `projectmem` to verify token reduction.
