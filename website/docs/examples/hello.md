---
sidebar_position: 1
---

# Hello World

## Source

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello from zero\n")
}
```

## Run

```bash
zero run hello.0
```

## Check

```bash
zero check hello.0
```

## Inspect Graph

```bash
zero graph --json hello.0
```
