---
sidebar_position: 1
---

# 语法概览

## 基本结构

Zerolang 源文件使用 `.0` 扩展名。

```zero
fn answer() -> i32 {
    return 40 + 2
}

pub fn main(world: World) -> Void raises {
    if answer() == 42 {
        check world.out.write("math works\n")
    }
}
```

## 函数

```zero
fn 函数名(参数: 类型) -> 返回类型 {
    // 函数体
}
```

- `pub` 关键字标记公开函数
- `raises` 标记函数可能失败

## 类型

| 类型 | 说明 |
|---|---|
| `i32` | 32 位有符号整数 |
| `Void` | 无返回值 |
| `Bool` | 布尔值 |
| `String` | 字符串 |

## 控制流

```zero
if condition {
    // ...
} else {
    // ...
}
```

## 副作用与 Capability

Zerolang 中，访问外部世界必须通过显式的 capability：

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello\n")
}
```

`world` 参数提供对外部世界的访问能力。`check` 关键字标记可能失败的操作。

## 所有权与借用

（文档待完善，参考官方最新版本）
