---
sidebar_position: 1
---

# CLI Commands

All Zerolang tooling is integrated into a single `zero` binary.

## Input Forms

| Form | Description |
|---|---|
| `file.0` | Single source file |
| `project/` | Directory with `zero.json` |
| `zero.json` | Explicit manifest path |

## Core Commands

### zero check

Check a program and output diagnostics.

```bash
zero check examples/hello.0
zero check --json examples/hello.0              # structured output
zero check --json --target linux-musl-x64 hello.0
zero check --json --emit exe hello.0
zero check --json --backend llvm hello.0
```

### zero run

Build and run a program.

```bash
zero run examples/hello.0
zero run examples/add.0 -- input.txt            # pass arguments
zero run --backend llvm --target linux-musl-x64 hello.0
zero run --profile release hello.0
zero run --out .zero/out/hello hello.0
```

### zero build

Build to an executable or other target.

```bash
zero build --emit exe --target linux-musl-x64 examples/add.0 --out .zero/out/add
zero build --backend llvm --profile release hello.0
zero build --emit wasm hello.0
```

### zero test

Run inline test blocks.

```bash
zero test examples/hello.0
zero test --json examples/hello.0
zero test --filter "add" examples/hello.0
zero test --target linux-musl-x64 hello.0
```

### zero fmt

Format source files.

```bash
zero fmt examples/hello.0
zero fmt --check examples/hello.0               # CI mode
```

### zero fix

Generate a fix plan.

```bash
zero fix --plan --json examples/hello.0
zero fix --plan --json --target linux-musl-x64 hello.0
```

## Graph Commands

### zero graph dump

Dump the ProgramGraph in text or JSON format.

```bash
zero graph dump examples/hello.0                # text format
zero graph dump --json examples/hello.0         # JSON format
```

### zero graph import

Import a ProgramGraph.

```bash
zero graph import examples/hello.program-graph
```

### zero graph inspect

Inspect a source file's structure.

```bash
zero graph inspect examples/hello.0
zero graph inspect --json examples/hello.0
```

### zero graph validate

Validate a ProgramGraph.

```bash
zero graph validate .zero/out/hello.program-graph
```

### zero graph view

View a ProgramGraph artifact.

```bash
zero graph view examples/hello.0
zero graph view --out .zero/out/hello.view.0 .zero/out/hello.program-graph
```

### zero graph source-map

Generate source map from ProgramGraph.

```bash
zero graph source-map examples/hello.0
```

### zero graph reconcile

Reconcile graph with source.

```bash
zero graph reconcile examples/hello.0
```

### zero graph check

Check a source file or ProgramGraph.

```bash
zero graph check examples/hello.0
zero graph check .zero/out/hello.program-graph
```

### zero graph size

Report ProgramGraph size information.

```bash
zero graph size examples/point.0
zero graph size --json examples/point.0
```

### zero graph build

Build from a ProgramGraph.

```bash
zero graph build .zero/out/hello.program-graph
```

### zero graph run

Run a ProgramGraph.

```bash
zero graph run .zero/out/hello.program-graph
```

### zero graph test

Test a ProgramGraph.

```bash
zero graph test --json .zero/out/hello.program-graph
```

### zero graph patch

Apply a patch to a ProgramGraph.

```bash
zero graph patch hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello graph\n"'
```

Use `--patch-text <text>` when a tool has a complete patch document in memory.

### zero graph roundtrip

Roundtrip through the compiler.

```bash
zero graph roundtrip examples/hello.0
```

## Development Commands

### zero dev

Watch mode for development.

```bash
zero dev
zero dev --json
zero dev --trace
```

### zero doc

Generate public API documentation.

```bash
zero doc examples/hello.0
```

### zero ship

Generate a release preview with checksums and metadata.

```bash
zero ship examples/hello.0
```

### zero size

Report build artifact size with detailed breakdown.

```bash
zero size --json examples/point.0
```

### zero time

Report compilation stage timings.

```bash
zero time --json
```

### zero mem

Report memory usage.

```bash
zero mem --json
```

### zero doctor

Check host and target readiness.

```bash
zero doctor --json
```

### zero targets

List supported compilation targets.

```bash
zero targets
```

### zero clean

Clean build artifacts.

```bash
zero clean
zero clean --all
```

### zero new

Create a new project from a template.

```bash
zero new cli mytool
zero new lib mylib
zero new package mypkg
```

## Analysis Commands

### zero tokens

Tokenize a source file.

```bash
zero tokens --json examples/hello.0
```

### zero parse

Parse a source file.

```bash
zero parse --json examples/hello.0
```

### zero abi

Check or dump ABI information.

```bash
zero abi check --json examples/hello.0
zero abi dump --json examples/hello.0
```

## Skills Commands

### zero skills

Get version-matched agent guidance.

```bash
zero skills list
zero skills get language
zero skills get diagnostics
zero skills get stdlib
```

## Utility Commands

### zero explain

Explain a diagnostic code.

```bash
zero explain NAM003
zero explain --json NAM003
```

### zero --version

Show version information.

```bash
zero --version
zero --version --json
```
