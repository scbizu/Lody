# 为嵌套 diff 滚动测试提供 Android 宿主

Status: implemented
Date: 2026-10-03
Translation: current

[English](2026-10-03-capacitor-scroll-probe.md)

## 摘要

浏览器滚轮验证确认了嵌套模态的指针作用域问题，但用户报告的是 Android
触摸输入。独立的合成 Capacitor 宿主导入真实抽屉实现，在新的模态树中比较 body
Portal 和修复后的容器。仅在 fork 运行的 workflow 构建 Debug APK，不使用产品凭证
或发布签名密钥。这提供了设备排查入口，并不等于完整 Lody 移动端应用；实际 Android
观察结果仍待验证。

## 决策

公开仓库包含能识别 Capacitor 的共享 UI，没有移动端应用宿主。测试宿主放在
components 测试目录，使用独立 npm 依赖闭包固定 Capacitor 8.0.0，并生成 Android
工程。不引入私有应用源码或新的根 workspace 包。根 workspace 提供 React、Vite、
StyleX、Tailwind 和真实抽屉依赖图。

模式选择为每组比较创建新的会话模态，只切换内层内容组件：修复前使用
`Drawer.Content`，修复后使用 `SessionMobileDiffDrawerContent`。滚动位置和有效
pointer events 可以读取，不修改命中行为。诊断控件位于 diff 外、外层会话模态内。

Workflow 限定在 `scbizu/Lody` 的独立测试分支，使用只读仓库权限，上传 Debug APK、
源码 SHA 和校验值。它不修改上游修复分支，也不发布 Release。生成的 Android
源码、本地文件和构建产物保持忽略。

已有[Portal 修复记录](../bug-fix/2026-10-03-mobile-diff-portal-scope.zh.md)和
[测试说明](../../../../packages/components/tests/capacitor-scroll-probe/README.md)
说明证据及设备测试步骤。

## 验证

本地生产 Web 构建、宿主类型检查、修改文件 lint/format 和生成的 Android 配置通过，
已有抽屉套件 17 项测试通过。根目录 `pnpm format` 通过；`pnpm check` 及边界/文档
检查仍受无关 ACP 子模块未初始化影响，没有涉及本次文件的文档错误。本轮 Computer
Use 无法取得 Lody/Dia 窗口，因此不声称新宿主的浏览器交互已验证。
本机缺少 Android SDK/JDK，因此 APK
编译通过 GitHub Actions 运行。构建成功不证明触摸行为正确；报告中的 Android 16 /
WebView 155 环境仍需手动验证。
