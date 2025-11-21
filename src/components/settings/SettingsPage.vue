<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="settings" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">设置</h1>
          <p class="text-gray-600 mt-2">管理您的账户设置和偏好</p>
        </div>

        <!-- Tab导航 -->
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in settingsTabs"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                :class="[
                  'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                <component :is="tab.icon" class="w-4 h-4" />
                <span>{{ tab.name }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- 内容区域 -->
        <div>
          <!-- 动态组件渲染 -->
          <component
            :is="currentTabComponent"
            v-if="currentTabComponent"
          />
        </div>
        </main>
      </div>
    </div>

    <!-- 参数对比弹窗 -->
    <ParamsComparisonModal
      :show="showComparisonModal"
      :currentParams="tradingPreferences"
      :recommendedParams="recommendedParams"
      :oldRiskType="oldRiskType"
      :newRiskType="getCurrentRiskType()"
      @close="closeComparisonModal"
      @applied="handleParamsApplied"
      @kept="handleParamsKept"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import ParamsComparisonModal from './ParamsComparisonModal.vue'
import notification from '../../utils/notification.js'
import { userAPI, botAPI, apiRequest } from '../../utils/api.js'
import { useUserStore } from '../../utils/userStore.js'

const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 导入子组件
import ProfileTab from './tabs/ProfileTab.vue'
import PrivacyTab from './tabs/PrivacyTab.vue'
import RiskTab from './tabs/RiskTab.vue'
import SecurityTab from './tabs/SecurityTab.vue'
import BillingTab from './tabs/BillingTab.vue'

// 导入图标
import {
  UserIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ScaleIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

// 当前激活的标签页 - 支持 URL 参数
const activeTab = ref(route.query.tab || localStorage.getItem('settings_active_tab') || 'profile')

// 监听路由变化，支持从其他页面跳转时切换标签
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
    localStorage.setItem('settings_active_tab', newTab)
  }
})

// 设置活跃标签页并保存到localStorage
const setActiveTab = (tabId) => {
  activeTab.value = tabId
  localStorage.setItem('settings_active_tab', tabId)
}

// 标签页配置 - 使用 markRaw 避免组件被响应式化
const settingsTabs = [
  {
    id: 'profile',
    name: '主页信息',
    description: '管理您的公开主页展示信息',
    icon: UserIcon,
    component: markRaw(ProfileTab)
  },
  {
    id: 'privacy',
    name: '隐私设置',
    description: '控制您的信息可见性和隐私偏好',
    icon: EyeSlashIcon,
    component: markRaw(PrivacyTab)
  },
  {
    id: 'risk',
    name: '风险偏好',
    description: '设置您的风险承受能力和交易偏好',
    icon: ScaleIcon,
    component: markRaw(RiskTab)
  },
  {
    id: 'security',
    name: '安全设置',
    description: '管理密码、邮箱和账户安全',
    icon: ShieldCheckIcon,
    component: markRaw(SecurityTab)
  },
  {
    id: 'billing',
    name: '账单管理',
    description: '查看订阅和付费记录',
    icon: CreditCardIcon,
    component: markRaw(BillingTab)
  }
]

// 当前标签页组件
const currentTabComponent = computed(() => {
  const tab = settingsTabs.find(t => t.id === activeTab.value)
  return tab ? tab.component : null
})

// 使用全局用户状态
const userStore = useUserStore()

// 用户信息
const userInfo = ref({
  username: 'testuser',
  email: 'test@example.com',
  avatar: null,
  phone: '',
  wechatId: '',
  bio: '',
  telegram: '',
  twitter: '',
  website: '',
  location: '',
  joinDate: '2024-01-15'
})

// 计算用户名首字母
const userInitial = computed(() => {
  return userInfo.value.username ? userInfo.value.username.charAt(0).toUpperCase() : 'U'
})

// 个人资料表单
const profileForm = ref({
  username: '',
  email: '',
  phone: '',
  wechatId: '',
  bio: '',
  telegram: '',
  twitter: '',
  website: ''
})

const profileLoading = ref(false)

// 隐私设置（使用下划线命名以匹配后端）
const profileVisibility = ref({
  bio: true,
  phone: false,
  email: false,
  wechat_id: false,
  telegram: true,
  twitter: true,
  website: true,
  stats: true,
  followers: true,
  following: true
})

// 数据使用偏好
const dataUsagePreferences = ref({
  personalization: true,
  analytics: true,
  marketing: false
})

// 账户隐私设置
const accountPrivacy = ref({
  searchable: true,
  showOnlineStatus: true,
  allowMessages: true
})

// 风险评估相关数据
const riskQuestions = ref([
  {
    question: "您的投资经验如何？",
    type: 'single',
    options: [
      { text: "新手，刚开始投资", value: 1 },
      { text: "有一些经验，投资1-3年", value: 2 },
      { text: "经验丰富，投资3-5年", value: 3 },
      { text: "专业投资者，5年以上经验", value: 4 }
    ]
  },
  {
    question: "您能承受多大的投资损失？",
    type: 'single',
    options: [
      { text: "不能承受任何损失", value: 1 },
      { text: "可以承受5%以内的损失", value: 2 },
      { text: "可以承受10-20%的损失", value: 3 },
      { text: "可以承受20%以上的损失", value: 4 }
    ]
  },
  {
    question: "您的投资目标是什么？",
    type: 'single',
    options: [
      { text: "保值，避免通胀", value: 1 },
      { text: "稳健增长，年化5-10%", value: 2 },
      { text: "积极增长，年化10-20%", value: 3 },
      { text: "高收益，愿意承担高风险", value: 4 }
    ]
  },
  {
    question: "您的投资期限是多久？",
    type: 'single',
    key: 'investmentHorizon',
    options: [
      { text: "短期（3个月内）", value: 'short', description: '快进快出，追求短期收益' },
      { text: "中期（3-12个月）", value: 'medium', description: '中期持有，平衡风险收益' },
      { text: "长期（1年以上）", value: 'long', description: '长期投资，看好项目发展' }
    ]
  },
  {
    question: "您更关注哪类项目？（可多选）",
    type: 'multiple',
    key: 'preferredCategories',
    options: [
      { text: "DeFi", value: 'DeFi', icon: '💰', description: '去中心化金融' },
      { text: "Layer1/Layer2", value: 'Layer1', icon: '⛓️', description: '公链和扩容方案' },
      { text: "NFT", value: 'NFT', icon: '🎨', description: '数字艺术和收藏品' },
      { text: "GameFi", value: 'GameFi', icon: '🎮', description: '链游和元宇宙' },
      { text: "AI", value: 'AI', icon: '🤖', description: 'AI相关项目' },
      { text: "Meme", value: 'Meme', icon: '🐕', description: 'Meme币和社区币' }
    ]
  },
  {
    question: "您偏好的市值规模？",
    type: 'single',
    key: 'marketCapPreference',
    options: [
      { text: "大盘币", value: 'large', description: '市值>100亿，稳定但收益有限' },
      { text: "中盘币", value: 'medium', description: '市值10-100亿，平衡风险收益' },
      { text: "小盘币", value: 'small', description: '市值<10亿，高风险高收益' },
      { text: "混合配置", value: 'mixed', description: '大中小盘合理配置' }
    ]
  }
])

const riskAnswers = ref([null, null, null, null, [], null])
const riskAssessmentDate = ref(null)
// 存储从后端加载的风险类型（优先使用这个，而不是从答案计算）
const savedRiskProfile = ref(null)
const riskScore = ref(0)
const riskLevel = ref('moderate')

// 参数对比弹窗相关
const showComparisonModal = ref(false)
const recommendedParams = ref({})
const oldRiskType = ref('')

// 交易偏好设置
const tradingPreferences = ref({
  maxSingleInvestment: 10,      // 单币种最大仓位 (%)
  maxTotalPositions: 5,          // 最大持仓数量
  minPositionSize: 100,          // 最小建仓金额 (USDT)
  maxPositionSize: 5000,         // 最大头寸大小 (USDT)
  maxTotalPosition: 10000,       // 最大总仓位 (USDT)
  maxDailyLoss: 500,             // 每日最大亏损 (USDT)
  maxDrawdownPercentage: 20,     // 最大回撤百分比 (%)
  stopLoss: 5,                   // 止损比例 (%)
  takeProfit: 15,                // 止盈比例 (%)
  slippageTolerance: 1,          // 滑点容忍度 (%)
  maxDailyTrades: 10,            // 每日最大交易次数
  maxLeverage: 5,                // 最大杠杆倍数
  circuitBreakerEnabled: true,   // 熔断机制启用
  circuitBreakerLoss: 1000,      // 熔断触发亏损 (USDT)
  frequency: 'moderate'          // 交易频率
})

const tradingPreferencesLoading = ref(false)

// 根据风险类型的推荐值和限制范围
const riskBasedLimits = {
  conservative: {
    maxSingleInvestment: { min: 1, max: 10, recommended: 5 },
    maxTotalPositions: { min: 1, max: 3, recommended: 2 },
    minPositionSize: { min: 100, max: 1000, recommended: 500 },
    maxPositionSize: { min: 1000, max: 5000, recommended: 2000 },
    stopLoss: { min: 1, max: 5, recommended: 3 },
    takeProfit: { min: 5, max: 15, recommended: 10 },
    slippageTolerance: { min: 0.5, max: 1, recommended: 0.5 },
    maxDailyTrades: { min: 1, max: 5, recommended: 2 },
    maxLeverage: { min: 1, max: 5, recommended: 2 },
    circuitBreakerLoss: { min: 500, max: 2000, recommended: 1000 }
  },
  moderate: {
    maxSingleInvestment: { min: 5, max: 20, recommended: 10 },
    maxTotalPositions: { min: 2, max: 5, recommended: 3 },
    minPositionSize: { min: 100, max: 1000, recommended: 300 },
    maxPositionSize: { min: 2000, max: 10000, recommended: 5000 },
    stopLoss: { min: 3, max: 10, recommended: 5 },
    takeProfit: { min: 10, max: 30, recommended: 15 },
    slippageTolerance: { min: 0.5, max: 2, recommended: 1 },
    maxDailyTrades: { min: 2, max: 10, recommended: 5 },
    maxLeverage: { min: 2, max: 10, recommended: 5 },
    circuitBreakerLoss: { min: 1000, max: 5000, recommended: 2000 }
  },
  aggressive: {
    maxSingleInvestment: { min: 10, max: 50, recommended: 25 },
    maxTotalPositions: { min: 3, max: 10, recommended: 5 },
    minPositionSize: { min: 50, max: 1000, recommended: 100 },
    maxPositionSize: { min: 5000, max: 50000, recommended: 20000 },
    stopLoss: { min: 5, max: 30, recommended: 15 },
    takeProfit: { min: 20, max: 100, recommended: 50 },
    slippageTolerance: { min: 1, max: 3, recommended: 2 },
    maxDailyTrades: { min: 5, max: 20, recommended: 10 },
    maxLeverage: { min: 5, max: 125, recommended: 25 },
    circuitBreakerLoss: { min: 2000, max: 10000, recommended: 5000 }
  }
}

// 安全设置相关数据
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordLoading = ref(false)

const usernameForm = ref({
  newUsername: '',
  currentPassword: ''
})

const usernameLoading = ref(false)

const usernameChangeInfo = ref({
  canChange: true,
  lastChangeDate: null,
  daysUntilNext: 0,
  message: ''
})

const emailChangeForm = ref({
  newEmail: '',
  currentPassword: '',
  verificationCode: ''
})

const emailChangeLoading = ref(false)
const emailVerificationSent = ref(false)
const resendCountdown = ref(0)

// 账单管理相关数据
const currentPlan = ref({
  name: '专业版',
  description: '适合专业交易者的完整功能',
  price: '¥299',
  billingCycle: 'monthly',
  nextBilling: '2024-02-15',
  color: 'bg-blue-600',
  icon: '💼'
})

const usageStats = ref({
  apiCalls: '12,450',
  apiLimit: '50,000',
  strategies: '8',
  strategyLimit: '20',
  storage: '2.3',
  storageLimit: '10'
})

const billingHistory = ref([
  { id: 1, description: '专业版订阅 - 2024年1月', date: '2024-01-01', amount: '¥299', status: 'paid' },
  { id: 2, description: '专业版订阅 - 2023年12月', date: '2023-12-01', amount: '¥299', status: 'paid' }
])

// 提供数据给子组件
provide('userInfo', userInfo)
provide('userInitial', userInitial)
provide('profileForm', profileForm)
provide('profileLoading', profileLoading)
provide('profileVisibility', profileVisibility)
provide('dataUsagePreferences', dataUsagePreferences)
provide('accountPrivacy', accountPrivacy)
provide('riskQuestions', riskQuestions)
provide('riskAnswers', riskAnswers)
provide('riskAssessmentDate', riskAssessmentDate)
provide('riskScore', riskScore)
provide('riskLevel', riskLevel)
provide('tradingPreferences', tradingPreferences)
provide('tradingPreferencesLoading', tradingPreferencesLoading)
provide('passwordForm', passwordForm)
provide('passwordLoading', passwordLoading)
provide('usernameForm', usernameForm)
provide('usernameLoading', usernameLoading)
provide('usernameChangeInfo', usernameChangeInfo)
provide('emailChangeForm', emailChangeForm)
provide('emailChangeLoading', emailChangeLoading)
provide('emailVerificationSent', emailVerificationSent)
provide('resendCountdown', resendCountdown)
provide('currentPlan', currentPlan)
provide('usageStats', usageStats)
provide('billingHistory', billingHistory)

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    const response = await userAPI.getProfile()
    if (response.status === 'success') {
      const data = response.data

      // 更新userInfo（使用驼峰命名）
      userInfo.value = {
        username: data.username || '',
        email: data.email || '',
        avatar: data.avatar || null,
        phone: data.phone || '',
        wechatId: data.wechat_id || '',  // 转换为驼峰命名
        bio: data.bio || '',
        telegram: data.telegram || '',
        twitter: data.twitter || '',
        website: data.website || '',
        location: data.location || '',
        joinDate: data.created_at || ''
      }

      // 更新profileForm
      profileForm.value = {
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        wechatId: data.wechat_id || '',
        bio: data.bio || '',
        telegram: data.telegram || '',
        twitter: data.twitter || '',
        website: data.website || ''
      }

      // 更新localStorage
      localStorage.setItem('user_info', JSON.stringify(data))
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取用户名修改状态
const fetchUsernameChangeStatus = async () => {
  try {
    // 调用后台接口获取用户名修改状态
    const response = await userAPI.getUsernameChangeStatus()
    if (response.status === 'success') {
      usernameChangeInfo.value = {
        canChange: response.data.can_change,
        lastChangeDate: response.data.last_change_date,
        daysUntilNext: response.data.days_until_next,
        message: response.data.message || ''
      }
    }
  } catch (error) {
    console.error('获取用户名修改状态失败:', error)
    // 如果接口调用失败，设置默认状态
    usernameChangeInfo.value = {
      canChange: false,
      lastChangeDate: null,
      daysUntilNext: 0,
      message: '无法获取用户名修改状态，请稍后重试'
    }
  }
}

// 主要方法定义
const updateProfile = async () => {
  profileLoading.value = true
  try {
    // 准备要更新的数据（使用下划线命名）
    const updateData = {
      username: profileForm.value.username,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
      wechat_id: profileForm.value.wechatId,  // 转换为下划线命名
      bio: profileForm.value.bio,
      telegram: profileForm.value.telegram,
      twitter: profileForm.value.twitter,
      website: profileForm.value.website
    }

    // 调用API更新
    const response = await userAPI.updateProfile(updateData)

    if (response.status === 'success') {
      // 更新本地用户信息
      Object.assign(userInfo.value, profileForm.value)

      // 更新localStorage
      localStorage.setItem('user_info', JSON.stringify(response.data))

      notification.success('个人资料更新成功', '保存成功')
    } else {
      notification.error(response.message || '更新失败', '错误')
    }
  } catch (error) {
    console.error('更新个人资料失败:', error)
    notification.error('更新失败，请重试', '错误')
  } finally {
    profileLoading.value = false
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件大小
  if (file.size > 1024 * 1024) {
    notification.warning('图片大小不能超过1MB', '文件过大')
    return
  }

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    notification.warning('只支持 JPG, PNG, GIF 格式的图片', '文件格式错误')
    return
  }

  try {
    profileLoading.value = true

    // 先预览图片
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)

    // 调用API上传头像
    const response = await userAPI.uploadAvatar(file)

    if (response.status === 'success') {
      // 更新头像URL为服务器返回的URL
      userInfo.value.avatar = response.data.avatar_url

      // 重新获取用户信息以确保数据同步
      await fetchUserProfile()

      // 更新全局用户状态，触发所有组件更新
      userStore.updateAvatar(response.data.avatar_url)

      notification.success('头像上传成功', '上传成功')
    } else {
      throw new Error(response.message || '上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    notification.error(error.message || '头像上传失败，请重试', '上传错误')

    // 恢复原头像
    await fetchUserProfile()
  } finally {
    profileLoading.value = false
  }
}

// 隐私设置方法
const getVisibilityLabel = (key) => {
  const labels = {
    bio: '个人简介',
    phone: '手机号码',
    email: '邮箱地址',
    wechat_id: '微信号',
    telegram: 'Telegram',
    twitter: 'Twitter',
    website: '个人网站',
    stats: '统计信息',
    followers: '关注者列表',
    following: '关注列表'
  }
  return labels[key] || ''
}

const getVisibilityDescription = (key) => {
  const descriptions = {
    bio: '在您的主页上显示个人简介',
    phone: '允许其他用户看到您的手机号码',
    email: '允许其他用户看到您的邮箱地址',
    wechat_id: '在主页上显示您的微信号',
    telegram: '显示您的Telegram联系方式',
    twitter: '显示您的Twitter账号',
    website: '显示您的个人网站链接',
    stats: '显示您的统计信息（策略数、关注数、收益率）',
    followers: '允许他人查看您的关注者列表',
    following: '允许他人查看您的关注列表'
  }
  return descriptions[key] || ''
}

const toggleVisibility = async (key) => {
  const newValue = !profileVisibility.value[key]
  profileVisibility.value[key] = newValue

  // 保存到后端
  try {
    const response = await userAPI.updatePrivacySettings({
      profile_visibility: profileVisibility.value
    })

    if (response.status === 'success') {
      localStorage.setItem('profile_visibility', JSON.stringify(profileVisibility.value))
      notification.success('隐私设置已更新', '设置成功')
    } else {
      // 回滚
      profileVisibility.value[key] = !newValue
      notification.error(response.message || '更新失败', '错误')
    }
  } catch (error) {
    // 回滚
    profileVisibility.value[key] = !newValue
    notification.error(error.message || '更新失败', '错误')
  }
}

const toggleDataUsage = (key) => {
  dataUsagePreferences.value[key] = !dataUsagePreferences.value[key]
  localStorage.setItem('data_usage_preferences', JSON.stringify(dataUsagePreferences.value))

  const action = dataUsagePreferences.value[key] ? '启用' : '禁用'
  const labels = {
    personalization: '个性化推荐',
    analytics: '数据分析',
    marketing: '营销通讯'
  }
  notification.success(`已${action}${labels[key]}`, '设置已更新')
}

const toggleAccountPrivacy = (key) => {
  accountPrivacy.value[key] = !accountPrivacy.value[key]
  localStorage.setItem('account_privacy', JSON.stringify(accountPrivacy.value))

  const action = accountPrivacy.value[key] ? '启用' : '禁用'
  const labels = {
    searchable: '允许搜索',
    showOnlineStatus: '显示在线状态',
    allowMessages: '允许私信'
  }
  notification.success(`已${action}${labels[key]}`, '隐私设置已更新')
}

// 风险评估方法
const getCurrentRiskColor = () => {
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return 'bg-green-500'
  if (score <= 8) return 'bg-yellow-500'
  if (score <= 10) return 'bg-orange-500'
  return 'bg-red-500'
}

const getCurrentRiskIcon = () => {
  // 优先使用保存的风险类型
  if (savedRiskProfile.value) {
    const type = savedRiskProfile.value.type
    if (type === '保守型') return '🛡️'
    if (type === '稳健型') return '⚖️'
    if (type === '积极型') return '📈'
    if (type === '激进型') return '🚀'
  }

  // 如果没有保存的类型，从答案计算
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return '🛡️'
  if (score <= 8) return '⚖️'
  if (score <= 10) return '📈'
  return '🚀'
}

const getCurrentRiskType = () => {
  // 优先使用保存的风险类型
  if (savedRiskProfile.value && savedRiskProfile.value.type) {
    return savedRiskProfile.value.type
  }

  // 如果没有保存的类型，从答案计算
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return '保守型'
  if (score <= 8) return '稳健型'
  if (score <= 10) return '积极型'
  return '激进型'
}

const getCurrentRiskDescription = () => {
  // 优先使用保存的风险描述
  if (savedRiskProfile.value && savedRiskProfile.value.description) {
    return savedRiskProfile.value.description
  }

  // 如果没有保存的描述，从答案计算
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return '注重资本保值，偏好低风险投资'
  if (score <= 8) return '追求稳健收益，可承受适度风险'
  if (score <= 10) return '追求较高收益，愿意承担较高风险'
  return '追求最高收益，愿意承担高风险'
}

const resetAssessment = () => {
  riskAnswers.value = [null, null, null, null, [], null]
  riskAssessmentDate.value = null
  savedRiskProfile.value = null
  localStorage.removeItem('risk_answers')
  localStorage.removeItem('risk_assessment_date')
}

// 获取当前风险等级
const getCurrentRiskLevel = () => {
  if (savedRiskProfile.value && savedRiskProfile.value.level) {
    return savedRiskProfile.value.level
  }
  // 如果没有保存的，从答案计算
  const score = riskAnswers.value.slice(0, 3).reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return 'conservative'
  if (score <= 8) return 'moderate'
  return 'aggressive'
}

// 获取参数的推荐值
const getRecommendedValue = (paramName) => {
  const riskLevel = getCurrentRiskLevel()
  return riskBasedLimits[riskLevel]?.[paramName]?.recommended || tradingPreferences.value[paramName]
}

// 获取参数的限制范围
const getParamLimits = (paramName) => {
  const riskLevel = getCurrentRiskLevel()
  return riskBasedLimits[riskLevel]?.[paramName] || { min: 0, max: 100, recommended: 50 }
}

// 验证参数是否在合理范围内
const validateParam = (paramName, value) => {
  const limits = getParamLimits(paramName)
  if (value < limits.min || value > limits.max) {
    return {
      valid: false,
      level: 'error',
      message: `建议范围：${limits.min}-${limits.max}`
    }
  }
  if (Math.abs(value - limits.recommended) > (limits.max - limits.min) * 0.3) {
    return {
      valid: true,
      level: 'warning',
      message: `推荐值：${limits.recommended}`
    }
  }
  return {
    valid: true,
    level: 'success',
    message: '参数合理'
  }
}

// 恢复推荐设置
const restoreRecommendedSettings = () => {
  const riskLevel = getCurrentRiskLevel()
  const limits = riskBasedLimits[riskLevel]

  tradingPreferences.value = {
    maxSingleInvestment: limits.maxSingleInvestment.recommended,
    maxTotalPositions: limits.maxTotalPositions.recommended,
    minPositionSize: limits.minPositionSize.recommended,
    stopLoss: limits.stopLoss.recommended,
    takeProfit: limits.takeProfit.recommended,
    slippageTolerance: limits.slippageTolerance.recommended,
    maxDailyTrades: limits.maxDailyTrades.recommended,
    maxLeverage: limits.maxLeverage.recommended,
    frequency: riskLevel === 'conservative' ? 'conservative' : riskLevel === 'aggressive' ? 'aggressive' : 'moderate'
  }

  notification.success('已恢复推荐设置', '成功')
}

// 从后端加载风险评估数据
const loadRiskAssessment = async () => {
  try {
    const response = await apiRequest(`${API_BASE_URL}/api/auth/risk-assessment/status/`, {
      method: 'GET'
    })

    if (response.status === 'success' && response.data.has_assessment) {
      const profile = response.data.risk_profile

      // 保存风险类型信息（这是最重要的）
      savedRiskProfile.value = {
        level: profile.level,
        type: profile.type,
        description: profile.description,
        investmentPreferences: profile.investment_preferences || {},
        assessmentData: profile.assessment_data || {}  // 保存完整的 assessment_data
      }

      // 设置风险等级和分数
      riskLevel.value = profile.risk_level || profile.level || 'moderate'
      riskScore.value = profile.risk_score || 0

      // 如果有评估数据，更新日期
      if (profile.updated_at) {
        riskAssessmentDate.value = new Date(profile.updated_at).toLocaleDateString('zh-CN')
      }

      // 如果有问卷答案，恢复答案
      if (profile.assessment_data && profile.assessment_data.answers) {
        // 尝试从assessment_data中恢复答案
        const savedAnswers = profile.assessment_data.answers
        if (Array.isArray(savedAnswers)) {
          // 初始化答案数组
          riskAnswers.value = [null, null, null, null, [], null]

          // 恢复每个答案
          savedAnswers.forEach((item, index) => {
            if (index < riskAnswers.value.length) {
              riskAnswers.value[index] = item.answer || item.value || (index === 4 ? [] : null)
            }
          })
        }
      }
    }

    return response  // 返回响应数据供调用者使用
  } catch (error) {
    console.error('加载风险评估失败:', error)
    // 如果API加载失败，尝试从localStorage加载
    const savedRiskAnswers = localStorage.getItem('risk_answers')
    if (savedRiskAnswers) {
      try {
        riskAnswers.value = JSON.parse(savedRiskAnswers)
      } catch (e) {
        console.error('解析localStorage风险评估失败:', e)
      }
    }

    const savedRiskDate = localStorage.getItem('risk_assessment_date')
    if (savedRiskDate) {
      riskAssessmentDate.value = savedRiskDate
    }

    return null  // 返回 null 表示加载失败
  }
}

// 监听路由变化，检查是否需要显示对比弹窗
watch(() => route.query.showComparison, async (showComparison) => {
  if (showComparison === 'true') {
    // 等待数据加载完成
    const response = await loadRiskAssessment()

    // 从 savedRiskProfile 中获取推荐参数
    if (response && response.status === 'success' && savedRiskProfile.value) {
      const assessmentData = savedRiskProfile.value.assessmentData || {}
      const recommended = assessmentData.recommended_params || {}

      if (recommended.max_position_size || recommended.stop_loss_threshold) {
        recommendedParams.value = recommended
        oldRiskType.value = savedRiskProfile.value?.type || getCurrentRiskType()
        showComparisonModal.value = true
      }
    }
  }
}, { immediate: true })

const calculateRiskProfile = async () => {
  try {
    // 计算风险等级（只用前3个问题的分数）
    const totalScore = riskAnswers.value.slice(0, 3).reduce((sum, answer) => sum + (answer || 0), 0)
    let riskLevel = 'moderate'
    let riskType = '稳健型'
    let riskDescription = '追求稳健收益，可承受适度风险'

    if (totalScore <= 4) {
      riskLevel = 'conservative'
      riskType = '保守型'
      riskDescription = '注重资本保值，偏好低风险投资'
    } else if (totalScore <= 8) {
      riskLevel = 'moderate'
      riskType = '稳健型'
      riskDescription = '追求稳健收益，可承受适度风险'
    } else {
      riskLevel = 'aggressive'
      riskType = '激进型'
      riskDescription = '追求最高收益，愿意承担高风险'
    }

    // 提取投资偏好数据
    const investmentPreferences = {
      investmentHorizon: riskAnswers.value[3] || 'medium',  // 投资期限
      preferredCategories: riskAnswers.value[4] || [],      // 偏好类别（数组）
      marketCapPreference: riskAnswers.value[5] || 'mixed'  // 市值偏好
    }

    // 准备提交数据
    const assessmentData = {
      answers: riskAnswers.value.map((answer, index) => ({
        questionIndex: index,
        answer: answer,
        question: riskQuestions.value[index].question,
        key: riskQuestions.value[index].key || null
      })),
      risk_profile: {
        level: riskLevel,
        type: riskType,
        description: riskDescription
      },
      investment_preferences: investmentPreferences
    }

    // 提交到后端API
    const response = await apiRequest(
      `${API_BASE_URL}/api/auth/risk-assessment/submit/`,
      {
        method: 'POST',
        body: JSON.stringify(assessmentData)
      }
    )

    if (response.status === 'success') {
      const now = new Date().toLocaleDateString()
      riskAssessmentDate.value = now

      // 更新保存的风险类型
      savedRiskProfile.value = {
        level: riskLevel,
        type: riskType,
        description: riskDescription
      }

      // 同时保存到localStorage作为备份
      localStorage.setItem('risk_answers', JSON.stringify(riskAnswers.value))
      localStorage.setItem('risk_assessment_date', now)

      notification.success('风险评估已保存到服务器', '评估成功')
    } else {
      notification.error(response.message || '保存失败', '错误')
    }
  } catch (error) {
    console.error('保存风险评估失败:', error)
    notification.error(error.message || '保存失败，请重试', '错误')
  }
}

const saveTradingPreferences = async () => {
  tradingPreferencesLoading.value = true
  try {
    // 1. 保存到 localStorage（用户交易偏好）
    localStorage.setItem('trading_preferences', JSON.stringify(tradingPreferences.value))

    // 2. 同时保存到后端 API（系统风控配置）
    // 需要获取当前的风控配置 ID
    try {
      const riskConfigResponse = await botAPI.getRiskConfig()
      const riskConfig = riskConfigResponse.data?.data || riskConfigResponse.data || riskConfigResponse

      if (riskConfig && riskConfig.id) {
        // 构建要更新的数据
        // max_total_position 自动设置为 max_position_per_bot * 10（支持最多10个机器人）
        const autoMaxTotalPosition = tradingPreferences.value.maxPositionSize * 10

        const updateData = {
          min_position_size: tradingPreferences.value.minPositionSize,
          max_position_per_bot: tradingPreferences.value.maxPositionSize,
          max_total_position: autoMaxTotalPosition,  // 自动计算
          max_leverage: tradingPreferences.value.maxLeverage,
          max_daily_loss: tradingPreferences.value.maxDailyLoss,
          max_drawdown_percentage: tradingPreferences.value.maxDrawdownPercentage,
          max_open_positions: tradingPreferences.value.maxTotalPositions,
          max_trades_per_day: tradingPreferences.value.maxDailyTrades,
          circuit_breaker_enabled: tradingPreferences.value.circuitBreakerEnabled,
          circuit_breaker_loss: tradingPreferences.value.circuitBreakerLoss,
        }

        console.log(`📊 自动计算 max_total_position: ${tradingPreferences.value.maxPositionSize} * 10 = ${autoMaxTotalPosition} USDT`)

        console.log('📤 更新系统风控配置:', { id: riskConfig.id, data: updateData })
        await botAPI.updateRiskConfig(riskConfig.id, updateData)
        console.log('✅ 系统风控配置已更新到后端')
      }
    } catch (apiError) {
      console.warn('⚠️ 保存到后端 API 失败，但本地设置已保存:', apiError)
      // 不中断流程，因为本地设置已保存
    }

    notification.success('交易偏好设置已保存', '保存成功')

    // 获取返回页面（从 query 参数）
    const returnUrl = route.query.return
    console.log('Return URL from query:', returnUrl)

    // 延迟跳转，让用户看到成功提示
    if (returnUrl) {
      console.log('Navigating to:', decodeURIComponent(returnUrl))
      setTimeout(() => {
        router.push(decodeURIComponent(returnUrl))
      }, 500)
    } else {
      console.log('No return URL provided')
    }
  } catch (error) {
    console.error('Save error:', error)
    notification.error('保存失败，请重试', '错误')
  } finally {
    tradingPreferencesLoading.value = false
  }
}

// 安全设置方法
const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    notification.warning('两次输入的密码不一致', '密码错误')
    return
  }

  passwordLoading.value = true
  try {
    const response = await userAPI.changePassword({
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword,
      confirm_password: passwordForm.value.confirmPassword
    })

    if (response.status === 'success') {
      // 更新本地存储的 token
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
      }

      passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      notification.success('密码修改成功，请使用新密码登录', '修改成功')
    } else {
      notification.error(response.message || '密码修改失败', '修改失败')
    }
  } catch (error) {
    notification.error(error.message || '密码修改失败，请重试', '修改失败')
  } finally {
    passwordLoading.value = false
  }
}

const changeUsername = async () => {
  usernameLoading.value = true
  try {
    const response = await userAPI.changeUsername({
      new_username: usernameForm.value.newUsername,
      current_password: usernameForm.value.currentPassword
    })

    if (response.status === 'success') {
      // 更新本地用户信息
      userInfo.value.username = response.data.new_username

      // 更新全局用户状态
      userStore.updateUser({ username: response.data.new_username })

      usernameForm.value = { newUsername: '', currentPassword: '' }
      notification.success('用户名修改成功', '修改成功')

      // 重新获取用户名修改状态
      await fetchUsernameChangeStatus()
    } else {
      notification.error(response.message || '用户名修改失败', '修改失败')
    }
  } catch (error) {
    notification.error(error.message || '用户名修改失败', '修改失败')
  } finally {
    usernameLoading.value = false
  }
}

const sendEmailVerificationCode = async () => {
  // 验证必填字段
  if (!emailChangeForm.value.newEmail) {
    notification.warning('请输入新邮箱地址', '输入错误')
    return
  }

  if (!emailChangeForm.value.currentPassword) {
    notification.warning('请输入当前密码', '输入错误')
    return
  }

  emailChangeLoading.value = true

  // 显示提示：邮件发送需要时间
  notification.info('正在发送验证码，请稍候...', '发送中')

  try {
    const response = await userAPI.sendEmailChangeCode({
      new_email: emailChangeForm.value.newEmail,
      current_password: emailChangeForm.value.currentPassword
    })

    if (response.status === 'success') {
      emailVerificationSent.value = true
      startResendCountdown()
      notification.success('验证码已发送到新邮箱，请查收（可能需要1-2分钟）', '发送成功')
    } else {
      notification.error(response.message || '验证码发送失败', '发送失败')
    }
  } catch (error) {
    notification.error(error.message || '验证码发送失败，请重试', '发送失败')
  } finally {
    emailChangeLoading.value = false
  }
}

const handleEmailChangeSubmit = async () => {
  if (!emailVerificationSent.value) {
    await sendEmailVerificationCode()
  } else {
    await confirmEmailChange()
  }
}

const confirmEmailChange = async () => {
  // 验证验证码
  if (!emailChangeForm.value.verificationCode) {
    notification.warning('请输入验证码', '输入错误')
    return
  }

  emailChangeLoading.value = true
  try {
    const response = await userAPI.confirmEmailChange({
      new_email: emailChangeForm.value.newEmail,
      verification_code: emailChangeForm.value.verificationCode
    })

    if (response.status === 'success') {
      // 更新用户信息
      userInfo.value.email = response.data.new_email

      // 更新全局用户状态
      userStore.updateUser({ email: response.data.new_email })

      resetEmailChange()
      notification.success('邮箱修改成功', '修改成功')
    } else {
      notification.error(response.message || '邮箱修改失败', '修改失败')
    }
  } catch (error) {
    notification.error(error.message || '邮箱修改失败，请重试', '修改失败')
  } finally {
    emailChangeLoading.value = false
  }
}

const resendEmailVerificationCode = async () => {
  await sendEmailVerificationCode()
}

const resetEmailChange = () => {
  emailVerificationSent.value = false
  emailChangeForm.value = { newEmail: '', currentPassword: '', verificationCode: '' }
  emailChangeLoading.value = false
  resendCountdown.value = 0
}

const startResendCountdown = () => {
  resendCountdown.value = 60
  const timer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 提供方法给子组件
provide('updateProfile', updateProfile)
provide('handleAvatarChange', handleAvatarChange)
provide('getVisibilityLabel', getVisibilityLabel)
provide('getVisibilityDescription', getVisibilityDescription)
provide('toggleVisibility', toggleVisibility)
provide('toggleDataUsage', toggleDataUsage)
provide('toggleAccountPrivacy', toggleAccountPrivacy)
provide('getCurrentRiskColor', getCurrentRiskColor)
provide('getCurrentRiskIcon', getCurrentRiskIcon)
provide('getCurrentRiskType', getCurrentRiskType)
provide('getCurrentRiskDescription', getCurrentRiskDescription)
provide('getCurrentRiskLevel', getCurrentRiskLevel)
provide('getRecommendedValue', getRecommendedValue)
provide('getParamLimits', getParamLimits)
provide('validateParam', validateParam)
provide('restoreRecommendedSettings', restoreRecommendedSettings)
provide('resetAssessment', resetAssessment)
provide('calculateRiskProfile', calculateRiskProfile)
provide('saveTradingPreferences', saveTradingPreferences)
provide('changePassword', changePassword)
provide('changeUsername', changeUsername)
provide('sendEmailVerificationCode', sendEmailVerificationCode)
provide('handleEmailChangeSubmit', handleEmailChangeSubmit)
provide('resendEmailVerificationCode', resendEmailVerificationCode)
provide('resetEmailChange', resetEmailChange)

// 参数对比弹窗相关函数
const closeComparisonModal = () => {
  showComparisonModal.value = false

  // 清除 URL 中的 showComparison 参数
  if (route.query.showComparison) {
    const query = { ...route.query }
    delete query.showComparison
    router.replace({ query })
  }
}

const handleParamsApplied = async (appliedParams) => {
  // 更新交易偏好数据
  if (appliedParams.stop_loss_threshold !== undefined) {
    tradingPreferences.value.stopLoss = Math.round(appliedParams.stop_loss_threshold * 100)
  }
  if (appliedParams.max_position_size !== undefined) {
    tradingPreferences.value.maxSingleInvestment = Math.round(appliedParams.max_position_size * 100)
  }

  // 重新加载风险画像
  await loadRiskAssessment()

  // 关闭弹窗
  closeComparisonModal()

  notification.success('推荐参数已应用', '成功')
}

const handleParamsKept = () => {
  // 关闭弹窗
  closeComparisonModal()

  notification.info('已保留当前参数', '提示')
}

// 初始化数据
onMounted(async () => {
  // 从API获取用户信息
  await fetchUserProfile()

  // 如果API获取失败，尝试从localStorage加载
  if (!userInfo.value.username) {
    const savedUserInfo = localStorage.getItem('user_info')
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        userInfo.value = { ...userInfo.value, ...parsed }
        profileForm.value = { ...profileForm.value, ...parsed }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
  }

  // 加载隐私设置
  const savedVisibility = localStorage.getItem('profile_visibility')
  if (savedVisibility) {
    try {
      const parsed = JSON.parse(savedVisibility)
      profileVisibility.value = { ...profileVisibility.value, ...parsed }
    } catch (error) {
      console.error('解析隐私设置失败:', error)
    }
  }

  // 加载数据使用偏好
  const savedDataUsage = localStorage.getItem('data_usage_preferences')
  if (savedDataUsage) {
    try {
      const parsed = JSON.parse(savedDataUsage)
      dataUsagePreferences.value = { ...dataUsagePreferences.value, ...parsed }
    } catch (error) {
      console.error('解析数据使用偏好失败:', error)
    }
  }

  // 加载账户隐私设置
  const savedAccountPrivacy = localStorage.getItem('account_privacy')
  if (savedAccountPrivacy) {
    try {
      const parsed = JSON.parse(savedAccountPrivacy)
      accountPrivacy.value = { ...accountPrivacy.value, ...parsed }
    } catch (error) {
      console.error('解析账户隐私设置失败:', error)
    }
  }

  // 加载风险评估数据（从后端API）
  await loadRiskAssessment()

  // 加载交易偏好（优先从后端加载，然后合并 localStorage）
  try {
    const riskConfigResponse = await botAPI.getRiskConfig()
    const riskConfig = riskConfigResponse.data?.data || riskConfigResponse.data || riskConfigResponse

    if (riskConfig) {
      // 从后端风控配置映射到前端交易偏好
      // 注意：max_total_position 不再加载到前端，由后端自动计算
      tradingPreferences.value = {
        ...tradingPreferences.value,
        minPositionSize: riskConfig.min_position_size || tradingPreferences.value.minPositionSize,
        maxPositionSize: riskConfig.max_position_per_bot || tradingPreferences.value.maxPositionSize,
        // maxTotalPosition: 不再从后端加载，前端已隐藏
        maxDailyLoss: riskConfig.max_daily_loss || tradingPreferences.value.maxDailyLoss,
        maxDrawdownPercentage: riskConfig.max_drawdown_percentage || tradingPreferences.value.maxDrawdownPercentage,
        maxTotalPositions: riskConfig.max_open_positions || tradingPreferences.value.maxTotalPositions,
        maxDailyTrades: riskConfig.max_trades_per_day || tradingPreferences.value.maxDailyTrades,
        maxLeverage: riskConfig.max_leverage || tradingPreferences.value.maxLeverage,
        circuitBreakerEnabled: riskConfig.circuit_breaker_enabled !== undefined ? riskConfig.circuit_breaker_enabled : tradingPreferences.value.circuitBreakerEnabled,
        circuitBreakerLoss: riskConfig.circuit_breaker_loss || tradingPreferences.value.circuitBreakerLoss,
      }
      console.log('✅ 从后端加载系统风控配置:', tradingPreferences.value)
    }
  } catch (error) {
    console.warn('⚠️ 加载后端风控配置失败，使用默认值:', error)
  }

  // 然后合并 localStorage 中的偏好设置（localStorage 优先级更高）
  const savedTradingPrefs = localStorage.getItem('trading_preferences')
  if (savedTradingPrefs) {
    try {
      const parsed = JSON.parse(savedTradingPrefs)
      tradingPreferences.value = { ...tradingPreferences.value, ...parsed }
      console.log('✅ 合并 localStorage 交易偏好:', tradingPreferences.value)
    } catch (error) {
      console.error('解析交易偏好失败:', error)
    }
  }

  // 获取用户名修改状态
  await fetchUsernameChangeStatus()
})
</script>
