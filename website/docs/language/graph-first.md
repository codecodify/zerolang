---
sidebar_position: 2
---

# Graph-First Design

## Source Is the Artifact. Graph Is the Work Surface.

Source text is excellent for humans and code review, but it is a weak interface for program understanding.

Agents need to:
- Gather focused context without reading entire files
- Know what a call resolves to
- Avoid stale edits
- Change related structure
- Get validation before source is written

## Semantic Navigation

Agents should be able to start from a symbol, diagnostic, call, capability, module, or node ID and gather the relevant semantic slice.

```bash
zero graph --json examples/hello.0
```

Sample output:

```
zero-graph v1
origin source-text
module "hello"
hash "graph:b8a019041020df03"

node #ea5ea1ca Function name:"main" type:"Void" public:true fallible:true
node #f9ce8b3e Param name:"world" type:"World"
node #421a4d4b MethodCall name:"write" type:"Void"
node #610c78bf Literal type:"String" value:"hello from zero\n"
edge #421a4d4b arg #610c78bf order:0
```

## Precise Edits

Graph edits target compiler nodes and fields, with graph-hash and expected-value checks, instead of relying only on line ranges or source text matching.

```bash
zero graph patch examples/hello.0 \
  --expect-graph-hash graph:b8a019041020df03 \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello graph\n"'
```

## Validated Refactors

Refactors can be represented as operations on resolved program structure: rename this function node, replace this resolved callee, update these related references.

A graph patch can validate, lower, write, format, reparse, and check through the compiler.
