---
sidebar_position: 2
---

# 图优先设计

## 源码是产物。图是工作面。

源码文本对人类和代码审查很友好，但对程序理解来说是弱接口。

Agent 需要：
- 无需阅读整个文件就能聚焦相关上下文
- 知道调用解析到何处
- 避免过时的编辑
- 更改相关结构
- 在写入源码之前获得验证

## 语义导航

Agent 应该能从符号、诊断信息、调用、capability、模块或节点 ID 出发，收集相关的语义切片。

```bash
zero graph dump examples/hello.0
```

示例输出：

```
zero-graph v1
origin source-text
module "hello"
hash "graph:a7f7e6899a73f3b4"

node #decl_ad8d9028 Function name:"main" type:"Void" public:true fallible:true
node #param_4610ae76 Param name:"world" type:"World"
node #expr_c403020c MethodCall name:"write" type:"Void"
node #expr_653eeb6e Literal type:"String" value:"hello from zero\n"
edge #decl_ad8d9028 body #block_29d1811d
edge #expr_c403020c arg #expr_653eeb6e order:0
```

## 精确编辑

图编辑目标指向编译器节点和字段，带有 graph-hash 和预期值检查，而非仅依赖行号范围或源码文本匹配。

```bash
zero graph patch examples/hello.0 \
  --expect-graph-hash graph:a7f7e6899a73f3b4 \
  --op 'set node="#expr_653eeb6e" field="value" expect="hello from zero\n" value="hello graph\n"'
```

## 验证重构

重构可以表示为对已解析程序结构的操作：重命名这个函数节点、替换这个已解析的被调用者、更新这些相关引用。

一个图 patch 可以通过编译器完成验证、降级、写入、格式化、重新解析和检查。
