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

          <!-- 第1步: 关联信号机器人 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-semibold text-slate-900">关联信号机器人</div>
                <div class="text-xs text-slate-500">选择一个信号机器人来接收交易信号</div>
              </div>
            </div>

            <div class="space-y-4">
              <!-- 信号机器人选择 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  信号机器人 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.signal_bot"
                  @change="handleSignalBotChange"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">请选择信号机器人</option>
                  <option
                    v-for="bot in availableSignalBots"
                    :key="bot.id"
                    :value="bot.signal_bot"
                  >
                    {{ bot.name }} ({{ bot.token_symbol }})
                  </option>
                </select>
                <p v-if="errors.signal_bot" class="mt-1 text-sm text-red-500">{{ errors.signal_bot }}</p>
              </div>

              <!-- 如果没有可用的信号机器人 -->
              <div v-if="availableSignalBots.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex gap-3">
                  <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div class="text-sm text-yellow-800">
                    <p class="font-medium mb-1">暂无可用的信号机器人</p>
                    <p class="text-yellow-700">请先创建一个信号机器人，然后再创建趋势跟踪机器人。</p>
                    <button
                      @click="$router.push('/bots/create-signal')"
                      class="mt-2 text-yellow-800 font-medium hover:text-yellow-900 underline"
                    >
                      立即创建信号机器人 →
                    </button>
                  </div>
                </div>
              </div>

              <!-- 继承的配置信息 -->
              <div v-if="selectedSignalBot" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  从信号机器人继承的配置
                </div>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="flex justify-between">
                    <span class="text-slate-600">交易所:</span>
                    <span class="font-medium text-slate-900">{{ selectedSignalBot.exchange_name || '-' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">代币:</span>
                    <span class="font-medium text-slate-900">{{ selectedSignalBot.token_symbol || '-' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">时间周期:</span>
                    <span class="font-medium text-slate-900">{{ selectedSignalBot.timeframe || '-' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">信号类型:</span>
                    <span class="font-medium text-slate-900">{{ getSignalTypeLabel(selectedSignalBot.signal_type) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- 第2步: 交易所配置 -->
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
                <div class="text-xs text-slate-500">选择交易所账号和交易对</div>
              </div>
            </div>

            <div class="space-y-6">
              <!-- 交易所账号 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-slate-700">
                    交易所账号 <span class="text-red-500">*</span>
                  </label>
                  <button
                    v-if="availableExchangeAPIs.length === 0"
                    type="button"
                    @click="goToExchangeSettings"
                    class="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    添加交易所 API
                  </button>
                </div>
                <Listbox v-model="formData.exchange_api" :disabled="availableExchangeAPIs.length === 0">
                  <div class="relative">
                    <ListboxButton :class="[
                      'relative w-full cursor-default rounded-lg py-2.5 pl-4 pr-10 text-left border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                      availableExchangeAPIs.length === 0
                        ? 'bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'bg-white hover:border-slate-400'
                    ]">
                      <div class="flex items-center gap-2">
                        <img
                          v-if="selectedExchangeAPI"
                          :src="getExchangeLogo(selectedExchangeAPI.exchange)"
                          :alt="selectedExchangeAPI.exchange"
                          class="w-5 h-5 rounded object-contain"
                          @error="handleImageError"
                        />
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2">
                            <span class="block truncate text-sm text-slate-700">
                              {{ selectedExchangeAPI?.name || '请选择交易所账号' }}
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
                              {{ selectedExchangeAPI.is_testnet ? '模拟' : '真实' }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                      <ListboxOptions v-if="availableExchangeAPIs.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <ListboxOption
                          v-slot="{ active, selected }"
                          v-for="api in availableExchangeAPIs"
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

              <!-- 市场类型和计价币种 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 市场类型 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    市场类型 <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="type in [
                        { value: 'spot', label: '现货', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { value: 'linear', label: '合约-USDT', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
                      ]"
                      :key="type.value"
                      @click="formData.market_type = type.value"
                      :class="[
                        'flex items-center justify-center gap-2 p-3 rounded-lg text-center transition-all border-2 text-sm font-medium',
                        formData.market_type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      ]"
                      type="button"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon" />
                      </svg>
                      {{ type.label }}
                    </button>
                  </div>
                  <p v-if="errors.market_type" class="mt-1 text-sm text-red-500">{{ errors.market_type }}</p>
                </div>

                <!-- 计价币种 -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    计价币种 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.trading_pair"
                    :disabled="availableQuoteAssets.length === 0"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:opacity-50"
                  >
                    <option v-if="availableQuoteAssets.length === 0" :value="null">请先选择交易所和市场类型</option>
                    <option
                      v-for="asset in availableQuoteAssets"
                      :key="asset.value"
                      :value="asset.value"
                    >
                      {{ asset.label }}
                    </option>
                  </select>
                  <p v-if="errors.trading_pair" class="mt-1 text-sm text-red-500">{{ errors.trading_pair }}</p>
                </div>
              </div>

            </div>
          </Card>



          <!-- 第3步: 信号执行策略 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-semibold text-slate-900">信号执行策略</div>
                <div class="text-xs text-slate-500">配置如何执行交易信号</div>
              </div>
            </div>

            <div class="space-y-6">
              <!-- 信号执行模式 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-3">信号执行模式</label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="mode in [
                      { value: 'immediate', label: '立即执行', desc: '收到信号后立即执行' },
                      { value: 'delayed', label: '延迟执行', desc: '延迟一段时间执行' },
                      { value: 'scheduled', label: '定时执行', desc: '在指定时间执行' }
                    ]"
                    :key="mode.value"
                    type="button"
                    @click="formData.signal_execution_mode = mode.value"
                    :class="[
                      'p-3 rounded-lg text-center transition-all border-2',
                      formData.signal_execution_mode === mode.value
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300'
                    ]"
                  >
                    <div class="font-medium text-sm">{{ mode.label }}</div>
                    <div class="text-xs mt-1 opacity-75">{{ mode.desc }}</div>
                  </button>
                </div>
              </div>

              <!-- 信号强度阈值 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  信号强度阈值: {{ formData.signal_strength_threshold }}%
                </label>
                <input
                  v-model.number="formData.signal_strength_threshold"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <p class="mt-2 text-xs text-slate-500">只执行强度大于此值的信号</p>
              </div>

              <!-- 延迟执行参数 -->
              <div v-if="formData.signal_execution_mode === 'delayed'" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-slate-700 mb-2">延迟时间（秒）</label>
                <input
                  v-model.number="formData.signal_delay_seconds"
                  type="number"
                  min="1"
                  max="3600"
                  placeholder="60"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p class="mt-1 text-xs text-slate-500">收到信号后延迟多少秒执行</p>
              </div>

              <!-- 定时执行参数 -->
              <div v-if="formData.signal_execution_mode === 'scheduled'" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-slate-700 mb-2">执行时间点</label>
                <input
                  v-model="formData.signal_scheduled_time"
                  type="time"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p class="mt-1 text-xs text-slate-500">每天在指定时间执行收到的信号</p>
              </div>

              <!-- 信号确认K线数和过期时间 -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">信号确认K线数</label>
                  <input
                    v-model.number="formData.signal_confirmation_bars"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p class="mt-1 text-xs text-slate-500">需要几根K线确认</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">信号过期时间（小时）</label>
                  <input
                    v-model.number="formData.signal_expiration_hours"
                    type="number"
                    min="1"
                    max="168"
                    placeholder="24"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p class="mt-1 text-xs text-slate-500">信号多久后过期</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">每日最大信号数</label>
                  <input
                    v-model.number="formData.max_signals_per_day"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p class="mt-1 text-xs text-slate-500">每天最多处理信号</p>
                </div>
              </div>
            </div>
          </Card>

          <!-- 仓位管理配置 -->
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

              <!-- 自动反向开仓（仅合约交易显示）-->
              <div v-if="formData.market_type === 'linear' || formData.market_type === 'inverse'" class="border-t border-slate-200 pt-6 mt-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">自动反向开仓</h3>
                    <p class="text-xs text-slate-500 mt-1">持仓超时后自动反向开仓（仅合约）</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="formData.auto_reverse"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div v-if="formData.auto_reverse" class="space-y-4 pl-4 border-l-2 border-blue-200">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大持仓时间（小时）
                    </label>
                    <input
                      v-model.number="formData.max_position_time"
                      type="number"
                      min="1"
                      max="168"
                      placeholder="24"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">持仓超过此时间后自动平仓并反向开仓</p>
                  </div>
                </div>
              </div>

              <!-- 检查资金费率（仅合约交易显示）-->
              <div v-if="formData.market_type === 'linear' || formData.market_type === 'inverse'" class="border-t border-slate-200 pt-6 mt-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">检查资金费率</h3>
                    <p class="text-xs text-slate-500 mt-1">资金费率过高时避免开仓（仅合约）</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="formData.funding_fee_check"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div v-if="formData.funding_fee_check" class="space-y-4 pl-4 border-l-2 border-purple-200">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      资金费率阈值（%）
                    </label>
                    <input
                      v-model.number="formData.funding_fee_threshold"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="0.01"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">资金费率超过此值时不开仓</p>
                  </div>
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
                  <h2 class="text-lg font-semibold text-slate-900">交易策略配置</h2>
                  <p class="text-sm text-slate-500">配置仓位管理、风险控制和止盈止损策略</p>
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
              <!-- 1. 持仓管理 -->
              <div>
                <div class="mb-4">
                  <h3 class="text-sm font-semibold text-slate-900">持仓管理</h3>
                  <p class="text-xs text-slate-500 mt-1">控制同时持有的仓位数量和交易频率</p>
                </div>
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
                    v-model.number="formData.max_open_positions"
                    type="number"
                    step="1"
                    min="1"
                    max="10"
                    placeholder="1"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('max_open_positions')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.max_open_positions" class="mt-1 text-sm text-red-500">{{ errors.max_open_positions }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('max_open_positions')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('max_open_positions') }}
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
                    v-model.number="formData.max_daily_trades"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="10"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('max_daily_trades')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                  />
                  <p v-if="errors.max_daily_trades" class="mt-1 text-sm text-red-500">{{ errors.max_daily_trades }}</p>
                  <!-- 超出限制提示 -->
                  <p v-if="isFieldExceedingLimit('max_daily_trades')" class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded font-medium">
                    ⚠️ {{ getExceedingLimitText('max_daily_trades') }}
                  </p>
                  <!-- 系统风控限制提示 -->
                  <p v-else-if="userRiskConfig" class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span class="font-medium">系统限制:</span> 最多 {{ userRiskConfig.max_daily_trades }} 次/天
                  </p>
                </div>
              </div>
              </div>

              <!-- 2. 风险控制 -->
              <div>
                <div class="mb-4">
                  <h3 class="text-sm font-semibold text-slate-900">风险控制</h3>
                  <p class="text-xs text-slate-500 mt-1">设置每日亏损上限，保护账户安全</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <!-- 杠杆倍数（仅合约） -->
                <div v-if="formData.market_type !== 'spot'">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    杠杆倍数 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="formData.leverage"
                    type="number"
                    min="1"
                    max="125"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2',
                      isFieldExceedingLimit('leverage')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    ]"
                    placeholder="1-125"
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
                </div>
              </div>
              </div>

              <!-- 3. 止盈策略 -->
              <div>
                <div class="mb-4">
                  <h3 class="text-sm font-semibold text-slate-900">止盈策略</h3>
                  <p class="text-xs text-slate-500 mt-1">设置盈利目标，自动锁定利润</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span class="text-xs text-slate-500">💡 盈利后自动上移止损位，锁定利润</span>
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

              <!-- 盈亏平衡 -->
              <div class="border-t border-slate-200 pt-6">
                <label class="flex items-center gap-2 mb-3">
                  <input
                    v-model="formData.breakeven_enabled"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-slate-700">启用盈亏平衡</span>
                  <span class="text-xs text-slate-500">💡 盈利达标后将止损移至成本价，避免亏损</span>
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

              <!-- 4. 初始止损设置 -->
              <div class="border-t border-slate-200 pt-6 mt-6">
                <div class="mb-4">
                  <h3 class="text-sm font-semibold text-slate-900">初始止损设置</h3>
                  <p class="text-xs text-slate-500 mt-1">决定入场后第一次设置止损位的方式</p>
                </div>

                <div class="space-y-4">
                  <!-- 止损类型选择 -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-3">
                      止损类型 <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        v-for="stopType in [
                          { value: 'fixed', label: '固定百分比', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                          { value: 'atr', label: 'ATR动态', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
                          { value: 'time', label: '时间止损', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                          { value: 'technical', label: '技术止损', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
                        ]"
                        :key="stopType.value"
                        type="button"
                        @click="formData.stop_loss_type = stopType.value"
                        :class="[
                          'relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                          formData.stop_loss_type === stopType.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        ]"
                      >
                        <svg class="w-5 h-5 mb-1.5" :class="formData.stop_loss_type === stopType.value ? 'text-red-600' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stopType.icon" />
                        </svg>
                        <span class="text-xs font-medium" :class="formData.stop_loss_type === stopType.value ? 'text-red-900' : 'text-slate-700'">
                          {{ stopType.label }}
                        </span>
                        <div v-if="formData.stop_loss_type === stopType.value" class="absolute top-1.5 right-1.5">
                          <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- 固定百分比参数 -->
                  <div v-if="formData.stop_loss_type === 'fixed'" class="pl-4 border-l-2 border-red-200">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      止损百分比 (%) <span class="text-red-500">*</span>
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
                    <p v-else class="mt-1 text-xs text-slate-500">
                      价格下跌超过此百分比时自动止损（系统限制: 最多 {{ systemStopLossPercentage }}%）
                    </p>
                  </div>

                  <!-- ATR 参数 -->
                  <div v-if="formData.stop_loss_type === 'atr'" class="grid grid-cols-2 gap-4 pl-4 border-l-2 border-red-200">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        ATR 周期
                      </label>
                      <input
                        v-model.number="formData.atr_period"
                        type="number"
                        min="5"
                        max="50"
                        placeholder="14"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">通常使用14周期</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        ATR 倍数
                      </label>
                      <input
                        v-model.number="formData.atr_multiplier"
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.1"
                        placeholder="2.0"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">止损距离 = ATR × 倍数</p>
                    </div>
                  </div>

                  <!-- 时间止损参数 -->
                  <div v-if="formData.stop_loss_type === 'time'" class="pl-4 border-l-2 border-red-200">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      持仓时间限制 (小时)
                    </label>
                    <input
                      v-model.number="formData.time_stop_hours"
                      type="number"
                      min="1"
                      max="168"
                      placeholder="24"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">超过此时间自动平仓，避免长期套牢</p>
                  </div>

                  <!-- 技术止损参数 -->
                  <div v-if="formData.stop_loss_type === 'technical'" class="pl-4 border-l-2 border-red-200">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">
                          技术指标类型 <span class="text-red-500">*</span>
                        </label>
                        <select
                          v-model="formData.technical_stop_indicator"
                          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">请选择技术指标</option>
                          <option value="support_resistance">支撑/阻力位</option>
                          <option value="moving_average">移动平均线</option>
                          <option value="bollinger_bands">布林带</option>
                          <option value="parabolic_sar">抛物线SAR</option>
                        </select>
                        <p class="mt-1 text-xs text-slate-500">根据技术指标动态调整止损位</p>
                      </div>

                      <!-- 支撑/阻力位参数 -->
                      <div v-if="formData.technical_stop_indicator === 'support_resistance'" class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-slate-700 mb-2">
                            回溯周期
                          </label>
                          <input
                            v-model.number="formData.support_resistance_period"
                            type="number"
                            min="10"
                            max="100"
                            placeholder="20"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p class="mt-1 text-xs text-slate-500">查找支撑位的K线数量</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700 mb-2">
                            缓冲百分比 (%)
                          </label>
                          <input
                            v-model.number="formData.support_resistance_buffer"
                            type="number"
                            min="0.1"
                            max="5"
                            step="0.1"
                            placeholder="0.5"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p class="mt-1 text-xs text-slate-500">支撑位下方的安全距离</p>
                        </div>
                      </div>

                      <!-- 移动平均线参数 -->
                      <div v-if="formData.technical_stop_indicator === 'moving_average'" class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-slate-700 mb-2">
                            MA类型
                          </label>
                          <select
                            v-model="formData.ma_type"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="sma">SMA (简单移动平均)</option>
                            <option value="ema">EMA (指数移动平均)</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700 mb-2">
                            MA周期
                          </label>
                          <input
                            v-model.number="formData.ma_period"
                            type="number"
                            min="5"
                            max="200"
                            placeholder="20"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p class="mt-1 text-xs text-slate-500">价格跌破MA时止损</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. 科学仓位管理 -->
              <div class="border-t border-slate-200 pt-6 mt-6">
                <div class="mb-4">
                  <h3 class="text-sm font-semibold text-slate-900">科学仓位管理</h3>
                  <p class="text-xs text-slate-500 mt-1">决定每笔交易投入多少资金</p>
                </div>

                <div class="space-y-4">
                  <!-- 仓位计算方法 -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-3">
                      仓位计算方法
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        v-for="method in [
                          { value: 'fixed_amount', label: '固定金额', desc: '每次固定金额' },
                          { value: 'fixed_risk', label: '固定风险', desc: '每次风险1%' },
                          { value: 'kelly', label: '凯利公式', desc: '最优仓位' },
                          { value: 'atr_based', label: 'ATR调整', desc: '波动率调整' }
                        ]"
                        :key="method.value"
                        type="button"
                        @click="formData.position_sizing_method = method.value"
                        :class="[
                          'relative flex flex-col items-start p-3 rounded-lg border-2 transition-all text-left',
                          formData.position_sizing_method === method.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        ]"
                      >
                        <span class="text-sm font-medium mb-0.5" :class="formData.position_sizing_method === method.value ? 'text-blue-900' : 'text-slate-700'">
                          {{ method.label }}
                        </span>
                        <span class="text-xs" :class="formData.position_sizing_method === method.value ? 'text-blue-600' : 'text-slate-500'">
                          {{ method.desc }}
                        </span>
                        <div v-if="formData.position_sizing_method === method.value" class="absolute top-2 right-2">
                          <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- 固定金额参数 -->
                  <div v-if="formData.position_sizing_method === 'fixed_amount'" class="pl-4 border-l-2 border-blue-200">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      每笔交易金额 (USDT)
                    </label>
                    <input
                      v-model.number="formData.position_size_value"
                      type="number"
                      min="10"
                      step="10"
                      placeholder="100"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">每笔交易固定投入的金额</p>
                  </div>

                  <!-- 固定风险参数 -->
                  <div v-if="formData.position_sizing_method === 'fixed_risk'" class="pl-4 border-l-2 border-blue-200">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      每笔交易风险 (%)
                    </label>
                    <input
                      v-model.number="formData.risk_per_trade"
                      type="number"
                      min="0.1"
                      max="5"
                      step="0.1"
                      placeholder="1.0"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">账户总资金的风险百分比，建议0.5-2%</p>
                  </div>

                  <!-- 凯利公式参数 -->
                  <div v-if="formData.position_sizing_method === 'kelly'" class="pl-4 border-l-2 border-blue-200">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      凯利分数
                    </label>
                    <input
                      v-model.number="formData.kelly_fraction"
                      type="number"
                      min="0.1"
                      max="1"
                      step="0.05"
                      placeholder="0.25"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">使用凯利公式的百分比，0.25表示使用25%的凯利值（更保守）</p>
                  </div>

                  <!-- ATR调整参数 -->
                  <div v-if="formData.position_sizing_method === 'atr_based'" class="pl-4 border-l-2 border-blue-200">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">
                          基础仓位 (USDT)
                        </label>
                        <input
                          v-model.number="formData.position_size_value"
                          type="number"
                          min="10"
                          step="10"
                          placeholder="100"
                          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p class="mt-1 text-xs text-slate-500">基础仓位大小，会根据ATR动态调整</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">
                          ATR周期
                        </label>
                        <input
                          v-model.number="formData.atr_period"
                          type="number"
                          min="5"
                          max="50"
                          placeholder="14"
                          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p class="mt-1 text-xs text-slate-500">计算ATR的K线周期数，建议14</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">
                          ATR倍数
                        </label>
                        <input
                          v-model.number="formData.atr_multiplier"
                          type="number"
                          min="0.5"
                          max="5"
                          step="0.5"
                          placeholder="2.0"
                          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p class="mt-1 text-xs text-slate-500">ATR倍数，波动率越大仓位越小</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- 多空方向控制（仅合约交易显示）-->
          <Card v-if="formData.market_type === 'linear' || formData.market_type === 'inverse'" variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">多空方向控制</h2>
                <p class="text-sm text-slate-500">限制交易方向，适应不同市场环境（仅合约）</p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-3">
                  交易方向 <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="direction in [
                      { value: 'both', label: '双向交易', icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4', color: 'indigo' },
                      { value: 'long_only', label: '只做多', icon: 'M5 10l7-7m0 0l7 7m-7-7v18', color: 'green' },
                      { value: 'short_only', label: '只做空', icon: 'M19 14l-7 7m0 0l-7-7m7 7V3', color: 'red' }
                    ]"
                    :key="direction.value"
                    type="button"
                    @click="formData.trading_direction = direction.value"
                    :class="[
                      'relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                      formData.trading_direction === direction.value
                        ? `border-${direction.color}-500 bg-${direction.color}-50`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    ]"
                  >
                    <svg class="w-6 h-6 mb-2" :class="formData.trading_direction === direction.value ? `text-${direction.color}-600` : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="direction.icon" />
                    </svg>
                    <span class="text-sm font-medium" :class="formData.trading_direction === direction.value ? `text-${direction.color}-900` : 'text-slate-700'">
                      {{ direction.label }}
                    </span>
                    <div v-if="formData.trading_direction === direction.value" class="absolute top-2 right-2">
                      <svg class="w-5 h-5" :class="`text-${direction.color}-600`" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                </div>
                <p class="mt-2 text-xs text-slate-500">
                  <span v-if="formData.trading_direction === 'both'">💡 双向交易：可以做多也可以做空，适合震荡市和趋势市</span>
                  <span v-else-if="formData.trading_direction === 'long_only'">💡 只做多：只开多单，适合牛市或上涨趋势</span>
                  <span v-else-if="formData.trading_direction === 'short_only'">💡 只做空：只开空单，适合熊市或下跌趋势</span>
                </p>
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

              <!-- 加仓/减仓策略 (Pyramiding) -->
              <div class="border-t border-slate-200 pt-6 mt-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">加仓/减仓策略 (Pyramiding)</h3>
                    <p class="text-xs text-slate-500 mt-1">趋势确认后逐步加仓，扩大盈利</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="formData.pyramiding_enabled"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div v-if="formData.pyramiding_enabled" class="space-y-4 pl-4 border-l-2 border-blue-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- 最大加仓次数 -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        最大加仓次数
                      </label>
                      <input
                        v-model.number="formData.max_pyramiding_orders"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="3"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">建议1-5次，过多会增加风险</p>
                    </div>

                    <!-- 加仓比例 -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        加仓比例 (%)
                      </label>
                      <input
                        v-model.number="formData.pyramiding_scale"
                        type="number"
                        min="10"
                        max="100"
                        step="5"
                        placeholder="50"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">相对于初始仓位的百分比</p>
                    </div>

                    <!-- 加仓价格间隔 -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        加仓价格间隔 (%)
                      </label>
                      <input
                        v-model.number="formData.pyramiding_price_distance"
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.5"
                        placeholder="2.0"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">价格变动达到此百分比才加仓</p>
                    </div>

                    <!-- 加仓时间间隔 -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        加仓时间间隔 (秒)
                      </label>
                      <input
                        v-model.number="formData.pyramiding_time_interval"
                        type="number"
                        min="60"
                        step="60"
                        placeholder="3600"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">两次加仓之间的最小时间间隔</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 趋势过滤器 -->
              <div class="border-t border-slate-200 pt-6 mt-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">趋势过滤器</h3>
                    <p class="text-xs text-slate-500 mt-1">避免在震荡市中频繁交易</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="formData.trend_filter_enabled"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div v-if="formData.trend_filter_enabled" class="space-y-4 pl-4 border-l-2 border-purple-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- 最小趋势强度 (ADX) -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        最小趋势强度 (ADX)
                      </label>
                      <input
                        v-model.number="formData.min_trend_strength_adx"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        placeholder="25"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">ADX > 25 表示趋势明显</p>
                    </div>

                    <!-- 最小价格变动 -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        最小价格变动 (%)
                      </label>
                      <input
                        v-model.number="formData.min_price_change"
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        placeholder="1.0"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-slate-500">价格变动小于此值不交易</p>
                    </div>
                  </div>

                  <!-- 成交量确认 -->
                  <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <label class="text-sm font-medium text-slate-700">成交量确认</label>
                      <p class="text-xs text-slate-500 mt-0.5">要求放量突破才入场</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="formData.volume_confirmation_enabled"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <!-- 成交量阈值 -->
                  <div v-if="formData.volume_confirmation_enabled">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      成交量阈值 (倍数)
                    </label>
                    <input
                      v-model.number="formData.volume_threshold"
                      type="number"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      placeholder="1.5"
                      class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p class="mt-1 text-xs text-slate-500">成交量需达到平均值的此倍数</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- 通知设置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">通知设置</h2>
                <p class="text-sm text-slate-500">选择接收交易通知的方式和时机</p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- 通知渠道 -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-3">通知渠道</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    :class="[
                      'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                      formData.alert_channels.includes('email')
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    ]"
                  >
                    <input
                      type="checkbox"
                      :checked="formData.alert_channels.includes('email')"
                      @change="toggleAlertChannel('email')"
                      class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="ml-3 flex-1">
                      <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span class="font-medium text-slate-900">邮件通知</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-1">发送交易通知到您的邮箱</p>
                    </div>
                  </label>

                  <label
                    :class="[
                      'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                      formData.alert_channels.includes('app')
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    ]"
                  >
                    <input
                      type="checkbox"
                      :checked="formData.alert_channels.includes('app')"
                      @change="toggleAlertChannel('app')"
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

              <!-- 通知时机 -->
              <div class="border-t border-slate-200 pt-6">
                <label class="block text-sm font-medium text-slate-700 mb-3">通知时机</label>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      v-model="formData.notify_on_signal"
                      type="checkbox"
                      class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900 text-sm">信号通知</div>
                      <p class="text-xs text-slate-500 mt-0.5">收到交易信号时发送通知</p>
                    </div>
                  </label>

                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      v-model="formData.notify_on_entry"
                      type="checkbox"
                      class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900 text-sm">入场通知</div>
                      <p class="text-xs text-slate-500 mt-0.5">开仓时发送通知</p>
                    </div>
                  </label>

                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      v-model="formData.notify_on_exit"
                      type="checkbox"
                      class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900 text-sm">出场通知</div>
                      <p class="text-xs text-slate-500 mt-0.5">平仓时发送通知</p>
                    </div>
                  </label>

                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      v-model="formData.notify_on_error"
                      type="checkbox"
                      class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900 text-sm">错误通知</div>
                      <p class="text-xs text-slate-500 mt-0.5">发生错误时发送通知</p>
                    </div>
                  </label>
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

                <!-- 交易所配置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">交易所配置</div>
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
                        {{ (selectedToken?.symbol || selectedSignalBot?.token_symbol) && formData.trading_pair ? `${selectedToken?.symbol || selectedSignalBot?.token_symbol}/${formData.trading_pair}` : '-' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">市场类型</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.market_type === 'spot' ? '现货' : formData.market_type === 'linear' ? 'USDT永续' : '币本位永续' }}
                      </span>
                    </div>
                    <!-- 杠杆倍数 - 仅合约显示 -->
                    <div v-if="formData.market_type !== 'spot'" class="flex justify-between text-xs">
                      <span class="text-slate-500">杠杆倍数</span>
                      <span class="font-medium text-orange-600">
                        {{ formData.leverage || 1 }}x
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 信号执行策略 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">信号执行策略</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">执行模式</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.signal_execution_mode === 'immediate' ? '立即执行' :
                           formData.signal_execution_mode === 'delayed' ? '延迟执行' : '定时执行' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">信号强度阈值</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.signal_strength_threshold }}%
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">确认K线数</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.signal_confirmation_bars }} 根
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">信号过期时间</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.signal_expiration_hours }} 小时
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">每日最大信号</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_signals_per_day }} 个
                      </span>
                    </div>
                    <div v-if="formData.signal_execution_mode === 'delayed'" class="flex justify-between text-xs">
                      <span class="text-slate-500">延迟时间</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.signal_delay_seconds }} 秒
                      </span>
                    </div>
                    <div v-if="formData.signal_execution_mode === 'scheduled'" class="flex justify-between text-xs">
                      <span class="text-slate-500">执行时间点</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.signal_scheduled_time }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 执行策略 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">执行策略</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">入场方式</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.entry_mode === 'market' ? '市价单' : '限价单' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">出场方式</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.exit_mode === 'market' ? '市价单' : '限价单' }}
                      </span>
                    </div>
                    <div v-if="formData.entry_mode === 'limit'" class="flex justify-between text-xs">
                      <span class="text-slate-500">入场价格偏移</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.entry_price_offset }}%
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">滑点限制</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.slippage_limit }}%
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">订单重试</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.order_retry }} 次
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">订单过期时间</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.order_expire_time }} 秒
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 自动反向开仓 -->
                <div v-if="formData.auto_reverse" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">自动反向开仓</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最大持仓时间</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_position_time }}小时
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 检查资金费率 -->
                <div v-if="formData.funding_fee_check" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">检查资金费率</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">资金费率阈值</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.funding_fee_threshold }}%
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 持仓管理 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">持仓管理</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最大并发持仓</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_open_positions || 1 }} 个
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">每日最大交易</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_daily_trades || 10 }} 次
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 风险控制 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">风险控制</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">每日最大亏损</span>
                      <span class="font-medium text-red-600">
                        {{ formData.max_daily_loss || 500 }} USDT
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 止盈策略 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">止盈策略</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">止盈模式</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.take_profit_mode === 'single' ? '单一止盈' : '多级止盈' }}
                      </span>
                    </div>
                    <div v-if="formData.take_profit_mode === 'single'" class="flex justify-between text-xs">
                      <span class="text-slate-500">止盈百分比</span>
                      <span class="font-medium text-green-600">
                        {{ formData.take_profit_percentage ? `${formData.take_profit_percentage}%` : '-' }}
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
                    <!-- 追踪止损 -->
                    <div v-if="formData.trailing_stop_enabled" class="flex justify-between text-xs">
                      <span class="text-slate-500">追踪止损</span>
                      <span class="font-medium text-blue-600">
                        激活{{ formData.trailing_stop_trigger }}% / 回撤{{ formData.trailing_stop_distance }}%
                      </span>
                    </div>
                    <!-- 盈亏平衡 -->
                    <div v-if="formData.breakeven_enabled" class="flex justify-between text-xs">
                      <span class="text-slate-500">盈亏平衡</span>
                      <span class="font-medium text-blue-600">
                        触发{{ formData.breakeven_trigger }}% / 偏移{{ formData.breakeven_offset }}%
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 初始止损设置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">初始止损设置</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">止损类型</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.stop_loss_type === 'fixed' ? '固定百分比' : formData.stop_loss_type === 'atr' ? 'ATR动态' : formData.stop_loss_type === 'time' ? '时间止损' : '技术止损' }}
                      </span>
                    </div>
                    <div v-if="formData.stop_loss_type === 'fixed'" class="flex justify-between text-xs">
                      <span class="text-slate-500">止损百分比</span>
                      <span class="font-medium text-red-600">
                        {{ formData.stop_loss_percentage ? `${formData.stop_loss_percentage}%` : '-' }}
                      </span>
                    </div>
                    <div v-if="formData.stop_loss_type === 'atr'" class="flex justify-between text-xs">
                      <span class="text-slate-500">ATR参数</span>
                      <span class="font-medium text-slate-900">
                        周期{{ formData.atr_period }} × {{ formData.atr_multiplier }}倍
                      </span>
                    </div>
                    <div v-if="formData.stop_loss_type === 'time'" class="flex justify-between text-xs">
                      <span class="text-slate-500">时间限制</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.time_stop_hours }}小时
                      </span>
                    </div>
                    <div v-if="formData.stop_loss_type === 'technical' && formData.technical_stop_indicator" class="flex justify-between text-xs">
                      <span class="text-slate-500">技术指标</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.technical_stop_indicator === 'support_resistance' ? '支撑/阻力位' :
                           formData.technical_stop_indicator === 'moving_average' ? '移动平均线' :
                           formData.technical_stop_indicator === 'bollinger_bands' ? '布林带' : '抛物线SAR' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 科学仓位管理 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">科学仓位管理</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">仓位计算方法</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.position_sizing_method === 'fixed_amount' ? '固定金额' :
                           formData.position_sizing_method === 'fixed_percent' ? '固定百分比' :
                           formData.position_sizing_method === 'fixed_risk' ? '固定风险' :
                           formData.position_sizing_method === 'kelly' ? '凯利公式' : 'ATR调整' }}
                      </span>
                    </div>
                    <div v-if="formData.position_sizing_method === 'fixed_amount'" class="flex justify-between text-xs">
                      <span class="text-slate-500">仓位大小</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.position_size_value }} USDT
                      </span>
                    </div>
                    <div v-if="formData.position_sizing_method === 'fixed_percent'" class="flex justify-between text-xs">
                      <span class="text-slate-500">仓位百分比</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.position_size_value }}%
                      </span>
                    </div>
                    <div v-if="formData.position_sizing_method === 'fixed_risk'" class="flex justify-between text-xs">
                      <span class="text-slate-500">每笔风险</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.risk_per_trade }}%
                      </span>
                    </div>
                    <div v-if="formData.position_sizing_method === 'kelly'" class="flex justify-between text-xs">
                      <span class="text-slate-500">凯利分数</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.kelly_fraction }}
                      </span>
                    </div>
                    <div v-if="formData.position_sizing_method === 'atr_based'">
                      <div class="flex justify-between text-xs">
                        <span class="text-slate-500">基础仓位</span>
                        <span class="font-medium text-slate-900">
                          {{ formData.position_size_value }} USDT
                        </span>
                      </div>
                      <div class="flex justify-between text-xs mt-2">
                        <span class="text-slate-500">ATR参数</span>
                        <span class="font-medium text-slate-900">
                          周期{{ formData.atr_period }} / 倍数{{ formData.atr_multiplier }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 多空方向控制 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">多空方向控制</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">交易方向</span>
                      <span class="font-medium" :class="{
                        'text-indigo-600': formData.trading_direction === 'both',
                        'text-green-600': formData.trading_direction === 'long_only',
                        'text-red-600': formData.trading_direction === 'short_only'
                      }">
                        {{ formData.trading_direction === 'both' ? '双向交易' : formData.trading_direction === 'long_only' ? '只做多' : '只做空' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 加仓策略 -->
                <div v-if="formData.pyramiding_enabled" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">加仓策略 (Pyramiding)</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最大加仓次数</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.max_pyramiding_orders }}次
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">加仓比例</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.pyramiding_scale }}%
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">价格间隔</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.pyramiding_price_distance }}%
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">时间间隔</span>
                      <span class="font-medium text-slate-900">
                        {{ Math.floor(formData.pyramiding_time_interval / 60) }}分钟
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 趋势过滤器 -->
                <div v-if="formData.trend_filter_enabled" class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">趋势过滤器</div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最小ADX</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.min_trend_strength_adx }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-500">最小价格变动</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.min_price_change }}%
                      </span>
                    </div>
                    <div v-if="formData.volume_confirmation_enabled" class="flex justify-between text-xs">
                      <span class="text-slate-500">成交量阈值</span>
                      <span class="font-medium text-slate-900">
                        {{ formData.volume_threshold }}倍
                      </span>
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

                <!-- 通知设置 -->
                <div class="border-t border-slate-200 pt-4">
                  <div class="text-xs font-semibold text-slate-700 mb-3">通知设置</div>
                  <div class="space-y-2.5">
                    <!-- 通知渠道 -->
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-2">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span class="text-slate-600">通知渠道</span>
                      </div>
                      <div class="flex flex-wrap gap-2 justify-end">
                        <div v-if="formData.alert_channels.includes('email')" class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          邮件
                        </div>
                        <div v-if="formData.alert_channels.includes('app')" class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                          应用内
                        </div>
                        <div v-if="formData.alert_channels.length === 0" class="text-xs text-slate-400">
                          未选择
                        </div>
                      </div>
                    </div>
                    <!-- 通知时机 -->
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-2">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-slate-600">通知时机</span>
                      </div>
                      <div class="flex flex-wrap gap-1 justify-end">
                        <span v-if="formData.alert_on_entry" class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">入场</span>
                        <span v-if="formData.alert_on_exit" class="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">出场</span>
                        <span v-if="formData.alert_on_error" class="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">错误</span>
                        <span v-if="!formData.alert_on_entry && !formData.alert_on_exit && !formData.alert_on_error" class="text-xs text-slate-400">未选择</span>
                      </div>
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
  } catch (error) {
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
    } else {
      tokenSearchResults.value = []
    }
  } catch (error) {
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

// 表单数据 - 趋势跟踪机器人专用（优化后）
const formData = ref({
  // ============ 基础配置 ============
  name: '',
  description: '',
  bot_type: 'trend_following',
  trading_mode: 'signal_trigger',  // 趋势跟踪机器人只做信号触发

  // ============ 关联信号机器人（必填）============
  signal_bot: null,  // 关联的信号机器人 ID

  exchange_api: null,  // 交易所 API ID
  token: null,  // 从信号机器人继承
  timeframe: '1h',  // 从信号机器人继承
  trading_pair: 'USDT',  // 交易对 (如: BTC/USDT)
  market_type: 'spot',  // spot, linear, inverse
  leverage: 1,  // 杠杆倍数

  // ============ 持仓管理 ============
  max_open_positions: 1,  // 最大并发持仓数（统一使用 max_open_positions）
  max_daily_trades: 10,  // 每日最大交易次数（统一使用 max_daily_trades）
  max_daily_loss: 500,  // 每日最大亏损

  // ============ 仓位管理（优化后：4个字段）============
  position_sizing_method: 'fixed_amount',  // fixed_amount, fixed_percent, fixed_risk, kelly, atr_based
  position_size_value: 100,  // 仓位大小值
  risk_per_trade: 1.00,  // 固定风险模式时使用
  kelly_fraction: 0.25,  // 凯利公式模式时使用

  // ============ 交易方向 ============
  trading_direction: 'both',  // both, long_only, short_only

  // ============ 信号执行策略 ============
  signal_execution_mode: 'immediate',  // immediate, delayed, scheduled
  signal_delay_seconds: 60,  // 延迟执行时间（秒）
  signal_scheduled_time: '09:00',  // 定时执行时间点
  signal_strength_threshold: 50,  // 信号强度阈值（0-100）
  signal_confirmation_bars: 1,  // 信号确认K线数
  signal_expiration_hours: 24,  // 信号过期时间（小时）
  max_signals_per_day: 10,  // 每日最大信号数

  // ============ 执行策略 ============
  entry_mode: 'market',  // market, limit
  exit_mode: 'market',  // market, limit
  entry_price_offset: 0.1,  // 入场价格偏移（%）
  slippage_limit: 0.5,  // 滑点限制（%）
  order_retry: 3,  // 订单重试次数
  order_expire_time: 60,  // 订单过期时间（秒）

  // ============ 止盈策略 ============
  take_profit_mode: 'single',  // single, multiple
  take_profit_percentage: 10.0,  // 单一止盈百分比
  take_profit_targets: [],  // 多级止盈目标 [{percentage: 5, position_percentage: 50}, ...]

  // ============ 追踪止损 ============
  trailing_stop_enabled: false,
  trailing_stop_trigger: 5.0,  // 触发百分比
  trailing_stop_distance: 2.0,  // 追踪距离

  // ============ 盈亏平衡 ============
  breakeven_enabled: false,
  breakeven_trigger: 3.0,  // 触发百分比
  breakeven_offset: 0.5,  // 偏移量

  // ============ 初始止损设置 ============
  stop_loss_type: 'fixed',  // fixed, atr, time, technical
  stop_loss_percentage: 5.0,  // 固定百分比止损
  atr_period: 14,  // ATR周期
  atr_multiplier: 2.0,  // ATR倍数
  time_stop_hours: 24,  // 时间止损（小时）

  // 技术止损参数
  technical_stop_indicator: '',  // support_resistance, moving_average, bollinger_bands, parabolic_sar
  support_resistance_period: 20,  // 支撑/阻力位回溯周期
  support_resistance_buffer: 0.5,  // 支撑/阻力位缓冲百分比
  ma_type: 'sma',  // sma, ema
  ma_period: 20,  // MA周期

  // ============ 通知设置（新增字段）============
  notify_on_signal: true,  // 信号通知
  notify_on_entry: true,  // 入场通知
  notify_on_exit: true,  // 出场通知
  notify_on_error: true,  // 错误通知

  // ============ 通知设置（旧字段 - 向后兼容）============
  alert_channels: ['email', 'app'],  // 通知渠道
  alert_on_entry: true,  // 入场通知
  alert_on_exit: true,  // 出场通知
  alert_on_error: true,  // 错误通知

  // ============ 高级功能（新增字段）============
  cooldown_period: 0,  // 冷却期（秒）
  pyramiding_enabled: false,  // 是否启用加仓
  pyramiding_max_entries: 3,  // 最大加仓次数
  pause_on_high_volatility: false,  // 高波动时暂停
  volatility_threshold: 5.0,  // 波动率阈值（%）
  allow_partial_close: false,  // 允许部分平仓
  smart_exit: false,  // 智能退出

  // ============ 高级功能（旧字段 - 向后兼容）============
  // 加仓策略
  max_pyramiding_orders: 3,
  pyramiding_scale: 50,
  pyramiding_price_distance: 2.0,
  pyramiding_time_interval: 3600,

  // 趋势过滤器
  trend_filter_enabled: false,
  min_trend_strength_adx: 25,
  min_price_change: 1.0,
  volume_confirmation_enabled: false,
  volume_threshold: 1.5,

  // 自动反向开仓
  auto_reverse: false,
  max_position_time: 24,  // 最大持仓时间（小时）

  // 资金费率检查
  funding_fee_check: false,
  funding_fee_threshold: 0.01  // 资金费率阈值（%）
})

const errors = ref({})

// ============ 向后兼容：桥接新旧字段 ============
// 为了最小化HTML改动，添加计算属性桥接新旧字段
// 注意：这是临时方案，最终应该更新HTML模板使用新字段

// 仓位类型桥接（旧字段 position_size_type → 新字段 position_sizing_method）
const positionSizeType = computed({
  get() {
    // 将新的 position_sizing_method 映射到旧的 position_size_type
    if (formData.value.position_sizing_method === 'fixed_amount') return 'fixed'
    if (formData.value.position_sizing_method === 'fixed_percent') return 'percent'
    return 'fixed' // 默认
  },
  set(value) {
    // 将旧的 position_size_type 映射到新的 position_sizing_method
    if (value === 'fixed') {
      formData.value.position_sizing_method = 'fixed_amount'
    } else if (value === 'percent') {
      formData.value.position_sizing_method = 'fixed_percent'
    }
  }
})

// 最大仓位桥接（旧字段 max_position_size → 新字段 position_size_value）
const maxPositionSize = computed({
  get() {
    return formData.value.position_size_value
  },
  set(value) {
    formData.value.position_size_value = value
  }
})

// 交易所类型列表（从后端获取）
const availableExchangeTypes = ref([])

// 交易所 API 列表
const exchangeAPIs = ref([])
const selectedExchangeAPI = ref(null)
const selectedExchangeType = ref(null)

// 信号机器人列表（新增）
const availableSignalBots = ref([])

// 选中的信号机器人
const selectedSignalBot = computed(() => {
  if (!formData.value.signal_bot) return null
  // formData.signal_bot 现在存储的是 SignalBot 的 ID，需要通过 bot.signal_bot 来匹配
  return availableSignalBots.value.find(bot => bot.signal_bot === formData.value.signal_bot)
})

// 信号类型标签映射
const getSignalTypeLabel = (signalType) => {
  const labels = {
    'price_alert': '价格提醒',
    'indicator_alert': '指标信号',
    'volatility': '波动性提醒',
    'volume': '成交量提醒'
  }
  return labels[signalType] || signalType
}

// 交易所统计信息
const exchangeStats = ref({
  total: 0,
  spot: 0,
  linear: 0,
  inverse: 0
})

// 可用的交易所 API（如果选择了信号机器人，则只显示匹配的交易所）
const availableExchangeAPIs = computed(() => {
  if (!formData.value.signal_bot) {
    // 如果没有选择信号机器人，显示所有 API
    return exchangeAPIs.value
  }

  // 如果选择了信号机器人，只显示匹配交易所的 API
  // formData.signal_bot 现在存储的是 SignalBot 的 ID，需要通过 bot.signal_bot 来匹配
  const signalBot = availableSignalBots.value.find(bot => bot.signal_bot === formData.value.signal_bot)
  if (!signalBot || !signalBot.exchange_name) {
    return exchangeAPIs.value
  }

  return exchangeAPIs.value.filter(api => api.exchange === signalBot.exchange_name)
})

// 保留旧的 filteredExchangeAPIs 用于兼容性
const filteredExchangeAPIs = computed(() => {
  if (!selectedExchangeType.value) return availableExchangeAPIs.value
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
  // 同步到 formData
  formData.value.take_profit_mode = newMode

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

  // 市场类型
  if (formData.value.market_type) {
    const marketTypeLabel = formData.value.market_type === 'spot' ? '现货' :
                           formData.value.market_type === 'linear' ? 'USDT合约' :
                           formData.value.market_type === 'inverse' ? '币本位合约' : ''
    if (marketTypeLabel) {
      parts.push(marketTypeLabel)
    }
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

  return parts.length > 0 ? parts.join(' ') : '未命名机器人'
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

  // 仓位管理（优化后）
  if (formData.value.position_size_value) {
    const methodLabels = {
      'fixed_amount': 'USDT',
      'fixed_percent': '%',
      'fixed_risk': '% 风险',
      'kelly': '凯利公式',
      'atr_based': 'ATR'
    }
    const methodLabel = methodLabels[formData.value.position_sizing_method] || ''
    parts.push(`仓位 ${formData.value.position_size_value} ${methodLabel}`)
  }

  // 风险管理（优化后）
  if (formData.value.stop_loss_config) {
    const stopLossTypeLabels = {
      'fixed': '固定',
      'atr': 'ATR',
      'time': '时间'
    }
    const typeLabel = stopLossTypeLabels[formData.value.stop_loss_config.type] || ''
    parts.push(`止损 ${formData.value.stop_loss_config.value}% (${typeLabel})`)
  }
  if (formData.value.take_profit_config) {
    if (formData.value.take_profit_config.mode === 'single') {
      parts.push(`止盈 ${formData.value.take_profit_config.single_value}%`)
    } else if (formData.value.take_profit_config.targets?.length > 0) {
      parts.push(`多级止盈 (${formData.value.take_profit_config.targets.length}级)`)
    }
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

// 表单验证（优化后）
const isFormValid = computed(() => {
  // 🔍 科学验证日志系统
  const validationLog = {
    timestamp: new Date().toISOString(),
    checks: {},
    result: false
  }

  // 基础必填项验证
  validationLog.checks.signal_bot = {
    value: formData.value.signal_bot,
    valid: !!formData.value.signal_bot,
    required: true
  }

  validationLog.checks.exchange_api = {
    value: formData.value.exchange_api,
    valid: !!formData.value.exchange_api,
    required: true
  }

  validationLog.checks.token = {
    value: formData.value.token,
    valid: !!formData.value.token,
    required: true
  }

  validationLog.checks.trading_pair = {
    value: formData.value.trading_pair,
    valid: !!formData.value.trading_pair,
    required: true
  }

  validationLog.checks.position_size_value = {
    value: formData.value.position_size_value,
    valid: formData.value.position_size_value > 0,
    required: true
  }

  const hasBasicFields = formData.value.signal_bot &&
                         formData.value.exchange_api &&
                         formData.value.token &&
                         formData.value.trading_pair &&
                         formData.value.position_size_value > 0

  // 止损验证（支持新的扁平字段）
  let hasStopLoss = false
  validationLog.checks.stop_loss = {
    type: formData.value.stop_loss_type,
    valid: false,
    required: true,
    details: {}
  }

  if (formData.value.stop_loss_type === 'fixed') {
    hasStopLoss = formData.value.stop_loss_percentage > 0
    validationLog.checks.stop_loss.details = {
      stop_loss_percentage: formData.value.stop_loss_percentage,
      valid: hasStopLoss
    }
  } else if (formData.value.stop_loss_type === 'atr') {
    hasStopLoss = formData.value.atr_period > 0 && formData.value.atr_multiplier > 0
    validationLog.checks.stop_loss.details = {
      atr_period: formData.value.atr_period,
      atr_multiplier: formData.value.atr_multiplier,
      valid: hasStopLoss
    }
  } else if (formData.value.stop_loss_type === 'time') {
    hasStopLoss = formData.value.time_stop_hours > 0
    validationLog.checks.stop_loss.details = {
      time_stop_hours: formData.value.time_stop_hours,
      valid: hasStopLoss
    }
  } else if (formData.value.stop_loss_type === 'technical') {
    hasStopLoss = !!formData.value.technical_stop_indicator
    validationLog.checks.stop_loss.details = {
      technical_stop_indicator: formData.value.technical_stop_indicator,
      valid: hasStopLoss
    }
  } else if (formData.value.stop_loss_config?.value > 0) {
    hasStopLoss = true
    validationLog.checks.stop_loss.details = {
      stop_loss_config: formData.value.stop_loss_config,
      valid: hasStopLoss,
      note: '使用旧的配置对象'
    }
  }

  validationLog.checks.stop_loss.valid = hasStopLoss

  // 最终结果
  validationLog.result = hasBasicFields && hasStopLoss

  // 输出验证日志
  console.log('🔍 ============ 表单验证报告 ============')
  console.log('📋 验证时间:', validationLog.timestamp)
  console.log('📊 验证结果:', validationLog.result ? '✅ 通过' : '❌ 未通过')
  console.log('')
  console.log('📝 必填字段检查:')
  Object.entries(validationLog.checks).forEach(([key, check]) => {
    const icon = check.valid ? '✅' : '❌'
    console.log(`  ${icon} ${key}:`, check.value, check.details ? `(详情: ${JSON.stringify(check.details)})` : '')
  })
  console.log('')
  console.log('🔧 调试信息:')
  console.log('  - exchangeAPIs.value:', exchangeAPIs.value)
  console.log('  - availableExchangeAPIs:', availableExchangeAPIs.value)
  console.log('  - selectedExchangeAPI:', selectedExchangeAPI.value)
  console.log('  - selectedExchangeType:', selectedExchangeType.value)
  console.log('')
  console.log('📦 完整表单数据:')
  console.log(JSON.parse(JSON.stringify(formData.value)))
  console.log('🔍 ======================================')

  return hasBasicFields && hasStopLoss
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
  // 并且不在编辑模式或加载数据期间清空
  if (oldMarketType && newMarketType !== oldMarketType && !isLoadingBotData.value && !isEditMode.value) {
    console.log('📊 市场类型变化:', oldMarketType, '->', newMarketType)

    // 🔧 修复：如果是信号触发模式且已选择信号机器人，不清空代币（因为代币从信号机器人继承）
    if (formData.value.trading_mode === 'signal_trigger' && formData.value.signal_bot) {
      console.log('📊 [信号触发模式] 市场类型变化，保留代币选择')
      // 只重新加载计价币种列表
      loadQuoteAssets()
      return
    }

    // 清空代币选择
    formData.value.token = null
    tokenSearchQuery.value = ''
    tokenSearchResults.value = []
    selectedToken.value = null
    showTokenResults.value = false

    // 重新加载计价币种列表
    loadQuoteAssets()
  } else if (oldMarketType && newMarketType !== oldMarketType && isEditMode.value) {
    // 编辑模式下，只重新加载计价币种列表，不清空代币选择
    console.log('📊 [编辑模式] 市场类型变化:', oldMarketType, '->', newMarketType, '- 保留代币选择')
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

// 加载信号机器人列表（新增）
const loadSignalBots = async () => {
  try {
    // 获取所有机器人，然后筛选出信号机器人
    const response = await botAPI.getBotList()
    console.log('📊 机器人列表响应:', response)

    // 筛选出类型为 'signal' 的机器人（不限制状态，让用户可以选择任何信号机器人）
    const allBots = response.results || response || []
    availableSignalBots.value = allBots.filter(bot => bot.bot_type === 'signal')

    console.log('✅ 加载信号机器人列表成功:', availableSignalBots.value.length, '个')
    console.log('📋 信号机器人列表:', availableSignalBots.value)
  } catch (error) {
    console.error('❌ 加载信号机器人列表失败:', error)
    showError('加载信号机器人列表失败')
  }
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
    case 'max_open_positions':
      return formData.value.max_open_positions > userRiskConfig.value.max_open_positions
    case 'stop_loss_percentage':
      return formData.value.stop_loss_percentage && formData.value.stop_loss_percentage > systemStopLossPercentage.value
    case 'max_daily_trades':
      return formData.value.max_daily_trades && formData.value.max_daily_trades > userRiskConfig.value.max_daily_trades
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
    case 'max_open_positions':
      return `已超出最大设置 ${userRiskConfig.value.max_open_positions} 个`
    case 'stop_loss_percentage':
      return `已超出最大设置 ${systemStopLossPercentage.value}%`
    case 'max_daily_trades':
      return `已超出最大设置 ${userRiskConfig.value.max_daily_trades} 次/天`
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

  // 验证必须选择信号机器人
  if (!formData.value.signal_bot) {
    showError('请选择一个信号机器人')
    return
  }

  // 验证选择的信号机器人是否存在
  // formData.signal_bot 现在存储的是 SignalBot 的 ID，需要通过 bot.signal_bot 来匹配
  const signalBotExists = availableSignalBots.value.find(bot => bot.signal_bot === formData.value.signal_bot)
  if (!signalBotExists) {
    showError('选择的信号机器人不存在，请重新选择')
    formData.value.signal_bot = null
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

  // 验证系统风控限制
  if (userRiskConfig.value) {
    // 验证仓位大小
    if (formData.value.position_size_value > userRiskConfig.value.max_position_per_bot) {
      showError(`仓位大小不能超过系统限制 ${userRiskConfig.value.max_position_per_bot} USDT`)
      return
    }

    // 验证杠杆倍数（仅合约）
    if (formData.value.market_type !== 'spot' && formData.value.leverage > userRiskConfig.value.max_leverage) {
      showError(`杠杆倍数不能超过系统限制 ${userRiskConfig.value.max_leverage}x`)
      return
    }

    // 验证每日最大交易次数
    if (formData.value.max_daily_trades && formData.value.max_daily_trades > userRiskConfig.value.max_daily_trades) {
      showError(`每日最大交易次数不能超过系统限制 ${userRiskConfig.value.max_daily_trades} 次`)
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
      // ============ 基础配置 ============
      name: formData.value.name || autoGeneratedName.value,
      description: formData.value.description || `${autoGeneratedName.value} - 自动交易策略`,
      bot_type: 'trend_following',
      trading_mode: formData.value.trading_mode,
      signal_bot: formData.value.signal_bot,  // 关联的信号机器人 ID（必填）
      exchange_api: formData.value.exchange_api,
      token: typeof formData.value.token === 'object' ? formData.value.token.id : formData.value.token,
      timeframe: formData.value.timeframe,  // 从信号机器人继承
      trading_pair: formData.value.trading_pair,
      market_type: formData.value.market_type,
      leverage: formData.value.market_type === 'spot' ? 1 : formData.value.leverage,  // 现货固定为1倍

      // ============ 持仓管理（使用正确的字段名）============
      max_open_positions: formData.value.max_open_positions,
      max_daily_trades: formData.value.max_daily_trades,
      max_daily_loss: formData.value.max_daily_loss,

      // ============ 仓位管理（优化后：4个字段）============
      position_sizing_method: formData.value.position_sizing_method,
      position_size_value: formData.value.position_size_value,
      risk_per_trade: formData.value.risk_per_trade,
      kelly_fraction: formData.value.kelly_fraction,

      // ============ 交易方向 ============
      trading_direction: formData.value.market_type === 'spot' ? 'long_only' : formData.value.trading_direction,  // 现货固定为只做多

      // ============ 信号执行策略（扁平字段）============
      signal_execution_mode: formData.value.signal_execution_mode,
      signal_delay_seconds: formData.value.signal_delay_seconds,
      signal_scheduled_time: formData.value.signal_scheduled_time,
      signal_strength_threshold: formData.value.signal_strength_threshold,
      signal_confirmation_bars: formData.value.signal_confirmation_bars,
      signal_expiration_hours: formData.value.signal_expiration_hours,
      max_signals_per_day: formData.value.max_signals_per_day,

      // ============ 执行策略（扁平字段）============
      entry_mode: formData.value.entry_mode,
      exit_mode: formData.value.exit_mode,
      entry_price_offset: formData.value.entry_price_offset,
      slippage_limit: formData.value.slippage_limit,
      order_retry: formData.value.order_retry,
      order_expire_time: formData.value.order_expire_time,

      // ============ 止盈策略（扁平字段）============
      take_profit_mode: formData.value.take_profit_mode,
      take_profit_percentage: formData.value.take_profit_percentage,
      take_profit_targets: formData.value.take_profit_targets,

      // ============ 追踪止损（扁平字段）============
      trailing_stop_enabled: formData.value.trailing_stop_enabled,
      trailing_stop_trigger: formData.value.trailing_stop_trigger,
      trailing_stop_distance: formData.value.trailing_stop_distance,

      // ============ 盈亏平衡（扁平字段）============
      breakeven_enabled: formData.value.breakeven_enabled,
      breakeven_trigger: formData.value.breakeven_trigger,
      breakeven_offset: formData.value.breakeven_offset,

      // ============ 初始止损设置（扁平字段）============
      stop_loss_type: formData.value.stop_loss_type,
      stop_loss_percentage: formData.value.stop_loss_percentage,
      atr_period: formData.value.atr_period,
      atr_multiplier: formData.value.atr_multiplier,
      time_stop_hours: formData.value.time_stop_hours,
      technical_stop_indicator: formData.value.technical_stop_indicator,
      support_resistance_period: formData.value.support_resistance_period,
      support_resistance_buffer: formData.value.support_resistance_buffer,
      ma_type: formData.value.ma_type,
      ma_period: formData.value.ma_period,

      // ============ 通知设置（新增字段）============
      notify_on_signal: formData.value.notify_on_signal,
      notify_on_entry: formData.value.notify_on_entry,
      notify_on_exit: formData.value.notify_on_exit,
      notify_on_error: formData.value.notify_on_error,

      // ============ 通知设置（旧字段 - 向后兼容）============
      alert_channels: formData.value.alert_channels,
      alert_on_entry: formData.value.alert_on_entry,
      alert_on_exit: formData.value.alert_on_exit,
      alert_on_error: formData.value.alert_on_error,

      // ============ 高级功能（新增字段）============
      cooldown_period: formData.value.cooldown_period,
      pyramiding_enabled: formData.value.pyramiding_enabled,
      pyramiding_max_entries: formData.value.pyramiding_max_entries,
      pause_on_high_volatility: formData.value.pause_on_high_volatility,
      volatility_threshold: formData.value.volatility_threshold,
      allow_partial_close: formData.value.allow_partial_close,
      smart_exit: formData.value.smart_exit,

      // ============ 高级功能（旧字段 - 向后兼容）============
      // 加仓策略
      max_pyramiding_orders: formData.value.max_pyramiding_orders,
      pyramiding_scale: formData.value.pyramiding_scale,
      pyramiding_price_distance: formData.value.pyramiding_price_distance,
      pyramiding_time_interval: formData.value.pyramiding_time_interval,

      // 趋势过滤器
      trend_filter_enabled: formData.value.trend_filter_enabled,
      min_trend_strength_adx: formData.value.min_trend_strength_adx,
      min_price_change: formData.value.min_price_change,
      volume_confirmation_enabled: formData.value.volume_confirmation_enabled,
      volume_threshold: formData.value.volume_threshold,

      // 自动反向开仓
      auto_reverse: formData.value.auto_reverse,
      max_position_time: formData.value.max_position_time,

      // 资金费率检查
      funding_fee_check: formData.value.funding_fee_check,
      funding_fee_threshold: formData.value.funding_fee_threshold
    }

    console.log('📤 提交数据:', submitData.name, '- 关联信号机器人:', submitData.signal_bot)

    if (isEditMode.value) {
      await botAPI.updateBot(botId.value, submitData)
      showSuccess('趋势跟踪机器人更新成功')
    } else {
      await botAPI.createBot(submitData)
      showSuccess('趋势跟踪机器人创建成功')
    }

    // 跳转回列表页面，添加时间戳参数强制刷新
    router.push(`/bots?type=trend_following&refresh=${Date.now()}`)
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

// 切换通知渠道
const toggleAlertChannel = (channel) => {
  const index = formData.value.alert_channels.indexOf(channel)
  if (index > -1) {
    formData.value.alert_channels.splice(index, 1)
  } else {
    formData.value.alert_channels.push(channel)
  }
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

      // 🔧 修复：如果是信号触发模式且已选择信号机器人，不清空代币（因为代币从信号机器人继承）
      if (formData.value.trading_mode !== 'signal_trigger' || !formData.value.signal_bot) {
        // 清空代币选择
        formData.value.token = null
        tokenSearchQuery.value = ''
        tokenSearchResults.value = []
        selectedToken.value = null
        showTokenResults.value = false
      }
    }
  }
})

// 监听市场类型变化，清空代币选择
watch(() => formData.value.market_type, () => {
  if (selectedExchangeAPI.value && selectedExchangeAPI.value.id) {
    // 只在非编辑模式下重置选择（编辑模式下应该保留原有选择）
    // 并且不在加载机器人数据期间重置
    if (!isEditMode.value && !isLoadingBotData.value) {
      // 🔧 修复：如果是信号触发模式且已选择信号机器人，不清空任何数据（因为都从信号机器人继承）
      if (formData.value.trading_mode === 'signal_trigger' && formData.value.signal_bot) {
        console.log('📊 [信号触发模式] 市场类型变化，保留代币和计价币种选择')
        // 不清空任何数据
        return
      }

      // 其他模式下，清空计价币种
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

// 处理信号机器人选择变化
const handleSignalBotChange = () => {
  const newSignalBotId = formData.value.signal_bot

  if (!newSignalBotId) {
    console.log('🔍 信号机器人已清空')
    return
  }

  // formData.signal_bot 现在存储的是 SignalBot 的 ID，需要通过 bot.signal_bot 来匹配
  const signalBot = availableSignalBots.value.find(bot => bot.signal_bot === newSignalBotId)

  console.log('🔍 ============ 信号机器人选择日志 ============')
  console.log('📋 选择的 SignalBot ID:', newSignalBotId)
  console.log('📊 找到的 TradingBot 对象:', signalBot)

  if (signalBot) {
    console.log('📝 信号机器人详细信息:')
    console.log('  - token:', signalBot.token, '(类型:', typeof signalBot.token, ')')
    console.log('  - token_symbol:', signalBot.token_symbol)
    console.log('  - token_name:', signalBot.token_name)
    console.log('  - token_logo:', signalBot.token_logo)
    console.log('  - exchange_name:', signalBot.exchange_name)

    // 自动继承 token
    if (signalBot.token) {
      formData.value.token = signalBot.token

      // 设置 selectedToken 用于显示
      selectedToken.value = {
        id: signalBot.token,
        symbol: signalBot.token_symbol,
        name: signalBot.token_name,
        logo: signalBot.token_logo
      }

      tokenSearchQuery.value = signalBot.token_symbol

      console.log('✅ 已继承代币到 formData.value.token:', formData.value.token)
      console.log('✅ 已设置 selectedToken:', selectedToken.value)
    } else {
      console.warn('⚠️ 信号机器人没有 token 字段！')
    }

    // 自动设置交易所类型（如果信号机器人有 exchange_name）
    if (signalBot.exchange_name) {
      selectedExchangeType.value = signalBot.exchange_name
      console.log('✅ 已设置交易所类型:', signalBot.exchange_name)

      // 加载计价币种列表
      loadQuoteAssets()
    }
  } else {
    console.warn('⚠️ 未找到对应的信号机器人！')
    console.log('📋 可用的信号机器人列表:', availableSignalBots.value)
  }
  console.log('🔍 ==========================================')
}

// 监听信号机器人选择，自动继承 token（保留 watch 作为备用）
watch(() => formData.value.signal_bot, async (newSignalBotId) => {
  if (newSignalBotId && !isLoadingBotData.value) {
    handleSignalBotChange()
  }
})

onMounted(async () => {
  // 第一步：加载交易所 API 列表（必须先加载，以便后续能找到对应的 API 对象）
  await loadExchangeAPIs()

  // 加载信号机器人列表（新增）
  await loadSignalBots()

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
      formData.value.max_open_positions = bot.max_open_positions ? Number(bot.max_open_positions) : 1
      formData.value.max_daily_trades = bot.max_daily_trades ? Number(bot.max_daily_trades) : 10
      formData.value.max_daily_loss = bot.max_daily_loss ? Number(bot.max_daily_loss) : 500

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

        // ============ 基础字段 ============
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

        // ============ 关联信号机器人 ============
        // 验证信号机器人是否存在
        // trendBot.signal_bot 是 SignalBot 的 ID
        // availableSignalBots 中的每个 bot 是 TradingBot 对象
        // bot.signal_bot 也是 SignalBot 的 ID（数字）
        if (trendBot.signal_bot) {
          console.log('🔍 [调试] 开始匹配信号机器人')
          console.log('🔍 [调试] trendBot.signal_bot (SignalBot ID):', trendBot.signal_bot)
          console.log('🔍 [调试] availableSignalBots 数量:', availableSignalBots.value.length)

          // 打印前3个信号机器人的结构
          if (availableSignalBots.value.length > 0) {
            console.log('🔍 [调试] 第一个信号机器人结构:', {
              id: availableSignalBots.value[0].id,
              name: availableSignalBots.value[0].name,
              signal_bot: availableSignalBots.value[0].signal_bot,
              signal_bot_type: typeof availableSignalBots.value[0].signal_bot
            })
          }

          // 正确的匹配逻辑：
          // bot.signal_bot 是 SignalBot.id（数字）
          // trendBot.signal_bot 也是 SignalBot.id（数字）
          // 所以直接比较 bot.signal_bot === trendBot.signal_bot
          const signalBotExists = availableSignalBots.value.find(bot => {
            console.log('🔍 [调试] 检查机器人:', {
              bot_id: bot.id,
              bot_name: bot.name,
              signal_bot: bot.signal_bot,
              signal_bot_type: typeof bot.signal_bot
            })

            // 如果 bot.signal_bot 是对象（包含 id 字段）
            if (bot.signal_bot && typeof bot.signal_bot === 'object' && bot.signal_bot.id) {
              const match = bot.signal_bot.id === trendBot.signal_bot
              console.log(`🔍 [调试] 比较 bot.signal_bot.id (${bot.signal_bot.id}) === trendBot.signal_bot (${trendBot.signal_bot}): ${match}`)
              return match
            }
            // 如果 bot.signal_bot 是数字（SignalBot.id）
            if (typeof bot.signal_bot === 'number') {
              const match = bot.signal_bot === trendBot.signal_bot
              console.log(`🔍 [调试] 比较 bot.signal_bot (${bot.signal_bot}) === trendBot.signal_bot (${trendBot.signal_bot}): ${match}`)
              return match
            }

            console.log(`🔍 [调试] bot.signal_bot 类型不匹配: ${typeof bot.signal_bot}`)
            return false
          })

          if (signalBotExists) {
            formData.value.signal_bot = trendBot.signal_bot
            console.log('✅ [编辑模式] 关联的信号机器人存在 (SignalBot ID):', trendBot.signal_bot)
            console.log('✅ [编辑模式] 对应的 TradingBot:', signalBotExists)
          } else {
            formData.value.signal_bot = null
            console.warn('⚠️ [编辑模式] 关联的信号机器人不存在，已清空 (SignalBot ID):', trendBot.signal_bot)
            console.log('📋 可用的信号机器人列表:', availableSignalBots.value)
            showError('原关联的信号机器人已不存在，请重新选择')
          }
        } else {
          formData.value.signal_bot = null
        }

        // ============ 仓位管理（优化后）============
        formData.value.position_sizing_method = trendBot.position_sizing_method || 'fixed_amount'
        formData.value.position_size_value = Number(trendBot.position_size_value || trendBot.max_position_size || 100)
        formData.value.risk_per_trade = Number(trendBot.risk_per_trade || 1.00)
        formData.value.kelly_fraction = Number(trendBot.kelly_fraction || 0.25)

        // ============ 交易方向 ============
        formData.value.trading_direction = trendBot.trading_direction || 'both'

        // ============ 信号执行策略 ============
        formData.value.signal_execution_mode = trendBot.signal_execution_mode || 'immediate'
        formData.value.signal_delay_seconds = trendBot.signal_delay_seconds || 60
        formData.value.signal_scheduled_time = trendBot.signal_scheduled_time || '09:00'
        formData.value.signal_strength_threshold = Number(trendBot.signal_strength_threshold || 50)
        formData.value.signal_confirmation_bars = Number(trendBot.signal_confirmation_bars || 1)
        formData.value.signal_expiration_hours = Number(trendBot.signal_expiration_hours || 24)
        formData.value.max_signals_per_day = Number(trendBot.max_signals_per_day || 10)

        console.log('✅ [编辑模式] 加载信号执行策略:', {
          signal_execution_mode: formData.value.signal_execution_mode,
          signal_strength_threshold: formData.value.signal_strength_threshold,
          signal_confirmation_bars: formData.value.signal_confirmation_bars,
          signal_expiration_hours: formData.value.signal_expiration_hours,
          max_signals_per_day: formData.value.max_signals_per_day
        })

        // ============ 风险管理（优化后：配置对象）============
        // 止损配置
        if (trendBot.stop_loss_config) {
          // 从配置对象中提取扁平字段
          const stopLossConfig = trendBot.stop_loss_config
          formData.value.stop_loss_type = stopLossConfig.type || 'fixed'
          formData.value.stop_loss_percentage = Number(stopLossConfig.value || 5.0)
          formData.value.atr_period = stopLossConfig.atr_period || 14
          formData.value.atr_multiplier = Number(stopLossConfig.atr_multiplier || 2.0)
          formData.value.time_stop_hours = stopLossConfig.time_hours || 24

          // 技术止损参数
          formData.value.technical_stop_indicator = stopLossConfig.technical_indicator || ''
          formData.value.support_resistance_period = stopLossConfig.support_resistance_period || 20
          formData.value.support_resistance_buffer = Number(stopLossConfig.support_resistance_buffer || 0.5)
          formData.value.ma_type = stopLossConfig.ma_type || 'sma'
          formData.value.ma_period = stopLossConfig.ma_period || 20

          // 同时保存配置对象（向后兼容）
          formData.value.stop_loss_config = trendBot.stop_loss_config
        } else {
          // 从旧字段构建
          formData.value.stop_loss_type = trendBot.stop_loss_type || 'fixed'
          formData.value.stop_loss_percentage = Number(trendBot.stop_loss_percentage || 5.0)
          formData.value.atr_period = trendBot.atr_period || 14
          formData.value.atr_multiplier = Number(trendBot.atr_multiplier || 2.0)
          formData.value.time_stop_hours = trendBot.time_stop_hours || 24

          // 技术止损参数
          formData.value.technical_stop_indicator = trendBot.technical_stop_indicator || ''
          formData.value.support_resistance_period = trendBot.support_resistance_period || 20
          formData.value.support_resistance_buffer = Number(trendBot.support_resistance_buffer || 0.5)
          formData.value.ma_type = trendBot.ma_type || 'sma'
          formData.value.ma_period = trendBot.ma_period || 20

          formData.value.stop_loss_config = {
            type: formData.value.stop_loss_type,
            value: formData.value.stop_loss_percentage,
            atr_period: formData.value.atr_period,
            atr_multiplier: formData.value.atr_multiplier,
            time_hours: formData.value.time_stop_hours,
            technical_indicator: formData.value.technical_stop_indicator,
            support_resistance_period: formData.value.support_resistance_period,
            support_resistance_buffer: formData.value.support_resistance_buffer,
            ma_type: formData.value.ma_type,
            ma_period: formData.value.ma_period
          }
        }

        console.log('✅ [编辑模式] 加载止损配置:', {
          stop_loss_type: formData.value.stop_loss_type,
          stop_loss_percentage: formData.value.stop_loss_percentage,
          atr_period: formData.value.atr_period,
          atr_multiplier: formData.value.atr_multiplier,
          time_stop_hours: formData.value.time_stop_hours,
          technical_stop_indicator: formData.value.technical_stop_indicator,
          support_resistance_period: formData.value.support_resistance_period,
          support_resistance_buffer: formData.value.support_resistance_buffer,
          ma_type: formData.value.ma_type,
          ma_period: formData.value.ma_period
        })

        // 止盈配置（支持新的扁平字段）
        if (trendBot.take_profit_mode) {
          // 新版本：使用扁平字段
          formData.value.take_profit_mode = trendBot.take_profit_mode
          takeProfitMode.value = trendBot.take_profit_mode

          if (trendBot.take_profit_mode === 'single') {
            formData.value.take_profit_percentage = Number(trendBot.take_profit_percentage || 10.0)
          } else if (trendBot.take_profit_mode === 'multiple') {
            formData.value.take_profit_targets = trendBot.take_profit_targets || []
          }
        } else if (trendBot.take_profit_config) {
          // 旧版本：使用配置对象
          const takeProfitConfig = trendBot.take_profit_config
          formData.value.take_profit_mode = takeProfitConfig.mode || 'single'
          takeProfitMode.value = takeProfitConfig.mode || 'single'

          if (takeProfitConfig.mode === 'single') {
            formData.value.take_profit_percentage = Number(takeProfitConfig.percentage || 10.0)
          } else if (takeProfitConfig.mode === 'multiple') {
            formData.value.take_profit_targets = takeProfitConfig.targets || []
          }

          formData.value.take_profit_config = trendBot.take_profit_config
        } else {
          // 从旧字段构建
          if (trendBot.take_profit_targets && trendBot.take_profit_targets.length > 0) {
            formData.value.take_profit_mode = 'multiple'
            formData.value.take_profit_targets = trendBot.take_profit_targets
            takeProfitMode.value = 'multiple'
          } else {
            formData.value.take_profit_mode = 'single'
            formData.value.take_profit_percentage = Number(trendBot.take_profit_percentage || 10.0)
            takeProfitMode.value = 'single'
          }
        }

        console.log('✅ [编辑模式] 加载止盈配置:', {
          take_profit_mode: formData.value.take_profit_mode,
          take_profit_percentage: formData.value.take_profit_percentage,
          take_profit_targets: formData.value.take_profit_targets
        })

        // 追踪止损配置
        if (trendBot.trailing_stop_config) {
          // 从配置对象中提取扁平字段
          const trailingStopConfig = trendBot.trailing_stop_config
          formData.value.trailing_stop_enabled = trailingStopConfig.enabled || false
          formData.value.trailing_stop_trigger = Number(trailingStopConfig.trigger || 5.0)
          formData.value.trailing_stop_distance = Number(trailingStopConfig.distance || 2.0)

          // 同时保存配置对象（向后兼容）
          formData.value.trailing_stop_config = trendBot.trailing_stop_config
        } else {
          // 从旧字段构建
          formData.value.trailing_stop_enabled = trendBot.trailing_stop_enabled || false
          formData.value.trailing_stop_trigger = Number(trendBot.trailing_stop_trigger || 5.0)
          formData.value.trailing_stop_distance = Number(trendBot.trailing_stop_distance || 2.0)

          formData.value.trailing_stop_config = {
            enabled: formData.value.trailing_stop_enabled,
            trigger: formData.value.trailing_stop_trigger,
            distance: formData.value.trailing_stop_distance
          }
        }

        console.log('✅ [编辑模式] 加载追踪止损配置:', {
          trailing_stop_enabled: formData.value.trailing_stop_enabled,
          trailing_stop_trigger: formData.value.trailing_stop_trigger,
          trailing_stop_distance: formData.value.trailing_stop_distance
        })

        // 盈亏平衡配置
        if (trendBot.breakeven_config) {
          // 从配置对象中提取扁平字段
          const breakevenConfig = trendBot.breakeven_config
          formData.value.breakeven_enabled = breakevenConfig.enabled || false
          formData.value.breakeven_trigger = Number(breakevenConfig.trigger || 3.0)
          formData.value.breakeven_offset = Number(breakevenConfig.offset || 0.5)

          // 同时保存配置对象（向后兼容）
          formData.value.breakeven_config = trendBot.breakeven_config
        } else {
          // 从旧字段构建
          formData.value.breakeven_enabled = trendBot.breakeven_enabled || false
          formData.value.breakeven_trigger = Number(trendBot.breakeven_trigger || 3.0)
          formData.value.breakeven_offset = Number(trendBot.breakeven_offset || 0.5)

          formData.value.breakeven_config = {
            enabled: formData.value.breakeven_enabled,
            trigger: formData.value.breakeven_trigger,
            offset: formData.value.breakeven_offset
          }
        }

        console.log('✅ [编辑模式] 加载盈亏平衡配置:', {
          breakeven_enabled: formData.value.breakeven_enabled,
          breakeven_trigger: formData.value.breakeven_trigger,
          breakeven_offset: formData.value.breakeven_offset
        })

        // ============ 订单执行（优化后：配置对象）============
        if (trendBot.order_config) {
          // 从配置对象中提取扁平字段
          const orderConfig = trendBot.order_config
          formData.value.entry_mode = orderConfig.entry_type || 'market'
          formData.value.exit_mode = orderConfig.exit_type || 'market'
          formData.value.entry_price_offset = Number(orderConfig.limit_offset || 0.1)
          formData.value.slippage_limit = Number(orderConfig.slippage_limit || 0.5)
          formData.value.order_retry = orderConfig.retry_count || 3
          formData.value.order_expire_time = orderConfig.expire_seconds || 60

          // 同时保存配置对象（向后兼容）
          formData.value.order_config = trendBot.order_config
        } else {
          // 从旧字段构建
          formData.value.entry_mode = trendBot.entry_order_type || trendBot.entry_mode || 'market'
          formData.value.exit_mode = trendBot.exit_order_type || 'market'
          formData.value.entry_price_offset = Number(trendBot.limit_price_offset || trendBot.entry_price_offset || 0.1)
          formData.value.slippage_limit = Number(trendBot.slippage_limit || 0.5)
          formData.value.order_retry = trendBot.order_retry || 3
          formData.value.order_expire_time = trendBot.order_expire_time || 60

          formData.value.order_config = {
            entry_type: formData.value.entry_mode,
            exit_type: formData.value.exit_mode,
            limit_offset: formData.value.entry_price_offset,
            slippage_limit: formData.value.slippage_limit,
            retry_count: formData.value.order_retry,
            expire_seconds: formData.value.order_expire_time
          }
        }

        console.log('✅ [编辑模式] 加载订单执行配置:', {
          entry_mode: formData.value.entry_mode,
          exit_mode: formData.value.exit_mode,
          entry_price_offset: formData.value.entry_price_offset,
          slippage_limit: formData.value.slippage_limit,
          order_retry: formData.value.order_retry,
          order_expire_time: formData.value.order_expire_time
        })

        // ============ 高级功能（新增字段）============
        formData.value.cooldown_period = Number(trendBot.cooldown_period || 0)
        formData.value.pyramiding_enabled = trendBot.pyramiding_enabled || false
        formData.value.pyramiding_max_entries = Number(trendBot.pyramiding_max_entries || 3)
        formData.value.funding_fee_check = trendBot.funding_fee_check !== undefined ? trendBot.funding_fee_check : false
        formData.value.pause_on_high_volatility = trendBot.pause_on_high_volatility || false
        formData.value.volatility_threshold = Number(trendBot.volatility_threshold || 5.0)
        formData.value.allow_partial_close = trendBot.allow_partial_close || false
        formData.value.smart_exit = trendBot.smart_exit || false

        console.log('✅ [编辑模式] 加载高级功能:', {
          cooldown_period: formData.value.cooldown_period,
          pyramiding_enabled: formData.value.pyramiding_enabled,
          pyramiding_max_entries: formData.value.pyramiding_max_entries,
          funding_fee_check: formData.value.funding_fee_check,
          pause_on_high_volatility: formData.value.pause_on_high_volatility,
          volatility_threshold: formData.value.volatility_threshold,
          allow_partial_close: formData.value.allow_partial_close,
          smart_exit: formData.value.smart_exit
        })

        // ============ 加仓配置（从配置对象中提取）============
        if (trendBot.pyramiding_config) {
          const pyramidingConfig = trendBot.pyramiding_config
          // 注意：pyramiding_enabled 已经在新字段中加载了
          formData.value.max_pyramiding_orders = pyramidingConfig.max_orders || 3
          formData.value.pyramiding_scale = Number(pyramidingConfig.scale_percent || 50.0)
          formData.value.pyramiding_price_distance = Number(pyramidingConfig.price_distance || 2.0)
          formData.value.pyramiding_time_interval = pyramidingConfig.time_interval || 3600
        } else {
          // 从旧字段构建
          formData.value.max_pyramiding_orders = trendBot.max_pyramiding_orders || 3
          formData.value.pyramiding_scale = Number(trendBot.pyramiding_scale || 50.0)
          formData.value.pyramiding_price_distance = Number(trendBot.pyramiding_price_distance || 2.0)
          formData.value.pyramiding_time_interval = trendBot.pyramiding_time_interval || 3600
        }

        console.log('✅ [编辑模式] 加载加仓配置:', {
          pyramiding_enabled: formData.value.pyramiding_enabled,
          max_pyramiding_orders: formData.value.max_pyramiding_orders,
          pyramiding_scale: formData.value.pyramiding_scale,
          pyramiding_price_distance: formData.value.pyramiding_price_distance,
          pyramiding_time_interval: formData.value.pyramiding_time_interval
        })

        // ============ 趋势过滤配置（从配置对象中提取）============
        if (trendBot.trend_filter_config) {
          const trendFilterConfig = trendBot.trend_filter_config
          formData.value.trend_filter_enabled = trendFilterConfig.enabled || false
          formData.value.min_trend_strength_adx = Number(trendFilterConfig.min_adx || 25.0)
          formData.value.min_price_change = Number(trendFilterConfig.min_price_change || 1.0)
          formData.value.volume_confirmation_enabled = trendFilterConfig.volume_confirmation || false
          formData.value.volume_threshold = Number(trendFilterConfig.volume_threshold || 1.5)
        } else {
          // 从旧字段构建
          formData.value.trend_filter_enabled = trendBot.trend_filter_enabled || false
          formData.value.min_trend_strength_adx = Number(trendBot.min_trend_strength_adx || 25.0)
          formData.value.min_price_change = Number(trendBot.min_price_change || 1.0)
          formData.value.volume_confirmation_enabled = trendBot.volume_confirmation_enabled || false
          formData.value.volume_threshold = Number(trendBot.volume_threshold || 1.5)
        }

        console.log('✅ [编辑模式] 加载趋势过滤配置:', {
          trend_filter_enabled: formData.value.trend_filter_enabled,
          min_trend_strength_adx: formData.value.min_trend_strength_adx,
          min_price_change: formData.value.min_price_change,
          volume_confirmation_enabled: formData.value.volume_confirmation_enabled,
          volume_threshold: formData.value.volume_threshold
        })

        // ============ 高级功能（额外字段）============
        console.log('🔍 [调试] trendBot 中的字段值:', {
          auto_reverse: trendBot.auto_reverse,
          max_position_time: trendBot.max_position_time,
          funding_fee_check: trendBot.funding_fee_check,
          funding_fee_threshold: trendBot.funding_fee_threshold
        })

        formData.value.auto_reverse = trendBot.auto_reverse !== undefined ? trendBot.auto_reverse : false
        formData.value.max_position_time = Number(trendBot.max_position_time || 24)
        formData.value.funding_fee_threshold = Number(trendBot.funding_fee_threshold || 0.01)

        console.log('✅ [编辑模式] 加载高级功能（额外字段）:', {
          auto_reverse: formData.value.auto_reverse,
          max_position_time: formData.value.max_position_time,
          funding_fee_check: formData.value.funding_fee_check,
          funding_fee_threshold: formData.value.funding_fee_threshold
        })

        // ============ 通知设置（新增字段）============
        formData.value.notify_on_signal = trendBot.notify_on_signal !== undefined ? trendBot.notify_on_signal : true
        formData.value.notify_on_entry = trendBot.notify_on_entry !== undefined ? trendBot.notify_on_entry : true
        formData.value.notify_on_exit = trendBot.notify_on_exit !== undefined ? trendBot.notify_on_exit : true
        formData.value.notify_on_error = trendBot.notify_on_error !== undefined ? trendBot.notify_on_error : true

        console.log('✅ [编辑模式] 加载通知设置:', {
          notify_on_signal: formData.value.notify_on_signal,
          notify_on_entry: formData.value.notify_on_entry,
          notify_on_exit: formData.value.notify_on_exit,
          notify_on_error: formData.value.notify_on_error
        })

        // 通知设置（旧字段 - 向后兼容）
        formData.value.alert_channels = trendBot.alert_channels || ['email', 'app']
        formData.value.alert_on_entry = trendBot.alert_on_entry !== undefined ? trendBot.alert_on_entry : true
        formData.value.alert_on_exit = trendBot.alert_on_exit !== undefined ? trendBot.alert_on_exit : true
        formData.value.alert_on_error = trendBot.alert_on_error !== undefined ? trendBot.alert_on_error : true

        console.log('✅ [编辑模式] 加载通知渠道（旧字段）:', {
          alert_channels: formData.value.alert_channels,
          alert_on_entry: formData.value.alert_on_entry,
          alert_on_exit: formData.value.alert_on_exit,
          alert_on_error: formData.value.alert_on_error
        })

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
      console.log('📊 仓位管理（优化后）:', {
        position_sizing_method: formData.value.position_sizing_method,
        position_size_value: formData.value.position_size_value,
        risk_per_trade: formData.value.risk_per_trade,
        kelly_fraction: formData.value.kelly_fraction
      })
      console.log('📊 交易方向:', {
        trading_direction: formData.value.trading_direction
      })
      console.log('📊 风险管理（优化后）:', {
        stop_loss_config: formData.value.stop_loss_config,
        take_profit_config: formData.value.take_profit_config,
        trailing_stop_config: formData.value.trailing_stop_config,
        breakeven_config: formData.value.breakeven_config
      })
      console.log('📊 订单执行（优化后）:', {
        order_config: formData.value.order_config
      })
      console.log('📊 高级功能（优化后）:', {
        pyramiding_config: formData.value.pyramiding_config,
        trend_filter_config: formData.value.trend_filter_config,
        notification_config: formData.value.notification_config
      })
      console.log('📊 可选功能:', {
        funding_fee_check: formData.value.funding_fee_check,
        pause_on_high_volatility: formData.value.pause_on_high_volatility,
        volatility_threshold: formData.value.volatility_threshold,
        allow_partial_close: formData.value.allow_partial_close,
        smart_exit: formData.value.smart_exit
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


