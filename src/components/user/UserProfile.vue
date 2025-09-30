<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 侧边栏 -->
    <Sidebar activeItem="profile" />
    
    <!-- 主内容区域 -->
    <main class="ml-64 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">用户中心</h1>
          <p class="text-gray-600 mt-1">管理您的个人信息和账户设置</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 左侧：主页预览 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">我的主页</h3>
                <span class="text-xs text-gray-500 bg-green-100 text-green-800 px-2 py-1 rounded-full">公开展示</span>
              </div>
              <!-- 头像区域 -->
              <div class="text-center mb-6">
                <div class="relative inline-block">
                  <div v-if="userInfo.avatar" class="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img :src="userInfo.avatar" :alt="userInfo.username" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {{ userInitial }}
                  </div>
                  <button class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </button>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">{{ userInfo.username || '用户' }}</h3>
                <p class="text-gray-600">{{ userInfo.email || 'user@example.com' }}</p>
              </div>

              <!-- 用户等级 -->
              <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm text-gray-600">当前等级</div>
                    <div class="font-semibold text-gray-900">Lv.{{ userLevel }} {{ levelName }}</div>
                  </div>
                  <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {{ userLevel }}
                  </div>
                </div>
                <div class="mt-3">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>经验值</span>
                    <span>{{ userExp }}/{{ nextLevelExp }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${expProgress}%` }"></div>
                  </div>
                </div>
              </div>

              <!-- 快速统计 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ totalTrades }}</div>
                  <div class="text-sm text-gray-600">总交易次数</div>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">{{ winRate }}%</div>
                  <div class="text-sm text-gray-600">胜率</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧表单区域 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <!-- 标签页 -->
              <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                  <button 
                    v-for="tab in tabs" 
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                      activeTab === tab.id 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </nav>
              </div>

              <!-- 基本信息标签页 -->
              <div v-if="activeTab === 'basic'" class="p-6">
                <form @submit.prevent="updateBasicInfo" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        用户名
                        <span class="text-xs text-gray-500 ml-1">(需要在设置中修改)</span>
                      </label>
                      <input
                        v-model="formData.username"
                        type="text"
                        readonly
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        title="用户名需要在设置中修改"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        邮箱
                        <span class="text-xs text-gray-500 ml-1">(需要在设置中修改)</span>
                      </label>
                      <input
                        v-model="formData.email"
                        type="email"
                        readonly
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        title="邮箱需要在设置中修改"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                      <input 
                        v-model="formData.phone"
                        type="tel" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入手机号"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">真实姓名</label>
                      <input 
                        v-model="formData.realName"
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入真实姓名"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
                    <textarea
                      v-model="formData.bio"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="介绍一下自己..."
                    ></textarea>
                  </div>

                  <!-- 社交媒体 -->
                  <div>
                    <h4 class="text-md font-medium text-gray-900 mb-4">社交媒体</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
                        <input
                          v-model="formData.telegram"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">X (Twitter)</label>
                        <input
                          v-model="formData.twitter"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">个人主页</label>
                        <input
                          v-model="formData.website"
                          type="url"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end">
                    <button 
                      type="submit"
                      :disabled="isLoading"
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {{ isLoading ? '保存中...' : '保存更改' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- 安全设置标签页 -->
              <div v-if="activeTab === 'security'" class="p-6">
                <div class="space-y-6">
                  <!-- 修改密码 -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">修改密码</h4>
                    <form @submit.prevent="updatePassword" class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                        <input 
                          v-model="passwordForm.currentPassword"
                          type="password" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入当前密码"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                        <input 
                          v-model="passwordForm.newPassword"
                          type="password" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入新密码"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                        <input 
                          v-model="passwordForm.confirmPassword"
                          type="password" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请再次输入新密码"
                        />
                      </div>
                      <button 
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        更新密码
                      </button>
                    </form>
                  </div>

                  <!-- 两步验证 -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-lg font-medium text-gray-900">两步验证</h4>
                        <p class="text-sm text-gray-600 mt-1">为您的账户添加额外的安全保护</p>
                      </div>
                      <button 
                        @click="toggle2FA"
                        :class="[
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                          twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        ]"
                      >
                        <span :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                          twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        ]"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 通知设置标签页 -->
              <div v-if="activeTab === 'notifications'" class="p-6">
                <div class="space-y-6">
                  <div v-for="setting in notificationSettings" :key="setting.id" class="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">{{ setting.title }}</h4>
                      <p class="text-sm text-gray-600">{{ setting.description }}</p>
                    </div>
                    <button 
                      @click="toggleNotification(setting.id)"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                        setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      ]"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../common/Sidebar.vue'
import notification from '../../utils/notification.js'
import { userAPI } from '../../utils/api.js'

// 用户信息
const userInfo = ref({
  id: null,
  username: '',
  email: '',
  phone: '',
  realName: '',
  bio: '',
  avatar: '',
  telegram: '',
  twitter: '',
  website: '',
  language: '',
  points: 0,
  invitation_code: '',
  is_premium: false
})

// 用户统计数据
const userStats = ref({
  followers: 128,
  following: 56,
  strategies: 12,
  winRate: 78.5
})

// 隐私设置
const profileVisibility = ref({
  bio: true,
  phone: false,
  realName: false,
  telegram: true,
  twitter: true,
  website: true,
  followers: true,
  following: true
})

// 表单数据
const formData = ref({
  username: '',
  email: '',
  phone: '',
  realName: '',
  bio: '',
  avatar: '',
  telegram: '',
  twitter: '',
  website: '',
  displayName: '',
  userTitle: '新手交易员',
  avatar: ''
})

// 密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 状态
const activeTab = ref('basic')
const isLoading = ref(false)
const twoFactorEnabled = ref(false)

// 用户等级数据
const userLevel = ref(1)
const userExp = ref(150)
const nextLevelExp = ref(300)
const levelName = ref('新手交易员')
const totalTrades = ref(23)
const winRate = ref(73.5)

// 标签页配置
const tabs = ref([
  { id: 'basic', name: '基本信息' },
  { id: 'security', name: '安全设置' },
  { id: 'notifications', name: '通知设置' }
])

// 通知设置
const notificationSettings = ref([
  { id: 'trade', title: '交易通知', description: '交易执行和结果通知', enabled: true },
  { id: 'strategy', title: '策略推荐', description: 'AI策略推荐通知', enabled: true },
  { id: 'market', title: '市场提醒', description: '重要市场动态提醒', enabled: false },
  { id: 'system', title: '系统消息', description: '系统维护和更新通知', enabled: true }
])

// 计算属性
const userInitial = computed(() => {
  return userInfo.value.username ? userInfo.value.username.charAt(0).toUpperCase() : 'U'
})

// 主页信息相关方法
const getUserLevelStyle = () => {
  const styles = {
    '新手交易员': 'bg-gray-100 text-gray-800',
    '初级分析师': 'bg-green-100 text-green-800',
    '资深交易员': 'bg-blue-100 text-blue-800',
    '策略大师': 'bg-purple-100 text-purple-800',
    '量化专家': 'bg-indigo-100 text-indigo-800',
    '投资顾问': 'bg-yellow-100 text-yellow-800'
  }
  return styles[formData.value.userTitle] || styles['新手交易员']
}

const shouldShowBio = computed(() => {
  return profileVisibility.value.bio && formData.value.bio
})

const shouldShowTelegram = computed(() => {
  return profileVisibility.value.telegram && formData.value.telegram
})

const shouldShowTwitter = computed(() => {
  return profileVisibility.value.twitter && formData.value.twitter
})

const shouldShowWebsite = computed(() => {
  return profileVisibility.value.website && formData.value.website
})

const hasVisibleSocialLinks = computed(() => {
  return shouldShowTelegram.value || shouldShowTwitter.value || shouldShowWebsite.value
})

const expProgress = computed(() => {
  return ((userExp.value / nextLevelExp.value) * 100).toFixed(1)
})

// 方法
const loadUserInfo = async () => {
  try {
    // 首先尝试从API获取最新数据
    const response = await userAPI.getProfile()
    if (response.status === 'success') {
      const apiData = response.data
      // 映射API数据到本地数据结构
      const userData = {
        id: apiData.id,
        username: apiData.username,
        email: apiData.email,
        phone: apiData.phone || '',
        realName: apiData.real_name || '',
        bio: apiData.bio || '',
        avatar: apiData.avatar || '',
        telegram: apiData.telegram || '',
        twitter: apiData.twitter || '',
        website: apiData.website || '',
        language: apiData.language,
        points: apiData.points,
        invitation_code: apiData.invitation_code,
        is_premium: apiData.is_premium
      }

      userInfo.value = userData
      formData.value = { ...formData.value, ...userData }

      // 保存到本地存储
      localStorage.setItem('user_info', JSON.stringify(userData))
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 如果API失败，尝试从本地存储加载
    const savedUserInfo = localStorage.getItem('user_info')
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        userInfo.value = { ...userInfo.value, ...parsed }
        formData.value = { ...formData.value, ...parsed }
      } catch (parseError) {
        console.error('解析本地用户信息失败:', parseError)
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
}

const updateBasicInfo = async () => {
  isLoading.value = true
  try {
    // 这里应该调用API更新用户信息
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 更新本地存储
    const updatedInfo = { ...userInfo.value, ...formData.value }
    localStorage.setItem('user_info', JSON.stringify(updatedInfo))
    userInfo.value = updatedInfo
    
    notification.success('个人信息更新成功', '保存成功')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    notification.error('更新失败，请重试', '错误')
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    notification.warning('两次输入的密码不一致', '密码不匹配')
    return
  }
  
  try {
    // 这里应该调用API更新密码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notification.success('密码更新成功', '更新成功')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    console.error('更新密码失败:', error)
    notification.error('密码更新失败，请重试', '错误')
  }
}

const toggle2FA = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  notification.info(
    twoFactorEnabled.value ? '两步验证已启用' : '两步验证已关闭',
    '安全设置'
  )
}

const toggleNotification = (settingId) => {
  const setting = notificationSettings.value.find(s => s.id === settingId)
  if (setting) {
    setting.enabled = !setting.enabled
    notification.info(
      `${setting.title}通知已${setting.enabled ? '启用' : '关闭'}`,
      '通知设置'
    )
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>
