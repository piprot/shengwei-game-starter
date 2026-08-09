# QA 任务书

## 负责人

- 制作人/项目经理：Codex
- 主策划：Codex
- 程序：Codex
- QA：Codex
- 验收：Codex

## 任务映射

| # | 问题 | 任务 | 状态 |
| --- | --- | --- | --- |
| 1 | 服务端未公网部署 | 完成部署文档、Render 配置、部署工作流 | 已部署 Railway：adaptive-ascent-server-production-018a.up.railway.app 健康检查通过 |
| 2 | 4 小时内容不稳 | 扩充随机事件、分支与挑战模式 | 已完成内容扩充：20 随机事件、27 手写角色分支、挑战模式；待长时间试玩稳定性验证 |
| 3 | 角色选项模板化 | 建立手写内容管线与重复度检测 | 已完成：第 1-9 章手写角色分支 |
| 4 | 随机事件太少 | 扩池、权重、前置、NPC/结局影响 | 已达成：20 个事件、权重、前置、结局影响 |
| 5 | 多语言不完整 | 扩展翻译与审计 | 进行中：全部主要内容与界面已英文，随机/分支英文浏览器审计已通过；剩余为全页面读屏标注 |
| 6 | 无新手引导 | 已加首局引导 | 已完成 |
| 7 | 主线无难度 | 增加高压模式 | 已完成 |
| 8 | 声音设置不持久 | 已持久化 | 已完成 |
| 9 | 云同步无条件覆盖 | 已加冲突选择 | 已完成 |
| 10 | 排行榜不公平 | 改为能力等级分 | 已完成 |
| 11 | Token 明文 | 已加 HMAC 签名 | 已完成 |
| 12 | 无剧情回顾 | 增加局势摘要 | 已完成 |
| 13 | 真机未验证 | 真机清单与截图脚本 | 待做 |
| 14 | 无障碍不完整 | 扩展 aria 与焦点 | 进行中：`html lang`、按钮/canvas/main 标注、读屏状态、键盘快捷键已补；真机 VoiceOver / TalkBack 验收待做 |
| 15 | 数据模型混淆 | 支线/分支/随机已拆分 | 已完成 |
| 16 | 随机事件无后续 | 已加入报告与结局影响 | 已完成 |
| 17 | 奖励不吸引 | 增加成就/解锁/挑战奖励 | 已完成：成就解锁即时提示 |
| 18 | 重玩惊喜不足 | 增加挑战模式/随机序列 | 部分完成：7 回合挑战赛、20 随机事件、角色分支 |
| 19 | 无教练批量对比 | 报告导出已单人，批量待做 | 已完成：`npm run coach:export` |
| 20 | JSON 降级风险 | 生产强制 PostgreSQL | 已完成 |

## 验收

全部任务完成后执行：

```bash
npm run build
npm test
npm run audit
npm run content-audit
npm run test:server
```

## 2026-08-07 release status

- GitHub main pushed to `15a3764`; `gh` auth is valid; hosts file now bypasses the local GitHub DNS hijack.
- GitHub Pages is live at `https://piprot.github.io/shengwei-game-starter/`; Actions queue/OIDC deploy failures were transient and reruns are queued.
- Render service is not deployed yet. Import `piprot/shengwei-game-starter` with Render Blueprint to create `adaptive-ascent-server` + `adaptive-ascent-db`.
- New acceptance scripts: `npm run test:live` and `npm run test:rtc:public` cover public server health/account/rank/match and public dual-context WebRTC after deployment.
## 2026-08-06 GitHub incident

GitHub Status reported `Actions: major_outage` and `Pages: major_outage` at 2026-08-06 17:54 UTC. Queued runs are external and should be rerun after GitHub Status recovers. Git push/API remained operational after FastGithub restart.
After GitHub Status recovers, run `npm run recovery:github` from the repo root to rerun and watch the latest CI automatically.
## 2026-08-07 recovery

GitHub Actions/Pages recovered. CI run `31133005719` for `19edd53` completed success; Pages returns 200. Render was the remaining release blocker before this Railway deployment.

## 2026-08-07 Railway deployment

- Render API is blocked on this network, so deployment switched to Railway.
- Railway service is live at `https://adaptive-ascent-server-production-018a.up.railway.app/`; health returns `{"status":"ok","db":true}`.
- GitHub variable `VITE_ROOM_SERVER_URL` now points to `wss://adaptive-ascent-server-production-018a.up.railway.app`.
- CI run `31149524606` completed success; the deployed GitHub Pages JS was verified to contain the Railway URL.
- `npm run test:live` PASS.
- `npm run test:rtc:public` PASS.
- Railway support was added in commit `4ccae3d` (`railway.toml` + `RAILWAY_SETUP.md`).

## 2026-08-09 外部评估对账（pasted-text-1/2，重复）

外部评估基于仓库代码（未访问线上），评分 6/10。逐条对账见 `docs/REVIEW_RESPONSE_2026-08-09.md`。

### 已落地（本轮）
- AI 陪练人格原型：executor / builder / gambler，影响选项偏好并在大厅与对局中显示风格标签。
- 复盘报告“教练追问”：按决策画像与资源状态生成 2-3 条可带进教练对话的追问。
- 1.5.4：角色专属标签、报告“洞察时刻”、1v1 结算“复盘讨论”、资源危机提示、升级反馈动效。

### 待办（V2）
- 1v1 博弈深化：策略暗牌+揭示、资源下注、信息战（用影响力购买对手偏好情报）。
- AI 心理战：思考时间模拟、虚张声势、历史战绩与风格标签前置展示。
- 资源危机事件：某项资源跌破阈值时强制进入支线危机。
- 程序化情境生成与真实案例投稿（UGC 飞轮）。
- 教练端：小组对比雷达、决策盲区热力图、工作坊同步推演模式。
- 视觉/音乐升级：关键情境与 NPC 插画、章节主题音乐、东方管理哲学配色。
- 真机用户测试：3-5 位高管/教练体验一章主线 + 1v1，记录停顿点。

### 第三轮评估（7.0/10）新增/确认
- 已落地 1.5.5：预判加成显性累计、小组讨论引导、本周聚焦。
- 真机高管用户测试（含“是否愿意用于团队培训”验证）为最高优先级 P0。
- 程序化情境外壳（行业/规模/危机类型参数）与教练端工作坊 MVP 为下一里程碑。
- 报告卡片分享场景、外部权威认证背书、NPC 肖像与主题音乐继续保留 V2。

### 第四轮线上评估（4.5/10）对账

评估者进入线上站点后仅观察首屏即判定“按钮无响应/内容未实装”。线上实测与仓库证据均表明该结论不成立；同时定位到两个真实工程问题（章节美术 404、旧 SW 被 CDN 缓存），已在本轮修复。

#### 已修复 1.5.6
- 章节美术 404：`--chapter-art` 相对路径被 CSS 解析到 `assets/art/`，改为页面绝对 URL。
- 老访客缓存：SW 注册带版本号并 `updateViaCache: none`，更新接管后自动刷新一次。
- 首屏引导：新增“新玩家从这里开始”按钮与脉动提示；未建档能力值标注“初始基线”。
- 加载状态：首屏显示“升维 · 正在加载”指示，不再空白等待。

#### 在线复验证据（Playwright 实测线上）
- 创建档案 → 测评跳过 → 能力基线报告 → 进入主线 → 章节决策 → 1v1 大厅与对局入口全部可操作。
- 声音/语言切换即时生效；能力值与通关章数随存档更新；权力沙盘 Canvas 非空。
- 章节美术请求从 404 修复为 200。

#### 仍为 V2
- 真机高管/教练用户测试、程序化情境外壳与 UGC、教练端工作坊、视觉/音乐升级、1v1 暗牌/下注/信息战。
