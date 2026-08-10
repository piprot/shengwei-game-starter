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

对应我们的修复：1v1 已有“预测对手 + 揭示”机制，命中给预判加成并累计展示（1.5.5）；V2 的暗牌/下注/信息战可沿此方向深化。

### 8. coach-platform（教练平台雏形，JS）
地址：https://github.com/callmegodrizzz/coach-platform

可借鉴点：
- 教练平台作为独立交付层，承载学员数据与对话素材。

对应我们的修复：教练端工作坊/小组对比/复盘导出已列入 V2。

## 第三轮评估补强参照（2026-08-10）

本轮针对评估中“1v1 仍缺博弈深度”的 P0 建议，补充博弈机制与领导力情境类参照。

### 9. OpenSuspect（开源社交推理游戏，隐藏身份与信息不对称）
地址：https://github.com/opensuspect/opensuspect-legacy

可借鉴点：
- 隐藏身份/隐藏意图制造信息不对称，“读人”成为核心博弈动作。
- 公开信息与隐藏信息的节奏设计：先观察、再判断、后揭示。

对应我们的修复：1v1 新增“风格押注”——揭晓前只押对手风格（专家/稳健/冒险），把“读对手”变成可量化收益，命中获得 20% 分数加成。

### 10. prisoners-dilemma（迭代囚徒困境与策略演化）
地址：https://github.com/aerrity/prisoners-dilemma

可借鉴点：
- 重复博弈中玩家需要预测对手下一轮策略，策略之间互相演化。
- 历史战绩影响后续判断，形成“我预判了你的预判”的循环。

对应我们的修复：1v1 预判成功率、累计预判加成、对手人格原型（铁血/关系型/赌徒）共同构成轻量版的“读人”博弈。

### 11. free-prisoners（囚徒困境游戏引擎，双方同时出招）
地址：https://github.com/miciek/free-prisoners

可借鉴点：
- 双方同时出招、统一结算的引擎结构，天然适合心理博弈与预测机制。

对应我们的修复：1v1 引擎保持“双方出手 → 风格押注 → 同时揭晓 → 结算”的流程，为 V2 暗牌/下注保留扩展点。

### 12. decision-lab（限时领导力危机情境模拟）
地址：https://github.com/prabapro/decision-lab

可借鉴点：
- 真实危机场景、时间压力与战略质量计分，验证“情境决策 + 评分反馈”的结构。

对应我们的修复：主线/1v1 已使用专家基准评分；高压/极限难度的时间压力设计可继续参照其节奏。

以上仅借鉴设计思路与交互模式，不复制任何代码；各仓库版权归原作者所有。

## 第二轮美术与音乐迭代参照（2026-08-10）

本轮继续优化“页面不够漂亮”，补充游戏 HUD/设计系统类参照。

### 18. Arcade Design System（游戏 HUD 设计系统）
地址：https://github.com/Serfin01/arcade-design-system

可借鉴点：
- 用设计令牌统一色彩、字号与霓虹/发光效果，组件状态（悬停/按下/禁用）成体系。

对应我们的升级：按钮按压反馈、卡片悬停抬升、场景边框金色角标、段位面板金色顶边，统一由现有 CSS 变量驱动。

### 19. AETHER-HUD（高端游戏 HUD 设计系统）
地址：https://github.com/Reinvy/aether-hud

可借鉴点：
- 深色底 + 帝国金 + 战术细节的克制组合，适合高端严肃产品定位。

对应我们的升级：保留深蓝黑底、金色强调与低对比网格纹理，避免高饱和色块堆叠，向“高管级”视觉靠拢。

以上仅借鉴设计思路与交互模式，不复制任何代码；各仓库版权归原作者所有。

## 美术与音乐迭代参照（2026-08-10）

本轮针对“页面不够漂亮、音乐太单调”做视觉与生成式音乐升级，参照以下项目。

### 15. diminished-fifth（程序化音乐生成器，ClojureScript）
地址：https://github.com/ivyreese/diminished-fifth

可借鉴点：
- 用调式与和弦进行驱动程序化音乐，而非固定几小节的循环。

对应我们的升级：环境音乐改为场景感知的生成式引擎——菜单/剧情/对决各有 6 个和弦进行、低音根音、琶音与带随机偏移的旋律层，避免 4 小节死循环。

### 16. MarkovMusic（马尔可夫链程序化音乐）
地址：https://github.com/jcbozonier/MarkovMusic

可借鉴点：
- 用状态转移让旋律“像但不等同”，在稳定与新鲜之间取得平衡。

对应我们的升级：旋律音从场景音阶种子中按索引加随机偏移选取，织体随小节自然演化。

### 17. procedural-svg-art（零依赖种子化 SVG 生成器）
地址：https://github.com/MinyRoz/procedural-svg-art

可借鉴点：
- 用参数化模板批量生成可复用的矢量美术，便于持续迭代。

对应我们的升级：新增 `npm run generate:art`，按章节生成 9 张更丰富的章节背景 SVG（层次山体、星座连接、章节专属配色），后续改模板即可整批重绘。

以上仅借鉴设计思路与交互模式，不复制任何代码；各仓库版权归原作者所有。

## 完整通关评估补强参照（2026-08-10）

本轮针对“修炼任务关键词评分反馈缺失”的 P0 建议，补充文字产出即时评分类参照。

### 13. Neural Essay Assessor（自动作文评分，深度学习）
地址：https://github.com/nusnlp/nea

可借鉴点：
- 文本产出按内容、结构与组织信号给出可解释评分，而非“通过/不通过”二元判定。

对应我们的修复：修炼任务提交后显示得分、命中关键词与奖励明细；未达标时提示补写具体产出。

### 14. Automated Essay Scoring Web App（即时评分 Web 应用）
地址：https://github.com/mankadronit/Automated-Essay--Scoring

可借鉴点：
- 用户提交文本后立即获得分数与反馈，形成“写作 → 评分 → 改进”的短闭环。

对应我们的修复：修炼任务改为 textarea 多行输入，提交即 toast 展示 `得分/100 + 命中关键词 + 奖励`，失败也给出明确方向。

以上仅借鉴设计思路与交互模式，不复制任何代码；各仓库版权归原作者所有。
