---
sidebar_position: 1
---

# 让 Agent 编辑你的代码

本教程带你走完完整的 Agent 编辑循环：编写代码、引入 bug、让 Agent 诊断并修复、验证结果。你将体验 Zerolang 的结构化诊断和图优先设计如何让 Agent 辅助开发变得可靠。

**前置条件**：已安装 Zerolang（`zero --version` 正常工作）。不需要 Agent 框架，你可以手动跟随操作。

**时间**：约 20 分钟

## 第一步：写一个有 Bug 的程序

创建文件 `agent-demo.0`：

```zero
pub fn main(world: World) -> Void raises {
    let greeting: String = "hello"
    check world.out.write(message)
}
```

这个程序有一个 bug：`message` 没有声明。应该是 `greeting`。

## 第二步：让编译器诊断

用 JSON 输出运行编译器：

```sh
zero check --json agent-demo.0
```

输出是结构化 JSON：

```json
{
  "schemaVersion": 1,
  "ok": false,
  "diagnostics": [
    {
      "severity": "error",
      "code": "NAM003",
      "message": "unknown identifier 'message'",
      "path": "agent-demo.0",
      "line": 3,
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

> **注意**：以上仅展示诊断相关字段。完整的 `zero check --json` 输出还包含顶层的 `graph`、`compileTime`、`targetReadiness` 和 `safetyFacts` 对象。

Agent 读取这些信息就能知道：
- **什么问题**：标识符 `message` 不存在
- **在哪里**：第 3 行，第 27 列
- **为什么**：从未声明
- **怎么修**：在使用前声明名称
- **安全性**：`behavior-preserving` — 可以安全自动修复

## 第三步：请求修复计划

Agent 向编译器请求类型化修复计划：

```sh
zero fix --plan --json agent-demo.0
```

编译器返回结构化的修复元数据。`fixSafety` 标签告诉 Agent 是否可以自主应用修复：

- `format-only` — 仅改变格式，可以安全应用
- `behavior-preserving` 和 `local-edit` → 可以安全应用
- `api-changing` → 提议变更，但需要确认
- `requires-human-review` → 停下来，询问人类

## 第四步：应用修复

Agent 会以编程方式应用修复。本教程中，手动修复：

```zero
pub fn main(world: World) -> Void raises {
    let greeting: String = "hello"
    check world.out.write(greeting)
}
```

## 第五步：验证修复

```sh
zero check --json agent-demo.0
```

```json
{
  "schemaVersion": 1,
  "ok": true,
  "diagnostics": []
}
```

`ok: true` — 程序干净了。

## 第六步：检查 ProgramGraph

现在通过图来查看程序：

```sh
zero graph dump --json agent-demo.0
```

输出包含节点（声明、表达式、类型）、边（调用、数据流）和元数据。这就是 Agent 看到的：不是原始文本，而是结构化的语义事实。

关键字段：
- `moduleIdentity` — 模块标识
- `graphHash` — 内容哈希，程序语义改变时会变化
- `validation` — 图验证状态
- `counts` — 节点和边的计数
- `nodes` — 程序中的每个声明、表达式和类型
- `edges` — 节点之间的关系（调用、导入、数据流）

## 第七步：直接编辑图

Agent 可以通过图来编辑程序，而不是修补文本：

```sh
zero graph patch agent-demo.0 \
  --expect-graph-hash graph:YOUR_HASH_HERE \
  --op 'set node="#YOUR_NODE_ID" field="value" expect="hello" value="hello from the graph"'
```

`--expect-graph-hash` 标志是安全机制。如果程序在 Agent 上次读取后发生了变化，哈希不匹配，补丁会被拒绝。这防止了多 Agent 工作流中的竞态条件。

## 完整的 Agent 循环

以下是 Agent 遵循的完整循环：

```
┌─────────────────────────────────────────────┐
│  1. 编写或读取代码                           │
│         ↓                                   │
│  2. zero check --json                       │
│         ↓                                   │
│  3. 读取错误码 + expected/actual             │
│         ↓                                   │
│  4. zero fix --plan --json                  │
│         ↓                                   │
│  5. 评估修复安全标签                         │
│         ↓                                   │
│  6. 应用修复（或询问人类）                    │
│         ↓                                   │
│  7. zero check --json → 验证                │
│         ↓                                   │
│  8. zero build → 发布                       │
└─────────────────────────────────────────────┘
```

在每一步，编译器都说结构化数据。Agent 永远不需要解析人类可读的文本。

## 这有什么不同

在传统语言中，Agent 需要：
1. 将源文件作为文本读取
2. 运行编译器并解析 stderr 输出
3. 用正则表达式或启发式方法提取错误信息
4. 猜测什么更改可能修复错误
5. 以文本补丁的方式应用更改
6. 祈祷它能工作

在 Zerolang 中，Agent：
1. 读取源文件
2. 运行 `zero check --json` 获取结构化数据
3. 读取错误码、expected/actual 字段和修复安全性
4. 运行 `zero fix --plan --json` 获取类型化修复计划
5. 如果安全标签允许，应用修复
6. 用 `zero check --json` 验证

没有猜测，没有解析，没有祈祷。

## 延伸阅读

- [ProgramGraph 参考](/docs/reference/program-graph) — 理解图结构
- [如何用 zero graph patch 做语义重构](/docs/how-to/graph-patch-refactoring) — 图编辑实战
- [CLI 参考](/docs/cli/commands) — 所有命令及其 JSON 输出
