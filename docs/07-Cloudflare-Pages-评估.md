# Cloudflare Pages 部署评估

> 对 Cloudflare Pages 作为 Zerolang 社区站部署方案的可行性分析

---

## 一、结论：完全可行 ✅

Cloudflare Pages 可以很好地托管 Docusaurus 多语言静态站点，而且在某些维度上比 Vercel 更强。

---

## 二、Cloudflare Pages 核心能力

| 能力 | 支持情况 | 说明 |
|---|---|---|
| 静态站点托管 | ✅ 原生支持 | Docusaurus 生成纯静态 HTML，完全匹配 |
| Git 集成 | ✅ GitHub/GitLab | Push 自动触发构建 |
| 自定义域名 | ✅ 一键绑定 | 如果域名也在 Cloudflare 管理，零配置 |
| 自动 HTTPS | ✅ 免费证书 | Cloudflare 自动签发 |
| 多分支预览 | ✅ 每条 PR 一个预览地址 | 和 Vercel 一样 |
| 子目录构建 | ✅ 可设 Root Directory | `website/` 作为构建根目录 |
| 构建环境 | ✅ Node.js 支持 | 支持 Node 18/20/22 |
| 全球 CDN | ✅ Cloudflare 全球网络 | 230+ 城市节点，业界最强 |
| 回滚 | ✅ 一键回滚到任意部署版本 | |

---

## 三、操作步骤（对比 Vercel）

### 3.1 连接仓库

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 左侧菜单 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 授权 GitHub，选择 `zerolang` 仓库

### 3.2 配置构建

| 配置项 | 值 |
|---|---|
| Framework preset | **None** |
| Build command | `cd website && npm install && npm run build` |
| Build output directory | `website/build` |
| Root directory | `/`（或不填） |

> 注意：Cloudflare Pages 的构建命令在仓库根目录执行，所以需要 `cd website` 进入子目录。

### 3.3 绑定自定义域名 `zerolang.app`

**场景 A：域名在 Cloudflare 管理（最简单）**

1. 进入 Pages 项目 → **Custom domains**
2. 输入 `zerolang.app`
3. 点击 **Activate domain**
4. 自动完成 DNS 配置和证书签发，无需手动添加记录

**场景 B：域名不在 Cloudflare**

1. 进入 Pages 项目 → **Custom domains**
2. 输入 `zerolang.app`
3. Cloudflare 会显示需要添加的 DNS 记录
4. 去域名服务商添加对应的 CNAME 或 A 记录
5. 等待生效

---

## 四、与 Vercel 的对比

| 维度 | Cloudflare Pages | Vercel | 结论 |
|---|---|---|---|
| **全球 CDN** | 230+ 城市，Anycast 网络 | 100+ 城市，Vercel Edge Network | Cloudflare 更强 |
| **国内访问（未备案）** | 走香港/新加坡节点 | 走香港/新加坡节点 | 差不多 |
| **国内访问（已备案）** | 需接入 Cloudflare 中国合作伙伴 | 无国内节点，纯海外 | Cloudflare 稍好 |
| **构建速度** | 中等 | 较快 | Vercel 稍快 |
| **构建时间限制** | 免费版 20 分钟/构建 | 免费版 45 分钟/构建 | Vercel 更宽松 |
| **自定义域名（同平台 DNS）** | 零配置，一键激活 | 需要手动添加 DNS 记录 | Cloudflare 更简单 |
| **自定义域名（异平台 DNS）** | 需要手动添加记录 | 需要手动添加记录 | 差不多 |
| **Serverless Functions** | Cloudflare Workers | Vercel Functions | 本项目不需要 |
| **Analytics** | 免费 Web Analytics | 免费 Web Analytics | 都有 |
| **团队 familiarity** | 你可能在用 Cloudflare DNS | 独立平台 | 如果 DNS 已在 Cloudflare，Pages 更顺手 |
| **生态系统** | 和 Workers/R2/D1 深度集成 | Next.js 生态最强 | 本项目纯静态，差距不大 |

---

## 五、潜在问题

### 5.1 构建环境差异

Cloudflare Pages 的构建环境基于 Debian，和 Vercel 的 Ubuntu 略有不同。如果依赖了特定系统库，可能出问题。

**本项目**：Docusaurus 纯 Node.js，无系统依赖，无风险。

### 5.2 构建时间

多语言构建（en + zh-CN）可能需要 2-3 分钟。Cloudflare Pages 免费版限制 20 分钟，完全够用。

### 5.3 路径/路由

Docusaurus 的 `trailingSlash: true` 在 Cloudflare Pages 上工作正常，无需额外配置。

### 5.4 重定向

如果需要从旧 URL 重定向到新 URL，Cloudflare Pages 支持 `_redirects` 文件或 `_headers` 文件，比 Vercel 的 `vercel.json` 更简单。

---

## 六、推荐策略

### 方案 A：只用 Cloudflare Pages（如果域名在 Cloudflare）

**为什么**：DNS + Pages + CDN 全在一个平台，域名绑定零配置，管理最省心。

```
域名管理：Cloudflare
站点托管：Cloudflare Pages
CDN：Cloudflare 全球网络
```

### 方案 B：Cloudflare Pages + Vercel 双部署（推荐）

**为什么**：互为备份，一个挂了另一个还能访问。Zerolang 域名指向主站，备用域名（如 `zerolang.vercel.app`）作为 fallback。

```
主站：zerolang.app → Cloudflare Pages
备用：zerolang.vercel.app → Vercel
```

### 方案 C：只用 Vercel（当前方案，也不错）

Vercel 的前端开发者体验确实是最好的，构建日志、错误提示、部署预览都比 Cloudflare Pages 更友好。如果域名不在 Cloudflare，差别不大。

---

## 七、测试 checklist（如果切换到 Cloudflare Pages）

| 检查项 | URL | 预期 |
|---|---|---|
| 英文首页 | `https://zerolang.app/` | 正常 |
| 英文文档 | `https://zerolang.app/docs/intro/` | 正常 |
| 中文首页 | `https://zerolang.app/zh-CN/` | 正常 |
| 中文文档 | `https://zerolang.app/zh-CN/docs/intro/` | 正常 |
| 语言切换 | 点击顶部下拉框 | 中英文切换正常 |
| HTTPS | 地址栏锁图标 | 证书有效 |
| 响应速度 | 多地区 ping | < 200ms（全球主要城市） |

---

## 八、最终建议

| 你的情况 | 推荐方案 |
|---|---|
| 域名已在 Cloudflare 管理 | **Cloudflare Pages**（绑定最简单） |
| 域名在其他平台，不想迁移 | Vercel 或 Cloudflare Pages 都可以 |
| 追求极致全球 CDN 覆盖 | **Cloudflare Pages** |
| 追求最好的前端开发者体验 | **Vercel** |
| 想要双保险 | **两者都部署**，域名指向 Cloudflare Pages，Vercel 做备用 |

如果你决定切到 Cloudflare Pages，我可以帮你更新部署文档。
