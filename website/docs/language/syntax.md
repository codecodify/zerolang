---
sidebar_position: 1
---

# Syntax Overview

## Basic Structure

Zerolang source files use the `.0` extension.

```zero
fn answer() -> i32 {
    return 40 + 2
}

pub fn main(world: World) -> Void raises {
    if answer() == 42 {
        check world.out.write("math works\n")
    }
}
```

## Functions

```zero
fn function_name(parameter: Type) -> ReturnType {
    // body
}
```

- `pub` marks a function as public
- `raises` marks a function as fallible (may fail)

## Types

| Type | Description |
|---|---|
| `i32` | 32-bit signed integer |
| `Void` | No return value |
| `Bool` | Boolean |
| `String` | String |

## Control Flow

```zero
if condition {
    // ...
} else {
    // ...
}
```

## Effects and Capabilities

In Zerolang, all external-world access must go through explicit capabilities:

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello\n")
}
```

The `world` parameter provides access to external capabilities. The `check` keyword marks operations that may fail.

## Ownership and Borrowing

(Detailed documentation coming soon. Refer to the latest official release for current syntax.)
