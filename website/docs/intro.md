---
sidebar_position: 1
slug: /
---

# Introduction

**Zerolang** is an experimental systems programming language from Vercel Labs, built from day one for **AI Agent** workflows.

## Core Philosophy

Most programming languages were designed for human engineers who read error messages, interpret warnings, and manually trace through stack traces to fix bugs. AI agents do none of those well.

Zerolang treats the **agent as the primary user**:

- The compiler emits **structured JSON diagnostics** instead of plain text errors
- Every diagnostic carries a **stable error code** (e.g., `NAM003`) and **typed repair metadata**
- Agents can call `zero fix --plan --json` to receive a machine-readable fix plan

## Design Constraints

Zerolang maintains strict systems-language constraints while pursuing agent-friendliness:

- Token efficiency
- Low memory usage
- Fast startup
- Fast builds
- Low runtime latency
- **Zero dependencies**

## Key Features

### Graph-First

Agents can inspect compiled **ProgramGraph** semantic facts and submit graph edits rather than only patching raw source text ranges.

### Explicit Effects

Functions declare external-world access through capability-based I/O. There are no hidden global objects, no implicit async, and no magic globals.

### Native Compilation

Compiles to native executables targeting **sub-10 KiB** binaries.

### Version-Matched Skills

The compiler ships `zero skills` — language rules, diagnostics, build guides, and stdlib documentation that match the installed binary version. Agents never need to scrape potentially stale external docs.

## Quick Start

```bash
# Install the compiler
curl -fsSL https://zerolang.ai/install.sh | bash

# Verify installation
zero doctor --json

# Run an example
zero run examples/hello.0
```

## Status

> Zerolang is currently **pre-1.0 and experimental**. Syntax and APIs are unstable. Breaking changes are expected as the project explores patterns that work best for agents.
>
> Treat today's syntax and APIs as something to explore, not something to memorize.

## Get Involved

- Run examples and inspect structured output
- Share feedback on what helps agents work better
- Submit issues and PRs on [GitHub](https://github.com/vercel-labs/zerolang)
