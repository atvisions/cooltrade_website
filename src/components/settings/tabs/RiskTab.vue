<template>
  <div class="max-w-7xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">风险偏好管理</h2>
      <p class="text-gray-500 mt-2 text-sm">精准控制您的投资策略与风险参数</p>
    </div>

    <!-- 当前风险等级卡片 -->
    <div class="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-5 flex-1">
          <div class="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl border border-gray-100">
            {{ getCurrentRiskIcon() }}
          </div>
          <div class="flex-1">
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">当前风险等级</div>
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ getCurrentRiskType() }}</h3>
            <p class="text-sm text-gray-600 max-w-md">{{ getCurrentRiskDescription() }}</p>
            <div class="flex items-center mt-2 space-x-4">
              <p class="text-xs text-gray-400 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                最后评估: {{ riskAssessmentDate || '未设置' }}
              </p>
              <button
                @click="goToRiskAssessment"
                class="text-xs text-gray-500 hover:text-gray-700 underline decoration-dotted underline-offset-2 flex items-center"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                重新评估
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 提示信息 -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 flex items-start">
          <svg class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>您可以直接调整下方的交易参数来精确控制策略。建议每3-6个月重新评估一次风险等级，以适应您的投资经验和市场环境变化。</span>
        </p>
      </div>
    </div>

    <!-- 交易参数设置 -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <!-- 标题栏 -->
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">交易参数配置</h3>
            <p class="text-xs text-gray-500 mt-0.5">根据风险等级调整具体交易参数，支持滑块拖动或手动输入</p>
          </div>
          <button
            @click="restoreRecommendedSettings"
            class="px-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center space-x-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>恢复推荐</span>
          </button>
        </div>
      </div>

      <!-- 参数网格 -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- 止损百分比 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                  </svg>
                  止损百分比
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">触发自动止损的亏损百分比</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.stopLoss"
                  type="number"
                  min="1"
                  max="50"
                  class="w-16 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-sm font-medium text-gray-600">%</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.stopLoss"
              type="range"
              min="1"
              max="50"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>

          <!-- 最大持仓数量 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  最大持仓数量
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">同时持有的币种数量上限</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.maxTotalPositions"
                  type="number"
                  min="1"
                  max="10"
                  class="w-16 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-sm font-medium text-gray-600">个</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.maxTotalPositions"
              type="range"
              min="1"
              max="10"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>1个</span>
              <span>10个</span>
            </div>
          </div>

          <!-- 最小建仓金额 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  最小建仓金额
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">单次交易的最小金额要求</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.minPositionSize"
                  type="number"
                  min="50"
                  max="1000"
                  step="50"
                  class="w-20 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-xs font-medium text-gray-600">USDT</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.minPositionSize"
              type="range"
              min="50"
              max="1000"
              step="50"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>50</span>
              <span>1000</span>
            </div>
          </div>

          <!-- 最大头寸大小 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  最大头寸大小
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">单个机器人的最大仓位金额</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.maxPositionSize"
                  type="number"
                  min="1000"
                  max="50000"
                  step="1000"
                  class="w-20 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-xs font-medium text-gray-600">USDT</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.maxPositionSize"
              type="range"
              min="1000"
              max="50000"
              step="1000"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>1000</span>
              <span>50000</span>
            </div>
          </div>

          <!-- 滑点容忍度 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                  </svg>
                  滑点容忍度
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">可接受的价格滑动范围</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.slippageTolerance"
                  type="number"
                  min="0.5"
                  max="3"
                  step="0.5"
                  class="w-16 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-sm font-medium text-gray-600">%</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.slippageTolerance"
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>0.5%</span>
              <span>3%</span>
            </div>
          </div>

          <!-- 每日最大交易次数 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  每日交易次数
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">每日允许的最大交易次数</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.maxDailyTrades"
                  type="number"
                  min="1"
                  max="20"
                  class="w-16 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-sm font-medium text-gray-600">次</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.maxDailyTrades"
              type="range"
              min="1"
              max="20"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>1次</span>
              <span>20次</span>
            </div>
          </div>

          <!-- 最大杠杆倍数 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  最大杠杆倍数
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">允许使用的最大杠杆倍数</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.maxLeverage"
                  type="number"
                  min="1"
                  max="125"
                  class="w-16 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <span class="text-sm font-medium text-gray-600">x</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.maxLeverage"
              type="range"
              min="1"
              max="125"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>1x</span>
              <span>125x</span>
            </div>
          </div>

          <!-- 熔断机制启用 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 5v1m7-13a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  熔断机制
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">当亏损达到限额时自动停止交易</p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="tradingPreferences.circuitBreakerEnabled = !tradingPreferences.circuitBreakerEnabled"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    tradingPreferences.circuitBreakerEnabled ? 'bg-gray-900' : 'bg-gray-300'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      tradingPreferences.circuitBreakerEnabled ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
                <span class="text-sm font-medium text-gray-600">{{ tradingPreferences.circuitBreakerEnabled ? '启用' : '禁用' }}</span>
              </div>
            </div>
          </div>

          <!-- 熔断触发亏损 -->
          <div class="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <label class="text-sm font-semibold text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  熔断触发亏损
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">亏损达到此金额时触发熔断</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="tradingPreferences.circuitBreakerLoss"
                  type="number"
                  min="500"
                  max="10000"
                  step="500"
                  :disabled="!tradingPreferences.circuitBreakerEnabled"
                  class="w-20 px-2 py-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span class="text-xs font-medium text-gray-600">USDT</span>
              </div>
            </div>
            <input
              v-model.number="tradingPreferences.circuitBreakerLoss"
              type="range"
              min="500"
              max="10000"
              step="500"
              :disabled="!tradingPreferences.circuitBreakerEnabled"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gray disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>500</span>
              <span>10000</span>
            </div>
          </div>
        </div>

        <!-- 交易频率 - 全宽，添加上边距 -->
        <div class="lg:col-span-2 mt-2">
          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <label class="text-sm font-semibold text-gray-900 flex items-center mb-4">
              <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              交易频率偏好
            </label>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                v-for="freq in frequencyOptions"
                :key="freq.value"
                @click="tradingPreferences.frequency = freq.value"
                :class="[
                  'p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-sm',
                  tradingPreferences.frequency === freq.value
                    ? 'border-gray-900 bg-gray-900 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                ]"
              >
                <div class="flex items-start space-x-2.5">
                  <div :class="[
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    tradingPreferences.frequency === freq.value
                      ? 'border-white bg-white'
                      : 'border-gray-300'
                  ]">
                    <div v-if="tradingPreferences.frequency === freq.value" class="w-2 h-2 rounded-full bg-gray-900"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div :class="[
                      'font-semibold text-sm mb-0.5',
                      tradingPreferences.frequency === freq.value ? 'text-white' : 'text-gray-900'
                    ]">
                      {{ freq.label }}
                    </div>
                    <div :class="[
                      'text-xs',
                      tradingPreferences.frequency === freq.value ? 'text-gray-200' : 'text-gray-500'
                    ]">
                      {{ freq.description }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="mt-6 pt-6 px-6 pb-6 border-t border-gray-100 flex items-center justify-between">
        <div class="text-xs text-gray-500">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          参数调整后将立即应用于您的交易策略
        </div>
        <button
          @click="saveTradingPreferences"
          :disabled="tradingPreferencesLoading"
          class="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center space-x-2"
        >
          <svg v-if="!tradingPreferencesLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ tradingPreferencesLoading ? '保存中' : '保存设置' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 注入父组件的数据和方法
const riskAssessmentDate = inject('riskAssessmentDate')
const tradingPreferences = inject('tradingPreferences')
const tradingPreferencesLoading = inject('tradingPreferencesLoading')
const getCurrentRiskIcon = inject('getCurrentRiskIcon')
const getCurrentRiskType = inject('getCurrentRiskType')
const getCurrentRiskDescription = inject('getCurrentRiskDescription')
const restoreRecommendedSettings = inject('restoreRecommendedSettings')
const saveTradingPreferences = inject('saveTradingPreferences')

// 交易频率选项
const frequencyOptions = [
  {
    value: 'conservative',
    label: '保守型',
    description: '每周1-2次'
  },
  {
    value: 'moderate',
    label: '稳健型',
    description: '每天1-2次'
  },
  {
    value: 'active',
    label: '积极型',
    description: '每天3-5次'
  },
  {
    value: 'aggressive',
    label: '激进型',
    description: '每天5次以上'
  }
]

// 跳转到风险评估页面
const goToRiskAssessment = () => {
  router.push('/risk-assessment')
}
</script>

<style scoped>
/* 商务风格滑块 - 统一灰色 */
.slider-gray::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #1f2937;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(31, 41, 55, 0.3), 0 0 0 1px rgba(31, 41, 55, 0.1);
  transition: all 0.2s;
}

.slider-gray::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  background: #111827;
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.4), 0 0 0 1px rgba(31, 41, 55, 0.15);
}

.slider-gray::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #1f2937;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(31, 41, 55, 0.3), 0 0 0 1px rgba(31, 41, 55, 0.1);
}

/* 输入框聚焦效果 */
input[type="number"]:focus {
  outline: none;
}

/* 数字输入框去除箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
