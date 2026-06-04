---
sidebar_position: 2
---

# 诊断信息

## 结构化诊断

`zero check --json` 输出机器可读的诊断信息，替代纯文本。

### JSON 输出字段

| 字段 | 说明 |
|---|---|
| `schemaVersion` | Schema 版本，用于前向兼容 |
| `ok` | 编译成功为 `true`，否则为 `false` |
| `diagnostics[]` | 诊断对象数组 |

数组中每个诊断对象包含：

| 字段 | 说明 |
|---|---|
| `severity` | `error` 或 `warning` |
| `code` | 稳定错误码（如 `NAM003`） |
| `message` | 人类可读的消息 |
| `path` | 源文件路径 |
| `line` | 行号（从 1 开始） |
| `column` | 列号（从 1 开始） |
| `length` | 跨度长度（字节） |
| `expected` | 期望的构造或类型 |
| `actual` | 实际的构造或类型 |
| `help` | 建议的修复方式或说明 |
| `fixSafety` | 可用修复的安全标签 |
| `repair` | 修复元数据，包含 `id` 和 `summary` |
| `related` | 相关诊断 |

## 修复循环

两个 CLI 子命令完成 Agent 修复循环：

### zero explain

返回给定诊断代码的结构化解释。Agent 可以直接查询 `NAM003`——无需抓取文档。

```bash
zero explain NAM003
```

输出机器可读格式：

```bash
zero explain --json NAM003
```

### zero fix --plan --json

输出机器可读的修复计划，精确描述要做什么修改——无需从散文中推断。

```bash
zero fix --plan --json examples/hello.0
```

## Fix Safety Labels

| 标签 | 含义 | Agent 行为 |
|---|---|---|
| `format-only` | 仅修改格式 | 直接应用 |
| `behavior-preserving` | 保持程序行为不变 | 直接应用 |
| `local-edit` | 限于当前局部作用域或文件 | 直接应用 |
| `api-changing` | 修改函数签名、导出名称、包 API 或调用点 | 提交给用户；不自动应用 |
| `requires-human-review` | 有风险或存在歧义 | 停下来询问人类 |

## 诊断代码前缀

| 前缀 | 类别 | 示例 |
|---|---|---|
| `PAR` | 解析器 | `PAR100` |
| `NAM` | 命名 | `NAM003`、`NAM004` |
| `IMP` | 导入 | `IMP001`–`IMP003` |
| `PKG` | 包 | `PKG001`–`PKG004` |
| `BLD` | 构建 | `BLD002` |
| `ERR` | 错误流 | `ERR002`、`ERR003` |
| `ABI` | ABI | `ABI001` |
| `CIMP` | C 导入 | `CIMP003`–`CIMP005` |
| `BOR` | 借用 | `BOR001`、`BOR002` |
| `OWN` | 所有权 | `OWN001` |
| `TYP` | 类型 | `TYP002`、`TYP010`–`TYP027` |
| `PUB` | 发布 | `PUB001` |
| `MET` | 元数据 | `MET001` |
| `IFC` | 接口 | `IFC001`–`IFC005` |
| `STC` | 静态值 | `STC001`–`STC003` |
| `SHM` | 共享访问 | `SHM001`、`SHM002` |
| `RCV` | 接收者 | `RCV001`、`RCV002` |
| `FLD` | 字段 | `FLD001`、`FLD002` |
| `MEM` | 内存 | `MEM001`、`MEM002` |
| `TAR` | 目标 / 能力 | `TAR001`、`TAR002` |
| `MAT` | 匹配分支 | `MAT004` |

## 命令速查

| 命令 | 用途 |
|---|---|
| `zero check --json <input>` | 检查错误，机器可读输出 |
| `zero fix --plan --json <input>` | 生成修复计划 |
| `zero explain <code>` | 人类可读的解释 |
| `zero explain --json <code>` | 机器可读的解释 |
