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
              to="/market"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/market') }"
            >
              市场
            </router-link>

            <!-- 机器人下拉菜单 -->
            <div
              v-if="userStore.isAuthenticated.value"
              class="relative"
              ref="botsMenuRef"
              @mouseenter="showBotsMenu = true"
              @mouseleave="showBotsMenu = false"
            >
              <button
                class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center gap-1"
                :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/bots') || $route.path.startsWith('/signal-bots') }"
              >
                机器人
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': showBotsMenu }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                  v-show="showBotsMenu"
                  class="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <!-- 信号机器人 -->
                  <router-link
                    to="/signal-bots"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    @click="showBotsMenu = false"
                  >
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900">信号机器人</div>
                    </div>
                  </router-link>

                  <!-- 交易机器人 -->
                  <router-link
                    to="/bots?type=trend_following"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    @click="showBotsMenu = false"
                  >
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900">交易机器人</div>
                    </div>
                  </router-link>
                </div>
              </transition>
            </div>

            <router-link
              to="/community"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/community' }"
            >
              社区
            </router-link>

            <router-link
              v-if="userStore.isAuthenticated.value"
              to="/membership"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/membership' }"
            >
              会员
            </router-link>
          </nav>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索框 - 代币搜索 -->
          <div class="hidden md:block relative" ref="searchContainerRef">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              @focus="handleSearchFocus"
              type="text"
              placeholder="搜索代币..."
              :class="[
                'w-64 pl-10 py-2 bg-gray-50 rounded-lg focus:outline-none focus:bg-white transition-all border',
                searchQuery ? 'pr-10' : 'pr-4',
                isFocused ? 'ring-2 ring-black border-black' : 'border-transparent'
              ]"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>

            <!-- 清除按钮 -->
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- 搜索结果下拉框 -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showSearchResults && (searchResults.length > 0 || searching)"
                class="absolute top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
              >
                <!-- 加载中 -->
                <div v-if="searching" class="p-4 text-center text-gray-500">
                  <svg class="animate-spin h-5 w-5 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="mt-2 text-sm">搜索中...</p>
                </div>

                <!-- 搜索结果 -->
                <div v-else-if="searchResults.length > 0" class="py-2">

                  <div
                    v-for="token in searchResults"
                    :key="token.id"
                    @click="selectToken(token)"
                    class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center space-x-3"
                  >
                    <!-- 代币Logo或首字母 -->
                    <div class="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
                      <img
                        v-if="token.logo"
                        :src="token.logo"
                        :alt="token.symbol"
                        class="w-full h-full object-cover"
                        @error="handleImageError($event, token)"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm"
                      >
                        {{ token.symbol ? token.symbol.charAt(0).toUpperCase() : '?' }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <span class="font-semibold text-gray-900">{{ token.name }}</span>
                        <span class="text-xs text-gray-500">#{{ token.market_cap_rank || '-' }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-medium text-gray-900 text-sm">
                        ${{ formatPrice(token.current_price) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 无结果 -->
                <div v-else class="p-4 text-center text-gray-500">
                  <p class="text-sm">未找到相关代币</p>
                </div>
              </div>
            </transition>
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
                <div class="relative w-9 h-9">
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
                  <!-- 会员徽章 -->
                  <div
                    v-if="userStore.membershipTier.value === 'standard'"
                    class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white"
                    title="Standard 会员"
                  >
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div
                    v-else-if="userStore.membershipTier.value === 'professional'"
                    class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-white"
                    title="Professional 会员"
                  >
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
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

                  <!-- 仪表板 -->
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

                  <!-- 我的交易所 -->
                  <router-link
                    to="/exchanges"
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    @click="showUserMenu = false"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"></path>
                    </svg>
                    <span class="text-sm font-medium">我的交易所</span>
                  </router-link>

                  <!-- 会员中心 -->
                  <router-link
                    to="/membership"
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    @click="showUserMenu = false"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span class="text-sm font-medium">会员中心</span>
                  </router-link>

                  <!-- 设置 -->
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
            to="/market"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path.startsWith('/market') }"
            @click="showMobileMenu = false"
          >
            市场
          </router-link>
          <router-link
            to="/community"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path === '/community' }"
            @click="showMobileMenu = false"
          >
            社区
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
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import { useUserStore } from '../../utils/userStore.js'

const router = useRouter()

// 使用全局用户状态
const userStore = useUserStore()

// 响应式数据
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showBotsMenu = ref(false)
const userMenuRef = ref(null)
const botsMenuRef = ref(null)

// 搜索相关
const searchQuery = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)
const searching = ref(false)
const searchContainerRef = ref(null)
const isFocused = ref(false)
const loadingHotTokens = ref(false)
const isSearching = ref(false) // 标记是否正在搜索（非热门代币）
let searchTimeout = null

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

// 加载热门代币
const loadHotTokens = async () => {
  // 如果正在搜索，不要加载热门代币
  if (isSearching.value) {
    return
  }

  loadingHotTokens.value = true
  try {
    const response = await apiRequest(
      `${API_ENDPOINTS.TOKEN_LIST}hot/?limit=10`
    )

    // 再次检查是否正在搜索（防止在请求期间开始搜索）
    if (isSearching.value) {
      return
    }

    // API 直接返回分页数据，包含 results 数组
    let tokens = response.results || []

    // 过滤掉无效的代币（没有必要字段的）
    tokens = tokens.filter(token => {
      return token && token.id && token.symbol && token.name
    })

    // 只取前10个有效代币
    searchResults.value = tokens.slice(0, 10)

    console.log('✅ 加载热门代币成功:', searchResults.value.length, '个')
  } catch (error) {
    console.error('❌ 加载热门代币失败:', error)
    searchResults.value = []
  } finally {
    loadingHotTokens.value = false
  }
}

// 处理搜索框获得焦点
const handleSearchFocus = () => {
  isFocused.value = true
  // 只有在有搜索结果时才显示下拉
  if (searchResults.value.length > 0) {
    showSearchResults.value = true
  }
}

// 代币搜索
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  const query = searchQuery.value.trim()

  if (query.length < 1) {
    // 如果清空搜索，清空结果并隐藏下拉
    isSearching.value = false
    searchResults.value = []
    searching.value = false
    showSearchResults.value = false
    return
  }

  // 标记正在搜索
  isSearching.value = true
  searching.value = true
  showSearchResults.value = true

  searchTimeout = setTimeout(async () => {
    try {
      // 再次检查搜索内容，防止在延迟期间被清空
      const currentQuery = searchQuery.value.trim()

      if (currentQuery.length < 1) {
        isSearching.value = false
        searching.value = false
        showSearchResults.value = false
        return
      }

      console.log('🔍 搜索代币:', currentQuery)

      const response = await apiRequest(
        `${API_ENDPOINTS.TOKEN_SEARCH}?q=${currentQuery}&limit=10`
      )

      console.log('📦 搜索API响应:', response)

      // 再次检查搜索内容是否仍然匹配（防止在请求期间用户修改了搜索内容）
      if (searchQuery.value.trim() !== currentQuery) {
        console.log('⚠️ 搜索内容已变化，忽略此次结果')
        return
      }

      if (response.status === 'success') {
        searchResults.value = response.data.results || []
        console.log('✅ 搜索结果:', searchResults.value.length, '个', searchResults.value)
      } else {
        searchResults.value = []
        console.log('❌ 搜索失败，响应状态:', response.status)
      }
    } catch (error) {
      console.error('❌ 搜索代币失败:', error)
      searchResults.value = []
    } finally {
      // 只有在搜索内容仍然存在时才清除搜索状态
      if (searchQuery.value.trim().length > 0) {
        isSearching.value = false
        searching.value = false
      }
    }
  }, 300)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

// 处理图片加载错误
const handleImageError = (event, token) => {
  // 隐藏失败的图片
  event.target.style.display = 'none'

  // 在图片的父容器中显示首字母
  const parent = event.target.parentElement
  if (parent && !parent.querySelector('.token-initial')) {
    const initial = document.createElement('div')
    initial.className = 'token-initial w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm'
    initial.textContent = token.symbol ? token.symbol.charAt(0).toUpperCase() : '?'
    parent.appendChild(initial)
  }

  // 清空 logo 字段，防止再次尝试加载
  token.logo = null
}

// 选择代币
const selectToken = (token) => {
  // 使用 symbol 跳转到代币详情页
  const symbol = token.symbol.toLowerCase()
  router.push(`/market/${symbol}`)

  // 清空搜索状态
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
  isFocused.value = false
}

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }

  // 点击搜索框外部关闭搜索结果
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target)) {
    showSearchResults.value = false
    isFocused.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  // 初始化时加载用户信息
  if (userStore.isAuthenticated.value) {
    userStore.loadUserFromStorage()
    // 从后端刷新用户信息，确保获取最新的会员状态
    await userStore.refreshUserFromAPI()
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

