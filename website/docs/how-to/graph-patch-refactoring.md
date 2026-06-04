---
sidebar_position: 1
---

# Semantic Refactoring with `zero graph patch`

This guide shows how to use `zero graph patch` for semantic refactoring: renaming functions, changing string literals, updating type fields, and bulk-editing programs. Unlike text-based search-and-replace, graph patches are checked by the compiler before they are applied.

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

The output includes all nodes with their IDs, kinds, and values. Look for the node you want to change — for example, the function name `greet` or a string literal `"Hello, "`.

Key fields to look for:
- `id` — the node identifier (e.g., `#decl_abc123`)
- `kind` — what kind of node it is (`Function`, `Literal`, `Call`, etc.)
- `name` — the declared name
- `value` — the literal value (for string/number literals)
- `hash` — the graph hash for `--expect-graph-hash`

## Rename a Function

To rename `greet` to `sayHello`:

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'rename node="#YOUR_GREET_DECL_ID" expect="greet" value="sayHello"'
```

The `rename` operation updates the function declaration name and all call sites. The compiler checks that:
- The node exists
- The current name matches `expect` (if provided)
- The new name is a valid identifier
- No naming conflicts are introduced

After the patch, the source is rewritten:

```zero
fn sayHello(name: String) -> Void raises {
    check world.out.write("Hello, " + name + "!\n")
}

pub fn main(world: World) -> Void raises {
    sayHello("Alice")
    sayHello("Bob")
}
```

## Change a String Literal

To change the greeting format:

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#YOUR_LITERAL_ID" field="value" expect="Hello, " value="Hi, "'
```

The `set` operation updates a single field. The `expect` parameter is optional but recommended — it rejects the operation if the current value differs from what you expected.

## Insert a New Node

To add a new function argument or expression:

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'insert node="#patch001" kind="Literal" parent="#YOUR_CALL_ID" edge="arg" order="2" type="String" value="!\n"'
```

The `insert` operation creates a new node and connects it to a parent node with an ordered edge. This is useful for adding arguments, conditions, or new statements.

## Delete a Node

To remove a node and its subtree:

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'delete node="#patch001"'
```

The `delete` operation removes an owned subtree. If other nodes reference the deleted subtree, the operation is rejected.

## Bulk Edits with Patch Files

For multiple edits, use a patch file:

Create `refactor.patch`:

```text
zero-program-graph-patch v1
expect graphHash "graph:YOUR_HASH"
rename node="#YOUR_GREET_ID" expect="greet" value="sayHello"
set node="#YOUR_LITERAL_ID" field="value" expect="Hello, " value="Hi, "
```

Apply it:

```sh
zero graph patch refactor-demo.0 --patch-file refactor.patch
```

Or pass the patch text inline:

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --patch-text 'zero-program-graph-patch v1
expect graphHash "graph:YOUR_HASH"
rename node="#YOUR_GREET_ID" expect="greet" value="sayHello"'
```

## Safety Mechanisms

### Graph Hash Preconditions

Every patch should include `--expect-graph-hash`. This prevents:
- Editing a program that has changed since the agent last read it
- Race conditions in multi-agent workflows
- Applying patches to the wrong version of a file

If the hash does not match, the patch fails with a clear error.

### Field Value Preconditions

The `expect` parameter in `set` and `rename` operations checks the current value before applying the change. This prevents:
- Overwriting a value that was already changed
- Renaming something that was already renamed
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
     --op 'rename node="#ID" expect="old" value="new"'
   → Apply the edit

3. zero check --json file.0
   → Verify the edit is valid

4. If ok: continue. If not: read diagnostics, fix, retry.
```

## Common Patterns

### Rename a Variable

```sh
--op 'rename node="#BINDING_ID" expect="oldName" value="newName"'
```

### Change a Type

```sh
--op 'set node="#BINDING_ID" field="type" expect="i32" value="i64"'
```

### Make a Binding Mutable

```sh
--op 'set node="#BINDING_ID" field="mutable" expect="false" value="true"'
```

### Change a Function's Return Type

```sh
--op 'set node="#FUNC_ID" field="type" expect="i32" value="i64"'
```

### Toggle Public Visibility

```sh
--op 'set node="#DECL_ID" field="public" expect="false" value="true"'
```

## Limitations

- Graph patches work on canonical `.0` source without comments. If your source has comments, they may be lost during rewrite.
- The `set` operation can only update scalar fields (`name`, `type`, `value`, `public`, `mutable`, `static`, `fallible`, `exportC`).
- Complex structural changes (adding new functions, reordering statements) may require multiple `insert`/`delete` operations.
- Boolean fields (`public`, `mutable`, `fallible`) accept only `true` or `false`.

## Further Reading

- [ProgramGraph Reference](/docs/reference/program-graph) — complete graph structure documentation
- [CLI Reference](/docs/cli/commands) — all `zero graph` commands
- [Let Agent Edit Your Code](/docs/tutorials/agent-editing) — the full agent editing loop
