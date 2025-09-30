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
        <li v-for="item in menuItems" :key="item.id">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
              isActive(item.id)
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                'w-5 h-5 mr-3 flex-shrink-0',
                isActive(item.id) ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'
              ]"
            />
            <span>{{ item.name }}</span>
            
            <!-- 徽章 -->
            <span
              v-if="item.badge"
              :class="[
                'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
                isActive(item.id)
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 text-blue-600'
              ]"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../utils/userStore.js'
import {
  HomeIcon,
  Cog6ToothIcon,
  BookmarkIcon,
  ShoppingBagIcon,
  RocketLaunchIcon,
  HeartIcon,
  BellIcon
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
    id: 'settings',
    name: '设置',
    path: '/settings',
    icon: Cog6ToothIcon,
    badge: null
  },
  {
    id: 'favorites',
    name: '收藏',
    path: '/favorites',
    icon: BookmarkIcon,
    badge: '12'
  },
  {
    id: 'orders',
    name: '订单',
    path: '/orders',
    icon: ShoppingBagIcon,
    badge: '3'
  },
  {
    id: 'subscriptions',
    name: '我的订阅',
    path: '/subscriptions',
    icon: RocketLaunchIcon,
    badge: '5'
  },
  {
    id: 'following',
    name: '关注',
    path: '/following',
    icon: HeartIcon,
    badge: null
  },
  {
    id: 'notifications',
    name: '通知',
    path: '/notifications',
    icon: BellIcon,
    badge: '8'
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

