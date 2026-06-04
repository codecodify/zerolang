---
sidebar_position: 2
---

# Diagnostics

## Structured Diagnostics

`zero check --json` emits machine-readable diagnostics instead of plain text.

### JSON Output Fields

| Field | Description |
|---|---|
| `schemaVersion` | Schema version for forward compatibility |
| `ok` | `true` if compilation succeeded, `false` otherwise |
| `diagnostics[]` | Array of diagnostic objects |

Each diagnostic in the array includes:

| Field | Description |
|---|---|
| `severity` | `error` or `warning` |
| `code` | Stable error code (e.g., `NAM003`) |
| `message` | Human-readable message |
| `path` | Source file path |
| `line` | 1-based line number |
| `column` | 1-based column number |
| `length` | Span length in bytes |
| `expected` | Expected construct or type |
| `actual` | Actual construct or type |
| `help` | Suggested fix or explanation |
| `fixSafety` | Safety label of the available repair |
| `repair` | Repair metadata with `id` and `summary` |
| `related` | Related diagnostics |

## The Repair Loop

Two CLI subcommands complete the agent repair loop:

### zero explain

Returns a structured explanation of any diagnostic code. Agents can look up `NAM003` directly — no doc scraping required.

```bash
zero explain NAM003
```

For machine-readable output:

```bash
zero explain --json NAM003
```

### zero fix --plan --json

Emits a machine-readable fix plan describing exactly what changes to make — no inference from prose required.

```bash
zero fix --plan --json examples/hello.0
```

## Fix Safety Labels

| Label | Meaning | Agent Action |
|---|---|---|
| `format-only` | Changes only formatting | Apply directly |
| `behavior-preserving` | Preserves program behavior | Apply directly |
| `local-edit` | Confined to the current local scope or file | Apply directly |
| `api-changing` | Changes function signatures, exported names, package APIs, or call sites | Propose to user; do not auto-apply |
| `requires-human-review` | Risky or ambiguous | Stop and ask the human |

## Diagnostic Code Prefixes

| Prefix | Category | Examples |
|---|---|---|
| `PAR` | Parser | `PAR100` |
| `NAM` | Naming | `NAM003`, `NAM004` |
| `IMP` | Imports | `IMP001`–`IMP003` |
| `PKG` | Packages | `PKG001`–`PKG004` |
| `BLD` | Build | `BLD002` |
| `ERR` | Error flow | `ERR002`, `ERR003` |
| `ABI` | ABI | `ABI001` |
| `CIMP` | C imports | `CIMP003`–`CIMP005` |
| `BOR` | Borrowing | `BOR001`, `BOR002` |
| `OWN` | Ownership | `OWN001` |
| `TYP` | Typing | `TYP002`, `TYP010`–`TYP027` |
| `PUB` | Publishing | `PUB001` |
| `MET` | Metadata | `MET001` |
| `IFC` | Interfaces | `IFC001`–`IFC005` |
| `STC` | Static values | `STC001`–`STC003` |
| `SHM` | Shared access | `SHM001`, `SHM002` |
| `RCV` | Receivers | `RCV001`, `RCV002` |
| `FLD` | Fields | `FLD001`, `FLD002` |
| `MEM` | Memory | `MEM001`, `MEM002` |
| `TAR` | Targets / capabilities | `TAR001`, `TAR002` |
| `MAT` | Match arms | `MAT004` |

## Commands

| Command | Purpose |
|---|---|
| `zero check --json <input>` | Check for errors with machine-readable output |
| `zero fix --plan --json <input>` | Generate a fix plan |
| `zero explain <code>` | Human-readable explanation |
| `zero explain --json <code>` | Machine-readable explanation |
