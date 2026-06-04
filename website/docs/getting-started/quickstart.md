---
sidebar_position: 2
---

# Quick Start

## Hello World

Create `hello.0`:

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello from zero\n")
}
```

Run it:

```bash
zero run hello.0
```

Output:

```
hello from zero
```

## Check Your Program

```bash
zero check hello.0
```

## Inspect the Program Graph

```bash
zero graph --json hello.0
```

Outputs structured ProgramGraph data: nodes, edges, types, effects, and other semantic facts.

## Build an Executable

```bash
zero build --emit exe --target linux-musl-x64 hello.0 --out ./hello
```

## Get Agent Skills

```bash
# List available skills
zero skills list

# Get full language guide
zero skills get zero --full
```

## Next Steps

- Read the [Language Syntax](/docs/language/syntax) guide
- Explore the [CLI Reference](/docs/cli/commands)
