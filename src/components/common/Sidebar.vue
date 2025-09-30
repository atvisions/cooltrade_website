<template>
  <aside class="w-64 bg-slate-800 flex flex-col h-screen fixed top-0 left-0 shadow-lg z-50">
    <!-- Logo区域 -->
    <div class="flex items-center px-6 py-4 border-b border-slate-700">
      <img src="/logo.png" alt="CoolTrade Logo" class="w-8 h-8 mr-3" />
      <span class="text-lg font-semibold text-white">CoolTrade</span>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 px-4 py-4 overflow-y-auto">
      <!-- 主要功能 -->
      <div class="mb-6">
        <div class="px-3 mb-2">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">主要功能</span>
        </div>
        <ul class="space-y-1">
          <li>
            <a href="#" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <HomeIcon class="w-5 h-5 mr-3" />
              仪表板
            </a>
          </li>
          <li>
            <a href="#" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'ai-strategies'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <CpuChipIcon class="w-5 h-5 mr-3" />
              AI策略中心
            </a>
          </li>
          <li>
            <a href="#" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'signals'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <BoltIcon class="w-5 h-5 mr-3" />
              实时信号
            </a>
          </li>
          <li>
            <a href="#" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'auto-trading'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <ArrowTrendingUpIcon class="w-5 h-5 mr-3" />
              自动交易
            </a>
          </li>
          <li>
            <a href="#" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'manual-trading'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <CursorArrowRaysIcon class="w-5 h-5 mr-3" />
              手动交易
            </a>
          </li>
        </ul>
      </div>

      <!-- 分析工具 -->
      <div class="mb-6">
        <div class="px-3 mb-2">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">分析工具</span>
        </div>
        <ul class="space-y-1">
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-150">
              <MagnifyingGlassIcon class="w-5 h-5 mr-3" />
              市场扫描
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-150">
              <ChartBarIcon class="w-5 h-5 mr-3" />
              策略回测
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-150">
              <ShieldExclamationIcon class="w-5 h-5 mr-3" />
              风险监控
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-150">
              <DocumentTextIcon class="w-5 h-5 mr-3" />
              交易复盘
            </a>
          </li>
        </ul>
      </div>

      <!-- 用户管理 -->
      <div class="mb-6">
        <div class="px-3 mb-2">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">用户管理</span>
        </div>
        <ul class="space-y-1">
          <li>
            <router-link to="/profile/me" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <UserIcon class="w-5 h-5 mr-3" />
              我的主页
            </router-link>
          </li>
          <li>
            <a href="/settings" :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              activeItem === 'settings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            ]">
              <Cog6ToothIcon class="w-5 h-5 mr-3" />
              设置
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 底部用户信息 -->
    <div class="px-4 py-4 border-t border-slate-700">
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full mr-3 overflow-hidden">
          <img
            v-if="userInfo.avatar"
            :src="userInfo.avatar"
            :alt="userInfo.username"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-blue-600 flex items-center justify-center"
          >
            <span class="text-white font-medium text-sm">{{ userInitial }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ userInfo.username || '用户' }}</p>
          <p class="text-xs text-slate-400 truncate">{{ userInfo.email || 'user@example.com' }}</p>
        </div>
        <button 
          @click="handleLogout"
          class="ml-2 p-1.5 text-slate-400 hover:text-white transition-colors duration-150"
          title="退出登录"
        >
          <ArrowRightStartOnRectangleIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  CpuChipIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Props
const props = defineProps({
  activeItem: {
    type: String,
    default: 'dashboard'
  }
})

// 用户信息
const userInfo = ref({
  username: '',
  email: '',
  avatar: ''
})

// 获取用户信息
const loadUserInfo = () => {
  const savedUserInfo = localStorage.getItem('user_info')
  if (savedUserInfo) {
    try {
      const parsed = JSON.parse(savedUserInfo)
      userInfo.value = parsed
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
  }
}

// 用户名首字母
const userInitial = computed(() => {
  return userInfo.value.username ? userInfo.value.username.charAt(0).toUpperCase() : 'U'
})

// 处理退出登录
const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_info')
  localStorage.removeItem('remembered_login')
  router.push('/auth')
}

// 组件挂载时加载用户信息
// 监听用户信息更新事件
const handleUserInfoUpdate = () => {
  loadUserInfo()
}

onMounted(() => {
  loadUserInfo()
  // 监听用户信息更新事件
  window.addEventListener('user-info-updated', handleUserInfoUpdate)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('user-info-updated', handleUserInfoUpdate)
})
</script>
