---
sidebar_position: 1
---

# ProgramGraph 参考

ProgramGraph 是 Zerolang 对程序语义的结构化表示。它是 Agent-Native 设计的基础：Agent 通过图来检查、推理和编辑程序，而非原始源文本。

## 什么是 ProgramGraph？

ProgramGraph 是一个有向图，描述了 Zero 程序的声明、表达式、类型及其关系。每个 `.0` 源文件都会编译成一个 ProgramGraph。

```sh
zero graph dump --json hello.0
```

输出包含：

```json
{
  "moduleIdentity": "hello",
  "graphHash": "graph:a7f7e6899a73f3b4",
  "counts": { "nodes": 12, "edges": 8 },
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

| 字段 | 说明 |
|------|------|
| `moduleIdentity` | 从源代码派生的模块名 |
| `graphHash` | 语义变化时改变的内容哈希 |
| `counts` | 节点和边的数量 |
| `nodes` | 所有声明、表达式和类型 |
| `edges` | 节点之间的关系 |

## 图哈希

`graphHash` 是程序语义结构的确定性内容哈希。它在以下情况改变：
- 声明被添加或删除
- 类型发生变化
- 表达式的值改变
- 函数签名改变

它**不会**在以下情况改变：
- 空格或注释被修改
- 文件被重新格式化但语义未变

图哈希在 `zero graph patch` 中用作安全机制。Agent 传递 `--expect-graph-hash` 来确保程序在它上次读取图后没有变化。如果哈希不匹配，补丁会被拒绝。

## 节点

每个节点代表程序中的一个语义元素。节点有以下字段：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识符（如 `#expr_653eeb6e`） |
| `kind` | 节点类型：`Function`、`Type`、`Binding`、`Literal`、`Call`、`If`、`While`、`Match` 等 |
| `name` | 声明的名称（如适用） |
| `type` | 解析后的类型 |
| `value` | 字面值（对于字面量） |
| `public` | 是否导出 |
| `mutable` | 是否可变（`var` vs `let`） |
| `fallible` | 表达式是否可能失败 |
| `hash` | 此节点的内容哈希 |

### 常见节点类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `Function` | 函数声明 | `fn answer() -> i32` |
| `Type` | 类型声明 | `type Point { x: i32, y: i32 }` |
| `Binding` | `let` 或 `var` 绑定 | `let x: i32 = 42` |
| `Literal` | 字面值 | `42`、`"hello"`、`true` |
| `Call` | 函数调用 | `world.out.write("hi")` |
| `If` | if/else 分支 | `if x > 0 { ... }` |
| `While` | while 循环 | `while keepGoing { ... }` |
| `Match` | match 表达式 | `match result { ... }` |
| `Choice` | choice 类型 | `choice Result { ok: i32, err: String }` |
| `Enum` | enum 类型 | `enum Status { ready, failed }` |

## 边

边描述节点之间的关系：

| 边类型 | 说明 | 示例 |
|--------|------|------|
| `call` | 函数调用关系 | `main` 调用 `world.out.write` |
| `import` | 模块导入 | `use std.codec` |
| `type` | 类型注解 | `let x: i32` → `i32` |
| `arg` | 函数参数 | `write("hello")` → `"hello"` |
| `field` | 字段访问 | `point.x` → `x` |
| `body` | 函数体 | `fn main` → 体块 |
| `init` | 绑定初始化 | `let x = 42` → `42` |
| `condition` | 分支条件 | `if x > 0` → `x > 0` |
| `then` / `else` | 分支臂 | `if` → then 块 / else 块 |

## ProgramGraph 命令

### dump

导出源文件的图：

```sh
zero graph dump --json hello.0
zero graph dump --out hello.program-graph hello.0
```

### import

将源代码导入为 ProgramGraph 产物：

```sh
zero graph import --json hello.0
zero graph import --out hello.program-graph hello.0
```

### validate

检查 ProgramGraph 产物是否格式正确：

```sh
zero graph validate .zero/out/hello.program-graph
```

### view

从图渲染规范源文本：

```sh
zero graph view examples/hello.0
zero graph view --out hello.view.0 hello.program-graph
```

### inspect

检查模块、符号、能力和辅助工具使用：

```sh
zero graph inspect --json hello.0
```

### source-map

将图节点 ID 映射到源代码范围：

```sh
zero graph source-map --json hello.0
```

### reconcile

将编辑后的源代码与先前的图进行比较：

```sh
zero graph reconcile --json hello.program-graph --source hello.0
```

### check

通过直接图降级进行类型检查：

```sh
zero graph check --json hello.0
zero graph check --json hello.program-graph
```

### size

ProgramGraph 产物的大小分析：

```sh
zero graph size --json hello.program-graph
```

### build

从 ProgramGraph 产物构建：

```sh
zero graph build --json --emit obj --target linux-musl-x64 --out hello.o hello.program-graph
```

### patch

对图应用检查过的编辑：

```sh
zero graph patch hello.0 \
  --expect-graph-hash graph:a7f7e6899a73f3b4 \
  --op 'set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello patched\n"'
```

### roundtrip

通过导入/导出验证图稳定性：

```sh
zero graph roundtrip examples/hello.0
zero graph roundtrip .zero/out/hello.program-graph
```

## 图补丁操作

`zero graph patch` 支持六种操作：

### set

更新现有节点的标量字段：

```
set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello patched\n"
```

可编辑字段：`name`、`type`、`value`、`public`、`mutable`、`static`、`fallible`、`exportC`。

### insert

创建新节点并连接到父节点：

```
insert node="#patch001" kind="Literal" parent="#expr_c403020c" edge="arg" order="1" type="String" value="again\n"
```

### insertEdge

跨域连接现有事实：

```
insertEdge source="#node_abc" target="#type_xyz" kind="type"
```

### replace

就地更新节点，可选哈希前置条件：

```
replace node="#expr_653eeb6e" expect="abc123" ...
```

### delete

移除拥有的子树（拒绝外部引用）：

```
delete node="#patch001"
```

### rename

更新节点名称，可选当前名称前置条件：

```
rename node="#decl_ad8d9028" expect="main" value="start"
```

## 补丁文件格式

对于较大的编辑，使用补丁文件：

```text
zero-program-graph-patch v1
expect graphHash "graph:a7f7e6899a73f3b4"
set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello patched\n"
insert node="#patch001" kind="Literal" parent="#expr_c403020c" edge="arg" order="1" type="String" value="again\n"
rename node="#decl_ad8d9028" expect="main" value="start"
delete node="#patch001"
```

头部是必需的。`expect graphHash` 是可选的但推荐使用。

## 源代码与图的关系

ProgramGraph 从源代码派生。关系如下：

```
源代码 (.0) → 编译器 → ProgramGraph → 图哈希
                  ↓
              源码映射 (节点 ID → 行:列)
```

Agent 可以：
1. 读取源代码 → 编译 → 获取图
2. 检查图节点和边
3. 通过 `zero graph patch` 提交图编辑
4. 编译器应用编辑、重写源代码、验证图哈希

这种双向流意味着 Agent 使用语义事实而非文本来工作。

## JSON 输出

所有 `zero graph` 命令都接受 `--json` 获取结构化输出。关键字段：

| 命令 | JSON 字段 |
|------|-----------|
| `dump` | `moduleIdentity`、`graphHash`、`counts`、`nodes`、`edges` |
| `import` | `moduleIdentity`、`graphHash`、`saved.path` |
| `validate` | `moduleIdentity`、`graphHash`、`counts`、`validation` |
| `view` | `moduleIdentity`、`graphHash`、`source` |
| `source-map` | 节点 ID → 源范围、节点哈希、符号/类型/效果 ID、文件哈希事实 |
| `reconcile` | 身份决策、模糊匹配诊断、简单图补丁文本 |
| `check` | `moduleIdentity`、`graphHash`、`check.lowering: "direct-program-graph"`、目标就绪性、安全事实、图映射诊断 |
| `size` | `graph` 身份、`profileSemantics`、`profileCatalog`、`profileBudget`、`safetyFacts`、`backendProfile`、`backendComparison`、大小分解、`retentionReasons`、`optimizationHints` |
| `build` | `graph` 身份、选定 `emit` 类型、目标、产物路径/大小、安全事实、编译器缓存事实、增量失效 |
| `patch` | 每操作结果、更改的图哈希、保存源代码/产物路径 |
| `roundtrip` | `semanticStable`、降级模式、原始/往返图哈希、原始计数、规范化语义计数、可选 ProgramGraph 输出 |

## 延伸阅读

- [Agent-Native 概念](/docs/concepts/agent-native) — 为什么存在 ProgramGraph
- [图优先编程](/docs/language/graph-first) — 设计理念
- [CLI 参考](/docs/cli/commands) — 所有命令及其 JSON 输出
