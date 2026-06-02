---
sidebar_position: 1
---

# Standard Library

Zerolang's standard library is designed to cover common program needs, reducing the need for external dependency searches.

## Documented Modules

| Module | Description |
|---|---|
| `std.args` | Command-line argument parsing |
| `std.env` | Environment variable access |
| `std.fs` | Filesystem operations |
| `std.crypto` | Cryptographic operations |
| `std.http` | HTTP client |
| `std.net` | Network operations |

## Design Principles

- All external access goes through explicit capabilities
- Stable APIs make effects, ownership, and cleanup visible
- Target-neutral packages should keep filesystem code outside their cross-target entry point
