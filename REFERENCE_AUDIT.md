# GitHub 参照项目评估

## 评估结论

在开始实现前，我搜索并评估了以下可直接下载运行或可复制的开源项目：

| 项目 | 地址 | 可运行性 | 可参照点 |
| --- | --- | --- | --- |
| NOT HERE | https://github.com/erichare/not-here | 可运行：`pnpm install` 后运行 web/CLI | 分支剧情引擎、事实账本、关系轴、多结局、无数字角色状态 |
| Wolfcha | https://github.com/oil-oil/wolfcha | 可运行：`pnpm install` + `.env.local` + `pnpm dev` | AI 狼人杀、阵营目标、隐藏角色、投票与局势变化 |
| OpenSuspect | https://github.com/opensuspect/opensuspect-legacy | 早期版本，需 Godot | 多人社交推理、任务/破坏/投票机制 |
| NEA | https://github.com/nusnlp/nea | 可训练但需 ASAP 数据集 | 自动作文评分，可用于开放摘要质量评分思路 |
| Game-Economy-Simulation | https://github.com/eddableheath/Game-Economy-Simulation | Python 脚本 | 资源生产/消耗/通胀控制建模 |

## 融入方式

1. **隐藏章节**：参照 NOT HERE 的确定性故事图与多结局，为能力隐藏路线增加真实节点和结局状态。
2. **阵营机制**：参照 Wolfcha 的阵营目标与隐藏信息，为试炼加入信任/怀疑数值和背叛选择。
3. **开放作答**：参照 NEA 的自动评分思路，使用轻量关键词、长度、结构、步骤评分，不引入重型模型依赖。
4. **资源经济**：参照 Game-Economy-Simulation，设计“生产/消耗/扩建”三阶段资源循环。
5. **远程对局**：保持轻量 WebSocket/WebRTC，自行扩展预判协议，不引入不可控的重型多人框架。

## 决策

- 不直接引入重型 AI 模型，避免让浏览器版失去离线可玩性。
- 不直接替换现有引擎，优先用这些项目的设计原则做本地化落地。

## 2026-08-09 补充检索（第二批次）

在进一步做分支、事件与中期分叉前，补充检索并参照以下开源项目：

| 项目 | 地址 | 可参照点 |
| --- | --- | --- |
| ChoiceScript | https://github.com/dfabulich/choicescript | 多选叙事语言、条件分支、持久存档与统计收集，适合参考“选项即数据”的表达方式 |
| Parchment | https://github.com/curiousdannii/parchment | 交互小说 Web 播放器，保存/恢复与跨页面状态一致性 |
| Undum | https://github.com/idmillington/undum | “情境（situation）”节点模型、可叠加特质（qualities）、存档格式，与当前主线/支线/分支节点模型同构 |
| Fungus | https://github.com/snozbot/fungus | 带立绘与音效的叙事流编排，佐证“章节背景 + 角色立绘 + 分轨音频”的呈现结构 |
| Jonathan-Havener/LeadershipGame | https://github.com/Jonathan-Havener/LeadershipGame | 领导力主题游戏仓库，用于对照同类题材的关卡与决策呈现 |

落地取舍：

- 分支手写化沿用 ChoiceScript 的“选项文本 + 条件效果”思路，但保留当前 `branchVariantFor` 按章节/品质回落机制，避免新增运行时依赖。
- 随机事件池参照 Undum 的“情境 + 特质”模型，把角色与难度档做成事件池过滤条件，并用事件周期计数制造二周目差异，而不是简单清空列表。
- 中期分叉采用“路线检查点节点”：第 4/7 章选择路线后进入专属分叉节点，分叉选项继续影响后续事件权重与结局复盘，落实 NOT HERE 的确定性故事图思想。
