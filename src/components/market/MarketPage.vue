<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" @click="closeAllDropdowns">
    <!-- Header -->
    <Header />

    <!-- Market Overview Stats - Premium Design -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <!-- Tabs and Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- Top Tabs -->
        <div class="border-b border-gray-200">
          <div class="px-6 py-4">
            <div class="flex items-center gap-1">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="switchTab(tab.value)"
                :class="[
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-lg',
                  selectedTab === tab.value
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <!-- 线框图标 -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <!-- 衍生品：图表上升趋势 -->
                  <path v-if="tab.value === 'derivatives'" stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  <!-- 现货：购物袋 -->
                  <path v-else-if="tab.value === 'spot'" stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  <!-- 热门：火焰 -->
                  <path v-else-if="tab.value === 'hot'" stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                  <path v-else-if="tab.value === 'hot'" stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                  <!-- 收藏：星星 -->
                  <path v-else-if="tab.value === 'favorites'" stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <span>{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Row -->
        <div class="flex items-center justify-between px-6 py-4 bg-gray-50">
          <!-- Left: Category Filters -->
          <div class="flex items-center gap-3 overflow-x-auto" @click.stop>
            <!-- 分类筛选器 -->
            <div class="flex items-center gap-2">
              <button
                v-for="filter in categoryFilters"
                :key="filter.value"
                :ref="filter.value === 'more' ? el => { if (el) moreButtonRef = el } : undefined"
                @click.stop="filter.value === 'more' ? toggleMoreCategories($event) : (selectedCategory = filter.value, showMoreCategories = false)"
                :class="[
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
                  filter.value === 'more' && showMoreCategories
                    ? 'bg-white border-gray-900 text-gray-900'
                    : selectedCategory === filter.value
                    ? 'bg-white border-gray-900 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                ]"
              >
                <!-- 线框图标 -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <!-- All Categories -->
                  <path v-if="filter.value === ''" stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  <!-- Layer 1 -->
                  <path v-else-if="filter.value === 'layer1'" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                  <!-- Layer 2 -->
                  <path v-else-if="filter.value === 'layer2'" stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  <!-- DeFi -->
                  <path v-else-if="filter.value === 'defi'" stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <!-- Meme -->
                  <path v-else-if="filter.value === 'meme'" stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <!-- NFT -->
                  <path v-else-if="filter.value === 'nft'" stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  <!-- AI -->
                  <path v-else-if="filter.value === 'ai'" stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  <!-- GameFi -->
                  <path v-else-if="filter.value === 'gamefi'" stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                  <!-- Stablecoin -->
                  <path v-else-if="filter.value === 'stablecoin'" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  <!-- Exchange -->
                  <path v-else-if="filter.value === 'exchange'" stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  <!-- Payment -->
                  <path v-else-if="filter.value === 'payment'" stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  <!-- More -->
                  <path v-else-if="filter.value === 'more'" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Sidebar Panel -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showFilterPanel"
        class="fixed inset-0 z-50"
        @click="showFilterPanel = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
    </Transition>

    <!-- Sidebar with slide animation -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-300 ease-in"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="showFilterPanel"
        class="fixed top-0 right-0 h-full w-[340px] bg-white shadow-2xl flex flex-col z-50"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 flex-shrink-0">
          <h3 class="text-base font-semibold text-gray-900">高级筛选</h3>
          <button @click="showFilterPanel = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
          <div class="space-y-4">
            <!-- Market Sentiment -->
            <div>
              <label class="block text-xs font-medium text-gray-900 mb-2">市场情绪</label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  @click="filterMarketSentiment = filterMarketSentiment === 'bullish' ? '' : 'bullish'"
                  :class="[
                    'flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all border-2',
                    filterMarketSentiment === 'bullish'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span>看多</span>
                </button>
                <button
                  @click="filterMarketSentiment = filterMarketSentiment === 'neutral' ? '' : 'neutral'"
                  :class="[
                    'flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all border-2',
                    filterMarketSentiment === 'neutral'
                      ? 'bg-gray-50 border-gray-500 text-gray-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path>
                  </svg>
                  <span>中性</span>
                </button>
                <button
                  @click="filterMarketSentiment = filterMarketSentiment === 'bearish' ? '' : 'bearish'"
                  :class="[
                    'flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all border-2',
                    filterMarketSentiment === 'bearish'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                  </svg>
                  <span>看空</span>
                </button>
              </div>
              <p class="mt-1.5 text-xs text-gray-500">基于资金费率和多空比综合判断</p>
            </div>

            <!-- Exchange -->
            <div>
              <label class="block text-xs font-medium text-gray-900 mb-2">交易所</label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  @click="selectedExchange = ''"
                  :class="[
                    'px-2 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    selectedExchange === ''
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  全部
                </button>
                <button
                  v-for="exchange in allExchanges.filter(e => e.value).slice(0, 8)"
                  :key="exchange.value"
                  @click="selectedExchange = selectedExchange === exchange.value ? '' : exchange.value"
                  :class="[
                    'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    selectedExchange === exchange.value
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  <img v-if="exchange.logo" :src="exchange.logo" :alt="exchange.label" class="w-4 h-4 rounded-full" />
                  <span>{{ exchange.label }}</span>
                </button>
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-xs font-medium text-gray-900 mb-2">分类</label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  @click="selectedCategory = ''"
                  :class="[
                    'px-2 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    selectedCategory === ''
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  全部
                </button>
                <button
                  v-for="cat in [
                    { value: 'layer1', label: 'Layer 1' },
                    { value: 'defi', label: 'DeFi' },
                    { value: 'nft', label: 'NFT' },
                    { value: 'meme', label: 'Meme' },
                    { value: 'ai', label: 'AI' },
                    { value: 'gaming', label: 'Gaming' }
                  ]"
                  :key="cat.value"
                  @click="selectedCategory = selectedCategory === cat.value ? '' : cat.value"
                  :class="[
                    'px-2 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    selectedCategory === cat.value
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  {{ cat.label }}
                </button>
              </div>
            </div>

            <!-- Market Cap -->
            <div>
              <label class="block text-xs font-medium text-gray-900 mb-2">市值范围</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model="filterMarketCapMin"
                  type="text"
                  placeholder="最小值"
                  class="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <span class="text-gray-400 text-xs flex-shrink-0">-</span>
                <input
                  v-model="filterMarketCapMax"
                  type="text"
                  placeholder="最大值"
                  class="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Price Change (24h) -->
            <div>
              <label class="block text-xs font-medium text-gray-900 mb-2">24h涨跌幅</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model="filterPriceChangeMin"
                  type="text"
                  placeholder="最小值"
                  class="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <span class="text-gray-400 text-xs flex-shrink-0">-</span>
                <input
                  v-model="filterPriceChangeMax"
                  type="text"
                  placeholder="最大值"
                  class="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Volume (24h) -->
            <div>
              <label class="block text-xs font-medium text-gray-900 mb-2">24h成交量</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model="filterVolumeMin"
                  type="text"
                  placeholder="最小值"
                  class="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <span class="text-gray-400 text-xs flex-shrink-0">-</span>
                <input
                  v-model="filterVolumeMax"
                  type="text"
                  placeholder="最大值"
                  class="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center gap-2 px-4 py-3.5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            @click="resetFilters"
            class="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            重置
          </button>
          <button
            @click="applyFilters"
            class="flex-1 px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            应用筛选
          </button>
        </div>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
          <table class="w-full" style="table-layout: fixed; min-width: 1200px;">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <!-- 排名 -->
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500" style="width: 50px;">
                  #
                </th>
                <!-- 币种 -->
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500" style="width: 160px;">
                  币种
                </th>
                <!-- 价格 -->
                <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 110px;" @click="sortBy('current_price')">
                  <div class="flex items-center justify-end gap-1">
                    价格
                    <div class="flex flex-col -space-y-1.5">
                      <svg class="w-3 h-3" :class="sortField === 'current_price' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                        <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg class="w-3 h-3" :class="sortField === 'current_price' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                        <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </th>

                <!-- 衍生品专属列 -->
                <template v-if="selectedTab === 'derivatives'">
                  <!-- 24h% -->
                  <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 80px;" @click="sortBy('price_change_percentage_24h')">
                    <div class="flex items-center justify-end gap-1">
                      24h%
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 资金费率 -->
                  <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 85px;" @click="sortBy('avg_funding_rate')">
                    <div class="flex items-center justify-end gap-1">
                      费率
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'avg_funding_rate' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'avg_funding_rate' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 24h交易额 -->
                  <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('total_volume')">
                    <div class="flex items-center justify-end gap-1">
                      交易额
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 市值 -->
                  <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('market_cap')">
                    <div class="flex items-center justify-end gap-1">
                      市值
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 持仓 -->
                  <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('total_open_interest')">
                    <div class="flex items-center justify-end gap-1">
                      持仓
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'total_open_interest' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'total_open_interest' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 多空比 -->
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 95px;" @click="sortBy('avg_long_short_ratio')">
                    <div class="flex items-center justify-center gap-1">
                      多空比
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'avg_long_short_ratio' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'avg_long_short_ratio' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                </template>

                <!-- 现货专属列 -->
                <template v-else-if="selectedTab === 'spot'">
                  <!-- 价格(24h%) -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('price_change_percentage_24h')">
                    <div class="flex items-center justify-end gap-1">
                      价格(24h%)
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 价格(7d%) -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('price_change_percentage_7d')">
                    <div class="flex items-center justify-end gap-1">
                      价格(7d%)
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_7d' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_7d' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 成交额(24h) -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 120px;" @click="sortBy('total_volume')">
                    <div class="flex items-center justify-end gap-1">
                      成交额(24h)
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 市值 -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 120px;" @click="sortBy('market_cap')">
                    <div class="flex items-center justify-end gap-1">
                      市值
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                </template>

                <!-- 热门Tab的列 -->
                <template v-else-if="selectedTab === 'hot'">
                  <!-- 24h涨跌 -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('price_change_percentage_24h')">
                    <div class="flex items-center justify-end gap-1">
                      24h涨跌
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 24h成交量 -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 110px;" @click="sortBy('total_volume')">
                    <div class="flex items-center justify-end gap-1">
                      24h成交量
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 市值 -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 110px;" @click="sortBy('market_cap')">
                    <div class="flex items-center justify-end gap-1">
                      市值
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <!-- 热度 -->
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 120px;" @click="sortBy('hot_score')">
                    <div class="flex items-center justify-end gap-1">
                      热度
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'hot_score' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'hot_score' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                </template>

                <!-- 收藏Tab的列（保持原有的列） -->
                <template v-else-if="selectedTab === 'favorites'">
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 100px;" @click="sortBy('price_change_percentage_24h')">
                    <div class="flex items-center justify-end gap-1">
                      24h涨跌
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'price_change_percentage_24h' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 120px;" @click="sortBy('market_cap')">
                    <div class="flex items-center justify-end gap-1">
                      市值
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'market_cap' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" style="width: 120px;" @click="sortBy('total_volume')">
                    <div class="flex items-center justify-end gap-1">
                      24h成交量
                      <div class="flex flex-col -space-y-1.5">
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,10 8,6 12,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="w-3 h-3" :class="sortField === 'total_volume' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                          <polyline points="4,6 8,10 12,6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </th>
                </template>

                <!-- 收藏（所有Tab都显示） -->
                <th class="px-2 py-3 text-center text-xs font-medium text-gray-500" style="width: 60px;">
                  收藏
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="(token, index) in paginatedTokens"
                :key="token.id"
                @click="navigateToTokenDetail(token.symbol)"
                class="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <!-- 排名 -->
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ token.market_cap_rank || (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <!-- 币种 -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      :src="getTokenLogoUrl(token)"
                      :alt="token.name"
                      class="w-6 h-6 rounded-full flex-shrink-0"
                      @error="handleImageError"
                    />
                    <div class="flex flex-col gap-1 min-w-0 flex-1">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="text-sm font-semibold text-gray-900 truncate">{{ token.name }}</span>
                        <span class="text-xs text-gray-500 uppercase flex-shrink-0">{{ token.symbol }}</span>
                        <span v-if="token.category" class="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded flex-shrink-0">
                          {{ getCategoryLabel(token.category) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <!-- 价格 -->
                <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  <div class="flex items-center justify-end gap-1">
                    <span class="tabular-nums">${{ formatPrice(parseFloat(realtimePrices.get(token.symbol) || token.current_price)) }}</span>
                    <span v-if="realtimePrices.has(token.symbol)" class="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" title="实时数据"></span>
                  </div>
                </td>

                <!-- 衍生品专属列 -->
                <template v-if="selectedTab === 'derivatives'">
                  <!-- 价格(24h%) -->
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span class="tabular-nums" :class="getChangeColor(parseFloat(token.price_change_percentage_24h))">
                      {{ token.price_change_24h_formatted || '-' }}
                    </span>
                  </td>
                  <!-- 资金费率 -->
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span v-if="token.funding_rate_formatted" class="tabular-nums" :class="getFundingRateColor(token.avg_funding_rate)">
                      {{ token.funding_rate_formatted }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <!-- 24h交易额 -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm text-gray-900 tabular-nums">{{ token.volume_formatted || '-' }}</div>
                  </td>
                  <!-- 市值 -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm font-medium text-gray-900 tabular-nums">{{ token.market_cap_formatted || '-' }}</div>
                  </td>
                  <!-- 持仓 -->
                  <td class="px-4 py-3 text-right">
                    <div v-if="token.open_interest_formatted" class="text-sm text-gray-900 tabular-nums">
                      {{ token.open_interest_formatted }}
                    </div>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <!-- 多空比（合并显示） -->
                  <td class="px-4 py-3 text-center">
                    <div v-if="token.long_ratio !== null && token.short_ratio !== null" class="text-xs tabular-nums whitespace-nowrap">
                      <span class="text-emerald-600 font-medium">{{ token.long_ratio.toFixed(1) }}%</span>
                      <span class="text-gray-400 mx-0.5">/</span>
                      <span class="text-rose-600 font-medium">{{ token.short_ratio.toFixed(1) }}%</span>
                    </div>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </template>

                <!-- 现货专属列 -->
                <template v-else-if="selectedTab === 'spot'">
                  <!-- 价格(24h%) -->
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span class="tabular-nums" :class="getChangeColor(parseFloat(token.price_change_percentage_24h))">
                      {{ token.price_change_24h_formatted || '-' }}
                    </span>
                  </td>
                  <!-- 价格(7d%) -->
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span v-if="token.price_change_7d_formatted" class="tabular-nums" :class="getChangeColor(parseFloat(token.price_change_percentage_7d))">
                      {{ token.price_change_7d_formatted }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <!-- 成交额(24h) -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm text-gray-900 tabular-nums">{{ token.volume_formatted || '-' }}</div>
                  </td>
                  <!-- 市值 -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm font-medium text-gray-900 tabular-nums">{{ token.market_cap_formatted || '-' }}</div>
                  </td>
                </template>

                <!-- 热门Tab的列 -->
                <template v-else-if="selectedTab === 'hot'">
                  <!-- 24h涨跌 -->
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span class="tabular-nums" :class="getChangeColor(parseFloat(token.price_change_percentage_24h))">
                      {{ token.price_change_24h_formatted || '-' }}
                    </span>
                  </td>
                  <!-- 24h成交量 -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm text-gray-900 tabular-nums">{{ token.volume_formatted || '-' }}</div>
                  </td>
                  <!-- 市值 -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm font-medium text-gray-900 tabular-nums">{{ token.market_cap_formatted || '-' }}</div>
                  </td>
                  <!-- 热度 -->
                  <td class="px-4 py-3 text-right">
                    <span class="inline-flex items-center gap-1 text-sm font-medium tabular-nums whitespace-nowrap" :class="getHotScoreColor(token.hot_score)">
                      {{ getHotScoreIcon(token.hot_score) }}
                      {{ token.hot_score_formatted || '-' }}
                    </span>
                  </td>
                </template>

                <!-- 收藏Tab的列 -->
                <template v-else-if="selectedTab === 'favorites'">
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span class="tabular-nums" :class="getChangeColor(parseFloat(token.price_change_percentage_24h))">
                      {{ token.price_change_24h_formatted || '-' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm font-medium text-gray-900 tabular-nums">{{ token.market_cap_formatted || '-' }}</div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm text-gray-900 tabular-nums">{{ token.volume_formatted || '-' }}</div>
                  </td>
                </template>
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

        <!-- Pagination / Load More -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <!-- 加载更多模式（热门和Top100） -->
          <div v-if="useLoadMoreMode" class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              已显示 {{ tokens.length }} / 共 {{ totalTokens }} 个代币
            </div>
            <div
              v-if="hasMore"
              @click="loadMore"
              class="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <span v-if="loading">加载中...</span>
              <span v-else>加载更多...</span>
            </div>
            <div v-else class="text-sm text-gray-500">
              已加载全部数据
            </div>
          </div>

          <!-- 传统分页模式（其他tab） -->
          <div v-else class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalTokens) }} / 共 {{ totalTokens }} 个代币
            </div>
            <div class="flex items-center gap-2">
              <!-- 上一页 -->
              <button
                @click.prevent="currentPage--"
                :disabled="currentPage === 1 || loading"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>

              <!-- 页码 -->
              <div class="flex items-center gap-1">
                <!-- 第一页 -->
                <button
                  v-if="totalPages > 0"
                  @click.prevent="currentPage = 1"
                  :disabled="loading"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100',
                    loading && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  1
                </button>

                <!-- 左侧省略号 -->
                <span v-if="currentPage > 3" class="px-2 text-gray-400">...</span>

                <!-- 中间页码 -->
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click.prevent="currentPage = page"
                  :disabled="loading"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100',
                    loading && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  {{ page }}
                </button>

                <!-- 右侧省略号 -->
                <span v-if="currentPage < totalPages - 2" class="px-2 text-gray-400">...</span>

                <!-- 最后一页 -->
                <button
                  v-if="totalPages > 1"
                  @click.prevent="currentPage = totalPages"
                  :disabled="loading"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === totalPages
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100',
                    loading && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  {{ totalPages }}
                </button>
              </div>

              <!-- 下一页 -->
              <button
                @click.prevent="currentPage++"
                :disabled="currentPage >= totalPages || loading"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>

              <!-- 加载指示器 -->
              <div v-if="loading" class="ml-3 flex items-center gap-2 text-sm text-gray-500">
                <svg class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>加载中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- More Categories Dropdown (使用Teleport移到body) -->
  <Teleport to="body">
    <div
      v-if="showMoreCategories"
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
          v-for="category in allCategories.filter(c => !mainCategories.includes(c.value))"
          :key="category.value"
          @click="selectedCategory = category.value; showMoreCategories = false"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
            selectedCategory === category.value ? 'bg-gray-100 text-gray-900 font-medium' : 'hover:bg-gray-50'
          ]"
        >
          <!-- 线框图标 -->
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <!-- Layer 1 -->
            <path v-if="category.value === 'layer1'" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
            <!-- Layer 2 -->
            <path v-else-if="category.value === 'layer2'" stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            <!-- DeFi -->
            <path v-else-if="category.value === 'defi'" stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <!-- Meme -->
            <path v-else-if="category.value === 'meme'" stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <!-- NFT -->
            <path v-else-if="category.value === 'nft'" stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            <!-- AI -->
            <path v-else-if="category.value === 'ai'" stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            <!-- GameFi -->
            <path v-else-if="category.value === 'gamefi'" stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
            <!-- Stablecoin -->
            <path v-else-if="category.value === 'stablecoin'" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            <!-- Exchange -->
            <path v-else-if="category.value === 'exchange'" stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            <!-- Payment -->
            <path v-else-if="category.value === 'payment'" stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          <span class="flex-1 text-left font-medium">{{ category.label }}</span>
          <span class="text-xs text-gray-400">({{ category.count }})</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import { getChainConfig, getExchangeConfig } from '../../utils/chainConfig.js'
import { showFavoriteSuccess, showUnfavoriteSuccess, showLoginRequired, showError } from '../../utils/notification.js'
import { useUserStore } from '../../utils/userStore.js'
import wsManager from '../../utils/websocket.js'
import { getTokenLogo, handleImageError } from '../../utils/tokenUtils.js'

const router = useRouter()
const userStore = useUserStore()

// WebSocket 连接管理
const wsConnections = new Map() // symbol -> callback
const realtimePrices = ref(new Map()) // symbol -> price

// 响应式数据
const searchQuery = ref('')
// 从 localStorage 或 URL 参数读取上次选择的 tab，默认为 'derivatives'
const getInitialTab = () => {
  // 优先从 URL 参数读取
  const urlParams = new URLSearchParams(window.location.search)
  const tabFromUrl = urlParams.get('tab')
  if (tabFromUrl && ['derivatives', 'spot', 'favorites'].includes(tabFromUrl)) {
    // 如果未登录且选择的是收藏 tab，重定向到 derivatives
    if (!userStore.isAuthenticated.value && tabFromUrl === 'favorites') {
      return 'derivatives'
    }
    return tabFromUrl
  }
  // 其次从 localStorage 读取
  const savedTab = localStorage.getItem('market_selected_tab')
  if (savedTab && ['derivatives', 'spot', 'favorites'].includes(savedTab)) {
    // 如果未登录且选择的是收藏 tab，重定向到 derivatives
    if (!userStore.isAuthenticated.value && savedTab === 'favorites') {
      return 'derivatives'
    }
    return savedTab
  }
  return 'derivatives'
}
const selectedTab = ref(getInitialTab())
const selectedExchange = ref('')
const selectedCategory = ref('')  // 分类筛选（Layer1, DeFi, Meme等）
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)  // 是否还有更多数据

// 根据初始 Tab 设置默认排序
const getInitialSort = () => {
  const tab = getInitialTab()
  if (tab === 'derivatives' || tab === 'spot' || tab === 'favorites') {
    return { field: 'market_cap_rank', direction: 'asc' }
  }
  return { field: 'market_cap_rank', direction: 'asc' }
}
const initialSort = getInitialSort()
const sortField = ref(initialSort.field)
const sortDirection = ref(initialSort.direction)
const loading = ref(false)
const error = ref(null)
const tokens = ref([])
const totalTokens = ref(0)
const showMoreCategories = ref(false)  // 显示更多分类下拉菜单
const showFilterPanel = ref(false)  // 显示筛选面板
const statsLoading = ref(true)  // 市场统计数据加载状态
let moreButtonRef = null  // More按钮的引用
const moreDropdownTop = ref(0)  // More下拉菜单的top位置
const moreDropdownLeft = ref(0)  // More下拉菜单的left位置
const userProfile = ref(null)  // 用户画像信息

// 筛选器字段
const filterMarketCapMin = ref('')
const filterMarketCapMax = ref('')
const filterPriceChangeMin = ref('')
const filterPriceChangeMax = ref('')
const filterVolumeMin = ref('')
const filterVolumeMax = ref('')
const filterMarketSentiment = ref('')  // 市场情绪：bullish(看多), bearish(看空), neutral(中性)

// 标签页配置（根据登录状态动态显示）
const tabs = computed(() => {
  const allTabs = [
    { label: '衍生品', value: 'derivatives' },
    { label: '现货', value: 'spot' },
    { label: '热门', value: 'hot' },
    { label: '收藏', value: 'favorites' }
  ]

  // 如果未登录，过滤掉收藏
  if (!userStore.isAuthenticated.value) {
    return allTabs.filter(tab => tab.value !== 'favorites')
  }

  return allTabs
})

// 分类筛选器配置
const categoryFilters = ref([
  { label: 'All Categories', value: '' }
])

// 主流分类列表（显示在顶部）
const mainCategories = ['layer1', 'defi', 'meme', 'ai']

// 所有分类列表（用于More下拉菜单）
const allCategories = ref([])

// 分类名称映射
const categoryNames = {
  'layer1': 'Layer 1',
  'layer2': 'Layer 2',
  'defi': 'DeFi',
  'meme': 'Meme',
  'nft': 'NFT',
  'ai': 'AI',
  'gamefi': 'GameFi',
  'stablecoin': 'Stablecoin',
  'exchange': 'Exchange',
  'payment': 'Payment'
}

// 所有交易所列表（用于筛选面板）
const allExchanges = ref([])

// 加载分类列表
const loadCategoryFilters = async () => {
  try {
    // 根据当前tab加载对应的分类统计
    const url = `${API_ENDPOINTS.MARKET_TOKENS_CATEGORIES}?tab=${selectedTab.value}`
    const response = await apiRequest(url)

    // 保存所有分类
    allCategories.value = response.map(c => ({
      label: categoryNames[c.category] || c.category,
      value: c.category,
      count: c.count
    }))

    // 只显示主流分类
    const mainCategoryFilters = allCategories.value.filter(c => mainCategories.includes(c.value))

    categoryFilters.value = [
      { label: 'All Categories', value: '' },
      ...mainCategoryFilters,
      { label: 'More', value: 'more' }
    ]
  } catch (err) {
    console.error('加载分类列表失败:', err)
  }
}

// 加载交易所列表
const loadExchangeFilters = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKENS_EXCHANGES)

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
  if (filterMarketSentiment.value) count++
  return count
})

// 计算属性
const paginatedTokens = computed(() => {
  let filtered = tokens.value

  // 如果有市场情绪筛选，在前端进行过滤
  if (filterMarketSentiment.value) {
    filtered = filtered.filter(token => {
      const sentiment = getMarketSentimentStyle(token)

      if (filterMarketSentiment.value === 'bullish') {
        return sentiment.label === '看多'
      } else if (filterMarketSentiment.value === 'bearish') {
        return sentiment.label === '看空'
      } else if (filterMarketSentiment.value === 'neutral') {
        return sentiment.label === '中性'
      }
      return true
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(totalTokens.value / pageSize.value)
})

// 计算可见的页码（显示当前页附近的页码）
const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value

  // 如果总页数小于等于7，显示所有页码
  if (total <= 7) {
    for (let i = 2; i < total; i++) {
      pages.push(i)
    }
    return pages
  }

  // 显示当前页附近的页码
  if (current <= 3) {
    // 当前页在前面，显示 2, 3, 4
    for (let i = 2; i <= 4; i++) {
      if (i < total) pages.push(i)
    }
  } else if (current >= total - 2) {
    // 当前页在后面，显示倒数第4、3、2页
    for (let i = total - 3; i < total; i++) {
      if (i > 1) pages.push(i)
    }
  } else {
    // 当前页在中间，显示前后各一页
    pages.push(current - 1, current, current + 1)
  }

  return pages
})

// 方法
// Navigate to token detail page
const navigateToTokenDetail = (symbol) => {
  router.push(`/market/${symbol}`)
}

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
    sortDirection.value = 'desc'  // 默认降序
  }

  // 对于"加载更多"模式，重置页码并重新加载
  if (useLoadMoreMode.value) {
    currentPage.value = 1
    loadTokensList(false)
  } else {
    loadTokensList(false)
  }
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

const getChangeColor = (value) => {
  const numValue = parseFloat(value)
  if (numValue > 0) return 'text-green-600'
  if (numValue < 0) return 'text-red-600'
  return 'text-gray-600'
}

// 热度评分颜色
const getHotScoreColor = (score) => {
  if (score >= 1000) return 'text-red-600'
  if (score >= 100) return 'text-orange-500'
  if (score >= 10) return 'text-yellow-600'
  return 'text-gray-500'
}

// 热度评分图标
const getHotScoreIcon = (score) => {
  if (score >= 1000) return '🔥🔥🔥'
  if (score >= 100) return '🔥🔥'
  if (score >= 10) return '🔥'
  return '💧'
}

// 推荐分数颜色
const getRecommendationScoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
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

// 获取交易所Logo
const getExchangeLogo = (exchangeName) => {
  const config = getExchangeConfig(exchangeName)
  return config.logo || null
}

// 获取代币 Logo URL（包装函数）
const getTokenLogoUrl = (token) => {
  return getTokenLogo(token)
}

// 计算市场情绪
const getMarketSentimentStyle = (token) => {
  const fundingRate = parseFloat(token.avg_funding_rate)
  const longShortRatio = parseFloat(token.avg_long_short_ratio)

  // 如果两个指标都没有，返回中性
  if (isNaN(fundingRate) && isNaN(longShortRatio)) {
    return {
      label: '中性',
      class: 'bg-gray-50 text-gray-600 border border-gray-200'
    }
  }

  // 计算情绪分数（-1到1之间）
  let sentimentScore = 0
  let scoreCount = 0

  // 资金费率贡献（正值表示多头强势，负值表示空头强势）
  if (!isNaN(fundingRate)) {
    if (fundingRate > 0.01) sentimentScore += 1  // 强多头
    else if (fundingRate > 0) sentimentScore += 0.5  // 弱多头
    else if (fundingRate < -0.01) sentimentScore -= 1  // 强空头
    else if (fundingRate < 0) sentimentScore -= 0.5  // 弱空头
    scoreCount++
  }

  // 多空比贡献（>1表示多头多，<1表示空头多）
  if (!isNaN(longShortRatio)) {
    if (longShortRatio > 1.2) sentimentScore += 1  // 强多头
    else if (longShortRatio > 1) sentimentScore += 0.5  // 弱多头
    else if (longShortRatio < 0.8) sentimentScore -= 1  // 强空头
    else if (longShortRatio < 1) sentimentScore -= 0.5  // 弱空头
    scoreCount++
  }

  // 计算平均分数
  const avgScore = scoreCount > 0 ? sentimentScore / scoreCount : 0

  // 根据分数返回情绪（简约商务风格）
  if (avgScore > 0.5) {
    return {
      label: '看多',
      class: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    }
  } else if (avgScore < -0.5) {
    return {
      label: '看空',
      class: 'bg-rose-50 text-rose-700 border border-rose-200'
    }
  } else {
    return {
      label: '中性',
      class: 'bg-gray-50 text-gray-600 border border-gray-200'
    }
  }
}

// 重置筛选器
const resetFilters = () => {
  selectedCategory.value = ''
  selectedExchange.value = ''
  filterMarketCapMin.value = ''
  filterMarketCapMax.value = ''
  filterPriceChangeMin.value = ''
  filterPriceChangeMax.value = ''
  filterVolumeMin.value = ''
  filterVolumeMax.value = ''
  filterMarketSentiment.value = ''
}

// 应用筛选器
const applyFilters = () => {
  showFilterPanel.value = false
  currentPage.value = 1  // 重置到第一页
  loadTokensList()
}

// 切换More下拉菜单
const toggleMoreCategories = () => {
  showMoreCategories.value = !showMoreCategories.value

  if (showMoreCategories.value && moreButtonRef) {
    // 计算More按钮的位置
    const rect = moreButtonRef.getBoundingClientRect()
    moreDropdownTop.value = rect.bottom + 8  // 按钮下方8px
    moreDropdownLeft.value = rect.left
  }
}

// 关闭所有下拉菜单
const closeAllDropdowns = () => {
  showMoreCategories.value = false
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
      API_ENDPOINTS.MARKET_TOKEN_TOGGLE_FAVORITE(token.symbol),
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
    const response = await apiRequest(API_ENDPOINTS.MARKET_STATS)

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

// 判断是否使用"加载更多"模式
const useLoadMoreMode = computed(() => {
  return selectedTab.value === 'top100'
})

// 加载代币列表
const loadTokensList = async (append = false) => {
  loading.value = true
  error.value = null

  try {
    let endpoint = API_ENDPOINTS.MARKET_TOKENS

    // 根据标签页选择不同的端点
    if (selectedTab.value === 'favorites') {
      endpoint = API_ENDPOINTS.MARKET_TOKENS_FAVORITES
    } else if (selectedTab.value === 'hot') {
      endpoint = API_ENDPOINTS.MARKET_TOKENS_HOT
    }

    // 使用25条每页（加载更多模式）或用户设置的pageSize
    let currentPageSize = useLoadMoreMode.value ? 25 : pageSize.value

    const params = new URLSearchParams({
      page: currentPage.value,
      page_size: currentPageSize,
    })

    // 添加搜索和筛选参数
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }

    if (selectedExchange.value) {
      params.append('exchange', selectedExchange.value)
    }

    if (selectedCategory.value && selectedCategory.value !== 'more') {
      params.append('category', selectedCategory.value)
    }

    // 根据 tab 添加市场类型筛选
    if (selectedTab.value === 'derivatives') {
      params.append('is_futures_available', 'true')
    } else if (selectedTab.value === 'spot') {
      params.append('is_spot_available', 'true')
    }

    // 注意：市场情绪筛选在前端进行（通过 paginatedTokens 计算属性）

    // 添加市值范围筛选
    if (filterMarketCapMin.value) {
      params.append('market_cap_min', filterMarketCapMin.value)
    }
    if (filterMarketCapMax.value) {
      params.append('market_cap_max', filterMarketCapMax.value)
    }

    // 添加价格变化范围筛选
    if (filterPriceChangeMin.value) {
      params.append('price_change_min', filterPriceChangeMin.value)
    }
    if (filterPriceChangeMax.value) {
      params.append('price_change_max', filterPriceChangeMax.value)
    }

    // 添加成交量范围筛选
    if (filterVolumeMin.value) {
      params.append('volume_min', filterVolumeMin.value)
    }
    if (filterVolumeMax.value) {
      params.append('volume_max', filterVolumeMax.value)
    }

    // 添加排序参数
    if (sortField.value) {
      const orderingField = sortDirection.value === 'desc' ? `-${sortField.value}` : sortField.value
      params.append('ordering', orderingField)
    }

    // 使用GET请求
    const url = endpoint.includes('?') ? `${endpoint}&${params.toString()}` : `${endpoint}?${params.toString()}`
    const response = await apiRequest(url)

    // 处理不同的响应格式
    let newTokens = []
    let total = 0

    if (response.status === 'success') {
      // 个性化推荐接口格式（带 explanation）
      if (response.recommendations) {
        newTokens = response.recommendations.map(item => {
          // 将推荐分数合并到token对象中
          return {
            ...item.token,
            recommendation_score: item.explanation?.recommendation_score,
            recommendation_reasons: item.explanation?.reasons
          }
        })
        total = response.count || newTokens.length
        // 保存用户画像信息
        if (response.user_profile) {
          userProfile.value = response.user_profile
        }
      } else {
        // 其他新接口格式
        newTokens = response.data || response.recommended_tokens || []
        total = response.count || newTokens.length
      }
    } else if (Array.isArray(response)) {
      newTokens = response
      total = response.length
    } else if (response.results) {
      newTokens = response.results
      total = response.count
    }

    // 对于"加载更多"模式
    if (useLoadMoreMode.value) {
      if (append) {
        // 追加数据
        tokens.value = [...tokens.value, ...newTokens]
      } else {
        // 重新加载
        tokens.value = newTokens
      }

      // 检查是否还有更多数据
      // 热门和Top100限制为100条
      const maxItems = 100
      hasMore.value = tokens.value.length < Math.min(total, maxItems) && newTokens.length > 0
      totalTokens.value = Math.min(total, maxItems)
    } else {
      // 传统分页模式
      tokens.value = newTokens
      totalTokens.value = total
    }

    // 手动触发 WebSocket 连接更新（延迟执行，等待 DOM 更新）
    setTimeout(() => {
      initWebSocketConnections()
    }, 100)

  } catch (err) {
    console.error('加载代币列表失败:', err)
    error.value = '加载数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 切换 Tab（持久化到 localStorage 和 URL）
const switchTab = (tabValue) => {
  selectedTab.value = tabValue

  // 清空用户画像信息（切换 tab 时）
  if (tabValue !== 'recommended') {
    userProfile.value = null
  }

  // 根据不同的 Tab 设置默认排序
  if (tabValue === 'top100') {
    // Top100 默认按市值排名升序（市值从大到小）
    sortField.value = 'market_cap_rank'
    sortDirection.value = 'asc'
  } else if (tabValue === 'hot') {
    // 热门 默认按热度降序（热度从高到低）
    sortField.value = 'hot_score'
    sortDirection.value = 'desc'
  } else if (tabValue === 'recommended') {
    // 推荐 默认按市值排名升序
    sortField.value = 'market_cap_rank'
    sortDirection.value = 'asc'
  } else if (tabValue === 'derivatives' || tabValue === 'spot' || tabValue === 'favorites') {
    // 衍生品/现货/收藏 默认按市值排名升序
    sortField.value = 'market_cap_rank'
    sortDirection.value = 'asc'
  }

  // 保存到 localStorage
  localStorage.setItem('market_selected_tab', tabValue)

  // 更新 URL 参数（不刷新页面）
  const url = new URL(window.location.href)
  url.searchParams.set('tab', tabValue)
  window.history.pushState({}, '', url)
}

// 加载更多（无刷新追加数据）
const loadMore = async () => {
  if (!hasMore.value || loading.value) return

  // 增加页码
  currentPage.value++

  // 追加数据，不清空现有列表
  await loadTokensList(true)  // append = true
}

// 监听筛选条件变化
watch([searchQuery, selectedTab, selectedExchange, selectedCategory], () => {
  currentPage.value = 1
  loadTokensList(false)  // 重新加载，不追加
})

// 监听tab变化，重新加载分类列表
watch(selectedTab, () => {
  loadCategoryFilters()
})

// 对于非"加载更多"模式，监听页码变化
watch(currentPage, async (_newPage, oldPage) => {
  if (!useLoadMoreMode.value && oldPage !== undefined) {
    // 加载新数据
    await loadTokensList(false)

    // 滚动到表格顶部（平滑滚动）
    const tableElement = document.querySelector('.bg-white.rounded-xl.shadow-sm')
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})

// 获取市值偏好标签
const getMarketCapLabel = (preference) => {
  const labels = {
    'large': '大盘',
    'medium': '中盘',
    'small': '小盘',
    'mixed': '混合'
  }
  return labels[preference] || preference
}

// 获取投资期限标签
const getInvestmentHorizonLabel = (horizon) => {
  const labels = {
    'short': '短期',
    'medium': '中期',
    'long': '长期'
  }
  return labels[horizon] || horizon
}

// 跳转到风险评估页面
const goToRiskAssessment = () => {
  window.location.href = '/risk-assessment'
}

// WebSocket 消息处理
const handleWebSocketMessage = (symbol) => (data) => {
  // 处理市场更新消息（包含价格、涨跌幅、成交量等）
  if (data.type === 'market_update') {
    const marketData = data.data
    realtimePrices.value.set(symbol, marketData.price)

    // 更新 tokens 数组中的数据
    const token = tokens.value.find(t => t.symbol === symbol)
    if (token) {
      // 更新价格
      token.current_price = marketData.price

      // 更新 24h 涨跌幅
      if (marketData.change_24h !== undefined) {
        token.price_change_percentage_24h = marketData.change_24h
        // 更新格式化的涨跌幅显示
        const change = parseFloat(marketData.change_24h)
        token.price_change_24h_formatted = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
      }

      // 注意：不更新 24h 成交量
      // WebSocket 推送的是单个交易所的成交额，而 API 返回的是所有交易所的总成交额
      // 如果用单个交易所的数据覆盖总成交额会导致数据不准确
      // 总成交额应由后端定期任务汇总计算

      // 更新 24h 最高价
      if (marketData.high_24h !== undefined) {
        token.high_24h = marketData.high_24h
      }

      // 更新 24h 最低价
      if (marketData.low_24h !== undefined) {
        token.low_24h = marketData.low_24h
      }

      // 重新计算市值（市值 = 价格 × 流通量）
      if (token.circulating_supply && marketData.price) {
        token.market_cap = marketData.price * token.circulating_supply
        // 更新格式化的市值显示
        token.market_cap_formatted = formatNumber(token.market_cap)
      }
    }
  }
  // 兼容旧的 price_update 消息类型
  else if (data.type === 'price_update') {
    const priceData = data.data
    realtimePrices.value.set(symbol, priceData.price)

    const token = tokens.value.find(t => t.symbol === symbol)
    if (token) {
      token.current_price = priceData.price

      // 重新计算市值
      if (token.circulating_supply && priceData.price) {
        token.market_cap = priceData.price * token.circulating_supply
        token.market_cap_formatted = formatNumber(token.market_cap)
      }
    }
  }
}

// 初始化 WebSocket 连接（连接所有可见代币）
const initWebSocketConnections = () => {
  // 获取所有当前显示的代币（包括"加载更多"后的代币）
  const visibleTokens = paginatedTokens.value

  console.log(`\n📊 [加载] 当前显示 ${visibleTokens.length} 个代币:`)
  visibleTokens.forEach((t, i) => {
    console.log(`  ${i+1}. ${t.symbol} - ${t.name}`)
  })

  // 打印 wsManager 的全局连接数（调试用）
  console.log(`\n🌐 [全局] wsManager 总连接数: ${wsManager.connections.size}`)
  console.log(`🌐 [全局] wsManager 连接列表: ${Array.from(wsManager.connections.keys()).join(', ')}`)

  // 找出需要新建连接的代币
  const tokensToConnect = visibleTokens.filter(token => !wsConnections.has(token.symbol))

  console.log(`\n🔌 [订阅] 需要新建连接: ${tokensToConnect.length} 个`)
  if (tokensToConnect.length > 0) {
    tokensToConnect.forEach((t, i) => {
      console.log(`  ${i+1}. ${t.symbol}`)
    })
  }

  // 找出需要断开连接的代币（不在可见列表中）
  const visibleSymbols = new Set(visibleTokens.map(t => t.symbol))
  const tokensToDisconnect = Array.from(wsConnections.keys()).filter(symbol => !visibleSymbols.has(symbol))

  // 断开不需要的连接
  if (tokensToDisconnect.length > 0) {
    console.log(`\n🔌 [断开] 需要断开连接: ${tokensToDisconnect.length} 个`)
    tokensToDisconnect.forEach((symbol, i) => {
      console.log(`  ${i+1}. ${symbol}`)
      const callback = wsConnections.get(symbol)
      wsManager.disconnect(symbol, callback)
      wsConnections.delete(symbol)
    })
  }

  // 建立新连接
  tokensToConnect.forEach(token => {
    const callback = handleWebSocketMessage(token.symbol)
    wsConnections.set(token.symbol, callback)
    wsManager.connect(token.symbol, callback)
  })

  if (tokensToConnect.length > 0 || tokensToDisconnect.length > 0) {
    console.log(`\n🔌 WebSocket 更新: +${tokensToConnect.length} -${tokensToDisconnect.length}, 总计 ${wsConnections.size} 个连接`)
  }

  // 打印订阅状态对比
  console.log(`\n📡 [订阅状态] 已订阅的代币 (${wsConnections.size} 个):`)
  const subscribedSymbols = Array.from(wsConnections.keys())
  subscribedSymbols.forEach((symbol, i) => {
    console.log(`  ${i+1}. ${symbol}`)
  })

  // 找出未订阅的代币
  const notSubscribed = visibleTokens.filter(token => !wsConnections.has(token.symbol))
  if (notSubscribed.length > 0) {
    console.warn(`\n⚠️  [未订阅] ${notSubscribed.length} 个代币未订阅:`)
    notSubscribed.forEach((t, i) => {
      console.warn(`  ${i+1}. ${t.symbol} - ${t.name}`)
    })
  } else {
    console.log(`\n✅ 所有可见代币都已订阅`)
  }

  // 再次打印 wsManager 的全局连接数（调试用）
  console.log(`\n🌐 [全局] wsManager 总连接数（更新后）: ${wsManager.connections.size}`)
  console.log('\n' + '='.repeat(60) + '\n')
}

// 断开所有 WebSocket 连接
const disconnectAllWebSockets = () => {
  wsConnections.forEach((callback, symbol) => {
    wsManager.disconnect(symbol, callback)
  })
  wsConnections.clear()
  console.log('🔌 已断开所有 WebSocket 连接')
}

// 组件挂载时加载数据
onMounted(() => {
  loadMarketStats()
  loadTokensList()
  loadCategoryFilters()
  loadExchangeFilters()
})

// 组件卸载时断开所有 WebSocket
onUnmounted(() => {
  disconnectAllWebSockets()
})
</script>

<style scoped>
/* 自定义样式 */
</style>

