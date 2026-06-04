---
sidebar_position: 2
---

# Diagnostics Code Reference

A quick-reference table for every stable diagnostic code emitted by the Zero compiler. Use `zero explain <code>` for deeper guidance on any specific code.

## How to Read Diagnostics

Run `zero check --json` to get structured diagnostic output:

```json
{
  "schemaVersion": 1,
  "ok": false,
  "diagnostics": [
    {
      "severity": "error",
      "code": "NAM003",
      "message": "unknown identifier 'message'",
      "path": "examples/hello.0",
      "line": 2,
      "column": 27,
      "length": 7,
      "expected": "visible local, parameter, function, or builtin",
      "actual": "no visible symbol named 'message'",
      "help": "declare the name before using it",
      "fixSafety": "behavior-preserving",
      "repair": {
        "id": "manual-review",
        "summary": "Inspect the diagnostic fields and choose a repair manually."
      },
      "related": []
    }
  ]
}
```

Each diagnostic includes: `code` (stable identifier), `message` (what went wrong), location (`path`, `line`, `column`), `expected`/`actual` (the mismatch), `help` (suggested fix), and `fixSafety` (automation label).

## Fix Safety Labels

Fixes carry safety labels so agents and tools know when they can act automatically:

| Label | Meaning |
|-------|---------|
| `format-only` | Changes only formatting, no behavioral impact |
| `behavior-preserving` | Preserves program behavior, safe to apply |
| `local-edit` | Confined to the current local scope or file |
| `api-changing` | Changes function signatures, exported names, package APIs, or call sites |
| `requires-human-review` | Risky or ambiguous; show the plan but do not apply automatically |

## Code Reference

### PAR - Parser

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| PAR100 | parser syntax failure | Missing braces, commas, malformed type argument lists, or other syntax errors | Check the indicated token and surrounding structure; add missing delimiters or fix malformed syntax |

### NAM - Names

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| NAM003 | unknown identifier | A name is used before being declared in the current lexical scope | Introduce a local binding, parameter, or import before this use |
| NAM004 | duplicate name / arity mismatch | Duplicate names, wrong call arity, or generic type-name shadowing | Rename the duplicate, correct the argument count, or remove the shadowing declaration |

### TYP - Types

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| TYP002 | type mismatch | Type mismatch in assignments, literals, returns, or type defaults | Ensure the expression matches the expected type; add explicit cast or annotation |
| TYP009 | mutable storage required | Writable byte helpers (e.g. `std.mem.copy`) require mutable storage | Change `let` to `var` for the destination binding |
| TYP010 | condition must be Bool | A condition expression is not `Bool` | Use a boolean expression or comparison operator |
| TYP011 | null requires Maybe context | `null` used outside a `Maybe<T>` context | Wrap with `Maybe<T>` or provide a typed default |
| TYP012 | break outside loop | `break` used without an enclosing loop | Move `break` inside a loop body or restructure control flow |
| TYP013 | continue outside loop | `continue` used without an enclosing loop | Move `continue` inside a loop body or restructure control flow |
| TYP014 | non-integer loop bounds | Range loop bounds must be integer-compatible | Use integer expressions for loop range bounds |
| TYP015 | invalid integer literal | Integer literal uses invalid digits, separators, radix prefixes, or suffixes | Fix the literal format; use valid digits and optional radix prefix (`0x`, `0b`, `0o`) |
| TYP016 | integer overflow | Integer literal does not fit the expected primitive integer width | Use a wider type or reduce the literal value |
| TYP017 | invalid cast | `as` casts are limited to primitive numeric and byte `char` types | Cast between compatible numeric types only |
| TYP018 | invalid char literal | Character literal must contain exactly one byte or a supported byte escape | Use a single character or escape sequence like `\n`, `\t`, `\\` |
| TYP019 | invalid float literal | Float literal must use `digits "." digits` with an optional exponent | Add a decimal point; e.g. `1.0` instead of `1` |
| TYP020 | float overflow | Float literal does not fit the expected primitive float width | Use `f64` for larger values or reduce the literal |
| TYP021 | unsupported indexing target | Indexing, slicing, or indexed assignment on an unsupported target | Use a supported array, slice, or indexable type |
| TYP022 | non-integer index | Index expressions and slice bounds must be integers | Use integer expressions for indices and bounds |
| TYP023 | generic arity mismatch | Generic call type argument count mismatch, or type arguments on a non-generic function | Match the number of type parameters; remove type args from non-generic calls |
| TYP024 | conflicting generic inference | Generic inference found conflicting concrete types for one type parameter | Make arguments agree or pass explicit type arguments |
| TYP025 | inference failure | Generic type arguments could not be inferred from local call arguments | Pass explicit type arguments: `fn<Type>(args)` |
| TYP026 | cyclic type alias | A type alias is duplicated, malformed, or cyclic | Point the alias at a concrete type or remove the cycle |
| TYP027 | recursive generic mutation | Recursive generic call changes type arguments | Ensure recursive calls use consistent type arguments |

### BOR - Borrows

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| BOR001 | borrow conflict | Lexical borrow conflicts; JSON includes `borrowTrace.activeBorrows` with details on each borrowed root | Reorder borrows, reduce borrow scope, or clone the value |
| BOR002 | reference escape | Reference-origin escapes, including references returned from calls or stored through mutable parameter storage | Return owned values instead of references, or restructure to avoid escape |

### OWN - Ownership

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| OWN001 | use after move | Owned value used after being moved, or generic containers owning unconstrained generic payloads | Clone before move, reorder usage, or use references where appropriate |

### ERR - Error Flow

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| ERR002 | missing error in set | Caller's explicit error set is missing an error raised by a callee | Add the missing error to the `raises` set: `raises [NotFound, Io, ...]` |
| ERR003 | unchecked fallible call | A fallible call was used without `check` or `rescue` | Add `check` to propagate, or `rescue` to handle locally |

### TAR - Targets

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| TAR001 | unknown target | The requested target name is not in `zero targets` | Check available targets with `zero targets` and use a valid name |
| TAR002 | missing capability | The selected target does not provide a capability required by the program | Build for a target with the required capability or use target-specific entry points |

### IMP - Imports

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| IMP001 | unknown import | Unknown package-local import path | Check the import path; use repair id `fix-import-path` |
| IMP002 | import cycle | Package-local import forms a cycle | Restructure imports to break the cycle |
| IMP003 | duplicate export | Duplicate public exports across imported modules | Rename or remove one of the conflicting exports |

### PKG - Packages

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| PKG001 | missing zero.json | A local package dependency path does not contain `zero.json` | Ensure the dependency directory contains a valid `zero.json` manifest |
| PKG002 | package cycle | Package dependencies form a cycle | Restructure dependencies to break the cycle |
| PKG003 | version conflict | One package name resolves to conflicting versions | Align dependency versions across manifests |
| PKG004 | unsupported target | A package dependency does not support the selected target | Use a compatible target or find an alternative dependency |

### IFC - Interfaces

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| IFC001 | unknown constraint | An interface constraint is unknown or a concrete type argument has no static type body | Import the interface or provide a type with the required static body |
| IFC002 | missing method | A constrained concrete type is missing a required static interface method | Implement the required method on the concrete type |
| IFC003 | wrong parameter count | A concrete static method has the wrong parameter count for an interface | Match the interface's method signature parameter count |
| IFC004 | wrong return type | A concrete static method has the wrong return type for an interface | Match the interface's method return type |
| IFC005 | wrong parameter type | A concrete static method has the wrong parameter type for an interface | Match the interface's method parameter types |

### STC - Static Values

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| STC001 | unsupported static type | A static value parameter uses an unsupported non-integer type | Use an integer type for static value parameters |
| STC002 | non-literal static arg | A static value argument is not an integer literal or deterministic top-level const | Use an integer literal or a top-level `const` value |
| STC003 | static value conflict | An explicit static value argument conflicts with the value carried by an annotated type | Remove the explicit argument or adjust the type annotation |

### Other

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| BLD002 | bad manifest | Bad project manifest or unsupported manifest target shape | Fix the `zero.json` manifest structure or remove unsupported target configuration |
| ABI001 | unsupported C ABI | Unsupported C ABI export or extern layout surface | Use supported ABI-compatible types; check extern declarations |
| CIMP003 | host path leak | A foreign-target C dependency would use host include/library paths or host `pkg-config` | Use package-relative vendored headers/libraries or configure the target sysroot |
| CIMP004 | missing C function | An extern C call names a function missing from the imported header or uses an unsupported C ABI type | Ensure the function is declared in the header; use compatible C types |
| CIMP005 | missing C link plan | An extern C call is missing matching C link metadata or uses an unsafe system library name | Add matching `c.libs.*` entry in `zero.json` with `headers` and `lib`/`link` |
| SHM001 | inference failure | A generic type method call cannot infer inherited type/static parameters | Pass explicit type or static arguments |
| SHM002 | conflicting Self | Arguments to a generic type method imply conflicting `Self` instantiations | Ensure arguments agree on the same `Self` type |
| RCV001 | unknown method | A receiver-style call names an unknown method or a static method without `self` | Check method name; use instance methods for receiver calls |
| RCV002 | addressable receiver | A receiver-style call needs an addressable receiver, or a mutable receiver for `mutref<Self>` | Use a variable binding as receiver; use `var` for mutable receivers |
| FLD001 | unknown field | A type literal includes an unknown field | Remove the field or check the type definition |
| FLD002 | missing required field | A type literal omitted a required field that has no default | Add the required field with a value |
| MEM001 | malformed Maybe | Malformed memory type forms such as `Maybe` without its required type argument | Add the type argument: `Maybe<T>` |
| MEM002 | unguarded Maybe read | A `Maybe<T>.value` read that has not been proven present by a visible `.has` guard | Add a `.has` guard, `check`, or `rescue` before reading `.value` |
| MET001 | unsupported meta | A parsed `meta` expression requested compile-time behavior not yet supported | Avoid unsupported `meta` expressions; use runtime alternatives |
| PUB001 | missing API metadata | A public declaration omitted required explicit API type metadata | Add explicit type annotation: `pub const name: Type = value` |
| MAT004 | payload mismatch | A match arm can bind a payload only for a choice case that carries one | Match the payload pattern to cases that carry payloads |

## Common Fix Plans

### 1. Missing Variable Declaration (NAM003)

**Problem:** Using a name before declaring it.

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write(message)  // 'message' not declared
}
```

**Fix:** Introduce a local binding before use.

```zero
pub fn main(world: World) -> Void raises {
    let message: String = "hello from zero\n"
    check world.out.write(message)
}
```

### 2. Unchecked Fallible Call (ERR003)

**Problem:** A fallible function call without `check` or `rescue`.

```zero
let file: owned<File> = std.fs.createOrRaise(fs, ".zero/out.txt")
```

**Fix:** Use `check` to propagate errors and declare the error set.

```zero
fn createFile(fs: owned<Fs>) -> owned<File> raises [NotFound, TooLarge, Io] {
    return check std.fs.createOrRaise(fs, ".zero/out.txt")
}
```

### 3. Type Inference Conflict (TYP024)

**Problem:** Generic call where `T` would need to be both `i32` and `u8`.

```zero
fn first<T: Type>(left: T, right: T) -> T {
    return left
}
let value: i32 = first(1, 2_u8)
```

**Fix:** Make arguments agree or pass explicit type arguments.

```zero
let value: i32 = first<i32>(1, 2)
```

### 4. Missing API Metadata (PUB001)

**Problem:** Public constant without explicit type annotation.

```zero
pub const answer = 42
```

**Fix:** Add the required type annotation.

```zero
pub const answer: i32 = 42
```

### 5. Cross-Target C Dependency (CIMP003)

**Problem:** Foreign-target build tries to use host include paths or `pkg-config`.

```sh
zero build --json --target linux-musl-x64 my-package
```

**Fix:** Use package-relative vendored headers/libraries or configure the target sysroot. Do not rely on host paths for cross-compilation.

## Further Reading

- [CLI Reference](/docs/cli/commands) - Zero command-line tools and flags
- [Agent-Native Concepts](/docs/concepts/agent-native) - How Zero's design supports AI-assisted development
- [Language Effects](/docs/language/effects) - Understanding `raises`, `check`, and `rescue`
