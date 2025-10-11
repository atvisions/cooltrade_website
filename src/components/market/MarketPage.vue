<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" @click="closeAllDropdowns">
    <!-- Header -->
    <Header />

    <!-- Market Overview Stats - Premium Design -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        <!-- 1️⃣ 恐慌贪婪指数 - Gauge Chart -->
        <div v-if="statsLoading" class="bg-gray-200 p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-[156px]">
          <!-- 骨架图：整个卡片容器 -->
        </div>
        <div v-else class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-[156px]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">恐慌贪婪指数</span>
              <div class="relative group">
                <svg class="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                  <div class="font-semibold mb-1">市场情绪指标</div>
                  <div class="text-gray-300">0-100分制，综合市场波动、交易量、社交媒体等数据</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center">
            <!-- Semi-circle Gauge -->
            <div class="relative w-32 h-16 mb-2">
              <svg class="w-full h-full" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ef4444"/>
                    <stop offset="25%" style="stop-color:#f97316"/>
                    <stop offset="50%" style="stop-color:#eab308"/>
                    <stop offset="75%" style="stop-color:#22c55e"/>
                    <stop offset="100%" style="stop-color:#3b82f6"/>
                  </linearGradient>
                </defs>
                <!-- Background arc -->
                <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#e5e7eb" stroke-width="8" stroke-linecap="round"/>
                <!-- Progress arc -->
                <path
                  d="M 10 45 A 40 40 0 0 1 90 45"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="125.6"
                  :stroke-dashoffset="125.6 - (125.6 * marketStats.fearGreedIndex.value / 100)"
                  class="transition-all duration-1000"
                />
                <!-- Center value -->
                <text x="50" y="42" text-anchor="middle" class="text-2xl font-bold fill-gray-900">{{ marketStats.fearGreedIndex.value }}</text>
              </svg>
            </div>
            <div class="text-center">
              <div class="text-base font-semibold" :class="fearIndexColorText">{{ fearLabel }}</div>
            </div>
          </div>
        </div>

        <!-- 2️⃣ 资金费率 - Line Chart -->
        <div v-if="statsLoading" class="bg-gray-200 p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-[156px]">
          <!-- 骨架图：整个卡片容器 -->
        </div>
        <div v-else class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-[156px]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">资金费率</span>
              <div class="relative group">
                <svg class="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                  <div class="font-semibold mb-1">永续合约费率</div>
                  <div class="text-gray-300">正值=多头支付空头，负值=空头支付多头</div>
                </div>
              </div>
            </div>
            <span class="text-xs font-medium px-2 py-0.5 rounded" :class="fundingRateStatusBadge">
              {{ marketStats.fundingRate.label }}
            </span>
          </div>

          <div>
            <div class="mb-3">
              <div class="text-2xl font-bold text-gray-900">{{ marketStats.fundingRate.average.toFixed(4) }}%</div>
            </div>
            <!-- Mini trend line -->
            <div class="w-full h-12">
              <svg viewBox="0 0 100 40" class="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fundingLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" :style="`stop-color:${marketStats.fundingRate.average > 0 ? '#ef4444' : '#10b981'};stop-opacity:0.2`"/>
                    <stop offset="100%" :style="`stop-color:${marketStats.fundingRate.average > 0 ? '#ef4444' : '#10b981'};stop-opacity:0`"/>
                  </linearGradient>
                </defs>
                <path d="M 0 25 Q 25 22 50 24 T 100 18" fill="none" :stroke="marketStats.fundingRate.average > 0 ? '#ef4444' : '#10b981'" stroke-width="2" stroke-linecap="round"/>
                <path d="M 0 25 Q 25 22 50 24 T 100 18 L 100 40 L 0 40 Z" fill="url(#fundingLineGradient)"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 3️⃣ 多空比 - Horizontal Bar -->
        <div v-if="statsLoading" class="bg-gray-200 p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-[156px]">
          <!-- 骨架图：整个卡片容器 -->
        </div>
        <div v-else class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-[156px]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">多空比</span>
              <div class="relative group">
                <svg class="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                  <div class="font-semibold mb-1">多空持仓比例</div>
                  <div class="text-gray-300">&gt;1表示多头占优，&lt;1表示空头占优</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="mb-3">
              <div class="text-2xl font-bold text-gray-900">{{ marketStats.longShortRatio.ratio }}</div>
            </div>
            <!-- Stacked horizontal bar -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-emerald-600 font-medium">多头 {{ marketStats.longShortRatio.long_percentage.toFixed(1) }}%</span>
                <span class="text-rose-600 font-medium">空头 {{ marketStats.longShortRatio.short_percentage.toFixed(1) }}%</span>
              </div>
              <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  class="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                  :style="{ width: marketStats.longShortRatio.long_percentage + '%' }"
                ></div>
                <div
                  class="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-700"
                  :style="{ width: marketStats.longShortRatio.short_percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4️⃣ 未平仓量 - Area Chart -->
        <div v-if="statsLoading" class="bg-gray-200 p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-[156px]">
          <!-- 骨架图：整个卡片容器 -->
        </div>
        <div v-else class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-[156px]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">未平仓量</span>
              <div class="relative group">
                <svg class="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                  <div class="font-semibold mb-1">持仓总价值</div>
                  <div class="text-gray-300">OI增加=资金流入，减少=资金流出</div>
                </div>
              </div>
            </div>
            <span
              class="text-xs font-medium px-2 py-0.5 rounded"
              :class="marketStats.openInterest.change_24h > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
            >
              {{ marketStats.openInterest.change_24h > 0 ? '+' : '' }}{{ marketStats.openInterest.change_24h.toFixed(2) }}%
            </span>
          </div>

          <div>
            <div class="mb-3">
              <div class="text-2xl font-bold text-gray-900">${{ formatNumber(marketStats.openInterest.total) }}</div>
            </div>
            <!-- Area chart -->
            <div class="w-full h-12">
              <svg viewBox="0 0 100 40" class="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="oiAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 30 Q 25 26 50 28 T 100 20" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                <path d="M 0 30 Q 25 26 50 28 T 100 20 L 100 40 L 0 40 Z" fill="url(#oiAreaGradient)"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 5️⃣ 24h清算量 - Horizontal Split Bar -->
        <div v-if="statsLoading" class="bg-gray-200 p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-[156px]">
          <!-- 骨架图：整个卡片容器 -->
        </div>
        <div v-else class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-[156px]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">24h清算量</span>
              <div class="relative group">
                <svg class="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                  <div class="font-semibold mb-1">强制平仓总额</div>
                  <div class="text-gray-300">清算量大=市场波动剧烈</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="mb-3">
              <div class="text-2xl font-bold text-gray-900">${{ formatNumber(marketStats.liquidation24h.total) }}</div>
            </div>
            <!-- Split horizontal bars -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-rose-600 font-medium">多头</span>
                <span class="text-emerald-600 font-medium">空头</span>
              </div>
              <div class="flex items-center gap-2">
                <!-- 多头进度条 + 百分比 -->
                <div class="flex-1 flex items-center gap-2">
                  <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-700"
                      :style="{ width: marketStats.liquidation24h.long_percentage + '%' }"
                    ></div>
                  </div>
                  <span class="text-rose-600 font-semibold text-xs whitespace-nowrap">{{ marketStats.liquidation24h.long_percentage }}%</span>
                </div>
                <!-- 空头进度条 + 百分比 -->
                <div class="flex-1 flex items-center gap-2">
                  <span class="text-emerald-600 font-semibold text-xs whitespace-nowrap">{{ marketStats.liquidation24h.short_percentage }}%</span>
                  <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                      :style="{ width: marketStats.liquidation24h.short_percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
      <!-- Tabs and Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <!-- Top Tabs -->
        <div class="border-b border-gray-200">
          <div class="px-6 py-4">
            <div class="flex items-center gap-1">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="selectedTab = tab.value"
                :class="[
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-lg',
                  selectedTab === tab.value
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <!-- 线框图标 -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path v-if="tab.value === 'top100'" stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  <path v-else-if="tab.value === 'ai'" stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  <path v-else-if="tab.value === 'hot'" stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                  <path v-else-if="tab.value === 'favorites'" stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <span>{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Row -->
        <div class="flex items-center justify-between px-6 py-4 bg-gray-50">
          <!-- Left: Chain Filters -->
          <div class="flex items-center gap-2 overflow-x-auto" @click.stop>
            <div class="flex items-center gap-2">
              <button
                v-for="filter in chainFilters"
                :key="filter.value"
                :ref="filter.value === 'more' ? el => { if (el) moreButtonRef = el } : undefined"
                @click.stop="filter.value === 'more' ? toggleMoreChains($event) : (selectedChain = filter.value, showMoreChains = false)"
                :class="[
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
                  filter.value === 'more' && showMoreChains
                    ? 'bg-white border-gray-900 text-gray-900'
                    : selectedChain === filter.value
                    ? 'bg-white border-gray-900 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                ]"
              >
                <img v-if="filter.logo" :src="filter.logo" :alt="filter.label" class="w-4 h-4 rounded-full" />
                <!-- More按钮的三点图标 -->
                <svg v-else-if="filter.value === 'more'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
                <!-- 默认的地球图标 -->
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ filter.label }}</span>
                <span v-if="filter.count" class="text-xs text-gray-400">({{ filter.count }})</span>
              </button>
            </div>
          </div>

          <!-- Right: Search and Filter Button -->
          <div class="flex items-center gap-3" @click.stop>
            <!-- Search -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索代币..."
                class="w-64 pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- Filter Button -->
            <div class="relative">
              <button
                @click.stop="showFilterPanel = !showFilterPanel"
                :class="[
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all border',
                  activeFiltersCount > 0 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                筛选
                <span v-if="activeFiltersCount > 0" class="ml-1 px-1.5 py-0.5 text-xs bg-white text-gray-900 rounded-full font-semibold">{{ activeFiltersCount }}</span>
              </button>

              <!-- Filter Panel -->
              <div
                v-if="showFilterPanel"
                class="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 w-[420px]"
                @click.stop
              >
                <div class="p-6">
                  <!-- Header -->
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold text-gray-900">筛选器</h3>
                    <button @click="showFilterPanel = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                    <!-- Networks -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 mb-2">网络</label>
                      <select
                        v-model="selectedChain"
                        class="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      >
                        <option value="">所有网络</option>
                        <option v-for="chain in allChains" :key="chain.value" :value="chain.value">
                          {{ chain.label }} ({{ chain.count }})
                        </option>
                      </select>
                    </div>

                    <!-- Category -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 mb-2">分类</label>
                      <select
                        v-model="selectedCategory"
                        class="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      >
                        <option value="">所有分类</option>
                        <option value="layer1">Layer 1</option>
                        <option value="defi">DeFi</option>
                        <option value="nft">NFT</option>
                        <option value="meme">Meme</option>
                        <option value="ai">AI</option>
                        <option value="gaming">Gaming</option>
                      </select>
                    </div>

                    <!-- Exchange -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 mb-2">交易所</label>
                      <select
                        v-model="selectedExchange"
                        class="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      >
                        <option value="">所有交易所</option>
                        <option v-for="exchange in allExchanges.filter(e => e.value)" :key="exchange.value" :value="exchange.value">
                          {{ exchange.label }} ({{ exchange.count }})
                        </option>
                      </select>
                    </div>

                    <!-- Market Cap -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 mb-2">市值</label>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 relative">
                          <input
                            v-model="filterMarketCapMin"
                            type="text"
                            placeholder="最小值"
                            class="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          />
                          <span class="absolute right-3 top-2.5 text-sm text-gray-400">$</span>
                        </div>
                        <span class="text-gray-300">-</span>
                        <div class="flex-1 relative">
                          <input
                            v-model="filterMarketCapMax"
                            type="text"
                            placeholder="最大值"
                            class="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          />
                          <span class="absolute right-3 top-2.5 text-sm text-gray-400">$</span>
                        </div>
                      </div>
                    </div>

                    <!-- Price Change (24h) -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 mb-2">24h涨跌幅</label>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 relative">
                          <input
                            v-model="filterPriceChangeMin"
                            type="text"
                            placeholder="最小值"
                            class="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          />
                          <span class="absolute right-3 top-2.5 text-sm text-gray-400">%</span>
                        </div>
                        <span class="text-gray-300">-</span>
                        <div class="flex-1 relative">
                          <input
                            v-model="filterPriceChangeMax"
                            type="text"
                            placeholder="最大值"
                            class="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          />
                          <span class="absolute right-3 top-2.5 text-sm text-gray-400">%</span>
                        </div>
                      </div>
                    </div>

                    <!-- Volume (24h) -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 mb-2">24h交易量</label>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 relative">
                          <input
                            v-model="filterVolumeMin"
                            type="text"
                            placeholder="最小值"
                            class="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          />
                          <span class="absolute right-3 top-2.5 text-sm text-gray-400">$</span>
                        </div>
                        <span class="text-gray-300">-</span>
                        <div class="flex-1 relative">
                          <input
                            v-model="filterVolumeMax"
                            type="text"
                            placeholder="最大值"
                            class="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          />
                          <span class="absolute right-3 top-2.5 text-sm text-gray-400">$</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
                    <button
                      @click="resetFilters"
                      class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      重置
                    </button>
                    <button
                      @click="applyFilters"
                      class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      应用筛选
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Tokens Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 w-12">
                  #
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 min-w-[200px]">
                  Name
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('current_price')">
                  Price
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('price_change_percentage_24h')">
                  24h %
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('market_cap')">
                  <div class="flex items-center justify-end gap-1">
                    Market Cap
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('total_volume')">
                  <div class="flex items-center justify-end gap-1">
                    Volume(24h)
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('avg_funding_rate')">
                  <div class="flex items-center justify-end gap-1">
                    Funding Rate
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('total_open_interest')">
                  <div class="flex items-center justify-end gap-1">
                    Open Interest
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" @click="sortBy('avg_long_short_ratio')">
                  <div class="flex items-center justify-end gap-1">
                    Long/Short
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500">
                  收藏
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(token, index) in paginatedTokens" :key="token.id" class="hover:bg-gray-50 transition-colors cursor-pointer">
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ token.market_cap_rank || (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img v-if="token.logo" :src="token.logo" :alt="token.name" class="w-6 h-6 rounded-full" />
                    <div v-else class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-xs font-bold text-gray-500">{{ token.symbol.substring(0, 1) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-gray-900">{{ token.name }}</span>
                      <span class="text-xs text-gray-500 uppercase">{{ token.symbol }}</span>
                      <span v-if="token.category" class="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                        {{ getCategoryLabel(token.category) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  ${{ formatPrice(parseFloat(token.current_price)) }}
                </td>
                <td class="px-4 py-3 text-right text-sm font-medium">
                  <span :class="getChangeColor(parseFloat(token.price_change_percentage_24h))">
                    {{ token.price_change_24h_formatted }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="text-sm font-medium text-gray-900">{{ token.market_cap_formatted }}</div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="text-sm text-gray-900">{{ token.volume_formatted }}</div>
                </td>
                <td class="px-4 py-3 text-right text-sm font-medium">
                  <span v-if="token.funding_rate_formatted" :class="getFundingRateColor(token.avg_funding_rate)">
                    {{ token.funding_rate_formatted }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div v-if="token.open_interest_formatted" class="text-sm text-gray-900">
                    {{ token.open_interest_formatted }}
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-right text-sm font-medium">
                  <span v-if="token.long_short_ratio_formatted" :class="getLongShortColor(token.avg_long_short_ratio)">
                    {{ token.long_short_ratio_formatted }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click.stop="toggleFavorite(token)"
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isFavoriteProcessing(token.symbol)"
                    :title="token.is_favorited ? '取消收藏' : '收藏'"
                  >
                    <!-- Loading状态 -->
                    <svg
                      v-if="isFavoriteProcessing(token.symbol)"
                      class="w-5 h-5 text-gray-400 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <!-- 收藏图标 -->
                    <svg
                      v-else
                      class="w-5 h-5 transition-colors"
                      :class="token.is_favorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      ></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalTokens) }} / 共 {{ totalTokens }} 个代币
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- More Chains Dropdown (使用Teleport移到body) -->
  <Teleport to="body">
    <div
      v-if="showMoreChains"
      class="fixed bg-white rounded-xl shadow-xl border border-gray-200 min-w-[280px]"
      @click.stop
      :style="{
        top: moreDropdownTop + 'px',
        left: moreDropdownLeft + 'px',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: 9999
      }"
    >
      <div class="py-2">
        <button
          v-for="chain in allChains.filter(c => !mainChains.includes(c.value))"
          :key="chain.value"
          @click="selectedChain = chain.value; showMoreChains = false"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
            selectedChain === chain.value ? 'bg-gray-100 text-gray-900 font-medium' : 'hover:bg-gray-50'
          ]"
        >
          <img v-if="chain.logo" :src="chain.logo" :alt="chain.label" class="w-5 h-5 rounded-full" />
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="flex-1 text-left font-medium">{{ chain.label }}</span>
          <span class="text-xs text-gray-400">({{ chain.count }})</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Header from '../common/Header.vue'
import { apiRequest } from '../../utils/api.js'
import { getChainConfig, getExchangeConfig } from '../../utils/chainConfig.js'
import { showFavoriteSuccess, showUnfavoriteSuccess, showLoginRequired, showError } from '../../utils/notification.js'

// 响应式数据
const searchQuery = ref('')
const selectedTab = ref('top100')  // 默认显示Top100
const selectedExchange = ref('')
const selectedChain = ref('')  // 网络筛选
const selectedCategory = ref('')  // 分类筛选（Layer1, DeFi等）
const currentPage = ref(1)
const pageSize = ref(20)
const sortField = ref('market_cap_rank')
const sortDirection = ref('asc')
const loading = ref(false)
const error = ref(null)
const tokens = ref([])
const totalTokens = ref(0)
const showMoreChains = ref(false)  // 显示更多网络下拉菜单
const showFilterPanel = ref(false)  // 显示筛选面板
const statsLoading = ref(true)  // 市场统计数据加载状态
let moreButtonRef = null  // More按钮的引用
const moreDropdownTop = ref(0)  // More下拉菜单的top位置
const moreDropdownLeft = ref(0)  // More下拉菜单的left位置

// 筛选器字段
const filterMarketCapMin = ref('')
const filterMarketCapMax = ref('')
const filterPriceChangeMin = ref('')
const filterPriceChangeMax = ref('')
const filterVolumeMin = ref('')
const filterVolumeMax = ref('')

// 标签页配置
const tabs = [
  { label: 'Top', value: 'top100' },
  { label: '推荐', value: 'ai' },
  { label: '热门', value: 'hot' },
  { label: '收藏', value: 'favorites' }
]

// 网络筛选器配置（基于实际数据）
const chainFilters = ref([
  { label: 'All Networks', value: '', logo: null }
])

// 主流网络列表（只显示这3个）
const mainChains = ['Ethereum', 'BNB', 'Solana']

// 所有网络列表（用于More下拉菜单）
const allChains = ref([])

// 所有交易所列表（用于筛选面板）
const allExchanges = ref([])

// 加载网络列表
const loadChainFilters = async () => {
  try {
    const response = await apiRequest('http://localhost:8000/api/market/tokens/chains/')

    // 保存所有网络
    allChains.value = response.map(c => {
      const config = getChainConfig(c.chain)
      return {
        label: config.name,
        value: c.chain,
        logo: config.logo,
        count: c.count
      }
    })

    // 只显示主流网络
    const mainChainFilters = allChains.value.filter(c => mainChains.includes(c.value))

    chainFilters.value = [
      { label: 'All Networks', value: '', logo: null },
      ...mainChainFilters,
      { label: 'More', value: 'more', logo: null }
    ]
  } catch (err) {
    console.error('加载网络列表失败:', err)
  }
}

// 加载交易所列表
const loadExchangeFilters = async () => {
  try {
    const response = await apiRequest('http://localhost:8000/api/market/tokens/exchanges/')

    // 保存所有交易所（添加"All Exchanges"选项）
    allExchanges.value = [
      { label: 'All Exchanges', value: '', logo: null, icon: '💱', count: null },
      ...response.map(e => {
        const config = getExchangeConfig(e.exchange)
        return {
          label: config.name,
          value: e.exchange,
          logo: config.logo,
          icon: config.icon,
          count: e.count
        }
      })
    ]
  } catch (err) {
    console.error('加载交易所列表失败:', err)
  }
}

// 市场统计数据（初始为空，避免显示默认值）
const marketStats = ref({
  fearGreedIndex: { value: 0, classification: '' },
  fundingRate: { average: 0, trend: '', label: '' },
  longShortRatio: { ratio: 0, long_percentage: 0, short_percentage: 0 },
  openInterest: { total: 0, change_24h: 0 },
  liquidation24h: { total: 0, longs: 0, shorts: 0, long_percentage: 0, short_percentage: 0 },
  marketCap: 0,
  volume24h: 0,
  btcDominance: 0
})

// 计算活跃筛选器数量
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedExchange.value) count++
  if (selectedCategory.value) count++
  if (filterMarketCapMin.value || filterMarketCapMax.value) count++
  if (filterPriceChangeMin.value || filterPriceChangeMax.value) count++
  if (filterVolumeMin.value || filterVolumeMax.value) count++
  return count
})

// 计算属性
const paginatedTokens = computed(() => tokens.value)

const totalPages = computed(() => {
  return Math.ceil(totalTokens.value / pageSize.value)
})

// 方法
const formatNumber = (num) => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T'
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

const formatPrice = (price) => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 0.01) {
    return price.toFixed(4)
  } else {
    return price.toFixed(6)
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  loadTokensList()
}

// 恐慌贪婪指数 - 文字颜色
const fearIndexColorText = computed(() => {
  const value = marketStats.value.fearGreedIndex.value
  if (value <= 20) return 'text-red-500'
  if (value <= 40) return 'text-orange-500'
  if (value <= 60) return 'text-yellow-500'
  if (value <= 80) return 'text-green-500'
  return 'text-green-600'
})

// 恐慌贪婪指数 - 标签文字
const fearLabel = computed(() => {
  const value = marketStats.value.fearGreedIndex.value
  if (value <= 20) return '极度恐慌'
  if (value <= 40) return '恐慌'
  if (value <= 60) return '中性'
  if (value <= 80) return '贪婪'
  return '极度贪婪'
})

// 资金费率 - 状态徽章样式
const fundingRateStatusBadge = computed(() => {
  const value = marketStats.value.fundingRate.average
  if (value > 0.01) return 'bg-red-50 text-red-600'
  if (value < -0.01) return 'bg-green-50 text-green-600'
  return 'bg-gray-50 text-gray-600'
})

// 用于表格中的资金费率颜色（保留旧函数）
const getFundingRateColor = (value) => {
  if (value > 0.01) return 'text-red-600'
  if (value < -0.01) return 'text-green-600'
  return 'text-gray-600'
}

const getLongShortColor = (value) => {
  const numValue = parseFloat(value)
  if (isNaN(numValue)) return 'text-gray-600'
  if (numValue > 1.2) return 'text-green-600'  // 多头占优
  if (numValue < 0.8) return 'text-red-600'  // 空头占优
  return 'text-gray-600'
}

const getChangeColor = (value) => {
  const numValue = parseFloat(value)
  if (numValue > 0) return 'text-green-600'
  if (numValue < 0) return 'text-red-600'
  return 'text-gray-600'
}

const getCategoryLabel = (category) => {
  const labels = {
    'layer1': 'L1',
    'layer2': 'L2',
    'defi': 'DeFi',
    'nft': 'NFT',
    'meme': 'Meme',
    'ai': 'AI',
    'gaming': 'Gaming'
  }
  return labels[category] || category
}

// 重置筛选器
const resetFilters = () => {
  selectedChain.value = ''
  selectedExchange.value = ''
  selectedCategory.value = ''
  filterMarketCapMin.value = ''
  filterMarketCapMax.value = ''
  filterPriceChangeMin.value = ''
  filterPriceChangeMax.value = ''
  filterVolumeMin.value = ''
  filterVolumeMax.value = ''
}

// 应用筛选器
const applyFilters = () => {
  showFilterPanel.value = false
  loadTokensList()
}

// 切换More下拉菜单
const toggleMoreChains = () => {
  showMoreChains.value = !showMoreChains.value

  if (showMoreChains.value && moreButtonRef) {
    // 计算More按钮的位置
    const rect = moreButtonRef.getBoundingClientRect()
    moreDropdownTop.value = rect.bottom + 8  // 按钮下方8px
    moreDropdownLeft.value = rect.left
  }
}

// 关闭所有下拉菜单
const closeAllDropdowns = () => {
  showMoreChains.value = false
  showFilterPanel.value = false
}

// 正在处理收藏的代币集合
const favoriteProcessing = ref(new Set())

// 最近操作的代币和时间（用于防止快速重复点击）
const recentlyProcessed = ref(new Map())

// 检查是否正在处理
const isFavoriteProcessing = (symbol) => {
  return favoriteProcessing.value.has(symbol)
}

// 检查是否在冷却期内
const isInCooldown = (symbol) => {
  const lastTime = recentlyProcessed.value.get(symbol)
  if (!lastTime) return false

  const cooldownPeriod = 1000 // 1秒冷却期
  return Date.now() - lastTime < cooldownPeriod
}

// 切换收藏状态
const toggleFavorite = async (token) => {
  // 防止重复点击
  if (favoriteProcessing.value.has(token.symbol)) {
    return
  }

  // 检查冷却期（防止快速连续点击）
  if (isInCooldown(token.symbol)) {
    return
  }

  try {
    // 标记为处理中
    favoriteProcessing.value.add(token.symbol)

    const response = await apiRequest(
      `http://localhost:8000/api/market/tokens/${token.symbol}/toggle_favorite/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status === 'success') {
      // 更新本地状态
      token.is_favorited = response.is_favorited

      // 显示通知
      if (response.is_favorited) {
        showFavoriteSuccess(token.name || token.symbol)
      } else {
        showUnfavoriteSuccess(token.name || token.symbol)
      }

      // 如果当前在收藏TAB，重新加载列表
      if (selectedTab.value === 'favorites' && !response.is_favorited) {
        loadTokensList()
      }
    }
  } catch (err) {
    console.error('切换收藏失败:', err)
    // 如果是401错误，提示用户登录
    if (err.message && err.message.includes('401')) {
      showLoginRequired()
    } else {
      showError('操作失败，请稍后重试')
    }
  } finally {
    // 移除处理中标记
    favoriteProcessing.value.delete(token.symbol)

    // 记录最后操作时间（用于冷却期）
    recentlyProcessed.value.set(token.symbol, Date.now())
  }
}

// 加载市场统计数据
const loadMarketStats = async () => {
  statsLoading.value = true
  try {
    const response = await apiRequest('http://localhost:8000/api/market/stats/')

    if (response.status === 'success') {
      marketStats.value = {
        fearGreedIndex: response.data.fear_greed_index,
        fundingRate: response.data.funding_rate,
        longShortRatio: response.data.long_short_ratio,
        openInterest: response.data.open_interest,
        liquidation24h: response.data.liquidation_24h,
        marketCap: response.data.market_cap,
        volume24h: response.data.volume_24h,
        btcDominance: response.data.btc_dominance
      }
    }
  } catch (err) {
    console.error('加载市场统计数据失败:', err)
  } finally {
    statsLoading.value = false
  }
}

// 加载代币列表
const loadTokensList = async () => {
  loading.value = true
  error.value = null

  try {
    let endpoint = 'http://localhost:8000/api/market/tokens/'
    let method = 'GET'
    let requestData = null

    // 根据标签页选择不同的端点
    switch (selectedTab.value) {
      case 'favorites':
        endpoint = 'http://localhost:8000/api/market/tokens/favorites/'
        break
      case 'top100':
        endpoint = 'http://localhost:8000/api/market/tokens/top100/'
        break
      case 'hot':
        endpoint = 'http://localhost:8000/api/market/tokens/hot/'
        break
      case 'ai':
        endpoint = 'http://localhost:8000/api/market/tokens/ai_recommend/'
        method = 'POST'
        requestData = {
          user_profile: {
            risk_tolerance: 'medium',
            investment_amount: 10000,
            preferred_categories: ['defi', 'layer1'],
            trading_style: 'swing'
          }
        }
        break
      case 'newest':
        endpoint = 'http://localhost:8000/api/market/tokens/newest/'
        break
      default:
        endpoint = 'http://localhost:8000/api/market/tokens/'
    }

    const params = new URLSearchParams({
      page: currentPage.value,
      page_size: pageSize.value,
    })

    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }

    if (selectedExchange.value) {
      params.append('exchange', selectedExchange.value)
    }

    if (selectedChain.value && selectedChain.value !== 'more') {
      params.append('chain', selectedChain.value)
    }

    if (selectedCategory.value && selectedCategory.value !== 'more') {
      params.append('category', selectedCategory.value)
    }

    if (sortField.value && selectedTab.value === 'top100') {
      const orderingField = sortDirection.value === 'desc' ? `-${sortField.value}` : sortField.value
      params.append('ordering', orderingField)
    }

    let response
    if (method === 'POST') {
      // AI推荐使用POST请求
      response = await apiRequest(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
    } else {
      // 其他使用GET请求
      const url = endpoint.includes('?') ? `${endpoint}&${params.toString()}` : `${endpoint}?${params.toString()}`
      response = await apiRequest(url)
    }

    // 处理不同的响应格式
    if (response.status === 'success') {
      // 新接口格式
      tokens.value = response.data || response.recommended_tokens || []
      totalTokens.value = response.count || tokens.value.length
    } else if (Array.isArray(response)) {
      tokens.value = response
      totalTokens.value = response.length
    } else if (response.results) {
      tokens.value = response.results
      totalTokens.value = response.count
    } else {
      tokens.value = []
      totalTokens.value = 0
    }
  } catch (err) {
    console.error('加载代币列表失败:', err)
    error.value = '加载数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化
watch([searchQuery, selectedTab, selectedExchange, selectedChain, selectedCategory], () => {
  currentPage.value = 1
  loadTokensList()
})

watch(currentPage, () => {
  loadTokensList()
})

// 组件挂载时加载数据
onMounted(() => {
  loadMarketStats()
  loadTokensList()
  loadChainFilters()
  loadExchangeFilters()

  // 每30秒刷新市场统计数据
  setInterval(() => {
    loadMarketStats()
  }, 30000)
})
</script>

<style scoped>
/* 自定义样式 */
</style>

