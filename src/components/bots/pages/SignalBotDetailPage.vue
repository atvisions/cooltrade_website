<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="signal-bots" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 返回按钮 -->
          <button
            @click="handleBack"
            class="mb-8 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回列表
          </button>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-slate-500">加载中...</p>
          </div>

          <!-- 机器人详情 -->
          <div v-else-if="bot" class="space-y-6">
            <!-- 顶部标题栏 - 优化设计 -->
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <!-- 左侧：代币 Logo + 标题 -->
                  <div class="flex items-start gap-4 flex-1">
                    <!-- 代币 Logo -->
                    <div class="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-slate-100">
                      <img
                        v-if="bot.token_logo"
                        :src="bot.token_logo"
                        :alt="bot.token_symbol"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <div v-else class="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span class="text-white text-xl font-bold">{{ bot.token_symbol?.charAt(0) || '?' }}</span>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h1 class="text-2xl font-bold text-slate-900">{{ bot.token_symbol }}/{{ bot.trading_pair }}</h1>
                        <span :class="[
                          'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                          bot.status === 'running'
                            ? 'bg-green-100 text-green-700'
                            : bot.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-700'
                        ]">
                          {{ getStatusLabel(bot.status) }}
                        </span>
                      </div>
                      <h2 class="text-base font-medium text-slate-700 mb-1">{{ bot.name }}</h2>
                      <p class="text-sm text-slate-500">{{ bot.description }}</p>
                    </div>
                  </div>

                  <!-- 右侧：操作按钮 -->
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      v-if="bot.status === 'running'"
                      @click="handleStopBot"
                      :disabled="actionLoading"
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ actionLoading ? '停止中...' : '停止' }}
                    </button>
                    <button
                      v-else
                      @click="handleStartBot"
                      :disabled="actionLoading"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ actionLoading ? '启动中...' : '启动' }}
                    </button>
                    <button
                      @click="handleEditBot"
                      class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      编辑
                    </button>
                  </div>
                </div>
              </div>

              <!-- 核心配置信息 - 重新设计 -->
              <div class="border-t border-slate-200 bg-slate-50">
                <div class="grid grid-cols-6 divide-x divide-slate-200">
                  <!-- 交易所 -->
                  <div class="px-4 py-3">
                    <p class="text-xs text-slate-500 mb-1">交易所</p>
                    <p class="text-sm font-semibold text-slate-900">{{ bot.exchange_display || bot.exchange_name }}</p>
                  </div>

                  <!-- 信号类型 -->
                  <div class="px-4 py-3">
                    <p class="text-xs text-slate-500 mb-1">信号类型</p>
                    <p class="text-sm font-semibold text-slate-900">{{ getSignalTypeLabel(bot.signal_bot?.signal_type) }}</p>
                  </div>

                  <!-- 主时间周期 -->
                  <div class="px-4 py-3">
                    <p class="text-xs text-slate-500 mb-1">主时间周期</p>
                    <p class="text-sm font-semibold text-slate-900">{{ bot.signal_bot?.timeframes_config?.primary || bot.timeframe || '1h' }}</p>
                  </div>

                  <!-- 检查间隔 -->
                  <div class="px-4 py-3">
                    <p class="text-xs text-slate-500 mb-1">检查间隔</p>
                    <p class="text-sm font-semibold text-slate-900">{{ formatCheckInterval(bot.signal_bot?.check_interval) }}</p>
                  </div>

                  <!-- 信号过期 -->
                  <div class="px-4 py-3">
                    <p class="text-xs text-slate-500 mb-1">信号过期</p>
                    <p class="text-sm font-semibold text-slate-900">{{ bot.signal_bot?.signal_expiration_hours || 24 }}小时</p>
                  </div>

                  <!-- 通知方式 -->
                  <div class="px-4 py-3">
                    <p class="text-xs text-slate-500 mb-1">通知方式</p>
                    <div class="flex items-center gap-1.5">
                      <span v-if="bot.signal_bot?.notify_email" class="inline-flex items-center text-xs font-medium text-green-700" title="邮件通知">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </span>
                      <span v-if="bot.signal_bot?.notify_app" class="inline-flex items-center text-xs font-medium text-blue-700" title="应用内通知">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                        </svg>
                      </span>
                      <span v-if="!bot.signal_bot?.notify_email && !bot.signal_bot?.notify_app" class="text-xs text-slate-400">未启用</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 价格提醒 - 显示当前价格和目标价格 -->
            <div v-if="bot.signal_bot && bot.signal_bot.signal_type === 'price_alert'" class="bg-white rounded-xl border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  价格监控
                </h2>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-500">
                    {{ indicatorValuesUpdatedAt ? formatDate(indicatorValuesUpdatedAt) : '暂无数据' }}
                  </span>
                  <button
                    @click="refreshIndicatorValues"
                    :disabled="loadingIndicators"
                    class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg v-if="!loadingIndicators" class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ loadingIndicators ? '刷新中...' : '刷新数据' }}
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-2 gap-6">
                  <!-- 当前价格 -->
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-sm text-blue-600 font-medium">当前价格</div>
                      <div v-if="priceUpdateInfo" class="text-xs text-blue-500" :title="priceUpdateInfo.tooltip">
                        {{ priceUpdateInfo.text }}
                      </div>
                    </div>
                    <div class="text-3xl font-bold text-blue-900">
                      {{ indicatorValues?.price ? formatPrice(indicatorValues.price) : '--' }}
                    </div>
                    <div class="text-xs text-blue-600 mt-2">{{ bot.trading_pair }}</div>
                  </div>

                  <!-- 目标价格 -->
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div class="text-sm text-purple-600 font-medium mb-2">目标价格</div>
                    <div class="text-3xl font-bold text-purple-900">
                      {{ getPriceAlertTargetPrice || '--' }}
                    </div>
                    <div class="text-xs text-purple-600 mt-2">
                      {{ getPriceAlertConditionText }}
                    </div>
                  </div>
                </div>

                <!-- 触发状态 -->
                <div v-if="indicatorValues?.price && getPriceAlertTargetPrice" class="mt-6 p-4 rounded-lg"
                  :class="[
                    isPriceAlertTriggered && !cooldownStatus?.inCooldown ? 'bg-green-50 border border-green-200' :
                    isPriceAlertTriggered && cooldownStatus?.inCooldown ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-slate-50 border border-slate-200'
                  ]">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium"
                      :class="[
                        isPriceAlertTriggered && !cooldownStatus?.inCooldown ? 'text-green-700' :
                        isPriceAlertTriggered && cooldownStatus?.inCooldown ? 'text-yellow-700' :
                        'text-slate-700'
                      ]">
                      触发状态
                    </span>
                    <div class="text-right">
                      <div class="text-lg font-bold"
                        :class="[
                          isPriceAlertTriggered && !cooldownStatus?.inCooldown ? 'text-green-700' :
                          isPriceAlertTriggered && cooldownStatus?.inCooldown ? 'text-yellow-700' :
                          'text-slate-700'
                        ]">
                        <span v-if="!isPriceAlertTriggered">○ 未触发</span>
                        <span v-else-if="cooldownStatus?.inCooldown">⏳ 冷却中</span>
                        <span v-else>✓ 已触发</span>
                      </div>
                      <!-- 冷却倒计时 -->
                      <div v-if="isPriceAlertTriggered && cooldownStatus?.inCooldown" class="mt-2 space-y-2">
                        <div class="text-xs text-yellow-600">
                          剩余 {{ cooldownStatus.text }}
                        </div>
                        <!-- 进度条 -->
                        <div class="w-full bg-yellow-100 rounded-full h-1.5">
                          <div
                            class="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000"
                            :style="{ width: `${cooldownStatus.percentage}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 成交量提醒 - 显示当前成交量 -->
            <div v-if="bot.signal_bot && bot.signal_bot.signal_type === 'volume'" class="bg-white rounded-xl border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  成交量监控
                </h2>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-500">
                    {{ indicatorValuesUpdatedAt ? formatDate(indicatorValuesUpdatedAt) : '暂无数据' }}
                  </span>
                  <button
                    @click="refreshIndicatorValues"
                    :disabled="loadingIndicators"
                    class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg v-if="!loadingIndicators" class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ loadingIndicators ? '刷新中...' : '刷新数据' }}
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-2 gap-6">
                  <!-- 当前成交量 -->
                  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div class="text-sm text-green-600 font-medium mb-2">当前成交量</div>
                    <div class="text-3xl font-bold text-green-900">
                      {{ indicatorValues?.volume?.volume ? formatVolume(indicatorValues.volume.volume) : '--' }}
                    </div>
                    <div class="text-xs text-green-600 mt-2">24小时成交量</div>
                  </div>

                  <!-- 平均成交量 -->
                  <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div class="text-sm text-orange-600 font-medium mb-2">平均成交量</div>
                    <div class="text-3xl font-bold text-orange-900">
                      {{ indicatorValues?.volume?.volume_ma ? formatVolume(indicatorValues.volume.volume_ma) : '--' }}
                    </div>
                    <div class="text-xs text-orange-600 mt-2">
                      {{ bot.signal_bot?.config?.volume_period || 20 }} 周期均值
                    </div>
                  </div>
                </div>

                <!-- 激增倍数 -->
                <div v-if="indicatorValues?.volume?.volume && indicatorValues?.volume?.volume_ma" class="mt-6 p-4 rounded-lg" :class="isVolumeSurge ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium" :class="isVolumeSurge ? 'text-green-700' : 'text-slate-700'">
                      成交量激增
                    </span>
                    <span class="text-lg font-bold" :class="isVolumeSurge ? 'text-green-700' : 'text-slate-700'">
                      {{ (indicatorValues.volume.volume / indicatorValues.volume.volume_ma).toFixed(2) }}x
                      (阈值: {{ bot.signal_bot?.config?.volume_multiplier || 2.0 }}x)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 波动性提醒 - 显示当前波动率 -->
            <div v-if="bot.signal_bot && bot.signal_bot.signal_type === 'volatility'" class="bg-white rounded-xl border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  波动率监控
                </h2>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-500">
                    {{ indicatorValuesUpdatedAt ? formatDate(indicatorValuesUpdatedAt) : '暂无数据' }}
                  </span>
                  <button
                    @click="refreshIndicatorValues"
                    :disabled="loadingIndicators"
                    class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg v-if="!loadingIndicators" class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ loadingIndicators ? '刷新中...' : '刷新数据' }}
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-2 gap-6">
                  <!-- 当前 ATR -->
                  <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div class="text-sm text-red-600 font-medium mb-2">当前 ATR</div>
                    <div class="text-3xl font-bold text-red-900">
                      {{ indicatorValues?.atr?.atr ? formatPrice(indicatorValues.atr.atr) : '--' }}
                    </div>
                    <div class="text-xs text-red-600 mt-2">平均真实波幅</div>
                  </div>

                  <!-- 波动率百分比 -->
                  <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div class="text-sm text-yellow-600 font-medium mb-2">波动率</div>
                    <div class="text-3xl font-bold text-yellow-900">
                      {{ getVolatilityPercent }}%
                    </div>
                    <div class="text-xs text-yellow-600 mt-2">
                      阈值: {{ bot.signal_bot?.config?.volatility_threshold || 5.0 }}%
                    </div>
                  </div>
                </div>

                <!-- 触发状态 -->
                <div v-if="indicatorValues?.atr?.atr" class="mt-6 p-4 rounded-lg" :class="isVolatilityHigh ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium" :class="isVolatilityHigh ? 'text-red-700' : 'text-slate-700'">
                      高波动警告
                    </span>
                    <span class="text-lg font-bold" :class="isVolatilityHigh ? 'text-red-700' : 'text-slate-700'">
                      {{ isVolatilityHigh ? '⚠ 高波动' : '○ 正常' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 指标配置和实时状态 - 仅显示给指标信号提醒类型 -->
            <div v-if="bot.signal_bot && bot.bot_type === 'signal' && bot.signal_bot.signal_type === 'indicator_alert'" class="bg-white rounded-xl border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  指标条件与实时状态
                </h2>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-500">
                    {{ indicatorValuesUpdatedAt ? formatDate(indicatorValuesUpdatedAt) : '暂无数据' }}
                  </span>
                  <button
                    @click="refreshIndicatorValues"
                    :disabled="loadingIndicators"
                    class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg v-if="!loadingIndicators" class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <svg v-else class="w-4 h-4 inline-block mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ loadingIndicators ? '刷新中...' : '刷新数据' }}
                  </button>
                </div>
              </div>

              <div class="p-6 space-y-4">
                <!-- 如果没有配置指标，显示提示（仅针对指标信号提醒类型） -->
                <div v-if="!bot.signal_bot?.indicators_config?.indicators || bot.signal_bot.indicators_config.indicators.length === 0" class="text-center py-8">
                  <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-sm text-slate-500 mb-2">暂无指标配置</p>
                  <p class="text-xs text-slate-400">请编辑机器人以添加指标配置</p>
                </div>

                <!-- 有配置时显示 -->
                <template v-else>
                  <!-- 配置概览 -->
                  <div class="grid grid-cols-3 gap-3 mb-4">
                    <!-- 触发逻辑 -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div class="text-xs text-blue-600 font-medium mb-1">触发逻辑</div>
                      <div class="text-sm font-semibold text-blue-900">
                        {{ bot.signal_bot.indicators_config.require_all ? 'AND（全部满足）' : 'OR（任一满足）' }}
                      </div>
                    </div>

                    <!-- 主时间周期 -->
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div class="text-xs text-purple-600 font-medium mb-1">主时间周期</div>
                      <div class="text-sm font-semibold text-purple-900">
                        {{ bot.signal_bot.timeframes_config?.primary || '1h' }}
                      </div>
                    </div>

                    <!-- 信号冷却期 -->
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div class="text-xs text-orange-600 font-medium mb-1">信号冷却期</div>
                      <div class="text-sm font-semibold text-orange-900">
                        {{ bot.signal_bot.signal_expiration_hours || 24 }} 小时
                      </div>
                    </div>
                  </div>

                  <!-- 触发进度 -->
                  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-700">触发进度</span>
                      <span class="text-sm font-semibold text-slate-900">
                        {{ satisfiedConditionsCount }}/{{ totalConditionsCount }} 条件满足
                      </span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="satisfiedConditionsCount === totalConditionsCount ? 'bg-green-500' : 'bg-blue-500'"
                        :style="{ width: `${(satisfiedConditionsCount / totalConditionsCount * 100)}%` }"
                      ></div>
                    </div>
                    <p class="text-xs text-slate-500 mt-2">
                      {{ bot.signal_bot.indicators_config.require_all ? '需要所有条件都满足（AND 逻辑）' : `需要任一条件满足（OR 逻辑）` }}
                    </p>
                  </div>

                  <!-- 指标列表 -->
                  <div class="space-y-4">
                  <div
                    v-for="(indicator, index) in bot.signal_bot.indicators_config.indicators"
                    :key="index"
                    v-show="indicator.enabled"
                    :class="[
                      'border-2 rounded-xl p-5 transition-all',
                      isConditionSatisfied(indicator)
                        ? 'border-green-300 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    ]"
                  >
                    <!-- 指标头部 -->
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <span :class="[
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                          isConditionSatisfied(indicator) ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'
                        ]">
                          {{ isConditionSatisfied(indicator) ? '✓' : index + 1 }}
                        </span>
                        <div>
                          <h3 class="text-base font-bold text-slate-900">{{ getIndicatorLabel(indicator.type) }}</h3>
                          <p class="text-xs text-slate-500">权重占比: {{ getIndicatorWeightPercent(indicator) }}%</p>
                        </div>
                      </div>
                      <span :class="[
                        'px-3 py-1.5 rounded-lg text-sm font-bold',
                        isConditionSatisfied(indicator)
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      ]">
                        {{ isConditionSatisfied(indicator) ? '✓ 已满足' : '✗ 未满足' }}
                      </span>
                    </div>

                    <!-- 配置参数区域 -->
                    <div class="bg-slate-100 rounded-lg p-3 mb-3">
                      <div class="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        配置参数
                      </div>
                      <div class="space-y-1">
                        <div
                          v-for="(condition, condKey) in getIndicatorConditions(indicator).filter(c => c.isConfig)"
                          :key="'config-' + condKey"
                          class="flex items-center justify-between text-xs"
                        >
                          <span class="text-slate-600">{{ condition.label }}</span>
                          <span
                            :class="[
                              'font-semibold',
                              condition.statusColor || 'text-slate-800'
                            ]"
                          >
                            {{ condition.currentValue }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- 触发条件区域 -->
                    <div class="space-y-2">
                      <div class="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        触发条件
                      </div>
                      <div
                        v-for="(condition, condKey) in getIndicatorConditions(indicator).filter(c => !c.isConfig)"
                        :key="'condition-' + condKey"
                        class="bg-white border border-slate-200 rounded-lg p-3"
                      >
                        <div class="flex items-center justify-between">
                          <span class="text-xs text-slate-600 font-medium">{{ condition.label }}</span>
                          <div class="flex items-center gap-2 text-sm">
                            <span class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                              {{ condition.currentValue }}
                            </span>
                            <span v-if="condition.operator" class="text-slate-400 font-semibold">{{ condition.operator }}</span>
                            <span v-if="condition.threshold" class="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {{ condition.threshold }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 距离触发提示 -->
                    <div v-if="!isConditionSatisfied(indicator) && getDistanceToTrigger(indicator)" class="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p class="text-sm text-orange-700 font-medium flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ getDistanceToTrigger(indicator) }}
                      </p>
                    </div>
                  </div>
                </div>
                </template>
              </div>
            </div>

            <!-- 最近信号 -->
            <div class="space-y-3">
              <h2 class="text-base font-semibold text-slate-900">最近信号</h2>

              <!-- 加载状态 -->
              <div v-if="loadingSignals" class="text-center py-12 bg-white rounded-xl border border-slate-200">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
                <p class="text-sm text-slate-500 mt-2">加载中...</p>
              </div>

              <!-- 信号列表 -->
              <div v-else-if="signals.length > 0" class="space-y-3">
                <div
                  v-for="signal in signals"
                  :key="signal.id"
                  class="bg-slate-50 rounded-lg border border-slate-200 px-5 py-4 hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  <!-- 信号头部 - 一行显示 -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <!-- 信号类型 -->
                      <span :class="[
                        'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                        signal.signal_type === 'buy' ? 'bg-green-100 text-green-700' :
                        signal.signal_type === 'sell' ? 'bg-red-100 text-red-700' :
                        signal.signal_type === 'alert' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      ]">
                        {{ signal.signal_type_display }}
                      </span>

                      <!-- 方向 -->
                      <span :class="[
                        'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                        signal.direction === 'long' ? 'bg-blue-100 text-blue-700' :
                        signal.direction === 'short' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      ]">
                        {{ signal.direction_display }}
                      </span>

                      <!-- 价格 -->
                      <span class="text-sm font-mono text-slate-900">${{ formatPrice(signal.price) }}</span>

                      <!-- 时间 -->
                      <span class="text-xs text-slate-500">{{ formatDate(signal.created_at) }}</span>
                    </div>

                    <!-- 状态 -->
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                      signal.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      signal.status === 'executed' ? 'bg-green-100 text-green-700' :
                      signal.status === 'expired' ? 'bg-slate-100 text-slate-600' :
                      'bg-slate-100 text-slate-700'
                    ]">
                      {{ signal.status_display }}
                    </span>
                  </div>

                  <!-- 市场分析（可展开） -->
                  <div v-if="signal.market_analysis || (signal.ai_powered && signal.analysis)" class="mt-2 pt-2 border-t border-slate-200">
                    <button
                      @click="toggleAnalysis(signal.id)"
                      class="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 transition-colors py-1"
                    >
                      <span class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>市场分析</span>
                        <span v-if="signal.ai_powered" class="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">AI</span>
                      </span>
                      <svg
                        :class="['w-4 h-4 transition-transform', expandedSignals[signal.id] ? 'rotate-180' : '']"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <!-- 展开的分析详情 -->
                    <div v-if="expandedSignals[signal.id]" class="mt-3 space-y-2">

                      <!-- AI 分析结果 -->
                      <div v-if="signal.ai_powered && signal.analysis" class="space-y-3">
                        <!-- 市场趋势 -->
                        <div v-if="signal.analysis.market_trend" class="p-3 bg-white rounded-lg border border-slate-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span class="text-xs font-semibold text-slate-700">市场趋势</span>
                          </div>
                          <p class="text-xs text-slate-600">{{ signal.analysis.market_trend }}</p>
                        </div>

                        <!-- 风险评估 -->
                        <div v-if="signal.analysis.risk_assessment" class="p-3 bg-white rounded-lg border border-slate-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span class="text-xs font-semibold text-slate-700">风险评估</span>
                          </div>
                          <p class="text-xs text-slate-600">{{ signal.analysis.risk_assessment }}</p>
                        </div>

                        <!-- 入场建议 -->
                        <div v-if="signal.analysis.entry_suggestion" class="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span class="text-xs font-semibold text-green-900">入场建议</span>
                          </div>
                          <p class="text-xs text-green-700">{{ signal.analysis.entry_suggestion }}</p>
                        </div>

                        <!-- 止损和止盈 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <!-- 止损建议 -->
                          <div v-if="signal.analysis.stop_loss" class="p-3 bg-red-50 rounded-lg border border-red-200">
                            <div class="flex items-center gap-2 mb-2">
                              <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span class="text-xs font-semibold text-red-900">止损建议</span>
                            </div>
                            <p class="text-xs text-red-700">{{ signal.analysis.stop_loss }}</p>
                          </div>

                          <!-- 止盈建议 -->
                          <div v-if="signal.analysis.take_profit" class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div class="flex items-center gap-2 mb-2">
                              <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span class="text-xs font-semibold text-blue-900">止盈建议</span>
                            </div>
                            <p class="text-xs text-blue-700">{{ signal.analysis.take_profit }}</p>
                          </div>
                        </div>

                        <!-- 市场背景 -->
                        <div v-if="signal.analysis.market_context" class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs font-semibold text-slate-700">市场背景</span>
                          </div>
                          <p class="text-xs text-slate-600">{{ signal.analysis.market_context }}</p>
                        </div>

                        <!-- AI 价格建议 -->
                        <div v-if="signal.analysis.price_suggestions" class="p-3 bg-white rounded-lg border border-slate-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs font-semibold text-slate-700">价格建议</span>
                          </div>

                          <div class="space-y-1.5 text-xs">
                            <!-- 入场价格 -->
                            <div v-if="signal.analysis.price_suggestions.entry_price" class="flex items-center justify-between">
                              <span class="text-slate-600">入场价格</span>
                              <div class="text-right">
                                <span class="font-semibold text-green-600">
                                  ${{ formatPrice(signal.analysis.price_suggestions.entry_price) }}
                                </span>
                                <span v-if="signal.analysis.price_suggestions.entry_price_min && signal.analysis.price_suggestions.entry_price_max" class="text-slate-500 ml-1">
                                  (${{ formatPrice(signal.analysis.price_suggestions.entry_price_min) }} - ${{ formatPrice(signal.analysis.price_suggestions.entry_price_max) }})
                                </span>
                              </div>
                            </div>

                            <!-- 止损价格 -->
                            <div v-if="signal.analysis.price_suggestions.stop_loss_price" class="flex items-center justify-between">
                              <span class="text-slate-600">止损价格</span>
                              <div class="text-right">
                                <span class="font-semibold text-red-600">
                                  ${{ formatPrice(signal.analysis.price_suggestions.stop_loss_price) }}
                                </span>
                                <span v-if="signal.analysis.price_suggestions.stop_loss_percentage" class="text-slate-500 ml-1">
                                  (-{{ signal.analysis.price_suggestions.stop_loss_percentage.toFixed(1) }}%)
                                </span>
                              </div>
                            </div>

                            <!-- 止盈目标 -->
                            <div v-if="signal.analysis.price_suggestions.take_profit_price_1" class="flex items-center justify-between">
                              <span class="text-slate-600">止盈目标 1</span>
                              <div class="text-right">
                                <span class="font-semibold text-blue-600">
                                  ${{ formatPrice(signal.analysis.price_suggestions.take_profit_price_1) }}
                                </span>
                                <span v-if="signal.analysis.price_suggestions.take_profit_percentage_1" class="text-slate-500 ml-1">
                                  (+{{ signal.analysis.price_suggestions.take_profit_percentage_1.toFixed(1) }}%)
                                </span>
                              </div>
                            </div>

                            <div v-if="signal.analysis.price_suggestions.take_profit_price_2" class="flex items-center justify-between">
                              <span class="text-slate-600">止盈目标 2</span>
                              <div class="text-right">
                                <span class="font-semibold text-blue-600">
                                  ${{ formatPrice(signal.analysis.price_suggestions.take_profit_price_2) }}
                                </span>
                                <span v-if="signal.analysis.price_suggestions.take_profit_percentage_2" class="text-slate-500 ml-1">
                                  (+{{ signal.analysis.price_suggestions.take_profit_percentage_2.toFixed(1) }}%)
                                </span>
                              </div>
                            </div>

                            <div v-if="signal.analysis.price_suggestions.take_profit_price_3" class="flex items-center justify-between">
                              <span class="text-slate-600">止盈目标 3</span>
                              <span class="font-semibold text-blue-600">
                                ${{ formatPrice(signal.analysis.price_suggestions.take_profit_price_3) }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- AI 分析原因 -->
                        <div v-if="signal.reasons && signal.reasons.length > 0" class="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span class="text-xs font-semibold text-purple-900">关键因素</span>
                          </div>
                          <ul class="space-y-1">
                            <li v-for="(reason, index) in signal.reasons" :key="index" class="text-xs text-purple-700 flex items-start gap-2">
                              <span class="text-purple-500 mt-0.5">•</span>
                              <span>{{ reason }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <!-- 系统分析结果（6维度） -->
                      <div v-else-if="signal.market_analysis" class="space-y-3">
                        <!-- 系统分析模式标识 -->
                        <div class="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                          <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span class="text-xs font-semibold text-slate-700">系统分析</span>
                        </div>

                        <!-- 各维度分析 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div v-for="(analysis, key) in signal.market_analysis" :key="key" class="p-3 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-start justify-between mb-2">
                              <span class="text-xs font-semibold text-slate-700">
                                {{ getAnalysisLabel(key) }}
                              </span>
                              <span v-if="signal.market_scores && signal.market_scores[key]" :class="[
                                'text-xs font-bold',
                                signal.market_scores[key] > 0 ? 'text-green-600' :
                                signal.market_scores[key] < 0 ? 'text-red-600' : 'text-slate-600'
                              ]">
                                {{ signal.market_scores[key] > 0 ? '+' : '' }}{{ signal.market_scores[key] }}
                              </span>
                            </div>
                            <p class="text-xs text-slate-600">{{ analysis }}</p>

                            <!-- 进度条 -->
                            <div v-if="signal.market_scores && signal.market_scores[key]" class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                :class="[
                                  'h-full transition-all',
                                  signal.market_scores[key] > 0 ? 'bg-green-500' :
                                  signal.market_scores[key] < 0 ? 'bg-red-500' : 'bg-slate-300'
                                ]"
                                :style="{ width: `${Math.abs(signal.market_scores[key])}%` }"
                              ></div>
                            </div>
                          </div>
                        </div>

                        <!-- 系统分析原因 -->
                        <div v-if="signal.analysis_reasons && signal.analysis_reasons.length > 0" class="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs font-semibold text-purple-900">关键因素</span>
                          </div>
                          <ul class="space-y-1">
                            <li v-for="(reason, index) in signal.analysis_reasons" :key="index" class="text-xs text-purple-700 flex items-start gap-2">
                              <span class="text-purple-500 mt-0.5">•</span>
                              <span>{{ reason }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-else class="bg-white rounded-xl border border-slate-200 px-6 py-12 text-center">
                <svg class="mx-auto h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p class="text-sm text-slate-500 mt-3">暂无信号记录</p>
              </div>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else class="text-center py-12">
            <p class="text-slate-500">加载失败，请重试</p>
          </div>
        </main>
      </div>
    </div>

    <!-- 停止确认对话框 -->
    <ConfirmDialog
      :show="showStopConfirm"
      type="warning"
      title="停止机器人"
      message="机器人正在运行中，编辑前需要先停止。是否停止并继续编辑？"
      confirm-text="停止并编辑"
      cancel-text="取消"
      @confirm="confirmStopAndEdit"
      @close="showStopConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import ConfirmDialog from '../../common/ConfirmDialog.vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const actionLoading = ref(false)
const loadingSignals = ref(false)
const loadingIndicators = ref(false)
const bot = ref(null)
const signals = ref([])
const expandedSignals = ref({})  // 记录哪些信号的分析详情是展开的

// 确认对话框状态
const showStopConfirm = ref(false)
const indicatorValues = ref({})  // 存储实时指标值
const indicatorValuesUpdatedAt = ref(null)  // 最后更新时间

// 定时刷新
let refreshInterval = null
let indicatorRefreshInterval = null

// 切换分析详情展开/折叠
const toggleAnalysis = (signalId) => {
  expandedSignals.value[signalId] = !expandedSignals.value[signalId]
}

// 计算满足条件的数量
const satisfiedConditionsCount = computed(() => {
  if (!bot.value?.signal_bot?.indicators_config?.indicators) return 0
  return bot.value.signal_bot.indicators_config.indicators.filter(ind =>
    ind.enabled && isConditionSatisfied(ind)
  ).length
})

const totalConditionsCount = computed(() => {
  if (!bot.value?.signal_bot?.indicators_config?.indicators) return 0
  return bot.value.signal_bot.indicators_config.indicators.filter(ind => ind.enabled).length
})

// 获取分析维度的中文标签
const getAnalysisLabel = (key) => {
  const labels = {
    trend: '📈 趋势分析',
    volume: '📊 成交量分析',
    momentum: '⚡ 动量分析',
    sentiment: '💭 市场情绪',
    onchain: '🔗 链上数据',
    risk: '🛡️ 风险评估'
  }
  return labels[key] || key
}

const loadBot = async () => {
  try {
    loading.value = true
    const response = await botAPI.getBotDetail(route.params.id)
    bot.value = response.data || response

    // 调试：输出信号机器人配置
    console.log('=== 信号机器人配置 ===')
    console.log('bot.signal_bot:', bot.value.signal_bot)
    console.log('indicators_config:', bot.value.signal_bot?.indicators_config)
  } catch (error) {
    console.error('加载机器人详情失败:', error)
    showError('加载机器人详情失败')
  } finally {
    loading.value = false
  }
}

const loadSignals = async () => {
  try {
    loadingSignals.value = true
    console.log('正在加载机器人信号，ID:', route.params.id)
    const response = await botAPI.getBotSignals(route.params.id, { page_size: 10 })
    console.log('信号API响应:', response)
    const data = response.results || response.data || response
    console.log('解析后的信号数据:', data)
    signals.value = Array.isArray(data) ? data : []
    console.log('设置的信号数量:', signals.value.length)
  } catch (error) {
    console.error('加载信号失败:', error)
    console.error('错误详情:', error.message, error.data)
    signals.value = []
  } finally {
    loadingSignals.value = false
  }
}

const handleStartBot = async () => {
  try {
    actionLoading.value = true
    await botAPI.startBot(bot.value.id)
    showSuccess('机器人已启动')
    await loadBot()
  } catch (error) {
    showError(error.message || '启动失败')
  } finally {
    actionLoading.value = false
  }
}

const handleStopBot = async () => {
  try {
    actionLoading.value = true
    await botAPI.stopBot(bot.value.id)
    showSuccess('机器人已停止')
    await loadBot()
  } catch (error) {
    showError(error.message || '停止失败')
  } finally {
    actionLoading.value = false
  }
}

const handleEditBot = () => {
  // 如果机器人正在运行，先提示停止
  if (bot.value.status === 'running') {
    showStopConfirm.value = true
  } else {
    // 机器人未运行，直接跳转编辑
    router.push(`/bots/edit-signal/${bot.value.id}`)
  }
}

// 确认停止并编辑
const confirmStopAndEdit = async () => {
  try {
    actionLoading.value = true
    await botAPI.stopBot(bot.value.id)
    showSuccess('机器人已停止')
    await loadBot()
    // 停止成功后跳转到编辑页面
    router.push(`/bots/edit-signal/${bot.value.id}`)
  } catch (error) {
    showError(error.message || '停止失败')
  } finally {
    actionLoading.value = false
  }
}

const handleBack = () => {
  router.push('/signal-bots')
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = `
    <div class="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
      <span class="text-white text-xl font-bold">${bot.value.token_symbol?.charAt(0) || '?'}</span>
    </div>
  `
}

const getStatusLabel = (status) => {
  const map = {
    running: '运行中',
    paused: '已暂停',
    stopped: '已停止',
    draft: '草稿'
  }
  return map[status] || status
}

const getSignalTypeLabel = (type) => {
  const map = {
    price_alert: '价格提醒',
    indicator_alert: '指标信号提醒',
    technical_indicator: '技术指标',
    volatility: '波动性提醒',
    volume: '成交量/持仓提醒',
    volume_alert: '成交量提醒',
    price_change: '价格变化'
  }
  return map[type] || type || '未知'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCheckInterval = (interval) => {
  if (!interval) return '5 分钟'

  // 解析间隔字符串（如 "1m", "5m", "15m", "1h", "4h", "1d"）
  const match = interval.match(/^(\d+)([mhd])$/)
  if (!match) return interval

  const value = parseInt(match[1])
  const unit = match[2]

  const unitMap = {
    'm': '分钟',
    'h': '小时',
    'd': '天'
  }

  return `${value} ${unitMap[unit] || unit}`
}

// 格式化成交量
const formatVolume = (volume) => {
  if (!volume) return '--'

  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(2) + 'B'
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M'
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K'
  }
  return volume.toFixed(2)
}

// 获取价格提醒的目标价格
const getPriceAlertTargetPrice = computed(() => {
  // 尝试从 config.price_alert.target_price 获取（新格式）
  if (bot.value?.signal_bot?.config?.price_alert?.target_price) {
    return bot.value.signal_bot.config.price_alert.target_price
  }
  // 尝试从 config.target_price 获取（旧格式）
  if (bot.value?.signal_bot?.config?.target_price) {
    return bot.value.signal_bot.config.target_price
  }
  // 尝试从 bot.config 获取
  if (bot.value?.config?.price_alert?.target_price) {
    return bot.value.config.price_alert.target_price
  }
  if (bot.value?.config?.target_price) {
    return bot.value.config.target_price
  }
  return null
})

// 获取价格提醒的条件
const getPriceAlertCondition = computed(() => {
  // 尝试从 config.price_alert.condition 获取（新格式）
  if (bot.value?.signal_bot?.config?.price_alert?.condition) {
    return bot.value.signal_bot.config.price_alert.condition
  }
  // 尝试从 config.condition 获取（旧格式）
  if (bot.value?.signal_bot?.config?.condition) {
    return bot.value.signal_bot.config.condition
  }
  // 尝试从 bot.config 获取
  if (bot.value?.config?.price_alert?.condition) {
    return bot.value.config.price_alert.condition
  }
  if (bot.value?.config?.condition) {
    return bot.value.config.condition
  }
  return 'above'
})

// 获取价格提醒条件文本
const getPriceAlertConditionText = computed(() => {
  const condition = getPriceAlertCondition.value
  const conditionMap = {
    'above': '价格高于',
    'below': '价格低于',
    'crosses_above': '向上突破',
    'crosses_below': '向下突破'
  }
  return conditionMap[condition] || '价格高于'
})

// 价格更新信息
const priceUpdateInfo = computed(() => {
  const metadata = indicatorValues.value?._metadata
  if (!metadata?.price_updated_at) {
    return null
  }

  const updatedAt = new Date(metadata.price_updated_at)
  const now = new Date()
  const diffMinutes = Math.floor((now - updatedAt) / 1000 / 60)

  let text = ''
  let tooltip = ''

  if (diffMinutes < 1) {
    text = '刚刚更新'
    tooltip = '价格数据刚刚更新'
  } else if (diffMinutes < 60) {
    text = `${diffMinutes}分钟前`
    tooltip = `价格数据更新于 ${diffMinutes} 分钟前`
  } else {
    const diffHours = Math.floor(diffMinutes / 60)
    text = `${diffHours}小时前`
    tooltip = `价格数据更新于 ${diffHours} 小时前`
  }

  // 添加数据源信息
  const source = metadata.price_source === 'token' ? '实时价格' : 'K线数据'
  tooltip += ` (来源: ${source})`

  return { text, tooltip }
})

// 冷却状态信息
const cooldownStatus = computed(() => {
  // 获取冷却时间配置（分钟）
  const config = bot.value?.signal_bot?.config || {}
  const cooldownMinutes = config.cooldown_minutes || 30
  const alertMode = config.alert_mode || 'state_change'

  // 只有在 condition_sustain 模式下才有冷却期
  if (alertMode !== 'condition_sustain') {
    return null
  }

  // 获取最近的信号
  const latestSignal = signals.value?.[0]
  if (!latestSignal) {
    return null
  }

  // 计算距离上次信号的时间（分钟）
  const signalTime = new Date(latestSignal.created_at)
  const now = new Date()
  const elapsedMinutes = Math.floor((now - signalTime) / 1000 / 60)

  // 如果还在冷却期内
  if (elapsedMinutes < cooldownMinutes) {
    const remainingMinutes = cooldownMinutes - elapsedMinutes
    return {
      inCooldown: true,
      remainingMinutes,
      totalMinutes: cooldownMinutes,
      percentage: (elapsedMinutes / cooldownMinutes) * 100,
      text: remainingMinutes > 60
        ? `${Math.floor(remainingMinutes / 60)}小时${remainingMinutes % 60}分钟`
        : `${remainingMinutes}分钟`
    }
  }

  // 冷却期已过
  return {
    inCooldown: false,
    remainingMinutes: 0,
    totalMinutes: cooldownMinutes
  }
})

// 价格提醒触发状态（与后端逻辑保持一致）
const isPriceAlertTriggered = computed(() => {
  if (!indicatorValues.value?.price || !getPriceAlertTargetPrice.value) {
    return false
  }

  const currentPrice = parseFloat(indicatorValues.value.price)
  const targetPrice = parseFloat(getPriceAlertTargetPrice.value)
  const condition = getPriceAlertCondition.value

  // ⚠️ 注意：这里的逻辑必须与后端 signal_engine.py 的 _check_price_alert() 保持一致
  // 后端使用严格的大于/小于判断，不是大于等于/小于等于
  if (condition === 'above') {
    return currentPrice > targetPrice  // 严格大于
  } else if (condition === 'below') {
    return currentPrice < targetPrice  // 严格小于
  } else if (condition === 'crosses_above') {
    // crosses_above 需要历史数据判断，前端无法准确判断，显示为未触发
    return false
  } else if (condition === 'crosses_below') {
    // crosses_below 需要历史数据判断，前端无法准确判断，显示为未触发
    return false
  }

  return false
})

// 成交量激增状态
const isVolumeSurge = computed(() => {
  if (!indicatorValues.value?.volume?.volume || !indicatorValues.value?.volume?.volume_ma) {
    return false
  }

  const currentVolume = parseFloat(indicatorValues.value.volume.volume)
  const avgVolume = parseFloat(indicatorValues.value.volume.volume_ma)
  const multiplier = parseFloat(bot.value?.signal_bot?.config?.volume_multiplier || 2.0)

  return currentVolume >= (avgVolume * multiplier)
})

// 波动率百分比
const getVolatilityPercent = computed(() => {
  if (!indicatorValues.value?.atr?.atr || !indicatorValues.value?.atr?.price) {
    return '--'
  }

  const atr = parseFloat(indicatorValues.value.atr.atr)
  const price = parseFloat(indicatorValues.value.atr.price)

  if (price === 0) return '--'

  return ((atr / price) * 100).toFixed(2)
})

// 高波动状态
const isVolatilityHigh = computed(() => {
  const volatilityPercent = getVolatilityPercent.value
  if (volatilityPercent === '--') return false

  const threshold = parseFloat(bot.value?.signal_bot?.config?.volatility_threshold || 5.0)
  return parseFloat(volatilityPercent) >= threshold
})

// 计算指标权重百分比
const getIndicatorWeightPercent = (indicator) => {
  const indicators = bot.value?.signal_bot?.indicators_config?.indicators || []
  const enabledIndicators = indicators.filter(ind => ind.enabled)

  if (enabledIndicators.length === 0) return 0

  // 计算总权重
  const totalWeight = enabledIndicators.reduce((sum, ind) => sum + (ind.weight || 1), 0)

  // 计算当前指标的权重百分比
  const weight = indicator.weight || 1
  return ((weight / totalWeight) * 100).toFixed(1)
}

// 智能格式化价格（支持各种价格范围的代币）
const formatPrice = (value) => {
  if (value === null || value === undefined) return '--'

  // 确保 value 是数字类型
  const numValue = typeof value === 'number' ? value : parseFloat(value)

  if (isNaN(numValue)) return '--'
  if (numValue === 0) return '0.00'

  const absValue = Math.abs(numValue)

  // 高价代币（>= $1）：保留2位小数
  if (absValue >= 1) return numValue.toFixed(2)
  // 中价代币（>= $0.01）：保留4位小数
  if (absValue >= 0.01) return numValue.toFixed(4)
  // 低价代币（>= $0.0001）：保留6位小数
  if (absValue >= 0.0001) return numValue.toFixed(6)
  // 极低价代币（>= $0.00000001）：保留8位小数
  if (absValue >= 0.00000001) return numValue.toFixed(8)
  // 超低价代币（< $0.00000001）：使用科学计数法
  return numValue.toExponential(2)
}

// 获取指标标签
const getIndicatorLabel = (type) => {
  const labels = {
    'rsi': 'RSI 相对强弱指标',
    'macd': 'MACD 指标',
    'ma': '移动平均线',
    'ma_crossover': 'MA 交叉',
    'ma_cross': 'MA 交叉',
    'ema': '指数移动平均线',
    'bollinger': '布林带',
    'kdj': 'KDJ 指标',
    'volume': '成交量',
    'atr': 'ATR 波动率'
  }
  return labels[type] || type.toUpperCase()
}

// 获取指标条件
const getIndicatorConditions = (indicator) => {
  const currentValues = indicatorValues.value[indicator.type] || {}
  const params = indicator.params || {}
  const conditions = []

  switch (indicator.type) {
    case 'rsi':
      // 显示参数配置
      conditions.push({
        label: `RSI 周期`,
        currentValue: params.period || 14,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      // 显示当前值和阈值
      if (params.oversold || params.oversold_threshold) {
        const threshold = params.oversold || params.oversold_threshold
        conditions.push({
          label: 'RSI 超卖',
          currentValue: currentValues.rsi?.toFixed(2) || '--',
          operator: '<',
          threshold: threshold
        })
      }
      if (params.overbought || params.overbought_threshold) {
        const threshold = params.overbought || params.overbought_threshold
        conditions.push({
          label: 'RSI 超买',
          currentValue: currentValues.rsi?.toFixed(2) || '--',
          operator: '>',
          threshold: threshold
        })
      }
      break

    case 'macd':
      // 显示参数配置
      conditions.push({
        label: `MACD 参数`,
        currentValue: `(${params.fast || 12}, ${params.slow || 26}, ${params.signal || 9})`,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      // 零轴下方金叉过滤 - 显示当前状态
      if (params.below_zero_cross) {
        const macd = currentValues.macd || 0
        let statusText = '--'
        let statusColor = ''

        if (macd !== 0) {
          if (macd < 0) {
            statusText = '✓ 在零轴下方（满足条件）'
            statusColor = 'text-green-600'
          } else {
            statusText = '✗ 在零轴上方（不满足）'
            statusColor = 'text-red-600'
          }
        }

        conditions.push({
          label: '零轴下方金叉过滤',
          currentValue: statusText,
          operator: '',
          threshold: '',
          isConfig: true,
          statusColor: statusColor
        })
      }

      // MACD 柱状图状态
      const macdHist = currentValues.macd_histogram
      let macdHistDisplay = '--'
      let macdStatus = ''

      if (macdHist !== undefined && macdHist !== null) {
        macdHistDisplay = formatPrice(macdHist)

        if (macdHist > 0) {
          macdStatus = '（金叉 ✓）'
        } else if (macdHist < 0) {
          macdStatus = '（死叉 ✗）'
        } else {
          macdStatus = '（在零轴）'
        }
      }

      conditions.push({
        label: 'MACD 柱状图',
        currentValue: macdHistDisplay + ' ' + macdStatus,
        operator: '',
        threshold: ''
      })
      break

    case 'ma_crossover':
    case 'ma_cross':
      // 显示参数配置
      conditions.push({
        label: `MA 周期`,
        currentValue: `快线 ${params.fast || params.fast_period || 7} / 慢线 ${params.slow || params.slow_period || 25}`,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      // 价格突破快线过滤 - 显示当前状态
      if (params.break_fast_ma) {
        const fastPeriod = params.fast || params.fast_period || 7
        const price = currentValues.price || 0
        const fastMA = currentValues[`ma_${fastPeriod}`] || 0

        let statusText = '--'
        let statusColor = ''

        if (price > 0 && fastMA > 0) {
          if (price > fastMA) {
            statusText = `✓ 价格 ${formatPrice(price)} > MA${fastPeriod} ${formatPrice(fastMA)}（满足）`
            statusColor = 'text-green-600'
          } else {
            statusText = `✗ 价格 ${formatPrice(price)} < MA${fastPeriod} ${formatPrice(fastMA)}（不满足）`
            statusColor = 'text-red-600'
          }
        }

        conditions.push({
          label: '价格突破快线过滤',
          currentValue: statusText,
          operator: '',
          threshold: '',
          isConfig: true,
          statusColor: statusColor
        })
      }

      // MA 交叉状态
      const fastPeriod = params.fast || params.fast_period || 7
      const slowPeriod = params.slow || params.slow_period || 25
      const fastMA = currentValues[`ma_${fastPeriod}`]
      const slowMA = currentValues[`ma_${slowPeriod}`]

      let crossStatus = ''
      if (fastMA && slowMA) {
        if (fastMA > slowMA) {
          crossStatus = '（金叉 ✓）'
        } else if (fastMA < slowMA) {
          crossStatus = '（死叉 ✗）'
        } else {
          crossStatus = '（相等）'
        }
      }

      conditions.push({
        label: `MA${fastPeriod} vs MA${slowPeriod}`,
        currentValue: formatPrice(fastMA) + ' ' + crossStatus,
        operator: 'vs',
        threshold: formatPrice(slowMA)
      })
      break

    case 'volume':
      // 显示参数配置
      conditions.push({
        label: `成交量周期`,
        currentValue: params.period || 20,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      conditions.push({
        label: `激增倍数`,
        currentValue: `${params.multiplier || 1.5}x`,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      // 成交量对比
      const volumeMa = currentValues.volume_ma || 0
      const currentVolume = currentValues.volume || 0
      conditions.push({
        label: '当前成交量',
        currentValue: currentVolume ? (currentVolume / 1000000).toFixed(2) + 'M' : '--',
        operator: '>',
        threshold: volumeMa ? ((volumeMa * (params.multiplier || 1.5)) / 1000000).toFixed(2) + 'M' : '--'
      })
      break

    case 'atr':
      // 显示参数配置
      conditions.push({
        label: `ATR 周期`,
        currentValue: params.period || 14,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      conditions.push({
        label: `波动阈值`,
        currentValue: `${params.threshold || 2}x`,
        operator: '',
        threshold: '（配置）',
        isConfig: true
      })

      // ATR 波动检测
      const atr = currentValues.atr || 0
      const price = currentValues.price || 0
      let atrPercent = '--'
      if (price > 0 && atr > 0) {
        atrPercent = ((atr / price) * 100).toFixed(2)
      }
      conditions.push({
        label: 'ATR 波动率',
        currentValue: atrPercent !== '--' ? atrPercent + '%' : '--',
        operator: '>',
        threshold: (params.threshold || 2) + '%'
      })
      break
  }

  return conditions
}

// 判断条件是否满足
const isConditionSatisfied = (indicator) => {
  const currentValues = indicatorValues.value[indicator.type] || {}
  const params = indicator.params || {}

  switch (indicator.type) {
    case 'rsi':
      if (params.oversold_threshold && currentValues.rsi) {
        return currentValues.rsi < params.oversold_threshold
      }
      if (params.overbought_threshold && currentValues.rsi) {
        return currentValues.rsi > params.overbought_threshold
      }
      break

    case 'macd':
      if (params.signal_cross && currentValues.macd_histogram !== undefined) {
        if (params.signal_cross === 'bullish') {
          return currentValues.macd_histogram > 0
        } else {
          return currentValues.macd_histogram < 0
        }
      }
      break

    case 'ma':
    case 'ema':
      if (params.price_cross && currentValues.price && currentValues[`${indicator.type}_${params.period}`]) {
        if (params.price_cross === 'above') {
          return currentValues.price > currentValues[`${indicator.type}_${params.period}`]
        } else {
          return currentValues.price < currentValues[`${indicator.type}_${params.period}`]
        }
      }
      break

    case 'volume':
      if (params.volume_threshold && currentValues.volume) {
        return currentValues.volume > params.volume_threshold
      }
      break
  }

  return false
}

// 计算距离触发还差多少
const getDistanceToTrigger = (indicator) => {
  const currentValues = indicatorValues.value[indicator.type] || {}
  const params = indicator.params || {}

  switch (indicator.type) {
    case 'rsi':
      if (params.oversold_threshold && currentValues.rsi) {
        const diff = currentValues.rsi - params.oversold_threshold
        if (diff > 0) {
          return `还需下降 ${diff.toFixed(2)} 点`
        }
      }
      if (params.overbought_threshold && currentValues.rsi) {
        const diff = params.overbought_threshold - currentValues.rsi
        if (diff > 0) {
          return `还需上升 ${diff.toFixed(2)} 点`
        }
      }
      break

    case 'volume':
      if (params.volume_threshold && currentValues.volume) {
        const diff = params.volume_threshold - currentValues.volume
        if (diff > 0) {
          return `还需增加 ${(diff / 1000000).toFixed(2)}M 成交量`
        }
      }
      break
  }

  return null
}

// 刷新指标实时值
const refreshIndicatorValues = async () => {
  if (!bot.value) return

  try {
    loadingIndicators.value = true
    const response = await botAPI.getBotIndicatorValues(bot.value.id)
    indicatorValues.value = response.data || {}

    // 使用后端返回的实际数据时间
    if (response.data?._metadata?.indicator_calculated_at) {
      indicatorValuesUpdatedAt.value = response.data._metadata.indicator_calculated_at
    } else if (response.data?._metadata?.kline_time) {
      indicatorValuesUpdatedAt.value = response.data._metadata.kline_time
    } else {
      indicatorValuesUpdatedAt.value = new Date().toISOString()
    }

    // 调试：打印返回的数据
    console.log('📊 指标实时值:', indicatorValues.value)
    console.log('⏰ 数据更新时间:', indicatorValuesUpdatedAt.value)
  } catch (error) {
    console.error('获取指标值失败:', error)
    showError('获取指标实时值失败')
  } finally {
    loadingIndicators.value = false
  }
}

onMounted(async () => {
  await loadBot()
  await loadSignals()

  // 所有信号机器人都需要加载指标值（价格提醒、成交量、波动性、指标信号）
  if (bot.value?.bot_type === 'signal') {
    await refreshIndicatorValues()

    // 每30秒自动刷新指标值
    indicatorRefreshInterval = setInterval(async () => {
      await refreshIndicatorValues()
    }, 30000)
  }

  // 每30秒自动刷新信号数据
  refreshInterval = setInterval(async () => {
    await loadSignals()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (indicatorRefreshInterval) {
    clearInterval(indicatorRefreshInterval)
  }
})
</script>


