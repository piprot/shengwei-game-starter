# 权变之路 · Adaptive Ascent

面向高管教练业务的在线 1v1 领导力情境游戏。玩家在真实职场情境中做决策，通过主线剧情、支线任务和 1v1 对决，训练识人、用人、驭人、谋权、掌权、固权与自我进化能力。

[![CI](https://github.com/piprot/shengwei-game-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/piprot/shengwei-game-starter/actions/workflows/ci.yml)

## 游戏特性

- 9 章权力架构、18 个主线情境、6 个支线任务、9 段章节复盘
- 2 条支线剧情弧：信任重建、韧性组织，带连续解锁与结局
- 10 项领导力能力与 6 级成长体系
- 10 题能力基线测评，生成个性化初始能力档案
- 能力基线报告：优势能力、待提升能力、角色开局建议
- 情境高尔夫式专家基准评分
- AI 陪练、本地双人、WebRTC 远程 1v1
- 程序化权力关系沙盘与情境局势图
- Web Audio 程序化音效与氛围声
- 本地存档、能力雷达图、复盘报告
- 跨设备存档链接：一键编码完整进度，打开链接即可恢复
- 复盘报告可导出 Markdown，便于教练归档与一对一复盘
- 段位认证：达到破局者及以上在报告中显示认证通过
- 成就墙：章节、支线、测评、1v1 与段位目标追踪
- 人物关系图：主线与支线 NPC 的关系状态追踪
- GitHub Pages 自动部署
- PWA：应用图标、安装清单与离线缓存 Service Worker

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173

## 构建与测试

```bash
npm run build
npm test
npm run audit
npm run content-audit
```

`npm test` 会自动启动 Vite，并完成建档、主线情境、AI 1v1 全流程冒烟验证；`npm run audit` 会检查桌面/手机全页面布局与控制台错误；`npm run content-audit` 会检查章节、情境、选项、情报、角色变体与能力数据完整性。

## 远程对战

1. 创建方点击“远程对战 > 创建房间”，复制邀请码
2. 对方点击“加入房间”，粘贴邀请码并生成应答码
3. 创建方粘贴应答码并点击“完成连接”
4. 双方通过 WebRTC 数据通道同步回合选择

## 项目结构

- `src/core/types.ts`：领域类型
- `src/core/abilities.ts`：能力谱系、角色、成长
- `src/core/story.ts`：九章剧情与情境数据
- `src/core/game.ts`：存档、决策、评分、进度
- `src/core/duel.ts`：1v1 引擎与 AI
- `src/net/rtc.ts`：WebRTC 手动信令
- `src/ui/App.ts`：游戏界面与状态路由
- `scripts/smoke.mjs`：端到端冒烟测试

## 文档

- [PRD.md](./PRD.md)
- [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md)
- [NARRATIVE_PLAN.md](./NARRATIVE_PLAN.md)
- [CODEX_HANDOFF.md](./CODEX_HANDOFF.md)
