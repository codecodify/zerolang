---
sidebar_position: 1
---

# Hello World

## 源码

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello from zero\n")
}
```

## 运行

```bash
zero run hello.0
```

## 检查

```bash
zero check hello.0
```

## 查看图

```bash
zero graph --json hello.0
```
