---
sidebar_position: 1
---

# 用 `zero graph patch` 做语义重构

本指南展示如何使用 `zero graph patch` 进行语义重构：重命名函数、更改字符串字面量、更新类型字段、批量编辑程序。与基于文本的搜索替换不同，图补丁在应用前由编译器检查。

## 前置条件

- 已安装 Zerolang（`zero --version`）
- 一个 `.0` 源文件

## 创建示例程序

创建 `refactor-demo.0`：

```zero
fn greet(name: String) -> Void raises {
    check world.out.write("Hello, " + name + "!\n")
}

pub fn main(world: World) -> Void raises {
    greet("Alice")
    greet("Bob")
}
```

## 读取图

首先，检查图以找到要编辑的节点 ID：

```sh
zero graph dump --json refactor-demo.0
```

输出包含所有节点的 ID、类型和值。找到你想更改的节点 — 例如函数名 `greet` 或字符串字面量 `"Hello, "`。

关键字段：
- `id` — 节点标识符（如 `#decl_abc123`）
- `kind` — 节点类型（`Function`、`Literal`、`Call` 等）
- `name` — 声明的名称
- `value` — 字面值（对于字符串/数字字面量）
- `hash` — 用于 `--expect-graph-hash` 的图哈希

## 重命名函数

将 `greet` 重命名为 `sayHello`：

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'rename node="#YOUR_GREET_DECL_ID" expect="greet" value="sayHello"'
```

`rename` 操作会更新函数声明名称和所有调用点。编译器会检查：
- 节点存在
- 当前名称匹配 `expect`（如果提供）
- 新名称是有效标识符
- 不会引入命名冲突

补丁应用后，源代码被重写：

```zero
fn sayHello(name: String) -> Void raises {
    check world.out.write("Hello, " + name + "!\n")
}

pub fn main(world: World) -> Void raises {
    sayHello("Alice")
    sayHello("Bob")
}
```

## 更改字符串字面量

更改问候格式：

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#YOUR_LITERAL_ID" field="value" expect="Hello, " value="Hi, "'
```

`set` 操作更新单个字段。`expect` 参数可选但推荐 — 如果当前值与你预期的不同，操作会被拒绝。

## 插入新节点

添加新的函数参数或表达式：

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'insert node="#patch001" kind="Literal" parent="#YOUR_CALL_ID" edge="arg" order="2" type="String" value="!\n"'
```

`insert` 操作创建新节点并将其连接到父节点的有序边。这在添加参数、条件或新语句时很有用。

## 删除节点

删除节点及其子树：

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'delete node="#patch001"'
```

`delete` 操作移除拥有的子树。如果其他节点引用了被删除的子树，操作会被拒绝。

## 使用补丁文件进行批量编辑

对于多个编辑，使用补丁文件：

创建 `refactor.patch`：

```text
zero-program-graph-patch v1
expect graphHash "graph:YOUR_HASH"
rename node="#YOUR_GREET_ID" expect="greet" value="sayHello"
set node="#YOUR_LITERAL_ID" field="value" expect="Hello, " value="Hi, "
```

应用：

```sh
zero graph patch refactor-demo.0 --patch-file refactor.patch
```

或内联传递补丁文本：

```sh
zero graph patch refactor-demo.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --patch-text 'zero-program-graph-patch v1
expect graphHash "graph:YOUR_HASH"
rename node="#YOUR_GREET_ID" expect="greet" value="sayHello"'
```

## 安全机制

### 图哈希前置条件

每个补丁都应包含 `--expect-graph-hash`。这防止：
- 编辑 Agent 上次读取后已更改的程序
- 多 Agent 工作流中的竞态条件
- 将补丁应用到文件的错误版本

如果哈希不匹配，补丁会失败并给出清晰错误。

### 字段值前置条件

`set` 和 `rename` 操作中的 `expect` 参数在应用更改前检查当前值。这防止：
- 覆盖已更改的值
- 重命名已重命名的内容
- 应用针对不同状态的补丁

### 类型检查

应用补丁后，编译器重新解析和类型检查源代码。如果补丁引入了类型错误，补丁会被拒绝，源代码保持不变。

## Agent 工作流

典型的 Agent 重构工作流：

```
1. zero graph dump --json file.0
   → 读取 graphHash，找到节点 ID

2. zero graph patch file.0 \
     --expect-graph-hash graph:HASH \
     --op 'rename node="#ID" expect="old" value="new"'
   → 应用编辑

3. zero check --json file.0
   → 验证编辑有效

4. 如果 ok：继续。如果不：读取诊断，修复，重试。
```

## 常见模式

### 重命名变量

```sh
--op 'rename node="#BINDING_ID" expect="oldName" value="newName"'
```

### 更改类型

```sh
--op 'set node="#BINDING_ID" field="type" expect="i32" value="i64"'
```

### 使绑定可变

```sh
--op 'set node="#BINDING_ID" field="mutable" expect="false" value="true"'
```

### 更改函数返回类型

```sh
--op 'set node="#FUNC_ID" field="type" expect="i32" value="i64"'
```

### 切换公开可见性

```sh
--op 'set node="#DECL_ID" field="public" expect="false" value="true"'
```

## 限制

- 图补丁适用于没有注释的规范 `.0` 源代码。如果源代码有注释，它们可能在重写过程中丢失。
- `set` 操作只能更新标量字段（`name`、`type`、`value`、`public`、`mutable`、`static`、`fallible`、`exportC`）。
- 复杂的结构性更改（添加新函数、重排语句）可能需要多个 `insert`/`delete` 操作。
- 布尔字段（`public`、`mutable`、`fallible`）只接受 `true` 或 `false`。

## 延伸阅读

- [ProgramGraph 参考](/docs/reference/program-graph) — 完整的图结构文档
- [CLI 参考](/docs/cli/commands) — 所有 `zero graph` 命令
- [让 Agent 编辑你的代码](/docs/tutorials/agent-editing) — 完整的 Agent 编辑循环
