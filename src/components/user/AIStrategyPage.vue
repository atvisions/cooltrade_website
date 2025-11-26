<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- 顶部导航 -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="ai-strategy" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">
                  策略生成器
                </h1>
                <p class="mt-2 text-gray-600">
                  基于代币技术指标和您的风险画像，AI 自动为您生成个性化交易策略
                </p>
              </div>

              <!-- 历史记录按钮 -->
              <button
                @click="showHistorySidebar = true"
                class="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all group"
                title="历史记录"
              >
                <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!-- 数量徽章 -->
                <span v-if="strategyHistory.length > 0" class="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                  {{ strategyHistory.length > 99 ? '99+' : strategyHistory.length }}
                </span>
                <!-- Hover 提示 -->
                <span class="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  历史记录
                  <!-- 小箭头 -->
                  <span class="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></span>
                </span>
              </button>
            </div>
          </div>

          <!-- 策略生成表单 - 现代简约高级设计 -->
          <div class="bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 overflow-visible">
            <!-- 用户画像信息条 -->
            <div v-if="userProfile" class="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 rounded-t-3xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500">个性化推荐：</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-gray-600">风险偏好</span>
                    <span class="px-2.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                      {{ getRiskLevelLabel(userProfile.risk_level) }}
                    </span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-gray-600">交易风格</span>
                    <span class="px-2.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                      {{ getTradingFrequencyLabel(userProfile.trading_frequency) }}
                    </span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-gray-600">风险评分</span>
                    <span class="px-2.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                      {{ userProfile.risk_score || 0 }}/100
                    </span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-gray-600">经验等级</span>
                    <span class="px-2.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                      {{ getExperienceLevelLabel(userProfile.experience_level) }}
                    </span>
                  </div>
                </div>
                <button
                  @click="goToRiskAssessment"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow flex-shrink-0"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  重新评估
                </button>
              </div>
            </div>

            <!-- 加载中状态 -->
            <div v-else class="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 rounded-t-3xl">
              <div class="flex items-center gap-3">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span class="text-xs text-gray-600">正在加载您的交易画像...</span>
              </div>
            </div>

            <!-- 主表单区域 -->
            <div class="p-6 rounded-b-3xl">
              <div class="flex items-center gap-3">
                <!-- 代币搜索输入框 -->
                <div class="flex-1 relative">
                  <!-- 已选择的代币显示 -->
                  <div v-if="selectedToken" class="h-14 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl px-5 hover:border-blue-300 transition-all group">
                    <div class="flex items-center min-w-0 flex-1 gap-3">
                      <img v-if="selectedToken.logo" :src="selectedToken.logo" :alt="selectedToken.symbol" class="w-9 h-9 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm" />
                      <div class="min-w-0">
                        <div class="font-bold text-gray-900 truncate text-lg">{{ selectedToken.symbol }}</div>
                        <div class="text-xs text-gray-600 truncate">{{ selectedToken.name }}</div>
                      </div>
                    </div>

                    <!-- 策略选择下拉 -->
                    <div class="relative ml-3 flex-shrink-0">
                      <button
                        @click="showStrategyDropdown = !showStrategyDropdown"
                        @blur="handleStrategyBlur"
                        class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all"
                      >
                        <span class="text-xl">{{ getStrategyIcon(formData.strategy_method) }}</span>
                        <span class="text-sm font-medium text-gray-700">{{ getStrategyLabel(formData.strategy_method) }}</span>
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>

                      <!-- 策略下拉菜单 -->
                      <div
                        v-if="showStrategyDropdown"
                        class="absolute z-[100] right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div
                          v-for="method in strategyMethods"
                          :key="method.value"
                          @mousedown="selectStrategyMethod(method.value)"
                          class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          :class="{ 'bg-blue-50': formData.strategy_method === method.value }"
                        >
                          <div class="flex items-center gap-3">
                            <span class="text-2xl">{{ method.icon }}</span>
                            <div class="flex-1">
                              <div class="text-sm font-semibold text-gray-900">{{ method.label }}</div>
                              <div class="text-xs text-gray-500 mt-0.5">{{ method.description }}</div>
                            </div>
                            <svg v-if="formData.strategy_method === method.value" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      @click="clearToken"
                      class="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all flex-shrink-0"
                    >
                      <XMarkIcon class="w-5 h-5" />
                    </button>
                  </div>

                  <!-- 搜索输入框 -->
                  <div v-else class="relative">
                    <input
                      v-model="searchQuery"
                      @input="handleSearch"
                      @focus="showSearchResults = true"
                      type="text"
                      placeholder="搜索代币名称或符号..."
                      class="h-14 w-full pl-12 pr-40 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all text-base placeholder-gray-400 hover:border-gray-300"
                    />
                    <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>

                    <!-- 策略选择下拉 - 在搜索框内 -->
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        @click="showStrategyDropdown = !showStrategyDropdown"
                        @blur="handleStrategyBlur"
                        class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all"
                      >
                        <span class="text-base">{{ getStrategyIcon(formData.strategy_method) }}</span>
                        <span class="text-sm font-medium text-gray-700">{{ getStrategyLabel(formData.strategy_method) }}</span>
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>

                      <!-- 策略下拉菜单 -->
                      <div
                        v-if="showStrategyDropdown"
                        class="absolute z-[100] right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div
                          v-for="method in strategyMethods"
                          :key="method.value"
                          @mousedown="selectStrategyMethod(method.value)"
                          class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          :class="{ 'bg-blue-50': formData.strategy_method === method.value }"
                        >
                          <div class="flex items-center gap-3">
                            <span class="text-2xl">{{ method.icon }}</span>
                            <div class="flex-1">
                              <div class="text-sm font-semibold text-gray-900">{{ method.label }}</div>
                              <div class="text-xs text-gray-500 mt-0.5">{{ method.description }}</div>
                            </div>
                            <svg v-if="formData.strategy_method === method.value" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 搜索结果下拉框 -->
                  <div
                    v-if="showSearchResults && searchResults.length > 0"
                    class="absolute z-[100] w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                  >
                    <div
                      v-for="token in searchResults"
                      :key="token.id"
                      @click="selectToken(token)"
                      class="flex items-center px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all border-b border-gray-100 last:border-0"
                    >
                      <img v-if="token.logo" :src="token.logo" :alt="token.symbol" class="w-10 h-10 rounded-full mr-4 ring-2 ring-gray-100" />
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-gray-900 text-base">{{ token.symbol }}</div>
                        <div class="text-sm text-gray-500 truncate">{{ token.name }}</div>
                      </div>
                      <div class="text-sm font-medium text-gray-700">${{ formatPrice(token.current_price) }}</div>
                    </div>
                  </div>
                </div>

                <!-- 生成按钮 -->
                <button
                  @click="generateStrategy"
                  :disabled="!canGenerate"
                  :class="[
                    'h-14 px-8 rounded-2xl font-bold transition-all flex items-center justify-center gap-2.5 text-base whitespace-nowrap shadow-lg',
                    canGenerate
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  ]"
                >
                  <SparklesIcon class="w-5 h-5" />
                  <span>生成策略</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading 状态 -->
          <div v-if="isGenerating" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 mb-8">
            <div class="flex flex-col items-center justify-center">
              <div class="relative">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <SparklesIcon class="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p class="mt-4 text-gray-600 font-medium">AI 正在分析并生成策略...</p>
              <p class="mt-2 text-sm text-gray-500">这可能需要 10-30 秒，请耐心等待</p>
              <div class="mt-4 flex items-center space-x-2">
                <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <!-- 生成结果区域 -->
          <div v-if="generatedStrategy" id="strategy-result" class="space-y-6">
            <!-- 缓存提示 -->
            <div v-if="isCachedStrategy" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-blue-900">使用缓存策略</div>
                  <div class="text-xs text-blue-700 mt-0.5">
                    此策略在 {{ cacheAgeMinutes }} 分钟前生成，数据仍然有效（4小时内）
                  </div>
                </div>
              </div>
            </div>

            <!-- 策略报告容器 -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
              <!-- 标题栏 -->
              <div class="p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <div class="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <h2 class="text-xl font-bold text-gray-900">{{ generatedStrategy.token_symbol }} 策略分析报告</h2>
                    </div>
                    <div class="text-sm text-gray-600 ml-14">
                      生成时间：{{ formatDateTime(generatedStrategy.created_at) }} · {{ getSelectedMethodLabel() }}
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex items-center gap-2">
                    <!-- 保存按钮 -->
                    <button
                      v-if="!generatedStrategy.is_applied"
                      @click="saveStrategy"
                      title="保存策略"
                      class="w-9 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                      </svg>
                    </button>
                    <button
                      v-else
                      title="已保存"
                      class="w-9 h-9 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center"
                      disabled
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </button>

                    <!-- 复制按钮 -->
                    <button
                      @click="copyStrategy"
                      title="复制内容"
                      class="w-9 h-9 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 当前市场价格（整合版） -->
              <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  <h3 class="text-lg font-bold text-gray-900">当前市场价格</h3>
                </div>
                <div class="bg-white rounded-2xl p-6 border border-gray-200">
                  <!-- 价格和位置 -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600 mb-1">{{ generatedStrategy.token_symbol }} 当前价格</div>
                      <div class="text-4xl font-bold text-blue-600">
                        ${{ formatPrice(generatedStrategy.snapshot_price || generatedStrategy.token_current_price) }}
                      </div>
                      <!-- 如果有建议入场价且与快照价格不同，显示建议入场价 -->
                      <div v-if="generatedStrategy.entry_price && Math.abs(generatedStrategy.entry_price - (generatedStrategy.snapshot_price || generatedStrategy.token_current_price)) > 0.01" class="text-xs text-gray-500 mt-1">
                        建议入场价: ${{ formatPrice(generatedStrategy.entry_price) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xs text-gray-500 mb-2">价格位置</div>
                      <!-- 网格交易显示相对网格中心的偏离 -->
                      <div v-if="generatedStrategy.additional_parameters?.grid_config" class="text-sm font-semibold" :class="calculateGridDeviation(generatedStrategy.snapshot_price || generatedStrategy.token_current_price, generatedStrategy.additional_parameters.grid_config.settings?.lower_price || generatedStrategy.additional_parameters.grid_config.grid_lower_price, generatedStrategy.additional_parameters.grid_config.settings?.higher_price || generatedStrategy.additional_parameters.grid_config.grid_upper_price) > 0 ? 'text-green-600' : calculateGridDeviation(generatedStrategy.snapshot_price || generatedStrategy.token_current_price, generatedStrategy.additional_parameters.grid_config.settings?.lower_price || generatedStrategy.additional_parameters.grid_config.grid_lower_price, generatedStrategy.additional_parameters.grid_config.settings?.higher_price || generatedStrategy.additional_parameters.grid_config.grid_upper_price) < 0 ? 'text-red-600' : 'text-gray-600'">
                        {{ calculateGridDeviation(generatedStrategy.snapshot_price || generatedStrategy.token_current_price, generatedStrategy.additional_parameters.grid_config.settings?.lower_price || generatedStrategy.additional_parameters.grid_config.grid_lower_price, generatedStrategy.additional_parameters.grid_config.settings?.higher_price || generatedStrategy.additional_parameters.grid_config.grid_upper_price) > 0 ? '偏上 +' : calculateGridDeviation(generatedStrategy.snapshot_price || generatedStrategy.token_current_price, generatedStrategy.additional_parameters.grid_config.settings?.lower_price || generatedStrategy.additional_parameters.grid_config.grid_lower_price, generatedStrategy.additional_parameters.grid_config.settings?.higher_price || generatedStrategy.additional_parameters.grid_config.grid_upper_price) < 0 ? '偏下 ' : '居中 ' }}{{ Math.abs(calculateGridDeviation(generatedStrategy.snapshot_price || generatedStrategy.token_current_price, generatedStrategy.additional_parameters.grid_config.settings?.lower_price || generatedStrategy.additional_parameters.grid_config.grid_lower_price, generatedStrategy.additional_parameters.grid_config.settings?.higher_price || generatedStrategy.additional_parameters.grid_config.grid_upper_price)) }}%
                      </div>
                      <!-- 非网格交易显示24h涨跌 -->
                      <div v-else class="text-sm font-semibold" :class="(generatedStrategy.market_condition?.price_change_percentage_24h || 0) > 0 ? 'text-green-600' : 'text-red-600'">
                        {{ (generatedStrategy.market_condition?.price_change_percentage_24h || 0) > 0 ? '+' : '' }}{{ (generatedStrategy.market_condition?.price_change_percentage_24h || 0).toFixed(2) }}%
                      </div>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ generatedStrategy.additional_parameters?.grid_config ? '相对网格中心' : '24小时涨跌' }}
                      </div>
                    </div>
                  </div>

                  <!-- 网格价格范围（仅网格交易显示） -->
                  <div v-if="generatedStrategy.additional_parameters?.grid_config" class="mt-4 pt-4 border-t border-gray-100">
                    <div class="flex items-center justify-between text-sm">
                      <div>
                        <span class="text-gray-500">网格下限：</span>
                        <span class="font-semibold text-red-600">
                          ${{ formatPrice(generatedStrategy.additional_parameters.grid_config.settings?.lower_price || generatedStrategy.additional_parameters.grid_config.grid_lower_price) }}
                        </span>
                      </div>
                      <div>
                        <span class="text-gray-500">网格上限：</span>
                        <span class="font-semibold text-green-600">
                          ${{ formatPrice(generatedStrategy.additional_parameters.grid_config.settings?.higher_price || generatedStrategy.additional_parameters.grid_config.grid_upper_price) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 交易方向指示（所有策略显示） -->
                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="text-sm text-gray-600">交易方向：</div>
                        <div class="flex items-center gap-2">
                          <!-- 交易方向图标和文字 -->
                          <div v-if="generatedStrategy.trading_direction === 'long'" class="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                            </svg>
                            <span class="font-bold text-green-700">做多 (Long)</span>
                          </div>
                          <div v-else-if="generatedStrategy.trading_direction === 'short'" class="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                            </svg>
                            <span class="font-bold text-red-700">做空 (Short)</span>
                          </div>
                          <div v-else class="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                            </svg>
                            <span class="font-bold text-blue-700">双向 (Both)</span>
                          </div>

                          <!-- 市场趋势标签 -->
                          <div class="px-3 py-2 rounded-lg text-sm font-medium"
                               :class="{
                                 'bg-green-50 text-green-700 border border-green-200': generatedStrategy.market_trend === 'bullish',
                                 'bg-red-50 text-red-700 border border-red-200': generatedStrategy.market_trend === 'bearish',
                                 'bg-gray-50 text-gray-700 border border-gray-200': generatedStrategy.market_trend === 'sideways'
                               }">
                            {{ generatedStrategy.market_trend === 'bullish' ? '看涨市场' : generatedStrategy.market_trend === 'bearish' ? '看跌市场' : '横盘震荡' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 新的策略卡片（仅趋势策略显示） -->
              <div v-if="generatedStrategy.primary_entry_price || generatedStrategy.alternative_entry_price || generatedStrategy.confidence_level" class="p-6 border-b border-gray-200">
                <StrategyCardNew :strategy="generatedStrategy" />
              </div>

              <!-- 网格交易配置（仅网格交易显示） -->
              <!-- <div v-if="generatedStrategy.additional_parameters?.grid_config">
                <GridConfig
                  :config="{
                    ...generatedStrategy.additional_parameters.grid_config,
                    leverage: generatedStrategy.leverage,
                    position_size_percentage: generatedStrategy.position_size_percentage
                  }"
                />
              </div> -->

              <!-- 定投策略配置（仅定投策略显示） -->
              <!-- <div v-if="generatedStrategy.additional_parameters?.dca_config" class="p-6 border-b border-gray-200">
                <DCAConfig :config="generatedStrategy.additional_parameters.dca_config" />
              </div> -->

              <!-- 突破策略配置（仅突破策略显示） -->
              <div v-if="generatedStrategy.additional_parameters?.breakout_config" class="p-6 border-b border-gray-200">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  突破策略配置
                </h3>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <!-- 突破价格 -->
                  <div class="bg-white rounded-lg p-3.5 border border-gray-200">
                    <div class="text-[10px] text-gray-500 mb-1">突破价格</div>
                    <div class="text-xl font-bold text-purple-600">
                      ${{ parseFloat(generatedStrategy.additional_parameters.breakout_config.breakout_price || 0).toFixed(2) }}
                    </div>
                  </div>

                  <!-- 确认周期 -->
                  <div class="bg-white rounded-lg p-3.5 border border-gray-200">
                    <div class="text-[10px] text-gray-500 mb-1">确认周期</div>
                    <div class="text-xl font-bold text-indigo-600">
                      {{ generatedStrategy.additional_parameters.breakout_config.confirmation_period || '-' }}
                    </div>
                  </div>

                  <!-- 止损距离 -->
                  <div class="bg-white rounded-lg p-3.5 border border-gray-200">
                    <div class="text-[10px] text-gray-500 mb-1">止损距离</div>
                    <div class="text-xl font-bold text-red-600">
                      {{ generatedStrategy.additional_parameters.breakout_config.stop_loss_percentage || 0 }}%
                    </div>
                  </div>

                  <!-- 目标倍数 -->
                  <div class="bg-white rounded-lg p-3.5 border border-gray-200">
                    <div class="text-[10px] text-gray-500 mb-1">目标倍数</div>
                    <div class="text-xl font-bold text-green-600">
                      {{ generatedStrategy.additional_parameters.breakout_config.target_multiplier || 0 }}x
                    </div>
                  </div>
                </div>
              </div>

              <!-- 策略分析报告 -->
              <div class="px-8 py-8 bg-gray-50">
                <!-- Markdown 内容 - 卡片式布局 -->
                <div class="strategy-report-content max-w-5xl mx-auto">
                  <div v-html="renderMarkdown(generatedStrategy.content)"></div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5">
              <div class="flex items-center justify-end gap-2">
                <!-- 保存按钮 -->
                <button
                  v-if="!generatedStrategy.is_applied"
                  @click="saveStrategy"
                  title="保存策略"
                  class="w-9 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                  </svg>
                </button>
                <button
                  v-else
                  title="已保存"
                  class="w-9 h-9 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center"
                  disabled
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>

                <!-- 复制按钮 -->
                <button
                  @click="copyStrategy"
                  title="复制内容"
                  class="w-9 h-9 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>

    <!-- 历史记录侧边栏 -->
    <Transition name="fade">
      <div
        v-if="showHistorySidebar"
        class="fixed inset-0 z-50 overflow-hidden"
      >
        <!-- 遮罩层 -->
        <div
          @click="showHistorySidebar = false"
          class="absolute inset-0 bg-black bg-opacity-50"
        ></div>

        <!-- 侧边栏 -->
        <Transition name="slide">
          <div v-if="showHistorySidebar" class="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl flex flex-col">
          <!-- 头部 -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">查询记录</h2>
                <p class="text-xs text-gray-500">最近生成的策略</p>
              </div>
            </div>
            <button
              @click="showHistorySidebar = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- 刷新按钮 -->
          <div class="px-6 py-3 border-b border-gray-100">
            <button
              @click="loadStrategyHistory"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              刷新记录
            </button>
          </div>

          <!-- 历史记录列表 -->
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="strategyHistory.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
              <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-sm">暂无查询记录</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="strategy in strategyHistory"
                :key="strategy.id"
                @click="loadStrategy(strategy.id); showHistorySidebar = false"
                class="group p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all"
              >
                <div class="flex items-center gap-3 mb-2">
                  <img v-if="strategy.token_logo" :src="strategy.token_logo" :alt="strategy.token_symbol" class="w-10 h-10 rounded-full flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-bold text-gray-900">{{ strategy.token_symbol }}</span>
                      <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {{ strategy.strategy_method_display || getStrategyMethodLabel(strategy.strategy_method) }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDateTime(strategy.created_at) }}
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="p-6 border-t border-gray-200">
            <button
              @click="goToMyStrategies"
              class="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              查看全部策略
            </button>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 遮罩层淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 侧边栏滑动动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { SparklesIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
// import GridConfig from './strategies/GridConfig.vue'
// import DCAConfig from './strategies/DCAConfig.vue'
import StrategyCardNew from './StrategyCardNew.vue'
import { apiRequest, API_ENDPOINTS } from '../../utils/api'
import { showSuccess, showError } from '../../utils/notification'

const router = useRouter()

// 搜索相关
const searchQuery = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)
const selectedToken = ref(null)
const searchTimeout = ref(null)

// 策略方法下拉
const showStrategyDropdown = ref(false)

// 表单数据
const formData = ref({
  trading_style: 'swing',
  strategy_method: 'trend',
  risk_level: 'balanced'
})

// 生成状态
const isGenerating = ref(false)

// 生成的策略
const generatedStrategy = ref(null)

// 缓存状态
const isCachedStrategy = ref(false)
const cacheAgeMinutes = ref(0)

// 策略历史记录
const strategyHistory = ref([])
const showHistorySidebar = ref(false)

// 用户画像
const userProfile = ref(null)

// 配置选项
const tradingStyles = [
  { value: 'swing', label: '波段交易' },
  { value: 'day', label: '日内交易' },
  { value: 'scalping', label: '超短线' },
  { value: 'position', label: '趋势持仓' }
]

const strategyMethods = [
  { value: 'trend', label: '趋势分析', icon: '📈', description: '基于技术指标的趋势分析报告' }
]

const riskLevels = [
  { value: 'conservative', label: '保守型', activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'balanced', label: '平衡型', activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
  { value: 'aggressive', label: '激进型', activeClass: 'border-red-500 bg-red-50 text-red-700' }
]

// 计算属性
const canGenerate = computed(() => {
  return selectedToken.value !== null
})

// 搜索代币
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim().length < 1) {
      searchResults.value = []
      return
    }

    try {
      const response = await apiRequest(`${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${searchQuery.value}`)
      if (response.status === 'success') {
        searchResults.value = response.data.results
      }
    } catch (error) {
      console.error('搜索代币失败:', error)
    }
  }, 300)
}

// 选择代币
const selectToken = (token) => {
  selectedToken.value = token
  searchQuery.value = token.symbol
  showSearchResults.value = false
  searchResults.value = []
}

// 清除选择
const clearToken = () => {
  selectedToken.value = null
  searchQuery.value = ''
}

// 生成策略
const generateStrategy = async () => {
  if (!canGenerate.value || isGenerating.value) return

  isGenerating.value = true
  generatedStrategy.value = null

  try {
    const requestData = {
      token_id: selectedToken.value.id,
      ...formData.value
    }
    console.log('🚀 生成策略请求数据:', requestData)

    const response = await apiRequest(API_ENDPOINTS.AI_STRATEGY_GENERATE, {
      method: 'POST',
      body: JSON.stringify(requestData)
    })

    if (response.status === 'success') {
      console.log('✅ 策略生成响应:', {
        cached: response.cached,
        cache_age_minutes: response.cache_age_minutes,
        strategy_method: response.data.strategy_method,
        strategy_method_display: response.data.strategy_method_display
      })

      // 保存生成的策略
      generatedStrategy.value = response.data

      // 调试：检查 content 字段
      console.log('📝 content 字段类型:', typeof response.data.content)
      console.log('📝 content 字段长度:', response.data.content?.length)
      console.log('📝 content 字段前200字符:', response.data.content?.substring(0, 200))

      // 设置缓存状态
      isCachedStrategy.value = response.cached || false
      cacheAgeMinutes.value = response.cache_age_minutes || 0

      // 刷新历史记录
      loadStrategyHistory()

      // 滚动到结果区域
      setTimeout(() => {
        const resultElement = document.getElementById('strategy-result')
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)

      // 如果使用了缓存，显示提示
      if (response.cached) {
        console.log(`📦 使用缓存策略（${response.cache_age_minutes}分钟前生成）`)
      } else {
        console.log('🆕 生成新策略')
      }
    }
  } catch (error) {
    console.error('生成策略失败:', error)
    alert('生成策略失败，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}

// 重置表单
const resetForm = () => {
  generatedStrategy.value = null
  isCachedStrategy.value = false
  cacheAgeMinutes.value = 0
  selectedToken.value = null
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
  // 重新加载用户画像以恢复默认值
  loadUserProfile()
}

// 保存策略
const saveStrategy = async () => {
  if (!generatedStrategy.value) return

  try {
    // 将策略标记为已应用（保存到"我的策略"）
    const response = await apiRequest(API_ENDPOINTS.AI_STRATEGY_APPLY, {
      method: 'POST',
      body: JSON.stringify({
        strategy_id: generatedStrategy.value.id
      })
    })

    if (response.status === 'success') {
      showSuccess('策略已保存到"我的策略"', '保存成功')
      generatedStrategy.value.is_saved = true
      generatedStrategy.value.is_applied = true
    }
  } catch (error) {
    console.error('保存策略失败:', error)
    showError('保存策略失败，请稍后重试', '保存失败')
  }
}

// 加载策略历史记录
const loadStrategyHistory = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.AI_STRATEGY_LIST, {
      method: 'GET'
    })

    console.log('历史记录响应:', response)

    // 直接使用分页响应的 results
    if (response.results) {
      strategyHistory.value = response.results
      console.log('加载了', strategyHistory.value.length, '条历史记录')
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

// 加载指定策略
const loadStrategy = async (strategyId) => {
  try {
    console.log('正在加载策略 ID:', strategyId)
    const response = await apiRequest(`${API_ENDPOINTS.AI_STRATEGY_DETAIL}${strategyId}/`, {
      method: 'GET'
    })

    console.log('策略详情响应:', response)

    if (response.status === 'success' && response.data) {
      generatedStrategy.value = response.data
      // 从历史记录加载的策略不显示缓存提示
      isCachedStrategy.value = false
      cacheAgeMinutes.value = 0
      console.log('策略加载成功:', generatedStrategy.value)

      // 滚动到结果区域
      nextTick(() => {
        const resultElement = document.getElementById('strategy-result')
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    } else {
      console.error('响应格式不正确:', response)
      alert('加载策略失败：响应格式不正确')
    }
  } catch (error) {
    console.error('加载策略失败:', error)
    alert('加载策略失败，请稍后重试')
  }
}

// 前往我的策略
const goToMyStrategies = () => {
  router.push('/trading')  // 交易中心的"我的策略" tab
}

// 复制策略内容
const copyStrategy = async () => {
  if (!generatedStrategy.value) return

  try {
    // 复制策略内容到剪贴板
    const content = generatedStrategy.value.content
    await navigator.clipboard.writeText(content)
    showSuccess('策略内容已复制到剪贴板', '复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    showError('复制失败，请稍后重试', '复制失败')
  }
}

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  return parseFloat(price).toFixed(2)
}

// 生成完整的网格明细
const getGridLevels = (gridConfig) => {
  // 如果 AI 已经返回了完整的网格明细，直接使用
  if (gridConfig.grid_levels && gridConfig.grid_levels.length > 2) {
    return gridConfig.grid_levels
  }

  // 否则根据设置自动生成
  const settings = gridConfig.settings || {}
  const lowerPrice = parseFloat(settings.lower_price || 0)
  const higherPrice = parseFloat(settings.higher_price || 0)
  const grids = parseInt(settings.grids || gridConfig.grid_count || 10)

  if (!lowerPrice || !higherPrice || !grids) {
    return gridConfig.grid_levels || []
  }

  // 计算每格价格间距
  const priceStep = (higherPrice - lowerPrice) / grids

  // 生成网格明细
  const levels = []
  for (let i = 0; i < grids; i++) {
    const buyPrice = lowerPrice + (priceStep * i)
    const sellPrice = lowerPrice + (priceStep * (i + 1))

    levels.push({
      level: i + 1,
      buy_price: buyPrice,
      sell_price: sellPrice
    })
  }

  return levels
}

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  return parseFloat(num).toFixed(2)
}

// 计算百分比变化
const calculatePercentage = (entry, target) => {
  if (!entry || !target) return '0.00'
  const percentage = ((target - entry) / entry * 100).toFixed(2)
  return Math.abs(percentage)
}

// 计算网格价格偏离度（当前价格相对于网格中心的偏离百分比）
const calculateGridDeviation = (currentPrice, lowerPrice, higherPrice) => {
  if (!currentPrice || !lowerPrice || !higherPrice) return 0
  const midPrice = (parseFloat(lowerPrice) + parseFloat(higherPrice)) / 2
  const deviation = ((parseFloat(currentPrice) - midPrice) / midPrice * 100).toFixed(2)
  return parseFloat(deviation)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 格式化完整日期时间
const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// RSI 颜色
const getRSIColor = (rsi) => {
  if (rsi >= 70) return 'text-red-600'
  if (rsi <= 30) return 'text-green-600'
  return 'text-gray-900'
}

// RSI 状态
const getRSIStatus = (rsi) => {
  if (rsi >= 70) return '超买'
  if (rsi <= 30) return '超卖'
  return '中性'
}

// 渲染 Markdown
const renderMarkdown = (content) => {
  if (!content) return ''

  let html = content

  // 代码块（三个反引号）
  html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-6 shadow-lg border border-gray-700"><code class="text-sm">$2</code></pre>')

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-mono border border-blue-200">$1</code>')

  // 特殊模块识别和样式化 - 卡片式设计
  // 风险提示 - 使用感叹号图标
  html = html.replace(/^## (\d+\.\s*)?(风险提示|风险警告|Risk Warning)$/gm, '<div class="section-card bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div><h2 class="text-base font-semibold text-gray-900">$2</h2></div><div class="section-content">')

  // 市场分析 - 使用图表图标
  html = html.replace(/^## (\d+\.\s*)?(市场分析|Market Analysis)$/gm, '<div class="section-card bg-white border border-gray-200"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div><h2 class="text-base font-semibold text-gray-900">$2</h2></div><div class="section-content">')

  // 策略概述 - 使用灯泡图标
  html = html.replace(/^## (\d+\.\s*)?(策略概述|策略描述|Strategy Overview)$/gm, '<div class="section-card bg-white border border-gray-200"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></div><h2 class="text-base font-semibold text-gray-900">$2</h2></div><div class="section-content">')

  // 交易参数 - 使用设置图标
  html = html.replace(/^## (\d+\.\s*)?(交易参数|Trading Parameters)$/gm, '<div class="section-card bg-white border border-gray-200"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg></div><h2 class="text-base font-semibold text-gray-900">$2</h2></div><div class="section-content">')

  // 执行建议 - 使用清单图标
  html = html.replace(/^## (\d+\.\s*)?(执行建议|执行步骤|Execution Steps)$/gm, '<div class="section-card bg-white border border-gray-200"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg></div><h2 class="text-base font-semibold text-gray-900">$2</h2></div><div class="section-content">')

  // 默认的 H2 标题
  html = html.replace(/^## (\d+\.\s*)?(.+)$/gm, '<div class="section-card bg-white border border-gray-200"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div><h2 class="text-base font-semibold text-gray-900">$2</h2></div><div class="section-content">')

  html = html.replace(/^### (\d+\.\s*)?(.+)$/gm, '<h3 class="text-sm font-semibold text-gray-800 mt-5 mb-3 pl-3 border-l-2 border-gray-300">$2</h3>')
  html = html.replace(/^#### (\d+\.\s*)?(.+)$/gm, '<h4 class="text-sm font-medium text-gray-700 mt-4 mb-2">$2</h4>')
  html = html.replace(/^# (\d+\.\s*)?(.+)$/gm, '<h1 class="text-lg font-bold text-gray-900 mb-5 pb-4 border-b-2 border-gray-300">$2</h1>')

  // 粗体和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-semibold text-gray-900"><em class="italic">$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-600">$1</em>')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-indigo-600 hover:text-indigo-700 underline decoration-1 hover:decoration-2 transition-all text-sm font-medium">$1</a>')

  // 分隔线
  html = html.replace(/^---$/gm, '<hr class="my-4 border-t border-gray-200">')
  html = html.replace(/^\*\*\*$/gm, '<hr class="my-4 border-t border-gray-200">')

  // 引用
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-3 border-indigo-400 pl-3 py-2 my-3 bg-indigo-50 text-gray-600 text-sm italic rounded-r">$1</blockquote>')

  // 有序列表
  let inOrderedList = false
  let orderCounter = 0
  html = html.split('\n').map(line => {
    if (/^\d+\.\s+(.+)$/.test(line)) {
      const match = line.match(/^\d+\.\s+(.+)$/)
      if (!inOrderedList) {
        inOrderedList = true
        orderCounter = 1
        return '<ol class="space-y-2.5 my-4"><li class="flex items-start gap-3 leading-relaxed"><span class="text-gray-900 font-semibold flex-shrink-0 min-w-[24px] mt-0.5">1.</span><span class="flex-1">' + match[1] + '</span></li>'
      }
      orderCounter++
      return '<li class="flex items-start gap-3 leading-relaxed"><span class="text-gray-900 font-semibold flex-shrink-0 min-w-[24px] mt-0.5">' + orderCounter + '.</span><span class="flex-1">' + match[1] + '</span></li>'
    } else if (inOrderedList && line.trim() === '') {
      inOrderedList = false
      orderCounter = 0
      return '</ol>'
    }
    return line
  }).join('\n')
  if (inOrderedList) html += '</ol>'

  // 无序列表
  let inUnorderedList = false
  html = html.split('\n').map(line => {
    if (/^[-*]\s+(.+)$/.test(line)) {
      const match = line.match(/^[-*]\s+(.+)$/)
      if (!inUnorderedList) {
        inUnorderedList = true
        return '<ul class="space-y-2.5 my-4"><li class="flex items-start gap-3"><span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></span><span class="flex-1 leading-relaxed">' + match[1] + '</span></li>'
      }
      return '<li class="flex items-start gap-3"><span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></span><span class="flex-1 leading-relaxed">' + match[1] + '</span></li>'
    } else if (inUnorderedList && line.trim() === '') {
      inUnorderedList = false
      return '</ul>'
    }
    return line
  }).join('\n')
  if (inUnorderedList) html += '</ul>'

  // 段落（处理连续的非空行）
  html = html.split('\n\n').map(block => {
    // 如果已经是 HTML 标签，不要包裹 <p>
    if (block.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr|table|div)/)) {
      return block
    }
    // 移除单独的换行符，保留块之间的分隔
    block = block.replace(/\n/g, ' ')
    return block.trim() ? '<p class="leading-relaxed mb-3.5">' + block + '</p>' : ''
  }).join('\n')

  // 关闭所有打开的 section-card div
  // 计算需要关闭的 div 数量
  const openDivs = (html.match(/<div class="section-card/g) || []).length
  for (let i = 0; i < openDivs; i++) {
    html += '</div></div>'
  }

  return '<div class="markdown-content">' + html + '</div>'
}

// 获取标签文本
const getTradingStyleLabel = (value) => {
  const style = tradingStyles.find(s => s.value === value)
  return style ? style.label : value
}

const getRiskLevelLabel = (value) => {
  // 映射 userProfile 中的风险等级到显示标签
  const labels = {
    'conservative': '保守型',
    'moderate': '平衡型',
    'balanced': '平衡型',
    'aggressive': '激进型'
  }
  return labels[value] || value
}

const getExperienceLevelLabel = (value) => {
  const labels = {
    'beginner': '新手（<6个月）',
    'intermediate': '初级（6个月-2年）',
    'advanced': '中级（2-5年）',
    'expert': '高级（>5年）'
  }
  return labels[value] || value
}

const getTradingFrequencyLabel = (value) => {
  const labels = {
    'long': '长期持仓',
    'medium': '中期波段',
    'short': '短期交易',
    'high': '高频交易'
  }
  return labels[value] || value
}

const getStrategyMethodLabel = (value) => {
  const method = strategyMethods.find(m => m.value === value)
  return method ? method.label : value
}

// 获取策略标签（别名）
const getStrategyLabel = (value) => {
  return getStrategyMethodLabel(value)
}

const getStrategyIcon = (value) => {
  const method = strategyMethods.find(m => m.value === value)
  return method ? method.icon : '📊'
}

// 前往风险评估页面
const goToRiskAssessment = () => {
  router.push('/risk-assessment')
}

// 获取选中的策略方法标签
const getSelectedMethodLabel = () => {
  const method = strategyMethods.find(m => m.value === formData.value.strategy_method)
  return method ? method.label : ''
}

// 选择策略方法
const selectStrategyMethod = (value) => {
  formData.value.strategy_method = value
  showStrategyDropdown.value = false
}

// 处理策略下拉失焦
const handleStrategyBlur = () => {
  setTimeout(() => {
    showStrategyDropdown.value = false
  }, 200)
}

// 加载用户画像
const loadUserProfile = async () => {
  try {
    console.log('🔄 开始加载用户画像...')
    const response = await apiRequest(API_ENDPOINTS.USER_PROFILE)
    console.log('📦 用户画像API响应:', response)

    if (response.status === 'success' && response.data) {
      console.log('✅ 用户数据:', response.data)

      // 检查是否有 risk_profile
      if (response.data.risk_profile) {
        userProfile.value = response.data.risk_profile
        console.log('✅ 用户画像数据已加载:', userProfile.value)

        // 根据用户画像自动设置策略参数
        const riskProfile = response.data.risk_profile

        // 映射风险等级
        const riskLevelMap = {
          'conservative': 'conservative',
          'moderate': 'balanced',
          'aggressive': 'aggressive'
        }
        formData.value.risk_level = riskLevelMap[riskProfile.risk_level] || 'balanced'

        // 根据交易频率映射交易风格
        const tradingFrequency = riskProfile.trading_frequency
        if (tradingFrequency === 'long') {
          formData.value.trading_style = 'position'  // 长期 -> 趋势持仓
        } else if (tradingFrequency === 'medium') {
          formData.value.trading_style = 'swing'     // 中期 -> 波段交易
        } else if (tradingFrequency === 'short') {
          formData.value.trading_style = 'day'       // 短期 -> 日内交易
        } else if (tradingFrequency === 'high') {
          formData.value.trading_style = 'scalping'  // 高频 -> 超短线
        }

        console.log('✅ 用户画像已加载，自动配置策略参数:', formData.value)
      } else {
        console.warn('⚠️ 用户未完成风险评估，risk_profile 为空')
        // 即使没有 risk_profile，也设置一个默认的 userProfile 以隐藏加载状态
        userProfile.value = {
          risk_score: 0,
          experience_level: 'beginner',
          risk_level: 'moderate',
          trading_frequency: 'medium'
        }
      }
    } else {
      console.error('❌ API响应格式不正确:', response)
    }
  } catch (error) {
    console.error('❌ 加载用户画像失败:', error)
    // 设置一个默认值以避免一直显示加载状态
    userProfile.value = {
      risk_score: 0,
      experience_level: 'beginner',
      risk_level: 'moderate',
      trading_frequency: 'medium'
    }
  }
}

// 页面加载
onMounted(() => {
  loadUserProfile()
  loadStrategyHistory()
})
</script>

<style scoped>
/* 策略报告内容样式 */
.strategy-report-content {
  font-size: 15px;
  line-height: 1.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.01em;
}

.strategy-report-content :deep(.markdown-content) {
  color: #374151;
}

/* 章节卡片样式 - 卡片式设计 */
.strategy-report-content :deep(.section-card) {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.strategy-report-content :deep(.section-card:hover) {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transform: translateY(-1px);
}

.strategy-report-content :deep(.section-content) {
  padding-left: 0;
}

.strategy-report-content :deep(h1) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: -0.01em;
}

.strategy-report-content :deep(h2) {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
}

.strategy-report-content :deep(h3) {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #374151;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  padding-left: 0.75rem;
  border-left: 2px solid #d1d5db;
}

.strategy-report-content :deep(h4) {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #4b5563;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.strategy-report-content :deep(p) {
  margin-bottom: 0.875rem;
  color: #374151;
  line-height: 1.75;
  font-size: 0.9375rem;
}

.strategy-report-content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.strategy-report-content :deep(em) {
  font-style: italic;
  color: #6b7280;
}

/* 关键数据高亮 */
.strategy-report-content :deep(strong:has(+ strong)),
.strategy-report-content :deep(p > strong:first-child) {
  color: #1f2937;
  font-weight: 600;
}

/* 数字和数据样式 */
.strategy-report-content :deep(p) {
  word-spacing: 0.05em;
}

.strategy-report-content :deep(code) {
  padding: 0.125rem 0.375rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.strategy-report-content :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
}

.strategy-report-content :deep(pre code) {
  background: transparent;
  color: #374151;
  border: none;
  padding: 0;
  font-size: 0.8125rem;
}

.strategy-report-content :deep(ul) {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
}

.strategy-report-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
}

.strategy-report-content :deep(li) {
  margin-bottom: 0.625rem;
  color: #374151;
  line-height: 1.75;
  font-size: 0.9375rem;
}

.strategy-report-content :deep(blockquote) {
  margin: 0.5rem 0;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-left: 2px solid #d1d5db;
  border-radius: 0 0.25rem 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.strategy-report-content :deep(hr) {
  margin: 0.75rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.strategy-report-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
  font-size: 0.875rem;
}

.strategy-report-content :deep(a:hover) {
  color: #1d4ed8;
}

.strategy-report-content :deep(table) {
  width: 100%;
  margin: 0.75rem 0;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  font-size: 0.875rem;
}

.strategy-report-content :deep(th) {
  background: #f9fafb;
  color: #374151;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8125rem;
  border-bottom: 1px solid #e5e7eb;
}

.strategy-report-content :deep(td) {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #6b7280;
  font-size: 0.8125rem;
}

.strategy-report-content :deep(tr:last-child td) {
  border-bottom: none;
}

.strategy-report-content :deep(tbody tr:hover) {
  background: #f9fafb;
}

/* 数据卡片样式 - 简约风格 */
.strategy-report-content :deep(.data-card) {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

/* 警告框样式 */
.strategy-report-content :deep(.warning-box) {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-left: 2px solid #ef4444;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: start;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* 成功/提示框样式 */
.strategy-report-content :deep(.success-box) {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 2px solid #22c55e;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: start;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* 信息框样式 */
.strategy-report-content :deep(.info-box) {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-left: 2px solid #3b82f6;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: start;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* 数值高亮 */
.strategy-report-content :deep(.highlight-number) {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  font-family: 'Monaco', 'Menlo', monospace;
}

/* 百分比样式 */
.strategy-report-content :deep(.percentage) {
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.strategy-report-content :deep(.percentage.positive) {
  background: #dcfce7;
  color: #16a34a;
}

.strategy-report-content :deep(.percentage.negative) {
  background: #fee2e2;
  color: #dc2626;
}

/* 标签样式 */
.strategy-report-content :deep(.tag) {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.375rem;
  margin-bottom: 0.375rem;
  border: 1px solid;
}

.strategy-report-content :deep(.tag.primary) {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.strategy-report-content :deep(.tag.success) {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.strategy-report-content :deep(.tag.warning) {
  background: #fffbeb;
  color: #d97706;
  border-color: #fde68a;
}

.strategy-report-content :deep(.tag.danger) {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .strategy-report-content {
    font-size: 0.8125rem;
  }

  .strategy-report-content :deep(h1) {
    font-size: 0.9375rem;
  }

  .strategy-report-content :deep(h2) {
    font-size: 0.8125rem;
  }

  .strategy-report-content :deep(h3) {
    font-size: 0.75rem;
  }

  .strategy-report-content :deep(.section-card) {
    padding: 0.75rem;
  }

  .strategy-report-content :deep(pre) {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
