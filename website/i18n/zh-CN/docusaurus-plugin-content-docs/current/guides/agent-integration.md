---
sidebar_position: 1
---

# Agent 集成指南

Zerolang 从第一天起就为 AI Agent 工作流而设计。本指南说明如何配置主流 AI 编程助手，使其高效地与 Zerolang 协作，利用结构化 JSON 输出、类型化修复计划和语义图编辑。

## 概述

大多数 AI 编程助手把源代码当作纯文本来编辑。Zerolang 给了 Agent 更好的方式：结构化诊断、机器可读的修复计划，以及编译器在应用任何变更前都会验证的语义 ProgramGraph。

与 Zerolang 集成的 Agent 可以：

- 读取结构化诊断，而非解析人类可读的错误消息
- 在应用修复前评估修复安全性
- 通过图补丁编辑程序，编译器会在应用前进行类型检查
- 获取版本匹配的语言规则，始终与已安装的编译器保持同步

本指南涵盖 Cursor、Windsurf、Claude Code 的集成方式，以及任何支持自定义系统提示或 CLI 工具的 Agent 的通用集成方法。

## 前置条件

在配置任何集成之前，请确保：

- **已安装 Zerolang** — 运行 `zero doctor --json` 验证
- **有一个 AI 编程助手** — 以下任一：[Cursor](https://cursor.com)、[Windsurf](https://codeium.com/windsurf)、[Claude Code](https://docs.anthropic.com/en/docs/claude-code) 或其他支持 Agent 的工具

```bash
# 安装 Zerolang
curl -fsSL https://zerolang.ai/install.sh | bash

# 验证安装
zero doctor --json
```

## Cursor 集成

### 配置

在 Zerolang 项目根目录创建 `.cursorrules` 文件。该文件告诉 Cursor 如何与 `zero` CLI 交互。

```text
You are working in a Zerolang project. Zerolang is an agent-native systems programming language where source files use the `.0` extension.

## Core Workflow

When writing or fixing Zerolang code, always follow this loop:

1. Write or edit `.0` source files
2. Run `zero check --json <file>` to get structured diagnostics
3. If there are errors, run `zero fix --plan --json <file>` to get a typed repair plan
4. Evaluate the `fixSafety` label before applying any fix:
   - `format-only` or `behavior-preserving` or `local-edit`: apply directly
   - `api-changing`: propose the change to the user
   - `requires-human-review`: do NOT auto-apply; show the plan and ask
5. After applying a fix, run `zero check --json <file>` again to verify
6. Use `zero build --emit exe --target linux-musl-x64 <file> --out ./out` to build

## Key Rules

- Always use `--json` flags for structured output. Never parse plain-text CLI output.
- Stable error codes (e.g., `NAM003`, `TYP002`) are part of the compiler's public contract. You can rely on them.
- For semantic refactoring, use `zero graph dump --json <file>` to read the ProgramGraph, then `zero graph patch` with `--expect-graph-hash` for safe edits.
- Use `zero skills get language` to fetch version-matched language rules. Use `
- Do NOT guess Zerolang syntax. If unsure, run `zero skills get language` first.
```

### 工作流

配置好 `.cursorrules` 后，Cursor 的 Agent 会自动遵循结构化工作流：

1. **编写代码** — Agent 创建或编辑 `.0` 文件，使用 Zerolang 语法
2. **检查** — 运行 `zero check --json`，读取结构化诊断
3. **修复** — 运行 `zero fix --plan --json`，评估 `fixSafety` 标签，应用安全修复
4. **验证** — 重新运行 `zero check --json` 确认修复成功
5. **构建** — 所有检查通过后运行 `zero build`

你可以用自然语言提示 Agent：

```text
"用 zerolang 写一个从 stdin 读取输入并把大写版本输出到 stdout 的函数"
```

Agent 会编写代码、检查、修复诊断、验证，全部使用结构化输出完成。

## Windsurf 集成

### 配置

Windsurf 使用 `.windsurfrules` 文件作为项目级指令。在 Zerolang 项目根目录创建：

```text
You are working in a Zerolang project. Source files use the `.0` extension.

## Zerolang Rules

- Always use `zero check --json <file>` instead of `zero check <file>` to get structured diagnostics.
- Use `zero fix --plan --json <file>` to get typed fix plans. Check the `fixSafety` field:
  - `format-only`, `behavior-preserving`, `local-edit`: safe to auto-apply
  - `api-changing`: propose but do not auto-apply
  - `requires-human-review`: never auto-apply
- For refactoring, use `zero graph dump --json <file>` to read the ProgramGraph, then `zero graph patch` with `--expect-graph-hash` for compiler-verified edits.
- If unsure about Zerolang syntax or semantics, run `zero skills get language` for version-matched rules.
- Always verify fixes by re-running `zero check --json` after edits.
```

### 工作流

Windsurf 的 Cascade Agent 会将 `.windsurfrules` 指令纳入每次交互。工作流同样是结构化循环：

1. 编辑源码 → `zero check --json` → 读取诊断 → `zero fix --plan --json` → 评估安全性 → 应用 → 验证

Windsurf 也支持多文件编辑。跨多个 `.0` 文件重构时，Agent 应该：

```bash
# 读取每个受影响文件的图
zero graph dump --json file1.0
zero graph dump --json file2.0

# 使用哈希验证应用图补丁
zero graph patch file1.0 --expect-graph-hash graph:HASH1 --op '...'
zero graph patch file2.0 --expect-graph-hash graph:HASH2 --op '...'

# 验证所有文件
zero check --json file1.0
zero check --json file2.0
```

## Claude Code 集成

### 配置

Claude Code 通过仓库根目录的 `CLAUDE.md` 文件支持项目级指令。在 Zerolang 项目中创建 `CLAUDE.md`：

```markdown
# Zerolang Project

This is a Zerolang project. Source files use the `.0` extension.

## Working with Zerolang

Zerolang is an agent-native language. All CLI commands support `--json` for structured output.

### Checking code

```bash
zero check --json <file>
```

Returns structured diagnostics with stable error codes, expected/actual fields, and fix safety labels.

### Fixing errors

```bash
zero fix --plan --json <file>
```

Returns a typed repair plan. Always check `fixSafety` before applying:
- `format-only` / `behavior-preserving` / `local-edit` → safe to auto-apply
- `api-changing` → propose to user, do not auto-apply
- `requires-human-review` → show plan, wait for user approval

### Semantic editing

For renaming, retyping, or structural changes:

```bash
zero graph dump --json <file>
zero graph patch <file> --expect-graph-hash graph:HASH --op '...'
```

Graph patches are verified by the compiler before being applied.

### Language reference

```bash
zero skills get language        # version-matched language rules

```

### Building

```bash
zero build --emit exe --target linux-musl-x64 <file> --out ./out
```

## Rules

1. Always use `--json` for structured output
2. Never parse plain-text error output
3. Check `fixSafety` before applying any fix
4. Use `--expect-graph-hash` for all graph patches
5. Verify fixes with `zero check --json` after every edit
6. If unsure about syntax, run `zero skills get language` first
```

### 工作流

Claude Code 会在每次会话开始时读取 `CLAUDE.md`。工作流：

```text
User: "给 main.0 里的文件读取函数加上错误处理"
```

Claude Code 会：
1. 读取 `main.0` 理解当前代码
2. 运行 `zero check --json main.0` 查看当前状态
3. 编辑源码添加错误处理
4. 运行 `zero check --json main.0` 验证
5. 如有错误，运行 `zero fix --plan --json main.0` 并应用安全修复
6. 重新验证直到通过

## 通用 Agent 集成

任何能运行 CLI 命令并读取结构化输出的 Agent 都可以与 Zerolang 集成。本节介绍基础构建模块。

### Agent 用到的 CLI 命令

以下是 Agent 最常用的命令：

#### zero check --json

检查源文件，返回结构化诊断。

```bash
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

#### zero fix --plan --json

为当前诊断生成类型化修复计划。

```bash
zero fix --plan --json hello.0
```

返回包含修复操作的 JSON 对象，每个操作都有 `fixSafety` 标签和变更描述。

#### zero graph dump --json

导出 ProgramGraph 供语义检查。

```bash
zero graph dump --json hello.0
```

```json
{
  "moduleIdentity": "hello",
  "graphHash": "graph:YOUR_HASH",
  "counts": { "nodes": 12, "edges": 8 },
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

#### zero graph patch

应用编译器验证的语义编辑。

```bash
zero graph patch hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello patched\n"'
```

支持的操作：`set`、`insert`、`insertEdge`、`replace`、`delete`、`rename`。

#### zero skills get

获取版本匹配的语言规则和 Agent 指引。

```bash
zero skills list            # 列出可用的 skills
zero skills get language    # 当前编译器版本的语言规则

```

### JSON 输出 Schema

所有接受 `--json` 的 `zero` 命令都产生版本化的结构化输出。各命令的关键字段：

| 命令 | 关键字段 |
|------|---------|
| `zero check --json` | `schemaVersion`、`ok`、`diagnostics[].{code, severity, message, expected, actual, fixSafety, repair}` |
| `zero fix --plan --json` | `plan[].{operation, target, fixSafety, summary}` |
| `zero graph dump --json` | `moduleIdentity`、`graphHash`、`counts`、`nodes[].{id, kind, name, type, value}`、`edges[].{source, target, kind}` |
| `zero graph patch` | `results[].{op, node, field, status}`、`graphHash`、`saved` |
| `zero doctor --json` | `version`、`platform`、`targetToolchains`、逐目标就绪矩阵 |
| `zero size --json` | `graph`、`profileSemantics`、`profileCatalog`、`profileBudget`、`safetyFacts`、`backendProfile`、`backendComparison`、`sizeBreakdown`、`retentionReasons`、`optimizationHints` |

每个响应都包含 `schemaVersion`，Agent 可以据此处理不同编译器版本间的格式变化。

### 安全标签

每个修复都携带一个 `fixSafety` 标签，告诉 Agent 如何处理：

| 标签 | 含义 | Agent 行为 |
|------|------|-----------|
| `format-only` | 仅改变空白或格式 | 直接应用 |
| `behavior-preserving` | 保持程序行为不变 | 直接应用 |
| `local-edit` | 限制在当前局部作用域或文件内 | 直接应用 |
| `api-changing` | 改变函数签名、导出名称、包 API 或调用点 | 向用户提议，不自动应用 |
| `requires-human-review` | 有风险或不确定 | 展示计划，等待批准 |

安全等级从低到高为：`format-only` < `behavior-preserving` < `local-edit` < `api-changing` < `requires-human-review`。Agent 只应自动应用前三个标签的修复。

## 版本匹配的 Skills

传统文档会逐渐过时。Zerolang 通过 `zero skills` 解决这个问题 — 语言规则、诊断参考、构建指南和标准库文档直接与编译器二进制文件捆绑。

```bash
# 列出所有可用的 skills
zero skills list

# 获取语言语法和语义规则
zero skills get language

# 获取完整的 Agent 集成指南


# 获取特定 skill 的详细信息
zero skills get diagnostics
```

**为什么这对 Agent 很重要：** 使用 `zero skills get language` 的 Agent 始终会收到与它调用的编译器版本匹配的规则。不存在 Agent 遵循过时语法或依赖已废弃错误码的风险。

**推荐做法：** 在任何较长的 Agent 会话开始时，运行 `zero skills get language` 将当前规则加载到上下文中。这可以防止 Agent 基于可能过时的训练数据编造 Zerolang 语法。

## 最佳实践

1. **始终使用 `--json` 获取结构化输出。** 永远不要让 Agent 解析纯文本 CLI 输出。JSON 格式是稳定的、带版本的，专为机器消费而设计。

2. **应用修复前检查 `fixSafety`。** 这是最重要的安全机制。`behavior-preserving` 和 `local-edit` 修复可以自主应用。`api-changing` 和 `requires-human-review` 修复需要人工监督。

3. **图补丁使用 `--expect-graph-hash`。** 这可以防止 Agent 编辑自上次读取图以来已发生变化的程序。没有这层保护，Agent 可能覆盖人类或其他 Agent 做出的修改。

4. **优先选择 `behavior-preserving` 和 `local-edit` 修复。** 这些是最安全的类别。它们保持程序行为不变，且限制在当前作用域内。当 Agent 有多种修复策略可选时，应优先选择这些标签。

5. **每次编辑后验证。** 应用任何修复或图补丁后运行 `zero check --json`。这能立即捕获回归，防止错误累积。

6. **会话开始时加载 skills。** 在 Agent 会话开始时运行 `zero skills get language`，确保 Agent 使用当前版本匹配的语言规则。

7. **语义重构使用图补丁。** 对于重命名、改类型或结构性变更，`zero graph patch` 比基于文本的查找替换更安全。编译器会在应用前验证每个补丁。

## 延伸阅读

- [Agent-Native 概念](/zh-CN/docs/concepts/agent-native) — Zerolang Agent 集成背后的设计理念
- [CLI 参考](/zh-CN/docs/cli/commands) — 所有 `zero` 命令及其选项
- [ProgramGraph 参考](/zh-CN/docs/reference/program-graph) — 完整的图结构和补丁操作
- [使用图补丁进行语义重构](/zh-CN/docs/how-to/graph-patch-refactoring) — 图编辑的分步指南
