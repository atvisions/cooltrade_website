<template>
  <!-- 浮动侧边栏 -->
  <aside class="w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
    <!-- 用户信息卡片 -->
    <div class="p-6 bg-blue-50 border-b border-gray-200">
      <div class="flex items-center space-x-4">
        <!-- 用户头像 -->
        <div class="w-16 h-16 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center flex-shrink-0 ring-4 ring-white">
          <img v-if="userStore.userAvatar.value" :src="userStore.userAvatar.value" :alt="userStore.username.value" class="w-full h-full object-cover" />
          <span v-else class="text-white font-bold text-xl">{{ userStore.userInitial.value }}</span>
        </div>

        <!-- 用户信息 -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ userStore.username.value }}</h3>
          <p class="text-sm text-gray-600 truncate">{{ userStore.userEmail.value }}</p>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="p-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.id" class="relative">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
              isActive(item.id)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <!-- 左侧蓝色圆弧指示器 -->
            <div
              v-if="isActive(item.id)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"
            ></div>

            <component
              :is="item.icon"
              :class="[
                'w-5 h-5 mr-3 flex-shrink-0',
                isActive(item.id) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              ]"
            />
            <span>{{ item.name }}</span>

            <!-- 徽章 -->
            <span
              v-if="item.badge"
              :class="[
                'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
                isActive(item.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-red-100 text-red-600'
              ]"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 我的积分 -->
    <div class="px-4 pb-4">
      <router-link
        to="/points"
        class="block px-4 py-3 rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-orange-100 hover:border-orange-200 hover:shadow-sm transition-all duration-200 group"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="relative">
              <!-- 金币图标 -->
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <!-- 闪光效果 -->
              <div class="absolute -top-0.5 -right-0.5 w-2 h-2">
                <SparklesIcon class="w-2 h-2 text-amber-400" />
              </div>
            </div>
            <span class="text-xs font-medium text-gray-600">我的积分</span>
          </div>
          <svg class="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        <div class="flex items-baseline space-x-1">
          <span class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{{ userPoints }}</span>
          <span class="text-xs text-gray-500">积分</span>
        </div>
      </router-link>
    </div>

    <!-- 底部快捷操作 -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <a
        href="/profile/me"
        target="_blank"
        class="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        查看我的主页
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../utils/userStore.js'
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import {
  HomeIcon,
  Cog6ToothIcon,
  BellIcon,
  ChartBarIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

// Props
const props = defineProps({
  activeItem: {
    type: String,
    default: 'dashboard'
  }
})

// 使用全局用户状态
const userStore = useUserStore()

// 积分数据
const userPoints = ref(0)

// 加载积分信息
const loadPoints = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.INVITATION_INFO, {
      method: 'GET'
    })

    if (response.status === 'success') {
      userPoints.value = response.data.points
    }
  } catch (error) {
    console.error('加载积分信息失败:', error)
  }
}

// 页面加载时获取积分
onMounted(() => {
  loadPoints()
})

// 菜单项配置
const menuItems = ref([
  {
    id: 'dashboard',
    name: '仪表板',
    path: '/dashboard',
    icon: HomeIcon,
    badge: null
  },
  {
    id: 'ai-strategy',
    name: '策略生成器',
    path: '/ai-strategy',
    icon: SparklesIcon,
    badge: null
  },
  {
    id: 'trading',
    name: '交易中心',
    path: '/trading',
    icon: ChartBarIcon,
    badge: null
  },
  {
    id: 'membership',
    name: '会员中心',
    path: '/membership',
    icon: StarIcon,
    badge: null
  },
  {
    id: 'notifications',
    name: '通知',
    path: '/notifications',
    icon: BellIcon,
    badge: '8'
  },
  {
    id: 'settings',
    name: '设置',
    path: '/settings',
    icon: Cog6ToothIcon,
    badge: null
  }
])

// 判断是否激活
const isActive = (itemId) => {
  // 优先使用props传入的activeItem
  if (props.activeItem) {
    return props.activeItem === itemId
  }
  
  // 否则根据路由判断
  const item = menuItems.value.find(i => i.id === itemId)
  if (!item) return false
  
  return route.path === item.path || route.path.startsWith(item.path + '/')
}

onMounted(() => {
  // 初始化时加载用户信息
  userStore.loadUserFromStorage()
})
</script>

<style scoped>
/* 侧边栏样式 */
aside {
  position: sticky;
  top: 5rem;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
}

/* 自定义滚动条 */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>

