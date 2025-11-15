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

          <!-- 第1步: 交易所配置 -->
          <Card variant="default" class="mb-6">
            <!-- 卡片标题 -->
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-semibold text-slate-900">交易所配置</div>
                <div class="text-xs text-slate-500">选择交易所和账号</div>
              </div>
            </div>

            <div class="space-y-6 mt-6">
              <!-- 交易所选择（卡片式展开布局） -->
              <div class="space-y-4">
                <label class="block text-sm font-medium text-slate-700">
                  交易所 <span class="text-red-500">*</span>
                </label>
                <!-- 交易所列表 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    v-for="exchange in availableExchangeTypes"
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
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.exchange_type" class="mt-1 text-sm text-red-500">{{ errors.exchange_type }}</p>
              </div>

              <!-- 市场类型和交易所账号左右布局 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 市场类型 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">
                    市场类型 <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="type in [
                        { value: 'spot', label: '现货' },
                        { value: 'linear', label: '合约-USDT' },
                        { value: 'inverse', label: '合约-币本位' }
                      ]"
                      :key="type.value"
                      @click="formData.market_type = type.value"
                      :class="[
                        'p-3 rounded-lg text-center transition-all border-2 text-sm font-medium',
                        formData.market_type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      ]"
                      type="button"
                    >
                      {{ type.label }}
                    </button>
                  </div>
                  <p v-if="errors.market_type" class="mt-1 text-sm text-red-500">{{ errors.market_type }}</p>
                </div>

                <!-- 交易所账号 -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-slate-700">
                      交易所账号 <span class="text-red-500">*</span>
                    </label>
                    <button
                      v-if="filteredExchangeAPIs.length === 0 && selectedExchangeType"
                      type="button"
                      @click="goToExchangeSettings"
                      class="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      添加 {{ selectedExchangeLabel }} API
                    </button>
                  </div>
                  <Listbox v-model="formData.exchange_api" :disabled="!selectedExchangeType || filteredExchangeAPIs.length === 0">
                    <div class="relative">
                      <ListboxButton :class="[
                        'relative w-full cursor-default rounded-xl py-3 pl-4 pr-10 text-left border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                        (!selectedExchangeType || filteredExchangeAPIs.length === 0)
                          ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                          : selectedExchangeAPI
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-blue-50 border-blue-300 border-dashed'
                      ]">
                        <div class="flex items-center gap-2">
                          <img
                            v-if="selectedExchangeAPI"
                            :src="getExchangeLogo(selectedExchangeAPI.exchange)"
                            :alt="selectedExchangeAPI.exchange"
                            class="w-5 h-5 rounded object-contain"
                            @error="handleImageError"
                          />
                          <svg v-else-if="selectedExchangeType && filteredExchangeAPIs.length > 0" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                              <span :class="[
                                'block truncate',
                                selectedExchangeAPI ? 'text-slate-700' : 'text-blue-600 font-medium'
                              ]">
                                {{ selectedExchangeAPI?.name || (selectedExchangeType && filteredExchangeAPIs.length > 0 ? '👆 点击选择交易所账号' : '选择账号') }}
                              </span>
                              <span
                                v-if="selectedExchangeAPI"
                                :class="[
                                  'text-xs px-2 py-0.5 rounded-full whitespace-nowrap',
                                  selectedExchangeAPI.is_testnet
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                                ]"
                              >
                                {{ selectedExchangeAPI.is_testnet ? '模拟账户' : '真实账户' }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <ListboxOptions v-if="filteredExchangeAPIs.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption
                            v-slot="{ active, selected }"
                            v-for="api in filteredExchangeAPIs"
                            :key="api.id"
                            :value="api.id"
                            as="template"
                          >
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-10']">
                              <div class="flex items-center gap-2">
                                <img
                                  :src="getExchangeLogo(api.exchange)"
                                  :alt="api.exchange"
                                  class="w-5 h-5 rounded object-contain"
                                  @error="handleImageError"
                                />
                                <div class="flex-1 min-w-0">
                                  <div class="flex items-center gap-2 mb-1">
                                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                                      {{ api.name || getExchangeLabel(api.exchange) }}
                                    </span>
                                    <span
                                      :class="[
                                        'text-xs px-2 py-0.5 rounded-full whitespace-nowrap',
                                        api.is_testnet
                                          ? 'bg-orange-100 text-orange-700 font-medium'
                                          : 'bg-green-100 text-green-700 font-medium'
                                      ]"
                                    >
                                      {{ api.is_testnet ? '模拟账户' : '真实账户' }}
                                    </span>
                                  </div>
                                  <div class="text-xs text-slate-500 truncate">
                                    余额: {{ getBalanceDisplay(api) }}
                                  </div>
                                </div>
                              </div>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                  <p v-if="errors.exchange_api" class="mt-1 text-sm text-red-500">{{ errors.exchange_api }}</p>
                </div>
              </div>

              <!-- 代币和计价币种 -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- 代币搜索 -->
                <div class="md:col-span-3 token-search-container">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    代币 <span class="text-red-500">*</span>
                    <span v-if="!selectedExchangeType" class="text-xs text-orange-500 ml-2">请先选择交易所</span>
                    <span v-else-if="exchangeStats.total > 0" class="text-xs text-slate-500 ml-2">
                      {{ selectedExchangeLabel }} 共 {{ exchangeStats.total }} 个代币
                      <span v-if="formData.market_type === 'spot'">（现货 {{ exchangeStats.spot }}）</span>
                      <span v-else-if="formData.market_type === 'linear'">（合约-USDT {{ exchangeStats.linear }}）</span>
                      <span v-else-if="formData.market_type === 'inverse'">（合约-币本位 {{ exchangeStats.inverse }}）</span>
                    </span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="tokenSearchQuery"
                      @input="handleTokenSearch"
                      @focus="handleTokenInputFocus"
                      @blur="handleTokenInputBlur"
                      type="text"
                      :placeholder="selectedExchangeType ? '搜索代币 (如: BTC, ETH)' : '请先选择交易所'"
                      :disabled="!selectedExchangeType"
                      class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <div v-if="tokenSearching" class="absolute right-3 top-3">
                      <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <!-- 搜索结果下拉 -->
                    <div
                      v-if="showTokenResults && tokenSearchResults.length > 0"
                      class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto"
                      @mousedown.prevent
                    >
                      <button
                        v-for="token in tokenSearchResults"
                        :key="token.id"
                        type="button"
                        @click="selectToken(token)"
                        class="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-b-0"
                      >
                        <img
                          v-if="token.logo"
                          :src="token.logo"
                          :alt="token.symbol"
                          class="w-8 h-8 rounded-full"
                          @error="(e) => e.target.style.display = 'none'"
                        />
                        <div class="flex-1">
                          <div class="font-medium text-slate-900">{{ token.symbol }}</div>
                          <div class="text-xs text-slate-500">{{ token.name }}</div>
                        </div>
                        <div class="text-sm text-slate-600">${{ typeof token.current_price === 'number' ? token.current_price.toFixed(2) : (parseFloat(token.current_price) || 0).toFixed(2) }}</div>
                      </button>
                    </div>
                  </div>
                  <!-- 热门代币快捷选择 -->
                  <div class="flex flex-wrap gap-2 mt-2">
                    <button
                      v-for="popularToken in popularTokens"
                      :key="popularToken"
                      type="button"
                      @click="quickSelectToken(popularToken)"
                      :disabled="!selectedExchangeAPI"
                      class="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ popularToken }}
                    </button>
                  </div>
                  <p v-if="errors.token" class="mt-1 text-sm text-red-500">{{ errors.token }}</p>
                </div>

                <!-- 计价币种 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    计价币种 <span class="text-red-500">*</span>
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

          <!-- 第2步: 时间周期 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-semibold text-slate-900">时间周期</div>
                <div class="text-xs text-slate-500">选择交易策略的时间周期</div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="tf in timeframeOptions"
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
          </Card>

          <!-- 第3步: 趋势指标（多选） -->
          <Card variant="default" class="mb-6">
            <MultiIndicatorSelector
              v-model="formData.trend_indicators"
              :available-indicators="availableIndicators"
              :indicator-params="formData.indicator_params"
              @update:indicator-params="formData.indicator_params = $event"
            />
          </Card>

          <!-- 执行策略配置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">执行策略</h2>
                <p class="text-sm text-slate-500">配置订单执行方式和参数</p>
              </div>
            </div>
            <div class="space-y-6">
              <!-- 入场方式 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    入场方式 <span class="text-red-500">*</span>
                  </label>
                  <Listbox v-model="formData.entry_mode">
                    <div class="relative">
                      <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="block truncate text-slate-700">
                          {{ formData.entry_mode === 'market' ? '市价单' : '限价单' }}
                        </span>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption
                            v-slot="{ active, selected }"
                            value="market"
                            as="template"
                          >
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">市价单</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                          <ListboxOption
                            v-slot="{ active, selected }"
                            value="limit"
                            as="template"
                          >
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">限价单</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    滑点限制 (%)
                  </label>
                  <input
                    v-model.number="formData.slippage_limit"
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    placeholder="0.2"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- 订单重试和过期时间 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    订单重试次数
                  </label>
                  <input
                    v-model.number="formData.order_retry"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="3"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    订单过期时间 (秒)
                  </label>
                  <input
                    v-model.number="formData.order_expire_time"
                    type="number"
                    min="60"
                    max="3600"
                    placeholder="300"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- 高级功能 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-center gap-3">
                  <input
                    v-model="formData.auto_reverse"
                    type="checkbox"
                    id="auto_reverse"
                    class="w-4 h-4 rounded border-slate-300"
                  />
                  <label for="auto_reverse" class="text-sm font-medium text-slate-700">
                    自动反向开仓
                  </label>
                </div>
                <div class="flex items-center gap-3">
                  <input
                    v-model="formData.funding_fee_check"
                    type="checkbox"
                    id="funding_fee_check"
                    class="w-4 h-4 rounded border-slate-300"
                  />
                  <label for="funding_fee_check" class="text-sm font-medium text-slate-700">
                    检查资金费率
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <!-- 风险管理 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2M6.34 7.34a9 9 0 1112.32 12.32M6.34 7.34l1.41-1.41m8.58 8.58l1.41 1.41M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">风险管理</h2>
                  <p class="text-sm text-slate-500">设置止损、止盈和头寸管理</p>
                </div>
              </div>
              <!-- 设置图标 - 链接到用户中心风险偏好 -->
              <div class="relative group">
                <button
                  @click="navigateToRiskPreference"
                  class="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <!-- Tooltip -->
                <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  进入系统风控配置
                  <div class="absolute top-full right-2 w-2 h-2 bg-slate-900 transform rotate-45"></div>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <!-- 第一行：仓位管理 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 左列：仓位类型 + 最大仓位 -->
                <div>
                  <div class="flex gap-3">
                    <!-- 仓位类型（占50%宽度） -->
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        仓位类型
                        <span class="text-red-500 ml-0.5">*</span>
                      </label>
                      <Listbox v-model="formData.position_size_type">
                        <div class="relative">
                          <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="block truncate text-slate-700">
                              {{ formData.position_size_type === 'fixed' ? '固定金额 (USDT)' : '账户百分比 (%)' }}
                            </span>
                            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </span>
                          </ListboxButton>
                          <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <ListboxOption
                                v-slot="{ active, selected }"
                                value="fixed"
                                as="template"
                              >
                                <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">固定金额 (USDT)</span>
                                  <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                  </span>
                                </li>
                              </ListboxOption>
                              <ListboxOption
                                v-slot="{ active, selected }"
                                value="percent"
                                as="template"
                              >
                                <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">账户百分比 (%)</span>
                                  <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                  </span>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </transition>
                        </div>
                      </Listbox>
                    </div>

                    <!-- 最大仓位（占50%宽度） -->
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        最大仓位
                        <span class="text-red-500 ml-0.5">*</span>
                        <div class="relative inline-block ml-1">
                          <button
                            type="button"
                            @mouseenter="showTooltips.maxPositionSize = true"
                            @mouseleave="showTooltips.maxPositionSize = false"
                            class="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <div
                            v-if="showTooltips.maxPositionSize"
                            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
                          >
                            {{ formData.position_size_type === 'percent' ? '账户余额的百分比' : '单次交易的最大金额' }}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </label>
                      <div class="relative">
                        <input
                          v-model.number="formData.max_position_size"
                          type="number"
                          step="0.01"
                          min="0"
                          :max="formData.position_size_type === 'percent' ? 100 : undefined"
                          :placeholder="formData.position_size_type === 'percent' ? '10' : '100'"
                          :class="[
                            'w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                            isFieldExceedingLimit('max_position_size')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-slate-300 focus:ring-blue-500'
                          ]"
                        />
                        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                          {{ formData.position_size_type === 'percent' ? '%' : 'U' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 错误和提示信息 -->
                  <p v-if="errors.max_position_size" class="mt-1 text-sm text-red-500">{{ errors.max_position_size }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('max_position_size')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('max_position_size') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else-if="userRiskConfig && formData.position_size_type === 'fixed'" class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ userRiskConfig.max_position_per_bot }} USDT
                  </p>
                </div>

                <!-- 杠杆倍数 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    杠杆倍数 <span class="text-red-500">*</span>
                    <div class="relative inline-block ml-2">
                      <button
                        type="button"
                        @mouseenter="showTooltips.leverage = true"
                        @mouseleave="showTooltips.leverage = false"
                        class="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <div
                        v-if="showTooltips.leverage"
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
                      >
                        杠杆倍数范围 1-125倍
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </label>
                  <input
                    v-model.number="formData.leverage"
                    type="number"
                    step="1"
                    min="1"
                    max="125"
                    placeholder="1"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('leverage')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.leverage" class="mt-1 text-sm text-red-500">{{ errors.leverage }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('leverage')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('leverage') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else-if="userRiskConfig" class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ userRiskConfig.max_leverage }}x
                  </p>
                  <p v-else class="mt-1 text-xs text-slate-500">
                    实际可用杠杆取决于交易所限制
                  </p>
                </div>
              </div>

              <!-- 第二行：持仓管理 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 最大并发持仓数 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    最大并发持仓数 <span class="text-red-500">*</span>
                    <div class="relative inline-block ml-2">
                      <button
                        type="button"
                        @mouseenter="showTooltips.maxConcurrentPositions = true"
                        @mouseleave="showTooltips.maxConcurrentPositions = false"
                        class="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <div
                        v-if="showTooltips.maxConcurrentPositions"
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
                      >
                        防止频繁买入，限制同时持仓数量
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </label>
                  <input
                    v-model.number="formData.max_concurrent_positions"
                    type="number"
                    step="1"
                    min="1"
                    max="10"
                    placeholder="1"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('max_concurrent_positions')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.max_concurrent_positions" class="mt-1 text-sm text-red-500">{{ errors.max_concurrent_positions }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('max_concurrent_positions')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('max_concurrent_positions') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else-if="userRiskConfig" class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ userRiskConfig.max_open_positions }} 个
                  </p>
                </div>

                <!-- 每日最大交易次数 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    每日最大交易次数
                    <div class="relative inline-block ml-2">
                      <button
                        type="button"
                        @mouseenter="showTooltips.maxTradesPerDay = true"
                        @mouseleave="showTooltips.maxTradesPerDay = false"
                        class="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <div
                        v-if="showTooltips.maxTradesPerDay"
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
                      >
                        可选，不限制则留空
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </label>
                  <input
                    v-model.number="formData.max_trades_per_day"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="10"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('max_trades_per_day')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.max_trades_per_day" class="mt-1 text-sm text-red-500">{{ errors.max_trades_per_day }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('max_trades_per_day')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('max_trades_per_day') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else-if="userRiskConfig" class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ userRiskConfig.max_trades_per_day }} 次/天
                  </p>
                </div>
              </div>

              <!-- 第三行：风险控制 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 止损百分比 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    止损百分比 (%) <span class="text-red-500">*</span>
                    <div class="relative inline-block ml-2">
                      <button
                        type="button"
                        @mouseenter="showTooltips.stopLossPercentage = true"
                        @mouseleave="showTooltips.stopLossPercentage = false"
                        class="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <div
                        v-if="showTooltips.stopLossPercentage"
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
                      >
                        触发止损的价格跌幅百分比
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </label>
                  <input
                    v-model.number="formData.stop_loss_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="5"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('stop_loss_percentage')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.stop_loss_percentage" class="mt-1 text-sm text-red-500">{{ errors.stop_loss_percentage }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('stop_loss_percentage')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('stop_loss_percentage') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ systemStopLossPercentage }}%
                  </p>
                </div>

                <!-- 每日最大亏损 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    每日最大亏损 (USDT)
                    <div class="relative inline-block ml-2">
                      <button
                        type="button"
                        @mouseenter="showTooltips.maxDailyLoss = true"
                        @mouseleave="showTooltips.maxDailyLoss = false"
                        class="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <div
                        v-if="showTooltips.maxDailyLoss"
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
                      >
                        可选，超过则停止交易
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </label>
                  <input
                    v-model.number="formData.max_daily_loss"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="500"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('max_daily_loss')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.max_daily_loss" class="mt-1 text-sm text-red-500">{{ errors.max_daily_loss }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('max_daily_loss')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('max_daily_loss') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else-if="userRiskConfig" class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ userRiskConfig.max_daily_loss }} USDT/天
                  </p>
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
                    <div class="flex gap-2">
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
                      <button
                        v-if="formData.take_profit_targets.length > 0"
                        @click="autoAllocateTakeProfits"
                        type="button"
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="根据止盈百分比自动分配平仓比例"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        自动分配
                      </button>
                    </div>
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 入场订单类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    入场订单类型 <span class="text-red-500">*</span>
                  </label>
                  <Listbox v-model="formData.entry_order_type">
                    <div class="relative">
                      <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="block truncate text-slate-700">
                          {{ formData.entry_order_type === 'market' ? '市价单 - 立即成交' : '限价单 - 指定价格' }}
                        </span>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption v-slot="{ active, selected }" value="market" as="template">
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">市价单 - 立即成交</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                          <ListboxOption v-slot="{ active, selected }" value="limit" as="template">
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">限价单 - 指定价格</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                </div>

                <!-- 出场订单类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    出场订单类型 <span class="text-red-500">*</span>
                  </label>
                  <Listbox v-model="formData.exit_order_type">
                    <div class="relative">
                      <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="block truncate text-slate-700">
                          {{ formData.exit_order_type === 'market' ? '市价单 - 立即成交' : '限价单 - 指定价格' }}
                        </span>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption v-slot="{ active, selected }" value="market" as="template">
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">市价单 - 立即成交</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                          <ListboxOption v-slot="{ active, selected }" value="limit" as="template">
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">限价单 - 指定价格</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                </div>

                <!-- 金额类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    金额类型
                  </label>
                  <Listbox v-model="formData.amount_type">
                    <div class="relative">
                      <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="block truncate text-slate-700">
                          {{ formData.amount_type === 'fixed' ? '固定金额' : '账户百分比' }}
                        </span>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption v-slot="{ active, selected }" value="fixed" as="template">
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">固定金额</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                          <ListboxOption v-slot="{ active, selected }" value="percentage" as="template">
                            <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">账户百分比</span>
                              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
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
                <div v-if="formData.entry_order_type === 'limit' || formData.exit_order_type === 'limit'" class="md:col-span-2">
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
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-slate-700">
                    机器人名称
                    <span class="text-xs text-slate-500 ml-2">留空将自动生成</span>
                  </label>
                  <button
                    type="button"
                    @click="useAutoGeneratedName"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    使用自动生成
                  </button>
                </div>
                <input
                  v-model="formData.name"
                  type="text"
                  :placeholder="autoGeneratedName || '未命名趋势跟踪机器人'"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- 机器人描述 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-slate-700">
                    机器人描述
                    <span class="text-xs text-slate-500 ml-2">留空将自动生成</span>
                  </label>
                  <button
                    type="button"
                    @click="useAutoGeneratedDescription"
                    class="text-xs text-blue-600 hover:text-blue-700"
                  >
                    使用自动生成
                  </button>
                </div>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  :placeholder="autoGeneratedDescription || '描述机器人的交易策略和目标...'"
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
                      <span class="text-slate-500">交易模式</span>
                      <span class="font-medium text-slate-900 text-blue-600">信号触发交易</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易所</span>
                      <span class="font-medium text-slate-900">
                        {{ selectedExchangeAPI?.name || getExchangeLabel(selectedExchangeAPI?.exchange) || '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易对</span>
                      <span class="font-medium text-slate-900">
                        {{ selectedToken?.symbol && formData.trading_pair ? `${selectedToken.symbol}/${formData.trading_pair}` : '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">时间周期</span>
                      <span class="font-medium text-slate-900">
                        {{ timeframeOptions?.find(t => t.value === formData.timeframe)?.label || '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">市场类型</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.market_type === 'spot' ? '现货' : formData.market_type === 'linear' ? 'USDT永续' : '币本位永续' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 策略配置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">策略配置</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">趋势指标</span>
                      <span class="font-medium text-slate-900">
                        {{ trendIndicators.find(t => t.value === formData.trend_indicator)?.label || '-' }}
                      </span>
                    </div>
                    <div v-if="['ma_crossover', 'ema_crossover'].includes(formData.trend_indicator)" class="flex justify-between text-xs">
                      <span class="text-slate-500">快线/慢线周期</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.config.fast_period }} / {{ formData.config.slow_period }}
                      </span>
                    </div>
                    <div v-if="formData.trend_indicator === 'macd'" class="flex justify-between text-xs">
                      <span class="text-slate-500">MACD 参数</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.config.fast_period }}/{{ formData.config.slow_period }}/{{ formData.config.signal_period }}
                      </span>
                    </div>
                    <div v-if="formData.trend_indicator === 'rsi'" class="flex justify-between text-xs">
                      <span class="text-slate-500">RSI 参数</span>
                      <span class="font-medium text-slate-900">
                        周期{{ formData.config.rsi_period }} ({{ formData.config.rsi_oversold }}/{{ formData.config.rsi_overbought }})
                      </span>
                    </div>
                    <div v-if="formData.trend_indicator === 'bollinger'" class="flex justify-between text-xs">
                      <span class="text-slate-500">布林带参数</span>
                      <span class="font-medium text-slate-900">
                        周期{{ formData.config.bollinger_period }} (±{{ formData.config.bollinger_std }}σ)
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 风险管理 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">风险管理</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最大仓位</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_position_size ?
                          (formData.position_size_type === 'percent' ?
                            `${formData.max_position_size}%` :
                            `${formData.max_position_size} USDT`) :
                          '-'
                        }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">杠杆倍数</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.leverage || 1 }}x
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最大并发持仓</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_concurrent_positions || 1 }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">每日最大交易</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_trades_per_day || 10 }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">每日最大亏损</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_daily_loss || 500 }} USDT
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">止损</span>
                      <span class="font-medium text-red-600">
                        {{ formData.stop_loss_percentage ? `${formData.stop_loss_percentage}%` : '-' }}
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Header from '../../common/Header.vue'
import Card from '../../common/ui/Card.vue'
import Select from '../../common/ui/Select.vue'
import MultiIndicatorSelector from '../components/MultiIndicatorSelector.vue'
import { botAPI, exchangeAPI, apiRequest, API_ENDPOINTS } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const loading = ref(false)
const isLoadingBotData = ref(false)  // 标志：正在加载机器人数据

// 编辑模式
const isEditMode = computed(() => !!route.params.id)
const botId = computed(() => route.params.id)

// 趋势指标选项（完整版，包含新增指标）
const availableIndicators = ref([
  {
    value: 'ma_crossover',
    name: 'MA 均线交叉',
    label: 'MA 交叉',
    description: '判断趋势方向、黄金交叉/死亡交叉',
    usage: '在趋势中的作用：趋势跟踪，适合中长期交易',
    params: 'MA 短期/长期周期'
  },
  {
    value: 'ema_crossover',
    name: 'EMA 指数均线交叉',
    label: 'EMA 交叉',
    description: '比 MA 更快反应，捕捉更快趋势',
    usage: '在趋势中的作用：短期交易，快速反应趋势变化',
    params: 'EMA 短期/长期周期'
  },
  {
    value: 'macd',
    name: 'MACD',
    label: 'MACD',
    description: '判断趋势强弱、动能变化、背离',
    usage: '在趋势中的作用：趋势确认，动能分析',
    params: 'MACD 快线/慢线/信号线周期'
  },
  {
    value: 'rsi',
    name: 'RSI 相对强弱指标',
    label: 'RSI',
    description: '判断超买/超卖，可用于趋势过滤',
    usage: '在趋势中的作用：过滤假突破，确认趋势强度',
    params: 'RSI 周期、超买/超卖阈值'
  },
  {
    value: 'bollinger',
    name: 'Bollinger Bands 布林带',
    label: '布林带',
    description: '判断是否超买/超卖，趋势突破',
    usage: '在趋势中的作用：波动率交易，突破确认',
    params: 'Bollinger 周期、标准差倍数'
  },
  {
    value: 'adx',
    name: 'ADX 趋势强度指标',
    label: 'ADX',
    description: '判断趋势强度（不判断方向）',
    usage: '在趋势中的作用：过滤震荡市，只在强趋势时交易',
    params: 'ADX 周期、强趋势阈值（通常 >25）'
  },
  {
    value: 'supertrend',
    name: 'SuperTrend 超级趋势',
    label: 'SuperTrend',
    description: '判断趋势方向和支撑/阻力位',
    usage: '在趋势中的作用：趋势跟踪，动态止损设置',
    params: 'ATR 周期、ATR 倍数'
  },
  {
    value: 'volume',
    name: 'Volume 成交量确认',
    label: 'Volume',
    description: '通过成交量确认趋势强度和突破有效性',
    usage: '在趋势中的作用：确认趋势真实性，过滤虚假突破',
    params: '成交量均线周期、放量倍数阈值'
  }
])

// 向后兼容：保留旧的 trendIndicators
const trendIndicators = computed(() => availableIndicators.value)

// 代币搜索
const tokenSearchQuery = ref('')
const tokenSearchResults = ref([])
const tokenSearching = ref(false)
const showTokenResults = ref(false)
const selectedToken = ref(null)
let searchTimeout = null

// 热门代币列表
const popularTokens = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC']

// 系统风控配置
const userRiskConfig = ref(null)
const loadingRiskConfig = ref(false)

// Tooltip 显示状态
const showTooltips = ref({
  maxPositionSize: false,
  leverage: false,
  maxConcurrentPositions: false,
  maxTradesPerDay: false,
  stopLossPercentage: false,
  maxDailyLoss: false
})

// 加载系统风控配置
const loadUserRiskConfig = async () => {
  try {
    loadingRiskConfig.value = true
    const response = await botAPI.getRiskConfig()

    console.log('📊 API 原始响应:', response)
    console.log('📊 response.data:', response.data)
    console.log('📊 response.data?.data:', response.data?.data)

    // 处理 API 返回格式：{ success: true, data: {...} }
    // 优先级：response.data.data > response.data > response
    let config = null
    if (response.data?.data) {
      config = response.data.data
    } else if (response.data) {
      config = response.data
    } else {
      config = response
    }

    // 确保所有数字字段都转换为 Number 类型，避免字符串比较问题
    if (config) {
      userRiskConfig.value = {
        ...config,
        max_total_position: Number(config.max_total_position),
        max_position_per_bot: Number(config.max_position_per_bot),
        max_leverage: Number(config.max_leverage),
        max_daily_loss: Number(config.max_daily_loss),
        max_drawdown_percentage: Number(config.max_drawdown_percentage),
        max_open_positions: Number(config.max_open_positions),
        max_trades_per_day: Number(config.max_trades_per_day),
        circuit_breaker_loss: Number(config.circuit_breaker_loss),
      }
    }

    console.log('✅ 系统风控配置已加载:', userRiskConfig.value)
    console.log('✅ max_leverage:', userRiskConfig.value?.max_leverage, typeof userRiskConfig.value?.max_leverage)
    console.log('✅ max_daily_loss:', userRiskConfig.value?.max_daily_loss, typeof userRiskConfig.value?.max_daily_loss)
    console.log('✅ max_position_per_bot:', userRiskConfig.value?.max_position_per_bot, typeof userRiskConfig.value?.max_position_per_bot)
  } catch (error) {
    console.error('❌ 加载系统风控配置失败:', error)
    console.error('❌ 错误详情:', error.message)
    // 不显示错误提示，因为这是可选的
  } finally {
    loadingRiskConfig.value = false
  }
}

// 处理代币输入框获得焦点
const handleTokenInputFocus = () => {
  // 检查是否选择了交易所
  if (!selectedExchangeType.value) {
    showError('请先选择交易所')
    return
  }

  // 如果输入框为空，加载热门代币列表
  const query = tokenSearchQuery.value.trim()
  if (query.length === 0) {
    loadPopularTokens()
  } else {
    // 如果有输入内容，显示现有结果
    showTokenResults.value = true
  }
}

// 处理代币输入框失去焦点
const handleTokenInputBlur = () => {
  // 延迟隐藏，以便点击下拉框中的选项时能够正常触发
  setTimeout(() => {
    showTokenResults.value = false
  }, 200)
}

// 加载热门代币列表
const loadPopularTokens = async () => {
  if (!selectedExchangeType.value) {
    return
  }

  tokenSearching.value = true
  showTokenResults.value = true

  try {
    const exchangeName = selectedExchangeType.value
    const marketType = formData.value.market_type || 'spot'

    // 使用空查询或特殊参数来获取热门代币列表
    const response = await apiRequest(
      `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=&exchange=${exchangeName}&market_type=${marketType}&limit=20`
    )

    if (response.status === 'success') {
      tokenSearchResults.value = response.data.results || []
      console.log(`✅ 加载了 ${tokenSearchResults.value.length} 个热门代币`)
    } else {
      tokenSearchResults.value = []
    }
  } catch (error) {
    console.error('加载热门代币失败:', error)
    tokenSearchResults.value = []
  } finally {
    tokenSearching.value = false
  }
}

// 代币搜索
const handleTokenSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  const query = tokenSearchQuery.value.trim()

  // 如果输入为空，加载热门代币
  if (query.length < 1) {
    loadPopularTokens()
    return
  }

  // 检查是否选择了交易所
  if (!selectedExchangeType.value) {
    showError('请先选择交易所')
    return
  }

  // 用户正在输入，清空之前的选择（只有当输入内容与已选代币不匹配时才清空）
  if (selectedToken.value && !selectedToken.value.symbol.toLowerCase().includes(query.toLowerCase())) {
    formData.value.token = null
    selectedToken.value = null
  }

  tokenSearching.value = true
  showTokenResults.value = true

  searchTimeout = setTimeout(async () => {
    try {
      // 获取交易所名称（使用 selectedExchangeType 而不是 selectedExchangeAPI）
      const exchangeName = selectedExchangeType.value

      // 获取市场类型
      const marketType = formData.value.market_type || 'spot'

      // 添加交易所和市场类型参数，只搜索该交易所在该市场类型下支持的代币
      const response = await apiRequest(
        `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${query}&exchange=${exchangeName}&market_type=${marketType}`
      )

      if (response.status === 'success') {
        tokenSearchResults.value = response.data.results || []

        // 如果没有搜索结果，显示提示
        if (tokenSearchResults.value.length === 0) {
          const marketTypeLabel = marketType === 'spot' ? '现货' : marketType === 'linear' ? '合约-USDT' : '合约-币本位'
          console.log(`⚠️ 在 ${exchangeName} ${marketTypeLabel} 市场未找到 "${query}"`)
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
  if (!selectedExchangeAPI.value) {
    showError('请先选择交易所')
    return
  }

  tokenSearchQuery.value = symbol
  tokenSearching.value = true
  showTokenResults.value = true

  try {
    // 获取交易所名称
    const exchangeName = selectedExchangeAPI.value?.exchange_name || selectedExchangeAPI.value?.exchange

    // 添加交易所参数
    const response = await apiRequest(
      `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${symbol}&exchange=${exchangeName}`
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

// 表单数据 - 趋势跟踪机器人专用
const formData = ref({
  name: '',
  description: '',
  bot_type: 'trend_following',
  trading_mode: 'signal_trigger',  // 趋势跟踪机器人只做信号触发
  signal_bot: null,  // 关联的信号机器人 ID
  exchange_api: null,  // 交易所 API ID
  token: null,
  trading_pair: null,  // 交易对 (如: BTC/USDT)
  timeframe: '1h',
  trend_indicator: 'ma_crossover',  // 趋势指标 - 直接字段（向后兼容）
  trend_indicators: ['ma_crossover'],  // 多选指标（新字段）
  // 市场类型 - 问题2修复
  market_type: 'spot',  // spot, linear, inverse
  // 仓位管理
  position_size_type: 'fixed',  // 仓位类型：fixed=固定金额, percent=账户百分比
  max_position_size: 100,
  leverage: 1,  // 杠杆倍数
  // 持仓管理 - 问题1修复
  max_concurrent_positions: 1,  // 最大并发持仓数
  max_trades_per_day: 10,  // 每日最大交易次数
  max_daily_loss: 500,  // 每日最大亏损
  // 风险管理
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
  // ============ 执行策略参数（新增）============
  entry_mode: 'market',
  entry_price_offset: 0,
  slippage_limit: 0.2,
  order_retry: 3,
  order_expire_time: 300,
  // ============ 仓位管理参数（新增）============
  auto_reverse: false,
  max_position_time: 86400,
  // ============ 高级功能参数（新增）============
  funding_fee_check: true,
  pause_on_high_volatility: false,
  volatility_threshold: 5,
  allow_partial_close: true,
  smart_exit: false,
  // ============ 通知设置参数（新增）============
  alert_channels: [],
  alert_on_entry: true,
  alert_on_exit: true,
  alert_on_error: true,
  // 通用配置
  config: {
    trend_indicator: 'ma_crossover',  // 默认趋势指标
    fast_period: 12,
    slow_period: 26,
    signal_period: 9,
    rsi_period: 14,
    rsi_oversold: 30,
    rsi_overbought: 70,
    bollinger_period: 20,
    bollinger_std: 2
  },
  // 指标参数配置（按指标类型分组）
  indicator_params: {
    ma_crossover: {
      fast_period: 12,
      slow_period: 26
    },
    ema_crossover: {
      fast_period: 12,
      slow_period: 26
    },
    macd: {
      fast_period: 12,
      slow_period: 26,
      signal_period: 9
    },
    rsi: {
      rsi_period: 14,
      rsi_oversold: 30,
      rsi_overbought: 70
    },
    bollinger: {
      bollinger_period: 20,
      bollinger_std: 2
    },
    adx: {
      adx_period: 14,
      adx_threshold: 25
    },
    supertrend: {
      atr_period: 10,
      atr_multiplier: 3.0
    },
    volume: {
      volume_ma_period: 20,
      volume_threshold: 1.5
    }
  }
})

const errors = ref({})

// 交易所类型列表（从后端获取）
const availableExchangeTypes = ref([])

// 交易所 API 列表
const exchangeAPIs = ref([])
const selectedExchangeAPI = ref(null)
const selectedExchangeType = ref(null)

// 交易所统计信息
const exchangeStats = ref({
  total: 0,
  spot: 0,
  linear: 0,
  inverse: 0
})

// 根据选择的交易所类型过滤 API
const filteredExchangeAPIs = computed(() => {
  if (!selectedExchangeType.value) return []
  return exchangeAPIs.value.filter(api => api.exchange === selectedExchangeType.value)
})

// 获取选中交易所的标签
const selectedExchangeLabel = computed(() => {
  const exchange = availableExchangeTypes.value.find(e => e.value === selectedExchangeType.value)
  return exchange ? exchange.label : ''
})

// 代币搜索（已废弃，改为直接选择交易对）
// const tokenSearchQuery = ref('')
// const tokenSearchResults = ref([])
// const searchingTokens = ref(false)
// const showTokenResults = ref(false)
// const selectedToken = ref(null)
// let searchTimeout = null

// 交易对相关
const availableTradingPairs = ref([])  // 存储完整的交易对对象 (包括 symbol, balance, last_price 等)
const loadingTradingPairs = ref(false)
const tradingPairSearchQuery = ref('')  // 交易对搜索关键词

// 交易对显示格式化（已废弃，改为 filteredTradingPairs）
// const tradingPairDisplays = computed(() => {
//   return availableTradingPairs.value.map(pair => ({
//     ...pair,
//     displayLabel: pair.balance > 0
//       ? `${pair.symbol} (余额: ${pair.balance.toFixed(8)})`
//       : pair.symbol,
//     displayValue: pair.symbol
//   }))
// })

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

// 添加止盈目标 - 自动科学分配参数
const addTakeProfitTarget = () => {
  const currentCount = formData.value.take_profit_targets.length
  const baseProfit = formData.value.take_profit_percentage || 10

  // 科学分配策略：
  // 1级：基础止盈 + 0%，平仓 30%
  // 2级：基础止盈 + 50%，平仓 35%
  // 3级：基础止盈 + 100%，平仓 35%
  const strategies = [
    { profitMultiplier: 1.0, closePercentage: 30 },    // 1级
    { profitMultiplier: 1.5, closePercentage: 35 },    // 2级
    { profitMultiplier: 2.0, closePercentage: 35 }     // 3级
  ]

  if (currentCount < strategies.length) {
    const strategy = strategies[currentCount]
    const profitPercentage = Math.round(baseProfit * strategy.profitMultiplier * 10) / 10

    formData.value.take_profit_targets.push({
      percentage: profitPercentage,
      position_percentage: strategy.closePercentage,
      executed: false
    })
  } else {
    // 超过3级，使用递增策略
    const lastTarget = formData.value.take_profit_targets[currentCount - 1]
    const profitPercentage = Math.round((lastTarget.percentage + baseProfit) * 10) / 10

    formData.value.take_profit_targets.push({
      percentage: profitPercentage,
      position_percentage: Math.max(0, 100 - totalClosePercentage.value),
      executed: false
    })
  }
}

// 移除止盈目标
const removeTakeProfitTarget = (index) => {
  formData.value.take_profit_targets.splice(index, 1)
}

// 自动分配止盈目标的平仓比例
const autoAllocateTakeProfits = () => {
  const targets = formData.value.take_profit_targets
  if (targets.length === 0) return

  // 按止盈百分比排序
  const sortedTargets = targets
    .map((t, idx) => ({ ...t, originalIndex: idx }))
    .sort((a, b) => (a.percentage || 0) - (b.percentage || 0))

  // 计算平仓比例
  const totalTargets = sortedTargets.length
  let remainingPercentage = 100

  sortedTargets.forEach((target, idx) => {
    if (idx === totalTargets - 1) {
      // 最后一个目标平仓所有剩余头寸
      target.position_percentage = remainingPercentage
    } else {
      // 前面的目标平仓相等比例
      const closePercentage = Math.floor(100 / totalTargets)
      target.position_percentage = closePercentage
      remainingPercentage -= closePercentage
    }
  })

  // 恢复原始顺序
  sortedTargets.forEach(target => {
    const originalIndex = target.originalIndex
    formData.value.take_profit_targets[originalIndex].position_percentage = target.position_percentage
  })
}

// 初始化多级止盈目标 - 自动生成 3 个预设目标
const initializeMultipleTakeProfits = () => {
  const baseProfit = formData.value.take_profit_percentage || 10

  // 清空现有目标
  formData.value.take_profit_targets = []

  // 科学分配策略：
  // 1级：基础止盈 × 1.0，平仓 33%
  // 2级：基础止盈 × 1.5，平仓 33%
  // 3级：基础止盈 × 2.0，平仓 34%
  const strategies = [
    { profitMultiplier: 1.0, closePercentage: 33 },    // 1级
    { profitMultiplier: 1.5, closePercentage: 33 },    // 2级
    { profitMultiplier: 2.0, closePercentage: 34 }     // 3级
  ]

  strategies.forEach(strategy => {
    const profitPercentage = Math.round(baseProfit * strategy.profitMultiplier * 10) / 10
    formData.value.take_profit_targets.push({
      percentage: profitPercentage,
      position_percentage: strategy.closePercentage,
      executed: false
    })
  })
}

// 监听止盈模式变化
watch(takeProfitMode, (newMode) => {
  if (newMode === 'multiple' && formData.value.take_profit_targets.length === 0) {
    // 当切换到多级止盈且没有目标时，自动初始化 3 个预设目标
    initializeMultipleTakeProfits()
  }
})

// 自动生成的名称
const autoGeneratedName = computed(() => {
  const parts = []

  // 交易对
  if (selectedToken.value?.symbol && formData.value.trading_pair) {
    parts.push(`${selectedToken.value.symbol}/${formData.value.trading_pair}`)
  }

  // 时间周期
  if (formData.value.timeframe) {
    const timeframe = timeframeOptions.find(t => t.value === formData.value.timeframe)?.label || formData.value.timeframe
    parts.push(timeframe)
  }

  // 趋势指标
  if (formData.value.trend_indicator) {
    const indicator = trendIndicators.value.find(i => i.value === formData.value.trend_indicator)?.label
    if (indicator) {
      parts.push(indicator)
    }
  }

  return parts.length > 0 ? parts.join(' ') + ' 趋势跟踪' : '未命名趋势跟踪机器人'
})

// 自动生成的描述
const autoGeneratedDescription = computed(() => {
  const parts = []

  // 基本信息
  if (selectedExchangeAPI.value && selectedToken.value?.symbol && formData.value.trading_pair) {
    const exchangeName = getExchangeLabel(selectedExchangeAPI.value.exchange) || selectedExchangeAPI.value.name
    const marketType = formData.value.market_type === 'spot' ? '现货' : formData.value.market_type === 'linear' ? 'USDT永续' : '币本位永续'
    parts.push(`在 ${exchangeName} 交易所交易 ${selectedToken.value.symbol}/${formData.value.trading_pair} ${marketType}`)
  }

  // 趋势指标
  if (formData.value.trend_indicator) {
    const indicator = trendIndicators.value.find(i => i.value === formData.value.trend_indicator)?.label
    if (indicator) {
      parts.push(`使用 ${indicator} 判断趋势`)
    }
  }

  // 时间周期
  if (formData.value.timeframe) {
    const timeframe = timeframeOptions.find(t => t.value === formData.value.timeframe)?.label
    if (timeframe) {
      parts.push(`时间周期为 ${timeframe}`)
    }
  }

  // 风险管理
  if (formData.value.stop_loss_percentage) {
    parts.push(`止损 ${formData.value.stop_loss_percentage}%`)
  }
  if (formData.value.take_profit_percentage) {
    parts.push(`止盈 ${formData.value.take_profit_percentage}%`)
  }

  // 仓位管理
  if (formData.value.max_position_size) {
    const sizeText = formData.value.position_size_type === 'percent'
      ? `${formData.value.max_position_size}%`
      : `${formData.value.max_position_size} USDT`
    parts.push(`最大仓位 ${sizeText}`)
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

// 表单验证
const isFormValid = computed(() => {
  // 基础必填项
  const hasBasicFields = formData.value.exchange_api &&
                         formData.value.token &&
                         formData.value.max_position_size > 0 &&
                         formData.value.stop_loss_percentage > 0

  // 信号机器人现在是可选的，趋势跟踪机器人可以独立运行
  return hasBasicFields
})

// 获取系统风控的止损百分比
const systemStopLossPercentage = computed(() => {
  try {
    const tradingPrefs = JSON.parse(localStorage.getItem('trading_preferences') || '{}')
    return tradingPrefs.stopLoss || 50
  } catch (error) {
    console.warn('⚠️ 获取系统风控止损百分比失败:', error)
    return 50
  }
})

// 获取系统风控的最大头寸大小
const systemMaxPositionSize = computed(() => {
  try {
    const tradingPrefs = JSON.parse(localStorage.getItem('trading_preferences') || '{}')
    return tradingPrefs.maxPositionSize || 5000
  } catch (error) {
    console.warn('⚠️ 获取系统风控最大头寸大小失败:', error)
    return 5000
  }
})

// 动态加载的计价币种列表
const quoteAssetsList = ref([])

// 可用的计价币种选项（从后端动态加载）
const availableQuoteAssets = computed(() => {
  // 如果还没有加载，返回空数组
  if (quoteAssetsList.value.length === 0) {
    return []
  }

  // 如果没有选中代币，返回所有选项
  if (!selectedToken.value || !selectedToken.value.symbol) {
    return quoteAssetsList.value
  }

  // 过滤掉与代币符号相同的计价币种
  const tokenSymbol = selectedToken.value.symbol.toUpperCase()
  return quoteAssetsList.value.filter(option => option.value !== tokenSymbol)
})

// 加载计价币种列表
const loadQuoteAssets = async () => {
  if (!selectedExchangeType.value || !formData.value.market_type) {
    quoteAssetsList.value = []
    return
  }

  try {
    const tokenSymbol = selectedToken.value?.symbol || ''
    const response = await apiRequest(
      `${API_ENDPOINTS.TOKEN_LIST}quote_assets/?exchange=${selectedExchangeType.value}&market_type=${formData.value.market_type}&token_symbol=${tokenSymbol}`
    )

    if (response.status === 'success') {
      quoteAssetsList.value = response.data.quote_assets
      console.log('✅ 加载计价币种列表:', quoteAssetsList.value)

      // 如果当前选择的计价币种不在列表中，自动选择第一个
      if (formData.value.trading_pair) {
        const isValid = quoteAssetsList.value.some(qa => qa.value === formData.value.trading_pair)
        if (!isValid && quoteAssetsList.value.length > 0) {
          formData.value.trading_pair = quoteAssetsList.value[0].value
          console.log(`⚠️ 当前计价币种不可用，自动切换到 ${formData.value.trading_pair}`)
        }
      } else if (quoteAssetsList.value.length > 0) {
        // 如果没有选择计价币种，默认选择第一个
        formData.value.trading_pair = quoteAssetsList.value[0].value
      }
    }
  } catch (error) {
    console.error('❌ 加载计价币种列表失败:', error)
    quoteAssetsList.value = []
  }
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

// 监听市场类型变化，清空代币选择并重新加载计价币种
watch(() => formData.value.market_type, (newMarketType, oldMarketType) => {
  // 只有在市场类型真正改变时才清空
  // 并且不在编辑模式加载数据期间清空
  if (oldMarketType && newMarketType !== oldMarketType && !isLoadingBotData.value) {
    console.log('📊 市场类型变化:', oldMarketType, '->', newMarketType)

    // 清空代币选择
    formData.value.token = null
    tokenSearchQuery.value = ''
    tokenSearchResults.value = []
    selectedToken.value = null
    showTokenResults.value = false

    // 重新加载计价币种列表
    loadQuoteAssets()
  }
})

// 监听代币变化，重新加载计价币种（排除与代币相同的）
watch(selectedToken, () => {
  loadQuoteAssets()
})

// 获取交易所统计信息
const loadExchangeStats = async (exchange) => {
  if (!exchange) {
    exchangeStats.value = { total: 0, spot: 0, linear: 0, inverse: 0 }
    return
  }

  try {
    const response = await apiRequest(
      `${API_ENDPOINTS.TOKEN_LIST}exchange_stats/?exchange=${exchange}`
    )

    if (response.status === 'success') {
      exchangeStats.value = response.data
      console.log('✅ 交易所统计信息:', exchangeStats.value)
    }
  } catch (error) {
    console.error('❌ 加载交易所统计信息失败:', error)
    exchangeStats.value = { total: 0, spot: 0, linear: 0, inverse: 0 }
  }
}

// 选择交易所类型
const selectExchangeType = (exchangeType) => {
  selectedExchangeType.value = exchangeType

  // 清空已选择的 API
  formData.value.exchange_api = null
  selectedExchangeAPI.value = null

  // 重置市场类型为现货
  formData.value.market_type = 'spot'

  // 清空代币选择
  formData.value.token = null
  tokenSearchQuery.value = ''
  tokenSearchResults.value = []
  selectedToken.value = null
  showTokenResults.value = false

  // 清空计价币种
  formData.value.trading_pair = null
  quoteAssetsList.value = []

  // 加载交易所统计信息
  loadExchangeStats(exchangeType)

  // 加载计价币种列表
  loadQuoteAssets()
}

// 加载交易所列表和 API
const loadExchangeAPIs = async () => {
  try {
    // 加载支持的交易所列表（包含 Logo）
    const exchangesResponse = await exchangeAPI.getSupportedExchanges()
    console.log('📊 交易所列表响应:', exchangesResponse)
    if (exchangesResponse.success) {
      availableExchangeTypes.value = exchangesResponse.data
      console.log('✅ 加载交易所列表成功:', availableExchangeTypes.value)
    } else {
      console.warn('⚠️ 交易所列表加载失败:', exchangesResponse)
    }

    // 加载用户的交易所账号
    const response = await exchangeAPI.getExchangeList()
    console.log('📊 用户交易所 API 响应:', response)
    // 只显示激活状态的 API
    exchangeAPIs.value = response.data.filter(api => api.status === 'active')
    console.log('✅ 过滤后的交易所 API:', exchangeAPIs.value)
  } catch (error) {
    console.error('❌ 加载交易所 API 失败:', error)
    showError('加载交易所 API 失败: ' + error.message)
  }
}

// 跳转到交易所设置
const goToExchangeSettings = () => {
  router.push('/exchanges')
}

// 获取交易所 Logo（从 availableExchangeTypes 中查找）
const getExchangeLogo = (exchange) => {
  const exchangeData = availableExchangeTypes.value.find(ex => ex.value === exchange)
  return exchangeData?.logo || '/dex/gate.png'
}

// 获取交易所标签（从 availableExchangeTypes 中查找）
const getExchangeLabel = (exchange) => {
  const exchangeData = availableExchangeTypes.value.find(ex => ex.value === exchange)
  return exchangeData?.label || exchange
}

// 获取余额显示（根据市场类型显示对应余额）
const getBalanceDisplay = (api) => {
  if (!api.balance_snapshot || Object.keys(api.balance_snapshot).length === 0) {
    return '-'
  }

  const marketType = formData.value.market_type || 'spot'

  // 根据市场类型获取对应的余额
  let balance = null

  if (marketType === 'spot') {
    // 现货余额
    if (api.balance_snapshot.spot?.USDT) {
      balance = api.balance_snapshot.spot.USDT.total || api.balance_snapshot.spot.USDT.free || api.balance_snapshot.spot.USDT
    }
  } else if (marketType === 'linear') {
    // USDT 永续合约余额
    if (api.balance_snapshot.linear?.USDT) {
      balance = api.balance_snapshot.linear.USDT.total || api.balance_snapshot.linear.USDT.wallet_balance || api.balance_snapshot.linear.USDT
    } else if (api.balance_snapshot.future?.USDT) {
      balance = api.balance_snapshot.future.USDT.total || api.balance_snapshot.future.USDT.wallet_balance || api.balance_snapshot.future.USDT
    }
  } else if (marketType === 'inverse') {
    // 币本位永续合约余额（显示 BTC）
    if (api.balance_snapshot.inverse?.BTC) {
      balance = api.balance_snapshot.inverse.BTC.total || api.balance_snapshot.inverse.BTC.wallet_balance || api.balance_snapshot.inverse.BTC
      return balance ? `${Number(balance).toFixed(4)} BTC` : '-'
    }
  }

  // 如果找到余额，显示 USDT
  if (balance !== null && balance !== undefined) {
    return `${Number(balance).toFixed(2)} USDT`
  }

  // 如果有 total_usd 字段，作为备用显示总价值
  if (api.balance_snapshot.total_usd !== undefined) {
    return `$${Number(api.balance_snapshot.total_usd).toFixed(2)}`
  }

  // 如果都没有，返回 '-'
  return '-'
}

// 代币搜索（已废弃，改为直接选择交易对）
// const handleTokenSearch = () => {
//   if (searchTimeout) {
//     clearTimeout(searchTimeout)
//   }
//   if (!selectedExchangeAPI.value) {
//     showError('请先选择交易所 API')
//     return
//   }
//   const query = tokenSearchQuery.value.trim()
//   if (!query || query.length < 1) {
//     tokenSearchResults.value = []
//     showTokenResults.value = false
//     return
//   }
//   showTokenResults.value = true
//   searchingTokens.value = true
//   searchTimeout = setTimeout(async () => {
//     try {
//       const response = await apiRequest(
//         `${API_ENDPOINTS.TOKEN_SEARCH}?q=${encodeURIComponent(query)}&exchange=${selectedExchangeAPI.value.exchange}`
//       )
//       const results = response.data?.results || response.data || []
//       tokenSearchResults.value = Array.isArray(results) ? results : []
//       console.log('✅ 代币搜索成功:', tokenSearchResults.value.length, '个结果')
//     } catch (error) {
//       console.error('搜索代币失败:', error)
//       tokenSearchResults.value = []
//       showError('搜索代币失败: ' + (error.message || '未知错误'))
//     } finally {
//       searchingTokens.value = false
//     }
//   }, 300)
// }

// 选择代币（已废弃，改为直接选择交易对）
// const selectToken = (token) => {
//   selectedToken.value = token
//   formData.value.token = token  // 存储完整的 token 对象，而不仅仅是 ID
//   tokenSearchQuery.value = token.symbol
//   showTokenResults.value = false
//   // 选择代币后，加载该交易所支持的交易对
//   loadTradingPairs()
// }

// 加载交易对列表
const loadTradingPairs = async () => {
  if (!selectedExchangeAPI.value) {
    availableTradingPairs.value = []
    return
  }

  loadingTradingPairs.value = true
  try {
    // 新 API 不需要 token_id，只需要 exchange_api_id 和 market_type
    const response = await apiRequest(
      `${API_ENDPOINTS.TRADING_PAIRS}?exchange_api_id=${selectedExchangeAPI.value.id}&market_type=${formData.value.market_type}`
    )

    if (response.status === 'success' && response.data?.trading_pairs) {
      // 存储完整的交易对对象（包括 symbol, balance, last_price 等）
      availableTradingPairs.value = response.data.trading_pairs

      // 按余额排序（有余额的显示在前面）
      availableTradingPairs.value.sort((a, b) => {
        // 根据市场类型获取余额
        const getBalance = (pair) => {
          if (formData.value.market_type === 'spot') {
            // 现货：如果有基础资产余额，则显示在前面
            return pair.base_balance || 0
          } else if (formData.value.market_type === 'inverse') {
            // 币本位：如果有基础资产保证金，则显示在前面
            return pair.margin_balance || 0
          } else {
            // USDT 合约：如果有计价资产保证金，则显示在前面
            return pair.margin_balance || 0
          }
        }

        const balanceA = getBalance(a)
        const balanceB = getBalance(b)

        // 有余额的显示在前面
        if (balanceB > 0 && balanceA === 0) return 1
        if (balanceA > 0 && balanceB === 0) return -1
        // 同类型按余额从大到小排序
        return balanceB - balanceA
      })

      console.log('✅ 加载交易对成功:', availableTradingPairs.value.length, '个交易对')
      console.log('交易对详情:', availableTradingPairs.value.slice(0, 3))
      console.log('📊 Balance Snapshot:', selectedExchangeAPI.value?.balance_snapshot)
      console.log('📊 Market Type:', formData.value.market_type)
      console.log('📊 User Balances:', formData.value.market_type === 'spot'
        ? selectedExchangeAPI.value?.balance_snapshot?.spot
        : selectedExchangeAPI.value?.balance_snapshot?.future)

      // 如果当前选择的交易对不在支持列表中，重置为第一个支持的交易对
      // 但在编辑模式下，保留原有的 trading_pair，不要重置
      if (!isEditMode.value) {
        const pairSymbols = response.data.trading_pairs.map(p => p.symbol)
        if (!pairSymbols.includes(formData.value.trading_pair)) {
          formData.value.trading_pair = pairSymbols[0] || null
        }
      }
    } else {
      availableTradingPairs.value = []
    }
  } catch (error) {
    console.error('加载交易对失败:', error)
    availableTradingPairs.value = []
    showError('加载交易对失败: ' + (error.message || '未知错误'))
  } finally {
    loadingTradingPairs.value = false
  }
}

// 处理交易对搜索（已废弃，Combobox 自动处理搜索）
// const handleTradingPairSearch = () => {
//   // 搜索时重置计价币种过滤
//   if (tradingPairSearchQuery.value) {
//     selectedQuoteAsset.value = null
//   }
// }

// 快速选择热门代币（已废弃，改为直接选择交易对）
// const quickSelectToken = (symbol) => {
//   if (!selectedExchangeAPI.value) {
//     showError('请先选择交易所 API')
//     return
//   }
//   tokenSearchQuery.value = symbol
//   handleTokenSearch()
// }

// 清空代币选择（已废弃）
// const clearToken = () => {
//   selectedToken.value = null
//   formData.value.token = null
//   tokenSearchQuery.value = ''
//   tokenSearchResults.value = []
// }

// 格式化价格（已废弃，不再需要）
// const formatPrice = (price) => {
//   if (!price) return '0.00'
//   const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
//   if (isNaN(numPrice)) return '0.00'
//   if (numPrice >= 1) return numPrice.toFixed(2)
//   if (numPrice >= 0.01) return numPrice.toFixed(4)
//   return numPrice.toFixed(8)
// }

// 图片加载错误处理
const handleImageError = (e) => {
  if (e.target.dataset.errorHandled) return
  e.target.dataset.errorHandled = 'true'
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjRTJFOEYwIi8+PHBhdGggZD0iTTIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhDMjQuNDE4MyAyOCAyOCAyNC40MTgzIDI4IDIwQzI4IDE1LjU4MTcgMjQuNDE4MyAxMiAyMCAxMloiIGZpbGw9IiM5NEE1QjgiLz48L3N2Zz4='
}

// 检查字段是否超过系统风控限制
const isFieldExceedingLimit = (fieldName) => {
  if (!userRiskConfig.value) return false

  switch (fieldName) {
    case 'max_position_size':
      const positionExceeds = formData.value.max_position_size > userRiskConfig.value.max_position_per_bot
      if (positionExceeds) {
        console.log(`🔍 [max_position_size] 超过限制: ${formData.value.max_position_size} > ${userRiskConfig.value.max_position_per_bot}`)
      }
      return positionExceeds
    case 'leverage':
      return formData.value.leverage > userRiskConfig.value.max_leverage
    case 'max_concurrent_positions':
      return formData.value.max_concurrent_positions > userRiskConfig.value.max_open_positions
    case 'stop_loss_percentage':
      return formData.value.stop_loss_percentage && formData.value.stop_loss_percentage > systemStopLossPercentage.value
    case 'max_trades_per_day':
      return formData.value.max_trades_per_day && formData.value.max_trades_per_day > userRiskConfig.value.max_trades_per_day
    case 'max_daily_loss':
      const lossExceeds = formData.value.max_daily_loss && formData.value.max_daily_loss > userRiskConfig.value.max_daily_loss
      if (lossExceeds) {
        console.log(`🔍 [max_daily_loss] 超过限制: ${formData.value.max_daily_loss} > ${userRiskConfig.value.max_daily_loss}`)
      }
      return lossExceeds
    default:
      return false
  }
}

// 获取超出限制的提示文本
const getExceedingLimitText = (fieldName) => {
  if (!userRiskConfig.value) return ''

  switch (fieldName) {
    case 'max_position_size':
      return `已超出最大设置 ${userRiskConfig.value.max_position_per_bot} USDT`
    case 'leverage':
      return `已超出最大设置 ${userRiskConfig.value.max_leverage}x`
    case 'max_concurrent_positions':
      return `已超出最大设置 ${userRiskConfig.value.max_open_positions} 个`
    case 'stop_loss_percentage':
      return `已超出最大设置 ${systemStopLossPercentage.value}%`
    case 'max_trades_per_day':
      return `已超出最大设置 ${userRiskConfig.value.max_trades_per_day} 次/天`
    case 'max_daily_loss':
      return `已超出最大设置 ${userRiskConfig.value.max_daily_loss} USDT/天`
    default:
      return ''
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!isFormValid.value) {
    showError('请填写所有必填项')
    return
  }

  // 信号机器人现在是可选的，趋势跟踪机器人可以独立运行
  // 不再强制要求选择信号机器人

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

  // 验证系统风控限制
  if (userRiskConfig.value) {
    // 验证最大头寸大小
    if (formData.value.max_position_size > userRiskConfig.value.max_position_per_bot) {
      showError(`最大头寸大小不能超过系统限制 ${userRiskConfig.value.max_position_per_bot} USDT`)
      return
    }

    // 验证杠杆倍数
    if (formData.value.leverage > userRiskConfig.value.max_leverage) {
      showError(`杠杆倍数不能超过系统限制 ${userRiskConfig.value.max_leverage}x`)
      return
    }

    // 验证每日最大交易次数
    if (formData.value.max_trades_per_day && formData.value.max_trades_per_day > userRiskConfig.value.max_trades_per_day) {
      showError(`每日最大交易次数不能超过系统限制 ${userRiskConfig.value.max_trades_per_day} 次`)
      return
    }

    // 验证每日最大亏损
    if (formData.value.max_daily_loss && formData.value.max_daily_loss > userRiskConfig.value.max_daily_loss) {
      showError(`每日最大亏损不能超过系统限制 ${userRiskConfig.value.max_daily_loss} USDT`)
      return
    }
  }

  try {
    submitting.value = true
    errors.value = {}

    const submitData = {
      name: formData.value.name || autoGeneratedName.value,
      description: formData.value.description || `${autoGeneratedName.value} - 自动交易策略`,
      bot_type: 'trend_following',
      trading_mode: formData.value.trading_mode,
      signal_bot: formData.value.signal_bot,
      exchange_api: formData.value.exchange_api,
      token: typeof formData.value.token === 'object' ? formData.value.token.id : formData.value.token,
      trading_pair: formData.value.trading_pair,
      timeframe: formData.value.timeframe,
      trend_indicator: formData.value.trend_indicator,  // 向后兼容
      trend_indicators: formData.value.trend_indicators,  // 新字段：多选指标
      market_type: formData.value.market_type,
      max_position_size: formData.value.max_position_size,
      leverage: formData.value.leverage,
      max_concurrent_positions: formData.value.max_concurrent_positions,
      max_trades_per_day: formData.value.max_trades_per_day,
      max_daily_loss: formData.value.max_daily_loss,
      stop_loss_percentage: formData.value.stop_loss_percentage,
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
      // ============ 执行策略参数 ============
      entry_mode: formData.value.entry_mode,
      entry_price_offset: formData.value.entry_price_offset,
      slippage_limit: formData.value.slippage_limit,
      order_retry: formData.value.order_retry,
      order_expire_time: formData.value.order_expire_time,
      // ============ 仓位管理参数 ============
      position_size_type: formData.value.position_size_type,
      auto_reverse: formData.value.auto_reverse,
      max_position_time: formData.value.max_position_time,
      // ============ 高级功能参数 ============
      funding_fee_check: formData.value.funding_fee_check,
      pause_on_high_volatility: formData.value.pause_on_high_volatility,
      volatility_threshold: formData.value.volatility_threshold,
      allow_partial_close: formData.value.allow_partial_close,
      smart_exit: formData.value.smart_exit,
      // ============ 通知设置参数 ============
      alert_channels: formData.value.alert_channels,
      alert_on_entry: formData.value.alert_on_entry,
      alert_on_exit: formData.value.alert_on_exit,
      alert_on_error: formData.value.alert_on_error,
      // 合并 config 和 indicator_params
      config: {
        ...formData.value.config,
        ...formData.value.indicator_params
      }
    }

    // 打印发送的数据用于调试
    console.log('='*80)
    console.log('📤 [提交前] formData.trend_indicators:', formData.value.trend_indicators)
    console.log('📤 [提交前] submitData.trend_indicators:', submitData.trend_indicators)
    console.log('='*80)
    console.log('📤 发送的数据:')
    console.log('   基础信息:', {
      name: submitData.name,
      exchange_api: submitData.exchange_api,
      trading_pair: submitData.trading_pair,
      market_type: submitData.market_type,
      signal_bot: submitData.signal_bot
    })
    console.log('   趋势指标:', {
      trend_indicator: submitData.trend_indicator,
      trend_indicators: submitData.trend_indicators,
      trend_indicators_type: typeof submitData.trend_indicators,
      trend_indicators_isArray: Array.isArray(submitData.trend_indicators),
      trend_indicators_length: submitData.trend_indicators?.length,
      trend_indicators_content: JSON.stringify(submitData.trend_indicators),
      indicator_params: formData.value.indicator_params
    })

    // 如果 trend_indicators 不是预期的数组，暂停执行
    if (!Array.isArray(submitData.trend_indicators) || submitData.trend_indicators.length === 0) {
      console.error('❌ trend_indicators 数据异常！')
      debugger  // 暂停执行，方便调试
    }
    console.log('   风险管理:', {
      max_position_size: submitData.max_position_size,
      stop_loss_percentage: submitData.stop_loss_percentage,
      take_profit_percentage: submitData.take_profit_percentage
    })
    console.log('   执行策略:', {
      entry_mode: submitData.entry_mode,
      entry_price_offset: submitData.entry_price_offset,
      slippage_limit: submitData.slippage_limit,
      order_retry: submitData.order_retry,
      order_expire_time: submitData.order_expire_time
    })
    console.log('   仓位管理:', {
      position_size_type: submitData.position_size_type,
      auto_reverse: submitData.auto_reverse,
      max_position_time: submitData.max_position_time
    })
    console.log('   高级功能:', {
      funding_fee_check: submitData.funding_fee_check,
      pause_on_high_volatility: submitData.pause_on_high_volatility,
      volatility_threshold: submitData.volatility_threshold,
      allow_partial_close: submitData.allow_partial_close,
      smart_exit: submitData.smart_exit
    })
    console.log('   通知设置:', {
      alert_channels: submitData.alert_channels,
      alert_on_entry: submitData.alert_on_entry,
      alert_on_exit: submitData.alert_on_exit,
      alert_on_error: submitData.alert_on_error
    })

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

// 跳转到用户中心的风险偏好设置
const navigateToRiskPreference = () => {
  // 获取当前页面的完整路径作为返回 URL
  const currentPath = route.fullPath
  router.push(`/settings?tab=risk&return=${encodeURIComponent(currentPath)}`)
}

// Click outside directive（已废弃，不再需要）
// const handleClickOutside = (event) => {
//   const searchContainer = event.target.closest('.token-search-container')
//   if (!searchContainer) {
//     showTokenResults.value = false
//   }
// }

// 监听交易所 API 变化，清空代币选择
watch(() => selectedExchangeAPI.value, () => {
  if (selectedExchangeAPI.value && selectedExchangeAPI.value.id) {
    // 只在非编辑模式下重置选择（编辑模式下应该保留原有选择）
    // 并且不在加载机器人数据期间重置
    if (!isEditMode.value && !isLoadingBotData.value) {
      formData.value.trading_pair = null
      // 清空代币选择
      formData.value.token = null
      tokenSearchQuery.value = ''
      tokenSearchResults.value = []
      selectedToken.value = null
      showTokenResults.value = false
    }
  }
})

// 监听市场类型变化，清空代币选择
watch(() => formData.value.market_type, () => {
  if (selectedExchangeAPI.value && selectedExchangeAPI.value.id) {
    // 只在非编辑模式下重置选择（编辑模式下应该保留原有选择）
    // 并且不在加载机器人数据期间重置
    if (!isEditMode.value && !isLoadingBotData.value) {
      formData.value.trading_pair = null
      // 清空代币选择
      formData.value.token = null
      tokenSearchQuery.value = ''
      tokenSearchResults.value = []
      selectedToken.value = null
      showTokenResults.value = false
    }
  }
})

onMounted(async () => {
  // 第一步：加载交易所 API 列表（必须先加载，以便后续能找到对应的 API 对象）
  await loadExchangeAPIs()

  // 第二步：加载系统风控配置
  await loadUserRiskConfig()

  // 第三步：如果是编辑模式，加载机器人数据
  if (isEditMode.value) {
    try {
      loading.value = true
      isLoadingBotData.value = true  // 开始加载数据
      const response = await botAPI.getBotDetail(botId.value)
      // DRF 直接返回数据对象，不需要取 .data
      const bot = response

      console.log('📥 从后端加载的原始数据:', {
        exchange_api: bot.exchange_api,
        exchange_api_type: typeof bot.exchange_api,
        trading_pair: bot.trading_pair,
        market_type: bot.market_type,
        market_type_type: typeof bot.market_type,
        trend_following_bot: bot.trend_following_bot
      })

      // 先设置交易所类型和 API
      // 注意：exchange_api 现在是一个 ID（整数），不是对象
      if (bot.exchange_api) {
        // 从 exchangeAPIs 中找到对应的 API 对象
        const exchangeAPI = exchangeAPIs.value.find(api => api.id === bot.exchange_api)
        if (exchangeAPI) {
          selectedExchangeType.value = exchangeAPI.exchange
          selectedExchangeAPI.value = exchangeAPI
          console.log('✅ 找到交易所 API:', exchangeAPI)
        } else {
          console.warn('⚠️ 找不到交易所 API，ID:', bot.exchange_api)
        }
      }

      // 填充表单数据
      formData.value.name = bot.name
      formData.value.description = bot.description
      formData.value.exchange_api = bot.exchange_api  // 直接使用 ID
      formData.value.token = bot.token  // 存储 token ID
      // 清理 trading_pair：移除前面的斜杠（兼容旧数据）
      formData.value.trading_pair = bot.trading_pair ? bot.trading_pair.replace(/^\//, '') : null
      formData.value.timeframe = bot.timeframe
      // 确保数字字段转换为 Number 类型
      formData.value.leverage = Number(bot.leverage) || 1
      formData.value.market_type = bot.market_type || 'spot'  // 添加市场类型
      formData.value.max_concurrent_positions = bot.max_concurrent_positions ? Number(bot.max_concurrent_positions) : 1
      formData.value.max_trades_per_day = bot.max_trades_per_day ? Number(bot.max_trades_per_day) : null
      formData.value.max_daily_loss = bot.max_daily_loss ? Number(bot.max_daily_loss) : null

      // 设置选中的代币
      // 后端返回的 token 是 ID，需要使用 token_symbol 和 token_name 构建对象
      console.log('📥 [编辑模式] 代币数据:', {
        token: bot.token,
        token_symbol: bot.token_symbol,
        token_name: bot.token_name,
        token_logo: bot.token_logo,
        token_current_price: bot.token_current_price,
        trading_pair: bot.trading_pair
      })

      // 只要有 token_symbol，就设置 selectedToken（即使 bot.token 为 null）
      if (bot.token_symbol) {
        selectedToken.value = {
          id: bot.token || null,  // token 可能是 ID 或 null
          symbol: bot.token_symbol,
          name: bot.token_name || bot.token_symbol,
          logo: bot.token_logo || '',
          current_price: bot.token_current_price || 0
        }
        tokenSearchQuery.value = bot.token_name ? `${bot.token_symbol} - ${bot.token_name}` : bot.token_symbol
        console.log('✅ [编辑模式] 设置 selectedToken:', selectedToken.value)
        console.log('✅ [编辑模式] 交易对显示:', `${selectedToken.value.symbol}/${bot.trading_pair}`)
      } else {
        console.warn('⚠️ [编辑模式] 缺少 token_symbol，无法设置 selectedToken')
      }

      console.log('📥 [编辑模式] 加载的表单数据:')
      console.log(`   - max_daily_loss: ${formData.value.max_daily_loss} (${typeof formData.value.max_daily_loss})`)
      console.log(`   - userRiskConfig.max_daily_loss: ${userRiskConfig.value?.max_daily_loss} (${typeof userRiskConfig.value?.max_daily_loss})`)
      console.log(`   - 是否超过限制: ${formData.value.max_daily_loss > userRiskConfig.value?.max_daily_loss}`)

      // 填充趋势跟踪机器人特定字段
      if (bot.trend_following_bot) {
        const trendBot = bot.trend_following_bot
        // 基础字段 - 确保数字类型转换
        formData.value.max_position_size = Number(trendBot.max_position_size)
        formData.value.stop_loss_percentage = Number(trendBot.stop_loss_percentage)
        formData.value.take_profit_percentage = trendBot.take_profit_percentage ? Number(trendBot.take_profit_percentage) : null
        formData.value.take_profit_targets = trendBot.take_profit_targets || []
        formData.value.trend_indicator = trendBot.trend_indicator || 'ma_crossover'
        // 加载多指标数据（向后兼容）
        console.log('📥 [编辑模式] 原始 trend_indicators 数据:', {
          trend_indicators: trendBot.trend_indicators,
          trend_indicators_type: typeof trendBot.trend_indicators,
          trend_indicators_isArray: Array.isArray(trendBot.trend_indicators),
          trend_indicator: trendBot.trend_indicator
        })

        // 确保 trend_indicators 是数组
        if (trendBot.trend_indicators && Array.isArray(trendBot.trend_indicators) && trendBot.trend_indicators.length > 0) {
          formData.value.trend_indicators = trendBot.trend_indicators
        } else if (trendBot.trend_indicator) {
          formData.value.trend_indicators = [trendBot.trend_indicator]
        } else {
          formData.value.trend_indicators = ['ma_crossover']
        }

        console.log('✅ [编辑模式] 设置后的 trend_indicators:', formData.value.trend_indicators)

        // signal_bot 字段已移除，趋势跟踪机器人现在独立运行
        formData.value.signal_bot = null

        // 根据数据设置止盈模式
        if (trendBot.take_profit_targets && trendBot.take_profit_targets.length > 0) {
          takeProfitMode.value = 'multiple'
        } else {
          takeProfitMode.value = 'single'
        }

        // 风险管理字段 - 确保数字类型转换
        formData.value.trailing_stop_enabled = trendBot.trailing_stop_enabled
        formData.value.trailing_stop_trigger = trendBot.trailing_stop_trigger ? Number(trendBot.trailing_stop_trigger) : null
        formData.value.trailing_stop_distance = trendBot.trailing_stop_distance ? Number(trendBot.trailing_stop_distance) : null
        formData.value.breakeven_enabled = trendBot.breakeven_enabled
        formData.value.breakeven_trigger = trendBot.breakeven_trigger ? Number(trendBot.breakeven_trigger) : null
        formData.value.breakeven_offset = trendBot.breakeven_offset ? Number(trendBot.breakeven_offset) : null

        // 订单配置字段 - 确保数字类型转换
        formData.value.entry_order_type = trendBot.entry_order_type
        formData.value.exit_order_type = trendBot.exit_order_type
        formData.value.limit_price_offset = trendBot.limit_price_offset ? Number(trendBot.limit_price_offset) : null
        formData.value.amount_type = trendBot.amount_type
        formData.value.amount_value = trendBot.amount_value ? Number(trendBot.amount_value) : null

        // ============ 执行策略参数（新增）============
        formData.value.entry_mode = trendBot.entry_mode || 'market'
        formData.value.entry_price_offset = trendBot.entry_price_offset || 0
        formData.value.slippage_limit = trendBot.slippage_limit || 0.2
        formData.value.order_retry = trendBot.order_retry || 3
        formData.value.order_expire_time = trendBot.order_expire_time || 300

        // ============ 仓位管理参数（新增）============
        formData.value.position_size_type = trendBot.position_size_type || 'fixed'
        formData.value.auto_reverse = trendBot.auto_reverse || false
        formData.value.max_position_time = trendBot.max_position_time || 86400

        // ============ 高级功能参数（新增）============
        formData.value.funding_fee_check = trendBot.funding_fee_check !== undefined ? trendBot.funding_fee_check : true
        formData.value.pause_on_high_volatility = trendBot.pause_on_high_volatility || false
        formData.value.volatility_threshold = trendBot.volatility_threshold || 5
        formData.value.allow_partial_close = trendBot.allow_partial_close !== undefined ? trendBot.allow_partial_close : true
        formData.value.smart_exit = trendBot.smart_exit || false

        // ============ 通知设置参数（新增）============
        formData.value.alert_channels = trendBot.alert_channels || []
        formData.value.alert_on_entry = trendBot.alert_on_entry !== undefined ? trendBot.alert_on_entry : true
        formData.value.alert_on_exit = trendBot.alert_on_exit !== undefined ? trendBot.alert_on_exit : true
        formData.value.alert_on_error = trendBot.alert_on_error !== undefined ? trendBot.alert_on_error : true

        // 加载 config（包含指标参数）
        if (trendBot.config) {
          formData.value.config = { ...formData.value.config, ...trendBot.config }
        }

        // 加载 indicator_params（从 config 中提取各指标的参数）
        if (trendBot.config) {
          // 为每个指标提取参数
          const config = trendBot.config
          if (config.fast_period !== undefined || config.slow_period !== undefined) {
            formData.value.indicator_params.ma_crossover = {
              fast_period: config.fast_period || 12,
              slow_period: config.slow_period || 26
            }
            formData.value.indicator_params.ema_crossover = {
              fast_period: config.fast_period || 12,
              slow_period: config.slow_period || 26
            }
          }
          if (config.signal_period !== undefined) {
            formData.value.indicator_params.macd = {
              fast_period: config.fast_period || 12,
              slow_period: config.slow_period || 26,
              signal_period: config.signal_period || 9
            }
          }
          if (config.rsi_period !== undefined) {
            formData.value.indicator_params.rsi = {
              rsi_period: config.rsi_period || 14,
              rsi_oversold: config.rsi_oversold || 30,
              rsi_overbought: config.rsi_overbought || 70
            }
          }
          if (config.bollinger_period !== undefined) {
            formData.value.indicator_params.bollinger = {
              bollinger_period: config.bollinger_period || 20,
              bollinger_std: config.bollinger_std || 2
            }
          }
          if (config.adx_period !== undefined) {
            formData.value.indicator_params.adx = {
              adx_period: config.adx_period || 14,
              adx_threshold: config.adx_threshold || 25
            }
          }
          if (config.atr_period !== undefined) {
            formData.value.indicator_params.supertrend = {
              atr_period: config.atr_period || 10,
              atr_multiplier: config.atr_multiplier || 3.0
            }
          }
          if (config.volume_ma_period !== undefined) {
            formData.value.indicator_params.volume = {
              volume_ma_period: config.volume_ma_period || 20,
              volume_threshold: config.volume_threshold || 1.5
            }
          }
        }
      }

      // 代币搜索已废弃，改为直接选择交易对，所以不需要设置 selectedToken

      // 打印加载的数据用于调试
      console.log('✅ 编辑模式 - 加载的机器人数据:')
      console.log('📊 基础信息:', {
        name: formData.value.name,
        exchange_api: formData.value.exchange_api,
        trading_pair: formData.value.trading_pair,
        market_type: formData.value.market_type,
        signal_bot: formData.value.signal_bot
      })
      console.log('📊 趋势指标:', {
        trend_indicators: formData.value.trend_indicators,
        indicator_params: formData.value.indicator_params
      })
      console.log('📊 风险管理:', {
        max_position_size: formData.value.max_position_size,
        stop_loss_percentage: formData.value.stop_loss_percentage,
        take_profit_percentage: formData.value.take_profit_percentage
      })
      console.log('📊 执行策略:', {
        entry_mode: formData.value.entry_mode,
        entry_price_offset: formData.value.entry_price_offset,
        slippage_limit: formData.value.slippage_limit,
        order_retry: formData.value.order_retry,
        order_expire_time: formData.value.order_expire_time
      })
      console.log('📊 仓位管理:', {
        position_size_type: formData.value.position_size_type,
        auto_reverse: formData.value.auto_reverse,
        max_position_time: formData.value.max_position_time
      })
      console.log('📊 高级功能:', {
        funding_fee_check: formData.value.funding_fee_check,
        pause_on_high_volatility: formData.value.pause_on_high_volatility,
        volatility_threshold: formData.value.volatility_threshold,
        allow_partial_close: formData.value.allow_partial_close,
        smart_exit: formData.value.smart_exit
      })
      console.log('📊 通知设置:', {
        alert_channels: formData.value.alert_channels,
        alert_on_entry: formData.value.alert_on_entry,
        alert_on_exit: formData.value.alert_on_exit,
        alert_on_error: formData.value.alert_on_error
      })

      // 第四步：加载交易对列表（必须在设置了 selectedExchangeAPI 之后）
      if (selectedExchangeAPI.value) {
        console.log('📥 开始加载交易对列表...')
        await loadTradingPairs()
        console.log('✅ 交易对列表加载完成')
      }

      // 第五步：验证数据是否正确加载
      console.log('🔍 [编辑模式] 最终数据验证:')
      console.log('  - tokenSearchQuery:', tokenSearchQuery.value)
      console.log('  - selectedToken:', selectedToken.value)
      console.log('  - formData.token:', formData.value.token)
      console.log('  - formData.trading_pair:', formData.value.trading_pair)
      console.log('  - formData.market_type:', formData.value.market_type)
      console.log('  - availableQuoteAssets:', availableQuoteAssets.value)

      // 验证 Select 组件能否找到匹配的选项
      const matchedOption = availableQuoteAssets.value.find(opt => opt.value === formData.value.trading_pair)
      console.log('  - Select 组件匹配的选项:', matchedOption)
    } catch (error) {
      console.error('加载机器人数据失败:', error)
      showError('加载机器人数据失败')
      router.push('/bots?type=trend_following')
    } finally {
      loading.value = false
      isLoadingBotData.value = false  // 数据加载完成
    }
  }
})

// 监听交易所类型变化
watch(() => selectedExchangeType.value, () => {
  // 只在非编辑模式下清空数据（编辑模式下应该保留原有选择）
  if (!isEditMode.value) {
    // 清空之前选择的账号
    formData.value.exchange_api = null
    selectedExchangeAPI.value = null
    // 清空交易对选择
    availableTradingPairs.value = []
    formData.value.trading_pair = null
    tradingPairSearchQuery.value = ''
  }
})

// 监听交易所账号变化
watch(() => formData.value.exchange_api, (newApiId) => {
  if (newApiId) {
    // 从 filteredExchangeAPIs 中查找对应的 API
    const foundApi = filteredExchangeAPIs.value.find(api => api.id === newApiId)
    if (foundApi) {
      selectedExchangeAPI.value = foundApi
    } else if (!isEditMode.value) {
      // 只在创建模式下设置为 null，编辑模式下保留原有值
      selectedExchangeAPI.value = null
    }
  }
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  // handleClickOutside 已废弃，不需要移除
})
</script>

<style scoped>
.token-search-container {
  position: relative;
}
</style>


