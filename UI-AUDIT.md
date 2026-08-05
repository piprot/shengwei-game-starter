# Neon Chase UI/UX Audit

依据 `gamestudio/references/ui-ux-audit.md` 对当前 HUD 做基础审计。

## 已检查

- 当前战斗 HUD 信息：仅 `Score`
- 开始提示：`Tap or Click to Start`
- 玩家目标：收集宝石、躲避敌人
- 成功反馈：宝石粒子、计分缩放、音效
- 失败反馈：震屏、玩家闪白、Game Over 文案、音效
- 移动端输入：支持触摸拖拽
- 程序化浏览器检查：
  - 1280x720：无滚动，Canvas 满屏
  - 720x1280：无横向滚动，Canvas 全宽，竖向有上下黑边
  - 1080x2400：无横向滚动，Canvas 全宽，竖向有上下黑边

## 问题

- P2：当前没有正式触控按钮，依赖全屏拖拽；在窄屏上误触风险未实测
- P2：HUD 文字没有描边或底板，在复杂背景下可读性未实测
- P2：竖屏下 Canvas 只占视口约一半高度，上下黑边较大
- P3：尚无中文/日文/韩文长文本测试
- P3：尚未在真实手机分辨率或安全区截图中验证

## 未验证

- 720x1280 / 1080x2400 真机截图
- 刘海屏、手势条、系统导航栏
- 中英日韩长文本溢出
- 真实触控点击热区

==========

UI Score

Readable
7/10

UX
7/10

Accessibility
6/10

Commercial
8/10

Retention
7/10

Google Play Risk
3/10

==========

Priority

P0
无

P1
无

P2
为 HUD 增加描边或底板，并在窄屏上验证触控热区

P3
补充多语言长文本和真实手机截图

P4
后续加入正式美术和动效
