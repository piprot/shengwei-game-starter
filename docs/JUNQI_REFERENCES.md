# 军棋推演设计参考

状态：2026-08-11。影视剧切片功能移除后，地图入口改为军棋推演。实现前检索并参照以下 GitHub 项目。

## 参照项目

### 1. samuelyuan/online-junqi
- 地址：https://github.com/samuelyuan/online-junqi
- 模式：浏览器实时军棋，双人 1v1，25 枚棋子/方，隐藏对手军衔，工兵排雷、炸弹同归、夺取军旗获胜。
- 借鉴点：军衔比较、炸弹/地雷/军旗规则、隐藏军衔带来的不确定性，以及棋子可移动性判断。

### 2. chengxg/junqi-client-vue
- 地址：https://github.com/chengxg/junqi-client-vue
- 模式：Vue 军棋客户端，支持排兵布阵与对抗。
- 借鉴点：军棋 UI 以棋盘为核心，操作路径为“选子 → 目标格”，并保留布阵环节。

### 3. RenZihou/ArmyChess
- 地址：https://github.com/RenZihou/ArmyChess
- 模式：Qt/C++ 陆军棋，包含初始化、翻转、移动、吃子与胜负判定。
- 借鉴点：把规则拆成独立模块，胜负判定与移动逻辑分离，便于单测锁定。

### 4. colay616/LifeLikeChess
- 地址：https://github.com/colay616/LifeLikeChess
- 模式：多棋种合集，含军棋、斗兽棋等。
- 借鉴点：同一项目内多种棋类共存的模块化组织方式。

## 本仓实现

- `src/core/junqi.ts`：6×6 简化军棋，13 枚/方；司令/军长/师长/旅长/团长/营长/连长/排长/工兵 + 炸弹/地雷/军旗；隐藏 AI 军衔；工兵排雷、炸弹同归、夺旗或对方无可动棋子即胜。
- 领导力能力接入：
  - 排兵布阵：`deploy` 指令，把一枚己方棋子重新部署到后两排空位。
  - 激励员工：`motivate` 指令，指定棋子下一次进攻时军衔 +1。
  - 团队管理：`coordinate` 指令，本回合获得额外一次移动，形成两步协同。
  - 资源调度：`reinforce` 指令，消耗指挥点在后方空位调度一名排长增援。
- 指挥点由玩家存档的能力等级与资源推导，胜场奖励影响力/信任/修炼点，负场消耗精力；统计写入存档并参与云端哈希。
- 单元测试已并入 `npm run test:unit`，浏览器流程加入 `npm run test:features`。
