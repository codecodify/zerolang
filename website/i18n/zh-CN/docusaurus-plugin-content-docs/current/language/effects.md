---
sidebar_position: 3
---

# 副作用系统

## 一切显式

Zerolang 让外部世界访问、可失败性、所有权和资源使用对读者和工具都可见。

没有隐藏的全局对象，没有隐式异步，没有魔法全局变量。

## 基于 Capability 的 I/O

如果函数接触外部世界，其签名会说明：

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write("hello\n")
}
```

| 元素 | 含义 |
|---|---|
| `world: World` | 显式的 capability 参数 |
| `raises` | 函数可能失败 |
| `check` | 可能失败的操作 |

## 无隐藏运行时开销

- 无强制垃圾回收器
- 无隐藏分配器——分配在代码中显式且可见
- ABI 导出是显式的

## 确定性工具链

诊断信息、图事实、大小报告、解释和修复计划都足够结构化，Agent 可以直接检查和处理，无需解析散文。
