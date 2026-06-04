---
sidebar_position: 1
---

# Installation

## Requirements

- macOS or Linux
- 8GB+ RAM (recommended)

## One-Line Install

Run the official installer:

```bash
curl -fsSL https://zerolang.ai/install.sh | bash
```

The installer will:
1. Detect your platform
2. Download the matching compiler binary from GitHub Releases
3. Verify file integrity
4. Install to `$HOME/.zero/bin/zero`

## Add to PATH

After installation, add Zero to your PATH:

```bash
export PATH="$HOME/.zero/bin:$PATH"
```

To make this permanent, add the line to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.).

## Custom Install Directory

Set `ZERO_INSTALL_DIR` before running the installer to install to a custom location:

```bash
export ZERO_INSTALL_DIR=/opt/zero
curl -fsSL https://zerolang.ai/install.sh | bash
```

## Linux glibc Support

On Linux distributions using glibc (most common), set:

```bash
export ZERO_LINUX_FLAVOR=gnu
```

## Manual Install

1. Download the binary for your platform from [GitHub Releases](https://github.com/vercel-labs/zerolang/releases)
2. Extract and place `zero` in a directory on your PATH
3. Run `zero --version` to verify

## Build from Source

```bash
git clone https://github.com/vercel-labs/zerolang.git
cd zerolang
pnpm install
make
```

## Verify Installation

```bash
# Check version
zero --version

# Check environment readiness
zero doctor --json
```

`zero --version` should show the compiler version.

`zero doctor --json` outputs JSON containing platform info, target toolchains, and environment checks.

## VS Code Extension

A VS Code extension for `.0` file syntax highlighting is included in the repository:

```bash
cd extensions/vscode/
# Follow VS Code extension development workflow to install
```
