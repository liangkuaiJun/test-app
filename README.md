# 日本語単語トレーナー (React Native)

一个简洁的 iOS / Android 双端日语单词记忆应用示例，包含基础的间隔重复（SRS）逻辑与 JLPT 分级筛选。

## 功能
- **闪卡练习**：点击卡片查看释义与例句，并通过“再来一次 / 较难 / 普通 / 简单”四档按钮标记熟练度。
- **间隔重复**：使用 `AsyncStorage` 记录每个单词的 SRS 阶段与下次复习时间。
- **单词列表**：按 JLPT 等级筛选查看全部词条与当前进度。

## 运行
1. 安装依赖：
   ```bash
   npm install
   # 或
   yarn install
   ```
2. 启动开发服务：
   ```bash
   npm run start
   ```
   使用 Expo Go 扫码预览，或通过 `npm run ios` / `npm run android` 在模拟器中运行。

## 主要文件
- `App.tsx`：顶层 UI，包含模式切换、筛选与布局。
- `components/Flashcard.tsx`：闪卡展示与评分按钮。
- `components/WordList.tsx`：词汇列表、进度与筛选显示。
- `hooks/useSpacedRepetition.ts`：SRS 状态管理与本地存储。
- `data/words.ts`：示例词库（可自行扩展）。
