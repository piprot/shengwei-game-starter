# 团队管理训练营 · GitHub 参照与借鉴说明

状态：2026-08-13。在动手实现前，先通过 GitHub 搜索 API 检索“团队管理训练游戏 / 领导力模拟 / 管理模拟 / 影响力卡牌”等关键词，并结合仓库既有参照文档，确定可借鉴机制。

## 本次检索到的项目

| 项目 | 可借鉴机制 | 对应到本模块 |
| --- | --- | --- |
| [rsm-bgoyal/The-Strategy-Shuffle](https://github.com/rsm-bgoyal/The-Strategy-Shuffle) | 领导力与影响力卡牌：选择响应情境、积累影响力 | 四维影响力（信任/连接/战略/传承）、情境决策 |
| [jaybi2008/ceo-simulator](https://github.com/jaybi2008/ceo-simulator) | 浏览器 CEO 模拟：季度决策、现金流、员工、声望、随机事件 | 36 情境/角色、季度式关卡、随机情境顺序 |
| [Aatman1571/Soc-Simulation-Game](https://github.com/Aatman1571/Soc-Simulation-Game) | 训练模拟：资源管理、威胁优先级、评分、徽章 | 信用分、关卡完成度、练习/作业评分 |
| [Jooozen/basketball-iq-trainer](https://github.com/Jooozen/basketball-iq-trainer) | 5 领域系统化训练、错题复习、进度看板 | 9 关 × 4 情境、概念/公式/模型/练习/作业闭环 |
| [wAImlim/zheng-he-leadership-simulation](https://github.com/wAImlim/zheng-he-leadership-simulation) | 领导力评估游戏：情境选择即画像 | 角色专属课程、选择即获得维度增长 |
| [rbundock/executive-evasion](https://github.com/rbundock/executive-evasion) | 技术领导力情境模拟 | 空降角色“用专业破冰”课程 |
| [kerrishaus/supermarket](https://github.com/kerrishaus/supermarket) | 管理模拟、运营决策 | 资源有限下的取舍练习 |
| [tiptopparamaribo-byte/jci-unify-challenge](https://github.com/tiptopparamaribo-byte/jci-unify-challenge) | 浏览器多人项目管理模拟 | 无职权影响力、跨部门协作情境 |
| [TTMK7777/business-simulation-game-v2](https://github.com/TTMK7777/business-simulation-game-v2) | TypeScript + Vite 业务模拟 | 同技术栈下的情境数据驱动结构 |
| [Smart-Ink/cowboy-simulator](https://github.com/Smart-Ink/cowboy-simulator) | 管理模拟、资源分配 | 创业角色的取舍与梯队建设 |

## 既有参照文档中的补充项目

- [prabapro/decision-lab](https://github.com/prabapro/decision-lab)：限时决策、情境反馈、评分复盘 → 36 情境“选择→结果→知识点→信用分”闭环。
- [Kashee12345/coach-up](https://github.com/Kashee12345/coach-up)：逐选项反馈 + 教练原则 → 每题反馈与知识点索引。
- [kevnb40-art/Scenario-Coach](https://github.com/kevnb40-art/Scenario-Coach)：分步教练引导 → “情境→概念→公式→模型→举一反三→练习→作业”七步教学。
- [SamirSaad786/the-hire-wire](https://github.com/SamirSaad786/the-hire-wire)：限预算组建团队 → 导师选择补短板机制。
- [PlanForwardTraining/Communication-Training-Simulator-Project-Manager](https://github.com/PlanForwardTraining/Communication-Training-Simulator-Project-Manager)：场景化训练验收标准 → 作业关键词评分。

## 借鉴原则

1. 只借鉴交互结构、反馈闭环与训练机制，不复制任何仓库代码或文案。
2. 所有借鉴机制必须落进本模块的可运行代码与自动化测试。
3. 每类角色 36 个情境、9 个关卡，均采用“情境→概念→公式→模型→举一反三→练习→作业”的完整学习路径。
