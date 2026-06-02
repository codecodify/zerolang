---
sidebar_position: 2
---

# Diagnostics

## Structured Diagnostics

`zero check --json` emits machine-readable diagnostics instead of plain text. Every error includes:

| Field | Description |
|---|---|
| `code` | Stable error code (e.g., `NAM003`) |
| `message` | Human-readable message |
| `span` | Source location |
| `repair` | Typed repair metadata |

## The Repair Loop

Two CLI subcommands complete the agent repair loop:

### zero explain

Returns a structured explanation of any diagnostic code. Agents can look up `NAM003` directly — no doc scraping required.

```bash
zero explain NAM003
```

### zero fix --plan --json

Emits a machine-readable fix plan describing exactly what changes to make — no inference from prose required.

```bash
zero fix --plan --json examples/hello.0
```

## Diagnostic Codes

Common diagnostic categories:

| Prefix | Category |
|---|---|
| `NAM` | Naming |
| `BOR` | Borrowing |
| `TYP` | Typing |
| `CAP` | Capabilities |
| `CGEN` | Code generation |
