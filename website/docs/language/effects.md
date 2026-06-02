---
sidebar_position: 3
---

# Effects System

## Explicit Everything

Zerolang makes outside-world access, fallibility, ownership, and resource use visible to both readers and tools.

There are no hidden global objects, no implicit async, and no magic globals.

## Capability-Based I/O

If a function touches the outside world, its signature says so:

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello\n")
}
```

| Element | Meaning |
|---|---|
| `world: World` | Explicit capability parameter |
| `raises` | Function may fail |
| `check` | Operation that may fail |

## No Hidden Runtime Tax

- No mandatory garbage collector
- No hidden allocator — allocation is explicit and visible in code
- ABI exports are explicit

## Deterministic Tooling

Diagnostics, graph facts, size reports, explanations, and fix plans are structured enough for agents to inspect and act on without parsing prose.
