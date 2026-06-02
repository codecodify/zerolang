---
sidebar_position: 1
---

# CLI 命令参考

Zerolang 的所有工具集成在一个 `zero` 二进制中。

## zero check

检查程序，输出诊断信息。

```bash
zero check examples/hello.0
zero check --json examples/hello.0    # 结构化输出
```

## zero run

构建并运行程序。

```bash
zero run examples/hello.0
zero run examples/add.0 -- --arg1 value    # 传递参数
```

## zero build

构建为可执行文件或其他目标。

```bash
zero build --emit exe --target linux-musl-x64 hello.0 --out ./hello
```

## zero graph

输出 ProgramGraph 结构化信息。

```bash
zero graph --json examples/hello.0
```

## zero size

报告构建产物大小。

```bash
zero size --json examples/point.0
```

## zero skills

获取版本匹配的 Agent 指引。

```bash
zero skills list
zero skills get zero --full
zero skills get language
```

## zero fix

生成修复计划。

```bash
zero fix --plan --json examples/hello.0
```

## zero explain

解释诊断代码。

```bash
zero explain NAM003
```

## zero doctor

检查环境配置。

```bash
zero doctor --json
```
