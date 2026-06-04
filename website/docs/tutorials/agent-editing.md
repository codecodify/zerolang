---
sidebar_position: 1
---

# Let Agent Edit Your Code

This tutorial walks you through the complete agent editing loop: write code, introduce a bug, let the agent diagnose and fix it, and verify the result. You will experience how Zerolang's structured diagnostics and graph-first design make agent-assisted development reliable.

**Prerequisites**: Zerolang installed (`zero --version` works). No agent framework required — you can follow along manually.

**Time**: ~20 minutes

## Step 1: Write a Buggy Program

Create a file `agent-demo.0`:

```zero
pub fn main(world: World) -> Void raises {
    let greeting: String = "hello"
    check world.out.write(message)
}
```

This program has a bug: `message` is not declared. It should be `greeting`.

## Step 2: Let the Compiler Diagnose

Run the compiler with JSON output:

```sh
zero check --json agent-demo.0
```

The output is structured JSON:

```json
{
  "schemaVersion": 1,
  "ok": false,
  "diagnostics": [
    {
      "severity": "error",
      "code": "NAM003",
      "message": "unknown identifier 'message'",
      "path": "agent-demo.0",
      "line": 3,
      "column": 27,
      "length": 7,
      "expected": "visible local, parameter, function, or builtin",
      "actual": "no visible symbol named 'message'",
      "help": "declare the name before using it",
      "fixSafety": "behavior-preserving"
    }
  ]
}
```

An agent reads this and knows:
- **What**: identifier `message` does not exist
- **Where**: line 3, column 27
- **Why**: it was never declared
- **How to fix**: declare the name before using it
- **Safety**: `behavior-preserving` — safe to apply automatically

## Step 3: Ask for a Repair Plan

The agent asks the compiler for a typed repair plan:

```sh
zero fix --plan --json agent-demo.0
```

The compiler returns structured repair metadata. The `fixSafety` label tells the agent whether it can apply the fix autonomously:

- `behavior-preserving` and `local-edit` → safe to apply
- `api-changing` → propose the change, but ask
- `requires-human-review` → stop and ask the human

## Step 4: Apply the Fix

An agent would apply the fix programmatically. For this tutorial, fix it manually:

```zero
pub fn main(world: World) -> Void raises {
    let greeting: String = "hello"
    check world.out.write(greeting)
}
```

## Step 5: Verify the Fix

```sh
zero check --json agent-demo.0
```

```json
{
  "schemaVersion": 1,
  "ok": true,
  "diagnostics": []
}
```

`ok: true` — the program is clean.

## Step 6: Inspect the ProgramGraph

Now let's look at the program through the graph:

```sh
zero graph dump --json agent-demo.0
```

The output contains nodes (declarations, expressions, types), edges (calls, data flow), and metadata. This is what an agent sees: not raw text, but structured semantic facts.

Key fields:
- `graphHash` — a content hash that changes when the program's semantics change
- `nodes` — every declaration, expression, and type in the program
- `edges` — relationships between nodes (calls, imports, data flow)

## Step 7: Edit the Graph Directly

An agent can edit the program through the graph rather than patching text:

```sh
zero graph patch agent-demo.0 \
  --expect-graph-hash graph:YOUR_HASH_HERE \
  --op 'set node="#YOUR_NODE_ID" field="value" expect="hello" value="hello from the graph"'
```

The `--expect-graph-hash` flag is a safety mechanism. If the program changed since the agent last read it, the hash won't match and the patch is rejected. This prevents race conditions in multi-agent workflows.

## The Complete Agent Loop

Here is the full cycle an agent follows:

```
┌─────────────────────────────────────────────┐
│  1. Write or read code                      │
│         ↓                                   │
│  2. zero check --json                       │
│         ↓                                   │
│  3. Read error code + expected/actual       │
│         ↓                                   │
│  4. zero fix --plan --json                  │
│         ↓                                   │
│  5. Evaluate fix safety label               │
│         ↓                                   │
│  6. Apply fix (or ask human)                │
│         ↓                                   │
│  7. zero check --json → verify              │
│         ↓                                   │
│  8. zero build → ship                       │
└─────────────────────────────────────────────┘
```

At every step, the compiler speaks structured data. The agent never parses human-readable text.

## What Makes This Different

In traditional languages, an agent would:
1. Read the source file as text
2. Run the compiler and parse the stderr output
3. Use regex or heuristics to extract error information
4. Guess what change might fix the error
5. Apply the change as a text patch
6. Hope it works

In Zerolang, an agent:
1. Reads the source file
2. Runs `zero check --json` and gets structured data
3. Reads the error code, expected/actual fields, and fix safety
4. Runs `zero fix --plan --json` to get a typed repair plan
5. Applies the repair if the safety label allows
6. Verifies with `zero check --json`

No guessing. No parsing. No hoping.

## Next Steps

- Read [ProgramGraph Reference](/docs/reference/program-graph) to understand the graph structure
- Try [How to do semantic refactoring with zero graph patch](/docs/how-to/graph-patch-refactoring)
- Explore [CLI Reference](/docs/cli/commands) for all commands and their JSON output
