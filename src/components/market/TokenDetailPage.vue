<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div class="animate-pulse space-y-4">
        <div class="h-24 bg-white/60 rounded-2xl"></div>
        <div class="grid grid-cols-5 gap-4">
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
        </div>
        <div class="h-[500px] bg-white/60 rounded-2xl"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-red-900 mb-2">加载失败</h3>
        <p class="text-red-700 mb-6">{{ error }}</p>
        <button @click="loadData" class="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
          重新加载
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="tokenData" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">

      <!-- ===== 主体内容：图表 + 侧边栏 ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- 左侧：数据卡片 + K线图表 + 市场数据表格 + 技术指标 (8/12) -->
        <div class="lg:col-span-8 space-y-4">

          <!-- ===== 市场类型 Tab (CoinGecko 风格) ===== -->
          <div class="border-b border-gray-200">
            <nav class="flex gap-1 -mb-px">
              <button
                v-for="tab in marketTabs"
                :key="tab.key"
                @click="handleTabClick(tab)"
                :disabled="!tab.available"
                :class="[
                  'py-2.5 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2',
                  activeMarketTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : tab.available
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      : 'border-transparent text-gray-300 cursor-not-allowed'
                ]"
              >
                <!-- Tab 图标 -->
                <svg v-if="tab.key === 'spot'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="tab.key === 'futures'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <svg v-else-if="tab.key === 'signal_bots'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                {{ tab.label }}
                <span v-if="tab.badge" class="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                  {{ tab.badge }}
                </span>
              </button>
            </nav>
          </div>

          <!-- 现货/合约 Tab 内容 -->
          <template v-if="activeMarketTab === 'spot' || activeMarketTab === 'futures'">
            <!-- 数据统计卡片 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <!-- 现货数据卡片 -->
              <template v-if="activeMarketTab === 'spot'">
                <StatCard label="24h 成交额" :value="formatLargeNumber(tokenData.token.total_volume)" prefix="$" icon="volume" />
                <StatCard label="24h 最高" :value="formatPrice(tokenData.token.high_24h)" prefix="$" icon="high" color="green" />
                <StatCard label="24h 最低" :value="formatPrice(tokenData.token.low_24h)" prefix="$" icon="low" color="red" />
                <StatCard label="市值" :value="formatLargeNumber(tokenData.token.market_cap)" prefix="$" icon="market" />
              </template>

              <!-- 合约数据卡片 -->
              <template v-else>
                <StatCard
                  label="资金费率"
                  :value="formatFundingRate(futuresData.avgFundingRate)"
                  suffix="%"
                  icon="funding"
                  :color="futuresData.avgFundingRate > 0 ? 'red' : futuresData.avgFundingRate < 0 ? 'green' : 'gray'"
                />
                <StatCard label="未平仓量" :value="formatLargeNumber(futuresData.totalOpenInterest)" prefix="$" icon="openInterest" />
                <StatCard
                  label="多空比"
                  :value="formatNumber(futuresData.avgLongShortRatio, 2)"
                  icon="ratio"
                  :color="futuresData.avgLongShortRatio > 1 ? 'green' : 'red'"
                />
                <StatCard label="24h 成交额" :value="formatLargeNumber(futuresData.totalVolume)" prefix="$" icon="volume" />
              </template>
            </div>

            <!-- K线图表 -->
            <TradingChart
              ref="tradingChartRef"
              :symbol="tokenData.token.symbol"
              :current-price="tokenData.token.current_price"
              :market-type="activeMarketTab"
              :technical-signals="tokenData.market_analysis?.technical_signals"
              :market-condition="tokenData.market_analysis?.condition_label"
              @price-update="handlePriceUpdate"
            />

            <!-- 资金流向面板 -->
            <FundFlowPanel
              :symbol="tokenData.token.symbol"
              :default-market-type="activeMarketTab === 'futures' ? 'futures' : 'spot'"
            />

            <!-- 市场数据表格（Coinglass 风格） -->
            <MarketDataTable
              :spot-exchanges="spotExchanges"
              :futures-exchanges="futuresExchanges"
              :token="tokenData.token"
              :default-tab="activeMarketTab"
            />

            <!-- 技术指标面板 -->
            <TechnicalAnalysisTabs
              :technical-indicator="tokenData.technical_indicator"
              :technical-signals="tokenData.market_analysis?.technical_signals"
              :exchanges="tokenData.exchanges"
              :token="tokenData.token"
            />
          </template>

          <!-- 信号机器人 Tab 内容 -->
          <template v-else-if="activeMarketTab === 'signal_bots'">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                {{ tokenData.token.symbol }} 信号机器人
                <span class="text-sm font-normal text-gray-500">（社区分享）</span>
              </h3>

              <!-- 加载状态 -->
              <div v-if="signalBotsLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="animate-pulse bg-gray-100 rounded-xl p-4 h-48"></div>
              </div>

              <!-- 机器人列表 - 一行2个 -->
              <div v-else-if="signalBotsList.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="bot in signalBotsList"
                  :key="bot.id"
                  class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <!-- 头部：用户信息 + 状态 -->
                  <div class="p-4 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                      <!-- 用户头像 -->
                      <div class="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex-shrink-0">
                        <img v-if="bot.user?.avatar" :src="bot.user.avatar" :alt="bot.user.username" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-white font-bold">
                          {{ (bot.user?.username || 'A').charAt(0).toUpperCase() }}
                        </div>
                      </div>
                      <!-- 用户名 + 机器人名 -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-semibold text-blue-600 text-sm">{{ bot.user?.username || '匿名' }}</span>
                          <span :class="[
                            'px-1.5 py-0.5 text-xs font-medium rounded',
                            bot.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          ]">{{ bot.is_active ? '运行中' : '已停止' }}</span>
                        </div>
                        <h4 class="text-gray-900 text-sm font-medium truncate" :title="bot.name">{{ bot.name }}</h4>
                      </div>
                    </div>
                    <!-- 简介 -->
                    <p v-if="bot.description" class="mt-2 text-xs text-gray-500 line-clamp-2">{{ bot.description }}</p>
                  </div>

                  <!-- 中间：关键参数 -->
                  <div class="p-4 space-y-3">
                    <!-- 信号类型 + 周期 -->
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg">
                        {{ getSignalTypeLabel(bot.signal_type) }}
                      </span>
                      <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
                        {{ bot.timeframe || '1h' }}
                      </span>
                      <span v-if="bot.latest_signal_direction" :class="[
                        'px-2 py-1 text-xs font-medium rounded-lg',
                        bot.latest_signal_direction === 'buy' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      ]">
                        {{ bot.latest_signal_direction === 'buy' ? '📈 做多' : '📉 做空' }}
                      </span>
                    </div>

                    <!-- 统计数据 -->
                    <div class="grid grid-cols-3 gap-2 text-center">
                      <div class="bg-gray-50 rounded-lg py-2">
                        <p class="text-lg font-bold text-gray-900">{{ bot.total_signals || 0 }}</p>
                        <p class="text-xs text-gray-500">信号数</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg py-2">
                        <p class="text-lg font-bold text-gray-900">{{ bot.copy_count || 0 }}</p>
                        <p class="text-xs text-gray-500">跟单数</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg py-2">
                        <p class="text-lg font-bold" :class="(bot.win_rate || 0) >= 50 ? 'text-green-600' : 'text-gray-900'">{{ bot.win_rate || 0 }}%</p>
                        <p class="text-xs text-gray-500">胜率</p>
                      </div>
                    </div>
                  </div>

                  <!-- 底部：操作按钮 -->
                  <div class="px-4 pb-4">
                    <button
                      @click.stop="copyBot(bot)"
                      class="w-full py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      跟单
                    </button>
                  </div>
                </div>
              </div>

              <!-- 无数据 -->
              <div v-else class="text-center py-12 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <p class="mb-2">暂无 {{ tokenData.token.symbol }} 相关的公开信号机器人</p>
                <p class="text-sm">分享您的信号机器人，让更多人受益</p>
              </div>
            </div>
          </template>

        </div>

        <!-- 右侧：数据面板 (4/12) -->
        <div class="lg:col-span-4 space-y-4">
          <!-- 代币价格卡片 (CoinMarketCap 风格) -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <!-- 面包屑导航 -->
            <nav class="flex items-center gap-1.5 text-xs mb-3">
              <router-link to="/market" class="text-gray-400 hover:text-blue-600 transition-colors">
                市场
              </router-link>
              <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-gray-600">{{ tokenData.token?.symbol }}</span>
            </nav>

            <!-- 代币基本信息 + 收藏按钮 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                  <img v-if="tokenData.token.logo" :src="tokenData.token.logo" :alt="tokenData.token.name" class="w-8 h-8 object-contain" />
                  <span v-else class="text-lg font-bold text-gray-400">{{ tokenData.token.symbol?.charAt(0) }}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-900">{{ tokenData.token.name }}</span>
                    <span class="text-gray-500 text-sm">{{ tokenData.token.symbol }} Price</span>
                    <span v-if="tokenData.token.market_cap_rank" class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                      #{{ tokenData.token.market_cap_rank }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- 收藏按钮 -->
              <button
                @click="toggleWatchlist"
                :disabled="isFavoriteProcessing"
                :class="tokenData.is_in_watchlist ? 'text-yellow-500 bg-yellow-50 border-yellow-200' : 'text-gray-400 bg-gray-50 border-gray-200'"
                class="w-9 h-9 flex items-center justify-center border rounded-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                <svg v-if="isFavoriteProcessing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else class="w-4 h-4" :fill="tokenData.is_in_watchlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </button>
            </div>

            <!-- 价格和涨跌幅 -->
            <div class="mb-4">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-bold text-gray-900">${{ formatPrice(displayPrice) }}</span>
                <span
                  :class="displayChange24h >= 0 ? 'text-emerald-600' : 'text-red-600'"
                  class="flex items-center gap-1 text-base font-semibold"
                >
                  <svg v-if="displayChange24h >= 0" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ formatPercent(displayChange24h) }}% (24h)
                </span>
              </div>
            </div>

            <!-- 看多看空投票 -->
            <div class="mb-4 pb-4 border-b border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">市场情绪</span>
                <span class="text-xs text-gray-400">{{ sentimentVotes.total }} 票</span>
              </div>
              <div class="flex gap-2 mb-2">
                <button
                  @click="voteSentiment('bullish')"
                  :disabled="userSentimentVote !== null"
                  :class="userSentimentVote === 'bullish' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-lg text-sm font-medium transition-all disabled:cursor-default"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                  看多
                </button>
                <button
                  @click="voteSentiment('bearish')"
                  :disabled="userSentimentVote !== null"
                  :class="userSentimentVote === 'bearish' ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-lg text-sm font-medium transition-all disabled:cursor-default"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  看空
                </button>
              </div>
              <!-- 情绪比例条 -->
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  class="h-full bg-emerald-500 transition-all duration-300"
                  :style="{ width: sentimentVotes.bullishPercent + '%' }"
                ></div>
                <div
                  class="h-full bg-red-500 transition-all duration-300"
                  :style="{ width: sentimentVotes.bearishPercent + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-xs mt-1.5">
                <span class="text-emerald-600 font-medium">{{ sentimentVotes.bullishPercent }}% 看多</span>
                <span class="text-red-600 font-medium">{{ sentimentVotes.bearishPercent }}% 看空</span>
              </div>
            </div>

            <!-- 关键数据列表 -->
            <div class="space-y-2.5 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">市值</span>
                <span class="font-semibold text-gray-900">${{ formatLargeNumber(tokenData.token.market_cap) }}</span>
              </div>
              <div v-if="fullyDilutedMarketCap" class="flex justify-between items-center">
                <span class="text-gray-500">完全稀释市值</span>
                <span class="font-semibold text-gray-900">${{ formatLargeNumber(fullyDilutedMarketCap) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">24h 成交额</span>
                <span class="font-semibold text-gray-900">${{ formatLargeNumber(tokenData.token.total_volume) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">流通量</span>
                <span class="font-semibold text-gray-900">{{ formatLargeNumber(tokenData.token.circulating_supply) }} {{ tokenData.token.symbol }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">总供应量</span>
                <span class="font-semibold text-gray-900">{{ formatLargeNumber(tokenData.token.total_supply) }} {{ tokenData.token.symbol }}</span>
              </div>
              <div v-if="tokenData.token.max_supply" class="flex justify-between items-center">
                <span class="text-gray-500">最大供应量</span>
                <span class="font-semibold text-gray-900">{{ formatLargeNumber(tokenData.token.max_supply) }}</span>
              </div>
            </div>

            <!-- 标签和链接 -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <!-- 标签 -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span v-if="tokenData.token.category" class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">
                  {{ getCategoryLabel(tokenData.token.category) }}
                </span>
                <span v-if="tokenData.token.is_spot_available" class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg">
                  现货
                </span>
                <span v-if="tokenData.token.is_futures_available" class="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg">
                  合约
                </span>
              </div>
              <!-- 链接 -->
              <div v-if="hasTokenLinks" class="flex flex-wrap gap-2">
                <a v-if="tokenData.token.website" :href="tokenData.token.website" target="_blank"
                   class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  官网
                </a>
                <a v-if="tokenData.token.twitter" :href="tokenData.token.twitter" target="_blank"
                   class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </a>
                <a v-if="tokenData.token.telegram" :href="tokenData.token.telegram" target="_blank"
                   class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  TG
                </a>
                <a v-if="tokenData.token.github" :href="tokenData.token.github" target="_blank"
                   class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <!-- 爆仓数据模块（仅合约可用时显示） -->
          <LiquidationCard
            v-if="tokenData.token.is_futures_available"
            :symbol="tokenData.token.symbol"
          />

          <!-- 机器人面板 -->
          <BotTradingPanel
            :token="tokenData.token"
            :exchanges="tokenData.exchanges"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import { showFavoriteSuccess, showUnfavoriteSuccess, showError, showSuccess, showInfo } from '../../utils/notification.js'
import { useWebSocket } from '../../utils/websocket.js'

// Import common components
import Header from '../common/Header.vue'

// Import child components
import TradingChart from './detail/TradingChart.vue'
import TechnicalAnalysisTabs from './detail/TechnicalAnalysisTabs.vue'
import BotTradingPanel from './detail/BotTradingPanel.vue'
import StatCard from './detail/StatCard.vue'
import MarketDataTable from './detail/MarketDataTable.vue'
import LiquidationCard from './detail/LiquidationCard.vue'
import FundFlowPanel from './detail/FundFlowPanel.vue'

const route = useRoute()

// State
const loading = ref(true)
const error = ref(null)
const tokenData = ref(null)

// 市场类型 Tab（从 localStorage 读取持久化的值）
const getInitialTab = () => {
  const saved = localStorage.getItem('tokenDetailActiveTab')
  return saved || 'spot'
}
const activeMarketTab = ref(getInitialTab())

// 校验并修正当前 Tab（在数据加载后调用）
const validateActiveTab = () => {
  const currentTab = activeMarketTab.value
  const token = tokenData.value?.token

  if (!token) return

  // 检查当前 Tab 是否可用
  let isCurrentTabAvailable = true
  if (currentTab === 'spot' && !token.is_spot_available) {
    isCurrentTabAvailable = false
  } else if (currentTab === 'futures' && !token.is_futures_available) {
    isCurrentTabAvailable = false
  }

  // 如果当前 Tab 不可用，切换到第一个可用的 Tab
  if (!isCurrentTabAvailable) {
    if (token.is_spot_available) {
      activeMarketTab.value = 'spot'
    } else if (token.is_futures_available) {
      activeMarketTab.value = 'futures'
    } else {
      // 如果现货和合约都不可用，默认显示信号机器人
      activeMarketTab.value = 'signal_bots'
    }
    // 更新持久化
    localStorage.setItem('tokenDetailActiveTab', activeMarketTab.value)
  }
}

// 信号机器人数据
const signalBotsList = ref([])
const signalBotsLoading = ref(false)

// 市场 Tab 配置
const marketTabs = computed(() => [
  {
    key: 'spot',
    label: '现货',
    available: tokenData.value?.token?.is_spot_available ?? false,
  },
  {
    key: 'futures',
    label: '合约',
    available: tokenData.value?.token?.is_futures_available ?? false,
  },
  {
    key: 'signal_bots',
    label: '信号机器人',
    available: true,
    badge: signalBotsList.value.length || null,
  }
])

// 现货交易所数据
const spotExchanges = computed(() => {
  if (!tokenData.value?.exchanges) return []
  return tokenData.value.exchanges.filter(e => !e.is_futures)
})

// 合约交易所数据
const futuresExchanges = computed(() => {
  if (!tokenData.value?.exchanges) return []
  return tokenData.value.exchanges.filter(e => e.is_futures)
})

// 是否有代币链接
const hasTokenLinks = computed(() => {
  const token = tokenData.value?.token
  return token?.website || token?.twitter || token?.telegram || token?.github
})

// 合约汇总数据
const futuresData = computed(() => {
  const exchanges = futuresExchanges.value
  if (!exchanges.length) {
    return {
      avgFundingRate: 0,
      totalOpenInterest: 0,
      avgLongShortRatio: 1,
      totalVolume: 0
    }
  }

  const fundingRates = exchanges.filter(e => e.funding_rate).map(e => parseFloat(e.funding_rate))
  const openInterests = exchanges.filter(e => e.open_interest).map(e => parseFloat(e.open_interest))
  const longShortRatios = exchanges.filter(e => e.long_short_ratio).map(e => parseFloat(e.long_short_ratio))
  const volumes = exchanges.filter(e => e.volume_24h).map(e => parseFloat(e.volume_24h))

  return {
    avgFundingRate: fundingRates.length ? fundingRates.reduce((a, b) => a + b, 0) / fundingRates.length : 0,
    totalOpenInterest: openInterests.reduce((a, b) => a + b, 0),
    avgLongShortRatio: longShortRatios.length ? longShortRatios.reduce((a, b) => a + b, 0) / longShortRatios.length : 1,
    totalVolume: volumes.reduce((a, b) => a + b, 0)
  }
})

// 防止重复点击收藏
const isFavoriteProcessing = ref(false)
const lastFavoriteTime = ref(0)

// 看多看空投票
const userSentimentVote = ref(null) // 'bullish' | 'bearish' | null
const sentimentData = ref({
  bullish_count: 0,
  bearish_count: 0,
  total: 0,
  bullish_percent: 50,
  bearish_percent: 50
})

const sentimentVotes = computed(() => ({
  bullish: sentimentData.value.bullish_count,
  bearish: sentimentData.value.bearish_count,
  total: sentimentData.value.total,
  bullishPercent: sentimentData.value.bullish_percent,
  bearishPercent: sentimentData.value.bearish_percent
}))

// 加载情绪数据
const loadSentimentData = async () => {
  if (!tokenData.value) return
  try {
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKEN_SENTIMENT(tokenData.value.token.symbol))
    if (response.status === 'success' && response.data) {
      sentimentData.value = response.data
      userSentimentVote.value = response.data.user_vote
    }
  } catch (err) {
    console.error('加载情绪数据失败:', err)
  }
}

const voteSentiment = async (vote) => {
  if (userSentimentVote.value || !tokenData.value) return
  try {
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKEN_SENTIMENT(tokenData.value.token.symbol), {
      method: 'POST',
      body: JSON.stringify({ sentiment: vote })
    })
    if (response.status === 'success') {
      userSentimentVote.value = vote
      // 重新加载情绪数据
      await loadSentimentData()
      showSuccess('投票成功')
    } else {
      showError(response.message || '投票失败')
    }
  } catch (err) {
    console.error('投票失败:', err)
    showError(err.message || '投票失败，请稍后重试')
  }
}

// K线实时价格
const realtimePrice = ref({
  price: null,
  change_24h: null,
  volume_24h: null,
  high_24h: null,
  low_24h: null
})

// 计算显示价格
const displayPrice = computed(() => {
  return realtimePrice.value.price ?? tokenData.value?.token?.current_price ?? 0
})

const displayChange24h = computed(() => {
  return realtimePrice.value.change_24h ?? tokenData.value?.token?.price_change_percentage_24h ?? 0
})

// 计算完全稀释市值 = max_supply * current_price
const fullyDilutedMarketCap = computed(() => {
  const token = tokenData.value?.token
  if (!token) return null
  // 优先使用后端返回的值
  if (token.fully_diluted_valuation) return token.fully_diluted_valuation
  // 否则计算: max_supply * current_price
  if (token.max_supply && displayPrice.value) {
    return token.max_supply * parseFloat(displayPrice.value)
  }
  return null
})

// WebSocket 实时数据
const wsConnected = ref(false)
const lastUpdateTime = ref(null)

// TradingChart 组件引用
const tradingChartRef = ref(null)

// WebSocket 实例
let ws = null

// ===== 辅助函数 =====
const formatPrice = (price) => {
  if (!price && price !== 0) return '-'
  const num = parseFloat(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toFixed(2)
  if (num >= 0.01) return num.toFixed(4)
  return num.toFixed(6)
}

const formatPercent = (value) => {
  if (!value && value !== 0) return '-'
  return Math.abs(parseFloat(value)).toFixed(2)
}

const formatLargeNumber = (num) => {
  if (!num && num !== 0) return '-'
  const n = parseFloat(num)
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}

const formatNumber = (num, decimals = 2) => {
  if (!num && num !== 0) return '-'
  return parseFloat(num).toFixed(decimals)
}

const formatFundingRate = (rate) => {
  if (!rate && rate !== 0) return '-'
  return (parseFloat(rate) * 100).toFixed(4)
}

const getCategoryLabel = (category) => {
  const labels = {
    'layer1': 'Layer 1',
    'layer2': 'Layer 2',
    'defi': 'DeFi',
    'meme': 'Meme',
    'ai': 'AI',
    'gaming': 'Gaming',
    'nft': 'NFT',
    'infrastructure': '基础设施',
    'exchange': '交易所',
    'stablecoin': '稳定币'
  }
  return labels[category] || category
}

// 处理价格更新
const handlePriceUpdate = (priceData) => {
  if (priceData.price) realtimePrice.value.price = priceData.price
  if (priceData.change_24h !== undefined) realtimePrice.value.change_24h = priceData.change_24h
  if (priceData.volume_24h !== undefined) realtimePrice.value.volume_24h = priceData.volume_24h
  if (priceData.high_24h !== undefined) realtimePrice.value.high_24h = priceData.high_24h
  if (priceData.low_24h !== undefined) realtimePrice.value.low_24h = priceData.low_24h
}

// Load data
const loadData = async () => {
  loading.value = true
  error.value = null
  // 重置实时价格
  realtimePrice.value = {
    price: null,
    change_24h: null,
    volume_24h: null,
    high_24h: null,
    low_24h: null
  }

  try {
    const symbol = route.params.symbol
    console.log('🔍 加载代币详情:', symbol)
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKEN_DETAIL(symbol))

    if (response.status === 'success') {
      tokenData.value = response.data
      console.log('✅ 代币详情加载成功:', tokenData.value.token.symbol)

      // 校验当前 Tab 是否可用，如果不可用则切换到第一个可用的 Tab
      validateActiveTab()

      // 加载情绪数据
      loadSentimentData()
    } else {
      throw new Error(response.message || '加载失败')
    }
  } catch (err) {
    console.error('❌ Error loading token detail:', err)
    error.value = err.message || '加载代币详情失败'
  } finally {
    loading.value = false
  }
}

// WebSocket 消息处理
const handleWebSocketMessage = (data) => {
  console.log('📡 收到 WebSocket 数据:', data)

  if (data.type === 'token_info') {
    // 初始代币信息
    console.log('📊 代币信息:', data.data)
  } else if (data.type === 'market_update') {
    // 市场数据更新（包含价格、涨跌幅、成交量等）
    const marketData = data.data

    // 更新实时价格对象
    realtimePrice.value.price = marketData.price
    realtimePrice.value.change_24h = marketData.change_24h
    realtimePrice.value.volume_24h = marketData.volume_24h
    realtimePrice.value.high_24h = marketData.high_24h
    realtimePrice.value.low_24h = marketData.low_24h

    lastUpdateTime.value = new Date()

    // 更新代币数据（注意：要更新 tokenData.value.token，而不是 tokenData.value）
    if (tokenData.value && tokenData.value.token) {
      tokenData.value.token.current_price = marketData.price

      // 更新 24h 涨跌幅
      if (marketData.change_24h !== undefined) {
        tokenData.value.token.price_change_percentage_24h = marketData.change_24h
      }

      // 更新 24h 成交量
      if (marketData.volume_24h !== undefined) {
        tokenData.value.token.total_volume = marketData.volume_24h
      }

      // 更新 24h 最高价
      if (marketData.high_24h !== undefined) {
        tokenData.value.token.high_24h = marketData.high_24h
      }

      // 更新 24h 最低价
      if (marketData.low_24h !== undefined) {
        tokenData.value.token.low_24h = marketData.low_24h
      }
    }

    console.log(`💰 市场更新: ${marketData.symbol} = $${marketData.price} (${marketData.change_24h >= 0 ? '+' : ''}${marketData.change_24h}%)`)
  } else if (data.type === 'price_update') {
    // 兼容旧的价格更新消息
    const priceData = data.data
    realtimePrice.value.price = priceData.price
    lastUpdateTime.value = new Date()

    if (tokenData.value && tokenData.value.token) {
      tokenData.value.token.current_price = priceData.price
    }

    console.log(`💰 价格更新: ${priceData.symbol} = $${priceData.price}`)
  } else if (data.type === 'kline_update') {
    // K线数据更新（转发给 TradingChart 组件）
    console.log('📈 K线更新:', data.data)
    if (tradingChartRef.value && tradingChartRef.value.handleKlineUpdate) {
      tradingChartRef.value.handleKlineUpdate(data.data)
    }
  } else if (data.type === 'pong') {
    // 心跳响应
    wsConnected.value = true
  }
}

// 初始化 WebSocket
let wsDisconnect = null

const initWebSocket = () => {
  if (!tokenData.value) return

  const symbol = tokenData.value.token.symbol
  console.log(`🔌 初始化 WebSocket: ${symbol}`)

  const { connect, disconnect, getConnection } = useWebSocket(symbol, handleWebSocketMessage)
  connect()
  wsDisconnect = disconnect
  ws = getConnection(symbol)
  wsConnected.value = true
}

// 断开 WebSocket
const closeWebSocket = () => {
  if (wsDisconnect) {
    console.log('🔌 断开 WebSocket')
    wsDisconnect()
    wsDisconnect = null
    ws = null
    wsConnected.value = false
  }
}

// 监听路由参数变化，重新加载数据
watch(() => route.params.symbol, (newSymbol, oldSymbol) => {
  if (newSymbol && newSymbol !== oldSymbol) {
    console.log('🔄 路由参数变化，重新加载:', oldSymbol, '->', newSymbol)

    // 断开旧的 WebSocket
    closeWebSocket()

    // 加载新数据
    loadData()
  }
})

// Toggle watchlist
const toggleWatchlist = async () => {
  if (!tokenData.value) return

  // 防止重复点击
  if (isFavoriteProcessing.value) {
    return
  }

  // 检查冷却期（防止快速连续点击）
  const cooldownPeriod = 1000 // 1秒冷却期
  const now = Date.now()
  if (now - lastFavoriteTime.value < cooldownPeriod) {
    return
  }

  try {
    const token = tokenData.value.token

    // 标记为处理中
    isFavoriteProcessing.value = true

    // 使用后端的 toggle_favorite 接口
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKEN_TOGGLE_FAVORITE(token.symbol), {
      method: 'POST'
    })

    if (response.status === 'success') {
      tokenData.value.is_in_watchlist = response.is_favorited

      // 使用全局通知组件
      if (response.is_favorited) {
        showFavoriteSuccess(token.symbol)
      } else {
        showUnfavoriteSuccess(token.symbol)
      }
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (err) {
    console.error('Error toggling watchlist:', err)
    showError(err.message || '操作失败')
  } finally {
    // 移除处理中标记
    isFavoriteProcessing.value = false

    // 记录最后操作时间
    lastFavoriteTime.value = Date.now()
  }
}

// Handle trade
const handleTrade = (exchange = 'binance') => {
  if (!tokenData.value) return
  
  const symbol = tokenData.value.token.symbol
  
  // Generate trade link based on exchange
  let tradeUrl = ''
  
  switch (exchange.toLowerCase()) {
    case 'binance':
      tradeUrl = `https://www.binance.com/zh-CN/futures/${symbol}USDT`
      break
    case 'okx':
      tradeUrl = `https://www.okx.com/trade-swap/${symbol.toLowerCase()}-usdt-swap`
      break
    case 'bybit':
      tradeUrl = `https://www.bybit.com/trade/usdt/${symbol}USDT`
      break
    case 'gate':
      tradeUrl = `https://www.gate.io/futures_trade/USDT/${symbol}_USDT`
      break
    default:
      tradeUrl = `https://www.binance.com/zh-CN/futures/${symbol}USDT`
  }

  window.open(tradeUrl, '_blank')
}

// ===== 信号机器人加载 =====

// 加载信号机器人列表
const loadSignalBots = async () => {
  if (!tokenData.value?.token?.symbol) return

  try {
    signalBotsLoading.value = true
    const symbol = tokenData.value.token.symbol
    const response = await apiRequest(
      `${API_ENDPOINTS.MARKETPLACE_LIST}?bot_type=signal&token=${symbol}`
    )
    signalBotsList.value = response.results || response.data || []
  } catch (err) {
    console.error('加载信号机器人失败:', err)
    signalBotsList.value = []
  } finally {
    signalBotsLoading.value = false
  }
}

// Tab 切换处理
const handleTabClick = (tab) => {
  if (!tab.available) return

  activeMarketTab.value = tab.key

  // 持久化到 localStorage
  localStorage.setItem('tokenDetailActiveTab', tab.key)

  // 按需加载数据
  if (tab.key === 'signal_bots' && !signalBotsList.value.length && !signalBotsLoading.value) {
    loadSignalBots()
  }
  // 注意：现货/合约切换时 K 线会自动刷新，因为 TradingChart 监听 marketType 变化
}

// 信号类型标签
const getSignalTypeLabel = (type) => {
  const labels = {
    'price_alert': '价格提醒',
    'indicator_alert': '指标信号',
    'volatility': '波动性提醒',
    'volume': '成交量提醒'
  }
  return labels[type] || type || '指标信号'
}

// 复制机器人（跟单）
const copyBot = async (bot) => {
  if (!bot.share_code) {
    showError('该机器人暂不支持复制')
    return
  }

  try {
    const response = await apiRequest(API_ENDPOINTS.MARKETPLACE_COPY(bot.share_code), {
      method: 'POST'
    })

    if (response.success || response.bot_id) {
      showSuccess('复制成功！机器人已添加到您的列表')
    } else {
      showError(response.message || '复制失败')
    }
  } catch (err) {
    console.error('复制机器人失败:', err)
    showError(err.message || '复制失败，请稍后重试')
  }
}

// Lifecycle
onMounted(async () => {
  await loadData()

  // 数据加载完成后，初始化 WebSocket
  if (tokenData.value) {
    initWebSocket()

    // 根据当前 tab 加载对应数据
    if (activeMarketTab.value === 'signal_bots') {
      loadSignalBots()
    }
  }
})

onUnmounted(() => {
  // 组件卸载时断开 WebSocket
  closeWebSocket()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>

