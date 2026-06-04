---
sidebar_position: 2
---

# 构建一个 CLI 工具

本教程带你用 Zerolang 构建一个完整的命令行工具。你将创建包、解析参数、读写文件、处理错误，并交叉编译到 Linux。

**前置条件**：已安装 Zerolang（`zero --version` 正常工作）。

**时间**：约 30 分钟

## 第一步：创建包

```sh
zero new cli mytool
cd mytool
```

创建如下结构：

```
mytool/
├── zero.json
└── src/
    └── main.0
```

`zero.json` 清单：

```json
{
  "package": { "name": "mytool", "version": "0.1.0" },
  "targets": { "cli": { "kind": "exe", "main": "src/main.0" } }
}
```

## 第二步：读取命令行参数

编辑 `src/main.0`：

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

`std.args.get` 返回 `Maybe<String>`，因为参数可能不存在。使用 `.has` 检查是否存在，`.value` 访问值。

运行：

```sh
zero run src/main.0 -- Alice
```

输出：`Hello, Alice!`

不带参数：

```sh
zero run src/main.0
```

输出：`Usage: mytool <name>`

## 第三步：写入文件

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

`std.fs.write` 是宿主 API — 在宿主目标上工作，但在非宿主目标上报告 `TAR002`。

## 第四步：显式处理错误

Zero 的错误处理使用 `raises` 和 `check`。可能失败的函数声明 `raises`：

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

`raises [Io]` 声明告诉编译器（以及任何阅读代码的 Agent）这个函数能产生哪些错误。

## 第五步：添加测试

在 `src/main.0` 中添加测试块：

```zero
test "greeting format" {
    let greeting: String = "Hello, " + "Zero" + "!\n"
    expect (greeting == "Hello, Zero!\n")
}
```

运行测试：

```sh
zero test src/main.0
```

## 第六步：构建可执行文件

```sh
zero build --emit exe --target host src/main.0 --out ./mytool
```

这会生成原生可执行文件。运行：

```sh
./mytool Alice
```

## 第七步：交叉编译到 Linux

```sh
zero build --emit exe --target linux-musl-x64 src/main.0 --out ./mytool-linux
```

检查目标就绪性：

```sh
zero doctor --json
```

输出显示哪些目标可用、哪些工具链已安装。

## 第八步：检查二进制大小

```sh
zero size --json src/main.0
```

输出包含：
- `sizeBreakdown` — 每个段的大小
- `retentionReasons` — 为什么保留每个辅助工具
- `optimizationHints` — 减小大小的建议

## 第九步：让 Agent 检查代码

```sh
zero check --json src/main.0
```

如果有问题，Agent 读取结构化诊断并应用修复：

```sh
zero fix --plan --json src/main.0
```

## 完整的包

最终的 `src/main.0`：

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

## 你学到了什么

- **包**：`zero new` 创建带 `zero.json` 和 `src/` 的包
- **参数**：`std.args.get` 返回 `Maybe<String>` 以安全访问
- **文件 I/O**：`std.fs.write` 用于宿主文件操作
- **错误处理**：`raises`、`check` 和命名错误集
- **测试**：带 `expect` 断言的 `test` 块
- **构建**：`zero build --emit exe` 生成原生可执行文件
- **交叉编译**：`--target linux-musl-x64` 生成 Linux 二进制文件
- **大小检查**：`zero size` 用于二进制分析
- **Agent 工作流**：`zero check --json` 和 `zero fix --plan --json`

## 延伸阅读

- [CLI 参考](/docs/cli/commands) — 所有命令
- [标准库](/docs/stdlib/overview) — 更多模块
- [让 Agent 编辑你的代码](/docs/tutorials/agent-editing) — Agent 工作流
