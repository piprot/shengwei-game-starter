# CODEX_HANDOFF

## 当前项目目标

把 `game-starter` 从 Neon Chase 原型重构为生产级在线 1v1 领导力情境游戏《权变之路》，可部署 GitHub Pages，服务高管教练、创业者与高潜人才三类玩家。

## 当前阶段

P0 可玩生产闭环，已完成核心开发，进入验证与部署阶段。

## 最新完成

- 重写为 Vanilla TypeScript + Vite 单页应用，不再依赖 Phaser
- 新增十项能力谱系、角色建档、资源系统、段位成长
- 新增九章权力架构、18 个主线情境、3 个支线任务
- 新增情境决策引擎、专家基准评分、章节星级、解锁与本地存档
- 新增能力图谱雷达图、复盘报告
- 新增 AI 陪练、本地双人、WebRTC 手动信令远程 1v1
- 新增程序化权力关系沙盘与情境局势图
- 新增 Web Audio 程序化音效、氛围声与静音开关
- 借鉴 GitHub 同类项目 `decision-lab`，加入情报板、双栏剧情、决策画像与统计卡
- 新增能力子技能拆解与训练路径
- 新增决策历史留痕与支线解锁
- 新增 `REQUIREMENTS_TRACEABILITY.md` 需求追溯表
- 新增自动 Vite + Playwright 端到端冒烟测试
- 新增全页面多分辨率浏览器审计
- 桌面与手机全页面布局溢出检查通过
- 双页面 WebRTC 远程对局已自动化验证
- `npm run build` 通过

## 重要文件

- `src/core/story.ts`：剧情与情境数据
- `src/core/game.ts`：存档、成长、评分
- `src/core/duel.ts`：1v1 引擎与 AI
- `src/net/rtc.ts`：WebRTC 手动信令
- `src/ui/App.ts`：全部游戏界面与状态路由
- `PRD.md` / `PROJECT_PLAN.md` / `README.md`
- `.github/workflows/ci.yml`：CI 与 Pages 部署

## 验证

- `npm run build` 通过
- `npm test` 自动完成建档 → 主线首情境 → AI 1v1 → 结果页
- `npm run audit` 覆盖主页、地图、剧情、能力、报告、1v1 的桌面/手机布局与控制台错误
- Playwright 桌面 1280x720、手机 390x844 均无横向溢出
- 本地开发服务器当前运行于 `http://127.0.0.1:5173`

## 已知风险

- WebRTC 远程对战使用手动信令，未做公网双端实测
- 无服务端房间与账号系统，无法自动匹配或跨设备同步
- 内容固定，规模化需要内容管线
- 移动端仍需真机可读性审计

## 下一项最安全任务

在公网部署后做一次真实双浏览器 WebRTC 联机测试；通过后再进入 P1 服务端房间与云端存档。
