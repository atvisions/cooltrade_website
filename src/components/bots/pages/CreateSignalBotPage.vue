<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-6">
        <!-- 左侧表单区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-center gap-4 mb-2">
              <button
                @click="handleCancel"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 transition-colors"
                title="返回"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 class="text-3xl font-bold text-slate-900">{{ isEditMode ? '编辑信号机器人' : '创建信号机器人' }}</h1>
                <p class="text-slate-600 mt-1">配置市场信号监控和通知</p>
              </div>
            </div>
          </div>

          <!-- 监控配置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">监控配置</h2>
                <p class="text-sm text-slate-500">选择要监控的交易对和时间周期</p>
              </div>
            </div>
            <div class="space-y-6">
              <!-- 交易所选择（两级联动） -->
              <div class="space-y-4">
                <!-- 选择交易所 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    选择交易所 <span class="text-red-500">*</span>
                    <span class="text-xs text-slate-500 ml-2">选择要监控的交易所</span>
                  </label>

                  <!-- 交易所列表 -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      v-for="exchange in availableExchanges"
                      :key="exchange.value"
                      type="button"
                      @click="selectExchangeType(exchange.value)"
                      :class="[
                        'flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all',
                        selectedExchangeType === exchange.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      ]"
                    >
                      <img
                        :src="exchange.logo"
                        :alt="exchange.label"
                        class="w-12 h-12 rounded-lg mb-2 object-contain"
                        @error="handleImageError"
                      />
                      <div class="font-medium text-slate-900 text-sm">
                        {{ exchange.label }}
                      </div>
                      <svg
                        v-if="selectedExchangeType === exchange.value"
                        class="h-5 w-5 text-blue-500 mt-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.exchange_name" class="mt-1 text-sm text-red-500">{{ errors.exchange_name }}</p>
                </div>
              </div>

              <!-- 代币和计价币种 -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- 代币搜索 -->
                <div class="md:col-span-3 token-search-container">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    代币 <span class="text-red-500">*</span>
                    <span v-if="!formData.exchange_name" class="text-xs text-orange-500 ml-2">请先选择交易所</span>
                    <span v-else class="text-xs text-slate-500 ml-2">只显示 {{ selectedExchange?.label }} 支持的代币</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="tokenSearchQuery"
                      @input="handleTokenSearch"
                      @focus="showTokenResults = true"
                      type="text"
                      :placeholder="formData.exchange_name ? '搜索代币 (如: BTC, ETH)' : '请先选择交易所'"
                      :disabled="!formData.exchange_name"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <div
                      v-if="showTokenResults"
                      class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div v-if="tokenSearching" class="p-4 text-center text-slate-500">
                        <div class="flex items-center justify-center">
                          <svg class="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          搜索中...
                        </div>
                      </div>
                      <div v-else-if="tokenSearchResults.length === 0" class="p-4 text-center">
                        <div class="text-slate-400 mb-2">
                          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div class="text-slate-600 font-medium">未找到相关代币</div>
                        <div class="text-xs text-slate-500 mt-1">
                          {{ selectedExchange?.label }} 不支持该代币
                        </div>
                      </div>
                      <div v-else>
                        <button
                          v-for="token in tokenSearchResults"
                          :key="token.id"
                          type="button"
                          @click="selectToken(token)"
                          class="w-full flex items-center p-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <img
                            :src="token.logo"
                            :alt="token.symbol"
                            class="w-8 h-8 rounded-full mr-3 object-contain"
                            @error="handleImageError"
                          />
                          <div class="flex-1">
                            <div class="font-medium text-slate-900">{{ token.symbol }}</div>
                            <div class="text-xs text-slate-500">{{ token.name }}</div>
                          </div>
                          <div class="text-sm text-slate-600">
                            ${{ formatPrice(token.current_price) }}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- 热门代币快捷选择 -->
                  <div class="mt-2 flex flex-wrap gap-2">
                    <button
                      v-for="popularToken in popularTokens"
                      :key="popularToken"
                      type="button"
                      @click="quickSelectToken(popularToken)"
                      class="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      {{ popularToken }}
                    </button>
                  </div>
                  <p v-if="errors.token" class="mt-1 text-sm text-red-500">{{ errors.token }}</p>
                </div>

                <!-- 计价币种 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    计价币种
                  </label>
                  <Select
                    v-model="formData.trading_pair"
                    :options="availableQuoteAssets"
                    placeholder="选择"
                  />
                  <p v-if="errors.trading_pair" class="mt-1 text-sm text-red-500">{{ errors.trading_pair }}</p>
                </div>
              </div>
            </div>
          </Card>

          <!-- 信号配置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">信号配置</h2>
                <p class="text-sm text-slate-500">设置触发信号的条件和参数</p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- 信号类型 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  信号类型 <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    v-for="type in signalTypes"
                    :key="type.value"
                    type="button"
                    @click="formData.signal_type = type.value"
                    :class="[
                      'flex flex-col items-center p-4 border-2 rounded-lg transition-all',
                      formData.signal_type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    ]"
                  >
                    <component :is="type.icon" class="w-6 h-6 mb-2 text-slate-600" />
                    <span class="text-sm font-medium text-slate-900">{{ type.label }}</span>
                  </button>
                </div>
                <p v-if="errors.signal_type" class="mt-1 text-sm text-red-500">{{ errors.signal_type }}</p>
              </div>

              <!-- 时间周期 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-3">
                  时间周期
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <button
                    v-for="tf in timeframes"
                    :key="tf.value"
                    type="button"
                    @click="formData.timeframe = tf.value"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      formData.timeframe === tf.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    ]"
                  >
                    {{ tf.label }}
                  </button>
                </div>
                <p class="text-xs text-slate-500 pl-1">周期越短信号越频繁，周期越长信号越稳定</p>
              </div>

              <!-- 检查间隔 -->
              <div>
                <div class="flex items-baseline gap-2 mb-3">
                  <label class="block text-sm font-medium text-slate-700">
                    检查间隔
                  </label>
                  <span class="text-xs text-slate-500">系统多久检查一次信号条件（独立于时间周期）</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="interval in checkIntervals"
                    :key="interval.value"
                    type="button"
                    @click="formData.check_interval = interval.value"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      formData.check_interval === interval.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    ]"
                  >
                    {{ interval.label }}
                  </button>
                </div>
              </div>

              <!-- 说明提示 -->
              <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div class="flex gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-sm text-slate-700 space-y-1.5">
                    <p><span class="font-semibold text-slate-900">时间周期</span>：决定用哪种 K 线计算指标（如 1 小时 K 线）</p>
                    <p><span class="font-semibold text-slate-900">检查间隔</span>：决定多久检查一次信号（如每 5 分钟检查一次）</p>
                    <p class="text-blue-700 font-medium">💡 推荐：检查间隔 ≤ 时间周期，避免错过信号</p>
                  </div>
                </div>
              </div>

              <!-- 价格提醒配置 -->
              <div v-if="formData.signal_type === 'price_alert'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">价格提醒设置</h3>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      触发条件
                      <span class="text-xs text-slate-500 ml-2">当价格满足条件时触发通知</span>
                    </label>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="cond in priceConditions"
                        :key="cond.value"
                        type="button"
                        @click="priceAlertConfig.condition = cond.value"
                        :class="[
                          'p-3 border-2 rounded-lg text-sm font-medium transition-all',
                          priceAlertConfig.condition === cond.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        ]"
                      >
                        {{ cond.label }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-sm font-medium text-slate-700">
                        目标价格 (USD)
                        <span class="text-xs text-slate-500 ml-2">设置触发通知的价格</span>
                      </label>
                      <span v-if="selectedToken" class="text-sm font-semibold text-slate-900">
                        当前价格 ${{ formatPrice(selectedToken.current_price) }}
                      </span>
                    </div>
                    <Input
                      v-model="priceAlertConfig.target_price"
                      type="number"
                      placeholder="例如: 95000"
                      step="0.00000001"
                    />

                    <!-- 快捷百分比按钮 -->
                    <div v-if="selectedToken && selectedToken.current_price" class="mt-3">
                      <div class="text-xs text-slate-600 mb-2">快速设置（点击自动填入）：</div>
                      <div class="grid grid-cols-5 gap-2">
                        <button
                          v-for="percent in quickPercentages"
                          :key="percent"
                          type="button"
                          @click="setQuickPrice(percent)"
                          class="p-2 border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                          <div class="text-xs font-semibold" :class="percent > 0 ? 'text-green-600' : 'text-red-600'">
                            {{ percent > 0 ? '+' : '' }}{{ percent }}%
                          </div>
                          <div class="text-xs text-slate-500 mt-0.5">
                            ${{ formatQuickPrice(selectedToken.current_price, percent) }}
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- 价格变化预览 -->
                    <div v-if="priceChangePreview" class="mt-3 p-3 bg-white border rounded-lg" :class="priceChangePreview.isLogicalError ? 'border-red-300 bg-red-50' : 'border-slate-200'">
                      <div class="text-xs font-semibold mb-2" :class="priceChangePreview.isLogicalError ? 'text-red-700' : 'text-slate-700'">
                        {{ priceChangePreview.isLogicalError ? '⚠️ 逻辑错误' : '📊 价格变化预览' }}
                      </div>
                      <div class="space-y-1.5 text-xs">
                        <div class="flex justify-between">
                          <span class="text-slate-600">目标价格：</span>
                          <span class="font-semibold text-slate-900">${{ priceChangePreview.targetFormatted }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-600">当前价格：</span>
                          <span class="font-semibold text-slate-900">${{ priceChangePreview.currentFormatted }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-600">变化幅度：</span>
                          <span class="font-semibold" :class="priceChangePreview.percent >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ priceChangePreview.percent >= 0 ? '+' : '' }}{{ priceChangePreview.percent }}%
                            {{ priceChangePreview.direction === 'up' ? '↑' : '↓' }}
                            ({{ priceChangePreview.directionText }} ${{ priceChangePreview.diffFormatted }})
                          </span>
                        </div>
                        <div class="pt-2 border-t border-slate-200">
                          <div :class="priceChangePreview.isLogicalError ? 'text-red-700' : 'text-slate-700'">
                            <span class="font-medium">触发条件：</span>
                            <span>{{ priceChangePreview.triggerDescription }}</span>
                          </div>
                        </div>

                        <!-- 逻辑错误警告 -->
                        <div v-if="priceChangePreview.isLogicalError" class="pt-2 border-t border-red-200">
                          <div class="flex items-start gap-2 text-red-700">
                            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                              <div class="font-semibold">此条件永远无法触发！</div>
                              <div class="mt-1">{{ priceChangePreview.errorMessage }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 使用场景说明 -->
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-3">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <div class="text-xs font-semibold text-blue-900">常见使用场景</div>
                    </div>
                    <div class="space-y-2 text-xs text-blue-800">
                      <div class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span class="font-semibold">抄底场景：</span>
                          设置"价格低于"并填入期望的买入价格，当价格跌到心理价位时收到通知，考虑是否买入
                        </div>
                      </div>
                      <div class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <div>
                          <span class="font-semibold">止盈场景：</span>
                          设置"价格高于"并填入期望的卖出价格，当价格涨到目标价位时收到通知，考虑是否卖出
                        </div>
                      </div>
                      <div class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <div>
                          <span class="font-semibold">关键位场景：</span>
                          设置"向上突破"或"向下突破"关键阻力/支撑位，突破时收到通知，可能有大行情
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RSI配置 -->
              <div v-if="formData.signal_type === 'rsi'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">RSI 指标设置</h3>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      RSI 周期
                      <span class="text-xs text-slate-500 ml-2">计算 RSI 的 K 线数量，推荐 14</span>
                    </label>
                    <Input
                      v-model="rsiConfig.period"
                      type="number"
                      placeholder="14"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        超买阈值
                        <span class="text-xs text-slate-500 block">RSI > 此值时触发卖出信号</span>
                      </label>
                      <Input
                        v-model="rsiConfig.overbought"
                        type="number"
                        placeholder="70"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        超卖阈值
                        <span class="text-xs text-slate-500 block">RSI < 此值时触发买入信号</span>
                      </label>
                      <Input
                        v-model="rsiConfig.oversold"
                        type="number"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- MA交叉配置 -->
              <div v-if="formData.signal_type === 'ma_crossover'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">MA 交叉设置</h3>
                </div>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        快线周期
                        <span class="text-xs text-slate-500 block">短期均线，推荐 7</span>
                      </label>
                      <Input
                        v-model="maCrossConfig.fast"
                        type="number"
                        placeholder="7"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        慢线周期
                        <span class="text-xs text-slate-500 block">长期均线，推荐 25</span>
                      </label>
                      <Input
                        v-model="maCrossConfig.slow"
                        type="number"
                        placeholder="25"
                      />
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>快线上穿慢线产生买入信号，快线下穿慢线产生卖出信号</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 布林带配置 -->
              <div v-if="formData.signal_type === 'bollinger'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">布林带设置</h3>
                </div>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        周期
                        <span class="text-xs text-slate-500 block">计算均线的 K 线数量，推荐 20</span>
                      </label>
                      <Input
                        v-model="bollingerConfig.period"
                        type="number"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        标准差倍数
                        <span class="text-xs text-slate-500 block">上下轨距离，推荐 2</span>
                      </label>
                      <Input
                        v-model="bollingerConfig.std"
                        type="number"
                        placeholder="2"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>价格触及上轨产生卖出信号，触及下轨产生买入信号</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 成交量配置 -->
              <div v-if="formData.signal_type === 'volume'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">成交量设置</h3>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      异常倍数
                      <span class="text-xs text-slate-500 ml-2">当前成交量 ÷ 平均成交量 > 此值时触发</span>
                    </label>
                    <Input
                      v-model="volumeConfig.threshold"
                      type="number"
                      placeholder="2.0"
                      step="0.1"
                    />
                  </div>
                  <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>成交量异常放大通常预示价格即将发生较大波动</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MACD配置 -->
              <div v-if="formData.signal_type === 'macd'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">MACD 设置</h3>
                </div>
                <div class="space-y-4">
                  <div class="grid grid-cols-4 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        快线周期
                        <span class="text-xs text-slate-500 block">EMA 快线，推荐 12</span>
                      </label>
                      <Input
                        v-model="macdConfig.fast"
                        type="number"
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        慢线周期
                        <span class="text-xs text-slate-500 block">EMA 慢线，推荐 26</span>
                      </label>
                      <Input
                        v-model="macdConfig.slow"
                        type="number"
                        placeholder="26"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        信号线周期
                        <span class="text-xs text-slate-500 block">DEA 线，推荐 9</span>
                      </label>
                      <Input
                        v-model="macdConfig.signal"
                        type="number"
                        placeholder="9"
                      />
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>MACD 金叉（DIF 上穿 DEA）产生买入信号，死叉产生卖出信号</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- KDJ配置 -->
              <div v-if="formData.signal_type === 'kdj'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 class="text-base font-semibold text-slate-900">KDJ 设置</h3>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      周期
                      <span class="text-xs text-slate-500 ml-2">计算 KDJ 的 K 线数量，推荐 9</span>
                    </label>
                    <Input
                      v-model="kdjConfig.period"
                      type="number"
                      placeholder="9"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        超买阈值
                        <span class="text-xs text-slate-500 block">K 值 > 此值时触发卖出信号</span>
                      </label>
                      <Input
                        v-model="kdjConfig.overbought"
                        type="number"
                        placeholder="80"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        超卖阈值
                        <span class="text-xs text-slate-500 block">K 值 < 此值时触发买入信号</span>
                      </label>
                      <Input
                        v-model="kdjConfig.oversold"
                        type="number"
                        placeholder="20"
                      />
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>KDJ 是随机指标，对短期价格波动较为敏感</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- AI 分析模式 -->
          <Card variant="default" class="mb-6">
            <!-- 标题和开关 -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-lg font-semibold text-slate-900">AI 分析模式</h2>
                    <span class="px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">AI</span>
                  </div>
                  <p class="text-sm text-slate-500">使用 AI 深度分析市场</p>
                </div>
              </div>

              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="formData.use_advanced_analysis"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-slate-700">
                  {{ formData.use_advanced_analysis ? '已启用' : '未启用' }}
                </span>
              </label>
            </div>

            <!-- 对比说明 -->
            <div class="space-y-3">
              <!-- 系统分析 -->
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <span class="font-medium text-slate-900">系统分析（未开启 AI）</span>
                </div>
                <p class="text-sm text-slate-600 ml-7">
                  基于技术指标的规则分析，给出看多/看空建议
                </p>
              </div>

              <!-- AI 分析 -->
              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span class="font-medium text-purple-900">AI 深度分析（开启 AI）</span>
                </div>
                <p class="text-sm text-purple-700 ml-7 mb-3">
                  调用 AI 模型进行深度分析，提供详细的市场洞察和操作建议
                </p>
                <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm ml-7">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-purple-700">市场趋势判断</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-purple-700">风险评估</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-purple-700">入场/止损/止盈建议</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-purple-700">市场背景分析</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- 通知设置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">通知设置</h2>
                <p class="text-sm text-slate-500">选择接收信号通知的方式和频率</p>
              </div>
            </div>

            <!-- 通知渠道 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-3">通知渠道</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  :class="[
                    'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                    formData.notify_email
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  ]"
                >
                  <input
                    type="checkbox"
                    v-model="formData.notify_email"
                    class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div class="ml-3 flex-1">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span class="font-medium text-slate-900">邮件通知</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">发送信号通知到您的邮箱</p>
                  </div>
                </label>

                <label
                  :class="[
                    'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                    formData.notify_app
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  ]"
                >
                  <input
                    type="checkbox"
                    v-model="formData.notify_app"
                    class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div class="ml-3 flex-1">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span class="font-medium text-slate-900">应用内通知</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">在应用内实时接收通知</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- 提醒模式 -->
            <div class="border-t border-slate-200 pt-6">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                提醒频率
                <span class="text-xs text-slate-500 ml-2">控制提醒的发送频率</span>
              </label>
              <div class="space-y-2">
                <label
                  v-for="mode in alertModes"
                  :key="mode.value"
                  :class="[
                    'flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all',
                    alertConfig.mode === mode.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  ]"
                >
                  <input
                    type="radio"
                    :value="mode.value"
                    v-model="alertConfig.mode"
                    class="mt-1 mr-3"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-slate-900">{{ mode.label }}</span>
                      <span v-if="mode.recommended" class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">推荐</span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1">{{ mode.description }}</p>
                  </div>
                </label>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  冷却时间（分钟）
                  <span class="text-xs text-slate-500 ml-2">两次提醒之间的最小间隔</span>
                </label>
                <Input
                  v-model.number="alertConfig.cooldown_minutes"
                  type="number"
                  min="5"
                  max="1440"
                  placeholder="30"
                />
                <p class="text-xs text-slate-500 mt-1">
                  建议：新手用户 60 分钟，短期交易 15-30 分钟，专业用户 30 分钟
                </p>
              </div>
            </div>
          </Card>

          <!-- 基本信息 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">基本信息</h2>
                <p class="text-sm text-slate-500">设置机器人的名称和描述</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-slate-700">机器人名称</label>
                  <button
                    type="button"
                    @click="useAutoGeneratedName"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    使用自动生成
                  </button>
                </div>
                <Input
                  v-model="formData.name"
                  placeholder="输入机器人名称"
                  :error="errors.name"
                />
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-slate-700">描述</label>
                  <button
                    type="button"
                    @click="useAutoGeneratedDescription"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    使用自动生成
                  </button>
                </div>
                <Input
                  v-model="formData.description"
                  placeholder="输入机器人描述"
                  type="textarea"
                />
              </div>
            </div>
          </Card>
        </main>

        <!-- 右侧预览窗口 -->
        <aside class="w-80 flex-shrink-0">
          <div class="sticky top-24">
            <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div class="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                <h3 class="text-slate-700 font-semibold flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  配置预览
                </h3>
              </div>

              <div class="p-4 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
                <!-- 机器人名称 -->
                <div>
                  <div class="text-xs text-slate-500 mb-1">机器人名称</div>
                  <div class="text-sm font-medium text-slate-900">
                    {{ autoGeneratedName || '未命名信号机器人' }}
                  </div>
                </div>

                <!-- 监控配置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">监控配置</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易所</span>
                      <span class="font-medium text-slate-900">
                        {{ selectedExchange?.label || '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易对</span>
                      <span class="font-medium text-slate-900">
                        {{ selectedToken?.symbol ? `${selectedToken.symbol}/${formData.trading_pair || 'USDT'}` : '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">时间周期</span>
                      <span class="font-medium text-slate-900">
                        {{ timeframes?.find(t => t.value === formData.timeframe)?.label || '-' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 信号类型 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">信号类型</div>
                  <div class="flex items-center gap-2">
                    <div v-if="formData.signal_type" class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {{ signalTypes?.find(t => t.value === formData.signal_type)?.label }}
                    </div>
                    <div v-else class="text-xs text-slate-400">未选择</div>
                  </div>
                </div>

                <!-- 专业分析模式 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">分析模式</div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">专业分析</span>
                    <div v-if="formData.use_advanced_analysis" class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded text-xs font-semibold">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      已启用
                    </div>
                    <div v-else class="text-xs text-slate-400">未启用</div>
                  </div>
                </div>

                <!-- 信号配置详情 -->
                <div v-if="formData.signal_type" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">信号配置</div>

                  <!-- 价格提醒 -->
                  <div v-if="formData.signal_type === 'price_alert'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">触发条件</span>
                      <span class="font-medium text-slate-900">
                        {{ priceConditions?.find(c => c.value === priceAlertConfig.condition)?.label || '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">目标价格</span>
                      <span class="font-medium text-slate-900">
                        {{ priceAlertConfig.target_price ? `$${priceAlertConfig.target_price}` : '-' }}
                      </span>
                    </div>
                  </div>

                  <!-- RSI -->
                  <div v-if="formData.signal_type === 'rsi'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">周期</span>
                      <span class="font-medium text-slate-900">{{ rsiConfig.period || 14 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">超买阈值</span>
                      <span class="font-medium text-slate-900">{{ rsiConfig.overbought || 70 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">超卖阈值</span>
                      <span class="font-medium text-slate-900">{{ rsiConfig.oversold || 30 }}</span>
                    </div>
                  </div>

                  <!-- MA交叉 -->
                  <div v-if="formData.signal_type === 'ma_cross'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">快线周期</span>
                      <span class="font-medium text-slate-900">{{ maCrossConfig.fast_period || 7 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">慢线周期</span>
                      <span class="font-medium text-slate-900">{{ maCrossConfig.slow_period || 25 }}</span>
                    </div>
                  </div>

                  <!-- 布林带 -->
                  <div v-if="formData.signal_type === 'bollinger'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">周期</span>
                      <span class="font-medium text-slate-900">{{ bollingerConfig.period || 20 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">标准差倍数</span>
                      <span class="font-medium text-slate-900">{{ bollingerConfig.std_dev || 2 }}</span>
                    </div>
                  </div>

                  <!-- 成交量 -->
                  <div v-if="formData.signal_type === 'volume'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">倍数阈值</span>
                      <span class="font-medium text-slate-900">{{ volumeConfig.multiplier || 2 }}x</span>
                    </div>
                  </div>

                  <!-- MACD -->
                  <div v-if="formData.signal_type === 'macd'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">快线周期</span>
                      <span class="font-medium text-slate-900">{{ macdConfig.fast_period || 12 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">慢线周期</span>
                      <span class="font-medium text-slate-900">{{ macdConfig.slow_period || 26 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">信号线周期</span>
                      <span class="font-medium text-slate-900">{{ macdConfig.signal_period || 9 }}</span>
                    </div>
                  </div>

                  <!-- KDJ -->
                  <div v-if="formData.signal_type === 'kdj'" class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">周期</span>
                      <span class="font-medium text-slate-900">{{ kdjConfig.period || 9 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">超买阈值</span>
                      <span class="font-medium text-slate-900">{{ kdjConfig.overbought || 80 }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">超卖阈值</span>
                      <span class="font-medium text-slate-900">{{ kdjConfig.oversold || 20 }}</span>
                    </div>
                  </div>
                </div>

                <!-- 通知方式 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">通知方式</div>
                  <div class="flex flex-wrap gap-2">
                    <div v-if="formData.notify_email" class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      邮件
                    </div>
                    <div v-if="formData.notify_app" class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                      应用内
                    </div>
                    <div v-if="!formData.notify_email && !formData.notify_app" class="text-xs text-slate-400">
                      未选择通知方式
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <Button
                  variant="primary"
                  @click="handleSubmit"
                  :loading="submitting"
                  class="flex-1"
                >
                  {{ isEditMode ? '保存修改' : '创建机器人' }}
                </Button>
                <Button
                  variant="secondary"
                  @click="handleCancel"
                  class="flex-1"
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import Button from '../../common/ui/Button.vue'
import Input from '../../common/ui/Input.vue'
import Select from '../../common/ui/Select.vue'
import Card from '../../common/ui/Card.vue'
import { botAPI, exchangeAPI, apiRequest, API_ENDPOINTS } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()

// 编辑模式
const isEditMode = computed(() => !!route.params.id)
const botId = computed(() => route.params.id)
const isBotRunning = ref(false)

// SVG 图标组件
const PriceIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const ChartBarIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const TrendingUpIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
])

const ChartLineIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' })
])

const VolumeIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const ChartSquareIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
])
const submitting = ref(false)
const loading = ref(false)

// 选中的交易所
const selectedExchange = computed(() => {
  if (!formData.value.exchange_name) return null
  return availableExchanges.value.find(ex => ex.value === formData.value.exchange_name)
})

// 代币搜索
const tokenSearchQuery = ref('')
const tokenSearchResults = ref([])
const tokenSearching = ref(false)
const showTokenResults = ref(false)
const selectedToken = ref(null)
let searchTimeout = null

// 热门代币列表
const popularTokens = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC']

// 交易所相关
const selectedExchangeType = ref('')  // 选中的交易所类型

const formData = ref({
  name: '',
  description: '',
  exchange_name: '',  // 交易所名称（用于公开数据）
  token: null,
  trading_pair: 'USDT',
  timeframe: '1h',
  signal_type: 'price_alert',
  notify_email: true,
  notify_app: true,
  check_interval: '5m',
  use_advanced_analysis: false,  // 启用专业分析模式
  config: {}
})

// 可用的交易所列表（从后端获取）
const availableExchanges = ref([])

const errors = ref({})

const signalTypes = [
  { label: '价格提醒', value: 'price_alert', icon: PriceIcon },
  { label: 'RSI指标', value: 'rsi', icon: ChartBarIcon },
  { label: 'MA交叉', value: 'ma_crossover', icon: ChartLineIcon },
  { label: '布林带', value: 'bollinger', icon: TrendingUpIcon },
  { label: '成交量', value: 'volume', icon: VolumeIcon },
  { label: 'MACD', value: 'macd', icon: ChartLineIcon },
  { label: 'KDJ', value: 'kdj', icon: ChartSquareIcon }
]

// 检查间隔选项
const checkIntervals = [
  { label: '1分钟', value: '1m' },
  { label: '5分钟', value: '5m' },
  { label: '15分钟', value: '15m' },
  { label: '30分钟', value: '30m' },
  { label: '1小时', value: '1h' }
]

// 价格条件选项
const priceConditions = [
  { label: '价格高于', value: 'above' },
  { label: '价格低于', value: 'below' },
  { label: '向上突破', value: 'crosses_above' },
  { label: '向下突破', value: 'crosses_below' }
]

// 各种信号类型的配置
const priceAlertConfig = ref({
  condition: 'above',
  target_price: ''
})

const rsiConfig = ref({
  period: 14,
  overbought: 70,
  oversold: 30
})

const maCrossConfig = ref({
  fast: 7,
  slow: 25
})

const bollingerConfig = ref({
  period: 20,
  std: 2
})

const volumeConfig = ref({
  threshold: 2.0
})

const macdConfig = ref({
  fast: 12,
  slow: 26,
  signal: 9
})

const kdjConfig = ref({
  period: 9,
  overbought: 80,
  oversold: 20
})

// 提醒模式配置
const alertConfig = ref({
  mode: 'state_change',  // 默认：状态变化提醒
  cooldown_minutes: 30   // 默认：30分钟冷却
})

// 提醒模式选项
const alertModes = [
  {
    label: '一次提醒',
    value: 'one_shot',
    description: '条件首次满足时提醒一次，不重复。适合普通用户。',
    recommended: true
  },
  {
    label: '条件维持提醒',
    value: 'condition_sustain',
    description: '条件持续满足时，间隔一段时间提醒一次。适合短期交易者。',
    recommended: false
  },
  {
    label: '状态变化提醒',
    value: 'state_change',
    description: '只在信号状态变化时提醒。适合专业交易者和Bot系统。',
    recommended: false
  }
]

// 时间周期选项
const timeframes = [
  { label: '1分钟', value: '1m' },
  { label: '5分钟', value: '5m' },
  { label: '15分钟', value: '15m' },
  { label: '30分钟', value: '30m' },
  { label: '1小时', value: '1h' },
  { label: '4小时', value: '4h' },
  { label: '1天', value: '1d' }
]

// 处理图片加载错误
const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  e.target.style.display = 'none'
}

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) return '0.00'
  return numPrice.toFixed(2)
}

// 快捷百分比选项
const quickPercentages = [-20, -10, -5, 5, 10, 15, 20, 30, 50, 100]

// 格式化快捷价格
const formatQuickPrice = (currentPrice, percent) => {
  if (!currentPrice) return '0'
  const numPrice = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice
  if (isNaN(numPrice)) return '0'
  const targetPrice = numPrice * (1 + percent / 100)
  return targetPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

// 设置快捷价格
const setQuickPrice = (percent) => {
  if (!selectedToken.value || !selectedToken.value.current_price) {
    showError('无法获取当前价格')
    return
  }
  const currentPrice = parseFloat(selectedToken.value.current_price)
  const targetPrice = currentPrice * (1 + percent / 100)
  priceAlertConfig.value.target_price = targetPrice.toFixed(2)

  // 智能切换触发条件
  // 如果目标价格低于当前价格，自动切换到"价格低于"
  // 如果目标价格高于当前价格，自动切换到"价格高于"
  if (percent < 0) {
    priceAlertConfig.value.condition = 'below'
  } else if (percent > 0) {
    priceAlertConfig.value.condition = 'above'
  }
}

// 价格变化预览
const priceChangePreview = computed(() => {
  if (!priceAlertConfig.value.target_price || !selectedToken.value || !selectedToken.value.current_price) {
    return null
  }

  const target = parseFloat(priceAlertConfig.value.target_price)
  const current = parseFloat(selectedToken.value.current_price)

  if (isNaN(target) || isNaN(current) || current === 0) {
    return null
  }

  const diff = target - current
  const percent = ((diff / current) * 100).toFixed(2)
  const direction = diff > 0 ? 'up' : 'down'
  const directionText = diff > 0 ? '上涨' : '下跌'

  // 触发条件描述
  let triggerDescription = ''
  const condition = priceAlertConfig.value.condition
  const targetFormatted = target.toLocaleString('en-US', { maximumFractionDigits: 2 })

  // 检查逻辑错误
  let isLogicalError = false
  let errorMessage = ''

  if (condition === 'above') {
    triggerDescription = `当价格涨至 $${targetFormatted} 或以上时通知`
    if (target <= current) {
      isLogicalError = true
      errorMessage = `目标价格 ($${targetFormatted}) 低于或等于当前价格 ($${current.toLocaleString('en-US', { maximumFractionDigits: 2 })})，价格无法"高于"一个更低的值。建议选择"价格低于"或提高目标价格。`
    }
  } else if (condition === 'below') {
    triggerDescription = `当价格跌至 $${targetFormatted} 或以下时通知`
    if (target >= current) {
      isLogicalError = true
      errorMessage = `目标价格 ($${targetFormatted}) 高于或等于当前价格 ($${current.toLocaleString('en-US', { maximumFractionDigits: 2 })})，价格无法"低于"一个更高的值。建议选择"价格高于"或降低目标价格。`
    }
  } else if (condition === 'crosses_above') {
    triggerDescription = `当价格向上突破 $${targetFormatted} 时通知`
    if (target <= current) {
      isLogicalError = true
      errorMessage = `目标价格 ($${targetFormatted}) 低于或等于当前价格，无法"向上突破"。建议提高目标价格或选择"向下突破"。`
    }
  } else if (condition === 'crosses_below') {
    triggerDescription = `当价格向下跌破 $${targetFormatted} 时通知`
    if (target >= current) {
      isLogicalError = true
      errorMessage = `目标价格 ($${targetFormatted}) 高于或等于当前价格，无法"向下跌破"。建议降低目标价格或选择"向上突破"。`
    }
  }

  return {
    target,
    current,
    diff: Math.abs(diff),
    percent: parseFloat(percent),
    direction,
    directionText,
    targetFormatted: target.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    currentFormatted: current.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    diffFormatted: Math.abs(diff).toLocaleString('en-US', { maximumFractionDigits: 2 }),
    triggerDescription,
    isLogicalError,
    errorMessage
  }
})

// 可用的计价币种选项（排除与代币相同的）
const availableQuoteAssets = computed(() => {
  const allOptions = [
    { label: 'USDT', value: 'USDT' },
    { label: 'USDC', value: 'USDC' },
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' }
  ]

  // 如果没有选中代币，返回所有选项
  if (!selectedToken.value || !selectedToken.value.symbol) {
    return allOptions
  }

  // 过滤掉与代币符号相同的计价币种
  const tokenSymbol = selectedToken.value.symbol.toUpperCase()
  return allOptions.filter(option => option.value !== tokenSymbol)
})

// 选择交易所类型
const selectExchangeType = (exchangeType) => {
  selectedExchangeType.value = exchangeType
  formData.value.exchange_name = exchangeType

  // 清空代币选择
  formData.value.token = null
  tokenSearchQuery.value = ''
  tokenSearchResults.value = []
  selectedToken.value = null
  showTokenResults.value = false
}

// 监听代币变化，自动清除冲突的计价币种
watch(selectedToken, (newToken) => {
  if (newToken && newToken.symbol && formData.value.trading_pair) {
    const tokenSymbol = newToken.symbol.toUpperCase()
    if (tokenSymbol === formData.value.trading_pair) {
      // 如果当前计价币种与代币相同，自动切换到 USDT
      formData.value.trading_pair = 'USDT'
      showError(`已自动切换计价币种为 USDT，因为不能选择 ${tokenSymbol}/${tokenSymbol}`)
    }
  }
})

// 监听交易所变化，清空代币选择
watch(() => formData.value.exchange_name, (newExchange, oldExchange) => {
  // 只有在交易所真正改变时才清空（不是初始化）
  if (oldExchange && newExchange !== oldExchange) {
    // 清空代币选择
    formData.value.token = null
    tokenSearchQuery.value = ''
    tokenSearchResults.value = []
    showTokenResults.value = false
    console.log(`✅ 交易所已切换到 ${newExchange}，已清空代币选择`)
  }
})

// 代币搜索
const handleTokenSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  const query = tokenSearchQuery.value.trim()

  if (query.length < 1) {
    tokenSearchResults.value = []
    tokenSearching.value = false
    showTokenResults.value = false
    // 清空选择
    formData.value.token = null
    selectedToken.value = null
    return
  }

  // 检查是否选择了交易所
  if (!formData.value.exchange_name) {
    showError('请先选择交易所')
    return
  }

  // 用户正在输入，清空之前的选择
  formData.value.token = null
  selectedToken.value = null

  tokenSearching.value = true
  showTokenResults.value = true

  searchTimeout = setTimeout(async () => {
    try {
      // 添加交易所参数，只搜索该交易所支持的代币
      const response = await apiRequest(
        `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${query}&exchange=${formData.value.exchange_name}`
      )

      if (response.status === 'success') {
        tokenSearchResults.value = response.data.results || []

        // 如果没有搜索结果，显示提示
        if (tokenSearchResults.value.length === 0) {
          console.log(`⚠️ 在 ${formData.value.exchange_name} 上未找到 "${query}"`)
        }
      } else {
        tokenSearchResults.value = []
      }
    } catch (error) {
      console.error('搜索代币失败:', error)
      tokenSearchResults.value = []
      showError('搜索代币失败，请重试')
    } finally {
      tokenSearching.value = false
    }
  }, 300)
}

// 选择代币
const selectToken = (token) => {
  selectedToken.value = token
  formData.value.token = token.id  // 使用代币 ID 而不是 symbol
  tokenSearchQuery.value = `${token.symbol} - ${token.name}`
  showTokenResults.value = false
  tokenSearchResults.value = []
}

// 快捷选择热门代币
const quickSelectToken = async (symbol) => {
  // 检查是否选择了交易所
  if (!formData.value.exchange_name) {
    showError('请先选择交易所')
    return
  }

  tokenSearchQuery.value = symbol
  tokenSearching.value = true
  showTokenResults.value = true

  try {
    // 添加交易所参数
    const response = await apiRequest(
      `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${symbol}&exchange=${formData.value.exchange_name}`
    )

    if (response.status === 'success' && response.data.results && response.data.results.length > 0) {
      // 自动选择第一个匹配的代币
      const token = response.data.results[0]
      selectToken(token)
    } else {
      showError(`未找到代币 ${symbol}（该交易所不支持）`)
    }
  } catch (error) {
    console.error('搜索代币失败:', error)
    showError('搜索代币失败，请重试')
  } finally {
    tokenSearching.value = false
  }
}

// 自动生成机器人名称
const autoGeneratedName = computed(() => {
  const parts = []

  // 交易所名称
  if (selectedExchange.value) {
    parts.push(selectedExchange.value.label)  // 使用 label 而不是 exchange
  }

  // 代币符号
  if (selectedToken.value && selectedToken.value.symbol) {
    parts.push(selectedToken.value.symbol)
  }

  // 信号类型
  if (formData.value.signal_type) {
    const signalTypeLabels = {
      price_alert: '价格提醒',
      rsi: 'RSI指标',
      ma_crossover: 'MA交叉',
      bollinger: '布林带',
      volume: '成交量',
      macd: 'MACD',
      kdj: 'KDJ'
    }
    parts.push(signalTypeLabels[formData.value.signal_type] || formData.value.signal_type)
  }

  return parts.length > 0 ? parts.join(' - ') : '未命名信号机器人'
})

// 自动生成机器人描述
const autoGeneratedDescription = computed(() => {
  const parts = []

  // 基本信息
  if (selectedExchange.value && selectedToken.value && selectedToken.value.symbol) {
    parts.push(`监控 ${selectedExchange.value.label} 交易所的 ${selectedToken.value.symbol}/${formData.value.trading_pair || 'USDT'} 交易对`)
  }

  // 信号类型描述
  if (formData.value.signal_type === 'price_alert' && priceAlertConfig.value.target_price) {
    const conditionLabels = {
      above: '价格高于',
      below: '价格低于',
      crosses_above: '向上突破',
      crosses_below: '向下突破'
    }
    const condition = conditionLabels[priceAlertConfig.value.condition] || priceAlertConfig.value.condition
    parts.push(`当${condition} $${priceAlertConfig.value.target_price} 时触发通知`)
  } else if (formData.value.signal_type === 'rsi') {
    parts.push(`使用 RSI(${rsiConfig.value.period}) 指标，超买阈值 ${rsiConfig.value.overbought}，超卖阈值 ${rsiConfig.value.oversold}`)
  } else if (formData.value.signal_type === 'ma_crossover') {
    parts.push(`监控 MA(${maCrossConfig.value.fast}) 和 MA(${maCrossConfig.value.slow}) 交叉信号`)
  } else if (formData.value.signal_type === 'bollinger') {
    parts.push(`使用布林带(${bollingerConfig.value.period}, ${bollingerConfig.value.std}) 指标`)
  } else if (formData.value.signal_type === 'volume') {
    parts.push(`当成交量超过平均值 ${volumeConfig.value.threshold} 倍时触发`)
  } else if (formData.value.signal_type === 'macd') {
    parts.push(`使用 MACD(${macdConfig.value.fast}, ${macdConfig.value.slow}, ${macdConfig.value.signal}) 指标`)
  } else if (formData.value.signal_type === 'kdj') {
    parts.push(`使用 KDJ(${kdjConfig.value.period}) 指标，超买阈值 ${kdjConfig.value.overbought}，超卖阈值 ${kdjConfig.value.oversold}`)
  }

  // 检查间隔
  if (formData.value.check_interval) {
    const intervalLabels = {
      '1m': '每分钟',
      '5m': '每5分钟',
      '15m': '每15分钟',
      '30m': '每30分钟',
      '1h': '每小时'
    }
    parts.push(`${intervalLabels[formData.value.check_interval] || formData.value.check_interval}检查一次`)
  }

  return parts.length > 0 ? parts.join('，') : '暂无描述'
})

// 使用自动生成的名称
const useAutoGeneratedName = () => {
  formData.value.name = autoGeneratedName.value
}

// 使用自动生成的描述
const useAutoGeneratedDescription = () => {
  formData.value.description = autoGeneratedDescription.value
}

// 加载交易所列表和机器人数据
const loadData = async () => {
  try {
    loading.value = true

    // 加载支持的交易所列表
    const exchangesResponse = await exchangeAPI.getSupportedExchanges()
    if (exchangesResponse.success) {
      availableExchanges.value = exchangesResponse.data
      console.log('✅ 加载交易所列表成功:', availableExchanges.value)
    }

    // 如果是编辑模式，加载机器人数据
    if (isEditMode.value) {
      await loadBotData()
    }

  } catch (error) {
    console.error('加载数据失败:', error)
    showError('加载数据失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}

// 加载机器人数据（编辑模式）
const loadBotData = async () => {
  try {
    const response = await botAPI.getBotDetail(botId.value)
    console.log('API 响应:', response)

    // 处理不同的响应格式
    const bot = response.data || response
    console.log('加载的机器人数据:', bot)

    // 保存机器人运行状态
    isBotRunning.value = bot.is_running || bot.status === 'running'

    // 填充表单数据
    formData.value.name = bot.name || ''
    formData.value.description = bot.description || ''

    // 设置交易所（信号机器人只使用 exchange_name）
    if (bot.exchange_name) {
      formData.value.exchange_name = bot.exchange_name
      selectedExchangeType.value = bot.exchange_name
    }

    formData.value.token = typeof bot.token === 'object' ? bot.token.id : bot.token
    formData.value.trading_pair = bot.trading_pair || 'USDT'
    formData.value.timeframe = bot.timeframe || '1h'
    formData.value.signal_type = bot.signal_bot?.signal_type || bot.signal_type || 'price_alert'
    formData.value.notify_email = bot.signal_bot?.notify_email ?? true
    formData.value.notify_app = bot.signal_bot?.notify_app ?? true
    formData.value.check_interval = bot.signal_bot?.check_interval || '5m'

    // 设置选中的代币
    // 后端返回的 token 是 ID，需要使用 token_symbol 和 token_name 构建对象
    if (bot.token && bot.token_symbol) {
      selectedToken.value = {
        id: typeof bot.token === 'object' ? bot.token.id : bot.token,
        symbol: bot.token_symbol,
        name: bot.token_name,
        logo: bot.token_logo,
        current_price: bot.token_current_price || 0
      }
      tokenSearchQuery.value = `${bot.token_symbol} - ${bot.token_name}`
    }

    // 加载配置
    const config = bot.config || {}

    // 加载 AI 分析模式配置
    formData.value.use_advanced_analysis = config.use_advanced_analysis || false

    // 加载提醒模式和冷却时间
    alertConfig.value.mode = config.alert_mode || 'one_shot'
    alertConfig.value.cooldown_minutes = config.cooldown_minutes || 30

    if (formData.value.signal_type === 'price_alert') {
      // 从 config.price_alert 中读取价格提醒配置
      const priceAlert = config.price_alert || {}
      priceAlertConfig.value = {
        condition: priceAlert.condition || 'above',
        target_price: priceAlert.target_price || ''
      }
    } else if (formData.value.signal_type === 'rsi' && config.rsi) {
      rsiConfig.value = {
        period: config.rsi.period || 14,
        overbought: config.rsi.overbought || 70,
        oversold: config.rsi.oversold || 30
      }
    } else if (formData.value.signal_type === 'ma_crossover' && config.ma_cross) {
      maCrossConfig.value = {
        fast: config.ma_cross.fast || 7,
        slow: config.ma_cross.slow || 25
      }
    } else if (formData.value.signal_type === 'bollinger' && config.bollinger) {
      bollingerConfig.value = {
        period: config.bollinger.period || 20,
        std: config.bollinger.std || 2
      }
    } else if (formData.value.signal_type === 'volume' && config.volume) {
      volumeConfig.value = {
        threshold: config.volume.threshold || 2.0
      }
    } else if (formData.value.signal_type === 'macd' && config.macd) {
      macdConfig.value = {
        fast: config.macd.fast || 12,
        slow: config.macd.slow || 26,
        signal: config.macd.signal || 9
      }
    } else if (formData.value.signal_type === 'kdj' && config.kdj) {
      kdjConfig.value = {
        period: config.kdj.period || 9,
        overbought: config.kdj.overbought || 80,
        oversold: config.kdj.oversold || 20
      }
    }

    // 加载提醒模式配置
    alertConfig.value = {
      mode: config.alert_mode || 'state_change',
      cooldown_minutes: config.cooldown_minutes || 30
    }

    // 加载专业分析标志
    formData.value.use_advanced_analysis = config.use_advanced_analysis || false

  } catch (error) {
    console.error('加载机器人数据失败:', error)
    showError('加载机器人数据失败')
    router.push('/signal-bots')
  }
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = '请输入机器人名称'
  }

  if (!formData.value.exchange_name) {
    errors.value.exchange_name = '请选择交易所'
  }

  if (!formData.value.token) {
    errors.value.token = '请选择代币'
  }

  if (!formData.value.signal_type) {
    errors.value.signal_type = '请选择信号类型'
  }

  // 验证代币和计价币种不能相同
  if (selectedToken.value && selectedToken.value.symbol && formData.value.trading_pair) {
    if (selectedToken.value.symbol.toUpperCase() === formData.value.trading_pair.toUpperCase()) {
      errors.value.trading_pair = `代币和计价币种不能相同（${selectedToken.value.symbol}/${formData.value.trading_pair}）`
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('请填写所有必填项')
    return
  }

  try {
    submitting.value = true

    // 根据信号类型构建config
    let config = {
      use_advanced_analysis: formData.value.use_advanced_analysis,  // 添加专业分析标志
      alert_mode: alertConfig.value.mode,  // 提醒模式
      cooldown_minutes: alertConfig.value.cooldown_minutes  // 冷却时间
    }

    switch (formData.value.signal_type) {
      case 'price_alert':
        if (!priceAlertConfig.value.target_price) {
          showError('请输入目标价格')
          return
        }

        // 验证价格提醒逻辑
        if (priceChangePreview.value && priceChangePreview.value.isLogicalError) {
          showError(priceChangePreview.value.errorMessage)
          return
        }

        config = {
          ...config,  // 保留 use_advanced_analysis, alert_mode, cooldown_minutes
          signal_type: 'price_alert',
          price_alert: {
            condition: priceAlertConfig.value.condition,
            target_price: parseFloat(priceAlertConfig.value.target_price)
          }
        }
        break

      case 'rsi':
        config = {
          ...config,
          signal_type: 'rsi',
          rsi: {
            enabled: true,
            period: parseInt(rsiConfig.value.period) || 14,
            overbought: parseInt(rsiConfig.value.overbought) || 70,
            oversold: parseInt(rsiConfig.value.oversold) || 30
          }
        }
        break

      case 'ma_crossover':
        config = {
          ...config,
          signal_type: 'ma_crossover',
          ma_cross: {
            enabled: true,
            fast: parseInt(maCrossConfig.value.fast) || 7,
            slow: parseInt(maCrossConfig.value.slow) || 25
          }
        }
        break

      case 'bollinger':
        config = {
          ...config,
          signal_type: 'bollinger',
          bollinger: {
            enabled: true,
            period: parseInt(bollingerConfig.value.period) || 20,
            std: parseFloat(bollingerConfig.value.std) || 2
          }
        }
        break

      case 'volume':
        config = {
          ...config,
          signal_type: 'volume',
          volume: {
            enabled: true,
            threshold: parseFloat(volumeConfig.value.threshold) || 2.0
          }
        }
        break

      case 'macd':
        config = {
          ...config,
          signal_type: 'macd',
          macd: {
            enabled: true,
            fast: parseInt(macdConfig.value.fast) || 12,
            slow: parseInt(macdConfig.value.slow) || 26,
            signal: parseInt(macdConfig.value.signal) || 9
          }
        }
        break

      case 'kdj':
        config = {
          ...config,
          signal_type: 'kdj',
          kdj: {
            enabled: true,
            period: parseInt(kdjConfig.value.period) || 9,
            overbought: parseInt(kdjConfig.value.overbought) || 80,
            oversold: parseInt(kdjConfig.value.oversold) || 20
          }
        }
        break
    }

    // 准备提交数据
    const submitData = {
      name: formData.value.name,
      description: formData.value.description,
      token: formData.value.token,
      exchange_name: formData.value.exchange_name,  // 交易所名称（信号机器人只需要这个）
      trading_pair: formData.value.trading_pair,
      timeframe: formData.value.timeframe,
      signal_type: formData.value.signal_type,
      notify_email: formData.value.notify_email,
      notify_app: formData.value.notify_app,
      check_interval: formData.value.check_interval,
      config: config,
      bot_type: 'signal'
    }

    console.log('提交数据:', submitData)

    if (isEditMode.value) {
      // 编辑模式：更新机器人
      const response = await botAPI.updateBot(botId.value, submitData)
      console.log('更新响应:', response)
      showSuccess('信号机器人更新成功')
    } else {
      // 创建模式：创建新机器人
      const response = await botAPI.createBot(submitData)
      console.log('创建响应:', response)
      showSuccess('信号机器人创建成功')
    }

    router.push('/signal-bots')
  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '创建失败:', error)
    console.error('错误详情:', error.data)

    // 构建详细的错误信息
    let errorMessage = error.message || (isEditMode.value ? '更新失败' : '创建失败')

    // 如果有验证错误，显示详细信息
    if (error.data && error.data.errors) {
      const errorDetails = Object.entries(error.data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n')
      errorMessage = `${error.data.error || '验证失败'}\n${errorDetails}`
    }

    showError(errorMessage)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

// 页面加载时获取数据
// 点击外部关闭搜索结果
const handleClickOutside = (event) => {
  const searchContainer = event.target.closest('.token-search-container')
  if (!searchContainer) {
    showTokenResults.value = false
  }
}

onMounted(() => {
  loadData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
