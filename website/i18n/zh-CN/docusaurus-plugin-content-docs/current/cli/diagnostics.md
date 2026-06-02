---
sidebar_position: 2
---

# 诊断信息

## 结构化诊断

`zero check --json` 输出机器可读的诊断信息，替代纯文本。每个错误包含：

| 字段 | 说明 |
|---|---|
| `code` | 稳定错误码（如 `NAM003`） |
| `message` | 人类可读的消息 |
| `span` | 源码位置 |
| `repair` | 类型化修复元数据 |

## 修复循环

两个 CLI 子命令完成 Agent 修复循环：

### zero explain

返回给定诊断代码的结构化解释。Agent 可以直接查询 `NAM003`——无需抓取文档。

```bash
zero explain NAM003
```

### zero fix --plan --json

输出机器可读的修复计划，精确描述要做什么修改——无需从散文中推断。

```bash
zero fix --plan --json examples/hello.0
```

## 诊断代码

常见诊断类别：

| 前缀 | 类别 |
|---|---|
| `NAM` | 命名 |
| `BOR` | 借用 |
| `TYP` | 类型 |
| `CAP` | Capability |
| `CGEN` | 代码生成 |
