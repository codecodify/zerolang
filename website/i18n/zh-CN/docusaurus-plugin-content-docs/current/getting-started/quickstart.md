---
sidebar_position: 2
---

# 快速入门

## 第一个程序

创建 `hello.0`：

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello from zero\n")
}
```

运行：

```bash
zero run hello.0
```

输出：

```
hello from zero
```

## 检查程序

```bash
zero check hello.0
```

## 查看程序图

```bash
zero graph --json hello.0
```

输出结构化的 ProgramGraph 信息，包含节点、边、类型、副作用等语义事实。

## 构建可执行文件

```bash
zero build --emit exe --target linux-musl-x64 hello.0 --out ./hello
```

## 获取 Agent 指引

```bash
# 列出所有可用 Skill
zero skills list

# 获取完整语言指南
zero skills get zero --full
```

## 下一步

- 阅读 [语言语法](../language/syntax)
- 查看 [CLI 命令参考](../cli/commands)
