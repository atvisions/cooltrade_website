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
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 class="text-3xl font-bold text-slate-900">
                  {{ isEditMode ? '编辑趋势跟踪机器人' : '创建趋势跟踪机器人' }}
                </h1>
                <p class="text-slate-600 mt-1">配置自动交易策略和风险管理</p>
              </div>
            </div>
          </div>

          <!-- 基础信息 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-semibold text-slate-900">基础信息</div>
                <div class="text-xs text-slate-500">机器人名称和描述</div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  机器人名称 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="例如：BTC 趋势跟踪"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">描述（可选）</label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  placeholder="描述机器人的策略和用途"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </Card>

          <!-- 交易所配置 -->
          <ExchangeSelector
            v-model:selectedExchange="selectedExchangeType"
            v-model:marketType="formData.market_type"
            v-model:exchangeApiId="formData.exchange_api"
            :exchangeApis="exchangeApis"
            :errors="errors"
            class="mb-6"
          />

          <!-- 代币选择 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-semibold text-slate-900">交易代币</div>
                <div class="text-xs text-slate-500">选择要交易的加密货币</div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  代币 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="tokenSearchQuery"
                  type="text"
                  placeholder="搜索代币名称或符号，如 BTC, ETH"
                  @input="searchTokens"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                
                <!-- 搜索结果 -->
                <div v-if="filteredTokens.length > 0" class="mt-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
                  <button
                    v-for="token in filteredTokens"
                    :key="token.id"
                    @click="selectToken(token)"
                    class="w-full px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-left"
                  >
                    <img :src="token.logo" :alt="token.symbol" class="w-8 h-8 rounded-full" />
                    <div class="flex-1">
                      <div class="font-medium text-slate-900">{{ token.symbol }}</div>
                      <div class="text-xs text-slate-500">{{ token.name }}</div>
                    </div>
                    <div class="text-sm text-slate-600">${{ token.current_price }}</div>
                  </button>
                </div>

                <!-- 已选择的代币 -->
                <div v-if="selectedToken" class="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <img :src="selectedToken.logo" :alt="selectedToken.symbol" class="w-10 h-10 rounded-full" />
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ selectedToken.symbol }}</div>
                    <div class="text-xs text-slate-500">{{ selectedToken.name }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-slate-900">${{ selectedToken.current_price }}</div>
                    <div class="text-xs text-slate-500">当前价格</div>
                  </div>
                </div>
                <p v-if="errors.token" class="mt-1 text-sm text-red-500">{{ errors.token }}</p>
              </div>
            </div>
          </Card>

          <!-- 信号执行策略 -->
          <SignalExecutionConfig
            v-model:config="signalExecutionConfig"
            class="mb-6"
          />


