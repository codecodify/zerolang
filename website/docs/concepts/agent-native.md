---
sidebar_position: 1
---

# What Does Agent-Native Mean?

Most programming languages were designed for human engineers who read error messages, interpret warnings, and manually trace through stack traces to fix bugs. AI agents do none of those well.

Zerolang is **agent-native**: it treats the AI agent as the primary user from day one. This is not an afterthought or a plugin — it is baked into the compiler, the standard library, and the toolchain.

## The Problem With Traditional Languages

When a traditional compiler reports an error, it looks something like this:

```
error[E0425]: cannot find value `message` in this scope
 --> src/main.rs:2:27
  |
2 |     println!("{}", message);
  |                    ^^^^^^^ not found in this scope
```

A human can read this and understand: "I forgot to declare `message`." But an agent sees unstructured text. It has to parse the format, guess the error category, and hope the message is stable across versions.

Traditional languages also rely on implicit behavior: hidden globals, implicit async, magic imports, garbage collection. These are convenient for humans who hold mental models of the runtime, but confusing for agents that need explicit, verifiable facts.

## What Makes Zerolang Agent-Native

Zerolang addresses these problems through five core design decisions:

### 1. Structured JSON Diagnostics

Every diagnostic from the compiler is available as versioned JSON:

```sh
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
      "length": 1,
      "expected": "visible local, parameter, function, or builtin",
      "actual": "no matching visible symbol",
      "help": "declare the name before using it",
      "fixSafety": "requires-human-review",
      "repair": {
        "id": "declare-missing-symbol",
        "summary": "Declare the referenced symbol, import the module that provides it, or correct the identifier spelling."
      },
      "related": []
    }
  ]
}
```

Every diagnostic carries:
- A **stable error code** (e.g., `NAM003`) that does not change across versions
- **Expected vs actual** fields that describe the mismatch precisely
- A **fix safety label** that tells the agent whether it can apply the fix automatically
- **Repair metadata** with a machine-readable repair plan

The agent does not need to parse human-readable text. It reads structured data and makes decisions.

### 2. Stable Error Codes

Every compiler diagnostic maps to a stable code:

| Prefix | Category | Example |
|--------|----------|---------|
| `PAR` | Parser | `PAR100` — syntax failures |
| `NAM` | Names | `NAM003` — unknown identifier |
| `TYP` | Types | `TYP002` — type mismatch |
| `BOR` | Borrows | `BOR001` — borrow conflict |
| `OWN` | Ownership | `OWN001` — use after move |
| `ERR` | Error flow | `ERR003` — unchecked fallible call |
| `TAR` | Targets | `TAR002` — missing capability |

These codes are part of the compiler's public contract. An agent can learn that `NAM003` always means "declare the name before using it" and build reliable automation around that knowledge.

### 3. Typed Repair Plans

When the agent encounters an error, it can ask the compiler for a repair plan:

```sh
zero fix --plan --json hello.0
```

The compiler returns structured repair metadata with fix safety labels:

- `format-only` — changes only formatting
- `behavior-preserving` — preserves program behavior
- `local-edit` — confined to the current scope or file
- `api-changing` — changes function signatures or exported names
- `requires-human-review` — risky or ambiguous; show the plan but do not apply automatically

The agent can safely apply `behavior-preserving` and `local-edit` fixes autonomously. For `api-changing` fixes, it can propose the change. For `requires-human-review`, it stops and asks.

### 4. Graph-First Programming

Traditional languages expose source code as text. Agents edit text ranges and hope the result is semantically correct.

Zerolang exposes the **ProgramGraph** — a structured representation of the program's semantics:

```sh
zero graph dump --json hello.0
```

The ProgramGraph contains nodes (declarations, expressions, types), edges (calls, imports, data flow), and metadata (effects, ownership, capabilities). Agents can inspect the graph, understand the program's structure, and submit **graph edits** rather than raw text patches:

```sh
zero graph patch hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello patched\n"'
```

Graph edits are checked by the compiler before being applied. The agent cannot introduce syntax errors or break semantic constraints without the compiler catching it.

### 5. Version-Matched Skills

Traditional documentation lives on websites, in READMEs, and in wikis. It drifts out of date. An agent reading stale docs will generate incorrect code.

Zerolang ships `zero skills` — language rules, diagnostics, build guides, and stdlib documentation bundled with the compiler binary:

```sh
zero skills get language
zero skills get diagnostics
zero skills get stdlib
```

The skills are always in sync with the installed compiler version. An agent using `zero skills get language` will always get the correct rules for the binary it is calling.

## What This Means In Practice

A typical agent workflow with Zerolang looks like this:

```
1. Agent writes code
2. zero check --json → structured diagnostics
3. Agent reads error code, expected/actual fields
4. zero fix --plan --json → typed repair plan
5. Agent evaluates fix safety label
6. Agent applies fix (or asks human for help)
7. zero check --json → verify fix
8. zero build → ship
```

At every step, the compiler speaks the agent's language: structured, stable, machine-readable data. The agent never has to guess.

## What Agent-Native Is Not

Agent-native does not mean:
- **Only for agents.** Humans can read plain-text diagnostics, use the CLI interactively, and write code by hand. The structured output is an addition, not a replacement.
- **A magic wrapper.** Zerolang is a real systems language with types, ownership, effects, and compilation to native code. The agent-friendly surface is built on top of solid language foundations.
- **Finished.** Zerolang is experimental. The syntax and APIs are unstable. But the design direction — structured, explicit, verifiable — is deliberate and consistent.

## Further Reading

- [Graph-First Programming](/docs/language/graph-first) — how the ProgramGraph works
- [Diagnostics Reference](/docs/cli/diagnostics) — complete list of error codes
- [CLI Reference](/docs/cli/commands) — all `zero` commands and their JSON output
