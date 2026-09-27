---
name: cliproxyapi
description: >
  Universal CLI proxy providing OpenAI, Gemini, Claude, and Kimi compatible API interfaces.
  Use when routing agent requests across multiple AI providers, managing API failover,
  or unifying endpoint access in local development.
---

# CLIProxyAPI — Unified Multi-Model Local Proxy

CLIProxyAPI exposes standard OpenAI, Claude, and Gemini API endpoints while forwarding requests to multiple upstream accounts and model providers.

## Core Capabilities
- **Multi-provider compatibility**: Access Gemini, Claude, OpenAI, Kimi, and Grok under unified endpoints.
- **Failover & load balancing**: Distribute traffic and handle rate limits gracefully.
- **Local desktop integration**: Lightweight Go proxy or GUI via EasyCLIProxyAPI.

## Common Workflows

### 1. Build and Run Proxy
```bash
cd tools/CLIProxyAPI
./docker-build.sh # or go run ./cmd/server
```

### 2. Configure Endpoints
Set environment variables to route CLI agents through the local proxy:
```bash
export OPENAI_BASE_URL="http://localhost:8080/v1"
export ANTHROPIC_BASE_URL="http://localhost:8080/v1"
```
