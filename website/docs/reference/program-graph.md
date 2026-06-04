---
sidebar_position: 1
---

# ProgramGraph Reference

The ProgramGraph is Zerolang's structured representation of a program's semantics. It is the foundation of the agent-native design: agents inspect, reason about, and edit programs through the graph rather than raw source text.

## What Is a ProgramGraph?

A ProgramGraph is a directed graph that describes a Zero program's declarations, expressions, types, and their relationships. Every `.0` source file compiles to a ProgramGraph.

```sh
zero graph dump --json hello.0
```

The output contains:

```json
{
  "moduleIdentity": "hello",
  "graphHash": "graph:a7f7e6899a73f3b4",
  "counts": { "nodes": 12, "edges": 8 },
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

| Field | Description |
|-------|-------------|
| `moduleIdentity` | The module name derived from the source |
| `graphHash` | Content hash that changes when semantics change |
| `counts` | Node and edge counts |
| `nodes` | All declarations, expressions, and types |
| `edges` | Relationships between nodes |

## Graph Hash

The `graphHash` is a deterministic content hash of the program's semantic structure. It changes when:
- A declaration is added or removed
- A type changes
- An expression's value changes
- A function signature changes

It does **not** change when:
- Whitespace or comments are modified
- The file is reformatted without semantic changes

The graph hash is used as a safety mechanism in `zero graph patch`. An agent passes `--expect-graph-hash` to ensure the program has not changed since it last read the graph. If the hash does not match, the patch is rejected.

## Nodes

Each node represents a semantic element in the program. Nodes have:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (e.g., `#expr_653eeb6e`) |
| `kind` | Node type: `Function`, `Type`, `Binding`, `Literal`, `Call`, `If`, `While`, `Match`, etc. |
| `name` | The declared name (if applicable) |
| `type` | The resolved type |
| `value` | The literal value (for literals) |
| `public` | Whether the declaration is exported |
| `mutable` | Whether the binding is mutable (`var` vs `let`) |
| `fallible` | Whether the expression can fail |
| `hash` | Content hash of this node |

### Common Node Kinds

| Kind | Description | Example |
|------|-------------|---------|
| `Function` | A function declaration | `fn answer() -> i32` |
| `Type` | A type declaration | `type Point { x: i32, y: i32 }` |
| `Binding` | A `let` or `var` binding | `let x: i32 = 42` |
| `Literal` | A literal value | `42`, `"hello"`, `true` |
| `Call` | A function call | `world.out.write("hi")` |
| `If` | An if/else branch | `if x > 0 { ... }` |
| `While` | A while loop | `while keepGoing { ... }` |
| `Match` | A match expression | `match result { ... }` |
| `Choice` | A choice type | `choice Result { ok: i32, err: String }` |
| `Enum` | An enum type | `enum Status { ready, failed }` |

## Edges

Edges describe relationships between nodes:

| Edge Type | Description | Example |
|-----------|-------------|---------|
| `call` | Function call relationship | `main` calls `world.out.write` |
| `import` | Module import | `use std.codec` |
| `type` | Type annotation | `let x: i32` → `i32` |
| `arg` | Function argument | `write("hello")` → `"hello"` |
| `field` | Field access | `point.x` → `x` |
| `body` | Function body | `fn main` → body block |
| `init` | Binding initializer | `let x = 42` → `42` |
| `condition` | Branch condition | `if x > 0` → `x > 0` |
| `then` / `else` | Branch arms | `if` → then block / else block |

## ProgramGraph Commands

### dump

Export the graph for a source file:

```sh
zero graph dump --json hello.0
zero graph dump --out hello.program-graph hello.0
```

### import

Import source into a ProgramGraph artifact:

```sh
zero graph import --json hello.0
zero graph import --out hello.program-graph hello.0
```

### validate

Check that a ProgramGraph artifact is well-formed:

```sh
zero graph validate .zero/out/hello.program-graph
```

### view

Render canonical source text from a graph:

```sh
zero graph view examples/hello.0
zero graph view --out hello.view.0 hello.program-graph
```

### inspect

Inspect modules, symbols, capabilities, and helper use:

```sh
zero graph inspect --json hello.0
```

### source-map

Map graph node IDs to source ranges:

```sh
zero graph source-map --json hello.0
```

### reconcile

Compare edited source with a prior graph:

```sh
zero graph reconcile --json hello.program-graph --source hello.0
```

### check

Typecheck through direct graph lowering:

```sh
zero graph check --json hello.0
zero graph check --json hello.program-graph
```

### size

Size analysis for a ProgramGraph artifact:

```sh
zero graph size --json hello.program-graph
```

### build

Build from a ProgramGraph artifact:

```sh
zero graph build --json --emit obj --target linux-musl-x64 --out hello.o hello.program-graph
```

### patch

Apply checked edits to a graph:

```sh
zero graph patch hello.0 \
  --expect-graph-hash graph:a7f7e6899a73f3b4 \
  --op 'set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello patched\n"'
```

### roundtrip

Verify graph stability through import/export:

```sh
zero graph roundtrip examples/hello.0
zero graph roundtrip .zero/out/hello.program-graph
```

## Graph Patch Operations

`zero graph patch` supports six operations:

### set

Update a scalar field on an existing node:

```
set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello patched\n"
```

Editable fields: `name`, `type`, `value`, `public`, `mutable`, `static`, `fallible`, `exportC`.

### insert

Create a new node and connect it to a parent:

```
insert node="#patch001" kind="Literal" parent="#expr_c403020c" edge="arg" order="1" type="String" value="again\n"
```

### insertEdge

Connect existing facts across domains:

```
insertEdge source="#node_abc" target="#type_xyz" kind="type"
```

### replace

Update a node in place with optional hash precondition:

```
replace node="#expr_653eeb6e" expect="abc123" ...
```

### delete

Remove an owned subtree (rejects external references):

```
delete node="#patch001"
```

### rename

Update a node's name with optional current-name precondition:

```
rename node="#decl_ad8d9028" expect="main" value="start"
```

## Patch File Format

For larger edits, use a patch file:

```text
zero-program-graph-patch v1
expect graphHash "graph:a7f7e6899a73f3b4"
set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello patched\n"
insert node="#patch001" kind="Literal" parent="#expr_c403020c" edge="arg" order="1" type="String" value="again\n"
rename node="#decl_ad8d9028" expect="main" value="start"
delete node="#patch001"
```

The header is required. `expect graphHash` is optional but recommended.

## Source-to-Graph Relationship

The ProgramGraph is derived from source code. The relationship is:

```
Source (.0) → Compiler → ProgramGraph → Graph Hash
                  ↓
              Source Map (node ID → line:column)
```

An agent can:
1. Read source → compile → get graph
2. Inspect graph nodes and edges
3. Submit graph edits via `zero graph patch`
4. Compiler applies edits, rewrites source, verifies graph hash

This bidirectional flow means agents work with semantic facts, not text positions.

## JSON Output

All `zero graph` commands accept `--json` for structured output. Key fields:

| Command | JSON Fields |
|---------|-------------|
| `dump` | `moduleIdentity`, `graphHash`, `validation`, `counts`, `nodes`, `edges` |
| `import` | `moduleIdentity`, `graphHash`, `validation`, `saved.path` |
| `validate` | `moduleIdentity`, `graphHash`, `counts`, `validation` |
| `view` | `moduleIdentity`, `graphHash`, `source`, optional output path |
| `source-map` | Node IDs → source ranges, node hashes, symbol/type/effect IDs, file hash facts |
| `reconcile` | Identity decisions, ambiguous-match diagnostics, simple graph patch text |
| `check` | `moduleIdentity`, `graphHash`, `check.lowering: "direct-program-graph"`, target readiness, safety facts, graph-mapped diagnostics |
| `size` | `graph` identity, `profileSemantics`, `profileCatalog`, `profileBudget`, `safetyFacts`, `backendProfile`, `backendComparison`, `sizeBreakdown`, `retentionReasons`, `optimizationHints` |
| `build` | `graph` identity, selected `emit` kind, target, artifact path/size, safety facts, compiler cache facts, incremental invalidation |
| `patch` | Per-operation results, changed graph hash, saved source/artifact path |
| `roundtrip` | `semanticStable`, lowering mode, original/roundtripped graph hashes, raw counts, normalized semantic counts, optional ProgramGraph output |

## Further Reading

- [Agent-Native Concepts](/docs/concepts/agent-native) — why the ProgramGraph exists
- [Graph-First Programming](/docs/language/graph-first) — the design philosophy
- [CLI Reference](/docs/cli/commands) — all commands and their JSON output
