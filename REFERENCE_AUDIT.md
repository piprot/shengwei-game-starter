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
