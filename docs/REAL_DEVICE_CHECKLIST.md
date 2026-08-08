# 真机与跨设备验收清单

## 真机无障碍（VoiceOver / TalkBack）

- iOS Safari：全文朗读建档 → 能力图 → 主线 → 训练 → 1v1。
- Android Chrome：TalkBack 聚焦顺序完整，无未命名按钮。
- 大字体 200%：菜单、地图、剧情、报告无横向溢出。
- 横屏与深色模式切换后无元素重叠。

## 跨浏览器 / 跨设备存档恢复

- 自动回归：`npm run save-roundtrip`（导出 → 导入往返，含进度哈希校验），已纳入 CI。
- 手工矩阵：Chrome / Edge / Safari 之间互导存档 JSON 与复制链接。
- PWA 离线安装后：清除缓存再打开，确认 Service Worker 版本戳更新且旧缓存被清理。

## 状态

- axe 桌面/手机 8 视图：0 违规（已自动回归）。
- 真机 VoiceOver / TalkBack：待真机执行。
