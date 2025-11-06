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
                <h1 class="text-3xl font-bold text-slate-900">{{ isEditMode ? '编辑趋势跟踪机器人' : '创建趋势跟踪机器人' }}</h1>
                <p class="text-slate-600 mt-1">配置自动交易策略和风险管理</p>
              </div>
            </div>
          </div>

          <!-- 交易配置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">交易配置</h2>
                <p class="text-sm text-slate-500">选择交易所 API、交易对和时间周期</p>
              </div>
            </div>
            <div class="space-y-6">
              <!-- 交易所 API 选择 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  交易所 API <span class="text-red-500">*</span>
                  <span class="text-xs text-slate-500 ml-2">选择已绑定的交易所 API（需要交易权限）</span>
                </label>

                <!-- 交易所 API 列表 -->
                <div v-if="exchangeAPIs.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <button
                    v-for="api in exchangeAPIs"
                    :key="api.id"
                    type="button"
                    @click="selectExchangeAPI(api)"
                    :class="[
                      'flex items-center gap-4 p-4 border-2 rounded-xl transition-all text-left',
                      formData.exchange_api === api.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    ]"
                  >
                    <img
                      :src="getExchangeLogo(api.exchange)"
                      :alt="api.exchange"
                      class="w-12 h-12 rounded-lg object-contain"
                      @error="handleImageError"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900">
                        {{ getExchangeLabel(api.exchange) }}
                      </div>
                      <div class="text-sm text-slate-500">
                        {{ api.api_name || api.exchange }}
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <span :class="[
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          api.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        ]">
                          {{ api.status === 'active' ? '可用' : '不可用' }}
                        </span>
                        <span v-if="api.permissions?.trade" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          交易权限
                        </span>
                      </div>
                    </div>
                    <svg
                      v-if="formData.exchange_api === api.id"
                      class="h-5 w-5 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>

                <!-- 无交易所 API 提示 -->
                <div v-else class="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center">
                  <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p class="mt-2 text-sm text-slate-600">您还没有绑定交易所 API</p>
                  <button
                    @click="goToExchangeSettings"
                    class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    去绑定交易所
                  </button>
                </div>
                <p v-if="errors.exchange_api" class="mt-1 text-sm text-red-500">{{ errors.exchange_api }}</p>
              </div>

              <!-- 代币和计价币种 -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- 代币搜索 -->
                <div class="md:col-span-3 token-search-container">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    代币 <span class="text-red-500">*</span>
                    <span v-if="!selectedExchangeAPI" class="text-xs text-orange-500 ml-2">请先选择交易所 API</span>
                    <span v-else class="text-xs text-slate-500 ml-2">只显示 {{ getExchangeLabel(selectedExchangeAPI.exchange) }} 支持的代币</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="tokenSearchQuery"
                      @input="handleTokenSearch"
                      @focus="showTokenResults = true"
                      type="text"
                      :placeholder="selectedExchangeAPI ? '搜索代币 (如: BTC, ETH)' : '请先选择交易所 API'"
                      :disabled="!selectedExchangeAPI"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <div
                      v-if="showTokenResults"
                      v-click-outside="() => showTokenResults = false"
                      class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                      <div v-if="searchingTokens" class="p-4 text-center text-slate-500">
                        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <p class="mt-2 text-sm">搜索中...</p>
                      </div>
                      <div v-else-if="tokenSearchResults.length === 0" class="p-4 text-center text-slate-500">
                        <p class="text-sm">{{ tokenSearchQuery ? '未找到匹配的代币' : '请输入代币名称或符号' }}</p>
                      </div>
                      <div v-else>
                        <button
                          v-for="token in tokenSearchResults"
                          :key="token.id"
                          type="button"
                          @click="selectToken(token)"
                          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <img
                            :src="token.logo"
                            :alt="token.symbol"
                            class="w-8 h-8 rounded-full"
                            @error="handleImageError"
                          />
                          <div class="flex-1">
                            <div class="font-medium text-slate-900">{{ token.symbol }}</div>
                            <div class="text-sm text-slate-500">{{ token.name }}</div>
                          </div>
                          <div class="text-right">
                            <div class="text-sm font-medium text-slate-900">${{ formatPrice(token.current_price) }}</div>
                            <div :class="[
                              'text-xs',
                              token.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                            ]">
                              {{ token.price_change_24h >= 0 ? '+' : '' }}{{ token.price_change_24h?.toFixed(2) }}%
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p v-if="errors.token" class="mt-1 text-sm text-red-500">{{ errors.token }}</p>
                  
                  <!-- 已选择的代币 -->
                  <div v-if="selectedToken" class="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <img
                      :src="selectedToken.logo"
                      :alt="selectedToken.symbol"
                      class="w-10 h-10 rounded-full"
                      @error="handleImageError"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900">{{ selectedToken.symbol }}</div>
                      <div class="text-sm text-slate-500">{{ selectedToken.name }}</div>
                    </div>
                    <button
                      @click="clearToken"
                      class="text-slate-400 hover:text-slate-600"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 计价币种 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    计价币种 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.trading_pair"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>

              <!-- 时间周期 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  时间周期 <span class="text-red-500">*</span>
                  <span class="text-xs text-slate-500 ml-2">选择交易策略的时间周期</span>
                </label>
                <div class="grid grid-cols-4 md:grid-cols-8 gap-3">
                  <button
                    v-for="tf in timeframeOptions"
                    :key="tf.value"
                    type="button"
                    @click="formData.timeframe = tf.value"
                    :class="[
                      'px-4 py-2.5 border-2 rounded-lg font-medium transition-all',
                      formData.timeframe === tf.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    ]"
                  >
                    {{ tf.label }}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <!-- 风险管理 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">风险管理</h2>
                <p class="text-sm text-slate-500">设置止损、止盈和头寸管理</p>
              </div>
            </div>
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- 最大头寸大小 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    最大头寸大小 (USDT) <span class="text-red-500">*</span>
                    <span class="text-xs text-slate-500 ml-2">单次交易的最大金额</span>
                  </label>
                  <input
                    v-model.number="formData.max_position_size"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors.max_position_size" class="mt-1 text-sm text-red-500">{{ errors.max_position_size }}</p>
                </div>

                <!-- 杠杆倍数 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    杠杆倍数 <span class="text-red-500">*</span>
                    <span class="text-xs text-slate-500 ml-2">1-125倍</span>
                  </label>
                  <input
                    v-model.number="formData.leverage"
                    type="number"
                    step="1"
                    min="1"
                    max="125"
                    placeholder="1"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors.leverage" class="mt-1 text-sm text-red-500">{{ errors.leverage }}</p>
                  <p class="mt-1 text-xs text-slate-500">
                    实际可用杠杆取决于交易所限制
                  </p>
                </div>

                <!-- 止损百分比 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    止损百分比 (%) <span class="text-red-500">*</span>
                    <span class="text-xs text-slate-500 ml-2">触发止损的价格跌幅</span>
                  </label>
                  <input
                    v-model.number="formData.stop_loss_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="5"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors.stop_loss_percentage" class="mt-1 text-sm text-red-500">{{ errors.stop_loss_percentage }}</p>
                </div>

                <!-- 止盈模式选择 -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-3">
                    止盈模式
                  </label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="takeProfitMode"
                        type="radio"
                        value="single"
                        class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span class="text-sm text-slate-700">单一止盈</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="takeProfitMode"
                        type="radio"
                        value="multiple"
                        class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span class="text-sm text-slate-700">多级止盈</span>
                    </label>
                  </div>
                </div>

                <!-- 单一止盈 -->
                <div v-if="takeProfitMode === 'single'" class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    止盈百分比 (%)
                    <span class="text-xs text-slate-500 ml-2">触发止盈的价格涨幅</span>
                  </label>
                  <input
                    v-model.number="formData.take_profit_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1000"
                    placeholder="10"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- 多级止盈 -->
                <div v-if="takeProfitMode === 'multiple'" class="md:col-span-2">
                  <div class="flex items-center justify-between mb-3">
                    <label class="block text-sm font-medium text-slate-700">
                      多级止盈目标
                      <span class="text-xs text-slate-500 ml-2">设置多个止盈点，分批平仓</span>
                    </label>
                    <button
                      @click="addTakeProfitTarget"
                      type="button"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      添加目标
                    </button>
                  </div>

                  <!-- 止盈目标列表 -->
                  <div class="space-y-3">
                    <div
                      v-for="(target, index) in formData.take_profit_targets"
                      :key="index"
                      class="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-xs text-slate-600 mb-1">止盈百分比 (%)</label>
                          <input
                            v-model.number="target.percentage"
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="如: 5"
                            class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label class="block text-xs text-slate-600 mb-1">平仓比例 (%)</label>
                          <input
                            v-model.number="target.position_percentage"
                            type="number"
                            step="1"
                            min="1"
                            max="100"
                            placeholder="如: 50"
                            class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <button
                        @click="removeTakeProfitTarget(index)"
                        type="button"
                        class="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <!-- 空状态 -->
                    <div v-if="formData.take_profit_targets.length === 0" class="text-center py-8 text-slate-500">
                      <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p class="mt-2 text-sm">暂无止盈目标，点击"添加目标"按钮添加</p>
                    </div>

                    <!-- 总平仓比例提示 -->
                    <div v-if="formData.take_profit_targets.length > 0" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span class="text-sm text-slate-700">总平仓比例</span>
                      <span :class="[
                        'text-sm font-medium',
                        totalClosePercentage === 100 ? 'text-green-600' : totalClosePercentage > 100 ? 'text-red-600' : 'text-orange-600'
                      ]">
                        {{ totalClosePercentage }}%
                        <span v-if="totalClosePercentage !== 100" class="text-xs ml-1">
                          {{ totalClosePercentage > 100 ? '(超过100%)' : '(建议设置为100%)' }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 追踪止损 -->
                <div>
                  <label class="flex items-center gap-2 mb-3">
                    <input
                      v-model="formData.trailing_stop_enabled"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span class="text-sm font-medium text-slate-700">启用追踪止损</span>
                    <span class="text-xs text-slate-500">价格上涨时自动调整止损位</span>
                  </label>
                  <div v-if="formData.trailing_stop_enabled" class="space-y-3">
                    <input
                      v-model.number="formData.trailing_stop_trigger"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="触发百分比 (如: 5)"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      v-model.number="formData.trailing_stop_distance"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="追踪距离 (如: 2)"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <!-- 盈亏平衡 -->
              <div class="border-t border-slate-200 pt-6">
                <label class="flex items-center gap-2 mb-3">
                  <input
                    v-model="formData.breakeven_enabled"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-slate-700">启用盈亏平衡</span>
                  <span class="text-xs text-slate-500">盈利达到一定比例后将止损移至成本价</span>
                </label>
                <div v-if="formData.breakeven_enabled" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    v-model.number="formData.breakeven_trigger"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="触发百分比 (如: 3)"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    v-model.number="formData.breakeven_offset"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="偏移量 (如: 0.5)"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          <!-- 高级配置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">高级配置</h2>
                <p class="text-sm text-slate-500">订单类型和执行参数</p>
              </div>
            </div>
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- 入场订单类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    入场订单类型 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.entry_order_type"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="market">市价单 - 立即成交</option>
                    <option value="limit">限价单 - 指定价格</option>
                  </select>
                </div>

                <!-- 出场订单类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    出场订单类型 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.exit_order_type"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="market">市价单 - 立即成交</option>
                    <option value="limit">限价单 - 指定价格</option>
                  </select>
                </div>

                <!-- 金额类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    金额类型
                  </label>
                  <select
                    v-model="formData.amount_type"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fixed">固定金额</option>
                    <option value="percentage">账户百分比</option>
                  </select>
                </div>

                <!-- 金额值 -->
                <div v-if="formData.amount_type === 'percentage'">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    账户百分比 (%)
                    <span class="text-xs text-slate-500 ml-2">使用账户余额的百分比</span>
                  </label>
                  <input
                    v-model.number="formData.amount_value"
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    placeholder="10"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- 限价单偏移 -->
                <div v-if="formData.entry_order_type === 'limit' || formData.exit_order_type === 'limit'" class="md:col-span-4">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    限价单偏移 (%)
                    <span class="text-xs text-slate-500 ml-2">相对市价的偏移百分比</span>
                  </label>
                  <input
                    v-model.number="formData.limit_price_offset"
                    type="number"
                    step="0.01"
                    placeholder="0.1"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          <!-- 机器人信息（可选） -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">机器人信息</h2>
                <p class="text-sm text-slate-500">自定义名称和描述（可选）</p>
              </div>
            </div>
            <div class="space-y-4">
              <!-- 机器人名称 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  机器人名称
                  <span class="text-xs text-slate-500 ml-2">留空将自动生成</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  :placeholder="autoGeneratedName || '未命名趋势跟踪机器人'"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- 机器人描述 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  机器人描述
                  <span class="text-xs text-slate-500 ml-2">留空将自动生成</span>
                </label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  placeholder="描述机器人的交易策略和目标..."
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
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
                    {{ autoGeneratedName || formData.name || '未命名趋势跟踪机器人' }}
                  </div>
                </div>

                <!-- 交易配置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">交易配置</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易所</span>
                      <span class="font-medium text-slate-900">
                        {{ selectedExchangeAPI?.exchange_name || '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易对</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.token?.symbol ? `${formData.token.symbol}/${formData.quote_currency || 'USDT'}` : '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">时间周期</span>
                      <span class="font-medium text-slate-900">
                        {{ timeframeOptions?.find(t => t.value === formData.timeframe)?.label || '-' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 风险管理 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">风险管理</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最大头寸</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_position_size ? `${formData.max_position_size} USDT` : '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">杠杆倍数</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.leverage || 1 }}x
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">止损</span>
                      <span class="font-medium text-red-600">
                        {{ formData.stop_loss ? `${formData.stop_loss}%` : '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">止盈模式</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.take_profit_mode === 'single' ? '单一止盈' : '多级止盈' }}
                      </span>
                    </div>
                    <div v-if="formData.take_profit_mode === 'single'" class="flex justify-between text-xs">
                      <span class="text-slate-500">止盈</span>
                      <span class="font-medium text-green-600">
                        {{ formData.take_profit ? `${formData.take_profit}%` : '-' }}
                      </span>
                    </div>
                    <div v-if="formData.take_profit_mode === 'multiple' && formData.take_profit_targets.length > 0" class="mt-2">
                      <div class="text-xs text-slate-500 mb-2">止盈目标</div>
                      <div class="space-y-1">
                        <div v-for="(target, index) in formData.take_profit_targets" :key="index" class="flex justify-between text-xs bg-slate-50 px-2 py-1 rounded">
                          <span class="text-slate-600">目标 {{ index + 1 }}</span>
                          <span class="font-medium text-green-600">{{ target.percentage }}% ({{ target.position_percentage }}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 追踪止损 -->
                <div v-if="formData.trailing_stop_enabled" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">追踪止损</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">激活百分比</span>
                      <span class="font-medium text-slate-900">{{ formData.trailing_stop_activation }}%</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">回撤百分比</span>
                      <span class="font-medium text-slate-900">{{ formData.trailing_stop_callback }}%</span>
                    </div>
                  </div>
                </div>

                <!-- 盈亏平衡 -->
                <div v-if="formData.breakeven_enabled" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">盈亏平衡</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">触发百分比</span>
                      <span class="font-medium text-slate-900">{{ formData.breakeven_trigger }}%</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">偏移量</span>
                      <span class="font-medium text-slate-900">{{ formData.breakeven_offset }}%</span>
                    </div>
                  </div>
                </div>

                <!-- 高级配置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">高级配置</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">入场订单</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.entry_order_type === 'market' ? '市价单' : '限价单' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">出场订单</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.exit_order_type === 'market' ? '市价单' : '限价单' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">金额类型</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.amount_type === 'fixed' ? '固定金额' : '账户百分比' }}
                      </span>
                    </div>
                    <div v-if="formData.amount_type === 'percentage'" class="flex justify-between text-xs">
                      <span class="text-slate-500">账户百分比</span>
                      <span class="font-medium text-slate-900">{{ formData.amount_value }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button
                  @click="handleSubmit"
                  :disabled="submitting || !isFormValid"
                  class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="submitting" class="flex items-center justify-center gap-2">
                    <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {{ isEditMode ? '保存中...' : '创建中...' }}
                  </span>
                  <span v-else>{{ isEditMode ? '保存修改' : '创建机器人' }}</span>
                </button>
                <button
                  @click="handleCancel"
                  class="flex-1 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import Card from '../../common/ui/Card.vue'
import { botAPI, exchangeAPI, apiRequest, API_ENDPOINTS } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const loading = ref(false)

// 编辑模式
const isEditMode = computed(() => !!route.params.id)
const botId = computed(() => route.params.id)

// 表单数据 - 趋势跟踪机器人专用
const formData = ref({
  name: '',
  description: '',
  bot_type: 'trend_following',
  exchange_api: null,  // 交易所 API ID
  token: null,
  trading_pair: 'USDT',
  timeframe: '1h',
  // 风险管理
  max_position_size: 100,
  leverage: 1,  // 杠杆倍数
  stop_loss_percentage: 5,
  take_profit_percentage: 10,
  take_profit_targets: [],
  trailing_stop_enabled: false,
  trailing_stop_trigger: null,
  trailing_stop_distance: null,
  breakeven_enabled: false,
  breakeven_trigger: null,
  breakeven_offset: 0.5,
  // 订单配置
  entry_order_type: 'market',
  exit_order_type: 'market',
  limit_price_offset: null,
  amount_type: 'fixed',
  amount_value: null,
  config: {}
})

const errors = ref({})

// 交易所 API 列表
const exchangeAPIs = ref([])
const selectedExchangeAPI = ref(null)

// 代币搜索
const tokenSearchQuery = ref('')
const tokenSearchResults = ref([])
const searchingTokens = ref(false)
const showTokenResults = ref(false)
const selectedToken = ref(null)
let searchTimeout = null

// 时间周期选项
const timeframeOptions = [
  { label: '1分钟', value: '1m' },
  { label: '5分钟', value: '5m' },
  { label: '15分钟', value: '15m' },
  { label: '30分钟', value: '30m' },
  { label: '1小时', value: '1h' },
  { label: '4小时', value: '4h' },
  { label: '1天', value: '1d' }
]

// 止盈模式
const takeProfitMode = ref('single')  // 'single' 或 'multiple'

// 计算总平仓比例
const totalClosePercentage = computed(() => {
  return formData.value.take_profit_targets.reduce((sum, target) => {
    return sum + (target.position_percentage || 0)
  }, 0)
})

// 添加止盈目标
const addTakeProfitTarget = () => {
  formData.value.take_profit_targets.push({
    percentage: null,
    position_percentage: null,
    executed: false
  })
}

// 移除止盈目标
const removeTakeProfitTarget = (index) => {
  formData.value.take_profit_targets.splice(index, 1)
}

// 自动生成的名称
const autoGeneratedName = computed(() => {
  if (!selectedToken.value || !formData.value.timeframe) {
    return ''
  }
  const tokenSymbol = selectedToken.value.symbol
  const tradingPair = formData.value.trading_pair
  const timeframe = timeframeOptions.find(t => t.value === formData.value.timeframe)?.label || formData.value.timeframe
  return `${tokenSymbol}/${tradingPair} ${timeframe} 趋势跟踪`
})

// 表单验证
const isFormValid = computed(() => {
  return formData.value.exchange_api &&
         formData.value.token &&
         formData.value.max_position_size > 0 &&
         formData.value.stop_loss_percentage > 0
})

// 加载交易所 API 列表
const loadExchangeAPIs = async () => {
  try {
    const response = await exchangeAPI.getExchangeList()
    console.log('所有交易所 API:', response.data)
    // 只显示激活状态的 API（暂时不强制要求交易权限，因为可能权限字段未设置）
    exchangeAPIs.value = response.data.filter(api => api.status === 'active')
    console.log('过滤后的交易所 API:', exchangeAPIs.value)
  } catch (error) {
    console.error('加载交易所 API 失败:', error)
    showError('加载交易所 API 失败')
  }
}

// 选择交易所 API
const selectExchangeAPI = (api) => {
  formData.value.exchange_api = api.id
  selectedExchangeAPI.value = api
  // 清空代币选择，因为不同交易所支持的代币不同
  clearToken()
}

// 跳转到交易所设置
const goToExchangeSettings = () => {
  router.push('/settings/exchanges')
}

// 获取交易所 Logo
const getExchangeLogo = (exchange) => {
  const logos = {
    binance: '/dex/binance.png',
    okx: '/dex/okx.png',
    bybit: '/dex/bybit.png',
    gateio: '/dex/gate.png',
    gate: '/dex/gate.png'
  }
  return logos[exchange] || '/dex/gate.png'
}

// 获取交易所标签
const getExchangeLabel = (exchange) => {
  const labels = {
    binance: 'Binance',
    okx: 'OKX',
    bybit: 'Bybit',
    gateio: 'Gate.io',
    gate: 'Gate.io'  // gate 和 gateio 都显示为 Gate.io
  }
  return labels[exchange] || exchange
}

// 代币搜索
const handleTokenSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!selectedExchangeAPI.value) {
    showError('请先选择交易所 API')
    return
  }

  searchTimeout = setTimeout(async () => {
    if (!tokenSearchQuery.value || tokenSearchQuery.value.length < 1) {
      tokenSearchResults.value = []
      return
    }

    try {
      searchingTokens.value = true
      const response = await apiRequest(
        `${API_ENDPOINTS.TOKEN_SEARCH}?q=${encodeURIComponent(tokenSearchQuery.value)}&exchange=${selectedExchangeAPI.value.exchange}`
      )
      tokenSearchResults.value = response.data || []
    } catch (error) {
      console.error('搜索代币失败:', error)
      showError('搜索代币失败')
    } finally {
      searchingTokens.value = false
    }
  }, 300)
}

// 选择代币
const selectToken = (token) => {
  selectedToken.value = token
  formData.value.token = token.id
  tokenSearchQuery.value = token.symbol
  showTokenResults.value = false
}

// 清空代币选择
const clearToken = () => {
  selectedToken.value = null
  formData.value.token = null
  tokenSearchQuery.value = ''
  tokenSearchResults.value = []
}

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  if (price >= 1) return price.toFixed(2)
  if (price >= 0.01) return price.toFixed(4)
  return price.toFixed(8)
}

// 图片加载错误处理
const handleImageError = (e) => {
  // 防止重复触发
  if (e.target.dataset.errorHandled) return
  e.target.dataset.errorHandled = 'true'

  // 使用一个简单的 SVG 作为默认图标
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjRTJFOEYwIi8+PHBhdGggZD0iTTIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhDMjQuNDE4MyAyOCAyOCAyNC40MTgzIDI4IDIwQzI4IDE1LjU4MTcgMjQuNDE4MyAxMiAyMCAxMloiIGZpbGw9IiM5NEE1QjgiLz48L3N2Zz4='
}

// 提交表单
const handleSubmit = async () => {
  if (!isFormValid.value) {
    showError('请填写所有必填项')
    return
  }

  // 验证多级止盈
  if (takeProfitMode.value === 'multiple') {
    if (formData.value.take_profit_targets.length === 0) {
      showError('请至少添加一个止盈目标')
      return
    }

    // 验证每个目标都已填写
    const hasEmptyTarget = formData.value.take_profit_targets.some(
      target => !target.percentage || !target.position_percentage
    )
    if (hasEmptyTarget) {
      showError('请填写所有止盈目标的百分比和平仓比例')
      return
    }

    // 警告总平仓比例不是100%
    if (totalClosePercentage.value !== 100) {
      const confirmed = confirm(
        `总平仓比例为 ${totalClosePercentage.value}%，建议设置为 100%。是否继续？`
      )
      if (!confirmed) return
    }
  }

  try {
    submitting.value = true
    errors.value = {}

    const submitData = {
      name: formData.value.name || autoGeneratedName.value,
      description: formData.value.description || `${autoGeneratedName.value} - 自动交易策略`,
      bot_type: 'trend_following',
      exchange_api: formData.value.exchange_api,
      token: formData.value.token,
      trading_pair: formData.value.trading_pair,
      timeframe: formData.value.timeframe,
      max_position_size: formData.value.max_position_size,
      leverage: formData.value.leverage,
      stop_loss_percentage: formData.value.stop_loss_percentage,
      // 根据模式选择止盈数据
      take_profit_percentage: takeProfitMode.value === 'single' ? formData.value.take_profit_percentage : null,
      take_profit_targets: takeProfitMode.value === 'multiple' ? formData.value.take_profit_targets : [],
      trailing_stop_enabled: formData.value.trailing_stop_enabled,
      trailing_stop_trigger: formData.value.trailing_stop_trigger,
      trailing_stop_distance: formData.value.trailing_stop_distance,
      breakeven_enabled: formData.value.breakeven_enabled,
      breakeven_trigger: formData.value.breakeven_trigger,
      breakeven_offset: formData.value.breakeven_offset,
      entry_order_type: formData.value.entry_order_type,
      exit_order_type: formData.value.exit_order_type,
      limit_price_offset: formData.value.limit_price_offset,
      amount_type: formData.value.amount_type,
      amount_value: formData.value.amount_value,
      config: formData.value.config
    }

    if (isEditMode.value) {
      await botAPI.updateBot(botId.value, submitData)
      showSuccess('趋势跟踪机器人更新成功')
    } else {
      await botAPI.createBot(submitData)
      showSuccess('趋势跟踪机器人创建成功')
    }

    router.push('/bots?type=trend_following')
  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '创建失败:', error)
    if (error.data && typeof error.data === 'object') {
      errors.value = error.data
      showError('请检查表单填写是否正确')
    } else {
      showError(error.message || (isEditMode.value ? '更新失败' : '创建失败'))
    }
  } finally {
    submitting.value = false
  }
}

// 取消操作
const handleCancel = () => {
  router.push('/bots?type=trend_following')
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadExchangeAPIs()

  // 如果是编辑模式，加载机器人数据
  if (isEditMode.value) {
    try {
      loading.value = true
      const response = await botAPI.getBotDetail(botId.value)
      const bot = response.data

      // 填充表单数据
      formData.value.name = bot.name
      formData.value.description = bot.description
      formData.value.exchange_api = bot.exchange_api?.id
      formData.value.token = bot.token?.id
      formData.value.trading_pair = bot.trading_pair
      formData.value.timeframe = bot.timeframe
      formData.value.leverage = bot.leverage || 1

      // 填充趋势跟踪机器人特定字段
      if (bot.trend_following_bot) {
        const trendBot = bot.trend_following_bot
        formData.value.max_position_size = trendBot.max_position_size
        formData.value.stop_loss_percentage = trendBot.stop_loss_percentage
        formData.value.take_profit_percentage = trendBot.take_profit_percentage
        formData.value.take_profit_targets = trendBot.take_profit_targets || []

        // 根据数据设置止盈模式
        if (trendBot.take_profit_targets && trendBot.take_profit_targets.length > 0) {
          takeProfitMode.value = 'multiple'
        } else {
          takeProfitMode.value = 'single'
        }

        formData.value.trailing_stop_enabled = trendBot.trailing_stop_enabled
        formData.value.trailing_stop_trigger = trendBot.trailing_stop_trigger
        formData.value.trailing_stop_distance = trendBot.trailing_stop_distance
        formData.value.breakeven_enabled = trendBot.breakeven_enabled
        formData.value.breakeven_trigger = trendBot.breakeven_trigger
        formData.value.breakeven_offset = trendBot.breakeven_offset
        formData.value.entry_order_type = trendBot.entry_order_type
        formData.value.exit_order_type = trendBot.exit_order_type
        formData.value.limit_price_offset = trendBot.limit_price_offset
        formData.value.amount_type = trendBot.amount_type
        formData.value.amount_value = trendBot.amount_value
      }

      // 设置选中的交易所 API
      if (bot.exchange_api) {
        selectedExchangeAPI.value = bot.exchange_api
      }

      // 设置选中的代币
      if (bot.token) {
        selectedToken.value = bot.token
        tokenSearchQuery.value = bot.token.symbol
      }
    } catch (error) {
      console.error('加载机器人数据失败:', error)
      showError('加载机器人数据失败')
      router.push('/bots?type=trend_following')
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
.token-search-container {
  position: relative;
}
</style>


