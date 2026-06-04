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
zero run examples/hello.0
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
zero graph dump hello.0
```

输出结构化的 ProgramGraph 信息，包含节点、边、类型、副作用等语义事实。

## 构建可执行文件

```bash
zero build --emit exe --target linux-musl-x64 hello.0 --out .zero/out/hello
```

## 获取 Agent 指引

```bash
# 列出所有可用 Skill
zero skills list

# 获取语言规则
zero skills get language

# 获取诊断参考
zero skills get diagnostics
```

## 下一步

- 阅读 [语言语法](/zh-CN/docs/language/syntax)
- 查看 [CLI 命令参考](/zh-CN/docs/cli/commands)
