---
sidebar_position: 1
---

# Semantic Refactoring with `zero graph patch`

This guide shows how to use `zero graph patch` for semantic refactoring: changing string literals, updating type fields, and other scalar edits. Unlike text-based search-and-replace, graph patches are checked by the compiler before they are applied.

## Prerequisites

- Zerolang installed (`zero --version`)
- A `.0` source file to work with

## Create a Sample Program

Create `refactor-demo.0`:

```zero
fn greet(name: String) -> Void raises {
    check world.out.write("Hello, " + name + "!\n")
}

pub fn main(world: World) -> Void raises {
    greet("Alice")
    greet("Bob")
}
```

## Read the Graph

First, inspect the graph to find the node IDs you want to edit:

```sh
zero graph dump --json refactor-demo.0
```

The output includes all nodes with their IDs, kinds, and values. Look for the node you want to change — for example, a string literal `"Hello, "`.

Key fields to look for:
- `id` — the node identifier (e.g., `#expr_abc123`)
- `kind` — what kind of node it is (`Function`, `Literal`, `Call`, etc.)
- `name` — the declared name
- `value` — the literal value (for string/number literals)
- `hash` — the graph hash for `--expect-graph-hash`

## Change a String Literal

To change the greeting format:

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#YOUR_LITERAL_ID" field="value" expect="Hello, " value="Hi, "'
```

The `set` operation updates a single field. The `expect` parameter is optional but recommended — it rejects the operation if the current value differs from what you expected.

After the patch, the source is rewritten:

```zero
fn greet(name: String) -> Void raises {
    check world.out.write("Hi, " + name + "!\n")
}
```

## Safety Mechanisms

### Graph Hash Preconditions

Every patch should include `--expect-graph-hash`. This prevents:
- Editing a program that has changed since the agent last read it
- Race conditions in multi-agent workflows
- Applying patches to the wrong version of a file

If the hash does not match, the patch fails with a clear error.

### Field Value Preconditions

The `expect` parameter in `set` checks the current value before applying the change. This prevents:
- Overwriting a value that was already changed
- Applying a patch meant for a different state

### Type Checking

After applying patches, the compiler re-parses and re-typechecks the source. If a patch introduces a type error, the patch is rejected and the source is unchanged.

## Agent Workflow

A typical agent refactoring workflow:

```
1. zero graph dump --json file.0
   → Read graphHash, find node IDs

2. zero graph patch file.0 \
     --expect-graph-hash graph:HASH \
     --op 'set node="#ID" field="value" expect="old" value="new"'
   → Apply the edit

3. zero check --json file.0
   → Verify the edit is valid

4. If ok: continue. If not: read diagnostics, fix, retry.
```

## Limitations

- Graph patches work on canonical `.0` source without comments. If your source has comments, they may be lost during rewrite.
- The `set` operation can only update scalar fields (`name`, `type`, `value`, `public`, `mutable`, `static`, `fallible`, `exportC`).
- Complex structural changes (renaming functions across call sites, adding new nodes, deleting subtrees) are not supported by the `set` operation alone.
- Boolean fields (`public`, `mutable`, `fallible`) accept only `true` or `false`.

## Further Reading

- [ProgramGraph Reference](/docs/reference/program-graph) — complete graph structure documentation
- [CLI Reference](/docs/cli/commands) — all `zero graph` commands
- [Agent Integration Guide](/docs/guides/agent-integration) — the full agent editing loop
