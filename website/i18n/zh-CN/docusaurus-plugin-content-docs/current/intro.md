---
sidebar_position: 1
slug: /intro
---

# 简介

**Zerolang** 是 Vercel Labs 推出的实验性系统编程语言，专为 **AI Agent** 工作流设计。

## 核心理念

传统编程语言为人类工程师设计——错误信息需要人类阅读、理解和修复。Zerolang 从第一天起就将 **Agent 视为主要用户**：

- 编译器输出**结构化 JSON 诊断信息**，而非纯文本错误
- 每个错误携带**稳定错误码**（如 `NAM003`）和**类型化修复元数据**
- Agent 可直接调用 `zero fix --plan --json` 获取机器可读的修复计划

## 设计约束

Zerolang 在追求 Agent 友好的同时，保持系统语言的严格约束：

- Token 效率
- 低内存占用
- 快速启动
- 快速构建
- 低运行时延迟
- **零依赖**

## 关键特性

### 图优先（Graph-First）

Agent 可以检查编译后的 **ProgramGraph** 语义事实，提交图编辑而非仅修改源码文本范围。

### 显式副作用

函数签名中明确声明外部世界访问（capability-based I/O），没有隐藏的全局对象、没有隐式异步、没有魔法全局变量。

### 原生编译

编译为原生可执行文件，目标 **sub-10 KiB** 二进制。

### 版本匹配的 Agent 指引

编译器内置 `zero skills` 命令，提供与当前二进制版本匹配的语言规则、诊断说明、构建指南等——Agent 无需抓取可能过时的外部文档。

## 快速开始

```bash
# 安装编译器
curl -fsSL https://zerolang.ai/install.sh | bash

# 检查环境
zero doctor --json

# 运行示例
zero run examples/hello.0
```

## 状态说明

> Zerolang 目前处于 **pre-1.0 实验阶段**，语法和 API 不稳定。项目会主动引入破坏性变更以探索最适合 Agent 的设计模式。
>
> 请把当前的语法和 API 视为探索对象，而非需要记忆的知识。

## 参与进来

- 运行示例，检查结构化输出
- 反馈什么能帮助 Agent 更好地工作
- 在 [GitHub](https://github.com/vercel-labs/zerolang) 提交 issue 和 PR
