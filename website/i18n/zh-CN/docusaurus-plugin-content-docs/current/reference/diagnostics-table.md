---
sidebar_position: 2
---

# 诊断码速查表

Zero 编译器发出的所有稳定诊断码的快速参考表。使用 `zero explain <code>` 获取更详细的指导。

## 如何阅读诊断信息

运行 `zero check --json` 获取结构化诊断输出：

```json
{
  "schemaVersion": 1,
  "ok": false,
  "diagnostics": [
    {
      "severity": "error",
      "code": "NAM003",
      "message": "unknown identifier 'message'",
      "path": "examples/hello.0",
      "line": 2,
      "column": 27,
      "length": 7,
      "expected": "visible local, parameter, function, or builtin",
      "actual": "no visible symbol named 'message'",
      "help": "declare the name before using it",
      "fixSafety": "behavior-preserving",
      "repair": {
        "id": "manual-review",
        "summary": "Inspect the diagnostic fields and choose a repair manually."
      },
      "related": []
    }
  ]
}
```

每条诊断信息包含：`code`（稳定标识符）、`message`（出了什么问题）、位置信息（`path`、`line`、`column`）、`expected`/`actual`（不匹配详情）、`help`（建议修复方案）和 `fixSafety`（自动化标签）。

## 修复安全标签

修复方案附带安全标签，帮助 Agent 和工具判断是否可以自动应用：

| 标签 | 含义 |
|------|------|
| `format-only` | 仅修改格式，不影响行为 |
| `behavior-preserving` | 保持程序行为不变，可安全应用 |
| `local-edit` | 限于当前局部作用域或文件 |
| `api-changing` | 会改变函数签名、导出名称、包 API 或调用点 |
| `requires-human-review` | 有风险或存在歧义；展示方案但不自动应用 |

## 代码参考

### PAR - 解析器

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| PAR100 | parser syntax failure | 缺少花括号、逗号，或类型参数列表格式错误等语法错误 | 检查指示的 token 及周围结构；添加缺少的分隔符或修正语法 |

### NAM - 名称

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| NAM003 | unknown identifier | 在当前词法作用域中使用了未声明的名称 | 在使用前引入局部绑定、参数或导入 |
| NAM004 | duplicate name / arity mismatch | 重复的名称、错误的调用参数数量，或泛型类型名遮蔽 | 重命名重复项、修正参数数量或移除遮蔽声明 |

### TYP - 类型

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| TYP002 | type mismatch | 赋值、字面量、返回值或类型默认值中的类型不匹配 | 确保表达式与预期类型匹配；添加显式转换或标注 |
| TYP009 | mutable storage required | 可写字节辅助函数（如 `std.mem.copy`）需要可变存储 | 将目标绑定的 `let` 改为 `var` |
| TYP010 | condition must be Bool | 条件表达式不是 `Bool` 类型 | 使用布尔表达式或比较运算符 |
| TYP011 | null requires Maybe context | `null` 在 `Maybe<T>` 上下文之外使用 | 用 `Maybe<T>` 包装或提供带类型的默认值 |
| TYP012 | break outside loop | `break` 在没有外层循环时使用 | 将 `break` 移到循环体内部或重构控制流 |
| TYP013 | continue outside loop | `continue` 在没有外层循环时使用 | 将 `continue` 移到循环体内部或重构控制流 |
| TYP014 | non-integer loop bounds | 范围循环的边界必须是整数兼容类型 | 为循环范围使用整数表达式 |
| TYP015 | invalid integer literal | 整数字面量使用了无效的数字、分隔符、进制前缀或后缀 | 修正字面量格式；使用有效的数字和可选进制前缀（`0x`、`0b`、`0o`） |
| TYP016 | integer overflow | 整数字面量超出预期的原始整数宽度 | 使用更宽的类型或减小字面量值 |
| TYP017 | invalid cast | `as` 转换仅限于原始数值类型和字节 `char` 类型 | 仅在兼容的数值类型之间转换 |
| TYP018 | invalid char literal | 字符字面量必须包含恰好一个字节或支持的字节转义 | 使用单个字符或转义序列如 `\n`、`\t`、`\\` |
| TYP019 | invalid float literal | 浮点字面量必须使用 `digits "." digits` 格式，可选指数 | 添加小数点；例如用 `1.0` 代替 `1` |
| TYP020 | float overflow | 浮点字面量超出预期的原始浮点宽度 | 对较大值使用 `f64` 或减小字面量 |
| TYP021 | unsupported indexing target | 对不支持的目标进行索引、切片或索引赋值 | 使用支持的数组、切片或可索引类型 |
| TYP022 | non-integer index | 索引表达式和切片边界必须是整数 | 为索引和边界使用整数表达式 |
| TYP023 | generic arity mismatch | 泛型调用类型参数数量不匹配，或在非泛型函数上使用了类型参数 | 匹配类型参数数量；从非泛型调用中移除类型参数 |
| TYP024 | conflicting generic inference | 泛型推断为同一类型参数找到了冲突的具体类型 | 使参数一致或传递显式类型参数 |
| TYP025 | inference failure | 无法从局部调用参数推断泛型类型参数 | 传递显式类型参数：`fn<Type>(args)` |
| TYP026 | cyclic type alias | 类型别名重复、格式错误或循环 | 将别名指向具体类型或移除循环 |
| TYP027 | recursive generic mutation | 递归泛型调用改变了类型参数 | 确保递归调用使用一致的类型参数 |

### BOR - 借用

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| BOR001 | borrow conflict | 词法借用冲突；JSON 中的 `borrowTrace.activeBorrows` 包含每个借用根的详细信息 | 重新排列借用顺序、缩小借用范围或克隆值 |
| BOR002 | reference escape | 引用来源逃逸，包括从调用返回的引用或通过可变参数存储的引用 | 返回拥有的值而非引用，或重构以避免逃逸 |

### OWN - 所有权

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| OWN001 | use after move | 拥有的值在移动后被使用，或泛型容器拥有无约束的泛型负载 | 移动前克隆、重新排列使用顺序或在适当处使用引用 |

### ERR - 错误流

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| ERR002 | missing error in set | 调用者的显式错误集缺少被调用者抛出的错误 | 将缺失的错误添加到 `raises` 集合：`raises [NotFound, Io, ...]` |
| ERR003 | unchecked fallible call | 可失败的调用未使用 `check` 或 `rescue` | 添加 `check` 传播错误，或添加 `rescue` 本地处理 |

### TAR - 目标

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| TAR001 | unknown target | 请求的目标名称不在 `zero targets` 列表中 | 使用 `zero targets` 检查可用目标并使用有效名称 |
| TAR002 | missing capability | 选定的目标不提供程序所需的能力 | 为具有所需能力的目标构建，或使用目标特定的入口点 |

### IMP - 导入

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| IMP001 | unknown import | 未知的包本地导入路径 | 检查导入路径；使用修复 id `fix-import-path` |
| IMP002 | import cycle | 包本地导入形成循环 | 重构导入以打破循环 |
| IMP003 | duplicate export | 导入的模块之间存在重复的公共导出 | 重命名或移除其中一个冲突的导出 |

### PKG - 包

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| PKG001 | missing zero.json | 本地包依赖路径不包含 `zero.json` | 确保依赖目录包含有效的 `zero.json` 清单文件 |
| PKG002 | package cycle | 包依赖形成循环 | 重构依赖以打破循环 |
| PKG003 | version conflict | 一个包名解析到冲突的版本 | 在清单之间对齐依赖版本 |
| PKG004 | unsupported target | 包依赖不支持所选目标 | 使用兼容的目标或寻找替代依赖 |

### IFC - 接口

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| IFC001 | unknown constraint | 接口约束未知，或具体类型参数没有静态类型体 | 导入接口或提供具有所需静态体的类型 |
| IFC002 | missing method | 受约束的具体类型缺少所需的静态接口方法 | 在具体类型上实现所需的方法 |
| IFC003 | wrong parameter count | 具体静态方法的参数数量与接口不匹配 | 匹配接口方法签名的参数数量 |
| IFC004 | wrong return type | 具体静态方法的返回类型与接口不匹配 | 匹配接口方法的返回类型 |
| IFC005 | wrong parameter type | 具体静态方法的参数类型与接口不匹配 | 匹配接口方法的参数类型 |

### STC - 静态值

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| STC001 | unsupported static type | 静态值参数使用了不支持的非整数类型 | 为静态值参数使用整数类型 |
| STC002 | non-literal static arg | 静态值参数不是整数字面量或确定的顶层常量 | 使用整数字面量或顶层 `const` 值 |
| STC003 | static value conflict | 显式静态值参数与带标注类型携带的值冲突 | 移除显式参数或调整类型标注 |

### 其他

| Code | Message | Meaning | Fix |
|------|---------|---------|-----|
| BLD002 | bad manifest | 错误的项目清单或不支持的清单目标格式 | 修复 `zero.json` 清单结构或移除不支持的目标配置 |
| ABI001 | unsupported C ABI | 不支持的 C ABI 导出或 extern 布局 | 使用支持的 ABI 兼容类型；检查 extern 声明 |
| CIMP003 | host path leak | 外部目标 C 依赖会使用主机 include/库路径或主机 `pkg-config` | 使用包相对的 vendor 头文件/库或配置目标 sysroot |
| CIMP004 | missing C function | extern C 调用引用了导入头文件中缺失的函数或使用了不支持的 C ABI 类型 | 确保函数在头文件中声明；使用兼容的 C 类型 |
| CIMP005 | missing C link plan | extern C 调用缺少匹配的 C 链接元数据或使用了不安全的系统库名称 | 在 `zero.json` 中添加匹配的 `c.libs.*` 条目，包含 `headers` 和 `lib`/`link` |
| SHM001 | inference failure | 泛型类型方法调用无法推断继承的类型/静态参数 | 传递显式类型或静态参数 |
| SHM002 | conflicting Self | 泛型类型方法的参数暗示了冲突的 `Self` 实例化 | 确保参数同意同一个 `Self` 类型 |
| RCV001 | unknown method | 接收者风格的调用引用了未知方法或无 `self` 的静态方法 | 检查方法名；对接收者调用使用实例方法 |
| RCV002 | addressable receiver | 接收者风格的调用需要可寻址的接收者，或 `mutref<Self>` 需要可变接收者 | 使用变量绑定作为接收者；对可变接收者使用 `var` |
| FLD001 | unknown field | 类型字面量包含未知字段 | 移除该字段或检查类型定义 |
| FLD002 | missing required field | 类型字面量遗漏了没有默认值的必需字段 | 添加必需字段并赋值 |
| MEM001 | malformed Maybe | 格式错误的内存类型形式，如 `Maybe` 缺少必需的类型参数 | 添加类型参数：`Maybe<T>` |
| MEM002 | unguarded Maybe read | `Maybe<T>.value` 的读取未通过可见的 `.has` 守卫证明存在 | 在读取 `.value` 前添加 `.has` 守卫、`check` 或 `rescue` |
| MET001 | unsupported meta | 解析的 `meta` 表达式请求了尚不支持的编译时行为 | 避免不支持的 `meta` 表达式；使用运行时替代方案 |
| PUB001 | missing API metadata | 公共声明遗漏了必需的显式 API 类型元数据 | 添加显式类型标注：`pub const name: Type = value` |
| MAT004 | payload mismatch | match 分支只能为携带负载的 choice case 绑定负载 | 将负载模式与携带负载的 case 匹配 |

## 常见修复方案

### 1. 缺少变量声明 (NAM003)

**问题：** 在声明前使用了变量名。

```zero
pub fn main(world: World) -> Void raises {
    check world.out.write(message)  // 'message' 未声明
}
```

**修复：** 在使用前引入局部绑定。

```zero
pub fn main(world: World) -> Void raises {
    let message: String = "hello from zero\n"
    check world.out.write(message)
}
```

### 2. 未检查的可失败调用 (ERR003)

**问题：** 可失败的函数调用没有 `check` 或 `rescue`。

```zero
let file: owned<File> = std.fs.createOrRaise(fs, ".zero/out.txt")
```

**修复：** 使用 `check` 传播错误并声明错误集。

```zero
fn createFile(fs: owned<Fs>) -> owned<File> raises [NotFound, TooLarge, Io] {
    return check std.fs.createOrRaise(fs, ".zero/out.txt")
}
```

### 3. 类型推断冲突 (TYP024)

**问题：** 泛型调用中 `T` 需要同时是 `i32` 和 `u8`。

```zero
fn first<T: Type>(left: T, right: T) -> T {
    return left
}
let value: i32 = first(1, 2_u8)
```

**修复：** 使参数一致或传递显式类型参数。

```zero
let value: i32 = first<i32>(1, 2)
```

### 4. 缺少 API 元数据 (PUB001)

**问题：** 公共常量缺少显式类型标注。

```zero
pub const answer = 42
```

**修复：** 添加必需的类型标注。

```zero
pub const answer: i32 = 42
```

### 5. 跨目标 C 依赖 (CIMP003)

**问题：** 外部目标构建尝试使用主机 include 路径或 `pkg-config`。

```sh
zero build --json --target linux-musl-x64 my-package
```

**修复：** 使用包相对的 vendor 头文件/库或配置目标 sysroot。不要在交叉编译时依赖主机路径。

## 延伸阅读

- [CLI 参考](/zh-CN/docs/cli/commands) - Zero 命令行工具和参数
- [Agent 原生概念](/docs/concepts/agent-native) - Zero 的设计如何支持 AI 辅助开发
- [效果系统](/zh-CN/docs/language/effects) - 理解 `raises`、`check` 和 `rescue`
