---
sidebar_position: 1
---

# Agent Integration Guide

Zerolang is designed from the ground up for AI Agent workflows. This guide explains how to configure popular AI coding assistants to work with Zerolang effectively, using structured JSON output, typed repair plans, and semantic graph editing.

## Overview

Most AI coding assistants edit source code as plain text. Zerolang gives agents something better: structured diagnostics, machine-readable fix plans, and a semantic ProgramGraph that the compiler verifies before any change is applied.

An agent integrated with Zerolang can:

- Read structured diagnostics instead of parsing human-readable error messages
- Evaluate fix safety before applying repairs
- Edit programs through graph patches that are type-checked by the compiler
- Fetch version-matched language rules that stay in sync with the installed compiler

This guide covers integration with Cursor, Windsurf, Claude Code, and any agent that supports custom system prompts or CLI tooling.

## Prerequisites

Before setting up any integration, make sure you have:

- **Zerolang installed** — run `zero doctor --json` to verify
- **An AI coding assistant** — one of: [Cursor](https://cursor.com), [Windsurf](https://codeium.com/windsurf), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), or another agent-capable tool

```bash
# Install Zerolang
curl -fsSL https://zerolang.ai/install.sh | bash

# Verify
zero doctor --json
```

## Cursor Integration

### Setup

Create a `.cursorrules` file in the root of your Zerolang project. This file tells Cursor how to interact with the `zero` CLI.

```text
You are working in a Zerolang project. Zerolang is an agent-native systems programming language where source files use the `.0` extension.

## Core Workflow

When writing or fixing Zerolang code, always follow this loop:

1. Write or edit `.0` source files
2. Run `zero check --json <file>` to get structured diagnostics
3. If there are errors, run `zero fix --plan --json <file>` to get a typed repair plan
4. Evaluate the `fixSafety` label before applying any fix:
   - `format-only` or `behavior-preserving` or `local-edit`: apply directly
   - `api-changing`: propose the change to the user
   - `requires-human-review`: do NOT auto-apply; show the plan and ask
5. After applying a fix, run `zero check --json <file>` again to verify
6. Use `zero build --emit exe --target linux-musl-x64 <file> --out ./out` to build

## Key Rules

- Always use `--json` flags for structured output. Never parse plain-text CLI output.
- Stable error codes (e.g., `NAM003`, `TYP002`) are part of the compiler's public contract. You can rely on them.
- For semantic refactoring, use `zero graph dump --json <file>` to read the ProgramGraph, then `zero graph patch` with `--expect-graph-hash` for safe edits.
- Use `zero skills get language` to fetch version-matched language rules. Use `zero skills get zero --full` for the complete agent guide.
- Do NOT guess Zerolang syntax. If unsure, run `zero skills get language` first.
```

### Workflow

Once `.cursorrules` is in place, Cursor's agent will follow the structured workflow automatically:

1. **Write code** — the agent creates or edits `.0` files using Zerolang syntax
2. **Check** — it runs `zero check --json` and reads the structured diagnostics
3. **Fix** — it runs `zero fix --plan --json`, evaluates the `fixSafety` label, and applies safe fixes
4. **Verify** — it re-runs `zero check --json` to confirm the fix worked
5. **Build** — it runs `zero build` when everything passes

You can prompt the agent naturally:

```text
"Create a function that reads from stdin and writes the uppercase version to stdout in zerolang"
```

The agent will write the code, check it, fix any diagnostics, and verify — all using structured output.

## Windsurf Integration

### Setup

Windsurf uses a `.windsurfrules` file for project-level instructions. Create one in the root of your Zerolang project:

```text
You are working in a Zerolang project. Source files use the `.0` extension.

## Zerolang Rules

- Always use `zero check --json <file>` instead of `zero check <file>` to get structured diagnostics.
- Use `zero fix --plan --json <file>` to get typed fix plans. Check the `fixSafety` field:
  - `format-only`, `behavior-preserving`, `local-edit`: safe to auto-apply
  - `api-changing`: propose but do not auto-apply
  - `requires-human-review`: never auto-apply
- For refactoring, use `zero graph dump --json <file>` to read the ProgramGraph, then `zero graph patch` with `--expect-graph-hash` for compiler-verified edits.
- If unsure about Zerolang syntax or semantics, run `zero skills get language` for version-matched rules.
- Always verify fixes by re-running `zero check --json` after edits.
```

### Workflow

Windsurf's Cascade agent will incorporate the `.windsurfrules` instructions into every interaction. The workflow is the same structured loop:

1. Edit source → `zero check --json` → read diagnostics → `zero fix --plan --json` → evaluate safety → apply → verify

Windsurf also supports multi-file editing. When refactoring across multiple `.0` files, the agent should:

```bash
# Read the graph for each affected file
zero graph dump --json file1.0
zero graph dump --json file2.0

# Apply graph patches with hash verification
zero graph patch file1.0 --expect-graph-hash graph:HASH1 --op '...'
zero graph patch file2.0 --expect-graph-hash graph:HASH2 --op '...'

# Verify all files
zero check --json file1.0
zero check --json file2.0
```

## Claude Code Integration

### Setup

Claude Code supports project-level instructions through a `CLAUDE.md` file in the repository root. Create `CLAUDE.md` in your Zerolang project:

```markdown
# Zerolang Project

This is a Zerolang project. Source files use the `.0` extension.

## Working with Zerolang

Zerolang is an agent-native language. All CLI commands support `--json` for structured output.

### Checking code

```bash
zero check --json <file>
```

Returns structured diagnostics with stable error codes, expected/actual fields, and fix safety labels.

### Fixing errors

```bash
zero fix --plan --json <file>
```

Returns a typed repair plan. Always check `fixSafety` before applying:
- `format-only` / `behavior-preserving` / `local-edit` → safe to auto-apply
- `api-changing` → propose to user, do not auto-apply
- `requires-human-review` → show plan, wait for user approval

### Semantic editing

For renaming, retyping, or structural changes:

```bash
zero graph dump --json <file>
zero graph patch <file> --expect-graph-hash graph:HASH --op '...'
```

Graph patches are verified by the compiler before being applied.

### Language reference

```bash
zero skills get language        # version-matched language rules
zero skills get zero --full     # complete agent guide
```

### Building

```bash
zero build --emit exe --target linux-musl-x64 <file> --out ./out
```

## Rules

1. Always use `--json` for structured output
2. Never parse plain-text error output
3. Check `fixSafety` before applying any fix
4. Use `--expect-graph-hash` for all graph patches
5. Verify fixes with `zero check --json` after every edit
6. If unsure about syntax, run `zero skills get language` first
```

### Workflow

Claude Code will read `CLAUDE.md` at the start of every session. The workflow:

```text
User: "Add error handling to the file read function in main.0"
```

Claude Code will:
1. Read `main.0` to understand the current code
2. Run `zero check --json main.0` to see the current state
3. Edit the source to add error handling
4. Run `zero check --json main.0` to verify
5. If errors, run `zero fix --plan --json main.0` and apply safe fixes
6. Re-verify until clean

## Generic Agent Integration

Any agent that can run CLI commands and read structured output can integrate with Zerolang. This section covers the building blocks.

### CLI Commands for Agents

These are the commands agents will use most frequently:

#### zero check --json

Check a source file and return structured diagnostics.

```bash
zero check --json hello.0
```

```json
{
  "schemaVersion": 1,
  "ok": false,
  "diagnostics": [
    {
      "severity": "error",
      "code": "NAM003",
      "message": "unknown identifier 'message'",
      "path": "hello.0",
      "line": 2,
      "column": 27,
      "length": 7,
      "expected": "visible local, parameter, function, or builtin",
      "actual": "no visible symbol named 'message'",
      "help": "declare the name before using it",
      "fixSafety": "behavior-preserving",
      "repair": {
        "id": "manual-review",
        "summary": "Inspect the diagnostic fields and choose a repair manually."
      },
      "related": []
    }
  ]
}
```

#### zero fix --plan --json

Generate a typed repair plan for the current diagnostics.

```bash
zero fix --plan --json hello.0
```

Returns a JSON object containing fix operations, each with a `fixSafety` label and a description of what will change.

#### zero graph dump --json

Export the ProgramGraph for semantic inspection.

```bash
zero graph dump --json hello.0
```

```json
{
  "moduleIdentity": "hello",
  "graphHash": "graph:a7f7e6899a73f3b4",
  "counts": { "nodes": 12, "edges": 8 },
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

#### zero graph patch

Apply compiler-verified semantic edits.

```bash
zero graph patch hello.0 \
  --expect-graph-hash graph:a7f7e6899a73f3b4 \
  --op 'set node="#expr_653eeb6e" field="value" expect="hello\n" value="hello patched\n"'
```

Operations: `set`, `insert`, `insertEdge`, `replace`, `delete`, `rename`.

#### zero skills get

Fetch version-matched language rules and agent guidance.

```bash
zero skills list            # list available skills
zero skills get language    # language rules for this compiler version
zero skills get zero --full # complete agent guide
```

### JSON Output Schemas

All `zero` commands that accept `--json` produce versioned, structured output. Key fields across commands:

| Command | Key Fields |
|---------|-----------|
| `zero check --json` | `schemaVersion`, `ok`, `diagnostics[].{code, severity, message, expected, actual, fixSafety, repair}` |
| `zero fix --plan --json` | `plan[].{operation, target, fixSafety, summary}` |
| `zero graph dump --json` | `moduleIdentity`, `graphHash`, `counts`, `nodes[].{id, kind, name, type, value}`, `edges[].{source, target, kind}` |
| `zero graph patch` | `results[].{op, status}`, `graphHash`, `saved` |
| `zero doctor --json` | `version`, `platform`, `checks` |
| `zero size --json` | `graph`, `sizeBreakdown`, `optimizationHints` |

Every response includes `schemaVersion` so agents can handle format changes across compiler versions.

### Safety Labels

Every fix carries a `fixSafety` label that tells the agent how to handle it:

| Label | Meaning | Agent Behavior |
|-------|---------|----------------|
| `format-only` | Only changes whitespace or formatting | Apply directly |
| `behavior-preserving` | Preserves program behavior | Apply directly |
| `local-edit` | Confined to the current scope or file | Apply directly |
| `api-changing` | Changes function signatures or exports | Propose to user; do not auto-apply |
| `requires-human-review` | Risky or ambiguous | Show plan; wait for approval |

The safety hierarchy is: `format-only` < `behavior-preserving` < `local-edit` < `api-changing` < `requires-human-review`. An agent should apply fixes autonomously only for the first three labels.

## Version-Matched Skills

Traditional documentation drifts out of date. Zerolang solves this with `zero skills` — language rules, diagnostics reference, build guides, and stdlib documentation bundled directly with the compiler binary.

```bash
# List all available skills
zero skills list

# Get language syntax and semantics rules
zero skills get language

# Get the full agent integration guide
zero skills get zero --full

# Get a specific skill with details
zero skills get diagnostics
```

**Why this matters for agents:** An agent using `zero skills get language` will always receive rules that match the exact compiler version it is calling. There is no risk of the agent following outdated syntax or relying on deprecated error codes.

**Recommended practice:** At the start of any long agent session, run `zero skills get language` to load the current rules into context. This prevents the agent from hallucinating Zerolang syntax based on training data that may be stale.

## Best Practices

1. **Always use `--json` for structured output.** Never ask an agent to parse plain-text CLI output. The JSON format is stable, versioned, and designed for machine consumption.

2. **Check `fixSafety` before applying fixes.** This is the single most important safety mechanism. `behavior-preserving` and `local-edit` fixes can be applied autonomously. `api-changing` and `requires-human-review` fixes require human oversight.

3. **Use `--expect-graph-hash` for graph patches.** This prevents the agent from editing a program that has changed since it last read the graph. Without this guard, the agent might overwrite changes made by a human or another agent.

4. **Prefer `behavior-preserving` and `local-edit` fixes.** These are the safest categories. They preserve program behavior and are confined to the current scope. When the agent has a choice of fix strategies, it should prefer these labels.

5. **Verify after every edit.** Run `zero check --json` after applying any fix or graph patch. This catches regressions immediately and prevents the agent from compounding errors.

6. **Load skills at session start.** Run `zero skills get language` at the beginning of an agent session to ensure the agent is working with current, version-matched language rules.

7. **Use graph patches for semantic refactoring.** For renaming, retyping, or structural changes, `zero graph patch` is safer than text-based find-and-replace. The compiler verifies every patch before applying it.

## Further Reading

- [Agent-Native Concepts](/docs/concepts/agent-native) — the design philosophy behind Zerolang's agent integration
- [CLI Reference](/docs/cli/commands) — all `zero` commands and their options
- [ProgramGraph Reference](/docs/reference/program-graph) — complete graph structure and patch operations
- [Semantic Refactoring with Graph Patches](/docs/how-to/graph-patch-refactoring) — step-by-step guide to graph editing
