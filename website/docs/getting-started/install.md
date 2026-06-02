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

## Manual Install

1. Download the binary for your platform from [GitHub Releases](https://github.com/vercel-labs/zerolang/releases)
2. Extract and place `zero` in a directory on your PATH
3. Run `zero doctor --json` to verify

## Verify Installation

```bash
zero doctor --json
```

Should output JSON containing compiler version, platform info, and environment checks.

## VS Code Extension

A VS Code extension for `.0` file syntax highlighting is included in the repository:

```bash
cd extensions/vscode/
# Follow VS Code extension development workflow to install
```
