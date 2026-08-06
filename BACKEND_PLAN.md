# 服务端与云端功能计划

## 当前可运行能力

`server/index.mjs` 已实现：

- WebSocket 房间：`create_room` / `join_room`
- 自动匹配：`match`，满两人自动开房
- 账号：`register` / `login`
- 云存档：`cloud_save`
- 排行榜：`leaderboard`
- 1v1 回合转发：`pick`
- WebRTC 信令转发：`signal`
- 本地 JSON 持久化：`server/data/store.json`

## 本地运行

```bash
npm install
npm run server
```

默认地址：`ws://127.0.0.1:8080`

## 前端接入

客户端适配器：

- `src/net/roomClient.ts`
- 通过 `VITE_ROOM_SERVER_URL` 指定服务器地址

建议下一步：

1. 在 1v1 大厅加入“云端匹配”按钮
2. 建档时加入“云账号”绑定
3. 报告页加入“云端存档”与“公开排行榜”
4. 用服务端 `signal` 替代当前手动 WebRTC 信令

## 部署建议

可使用 Render / Fly.io / Railway 等平台部署 Node 服务：

- 启动命令：`npm run server`
- 端口：`PORT=8080`
- 持久化：当前使用本地 JSON，正式环境应替换为 PostgreSQL 或 Redis
- 前端构建时注入 `VITE_ROOM_SERVER_URL`

## 安全与生产化

上线前必须补齐：

- Token 签名与刷新
- HTTPS / WSS
- 房间生命周期清理
- 数据校验与限流
- 数据库迁移与备份
- 排行榜防刷

## 当前状态

工程骨架已可本地运行，但尚未部署到公网，也尚未在正式环境接入数据库。
