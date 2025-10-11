<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo和品牌 -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="CoolTrade Logo"
              class="h-10 w-auto transform group-hover:scale-105 transition-transform"
            />
            <span class="text-xl font-bold text-gray-900 tracking-tight" style="font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;">
              CoolTrade
            </span>
          </router-link>

          <!-- 导航链接 -->
          <nav class="hidden md:flex items-center space-x-1">
            <router-link
              to="/"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
            >
              首页
            </router-link>
            <router-link
              to="/market"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/market' }"
            >
              市场
            </router-link>
            <router-link
              to="/recommend"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/recommend' }"
            >
              推荐
            </router-link>
            <router-link
              to="/explore"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/explore' }"
            >
              探索
            </router-link>
            <router-link
              to="/strategies"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/strategies' }"
            >
              策略市场
            </router-link>
          </nav>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索框 - 始终显示 -->
          <div class="hidden md:block relative">
            <input
              type="text"
              placeholder="搜索用户、策略..."
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- 未登录状态 - 只显示登录按钮 -->
          <div v-if="!userStore.isAuthenticated.value">
            <router-link
              to="/auth"
              class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              登录
            </router-link>
          </div>

          <!-- 已登录状态 -->
          <div v-else class="flex items-center space-x-4">
            <!-- 通知按钮 -->
            <button class="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                  <img
                    v-if="userStore.userAvatar.value"
                    :src="userStore.userAvatar.value"
                    :alt="userStore.username.value"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-white font-semibold text-sm">
                    {{ userStore.userInitial.value }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-600" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-semibold text-gray-900">{{ userStore.username.value }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ userStore.userEmail.value }}</p>
                  </div>

                  <router-link 
                    to="/profile/me" 
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    @click="showUserMenu = false"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="text-sm font-medium">我的主页</span>
                  </router-link>

                  <router-link
                    to="/dashboard"
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    @click="showUserMenu = false"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="text-sm font-medium">仪表板</span>
                  </router-link>

                  <router-link 
                    to="/settings" 
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    @click="showUserMenu = false"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-sm font-medium">设置</span>
                  </router-link>

                  <div class="border-t border-gray-100 mt-2 pt-2">
                    <button 
                      @click="handleLogout"
                      class="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      <span class="text-sm font-medium">退出登录</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-4 py-3 space-y-1">
          <router-link
            to="/"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path === '/' }"
            @click="showMobileMenu = false"
          >
            首页
          </router-link>
          <router-link
            to="/market"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path === '/market' }"
            @click="showMobileMenu = false"
          >
            市场
          </router-link>
          <router-link
            to="/recommend"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path === '/recommend' }"
            @click="showMobileMenu = false"
          >
            推荐
          </router-link>
          <router-link
            to="/explore"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path === '/explore' }"
            @click="showMobileMenu = false"
          >
            探索
          </router-link>
          <router-link
            to="/strategies"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path === '/strategies' }"
            @click="showMobileMenu = false"
          >
            策略市场
          </router-link>

          <!-- 未登录状态 - 移动端登录按钮 -->
          <div v-if="!userStore.isAuthenticated.value" class="pt-2 border-t border-gray-200 mt-2">
            <router-link
              to="/auth"
              class="block px-4 py-2.5 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              @click="showMobileMenu = false"
            >
              登录
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '../../utils/api.js'
import { useUserStore } from '../../utils/userStore.js'

const router = useRouter()

// 使用全局用户状态
const userStore = useUserStore()

// 响应式数据
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref(null)

// 这些计算属性已经从 userStore 中获取，不需要重复定义

// 方法
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = () => {
  userStore.clearUser()
  showUserMenu.value = false
  router.push('/auth')
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 初始化时加载用户信息
  if (userStore.isAuthenticated.value) {
    userStore.loadUserFromStorage()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s;
}
</style>

