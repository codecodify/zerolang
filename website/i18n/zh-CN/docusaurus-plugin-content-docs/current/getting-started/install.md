---
sidebar_position: 1
---

# 安装

## 系统要求

- macOS 或 Linux
- 8GB 以上内存（推荐）

## 一键安装

运行官方安装脚本：

```bash
curl -fsSL https://zerolang.ai/install.sh | bash
```

安装器会：
1. 检测平台
2. 从 GitHub Releases 下载匹配的编译器二进制文件
3. 校验文件完整性
4. 安装到 `$HOME/.zero/bin/zero`

## 手动安装

1. 从 [GitHub Releases](https://github.com/vercel-labs/zerolang/releases) 下载对应平台的二进制文件
2. 解压并将 `zero` 放到 PATH 中的某个目录
3. 运行 `zero doctor --json` 验证安装

## 验证安装

```bash
zero doctor --json
```

应输出包含编译器版本、平台信息、环境检查的 JSON 结果。

## VS Code 插件

仓库中包含 VS Code 扩展：

```bash
cd extensions/vscode/
# 按 VS Code 扩展开发流程安装
```

提供 `.0` 文件的语法高亮支持。
