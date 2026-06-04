---
sidebar_position: 2
---

# Build a CLI Tool

This tutorial walks you through building a complete command-line tool with Zerolang. You will create a package, parse arguments, read and write files, handle errors, and cross-compile to Linux.

**Prerequisites**: Zerolang installed (`zero --version` works).

**Time**: ~30 minutes

## Step 1: Create a Package

```sh
zero new cli mytool
cd mytool
```

This creates:

```
mytool/
├── zero.json
└── src/
    └── main.0
```

The `zero.json` manifest:

```json
{
  "package": { "name": "mytool", "version": "0.1.0" },
  "targets": { "cli": { "kind": "exe", "main": "src/main.0" } }
}
```

## Step 2: Read Command-Line Arguments

Edit `src/main.0`:

```zero
use std.args

pub fn main(world: World) -> Void raises {
    let name: Maybe<String> = std.args.get(1)
    if name.has {
        check world.out.write("Hello, " + name.value + "!\n")
    } else {
        check world.out.write("Usage: mytool <name>\n")
    }
}
```

`std.args.get` returns `Maybe<String>` because the argument may not exist. Use `.has` to check presence and `.value` to access it.

Run it:

```sh
zero run src/main.0 -- Alice
```

Output: `Hello, Alice!`

Without arguments:

```sh
zero run src/main.0
```

Output: `Usage: mytool <name>`

## Step 3: Write to a File

```zero
use std.args
use std.fs

pub fn main(world: World) -> Void raises {
    let name: Maybe<String> = std.args.get(1)
    if name.has {
        let output: String = "Hello, " + name.value + "!\n"
        let written: usize = std.fs.write("output.txt", output)
        if written > 0 {
            check world.out.write("Wrote " + name.value + " to output.txt\n")
        }
    } else {
        check world.out.write("Usage: mytool <name>\n")
    }
}
```

`std.fs.write` is a hosted API — it works on the host target but reports `TAR002` on non-host targets.

## Step 4: Handle Errors Explicitly

Zero's error handling uses `raises` and `check`. Functions that can fail declare `raises`:

```zero
use std.args
use std.fs

fn writeGreeting(name: String) -> Void raises [Io] {
    let output: String = "Hello, " + name + "!\n"
    let written: usize = std.fs.write("output.txt", output)
    if written == 0 {
        raise Io
    }
}

pub fn main(world: World) -> Void raises [Io] {
    let name: Maybe<String> = std.args.get(1)
    if name.has {
        writeGreeting(name.value)
        check world.out.write("Done\n")
    } else {
        check world.out.write("Usage: mytool <name>\n")
    }
}
```

The `raises [Io]` declaration tells the compiler (and any agent reading the code) exactly which errors this function can produce.

## Step 5: Add a Test

Add a test block to `src/main.0`:

```zero
test "greeting format" {
    let greeting: String = "Hello, " + "Zero" + "!\n"
    expect (greeting == "Hello, Zero!\n")
}
```

Run tests:

```sh
zero test src/main.0
```

## Step 6: Build an Executable

```sh
zero build --emit exe --target host src/main.0 --out ./mytool
```

This produces a native executable. Run it:

```sh
./mytool Alice
```

## Step 7: Cross-Compile to Linux

```sh
zero build --emit exe --target linux-musl-x64 src/main.0 --out ./mytool-linux
```

Check target readiness:

```sh
zero doctor --json
```

The output shows which targets are available and which toolchains are installed.

## Step 8: Inspect the Binary Size

```sh
zero size --json src/main.0
```

The output includes:
- `sizeBreakdown` — size per section
- `retentionReasons` — why each helper is retained
- `optimizationHints` — suggestions for reducing size

## Step 9: Let an Agent Check Your Code

```sh
zero check --json src/main.0
```

If there are issues, the agent reads the structured diagnostics and applies fixes:

```sh
zero fix --plan --json src/main.0
```

## The Complete Package

Your final `src/main.0`:

```zero
use std.args
use std.fs

fn writeGreeting(name: String) -> Void raises [Io] {
    let output: String = "Hello, " + name + "!\n"
    let written: usize = std.fs.write("output.txt", output)
    if written == 0 {
        raise Io
    }
}

pub fn main(world: World) -> Void raises [Io] {
    let name: Maybe<String> = std.args.get(1)
    if name.has {
        writeGreeting(name.value)
        check world.out.write("Done\n")
    } else {
        check world.out.write("Usage: mytool <name>\n")
    }
}

test "greeting format" {
    let greeting: String = "Hello, " + "Zero" + "!\n"
    expect (greeting == "Hello, Zero!\n")
}
```

## What You Learned

- **Packages**: `zero new` creates a package with `zero.json` and `src/`
- **Arguments**: `std.args.get` returns `Maybe<String>` for safe access
- **File I/O**: `std.fs.write` for hosted file operations
- **Error handling**: `raises`, `check`, and named error sets
- **Testing**: `test` blocks with `expect` assertions
- **Building**: `zero build --emit exe` for native executables
- **Cross-compilation**: `--target linux-musl-x64` for Linux binaries
- **Size inspection**: `zero size` for binary analysis
- **Agent workflow**: `zero check --json` and `zero fix --plan --json`

## Next Steps

- Read [CLI Reference](/docs/cli/commands) for all commands
- Explore [Standard Library](/docs/stdlib/overview) for more modules
- Try [Let Agent Edit Your Code](/docs/tutorials/agent-editing) for the agent workflow
