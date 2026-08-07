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
| 1 | 服务端未公网部署 | 完成部署文档、Render 配置、部署工作流 | 文档已备，公网部署待账号 |
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

GitHub Actions/Pages recovered. CI run `31133005719` for `19edd53` completed success; Pages returns 200. Render remains the only release blocker: `adaptive-ascent-server.onrender.com` returns 404 and the dashboard Blueprint has not been confirmed yet.