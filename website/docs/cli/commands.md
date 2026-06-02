---
sidebar_position: 1
---

# CLI Commands

All Zerolang tooling is integrated into a single `zero` binary.

## zero check

Check a program and output diagnostics.

```bash
zero check examples/hello.0
zero check --json examples/hello.0    # structured output
```

## zero run

Build and run a program.

```bash
zero run examples/hello.0
zero run examples/add.0 -- --arg1 value    # pass arguments
```

## zero build

Build to an executable or other target.

```bash
zero build --emit exe --target linux-musl-x64 hello.0 --out ./hello
```

## zero graph

Output structured ProgramGraph information.

```bash
zero graph --json examples/hello.0
```

## zero size

Report build artifact size.

```bash
zero size --json examples/point.0
```

## zero skills

Get version-matched agent guidance.

```bash
zero skills list
zero skills get zero --full
zero skills get language
```

## zero fix

Generate a fix plan.

```bash
zero fix --plan --json examples/hello.0
```

## zero explain

Explain a diagnostic code.

```bash
zero explain NAM003
```

## zero doctor

Check environment configuration.

```bash
zero doctor --json
```
