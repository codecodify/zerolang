---
sidebar_position: 1
---

# CLI 命令参考

Zerolang 的所有工具集成在一个 `zero` 二进制中。

## 输入形式

| 形式 | 说明 |
|---|---|
| `file.0` | 单个源文件 |
| `project/` | 包含 `zero.json` 的目录 |
| `zero.json` | 显式清单路径 |

## 核心命令

### zero check

检查程序，输出诊断信息。

```bash
zero check examples/hello.0
zero check --json examples/hello.0              # 结构化输出
zero check --json --target linux-musl-x64 hello.0
zero check --json --emit exe hello.0
zero check --json --backend llvm hello.0
```

### zero run

构建并运行程序。

```bash
zero run examples/hello.0
zero run examples/add.0 -- input.txt            # 传递参数
zero run --backend llvm --target linux-musl-x64 hello.0
zero run --profile release hello.0
zero run --out .zero/out/hello hello.0
```

### zero build

构建为可执行文件或其他目标。

```bash
zero build --emit exe --target linux-musl-x64 examples/add.0 --out .zero/out/add
zero build --backend llvm --profile release hello.0
zero build --emit wasm hello.0
```

### zero test

运行内联测试块。

```bash
zero test examples/hello.0
zero test --json examples/hello.0
zero test --filter "add" examples/hello.0
zero test --target linux-musl-x64 hello.0
```

### zero fmt

格式化源文件。

```bash
zero fmt examples/hello.0
zero fmt --check examples/hello.0               # CI 模式
```

### zero fix

生成修复计划。

```bash
zero fix --plan --json examples/hello.0
zero fix --plan --json --target linux-musl-x64 hello.0
```

## Graph 命令

### zero graph dump

以文本或 JSON 格式转储 ProgramGraph。

```bash
zero graph dump examples/hello.0                # 文本格式
zero graph dump --json examples/hello.0         # JSON 格式
```

### zero graph import

导入 ProgramGraph。

```bash
zero graph import examples/hello.program-graph
```

### zero graph inspect

检查源文件的结构。

```bash
zero graph inspect examples/hello.0
zero graph inspect --json examples/hello.0
```

### zero graph validate

验证 ProgramGraph。

```bash
zero graph validate .zero/out/hello.program-graph
```

### zero graph view

查看 ProgramGraph 产物。

```bash
zero graph view examples/hello.0
zero graph view --out .zero/out/hello.view.0 .zero/out/hello.program-graph
```

### zero graph source-map

从 ProgramGraph 生成源码映射。

```bash
zero graph source-map examples/hello.0
```

### zero graph reconcile

将图与源码对账。

```bash
zero graph reconcile examples/hello.0
```

### zero graph check

检查源文件或 ProgramGraph。

```bash
zero graph check examples/hello.0
zero graph check .zero/out/hello.program-graph
```

### zero graph size

报告 ProgramGraph 的大小信息。

```bash
zero graph size examples/point.0
zero graph size --json examples/point.0
```

### zero graph build

从 ProgramGraph 构建。

```bash
zero graph build .zero/out/hello.program-graph
```

### zero graph run

运行 ProgramGraph。

```bash
zero graph run .zero/out/hello.program-graph
```

### zero graph test

测试 ProgramGraph。

```bash
zero graph test --json .zero/out/hello.program-graph
```

### zero graph patch

对 ProgramGraph 应用补丁。

```bash
zero graph patch examples/hello.0 \
  --expect-graph-hash graph:YOUR_HASH \
  --op 'set node="#610c78bf" field="value" expect="hello from zero\n" value="hello graph\n"'
```

当工具在内存中有完整的补丁文档时，可使用 `--patch-text <text>`。

### zero graph roundtrip

通过编译器往返转换。

```bash
zero graph roundtrip examples/hello.0
```

## 开发命令

### zero dev

开发监视模式。

```bash
zero dev
zero dev --json
zero dev --trace
```

### zero doc

生成公共 API 文档。

```bash
zero doc examples/hello.0
```

### zero ship

生成带有校验和与元数据的发布预览。

```bash
zero ship examples/hello.0
```

### zero size

报告构建产物大小及详细分解。

```bash
zero size --json examples/point.0
```

### zero time

报告各编译阶段的耗时。

```bash
zero time --json
```

### zero mem

报告内存使用情况。

```bash
zero mem --json
```

### zero doctor

检查宿主和目标环境就绪情况。

```bash
zero doctor --json
```

### zero targets

列出支持的编译目标。

```bash
zero targets
```

### zero clean

清理构建产物。

```bash
zero clean
zero clean --all
```

### zero new

从模板创建新项目。

```bash
zero new cli mytool
zero new lib mylib
zero new package mypkg
```

## 分析命令

### zero tokens

对源文件进行词法分析。

```bash
zero tokens --json examples/hello.0
```

### zero parse

解析源文件。

```bash
zero parse --json examples/hello.0
```

### zero abi

检查或转储 ABI 信息。

```bash
zero abi check --json examples/hello.0
zero abi dump --json examples/hello.0
```

## Skills 命令

### zero skills

获取版本匹配的 Agent 指引。

```bash
zero skills list
zero skills get language
zero skills get diagnostics
zero skills get stdlib
```

## 工具命令

### zero explain

解释诊断代码。

```bash
zero explain NAM003
zero explain --json NAM003
```

### zero --version

显示版本信息。

```bash
zero --version
zero --version --json
```
