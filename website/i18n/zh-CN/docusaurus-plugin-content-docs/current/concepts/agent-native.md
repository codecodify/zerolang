---
sidebar_position: 1
---

# Agent-Native 是什么意思？

传统编程语言为人类工程师设计。人类阅读错误信息、理解警告、手动追踪调用栈来修复 bug。AI Agent 这些都做不好。

Zerolang 是 **Agent-Native** 的：从第一天起就把 AI Agent 视为主要用户。这不是事后添加的功能，而是融入了编译器、标准库和工具链的每一个层面。

## 传统语言的问题

传统编译器报告错误时，看起来像这样：

```
error[E0425]: cannot find value `message` in this scope
 --> src/main.rs:2:27
  |
2 |     println!("{}", message);
  |                    ^^^^^^^ not found in this scope
```

人类读了能理解：「我忘了声明 `message`。」但 Agent 看到的是非结构化文本。它必须猜测格式、推断错误类别，并祈祷消息在不同版本间保持稳定。

传统语言还依赖隐式行为：隐藏的全局变量、隐式异步、魔法导入、垃圾回收。这些对持有运行时心智模型的人类很方便，但对需要显式、可验证事实的 Agent 来说令人困惑。

## Zerolang 如何实现 Agent-Native

Zerolang 通过五个核心设计决策解决这些问题：

### 1. 结构化 JSON 诊断

编译器的每个诊断信息都可以通过 JSON 获取：

```sh
zero check --json hello.0
```

```json
{
  "schemaVersion": 1,
  "ok": false,
  "diagnostics": [
    {
      "severity": "error",
      "code": "NAM003",
      "message": "unknown identifier 'message'",
      "path": "hello.0",
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

每个诊断包含：
- **稳定错误码**（如 `NAM003`），跨版本不变
- **expected vs actual** 字段，精确描述不匹配
- **修复安全标签**，告诉 Agent 是否可以自动应用修复
- **修复元数据**，包含机器可读的修复计划

Agent 不需要解析人类可读的文本，直接读取结构化数据即可决策。

### 2. 稳定错误码

每个编译器诊断都映射到一个稳定错误码：

| 前缀 | 类别 | 示例 |
|------|------|------|
| `PAR` | 解析器 | `PAR100` — 语法错误 |
| `NAM` | 名称 | `NAM003` — 未知标识符 |
| `TYP` | 类型 | `TYP002` — 类型不匹配 |
| `BOR` | 借用 | `BOR001` — 借用冲突 |
| `OWN` | 所有权 | `OWN001` — 移动后使用 |
| `ERR` | 错误流 | `ERR003` — 未检查的可失败调用 |
| `TAR` | 目标 | `TAR002` — 缺少能力 |

这些错误码是编译器的公共契约。Agent 可以学习到 `NAM003` 总是意味着「在使用前声明名称」，并围绕这个知识构建可靠的自动化。

### 3. 类型化修复计划

当 Agent 遇到错误时，可以向编译器请求修复计划：

```sh
zero fix --plan --json hello.0
```

编译器返回带修复安全标签的结构化修复元数据：

- `format-only` — 仅改变格式
- `behavior-preserving` — 保持程序行为不变
- `local-edit` — 限制在当前作用域或文件内
- `api-changing` — 改变函数签名或导出名称
- `requires-human-review` — 有风险或不确定；展示计划但不自动应用

Agent 可以安全地自主应用 `behavior-preserving` 和 `local-edit` 修复。对于 `api-changing` 修复，可以提议变更。对于 `requires-human-review`，则停下来询问人类。

### 4. 图优先编程

传统语言将源代码作为文本暴露。Agent 编辑文本范围，然后祈祷结果在语义上正确。

Zerolang 暴露 **ProgramGraph** — 程序语义的结构化表示：

```sh
zero graph dump --json hello.0
```

ProgramGraph 包含节点（声明、表达式、类型）、边（调用、导入、数据流）和元数据（副作用、所有权、能力）。Agent 可以检查图、理解程序结构，然后提交**图编辑**而非原始文本补丁：

```sh
zero graph patch hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello patched\n"'
```

图编辑在应用前由编译器检查。Agent 无法在编译器不捕获的情况下引入语法错误或破坏语义约束。

### 5. 版本匹配的 Skills

传统文档存在于网站、README 和 wiki 中，会逐渐过时。阅读过时文档的 Agent 会生成错误代码。

Zerolang 内置 `zero skills` — 与编译器二进制文件捆绑的语言规则、诊断说明、构建指南和标准库文档：

```sh
zero skills get language
zero skills get diagnostics
zero skills get stdlib
```

Skills 始终与已安装的编译器版本同步。使用 `zero skills get language` 的 Agent 总是能获得与它调用的二进制文件匹配的正确规则。

## 实际工作流程

Zerolang 的典型 Agent 工作流如下：

```
1. Agent 编写代码
2. zero check --json → 结构化诊断
3. Agent 读取错误码、expected/actual 字段
4. zero fix --plan --json → 类型化修复计划
5. Agent 评估修复安全标签
6. Agent 应用修复（或请求人类帮助）
7. zero check --json → 验证修复
8. zero build → 发布
```

在每一步，编译器都用 Agent 的语言说话：结构化、稳定、机器可读的数据。Agent 永远不需要猜测。

## Agent-Native 不是什么

Agent-Native 不意味着：
- **只给 Agent 用。** 人类可以阅读纯文本诊断、交互式使用 CLI、手写代码。结构化输出是补充，不是替代。
- **魔法包装器。** Zerolang 是真正的系统语言，有类型、所有权、副作用和原生编译。Agent 友好的表面建立在坚实的语言基础之上。
- **已完成。** Zerolang 是实验性的，语法和 API 不稳定。但设计方向 — 结构化、显式、可验证 — 是有意为之且一致的。

## 延伸阅读

- [图优先编程](/docs/language/graph-first) — ProgramGraph 如何工作
- [诊断参考](/docs/cli/diagnostics) — 完整错误码列表
- [CLI 参考](/docs/cli/commands) — 所有 `zero` 命令及其 JSON 输出
