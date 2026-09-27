---
name: antigravity-orchestrator
description: >
  Autonomous meta-orchestrator and workflow router for studio-app-v2. Analyzes any user request
  or development phase, selects the optimal skill chain (UI/UX, Architecture, TDD, Memory,
  Perf, Token Optimization), and coordinates execution across all 47+ workspace skills and tools.
---

# 🛸 Antigravity Workflow Orchestrator

The central intelligence and routing hub of **studio-app-v2**. This orchestrator coordinates all installed skills and tools through an optimized, end-to-end development lifecycle.

---

## 🎯 7-Phase Optimized Workflow Matrix

Whenever a task is received, the orchestrator routes execution through the specialized skill chain:

| Phase | Objective | Primary Skills & Tools | Trigger / Action |
| :--- | :--- | :--- | :--- |
| **1. Discovery & Memory** | Map code, recall past traps, extract domain | `understand`, `understand-domain`, `projectmem` | Check `.projectmem/`, generate import maps, scan architecture |
| **2. Spec & Planning** | Break down tasks, clarify requirements | `spec-driven-development`, `planning-and-task-breakdown`, `interview-me` | Produce task list and acceptance criteria |
| **3. UI/UX Pro Max** | Design state-of-the-art interface & tokens | `ui-ux-pro-max`, `design-system`, `ui-styling`, `frontend-ui-engineering` | Enforce typography, HSL palettes, smooth micro-interactions |
| **4. Implementation & TDD** | Robust, incremental code writing | `test-driven-development`, `incremental-implementation`, `code-simplification` | Write tests first, implement in small verified batches |
| **5. Audit & Validation** | Inspect diffs, debug issues, check a11y | `understand-diff`, `debugging-and-error-recovery`, `browser-testing-with-devtools` | Deep audit, headless browser checks, regression prevention |
| **6. Token & Performance** | Maximize speed, audit token costs | `token-monitor`, `performance-optimization`, `projectmem precheck` | CWV audit, memoization, verify token budget |
| **7. Multi-Agent & Launch** | Inter-agent messaging, cross-platform deploy | `hcom-agent-messaging`, `promptscript`, `shipping-and-launch` | Sync across terminals, compile configs, release |

---

## ⚡ Automated Intent Routing Rules

1. **When user asks to design or style UI**:
   - Chain: `ui-ux-pro-max` -> `design-system` -> `ui-styling` -> `frontend-ui-engineering`.
   - Never use default or generic palettes; enforce refined tokens, modern typography, and responsive micro-animations.

2. **When user asks to explore, refactor, or understand code**:
   - Chain: `understand` -> `understand-explain` -> `understand-knowledge` -> `understand-dashboard`.

3. **When user asks to add a feature or fix a bug**:
   - Step 1: `projectmem` precheck (check past traps & rules).
   - Step 2: `spec-driven-development` & `test-driven-development`.
   - Step 3: `code-simplification` & `browser-testing-with-devtools`.
   - Step 4: Record solution into `projectmem`.

4. **When user runs long sessions or multiple agents**:
   - Activate `token-monitor` for real-time cost telemetry.
   - Use `hcom-agent-messaging` to exchange events between terminal sessions.
   - Compile platform targets with `promptscript`.
