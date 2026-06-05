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
  "schemaVersion": 1,
  "canonicalSource": true,
  "moduleIdentity": "module:hello",
  "graphHash": "graph:YOUR_HASH",
  "validation": {
    "state": "shape-valid",
    "ok": true,
    "diagnostics": []
  },
  "counts": { "nodes": 13, "edges": 12 },
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

| Field | Description |
|-------|-------------|
| `schemaVersion` | Forward-compatibility version |
| `canonicalSource` | Whether the source is in canonical form |
| `moduleIdentity` | Module name with prefix (e.g. `module:hello`) |
| `graphHash` | Content hash that changes when semantics change |
| `validation` | Validation state (`shape-valid`), ok flag, diagnostics |
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
| `id` | Unique identifier (e.g., `#ea5ea1ca`) |
| `kind` | Node type: `Module`, `Function`, `Param`, `TypeRef`, `EffectRef`, `Block`, `Check`, `MethodCall`, `FieldAccess`, `Identifier`, `Literal`, etc. |
| `name` | The declared name (if applicable) |
| `type` | The resolved type |
| `value` | The literal value (for literals) |
| `symbolId` | Stable symbol identifier |
| `typeId` | Stable type identifier |
| `effectId` | Stable effect identifier |
| `nodeHash` | Hash of this node's content |
| `path` | Source file path |
| `line` / `column` | Source location |
| `public` | Whether the declaration is exported |
| `mutable` | Whether the binding is mutable |
| `static` | Whether the value is compile-time known |
| `fallible` | Whether the expression can fail |
| `exportC` | Whether exported to C ABI |

### Common Node Kinds

| Kind | Description | Example |
|------|-------------|---------|
| `Module` | The module node | `module "hello"` |
| `Function` | A function declaration | `fn answer() -> i32` |
| `Param` | A function parameter | `world: World` |
| `TypeRef` | A type reference | `World`, `Void` |
| `EffectRef` | An effect reference | `error` |
| `Block` | A statement block | function body |
| `Check` | A `check` expression | `check world.out.write(...)` |
| `MethodCall` | A method call | `world.out.write("hi")` |
| `FieldAccess` | A field access | `world.out` |
| `Identifier` | An identifier reference | `world` |
| `Literal` | A literal value | `42`, `"hello"`, `true` |
| `Binding` | A `let` or `var` binding | `let x: i32 = 42` |
| `Call` | A function call | `add(1, 2)` |
| `If` | An if/else branch | `if x > 0 { ... }` |
| `While` | A while loop | `while keepGoing { ... }` |
| `Match` | A match expression | `match result { ... }` |
| `Choice` | A choice type | `choice Result { ok: i32, err: String }` |
| `Enum` | An enum type | `enum Status { ready, failed }` |

## Edges

Edges describe relationships between nodes:

| Edge Kind | Description | Example |
|-----------|-------------|---------|
| `function` | Module-level function | `module` → `main` |
| `param` | Function parameter | `main` → `world` |
| `type` | Type annotation | `param` → `World` |
| `returnType` | Return type | `main` → `Void` |
| `effect` | Effect annotation | `main` → `error` |
| `body` | Function body | `main` → body `Block` |
| `statement` | Statement in block | `Block` → `Check` |
| `expr` | Expression in check | `Check` → `MethodCall` |
| `left` | Left-hand side | `MethodCall` → `FieldAccess` |
| `arg` | Function argument | `MethodCall` → `Literal` |
| `call` | Function call relationship | `main` calls `world.out.write` |
| `import` | Module import | `use std.codec` |
| `field` | Field access | `point.x` → `x` |
| `init` | Binding initializer | `let x = 42` → `42` |
| `condition` | Branch condition | `if x > 0` → `x > 0` |
| `then` / `else` | Branch arms | `if` → then block / else block |

## ProgramGraph Commands

### dump

Export the graph for a source file:

```sh
zero graph dump hello.0                # text format
zero graph dump --json hello.0         # JSON format
```

### import

Import source into a ProgramGraph artifact:

```sh
zero graph import hello.0
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
zero graph view hello.0
zero graph view --out hello.view.0 .zero/out/hello.program-graph
```

### inspect

Inspect modules, symbols, capabilities, and helper use:

```sh
zero graph inspect hello.0
zero graph inspect --json hello.0
```

### source-map

Map graph node IDs to source ranges:

```sh
zero graph source-map hello.0
zero graph source-map --json hello.0
```

### reconcile

Compare edited source with a prior graph:

```sh
zero graph reconcile .zero/out/hello.program-graph --source hello.0
```

### check

Typecheck through direct graph lowering:

```sh
zero graph check hello.0
zero graph check .zero/out/hello.program-graph
```

### size

Size analysis for a ProgramGraph artifact:

```sh
zero graph size hello.program-graph
zero graph size --json hello.program-graph
```

### build

Build from a ProgramGraph artifact:

```sh
zero graph build .zero/out/hello.program-graph
```

### run

Run a ProgramGraph:

```sh
zero graph run .zero/out/hello.program-graph
```

### test

Test a ProgramGraph:

```sh
zero graph test --json .zero/out/hello.program-graph
```

### patch

Apply checked edits to a graph:

```sh
zero graph patch hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello graph\n"'
```

### roundtrip

Verify graph stability through import/export:

```sh
zero graph roundtrip hello.0
zero graph roundtrip .zero/out/hello.program-graph
```

## Graph Patch Operations

`zero graph patch` supports the `set` operation for updating scalar fields:

### set

Update a scalar field on an existing node:

```
set node="#610c78bf" field="value" expect="hello from zero\n" value="hello patched\n"
```

Editable fields include: `name`, `type`, `value`, `public`, `mutable`, `static`, `fallible`, `exportC`.

The `expect` parameter is optional but recommended — it rejects the operation if the current value differs from what you expected, preventing stale edits.

## JSON Output

All `zero graph` commands accept `--json` for structured output. Key fields:

| Command | JSON Fields |
|---------|-------------|
| `dump` | `schemaVersion`, `canonicalSource`, `moduleIdentity`, `graphHash`, `validation`, `counts`, `nodes[]`, `edges[]` |
| `import` | `schemaVersion`, `moduleIdentity`, `graphHash`, `validation`, `saved.path` |
| `validate` | `schemaVersion`, `moduleIdentity`, `graphHash`, `counts`, `validation` |
| `view` | `schemaVersion`, `moduleIdentity`, `graphHash`, `source`, optional output path |
| `source-map` | Node IDs → source ranges, node hashes, symbol/type/effect IDs, file hash facts |
| `reconcile` | Identity decisions, ambiguous-match diagnostics, simple graph patch text |
| `check` | `schemaVersion`, `moduleIdentity`, `graphHash`, `check.lowering`, target readiness, safety facts, graph-mapped diagnostics |
| `size` | `schemaVersion`, `graph` identity, `profileSemantics`, `profileCatalog`, `profileBudget`, `safetyFacts`, `backendProfile`, `backendComparison`, `sizeBreakdown`, `retentionReasons`, `optimizationHints` |
| `build` | `schemaVersion`, `graph` identity, selected `emit` kind, target, artifact path/size, safety facts |
| `patch` | Per-operation results (`op`, `node`, `field`, `status`), changed graph hash, saved source/artifact path |
| `roundtrip` | `schemaVersion`, `semanticStable`, lowering mode, original/roundtripped graph hashes |

## Further Reading

- [Agent-Native Concepts](/docs/concepts/agent-native) — why the ProgramGraph exists
- [Graph-First Programming](/docs/language/graph-first) — the design philosophy
- [CLI Reference](/docs/cli/commands) — all `zero` commands and their JSON output
