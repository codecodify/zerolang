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
zero graph dump examples/hello.0
```

Sample output:

```
zero-graph v1
origin source-text
module "hello"
hash "graph:a7f7e6899a73f3b4"

node #decl_ad8d9028 Function name:"main" type:"Void" public:true fallible:true
node #param_4610ae76 Param name:"world" type:"World"
node #expr_c403020c MethodCall name:"write" type:"Void"
node #expr_653eeb6e Literal type:"String" value:"hello from zero\n"
edge #decl_ad8d9028 body #block_29d1811d
edge #expr_c403020c arg #expr_653eeb6e order:0
```

## Precise Edits

Graph edits target compiler nodes and fields, with graph-hash and expected-value checks, instead of relying only on line ranges or source text matching.

```bash
zero graph patch examples/hello.0 \
  --expect-graph-hash graph:a7f7e6899a73f3b4 \
  --op 'set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello graph\n"'
```

## Validated Refactors

Refactors can be represented as operations on resolved program structure: rename this function node, replace this resolved callee, update these related references.

A graph patch can validate, lower, write, format, reparse, and check through the compiler.
