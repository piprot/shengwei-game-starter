# GitHub 同类项目调研参照（2026-08-09）

本文记录在修复 20 项短板前对 GitHub 同类项目的调研结果。仅借鉴设计思路与交互模式，不复制任何代码；各仓库版权归原作者所有。

## 调研仓库

### 1. basketball-iq-trainer（决策训练应用，React + TS）
地址：https://github.com/Jooozen/basketball-iq-trainer

可借鉴点：
- SM-2 间隔重复算法维护每道题的卡片状态（easiness / interval / repetition / nextReview），错误题按 `wasEverIncorrect` 与 `lastQuality < 3` 进入错题复习。
- 错题复习页支持"未解决"与"全部错误"两种模式，随机打乱顺序、即时揭示正误、会话结束展示正确率。
- 每日挑战 + 连续天数 streak + 徽章系统（领域精通、连胜、综合测试、限时挑战）。
- 首页用"到期复习 N 题"横幅 + 域卡片分段进度条，把复习与挑战作为常驻入口。

对应我们的修复：错题集一键回练、每日任务/周挑战的正反馈、成就/徽章成长感。

### 2. situational-judgement（情境判断模拟，React SPA）
地址：https://github.com/CM-43/situational-judgement

可借鉴点：
- 内容完全由 JSON 驱动：mission -> questions -> steps，step 类型为 narrative / pick-one / reorder / outcome。
- 每次选择后立即显示该选项对应的 outcome 变体，前向推进、会话可持久化。
- 环形倒计时组件用 SVG strokeDashoffset 展示剩余比例，归零显示 "Time's up"。
- 进度指示器固定显示"当前题 / 总题数"，降低认知负担。

对应我们的修复：1v1/随机事件倒计时视觉化与超时提示、内容管线可扩展性、结算 outcome 变体。

### 3. judgement_tests（情境判断测试 SJT，React）
地址：https://github.com/martinmphil/judgement_tests

可借鉴点：
- "最佳 + 最差"双轴选择，两项互斥，用户必须选出一个 best 和一个 worst。
- 每个选项按钮带明确的 aria-label（"Option A is best / worst"），选择状态内联可见。
- 使用原生 `<progress>` 元素展示考试进度，读屏友好。

对应我们的修复：选项语义化与 aria 标注、路线/难度按钮的 `aria-pressed` 与"已选"状态。

### 4. zheng-he-leadership-simulation（郑和领导力模拟，React）
地址：https://github.com/wAImlim/zheng-he-leadership-simulation

可借鉴点：
- 通过系列选择揭示玩家领导力人格类型，选择即画像。

对应我们的修复：决策画像/路线复盘与结局钩子的方向验证（我们已实现角色路线与结局，保持此方向并增强前期触达）。

### 5. h5p/h5p-branching-scenario（H5P 分支情景内容类型，JS）
地址：https://github.com/h5p/h5p-branching-scenario

可借鉴点：
- 学习内容根据用户回答动态改变后续路径，支持评分语义与多语言资源。
- 内容、语义与运行时分离，便于作者维护。

对应我们的修复：角色/难度分岔、随机事件轮换与内容管线的可维护性。

## 应用到本次修复的总体原则

1. 反馈要"选择后立即可见"：每个错误/低分选择都应生成一条可回练的记录，而不是只在报告页列数字。
2. 复习要闭环：错题集必须能一键进入重练会话，重练后更新掌握状态（参考 SM-2 思路，简化实现）。
3. 倒计时要可视化：剩余 15/10/5 秒强提醒，超时后明确标注"超时自动选择"并允许撤销。
4. 入口要诚实：静态部署下禁用云端入口并标注"演示锁定"，避免按钮可点但功能不可用。
5. 进度要可读：成就进度取整、编号唯一、目标值与内容池一致；地图移动端默认只展示核心行动。

## 第二轮补充参照（2026-08-09 外部评估对账）

### 6. claude-tutor（个性化学习计划 + SM-2 间隔复习 + 看板，JS/Claude Code 插件）
地址：https://github.com/kirilxd/claude-tutor（109 stars）

可借鉴点：
- 学习闭环：plan → study → quiz → review → repeat，复习间隔 1d/6d/15d。
- 自适应测验针对弱项，进度报告给出下一步学习建议。
- 提供独立看板 UI，让学习者看到"该复习什么、学得怎么样"。

对应我们的修复：复盘报告/教练端的方向（已有错题回练与教练追问，V2 可补间隔复习计划与小组对比视图）。

### 7. Decision-Duel（同时揭示的 1v1 决策对战，HTML/CSS/JS）
地址：https://github.com/Samskriti-0605/Decision-Duel

可借鉴点：
- 双方同时出牌、同时揭示、按结果计分并允许重置。

对应我们的修复：1v1 已有"预测对手 + 揭示"机制；V2 的暗牌/下注/信息战可沿此方向深化。

### 8. coach-platform（教练平台雏形，JS）
地址：https://github.com/callmegodrizzz/coach-platform

可借鉴点：
- 教练平台作为独立交付层，承载学员数据与对话素材。

对应我们的修复：教练端工作坊/小组对比/复盘导出已列入 V2。
