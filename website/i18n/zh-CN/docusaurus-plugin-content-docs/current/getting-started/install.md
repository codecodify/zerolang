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

## 添加到 PATH

安装完成后，将 Zero 添加到 PATH：

```bash
export PATH="$HOME/.zero/bin:$PATH"
```

要使其永久生效，将这行添加到你的 shell 配置文件（`~/.bashrc`、`~/.zshrc` 等）。

## 自定义安装目录

在运行安装脚本前设置 `ZERO_INSTALL_DIR` 可以安装到自定义位置：

```bash
export ZERO_INSTALL_DIR=/opt/zero
curl -fsSL https://zerolang.ai/install.sh | bash
```

## Linux glibc 支持

在使用 glibc 的 Linux 发行版上（最常见），设置：

```bash
export ZERO_LINUX_FLAVOR=gnu
```

## 手动安装

1. 从 [GitHub Releases](https://github.com/vercel-labs/zerolang/releases) 下载对应平台的二进制文件
2. 解压并将 `zero` 放到 PATH 中的某个目录
3. 运行 `zero --version` 验证安装

## 从源码构建

```bash
git clone https://github.com/vercel-labs/zerolang.git
cd zerolang
pnpm install
make
```

## 验证安装

```bash
# 检查版本
zero --version

# 检查环境就绪状态
zero doctor --json
```

`zero --version` 应显示编译器版本。

`zero doctor --json` 输出包含平台信息、目标工具链和环境检查的 JSON 结果。

## VS Code 插件

仓库中包含 VS Code 扩展，提供 `.0` 文件的语法高亮支持：

```bash
cd extensions/vscode/
# 按 VS Code 扩展开发流程安装
```
