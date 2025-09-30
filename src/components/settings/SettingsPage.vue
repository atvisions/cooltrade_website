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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide, markRaw } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import notification from '../../utils/notification.js'
import { userAPI } from '../../utils/api.js'
import { useUserStore } from '../../utils/userStore.js'

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

// 当前激活的标签页 - 添加状态持久化
const activeTab = ref(localStorage.getItem('settings_active_tab') || 'profile')

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
    options: [
      { text: "新手，刚开始投资", value: 1 },
      { text: "有一些经验，投资1-3年", value: 2 },
      { text: "经验丰富，投资3-5年", value: 3 },
      { text: "专业投资者，5年以上经验", value: 4 }
    ]
  },
  {
    question: "您能承受多大的投资损失？",
    options: [
      { text: "不能承受任何损失", value: 1 },
      { text: "可以承受5%以内的损失", value: 2 },
      { text: "可以承受10-20%的损失", value: 3 },
      { text: "可以承受20%以上的损失", value: 4 }
    ]
  },
  {
    question: "您的投资目标是什么？",
    options: [
      { text: "保值，避免通胀", value: 1 },
      { text: "稳健增长，年化5-10%", value: 2 },
      { text: "积极增长，年化10-20%", value: 3 },
      { text: "高收益，愿意承担高风险", value: 4 }
    ]
  }
])

const riskAnswers = ref([null, null, null])
const riskAssessmentDate = ref(null)

// 交易偏好设置
const tradingPreferences = ref({
  maxSingleInvestment: 10,
  stopLoss: 5,
  takeProfit: 15,
  frequency: 'moderate'
})

const tradingPreferencesLoading = ref(false)

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
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return '🛡️'
  if (score <= 8) return '⚖️'
  if (score <= 10) return '📈'
  return '🚀'
}

const getCurrentRiskType = () => {
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return '保守型'
  if (score <= 8) return '稳健型'
  if (score <= 10) return '积极型'
  return '激进型'
}

const getCurrentRiskDescription = () => {
  const score = riskAnswers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  if (score <= 4) return '注重资本保值，偏好低风险投资'
  if (score <= 8) return '追求稳健收益，可承受适度风险'
  if (score <= 10) return '追求较高收益，愿意承担较高风险'
  return '追求最高收益，愿意承担高风险'
}

const resetAssessment = () => {
  riskAnswers.value = [null, null, null]
  riskAssessmentDate.value = null
  localStorage.removeItem('risk_answers')
  localStorage.removeItem('risk_assessment_date')
}

const calculateRiskProfile = () => {
  const now = new Date().toLocaleDateString()
  riskAssessmentDate.value = now

  localStorage.setItem('risk_answers', JSON.stringify(riskAnswers.value))
  localStorage.setItem('risk_assessment_date', now)

  notification.success('风险评估完成', '评估成功')
}

const saveTradingPreferences = async () => {
  tradingPreferencesLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('trading_preferences', JSON.stringify(tradingPreferences.value))
    notification.success('交易偏好设置已保存', '保存成功')
  } catch (error) {
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
provide('resetAssessment', resetAssessment)
provide('calculateRiskProfile', calculateRiskProfile)
provide('saveTradingPreferences', saveTradingPreferences)
provide('changePassword', changePassword)
provide('changeUsername', changeUsername)
provide('sendEmailVerificationCode', sendEmailVerificationCode)
provide('handleEmailChangeSubmit', handleEmailChangeSubmit)
provide('resendEmailVerificationCode', resendEmailVerificationCode)
provide('resetEmailChange', resetEmailChange)

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

  // 加载风险评估数据
  const savedRiskAnswers = localStorage.getItem('risk_answers')
  if (savedRiskAnswers) {
    try {
      riskAnswers.value = JSON.parse(savedRiskAnswers)
    } catch (error) {
      console.error('解析风险评估失败:', error)
    }
  }

  const savedRiskDate = localStorage.getItem('risk_assessment_date')
  if (savedRiskDate) {
    riskAssessmentDate.value = savedRiskDate
  }

  // 加载交易偏好
  const savedTradingPrefs = localStorage.getItem('trading_preferences')
  if (savedTradingPrefs) {
    try {
      const parsed = JSON.parse(savedTradingPrefs)
      tradingPreferences.value = { ...tradingPreferences.value, ...parsed }
    } catch (error) {
      console.error('解析交易偏好失败:', error)
    }
  }

  // 获取用户名修改状态
  await fetchUsernameChangeStatus()
})
</script>
