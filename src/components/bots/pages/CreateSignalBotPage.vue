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
                <!-- 第一级：选择交易所类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    交易所类型 <span class="text-red-500">*</span>
                    <span class="text-xs text-slate-500 ml-2">选择要监控的交易所</span>
                  </label>

                  <!-- 交易所类型列表 -->
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

                <!-- 第二级：选择交易所账号（可选） -->
                <div v-if="selectedExchangeType">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    交易所账号
                    <span class="text-xs text-slate-500 ml-2">
                      可选 - 选择账号可获取实时价格，不选择则使用公开数据
                    </span>
                  </label>

                  <!-- 如果有该交易所的账号 -->
                  <div v-if="filteredExchangeAPIs.length > 0" class="space-y-2">
                    <!-- 不使用账号选项 -->
                    <button
                      type="button"
                      @click="selectExchangeAPI(null)"
                      :class="[
                        'w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all text-left',
                        formData.exchange_api === null && selectedExchangeType
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div class="font-medium text-slate-900">使用公开数据</div>
                          <div class="text-xs text-slate-500">不需要 API 密钥，使用交易所公开价格数据</div>
                        </div>
                      </div>
                      <svg
                        v-if="formData.exchange_api === null && selectedExchangeType"
                        class="h-5 w-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </button>

                    <!-- 账号列表 -->
                    <button
                      v-for="api in filteredExchangeAPIs"
                      :key="api.id"
                      type="button"
                      @click="selectExchangeAPI(api.id)"
                      :class="[
                        'w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all text-left',
                        formData.exchange_api === api.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <img
                          :src="getExchangeLogo(api.exchange)"
                          :alt="api.exchange"
                          class="w-10 h-10 rounded-lg object-contain"
                          @error="handleImageError"
                        />
                        <div>
                          <div class="font-medium text-slate-900">{{ api.name || getExchangeLabel(api.exchange) }}</div>
                          <div class="text-xs text-slate-500">
                            {{ api.is_testnet ? '测试网' : '主网' }} •
                            余额: {{ getBalanceDisplay(api) }}
                          </div>
                        </div>
                      </div>
                      <svg
                        v-if="formData.exchange_api === api.id"
                        class="h-5 w-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <!-- 如果没有该交易所的账号，显示"使用公开数据"选项 -->
                  <div v-else class="space-y-2">
                    <!-- 使用公开数据选项（默认选中） -->
                    <button
                      type="button"
                      @click="selectExchangeAPI(null)"
                      class="w-full flex items-center justify-between p-4 border-2 border-blue-500 bg-blue-50 rounded-xl transition-all text-left"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div class="font-medium text-slate-900">使用公开数据</div>
                          <div class="text-xs text-slate-500">不需要 API 密钥，使用交易所公开价格数据</div>
                        </div>
                      </div>
                      <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </button>

                    <!-- 添加账号提示 -->
                    <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-600">
                          如需使用账号数据，可以添加 {{ selectedExchange?.label }} API
                        </div>
                        <button
                          type="button"
                          @click="goToExchangeSettings"
                          class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          添加账号
                        </button>
                      </div>
                    </div>
                  </div>
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
                      <span v-if="selectedToken" class="text-sm text-slate-600">
                        当前价格 ${{ formatPrice(selectedToken.current_price) }}
                      </span>
                    </div>
                    <Input
                      v-model="priceAlertConfig.target_price"
                      type="number"
                      placeholder="例如: 95000"
                      step="0.00000001"
                    />
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
                <p class="text-sm text-slate-500">选择接收信号通知的方式</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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

// 交易所账号相关
const selectedExchangeType = ref('')  // 选中的交易所类型
const exchangeAPIs = ref([])  // 所有交易所账号
const filteredExchangeAPIs = computed(() => {
  if (!selectedExchangeType.value) return []
  return exchangeAPIs.value.filter(api => api.exchange === selectedExchangeType.value)
})

const formData = ref({
  name: '',
  description: '',
  exchange_name: '',  // 交易所名称（用于公开数据）
  exchange_api: null,  // 交易所账号 ID（可选，用于账号数据）
  token: null,
  trading_pair: 'USDT',
  timeframe: '1h',
  signal_type: 'price_alert',
  notify_email: true,
  notify_app: true,
  check_interval: '5m',
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

  // 如果该交易所没有账号，自动选择使用公开数据
  if (filteredExchangeAPIs.value.length === 0) {
    formData.value.exchange_api = null
  }

  // 清空代币选择
  formData.value.token = null
  tokenSearchQuery.value = ''
  tokenSearchResults.value = []
  selectedToken.value = null
  showTokenResults.value = false
}

// 选择交易所账号
const selectExchangeAPI = (apiId) => {
  formData.value.exchange_api = apiId
}

// 跳转到交易所设置
const goToExchangeSettings = () => {
  router.push('/settings/exchanges')
}

// 获取交易所 Logo（从 availableExchanges 中查找）
const getExchangeLogo = (exchange) => {
  const exchangeData = availableExchanges.value.find(ex => ex.value === exchange)
  return exchangeData?.logo || '/dex/gate.png'
}

// 获取交易所标签（从 availableExchanges 中查找）
const getExchangeLabel = (exchange) => {
  const exchangeData = availableExchanges.value.find(ex => ex.value === exchange)
  return exchangeData?.label || exchange
}

// 获取余额显示（从 balance_snapshot 中提取）
const getBalanceDisplay = (api) => {
  if (!api.balance_snapshot || Object.keys(api.balance_snapshot).length === 0) {
    return '-'
  }

  // 如果有 total_usd 字段，直接显示总价值
  if (api.balance_snapshot.total_usd !== undefined) {
    return `$${Number(api.balance_snapshot.total_usd).toFixed(2)}`
  }

  // 否则尝试从 spot 中获取 USDT 余额
  if (api.balance_snapshot.spot?.USDT) {
    const usdtBalance = api.balance_snapshot.spot.USDT.total || api.balance_snapshot.spot.USDT.free || api.balance_snapshot.spot.USDT
    return `${Number(usdtBalance).toFixed(2)} USDT`
  }

  // 如果没有 spot，尝试直接获取 USDT
  if (api.balance_snapshot.USDT) {
    return `${Number(api.balance_snapshot.USDT).toFixed(2)} USDT`
  }

  return '-'
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

    // 加载用户的交易所账号
    try {
      const apisResponse = await exchangeAPI.getExchangeList()
      if (apisResponse.success) {
        exchangeAPIs.value = apisResponse.data || []
        console.log('✅ 加载交易所账号成功:', exchangeAPIs.value.length, '个账号')
      }
    } catch (error) {
      console.error('加载交易所账号失败:', error)
      // 不影响主流程，继续执行
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

    // 设置交易所类型和账号
    if (bot.exchange_api) {
      // 如果有关联的交易所账号
      const apiId = typeof bot.exchange_api === 'object' ? bot.exchange_api.id : bot.exchange_api
      const exchange = typeof bot.exchange_api === 'object' ? bot.exchange_api.exchange : bot.exchange_name
      formData.value.exchange_api = apiId
      formData.value.exchange_name = exchange
      selectedExchangeType.value = exchange
    } else if (bot.exchange_name) {
      // 如果只有交易所名称（使用公开数据）
      formData.value.exchange_name = bot.exchange_name
      formData.value.exchange_api = null
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

    if (formData.value.signal_type === 'price_alert') {
      priceAlertConfig.value = {
        condition: config.condition || 'above',
        target_price: config.target_price || ''
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
    let config = {}

    switch (formData.value.signal_type) {
      case 'price_alert':
        if (!priceAlertConfig.value.target_price) {
          showError('请输入目标价格')
          return
        }
        config = {
          signal_type: 'price_alert',
          condition: priceAlertConfig.value.condition,
          target_price: parseFloat(priceAlertConfig.value.target_price)
        }
        break

      case 'rsi':
        config = {
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
          ma_cross: {
            enabled: true,
            fast: parseInt(maCrossConfig.value.fast) || 7,
            slow: parseInt(maCrossConfig.value.slow) || 25
          }
        }
        break

      case 'bollinger':
        config = {
          bollinger: {
            enabled: true,
            period: parseInt(bollingerConfig.value.period) || 20,
            std: parseFloat(bollingerConfig.value.std) || 2
          }
        }
        break

      case 'volume':
        config = {
          volume: {
            enabled: true,
            threshold: parseFloat(volumeConfig.value.threshold) || 2.0
          }
        }
        break

      case 'macd':
        config = {
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
      exchange_name: formData.value.exchange_name,  // 交易所名称（必填）
      exchange_api: formData.value.exchange_api,  // 交易所账号 ID（可选）
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
