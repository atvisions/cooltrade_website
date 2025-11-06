# Bots 模块

统一管理机器人和信号相关的所有页面、组件和业务逻辑。

## 📁 目录结构

### `pages/`
主要页面组件，对应路由。

- **BotListPage.vue** - 机器人列表页（原 BotPage.vue）
- **SignalBotMonitorPage.vue** - 信号监控页（使用 PrimeVue 重构）
- **CreateBotPage.vue** - 创建机器人页（使用 PrimeVue 重构）
- **CreateSignalBotPage.vue** - 创建信号机器人页（使用 PrimeVue 重构）
- **BotDetailPage.vue** - 机器人详情页（新建）

### `components/`
可复用的业务组件。

- **BotCard.vue** - 机器人卡片
- **BotTable.vue** - 机器人表格
- **SignalTable.vue** - 信号表格
- **BotFilter.vue** - 机器人筛选器
- **BotStats.vue** - 机器人统计卡片
- **SignalStats.vue** - 信号统计卡片

### `composables/`
提取的业务逻辑（Composition API）。

- **useBotList.js** - 机器人列表逻辑
  - 获取机器人列表
  - 筛选、排序、分页
  - 启动、停止、删除机器人

- **useSignalMonitor.js** - 信号监控逻辑
  - 获取信号列表
  - 实时更新信号
  - 统计信号数据

- **useBotForm.js** - 机器人表单逻辑
  - 表单验证
  - 创建/编辑机器人
  - 处理表单提交

### `types/`
TypeScript 类型定义。

- **bot.ts** - 机器人类型
- **signal.ts** - 信号类型

## 🚀 使用示例

### 在页面中使用组件

```vue
<template>
  <div>
    <BotStats :stats="statistics" />
    <BotFilter v-model="filters" @change="handleFilterChange" />
    <BotTable :data="bots" :loading="loading" @action="handleAction" />
  </div>
</template>

<script setup>
import { useBotList } from '../composables/useBotList'
import BotStats from '../components/BotStats.vue'
import BotFilter from '../components/BotFilter.vue'
import BotTable from '../components/BotTable.vue'

const { bots, statistics, loading, fetchBots } = useBotList()

onMounted(() => {
  fetchBots()
})
</script>
```

## 📝 迁移进度

- [ ] 创建 BotListPage.vue
- [ ] 创建 SignalBotMonitorPage.vue
- [ ] 创建 CreateBotPage.vue
- [ ] 创建 CreateSignalBotPage.vue
- [ ] 创建 BotCard.vue
- [ ] 创建 BotTable.vue
- [ ] 创建 SignalTable.vue
- [ ] 创建 BotFilter.vue
- [ ] 创建 BotStats.vue
- [ ] 创建 SignalStats.vue
- [ ] 创建 useBotList.js
- [ ] 创建 useSignalMonitor.js
- [ ] 创建 useBotForm.js
- [ ] 更新路由
- [ ] 删除旧目录

## 🎯 设计原则

1. **单一职责** - 每个文件只做一件事
2. **可复用性** - 组件和逻辑可以在多个地方使用
3. **易于测试** - 业务逻辑与 UI 分离
4. **易于维护** - 代码结构清晰，易于理解

## 📚 相关文档

- `docs/NEW_DIRECTORY_STRUCTURE.md` - 新目录结构规划
- `docs/UI_COMPONENTS_GUIDE.md` - UI 组件使用指南
- `docs/PRIMEVUE_REFACTOR_PLAN.md` - PrimeVue 重构计划

