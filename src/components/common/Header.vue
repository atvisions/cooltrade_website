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
            >
              <button
                class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center gap-1"
                :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/bots') || $route.path.startsWith('/signal-bots') || $route.path.startsWith('/ai-strategy') }"
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
            </div>

            <router-link
              to="/strategies"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/strategies' }"
            >
              社区
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
            :class="{ 'text-blue-600 bg-blue-50 font-semibold': $route.path.startsWith('/market') }"
            @click="showMobileMenu = false"
          >
            市场
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

    <!-- 机器人通栏下拉菜单 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 -translate-y-1"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-1"
    >
      <div
        v-show="showBotsMenu"
        @mouseenter="showBotsMenu = true"
        @mouseleave="showBotsMenu = false"
        class="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-lg"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- 信号机器人 -->
            <router-link
              to="/signal-bots"
              class="group block h-full"
              @click="showBotsMenu = false"
            >
              <div class="flex flex-col h-full gap-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 mb-2">信号机器人</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">实时监控市场信号，及时通知交易机会，无需执行交易</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs mt-auto pl-14">
                  <span class="flex items-center gap-1 text-blue-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    实时监控
                  </span>
                  <span class="flex items-center gap-1 text-blue-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    零风险
                  </span>
                </div>
              </div>
            </router-link>

            <!-- 趋势跟踪机器人 -->
            <router-link
              to="/bots?type=trend_following"
              class="group block h-full"
              @click="showBotsMenu = false"
            >
              <div class="flex flex-col h-full gap-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 mb-2">趋势跟踪</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">自动识别市场趋势，执行交易策略，支持止损止盈</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs mt-auto pl-14">
                  <span class="flex items-center gap-1 text-green-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    自动交易
                  </span>
                  <span class="flex items-center gap-1 text-green-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    风控保护
                  </span>
                </div>
              </div>
            </router-link>

            <!-- 行情分析 -->
            <router-link
              to="/ai-strategy"
              class="group block h-full"
              @click="showBotsMenu = false"
            >
              <div class="flex flex-col h-full gap-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 mb-2">行情分析</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">AI 智能分析市场行情，生成交易策略建议</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs mt-auto pl-14">
                  <span class="flex items-center gap-1 text-purple-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    AI 分析
                  </span>
                  <span class="flex items-center gap-1 text-purple-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    策略建议
                  </span>
                </div>
              </div>
            </router-link>

            <!-- 代币推荐 -->
            <router-link
              to="/token-recommendations"
              class="group block h-full"
              @click="showBotsMenu = false"
            >
              <div class="flex flex-col h-full gap-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 mb-2">代币推荐</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">基于市场数据和技术分析，推荐优质交易机会</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs mt-auto pl-14">
                  <span class="flex items-center gap-1 text-orange-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                    数据驱动
                  </span>
                  <span class="flex items-center gap-1 text-orange-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    技术分析
                  </span>
                </div>
              </div>
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
const showBotsMenu = ref(false)
const userMenuRef = ref(null)
const botsMenuRef = ref(null)

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

