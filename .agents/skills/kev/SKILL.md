---
name: kev
description: >
  Fast, calibrated small decision models (0.8B to 27B based on Qwen) for ultra-low latency agent decisions,
  intent classification, choice scoring, structured classification, and lightweight tool routing.
---

# ⚡ Kev — Micro Decision & Intent Routing Engine

Located in `tools/kev/`.

## Capabilities
- **Sub-10ms Agent Decisions**: Runs compact 0.8B, 1.5B, 4B, and 7B decision models locally or via fast endpoints.
- **Logit-Calibrated Routing**: Predicts exact categorical options, actions, and binary conditions without verbose chain-of-thought overhead.
- **Cost & Latency Minimizer**: Offloads simple agent choices from expensive frontier LLMs to instant micro-models.
- **Fine-Tuning & Evaluation Tooling**: Built-in scripts for generating calibration sets, running benchmarks, and tuning custom router weights.
