# CODEX_HANDOFF

## Latest Audit

- Playwright programmatic audit passed for horizontal overflow.
- Desktop 1280x720: no scroll, canvas fills screen.
- Phone 720x1280 and 1080x2400: no horizontal scroll, portrait letterboxing remains.
- Next task: reduce portrait letterboxing before adding final art assets.

## 当前项目目标

用 vibe coding 构建一款可迭代的浏览器游戏工程，先从通用 2D 可玩原型开始，后续根据用户 Brief 替换玩法。

## 当前阶段

Prototype

## 最新完成

- 建立 Phaser 3 + Vite + TypeScript 工程
- 玩家移动：方向键 / WASD / 触摸拖拽
- 宝石收集、计分、集齐重开
- 敌人追踪、碰撞 Game Over、自动重开
- 默认原型方向已固化为 `PRD.md`：Neon Chase
- 正式开始界面
- 敌人速度随得分提升，最大速度封顶
- HUD 字号/边距做基础移动端检查，并输出 `UI-AUDIT.md`
- 收集/失败音效、宝石粒子、震屏、玩家闪白反馈
- 本地开发服务器运行中

## 重要文件

- `src/main.ts`
- `src/scenes/GameScene.ts`
- `src/audio.ts`
- `src/config.ts`
- `PRD.md`
- `UI-AUDIT.md`
- `package.json`
- `CODEX_HANDOFF.md`

## 验证

- `npm run build` 通过
- 开发服务器：http://127.0.0.1:5173

## 已知风险

- 尚未确定具体游戏方向
- 缺少美术、音频、存档、后端
- 移动端 HUD 已做文档审计，但尚未在真机/截图矩阵中验证
- Phaser bundle 体积较大，后续可做代码分包

## 下一步最安全任务

在 720x1280、1080x2400 和真实手机分辨率下截图验证 HUD，然后进入正式美术/音效资产阶段。
