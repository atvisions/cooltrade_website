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
            <!-- 顶部标题栏 - 现代简约设计 -->
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <!-- 左侧：图标 + 标题 -->
                  <div class="flex items-start gap-4 flex-1">
                    <div class="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h1 class="text-2xl font-semibold text-slate-900 mb-1">{{ bot.name }}</h1>
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

              <!-- 基础信息网格 - 紧凑设计 -->
              <div class="grid grid-cols-4 border-t border-slate-200">
                <div class="px-6 py-4 border-r border-slate-200">
                  <p class="text-xs text-slate-500 mb-1">类型</p>
                  <p class="text-sm font-medium text-slate-900">信号机器人</p>
                </div>
                <div class="px-6 py-4 border-r border-slate-200">
                  <p class="text-xs text-slate-500 mb-1">状态</p>
                  <span :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    bot.status === 'running'
                      ? 'bg-green-100 text-green-700'
                      : bot.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-slate-100 text-slate-700'
                  ]">
                    {{ getStatusLabel(bot.status) }}
                  </span>
                </div>
                <div class="px-6 py-4 border-r border-slate-200">
                  <p class="text-xs text-slate-500 mb-1">交易对</p>
                  <p class="text-sm font-medium text-slate-900">{{ bot.token_symbol }}/{{ bot.trading_pair }}</p>
                </div>
                <div class="px-6 py-4">
                  <p class="text-xs text-slate-500 mb-1">交易所</p>
                  <p class="text-sm font-medium text-slate-900">{{ bot.exchange_name }}</p>
                </div>
              </div>
            </div>

            <!-- 信号配置 - 简约卡片 -->
            <div class="bg-white rounded-xl border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  信号配置
                </h2>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
                <div class="px-6 py-4">
                  <p class="text-xs text-slate-500 mb-1">信号类型</p>
                  <p class="text-sm font-medium text-slate-900">{{ getSignalTypeLabel(bot.signal_bot?.signal_type) }}</p>
                </div>
                <div class="px-6 py-4">
                  <p class="text-xs text-slate-500 mb-1">检查间隔</p>
                  <p class="text-sm font-medium text-slate-900">{{ formatCheckInterval(bot.signal_bot?.check_interval) }}</p>
                </div>
                <div class="px-6 py-4">
                  <p class="text-xs text-slate-500 mb-1">邮件通知</p>
                  <span :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    bot.signal_bot?.notify_email ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  ]">
                    {{ bot.signal_bot?.notify_email ? '已启用' : '未启用' }}
                  </span>
                </div>
                <div class="px-6 py-4">
                  <p class="text-xs text-slate-500 mb-1">应用内通知</p>
                  <span :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    bot.signal_bot?.notify_app ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  ]">
                    {{ bot.signal_bot?.notify_app ? '已启用' : '未启用' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 指标配置和实时状态 -->
            <div v-if="bot.signal_bot && bot.bot_type === 'signal'" class="bg-white rounded-xl border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  指标条件与实时状态
                </h2>
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

              <div class="p-6 space-y-4">
                <!-- 如果没有配置指标，显示提示 -->
                <div v-if="!bot.signal_bot?.indicators_config?.indicators || bot.signal_bot.indicators_config.indicators.length === 0" class="text-center py-8">
                  <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-sm text-slate-500 mb-2">此信号机器人使用旧版配置格式</p>
                  <p class="text-xs text-slate-400">请编辑机器人以使用新的多指标配置功能</p>
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
                  <div class="space-y-3">
                  <div
                    v-for="(indicator, index) in bot.signal_bot.indicators_config.indicators"
                    :key="index"
                    v-show="indicator.enabled"
                    class="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <span :class="[
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                          isConditionSatisfied(indicator) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        ]">
                          {{ isConditionSatisfied(indicator) ? '✓' : '○' }}
                        </span>
                        <h3 class="text-sm font-semibold text-slate-900">{{ getIndicatorLabel(indicator.type) }}</h3>
                        <span class="text-xs text-slate-500">权重: {{ indicator.weight }}%</span>
                      </div>
                      <span :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        isConditionSatisfied(indicator) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      ]">
                        {{ isConditionSatisfied(indicator) ? '已满足' : '未满足' }}
                      </span>
                    </div>

                    <!-- 指标参数和当前值 -->
                    <div class="space-y-2">
                      <div v-for="(condition, condKey) in getIndicatorConditions(indicator)" :key="condKey" class="flex items-center justify-between text-sm">
                        <span class="text-slate-600">{{ condition.label }}</span>
                        <div class="flex items-center gap-2">
                          <span class="font-mono text-slate-900">{{ condition.currentValue }}</span>
                          <span class="text-slate-400">{{ condition.operator }}</span>
                          <span class="font-mono font-semibold text-blue-600">{{ condition.threshold }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 距离触发还差多少 -->
                    <div v-if="!isConditionSatisfied(indicator) && getDistanceToTrigger(indicator)" class="mt-3 pt-3 border-t border-slate-200">
                      <p class="text-xs text-orange-600 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ getDistanceToTrigger(indicator) }}
                      </p>
                    </div>
                  </div>
                </div>

                  <!-- 最后更新时间 -->
                  <div class="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
                    最后更新: {{ indicatorValuesUpdatedAt ? formatDate(indicatorValuesUpdatedAt) : '暂无数据' }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
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
  router.push(`/bots/edit-signal/${bot.value.id}`)
}

const handleBack = () => {
  router.push('/signal-bots')
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
    technical_indicator: '技术指标',
    volume_alert: '成交量提醒',
    price_change: '价格变化'
  }
  return map[type] || type || '未知'
}

const formatPrice = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
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

// 获取指标标签
const getIndicatorLabel = (type) => {
  const labels = {
    'rsi': 'RSI 相对强弱指标',
    'macd': 'MACD 指标',
    'ma': '移动平均线',
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
      if (params.oversold_threshold) {
        conditions.push({
          label: 'RSI 超卖',
          currentValue: currentValues.rsi?.toFixed(2) || '--',
          operator: '<',
          threshold: params.oversold_threshold
        })
      }
      if (params.overbought_threshold) {
        conditions.push({
          label: 'RSI 超买',
          currentValue: currentValues.rsi?.toFixed(2) || '--',
          operator: '>',
          threshold: params.overbought_threshold
        })
      }
      break

    case 'macd':
      if (params.signal_cross) {
        conditions.push({
          label: 'MACD 金叉/死叉',
          currentValue: currentValues.macd_histogram?.toFixed(4) || '--',
          operator: params.signal_cross === 'bullish' ? '>' : '<',
          threshold: '0'
        })
      }
      break

    case 'ma':
    case 'ema':
      if (params.price_cross) {
        conditions.push({
          label: `价格突破 ${indicator.type.toUpperCase()}`,
          currentValue: currentValues.price?.toFixed(2) || '--',
          operator: params.price_cross === 'above' ? '>' : '<',
          threshold: currentValues[`${indicator.type}_${params.period}`]?.toFixed(2) || '--'
        })
      }
      break

    case 'volume':
      if (params.volume_threshold) {
        conditions.push({
          label: '成交量',
          currentValue: currentValues.volume ? (currentValues.volume / 1000000).toFixed(2) + 'M' : '--',
          operator: '>',
          threshold: (params.volume_threshold / 1000000).toFixed(2) + 'M'
        })
      }
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
    indicatorValuesUpdatedAt.value = new Date().toISOString()
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

  // 如果有指标配置，立即加载指标值
  if (bot.value?.signal_bot?.indicators_config?.indicators?.length > 0) {
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


