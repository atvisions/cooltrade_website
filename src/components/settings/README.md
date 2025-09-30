# Settings 组件架构说明

## 📁 目录结构

```
src/components/settings/
├── SettingsPage.vue          # 主设置页面组件
├── SettingsPageOld.vue       # 原始组件备份
├── README.md                 # 本说明文件
└── tabs/                     # 子组件目录
    ├── ProfileTab.vue        # 主页信息TAB
    ├── PrivacyTab.vue        # 隐私设置TAB
    ├── RiskTab.vue           # 风险偏好TAB
    ├── SecurityTab.vue       # 安全设置TAB
    └── BillingTab.vue        # 账单管理TAB
```

## 🎯 组件拆分的优势

### 1. **可维护性**
- 每个TAB独立为单独的组件，代码更清晰
- 单个文件代码量控制在300行以内
- 功能模块化，便于定位和修改问题

### 2. **可扩展性**
- 新增TAB只需创建新组件并在主组件中注册
- 每个TAB的功能可以独立开发和测试
- 支持按需加载，提升性能

### 3. **团队协作**
- 不同开发者可以同时开发不同的TAB
- 减少代码冲突的可能性
- 便于代码审查和版本控制

## 🔧 技术实现

### 1. **组件通信**
- 使用 Vue 3 的 `provide/inject` 机制
- 主组件提供数据和方法，子组件注入使用
- 保持数据的单一来源和统一管理

### 2. **状态持久化**
- TAB状态保存到 `localStorage`
- 刷新页面后保持当前选中的TAB
- 用户体验更加友好

### 3. **动态组件渲染**
```vue
<component 
  :is="currentTabComponent" 
  v-if="currentTabComponent"
/>
```

## 📋 各TAB功能说明

### ProfileTab.vue - 主页信息
- 头像上传和管理
- 基本信息编辑（显示名称、用户称谓）
- 联系信息管理（手机、真实姓名、个人简介）
- 社交媒体链接设置

### PrivacyTab.vue - 隐私设置
- 主页信息可见性控制
- 数据使用偏好设置
- 账户隐私管理

### RiskTab.vue - 风险偏好
- 风险评估问卷
- 当前风险等级显示
- 交易偏好参数设置

### SecurityTab.vue - 安全设置
- 密码修改
- 用户名修改
- 邮箱修改（包含验证码流程）

### BillingTab.vue - 账单管理
- 当前订阅计划显示
- 使用统计信息
- 付费记录查看

## 🔄 数据流向

```
SettingsPage.vue (主组件)
├── 定义所有数据和方法
├── 通过 provide 提供给子组件
└── 子组件通过 inject 获取需要的数据和方法

localStorage
├── settings_active_tab (当前激活的TAB)
├── profile_visibility (隐私设置)
├── data_usage_preferences (数据使用偏好)
├── account_privacy (账户隐私)
├── risk_answers (风险评估答案)
├── trading_preferences (交易偏好)
└── user_info (用户信息)
```

## 🚀 使用方法

### 添加新的TAB

1. **创建新组件**
```bash
# 在 tabs/ 目录下创建新组件
touch src/components/settings/tabs/NewTab.vue
```

2. **在主组件中注册**
```javascript
// SettingsPage.vue
import NewTab from './tabs/NewTab.vue'

const settingsTabs = ref([
  // ... 其他TAB
  {
    id: 'new',
    name: '新功能',
    description: '新功能的描述',
    icon: NewIcon,
    component: NewTab
  }
])
```

3. **提供必要的数据和方法**
```javascript
// 在主组件中定义数据和方法
const newFeatureData = ref({})
const newFeatureMethod = () => {}

// 提供给子组件
provide('newFeatureData', newFeatureData)
provide('newFeatureMethod', newFeatureMethod)
```

### 修改现有TAB

直接编辑对应的子组件文件即可，无需修改主组件。

## 📝 开发规范

### 1. **命名规范**
- 组件文件名使用 PascalCase：`ProfileTab.vue`
- TAB ID 使用 kebab-case：`'profile'`
- 数据和方法使用 camelCase：`profileForm`

### 2. **代码组织**
- 每个子组件控制在300行以内
- 复杂逻辑可以提取为独立的 composable
- 保持组件的单一职责原则

### 3. **数据管理**
- 所有状态在主组件中统一管理
- 子组件只负责展示和用户交互
- 使用 localStorage 进行数据持久化

## 🔍 调试和测试

### 查看当前TAB状态
```javascript
// 在浏览器控制台中执行
console.log(localStorage.getItem('settings_active_tab'))
```

### 重置所有设置
```javascript
// 清除所有设置相关的localStorage
Object.keys(localStorage)
  .filter(key => key.startsWith('settings_') || 
                 key.includes('profile_') || 
                 key.includes('risk_') ||
                 key.includes('trading_'))
  .forEach(key => localStorage.removeItem(key))
```

## 🎉 总结

通过组件拆分，我们实现了：
- ✅ 代码模块化和可维护性提升
- ✅ TAB状态持久化
- ✅ 更好的开发体验和团队协作
- ✅ 性能优化和按需加载
- ✅ 清晰的架构和数据流向

这种架构为后续的功能扩展和维护提供了良好的基础。
