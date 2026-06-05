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
zero graph dump hello.0
```

Sample output:

```
zero-graph v1
origin source-text
module "hello"
hash "graph:YOUR_HASH"

node #c8099893 Module name:"hello"
node #ea5ea1ca Function name:"main" type:"Void" public:true fallible:true
node #f9ce8b3e Param name:"world" type:"World"
node #05f2d0ac TypeRef type:"World"
node #6ec1517a TypeRef type:"Void"
node #255a8451 EffectRef name:"error"
node #6c48dda8 Block name:"body"
node #703690f1 Check
node #421a4d4b MethodCall name:"write" type:"Void"
node #42986dea FieldAccess name:"write"
node #75febe43 FieldAccess name:"out"
node #33e5c17a Identifier name:"world"
node #610c78bf Literal type:"String" value:"hello from zero\n"
edge #c8099893 function #ea5ea1ca order:0
edge #ea5ea1ca param #f9ce8b3e order:0
edge #f9ce8b3e type #05f2d0ac
edge #ea5ea1ca returnType #6ec1517a
edge #ea5ea1ca effect #255a8451
edge #75febe43 left #33e5c17a
edge #42986dea left #75febe43
edge #421a4d4b left #42986dea
edge #421a4d4b arg #610c78bf order:0
edge #703690f1 expr #421a4d4b
edge #6c48dda8 statement #703690f1 order:0
edge #ea5ea1ca body #6c48dda8
```

## Precise Edits

Graph edits target compiler nodes and fields, with graph-hash and expected-value checks, instead of relying only on line ranges or source text matching.

```bash
zero graph patch hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello graph\n"'
```

## Validated Refactors

Refactors can be represented as operations on resolved program structure: rename this function node, replace this resolved callee, update these related references.

A graph patch can validate, lower, write, format, reparse, and check through the compiler.
